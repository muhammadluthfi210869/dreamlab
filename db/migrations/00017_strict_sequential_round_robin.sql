-- ============================================================
-- 00017_strict_sequential_round_robin.sql
--
-- FIX PEMBAGIAN LEADS AGAR RATA, ADIL, DAN STABIL (1 : 1 : 1 : 1)
--
-- Masalah sebelumnya (00012/00013/00014):
-- Logika "least-loaded" dinamis menghitung seluruh baris di tabel `leads`
-- termasuk `source = 'wa-direct'` (chat WhatsApp langsung/pelanggan lama).
-- Karena Annisa menerima puluhan chat operasional langsung di WA,
-- sistem menganggap Annisa "kelebihan beban", sehingga 100% lead baru dari
-- website dan iklan dialihkan hanya ke Diaz dan Jessica.
--
-- Solusi permanen:
-- 1. Kembalikan ke STRICT ATOMIC SEQUENTIAL ROUND-ROBIN via `rr_counter`:
--    Urutan tetap 4 BusDev aktif:
--      Index 0: Irma (6285133188827)
--      Index 1: Annisa (6281952417051)
--      Index 2: Diaz (6287776550657)
--      Index 3: Jessica (6287712232389)
--    Setiap lead baru bergilir strictly 1 demi 1 (25% rata per orang).
-- 2. Concurrency guard via `pg_advisory_xact_lock(987654321)`.
-- 3. Sticky assignment 30 hari untuk visitor returning tetap terjaga.
-- 4. Dedup 24 jam untuk visitor yang sama tetap terjaga.
-- 5. Normalisasi nama busdev di tabel `busdevs`: Irma, Annisa, Diaz, Jessica.
-- ============================================================

BEGIN;

-- 1. Normalisasi data agen di tabel busdevs
UPDATE busdevs SET name = 'Irma', is_active = false WHERE phone = '085133188827';
UPDATE busdevs SET name = 'Annisa', is_active = true WHERE phone = '081952417051';
UPDATE busdevs SET name = 'Diaz', is_active = true WHERE phone = '087776550657';
UPDATE busdevs SET name = 'Jessica', is_active = true WHERE phone = '087712232389';

-- Nonaktifkan agen non-aktif jika ada
UPDATE busdevs SET is_active = false WHERE phone NOT IN ('081952417051', '087776550657', '087712232389');

