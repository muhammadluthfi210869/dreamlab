-- Rollback 00042_tahap6_tahap7_automation_reminder_flows.sql
DROP TABLE IF EXISTS crm_tasks;
DROP TABLE IF EXISTS flow_events;
DROP INDEX IF EXISTS idx_flow_runs_due;
DROP TABLE IF EXISTS flow_runs;
DROP TABLE IF EXISTS flow_steps;
DROP TABLE IF EXISTS flows;
DROP TABLE IF EXISTS crm_segments;
DROP INDEX IF EXISTS idx_response_times_sales_reply;
DROP TABLE IF EXISTS response_times;
DROP TABLE IF EXISTS automation_triggers;
DROP TABLE IF EXISTS automation_settings;
DROP TABLE IF EXISTS convia_connection_alerts;

ALTER TABLE leads
  DROP COLUMN IF EXISTS opt_out,
  DROP COLUMN IF EXISTS fu_since,
  DROP COLUMN IF EXISTS fu_status,
  DROP COLUMN IF EXISTS address;
