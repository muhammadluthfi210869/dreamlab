import { Pool } from 'pg';

/**
 * Koneksi ke PostgreSQL dedicated (database `dreamlab`), terpisah dari ERP.
 * Dipakai oleh round-robin & lead capture server-side.
 *
 * CATATAN:
 * - password bisa mengandung karakter spesial (@, !, #), jadi connectionString
 *   TIDAK diteruskan mentah — kita parse manual pakai URL().
 * - SSL didukung lewat query param `?sslmode=require` di DATABASE_URL
 *   (dipakai oleh host seperti Neon/Railway yang wajib SSL).
 * - max koneksi bisa diatur via DATABASE_POOL_MAX (default 5) — untuk Vercel
 *   serverless lebih aman kecil, atau pakai PgBouncer di sisi server.
 */

function buildPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL belum di-set. Lihat .env.example / .env.local.'
    );
  }

  const u = new URL(connectionString);
  const sslMode = u.searchParams.get('sslmode') ?? '';

  let ssl;
  if (sslMode === 'require') {
    // require = WAJIB SSL. Kalau server tidak punya TLS (mis. PgBouncer
    // tanpa cert), koneksi memang akan gagal — ini sesuai semantik require.
    ssl = { rejectUnauthorized: false };
  } else if (sslMode === 'verify-ca' || sslMode === 'verify-full') {
    ssl = { rejectUnauthorized: true };
  }
  // NOTE: `prefer`, `disable`, dan tanpa sslmode → TANPA SSL.
  // node-postgres TIDAK punya mode 'prefer' (try-SSL-lalu-fallback).
  // Kalau kita set ssl objek utk 'prefer', node-postgres MEMAKSA SSL dan
  // GAGAL ke server tanpa TLS (PgBouncer produksi tidak punya cert).
  // Karena server produksi (PgBouncer di depan PG17) memang tanpa TLS,
  // 'prefer' diperlakukan sebagai plaintext (= hasil fallback yang benar).

  const poolMax = Number(process.env.DATABASE_POOL_MAX ?? 5);

  return new Pool({
    host: u.hostname,
    port: Number(u.port || 5432),
    database: decodeURIComponent(u.pathname.replace(/^\//, '')),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    ssl,
    max: poolMax,
    idleTimeoutMillis: 30000,
    // Fail-fast: kalau DB tidak terjangkau (mis. firewall/network), kegagalan
    // harus cepat (≤3 dtk) supaya klien langsung jatuh ke fallback lokal —
    // bukan menunggu 8 dtk seperti sebelumnya (keluhan "lemot").
    connectionTimeoutMillis: 3000,
    statement_timeout: 5000,
  });
}

let _pool: Pool | null = null;

function getPool(): Pool {
  if (!_pool) {
    _pool = buildPool();
  }
  return _pool;
}

// Lazy Pool: hanya dibangun saat benar-benar dipakai (runtime), bukan saat
// module di-import. Mencegah `next build` gagal ketika DATABASE_URL belum
// tersedia pada fase collect page data (mis. build lokal tanpa .env.local
// lengkap) — koneksi DB baru dibuat saat route benar-benar dipanggil.
const pool: Pool = new Proxy({} as unknown as Pool, {
  get(_target, prop, receiver) {
    return Reflect.get(getPool(), prop, receiver);
  },
  has(_target, prop) {
    return prop in getPool();
  },
});

export default pool;
