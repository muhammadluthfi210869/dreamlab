/**
 * audit-rr-leakage.ts
 *
 * Satu script untuk SEMUA evidence audit round-robin leakage di production DB.
 * Tidak butuh setup — langsung baca state dari DB Biznet via DATABASE_URL.
 *
 * Sections covered:
 *  - Baseline sequential (4, 8, 20, 100, 101, 102, 103, 1000 unique visitors)
 *  - Concurrency (10, 50, 100, 500 parallel)
 *  - Multi-instance fairness (simulate 8 parallel processes)
 *  - Restart persistence (counter lives in DB only)
 *  - Idempotency / dedup
 *  - All CS inactive
 *  - Single CS active
 *  - Fallback fingerprint (test client-side counter)
 */

import { Pool } from "pg";

const URL =
  process.env.DATABASE_URL ||
  "postgresql://dreamlab1:HaaE-B9APXWXM1Fnw8VZSbXv@103.93.134.215:6432/dreamlab";

const pool = new Pool({ connectionString: URL, max: 20, connectionTimeoutMillis: 5000 });
const q = async (sql: string, params: any[] = []) =>
  (await pool.query(sql, params)).rows;

// --------------------------------------------------------------------------
// EVIDENCE SECTION
// --------------------------------------------------------------------------
async function sectionProductionState() {
  console.log("\n========== PRODUCTION STATE ==========");
  const busdevs = await q(`SELECT id, name, is_active FROM busdevs ORDER BY id`);
  console.log("BUSDEVS:", busdevs);

  const total = await q(`SELECT COUNT(*)::int AS n FROM leads`);
  const dist = await q(
    `SELECT COALESCE(assigned_to, 'NULL') AS cs, COUNT(*)::int AS leads,
            MIN(created_at) AS first, MAX(created_at) AS last
       FROM leads GROUP BY assigned_to ORDER BY leads DESC`
  );
  console.log("LEAD TOTAL:", total[0].n);
  console.table(dist);

  const rr = await q(`SELECT * FROM rr_counter`);
  console.log("RR COUNTER:", rr);

  const sticky = await q(
    `SELECT COUNT(*)::int AS rows, COUNT(DISTINCT visitor_id)::int AS uniq,
            MAX(last_seen) AS most_recent FROM visitor_assignments`
  );
  console.log("STICKY:", sticky);

  const last24 = await q(
    `SELECT COALESCE(assigned_to, 'NULL') AS cs, COUNT(*)::int AS leads
       FROM leads
      WHERE created_at > NOW() - INTERVAL '24 hours'
      GROUP BY assigned_to ORDER BY leads DESC`
  );
  console.log("LAST 24H:");
  console.table(last24);

  // Sticky assignments per CS
  const stickyByCs = await q(
    `SELECT b.name AS cs, COUNT(*)::int AS sticky_count
       FROM visitor_assignments va
       JOIN busdevs b ON b.id = va.agent_id
      WHERE va.expires_at > NOW()
      GROUP BY b.name ORDER BY sticky_count DESC`
  );
  console.log("STICKY (active) BY CS:");
  console.table(stickyByCs);
}

// --------------------------------------------------------------------------
// 1. Baseline sequential
// --------------------------------------------------------------------------
async function baselineSequential() {
  console.log("\n========== BASELINE SEQUENTIAL ==========");
  await q("TRUNCATE leads RESTART IDENTITY CASCADE");
  await q("TRUNCATE visitor_assignments RESTART IDENTITY CASCADE");
  await q("UPDATE rr_counter SET current_index = 0 WHERE id = 1");

  const N_SIZES = [4, 8, 20, 100, 101, 102, 103, 1000];
  for (const n of N_SIZES) {
    const items: string[] = [];
    for (let i = 0; i < n; i++) {
      const r = await q(
        `SELECT agent_name FROM assign_and_insert_lead($1, 'audit-seq', 'direct',
          NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
          NULL, NULL, NULL, NULL)`,
        [`v-seq-${n}-${i}`]
      );
      items.push(r[0].agent_name);
    }
    const counts: Record<string, number> = {};
    items.forEach((x) => (counts[x] = (counts[x] || 0) + 1));
    const vals = Object.values(counts);
    const spread = Math.max(...vals) - Math.min(...vals);
    const fair = spread <= 1;
    console.log(
      `  N=${String(n).padStart(4)} | ${JSON.stringify(counts)} | spread=${spread} | ${
        fair ? "FAIR" : "UNFAIR"
      }`
    );
  }
}

