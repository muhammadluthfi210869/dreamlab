/**
 * merge-neon-to-biznet.mjs — Cutover Neon → Biznet (2026-09-14)
 *
 * Menyalin data historis round-robin dari DB Neon (yang selama ini dipakai
 * Vercel karena prioritas env var database_* di db.ts lama) ke DB Biznet yang
 * jadi satu-satunya sumber kebenaran wave engine.
 *
 * Cara jalan (dari dreamlab-site/, butuh kedua env file):
 *   node --env-file=.env.local --env-file=.env.vercel.tmp scripts/merge-neon-to-biznet.mjs --dry
 *   node --env-file=.env.local --env-file=.env.vercel.tmp scripts/merge-neon-to-biznet.mjs
 *
 * Idempotent — aman dijalankan 2x (pass-1 sebelum switch, pass-2 sesudah
 * switch untuk menangkap lead Neon yang masuk di antaranya).
 *
 * Aturan merge:
 * - leads: skip bila tracking_code sudah ada; assigned_to/assigned_phone
 *   dipetakan ke roster Biznet via normalisasi phone; is_test dipaksa TRUE
 *   untuk baris berindikasi test (visitor_id 'test_%' / kode DL-TEST-*).
 * - lead_assignments: copy penuh, conflict (id/event_id) di-skip.
 * - visitor_assignments: agent_id Neon dipetakan via phone → id BusDev Biznet;
 *   konflik visitor_id → pertahankan sticky yang expires_at-nya lebih jauh.
 * - rr_counter: ambil yang terbesar.
 * - Sequence leads_id_seq di-advance ke max(id).
 */
import pg from 'pg';

const DRY = process.argv.includes('--dry');

const neonUrl = process.env.database_DATABASE_URL || process.env.NEON_DATABASE_URL;
if (!neonUrl) {
  console.error('database_DATABASE_URL tidak ada (jalankan dengan --env-file=.env.vercel.tmp)');
  process.exit(1);
}
const bizUrl = process.env.DATABASE_URL;
if (!bizUrl) {
  console.error('DATABASE_URL tidak ada (jalankan dengan --env-file=.env.local)');
  process.exit(1);
}

const normPhone = (p) => {
  let d = String(p ?? '').replace(/[^0-9]/g, '');
  if (d.startsWith('0')) d = '62' + d.slice(1);
  return d;
};

