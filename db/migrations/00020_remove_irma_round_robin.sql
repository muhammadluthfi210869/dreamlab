-- ============================================================
-- 00020_remove_irma_round_robin.sql
--
-- PENYESUAIAN ROUND ROBIN MENJADI 3 NOMOR (HAPUS NOMOR IRMA)
-- Roster resmi 3 BusDev aktif:
--   1. Annisa  (081952417051 / 6281952417051)
--   2. Diaz    (087776550657 / 6287776550657)
--   3. Jessica (087712232389 / 6287712232389)
--
-- Tindakan:
-- 1. Nonaktifkan Irma (085133188827) di tabel busdevs (is_active = false).
-- 2. Bersihkan penugasan sticky lama yang mengarah ke Irma di phone_assignments
--    dan visitor_assignments agar pelanggan/visitor tidak diarahkan ke Irma.
-- 3. Update fungsi assign_next_agent & assign_and_insert_lead dengan urutan
--    eksplisit 3 nomor: Annisa (1), Diaz (2), Jessica (3).
-- 4. Modulo rr_counter otomatis mengikuti COUNT(is_active = true) = 3.
-- ============================================================

BEGIN;

-- 1. Pastikan status keaktifan di tabel busdevs
UPDATE busdevs SET is_active = false WHERE phone = '085133188827' OR name ILIKE '%Irma%';
UPDATE busdevs SET is_active = true WHERE phone IN ('081952417051', '087776550657', '087712232389');
UPDATE busdevs SET is_active = false WHERE phone NOT IN ('081952417051', '087776550657', '087712232389');

-- 2. Bersihkan sticky assignment yang menunjuk ke Irma
DELETE FROM phone_assignments
 WHERE agent_id IN (
   SELECT id FROM busdevs WHERE phone = '085133188827' OR name ILIKE '%Irma%'
 );

DELETE FROM visitor_assignments
 WHERE agent_id IN (
   SELECT id FROM busdevs WHERE phone = '085133188827' OR name ILIKE '%Irma%'
 );

