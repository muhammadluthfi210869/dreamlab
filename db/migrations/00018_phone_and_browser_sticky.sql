-- ============================================================
-- 00018_phone_and_browser_sticky.sql
--
-- FITUR:
-- 1. PHONE STICKY ("Nomor yang sama tidak bisa ke BusDev lainnya"):
--    Setiap nomor HP (prospek/klien) yang pernah terhubung ke BusDev A
--    akan DIKUNCI ke BusDev A (TTL 180 hari / 6 bulan).
--    Jika nomor tersebut klik link lagi dari browser/iklan mana pun,
--    sistem SELALU mengembalikan BusDev yang sama, TANPA rotasi ke BusDev lain.
--
-- 2. BROWSER STICKY ("Minimalisir chat double untuk browser yang sama"):
--    Visitor yang sama di browser yang sama (visitor_id stabil)
--    selalu terhubung ke BusDev yang sama (TTL 30 hari).
--
-- 3. STRICT SEQUENTIAL MODULO ROTATION:
--    Hanya visitor BARU (browser baru DAN nomor baru) yang memajukan
--    counter rotasi modulo 4:
--      0: Irma
--      1: Annisa
--      2: Diaz
--      3: Jessica
--    Menjamin distribusi 100% rata (25% per agen) tanpa berat sebelah.
-- ============================================================

BEGIN;

-- 1. Buat tabel phone_assignments untuk penguncian nomor telepon prospek -> BusDev
CREATE TABLE IF NOT EXISTS phone_assignments (
  phone_number TEXT PRIMARY KEY,
  agent_id     BIGINT NOT NULL REFERENCES busdevs(id),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  last_seen    TIMESTAMPTZ DEFAULT NOW(),
  expires_at   TIMESTAMPTZ DEFAULT NOW() + INTERVAL '180 days'
);

CREATE INDEX IF NOT EXISTS idx_phone_assignments_agent ON phone_assignments(agent_id);
CREATE INDEX IF NOT EXISTS idx_phone_assignments_expires ON phone_assignments(expires_at);

-- 2. Backfill riwayat nomor dari tabel leads yang sudah ada ke phone_assignments
INSERT INTO phone_assignments (phone_number, agent_id, created_at, last_seen, expires_at)
SELECT
  clean_phone,
  agent_id,
  min_created,
  max_created,
  max_created + INTERVAL '180 days'
FROM (
  SELECT
    regexp_replace(COALESCE(NULLIF(l.hp, ''), l.wa_phone), '[^0-9]', '', 'g') AS clean_phone,
    b.id AS agent_id,
    MIN(l.created_at) AS min_created,
    MAX(l.created_at) AS max_created,
    ROW_NUMBER() OVER (
      PARTITION BY regexp_replace(COALESCE(NULLIF(l.hp, ''), l.wa_phone), '[^0-9]', '', 'g')
      ORDER BY MAX(l.created_at) DESC
    ) as rn
  FROM leads l
  JOIN busdevs b ON (
    b.name = l.assigned_to
    OR l.assigned_phone = regexp_replace(b.phone, '[^0-9]', '', 'g')
    OR l.assigned_phone = '62' || substring(regexp_replace(b.phone, '[^0-9]', '', 'g') from 2)
  )
  WHERE COALESCE(NULLIF(l.hp, ''), l.wa_phone) IS NOT NULL
    AND length(regexp_replace(COALESCE(NULLIF(l.hp, ''), l.wa_phone), '[^0-9]', '', 'g')) >= 9
    AND b.is_active = true
    AND l.is_test IS NOT TRUE
  GROUP BY clean_phone, b.id
) sub
WHERE rn = 1
ON CONFLICT (phone_number) DO NOTHING;

-- 3. Bersihkan overload fungsi lama
DROP FUNCTION IF EXISTS assign_next_agent(TEXT);
DROP FUNCTION IF EXISTS assign_next_agent(TEXT, BOOLEAN);
DROP FUNCTION IF EXISTS assign_next_agent(TEXT, BOOLEAN, TEXT, TEXT);
DROP FUNCTION IF EXISTS assign_next_agent(TEXT, BOOLEAN, TEXT, TEXT, TEXT);

