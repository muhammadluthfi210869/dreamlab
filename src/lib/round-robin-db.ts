import pool from './db';

/**
 * round-robin-db.ts
 *
 * Sumber kebenaran baru untuk distribusi lead: PostgreSQL dedicated
 * (database `dreamlab`), TERPISAH dari server ERP.
 *
 * - getNextAgentFromDb() → ambil CS berikutnya via increment_rr_counter()
 * - insertLead()          → simpan lead ke tabel `leads` + return tracking code
 * - normalizePhone()      → ubah format lokal (0xxx) jadi internasional (628xx)
 */

export interface DbAgent {
  id: string;
  name: string;
  phoneNumber: string; // format internasional 628... (siap dipakai wa.me)
  orderIndex: number;
}

export function normalizePhone(phone: string): string {
  let cleaned = (phone ?? '').replace(/[\s\-\(\)\+]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  return cleaned;
}

function generateTrackingCode(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(
    d.getDate()
  ).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `DL-${ymd}-${rand}`;
}

/** Ambil CS berikutnya secara atomik (round-robin). */
export async function getNextAgentFromDb(): Promise<DbAgent> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const rpc = await client.query<{ idx: number }>('SELECT increment_rr_counter() AS idx');
    const idx = Number(rpc.rows[0]?.idx ?? 0);

    const res = await client.query<{ id: number; phone: string; name: string }>(
      `SELECT id, phone, name
         FROM busdevs
        WHERE is_active = true
        ORDER BY id
        LIMIT 1 OFFSET $1`,
      [idx]
    );

    if (res.rows.length === 0) {
      throw new Error('Tidak ada busdev aktif di tabel busdevs');
    }

    await client.query('COMMIT');

    const row = res.rows[0];
    return {
      id: String(row.id),
      name: row.name || `CS ${row.id}`,
      phoneNumber: normalizePhone(row.phone),
      orderIndex: idx,
    };
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

export interface LeadInput {
  intent?: string;
  pageUrl?: string;
  pageTitle?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  deviceType?: string;
  browser?: string;
  sessionId?: string;
  assignedName?: string;
  assignedPhone?: string;
  nama?: string;
  perusahaan?: string;
  hp?: string;
  produk?: string;
}

export interface TrackResult {
  trackingCode: string;
  waUrl: string;
}

/** Simpan lead ke tabel `leads` (dipanggil server-side dari API route). */
export async function insertLead(data: LeadInput): Promise<TrackResult> {
  const trackingCode = generateTrackingCode();
  const waUrl = data.assignedPhone
    ? `https://wa.me/${normalizePhone(data.assignedPhone)}`
    : '';

  await pool.query(
    `INSERT INTO leads
       (tracking_code, assigned_to, assigned_phone, source, page_url, page_title,
        referrer, utm_source, utm_medium, utm_campaign, device_type, browser,
        session_id, intent, nama, perusahaan, hp, produk)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
    [
      trackingCode,
      data.assignedName ?? null,
      data.assignedPhone ? normalizePhone(data.assignedPhone) : null,
      data.intent ?? null,
      data.pageUrl ?? null,
      data.pageTitle ?? null,
      data.referrer ?? null,
      data.utmSource ?? null,
      data.utmMedium ?? null,
      data.utmCampaign ?? null,
      data.deviceType ?? null,
      data.browser ?? null,
      data.sessionId ?? null,
      data.intent ?? null,
      data.nama ?? null,
      data.perusahaan ?? null,
      data.hp ?? null,
      data.produk ?? null,
    ]
  );

  return { trackingCode, waUrl };
}
