/**
 * audit-rr-entrypoints.ts
 *
 * Hit semua 5 entry point produksi dreamlab.id (Next.js on Vercel) dan
 * ukur distribusi agent kembali. Tiap endpoint = path berbeda yang dipakai
 * untuk lead assignment. Kami cek apakah hasilnya FAIR untuk semua channel.
 */

const BASE = "https://dreamlab.id";

interface Agent { name: string; id: string; phoneNumber: string; }

async function hit(path: string, method: "GET" | "POST" = "GET", body?: any) {
  const url = `${BASE}${path}`;
  const opts: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);
  const start = Date.now();
  try {
    const res = await fetch(url, { ...opts, signal: AbortSignal.timeout(8000) });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, body: json, ms: Date.now() - start };
  } catch (e: any) {
    return { ok: false, status: 0, body: { error: e.message }, ms: Date.now() - start };
  }
}

function summarize(name: string, agents: string[]) {
  const counts: Record<string, number> = {};
  agents.forEach((a) => (counts[a] = (counts[a] || 0) + 1));
  const vals = Object.values(counts);
  const spread = vals.length === 0 ? -1 : Math.max(...vals) - Math.min(...vals);
  console.log(
    `  ${name.padEnd(28)} n=${agents.length.toString().padStart(3)} | ${JSON.stringify(
      counts
    )} | spread=${spread} | ${spread <= 1 && agents.length >= 4 ? "FAIR" : "?"}`
  );
  return counts;
}

function randId(): string {
  return (
    "v-audit-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8)
  );
}

async function main() {
  console.log(`\n========== ALL ENTRY POINTS (production ${BASE}) ==========\n`);

  // ---- 1. GET /api/round-robin/next (with random vid) ----
  console.log("Endpoint A: GET /api/round-robin/next (x 16 sequential)");
  const A: string[] = [];
  for (let i = 0; i < 16; i++) {
    const r = await hit(`/api/round-robin/next/?vid=${randId()}`);
    if (r.ok) A.push((r.body as any).name ?? `ERR-${(r.body as any).assignmentMethod}`);
  }
  summarize("A round-robin/next", A);

  // ---- 2. GET /api/lead-assignment (legacy) ----
  console.log("\nEndpoint B: GET /api/lead-assignment (x 16 sequential)");
  const B: string[] = [];
  for (let i = 0; i < 16; i++) {
    const r = await hit(`/api/lead-assignment/?vid=${randId()}`);
    if (r.ok) B.push("agent_name_unset_" + (r.body as any).assignmentMethod);
  }
  // The legacy endpoint returns phone only, not name. Use phone suffix as identifier.
  const B2: string[] = [];
  for (let i = 0; i < 16; i++) {
    const r = await hit(`/api/lead-assignment/?vid=${randId()}`);
    if (r.ok) {
      const phone = (r.body as any).phone as string;
      B2.push(phone?.slice(-4) ?? "?" + (r.body as any).assignmentMethod);
    }
  }
  summarize("B lead-assignment", B2);

  // ---- 3. GET /api/lead-capture/next (the canonical one) ----
  console.log("\nEndpoint C: GET /api/lead-capture/next (x 16 sequential)");
  const C: string[] = [];
  for (let i = 0; i < 16; i++) {
    const r = await hit(`/api/lead-capture/next/?vid=${randId()}`);
    if (r.ok) C.push((r.body as any).name ?? "?");
  }
  summarize("C lead-capture/next", C);

  // ---- 4. POST /api/lead-capture/convert (FAST pipeline) ----
  console.log("\nEndpoint D: POST /api/lead-capture/convert (x 16 sequential)");
  const D: string[] = [];
  for (let i = 0; i < 16; i++) {
    const r = await hit(`/api/lead-capture/convert/`, "POST", {
      visitorId: randId(),
      intent: "round-robin-wa",
      source: "audit-script",
      pageUrl: `/audit-page-${i}`,
      pageTitle: "Audit",
      nama: "Audit User",
      perusahaan: "Audit Co",
      hp: `6281200000${String(i).padStart(3, "0")}`,
      produk: "audit",
    });
    if (r.ok) D.push((r.body as any).name ?? "?");
  }
  summarize("D lead-capture/convert", D);

  // ---- 5. POST /api/lead-capture/track (the legacy 2-call) ----
  console.log("\nEndpoint E: POST /api/lead-capture/track (x 8 sequential)");
  const E: string[] = [];
  for (let i = 0; i < 8; i++) {
    const r = await hit(`/api/lead-capture/track/`, "POST", {
      visitorId: randId(),
      intent: "track-audit",
      source: "audit-script",
      pageUrl: `/audit-track-page-${i}`,
      assignedName: "audit-cs",
      assignedPhone: "628112345678",
      trackingCode: "TEMP", // will be overwritten by server
    });
    if (r.ok) E.push((r.body as any).trackingCode ?? "?");
  }
  console.log("  (track is 2-step: assign + insert; tracking codes for traceability only)");

  // ---- Concurrent burst of mixed channels ----
  console.log("\nEndpoint F: parallel burst /lead-capture/convert (x 32 parallel)");
  const F = await Promise.all(
    Array.from({ length: 32 }, (_, i) =>
      hit(`/api/lead-capture/convert/`, "POST", {
        visitorId: randId(),
        intent: "audit-burst",
        source: "audit-script",
        pageUrl: `/audit-burst-${i}`,
        nama: `Burst${i}`,
        perusahaan: "Burst Co",
        hp: `6281300000${String(i).padStart(3, "0")}`,
        produk: "burst",
      })
    )
  );
  const FAgents = F.filter((r) => r.ok).map((r) => (r.body as any).name ?? "?");
  summarize("F burst convert", FAgents);
  const fFail = F.filter((r) => !r.ok).length;
  console.log(`  burst failed: ${fFail}/${F.length}`);

  console.log("\n✓ Entry-point audit complete");
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
