-- ============================================================
-- 00028_update_pipeline_stages_warm_moq.sql
--
-- Memperbarui tahap CRM Pipeline sesuai alur baru:
--   TRAFFIC | COLD | WARM 500PCS | WARM UP 500PCS | WARM 1000 | HOT | SAMPLE
-- ============================================================

BEGIN;

ALTER TABLE crm_lead_state DROP CONSTRAINT IF EXISTS crm_lead_state_stage_check;

ALTER TABLE crm_lead_state ADD CONSTRAINT crm_lead_state_stage_check
  CHECK (stage IN (
    'traffic',
    'cold',
    'warm_500',
    'warm_up_500',
    'warm_1000',
    'hot',
    'sample',
    'deal',
    'traffic_below_500',
    'traffic_500',
    'traffic_1000',
    'warm',
    'loker',
    'tidak_jelas'
  ));

COMMIT;
