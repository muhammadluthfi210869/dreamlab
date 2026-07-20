-- =============================================
-- Round Robin Lead Distribution — Supabase Setup
-- =============================================
--
-- ⚠️ DEPRECATED (2026-07-20): Implementasi round-robin yang AKTIF sekarang
-- pakai Redis/Upstash (lihat src/lib/roundRobin.ts, src/lib/round-robin-config.ts).
-- Tabel busdevs/rr_counter dan fungsi increment_rr_counter() di file ini
-- TIDAK direferensikan di manapun oleh kode aplikasi saat ini (dicek via
-- grep di seluruh src/) — murni sisa iterasi awal. Jangan jadikan acuan
-- saat debug round-robin; daftar CS aktif ada di AGENTS di
-- round-robin-config.ts, bukan di tabel busdevs ini.
-- File migration ini dibiarkan (tidak dihapus) untuk jaga histori migrasi
-- database, bukan karena masih dipakai.

-- 1. Table: busdevs — daftar busdev, fleksibel
CREATE TABLE IF NOT EXISTS busdevs (
  id         BIGSERIAL PRIMARY KEY,
  phone      TEXT NOT NULL,
  name       TEXT DEFAULT '',
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: rr_counter — 1 baris, counter global
CREATE TABLE IF NOT EXISTS rr_counter (
  id            INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  current_index INTEGER NOT NULL DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Insert row pertama counter
INSERT INTO rr_counter (id, current_index, updated_at)
VALUES (1, 0, NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. RPC Function: increment counter secara atomik
--    Return: index berikutnya (sudah di-modulo active busdevs)
CREATE OR REPLACE FUNCTION increment_rr_counter()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_next INTEGER;
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

-- 4. Seed data: 3 busdev awal
INSERT INTO busdevs (phone, name, is_active) VALUES
  ('6287776550657', 'Busdev 1', true),
  ('6281952417051', 'Busdev 2', true),
  ('6287712232389', 'Busdev 3', true)
ON CONFLICT DO NOTHING;

-- 5. RLS: izinkan anon key baca busdevs, dan panggil RPC
ALTER TABLE busdevs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rr_counter ENABLE ROW LEVEL SECURITY;

-- Anon boleh baca busdevs (aktif saja)
CREATE POLICY "anon_can_read_active_busdevs"
  ON busdevs FOR SELECT
  TO anon
  USING (is_active = true);

-- Anon / service_role bisa panggil RPC (tidak perlu policy untuk function)
-- Cukup GRANT USAGE
GRANT EXECUTE ON FUNCTION increment_rr_counter TO anon, service_role;
