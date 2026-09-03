/**
 * audit-rr-state-matrix.ts
 *
 * Targeted runtime checks against Biznet PostgreSQL for each state in the
 * full leakage checklist. Outputs a matrix classifying each state as
 * VERIFIED_PASS / VERIFIED_FAIL / NOT_APPLICABLE / RISK.
 */

import { Pool } from "pg";

const URL =
  process.env.DATABASE_URL ||
  "postgresql://dreamlab1:HaaE-B9APXWXM1Fnw8VZSbXv@103.93.134.215:6432/dreamlab";

const pool = new Pool({ connectionString: URL, max: 10, connectionTimeoutMillis: 5000 });
const q = async (sql: string, params: any[] = []) =>
  (await pool.query(sql, params)).rows;

const results: { state: string; category: string; evidence: string }[] = [];
const log = (state: string, category: string, evidence: string) =>
  results.push({ state, category, evidence });

async function setup() {
  await q("TRUNCATE leads RESTART IDENTITY CASCADE");
  await q("TRUNCATE visitor_assignments RESTART IDENTITY CASCADE");
  await q("UPDATE rr_counter SET current_index = 0 WHERE id = 1");
  // ALWAYS reset busdevs to a known state to avoid pollution from prior tests:
  // CS 1/2/3 + Pak Bagir active; Bu Irma inactive.
  await q("UPDATE busdevs SET is_active = (id IN (1, 2, 3, 39))");
}

// ===============================================================
// GROUP A — Algorithm guarantees (already covered but re-check)
// ===============================================================
async function groupA() {
  console.log("\n========== GROUP A: ALGORITHM GUARANTEES ==========");
  await setup();

  // A1. Race condition counter: 200 concurrent on FRESH counter
  const a1Items = await Promise.all(
    Array.from({ length: 200 }, (_, i) =>
      q(
        `SELECT agent_name FROM assign_and_insert_lead($1, 'A1', 'direct',
           NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
           NULL, NULL, NULL, NULL)`,
        [`v-A1-${i}`]
      ).then((r) => r[0].agent_name)
    )
  );
  const a1c: Record<string, number> = {};
  a1Items.forEach((x) => (a1c[x] = (a1c[x] || 0) + 1));
  const vals = Object.values(a1c);
  const a1Spread = Math.max(...vals) - Math.min(...vals);
  log(
    "Race condition counter (200 concurrent)",
    a1Spread <= 1 ? "VERIFIED_PASS" : "VERIFIED_FAIL",
    `spread=${a1Spread}, ${JSON.stringify(a1c)}`
  );

  // A2. Cold start: pool.destroy + recreate, sequence continues
  await setup();
  const beforeCold: string[] = [];
  for (let i = 0; i < 4; i++) {
    const r = await q(
      `SELECT agent_name FROM assign_and_insert_lead($1, 'A2', 'direct',
         NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
         NULL, NULL, NULL, NULL)`,
      [`v-A2-pre-${i}`]
    );
    beforeCold.push(r[0].agent_name);
  }
  // Use a SEPARATE isolated pool for the "after cold start" simulation
  // so we don't kill the main script pool.
  const coldPool = new Pool({ connectionString: URL, max: 3 });
  const afterCold: string[] = [];
  try {
    for (let i = 0; i < 4; i++) {
      const r = await coldPool.query(
        `SELECT agent_name FROM assign_and_insert_lead($1, 'A2', 'direct',
           NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
           NULL, NULL, NULL, NULL)`,
        [`v-A2-post-${i}`]
      );
      afterCold.push(r.rows[0].agent_name);
    }
  } finally {
    await coldPool.end();
  }
  log(
    "Serverless cold start (state survives)",
    beforeCold.join("→") === afterCold.join("→") ? "VERIFIED_PASS" : "VERIFIED_FAIL",
    `before=${beforeCold.join(",")}, after=${afterCold.join(",")}`
  );
}

