-- ============================================================
-- 00005_assign_and_insert_lead.sql
-- Endpoint gabungan: assign CS (sticky/rotasi) + simpan lead (dedup)
-- dalam SATU panggilan DB (1 round-trip dari Vercel).
--
-- Tujuan: mempercepat flow round-robin. Sebelumnya butuh 2 API call
-- (GET /next lalu POST /track) + 3 query DB. Sekarang 1 API call
-- (POST /api/lead-capture/convert) + 1 query DB — fungsi ini melakukan
-- semuanya di sisi database tanpa bolak-balik jaringan antar statement.
--
-- Aman dijalankan ulang (CREATE OR REPLACE FUNCTION).
-- ============================================================

BEGIN;

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
  -- Serialisasi untuk visitor yang sama (cegah race double-click)
  PERFORM pg_advisory_xact_lock(hashtext(coalesce(p_visitor_id, '')));

  -- ── 1. STICKY: visitor sudah punya assignment aktif? ──
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
        -- posisi agent di urutan aktif (0-based)
        SELECT count(*)::int - 1 INTO v_idx
          FROM busdevs b
         WHERE b.is_active = true AND b.id <= v_agent_id;
      ELSE
        v_agent_id := NULL; -- CS sticky nonaktif -> lanjut rotasi
      END IF;
    END IF;
  END IF;

  -- ── 2. ROTASI: visitor baru / sticky tidak valid ──
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

    -- Simpan / perbarui assignment sticky
    IF p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
      INSERT INTO visitor_assignments (visitor_id, agent_id, created_at, last_seen, expires_at)
      VALUES (p_visitor_id, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '30 days')
      ON CONFLICT (visitor_id)
      DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                    last_seen = NOW(),
                    expires_at = NOW() + INTERVAL '30 days';
    END IF;
  END IF;

  -- ── 3. Normalisasi nomor utk wa.me (0xxx -> 628xx) ──
  v_norm_phone := regexp_replace(coalesce(v_phone, ''), '[\s\-\(\)\+]', '', 'g');
  IF left(v_norm_phone, 1) = '0' THEN
    v_norm_phone := '62' || substring(v_norm_phone from 2);
  END IF;

  -- ── 4. DEDUP: visitor sama, konversi lagi <=2 menit, intent/halaman sama ──
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
      -- Kualifikasi leads.tracking_code: kolom output fungsi (RETURNS TABLE
      -- ... tracking_code TEXT) ikut in-scope → tanpa kualifikasi jadi ambiguous.
      UPDATE leads SET visit_count = visit_count + 1 WHERE leads.tracking_code = v_existing;
      RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx, v_existing,
                          'https://wa.me/' || v_norm_phone;
      RETURN;
    END IF;
  END IF;

  -- ── 5. Lead BARU ──
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

GRANT EXECUTE ON FUNCTION assign_and_insert_lead(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO PUBLIC;

COMMIT;