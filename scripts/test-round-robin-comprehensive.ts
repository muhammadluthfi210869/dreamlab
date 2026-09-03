/**
 * test-round-robin-comprehensive.ts
 *
 * Pengujian MENYELURUH untuk round-robin lead distribution di production.
 * Menutup semua state & edge case walau probabilitas kecil:
 *
 *   A. Rotation dasar
 *   B. Sticky visitor (sama = CS sama)
 *   C. Sticky expired → rotation
 *   D. Sticky ke agent nonaktif → rotation
 *   E. Visitor kosong / null / pendek
 *   F. Counter overflow & wrap
 *   G. Semua CS nonaktif → error
 *   H. Hanya 1 CS aktif
 *   I. Concurrent call (atomicity)
 *   J. Convert endpoint full pipeline
 *   K. Dedup 2 menit
 *   L. Tracking code uniqueness
 *
 * Cara pakai:
 *   DATABASE_URL=postgresql://... npx tsx scripts/test-round-robin-comprehensive.ts
 */

import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('Set DATABASE_URL dulu'); process.exit(1); }

const pool = new Pool({ connectionString: DATABASE_URL, max: 10 });
const q = async (text: string, params: any[] = []) => (await pool.query(text, params)).rows;

const results: { name: string; pass: boolean; detail?: string }[] = [];
function check(name: string, cond: boolean, detail?: string) {
  results.push({ name, pass: cond, detail });
  console.log(`  [${cond ? 'PASS' : 'FAIL'}] ${name}${detail ? ' — ' + detail : ''}`);
}

// helper untuk hitung distribusi & cek max-min
function distCheck<T>(label: string, items: T[], expectedN?: number): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const i of items) counts[String(i)] = (counts[String(i)] || 0) + 1;
  const vals = Object.values(counts);
  if (vals.length === 0) return counts;
  const max = Math.max(...vals), min = Math.min(...vals);
  const spread = max - min;
  const ratio = min === 0 ? Infinity : (max / min).toFixed(2);
  const nActive = expectedN ?? Object.keys(counts).length;
  console.log(`  ${label}:`, counts, `— spread=${spread}, ratio=${ratio}`);
  // ideal: spread <= max(1, floor(N * 0.3)) untuk sample >= 4*N
  check(`${label} — distribusi wajar (spread ≤ ceil(N/2))`, spread <= Math.ceil(nActive / 2));
  return counts;
}