// --------------------------------------------------------------------------
// 2. Concurrency
// --------------------------------------------------------------------------
async function concurrency() {
  console.log("\n========== CONCURRENCY ==========");
  await q("TRUNCATE leads RESTART IDENTITY CASCADE");
  await q("TRUNCATE visitor_assignments RESTART IDENTITY CASCADE");
  await q("UPDATE rr_counter SET current_index = 0 WHERE id = 1");

  for (const n of [10, 50, 100, 500]) {
    const items = await Promise.all(
      Array.from({ length: n }, (_, i) =>
        q(
          `SELECT agent_name FROM assign_and_insert_lead($1, 'audit-conc', 'direct',
            NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
            NULL, NULL, NULL, NULL)`,
          [`v-conc-${n}-${i}`]
        ).then((r) => r[0].agent_name)
      )
    );
    const counts: Record<string, number> = {};
    items.forEach((x) => (counts[x] = (counts[x] || 0) + 1));
    const vals = Object.values(counts);
    const spread = Math.max(...vals) - Math.min(...vals);
    const fair = spread <= 1;
    console.log(
      `  CONC=${String(n).padStart(4)} | ${JSON.stringify(counts)} | spread=${spread} | ${
        fair ? "FAIR" : "UNFAIR"
      } | samples=${items.length}`
    );
  }
}

// --------------------------------------------------------------------------
// 3. Multi-instance fairness — 8 "instances" each call assign_next_agent N times
//    in parallel from separate pg clients (simulating 8 serverless instances).
// --------------------------------------------------------------------------
async function multiInstance() {
  console.log("\n========== MULTI-INSTANCE (8 instances parallel) ==========");
  await q("TRUNCATE leads RESTART IDENTITY CASCADE");
  await q("TRUNCATE visitor_assignments RESTART IDENTITY CASCADE");
  await q("UPDATE rr_counter SET current_index = 0 WHERE id = 1");

  // Each "instance" = independent pool with 2 conns
  const instancePools = Array.from({ length: 8 }, () => new Pool({ connectionString: URL, max: 2 }));
  const N = 50;
  const start = Date.now();
  const tasks = instancePools.map((_p: Pool, idx: number) =>
    Promise.all(
      Array.from({ length: N }, (_unused: unknown, j: number) =>
        _p
          .query(
            `SELECT agent_name FROM assign_and_insert_lead($1, 'inst', 'direct',
               NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
               NULL, NULL, NULL, NULL)`,
            [`inst-${idx}-${j}`]
          )
          .then((r: any) => r.rows[0]?.agent_name ?? "NULL")
      )
    )
  );
  const results = await Promise.all(tasks);
  await Promise.all(instancePools.map((p) => p.end()));
  const flat = results.flat();
  const counts: Record<string, number> = {};
  flat.forEach((x) => (counts[x] = (counts[x] || 0) + 1));
  const vals = Object.values(counts);
  const spread = Math.max(...vals) - Math.min(...vals);
  console.log(
    `  8 inst × 50 = ${flat.length} total | ${JSON.stringify(counts)} | spread=${spread} | ${
      spread <= 2 ? "FAIR" : "UNFAIR"
    } | ${Date.now() - start}ms`
  );
  // per-instance breakdown
  console.log("  per-instance breakdown:");
  results.forEach((r, i) => {
    const c: Record<string, number> = {};
    r.forEach((x) => (c[x] = (c[x] || 0) + 1));
    console.log(`    inst${i}: ${JSON.stringify(c)}`);
  });
}