-- 3. Update assign_next_agent
CREATE OR REPLACE FUNCTION assign_next_agent(
  p_visitor_id TEXT,
  p_is_test    BOOLEAN DEFAULT FALSE,
  p_intent     TEXT    DEFAULT NULL,
  p_page_url   TEXT    DEFAULT NULL,
  p_phone      TEXT    DEFAULT NULL
)
RETURNS TABLE(agent_id BIGINT, agent_name TEXT, agent_phone TEXT, order_index INT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $FUNC$
DECLARE
  v_agent_id          BIGINT;
  v_name              TEXT;
  v_phone             TEXT;
  v_idx               INT;
  v_count             INT;
  v_sticky            RECORD;
  v_effective_test    BOOLEAN;
  v_norm_client_phone TEXT;
BEGIN
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

  -- 1. PHONE STICKY (O(1) Primary Key Lookup di phone_assignments)
  IF NOT v_effective_test AND p_phone IS NOT NULL AND p_phone <> '' THEN
    v_norm_client_phone := regexp_replace(p_phone, '[^0-9]', '', 'g');
    IF left(v_norm_client_phone, 1) = '0' THEN
      v_norm_client_phone := '62' || substring(v_norm_client_phone from 2);
    END IF;

    IF length(v_norm_client_phone) >= 9 THEN
      SELECT pa.agent_id INTO v_sticky
        FROM phone_assignments pa
       WHERE pa.phone_number = v_norm_client_phone
         AND pa.expires_at > NOW();

      IF NOT FOUND THEN
        SELECT b.id AS agent_id INTO v_sticky
          FROM leads l
          JOIN busdevs b ON b.name = l.assigned_to
         WHERE (l.hp = v_norm_client_phone OR l.wa_phone = v_norm_client_phone)
           AND b.is_active = true
           AND l.is_test IS NOT TRUE
         ORDER BY l.id DESC
         LIMIT 1;
      END IF;

      IF v_sticky.agent_id IS NOT NULL THEN
        SELECT b.id, b.name, b.phone INTO v_agent_id, v_name, v_phone
          FROM busdevs b
         WHERE b.id = v_sticky.agent_id AND b.is_active = true;

        IF FOUND THEN
          INSERT INTO phone_assignments (phone_number, agent_id, created_at, last_seen, expires_at)
          VALUES (v_norm_client_phone, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '180 days')
          ON CONFLICT (phone_number)
          DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                        last_seen = NOW(),
                        expires_at = NOW() + INTERVAL '180 days';

          IF p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
            INSERT INTO visitor_assignments (visitor_id, agent_id, created_at, last_seen, expires_at)
            VALUES (p_visitor_id, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '30 days')
            ON CONFLICT (visitor_id)
            DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                          last_seen = NOW(),
                          expires_at = NOW() + INTERVAL '30 days';
          END IF;
        ELSE
          v_agent_id := NULL;
        END IF;
      END IF;
    END IF;
  END IF;

  -- 2. BROWSER STICKY
  IF v_agent_id IS NULL AND NOT v_effective_test AND p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
    SELECT va.agent_id INTO v_sticky
      FROM visitor_assignments va
     WHERE va.visitor_id = p_visitor_id
       AND va.expires_at > NOW();

    IF FOUND THEN
      SELECT b.id, b.name, b.phone INTO v_agent_id, v_name, v_phone
        FROM busdevs b
       WHERE b.id = v_sticky.agent_id AND b.is_active = true;

      IF FOUND THEN
        UPDATE visitor_assignments va SET last_seen = NOW(), expires_at = NOW() + INTERVAL '30 days'
         WHERE va.visitor_id = p_visitor_id;

        IF v_norm_client_phone IS NOT NULL AND length(v_norm_client_phone) >= 9 THEN
          INSERT INTO phone_assignments (phone_number, agent_id, created_at, last_seen, expires_at)
          VALUES (v_norm_client_phone, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '180 days')
          ON CONFLICT (phone_number)
          DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                        last_seen = NOW(),
                        expires_at = NOW() + INTERVAL '180 days';
        END IF;
      ELSE
        v_agent_id := NULL;
      END IF;
    END IF;
  END IF;

  -- 3. STRICT SEQUENTIAL MODULO ROTATION (3 BusDev: Annisa -> Diaz -> Jessica)
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
                     WHEN name ILIKE '%Annisa%' THEN 1
                     WHEN name ILIKE '%Diaz%' THEN 2
                     WHEN name ILIKE '%Jessica%' THEN 3
                     ELSE 99
                   END,
                   id ASC
               ) - 1 AS row_idx
          FROM busdevs
         WHERE is_active = true
      ) b
     WHERE b.row_idx = v_idx;

    IF NOT v_effective_test AND p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
      INSERT INTO visitor_assignments (visitor_id, agent_id, created_at, last_seen, expires_at)
      VALUES (p_visitor_id, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '30 days')
      ON CONFLICT (visitor_id)
      DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                    last_seen = NOW(),
                    expires_at = NOW() + INTERVAL '30 days';
    END IF;

    IF NOT v_effective_test AND v_norm_client_phone IS NOT NULL AND length(v_norm_client_phone) >= 9 THEN
      INSERT INTO phone_assignments (phone_number, agent_id, created_at, last_seen, expires_at)
      VALUES (v_norm_client_phone, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '180 days')
      ON CONFLICT (phone_number)
      DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                    last_seen = NOW(),
                    expires_at = NOW() + INTERVAL '180 days';
    END IF;
  END IF;

  SELECT idx - 1 INTO v_idx
    FROM (
      SELECT b.id,
             ROW_NUMBER() OVER (
               ORDER BY
                 CASE
                   WHEN b.name ILIKE '%Annisa%' THEN 1
                   WHEN b.name ILIKE '%Diaz%' THEN 2
                   WHEN b.name ILIKE '%Jessica%' THEN 3
                   ELSE 99
                 END,
                 b.id ASC
             ) AS idx
        FROM busdevs b
       WHERE b.is_active = true
    ) ranked
   WHERE id = v_agent_id;

  RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx;
END;
$FUNC$;

-- 4. Update assign_and_insert_lead
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
  v_agent_id          BIGINT;
  v_name              TEXT;
  v_phone             TEXT;
  v_idx               INT;
  v_count             INT;
  v_sticky            RECORD;
  v_code              TEXT;
  v_existing          TEXT;
  v_norm_phone        TEXT;
  v_effective_test    BOOLEAN;
  v_norm_client_phone TEXT;
