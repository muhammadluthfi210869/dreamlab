-- ============================================================================
-- Rollback 00036
-- ============================================================================

BEGIN;

ALTER TABLE sales
  DROP COLUMN IF EXISTS convia_phone_id;

ALTER TABLE convia_webhook_log
  DROP COLUMN IF EXISTS source;

COMMIT;

