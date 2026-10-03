import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { convertLead } from '../src/lib/round-robin-db';

async function main() {
  console.log('======================================================================');
  console.log('   TEST PHONE STICKY & BROWSER STICKY DENGAN ROUND ROBIN EQUALITY    ');
  console.log('======================================================================\n');

  // 1. TEST BROWSER STICKY (Browser yang sama klik 5 kali -> CS HARUS SAMA)
  console.log('▶ Test 1: Browser yang sama klik 5 kali berturut-turut');
  const browserA = `browser-sticky-${Date.now()}`;
  const browserResults: string[] = [];

  for (let i = 1; i <= 5; i++) {
    const res = await convertLead({
      visitorId: browserA,
      intent: 'skincare',
      source: 'meta-ads',
      pageUrl: '/produk/skincare',
      isTest: false,
    });
    browserResults.push(res.name);
  }

  const assignedCS = browserResults[0];
  const allSameBrowser = browserResults.every((name) => name === assignedCS);
  if (allSameBrowser) {
    console.log(`  ✓ Lolos: 5 klik dari browser yang sama selalu diarahkan ke ${assignedCS} (tidak double chat).`);
  } else {
    console.error(`  ✗ Gagal: Browser yang sama mendapat CS berbeda:`, browserResults);
    process.exit(1);
  }

  // 2. TEST PHONE STICKY (Nomor yang sama dari browser berbeda -> CS HARUS TETAP SAMA)
  console.log('\n▶ Test 2: Nomor HP yang sama dari browser/perangkat berbeda');
  const clientPhone = `081299887766`;
  const browserB = `browser-different-device-${Date.now()}`;

  // Browser B membuka dengan nomor telepon clientPhone yang sama
  const phoneRes = await convertLead({
    visitorId: browserB,
    intent: 'parfum',
    source: 'google-ads',
    pageUrl: '/produk/parfum',
    hp: clientPhone,
    isTest: false,
  });

  const firstPhoneCS = phoneRes.name;
  console.log(`  Nomor ${clientPhone} pertama kali terhubung dengan: ${firstPhoneCS}`);

  // Browser C (perangkat ketiga) mencoba konversi lagi dengan nomor yang sama
  const browserC = `browser-laptop-office-${Date.now()}`;
  const phoneRes2 = await convertLead({
    visitorId: browserC,
    intent: 'parfum',
    source: 'metaads',
    pageUrl: '/ads/maklon-parfum',
    hp: clientPhone,
    isTest: false,
  });

  if (phoneRes2.name === firstPhoneCS) {
    console.log(`  ✓ Lolos: Nomor HP ${clientPhone} dari browser berbeda TETAP ke ${firstPhoneCS} (tidak bisa ke BusDev lain).`);
  } else {
    console.error(`  ✗ Gagal: Nomor HP yang sama dialihkan ke CS lain: ${phoneRes2.name} (seharusnya ${firstPhoneCS})`);
    process.exit(1);
  }

  // 3. TEST FRESH VISITORS ROUND ROBIN (Visitor baru tanpa nomor & browser baru harus berputar rata ke 3 BusDev)
  console.log('\n▶ Test 3: Rotasi 15 visitor baru murni (harus 5 per BusDev, selisih 0)');
  const counts: Record<string, number> = {};
  for (let i = 1; i <= 15; i++) {
    const freshRes = await convertLead({
      visitorId: `fresh-vid-${Date.now()}-${i}`,
      intent: 'fresh',
      source: 'organic',
      pageUrl: '/produk',
      isTest: false,
    });
    counts[freshRes.name] = (counts[freshRes.name] || 0) + 1;
  }

  console.log('  Hasil distribusi 15 visitor baru:', JSON.stringify(counts));

  // Verifikasi Irma sama sekali tidak masuk
  if (counts['Irma']) {
    console.error('  ✗ CRITICAL FAILURE: Irma received lead in sticky test!', counts);
    process.exit(1);
  }

  const vals = Object.values(counts);
  const diff = Math.max(...vals) - Math.min(...vals);
  if (diff <= 1 && Object.keys(counts).length === 3) {
    console.log(`  ✓ Lolos: 15 visitor baru terdistribusi rata ke 3 BusDev (Annisa, Diaz, Jessica) (selisih: ${diff}) dan Irma nihil.`);
  } else {
    console.error(`  ✗ Gagal distribusi:`, { diff, counts });
    process.exit(1);
  }

  console.log('\n======================================================================');
  console.log('   SEMUA PENGUJIAN PHONE STICKY & BROWSER STICKY BERHASIL LOLOS!     ');
  console.log('======================================================================');
}

main().catch((err) => {
  console.error('Fatal Test Error:', err);
  process.exit(1);
});
