import crypto from 'node:crypto';

/**
 * convia-webhook.ts
 *
 * Verifikasi tanda tangan + normalisasi payload webhook Convia (docs.convia.id).
 * Dua bentuk payload didukung karena akun bisa memakai salah satunya:
 *  - Webhook paket CRM       : { event_type, data: { customer_phone, content, business_phone, wam_id, ... } }
 *    header X-Webhook-Signature: sha256=<hex>
 *  - Webhook Forwarding      : { type, source: { identifier, identifierDisplay }, data: { contact, message } }
 *    header X-Convia-Signature : <hex>
 *
 * Murni fungsi (tanpa I/O) supaya mudah dites.
 */

export interface NormalizedConviaMessage {
  shape: 'crm' | 'forwarding';
  eventType: string;
  direction: string;
  channel: string;
  messageType: string;
  isHistory: boolean;
  text: string | null;
  phone: string | null;
  name: string | null;
  businessPhone: string | null;
  /** Phone Number ID milik Meta. Hanya ada di bentuk Forwarding. */
  phoneNumberId: string | null;
  wamid: string | null;
  messageId: string | null;
}

export type SkipReason =
  | 'not-message-received'
  | 'not-inbound'
  | 'not-whatsapp'
  | 'history-sync'
  | 'non-chat-message'
  | 'empty';

/** Tipe pesan yang bukan chat awal pelanggan: dihapus, diedit, atau reaksi. */
const NON_CHAT_TYPES = new Set(['revoke', 'edit', 'reaction']);

function timingSafeEqualStr(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

/**
 * Cocokkan HMAC-SHA256(rawBody, secret) dengan header tanda tangan.
 * Header boleh berawalan "sha256=" (CRM) atau hex polos (Forwarding).
 * Gagal-tertutup: secret/header kosong = tidak valid.
 */
export function verifyConviaSignature(
  rawBody: string,
  headers: { get(name: string): string | null },
  secret: string | undefined | null
): boolean {
  if (!secret) return false;
  const provided = headers.get('x-webhook-signature') || headers.get('x-convia-signature');
  if (!provided) return false;

  const expectedHex = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const normalized = provided.trim().replace(/^sha256=/i, '').toLowerCase();
  return timingSafeEqualStr(normalized, expectedHex);
}

const str = (v: unknown): string | null =>
  typeof v === 'string' && v.trim() !== '' ? v.trim() : v == null || typeof v === 'object' ? null : String(v);

/** Ubah payload mentah (kedua bentuk) menjadi satu bentuk seragam. Null bila bentuknya tidak dikenal. */
export function normalizeConviaEvent(body: any): NormalizedConviaMessage | null {
  if (!body || typeof body !== 'object') return null;

  // Bentuk Forwarding
  if (body.type && body.data?.message) {
    const m = body.data.message;
    return {
      shape: 'forwarding',
      eventType: String(body.type),
      direction: 'inbound', // Forwarding hanya mengirim pesan masuk
      channel: str(body.source?.channel) || 'whatsapp',
      messageType: str(m.type) || 'text',
      isHistory: false,
      text: str(m.text) || str(m.caption),
      phone: str(body.data.contact?.id),
      name: str(body.data.contact?.name),
      businessPhone: str(body.source?.identifierDisplay),
      phoneNumberId: str(body.source?.identifier),
      wamid: str(m.id),
      messageId: str(m.id),
    };
  }

  // Bentuk CRM
  if (body.event_type && body.data) {
    const d = body.data;
    return {
      shape: 'crm',
      eventType: String(body.event_type),
      direction: str(d.direction) || 'inbound',
      channel: str(d.channel) || 'whatsapp',
      messageType: str(d.message_type) || 'text',
      isHistory: d.is_history_message === true,
      text: str(d.content),
      phone: str(d.customer_phone),
      name: str(d.customer_name),
      businessPhone: str(d.business_phone),
      phoneNumberId: null, // phone_number_id di bentuk CRM adalah ID internal Convia, bukan ID Meta
      wamid: str(d.wam_id),
      messageId: str(d.message_id),
    };
  }

  return null;
}

/** Alasan event harus dilewati (balas 200 tanpa konfirmasi), atau null bila layak diproses. */
export function skipReason(ev: NormalizedConviaMessage): SkipReason | null {
  if (ev.eventType !== 'message.received') return 'not-message-received';
  if (ev.direction !== 'inbound') return 'not-inbound';
  if (ev.channel !== 'whatsapp') return 'not-whatsapp';
  if (ev.isHistory) return 'history-sync';
  if (NON_CHAT_TYPES.has(ev.messageType)) return 'non-chat-message';
  if (!ev.text) return 'empty';
  return null;
}
