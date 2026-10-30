#!/usr/bin/env node
/**
 * run-migration.mjs <file.sql> [--dry-run]
 *
 * Menjalankan SATU file migrasi ke DATABASE_URL (.env.local), dengan lock_timeout 5 detik
 * supaya tidak menggantung klik pengunjung. Tidak mencetak DATABASE_URL.
 *
 *   --dry-run   jalankan lalu ROLLBACK (hanya cek bahwa migrasi bisa dijalankan)
 *
 * File migrasi boleh membawa BEGIN;/COMMIT; sendiri; di sini keduanya dilepas dan transaksi
 * dikelola skrip ini, sehingga --dry-run selalu benar-benar batal.
 */
import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

const file = process.argv[2];
const dry = process.argv.includes('--dry-run');
if (!file) {
  console.error('Pemakaian: node scripts/run-migration.mjs <file.sql> [--dry-run]');
  process.exit(2);
}

const envTxt = fs.readFileSync(path.resolve('.env.local'), 'utf8');
const dbUrl = (envTxt.match(/^DATABASE_URL=(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '');
if (!dbUrl) throw new Error('DATABASE_URL tidak ada di .env.local');

const sql = fs
  .readFileSync(path.resolve(file), 'utf8')
  .replace(/^\s*BEGIN;\s*$/gim, '')
  .replace(/^\s*COMMIT;\s*$/gim, '');

const client = new pg.Client({ connectionString: dbUrl, ssl: false, connectionTimeoutMillis: 15000 });
try {
  await client.connect();
  await client.query('BEGIN');
  await client.query(`SET LOCAL lock_timeout = '5s'`);
  await client.query(`SET LOCAL statement_timeout = '60s'`);
  await client.query(sql);
  if (dry) {
    await client.query('ROLLBACK');
    console.log(`DRY-RUN OK (dibatalkan): ${file}`);
  } else {
    await client.query('COMMIT');
    console.log(`MIGRASI DITERAPKAN: ${file}`);
  }
} catch (err) {
  await client.query('ROLLBACK').catch(() => undefined);
  console.error(`GAGAL (sudah di-rollback): ${err.message}`);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => undefined);
}
