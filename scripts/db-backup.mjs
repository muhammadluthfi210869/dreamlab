/**
 * scripts/db-backup.mjs
 *
 * Membuat backup penuh (read-only) dari tabel-tabel database Dreamlab CRM & Lead Capture
 * beserta definisi fungsi PL/pgSQL (`assign_and_insert_lead`, `assign_next_agent`, `rr_choose_agent`,
 * `increment_rr_counter`) ke folder lokal `scratch/backups/` (di-ignore oleh Git).
 *
 * Cara pakai:
 *   node scripts/db-backup.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.database_DATABASE_URL;

if (!connectionString) {
  console.error('Gagal: DATABASE_URL belum diatur di environment.');
  process.exit(1);
}

const u = new URL(connectionString);
const sslMode = u.searchParams.get('sslmode') ?? '';
const ssl =
  sslMode === 'require'
    ? { rejectUnauthorized: false }
    : sslMode === 'verify-ca' || sslMode === 'verify-full'
      ? { rejectUnauthorized: true }
      : undefined;

const pool = new pg.Pool({
  host: u.hostname,
  port: Number(u.port || 5432),
  database: decodeURIComponent(u.pathname.replace(/^\//, '')),
  user: decodeURIComponent(u.username),
  password: decodeURIComponent(u.password),
  ssl,
  max: 2,
  connectionTimeoutMillis: 10000,
});

const TABLES = [
  'busdevs',
  'crm_users',
  'crm_sessions',
  'crm_lead_state',
  'crm_stage_history',
  'crm_chat_messages',
  'leads',
  'lead_assignments',
  'phone_assignments',
  'visitor_assignments',
  'rr_counter',
  'rr_settings',
  'rr_shadow_log',
  'processed_webhook_messages',
  'capi_events',
  'sales',
  'crm_leads',
  'rr_state',
  'stage_history',
  'messages',
];

const FUNCTIONS = [
  'assign_and_insert_lead',
  'assign_next_agent',
  'rr_choose_agent',
  'increment_rr_counter',
];

async function main() {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outDir = path.resolve(process.cwd(), 'scratch/backups');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `dreamlab-db-backup-${stamp}.json`);

  console.log(`Membuat backup read-only dari ${u.hostname}:${u.port}/${decodeURIComponent(u.pathname.replace(/^\//, ''))} ...`);

  const snapshot = {
    createdAt: new Date().toISOString(),
    database: decodeURIComponent(u.pathname.replace(/^\//, '')),
    tables: {},
    functions: {},
  };

  const existingTablesRes = await pool.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
  );
  const existingTables = new Set(existingTablesRes.rows.map((r) => r.table_name));

  for (const tbl of TABLES) {
    if (!existingTables.has(tbl)) continue;
    const res = await pool.query(`SELECT * FROM "${tbl}"`);
    snapshot.tables[tbl] = {
      rowCount: res.rowCount,
      rows: res.rows,
    };
    console.log(`  [OK] Tabel ${tbl}: ${res.rowCount} baris`);
  }

  for (const fn of FUNCTIONS) {
    const fnRes = await pool.query(
      `SELECT pg_get_functiondef(p.oid) AS def
         FROM pg_proc p
         JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public' AND p.proname = $1`,
      [fn]
    );
    if (fnRes.rowCount && fnRes.rowCount > 0) {
      snapshot.functions[fn] = fnRes.rows.map((r) => r.def);
      console.log(`  [OK] Fungsi ${fn}: ${fnRes.rowCount} definisi tersimpan`);
    }
  }

  fs.writeFileSync(outFile, JSON.stringify(snapshot, null, 2), 'utf8');
  const sizeMb = (fs.statSync(outFile).size / (1024 * 1024)).toFixed(2);
  console.log(`\nBackup selesai disimpan ke: ${outFile} (${sizeMb} MB)`);
  await pool.end();
}

main().catch(async (err) => {
  console.error('Gagal membuat backup:', err);
  await pool.end().catch(() => {});
  process.exit(1);
});

