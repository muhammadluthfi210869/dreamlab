-- ============================================================
-- 00006_remove_pak_bagir.sql
-- Hapus Pak Bagir (087766466927) dari round-robin lead distribution.
-- Round robin berubah dari 5 -> 4 CS aktif.
--
-- Sama seperti 00003 (Bu Dilla) & 00004 (Pak Zaki): hard-delete total.
--   - visitor_assignments punya FK -> busdevs(id). Baris yang menunjuk
--     ke Pak Bagir DIHAPUS duluan supaya DELETE tidak melanggar FK.
--     Efek: visitor lama yang sticky ke Pak Bagir otomatis dapat CS baru
--     saat kontak berikutnya (RPC assign_next_agent / assign_and_insert_lead
--     sudah handle: sticky hilang -> assign baru).
--   - leads.assigned_to / assigned_phone TEXT (bukan FK) -> histori lead
--     Pak Bagir tetap tersimpan.
--
-- Counter tidak perlu di-reset: fungsi rotasi memakai
-- COUNT(is_active = true) dan modulo -> otomatis menyesuaikan ke 4 CS.
--
-- Idempotent: aman dijalankan ulang berapa pun.
-- ============================================================

BEGIN;

-- 1. Bersihkan sticky assignment yang menunjuk ke Pak Bagir (FK pertama)
DELETE FROM visitor_assignments
 WHERE agent_id IN (
   SELECT id FROM busdevs WHERE phone = '087766466927'
 );

-- 2. Hapus Pak Bagir dari daftar CS
DELETE FROM busdevs
 WHERE phone = '087766466927';

-- 3. Verifikasi: round robin sekarang harus 4 CS aktif.
SELECT
  (SELECT COUNT(*) FROM busdevs WHERE is_active = true) AS active_agents,
  (SELECT COUNT(*) FROM busdevs WHERE phone = '087766466927') AS pak_bagir_remaining;

COMMIT;