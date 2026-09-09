import { Pool } from 'pg';
import crypto from 'crypto';
import { getActiveBusdev } from './busdev';

/**
 * neon.ts
 *
 * Koneksi dan operasi database Neon PostgreSQL untuk pencatatan audit log
 * tabel lead_assignments serta atomic fallback bila Redis tidak tersedia.
 */

function getConnectionString(): string | undefined {
  return (
    process.env.database_DATABASE_URL ||
    process.env.database_POSTGRES_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL
  );
}

let _neonPool: Pool | null = null;

export function getNeonPool(): Pool | null {
  if (_neonPool) return _neonPool;

  const connectionString = getConnectionString();
  if (!connectionString) {
    return null;
  }

  try {
    const u = new URL(connectionString);
    const sslMode = u.searchParams.get('sslmode') ?? '';
    let ssl: { rejectUnauthorized: boolean } | undefined = undefined;

    if (sslMode === 'require' || u.hostname.includes('neon.tech') || u.hostname.includes('pooler')) {
      ssl = { rejectUnauthorized: false };
    } else if (sslMode === 'verify-ca' || sslMode === 'verify-full') {
      ssl = { rejectUnauthorized: true };
    }

    _neonPool = new Pool({
      host: u.hostname,
      port: Number(u.port || 5432),
      database: decodeURIComponent(u.pathname.replace(/^\//, '')),
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      ssl,
      max: Number(process.env.DATABASE_POOL_MAX ?? 5),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 3000,
      statement_timeout: 5000,
    });

    return _neonPool;
  } catch {
    return null;
  }
}

/**
 * Membuat hash SHA-256 dari IP address pengunjung (jangan simpan raw IP).
 */
export function hashIp(ip?: string | null): string | null {
  if (!ip || ip.trim() === '') return null;
  return crypto.createHash('sha256').update(ip.trim()).digest('hex');
}

export interface LeadAssignmentRecord {
  id: string;
  eventId: string;
  source: string;
  landingPage?: string | null;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  messageKey?: string | null;
  salesId: string;
  salesName: string;
  salesPhone: string;
  status: 'assigned' | 'fallback';
  userAgent?: string | null;
  ipHash?: string | null;
}

export interface RecordAssignmentResult {
  success: boolean;
  error?: string;
}

/**
 * Menyimpan assignment WhatsApp ke tabel lead_assignments secara parameterized.
 * Idempotent terhadap event_id jika terjadi request bersamaan.
 * Tidak menelan error: mencatat error secara terstruktur dan aman.
 */
export async function recordLeadAssignment(
  record: LeadAssignmentRecord
): Promise<RecordAssignmentResult> {
  const pool = getNeonPool();
  if (!pool) {
    const error = 'Neon pool not configured (check DATABASE_URL in Vercel)';
    console.error(`[Neon Audit Log] ${error}`);
    return { success: false, error };
  }

  const query = `
    INSERT INTO lead_assignments (
      id,
      event_id,
      source,
      landing_page,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
      message_key,
      sales_id,
      sales_name,
      sales_phone,
      status,
      assigned_at,
      user_agent,
      ip_hash
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), $14, $15
    )
    ON CONFLICT (event_id) DO NOTHING;
  `;

  const values = [
    record.id,
    record.eventId,
    record.source,
    record.landingPage || null,
    record.referrer || null,
    record.utmSource || null,
    record.utmMedium || null,
    record.utmCampaign || null,
    record.messageKey || null,
    record.salesId,
    record.salesName,
    record.salesPhone,
    record.status,
    record.userAgent || null,
    record.ipHash || null,
  ];

  try {
    await pool.query(query, values);
    return { success: true };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('[Neon Audit Log] Gagal mencatat assignment ke database:', {
      eventId: record.eventId,
      source: record.source,
      salesId: record.salesId,
      error: errMsg,
    });
    return { success: false, error: errMsg };
  }
}

/**
 * Mencari assignment yang sudah pernah tercatat untuk eventId (idempotensi di level DB).
 */
export async function findAssignmentByEventId(
  eventId: string
): Promise<LeadAssignmentRecord | null> {
  const pool = getNeonPool();
  if (!pool) return null;

  try {
    const res = await pool.query(
      `SELECT
        id,
        event_id AS "eventId",
        source,
        landing_page AS "landingPage",
        referrer,
        utm_source AS "utmSource",
        utm_medium AS "utmMedium",
        utm_campaign AS "utmCampaign",
        message_key AS "messageKey",
        sales_id AS "salesId",
        sales_name AS "salesName",
        sales_phone AS "salesPhone",
        status,
        user_agent AS "userAgent",
        ip_hash AS "ipHash"
      FROM lead_assignments
      WHERE event_id = $1
      LIMIT 1`,
      [eventId]
    );

    if (res.rows.length > 0) {
      return res.rows[0] as LeadAssignmentRecord;
    }
    return null;
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('[Neon DB] findAssignmentByEventId error:', errMsg);
    return null;
  }
}

export interface NeonAtomicAssignmentResult {
  record: LeadAssignmentRecord;
  isExisting: boolean;
}

/**
 * Fallback atomik rotasi via Neon PostgreSQL saat Upstash Redis gagal.
 * Menggunakan Postgres advisory transaction lock.
 * Pemilihan BusDev DAN penyimpanan assignment WAJIB terjadi dalam SATU
 * transaksi sebelum COMMIT, mencegah race condition counter antar request concurrent.
 */
const _memoryFallbackAssignments = new Map<string, LeadAssignmentRecord>();
let _neonFallbackCounter = 0;

export async function assignAndRecordLeadViaNeonAtomic(params: {
  id: string;
  eventId: string;
  source: string;
  landingPage?: string | null;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  messageKey?: string | null;
  userAgent?: string | null;
  ipHash?: string | null;
}): Promise<NeonAtomicAssignmentResult> {
  const activeBusdev = getActiveBusdev();
  const pool = getNeonPool();

  if (!pool) {
    // In-memory fallback untuk lingkungan lokal / test / emergency failover
    if (_memoryFallbackAssignments.has(params.eventId)) {
      return {
        record: _memoryFallbackAssignments.get(params.eventId)!,
        isExisting: true,
      };
    }

    _neonFallbackCounter++;
    const selectedIndex = (_neonFallbackCounter - 1) % activeBusdev.length;
    const fallbackBusdev = activeBusdev[selectedIndex];

    const fallbackRecord: LeadAssignmentRecord = {
      id: params.id,
      eventId: params.eventId,
      source: params.source,
      landingPage: params.landingPage,
      referrer: params.referrer,
      utmSource: params.utmSource,
      utmMedium: params.utmMedium,
      utmCampaign: params.utmCampaign,
      messageKey: params.messageKey,
      salesId: fallbackBusdev.id,
      salesName: fallbackBusdev.name,
      salesPhone: fallbackBusdev.phone,
      status: 'fallback',
      userAgent: params.userAgent,
      ipHash: params.ipHash,
    };

    _memoryFallbackAssignments.set(params.eventId, fallbackRecord);
    return { record: fallbackRecord, isExisting: false };
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Advisory lock key deterministik untuk round-robin Dreamlab: 981273912
    await client.query('SELECT pg_advisory_xact_lock(981273912)');

    // 1. Periksa apakah eventId sudah ada di lead_assignments di dalam lock
    const existingRes = await client.query(
      `SELECT
        id,
        event_id AS "eventId",
        source,
        landing_page AS "landingPage",
        referrer,
        utm_source AS "utmSource",
        utm_medium AS "utmMedium",
        utm_campaign AS "utmCampaign",
        message_key AS "messageKey",
        sales_id AS "salesId",
        sales_name AS "salesName",
        sales_phone AS "salesPhone",
        status,
        user_agent AS "userAgent",
        ip_hash AS "ipHash"
      FROM lead_assignments
      WHERE event_id = $1
      LIMIT 1`,
      [params.eventId]
    );

    if (existingRes.rows.length > 0) {
      await client.query('COMMIT');
      return {
        record: existingRes.rows[0] as LeadAssignmentRecord,
        isExisting: true,
      };
    }

    // 2. Hitung total assignments yang sudah ada untuk mendapatkan index rotasi berikutnya
    const countRes = await client.query(
      'SELECT COUNT(*)::integer AS total FROM lead_assignments'
    );
    const total = Number(countRes.rows[0]?.total ?? 0);
    const selectedBusDev = activeBusdev[total % activeBusdev.length];

    const record: LeadAssignmentRecord = {
      id: params.id,
      eventId: params.eventId,
      source: params.source,
      landingPage: params.landingPage,
      referrer: params.referrer,
      utmSource: params.utmSource,
      utmMedium: params.utmMedium,
      utmCampaign: params.utmCampaign,
      messageKey: params.messageKey,
      salesId: selectedBusDev.id,
      salesName: selectedBusDev.name,
      salesPhone: selectedBusDev.phone,
      status: 'assigned',
      userAgent: params.userAgent,
      ipHash: params.ipHash,
    };

    // 3. Simpan assignment ke tabel lead_assignments dalam transaksi yang SAMA sebelum COMMIT
    await client.query(
      `INSERT INTO lead_assignments (
        id,
        event_id,
        source,
        landing_page,
        referrer,
        utm_source,
        utm_medium,
        utm_campaign,
        message_key,
        sales_id,
        sales_name,
        sales_phone,
        status,
        assigned_at,
        user_agent,
        ip_hash
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), $14, $15
      )`,
      [
        record.id,
        record.eventId,
        record.source,
        record.landingPage || null,
        record.referrer || null,
        record.utmSource || null,
        record.utmMedium || null,
        record.utmCampaign || null,
        record.messageKey || null,
        record.salesId,
        record.salesName,
        record.salesPhone,
        record.status,
        record.userAgent || null,
        record.ipHash || null,
      ]
    );

    // 4. COMMIT keduanya sekaligus
    await client.query('COMMIT');
    return { record, isExisting: false };
  } catch (err: unknown) {
    await client.query('ROLLBACK').catch(() => {});
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('[Neon DB] Transaksi assignAndRecordLeadViaNeonAtomic gagal, rollback:', errMsg);
    throw err;
  } finally {
    client.release();
  }
}
