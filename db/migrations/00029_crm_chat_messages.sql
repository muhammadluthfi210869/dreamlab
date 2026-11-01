-- ============================================================
-- 00029_crm_chat_messages.sql
--
-- Tabel percakapan Live Chat 2-arah (Inbound & Outbound) WABA CRM
-- Meniru tampilan inbox Kommo CRM Dreamlab (media_1793457539687.png)
-- ============================================================

BEGIN;

SET LOCAL lock_timeout = '5s';

CREATE TABLE IF NOT EXISTS crm_chat_messages (
  id            BIGSERIAL PRIMARY KEY,
  tracking_code TEXT,
  phone         TEXT NOT NULL,
  sender_type   TEXT NOT NULL CHECK (sender_type IN ('customer', 'busdev', 'system', 'salesbot')),
  sender_name   TEXT,
  message_text  TEXT NOT NULL,
  wamid         TEXT UNIQUE,
  status        TEXT NOT NULL DEFAULT 'delivered' CHECK (status IN ('sending', 'sent', 'delivered', 'read', 'failed')),
  media_url     TEXT,
  media_type    TEXT,
  direction     TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  channel       TEXT NOT NULL DEFAULT 'whatsapp' CHECK (channel IN ('whatsapp', 'tiktok', 'instagram')),
  busdev_name   TEXT,
  is_read       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS crm_chat_messages_phone_idx ON crm_chat_messages (phone, created_at ASC);
CREATE INDEX IF NOT EXISTS crm_chat_messages_tracking_idx ON crm_chat_messages (tracking_code, created_at ASC);
CREATE INDEX IF NOT EXISTS crm_chat_messages_busdev_idx ON crm_chat_messages (busdev_name, created_at DESC);
CREATE INDEX IF NOT EXISTS crm_chat_messages_unread_idx ON crm_chat_messages (busdev_name, is_read) WHERE is_read = FALSE;

-- Isi pesan awal dari data konfirmasi lead yang sudah ada di database leads
-- agar inbox langsung terisi percakapan riil
INSERT INTO crm_chat_messages (
  tracking_code,
  phone,
  sender_type,
  sender_name,
  message_text,
  status,
  direction,
  channel,
  busdev_name,
  is_read,
  created_at
)
SELECT
  l.tracking_code,
  COALESCE(NULLIF(l.whatsapp_phone_e164, ''), NULLIF(l.wa_phone, ''), NULLIF(l.hp, ''), '628123456789'),
  'customer',
  COALESCE(NULLIF(l.nama, ''), NULLIF(l.wa_profile_name, ''), 'Calon Klien'),
  COALESCE(NULLIF(l.wa_message, ''), 'Halo Dreamlab, saya tertarik untuk maklon kosmetik.'),
  'delivered',
  'inbound',
  'whatsapp',
  l.assigned_to,
  TRUE,
  COALESCE(l.confirmed_at, l.created_at, NOW())
FROM leads l
WHERE (l.confirmed_at IS NOT NULL OR l.status = 'confirmed')
  AND l.is_test IS NOT TRUE
  AND (l.wa_message IS NOT NULL OR l.wa_phone IS NOT NULL)
LIMIT 100
ON CONFLICT (id) DO NOTHING;

COMMIT;