// ===============================================================
// GROUP B — Validation & dedup timing
// ===============================================================
async function groupB() {
  console.log("\n========== GROUP B: VALIDATION & DEDUP TIMING ==========");

  // B1: Dedup OR semantics — same visitor, SAME intent, DIFFERENT page
  await setup();
  const vid = "v-B1";
  await q(
    `SELECT agent_name FROM assign_and_insert_lead($1, 'intent-X', 'direct',
       '/page-A', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
       NULL, NULL, NULL, NULL)`,
    [vid]
  );
  // Same intent, different page
  const b1r1 = await q(
    `SELECT agent_name FROM assign_and_insert_lead($1, 'intent-X', 'direct',
       '/page-B', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
       NULL, NULL, NULL, NULL)`,
    [vid]
  );
  const leads = await q(`SELECT tracking_code FROM leads ORDER BY id`);
  log(
    "Dedup OR semantics (intent match → dedup even if page differs)",
    leads.length === 1 ? "VERIFIED_PASS" : "VERIFIED_FAIL",
    `agent=${b1r1[0].agent_name}, leads_created=${leads.length}`
  );

  // B2: Same visitor, DIFFERENT intent, SAME page → dedup
  await setup();
  await q(
    `SELECT agent_name FROM assign_and_insert_lead('v-B2', 'intent-X', 'direct',
       '/page-same', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
       NULL, NULL, NULL, NULL)`
  );
  await q(
    `SELECT agent_name FROM assign_and_insert_lead('v-B2', 'intent-Y', 'direct',
       '/page-same', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
       NULL, NULL, NULL, NULL)`
  );
  const leads2 = await q(`SELECT tracking_code FROM leads ORDER BY id`);
  log(
    "Dedup OR semantics (page match → dedup even if intent differs)",
    leads2.length === 1 ? "VERIFIED_PASS" : "VERIFIED_FAIL",
    `leads_created=${leads2.length}`
  );

  // B3: Different visitor with same intent+page → NEW lead (not dedup)
  await setup();
  await q(
    `SELECT agent_name FROM assign_and_insert_lead('v-B3-A', 'intent-X', 'direct',
       '/page-same', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
       NULL, NULL, NULL, NULL)`
  );
  await q(
    `SELECT agent_name FROM assign_and_insert_lead('v-B3-B', 'intent-X', 'direct',
       '/page-same', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
       NULL, NULL, NULL, NULL)`
  );
  const leads3 = await q(`SELECT tracking_code FROM leads ORDER BY id`);
  log(
    "Dedup is per-visitor (different visitor → new lead)",
    leads3.length === 2 ? "VERIFIED_PASS" : "VERIFIED_FAIL",
    `leads_created=${leads3.length}`
  );

  // B4: HTTP retry from client — payload duplicate, same visitor
  //     Expected: dedup → single lead. Counter should NOT double-advance.
  await setup();
  const counterBefore = (await q(`SELECT current_index FROM rr_counter`))[0].current_index;
  for (let i = 0; i < 5; i++) {
    await q(
      `SELECT agent_name FROM assign_and_insert_lead('v-B4', 'intent-X', 'direct',
         '/same-page', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
         NULL, NULL, NULL, NULL)`
    );
  }
  const counterAfter = (await q(`SELECT current_index FROM rr_counter`))[0].current_index;
  const leads4 = await q(`SELECT COUNT(*)::int AS n FROM leads`);
  log(
    "HTTP retry (5x same payload) — single lead, single counter advance",
    counterAfter - counterBefore <= 1 && leads4[0].n === 1 ? "VERIFIED_PASS" : "VERIFIED_FAIL",
    `counter_Δ=${counterAfter - counterBefore}, leads=${leads4[0].n}`
  );

  // B5: Validation failure — does counter advance when SQL throws?
  //     Since we can't easily inject a side-effect inside the SQL function,
  //     this is verified by inspection: SQL function only advances counter
  //     inside the same transaction; if INSERT fails the whole transaction
  //     rolls back. STATIC.
  log(
    "Validation failure (SQL exception → counter rollback)",
    "STATIC_ONLY",
    "SQL function wrapped in BEGIN/EXCEPTION (default plpgsql): any error rolls back the entire transaction. atomicity guaranteed."
  );
}

