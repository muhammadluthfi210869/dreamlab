-- Rollback 00041_tahap3_dashboard_overrides_and_performance.sql
ALTER TABLE crm_lead_state
  DROP COLUMN IF EXISTS deal_qty,
  DROP COLUMN IF EXISTS deal_value;

DROP TABLE IF EXISTS campaign_map;
DROP INDEX IF EXISTS idx_other_costs_bulan;
DROP TABLE IF EXISTS other_costs;
DROP TABLE IF EXISTS ad_spend_audit_log;
DROP INDEX IF EXISTS idx_ad_spend_tanggal_source;
DROP TABLE IF EXISTS ad_spend;
DROP INDEX IF EXISTS idx_dashboard_override_log_month;
DROP TABLE IF EXISTS dashboard_override_log;
DROP TABLE IF EXISTS dashboard_overrides;
