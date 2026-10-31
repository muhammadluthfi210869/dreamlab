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

  // 3) confirmed_balance: murni chat masuk, batas putaran (Q = 2), pengaman sales macet
  // (semua stempel waktu di dalam transaksi sama dengan NOW(); mundurkan batas awal agar klik uji terhitung)
  await client.query(`UPDATE rr_settings SET value=(NOW() - INTERVAL '1 minute')::text, updated_at=NOW() WHERE key='balance_since'`);
  await setting('rr_mode', 'confirmed_balance');
  const confirmFor = (name, count) =>
    client.query(
      `UPDATE leads SET status='confirmed', confirmed_at=NOW(), wa_phone='62811' || id::text
        WHERE id IN (SELECT id FROM leads WHERE source='rr-sim' AND assigned_to=$1 AND status IS DISTINCT FROM 'confirmed' ORDER BY id DESC LIMIT $2)`,
      [name, count]
    );
  const roundSize = (await client.query(`SELECT value FROM rr_settings WHERE key='round_size'`)).rows[0]?.value;
  check('Pengaturan round_size default = 2', roundSize === '2', roundSize);
  const inActive = (arr) => arr.every((x) => active.includes(x));

  // 3a) belum ada chat sama sekali: sebaran tetap merata, tidak ada yang macet (stuck_clicks 40 > 12 klik/sales)
  const b1 = [];
  for (let i = 0; i < 36; i++) b1.push(await click());
  const s1 = share(b1);
  check('Belum ada chat: sebaran merata (tiap sales 25-42%)', Object.values(s1).every((v) => v >= 25 && v <= 42) && Object.keys(s1).length === order.length, s1);
  check('Hanya sales aktif yang menerima klik (Irma nonaktif tidak kebagian)', inActive(b1), s1);

  // 3b) pengaman MACET: Annisa & Diaz punya 1 chat, Jessica 0 chat padahal sudah banyak klik -> jangan ditunggu
  await setting('stuck_clicks', '10');
  await confirmFor('Annisa', 1);
  await confirmFor('Diaz', 1);
  const b2 = [];
  for (let i = 0; i < 16; i++) b2.push(await click());
  const s2 = share(b2);
  check('Sales macet (0 chat dari 12+ klik): hanya dapat klik uji (<= 20%)', (s2.Jessica || 0) <= 20, s2);
  check('Sales sehat tetap menerima hampir semua klik (Annisa + Diaz >= 80%)', (s2.Annisa || 0) + (s2.Diaz || 0) >= 80, s2);
  await setting('stuck_clicks', '40');

  // 3c) batas putaran: Annisa 2, Diaz 1, Jessica 1 -> Annisa berhenti sampai yang lain menyusul
  await confirmFor('Annisa', 1);
  await confirmFor('Jessica', 1);
  const b3 = [];
  for (let i = 0; i < 12; i++) b3.push(await click());
  const s3 = share(b3);
  check('Annisa sudah di batas putaran (2 vs 1 vs 1): tidak menerima klik baru', (s3.Annisa || 0) === 0, s3);
  check('Diaz dan Jessica membagi rata klik (masing-masing 40-60%)', (s3.Diaz || 0) >= 40 && (s3.Diaz || 0) <= 60 && (s3.Jessica || 0) >= 40 && (s3.Jessica || 0) <= 60, s3);

  // 3d) semua mencapai batas -> putaran baru terbuka, semua kembali menerima
  await confirmFor('Diaz', 1);
  await confirmFor('Jessica', 1);
  const b4 = [];
  for (let i = 0; i < 18; i++) b4.push(await click());
  const s4 = share(b4);
  check('Semua sama di batas (2/2/2): putaran baru, semua kebagian merata (tiap sales 25-42%)', Object.values(s4).every((v) => v >= 25 && v <= 42) && Object.keys(s4).length === order.length, s4);

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
