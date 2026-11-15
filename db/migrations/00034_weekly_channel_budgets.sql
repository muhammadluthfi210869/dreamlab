-- ============================================================================
-- Migration 00034: Weekly Channel Budgets for Cost Performance Tracking
-- Menyimpan budget mingguan (Rp) per channel (Meta Ads, Google Ads,
-- Google Organik, Media Sosial) untuk perhitungan:
--   - Cost per Traffic       = Budget / Traffic
--   - Cost per Qualified Lead= Budget / (Warm + Hot)
--   - Cost per Sample        = Budget / Sample
-- ============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS crm_weekly_budgets (
  week_start  DATE NOT NULL,
  channel     TEXT NOT NULL CHECK (channel IN ('meta_ads', 'google_ads', 'google_organic', 'social_media')),
  budget_idr  BIGINT NOT NULL DEFAULT 0 CHECK (budget_idr >= 0),
  updated_by  TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (week_start, channel)
);

CREATE INDEX IF NOT EXISTS idx_crm_weekly_budgets_week ON crm_weekly_budgets (week_start DESC);

COMMIT;

