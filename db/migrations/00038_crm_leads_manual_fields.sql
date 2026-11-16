-- ============================================================================
-- Migration 00038: Tambah is_manual dan created_by pada crm_leads
-- ============================================================================

BEGIN;

ALTER TABLE crm_leads
  ADD COLUMN IF NOT EXISTS is_manual BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS created_by TEXT;

CREATE INDEX IF NOT EXISTS idx_crm_leads_is_manual ON crm_leads (is_manual);

COMMIT;

