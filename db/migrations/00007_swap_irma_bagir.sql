-- ============================================================
-- 00007_swap_irma_bagir.sql
-- 1. Re-aktivasi Pak Bagir (087766466927) — di-hard-delete di 00006,
--    jadi perlu INSERT ulang.
-- 2. Non-aktifkan Bu Irma (085133188827) — soft-delete (is_active=false)
--    supaya histori lead-nya tetap terjaga (FK-safe).
--
-- Round robin tetap 4 CS aktif: CS 1, CS 2, CS 3, Pak Bagir.
--
-- Counter tidak perlu di-reset: fungsi rotasi memakai
-- COUNT(is_active = true) dan modulo → otomatis menyesuaikan.
--
-- Idempotent: aman dijalankan ulang.
-- ============================================================

BEGIN;

-- 1. Re-insert Pak Bagir (ON CONFLICT → aktifkan kembali kalau sudah ada)
INSERT INTO busdevs (phone, name, is_active)
VALUES ('087766466927', 'Pak Bagir', true)
ON CONFLICT (phone)
DO UPDATE SET is_active = true, name = 'Pak Bagir';

-- 2. Non-aktifkan Bu Irma
UPDATE busdevs
SET is_active = false
WHERE phone = '085133188827';

-- 3. Bersihkan sticky assignment Bu Irma
--    Visitor lama yang sticky ke Bu Irma otomatis dapat CS baru
--    saat kontak berikutnya (RPC assign_next_agent handle: sticky hilang → assign baru).
DELETE FROM visitor_assignments
 WHERE agent_id IN (
   SELECT id FROM busdevs WHERE phone = '085133188827'
 );

-- 4. Verifikasi
SELECT
  (SELECT COUNT(*) FROM busdevs WHERE is_active = true) AS active_agents,
  (SELECT COUNT(*) FROM busdevs WHERE phone = '087766466927' AND is_active = true) AS pak_bagir_active,
  (SELECT COUNT(*) FROM busdevs WHERE phone = '085133188827' AND is_active = false) AS bu_irma_inactive;

COMMIT;
