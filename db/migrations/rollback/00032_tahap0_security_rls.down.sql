-- ============================================================
-- 00032_tahap0_security_rls.down.sql
-- Rollback untuk 00032_tahap0_security_rls.sql
-- ============================================================

BEGIN;

SET LOCAL lock_timeout = '10s';

DROP POLICY IF EXISTS crm_chat_messages_isolation_policy ON crm_chat_messages;
ALTER TABLE crm_chat_messages NO FORCE ROW LEVEL SECURITY;
ALTER TABLE crm_chat_messages DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS crm_lead_state_isolation_policy ON crm_lead_state;
ALTER TABLE crm_lead_state NO FORCE ROW LEVEL SECURITY;
ALTER TABLE crm_lead_state DISABLE ROW LEVEL SECURITY;

DROP FUNCTION IF EXISTS crm_current_user_name();
DROP FUNCTION IF EXISTS crm_current_user_role();
DROP FUNCTION IF EXISTS crm_current_user_id();

ALTER TABLE crm_chat_messages DROP COLUMN IF EXISTS owner_sales_id;
ALTER TABLE crm_lead_state DROP COLUMN IF EXISTS owner_sales_id;
ALTER TABLE crm_users DROP COLUMN IF EXISTS busdev_id;

ALTER TABLE crm_users DROP CONSTRAINT IF EXISTS crm_users_role_check;
UPDATE crm_users SET role = 'head' WHERE role = 'admin';
UPDATE crm_users SET role = 'sales' WHERE role = 'busdev';
ALTER TABLE crm_users ADD CONSTRAINT crm_users_role_check
  CHECK (role IN ('head', 'sales'));

COMMIT;

