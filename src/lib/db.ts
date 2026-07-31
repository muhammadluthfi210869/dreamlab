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
  if (sslMode === 'require' || sslMode === 'prefer') {
    ssl = { rejectUnauthorized: false };
  } else if (sslMode === 'verify-ca' || sslMode === 'verify-full') {
    ssl = { rejectUnauthorized: true };
  }

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
    connectionTimeoutMillis: 8000,
    statement_timeout: 15000,
  });
}

const pool = buildPool();

export default pool;
