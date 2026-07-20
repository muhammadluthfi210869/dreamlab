/**
 * simulate-lead-distribution.ts
 *
 * Dua mode simulasi round-robin lewat /api/lead-assignment:
 *
 * 1. ROTASI MURNI — setiap request pakai "visitor" baru (tanpa cookie),
 *    jadi selalu lewat jalur rotasi Redis. Ini menguji apakah counter
 *    round-robin-nya sendiri adil. (Ini satu-satunya mode di versi lama
 *    script ini — makanya selalu lolos "merata" walau di traffic asli
 *    bisa timpang, karena tidak pernah mensimulasikan cookie sticky.)
 *
 * 2. TRAFFIC REALISTIS — mensimulasikan V visitor unik, sebagian di
 *    antaranya kembali lagi (repeat visit) dan MEMBAWA cookie
 *    `dreamlab_cs` dari response sebelumnya, persis seperti browser asli.
 *    Mode ini menunjukkan seberapa besar efek sticky cookie (30 hari)
 *    terhadap distribusi total yang akan terlihat di /api/round-robin-stats
 *    atau perbandingan Kommo — meski rotasi murni di baliknya tetap adil.
 *
 * Jalankan:
 *   npx tsx scripts/simulate-lead-distribution.ts
 *   npx tsx scripts/simulate-lead-distribution.ts --repeat-rate=0.4 --visitors=150
 */

const BASE = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

function parseArg(name: string, fallback: number): number {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (!arg) return fallback;
  const val = Number(arg.split("=")[1]);
  return Number.isFinite(val) ? val : fallback;
}

function extractCookie(res: Response): string | null {
  const setCookie = res.headers.get("set-cookie");
  if (!setCookie) return null;
  const match = setCookie.match(/dreamlab_cs=[^;]+/);
  return match ? match[0] : null;
}

function printDistribution(label: string, counts: Record<string, number>) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  console.log(`\n${label} (total=${total}):`);
  for (const [agent, count] of Object.entries(counts).sort()) {
    const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
    console.log(`  ${agent}: ${count} (${pct}%)`);
  }
  return { total, counts };
}

function evaluateFairness(counts: Record<string, number>, expectedAgents = 3) {
  const values = Object.values(counts);
  const total = values.reduce((a, b) => a + b, 0);
  if (total === 0) {
    console.log("  Tidak ada lead terkirim — periksa koneksi & server.");
    return false;
  }
  const avg = total / values.length;
  const maxDev = Math.max(...values.map((v) => Math.abs(v - avg)));
  const threshold = values.length === expectedAgents ? Math.max(4, avg * 0.15) : Math.max(6, avg * 0.2);
  if (maxDev <= threshold) {
    console.log(`  Merata (deviasi maks ${maxDev.toFixed(1)} dari rata-rata ${avg.toFixed(1)}).`);
    return true;
  }
  console.log(`  Deviasi ${maxDev.toFixed(1)} > ambang ${threshold.toFixed(1)} — tidak merata.`);
  return false;
}

async function runFreshRotationTest(n: number) {
  console.log(`=== Mode 1: Rotasi Murni (${n} visitor baru, tanpa cookie) ===`);
  const counts: Record<string, number> = {};

  for (let i = 0; i < n; i += 1) {
    try {
      const res = await fetch(`${BASE}/api/lead-assignment`, {
        headers: { "x-simulate-fresh": "true" },
      });
      const data = await res.json();
      const key = `${data.agentId} (${data.phone})`;
      counts[key] = (counts[key] ?? 0) + 1;
    } catch (err) {
      console.error(`Request #${i + 1} gagal:`, err);
    }
  }

  printDistribution("Distribusi rotasi murni", counts);
  evaluateFairness(counts);
}

async function runRealisticTrafficTest(visitors: number, repeatRate: number, maxRepeatVisits: number) {
  console.log(
    `\n=== Mode 2: Traffic Realistis (${visitors} visitor unik, ~${Math.round(
      repeatRate * 100
    )}% di antaranya repeat visit dengan cookie, maks ${maxRepeatVisits}x kunjungan) ===`
  );

  const firstVisitCounts: Record<string, number> = {};
  const allVisitCounts: Record<string, number> = {};

  for (let v = 0; v < visitors; v += 1) {
    try {
      const firstRes = await fetch(`${BASE}/api/lead-assignment`);
      const firstData = await firstRes.json();
      const key = `${firstData.agentId} (${firstData.phone})`;
      firstVisitCounts[key] = (firstVisitCounts[key] ?? 0) + 1;
      allVisitCounts[key] = (allVisitCounts[key] ?? 0) + 1;

      const cookie = extractCookie(firstRes);
      const isRepeatVisitor = Math.random() < repeatRate;

      if (cookie && isRepeatVisitor) {
        const repeatCount = 1 + Math.floor(Math.random() * maxRepeatVisits);
        for (let r = 0; r < repeatCount; r += 1) {
          const repeatRes = await fetch(`${BASE}/api/lead-assignment`, {
            headers: { Cookie: cookie },
          });
          const repeatData = await repeatRes.json();
          const repeatKey = `${repeatData.agentId} (${repeatData.phone})`;
          allVisitCounts[repeatKey] = (allVisitCounts[repeatKey] ?? 0) + 1;
        }
      }
    } catch (err) {
      console.error(`Visitor #${v + 1} gagal:`, err);
    }
  }

  printDistribution("Distribusi first-visit saja (harus merata — ini yang dites Mode 1)", firstVisitCounts);
  evaluateFairness(firstVisitCounts);

  printDistribution(
    "Distribusi SEMUA visit termasuk repeat/sticky (ini yang akan terlihat di /api/round-robin-stats & Kommo)",
    allVisitCounts
  );
  const fairAll = evaluateFairness(allVisitCounts);
  if (!fairAll) {
    console.log(
      "  ↳ Ini WAJAR kalau repeat-rate tinggi: cookie sticky 30 hari memang bikin total lead per CS " +
        "tidak proporsional dengan rotasi murni. Cek /api/round-robin-stats untuk lihat totalRotations " +
        "(rotasi asli) vs totalLeads (termasuk sticky) di traffic produksi."
    );
  }
}

async function run() {
  console.log("(Pastikan UPSTASH_REDIS_REST_KV_REST_API_URL/TOKEN sudah di .env.local, dan server jalan di " + BASE + ")");

  const freshVisitors = parseArg("fresh", 100);
  const realisticVisitors = parseArg("visitors", 100);
  const repeatRate = parseArg("repeat-rate", 0.3);
  const maxRepeatVisits = parseArg("max-repeat", 3);

  await runFreshRotationTest(freshVisitors);
  await runRealisticTrafficTest(realisticVisitors, repeatRate, maxRepeatVisits);
}

run().catch(console.error);
