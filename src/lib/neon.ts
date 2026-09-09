import { Pool } from 'pg';
import crypto from 'crypto';
import { BusDevItem, getActiveBusdev } from './busdev';

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

/**
 * Menyimpan assignment WhatsApp ke tabel lead_assignments secara parameterized.
 * Idempotent terhadap event_id jika terjadi request bersamaan.
 */
export async function recordLeadAssignment(
  record: LeadAssignmentRecord
): Promise<boolean> {
  const pool = getNeonPool();
  if (!pool) return false;

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
    return true;
  } catch {
    return false;
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
  } catch {
    return null;
  }
}

/**
 * Fallback atomik rotasi via Neon PostgreSQL saat Upstash Redis gagal.
 * Menggunakan Postgres advisory transaction lock agar konkurensi tetap aman,
 * deterministik, dan adil tanpa Math.random() dan tanpa localStorage.
 */
export async function assignLeadViaNeonAtomic(): Promise<BusDevItem> {
  const activeBusdev = getActiveBusdev();
  const pool = getNeonPool();

  if (!pool) {
    // Jika Neon pool juga tidak tersedia, gunakan nomor fallback server-side pertama (Irma)
    return activeBusdev[0];
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Advisory lock key deterministik untuk round-robin Dreamlab: 981273912
    await client.query('SELECT pg_advisory_xact_lock(981273912)');

    // Hitung total assignments yang sudah ada untuk mendapatkan index rotasi berikutnya
    const countRes = await client.query(
      'SELECT COUNT(*)::integer AS total FROM lead_assignments'
    );
    const total = countRes.rows[0]?.total ?? 0;
    const index = total % activeBusdev.length;
    const selected = activeBusdev[index];

    await client.query('COMMIT');
    return selected;
  } catch {
    await client.query('ROLLBACK').catch(() => {});
    return activeBusdev[0];
  } finally {
    client.release();
  }
}
