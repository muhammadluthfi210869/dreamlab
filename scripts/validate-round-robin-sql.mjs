#!/usr/bin/env node
/**
 * validate-round-robin-sql.mjs
 *
 * Menguji migrasi 00024 di database yang dituju DI DALAM SATU TRANSAKSI YANG SELALU DI-ROLLBACK.
 * Tidak ada yang tersimpan: tabel, fungsi, lead uji, dan perubahan rr_counter semuanya batal.
 * (Catatan: sequence id lead tetap maju, itu normal di Postgres dan tidak berbahaya.)
 *
 *   node scripts/validate-round-robin-sql.mjs
 *
 * Membaca DATABASE_URL dari .env.local tanpa mencetaknya.
 */
import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

const envTxt = fs.readFileSync(path.resolve('.env.local'), 'utf8');
const dbUrl = (envTxt.match(/^DATABASE_URL=(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '');
if (!dbUrl) throw new Error('DATABASE_URL tidak ada di .env.local');

const migration = fs
  .readFileSync(path.resolve('db/migrations/00024_confirmed_balance_round_robin.sql'), 'utf8')
  .replace(/^BEGIN;\s*$/m, '')
  .replace(/^COMMIT;\s*$/m, '');

const client = new pg.Client({ connectionString: dbUrl, ssl: false, connectionTimeoutMillis: 15000 });
let failed = 0;
const check = (label, ok, detail) => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${ok ? '' : '  ' + JSON.stringify(detail)}`);
};

let n = 0;
const click = async () => {
  n++;
  const r = await client.query(
    `SELECT agent_name FROM assign_and_insert_lead($1,'rr','rr-sim','/rr-sim','t',NULL,NULL,NULL,NULL,NULL,NULL,$2,NULL,NULL,NULL,NULL,FALSE)`,
    [`rrv-${Date.now()}-${n}`, `rrs-${Date.now()}-${n}`]
  );
  return r.rows[0].agent_name;
};
const setting = (k, v) => client.query(`UPDATE rr_settings SET value=$2, updated_at=NOW() WHERE key=$1`, [k, v]);
const share = (names) => {
  const m = {};
  names.forEach((x) => (m[x] = (m[x] || 0) + 1));
  return Object.fromEntries(Object.entries(m).map(([k, v]) => [k, Math.round((v / names.length) * 100)]));
};

try {
  await client.connect();
  await client.query('BEGIN');
  await client.query(`SET LOCAL lock_timeout = '3s'`);
  await client.query(`SET LOCAL statement_timeout = '30s'`);

  const active = (await client.query(`SELECT name FROM busdevs WHERE is_active ORDER BY id`)).rows.map((r) => r.name);
  console.log('Sales aktif di DB:', active.join(', '));

  await client.query(migration);
  check('Migrasi dapat dijalankan tanpa error', true);

  const mode0 = (await client.query(`SELECT value FROM rr_settings WHERE key='rr_mode'`)).rows[0]?.value;
  check("Default rr_mode = 'sequential'", mode0 === 'sequential', mode0);

  // 1) sequential: urutan siklis Annisa -> Diaz -> Jessica -> Irma
  const order = ['Annisa', 'Diaz', 'Jessica', 'Irma'].filter((x) => active.includes(x));
  const seq = [];
  for (let i = 0; i < 8; i++) seq.push(await click());
  const first = order.indexOf(seq[0]);
  const cyc = seq.every((nm, i) => nm === order[(first + i) % order.length]);
  check('Mode sequential: urutan siklis sama seperti sebelumnya', cyc, seq);

  // test-flag tetap sequential walau mode balancer
  const testRow = await client.query(`SELECT agent_name FROM assign_and_insert_lead('test_x','rr','rr-sim','/rr-sim','t',NULL,NULL,NULL,NULL,NULL,NULL,'rrs-t',NULL,NULL,NULL,NULL,TRUE)`);
  check('Lead uji (is_test) tetap berjalan', testRow.rows.length === 1);

  // 2) shadow: tetap sequential + log tercatat
  await setting('rr_mode', 'shadow');
  const sh = [];
  for (let i = 0; i < 8; i++) sh.push(await click());
  const shCycle = sh.every((nm, i) => nm === order[(order.indexOf(sh[0]) + i) % order.length]);
  check('Mode shadow: tetap giliran berurutan', shCycle, sh);
  const log = await client.query(`SELECT sequential_agent, balanced_agent, reason FROM rr_shadow_log ORDER BY id`);
  check('Mode shadow: 8 pilihan balancer tercatat', log.rowCount === 8, log.rowCount);
  console.log('   contoh log shadow:', JSON.stringify(log.rows.slice(0, 3)));

  // 3) confirmed_balance
  const hour = (await client.query(`SELECT EXTRACT(HOUR FROM (NOW() AT TIME ZONE 'Asia/Jakarta'))::int h`)).rows[0].h;
  const working = hour >= 8 && hour < 21;
  await client.query(`UPDATE rr_settings SET value=NOW()::text, updated_at=NOW() WHERE key='balance_since'`);
  await setting('rr_mode', 'confirmed_balance');
  const confirmFor = (name, count) =>
    client.query(
      `UPDATE leads SET status='confirmed', confirmed_at=NOW(), wa_phone='62811' || id::text
        WHERE id IN (SELECT id FROM leads WHERE source='rr-sim' AND assigned_to=$1 AND status IS DISTINCT FROM 'confirmed' ORDER BY id DESC LIMIT $2)`,
      [name, count]
    );

  // 3a) semua sales belum punya chat tertangkap: sebaran tetap merata
  const b1 = [];
  for (let i = 0; i < 24; i++) b1.push(await click());
  const s1 = share(b1);
  check('confirmed_balance, belum ada chat: sebaran merata (tiap sales 15-35%)', Object.values(s1).every((v) => v >= 15 && v <= 35) && Object.keys(s1).length === order.length, s1);

  // 3b) hanya Annisa yang chatnya tertangkap: JANGAN menumpuk ke Annisa (jam kerja: fallback 'belum siap')
  await confirmFor('Annisa', 10);
  const b2 = [];
  for (let i = 0; i < 20; i++) b2.push(await click());
  const s2 = share(b2);
  if (working) {
    check('Hanya 1 dari 4 nomor menangkap chat: tidak menumpuk ke Annisa (tiap sales <= 40%)', Object.values(s2).every((v) => v <= 40), s2);
  } else {
    console.log('SKIP  pemeriksaan kesiapan hanya berlaku 08.00-21.00 WIB; sekarang di luar jam kerja', s2);
  }

  // 3c) semua sales terbukti menangkap chat, Annisa jauh lebih banyak: klik berikutnya menghindari Annisa
  for (const nm of order.filter((x) => x !== 'Annisa')) await confirmFor(nm, 1);
  const b3 = [];
  for (let i = 0; i < 20; i++) b3.push(await click());
  const s3 = share(b3);
  check('Semua sales terbukti menangkap chat, Annisa 10 vs lainnya 1: Annisa <= 15% klik', (s3.Annisa || 0) <= 15, s3);
  check('Sales lain kebagian merata (tiap sales non-Annisa >= 15%)', order.filter((x) => x !== 'Annisa').every((x) => (s3[x] || 0) >= 15), s3);

  // 4) saklar darurat
  await setting('rr_mode', 'sequential');
  const e1 = await click();
  const e2 = await click();
  const i1 = order.indexOf(e1);
  check('Saklar darurat: kembali ke giliran berurutan', order[(i1 + 1) % order.length] === e2, [e1, e2]);

  // 5) assign_next_agent (jalur lain) tetap berfungsi
  const na = await client.query(`SELECT agent_name FROM assign_next_agent('rrv-na-1', FALSE, 'rr', '/rr-sim', NULL)`);
  check('assign_next_agent tetap berfungsi', na.rowCount === 1 && !!na.rows[0].agent_name, na.rows);
} catch (err) {
  failed++;
  console.error('ERROR saat validasi:', err.message);
} finally {
  try {
    await client.query('ROLLBACK');
    const gone = await client.query(`SELECT to_regclass('rr_settings') AS t, (SELECT COUNT(*)::int FROM leads WHERE source='rr-sim') AS leftover`);
    check('ROLLBACK bersih: rr_settings tidak ada dan lead uji tidak tersisa', gone.rows[0].t === null && gone.rows[0].leftover === 0, gone.rows[0]);
  } catch (e) {
    failed++;
    console.error('Gagal verifikasi rollback:', e.message);
  }
  await client.end().catch(() => undefined);
}
console.log(failed === 0 ? '\nSEMUA LOLOS' : `\n${failed} GAGAL`);
process.exit(failed === 0 ? 0 : 1);
