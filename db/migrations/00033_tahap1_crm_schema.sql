-- ============================================================================
-- Migration 00033: Tahap 1 — Data & Pipeline Schema
--
-- ATURAN PENTING:
-- 1. Tabel `leads` dan fungsi `assign_and_insert_lead` TIDAK diubah/di-rename
--    agar log klik website live (dreamlab.id) tetap berjalan tanpa gangguan.
-- 2. Tabel baru `crm_leads` dibuat dengan `phone` format E.164 unik.
-- 3. Tabel `sales`, `crm_lead_assignments`, `rr_state`, `stage_history`,
--    dan `messages` dibuat sesuai spesifikasi Tahap 1.
-- 4. Kolom tambahan pada `crm_lead_state` (`lost_reason`, `brand`, `source_manual`,
--    `moq_label`) ditambahkan secara non-destruktif.
-- ============================================================================

BEGIN;

-- 1. Tabel `sales` (pengguna CRM + status Round Robin + nomor WA Busdev)
CREATE TABLE IF NOT EXISTS sales (
  id                    BIGSERIAL PRIMARY KEY,
  name                  TEXT NOT NULL UNIQUE,
  wa_number             TEXT,
  phone_number_id       TEXT,
  role                  TEXT NOT NULL DEFAULT 'busdev' CHECK (role IN ('admin', 'busdev')),
  password_hash         TEXT,
  must_change_password  BOOLEAN NOT NULL DEFAULT TRUE,
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  off_reason            TEXT CHECK (off_reason IS NULL OR off_reason IN ('Cuti', 'Sakit', 'Libur', 'Off shift')),
  off_until             TIMESTAMPTZ,
  rr_order              INT NOT NULL DEFAULT 0,
  deleted_at            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sinkronisasi awal `sales` dari `crm_users` dan `busdevs` (tanpa menimpa password_hash)
INSERT INTO sales (id, name, wa_number, role, password_hash, must_change_password, is_active, rr_order)
SELECT
  u.id,
  u.name,
  b.phone,
  CASE WHEN u.role IN ('admin', 'head') THEN 'admin' ELSE 'busdev' END,
  u.password_hash,
  u.must_change_password,
  CASE WHEN b.id IS NOT NULL THEN (u.is_active AND b.is_active) ELSE u.is_active END,
  COALESCE(b.id, u.id)
FROM crm_users u
LEFT JOIN busdevs b ON lower(b.name) = lower(u.name)
ON CONFLICT (name) DO UPDATE SET
  wa_number            = COALESCE(sales.wa_number, EXCLUDED.wa_number),
  role                 = EXCLUDED.role,
  password_hash        = COALESCE(EXCLUDED.password_hash, sales.password_hash),
  must_change_password = EXCLUDED.must_change_password,
  updated_at           = NOW();

SELECT setval(
  pg_get_serial_sequence('sales', 'id'),
  GREATEST(COALESCE((SELECT MAX(id) FROM sales), 1), 1),
   true
);

-- 2. Tabel `crm_leads` (1 baris per nomor WA E.164 unik)
CREATE TABLE IF NOT EXISTS crm_leads (
  id                BIGSERIAL PRIMARY KEY,
  tracking_code     TEXT UNIQUE,
  name              TEXT,
  phone             TEXT NOT NULL UNIQUE CHECK (phone ~ '^\+[1-9][0-9]{6,15}$'),
  brand             TEXT,
  product           TEXT,
  moq               TEXT,
  moq_numeric       INT,
  source            TEXT,
  source_raw        JSONB,
  campaign          TEXT,
  utm_source        TEXT,
  utm_medium        TEXT,
  utm_campaign      TEXT,
  utm_content       TEXT,
  gclid             TEXT,
  ad_id             TEXT,
  landing_path      TEXT,
  referrer          TEXT,
  stage             TEXT NOT NULL DEFAULT 'lead_masuk' CHECK (
                      stage IN (
                        'lead_masuk',
                        'cold',
                        'warm_below_500',
                        'warm_up_500',
                        'warm_below_1000',
                        'warm_up_1000',
                        'hot',
                        'sample',
                        'deal',
                        'lost'
                      )
                    ),
  owner_sales_id    BIGINT REFERENCES sales(id) ON DELETE SET NULL,
  lost_reason       TEXT CHECK (
                      lost_reason IS NULL OR lost_reason IN (
                        'Harga tidak masuk',
                        'MOQ terlalu besar',
                        'Tidak respons',
                        'Pilih pabrik lain',
                        'Belum siap modal'
                      )
                    ),
  note              TEXT,
  unread_count      INT NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  stage_changed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT crm_leads_lost_reason_required CHECK (stage <> 'lost' OR lost_reason IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_crm_leads_stage ON crm_leads (stage, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crm_leads_owner ON crm_leads (owner_sales_id, stage);
CREATE INDEX IF NOT EXISTS idx_crm_leads_source_campaign ON crm_leads (source, campaign);
CREATE INDEX IF NOT EXISTS idx_crm_leads_created_at ON crm_leads (created_at DESC);

-- 3. Tabel `crm_lead_assignments` (riwayat penugasan Round Robin / Sticky / Manual / Queue)
CREATE TABLE IF NOT EXISTS crm_lead_assignments (
  id              BIGSERIAL PRIMARY KEY,
  lead_id         BIGINT NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
  sales_id        BIGINT REFERENCES sales(id) ON DELETE SET NULL,
  method          TEXT NOT NULL CHECK (method IN ('round_robin', 'sticky', 'manual', 'queue')),
  skipped_sales   TEXT[] NOT NULL DEFAULT '{}',
  assigned_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_lead_assignments_lead ON crm_lead_assignments (lead_id, assigned_at DESC);
CREATE INDEX IF NOT EXISTS idx_crm_lead_assignments_at ON crm_lead_assignments (assigned_at DESC);

-- 4. Tabel `rr_state` ( tepat satu baris untuk mengunci SELECT ... FOR UPDATE saat Round Robin )
CREATE TABLE IF NOT EXISTS rr_state (
  id              SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  last_sales_id   BIGINT REFERENCES sales(id) ON DELETE SET NULL,
  sticky_enabled  BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO rr_state (id, last_sales_id, sticky_enabled, updated_at)
VALUES (1, NULL, TRUE, NOW())
ON CONFLICT (id) DO NOTHING;

-- 5. Tabel `stage_history` (log perpindahan stage)
CREATE TABLE IF NOT EXISTS stage_history (
  id              BIGSERIAL PRIMARY KEY,
  lead_id         BIGINT REFERENCES crm_leads(id) ON DELETE CASCADE,
  tracking_code   TEXT,
  from_stage      TEXT,
  to_stage        TEXT NOT NULL,
  by_user         TEXT,
  at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stage_history_lead_id ON stage_history (lead_id, at DESC);
CREATE INDEX IF NOT EXISTS idx_stage_history_tracking_code ON stage_history (tracking_code, at DESC);

-- 6. Tabel `messages` (pesan WhatsApp masuk/keluar)
CREATE TABLE IF NOT EXISTS messages (
  id                BIGSERIAL PRIMARY KEY,
  lead_id           BIGINT REFERENCES crm_leads(id) ON DELETE CASCADE,
  direction         TEXT NOT NULL CHECK (direction IN ('in', 'out')),
  wa_message_id     TEXT UNIQUE,
  type              TEXT NOT NULL DEFAULT 'text',
  body              TEXT,
  media_url         TEXT,
  status            TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  sent_by_sales_id  BIGINT REFERENCES sales(id) ON DELETE SET NULL,
  phone_number_id   TEXT,
  at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_lead_at ON messages (lead_id, at DESC);

-- 7. Kolom tambahan & perbarui constraint stage pada `crm_lead_state` agar mendukung 10 stage Tahap 1
ALTER TABLE crm_lead_state
  ADD COLUMN IF NOT EXISTS brand TEXT,
  ADD COLUMN IF NOT EXISTS moq_label TEXT,
  ADD COLUMN IF NOT EXISTS source_manual TEXT,
  ADD COLUMN IF NOT EXISTS lost_reason TEXT;

ALTER TABLE crm_lead_state
  DROP CONSTRAINT IF EXISTS crm_lead_state_stage_check;

ALTER TABLE crm_lead_state
  ADD CONSTRAINT crm_lead_state_stage_check CHECK (
    stage IN (
      'lead_masuk',
      'cold',
      'warm_below_500',
      'warm_up_500',
      'warm_below_1000',
      'warm_up_1000',
      'hot',
      'sample',
      'deal',
      'lost',
      -- alias lama agar tetap kompatibel
      'traffic',
      'traffic_below_500',
      'warm_500',
      'traffic_500',
      'warm',
      'warm_1000',
      'traffic_1000'
    )
  );

-- 8. Row Level Security (RLS) pada `crm_leads` dan `messages`
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS crm_leads_isolation_policy ON crm_leads;
CREATE POLICY crm_leads_isolation_policy ON crm_leads
  FOR ALL
  USING (
    COALESCE(NULLIF(current_setting('app.current_user_role', true), ''), 'admin') IN ('admin', 'head')
    OR owner_sales_id = NULLIF(current_setting('app.current_user_id', true), '')::bigint
  )
  WITH CHECK (
    COALESCE(NULLIF(current_setting('app.current_user_role', true), ''), 'admin') IN ('admin', 'head')
    OR owner_sales_id = NULLIF(current_setting('app.current_user_id', true), '')::bigint
  );

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS messages_isolation_policy ON messages;
CREATE POLICY messages_isolation_policy ON messages
  FOR ALL
  USING (
    COALESCE(NULLIF(current_setting('app.current_user_role', true), ''), 'admin') IN ('admin', 'head')
    OR EXISTS (
      SELECT 1 FROM crm_leads cl
      WHERE cl.id = messages.lead_id
        AND cl.owner_sales_id = NULLIF(current_setting('app.current_user_id', true), '')::bigint
    )
  )
  WITH CHECK (
    COALESCE(NULLIF(current_setting('app.current_user_role', true), ''), 'admin') IN ('admin', 'head')
    OR EXISTS (
      SELECT 1 FROM crm_leads cl
      WHERE cl.id = messages.lead_id
        AND cl.owner_sales_id = NULLIF(current_setting('app.current_user_id', true), '')::bigint
    )
  );

COMMIT;
