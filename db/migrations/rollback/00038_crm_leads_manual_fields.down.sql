-- ============================================================================
-- Rollback 00038
-- ============================================================================

BEGIN;

DROP INDEX IF EXISTS idx_crm_leads_is_manual;

ALTER TABLE crm_leads
  DROP COLUMN IF EXISTS created_by,
  DROP COLUMN IF EXISTS is_manual;

COMMIT;

