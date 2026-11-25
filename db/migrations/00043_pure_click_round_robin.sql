-- ============================================================
-- 00043_pure_click_round_robin.sql
--
-- Memastikan setiap klik tombol konsultasi dibagi RATA (1:1:1)
-- ke seluruh BusDev aktif (Annisa, Diaz, Jessica):
-- 1. Hapus penguncian browser 30 hari (visitor_assignments lookup)
--    pada assign_next_agent & assign_and_insert_lead agar klik tombol
--    dari browser mana pun selalu berputar ke sales berikutnya.
-- 2. Hapus dedup 24 jam berbasis visitor_id pada klik tombol
--    (idempotensi cukup berbasis p_session_id / eventId yang sama).
-- 3. Sinkronkan rr_state.last_sales_id & crm_lead_assignments
--    agar halaman /lead-monitor/round-robin selalu menampilkan
--    giliran berikutnya dan log penugasan secara real-time.
-- ============================================================

BEGIN;

-- Bersihkan visitor_assignments lama agar tidak ada browser yang terkunci ke 1 sales
TRUNCATE TABLE visitor_assignments;

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
  v_sticky_enabled    BOOLEAN := TRUE;
BEGIN
  PERFORM pg_advisory_xact_lock(987654321);

  SELECT COUNT(*) INTO v_count FROM busdevs b WHERE b.is_active = true;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'No active busdevs found';
  END IF;

  SELECT COALESCE(sticky_enabled, TRUE) INTO v_sticky_enabled FROM rr_state WHERE id = 1;

  v_effective_test := (
    p_is_test IS TRUE
    OR coalesce(p_intent, '')   ILIKE '%test%'
    OR coalesce(p_page_url, '') ILIKE '%test%'
    OR coalesce(p_visitor_id, '') ILIKE 'test_%'
  );

  -- 1. PHONE STICKY (Hanya jika sticky_enabled = true DAN ada nomor HP eksplisit)
  IF v_sticky_enabled AND NOT v_effective_test AND p_phone IS NOT NULL AND p_phone <> '' THEN
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
        ELSE
          v_agent_id := NULL;
        END IF;
      END IF;
    END IF;
  END IF;

  -- 2. STRICT SEQUENTIAL MODULO ROTATION (1:1:1 pada setiap klik tombol)
  IF v_agent_id IS NULL THEN
    UPDATE rr_counter
       SET current_index = (current_index + 1) % v_count,
           updated_at = NOW()
     WHERE id = 1
     RETURNING current_index INTO v_idx;

    SELECT b.id, b.name, b.phone INTO v_agent_id, v_name, v_phone
      FROM (
        SELECT b.id, b.name, b.phone,
               ROW_NUMBER() OVER (
                 ORDER BY
                   COALESCE((SELECT s.rr_order FROM sales s WHERE lower(s.name) = lower(b.name) AND s.deleted_at IS NULL LIMIT 1),
                     CASE
                       WHEN b.name ILIKE '%Annisa%' THEN 1
                       WHEN b.name ILIKE '%Diaz%' THEN 2
                       WHEN b.name ILIKE '%Jessica%' THEN 3
                       ELSE 99
                     END
                   ) ASC,
                   b.id ASC
               ) - 1 AS row_idx
          FROM busdevs b
         WHERE b.is_active = true
      ) b
     WHERE b.row_idx = v_idx;

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
                 COALESCE((SELECT s.rr_order FROM sales s WHERE lower(s.name) = lower(b.name) AND s.deleted_at IS NULL LIMIT 1),
                   CASE
                     WHEN b.name ILIKE '%Annisa%' THEN 1
                     WHEN b.name ILIKE '%Diaz%' THEN 2
                     WHEN b.name ILIKE '%Jessica%' THEN 3
                     ELSE 99
                   END
                 ) ASC,
                 b.id ASC
             ) AS idx
        FROM busdevs b
       WHERE b.is_active = true
    ) ranked
   WHERE id = v_agent_id;

  RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx;
END;
$FUNC$;

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
  v_existing_row      RECORD;
  v_norm_phone        TEXT;
  v_effective_test    BOOLEAN;
  v_norm_client_phone TEXT;
  v_sticky_enabled    BOOLEAN := TRUE;
  v_method            TEXT := 'round_robin';
  v_sales_table_id    INT;
  v_new_lead_id       BIGINT;