-- 4. assign_next_agent() — Phone Sticky + Browser Sticky + Strict Rotation
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

  -- 1. PHONE STICKY: Cek apakah nomor telepon prospek sudah pernah terikat ke BusDev aktif
  -- "menggunakan nomor yang sama tidak bisa ke busdev lainnya"
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
          JOIN busdevs b ON (
            b.name = l.assigned_to
            OR l.assigned_phone = regexp_replace(b.phone, '[^0-9]', '', 'g')
            OR l.assigned_phone = '62' || substring(regexp_replace(b.phone, '[^0-9]', '', 'g') from 2)
          )
         WHERE (regexp_replace(coalesce(l.hp,''), '[^0-9]', '', 'g') = v_norm_client_phone
                OR regexp_replace(coalesce(l.wa_phone,''), '[^0-9]', '', 'g') = v_norm_client_phone)
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

  -- 2. BROWSER STICKY: Cek apakah visitor (browser) sudah memiliki CS aktif
  -- "minimalisir chat double untuk browser yang sama"
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

  -- 3. STRICT SEQUENTIAL MODULO ROTATION (Hanya untuk visitor & nomor baru)
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

    -- Simpan sticky browser untuk visitor baru (hanya non-test)
    IF NOT v_effective_test AND p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
      INSERT INTO visitor_assignments (visitor_id, agent_id, created_at, last_seen, expires_at)
      VALUES (p_visitor_id, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '30 days')
      ON CONFLICT (visitor_id)
      DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                    last_seen = NOW(),
                    expires_at = NOW() + INTERVAL '30 days';
    END IF;

    -- Simpan sticky nomor HP untuk prospek baru (hanya non-test)
    IF NOT v_effective_test AND v_norm_client_phone IS NOT NULL AND length(v_norm_client_phone) >= 9 THEN
      INSERT INTO phone_assignments (phone_number, agent_id, created_at, last_seen, expires_at)
      VALUES (v_norm_client_phone, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '180 days')
      ON CONFLICT (phone_number)
      DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                    last_seen = NOW(),
                    expires_at = NOW() + INTERVAL '180 days';
    END IF;
  END IF;

  -- Hitung order_index return
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
END;
$FUNC$;

-- 5. assign_and_insert_lead() — Phone Sticky + Browser Sticky + Dedup 24 Jam
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

  -- 1. PHONE STICKY: Cek apakah nomor telepon prospek sudah pernah terikat ke BusDev aktif
  -- "menggunakan nomor yang sama tidak bisa ke busdev lainnya"
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
          JOIN busdevs b ON (
            b.name = l.assigned_to
            OR l.assigned_phone = regexp_replace(b.phone, '[^0-9]', '', 'g')
            OR l.assigned_phone = '62' || substring(regexp_replace(b.phone, '[^0-9]', '', 'g') from 2)
          )
         WHERE (regexp_replace(coalesce(l.hp,''), '[^0-9]', '', 'g') = v_norm_client_phone
                OR regexp_replace(coalesce(l.wa_phone,''), '[^0-9]', '', 'g') = v_norm_client_phone)
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

  -- 2. BROWSER STICKY: Cek apakah browser (visitor_id) sudah terhubung dengan CS aktif
  -- "minimalisir chat double untuk browser yang sama"
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

  -- 3. STRICT SEQUENTIAL MODULO ROTATION: Jika belum sticky (visitor baru & nomor baru)
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

    -- Simpan sticky browser untuk visitor baru (hanya non-test)
    IF NOT v_effective_test AND p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
      INSERT INTO visitor_assignments (visitor_id, agent_id, created_at, last_seen, expires_at)
      VALUES (p_visitor_id, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '30 days')
      ON CONFLICT (visitor_id)
      DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                    last_seen = NOW(),
                    expires_at = NOW() + INTERVAL '30 days';
    END IF;

    -- Simpan sticky nomor HP untuk prospek baru (hanya non-test)
    IF NOT v_effective_test AND v_norm_client_phone IS NOT NULL AND length(v_norm_client_phone) >= 9 THEN
      INSERT INTO phone_assignments (phone_number, agent_id, created_at, last_seen, expires_at)
      VALUES (v_norm_client_phone, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '180 days')
      ON CONFLICT (phone_number)
      DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                    last_seen = NOW(),
                    expires_at = NOW() + INTERVAL '180 days';
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

  -- 4. Normalisasi nomor telepon sales (tujuan wa.me)
  v_norm_phone := regexp_replace(coalesce(v_phone, ''), '[^0-9]', '', 'g');
  IF left(v_norm_phone, 1) = '0' THEN
    v_norm_phone := '62' || substring(v_norm_phone from 2);
  END IF;

  -- 5. DEDUPLIKASI 24 JAM (hanya untuk non-test):
  -- Jika visitor yang sama atau nomor HP yang sama konversi lagi dalam 24 jam,
  -- perbarui visit_count dan kembalikan kode tracking yang sama
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

  -- 6. Insert Lead Baru
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

GRANT EXECUTE ON FUNCTION assign_next_agent(TEXT, BOOLEAN, TEXT, TEXT, TEXT) TO PUBLIC;
GRANT EXECUTE ON FUNCTION assign_and_insert_lead(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN) TO PUBLIC;
GRANT SELECT, INSERT, UPDATE ON TABLE phone_assignments TO PUBLIC;

COMMIT;