BEGIN
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

  -- 1. PHONE STICKY
  IF NOT v_effective_test AND p_hp IS NOT NULL AND p_hp <> '' THEN
    v_norm_client_phone := regexp_replace(p_hp, '[^0-9]', '', 'g');
    IF left(v_norm_client_phone, 1) = '0' THEN
      v_norm_client_phone := '62' || substring(v_norm_client_phone from 2);
    END IF;

    IF length(v_norm_client_phone) >= 9 THEN
      SELECT pa.agent_id INTO v_sticky
        FROM phone_assignments pa
       WHERE pa.phone_number = v_norm_client_phone
         AND pa.expires_at > NOW();

      IF NOT FOUND THEN
        SELECT b.id AS agent_id INTO v_sticky
          FROM leads l
          JOIN busdevs b ON b.name = l.assigned_to
         WHERE (l.hp = v_norm_client_phone OR l.wa_phone = v_norm_client_phone)
           AND b.is_active = true
           AND l.is_test IS NOT TRUE
         ORDER BY l.id DESC
         LIMIT 1;
      END IF;

      IF v_sticky.agent_id IS NOT NULL THEN
        SELECT b.id, b.name, b.phone INTO v_agent_id, v_name, v_phone
          FROM busdevs b
         WHERE b.id = v_sticky.agent_id AND b.is_active = true;

        IF FOUND THEN
          INSERT INTO phone_assignments (phone_number, agent_id, created_at, last_seen, expires_at)
          VALUES (v_norm_client_phone, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '180 days')
          ON CONFLICT (phone_number)
          DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                        last_seen = NOW(),
                        expires_at = NOW() + INTERVAL '180 days';

          IF p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
            INSERT INTO visitor_assignments (visitor_id, agent_id, created_at, last_seen, expires_at)
            VALUES (p_visitor_id, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '30 days')
            ON CONFLICT (visitor_id)
            DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                          last_seen = NOW(),
                          expires_at = NOW() + INTERVAL '30 days';
          END IF;
        ELSE
          v_agent_id := NULL;
        END IF;
      END IF;
    END IF;
  END IF;

  -- 2. BROWSER STICKY
  IF v_agent_id IS NULL AND NOT v_effective_test AND p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
    SELECT va.agent_id INTO v_sticky
      FROM visitor_assignments va
     WHERE va.visitor_id = p_visitor_id
       AND va.expires_at > NOW();

    IF FOUND THEN
      SELECT b.id, b.name, b.phone INTO v_agent_id, v_name, v_phone
        FROM busdevs b
       WHERE b.id = v_sticky.agent_id AND b.is_active = true;

      IF FOUND THEN
        UPDATE visitor_assignments va SET last_seen = NOW(), expires_at = NOW() + INTERVAL '30 days'
         WHERE va.visitor_id = p_visitor_id;

        IF v_norm_client_phone IS NOT NULL AND length(v_norm_client_phone) >= 9 THEN
          INSERT INTO phone_assignments (phone_number, agent_id, created_at, last_seen, expires_at)
          VALUES (v_norm_client_phone, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '180 days')
          ON CONFLICT (phone_number)
          DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                        last_seen = NOW(),
                        expires_at = NOW() + INTERVAL '180 days';
        END IF;
      ELSE
        v_agent_id := NULL;
      END IF;
    END IF;
  END IF;

  -- 3. STRICT SEQUENTIAL MODULO ROTATION (3 BusDev: Annisa -> Diaz -> Jessica)
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
                     WHEN name ILIKE '%Annisa%' THEN 1
                     WHEN name ILIKE '%Diaz%' THEN 2
                     WHEN name ILIKE '%Jessica%' THEN 3
                     ELSE 99
                   END,
                   id ASC
               ) - 1 AS row_idx
          FROM busdevs
         WHERE is_active = true
      ) b
     WHERE b.row_idx = v_idx;

    IF NOT v_effective_test AND p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
      INSERT INTO visitor_assignments (visitor_id, agent_id, created_at, last_seen, expires_at)
      VALUES (p_visitor_id, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '30 days')
      ON CONFLICT (visitor_id)
      DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                    last_seen = NOW(),
                    expires_at = NOW() + INTERVAL '30 days';
    END IF;

    IF NOT v_effective_test AND v_norm_client_phone IS NOT NULL AND length(v_norm_client_phone) >= 9 THEN
      INSERT INTO phone_assignments (phone_number, agent_id, created_at, last_seen, expires_at)
      VALUES (v_norm_client_phone, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '180 days')
      ON CONFLICT (phone_number)
      DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                    last_seen = NOW(),
                    expires_at = NOW() + INTERVAL '180 days';
    END IF;
  ELSE
    SELECT idx - 1 INTO v_idx
      FROM (
        SELECT b.id,
               ROW_NUMBER() OVER (
                 ORDER BY
                   CASE
                     WHEN b.name ILIKE '%Annisa%' THEN 1
                     WHEN b.name ILIKE '%Diaz%' THEN 2
                     WHEN b.name ILIKE '%Jessica%' THEN 3
                     ELSE 99
                   END,
                   b.id ASC
               ) AS idx
          FROM busdevs b
         WHERE b.is_active = true
      ) ranked
     WHERE id = v_agent_id;
  END IF;

  v_norm_phone := regexp_replace(coalesce(v_phone, ''), '[^0-9]', '', 'g');
  IF left(v_norm_phone, 1) = '0' THEN
    v_norm_phone := '62' || substring(v_norm_phone from 2);
  END IF;

  -- 4. DEDUPLIKASI 24 JAM
  IF NOT v_effective_test THEN
    SELECT l.tracking_code INTO v_existing
      FROM leads l
     WHERE (
       (p_visitor_id IS NOT NULL AND p_visitor_id <> '' AND l.visitor_id = p_visitor_id)
       OR
       (v_norm_client_phone IS NOT NULL AND (l.hp = v_norm_client_phone OR l.wa_phone = v_norm_client_phone))
     )
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
     p_session_id, p_intent, p_visitor_id, 1, p_nama, p_perusahaan, COALESCE(v_norm_client_phone, p_hp), p_produk, v_effective_test);

  RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx, v_code,
                      'https://wa.me/' || v_norm_phone;
END;
$FUNC$;

COMMIT;
