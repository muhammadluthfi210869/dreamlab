/**
 * db-migrate.mjs — terapkan semua migration di db/migrations/ ke DATABASE_URL.
 *
 * Penggunaan:
 *   DATABASE_URL="postgresql://user:pass@host:port/db" npm run db:migrate
 *
 * Aman dijalankan ulang (setiap file .sql dibuat idempotent).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL belum di-set.');
  console.error('   Contoh: DATABASE_URL="postgresql://user:pass@host:5432/dreamlab" npm run db:migrate');
  process.exit(1);
}

const u = new URL(connectionString);
const pool = new pg.Pool({
  host: u.hostname,
  port: Number(u.port || 5432),
  database: decodeURIComponent(u.pathname.replace(/^\//, '')),
  user: decodeURIComponent(u.username),
  password: decodeURIComponent(u.password),
  ssl: { rejectUnauthorized: false },
  max: 2,
  connectionTimeoutMillis: 10000,
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.resolve(__dirname, '../db/migrations');
const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

if (files.length === 0) {
  console.log('⚠️  Tidak ada file .sql di db/migrations/.');
  await pool.end();
  process.exit(0);
}

console.log(`Menjalankan ${files.length} migration ke ${u.hostname}:${u.port}/${decodeURIComponent(u.pathname.replace(/^\//, ''))} ...\n`);

for (const file of files) {
  const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
  try {
    await pool.query(sql);
    console.log(`  ✓ ${file}`);
  } catch (err) {
    console.error(`  ✗ ${file} GAGAL:`, err.message);
    console.error('   Hentikan. Perbaiki lalu jalankan ulang (file idempotent, aman).');
    await pool.end();
    process.exit(1);
  }
}

await pool.end();
console.log('\n✅ Semua migration selesai.');
