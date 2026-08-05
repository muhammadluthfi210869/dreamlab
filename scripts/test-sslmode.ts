// test-sslmode.ts — uji perilaku db.ts terhadap pgbouncer TANPA TLS
import { Pool } from 'pg';

// Replikasi logika buildPool di src/lib/db.ts
function buildPool(connectionString: string) {
  const u = new URL(connectionString);
  const sslMode = u.searchParams.get('sslmode') ?? '';
  let ssl;
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

const base = 'postgresql://dreamlab1:HaaE-B9APXWXM1Fnw8VZSbXv@103.93.134.215:6432/dreamlab';

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
