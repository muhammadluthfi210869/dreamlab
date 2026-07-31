-- ============================================================
-- 00001_init_round_robin_leads.sql
-- Database dedicated: dreamlab (PostgreSQL, terpisah dari ERP)
-- Host: localhost:5433 (PG17) — production nanti host terpisah
--
-- Tujuan:
--   1. busdevs      → daftar CS (7 nomor WhatsApp aktif)
--   2. rr_counter   → counter round-robin (1 baris, atomik)
--   3. increment_rr_counter() → RPC pengambilan slot berikutnya
--   4. leads        → histori semua lead (pengganti tracking ERP)
--
-- Aman dijalankan ulang (idempotent).
-- ============================================================

BEGIN;

-- 1. Table: busdevs — daftar CS
CREATE TABLE IF NOT EXISTS busdevs (
  id         BIGSERIAL PRIMARY KEY,
  phone      TEXT NOT NULL,
  name       TEXT DEFAULT '',
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique index: nomor tidak boleh dobel
CREATE UNIQUE INDEX IF NOT EXISTS idx_busdevs_phone ON busdevs (phone);

-- Seed 7 CS aktif
INSERT INTO busdevs (phone, name, is_active) VALUES
  ('087712232389', 'CS 1',     true),
  ('081952417051', 'CS 2',     true),
  ('087776550657', 'CS 3',     true),
  ('085133188827', 'Bu Irma',  true),
  ('087867029842', 'Pak Zaki', true),
  ('087702232389', 'Bu Dilla', true),
  ('087766466927', 'Pak Bagir', true)
ON CONFLICT (phone) DO NOTHING;

-- 2. Table: rr_counter — counter global round-robin
CREATE TABLE IF NOT EXISTS rr_counter (
  id            INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  current_index INTEGER NOT NULL DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO rr_counter (id, current_index, updated_at)
VALUES (1, 0, NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. RPC Function: increment counter secara atomik
--    Return: index berikutnya (sudah di-modulo jumlah CS aktif)
CREATE OR REPLACE FUNCTION increment_rr_counter()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_next  INTEGER;
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count FROM busdevs WHERE is_active = true;

  IF v_count = 0 THEN
    RAISE EXCEPTION 'No active busdevs found';
  END IF;

  UPDATE rr_counter
  SET current_index = (current_index + 1) % v_count,
      updated_at = NOW()
  WHERE id = 1
  RETURNING current_index INTO v_next;

  RETURN v_next;
END;
$$;

-- 4. Table: leads — histori lead mandiri (tidak numpang di DB ERP)
CREATE TABLE IF NOT EXISTS leads (
  id             BIGSERIAL PRIMARY KEY,
  tracking_code  TEXT UNIQUE,
  assigned_to    TEXT,
  assigned_phone TEXT,
  source         TEXT,
  page_url       TEXT,
  page_title     TEXT,
  referrer       TEXT,
  utm_source     TEXT,
  utm_medium     TEXT,
  utm_campaign   TEXT,
  device_type    TEXT,
  browser        TEXT,
  session_id     TEXT,
  intent         TEXT,
  nama           TEXT,
  perusahaan     TEXT,
  hp             TEXT,
  produk         TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Index bantu query statistik
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads (assigned_to);

-- 5. Grant semua hak ke pemilik (default sudah), pastikan sequence aman
GRANT USAGE, SELECT ON SEQUENCE busdevs_id_seq      TO PUBLIC;
GRANT USAGE, SELECT ON SEQUENCE leads_id_seq        TO PUBLIC;
GRANT EXECUTE ON FUNCTION increment_rr_counter()    TO PUBLIC;

COMMIT;
