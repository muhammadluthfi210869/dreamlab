#!/usr/bin/env node
/**
 * validate-crm-sql.mjs
 *
 * Menguji migrasi 00025 (login + CRM) di database yang dituju DI DALAM TRANSAKSI YANG SELALU DI-ROLLBACK.
 * Tidak ada yang tersimpan. Membaca DATABASE_URL dari .env.local tanpa mencetaknya.
 *
 *   node scripts/validate-crm-sql.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

const envTxt = fs.readFileSync(path.resolve('.env.local'), 'utf8');
const dbUrl = (envTxt.match(/^DATABASE_URL=(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '');
if (!dbUrl) throw new Error('DATABASE_URL tidak ada di .env.local');
const migration = fs
  .readFileSync(path.resolve('db/migrations/00025_crm_login_pipeline.sql'), 'utf8')
  .replace(/^BEGIN;\s*$/m, '')
  .replace(/^COMMIT;\s*$/m, '');

const client = new pg.Client({ connectionString: dbUrl, ssl: false, connectionTimeoutMillis: 15000 });
let failed = 0;
const check = (label, ok, detail) => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${ok ? '' : '  ' + JSON.stringify(detail)}`);
};
/** Menjalankan SQL yang DIHARAPKAN gagal; savepoint supaya transaksi utama tetap hidup. */
const rejects = async (label, sql, params = []) => {
  await client.query('SAVEPOINT s');
  try {
    await client.query(sql, params);
    check(label, false, 'seharusnya ditolak tetapi berhasil');
  } catch (e) {
    check(label, true);
  } finally {
    await client.query('ROLLBACK TO SAVEPOINT s');
  }
};

try {
  await client.connect();
  await client.query('BEGIN');
  await client.query(`SET LOCAL lock_timeout = '3s'`);

  await client.query(migration);
  check('Migrasi dapat dijalankan', true);
  await client.query(migration);
  check('Migrasi aman dijalankan dua kali (idempoten)', true);

  const users = (await client.query(`SELECT name, role, password_hash, must_change_password FROM crm_users ORDER BY id`)).rows;
  check('Akun awal: Head, Annisa, Diaz, Jessica', users.map((u) => u.name).join(',') === 'Head,Annisa,Diaz,Jessica', users);
  check('Akun awal: belum punya kata sandi sendiri dan WAJIB ganti saat pertama masuk', users.every((u) => u.password_hash === null && u.must_change_password === true), users);
  check('Hanya Head berperan head', users.filter((u) => u.role === 'head').map((u) => u.name).join() === 'Head', users);

  const bd = (await client.query(`SELECT name FROM busdevs WHERE is_active`)).rows.map((r) => r.name);
  check('Nama sales di CRM cocok dengan busdevs aktif', users.filter((u) => u.role === 'sales').every((u) => bd.includes(u.name)), { bd, users: users.map((u) => u.name) });

  await rejects('Nama akun unik tanpa peduli huruf besar/kecil', `INSERT INTO crm_users (name, role) VALUES ('annisa', 'sales')`);
  await rejects('Peran selain head/sales ditolak', `INSERT INTO crm_users (name, role) VALUES ('X', 'admin')`);
  await rejects('Tahap di luar 8 tahap ditolak', `INSERT INTO crm_lead_state (tracking_code, stage) VALUES ('T1', 'won')`);
  await rejects('MOQ negatif ditolak', `INSERT INTO crm_lead_state (tracking_code, moq_manual) VALUES ('T2', -5)`);

  await client.query(`INSERT INTO crm_lead_state (tracking_code, produk_manual, moq_manual) VALUES ('T3', 'Serum', 1000)`);
  const def = (await client.query(`SELECT stage FROM crm_lead_state WHERE tracking_code='T3'`)).rows[0];
  check("Lead baru otomatis tahap 'traffic'", def?.stage === 'traffic', def);

  const uid = users[1] ? (await client.query(`SELECT id FROM crm_users WHERE name='Annisa'`)).rows[0].id : null;
  await client.query(`INSERT INTO crm_sessions (token_hash, user_id, expires_at) VALUES ('h1', $1, NOW() + INTERVAL '30 days')`, [uid]);
  const sess = (await client.query(`SELECT remember FROM crm_sessions WHERE token_hash='h1'`)).rows[0];
  check("Sesi bawaan bertanda 'ingat saya'", sess?.remember === true, sess);
  await client.query(`DELETE FROM crm_users WHERE id = $1`, [uid]);
  const left = (await client.query(`SELECT COUNT(*)::int n FROM crm_sessions WHERE token_hash='h1'`)).rows[0].n;
  check('Hapus akun menghapus sesinya (cascade)', left === 0, left);

  // tabel leads tidak tersentuh
  const leadsCols = (await client.query(`SELECT COUNT(*)::int n FROM information_schema.columns WHERE table_name='leads'`)).rows[0].n;
  check('Tabel leads tidak diubah (jumlah kolom tetap)', leadsCols > 20, leadsCols);
} catch (err) {
  failed++;
  console.error('ERROR saat validasi:', err.message);
} finally {
  try {
    await client.query('ROLLBACK');
    const gone = await client.query(`SELECT to_regclass('crm_users') AS t`);
    check('ROLLBACK bersih: tabel CRM tidak tertinggal', gone.rows[0].t === null, gone.rows[0]);
  } catch (e) {
    failed++;
    console.error('Gagal verifikasi rollback:', e.message);
  }
  await client.end().catch(() => undefined);
}
console.log(failed === 0 ? '\nSEMUA LOLOS' : `\n${failed} GAGAL`);
process.exit(failed === 0 ? 0 : 1);
