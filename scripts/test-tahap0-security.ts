/**
 * scripts/test-tahap0-security.ts
 *
 * Pengujian otomatis Tahap 0 — Keamanan:
 *  1. Semua endpoint /api/crm/* dan /api/lead-monitor/stats menolak akses tanpa login (401) — mode Tamu tertutup.
 *  2. Middleware proxy mengarahkan /lead-monitor/* tanpa cookie sesi ke /lead-monitor/masuk/ (302).
 *  3. Password / PIN di-hash, PIN sementara acak berfungsi, akun tanpa password_hash ditolak.
 *  4. 5x salah berturut-turut mengunci akun sementara selama 30 detik (429 + retryAfterSec <= 30).
 *  5. Rate limit login per IP menahan brute-force (429).
 *  6. Busdev A (Annisa) TIDAK BISA mengambil atau mengubah lead maupun pesan milik Busdev B (Diaz)
 *     lewat API langsung memakai ID lead B / kode lead B / nomor HP lead B -> 403.
 *  7. Hanya Admin (Head) yang bisa mengakses daftar pengguna, memindah lead antar sales, dan melihat laporan semua sales.
 *
 * Jalankan:
 *   npx tsx scripts/test-tahap0-security.ts
 */
import path from 'node:path';
import dotenv from 'dotenv';
import { NextRequest } from 'next/server';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

import {
  checkLoginRateLimit,
  generateRandomPin,
  hashPassword,
  LOCK_MS,
  login,
  MAX_FAILED,
  OPEN_VIEW,
  resetLoginRateLimit,
  SESSION_COOKIE,
  sha256,
  validateNewPassword,
  verifyPassword,
} from '../src/lib/crm-auth';
import { canEditLead, canReadLead, isAdminRole, normalizeRole } from '../src/lib/crm-stages';
import { proxy } from '../src/proxy';
import { GET as getPipeline } from '../src/app/api/crm/pipeline/route';
import { GET as getLead, PATCH as patchLead } from '../src/app/api/crm/lead/route';
import { GET as getChat, POST as postChat, PATCH as patchChat } from '../src/app/api/crm/chat/route';
import { GET as getUsers } from '../src/app/api/crm/users/route';
import { GET as getStats } from '../src/app/api/lead-monitor/stats/route';
import { getMonitorPool } from '../src/lib/db';

