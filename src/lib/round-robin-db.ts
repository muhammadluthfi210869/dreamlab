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
export async function getNextAgentFromDb(visitorId?: string | null, isTest?: boolean): Promise<DbAgent> {
  const client = await pool.connect();
  try {
    const res = await client.query<{
      agent_id: number;
      agent_name: string;
      agent_phone: string;
      order_index: number;
    }>(
      `SELECT agent_id, agent_name, agent_phone, order_index
         FROM assign_next_agent($1, $2)`,
      [visitorId || null, isTest || false]
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
  /** Kode tracking deterministik (mis. dari event_id) untuk idempotensi. */
  trackingCode?: string;
  isTest?: boolean;
}

export interface TrackResult {
  trackingCode: string;
  waUrl: string;
}

/** Simpan lead ke tabel `leads` (dipanggil server-side dari API route). */
export async function insertLead(data: LeadInput): Promise<TrackResult> {
  const trackingCode = data.trackingCode || generateTrackingCode();
  const waUrl = data.assignedPhone
    ? `https://wa.me/${normalizePhone(data.assignedPhone)}`
    : '';

  const vid = data.visitorId || null;

  // Dedup 24 jam: visitor yang SAMA konversi lagi dalam 24 jam
  // cukup increment visit_count, jangan bikin lead baru.
  if (vid && !data.isTest) {
    const existing = await pool.query<{ tracking_code: string }>(
      `SELECT tracking_code
         FROM leads
        WHERE visitor_id = $1
          AND created_at > NOW() - INTERVAL '24 hours'
          AND is_test IS NOT TRUE
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
        session_id, intent, visitor_id, visit_count, nama, perusahaan, hp, produk, is_test)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
     ON CONFLICT (tracking_code) DO NOTHING`,
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
      1,
      data.nama ?? null,
      data.perusahaan ?? null,
      data.hp ?? null,
      data.produk ?? null,
      data.isTest || false,
    ]
  );

  return { trackingCode, waUrl };
}

export interface ConvertLeadResult {
  id: string;
  name: string;
  phoneNumber: string; // format internasional 628... (siap wa.me)
  orderIndex: number;
  trackingCode: string;
  waUrl: string;
}

/**
 * Endpoint gabungan (POST /api/lead-capture/convert): assign CS
 * (sticky/rotasi) + simpan lead (dedup) dalam SATU panggilan DB.
 *
 * Ini pengganti alur lama "getNextAgentFromDb() lalu insertLead()" yang butuh
 * 2 API call + 3 query DB. Fungsi DB assign_and_insert_lead() melakukan
 * semuanya server-side → 1 API call + 1 query → latency jauh lebih rendah.
 */
export async function convertLead(data: LeadInput): Promise<ConvertLeadResult> {
  const res = await pool.query<{
    agent_id: number;
    agent_name: string;
    agent_phone: string;
    order_index: number;
    tracking_code: string;
    wa_url: string;
  }>(
    `SELECT agent_id, agent_name, agent_phone, order_index, tracking_code, wa_url
       FROM assign_and_insert_lead($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
    [
      data.visitorId || null,
      data.intent ?? null,
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
      data.nama ?? null,
      data.perusahaan ?? null,
      data.hp ?? null,
      data.produk ?? null,
      data.isTest || false,
    ]
  );

  const row = res.rows[0];
  if (!row) {
    throw new Error('assign_and_insert_lead tidak mengembalikan hasil');
  }

  return {
    id: String(row.agent_id),
    name: row.agent_name || `CS ${row.agent_id}`,
    phoneNumber: normalizePhone(row.agent_phone),
    orderIndex: row.order_index,
    trackingCode: row.tracking_code,
    waUrl: row.wa_url,
  };
}

export interface DbLeadStats {
  countsByAgentId: Record<string, number>; // busdev id -> jumlah lead
  totalLeads: number;
  totalRotations: number; // jumlah visitor unik yang pernah di-assign
}

export interface WaveAuditAgent {
  agentId: string;
  agentName: string;
  agentPhone: string;
  dailyLeads: number;
  weeklyLeads: number;
  lastLeadTime: string | null;
  currentWave: number;
  targetLeadsForWave: number;
  leadsToTarget: number;
  priorityRank: number;
  isEligibleNext: boolean;
  guardStatus: string;
}

export interface WaveAuditStatus {
  batchSize: number;
  maxSpread: number;
  isBalanced: boolean;
  activeAgents: WaveAuditAgent[];
}

/** Audit status Wave / Batch Quota Allocation */
export async function getRoundRobinWaveStatus(batchSize: number = 3): Promise<WaveAuditStatus> {
  const res = await pool.query<{
    agent_id: string;
    agent_name: string;
    agent_phone: string;
    daily_leads: number;
    weekly_leads: number;
    last_lead_time: string | null;
    current_wave: number;
    target_leads_for_wave: number;
    leads_to_target: number;
    max_spread: number;
    priority_rank: number;
    is_eligible_next: boolean;
    guard_status: string;
  }>('SELECT * FROM get_round_robin_wave_status($1)', [batchSize]);

  const maxSpread = res.rows.length > 0 ? Number(res.rows[0].max_spread) : 0;
  return {
    batchSize,
    maxSpread,
    isBalanced: maxSpread <= 1,
    activeAgents: res.rows.map((r) => ({
      agentId: String(r.agent_id),
      agentName: r.agent_name,
      agentPhone: r.agent_phone,
      dailyLeads: Number(r.daily_leads),
      weeklyLeads: Number(r.weekly_leads),
      lastLeadTime: r.last_lead_time,
      currentWave: Number(r.current_wave),
      targetLeadsForWave: Number(r.target_leads_for_wave),
      leadsToTarget: Number(r.leads_to_target),
      priorityRank: Number(r.priority_rank),
      isEligibleNext: Boolean(r.is_eligible_next),
      guardStatus: r.guard_status,
    })),
  };
}

/** Statistik dari DB (pengganti Redis lama yang sudah stale). */
export async function getDbLeadStats(): Promise<DbLeadStats> {
  const agentRes = await pool.query<{ agent_id: string; count: number }>(
    `SELECT COALESCE(b.id::text, 'unknown') AS agent_id, count(l.id)::int AS count
       FROM leads l
       LEFT JOIN busdevs b ON b.name = l.assigned_to
      WHERE l.is_test IS NOT TRUE
      GROUP BY COALESCE(b.id::text, 'unknown')
      ORDER BY agent_id`
  );
  const countsByAgentId: Record<string, number> = {};
  for (const r of agentRes.rows) {
    countsByAgentId[r.agent_id] = Number(r.count);
  }

  const totalRes = await pool.query<{ total: number }>(
    `SELECT count(*)::int AS total FROM leads WHERE is_test IS NOT TRUE`
  );
  const rotRes = await pool.query<{ n: number }>(
    `SELECT count(*)::int AS n FROM visitor_assignments`
  );

  return {
    countsByAgentId,
    totalLeads: Number(totalRes.rows[0]?.total ?? 0),
    totalRotations: Number(rotRes.rows[0]?.n ?? 0),
  };
}

