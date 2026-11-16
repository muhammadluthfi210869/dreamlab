-- ============================================================================
-- Migration 00035: Tabel Log Mentah Webhook Convia untuk CRM
-- ============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS convia_webhook_log (
  id          BIGSERIAL PRIMARY KEY,
  event_type  TEXT,
  headers     JSONB,
  payload     JSONB,
  raw_body    TEXT NOT NULL DEFAULT '',
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_convia_webhook_log_received_at
  ON convia_webhook_log (received_at DESC);

CREATE INDEX IF NOT EXISTS idx_convia_webhook_log_event_type
  ON convia_webhook_log (event_type);

COMMIT;