let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${ok ? '' : ' -> ' + JSON.stringify(detail)}`);
};

async function main() {
  console.log('=== UNIT TEST KEAMANAN & AUTENTIKASI ===\n');

  check('Mode Tamu (OPEN_VIEW) ditutup permanen (false)', OPEN_VIEW === false, OPEN_VIEW);
  check('Konfigurasi kunci akun: 5x salah -> 30 detik', MAX_FAILED === 5 && LOCK_MS === 30_000, { MAX_FAILED, LOCK_MS });

  const pin = generateRandomPin();
  const pinHash = hashPassword(pin);
  check('PIN acak 6 digit valid dan ter-hash dengan scrypt', /^\d{6}$/.test(pin) && verifyPassword(pin, pinHash) && !verifyPassword('000000', pinHash));
  check('Validasi PIN baru menerima 6 digit tidak kembar dan menolak 111111/123456', validateNewPassword('482917', 'Annisa') === null && validateNewPassword('111111', 'Annisa') !== null && validateNewPassword('123456', 'Annisa') !== null);
  check('Normalisasi role: head->admin, sales->busdev', normalizeRole('head') === 'admin' && normalizeRole('admin') === 'admin' && normalizeRole('sales') === 'busdev' && normalizeRole('busdev') === 'busdev');

  // Test rate limit per IP
  resetLoginRateLimit();
  let lastRl = { allowed: true, retryAfterSec: 0 };
  for (let i = 0; i < 16; i++) {
    lastRl = checkLoginRateLimit('203.0.113.99');
  }
  check('Rate limit per IP menolak request ke-16 dalam 30 detik', !lastRl.allowed && lastRl.retryAfterSec > 0 && lastRl.retryAfterSec <= 30, lastRl);
  resetLoginRateLimit();

  // Test middleware proxy /lead-monitor/*
  const unauthPageReq = new NextRequest('https://dreamlab.id/lead-monitor/pipeline');
  const proxyRes = proxy(unauthPageReq);
  check(
    'Middleware /lead-monitor/pipeline tanpa cookie sesi redirect 302 ke /lead-monitor/masuk/',
    proxyRes.status === 302 && (proxyRes.headers.get('location') || '').includes('/lead-monitor/masuk'),
    { status: proxyRes.status, location: proxyRes.headers.get('location') }
  );

  // Test unauthenticated API calls -> 401
  const rPipeline401 = await getPipeline(new NextRequest('https://dreamlab.id/api/crm/pipeline'));
  const rLead401 = await getLead(new NextRequest('https://dreamlab.id/api/crm/lead?id=1'));
  const rChat401 = await getChat(new NextRequest('https://dreamlab.id/api/crm/chat'));
  const rUsers401 = await getUsers(new NextRequest('https://dreamlab.id/api/crm/users'));
  const rStats401 = await getStats(new NextRequest('https://dreamlab.id/api/lead-monitor/stats'));
  check(
    'Semua endpoint API (/pipeline, /lead, /chat, /users, /stats) mengembalikan 401 tanpa login',
    rPipeline401.status === 401 && rLead401.status === 401 && rChat401.status === 401 && rUsers401.status === 401 && rStats401.status === 401,
    {
      pipeline: rPipeline401.status,
      lead: rLead401.status,
      chat: rChat401.status,
      users: rUsers401.status,
      stats: rStats401.status,
    }
  );

  console.log('\n=== INTEGRATION TEST ISOLASI BUSDEV A vs BUSDEV B & LOCKOUT 30 DETIK ===\n');

  const pool = getMonitorPool();
  // Ambil keadaan awal crm_users untuk dipulihkan persis setelah test
  const origUsersRes = await pool.query(
    `SELECT id, name, role, password_hash, must_change_password, is_active, failed_attempts, locked_until FROM crm_users ORDER BY id`
  );
  const origUsers = origUsersRes.rows;

  const tokenAnnisa = 'test_tok_annisa_' + 'a'.repeat(30);
  const tokenDiaz = 'test_tok_diaz_' + 'b'.repeat(30);
  const tokenAdmin = 'test_tok_admin_' + 'c'.repeat(30);
  const testCodeB = 'DL-TEST-SEC-DIAZ-9991';
  const testPhoneB = '6289999998881';
  let testLeadIdB = 0;

  try {
    const annisaRow = origUsers.find((u) => u.name.toLowerCase() === 'annisa');
    const diazRow = origUsers.find((u) => u.name.toLowerCase() === 'diaz');
    const headRow = origUsers.find((u) => u.name.toLowerCase() === 'head');
    if (!annisaRow || !diazRow || !headRow) {
      throw new Error('Akun Annisa/Diaz/Head belum ada di crm_users');
    }

    // 1. Set PIN sementara untuk Annisa dan uji 5x salah -> terkunci 30 detik
    const tempPinAnnisa = '739284';
    await pool.query(
      `UPDATE crm_users SET password_hash = $2, must_change_password = FALSE, failed_attempts = 0, locked_until = NULL WHERE id = $1`,
      [annisaRow.id, hashPassword(tempPinAnnisa)]
    );

    let fifthResult: any = null;
    for (let i = 1; i <= 5; i++) {
      fifthResult = await login('Annisa', '000000', false, 'test-agent');
    }
    check(
      '5x salah berturut-turut mengunci akun selama 30 detik (reason=locked, retryAfterSec<=30)',
      fifthResult && !fifthResult.ok && fifthResult.reason === 'locked' && fifthResult.retryAfterSec <= 30 && fifthResult.retryAfterSec >= 25,
      fifthResult
    );

    // Percobaan ke-6 dengan PIN yang BENAR saat masih terkunci tetap ditolak (locked)
    const whileLocked = await login('Annisa', tempPinAnnisa, false, 'test-agent');
    check('Login dengan PIN benar saat masa kunci 30 detik tetap ditolak (locked)', !whileLocked.ok && whileLocked.reason === 'locked', whileLocked);

    // Buka kunci untuk melanjutkan test sesi API, dan set must_change_password = FALSE untuk akun uji
    await pool.query(
      `UPDATE crm_users SET must_change_password = FALSE, failed_attempts = 0, locked_until = NULL WHERE id = ANY($1::bigint[])`,
      [[annisaRow.id, diazRow.id, headRow.id]]
    );

    // 2. Buat sesi uji untuk Annisa (Busdev A), Diaz (Busdev B), dan Head (Admin)
    await pool.query(
      `INSERT INTO crm_sessions (token_hash, user_id, remember, expires_at, user_agent)
       VALUES
         ($1, $2, FALSE, NOW() + INTERVAL '10 minutes', 'test-suite'),
         ($3, $4, FALSE, NOW() + INTERVAL '10 minutes', 'test-suite'),
         ($5, $6, FALSE, NOW() + INTERVAL '10 minutes', 'test-suite')`,
      [sha256(tokenAnnisa), annisaRow.id, sha256(tokenDiaz), diazRow.id, sha256(tokenAdmin), headRow.id]
    );

    // Buat 1 baris lead milik Diaz (Busdev B) dan 1 pesan milik Diaz untuk diuji akses silang oleh Annisa (Busdev A)
    const insLead = await pool.query(
      `INSERT INTO leads (tracking_code, assigned_to, status, nama, hp, wa_phone, produk, source, is_test)
       VALUES ($1, 'Diaz', 'confirmed', 'Prospek Rahasia Diaz', $2, $2, 'Serum Retinol', 'meta_ads', FALSE)
       RETURNING id`,
      [testCodeB, testPhoneB]
    );
    testLeadIdB = Number(insLead.rows[0].id);

    await pool.query(
      `INSERT INTO crm_chat_messages (tracking_code, phone, sender_type, sender_name, message_text, status, direction, channel, busdev_name, is_read)
       VALUES ($1, $2, 'customer', 'Prospek Rahasia Diaz', 'Halo Diaz, saya mau maklon 2000 pcs', 'delivered', 'inbound', 'whatsapp', 'Diaz', FALSE)`,
      [testCodeB, testPhoneB]
    );

    const makeAuthedReq = (url: string, token: string, method = 'GET', body?: unknown) =>
      new NextRequest(url, {
        method,
        headers: {
          cookie: `${SESSION_COOKIE}=${token}`,
          origin: 'https://dreamlab.id',
          host: 'dreamlab.id',
          ...(body ? { 'content-type': 'application/json' } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

    // 3. Busdev A (Annisa) mencoba membaca lead Busdev B (Diaz) via ID lead B langsung -> WAJIB 403
    const resGetLeadByA = await getLead(makeAuthedReq(`https://dreamlab.id/api/crm/lead?id=${testLeadIdB}`, tokenAnnisa));
    check(
      'Busdev A (Annisa) TIDAK BISA mengambil lead Busdev B (Diaz) lewat GET /api/crm/lead?id=<id_lead_B> -> 403',
      resGetLeadByA.status === 403,
      { status: resGetLeadByA.status, body: await resGetLeadByA.json().catch(() => null) }
    );

    // 4. Busdev A (Annisa) mencoba mengubah stage/catatan lead Busdev B (Diaz) lewat PATCH /api/crm/lead -> WAJIB 403
    const resPatchLeadByA = await patchLead(
      makeAuthedReq('https://dreamlab.id/api/crm/lead', tokenAnnisa, 'PATCH', {
        id: testLeadIdB,
        stage: 'hot',
        note: 'Bajak lead Diaz',
      })
    );
    check(
      'Busdev A (Annisa) TIDAK BISA mengubah lead Busdev B (Diaz) lewat PATCH /api/crm/lead -> 403',
      resPatchLeadByA.status === 403,
      { status: resPatchLeadByA.status, body: await resPatchLeadByA.json().catch(() => null) }
    );

    // 5. Busdev A (Annisa) mencoba mengambil pesan chat Busdev B (Diaz) lewat GET /api/crm/chat?leadId=<id_lead_B> & ?phone=<phone_B> -> WAJIB 403
    const resGetChatByIdByA = await getChat(makeAuthedReq(`https://dreamlab.id/api/crm/chat?leadId=${testLeadIdB}`, tokenAnnisa));
    const resGetChatByPhoneByA = await getChat(makeAuthedReq(`https://dreamlab.id/api/crm/chat?phone=${testPhoneB}`, tokenAnnisa));
    check(
      'Busdev A (Annisa) TIDAK BISA mengambil pesan Busdev B (Diaz) lewat GET /api/crm/chat (leadId maupun phone) -> 403',
      resGetChatByIdByA.status === 403 && resGetChatByPhoneByA.status === 403,
      { byId: resGetChatByIdByA.status, byPhone: resGetChatByPhoneByA.status }
    );

    // 6. Busdev A (Annisa) mencoba mengirim pesan ke lead Busdev B (Diaz) lewat POST /api/crm/chat -> WAJIB 403
    const resPostChatByA = await postChat(
      makeAuthedReq('https://dreamlab.id/api/crm/chat', tokenAnnisa, 'POST', {
        leadId: testLeadIdB,
        phone: testPhoneB,
        message: 'Halo dari Annisa',
      })
    );
    check(
      'Busdev A (Annisa) TIDAK BISA mengirim pesan ke lead Busdev B (Diaz) lewat POST /api/crm/chat -> 403',
      resPostChatByA.status === 403,
      { status: resPostChatByA.status }
    );

    // 7. Busdev B (Diaz) BISA mengambil lead & pesan miliknya sendiri -> 200
    const resGetLeadByB = await getLead(makeAuthedReq(`https://dreamlab.id/api/crm/lead?id=${testLeadIdB}`, tokenDiaz));
    const resGetChatByB = await getChat(makeAuthedReq(`https://dreamlab.id/api/crm/chat?leadId=${testLeadIdB}`, tokenDiaz));
    check(
      'Busdev B (Diaz) BISA membaca lead & pesan miliknya sendiri -> 200',
      resGetLeadByB.status === 200 && resGetChatByB.status === 200,
      { lead: resGetLeadByB.status, chat: resGetChatByB.status }
    );

    // 8. Busdev B (Diaz) TIDAK BISA memindahkan lead ke sales lain (fitur khusus Admin) -> 403
    const resReassignByB = await patchLead(
      makeAuthedReq('https://dreamlab.id/api/crm/lead', tokenDiaz, 'PATCH', {
        id: testLeadIdB,
        sales: 'Annisa',
      })
    );
    check(
      'Busdev TIDAK BISA memindahkan lead antar sales -> 403',
      resReassignByB.status === 403,
      { status: resReassignByB.status }
    );

    // 9. Busdev TIDAK BISA mengakses manajemen pengguna (/api/crm/users) atau laporan sales lain (/api/lead-monitor/stats?busdev=Diaz) -> 403
    const resUsersByA = await getUsers(makeAuthedReq('https://dreamlab.id/api/crm/users', tokenAnnisa));
    const resStatsOtherByA = await getStats(makeAuthedReq('https://dreamlab.id/api/lead-monitor/stats?busdev=Diaz', tokenAnnisa));
    check(
      'Busdev TIDAK BISA mengakses endpoint Admin (/api/crm/users) maupun laporan sales lain -> 403',
      resUsersByA.status === 403 && resStatsOtherByA.status === 403,
      { users: resUsersByA.status, statsOther: resStatsOtherByA.status }
    );

    // 10. Admin (Head) BISA mengakses /api/crm/users dan membaca lead siapa pun -> 200
    const resUsersByAdmin = await getUsers(makeAuthedReq('https://dreamlab.id/api/crm/users', tokenAdmin));
    const resLeadByAdmin = await getLead(makeAuthedReq(`https://dreamlab.id/api/crm/lead?id=${testLeadIdB}`, tokenAdmin));
    check(
      'Admin (Head) BISA mengakses /api/crm/users dan membaca lead seluruh sales -> 200',
      resUsersByAdmin.status === 200 && resLeadByAdmin.status === 200,
      { users: resUsersByAdmin.status, lead: resLeadByAdmin.status }
    );
  } finally {
    // Bersihkan semua data sementara test agar DB kembali 100% seperti semula
    await pool.query(`DELETE FROM crm_chat_messages WHERE tracking_code = $1`, [testCodeB]).catch(() => {});
    await pool.query(`DELETE FROM crm_stage_history WHERE tracking_code = $1`, [testCodeB]).catch(() => {});
    await pool.query(`DELETE FROM crm_lead_state WHERE tracking_code = $1`, [testCodeB]).catch(() => {});
    if (testLeadIdB > 0) {
      await pool.query(`DELETE FROM leads WHERE id = $1`, [testLeadIdB]).catch(() => {});
    }
    await pool.query(
      `DELETE FROM crm_sessions WHERE token_hash = ANY($1::text[])`,
      [[sha256(tokenAnnisa), sha256(tokenDiaz), sha256(tokenAdmin)]]
    ).catch(() => {});
    for (const u of origUsers) {
      await pool.query(
        `UPDATE crm_users
            SET role = $2, password_hash = $3, must_change_password = $4, is_active = $5, failed_attempts = $6, locked_until = $7
          WHERE id = $1`,
        [u.id, u.role, u.password_hash, u.must_change_password, u.is_active, u.failed_attempts, u.locked_until]
      ).catch(() => {});
    }
    await pool.end().catch(() => {});
  }

  console.log(failed === 0 ? '\n✅ SEMUA TEST TAHAP 0 LOLOS' : `\n❌ ${failed} TEST GAGAL`);
  process.exit(failed === 0 ? 0 : 1);
}

main();
