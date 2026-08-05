/**
 * test-round-robin-full.mjs
 *
 * FULL TESTING round-robin lead distribution — SEMUA state & kondisi,
 * bukan hanya happy path. Terhubung ke DATABASE_URL dari env.
 */

import { Pool } from 'pg';
import {
  getNextAgentFromDb,
  insertLead,
  getDbLeadStats,
  normalizePhone,
} from '../src/lib/round-robin-db.ts';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

let passed = 0;
let failed = 0;
const failures = [];

function check(name, cond, detail = '') {
  if (cond) { passed += 1; console.log(`  [PASS] ${name}`); }
  else { failed += 1; failures.push({ name, detail }); console.log(`  [FAIL] ${name} ${detail ? '-> ' + detail : ''}`); }
}

async function q(text, params = []) { const r = await pool.query(text, params); return r.rows; }

async function resetState() {
  await q('TRUNCATE leads RESTART IDENTITY');
  await q('TRUNCATE visitor_assignments RESTART IDENTITY');
  await q('UPDATE rr_counter SET current_index = 0 WHERE id = 1');
  await q('UPDATE busdevs SET is_active = true');
}

async function main() {
  console.log('\n==================================================');
  console.log('  FULL TEST ROUND-ROBIN (semua state & kondisi)');
  console.log('==================================================');
  console.log('  host: ' + new URL(process.env.DATABASE_URL).host);

  await resetState();

  // A. ROTASI
  console.log('\n-- A. ROTASI (visitor baru) --');
  const phones = (await q('SELECT id, phone FROM busdevs WHERE is_active ORDER BY id')).map((r) => r.phone);
  const n = phones.length;
  console.log('  Aktif: ' + n + ' CS -> ' + phones.join(', '));

  const order = [];
  for (let i = 0; i < n * 2; i += 1) {
    const a = await getNextAgentFromDb('rot-' + i);
    order.push(a.phoneNumber);
  }
  console.log('  Urutan rotasi: ' + order.join(' -> '));
  const firstRound = order.slice(0, n);
  const firstRoundSet = new Set(firstRound);
  check('A1: 1 putaran = semua CS berbeda persis sekali', firstRoundSet.size === n, 'dapat ' + firstRoundSet.size + ' unik dari ' + n);
  const secondRound = order.slice(n, n * 2);
  check('A2: putaran 2 identik dengan putaran 1 (wrap-around konsisten)', secondRound.join(',') === firstRound.join(','));
  const counts = {};
  for (const p of order) counts[p] = (counts[p] ?? 0) + 1;
  const allEqual = Object.values(counts).every((c) => c === 2);
  check('A3: distribusi rata sempurna (2x per CS)', allEqual, JSON.stringify(counts));

  // B. STICKY
  console.log('\n-- B. STICKY (1 visitor = 1 CS) --');
  const s1 = await getNextAgentFromDb('sticky-1');
  const counterBefore = (await q('SELECT current_index FROM rr_counter WHERE id=1'))[0].current_index;
  const s2 = await getNextAgentFromDb('sticky-1');
  const counterAfter = (await q('SELECT current_index FROM rr_counter WHERE id=1'))[0].current_index;
  check('B1: visitor sama -> CS sama', s2.id === s1.id, s1.id + ' vs ' + s2.id);
  check('B1b: counter TIDAK maju utk visitor lama', counterAfter === counterBefore, counterBefore + ' -> ' + counterAfter);

  await q("UPDATE visitor_assignments SET expires_at = NOW() - INTERVAL '1 day' WHERE visitor_id = $1", ['sticky-1']);
  const s3 = await getNextAgentFromDb('sticky-1');
  const newAssign = (await q('SELECT agent_id FROM visitor_assignments WHERE visitor_id=$1', ['sticky-1']))[0].agent_id;
  check('B2: assignment expired -> di-assign ulang & sticky diperbarui', String(newAssign) === String(s3.id));

  const activeAgent = await getNextAgentFromDb('sticky-b3');
  const inactiveAgentId = activeAgent.id;
  await q('UPDATE busdevs SET is_active = false WHERE id = $1', [inactiveAgentId]);
  const reassigned = await getNextAgentFromDb('sticky-b3');
  check('B3: CS sticky nonaktif -> dapat CS aktif lain', reassigned.id !== inactiveAgentId, 'sebelum=' + inactiveAgentId + ' sesudah=' + reassigned.id);
  await q('UPDATE busdevs SET is_active = true WHERE id = $1', [inactiveAgentId]);

  // C. ERROR / EDGE
  console.log('\n-- C. ERROR & EDGE CASE --');
  await q('UPDATE busdevs SET is_active = false');
  let c1Err = null;
  try { await getNextAgentFromDb('edge-all-inactive'); } catch (e) { c1Err = e.message; }
  check('C1: semua CS nonaktif -> error dilempar', !!c1Err && c1Err.includes('No active busdevs'), c1Err);
  await q('UPDATE busdevs SET is_active = true');

  const n1 = await getNextAgentFromDb(null);
  const n2 = await getNextAgentFromDb(null);
  check('C2: visitor null -> tetap rotasi (bukan error)', !!n1 && !!n2);
  const nullAssigns = (await q("SELECT count(*) AS c FROM visitor_assignments WHERE visitor_id IS NULL"))[0].c;
  check('C2b: visitor null tidak membuat sticky row', Number(nullAssigns) === 0, 'ditemukan ' + nullAssigns);

  const ai = await getNextAgentFromDb('edge-order');
  check('C3: order_index dalam rentang valid', ai.orderIndex >= 0 && ai.orderIndex < n, 'orderIndex=' + ai.orderIndex);

  // D. INSERT LEAD & DEDUP
  console.log('\n-- D. INSERT LEAD & DEDUP --');
  const l1 = await insertLead({ intent: 'test-intent', source: 'organic', visitorId: 'lead-1', pageUrl: '/a', assignedName: 'CS 1', assignedPhone: '08123456789' });
  check('D1: insert normal -> trackingCode DL-*', /^DL-\d{8}-[A-Z0-9]{6}$/.test(l1.trackingCode), l1.trackingCode);
  check('D1b: waUrl terbentuk dari assignedPhone', l1.waUrl === 'https://wa.me/628123456789', l1.waUrl);

  const l2 = await insertLead({ intent: 'test-intent', source: 'organic', visitorId: 'lead-1', pageUrl: '/a' });
  check('D2: dedup intent sama -> trackingCode SAMA', l2.trackingCode === l1.trackingCode);
  const vc = (await q('SELECT visit_count FROM leads WHERE tracking_code=$1', [l1.trackingCode]))[0].visit_count;
  check('D2b: visit_count bertambah', Number(vc) === 2, 'visit_count=' + vc);

  const l3 = await insertLead({ intent: 'intent-beda', source: 'organic', visitorId: 'lead-1', pageUrl: '/a' });
  check('D3: dedup page_url sama -> code SAMA', l3.trackingCode === l1.trackingCode);

  const l4 = await insertLead({ intent: 'produk-lain', source: 'metaads', visitorId: 'lead-1', pageUrl: '/produk-lain' });
  check('D4: intent & halaman beda -> lead BARU', l4.trackingCode !== l1.trackingCode);

  const l5 = await insertLead({ intent: 'no-phone', visitorId: 'lead-5' });
  check('D5: tanpa assignedPhone -> waUrl kosong', l5.waUrl === '', l5.waUrl);

  check('D6a: normalize 0812 -> 62812', normalizePhone('08123456789') === '628123456789');
  check('D6b: normalize 6281 tetap 6281', normalizePhone('628123456789') === '628123456789');
  check('D6c: normalize +62 812-3456-789 -> 62812', normalizePhone('+62 812-3456-789') === '628123456789');

  // E. STATS
  console.log('\n-- E. STATS --');
  const stats = await getDbLeadStats();
  const leadRows = Number((await q('SELECT count(*) AS c FROM leads'))[0].c);
  const assignRows = Number((await q('SELECT count(*) AS c FROM visitor_assignments'))[0].c);
  check('E1: totalLeads = jumlah baris leads', stats.totalLeads === leadRows, stats.totalLeads + ' vs ' + leadRows);
  check('E2: totalRotations = jumlah visitor_assignments', stats.totalRotations === assignRows, stats.totalRotations + ' vs ' + assignRows);

  console.log('\n==================================================');
  console.log('  HASIL: ' + passed + ' PASS, ' + failed + ' FAIL');
  if (failed > 0) {
    console.log('\n  Gagal:');
    for (const f of failures) console.log('   [FAIL] ' + f.name + (f.detail ? ' | ' + f.detail : ''));
  }
  console.log('==================================================');
  await pool.end();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => { console.error('FATAL:', e); process.exit(2); });
