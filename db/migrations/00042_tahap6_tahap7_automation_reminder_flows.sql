-- 00042_tahap6_tahap7_automation_reminder_flows.sql
-- Tahap 4 (alert koneksi Convia), Tahap 6 (Otomasi, FU 1/FU 2, Kecepatan Balas, Segmen), Tahap 7 (Flow Journey)

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS fu_status TEXT,
  ADD COLUMN IF NOT EXISTS fu_since TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS opt_out BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS convia_connection_alerts (
  id         BIGSERIAL PRIMARY KEY,
  convia_id  TEXT,
  event_type TEXT NOT NULL,
  message    TEXT NOT NULL,
  resolved   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS automation_settings (
  id                SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  rules             JSONB NOT NULL DEFAULT '{"form_to_cold":true,"reply_to_warm":true,"chat_count_to_warm":true,"first_sales_reply_to_cold":false}'::jsonb,
  chat_threshold    INT NOT NULL DEFAULT 5,
  work_start        TEXT NOT NULL DEFAULT '08:00',
  work_end          TEXT NOT NULL DEFAULT '20:00',
  sla_minutes       INT NOT NULL DEFAULT 15,
  sla_enabled       BOOLEAN NOT NULL DEFAULT TRUE,
  fu1_days          INT NOT NULL DEFAULT 1,
  fu2_days          INT NOT NULL DEFAULT 3,
  lost_suggest_days INT NOT NULL DEFAULT 7,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO automation_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS automation_triggers (
  id           BIGSERIAL PRIMARY KEY,
  phrase       TEXT NOT NULL,
  label        TEXT NOT NULL,
  target_stage TEXT NOT NULL,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  sort         INT NOT NULL DEFAULT 0
);

INSERT INTO automation_triggers (phrase, label, target_stage, is_active, sort)
SELECT v.phrase, v.label, v.target_stage, TRUE, v.sort
FROM (VALUES
  ('Data Form Sample Klien', 'Minta sampel', 'sample', 1),
  ('Data Form Klien', 'Isi form', 'cold', 2),
  ('bukti transfer | sudah transfer | invoice | DP', 'Siap bayar', 'hot', 3)
) AS v(phrase, label, target_stage, sort)
WHERE NOT EXISTS (SELECT 1 FROM automation_triggers);

CREATE TABLE IF NOT EXISTS response_times (
  id               BIGSERIAL PRIMARY KEY,
  lead_id          BIGINT,
  tracking_code    TEXT,
  sales_id         BIGINT,
  sales_name       TEXT NOT NULL,
  customer_msg_at  TIMESTAMPTZ NOT NULL,
  reply_at         TIMESTAMPTZ NOT NULL,
  business_seconds INT NOT NULL CHECK (business_seconds >= 0),
  is_first         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_response_times_sales_reply
  ON response_times (sales_name, reply_at DESC);

CREATE TABLE IF NOT EXISTS crm_segments (
  id                BIGSERIAL PRIMARY KEY,
  name              TEXT NOT NULL,
  filters           JSONB NOT NULL DEFAULT '{}'::jsonb,
  owner_name        TEXT NOT NULL,
  last_synced_at    TIMESTAMPTZ,
  last_synced_count INT NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tahap 7: Flow Journey
CREATE TABLE IF NOT EXISTS flows (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT FALSE,
  trigger     JSONB NOT NULL DEFAULT '{}'::jsonb,
  quiet_hours BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flow_steps (
  id       BIGSERIAL PRIMARY KEY,
  flow_id  BIGINT NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
  position INT NOT NULL,
  type     TEXT NOT NULL,
  config   JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS flow_runs (
  id               BIGSERIAL PRIMARY KEY,
  flow_id          BIGINT NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
  lead_id          BIGINT,
  tracking_code    TEXT,
  current_position INT NOT NULL DEFAULT 1,
  next_run_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status           TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'done', 'stopped')),
  stop_reason      TEXT,
  started_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flow_runs_due
  ON flow_runs (status, next_run_at) WHERE status = 'running';

CREATE TABLE IF NOT EXISTS flow_events (
  id     BIGSERIAL PRIMARY KEY,
  run_id BIGINT NOT NULL REFERENCES flow_runs(id) ON DELETE CASCADE,
  step   INT NOT NULL,
  at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  result TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS crm_tasks (
  id            BIGSERIAL PRIMARY KEY,
  lead_id       BIGINT,
  tracking_code TEXT,
  sales_name    TEXT NOT NULL,
  title         TEXT NOT NULL,
  due_at        TIMESTAMPTZ NOT NULL,
  is_done       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed 5 flow contoh awal (nonaktif by default agar admin tinjau sebelum mengaktifkan)
INSERT INTO flows (name, is_active, trigger, quiet_hours)
SELECT v.name, FALSE, v.trigger::jsonb, TRUE
FROM (VALUES
  ('Sambutan lead iklan', '{"type":"new_lead","source":"paid_ads"}'),
  ('Follow-up 1 (H+1)', '{"type":"fu_status","status":"FU 1"}'),
  ('Follow-up 2 (H+3)', '{"type":"fu_status","status":"FU 2"}'),
  ('Eskalasi balas lambat', '{"type":"sla_breach","minutes":15}'),
  ('Form sampel diterima', '{"type":"stage_enter","stage":"sample"}')
) AS v(name, trigger)
WHERE NOT EXISTS (SELECT 1 FROM flows);
