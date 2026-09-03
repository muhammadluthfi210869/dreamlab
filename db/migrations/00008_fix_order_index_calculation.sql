-- ============================================================
-- 00008_fix_order_index_calculation.sql
--
-- Fix bug order_index di assign_next_agent() dan
-- assign_and_insert_lead() saat sticky visitor reassign
-- dari agent yang dinonaktifkan.
--
-- BUG: perhitungan lama pakai count(id <= agent_id) yang salah
-- saat ada GAGU (inactive/deleted agents) di antara sequence.
--
-- Contoh: agents id=[1,2,3,4(inactive),5,6]
--   Visitor sticky ke id=5 (Pak Bagir)
--   count(id<=5 AND active) = 5 (CS1,CS2,CS3,Bag(5)) + Irma(4 inactive)=SKIP
--   = 4 aktif dgn id<=5 → order_index=3 ✓ (seharusnya 3, CS1=0,CS2=1,CS3=2,Bagir=3)
--
--   Visitor sticky ke id=3 (CS3)
--   count(id<=3 AND active) = 3 (CS1,CS2,CS3) → order_index=2 ✓
--
--   Visitor sticky ke id=4 (Bu Irma, inactive)
--   count(id<=4 AND active) = 3 (CS1,CS2,CS3) → order_index=2 ← BENAR
--   (fallback ke rotasi, order_index tidak dipakai)
--
-- MASALAH NYATA: saat sticky agent dinonaktifkan DAN reassign ke agent
-- dengan id lebih besar dari gap, order_index yang dikembalikan = benar.
-- Tapi bug ini akan MANIFEST jika ada agent dengan id yang jauh lebih
-- besar dari count aktif (misal: id=[1,2,3,100,101] dengan 3,100,101 aktif).
-- Visitor sticky ke id=100 → count(id<=100 AND active) = 3 → order_index=2
-- Seharusnya: CS1=0, CS2=1, CS3=2, 100=3 → order_index=3
--
-- FIX: gunakan ROW_NUMBER() OVER (ORDER BY id) untuk dapat posisi
-- yang benar dalam sequence aktif, tanpa bergantung pada gap.
--
-- Idempotent: CREATE OR REPLACEFUNCTION aman dijalankan ulang.
-- ============================================================

BEGIN;

-- Fix 1: assign_next_agent() ----------------------------------------
CREATE OR REPLACE FUNCTION assign_next_agent(p_visitor_id TEXT)
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
        -- FIX: gunakan ROW_NUMBER() agar posisi benar meski ada gap ID
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

  SELECT COUNT(*) INTO v_count FROM busdevs b WHERE b.is_active = true;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'No active busdevs found';
  END IF;

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

-- Fix 2: assign_and_insert_lead() -----------------------------------
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
  p_produk       TEXT
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
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(coalesce(p_visitor_id, '')));

  -- 1. STICKY
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
        -- FIX: gunakan ROW_NUMBER() agar posisi benar meski ada gap ID
        SELECT idx - 1 INTO v_idx
          FROM (
            SELECT b.id, ROW_NUMBER() OVER (ORDER BY b.id) AS idx
              FROM busdevs b
             WHERE b.is_active = true
          ) ranked
         WHERE id = v_agent_id;
      ELSE
        v_agent_id := NULL;
      END IF;
    END IF;
  END IF;

  -- 2. ROTASI
  IF v_agent_id IS NULL THEN
    SELECT COUNT(*) INTO v_count FROM busdevs b WHERE b.is_active = true;
    IF v_count = 0 THEN
      RAISE EXCEPTION 'No active busdevs found';
    END IF;

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

    IF p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
      INSERT INTO visitor_assignments (visitor_id, agent_id, created_at, last_seen, expires_at)
      VALUES (p_visitor_id, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '30 days')
      ON CONFLICT (visitor_id)
      DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                    last_seen = NOW(),
                    expires_at = NOW() + INTERVAL '30 days';
    END IF;
  END IF;

  -- 3. Normalisasi nomor
  v_norm_phone := regexp_replace(coalesce(v_phone, ''), '[\s\-\(\)\+]', '', 'g');
  IF left(v_norm_phone, 1) = '0' THEN
    v_norm_phone := '62' || substring(v_norm_phone from 2);
  END IF;

  -- 4. DEDUP
  IF p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
    SELECT l.tracking_code INTO v_existing
      FROM leads l
     WHERE l.visitor_id = p_visitor_id
       AND l.created_at > NOW() - INTERVAL '2 minutes'
       AND (
         (coalesce(p_intent, '') <> '' AND coalesce(l.intent, '') = p_intent)
         OR
         (coalesce(p_page_url, '') <> '' AND coalesce(l.page_url, '') = p_page_url)
       )
     ORDER BY l.id DESC
     LIMIT 1;

    IF v_existing IS NOT NULL THEN
      UPDATE leads SET visit_count = visit_count + 1 WHERE leads.tracking_code = v_existing;
      RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx, v_existing,
                          'https://wa.me/' || v_norm_phone;
      RETURN;
    END IF;
  END IF;

  -- 5. Lead BARU
  v_code := 'DL-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(md5(random()::text), 1, 6));

  INSERT INTO leads
    (tracking_code, assigned_to, assigned_phone, source, page_url, page_title,
     referrer, utm_source, utm_medium, utm_campaign, device_type, browser,
     session_id, intent, visitor_id, visit_count, nama, perusahaan, hp, produk)
  VALUES
    (v_code, v_name, v_norm_phone, p_source, p_page_url, p_page_title,
     p_referrer, p_utm_source, p_utm_medium, p_utm_campaign, p_device_type, p_browser,
     p_session_id, p_intent, p_visitor_id, 1, p_nama, p_perusahaan, p_hp, p_produk);

  RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx, v_code,
                      'https://wa.me/' || v_norm_phone;
END;
$$;

-- Verifikasi: pastikan kedua fungsi tetap bisa dipanggil
DO $$
BEGIN
  PERFORM assign_next_agent(NULL);
  PERFORM assign_and_insert_lead(
    NULL, NULL, 'direct', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
  );
  RAISE NOTICE 'Fungsi round-robin sehat setelah fix.';
END;
$$;

COMMIT;
