-- ============================================================
-- 00030_backend_qualified_leads_and_capi.sql
-- Database: dreamlab (PostgreSQL)
--
-- Objective:
-- Add server-side lead qualification fields (tier, qualified, disqualify_reason,
-- inquiry_code, qualified_at, duplicate_of_id, click identifiers)
-- and create capi_events table for tracking Meta Conversions API events.
--
-- Idempotent and safe to re-run.
-- ============================================================

BEGIN;

ALTER TABLE leads 
  ADD COLUMN IF NOT EXISTS tier TEXT,
  ADD COLUMN IF NOT EXISTS lead_segment TEXT,
  ADD COLUMN IF NOT EXISTS qualified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS disqualify_reason TEXT,
  ADD COLUMN IF NOT EXISTS inquiry_code TEXT,
  ADD COLUMN IF NOT EXISTS qualified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS duplicate_of_id BIGINT REFERENCES leads(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS fbc TEXT,
  ADD COLUMN IF NOT EXISTS fbp TEXT,
  ADD COLUMN IF NOT EXISTS client_ip TEXT,
  ADD COLUMN IF NOT EXISTS user_agent TEXT,
  ADD COLUMN IF NOT EXISTS landing_url TEXT,
  ADD COLUMN IF NOT EXISTS ad_id TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_qualified ON leads (qualified);
CREATE INDEX IF NOT EXISTS idx_leads_tier ON leads (tier);
CREATE INDEX IF NOT EXISTS idx_leads_inquiry_code ON leads (inquiry_code);
CREATE INDEX IF NOT EXISTS idx_leads_disqualify_reason ON leads (disqualify_reason);

CREATE TABLE IF NOT EXISTS capi_events (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_id TEXT NOT NULL,
  http_status INTEGER,
  meta_response_body TEXT,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_capi_events_lead_id ON capi_events (lead_id);
CREATE INDEX IF NOT EXISTS idx_capi_events_event_id ON capi_events (event_id);
CREATE INDEX IF NOT EXISTS idx_capi_events_sent_at ON capi_events (sent_at);

COMMIT;
