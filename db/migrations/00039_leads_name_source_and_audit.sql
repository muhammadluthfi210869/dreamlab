-- 00039_leads_name_source_and_audit.sql
-- Menambahkan pelacakan sumber nama pada leads (form | whatsapp | manual)
-- serta tabel crm_lead_audit_log untuk mencatat perubahan nama dan nomor oleh user.

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS name_source TEXT,
  ADD COLUMN IF NOT EXISTS name_original TEXT,
  ADD COLUMN IF NOT EXISTS name_updated_by TEXT,
  ADD COLUMN IF NOT EXISTS name_updated_at TIMESTAMPTZ;

-- Backfill aman hanya untuk baris yang name_source-nya masih NULL
UPDATE leads
   SET name_source = CASE
         WHEN NULLIF(TRIM(nama), '') IS NOT NULL THEN 'form'
         WHEN NULLIF(TRIM(wa_profile_name), '') IS NOT NULL THEN 'whatsapp'
         ELSE NULL
       END,
       name_original = COALESCE(
         NULLIF(TRIM(nama), ''),
         NULLIF(TRIM(wa_profile_name), '')
       )
 WHERE name_source IS NULL
   AND (NULLIF(TRIM(nama), '') IS NOT NULL OR NULLIF(TRIM(wa_profile_name), '') IS NOT NULL);

CREATE TABLE IF NOT EXISTS crm_lead_audit_log (
  id            BIGSERIAL PRIMARY KEY,
  tracking_code TEXT NOT NULL,
  lead_id       BIGINT,
  action        TEXT NOT NULL,
  summary       TEXT NOT NULL,
  old_value     TEXT,
  new_value     TEXT,
  actor         TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_lead_audit_log_code
  ON crm_lead_audit_log (tracking_code, created_at DESC);
