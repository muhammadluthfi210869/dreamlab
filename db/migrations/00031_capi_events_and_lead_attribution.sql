-- ============================================================
-- 00031_capi_events_and_lead_attribution.sql
-- Database: dreamlab (PostgreSQL)
--
-- Objective:
-- 1. Ensure leads table stores fbc, fbp, client_ip, user_agent,
--    landing_url, UTMs, gclid, fbclid, tier, lead_segment,
--    qualified, disqualify_reason, duplicate_of_id.
-- 2. Ensure capi_events table has (lead_id, event_name, event_id,
--    http_status, response_body, sent_at) columns for logging
--    server-side Meta Conversions API attempts and retries.
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
  ADD COLUMN IF NOT EXISTS inquiry_reference TEXT,
  ADD COLUMN IF NOT EXISTS qualified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS duplicate_of_id BIGINT REFERENCES leads(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS fbc TEXT,
  ADD COLUMN IF NOT EXISTS fbp TEXT,
  ADD COLUMN IF NOT EXISTS client_ip TEXT,
  ADD COLUMN IF NOT EXISTS user_agent TEXT,
  ADD COLUMN IF NOT EXISTS landing_url TEXT,
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS utm_content TEXT,
  ADD COLUMN IF NOT EXISTS utm_term TEXT,
  ADD COLUMN IF NOT EXISTS gclid TEXT,
  ADD COLUMN IF NOT EXISTS fbclid TEXT,
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
  response_body TEXT,
  meta_response_body TEXT,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE capi_events
  ADD COLUMN IF NOT EXISTS response_body TEXT,
  ADD COLUMN IF NOT EXISTS meta_response_body TEXT,
  ADD COLUMN IF NOT EXISTS error_message TEXT,
  ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_capi_events_lead_id ON capi_events (lead_id);
CREATE INDEX IF NOT EXISTS idx_capi_events_event_id ON capi_events (event_id);
CREATE INDEX IF NOT EXISTS idx_capi_events_sent_at ON capi_events (sent_at);

COMMIT;