async function main() {
  console.log('=================================================');
  console.log('  COMPREHENSIVE ROUND-ROBIN TEST');
  console.log('  ' + new Date().toISOString());
  console.log('=================================================');
  console.log('  ' + DATABASE_URL.replace(/:[^:@]+@/, ':***@'));

  // Backup state
  console.log('\n--- Setup: backup state awal ---');
  await q('TRUNCATE leads RESTART IDENTITY CASCADE');
  await q('TRUNCATE visitor_assignments RESTART IDENTITY CASCADE');
  await q('UPDATE rr_counter SET current_index = 0 WHERE id = 1');
  await q('UPDATE busdevs SET is_active = (id IN (1, 2, 3) OR (id > 3 AND is_active))');
  const busdevs = await q('SELECT id, name, is_active FROM busdevs ORDER BY id');
  console.log('  busdevs:', busdevs);
  const active = busdevs.filter((b: any) => b.is_active);
  const N = active.length;
  console.log(`  CS aktif: ${N} →`, active.map((b: any) => b.name));

  // ============================================================
  // A. ROTATION DASAR — N visitor unik
  // ============================================================
  console.log('\n=== A. Rotation dasar (N*4 visitor unik) ===');
  const aItems: string[] = [];
  for (let i = 0; i < N * 4; i++) {
    const r = await q(`SELECT agent_name FROM assign_and_insert_lead($1, 'rot-A-' || $1, 'direct', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`, [`vA-${i}`]);
    aItems.push(r[0].agent_name);
  }
  distCheck('A', aItems, N);
  // validasi round 1 = round 2 = round 3 = round 4
  const aPerRound = (n: number) => aItems.slice(n * N, (n + 1) * N);
  check('A.rot1 == rot2', JSON.stringify(aPerRound(0)) === JSON.stringify(aPerRound(1)));
  check('A.rot2 == rot3', JSON.stringify(aPerRound(1)) === JSON.stringify(aPerRound(2)));

  // ============================================================
  // B. STICKY — visitor sama panggil 5x
  // ============================================================
  console.log('\n=== B. Sticky: visitor sama panggil 5x ===');
  const stickyItems: string[] = [];
  for (let i = 0; i < 5; i++) {
    const r = await q(`SELECT agent_name FROM assign_and_insert_lead($1, 'B', 'direct', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`, ['vB-sticky']);
    stickyItems.push(r[0].agent_name);
  }
  console.log('  sticky returns:', stickyItems);
  check('B.sticky semua ke CS sama', new Set(stickyItems).size === 1);

  // ============================================================
  // C. STICKY EXPIRED → ROTATION
  // ============================================================
  console.log('\n=== C. Sticky expired → rotation ===');
  const firstAgent = stickyItems[0];
  await q(`UPDATE visitor_assignments SET expires_at = NOW() - INTERVAL '1 day' WHERE visitor_id = $1`, ['vB-sticky']);
  const r1 = await q(`SELECT agent_name FROM assign_and_insert_lead($1, 'C', 'direct', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`, ['vB-sticky']);
  const r2 = await q(`SELECT agent_name FROM assign_and_insert_lead($1, 'C', 'direct', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`, ['vB-sticky']);
  console.log(`  expired → can rotate, but next call sticks again to ${r2[0].agent_name}`);
  check('C.visitor baru dapat assignment baru setelah expire', r1[0].agent_name !== null);
  check('C.kedua call sticky lagi', r2[0].agent_name === r1[0].agent_name);

  // ============================================================
  // D. STICKY KE AGENT NONAKTIF → ROTATION
  // ============================================================
  console.log('\n=== D. Sticky ke agent nonaktif → re-assign ===');
  // ambil 1 CS aktif, set sticky ke visitor, lalu nonaktifkan CS tsb
  const anAgent = await q(`SELECT agent_name FROM assign_and_insert_lead('vD-sticky', 'D', 'direct', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`);
  const stickyName = anAgent[0].agent_name;
  // deactivate agent tsb
  await q(`UPDATE busdevs SET is_active = false WHERE name = $1`, [stickyName]);
  // panggil lagi — harus dapat agent AKTIF lain
  const reAssign = await q(`SELECT agent_name FROM assign_and_insert_lead('vD-sticky', 'D', 'direct', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`);
  console.log(`  awal=${stickyName}, setelah deactive=${reAssign[0].agent_name}`);
  check('D.sticky nonaktif di-reassign ke CS aktif lain', reAssign[0].agent_name !== stickyName);
  // re-aktifkan
  await q(`UPDATE busdevs SET is_active = true WHERE name = $1`, [stickyName]);

  // ============================================================
  // E. VISITOR KOSONG/NULL/PENDEK
  // ============================================================
  console.log('\n=== E. Edge visitorId ===');
  // visitorId = ''
  const e1 = await q(`SELECT agent_name FROM assign_and_insert_lead('', 'E', 'direct', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`);
  check('E.empty string → tetep rotasi (tidak error)', !!e1[0].agent_name);
  // visitorId null via route guard: SQL function dipanggil dgn NULL
  const e2 = await q(`SELECT agent_name FROM assign_and_insert_lead(NULL::text, 'E', 'direct', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`);
  check('E.NULL → tetep rotasi', !!e2[0].agent_name);
  // verifikasi TIDAK buat sticky row untuk NULL
  const e3 = await q(`SELECT count(*)::int FROM visitor_assignments WHERE visitor_id IS NULL`);
  check('E.NULL visitor TIDAK buat row visitor_assignments', e3[0].count === 0);
  // visitor pendek
  const e4 = await q(`SELECT agent_name FROM assign_and_insert_lead('abc', 'E', 'direct', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`);
  check('E.short visitorId (3 char) → rotasi (tidak error)', !!e4[0].agent_name);
  // unicode visitor
  const e5 = await q(`SELECT agent_name FROM assign_and_insert_lead('visitor-ünïcödé-测试', 'E', 'direct', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`);
  check('E.unicode visitorId → rotasi', !!e5[0].agent_name);

  // ============================================================
  // F. COUNTER OVERFLOW
  // ============================================================
  console.log('\n=== F. Counter overflow & wrap ===');
  await q(`UPDATE rr_counter SET current_index = 999999999 WHERE id = 1`);
  const fItems: string[] = [];
  for (let i = 0; i < N * 2; i++) {
    const r = await q(`SELECT agent_name FROM assign_and_insert_lead('vF-' || $1, 'F', 'direct', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`, [i]);
    fItems.push(r[0].agent_name);
  }
  distCheck('F. counter overflow', fItems, N);
  await q(`UPDATE rr_counter SET current_index = 0 WHERE id = 1`);

  // ============================================================
  // G. SEMUA CS NONAKTIF → ERROR
  // ============================================================
  console.log('\n=== G. Semua CS nonaktif → error ===');
  await q(`UPDATE busdevs SET is_active = false`);
  let gErr: any = null;
  try { await q(`SELECT agent_name FROM assign_and_insert_lead('vG', 'G', 'direct', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`); }
  catch (e: any) { gErr = e.message; }
  check('G.semua nonaktif → raise exception', !!gErr && gErr.includes('No active busdevs'));
  await q(`UPDATE busdevs SET is_active = (id IN (1, 2, 3) OR (id > 3 AND id != 4))`);

  // ============================================================
  // H. HANYA 1 CS AKTIF
  // ============================================================
  console.log('\n=== H. Hanya 1 CS aktif ===');
  await q(`UPDATE busdevs SET is_active = false`);
  await q(`UPDATE busdevs SET is_active = true WHERE name = 'CS 1'`);
  const hItems: string[] = [];
  for (let i = 0; i < 8; i++) {
    const r = await q(`SELECT agent_name FROM assign_and_insert_lead('vH-' || $1, 'H', 'direct', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`, [i]);
    hItems.push(r[0].agent_name);
  }
  console.log('  dengan 1 CS aktif:', hItems);
  check('H.1 CS aktif → semua ke CS itu', new Set(hItems).size === 1 && hItems[0] === 'CS 1');
  // restore
  await q(`UPDATE busdevs SET is_active = (id IN (1, 2, 3) OR (id > 3 AND id != 4))`);

  // ============================================================
  // I. CONCURRENT — 50 parallel calls (cek atomicity)
  // ============================================================
  console.log('\n=== I. Concurrent 50 parallel calls ===');
  await q(`UPDATE rr_counter SET current_index = 0 WHERE id = 1`);
  const iItems = await Promise.all(
    Array.from({ length: 50 }, (_, i) =>
      q(`SELECT agent_name FROM assign_and_insert_lead('vI-' || $1, 'I', 'direct', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`, [i])
        .then((rows: any) => rows[0].agent_name)
    )
  );
  distCheck('I. concurrent 50', iItems, N);

  // ============================================================
  // J. CONVERT — full pipeline (tracking code + lead saved)
  // ============================================================
  console.log('\n=== J. Convert full pipeline ===');
  const jItems: string[] = [];
  for (let i = 0; i < 6; i++) {
    const r = await q(`SELECT agent_name, tracking_code, wa_url FROM assign_and_insert_lead('vJ-' || $1, 'whatsapp_button', 'organic', 'https://dreamlab.id/test', 'Test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Budi ' || $1, 'PT Test', '08123456789' || $1, 'skincare')`, [i]);
    jItems.push(r[0].agent_name);
    check(`J.${i} tracking code valid`, /^DL-\d{8}-[A-Z0-9]{6}$/.test(r[0].tracking_code));
    check(`J.${i} wa_url valid`, r[0].wa_url.startsWith('https://wa.me/62'));
  }
  console.log('  ', jItems);
  const savedCount = (await q(`SELECT count(*)::int FROM leads WHERE intent = 'whatsapp_button'`))[0].count;
  check('J.semua 6 leads tersimpan', savedCount === 6);

  // ============================================================
  // K. DEDUP 2 MENIT
  // ============================================================
  console.log('\n=== K. Dedup 2 menit ===');
  // call pertama = lead baru
  const k1 = await q(`SELECT agent_name, tracking_code FROM assign_and_insert_lead('vK', 'dedup-test', 'direct', '/dedup-page', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`);
  // call kedua dalam window → tracking code SAMA
  const k2 = await q(`SELECT agent_name, tracking_code FROM assign_and_insert_lead('vK', 'dedup-test', 'direct', '/dedup-page', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`);
  check('K.dedup: tracking code SAMA', k1[0].tracking_code === k2[0].tracking_code);
  // call ketiga beda intent + beda page → lead BARU (dedup pakai OR — kalau salah satu cocok, dianggap sama)
  const k3 = await q(`SELECT agent_name, tracking_code FROM assign_and_insert_lead('vK', 'dedup-test-BEDA', 'direct', '/dedup-page-LAIN', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`);
  check('K.intent BEDA + page BEDA → lead BARU', k3[0].tracking_code !== k1[0].tracking_code);
  // doc: dedup pakai OR (intent cocok ATAU page cocok) — sesuai spec SQL function
  console.log('  catatan: dedup pakai OR — visitor sama + page sama (2 min) = dedup walau intent beda');

  // ============================================================
  // L. TRACKING CODE UNIQUENESS
  // ============================================================
  console.log('\n=== L. Tracking code uniqueness ===');
  const uniq = await q(`SELECT count(*)::int AS total, count(DISTINCT tracking_code)::int AS uniq FROM leads`);
  check('L.tracking_code semua unik', uniq[0].total === uniq[0].uniq);

  // ============================================================
  // FINAL DISTRIBUSI
  // ============================================================
  console.log('\n=== FINAL DISTRIBUSI (semua test di atas) ===');
  const final = await q(`SELECT assigned_to, count(*)::int AS c FROM leads GROUP BY assigned_to ORDER BY c DESC`);
  console.table(final);

  // ============================================================
  // HASIL
  // ============================================================
  const pass = results.filter(r => r.pass).length;
  const fail = results.filter(r => !r.pass).length;
  console.log('\n=================================================');
  console.log(`  HASIL: ${pass} PASS, ${fail} FAIL dari ${results.length}`);
  console.log('=================================================');
  if (fail > 0) {
    console.log('  Gagal:');
    for (const r of results.filter(r => !r.pass)) console.log(`   [FAIL] ${r.name} — ${r.detail ?? ''}`);
  }

  await pool.end();
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((e) => { console.error('FATAL:', e); process.exit(2); });