async function connectBiz() {
  const u = new URL(bizUrl);
  const sslMode = u.searchParams.get('sslmode') || '';
  const c = new pg.Client({
    host: u.hostname,
    port: Number(u.port || 5432),
    database: decodeURIComponent(u.pathname.replace(/^\//, '')),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    ssl: sslMode === 'require' || sslMode.startsWith('verify') ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 10000,
  });
  await c.connect();
  return c;
}

const LEAD_COLS = [
  'tracking_code', 'assigned_to', 'assigned_phone', 'source', 'page_url', 'page_title',
  'referrer', 'utm_source', 'utm_medium', 'utm_campaign', 'device_type', 'browser',
  'session_id', 'intent', 'nama', 'perusahaan', 'hp', 'produk', 'created_at',
  'visitor_id', 'visit_count', 'is_test',
];
const LA_COLS = [
  'id', 'event_id', 'source', 'landing_page', 'referrer', 'utm_source', 'utm_medium',
  'utm_campaign', 'message_key', 'sales_id', 'sales_name', 'sales_phone', 'status',
  'assigned_at', 'user_agent', 'ip_hash',
];
const VA_COLS = ['visitor_id', 'agent_id', 'created_at', 'last_seen', 'expires_at'];

(async () => {
  const neon = new pg.Client({ connectionString: neonUrl, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 12000 });
  await neon.connect();
  const biz = await connectBiz();
  console.log(DRY ? '=== DRY RUN ===' : '=== APPLY ===');

  // Peta roster kedua sisi
  const bizBus = (await biz.query('SELECT id, name, phone FROM busdevs')).rows;
  const bizByPhone = new Map(bizBus.map((b) => [normPhone(b.phone), b]));
  const neonBus = (await neon.query('SELECT id, name, phone FROM busdevs')).rows;
  const neonById = new Map(neonBus.map((b) => [String(b.id), b]));

  /* ---------------- leads ---------------- */
  const neonLeads = (await neon.query(`SELECT ${LEAD_COLS.join(', ')} FROM leads ORDER BY id`)).rows;
  const existingCodes = new Set(
    (await biz.query('SELECT tracking_code FROM leads')).rows.map((r) => r.tracking_code)
  );
  const toInsert = [];
  let remapped = 0;
  let forcedTest = 0;
  for (const row of neonLeads) {
    if (existingCodes.has(row.tracking_code)) continue;
    const np = normPhone(row.assigned_phone);
    const bizAgent = bizByPhone.get(np);
    const out = { ...row };
    if (bizAgent) {
      if (out.assigned_to !== bizAgent.name) remapped++;
      out.assigned_to = bizAgent.name;
      out.assigned_phone = np;
    }
    const looksTest =
      /^test_/i.test(out.visitor_id || '') ||
      (out.tracking_code || '').startsWith('DL-TEST');
    if (looksTest && out.is_test !== true) { out.is_test = true; forcedTest++; }
    toInsert.push(out);
  }
  console.log(`leads: neon=${neonLeads.length}, sudah ada di biznet=${neonLeads.length - toInsert.length}, salin=${toInsert.length} (remap nama=${remapped}, paksa is_test=${forcedTest})`);
  if (!DRY && toInsert.length > 0) {
    for (const r of toInsert) {
      const placeholders = LEAD_COLS.map((_, i) => `$${i + 1}`).join(',');
      await biz.query(
        `INSERT INTO leads (${LEAD_COLS.join(', ')}) VALUES (${placeholders})
         ON CONFLICT (tracking_code) DO NOTHING`,
        LEAD_COLS.map((c) => r[c])
      );
    }
    await biz.query(`SELECT setval(pg_get_serial_sequence('leads','id'), (SELECT COALESCE(MAX(id),1) FROM leads))`);
  }

  /* ---------------- lead_assignments ---------------- */
  const neonLa = (await neon.query(`SELECT ${LA_COLS.join(', ')} FROM lead_assignments ORDER BY assigned_at`)).rows;
  const bizLaCount = (await biz.query('SELECT count(*)::int n FROM lead_assignments')).rows[0].n;
  console.log(`lead_assignments: neon=${neonLa.length}, biznet sebelum=${bizLaCount}`);
  if (!DRY && neonLa.length > 0) {
    for (const r of neonLa) {
      const placeholders = LA_COLS.map((_, i) => `$${i + 1}`).join(',');
      await biz.query(
        `INSERT INTO lead_assignments (${LA_COLS.join(', ')}) VALUES (${placeholders})
         ON CONFLICT DO NOTHING`,
        LA_COLS.map((c) => r[c])
      );
    }
  }

  /* ---------------- visitor_assignments ---------------- */
  const neonVa = (await neon.query(`SELECT ${VA_COLS.join(', ')} FROM visitor_assignments`)).rows;
  let vaCopied = 0, vaSkipped = 0, vaUnmapped = 0;
  for (const r of neonVa) {
    const agent = neonById.get(String(r.agent_id));
    const bizAgent = agent ? bizByPhone.get(normPhone(agent.phone)) : null;
    if (!bizAgent) { vaUnmapped++; continue; }
    vaCopied++;
    if (!DRY) {
      await biz.query(
        `INSERT INTO visitor_assignments (visitor_id, agent_id, created_at, last_seen, expires_at)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (visitor_id) DO UPDATE
           SET agent_id = EXCLUDED.agent_id,
               created_at = EXCLUDED.created_at,
               last_seen = EXCLUDED.last_seen,
               expires_at = EXCLUDED.expires_at
         WHERE visitor_assignments.expires_at < EXCLUDED.expires_at`,
        [r.visitor_id, bizAgent.id, r.created_at, r.last_seen, r.expires_at]
      );
    }
  }
  console.log(`visitor_assignments: neon=${neonVa.length}, dipetakan=${vaCopied}, agent tak dikenal dilewati=${vaUnmapped}`);
  void vaSkipped;

  /* ---------------- rr_counter ---------------- */
  const rn = (await neon.query('SELECT current_index FROM rr_counter WHERE id=1')).rows[0]?.current_index ?? 0;
  const rb = (await biz.query('SELECT current_index FROM rr_counter WHERE id=1')).rows[0]?.current_index ?? 0;
  console.log(`rr_counter: neon=${rn}, biznet=${rb} → ${Math.max(rn, rb)}`);
  if (!DRY && rn > rb) {
    await biz.query('UPDATE rr_counter SET current_index=$1, updated_at=NOW() WHERE id=1', [rn]);
  }

  /* ---------------- hasil akhir ---------------- */
  if (!DRY) {
    const f = await biz.query(
      `SELECT count(*)::int total,
              count(*) FILTER (WHERE is_test IS NOT TRUE)::int produksi,
              max(created_at) latest
         FROM leads`
    );
    console.log('BIZNET leads setelah merge:', JSON.stringify(f.rows[0]));
    const st = await biz.query('SELECT agent_name, daily_leads, max_spread, guard_status FROM get_round_robin_wave_status(3)');
    console.table(st.rows);
  }

  await neon.end();
  await biz.end();
  console.log(DRY ? 'DRY RUN selesai (tidak ada yang ditulis)' : 'MERGE selesai ✅');
})().catch((e) => {
  console.error('ERR', e);
  process.exit(1);
});