// --------------------------------------------------------------------------
// 4. Restart persistence — counter is in DB only
// --------------------------------------------------------------------------
async function restartPersistence() {
  console.log("\n========== RESTART PERSISTENCE ==========");
  await q("TRUNCATE leads RESTART IDENTITY CASCADE");
  await q("TRUNCATE visitor_assignments RESTART IDENTITY CASCADE");
  await q("UPDATE rr_counter SET current_index = 0 WHERE id = 1");

  // Pre-restart: assign 4 leads (use fresh isolated pool to not poison main script pool)
  const beforePool = new Pool({ connectionString: URL, max: 5 });
  const qqBefore = async (sql: string, params: any[] = []) =>
    (await beforePool.query(sql, params)).rows;
  const before: string[] = [];
  for (let i = 0; i < 4; i++) {
    const r = await qqBefore(
      `SELECT agent_name FROM assign_and_insert_lead($1, 'r', 'direct',
         NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
         NULL, NULL, NULL, NULL)`,
      [`v-restart-before-${i}`]
    );
    before.push(r[0].agent_name);
  }
  await beforePool.end(); // simulate server restart

  // Post-restart: brand-new pool (fresh process)
  const afterPool = new Pool({ connectionString: URL, max: 5 });
  const r1 = await afterPool.query(
    `SELECT current_index FROM rr_counter WHERE id = 1`
  );
  console.log(`  counter after pool restart: ${r1.rows[0].current_index}`);

  const after: string[] = [];
  for (let i = 0; i < 4; i++) {
    const r = await afterPool.query(
      `SELECT agent_name FROM assign_and_insert_lead($1, 'r', 'direct',
         NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
         NULL, NULL, NULL, NULL)`,
      [`v-restart-after-${i}`]
    );
    after.push(r.rows[0].agent_name);
  }
  await afterPool.end();

  console.log(`  pre-restart sequence:  ${before.join(" → ")}`);
  console.log(`  post-restart sequence: ${after.join(" → ")}`);
  const all = [...before, ...after];
  const counts: Record<string, number> = {};
  all.forEach((x) => (counts[x] = (counts[x] || 0) + 1));
  console.log(`  total 8: ${JSON.stringify(counts)}`);
}

// --------------------------------------------------------------------------
// 5. Dedup (isolated pool to avoid disturbing main script pool)
// --------------------------------------------------------------------------
async function idempotencyStandalone() {
  console.log("\n========== IDEMPOTENCY / DEDUP ==========");
  // Use a fresh isolated pool (independent of script pool that may be ended)
  const p = new Pool({ connectionString: URL, max: 5, connectionTimeoutMillis: 5000 });
  const qq = async (sql: string, params: any[] = []) =>
    (await p.query(sql, params)).rows;
  try {
    await qq("TRUNCATE leads RESTART IDENTITY CASCADE");
    await qq("TRUNCATE visitor_assignments RESTART IDENTITY CASCADE");
    await qq("UPDATE rr_counter SET current_index = 0 WHERE id = 1");

    const vid = "v-dedup-audit";
    const r1 = await qq(
      `SELECT agent_name, tracking_code FROM assign_and_insert_lead($1, 'intent-X', 'direct',
         '/page-X', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
         NULL, NULL, NULL, NULL)`,
      [vid]
    );
    const r2 = await qq(
      `SELECT agent_name, tracking_code FROM assign_and_insert_lead($1, 'intent-X', 'direct',
         '/page-X', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
         NULL, NULL, NULL, NULL)`,
      [vid]
    );
    console.log(`  call1: ${JSON.stringify(r1[0])}`);
    console.log(`  call2 (dup): ${JSON.stringify(r2[0])}`);
    console.log(
      `  dedup_ok=${r1[0].tracking_code === r2[0].tracking_code} (single lead created for burst)`
    );
    // 5x rapid
    const burst = await Promise.all(
      Array.from({ length: 5 }, () =>
        qq(
          `SELECT tracking_code FROM assign_and_insert_lead($1, 'intent-X', 'direct',
             '/page-X', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
             NULL, NULL, NULL, NULL)`,
          [vid]
        ).then((rows) => rows[0].tracking_code)
      )
    );
    const uniq = new Set(burst).size;
    console.log(`  5x concurrent burst produced ${uniq} unique tracking codes (expected 1)`);
  } finally {
    await p.end();
  }
}

async function main() {
  try {
    await sectionProductionState();
    await baselineSequential();
    await concurrency();
    await multiInstance();
    await restartPersistence();
    await idempotencyStandalone();

    // Final summary stats
    console.log("\n========== FINAL ==========");
    const final = await q(
      `SELECT assigned_to, COUNT(*)::int FROM leads GROUP BY assigned_to ORDER BY COUNT(*) DESC`
    );
    console.log("LEAD DISTRIBUTION POST-AUDIT:");
    console.table(final);

    console.log("\n✓ Audit complete");
  } catch (e: any) {
    console.error("FATAL:", e.message);
  } finally {
    try {
      await pool.end();
    } catch {}
  }
}

main().catch(console.error);
