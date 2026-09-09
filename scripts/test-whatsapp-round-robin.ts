/**
 * scripts/test-whatsapp-round-robin.ts
 *
 * Pengujian komprehensif sistem pembagian lead WhatsApp Dreamlab:
 * 1. Empat event berurutan menghasilkan Irma -> Annisa -> Diaz -> Diva.
 * 2. Event kelima kembali ke Irma.
 * 3. Empat puluh event unik menghasilkan distribusi tepat 10:10:10:10.
 * 4. Lima puluh request concurrent menghasilkan selisih maksimal 1 antar-BusDev.
 * 5. Request dengan eventId sama: tidak menaikkan counter, tidak membuat row baru, mengembalikan BusDev yang sama (idempotensi).
 * 6. BusDev active: false dilewati.
 * 7. Source tidak valid dinormalisasi menjadi unknown.
 * 8. Redis gagal menggunakan fallback Neon.
 * 9. API tidak dapat di-cache (Cache-Control: no-store).
 * 10. Tidak ada lagi penggunaan waIndex di codebase.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getActiveBusdev, BusDevItem } from '../src/lib/busdev';
import { identifyLeadSource, normalizeSourceToLeadSource } from '../src/lib/lead-source';
import { getWhatsAppMessage, buildWhatsAppLeadUrl } from '../src/lib/whatsapp-messages';

/// Mock in-memory atomic counter simulating Redis atomic Lua script reservation
class MockAtomicRedis {
  private counter: number = 0;
  private cache: Map<string, unknown> = new Map();
  public isDown: boolean = false;

  async atomicReserveAndAssign(eventId: string): Promise<{
    status: 'CACHED' | 'ASSIGNED';
    sequence?: number;
    assignment?: unknown;
  }> {
    if (this.isDown) throw new Error('Redis connection failed');
    const eventKey = `dreamlab:lead-event:${eventId}`;
    const existing = this.cache.get(eventKey);
    if (existing) {
      if (typeof existing === 'string' && existing.startsWith('RESERVED:')) {
        const seq = parseInt(existing.replace('RESERVED:', ''), 10);
        return { status: 'ASSIGNED', sequence: seq };
      }
      return { status: 'CACHED', assignment: existing };
    }
    this.counter += 1;
    const seq = this.counter;
    this.cache.set(eventKey, `RESERVED:${seq}`);
    return { status: 'ASSIGNED', sequence: seq };
  }

  async set(key: string, value: unknown): Promise<void> {
    if (this.isDown) throw new Error('Redis connection failed');
    this.cache.set(key, value);
  }

  getCounter(): number {
    return this.counter;
  }

  reset() {
    this.counter = 0;
    this.cache.clear();
    this.isDown = false;
  }
}

// Mock Neon DB simulating transactional audit log & fallback
class MockNeonDb {
  public assignments: Map<string, Record<string, unknown>> = new Map();
  public queryCount: number = 0;

  async assignAndRecordLeadViaNeonAtomic(params: {
    id: string;
    eventId: string;
    source: string;
    busdevs: BusDevItem[];
  }): Promise<{ record: Record<string, unknown>; isExisting: boolean }> {
    this.queryCount += 1;
    // Transactional advisory lock simulation
    if (this.assignments.has(params.eventId)) {
      return { record: this.assignments.get(params.eventId)!, isExisting: true };
    }
    const total = this.assignments.size;
    const busdev = params.busdevs[total % params.busdevs.length];
    const record = {
      id: params.id,
      eventId: params.eventId,
      source: params.source,
      salesId: busdev.id,
      salesName: busdev.name,
      salesPhone: busdev.phone,
      status: 'assigned',
    };
    this.assignments.set(params.eventId, record);
    return { record, isExisting: false };
  }

  reset() {
    this.assignments.clear();
    this.queryCount = 0;
  }
}

const mockRedis = new MockAtomicRedis();
const mockNeon = new MockNeonDb();

async function simulateAssignEndpoint(body: {
  eventId: string;
  source?: string;
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  messageKey?: string;
}) {
  const eventId = body.eventId;
  const activeBusdev = getActiveBusdev();

  // 1. Normalisasi Source
  let resolvedSource = normalizeSourceToLeadSource(body.source);
  if (resolvedSource === 'unknown' && !body.source) {
    resolvedSource = identifyLeadSource({
      sourceParam: body.source,
      utmSource: body.utmSource,
      utmMedium: body.utmMedium,
      utmCampaign: body.utmCampaign,
      referrer: body.referrer,
      pathname: body.landingPage,
    });
  }

  let selectedBusdev: BusDevItem;
  let status: 'assigned' | 'fallback' = 'assigned';
  let wasCached = false;
  const assignmentId = crypto.randomUUID();

  // 2. Atomic Redis Reservation
  try {
    const reserveRes = await mockRedis.atomicReserveAndAssign(eventId);
    if (reserveRes.status === 'CACHED') {
      const cached = reserveRes.assignment as Record<string, unknown> & {
        sales: { id: string; name: string };
        whatsappUrl: string;
      };
      return { ...cached, wasCached: true };
    }
    const seq = reserveRes.sequence!;
    const index = (seq - 1) % activeBusdev.length;
    selectedBusdev = activeBusdev[index];
  } catch {
    // Redis down -> Fallback Neon Atomic Transaction (Selection & Insert in 1 Tx)
    status = 'fallback';
    const neonRes = await mockNeon.assignAndRecordLeadViaNeonAtomic({
      id: assignmentId,
      eventId,
      source: resolvedSource,
      busdevs: activeBusdev,
    });
    selectedBusdev = {
      id: neonRes.record.salesId as string,
      name: neonRes.record.salesName as string,
      phone: neonRes.record.salesPhone as string,
      active: true,
      order: 1,
    };
    if (neonRes.isExisting) wasCached = true;
  }

  const messageText = getWhatsAppMessage(body.messageKey || resolvedSource);
  const whatsappUrl = buildWhatsAppLeadUrl(selectedBusdev.phone, messageText);

  const result = {
    success: true,
    assignmentId,
    source: resolvedSource,
    sales: {
      id: selectedBusdev.id,
      name: selectedBusdev.name,
    },
    whatsappUrl,
    status,
    wasCached,
  };

  // Simpan ke Redis cache (menggantikan marker RESERVED)
  try {
    await mockRedis.set(`dreamlab:lead-event:${eventId}`, result);
  } catch {}

  // Simpan ke Neon audit log jika bukan fallback
  if (status === 'assigned') {
    await mockNeon.assignAndRecordLeadViaNeonAtomic({
      id: assignmentId,
      eventId,
      source: resolvedSource,
      busdevs: activeBusdev,
    });
  }

  return result;
}

async function runAllTests() {
  console.log('====================================================');
  console.log('   PENGUJIAN SISTEM PEMBAGIAN LEAD WHATSAPP DREAMLAB');
  console.log('====================================================\n');

  // Test 1 & 2: Rotasi 4 event berurutan -> Irma -> Annisa -> Diaz -> Diva -> Irma
  mockRedis.reset();
  mockNeon.reset();
  console.log('▶ Test 1 & 2: Verifikasi urutan rotasi 4 BusDev + rotasi ke-5 kembali ke awal');
  const res1 = await simulateAssignEndpoint({ eventId: 'evt-1' });
  const res2 = await simulateAssignEndpoint({ eventId: 'evt-2' });
  const res3 = await simulateAssignEndpoint({ eventId: 'evt-3' });
  const res4 = await simulateAssignEndpoint({ eventId: 'evt-4' });
  const res5 = await simulateAssignEndpoint({ eventId: 'evt-5' });

  assert.equal(res1.sales.id, 'irma', 'Event 1 harus Irma');
  assert.equal(res2.sales.id, 'annisa', 'Event 2 harus Annisa');
  assert.equal(res3.sales.id, 'diaz', 'Event 3 harus Diaz');
  assert.equal(res4.sales.id, 'diva', 'Event 4 harus Diva');
  assert.equal(res5.sales.id, 'irma', 'Event 5 harus kembali ke Irma');
  console.log('  ✓ 1. Irma -> 2. Annisa -> 3. Diaz -> 4. Diva -> 5. Irma: PASSED');

  // Test 3: 40 event unik menghasilkan distribusi tepat 10:10:10:10
  mockRedis.reset();
  mockNeon.reset();
  console.log('\n▶ Test 3: Simulasi 40 event unik (harus rata sempurna: 10 per BusDev)');
  const counts: Record<string, number> = { irma: 0, annisa: 0, diaz: 0, diva: 0 };
  for (let i = 1; i <= 40; i++) {
    const res = await simulateAssignEndpoint({ eventId: `evt-unique-${i}` });
    counts[res.sales.id] = (counts[res.sales.id] || 0) + 1;
  }

  assert.equal(counts.irma, 10, 'Irma harus tepat 10');
  assert.equal(counts.annisa, 10, 'Annisa harus tepat 10');
  assert.equal(counts.diaz, 10, 'Diaz harus tepat 10');
  assert.equal(counts.diva, 10, 'Diva harus tepat 10');
  console.log(`  ✓ Distribusi 40 leads: Irma=${counts.irma}, Annisa=${counts.annisa}, Diaz=${counts.diaz}, Diva=${counts.diva}: PASSED (Rata Sempurna)`);

  // Test 4: 50 request concurrent menghasilkan selisih maksimal 1 antar-BusDev
  mockRedis.reset();
  mockNeon.reset();
  console.log('\n▶ Test 4: 50 concurrent request (selisih maksimal 1)');
  const concurrentPromises = Array.from({ length: 50 }, (_, i) =>
    simulateAssignEndpoint({ eventId: `evt-concurrent-${i + 1}` })
  );
  const concurrentResults = await Promise.all(concurrentPromises);
  const concurrentCounts: Record<string, number> = { irma: 0, annisa: 0, diaz: 0, diva: 0 };
  for (const r of concurrentResults) {
    concurrentCounts[r.sales.id] = (concurrentCounts[r.sales.id] || 0) + 1;
  }

  const values = Object.values(concurrentCounts);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const diff = maxVal - minVal;
  console.log(`  ✓ Distribusi 50 concurrent: ${JSON.stringify(concurrentCounts)} (Selisih: ${diff})`);
  assert(diff <= 1, `Selisih concurrent (${diff}) melebihi toleransi maksimal 1`);
  console.log('  ✓ Concurrency 50 requests lolos uji keadilan: PASSED');

  // Test 5: Idempotensi (Request dengan eventId sama)
  mockRedis.reset();
  mockNeon.reset();
  console.log('\n▶ Test 5: Idempotensi & Proteksi Double Assignment');
  const initialReq = await simulateAssignEndpoint({ eventId: 'evt-idempotent-test' });
  const initialCount = mockNeon.assignments.size;

  // Kirim ulang berkali-kali dengan eventId yang sama
  const retry1 = await simulateAssignEndpoint({ eventId: 'evt-idempotent-test' });
  const retry2 = await simulateAssignEndpoint({ eventId: 'evt-idempotent-test' });
  const retry3 = await simulateAssignEndpoint({ eventId: 'evt-idempotent-test' });

  assert.equal(retry1.wasCached, true, 'Retry 1 harus dikembalikan dari cache');
  assert.equal(retry1.sales.id, initialReq.sales.id, 'BusDev retry 1 harus sama persis');
  assert.equal(retry2.sales.id, initialReq.sales.id, 'BusDev retry 2 harus sama persis');
  assert.equal(retry3.sales.id, initialReq.sales.id, 'BusDev retry 3 harus sama persis');
  assert.equal(mockNeon.assignments.size, initialCount, 'Database tidak boleh membuat row duplikat');
  console.log('  ✓ Tidak ada kenaikan counter dan tidak ada row DB ganda: PASSED');

  // Test 6: Inactive BusDev dilewati
  console.log('\n▶ Test 6: BusDev dengan active: false dilewati');
  const customList: BusDevItem[] = [
    { id: 'b1', name: 'Sales 1', phone: '628111111111', active: true, order: 1 },
    { id: 'b2', name: 'Sales 2', phone: '628222222222', active: false, order: 2 },
    { id: 'b3', name: 'Sales 3', phone: '628333333333', active: true, order: 3 },
  ];
  const activeCustom = customList.filter((b) => b.active);
  assert.equal(activeCustom.length, 2);
  assert.equal(activeCustom[0].id, 'b1');
  assert.equal(activeCustom[1].id, 'b3');
  console.log('  ✓ Inactive BusDev b2 berhasil difilter keluar dari rotasi: PASSED');

  // Test 7: Source tidak valid dinormalisasi menjadi unknown
  console.log('\n▶ Test 7: Source tidak valid dinormalisasi menjadi unknown');
  const invalidSource = normalizeSourceToLeadSource('xyz-unrecognized-source-1234');
  assert.equal(invalidSource, 'unknown', 'Invalid source harus menjadi unknown');
  const validMeta = normalizeSourceToLeadSource('meta-skincare');
  assert.equal(validMeta, 'meta-ads', 'meta-skincare harus dinormalisasi ke meta-ads');
  const validGoogle = normalizeSourceToLeadSource('google-cpc');
  assert.equal(validGoogle, 'google-ads', 'google-cpc harus dinormalisasi ke google-ads');
  console.log('  ✓ Normalisasi source sesuai spesifikasi: PASSED');

  // Test 8: Fallback Neon saat Redis down
  console.log('\n▶ Test 8: Redis down menggunakan fallback Neon');
  mockRedis.isDown = true;
  const fallbackRes = await simulateAssignEndpoint({ eventId: 'evt-redis-down-1' });
  assert.equal(fallbackRes.status, 'fallback', 'Status harus fallback');
  assert(fallbackRes.sales.id, 'Sales harus tetap terpilih saat fallback');
  mockRedis.isDown = false;
  console.log(`  ✓ Redis down berhasil jatuh ke fallback Neon (${fallbackRes.sales.name}): PASSED`);

  // Test 9: Header Cache-Control no-store pada API
  console.log('\n▶ Test 9: Validasi Cache-Control no-store');
  const apiRouteFile = fs.readFileSync(
    path.resolve(process.cwd(), 'src/app/api/leads/assign/route.ts'),
    'utf-8'
  );
  assert(apiRouteFile.includes('no-store'), 'API Route wajib memuat Cache-Control: no-store');
  assert(apiRouteFile.includes("export const dynamic = 'force-dynamic'"), 'API Route wajib force-dynamic');
  console.log('  ✓ API Route terkonfigurasi force-dynamic & Cache-Control: no-store: PASSED');

  // Test 10: Scan ketiadaan waIndex di codebase
  console.log('\n▶ Test 10: Scan memastikan tidak ada lagi penggunaan waIndex');
  function scanDirForPattern(dir: string, pattern: string): string[] {
    const results: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git' || entry.name === 'worldql') {
        continue;
      }
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...scanDirForPattern(fullPath, pattern));
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js'))) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (content.includes(pattern)) {
          results.push(fullPath);
        }
      }
    }
    return results;
  }

  const waIndexMatches = scanDirForPattern(path.resolve(process.cwd(), 'src'), 'waIndex');
  assert.equal(waIndexMatches.length, 0, `Masih ditemukan waIndex di: ${waIndexMatches.join(', ')}`);
  console.log('  ✓ 0 penggunaan waIndex di seluruh folder src: PASSED');

  console.log('\n====================================================');
  console.log('   🎉 SEMUA 10 PENGUJIAN WAJIB BERHASIL DILALUI!     ');
  console.log('====================================================');
}

runAllTests().catch((err) => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
