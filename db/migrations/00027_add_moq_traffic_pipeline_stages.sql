-- ============================================================
-- 00027_add_moq_traffic_pipeline_stages.sql
--
-- Menambahkan tahap Traffic breakdown berdasarkan kualifikasi MOQ:
--   - traffic: Traffic Umum (belum ada form kualifikasi / klik umum)
--   - traffic_below_500: Traffic MOQ < 500 pcs
--   - traffic_500: Traffic MOQ 500 pcs (Starter)
--   - traffic_1000: Traffic MOQ 1.000+ pcs (Growth / Scale / Enterprise)
-- Diikuti tahap CRM:
--   - cold, warm, hot, sample, deal
--   - loker, tidak_jelas
-- ============================================================

BEGIN;

ALTER TABLE crm_lead_state DROP CONSTRAINT IF EXISTS crm_lead_state_stage_check;

ALTER TABLE crm_lead_state ADD CONSTRAINT crm_lead_state_stage_check
  CHECK (stage IN (
    'traffic',
    'traffic_below_500',
    'traffic_500',
    'traffic_1000',
    'cold',
    'warm',
    'hot',
    'sample',
    'deal',
    'loker',
    'tidak_jelas'
  ));

COMMIT;
