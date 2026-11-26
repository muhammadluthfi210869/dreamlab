-- 00044_drop_crm_lead_assignments_lead_id_fkey.sql
-- Lepaskan foreign key crm_lead_assignments.lead_id -> crm_leads(id)
-- agar tabel crm_lead_assignments dapat mencatat riwayat penugasan baik dari
-- tabel leads (website clicks) maupun crm_leads (manual/CRM) tanpa konflik foreign key.

BEGIN;

ALTER TABLE crm_lead_assignments
  DROP CONSTRAINT IF EXISTS crm_lead_assignments_lead_id_fkey;

COMMIT;
