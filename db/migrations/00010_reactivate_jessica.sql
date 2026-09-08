-- ============================================================
-- 00010_reactivate_jessica.sql
-- 1. Aktifkan kembali Jessica (CS 1) (is_active=true)
-- ============================================================

BEGIN;

UPDATE busdevs SET is_active = true, name = 'Jessica (CS 1)' WHERE phone = '087712232389';

-- Verifikasi jumlah agent aktif
SELECT id, name, phone, is_active FROM busdevs ORDER BY id;

COMMIT;
