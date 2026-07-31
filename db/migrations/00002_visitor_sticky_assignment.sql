-- ============================================================
-- 00002 — Sticky Assignment & Dedup
-- 1 visitor = 1 CS (mencegah lead redundan masuk 2 chat berbeda)
--
-- Tambahan:
--   visitor_assignments : mapping visitor -> CS (sticky, TTL 30 hari)
--   leads.visitor_id    : identitas visitor (untuk dedup)
--   leads.source        : channel asal (organic/google-ads/metaads/medsos/...)
--   leads.visit_count   : berapa kali visitor yang sama konversi
--   assign_next_agent() : RPC atomik (sticky + rotasi, serialized per visitor)
--
-- Aman dijalankan ulang (idempotent).
-- ============================================================

BEGIN;

-- 1. Tabel sticky: 1 visitor -> 1 CS -----------------------------------
CREATE TABLE IF NOT EXISTS visitor_assignments (
  visitor_id TEXT PRIMARY KEY,
  agent_id   BIGINT NOT NULL REFERENCES busdevs(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen  TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
);

-- 2. leads: kolom identitas visitor, source, dan counter kunjungan -----
ALTER TABLE leads ADD COLUMN IF NOT EXISTS visitor_id TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source       TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS visit_count  INT  DEFAULT 1;
CREATE INDEX IF NOT EXISTS idx_leads_visitor_id ON leads (visitor_id);
CREATE INDEX IF NOT EXISTS idx_leads_source      ON leads (source);

-- 3. RPC: sticky + rotasi atomik (serialized per visitor) --------------
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
  -- Serialisasi untuk visitor yang sama (cegah race double-click)
  PERFORM pg_advisory_xact_lock(hashtext(coalesce(p_visitor_id, '')));

  -- Cek sticky: visitor ini sudah punya assignment aktif?
  IF p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
    SELECT va.agent_id INTO v_sticky
      FROM visitor_assignments va
     WHERE va.visitor_id = p_visitor_id
       AND va.expires_at > NOW();

    IF FOUND THEN
      -- Kembalikan CS yang sama, TANPA memajukan counter
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
        RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx;
        RETURN;
      END IF;
      -- CS lama nonaktif -> lanjut assign baru di bawah
    END IF;
  END IF;

  -- Visitor baru (atau CS sticky nonaktif): majukan counter rotasi
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

  RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx;
END;
$$;

GRANT EXECUTE ON FUNCTION assign_next_agent(TEXT) TO PUBLIC;
GRANT SELECT, INSERT, UPDATE ON TABLE visitor_assignments TO PUBLIC;

COMMIT;
