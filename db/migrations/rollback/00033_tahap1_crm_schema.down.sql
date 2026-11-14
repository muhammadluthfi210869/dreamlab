-- ============================================================================
-- Rollback 00033: Tahap 1 — Data & Pipeline Schema
-- ============================================================================

BEGIN;

DROP POLICY IF EXISTS messages_isolation_policy ON messages;
DROP POLICY IF EXISTS crm_leads_isolation_policy ON crm_leads;

ALTER TABLE crm_lead_state
  DROP CONSTRAINT IF EXISTS crm_lead_state_stage_check;

ALTER TABLE crm_lead_state
  ADD CONSTRAINT crm_lead_state_stage_check CHECK (
    stage IN ('traffic', 'cold', 'warm_500', 'warm_up_500', 'warm_1000', 'hot', 'sample', 'deal', 'lost')
  );

ALTER TABLE crm_lead_state
  DROP COLUMN IF EXISTS lost_reason,
  DROP COLUMN IF EXISTS source_manual,
  DROP COLUMN IF EXISTS moq_label,
  DROP COLUMN IF EXISTS brand;

DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS stage_history;
DROP TABLE IF EXISTS rr_state;
DROP TABLE IF EXISTS crm_lead_assignments;
DROP TABLE IF EXISTS crm_leads;
DROP TABLE IF EXISTS sales;

COMMIT;
