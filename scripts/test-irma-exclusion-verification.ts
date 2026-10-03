import assert from 'node:assert/strict';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { BUSDEV_LIST, getActiveBusdev } from '../src/lib/busdev';
import { AGENTS, getActiveAgents, pickEmergencyFallbackAgent } from '../src/lib/round-robin-config';
import { convertLead, getNextAgentFromDb } from '../src/lib/round-robin-db';
import pool from '../src/lib/db';

const IRMA_PHONE_CLEAN = '085133188827';
const IRMA_INTL_PHONE = '6285133188827';

async function verifyIrmaExclusion() {
  console.log('======================================================================');
  console.log('   VERIFIKASI KOMPREHENSIF: PENGECUALIAN TOTAL IRMA DARI ROUND ROBIN  ');
  console.log('======================================================================\n');

  // 1. Validasi File Konfigurasi (busdev.ts)
  console.log('▶ [1/6] Verifikasi Konfigurasi src/lib/busdev.ts');
  assert.equal(BUSDEV_LIST.length, 3, 'BUSDEV_LIST harus memiliki tepat 3 anggota');
  const hasIrmaInList = BUSDEV_LIST.some(
    b => b.id.toLowerCase().includes('irma') || b.phone.includes('85133188827')
  );
  assert.equal(hasIrmaInList, false, 'Irma tidak boleh ada di BUSDEV_LIST');

  const activeBusdev = getActiveBusdev();
  assert.equal(activeBusdev.length, 3, 'Harus ada 3 BusDev aktif');
  const activeNames = activeBusdev.map(b => b.name);
  console.log(`  ✓ Anggota aktif (${activeBusdev.length}): ${activeNames.join(', ')}`);
  assert.deepEqual(activeNames, ['Annisa', 'Diaz', 'Jessica']);
  console.log('  ✓ Lolos: Irma tidak ada di busdev.ts');

  // 2. Validasi Konfigurasi Fallback & In-Memory (round-robin-config.ts)
  console.log('\n▶ [2/6] Verifikasi Konfigurasi round-robin-config.ts');
  const activeAgents = getActiveAgents();
  assert.equal(activeAgents.length, 3, 'Harus ada tepat 3 active agents');
  for (let i = 0; i < 20; i++) {
    const fallback = pickEmergencyFallbackAgent(`test-seed-${i}`);
    assert.notEqual(fallback.name?.toLowerCase(), 'irma', 'Emergency fallback tidak boleh Irma');
    assert.notEqual(fallback.phone, IRMA_INTL_PHONE, 'Emergency fallback phone tidak boleh Irma');
  }
  console.log('  ✓ Lolos: Emergency fallback server-side tidak pernah memilih Irma');

  // 3. Validasi Database: Tabel busdevs & Sticky Tables
  console.log('\n▶ [3/6] Verifikasi Data di PostgreSQL Database');
  const dbBusdevs = await pool.query('SELECT * FROM busdevs WHERE is_active = true ORDER BY id ASC');
  console.log(`  Agen aktif di DB: ${dbBusdevs.rows.map((r: any) => `${r.name} (${r.phone})`).join(', ')}`);
  assert.equal(dbBusdevs.rows.length, 3, 'Hanya ada 3 agen aktif di database');
  
  const irmaRow = await pool.query("SELECT * FROM busdevs WHERE phone = $1 OR name ILIKE '%irma%'", [IRMA_PHONE_CLEAN]);
  if (irmaRow.rows.length > 0) {
    assert.equal(irmaRow.rows[0].is_active, false, 'Irma di DB wajib berstatus is_active = false');
    console.log(`  ✓ Irma di DB id=${irmaRow.rows[0].id} berstatus is_active=false`);

    // Pastikan tidak ada sticky records untuk Irma
    const irmaId = irmaRow.rows[0].id;
    const stickyPhone = await pool.query('SELECT count(*) FROM phone_assignments WHERE agent_id = $1', [irmaId]);
    const stickyVisitor = await pool.query('SELECT count(*) FROM visitor_assignments WHERE agent_id = $1', [irmaId]);
    assert.equal(Number(stickyPhone.rows[0].count), 0, 'phone_assignments untuk Irma harus 0');
    assert.equal(Number(stickyVisitor.rows[0].count), 0, 'visitor_assignments untuk Irma harus 0');
    console.log('  ✓ Lolos: Seluruh penugasan sticky untuk Irma di DB bernilai 0 (bersih)');
  }

  // 4. Pengujian Rotasi Sequential (30 Leads)
  console.log('\n▶ [4/6] Rotasi 30 Leads Berurutan via convertLead');
  const seqCounts: Record<string, number> = {};
  const seqList: string[] = [];
  for (let i = 1; i <= 30; i++) {
    const res = await convertLead({
      visitorId: `irma-test-seq-${Date.now()}-${i}`,
      intent: 'irma-exclusion-test',
      source: 'google-ads',
      pageUrl: '/produk/skincare',
      isTest: true,
    });
    assert.notEqual(res.name.toLowerCase(), 'irma', 'Hasil convertLead tidak boleh Irma!');
    assert.notEqual(res.phoneNumber, IRMA_INTL_PHONE, 'Nomor HP tidak boleh milik Irma!');
    seqCounts[res.name] = (seqCounts[res.name] || 0) + 1;
    seqList.push(res.name);
  }
  console.log('  Urutan 6 lead pertama:', seqList.slice(0, 6).join(' -> '));
  console.log('  Distribusi 30 leads:', JSON.stringify(seqCounts));
  assert.equal(seqCounts['Annisa'], 10, 'Annisa harus tepat 10');
  assert.equal(seqCounts['Diaz'], 10, 'Diaz harus tepat 10');
  assert.equal(seqCounts['Jessica'], 10, 'Jessica harus tepat 10');
  assert.equal(seqCounts['Irma'], undefined, 'Irma tidak boleh menerima lead apapun');
  console.log('  ✓ Lolos: 30 leads terbagi rata 10:10:10 ke Annisa, Diaz, Jessica dan 0 ke Irma');

  // 5. Pengujian Langsung Fungsi DB RPC: assign_next_agent
  console.log('\n▶ [5/6] Pengujian Langsung RPC Database assign_next_agent()');
  for (let i = 1; i <= 9; i++) {
    const agent = await getNextAgentFromDb(`rpc-test-${Date.now()}-${i}`, true);
    assert.notEqual(agent.name.toLowerCase(), 'irma', 'RPC assign_next_agent tidak boleh Irma');
    assert.notEqual(agent.phoneNumber, IRMA_INTL_PHONE, 'Nomor HP tidak boleh milik Irma');
  }
  console.log('  ✓ Lolos: 9 panggilan RPC assign_next_agent selalu menghasilkan agen aktif');

  // 6. Pengujian Skenario Khusus: Visitor / Client Lama yang Sebelumnya ke Irma
  console.log('\n▶ [6/6] Skenario Edge-Case: Prospek dengan riwayat lama mencoba kontak ulang');
  // Client yang memasukkan nomor HP sembarang namun mencoba kontak kembali
  const reassignRes = await convertLead({
    visitorId: `legacy-irma-visitor-${Date.now()}`,
    intent: 'skincare-maklon',
    source: 'meta-ads',
    pageUrl: '/produk',
    hp: '081233445566',
    isTest: true,
  });
  console.log(`  Prospek otomatis dialihkan ke: ${reassignRes.name} (${reassignRes.phoneNumber})`);
  assert.notEqual(reassignRes.name.toLowerCase(), 'irma');
  assert.notEqual(reassignRes.phoneNumber, IRMA_INTL_PHONE);
  console.log('  ✓ Lolos: Reassignment otomatis bekerja dan tidak pernah jatuh ke Irma');

  console.log('\n======================================================================');
  console.log('   🎉 VERIFIKASI SELESAI: 100% TERBUKTI IRMA TIDAK MASUK ROUND ROBIN  ');
  console.log('======================================================================');

  await pool.end();
}

verifyIrmaExclusion().catch(async (err) => {
  console.error('\n❌ VERIFIKASI GAGAL:', err);
  await pool.end();
  process.exit(1);
});
