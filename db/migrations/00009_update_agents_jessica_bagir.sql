-- ============================================================
-- 00009_update_agents_jessica_bagir.sql
-- 1. Non-aktifkan Jessica (CS 1) dan Pak Bagir (is_active=false)
-- 2. Aktifkan Annisa (CS 2), Diaz (CS 3), dan Bu Irma (is_active=true)
-- 3. Hapus sticky assignment untuk CS yang non-aktif agar visitor lama dapat CS baru
-- ============================================================

BEGIN;

-- 1. Update status aktif/non-aktif dan sinkronisasi nama
UPDATE busdevs SET is_active = false, name = 'Jessica (CS 1)' WHERE phone = '087712232389';
UPDATE busdevs SET is_active = false, name = 'Pak Bagir' WHERE phone = '087766466927';

UPDATE busdevs SET is_active = true, name = 'Annisa (CS 2)' WHERE phone = '081952417051';
UPDATE busdevs SET is_active = true, name = 'Diaz (CS 3)' WHERE phone = '087776550657';
UPDATE busdevs SET is_active = true, name = 'Bu Irma' WHERE phone = '085133188827';

-- 2. Bersihkan sticky assignment untuk Jessica dan Pak Bagir
-- Visitor lama yang tadinya sticky ke Jessica / Pak Bagir akan di-assign ulang
DELETE FROM visitor_assignments
WHERE agent_id IN (
  SELECT id FROM busdevs WHERE phone IN ('087712232389', '087766466927')
);

-- 3. Verifikasi singkat
SELECT
  (SELECT COUNT(*) FROM busdevs WHERE is_active = true) AS active_agents;

COMMIT;
