import pool from './db';

/**
 * round-robin-db.ts
 *
 * Sumber kebenaran baru untuk distribusi lead: PostgreSQL dedicated
 * (database `dreamlab`), TERPISAH dari server ERP.
 *
 * - getNextAgentFromDb(visitorId) → ambil CS (sticky: 1 visitor = 1 CS,
 *     counter hanya maju untuk visitor BARU) via RPC assign_next_agent()
 * - insertLead()                  → simpan lead ke tabel `leads` + dedup
 * - normalizePhone()              → ubah format lokal (0xxx) jadi internasional (628xx)
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

/**
 * Ambil CS berikutnya secara atomik.
 *
 * Sticky: kalau `visitorId` sudah punya assignment aktif di
 * visitor_assignments, dikembalikan CS yang SAMA tanpa memajukan counter.
 * Hanya visitor BARU yang memajukan counter rotasi.
 *
 * `visitorId` null/'' → tetap rotasi biasa (tanpa sticky) sebagai fallback.
 */
export async function getNextAgentFromDb(visitorId?: string | null): Promise<DbAgent> {
  const client = await pool.connect();
  try {
    const res = await client.query<{
      agent_id: number;
      agent_name: string;
      agent_phone: string;
      order_index: number;
    }>(
      `SELECT agent_id, agent_name, agent_phone, order_index
         FROM assign_next_agent($1)`,
      [visitorId || null]
    );

    const row = res.rows[0];
    if (!row) {
      throw new Error('assign_next_agent tidak mengembalikan agent');
    }

    return {
      id: String(row.agent_id),
      name: row.agent_name || `CS ${row.agent_id}`,
      phoneNumber: normalizePhone(row.agent_phone),
      orderIndex: row.order_index,
    };
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

export interface LeadInput {
  intent?: string;
  source?: string; // channel: organic | google-ads | metaads | medsos | direct | wa-button
  visitorId?: string | null; // identitas visitor (untuk sticky + dedup)
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

  const vid = data.visitorId || null;

  // Dedup: visitor yang SAMA konversi lagi dalam 2 menit (double-click,
  // re-render, navigasi cepat) → jangan buat lead baru, balas kode lama.
  if (vid) {
    const existing = await pool.query<{ tracking_code: string }>(
      `SELECT tracking_code
         FROM leads
        WHERE visitor_id = $1
          AND created_at > NOW() - INTERVAL '2 minutes'
        ORDER BY id DESC
        LIMIT 1`,
      [vid]
    );
    if (existing.rows[0]) {
      await pool.query(
        `UPDATE leads SET visit_count = visit_count + 1 WHERE tracking_code = $1`,
        [existing.rows[0].tracking_code]
      );
      return { trackingCode: existing.rows[0].tracking_code, waUrl };
    }
  }

  await pool.query(
    `INSERT INTO leads
       (tracking_code, assigned_to, assigned_phone, source, page_url, page_title,
        referrer, utm_source, utm_medium, utm_campaign, device_type, browser,
        session_id, intent, visitor_id, visit_count, nama, perusahaan, hp, produk)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`,
    [
      trackingCode,
      data.assignedName ?? null,
      data.assignedPhone ? normalizePhone(data.assignedPhone) : null,
      data.source ?? 'direct',
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
      vid,
      1, // visit_count
      data.nama ?? null,
      data.perusahaan ?? null,
      data.hp ?? null,
      data.produk ?? null,
    ]
  );

  return { trackingCode, waUrl };
}
