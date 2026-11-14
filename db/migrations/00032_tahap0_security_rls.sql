-- ============================================================
-- 00032_tahap0_security_rls.sql
--
-- TAHAP 0 — KEAMANAN CRM DREAMLAB:
--   1. Standarisasi role di crm_users: 'admin' dan 'busdev' (migrasi dari 'head' & 'sales')
--   2. Kolom owner_sales_id pada crm_lead_state & crm_chat_messages + backfill dari nama sales
--   3. Fungsi konteks sesi RLS (crm_current_user_id, crm_current_user_role, crm_current_user_name)
--   4. Role non-superuser crm_app_role + ENABLE/FORCE ROW LEVEL SECURITY
--
-- Aman dijalankan ulang (idempotent). Rollback tersedia di:
--   db/migrations/rollback/00032_tahap0_security_rls.down.sql
-- ============================================================

BEGIN;

SET LOCAL lock_timeout = '10s';

-- 1. Perbarui constraint role pada crm_users agar mendukung 'admin' dan 'busdev'
ALTER TABLE crm_users DROP CONSTRAINT IF EXISTS crm_users_role_check;

UPDATE crm_users SET role = 'admin', updated_at = NOW() WHERE role = 'head';
UPDATE crm_users SET role = 'busdev', updated_at = NOW() WHERE role = 'sales';

ALTER TABLE crm_users ADD CONSTRAINT crm_users_role_check
  CHECK (role IN ('admin', 'busdev', 'head', 'sales'));

ALTER TABLE crm_users
  ADD COLUMN IF NOT EXISTS busdev_id BIGINT REFERENCES busdevs(id) ON DELETE SET NULL;

UPDATE crm_users u
   SET busdev_id = b.id
  FROM busdevs b
 WHERE lower(u.name) = lower(b.name)
   AND u.busdev_id IS NULL;

-- 2. Tambah owner_sales_id pada crm_lead_state & crm_chat_messages untuk isolasi per user ID
ALTER TABLE crm_lead_state
  ADD COLUMN IF NOT EXISTS owner_sales_id BIGINT REFERENCES crm_users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS crm_lead_state_owner_sales_idx ON crm_lead_state (owner_sales_id);

UPDATE crm_lead_state cls
   SET owner_sales_id = u.id
  FROM crm_users u
 WHERE cls.owner_sales_id IS NULL
   AND cls.owner IS NOT NULL
   AND lower(cls.owner) = lower(u.name);

UPDATE crm_lead_state cls
   SET owner_sales_id = u.id,
       owner = COALESCE(cls.owner, l.assigned_to)
  FROM leads l
  JOIN crm_users u ON lower(u.name) = lower(l.assigned_to)
 WHERE cls.tracking_code = l.tracking_code
   AND cls.owner_sales_id IS NULL;

ALTER TABLE crm_chat_messages
  ADD COLUMN IF NOT EXISTS owner_sales_id BIGINT REFERENCES crm_users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS crm_chat_messages_owner_sales_idx ON crm_chat_messages (owner_sales_id);

UPDATE crm_chat_messages m
   SET owner_sales_id = u.id
  FROM crm_users u
 WHERE m.owner_sales_id IS NULL
   AND m.busdev_name IS NOT NULL
   AND lower(m.busdev_name) = lower(u.name);

UPDATE crm_chat_messages m
   SET owner_sales_id = u.id,
       busdev_name = COALESCE(m.busdev_name, l.assigned_to)
  FROM leads l
  JOIN crm_users u ON lower(u.name) = lower(l.assigned_to)
 WHERE m.owner_sales_id IS NULL
   AND (m.tracking_code = l.tracking_code OR m.phone = l.wa_phone OR m.phone = l.hp);

-- 3. Fungsi konteks sesi untuk Row Level Security (RLS)
CREATE OR REPLACE FUNCTION crm_current_user_id()
RETURNS BIGINT
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.current_user_id', true), '')::BIGINT;
$$;

CREATE OR REPLACE FUNCTION crm_current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
  -- Jika app.current_user_role tidak di-set (mis. webhook/background worker), default ke 'system'
  SELECT COALESCE(NULLIF(current_setting('app.current_user_role', true), ''), 'system');
$$;

CREATE OR REPLACE FUNCTION crm_current_user_name()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.current_user_name', true), '');
$$;

-- 4. Role aplikasi non-superuser agar RLS tidak ter-bypass oleh superuser saat SET LOCAL ROLE dipakai
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'crm_app_role') THEN
    CREATE ROLE crm_app_role NOLOGIN;
  END IF;
EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE NOTICE 'Melewati pembuatan crm_app_role (insufficient_privilege)';
END
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'crm_app_role') THEN
    EXECUTE format('GRANT USAGE ON SCHEMA public TO crm_app_role');
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO crm_app_role');
    EXECUTE format('GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO crm_app_role');
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Melewati GRANT ke crm_app_role: %', SQLERRM;
END
$$;

-- 5. Aktifkan Row Level Security pada crm_lead_state dan crm_chat_messages
ALTER TABLE crm_lead_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_lead_state FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS crm_lead_state_isolation_policy ON crm_lead_state;
CREATE POLICY crm_lead_state_isolation_policy ON crm_lead_state
  FOR ALL
  USING (
    crm_current_user_role() IN ('admin', 'head', 'system')
    OR owner_sales_id = crm_current_user_id()
    OR (owner IS NOT NULL AND lower(owner) = lower(COALESCE(crm_current_user_name(), '')))
  )
  WITH CHECK (
    crm_current_user_role() IN ('admin', 'head', 'system')
    OR owner_sales_id = crm_current_user_id()
    OR (owner IS NOT NULL AND lower(owner) = lower(COALESCE(crm_current_user_name(), '')))
  );

ALTER TABLE crm_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_chat_messages FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS crm_chat_messages_isolation_policy ON crm_chat_messages;
CREATE POLICY crm_chat_messages_isolation_policy ON crm_chat_messages
  FOR ALL
  USING (
    crm_current_user_role() IN ('admin', 'head', 'system')
    OR owner_sales_id = crm_current_user_id()
    OR (busdev_name IS NOT NULL AND lower(busdev_name) = lower(COALESCE(crm_current_user_name(), '')))
  )
  WITH CHECK (
    crm_current_user_role() IN ('admin', 'head', 'system')
    OR owner_sales_id = crm_current_user_id()
    OR (busdev_name IS NOT NULL AND lower(busdev_name) = lower(COALESCE(crm_current_user_name(), '')))
  );

COMMIT;

