/**
 * test-round-robin-perf.ts
 *
 * TEST PERFORMA round-robin lead capture — mengukur latensi nyata endpoint
 * produksi (mengikuti redirect seperti browser), bukan hanya cek fungsional.
 *
 * Tujuan:
 *   - Verifikasi "lemot / lama loading" yang dikeluhkan pelanggan & marketing.
 *   - Tolok ukur sebelum/sesudah perbaikan (baseline vs target).
 *
 * Yang diukur (per endpoint):
 *   - status code + deteksi redirect 308 trailing-slash (via res.url final)
 *   - latensi end-to-end (fetch otomatis ikut redirect, persis perilaku browser)
 *   - P50 / P95 / P99 + error rate
 *   - (opsional) burst konkuren untuk mendeteksi serialisasi / pool jenuh
 *   - (opsional) RPC DB langsung untuk memisahkan masalah DB vs jalur network
 *
 * CARA PAKAI:
 *   npx tsx scripts/test-round-robin-perf.ts                     # default: /next, 10 req
 *   npx tsx scripts/test-round-robin-perf.ts --base=http://localhost:3000
 *   npx tsx scripts/test-round-robin-perf.ts --requests=25
 *   npx tsx scripts/test-round-robin-perf.ts --with-track         # sertakan POST /track
 *   npx tsx scripts/test-round-robin-perf.ts --concurrent=10      # burst 10 request sekaligus
 *   npx tsx scripts/test-round-robin-perf.ts --db                 # bandingkan RPC DB langsung
 *   npx tsx scripts/test-round-robin-perf.ts --p50-ms=300 --p95-ms=800
 *
 * EXIT CODE: 0 = semua target terpenuhi, 1 = ada yang gagal, 2 = error fatal.
 */

import './lib/env-loader';
import { Pool } from 'pg';

// ── Konfigurasi ────────────────────────────────────────────────
function parseArg(name: string, fallback: string): string {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.split('=').slice(1).join('=') : fallback;
}
function parseNum(name: string, fallback: number): number {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (!arg) return fallback;
  const val = Number(arg.split('=')[1]);
  return Number.isFinite(val) ? val : fallback;
}

const BASE = parseArg('base', 'https://dreamlab.id').replace(/\/+$/, '');
const REQUESTS = parseNum('requests', 10);
const WITH_TRACK = process.argv.includes('--with-track');
const CONCURRENT = parseNum('concurrent', 0);
const WITH_DB = process.argv.includes('--db');
const THRESHOLD_P50_MS = parseNum('p50-ms', 300);
const THRESHOLD_P95_MS = parseNum('p95-ms', 800);
const THRESHOLD_ERRORS = parseNum('max-errors', 0);
const REQUEST_TIMEOUT_MS = parseNum('timeout-ms', 15000);

interface Sample {
  status: number | null;
  redirects: number;
  ms: number; // end-to-end termasuk redirect (seperti browser)
  error: string | null;
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[idx];
}

function pctLabel(sorted: number[], p: number): string {
  return `${percentile(sorted, p)} ms`;
}

function summary(label: string, samples: Sample[]) {
  const ms = samples.map((s) => s.ms).sort((a, b) => a - b);
  const errors = samples.filter((s) => s.error || s.status === null || s.status >= 500);
  const non2xx = samples.filter((s) => s.status !== null && s.status < 500 && s.status >= 300);
  const redirects = samples.reduce((a, s) => a + s.redirects, 0);
  const avg = ms.reduce((a, b) => a + b, 0) / (ms.length || 1);

  console.log(`\n[${label}] ${samples.length} request`);
  console.log(`  P50 = ${pctLabel(ms, 50)} | P95 = ${pctLabel(ms, 95)} | P99 = ${pctLabel(ms, 99)} | avg = ${avg.toFixed(0)} ms`);
  console.log(`  error/5xx = ${errors.length} | 3xx = ${non2xx.length} | redirect = ${redirects}`);
  if (errors.length > 0) {
    console.log(`  contoh error: ${errors.slice(0, 3).map((e) => e.error || `HTTP ${e.status}`).join(' | ')}`);
  }

  const okP50 = percentile(ms, 50) <= THRESHOLD_P50_MS;
  const okP95 = percentile(ms, 95) <= THRESHOLD_P95_MS;
  const okErr = errors.length <= THRESHOLD_ERRORS;
  const okRedirect = redirects === 0;

  if (okP50) console.log(`  OK P50 ${percentile(ms, 50)} ms <= ${THRESHOLD_P50_MS} ms`);
  else console.log(`  FAIL P50 ${percentile(ms, 50)} ms > ${THRESHOLD_P50_MS} ms`);
  if (okP95) console.log(`  OK P95 ${percentile(ms, 95)} ms <= ${THRESHOLD_P95_MS} ms`);
  else console.log(`  FAIL P95 ${percentile(ms, 95)} ms > ${THRESHOLD_P95_MS} ms`);
  if (okErr) console.log(`  OK error/5xx ${errors.length} <= ${THRESHOLD_ERRORS}`);
  else console.log(`  FAIL error/5xx ${errors.length} > ${THRESHOLD_ERRORS}`);
  if (okRedirect) console.log(`  OK tanpa redirect (fetch langsung ke endpoint)`);
  else console.log(`  WARN ${redirects} redirect - indikasi trailingSlash 308 (tambah RTT per panggilan)`);

  return { ok: okP50 && okP95 && okErr && okRedirect };
}

