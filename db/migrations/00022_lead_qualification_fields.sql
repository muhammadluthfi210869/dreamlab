-- ============================================================
-- 00022_lead_qualification_fields.sql
-- Database: dreamlab (PostgreSQL)
--
-- Objective:
-- Add qualification and CRM synchronization fields to `leads` table
-- for the November 2026 Paid Ads Lead Qualification Funnel.
--
-- Idempotent and safe to re-run.
-- ============================================================

BEGIN;

ALTER TABLE leads 
  ADD COLUMN IF NOT EXISTS quantity_range TEXT,
  ADD COLUMN IF NOT EXISTS budget_range TEXT,
  ADD COLUMN IF NOT EXISTS production_timeline TEXT,
  ADD COLUMN IF NOT EXISTS business_status TEXT,
  ADD COLUMN IF NOT EXISTS lead_segment TEXT,
  ADD COLUMN IF NOT EXISTS qualification_status TEXT,
  ADD COLUMN IF NOT EXISTS inquiry_reference TEXT,
  ADD COLUMN IF NOT EXISTS utm_content TEXT,
  ADD COLUMN IF NOT EXISTS utm_term TEXT,
  ADD COLUMN IF NOT EXISTS gclid TEXT,
  ADD COLUMN IF NOT EXISTS fbclid TEXT,
  ADD COLUMN IF NOT EXISTS crm_sync_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS crm_synced_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS crm_lead_id TEXT,
  ADD COLUMN IF NOT EXISTS crm_contact_id TEXT,
  ADD COLUMN IF NOT EXISTS wa_clicked_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_leads_inquiry_reference ON leads (inquiry_reference);
CREATE INDEX IF NOT EXISTS idx_leads_lead_segment ON leads (lead_segment);
CREATE INDEX IF NOT EXISTS idx_leads_crm_sync_status ON leads (crm_sync_status);

COMMIT;
