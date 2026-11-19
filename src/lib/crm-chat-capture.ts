/**
 * Penangkapan pesan WhatsApp ke crm_chat_messages (Live Chat CRM) — tugas Web Developer Dreamlab #2.1.
 *
 * Murni + satu fungsi simpan. Dipakai jalur Meta (/api/lead-capture/confirm) dan Convia (/api/lead-capture/convia):
 *  - pesan MASUK dari lead (customer) dan pesan KELUAR dari sales (busdev) sama-sama disimpan, jadi percakapan dua arah
 *    tampil utuh dan terhitung untuk otomasi Warm;
 *  - pesan tanpa teks (gambar, suara, stiker, lokasi, dokumen) tetap disimpan dengan penanda "[Gambar]" dst., supaya
 *    balasan lead berupa media tidak hilang dari percakapan.
 */
import type { Pool } from 'pg';

export const MEDIA_LABEL: Record<string, string> = {
  image: '[Gambar]',
  audio: '[Pesan suara]',
  voice: '[Pesan suara]',
  ptt: '[Pesan suara]',
  video: '[Video]',
  document: '[Dokumen]',
  sticker: '[Stiker]',
  location: '[Lokasi]',
  contacts: '[Kontak]',
  button: '[Tombol]',
  interactive: '[Pesan interaktif]',
  order: '[Pesanan]',
};

/** Jenis pesan yang BUKAN percakapan (tidak disimpan). */
const NON_CHAT = new Set(['revoke', 'edit', 'reaction', 'unsupported', 'system', 'request_welcome', 'ephemeral']);

export const isNonChatType = (t: string | null | undefined): boolean => NON_CHAT.has(String(t || '').toLowerCase());

/** Teks yang ditampilkan untuk satu pesan; null bila bukan percakapan atau tidak ada yang bisa ditampilkan. */
export function chatDisplayText(text: string | null | undefined, type: string | null | undefined): string | null {
  const ty = String(type || '').toLowerCase();
  if (isNonChatType(ty)) return null;
  const t = typeof text === 'string' ? text.trim() : '';
  if (t) return t.slice(0, 4000);
  if (!ty || ty === 'text') return null;
  return MEDIA_LABEL[ty] ?? `[${ty}]`;
}

/** Ambil teks dari satu objek pesan Meta Cloud API (value.messages[0] atau value.message_echoes[0]). */
export function extractMetaText(msg: any): { text: string | null; type: string } {
  const type = String(msg?.type || (msg?.text ? 'text' : '') || '').toLowerCase();
  const text =
    msg?.text?.body ||
    msg?.button?.text ||
    msg?.interactive?.button_reply?.title ||
    msg?.interactive?.list_reply?.title ||
    msg?.image?.caption ||
    msg?.video?.caption ||
    msg?.document?.caption ||
    null;
  return { text: typeof text === 'string' && text.trim() ? text.trim() : null, type };
}

/** Normalisasi nomor ke format 62xxxxxxxx (digit saja). Mengembalikan null bila terlalu pendek. */
export function normalizeChatPhone(raw: unknown): string | null {
  if (raw == null) return null;
  let d = String(raw).replace(/[^0-9]/g, '');
  if (d.startsWith('0')) d = '62' + d.slice(1);
  return d.length >= 9 ? d : null;
}

export interface ChatRecord {
  phone: string;
  direction: 'inbound' | 'outbound';
  text: string;
  wamid?: string | null;
  trackingCode?: string | null;
  senderName?: string | null;
  busdevName?: string | null;
}

/** Simpan satu pesan. Idempoten per wamid. Mengembalikan true bila baris baru tersimpan. */
export async function recordChatMessage(pool: Pick<Pool, 'query'>, r: ChatRecord): Promise<boolean> {
  const inbound = r.direction === 'inbound';
  const res = await pool.query(
    `INSERT INTO crm_chat_messages
       (tracking_code, phone, sender_type, sender_name, message_text, wamid, status, direction, channel, busdev_name, is_read, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, 'delivered', $7, 'whatsapp', $8, $9, NOW())
     ON CONFLICT (wamid) DO NOTHING
     RETURNING id`,
    [
      r.trackingCode || null,
      r.phone,
      inbound ? 'customer' : 'busdev',
      r.senderName || null,
      r.text,
      r.wamid || null,
      r.direction,
      r.busdevName && r.busdevName !== 'Unassigned' ? r.busdevName : null,
      !inbound,
    ]
  );
  return (res.rowCount ?? 0) > 0;
}
