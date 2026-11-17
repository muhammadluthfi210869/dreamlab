-- Rollback 00040_tahap2_round_robin_extensions.sql
DROP INDEX IF EXISTS idx_crm_lead_assignments_code;

ALTER TABLE crm_lead_assignments
  DROP COLUMN IF EXISTS sales_name,
  DROP COLUMN IF EXISTS source,
  DROP COLUMN IF EXISTS customer_phone,
  DROP COLUMN IF EXISTS lead_name,
  DROP COLUMN IF EXISTS tracking_code;
