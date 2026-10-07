import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://dreamlab1:ZXUvz2qA8Ucv895YQBBmspwizu@103.93.134.215:6432/dreamlab?sslmode=disable'
});

async function audit() {
  await client.connect();

  console.log('========================================================================');
  console.log('         DREAMLAB ROUND-ROBIN FAIRNESS & FORENSIC AUDIT TOOL            ');
  console.log('========================================================================\n');

  // 1. Periksa Status BusDev Aktif
  const busdevsRes = await client.query(`
    SELECT id, name, phone, is_active 
    FROM busdevs 
    ORDER BY is_active DESC, id ASC
  `);
  console.log('📋 STATUS BUSDEV DI SISTEM:');
  console.table(busdevsRes.rows.map(b => ({
    Nama: b.name,
    Nomor: b.phone,
    Status: b.is_active ? '🟢 AKTIF' : '⚪ NONAKTIF'
  })));

  // 2. Periksa Distribusi Hari Ini (Asia/Jakarta boundary)
  const todayStatsRes = await client.query(`
    WITH active_busdevs AS (
      SELECT id, name, phone FROM busdevs WHERE is_active = true
    )
    SELECT 
      b.name AS sales_name,
      COUNT(l.id) FILTER (WHERE l.source != 'wa-direct')::int AS total_klik_web,
      COUNT(DISTINCT l.visitor_id) FILTER (WHERE l.source != 'wa-direct' AND l.visitor_id IS NOT NULL)::int AS visitor_unik,
      COUNT(l.id) FILTER (WHERE l.status = 'confirmed' AND l.source != 'wa-direct')::int AS chat_valid_web,
      COUNT(l.id) FILTER (WHERE (l.status IS NULL OR l.status != 'confirmed') AND l.source != 'wa-direct')::int AS dropoff_web,
      COUNT(l.id) FILTER (WHERE l.source = 'wa-direct')::int AS chat_direct_wa,
      MAX(l.created_at) AS klik_terakhir,
      MAX(l.confirmed_at) AS chat_terakhir
    FROM active_busdevs b
    LEFT JOIN leads l ON (
      (l.assigned_to = b.name OR l.assigned_phone = regexp_replace(b.phone, '[^0-9]', '', 'g'))
      AND l.created_at >= (date_trunc('day', CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta') AT TIME ZONE 'Asia/Jakarta')
      AND l.is_test IS NOT TRUE
    )
    GROUP BY b.name, b.id
    ORDER BY b.name ASC;
  `);

  console.log('\n📊 DISTRIBUSI LEAD HARI INI (REAL-TIME ASIA/JAKARTA):');
  console.table(todayStatsRes.rows.map(r => {
    const convRate = r.total_klik_web > 0 ? ((r.chat_valid_web / r.total_klik_web) * 100).toFixed(1) + '%' : '0%';
    const lastClickStr = r.klik_terakhir ? new Date(r.klik_terakhir).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' }) : '—';
    const lastChatStr = r.chat_terakhir ? new Date(r.chat_terakhir).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' }) : '—';
    return {
      'Nama Sales': r.sales_name,
      'Total Klik': r.total_klik_web,
      'Visitor Unik': r.visitor_unik,
      'Chat Valid': r.chat_valid_web,
      'Drop-off': r.dropoff_web,
      'Rasio Validasi': convRate,
      'Chat Direct WA': r.chat_direct_wa,
      'Klik Terakhir': lastClickStr,
      'Chat Terakhir': lastChatStr,
    };
  }));

  // 3. Analisis Keadilan Berdasarkan CHAT RIIL (Confirmed Chats)
  const activeConfirmed = todayStatsRes.rows.map(r => r.chat_valid_web);
  const maxConfirmed = Math.max(...activeConfirmed);
  const minConfirmed = Math.min(...activeConfirmed);
  const spreadConfirmed = maxConfirmed - minConfirmed;

  const activeClicks = todayStatsRes.rows.map(r => r.total_klik_web);
  const maxClicks = Math.max(...activeClicks);
  const minClicks = Math.min(...activeClicks);
  const spreadClicks = maxClicks - minClicks;

  console.log('\n🔍 KESIMPULAN AUDIT KEADILAN (MURNI BERDASARKAN CHAT RIIL):');
  if (spreadConfirmed <= 1) {
    console.log(`✅ STATUS CHAT RIIL: 100% MERATA & ADIL (Selisih chat valid hanya ${spreadConfirmed} chat).`);
    console.log('   Algoritma Confirmed-Chat Auto-Balancer berhasil menjaga jumlah chat seimbang!');
  } else {
    console.log(`⚠️ STATUS CHAT RIIL: Terdeteksi selisih ${spreadConfirmed} chat (Tertinggi: ${maxConfirmed}, Terendah: ${minConfirmed}).`);
    console.log('   -> Sistem Safety Guard secara otomatis memprioritaskan klik baru ke sales yang chat riilnya tertinggal');
    console.log('      sampai perolehan chat valid mereka kembali seimbang!');
    console.log(`   (Info Klik Web: Tertinggi ${maxClicks}, Terendah ${minClicks}, Selisih ${spreadClicks} klik karena kompensasi drop-off).`);
  }

  // 4. Analisis Validasi / MacroDroid Health
  console.log('\n📱 ANALISIS KONEKSI HANDPHONE & MACRODROID:');
  for (const row of todayStatsRes.rows) {
    if (row.total_klik_web > 0 && row.chat_valid_web === 0) {
      console.log(`🚨 PERINGATAN [${row.sales_name}]: Menerima ${row.total_klik_web} klik tapi 0 chat valid!`);
      console.log(`   -> Segera periksa HP ${row.sales_name}: Apakah MacroDroid aktif, baterai unrestricted, dan internet terhubung?`);
    } else {
      console.log(`✅ [${row.sales_name}]: Berjalan normal (${row.chat_valid_web} terkonfirmasi dari ${row.total_klik_web} klik).`);
    }
  }

  // 5. 10 Leads Terakhir Hari Ini
  const recentLeads = await client.query(`
    SELECT tracking_code, assigned_to, status, source,
           COALESCE(wa_phone, hp) AS no_klien,
           created_at, confirmed_at,
           ROUND(EXTRACT(EPOCH FROM (confirmed_at - created_at)))::int AS latency_dtk
    FROM leads
    WHERE created_at >= (date_trunc('day', CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta') AT TIME ZONE 'Asia/Jakarta')
      AND is_test IS NOT TRUE
    ORDER BY created_at DESC
    LIMIT 10
  `);

  console.log('\n🕒 10 LEAD TERAKHIR HARI INI:');
  console.table(recentLeads.rows.map(l => ({
    Kode: l.tracking_code,
    Sales: l.assigned_to,
    Status: l.status === 'confirmed' ? '✅ Valid' : '⚠️ Drop-off',
    'No HP': l.no_klien || '—',
    'Waktu Klik': new Date(l.created_at).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' }),
    'Waktu Chat': l.confirmed_at ? new Date(l.confirmed_at).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' }) : '—',
    Latency: l.latency_dtk != null ? `${l.latency_dtk} dtk` : '—'
  })));

  await client.end();
}

audit().catch(console.error);
