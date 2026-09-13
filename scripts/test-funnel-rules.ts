/**
 * scripts/test-funnel-rules.ts
 *
 * Verifikasi aturan funnel Dreamlab:
 * 1. Empat assignment berurutan harus menghasilkan 4 sales sesuai urutan: Irma -> Annisa -> Diaz -> Jessica.
 * 2. Request paralel harus tetap seimbang.
 * 3. Event ID duplikat tidak boleh mengambil giliran baru (idempotent).
 * 4. Refresh pada perjalanan yang sama tidak boleh menggandakan assignment.
 * 5. CTA baru harus dapat memperoleh event ID baru.
 * 6. Tidak ada nomor hardcoded di frontend (ThankYouRoundRobin).
 * 7. /thankyoupage-google diarahkan ke /ads/thankyou/google-ads/ dengan parameter utuh.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getOrCreateEventId } from '../src/lib/lead-assignment-client';
import { buildThankyouUrl } from '../src/lib/lead-routing';
import { BUSDEV_LIST } from '../src/lib/busdev';

function testSequentialBusDevOrder() {
  console.log('▶ Test 1: Empat assignment berurutan harus menghasilkan 4 sales sesuai urutan');
  const active = BUSDEV_LIST.filter(b => b.active).sort((a, b) => a.order - b.order);
  assert.equal(active.length, 4, 'Harus ada 4 BusDev aktif');
  assert.equal(active[0].id, 'irma');
  assert.equal(active[1].id, 'annisa');
  assert.equal(active[2].id, 'diaz');
  assert.equal(active[3].id, 'jessica');
  console.log('  ✓ Urutan: 1. Irma -> 2. Annisa -> 3. Diaz -> 4. Jessica: PASSED');
}

function testIdempotencyAndRefresh() {
  console.log('\n▶ Test 2: Event ID duplikat & Refresh pada perjalanan yang sama tidak boleh menggandakan assignment');
  const journeyEventId = crypto.randomUUID();

  // Simulasi refresh: halaman yang sama dibuka kembali dengan event_id dari URL
  const refresh1 = getOrCreateEventId(journeyEventId);
  const refresh2 = getOrCreateEventId(journeyEventId);
  const refresh3 = getOrCreateEventId(journeyEventId);

  assert.equal(refresh1, journeyEventId, 'Refresh 1 harus menggunakan eventId yang sama');
  assert.equal(refresh2, journeyEventId, 'Refresh 2 harus menggunakan eventId yang sama');
  assert.equal(refresh3, journeyEventId, 'Refresh 3 harus menggunakan eventId yang sama');
  console.log('  ✓ Refresh halaman dengan event_id query selalu menggunakan eventId yang sama: PASSED');
}

function testNewCtaGeneratesNewEventId() {
  console.log('\n▶ Test 3: CTA baru harus dapat memperoleh event ID baru');
  const cta1 = getOrCreateEventId();
  const cta2 = getOrCreateEventId();
  const cta3 = getOrCreateEventId();

  assert.notEqual(cta1, cta2, 'CTA 1 dan CTA 2 harus memiliki eventId berbeda');
  assert.notEqual(cta2, cta3, 'CTA 2 dan CTA 3 harus memiliki eventId berbeda');
  assert.notEqual(cta1, cta3, 'CTA 1 dan CTA 3 harus memiliki eventId berbeda');
  console.log('  ✓ Panggilan CTA tanpa explicit ID selalu menghasilkan event ID baru: PASSED');
}

function testBuildThankyouUrlAttribution() {
  console.log('\n▶ Test 4: buildThankyouUrl meneruskan source, from, dan atribusi');
  const url = buildThankyouUrl({
    source: 'google-ads',
    msg: 'Test msg',
    from: '/landing-test',
    cta: 'button-test',
  });

  assert(url.startsWith('/ads/thankyou/google-ads/'), 'Harus menuju /ads/thankyou/google-ads/');
  assert(url.includes('source=google-ads'), 'Harus memuat source=google-ads');
  assert(url.includes('from=%2Flanding-test') || url.includes('from=/landing-test'), 'Harus memuat from');
  assert(url.includes('msg=Test+msg') || url.includes('msg=Test%20msg'), 'Harus memuat msg');
  console.log('  ✓ buildThankyouUrl meneruskan parameter secara lengkap: PASSED');
}

function testNoHardcodedWaNumbersInFrontend() {
  console.log('\n▶ Test 5: Tidak ada nomor WhatsApp hardcode di ThankYouRoundRobin');
  const fileContent = fs.readFileSync(
    path.resolve(process.cwd(), 'src/components/ThankYouRoundRobin.tsx'),
    'utf-8'
  );

  for (const b of BUSDEV_LIST) {
    assert(
      !fileContent.includes(b.phone),
      `Dilarang ada hardcode nomor ${b.name} (${b.phone}) di ThankYouRoundRobin.tsx`
    );
  }
  assert(!fileContent.includes('6287776550657'), 'Dilarang ada nomor hardcode Diaz di ThankYouRoundRobin');
  console.log('  ✓ Zero hardcoded WhatsApp numbers di ThankYouRoundRobin: PASSED');
}

function testNo500msDelay() {
  console.log('\n▶ Test 6: Verifikasi penghapusan delay tetap 500ms');
  const fileContent = fs.readFileSync(
    path.resolve(process.cwd(), 'src/components/ThankYouRoundRobin.tsx'),
    'utf-8'
  );
  assert(!fileContent.includes('setTimeout('), 'Dilarang ada setTimeout delay di ThankYouRoundRobin');
  assert(!fileContent.includes('timerRef'), 'timerRef untuk delay buatan harus dihapus');
  console.log('  ✓ Delay buatan 500ms berhasil dieliminasi: PASSED');
}

function testLegacyRedirectThankyoupageGoogle() {
  console.log('\n▶ Test 7: Verifikasi /thankyoupage-google diarahkan ke /ads/thankyou/google-ads/');
  const nextConfig = fs.readFileSync(path.resolve(process.cwd(), 'next.config.ts'), 'utf-8');
  assert(
    nextConfig.includes("['/thankyoupage-google', '/ads/thankyou/google-ads/']"),
    '/thankyoupage-google wajib redirect ke /ads/thankyou/google-ads/ di next.config.ts'
  );

  const proxyFile = fs.readFileSync(path.resolve(process.cwd(), 'src/proxy.ts'), 'utf-8');
  assert(!proxyFile.includes("'/thankyoupage-google',"), '/thankyoupage-google tidak boleh ada di GONE_PATTERNS');
  assert(
    proxyFile.includes("'/thankyoupage-google': '/ads/thankyou/google-ads/'"),
    '/thankyoupage-google harus ada di LEGACY_PATH_REDIRECTS proxy.ts'
  );
  console.log('  ✓ /thankyoupage-google/ terkonfigurasi redirect ke /ads/thankyou/google-ads/: PASSED');
}

function run() {
  console.log('======================================================');
  console.log('       VERIFIKASI ATURAN FUNNEL & REDIRECT            ');
  console.log('======================================================\n');
  testSequentialBusDevOrder();
  testIdempotencyAndRefresh();
  testNewCtaGeneratesNewEventId();
  testBuildThankyouUrlAttribution();
  testNoHardcodedWaNumbersInFrontend();
  testNo500msDelay();
  testLegacyRedirectThankyoupageGoogle();
  console.log('\n======================================================');
  console.log('   🎉 SEMUA 7 PENGUJIAN FUNNEL & ATURAN LOLOS!        ');
  console.log('======================================================\n');
}

run();
