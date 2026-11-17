-- Rollback 00039_leads_name_source_and_audit.sql
DROP INDEX IF EXISTS idx_crm_lead_audit_log_code;
DROP TABLE IF EXISTS crm_lead_audit_log;

ALTER TABLE leads
  DROP COLUMN IF EXISTS name_updated_at,
  DROP COLUMN IF EXISTS name_updated_by,
  DROP COLUMN IF EXISTS name_original,
  DROP COLUMN IF EXISTS name_source;