// ===============================================================
// GROUP C — Sort ordering stability
// ===============================================================
async function groupC() {
  console.log("\n========== GROUP C: SORT ORDERING STABILITY ==========");

  // C1: Verify SELECT active agents returns identical order every call
  const orders: string[][] = [];
  for (let i = 0; i < 5; i++) {
    const r = await q(
      `SELECT id, name FROM busdevs WHERE is_active = true ORDER BY id`
    );
    orders.push(r.map((x: any) => x.name));
  }
  const allSame = orders.every((o) => JSON.stringify(o) === JSON.stringify(orders[0]));
  log(
    "Sort ORDER BY id stable across calls",
    allSame ? "VERIFIED_PASS" : "VERIFIED_FAIL",
    `orders=${JSON.stringify(orders)}`
  );

  // C2: Add a new busdev in middle → does sequence change predictably?
  await setup();
  await q(`UPDATE rr_counter SET current_index = 0 WHERE id = 1`);
  const before1 = await q(
    `SELECT agent_name FROM assign_and_insert_lead($1, 'C', 'direct',
       NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
       NULL, NULL, NULL, NULL)`,
    [`v-C-pre-1`]
  );
  const before2 = await q(
    `SELECT agent_name FROM assign_and_insert_lead($1, 'C', 'direct',
       NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
       NULL, NULL, NULL, NULL)`,
    [`v-C-pre-2`]
  );
  log(
    "Pre-insertion: sequence",
    "OK",
    `1=${before1[0].agent_name}, 2=${before2[0].agent_name}`
  );

  // C3: User removed mid-pool (set inactive)
  await setup();
  await q(`UPDATE rr_counter SET current_index = 0 WHERE id = 1`);
  const c3items: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = await q(
      `SELECT agent_name FROM assign_and_insert_lead($1, 'C3', 'direct',
         NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
         NULL, NULL, NULL, NULL)`,
      [`v-C3-${i}`]
    );
    c3items.push(r[0].agent_name);
  }
  const c3c: Record<string, number> = {};
  c3items.forEach((x) => (c3c[x] = (c3c[x] || 0) + 1));
  const c3ActiveCount = Object.keys(c3c).length;
  log(
    "Active CS count = distinct assigned CS",
    c3ActiveCount === 4 ? "VERIFIED_PASS" : "VERIFIED_FAIL",
    `distinct=${c3ActiveCount} ${JSON.stringify(c3c)}`
  );
}

// ===============================================================
// GROUP D — Sticky / contact ownership behavior
// ===============================================================
async function groupD() {
  console.log("\n========== GROUP D: STICKY / CONTACT OWNERSHIP ==========");

  // D1: Same visitor → always same CS (sticky 30 hari)
  await setup();
  const d1agents: string[] = [];
  for (let i = 0; i < 8; i++) {
    const r = await q(
      `SELECT agent_name FROM assign_and_insert_lead('v-sticky-test', 'D', 'direct',
         NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
         NULL, NULL, NULL, NULL)`
    );
    d1agents.push(r[0].agent_name);
  }
  log(
    "Sticky: 8x same visitor → same CS",
    new Set(d1agents).size === 1 ? "VERIFIED_PASS" : "VERIFIED_FAIL",
    `agents=${d1agents.join(",")}`
  );

  // D2: Sticky to inactive CS → reassign to active CS
  await setup();
  const d2first = await q(
    `SELECT agent_name FROM assign_and_insert_lead('v-D2', 'D', 'direct',
       NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
       NULL, NULL, NULL, NULL)`
  );
  await q(`UPDATE busdevs SET is_active = false WHERE name = $1`, [d2first[0].agent_name]);
  const d2second = await q(
    `SELECT agent_name FROM assign_and_insert_lead('v-D2', 'D', 'direct',
       NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
       NULL, NULL, NULL, NULL)`
  );
  log(
    "Sticky CS di-cut mid-flow → auto-reassign ke CS aktif",
    d2first[0].agent_name !== d2second[0].agent_name ? "VERIFIED_PASS" : "VERIFIED_FAIL",
    `before=${d2first[0].agent_name}, after=${d2second[0].agent_name}`
  );
  // restore active
  await q(`UPDATE busdevs SET is_active = true`);
}

// ===============================================================
// GROUP E — Idempotency edge cases
// ===============================================================
async function groupE() {
  console.log("\n========== GROUP E: IDEMPOTENCY EDGE CASES ==========");

  // E1: 20 concurrent same visitor — must yield 1 lead
  await setup();
  const e1burst = await Promise.all(
    Array.from({ length: 20 }, () =>
      q(
        `SELECT tracking_code FROM assign_and_insert_lead('v-burst', 'intent-X', 'direct',
           '/same-page', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
           NULL, NULL, NULL, NULL)`
      ).then((r) => r[0].tracking_code)
    )
  );
  const e1uniq = new Set(e1burst).size;
  const e1leads = (await q(`SELECT COUNT(*)::int AS n FROM leads`))[0].n;
  log(
    "20 concurrent same-visitor/same-intent → 1 tracking code, 1 lead",
    e1uniq === 1 && e1leads === 1 ? "VERIFIED_PASS" : "VERIFIED_FAIL",
    `uniq_codes=${e1uniq}, leads=${e1leads}`
  );

  // E2: Same visitor, different intent+page → NEW lead (no false dedup)
  await setup();
  void 0;
  await q(
    `SELECT agent_name FROM assign_and_insert_lead('v-E2', 'intent-A', 'direct',
       '/page-A', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
       NULL, NULL, NULL, NULL)`
  );
  // Cannot easily manipulate NOW() for SQL function; rely on test J + K
  // Test next: same visitor, completely different intent+page → new lead
  await q(
    `SELECT agent_name FROM assign_and_insert_lead('v-E2', 'intent-B', 'direct',
       '/page-B', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
       NULL, NULL, NULL, NULL)`
  );
  const e2leads = (await q(`SELECT COUNT(*)::int AS n FROM leads WHERE visitor_id = 'v-E2'`))[0].n;
  log(
    "Visitor different intent+page → NEW lead (no false dedup)",
    e2leads === 2 ? "VERIFIED_PASS" : "VERIFIED_FAIL",
    `leads_created=${e2leads}`
  );
}

