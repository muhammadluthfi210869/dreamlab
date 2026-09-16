-- ============================================================
-- 00015_add_lead_wa_confirmation.sql
-- Add WhatsApp Confirmation & Inbound Tracking columns
-- ============================================================

BEGIN;

-- 1. Table leads: Tambah kolom status konfirmasi WhatsApp
ALTER TABLE leads 
  ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'assigned',
  ADD COLUMN IF NOT EXISTS wa_profile_name TEXT,
  ADD COLUMN IF NOT EXISTS wa_phone TEXT,
  ADD COLUMN IF NOT EXISTS wa_message TEXT,
  ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;

-- Backfill: lead lama yang belum punya status diberi 'assigned'
UPDATE leads 
   SET status = 'assigned' 
 WHERE status IS NULL;

-- Index pencarian konfirmasi cepat berdasarkan tracking_code dan status
CREATE INDEX IF NOT EXISTS idx_leads_tracking_code ON leads(tracking_code);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);

-- 2. Table lead_assignments (jika ada): Tambah kolom pelengkap WA
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lead_assignments') THEN
    ALTER TABLE lead_assignments
      ADD COLUMN IF NOT EXISTS wa_profile_name TEXT,
      ADD COLUMN IF NOT EXISTS wa_phone TEXT,
      ADD COLUMN IF NOT EXISTS wa_message TEXT,
      ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;
  END IF;
END $$;

COMMIT;
