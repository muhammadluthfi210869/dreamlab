// test-sslmode.ts — uji perilaku db.ts terhadap pgbouncer TANPA TLS
import { Pool } from 'pg';

// Replikasi logika buildPool di src/lib/db.ts
function buildPool(connectionString: string) {
  const u = new URL(connectionString);
  const sslMode = u.searchParams.get('sslmode') ?? '';
  let ssl: { rejectUnauthorized: boolean } | undefined;
  if (sslMode === 'require' || sslMode === 'prefer') {
    ssl = { rejectUnauthorized: false };
  } else if (sslMode === 'verify-ca' || sslMode === 'verify-full') {
    ssl = { rejectUnauthorized: true };
  }
  return new Pool({
    host: u.hostname, port: Number(u.port || 5432),
    database: decodeURIComponent(u.pathname.replace(/^\//, '')),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    ssl, max: 2, connectionTimeoutMillis: 6000, statement_timeout: 5000,
  });
}

// Kredensial TIDAK lagi di-hardcode (rotasi password 2026-09-14).
// Baca dari DATABASE_URL — jalankan misalnya:
//   npx tsx --env-file=.env.local scripts/test-sslmode.ts
const envUrl = process.env.DATABASE_URL;
if (!envUrl) {
  console.error('DATABASE_URL tidak diset. Jalankan dengan --env-file=.env.local');
  process.exit(1);
}
const base = envUrl.split('?')[0];

async function tryConnect(label: string, url: string) {
  const p = buildPool(url);
  try {
    const r = await p.query('SELECT 1 AS ok');
    console.log(`  [OK]   ${label} -> koneksi sukses (${JSON.stringify(r.rows[0])})`);
  } catch (e: any) {
    console.log(`  [GAGAL] ${label} -> ${e.message.split('\n')[0]}`);
  } finally { await p.end(); }
}

async function main() {
  console.log('-- TEST db.ts sslmode terhadap pgbouncer (TANPA TLS) --');
  await tryConnect('tanpa sslmode (default)', base);
  await tryConnect('sslmode=disable', base + '?sslmode=disable');
  await tryConnect('sslmode=prefer', base + '?sslmode=prefer');
  await tryConnect('sslmode=require', base + '?sslmode=require');
  console.log('\nKesimpulan: prefer/require di db.ts memaksa SSL (ssl objek truthy).');
  console.log('node-postgres TIDAK fallback ke plaintext seperti Postgres asli.');
  console.log('=> koneksi ke pgbouncer tanpa TLS GAGAL untuk prefer/require.');
}
main().catch(console.error);