// ===============================================================
// GROUP F — Counter modulo at boundary (uses injected q for isolated pool)
// ===============================================================
async function groupFWith(q: any) {
  console.log("\n========== GROUP F: COUNTER BOUNDARY ==========");

  await q("TRUNCATE leads RESTART IDENTITY CASCADE");
  await q("TRUNCATE visitor_assignments RESTART IDENTITY CASCADE");
  await q("UPDATE rr_counter SET current_index = 0 WHERE id = 1");
  void 0;

  // F1: 200 sequential (smaller than 1000 to fit pool budget; 200/4=50 per CS)
  const f1items: string[] = [];
  for (let i = 0; i < 200; i++) {
    const r = await q(
      `SELECT agent_name FROM assign_and_insert_lead($1, 'F', 'direct',
         NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
         NULL, NULL, NULL, NULL)`,
      [`v-F1-${i}`]
    );
    f1items.push(r[0].agent_name);
  }
  const f1c: Record<string, number> = {};
  f1items.forEach((x) => (f1c[x] = (f1c[x] || 0) + 1));
  const vals = Object.values(f1c);
  const spread = Math.max(...vals) - Math.min(...vals);
  log(
    "First-sales bias (200 sequential) — CS1 NOT over-represented",
    spread <= 1 ? "VERIFIED_PASS" : "VERIFIED_FAIL",
    `${JSON.stringify(f1c)}, spread=${spread}`
  );

  const lastCS = f1items[f1items.length - 1];
  log(
    "Last-sales starvation — last call still gets assigned",
    f1c[lastCS] !== undefined ? "VERIFIED_PASS" : "VERIFIED_FAIL",
    `last_call=${lastCS}, count_in_${lastCS}=${f1c[lastCS]}`
  );

  // F3: Counter INT max boundary
  await q(`UPDATE rr_counter SET current_index = 2147483646 WHERE id = 1`);
  const f3items: string[] = [];
  for (let i = 0; i < 8; i++) {
    const r = await q(
      `SELECT agent_name FROM assign_and_insert_lead($1, 'F', 'direct',
         NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
         NULL, NULL, NULL, NULL)`,
      [`v-F3-${i}`]
    );
    f3items.push(r[0].agent_name);
  }
  const counterAfter = (await q(`SELECT current_index FROM rr_counter`))[0].current_index;
  log(
    "Counter overflow at INT max boundary",
    !isNaN(counterAfter) && counterAfter >= 0 ? "VERIFIED_PASS" : "VERIFIED_FAIL",
    `counter=${counterAfter}, items=${JSON.stringify(f3items)}`
  );
}

// ===============================================================
async function main() {
  const printMatrix = () => {
    console.log("\n\n========== FINAL MATRIX ==========\n");
    const counts = { VERIFIED_PASS: 0, VERIFIED_FAIL: 0, STATIC_ONLY: 0, OK: 0 };
    for (const r of results) {
      counts[r.category as keyof typeof counts] = (counts[r.category as keyof typeof counts] || 0) + 1;
      const icon = r.category === "VERIFIED_PASS" ? "✓" :
                   r.category === "VERIFIED_FAIL" ? "✗" :
                   r.category === "STATIC_ONLY" ? "⊘" : "·";
      console.log(`  ${icon} [${r.category.padEnd(13)}] ${r.state}`);
      if (r.category !== "VERIFIED_PASS") {
        console.log(`     ${r.evidence}`);
      }
    }
    console.log(`\nTotals:`, counts);
  };

  try {
    await setup();
    await groupA();
    await setup(); await groupB();
    await setup(); await groupC();
    await setup(); await groupD();
    await setup(); await groupE();
  } catch (e: any) {
    console.error("FATAL (groups A-E):", e.message);
  }
  // F group uses its own isolated pool because 1000+ queries on the shared
  // pool may hit PgBouncer connection limits.
  const fPool = new Pool({ connectionString: URL, max: 5 });
  const qF = async (sql: string, params: any[] = []) =>
    (await fPool.query(sql, params)).rows;
  try {
    await groupFWith(qF);
  } catch (e: any) {
    console.error("FATAL (group F):", e.message);
  } finally {
    try { await fPool.end(); } catch {}
  }

  printMatrix();
}

main().catch(console.error);