/**
 * Ukur satu request end-to-end dengan SATU panggilan fetch (redirect: follow),
 * persis seperti browser. Redirect trailing-slash dideteksi dari res.url final
 * (berbeda dari URL yang diminta), tanpa request tambahan — sehingga latensi
 * tidak terhitung dobel.
 */
async function probeOnce(url: string, init: RequestInit = {}): Promise<Sample> {
  const t0 = Date.now();
  try {
    const res = await fetch(url, { ...init, redirect: 'follow', signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    await res.text(); // pastikan body terbaca penuh
    const requested = new URL(url);
    const final = res.url ? new URL(res.url) : requested;
    const redirects = final.pathname !== requested.pathname || final.origin !== requested.origin ? 1 : 0;
    return {
      status: res.status,
      redirects,
      ms: Date.now() - t0,
      error: res.ok ? null : `HTTP ${res.status}`,
    };
  } catch (err) {
    return {
      status: null,
      redirects: 0,
      ms: Date.now() - t0,
      error: (err as Error).message,
    };
  }
}

async function measureEndpoint(label: string, url: string, init: RequestInit = {}): Promise<boolean> {
  const samples: Sample[] = [];

  if (CONCURRENT > 0) {
    // Burst konkuren: jalankan N sekaligus untuk deteksi serialisasi/pool jenuh
    const batch = Array.from({ length: CONCURRENT }, () => probeOnce(url, init));
    samples.push(...(await Promise.all(batch)));
  } else {
    for (let i = 0; i < REQUESTS; i += 1) {
      samples.push(await probeOnce(url, init));
    }
  }

  return summary(label, samples).ok;
}

async function measureDbRpc(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.log('\n[DB RPC] SKIP - DATABASE_URL tidak ada di env. (jalankan dengan --db setelah set DATABASE_URL)');
    return;
  }
  const pool = new Pool({ connectionString, max: 2, connectionTimeoutMillis: 8000 });
  const samples: number[] = [];
  try {
    for (let i = 0; i < REQUESTS; i += 1) {
      const t0 = Date.now();
      await pool.query(`SELECT agent_id, agent_name, agent_phone, order_index FROM assign_next_agent($1)`, [`perf-${Date.now()}-${i}`]);
      samples.push(Date.now() - t0);
    }
    samples.sort((a, b) => a - b);
    console.log(`\n[DB RPC assign_next_agent] ${samples.length} panggilan langsung`);
    console.log(`  P50 = ${pctLabel(samples, 50)} | P95 = ${pctLabel(samples, 95)} | P99 = ${pctLabel(samples, 99)}`);
    console.log('  (Pembanding: kalau RPC DB cepat tapi endpoint lambat, masalahnya di jalur network/firewall, bukan logika DB.)');
  } catch (err) {
    console.log(`\n[DB RPC] GAGAL: ${(err as Error).message}`);
  } finally {
    await pool.end();
  }
}

async function main() {
  console.log('======================================================');
  console.log('  TEST PERFORMA ROUND-ROBIN LEAD CAPTURE');
  console.log(`  base       : ${BASE}`);
  console.log(`  requests   : ${REQUESTS}${CONCURRENT > 0 ? ` (burst ${CONCURRENT} konkuren)` : ''}`);
  console.log(`  with-track : ${WITH_TRACK}`);
  console.log(`  threshold  : P50 <= ${THRESHOLD_P50_MS} ms | P95 <= ${THRESHOLD_P95_MS} ms | error <= ${THRESHOLD_ERRORS}`);
  console.log('======================================================');

  const results: boolean[] = [];

  // 1. Endpoint utama: assignment CS (GET /api/lead-capture/next/)
  results.push(await measureEndpoint('GET /api/lead-capture/next/', `${BASE}/api/lead-capture/next/`));

  // 2. (opsional) tracking lead (POST /api/lead-capture/track/) - menulis baris test di DB
  if (WITH_TRACK) {
    const trackInit: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'perf-test',
        source: 'organic',
        visitorId: `perf-test-${Date.now()}`,
        pageUrl: '/perf-test/round-robin-speed',
        assignedName: 'Perf Test',
        assignedPhone: '628000000000',
      }),
    };
    results.push(await measureEndpoint('POST /api/lead-capture/track/', `${BASE}/api/lead-capture/track/`, trackInit));
  }

  // 3. (opsional) pembanding: RPC DB langsung
  if (WITH_DB) {
    await measureDbRpc();
  }

  const ok = results.every(Boolean);
  console.log('\n======================================================');
  if (ok) {
    console.log('  OK SEMUA TARGET PERFORMA TERPENUHI.');
    console.log('  Round-robin cepat: tombol WA harusnya aktif < 1 dtk, WA terbuka < 2 dtk.');
  } else {
    console.log('  FAIL ADA TARGET YANG TIDAK TERPENUHI - periksa detail di atas.');
    console.log('  Kondisi produksi saat ini (500 + ~8 dtk) menandakan DB tidak terjangkau');
    console.log('  dari Vercel (firewall/env). Lihat laporan investigasi Fase 0.');
  }
  console.log('======================================================');
  process.exit(ok ? 0 : 1);
}

main().catch((e) => { console.error('FATAL:', e); process.exit(2); });
