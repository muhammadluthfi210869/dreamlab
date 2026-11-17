-- 00040_tahap2_round_robin_extensions.sql
-- Melengkapi crm_lead_assignments agar mendukung log penugasan dari tracking_code / rotator
-- selain crm_leads.id, serta menyinkronkan status sales dengan busdevs.

ALTER TABLE crm_lead_assignments
  ALTER COLUMN lead_id DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS tracking_code TEXT,
  ADD COLUMN IF NOT EXISTS lead_name TEXT,
  ADD COLUMN IF NOT EXISTS customer_phone TEXT,
  ADD COLUMN IF NOT EXISTS source TEXT,
  ADD COLUMN IF NOT EXISTS sales_name TEXT;

CREATE INDEX IF NOT EXISTS idx_crm_lead_assignments_code
  ON crm_lead_assignments (tracking_code, assigned_at DESC);

-- Sinkronisasi awal status aktif sales dengan busdevs (mis. Annisa cuti = false)
UPDATE sales s
   SET is_active = b.is_active,
       off_reason = CASE WHEN b.is_active = FALSE AND s.off_reason IS NULL THEN 'Cuti' ELSE s.off_reason END,
       updated_at = NOW()
  FROM busdevs b
 WHERE lower(b.name) = lower(s.name)
   AND s.deleted_at IS NULL
   AND s.is_active IS DISTINCT FROM b.is_active;
