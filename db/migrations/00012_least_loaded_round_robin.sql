-- ============================================================
-- 00012_least_loaded_round_robin.sql
--
-- Transform round-robin into a Self-Balancing Dynamic Least-Loaded
-- Allocation Engine to permanently eliminate lead distribution skew:
--
-- 1. Dynamic Balancing: New visitors are assigned to the active CS
--    with the fewest leads in the last 7 days (ORDER BY recent_leads ASC, id ASC).
--    This auto-compensates for repeat buyers or engagement variance.
-- 2. 24-Hour Deduplication: Repeat clicks by the same visitor within 24h
--    increment visit_count on the existing lead instead of generating new rows.
-- 3. Test Isolation: Testing mode (p_is_test = TRUE or test intent)
--    rotates cleanly across all active agents without creating production leads
--    or locking sticky cookies.
-- 4. Past Data Cleanup: Mark known test visitor leads as is_test = TRUE.
-- ============================================================

BEGIN;

-- 1. Tambah kolom is_test ke tabel leads
ALTER TABLE leads ADD COLUMN IF NOT EXISTS is_test BOOLEAN DEFAULT FALSE;

-- Index untuk mempercepat kalkulasi beban CS
CREATE INDEX IF NOT EXISTS idx_leads_load_calc 
  ON leads (assigned_phone, created_at) 
  WHERE is_test IS NOT TRUE;

-- 2. Tandai lead hasil testing internal yang lalu agar kuota awal CS bersih
UPDATE leads 
   SET is_test = TRUE 
 WHERE visitor_id IN ('065276b0-9567-42a3-9340-633c6ed111d4', 'c58db271-acca-41e8-ac4b-20ab7adaf77f')
    OR intent ILIKE '%test%' 
    OR page_url ILIKE '%test%'
    OR page_url ILIKE '%localhost%';

-- 3. Fungsi assign_next_agent() dengan Dynamic Least-Loaded
CREATE OR REPLACE FUNCTION assign_next_agent(
  p_visitor_id TEXT,
  p_is_test    BOOLEAN DEFAULT FALSE
)
RETURNS TABLE(agent_id BIGINT, agent_name TEXT, agent_phone TEXT, order_index INT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_agent_id  BIGINT;
  v_name      TEXT;
  v_phone     TEXT;
  v_idx       INT;
  v_count     INT;
  v_sticky    RECORD;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(coalesce(p_visitor_id, '')));

  SELECT COUNT(*) INTO v_count FROM busdevs b WHERE b.is_active = true;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'No active busdevs found';
  END IF;

  -- MODE TEST: rotasi berurutan langsung tanpa sticky & tanpa mengubah beban produksi
  IF p_is_test IS TRUE OR p_visitor_id ILIKE 'test_%' THEN
    UPDATE rr_counter
       SET current_index = (current_index + 1) % v_count,
           updated_at = NOW()
     WHERE id = 1
     RETURNING current_index INTO v_idx;

    SELECT b.id, b.name, b.phone INTO v_agent_id, v_name, v_phone
      FROM busdevs b
     WHERE b.is_active = true
     ORDER BY b.id
     LIMIT 1 OFFSET v_idx;

    RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx;
    RETURN;
  END IF;

  -- 1. STICKY: Cek apakah visitor sudah terhubung dengan CS aktif
  IF p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
    SELECT va.agent_id INTO v_sticky
      FROM visitor_assignments va
     WHERE va.visitor_id = p_visitor_id
       AND va.expires_at > NOW();

    IF FOUND THEN
      SELECT b.id, b.name, b.phone INTO v_agent_id, v_name, v_phone
        FROM busdevs b
       WHERE b.id = v_sticky.agent_id AND b.is_active = true;

      IF FOUND THEN
        UPDATE visitor_assignments va SET last_seen = NOW()
         WHERE va.visitor_id = p_visitor_id;

        SELECT idx - 1 INTO v_idx
          FROM (
            SELECT b.id, ROW_NUMBER() OVER (ORDER BY b.id) AS idx
              FROM busdevs b
             WHERE b.is_active = true
          ) ranked
         WHERE id = v_agent_id;

        RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx;
        RETURN;
      END IF;
    END IF;
  END IF;

  -- 2. DYNAMIC LEAST-LOADED: Pilih CS aktif dengan lead terendah dalam 7 hari terakhir
  SELECT b.id, b.name, b.phone INTO v_agent_id, v_name, v_phone
    FROM busdevs b
    LEFT JOIN (
      SELECT assigned_phone, COUNT(*) AS recent_leads
        FROM leads
       WHERE created_at > NOW() - INTERVAL '7 days'
         AND is_test IS NOT TRUE
       GROUP BY assigned_phone
    ) stats ON (
      stats.assigned_phone = regexp_replace(b.phone, '[^0-9]', '', 'g')
      OR stats.assigned_phone = '62' || substring(regexp_replace(b.phone, '[^0-9]', '', 'g') from 2)
      OR stats.assigned_phone = b.phone
    )
   WHERE b.is_active = true
   ORDER BY COALESCE(stats.recent_leads, 0) ASC, b.id ASC
   LIMIT 1;

  SELECT idx - 1 INTO v_idx
    FROM (
      SELECT b.id, ROW_NUMBER() OVER (ORDER BY b.id) AS idx
        FROM busdevs b
       WHERE b.is_active = true
    ) ranked
   WHERE id = v_agent_id;

  -- Simpan sticky assignment untuk visitor baru
  IF p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
    INSERT INTO visitor_assignments (visitor_id, agent_id, created_at, last_seen, expires_at)
    VALUES (p_visitor_id, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '30 days')
    ON CONFLICT (visitor_id)
    DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                  last_seen = NOW(),
                  expires_at = NOW() + INTERVAL '30 days';
  END IF;

  RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx;
