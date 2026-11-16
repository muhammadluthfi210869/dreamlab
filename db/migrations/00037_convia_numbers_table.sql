-- ============================================================================
-- Migration 00037: Tabel convia_numbers untuk sinkronisasi nomor & pemetaan sales
-- ============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS convia_numbers (
  convia_id            TEXT PRIMARY KEY,
  display_phone_number TEXT NOT NULL DEFAULT '',
  verified_name        TEXT,
  quality_rating       TEXT NOT NULL DEFAULT 'UNKNOWN',
  is_primary           BOOLEAN NOT NULL DEFAULT FALSE,
  sales_id             BIGINT REFERENCES sales(id) ON DELETE SET NULL,
  is_shared            BOOLEAN NOT NULL DEFAULT FALSE,
  synced_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_convia_numbers_sales_id
  ON convia_numbers(sales_id);

COMMIT;