BEGIN
  PERFORM pg_advisory_xact_lock(987654321);

  SELECT COUNT(*) INTO v_count FROM busdevs b WHERE b.is_active = true;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'No active busdevs found';
  END IF;

  SELECT COALESCE(sticky_enabled, TRUE) INTO v_sticky_enabled FROM rr_state WHERE id = 1;

  v_effective_test := (
    p_is_test IS TRUE
    OR coalesce(p_intent, '')   ILIKE '%test%'
    OR coalesce(p_page_url, '') ILIKE '%test%'
    OR coalesce(p_visitor_id, '') ILIKE 'test_%'
  );

  -- 0. IDEMPOTENSI REQUEST (Hanya jika p_session_id / eventId yang SAMA persis dikirim ulang karena refresh tab)
  IF p_session_id IS NOT NULL AND p_session_id <> '' THEN
    SELECT l.tracking_code, l.assigned_to, l.assigned_phone, b.id AS b_id
      INTO v_existing_row
      FROM leads l
      LEFT JOIN busdevs b ON lower(b.name) = lower(l.assigned_to)
     WHERE l.session_id = p_session_id
       AND l.created_at > NOW() - INTERVAL '1 hour'
     ORDER BY l.id DESC
     LIMIT 1;

    IF v_existing_row.tracking_code IS NOT NULL THEN
      v_norm_phone := regexp_replace(coalesce(v_existing_row.assigned_phone, ''), '[^0-9]', '', 'g');
      IF left(v_norm_phone, 1) = '0' THEN
        v_norm_phone := '62' || substring(v_norm_phone from 2);
      END IF;
      RETURN QUERY SELECT COALESCE(v_existing_row.b_id, 1::BIGINT),
                          v_existing_row.assigned_to,
                          v_existing_row.assigned_phone,
                          0,
                          v_existing_row.tracking_code,
                          'https://wa.me/' || v_norm_phone;
      RETURN;
    END IF;
  END IF;

  -- 1. PHONE STICKY (Hanya jika sticky_enabled = true DAN berasal dari submit form kualifikasi yang menyertakan p_nama, BUKAN klik tombol biasa)
  IF v_sticky_enabled AND NOT v_effective_test AND p_nama IS NOT NULL AND p_nama <> '' AND p_hp IS NOT NULL AND p_hp <> '' THEN
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
          v_method := 'sticky';
          INSERT INTO phone_assignments (phone_number, agent_id, created_at, last_seen, expires_at)
          VALUES (v_norm_client_phone, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '180 days')
          ON CONFLICT (phone_number)
          DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                        last_seen = NOW(),
                        expires_at = NOW() + INTERVAL '180 days';
        ELSE
          v_agent_id := NULL;
        END IF;
      END IF;
    END IF;
  END IF;

  -- 2. STRICT SEQUENTIAL MODULO ROTATION (1:1:1 pada setiap klik tombol)
  IF v_agent_id IS NULL THEN
    UPDATE rr_counter
       SET current_index = (current_index + 1) % v_count,
           updated_at = NOW()
     WHERE id = 1
     RETURNING current_index INTO v_idx;

    SELECT b.id, b.name, b.phone INTO v_agent_id, v_name, v_phone
      FROM (
        SELECT b.id, b.name, b.phone,
               ROW_NUMBER() OVER (
                 ORDER BY
                   COALESCE((SELECT s.rr_order FROM sales s WHERE lower(s.name) = lower(b.name) AND s.deleted_at IS NULL LIMIT 1),
                     CASE
                       WHEN b.name ILIKE '%Annisa%' THEN 1
                       WHEN b.name ILIKE '%Diaz%' THEN 2
                       WHEN b.name ILIKE '%Jessica%' THEN 3
                       ELSE 99
                     END
                   ) ASC,
                   b.id ASC
               ) - 1 AS row_idx
          FROM busdevs b
         WHERE b.is_active = true
      ) b
     WHERE b.row_idx = v_idx;

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
                   COALESCE((SELECT s.rr_order FROM sales s WHERE lower(s.name) = lower(b.name) AND s.deleted_at IS NULL LIMIT 1),
                     CASE
                       WHEN b.name ILIKE '%Annisa%' THEN 1
                       WHEN b.name ILIKE '%Diaz%' THEN 2
                       WHEN b.name ILIKE '%Jessica%' THEN 3
                       ELSE 99
                     END
                   ) ASC,
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

  -- 3. Insert Lead Baru
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
     p_session_id, p_intent, p_visitor_id, 1, p_nama, p_perusahaan, COALESCE(v_norm_client_phone, p_hp), p_produk, v_effective_test)
  RETURNING id INTO v_new_lead_id;

  -- 4. Sinkronkan rr_state & crm_lead_assignments untuk dashboard /lead-monitor/round-robin
  IF NOT v_effective_test THEN
    SELECT s.id INTO v_sales_table_id
      FROM sales s
     WHERE lower(s.name) = lower(v_name) AND s.deleted_at IS NULL
     LIMIT 1;

    IF v_sales_table_id IS NOT NULL THEN
      IF v_method = 'round_robin' THEN
        UPDATE rr_state SET last_sales_id = v_sales_table_id, updated_at = NOW() WHERE id = 1;
      END IF;

      INSERT INTO crm_lead_assignments
        (lead_id, sales_id, sales_name, tracking_code, lead_name, customer_phone, source, method, skipped_sales, assigned_at)
      VALUES
        (v_new_lead_id, v_sales_table_id, v_name, v_code, p_nama, COALESCE(v_norm_client_phone, p_hp), p_source, v_method, '{}', NOW());
    END IF;
  END IF;

  RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx, v_code,
                      'https://wa.me/' || v_norm_phone;
END;
$FUNC$;

COMMIT;
