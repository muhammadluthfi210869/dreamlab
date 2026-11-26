-- rollback 00044_drop_crm_lead_assignments_lead_id_fkey.down.sql
BEGIN;

ALTER TABLE crm_lead_assignments
  ADD CONSTRAINT crm_lead_assignments_lead_id_fkey
  FOREIGN KEY (lead_id) REFERENCES crm_leads(id) ON DELETE CASCADE;

COMMIT;