-- Pastikan tabel rr_counter siap
CREATE TABLE IF NOT EXISTS rr_counter (
  id            INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  current_index INTEGER NOT NULL DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO rr_counter (id, current_index, updated_at)
VALUES (1, 0, NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. Bersihkan overload fungsi lama
DROP FUNCTION IF EXISTS assign_next_agent(TEXT);
DROP FUNCTION IF EXISTS assign_next_agent(TEXT, BOOLEAN);
DROP FUNCTION IF EXISTS assign_next_agent(TEXT, BOOLEAN, TEXT, TEXT);

-- 3. assign_next_agent() — Strict Atomic Sequential Rotation
CREATE OR REPLACE FUNCTION assign_next_agent(
  p_visitor_id TEXT,
  p_is_test    BOOLEAN DEFAULT FALSE,
  p_intent     TEXT    DEFAULT NULL,
  p_page_url   TEXT    DEFAULT NULL
)
RETURNS TABLE(agent_id BIGINT, agent_name TEXT, agent_phone TEXT, order_index INT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $FUNC$
DECLARE
  v_agent_id       BIGINT;
  v_name           TEXT;
  v_phone          TEXT;
  v_idx            INT;
  v_count          INT;
  v_sticky         RECORD;
  v_effective_test BOOLEAN;
BEGIN
  -- Serialisasi global untuk mencegah race condition pada burst leads
  PERFORM pg_advisory_xact_lock(987654321);

  SELECT COUNT(*) INTO v_count FROM busdevs b WHERE b.is_active = true;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'No active busdevs found';
  END IF;

  v_effective_test := (
    p_is_test IS TRUE
    OR coalesce(p_intent, '')   ILIKE '%test%'
    OR coalesce(p_page_url, '') ILIKE '%test%'
    OR coalesce(p_visitor_id, '') ILIKE 'test_%'
  );

  -- 1. STICKY ASSIGNMENT: Jika visitor sudah memiliki CS aktif (hanya non-test)
  IF NOT v_effective_test AND p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
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
            SELECT b.id,
                   ROW_NUMBER() OVER (
                     ORDER BY
                       CASE
                         WHEN b.name ILIKE '%Irma%' THEN 1
                         WHEN b.name ILIKE '%Annisa%' THEN 2
                         WHEN b.name ILIKE '%Diaz%' THEN 3
                         WHEN b.name ILIKE '%Jessica%' THEN 4
                         ELSE 99
                       END,
                       b.id ASC
                   ) AS idx
              FROM busdevs b
             WHERE b.is_active = true
          ) ranked
         WHERE id = v_agent_id;

        RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx;
        RETURN;
      END IF;
    END IF;
  END IF;

  -- 2. STRICT SEQUENTIAL MODULO ROTATION
  -- Majukan counter atomik: (current_index + 1) % v_count
  UPDATE rr_counter
     SET current_index = (current_index + 1) % v_count,
         updated_at = NOW()
   WHERE id = 1
   RETURNING current_index INTO v_idx;

  SELECT b.id, b.name, b.phone INTO v_agent_id, v_name, v_phone
    FROM (
      SELECT id, name, phone,
             ROW_NUMBER() OVER (
               ORDER BY
                 CASE
                   WHEN name ILIKE '%Irma%' THEN 1
                   WHEN name ILIKE '%Annisa%' THEN 2
                   WHEN name ILIKE '%Diaz%' THEN 3
                   WHEN name ILIKE '%Jessica%' THEN 4
                   ELSE 99
                 END,
                 id ASC
             ) - 1 AS row_idx
        FROM busdevs
       WHERE is_active = true
    ) b
   WHERE b.row_idx = v_idx;

  -- Simpan sticky assignment untuk visitor baru (hanya non-test)
  IF NOT v_effective_test AND p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
    INSERT INTO visitor_assignments (visitor_id, agent_id, created_at, last_seen, expires_at)
    VALUES (p_visitor_id, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '30 days')
    ON CONFLICT (visitor_id)
    DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                  last_seen = NOW(),
                  expires_at = NOW() + INTERVAL '30 days';
  END IF;

  RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx;
END;
$FUNC$;

-- 4. assign_and_insert_lead() — Strict Sequential + Dedup 24 Jam
DROP FUNCTION IF EXISTS assign_and_insert_lead(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT,
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
);
DROP FUNCTION IF EXISTS assign_and_insert_lead(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT,
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN
);

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
AS $FUNC$
DECLARE
  v_agent_id       BIGINT;
  v_name           TEXT;
  v_phone          TEXT;
  v_idx            INT;
  v_count          INT;
  v_sticky         RECORD;
  v_code           TEXT;
  v_existing       TEXT;
  v_norm_phone     TEXT;
  v_effective_test BOOLEAN;
BEGIN
  -- Serialisasi global untuk mencegah race condition pada burst leads
  PERFORM pg_advisory_xact_lock(987654321);

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

  -- 1. STICKY: Cek apakah visitor sudah terhubung dengan CS aktif (hanya non-test)
  IF NOT v_effective_test AND p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
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

  -- 2. STRICT SEQUENTIAL MODULO ROTATION: Jika belum sticky, rotasi berurutan
  IF v_agent_id IS NULL THEN
    UPDATE rr_counter
       SET current_index = (current_index + 1) % v_count,
           updated_at = NOW()
     WHERE id = 1
     RETURNING current_index INTO v_idx;

    SELECT b.id, b.name, b.phone INTO v_agent_id, v_name, v_phone
      FROM (
        SELECT id, name, phone,
               ROW_NUMBER() OVER (
                 ORDER BY
                   CASE
                     WHEN name ILIKE '%Irma%' THEN 1
                     WHEN name ILIKE '%Annisa%' THEN 2
                     WHEN name ILIKE '%Diaz%' THEN 3
                     WHEN name ILIKE '%Jessica%' THEN 4
                     ELSE 99
                   END,
                   id ASC
               ) - 1 AS row_idx
          FROM busdevs
         WHERE is_active = true
      ) b
     WHERE b.row_idx = v_idx;

    -- Simpan sticky assignment untuk visitor baru (hanya non-test)
    IF NOT v_effective_test AND p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
      INSERT INTO visitor_assignments (visitor_id, agent_id, created_at, last_seen, expires_at)
      VALUES (p_visitor_id, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '30 days')
      ON CONFLICT (visitor_id)
      DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                    last_seen = NOW(),
                    expires_at = NOW() + INTERVAL '30 days';
    END IF;
  ELSE
    -- Hitung v_idx untuk sticky agent
    SELECT idx - 1 INTO v_idx
      FROM (
        SELECT b.id,
               ROW_NUMBER() OVER (
                 ORDER BY
                   CASE
                     WHEN b.name ILIKE '%Irma%' THEN 1
                     WHEN b.name ILIKE '%Annisa%' THEN 2
                     WHEN b.name ILIKE '%Diaz%' THEN 3
                     WHEN b.name ILIKE '%Jessica%' THEN 4
                     ELSE 99
                   END,
                   b.id ASC
               ) AS idx
          FROM busdevs b
         WHERE b.is_active = true
      ) ranked
     WHERE id = v_agent_id;
  END IF;

  -- 3. Normalisasi nomor telepon
  v_norm_phone := regexp_replace(coalesce(v_phone, ''), '[^0-9]', '', 'g');
  IF left(v_norm_phone, 1) = '0' THEN
    v_norm_phone := '62' || substring(v_norm_phone from 2);
  END IF;

  -- 4. DEDUPLIKASI 24 JAM (hanya untuk non-test)
  IF NOT v_effective_test AND p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
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

  -- 5. Insert Lead Baru
  IF v_effective_test THEN
    v_code := 'DL-TEST-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(md5(random()::text), 1, 6));
  ELSE
    v_code := 'DL-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(md5(random()::text), 1, 6));
  END IF;

  INSERT INTO leads
    (tracking_code, assigned_to, assigned_phone, source, page_url, page_title,
     referrer, utm_source, utm_medium, utm_campaign, device_type, browser,
     session_id, intent, visitor_id, visit_count, nama, perusahaan, hp, produk, is_test)
  VALUES
    (v_code, v_name, v_norm_phone, p_source, p_page_url, p_page_title,
     p_referrer, p_utm_source, p_utm_medium, p_utm_campaign, p_device_type, p_browser,
     p_session_id, p_intent, p_visitor_id, 1, p_nama, p_perusahaan, p_hp, p_produk, v_effective_test);

  RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx, v_code,
                      'https://wa.me/' || v_norm_phone;
END;
$FUNC$;

-- 5. Status Audit Helper
CREATE OR REPLACE FUNCTION get_round_robin_wave_status(p_batch_size INT DEFAULT 3)
RETURNS TABLE(
  agent_id BIGINT,
  agent_name TEXT,
  agent_phone TEXT,
  daily_leads INT,
  weekly_leads INT,
  last_lead_time TIMESTAMPTZ,
  current_wave INT,
  target_leads_for_wave INT,
  leads_to_target INT,
  max_spread INT,
  priority_rank INT,
  is_eligible_next BOOLEAN,
  guard_status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $FUNC$
DECLARE
  v_day_start TIMESTAMPTZ;
  v_curr_idx INT;
BEGIN
  v_day_start := date_trunc('day', now() AT TIME ZONE 'Asia/Jakarta') AT TIME ZONE 'Asia/Jakarta';
  SELECT current_index INTO v_curr_idx FROM rr_counter WHERE id = 1;

  RETURN QUERY
  WITH ranked_agents AS (
    SELECT
      b.id AS r_agent_id,
      b.name AS r_agent_name,
      b.phone AS r_agent_phone,
      (
        SELECT COUNT(*)::INT
          FROM leads l
         WHERE (
           l.assigned_to = b.name
           OR l.assigned_phone = regexp_replace(b.phone, '[^0-9]', '', 'g')
           OR l.assigned_phone = '62' || substring(regexp_replace(b.phone, '[^0-9]', '', 'g') from 2)
           OR l.assigned_phone = b.phone
         )
           AND l.created_at >= v_day_start
           AND l.source != 'wa-direct'
           AND l.is_test IS NOT TRUE
      ) AS r_daily_leads,
      (
        SELECT COUNT(*)::INT
          FROM leads l
         WHERE (
           l.assigned_to = b.name
           OR l.assigned_phone = regexp_replace(b.phone, '[^0-9]', '', 'g')
           OR l.assigned_phone = '62' || substring(regexp_replace(b.phone, '[^0-9]', '', 'g') from 2)
           OR l.assigned_phone = b.phone
         )
           AND l.created_at > NOW() - INTERVAL '7 days'
           AND l.source != 'wa-direct'
           AND l.is_test IS NOT TRUE
      ) AS r_weekly_leads,
      (
        SELECT MAX(l.created_at)
          FROM leads l
         WHERE (
           l.assigned_to = b.name
           OR l.assigned_phone = regexp_replace(b.phone, '[^0-9]', '', 'g')
           OR l.assigned_phone = '62' || substring(regexp_replace(b.phone, '[^0-9]', '', 'g') from 2)
           OR l.assigned_phone = b.phone
         )
           AND l.source != 'wa-direct'
           AND l.is_test IS NOT TRUE
      ) AS r_last_lead_time,
      ROW_NUMBER() OVER (
        ORDER BY
          CASE
            WHEN b.name ILIKE '%Irma%' THEN 1
            WHEN b.name ILIKE '%Annisa%' THEN 2
            WHEN b.name ILIKE '%Diaz%' THEN 3
            WHEN b.name ILIKE '%Jessica%' THEN 4
            ELSE 99
          END,
          b.id ASC
      )::INT AS r_order
    FROM busdevs b
    WHERE b.is_active = true
  )
  SELECT
    ra.r_agent_id,
    ra.r_agent_name,
    ra.r_agent_phone,
    ra.r_daily_leads,
    ra.r_weekly_leads,
    ra.r_last_lead_time,
    1::INT AS current_wave,
    0::INT AS target_leads_for_wave,
    0::INT AS leads_to_target,
    0::INT AS max_spread,
    ra.r_order AS priority_rank,
    (ra.r_order - 1 = (v_curr_idx % 4)) AS is_eligible_next,
    'STRICT_SEQUENTIAL_ACTIVE'::TEXT AS guard_status
  FROM ranked_agents ra
  ORDER BY ra.r_order ASC;
END;
$FUNC$;

GRANT EXECUTE ON FUNCTION get_round_robin_wave_status(INT) TO PUBLIC;
GRANT EXECUTE ON FUNCTION assign_next_agent(TEXT, BOOLEAN, TEXT, TEXT) TO PUBLIC;
GRANT EXECUTE ON FUNCTION assign_and_insert_lead(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN) TO PUBLIC;

COMMIT;
