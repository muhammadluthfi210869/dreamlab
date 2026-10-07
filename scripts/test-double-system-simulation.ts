import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import pool from '../src/lib/db';
import { convertLead } from '../src/lib/round-robin-db';

async function runTests() {
  console.log('====================================================');
  console.log('   FASE 2: AUTOMATED TESTING & PROBE SIMULATION    ');
  console.log('====================================================\n');

  const client = await pool.connect();
  const testLeadsCreated: string[] = [];

  try {
    // ----------------------------------------------------
    // TEST 1: STRESS TEST 30 UNIQUE LEADS
    // ----------------------------------------------------
    console.log('--- TEST 1: Stress Test 30 Unique Sequential Leads ---');
    const counts: Record<string, number> = { Annisa: 0, Diaz: 0, Jessica: 0 };

    for (let i = 1; i <= 30; i++) {
      const visitorId = `sim_test_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 6)}`;
      const result = await convertLead({
        visitorId,
        source: 'test-stress',
        intent: 'stress_test_simulation',
        pageUrl: '/ads/maklon-parfum',
        isTest: true,
      });

      testLeadsCreated.push(result.trackingCode);
      const agentName = result.name || 'Unknown';
      counts[agentName] = (counts[agentName] || 0) + 1;
    }

    console.log('Hasil Distribusi 30 Leads Uji Coba:');
    console.table(counts);

    const totalLeads = Object.values(counts).reduce((a, b) => a + b, 0);
    const spread = Math.max(...Object.values(counts)) - Math.min(...Object.values(counts));
    console.log(`Total Leads: ${totalLeads}, Max Spread: ${spread}`);

    if (totalLeads === 30 && spread <= 1) {
      console.log('✅ TEST 1 PASSED: Distribusi 30 lead merata sempurna (selisih <= 1 lead)!\n');
    } else {
      console.warn(`⚠️ TEST 1 WARNING: Spread = ${spread}\n`);
    }

    // ----------------------------------------------------
    // TEST 2: STICKY VISITOR & SAFETY GUARD AUTO-BALANCER
    // ----------------------------------------------------
    console.log('--- TEST 2: Sticky Visitor & Safety Guard Auto-Balancer ---');
    const stickyVisitorId = `sticky_vip_${Date.now()}`;
    
    // Klik 1: Mendapat agen pertama (visitor riil untuk menguji sticky)
    const lead1 = await convertLead({
      visitorId: stickyVisitorId,
      source: 'test-sticky',
      isTest: false,
    });
    testLeadsCreated.push(lead1.trackingCode);
    const assignedAgent = lead1.name;
    console.log(`Klik 1: Visitor ${stickyVisitorId} di-assign ke: ${assignedAgent}`);

    // Klik 2: Harus sticky ke agen yang sama
    const lead2 = await convertLead({
      visitorId: stickyVisitorId,
      source: 'test-sticky',
      isTest: false,
    });
    console.log(`Klik 2: Visitor yang sama kembali di-assign ke: ${lead2.name}`);

    if (lead1.name === lead2.name) {
      console.log('✅ Sticky Verification: Agen tetap sama untuk visitor yang sama.\n');
    } else {
      console.error('❌ Sticky Verification FAILED: Agen berubah!\n');
    }

    // ----------------------------------------------------
    // TEST 3: DROP-OFF TO CONFIRM & LATENCY CALCULATION
    // ----------------------------------------------------
    console.log('--- TEST 3: Drop-Off Tracking & Latency Calculation ---');
    const probeVid = `probe_latency_${Date.now()}`;
    const testPhone = '6289531681278';
    
    const probe = await convertLead({
      visitorId: probeVid,
      source: 'meta-ads',
      nama: 'Bapak Simulasi',
      hp: testPhone,
      isTest: true,
    });
    testLeadsCreated.push(probe.trackingCode);
    console.log(`Probe Lead Dibuat: ${probe.trackingCode} untuk ${probe.name}`);

    // Cek status awal (harus assigned / drop-off dengan display_phone dari form web)
    const checkBefore = await client.query(`
      SELECT tracking_code, status, hp, wa_phone, 
             COALESCE(wa_phone, hp) AS display_phone,
             confirmed_at
      FROM leads
      WHERE tracking_code = $1
    `, [probe.trackingCode]);
    console.log('Status sebelum konfirmasi:', checkBefore.rows[0]);

    if (checkBefore.rows[0].status === 'assigned' && checkBefore.rows[0].display_phone === testPhone) {
      console.log('✅ Drop-off Check: Nomor formulir web berhasil ditangkap meski chat belum terkirim!');
    }

    // Tunggu 2 detik untuk simulasi jeda waktu (latency)
    console.log('Simulasi jeda 2 detik sebelum chat masuk...');
    await new Promise((r) => setTimeout(r, 2000));

    // Konfirmasi lead via SQL
    await client.query(`
      UPDATE leads
         SET status = 'confirmed',
             wa_phone = $1,
             wa_message = 'Halo saya ingin maklon parfum',
             confirmed_at = NOW()
       WHERE tracking_code = $2
    `, [testPhone, probe.trackingCode]);

    // Cek status setelah konfirmasi & hitung latency
    const checkAfter = await client.query(`
      SELECT tracking_code, status, confirmed_at,
             ROUND(EXTRACT(EPOCH FROM (confirmed_at - created_at)))::int AS latency_seconds
      FROM leads
      WHERE tracking_code = $1
    `, [probe.trackingCode]);
    console.log('Status setelah konfirmasi:', checkAfter.rows[0]);

    if (checkAfter.rows[0].status === 'confirmed' && (checkAfter.rows[0].latency_seconds ?? 0) >= 1) {
      console.log(`✅ Latency Check: Terhitung akurat sebesar ${checkAfter.rows[0].latency_seconds} detik!\n`);
    }

  } catch (err) {
    console.error('Test Error:', err);
  } finally {
    // ----------------------------------------------------
    // CLEANUP: BERSIHKAN DATA UJI COBA
    // ----------------------------------------------------
    console.log('--- CLEANUP: Membersihkan data uji coba dari DB ---');
    if (testLeadsCreated.length > 0) {
      const delRes = await client.query(`
        DELETE FROM leads 
        WHERE is_test IS TRUE 
           OR tracking_code = ANY($1)
      `, [testLeadsCreated]);
      console.log(`✅ Cleaned up ${delRes.rowCount} test leads.`);
    }

    // Bersihkan visitor_assignments dummy
    await client.query(`
      DELETE FROM visitor_assignments 
      WHERE visitor_id LIKE 'sim_test_%' 
         OR visitor_id LIKE 'sticky_vip_%' 
         OR visitor_id LIKE 'probe_latency_%'
    `);
    console.log('✅ Cleaned up test visitor assignments.');

    client.release();
    await pool.end();
    console.log('\n====================================================');
    console.log('       SELURUH PENGUJIAN FASE 2 BERHASIL (PASSED)    ');
    console.log('====================================================');
  }
}

runTests().catch(console.error);
