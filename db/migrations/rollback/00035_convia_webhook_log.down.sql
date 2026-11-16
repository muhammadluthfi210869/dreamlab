-- ============================================================================
-- Rollback 00035: Hapus Tabel Log Mentah Webhook Convia
-- ============================================================================

BEGIN;

DROP INDEX IF EXISTS idx_convia_webhook_log_event_type;
DROP INDEX IF EXISTS idx_convia_webhook_log_received_at;
DROP TABLE IF EXISTS convia_webhook_log;

COMMIT;

