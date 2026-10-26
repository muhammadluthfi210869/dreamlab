-- ============================================================
-- 00023_production_tiers_and_international_phone.sql
-- Database: dreamlab (PostgreSQL)
--
-- Objective:
-- Add production tier and international phone metadata to `leads` table.
--
-- Idempotent and safe to re-run.
-- ============================================================

BEGIN;

ALTER TABLE leads 
  ADD COLUMN IF NOT EXISTS production_tier_name TEXT,
  ADD COLUMN IF NOT EXISTS requested_quantity_pcs INTEGER,
  ADD COLUMN IF NOT EXISTS lead_quantity_segment TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_phone_e164 TEXT,
  ADD COLUMN IF NOT EXISTS phone_country_iso2 TEXT DEFAULT 'ID',
  ADD COLUMN IF NOT EXISTS phone_country_dial_code TEXT DEFAULT '+62';

CREATE INDEX IF NOT EXISTS idx_leads_production_tier ON leads (production_tier_name);
CREATE INDEX IF NOT EXISTS idx_leads_phone_e164 ON leads (whatsapp_phone_e164);

COMMIT;
