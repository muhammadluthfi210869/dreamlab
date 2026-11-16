-- ============================================================================
-- Migration 00036: Kolom source pada convia_webhook_log & convia_phone_id pada sales
-- ============================================================================

BEGIN;

ALTER TABLE convia_webhook_log
  ADD COLUMN IF NOT EXISTS source TEXT;

ALTER TABLE sales
  ADD COLUMN IF NOT EXISTS convia_phone_id TEXT;

COMMIT;

