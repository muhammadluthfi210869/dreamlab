-- ============================================================
-- 00020_deactivate_irma_cuti.sql
-- 1. Non-aktifkan Irma (085133188827) karena cuti (is_active = false)
-- 2. Pastikan hanya 3 CS aktif: Annisa, Diaz, Jessica
-- 3. Bersihkan sticky assignment Irma dari visitor_assignments
--    sehingga returning visitor otomatis dialihkan ke CS aktif.
-- ============================================================

BEGIN;

-- Nonaktifkan Irma
UPDATE busdevs
   SET is_active = false
 WHERE id = '4'
    OR phone = '085133188827'
    OR lower(name) = 'irma';

-- Pastikan hanya CS aktif yang aktif (Annisa, Diaz, Jessica)
UPDATE busdevs
   SET is_active = false
 WHERE phone NOT IN ('081952417051', '087776550657', '087712232389');

-- Bersihkan sticky visitor yang mengarah ke Irma
DELETE FROM visitor_assignments
 WHERE agent_id IN (
   SELECT id::int FROM busdevs WHERE lower(name) = 'irma' OR phone = '085133188827'
 );

COMMIT;