END;
$$;


-- 4. Fungsi assign_and_insert_lead() dengan Dynamic Balancing + Dedup 24 Jam
CREATE OR REPLACE FUNCTION assign_and_insert_lead(
  p_visitor_id   TEXT,
  p_intent       TEXT,
  p_source       TEXT,
  p_page_url     TEXT,
  p_page_title   TEXT,
  p_referrer     TEXT,
  p_utm_source   TEXT,
  p_utm_medium   TEXT,
  p_utm_campaign TEXT,
  p_device_type  TEXT,
  p_browser      TEXT,
  p_session_id   TEXT,
  p_nama         TEXT,
  p_perusahaan   TEXT,
  p_hp           TEXT,
  p_produk       TEXT,
  p_is_test      BOOLEAN DEFAULT FALSE
)
RETURNS TABLE(
  agent_id      BIGINT,
  agent_name    TEXT,
  agent_phone   TEXT,
  order_index   INT,
  tracking_code TEXT,
  wa_url        TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_agent_id    BIGINT;
  v_name        TEXT;
  v_phone       TEXT;
  v_idx         INT;
  v_count       INT;
  v_sticky      RECORD;
  v_code        TEXT;
  v_existing    TEXT;
  v_norm_phone  TEXT;
  v_effective_test BOOLEAN;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(coalesce(p_visitor_id, '')));

  SELECT COUNT(*) INTO v_count FROM busdevs b WHERE b.is_active = true;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'No active busdevs found';
  END IF;

  v_effective_test := (
    p_is_test IS TRUE 
    OR coalesce(p_intent, '') ILIKE '%test%' 
    OR coalesce(p_page_url, '') ILIKE '%test%'
    OR coalesce(p_visitor_id, '') ILIKE 'test_%'
  );

  -- ============================================================
  -- JALUR TESTING
  -- ============================================================
  IF v_effective_test THEN
    UPDATE rr_counter
       SET current_index = (current_index + 1) % v_count,
           updated_at = NOW()
     WHERE id = 1
     RETURNING current_index INTO v_idx;

    SELECT b.id, b.name, b.phone INTO v_agent_id, v_name, v_phone
      FROM busdevs b
     WHERE b.is_active = true
     ORDER BY b.id
     LIMIT 1 OFFSET v_idx;

    v_norm_phone := regexp_replace(coalesce(v_phone, ''), '[^0-9]', '', 'g');
    IF left(v_norm_phone, 1) = '0' THEN
      v_norm_phone := '62' || substring(v_norm_phone from 2);
    END IF;

    v_code := 'DL-TEST-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(md5(random()::text), 1, 4));

    -- Simpan dengan is_test = TRUE agar observasi log tetap ada, tapi tidak masuk perhitungan kuota
    INSERT INTO leads
      (tracking_code, assigned_to, assigned_phone, source, page_url, page_title,
       referrer, utm_source, utm_medium, utm_campaign, device_type, browser,
       session_id, intent, visitor_id, visit_count, nama, perusahaan, hp, produk, is_test)
    VALUES
      (v_code, v_name, v_norm_phone, p_source, p_page_url, p_page_title,
       p_referrer, p_utm_source, p_utm_medium, p_utm_campaign, p_device_type, p_browser,
       p_session_id, p_intent, p_visitor_id, 1, p_nama, p_perusahaan, p_hp, p_produk, TRUE);

    RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx, v_code,
                        'https://wa.me/' || v_norm_phone;
    RETURN;
  END IF;

  -- ============================================================
  -- JALUR PRODUKSI
  -- ============================================================

  -- 1. STICKY: Cek apakah visitor sudah terhubung dengan CS aktif
  IF p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
    SELECT va.agent_id INTO v_sticky
      FROM visitor_assignments va
     WHERE va.visitor_id = p_visitor_id
       AND va.expires_at > NOW();

    IF FOUND THEN
      SELECT b.id, b.name, b.phone INTO v_agent_id, v_name, v_phone
        FROM busdevs b
       WHERE b.id = v_sticky.agent_id AND b.is_active = true;

      IF FOUND THEN
        UPDATE visitor_assignments va SET last_seen = NOW()
         WHERE va.visitor_id = p_visitor_id;
      ELSE
        v_agent_id := NULL;
      END IF;
    END IF;
  END IF;

  -- 2. DYNAMIC LEAST-LOADED: Jika belum sticky, pilih CS dengan lead paling sedikit (7 hari)
  IF v_agent_id IS NULL THEN
    SELECT b.id, b.name, b.phone INTO v_agent_id, v_name, v_phone
      FROM busdevs b
      LEFT JOIN (
        SELECT assigned_phone, COUNT(*) AS recent_leads
          FROM leads
         WHERE created_at > NOW() - INTERVAL '7 days'
           AND is_test IS NOT TRUE
         GROUP BY assigned_phone
      ) stats ON (
        stats.assigned_phone = regexp_replace(b.phone, '[^0-9]', '', 'g')
        OR stats.assigned_phone = '62' || substring(regexp_replace(b.phone, '[^0-9]', '', 'g') from 2)
        OR stats.assigned_phone = b.phone
      )
     WHERE b.is_active = true
     ORDER BY COALESCE(stats.recent_leads, 0) ASC, b.id ASC
     LIMIT 1;

    -- Simpan sticky untuk visitor baru
    IF p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
      INSERT INTO visitor_assignments (visitor_id, agent_id, created_at, last_seen, expires_at)
      VALUES (p_visitor_id, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '30 days')
      ON CONFLICT (visitor_id)
      DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                    last_seen = NOW(),
                    expires_at = NOW() + INTERVAL '30 days';
    END IF;
  END IF;

  SELECT idx - 1 INTO v_idx
    FROM (
      SELECT b.id, ROW_NUMBER() OVER (ORDER BY b.id) AS idx
        FROM busdevs b
       WHERE b.is_active = true
    ) ranked
   WHERE id = v_agent_id;

  -- 3. Normalisasi nomor
  v_norm_phone := regexp_replace(coalesce(v_phone, ''), '[^0-9]', '', 'g');
  IF left(v_norm_phone, 1) = '0' THEN
    v_norm_phone := '62' || substring(v_norm_phone from 2);
  END IF;

  -- 4. DEDUPLIKASI 24 JAM: Visitor yang sama dalam 24 jam cukup increment visit_count
  IF p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
    SELECT l.tracking_code INTO v_existing
      FROM leads l
     WHERE l.visitor_id = p_visitor_id
       AND l.created_at > NOW() - INTERVAL '24 hours'
       AND l.is_test IS NOT TRUE
     ORDER BY l.id DESC
     LIMIT 1;

    IF v_existing IS NOT NULL THEN
      UPDATE leads SET visit_count = visit_count + 1 WHERE leads.tracking_code = v_existing;
      RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx, v_existing,
                          'https://wa.me/' || v_norm_phone;
      RETURN;
    END IF;
  END IF;

  -- 5. Lead Baru (Non-Duplikat)
  v_code := 'DL-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(md5(random()::text), 1, 6));

  INSERT INTO leads
    (tracking_code, assigned_to, assigned_phone, source, page_url, page_title,
     referrer, utm_source, utm_medium, utm_campaign, device_type, browser,
     session_id, intent, visitor_id, visit_count, nama, perusahaan, hp, produk, is_test)
  VALUES
    (v_code, v_name, v_norm_phone, p_source, p_page_url, p_page_title,
     p_referrer, p_utm_source, p_utm_medium, p_utm_campaign, p_device_type, p_browser,
     p_session_id, p_intent, p_visitor_id, 1, p_nama, p_perusahaan, p_hp, p_produk, FALSE);

  RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx, v_code,
                      'https://wa.me/' || v_norm_phone;
END;
$$;

COMMIT;
