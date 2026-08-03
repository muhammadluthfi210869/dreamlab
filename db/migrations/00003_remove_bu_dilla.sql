-- ============================================================
-- 00003_remove_bu_dilla.sql
-- Hapus Bu Dilla (087702232389) SELURUHNYA dari round-robin
-- lead distribution. Round robin berubah dari 7 -> 6 CS aktif.
--
-- Kenapa DELETE, bukan is_active = false:
--   Permintaan: Bu Dilla hilang total (bukan cuma cuti).
--   Counter tidak perlu di-reset: assign_next_agent() memakai
--   COUNT(is_active = true) dan modulo — otomatis menyesuaikan
--   ke 6 CS.
--
-- Penanganan edge case:
--   1. visitor_assignments punya FK -> busdevs(id). Baris yang
--      menunjuk ke Bu Dilla DIHAPUS duluan, supaya DELETE busdevs
--      tidak melanggar FK (hard-delete tidak error).
--      Efek: visitor lama yang sticky ke Bu Dilla otomatis dapat
--      CS baru saat kontak berikutnya (perilaku RPC sudah handle:
--      sticky hilang -> assign baru).
--   2. leads.assigned_to / assigned_phone adalah kolom TEXT (bukan
--      FK) -> histori lead Bu Dilla tetap tersimpan, hanya di
--      statistik round-robin akan muncul sebagai 'unknown'.
--
-- Idempotent: aman dijalankan ulang berapa pun.
-- ============================================================

BEGIN;

-- 1. Bersihkan sticky assignment yang menunjuk ke Bu Dilla (FK pertama)
DELETE FROM visitor_assignments
 WHERE agent_id IN (
   SELECT id FROM busdevs WHERE phone = '087702232389'
 );

-- 2. Hapus Bu Dilla dari daftar CS
DELETE FROM busdevs
 WHERE phone = '087702232389';

-- 3. Verifikasi: round robin sekarang harus 6 CS aktif.
--    Kalau DELETE di atas tidak menemukan baris (sudah terhapus),
--    tidak ada yang dihapus — tetap aman.
SELECT
  (SELECT COUNT(*) FROM busdevs WHERE is_active = true) AS active_agents,
  (SELECT COUNT(*) FROM busdevs WHERE phone = '087702232389') AS bu_dilla_remaining;

COMMIT;
