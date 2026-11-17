-- 00041_tahap3_dashboard_overrides_and_performance.sql
-- Tahap 3 (Tambahan Dashboard overrides) & Tahap 3B (Performance & CAC)

CREATE TABLE IF NOT EXISTS dashboard_overrides (
  id                  BIGSERIAL PRIMARY KEY,
  month               TEXT NOT NULL, -- YYYY-MM
  sales_id            BIGINT,
  sales_name          TEXT NOT NULL,
  week_index          INT NOT NULL CHECK (week_index >= 1 AND week_index <= 5),
  metric              TEXT NOT NULL CHECK (metric IN ('traffic', 'cold', 'prospecting', 'sample', 'deal', 'lost')),
  value               INT NOT NULL CHECK (value >= 0),
  auto_value_saat_itu INT NOT NULL DEFAULT 0,
  reason              TEXT NOT NULL,
  created_by          TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (month, sales_name, week_index, metric)
);

CREATE TABLE IF NOT EXISTS dashboard_override_log (
  id          BIGSERIAL PRIMARY KEY,
  month       TEXT NOT NULL,
  sales_name  TEXT NOT NULL,
  week_index  INT,
  metric      TEXT,
  action      TEXT NOT NULL DEFAULT 'override', -- 'override' | 'reset'
  from_value  INT,
  to_value    INT,
  reason      TEXT NOT NULL,
  actor       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dashboard_override_log_month
  ON dashboard_override_log (month, created_at DESC);

-- Tahap 3B: Performance & CAC
CREATE TABLE IF NOT EXISTS ad_spend (
  id            BIGSERIAL PRIMARY KEY,
  tanggal       DATE NOT NULL,
  source        TEXT NOT NULL,
  campaign_key  TEXT NOT NULL DEFAULT '',
  campaign_name TEXT,
  amount        BIGINT NOT NULL CHECK (amount >= 0),
  input_type    TEXT NOT NULL DEFAULT 'manual' CHECK (input_type IN ('manual', 'auto')),
  provider_ref  TEXT,
  note          TEXT,
  created_by    TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tanggal, source, campaign_key, input_type)
);

CREATE INDEX IF NOT EXISTS idx_ad_spend_tanggal_source
  ON ad_spend (tanggal DESC, source);

CREATE TABLE IF NOT EXISTS ad_spend_audit_log (
  id          BIGSERIAL PRIMARY KEY,
  ad_spend_id BIGINT,
  action      TEXT NOT NULL, -- 'create' | 'update' | 'delete'
  old_amount  BIGINT,
  new_amount  BIGINT,
  summary     TEXT,
  actor       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS other_costs (
  id         BIGSERIAL PRIMARY KEY,
  bulan      TEXT NOT NULL, -- YYYY-MM
  kategori   TEXT NOT NULL CHECK (kategori IN ('gaji busdev', 'tools/langganan', 'agensi', 'endorse/KOL', 'sampel gratis', 'lainnya')),
  amount     BIGINT NOT NULL CHECK (amount >= 0),
  note       TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_other_costs_bulan ON other_costs (bulan);

CREATE TABLE IF NOT EXISTS campaign_map (
  id               BIGSERIAL PRIMARY KEY,
  provider_ref     TEXT,
  ad_campaign_name TEXT NOT NULL,
  source           TEXT NOT NULL,
  campaign_key     TEXT NOT NULL,
  created_by       TEXT NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source, ad_campaign_name)
);

ALTER TABLE crm_lead_state
  ADD COLUMN IF NOT EXISTS deal_value BIGINT,
  ADD COLUMN IF NOT EXISTS deal_qty INT;
