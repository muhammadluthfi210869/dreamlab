-- ============================================================
-- 00016_webhook_dedup.sql
-- Idempotency table for Meta WhatsApp webhook deliveries.
-- Meta retries webhook on 5xx / timeout — without dedup, each retry
-- re-runs the UPDATE and re-fires the NexERP cross-post.
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS processed_webhook_messages (
  wamid        TEXT PRIMARY KEY,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-prune entries older than 30 days (insert-only workload, no FKs).
CREATE INDEX IF NOT EXISTS idx_processed_webhook_messages_at
  ON processed_webhook_messages (processed_at);

COMMIT;