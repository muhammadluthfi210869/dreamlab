-- ============================================================
-- 00004_remove_pak_zaki.sql
-- Hapus Pak Zaki (087867029842) SELURUHNYA dari round-robin
-- lead distribution. Round robin berubah dari 6 -> 5 CS aktif.
--
-- Sama seperti 00003 (Bu Dilla): hard-delete total.
--   - visitor_assignments punya FK -> busdevs(id). Baris yang menunjuk
--     ke Pak Zaki DIHAPUS duluan supaya DELETE tidak melanggar FK.
--     Efek: visitor lama yang sticky ke Pak Zaki otomatis dapat CS baru
--     saat kontak berikutnya (perilaku RPC assign_next_agent sudah handle:
--     sticky hilang -> assign baru).
--   - leads.assigned_to / assigned_phone TEXT (bukan FK) -> histori lead
--     Pak Zaki tetap tersimpan, muncul sebagai 'unknown' di statistik.
--
-- Counter tidak perlu di-reset: assign_next_agent() memakai
-- COUNT(is_active = true) dan modulo -> otomatis menyesuaikan ke 5 CS.
--
-- Idempotent: aman dijalankan ulang berapa pun.
-- ============================================================

BEGIN;

-- 1. Bersihkan sticky assignment yang menunjuk ke Pak Zaki (FK pertama)
DELETE FROM visitor_assignments
 WHERE agent_id IN (
   SELECT id FROM busdevs WHERE phone = '087867029842'
 );

-- 2. Hapus Pak Zaki dari daftar CS
DELETE FROM busdevs
 WHERE phone = '087867029842';

-- 3. Verifikasi: round robin sekarang harus 5 CS aktif.
SELECT
  (SELECT COUNT(*) FROM busdevs WHERE is_active = true) AS active_agents,
  (SELECT COUNT(*) FROM busdevs WHERE phone = '087867029842') AS pak_zaki_remaining;

COMMIT;
