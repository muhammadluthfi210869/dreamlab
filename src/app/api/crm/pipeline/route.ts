import { NextRequest } from 'next/server';
import { getMonitorPool, resetMonitorPool } from '@/lib/db';
import { isAuthFailure, json, requireUser } from '@/lib/crm-auth';
import { articlesMeta } from '@/data/articles-meta';
import { attachCrmState, colExpr, getLeadColumns, GHOST_SQL } from '@/lib/lead-monitor-data';
import { classify, cleanName, mergeForMonitor, quantityOf, referrerInfo, pagePath, type MonitorLead } from '@/lib/lead-monitor-stats';
import { PIPELINE_STAGES } from '@/lib/crm-stages';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const SYSTEM_LAUNCH_DATE = '2026-10-06';
const MAX_RANGE_DAYS = 120;
const RAW_ROW_CAP = 5000;
/** Kartu yang dikirim per kolom (sisanya tetap dihitung di `count`). Persempit rentang tanggal untuk melihat yang lain. */
const CARDS_PER_STAGE = 400;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const ARTICLE_TITLES = new Map<string, string>(
  articlesMeta.map((a) => [a.slug.replace(/\/+$/, '') || '/', a.title.replace(/\s*[|–-]\s*Dreamlab\s*$/i, '').trim()])
);
const articleTitleOf = (path: string): string | null => ARTICLE_TITLES.get(path) ?? null;

const wibToday = () => new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);
const addDays = (d: string, n: number) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);
const isConnError = (e: any) => /ECONNRESET|ETIMEDOUT|Connection terminated|timeout|ECONNREFUSED/i.test(`${e?.code ?? ''} ${e?.message ?? ''}`);

/**
 * Papan pipeline: setiap prospek (kode klik, atau nomor WA yang sama dalam 24 jam digabung) berada di satu tahap.
 * Tanpa isian CRM = tahap 'traffic', jadi semua lead baru otomatis masuk Traffic.
 */
export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (isAuthFailure(auth)) return auth;

  const sp = new URL(req.url).searchParams;
  let endDate = DATE_RE.test(sp.get('endDate') || '') ? sp.get('endDate')! : wibToday();
  let startDate = DATE_RE.test(sp.get('startDate') || '') ? sp.get('startDate')! : endDate;
  if (startDate < SYSTEM_LAUNCH_DATE) startDate = SYSTEM_LAUNCH_DATE;
  if (endDate < startDate) endDate = startDate;
  if (daysBetween(startDate, endDate) >= MAX_RANGE_DAYS) startDate = addDays(endDate, -(MAX_RANGE_DAYS - 1));
  const busdev = sp.get('busdev') || 'all';

  const run = async () => {
    const pool = getMonitorPool();
    const cols = await getLeadColumns(pool);
    const formExpr = cols.has('inquiry_reference') ? `(inquiry_reference IS NOT NULL OR intent LIKE '[QUALIFIED]%')` : `(intent LIKE '[QUALIFIED]%')`;
    const sql = `SELECT id, tracking_code, assigned_to, source, left(page_url, 200) AS page_url, left(referrer, 300) AS referrer, status,
                  nama, hp, wa_profile_name, wa_phone, produk,
                  COALESCE(${formExpr}, FALSE) AS is_form_lead, COALESCE(${GHOST_SQL}, FALSE) AS is_ghost,
                  ${colExpr(cols, 'production_tier_name')}, ${colExpr(cols, 'requested_quantity_pcs')},
                  created_at, confirmed_at
             FROM leads
            WHERE is_test IS NOT TRUE
              AND created_at >= (($1::date)::timestamp AT TIME ZONE 'Asia/Jakarta')
              AND created_at <  ((($2::date + 1))::timestamp AT TIME ZONE 'Asia/Jakarta')
            ORDER BY created_at DESC
            LIMIT ${RAW_ROW_CAP}`;
    const [rows, bds] = await Promise.all([
      pool.query(sql, [startDate, endDate]),
      pool.query(`SELECT name FROM busdevs WHERE is_active = TRUE ORDER BY id ASC`),
    ]);
    return { rows: rows.rows as any[], busdevNames: bds.rows.map((r: any) => r.name as string) };
  };

  try {
    let loaded;
    try {
      loaded = await run();
    } catch (e: any) {
      if (!isConnError(e)) throw e;
      resetMonitorPool();
      loaded = await run();
    }

    const raw = loaded.rows.map((r) => ({ ...r, display_phone: r.wa_phone || r.hp || null })) as MonitorLead[];
    const capped = raw.length >= RAW_ROW_CAP;
    let merged = mergeForMonitor(raw) as any[];
    await attachCrmState(getMonitorPool(), merged);
    if (busdev.toLowerCase() !== 'all') merged = merged.filter((l) => (l.assigned_to || '').toLowerCase() === busdev.toLowerCase());

    const byStage = new Map<string, any[]>(PIPELINE_STAGES.map((s) => [s.id as string, []]));
    for (const l of merged) {
      const st = byStage.has(l.crm_stage) ? l.crm_stage : 'traffic';
      const ref = referrerInfo(l.referrer, articleTitleOf);
      byStage.get(st)!.push({
        key: l.tracking_code,
        codes: [l.tracking_code, ...(l.merged_tracking_codes ?? [])],
        name: cleanName(l.nama) || cleanName(l.wa_profile_name),
        phone: l.display_phone ?? null,
        produk: l.produk_manual || l.produk || null,
        produk_manual: l.produk_manual ?? null,
        moq: quantityOf(l),
        moq_manual: l.moq_manual ?? null,
        note: l.note ?? null,
        sales: l.assigned_to ?? null,
        source: l.source ?? null,
        referrer: ref.label,
        referrer_kind: ref.kind,
        page: pagePath(l.page_url),
        kind: classify(l), // 'chat' | 'dropoff' | 'direct'
        is_form: !!l.is_form_lead,
        created_at: l.created_at,
        confirmed_at: l.confirmed_at,
        last_seen_at: l.last_seen_at,
      });
    }

    const columns = PIPELINE_STAGES.map((s) => {
      const list = byStage.get(s.id)!; // mergeForMonitor sudah mengurutkan terbaru dulu
      return { id: s.id, count: list.length, cards: list.slice(0, CARDS_PER_STAGE) };
    });

    return json({
      success: true,
      period: { startDate, endDate },
      busdevs: loaded.busdevNames,
      total: merged.length,
      capped,
      cardsPerStage: CARDS_PER_STAGE,
      columns,
    });
  } catch (e: any) {
    console.error('[crm/pipeline] error:', e?.message);
    return json({ success: false, error: 'Gagal memuat pipeline' }, 500);
  }
}
