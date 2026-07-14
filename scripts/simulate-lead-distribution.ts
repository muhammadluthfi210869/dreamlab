/**
 * simulate-lead-distribution.ts
 *
 * Simulasi distribusi lead round-robin via Redis atomic counter.
 * Mengetes bahwa 100 lead fresh akan terdistribusi ~rata ke 3 CS.
 *
 * Jalankan: npx tsx scripts/simulate-lead-distribution.ts
 */

async function run() {
  console.log("=== 100-Lead Round Robin Simulation (Redis) ===");
  console.log("(Pastikan UPSTASH_REDIS_REST_KV_REST_API_URL/TOKEN sudah di .env.local)\n");

  const BASE = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const counts: Record<string, number> = {};

  for (let i = 0; i < 100; i += 1) {
    try {
      const res = await fetch(`${BASE}/api/lead-assignment`, {
        headers: { 'x-simulate': 'true' },
      });
      const data = await res.json();
      const key = `${data.agentId} (${data.phone})`;
      counts[key] = (counts[key] ?? 0) + 1;
    } catch (err) {
      console.error(`Request #${i + 1} gagal:`, err);
    }
  }

  console.log("Distribusi 100 lead:");
  for (const [agent, count] of Object.entries(counts).sort()) {
    console.log(`  ${agent}: ${count}`);
  }
  console.log();

  const values = Object.values(counts);
  const total = values.reduce((a, b) => a + b, 0);
  if (total === 0) {
    console.log("❌ Tidak ada lead terkirim — periksa koneksi Redis & server.");
    process.exit(1);
  }

  const avg = total / values.length;
  const maxDev = Math.max(...values.map((v) => Math.abs(v - avg)));
  const threshold = values.length === 3 ? 4 : 6;
  if (maxDev <= threshold) {
    console.log(`✅ Distribusi merata (deviasi maks ${maxDev.toFixed(1)} dari rata-rata ${avg.toFixed(1)}).`);
  } else {
    console.log(`⚠️  Deviasi ${maxDev.toFixed(1)} > ${threshold}, distribusi mungkin tidak merata.`);
  }
}

run().catch(console.error);
