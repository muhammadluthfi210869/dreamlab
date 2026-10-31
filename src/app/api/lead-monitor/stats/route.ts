import { NextRequest, NextResponse } from 'next/server';
import { getMonitorPool, resetMonitorPool } from '@/lib/db';
import { isAuthFailure, requireUser, serviceTokenOk } from '@/lib/crm-auth';
import { attachCrmState } from '@/lib/lead-monitor-data';
import {
  computeKpi,
  dailySeries,
  deltaPct,
  fairness,
  filterLeads,
  groupBy,
  hourlyChats,
  hourlyClicks,
  latencySeconds,
  mergeForMonitor,
  pagePath,
  paginate,
  perBusdev,
  referrerInfo,
  sortLeads,
  sourceKey,
  splitActive,
  stageCounts,
  tabCounts,
  topLeads,
  topReferrers,
  computeMoqOverview,
  computeBusdevChannelFunnels,
  type MonitorLead,
  type SortKey,
  type StatusTab,
  type TableFilters,
  type ViewedLead,
} from '@/lib/lead-monitor-stats';
import { articlesMeta } from '@/data/articles-meta';

// path artikel (tanpa slash akhir) -> judul, tanpa akhiran merek. Metadata ringan, bukan isi artikel.
const ARTICLE_TITLES = new Map<string, string>(
  articlesMeta.map((a) => [a.slug.replace(/\/+$/, '') || '/', a.title.replace(/\s*[|–-]\s*Dreamlab\s*$/i, '').trim()])
);
const articleTitleOf = (path: string): string | null => ARTICLE_TITLES.get(path) ?? null;

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60;

/** Batas baris mentah per periode. Kalau tercapai, UI menampilkan peringatan "data terpotong". */
const RAW_ROW_CAP = 5000;
/** Titik awal sistem tracking terpadu. Periode tidak boleh mulai sebelum ini. */
const SYSTEM_LAUNCH_DATE = '2026-10-06';
const MAX_RANGE_DAYS = 120;

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
};

// Kolom hasil form kualifikasi (migrasi 00022 & 00023). Belum tentu sudah ada di
// database live, jadi dideteksi dulu; kalau belum ada dikembalikan NULL.
const QUALIFICATION_COLUMNS: Record<string, string> = {
  production_tier_name: 'text',
  requested_quantity_pcs: 'int',
  inquiry_reference: 'text',
  phone_country_iso2: 'text',
  whatsapp_phone_e164: 'text',
};

let columnCache: { at: number; cols: Set<string> } | null = null;
const COLUMN_CACHE_MS = 60_000;

async function getLeadColumns(): Promise<Set<string>> {
  if (columnCache && Date.now() - columnCache.at < COLUMN_CACHE_MS) return columnCache.cols;
  const res = await getMonitorPool().query(
    `SELECT column_name FROM information_schema.columns
      WHERE table_name = 'leads' AND table_schema = current_schema()`
  );
  const cols = new Set<string>(res.rows.map((r) => r.column_name));
  columnCache = { at: Date.now(), cols };
  return cols;
}

// Cache respons singkat: beberapa penonton / polling 20 detik tidak perlu menghantam database berulang.
const RESPONSE_TTL_MS = 8_000;
const responseCache = new Map<string, { at: number; body: unknown }>();

const isConnError = (e: any) =>
  /ECONNRESET|ETIMEDOUT|Connection terminated|timeout|ECONNREFUSED/i.test(`${e?.code ?? ''} ${e?.message ?? ''}`);

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function wibToday(): string {
  return new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);
}

function addDays(date: string, n: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);
}

const intParam = (v: string | null, d: number) => {
  const n = parseInt(v || '', 10);
  return Number.isFinite(n) ? n : d;
};

export async function GET(req: NextRequest) {
  // Data ini memuat nomor WhatsApp prospek: wajib login. Dicek SEBELUM cache respons.
  // Pengguna lewat cookie login; ERP (mesin) lewat token Bearer khusus dan hanya mendapat format lama yang dibacanya.
  const serviceAuthed = serviceTokenOk(req);
  // ERP boleh meminta bentuk lengkap (sama persis dengan yang dilihat Head) lewat `shape=full`; tanpa itu bentuk lama.
  const serviceMode = serviceAuthed && new URL(req.url).searchParams.get('shape') !== 'full';
  if (!serviceAuthed) {
    const auth = await requireUser(req);
    if (isAuthFailure(auth)) return auth;
  }

  const url = new URL(req.url);
  const sp = url.searchParams;

  // ---- periode (selalu tanggal WIB; preset dihitung di klien)
  let endDate = DATE_RE.test(sp.get('endDate') || '') ? sp.get('endDate')! : wibToday();
  let startDate = DATE_RE.test(sp.get('startDate') || '') ? sp.get('startDate')! : endDate;
  if (startDate < SYSTEM_LAUNCH_DATE) startDate = SYSTEM_LAUNCH_DATE;
  if (endDate < startDate) endDate = startDate;
  if (daysBetween(startDate, endDate) >= MAX_RANGE_DAYS) startDate = addDays(endDate, -(MAX_RANGE_DAYS - 1));

  const busdev = sp.get('busdev') || 'all';
  const tabParam = sp.get('tab') || 'chat';
  const tab: StatusTab = (['chat', 'dropoff', 'all', 'direct'] as const).includes(tabParam as StatusTab)
    ? (tabParam as StatusTab)
    : 'chat';
  const kind = (['all', 'form', 'click'] as const).find((k) => k === sp.get('kind')) || 'all';
  const moq = (['all', 'met', 'below'] as const).find((k) => k === sp.get('moq')) || 'all';
  const filters: TableFilters = {
    tab,
    busdev: 'all', // BusDev sudah diterapkan sebagai filter global di bawah
    kind,
    tier: sp.get('tier') || 'all',
    moq,
    source: sp.get('source') || 'all',
    search: (sp.get('search') || '').slice(0, 100),
    stage: sp.get('stage') || 'all',
  };
  const sortKeys: SortKey[] = ['time', 'name', 'busdev', 'product', 'quantity', 'chat_time'];
  const sort: SortKey = sortKeys.includes(sp.get('sort') as SortKey) ? (sp.get('sort') as SortKey) : 'time';
  const dir = sp.get('dir') === 'asc' ? 'asc' : 'desc';
  const isExport = sp.get('export') === '1';
  const page = intParam(sp.get('page'), 1);
  const pageSize = isExport ? RAW_ROW_CAP : Math.min(Math.max(intParam(sp.get('pageSize'), 25), 5), 100);

  const cacheKey = isExport ? null : (serviceMode ? 'svc|' : '') + url.searchParams.toString();
  if (cacheKey) {
    const hit = responseCache.get(cacheKey);
    if (hit && Date.now() - hit.at < RESPONSE_TTL_MS) {
      return NextResponse.json(hit.body, { status: 200, headers: NO_STORE_HEADERS });
    }
  }

  try {
    let leadCols: Set<string>;
    try {
      leadCols = await getLeadColumns();
    } catch (connErr: any) {
      if (!isConnError(connErr)) throw connErr;
      console.warn('[lead-monitor/stats] Stale pooled connection, resetting and retrying...', connErr?.message);
      resetMonitorPool();
      leadCols = await getLeadColumns();
    }
    const col = (name: string) => (leadCols.has(name) ? name : `NULL::${QUALIFICATION_COLUMNS[name]} AS ${name}`);
    const formExpr = leadCols.has('inquiry_reference')
      ? `(inquiry_reference IS NOT NULL OR intent LIKE '[QUALIFIED]%')`
      : `(intent LIKE '[QUALIFIED]%')`;

    const GHOST = `(wa_message ~* 'memeriksa pesan baru|legalitas sertifikasi bpom')`;
    const GHOST_ROWS = `COALESCE(${GHOST}, FALSE) AS is_ghost`;
    const FORM_FLAG = `COALESCE(${formExpr}, FALSE) AS is_form_lead`;
    const RANGE = `WHERE is_test IS NOT TRUE
            AND created_at >= (($1::date)::timestamp AT TIME ZONE 'Asia/Jakarta')
            AND created_at <  ((($2::date + 1))::timestamp AT TIME ZONE 'Asia/Jakarta')
          ORDER BY created_at DESC
          LIMIT ${RAW_ROW_CAP}`;

    // Periode ini: semua kolom yang dibutuhkan tabel, tetapi dipangkas (teks panjang dipotong, wa_message
    // tidak dikirim, hanya penanda ghost) karena koneksi ke database bisa lambat.
    const curSql = `SELECT id, tracking_code, assigned_to, source, left(page_url, 200) AS page_url, left(referrer, 300) AS referrer, status,
                nama, hp, wa_profile_name, wa_phone, produk, left(utm_campaign, 80) AS utm_campaign,
                ${FORM_FLAG}, ${GHOST_ROWS},
                ${col('production_tier_name')}, ${col('requested_quantity_pcs')},
                ${col('inquiry_reference')}, ${col('phone_country_iso2')}, ${col('whatsapp_phone_e164')},
                created_at, confirmed_at
           FROM leads ${RANGE}`;
    // Periode lalu hanya untuk perbandingan angka: kolom paling sedikit.
    const prevSql = `SELECT id, tracking_code, assigned_to, source, status, hp, wa_phone,
                ${FORM_FLAG}, ${GHOST_ROWS},
                ${col('production_tier_name')}, ${col('requested_quantity_pcs')},
                created_at, confirmed_at
           FROM leads ${RANGE}`;

    // ---- periode ini + periode sebelumnya (panjang sama) untuk perbandingan
    const rangeDays = daysBetween(startDate, endDate) + 1;
    const prevEnd = addDays(startDate, -1);
    const prevStart = addDays(prevEnd, -(rangeDays - 1));
    const hasPrev = prevStart >= SYSTEM_LAUNCH_DATE;

    // Semua query berjalan BERSAMAAN (tiap query memakai koneksi sendiri dari pool).
    const mp = getMonitorPool;
    const runAll = () =>
      Promise.all([
        mp().query(curSql, [startDate, endDate]),
        hasPrev ? mp().query(prevSql, [prevStart, prevEnd]) : Promise.resolve({ rows: [] as any[] }),
        mp().query(`SELECT name, is_active FROM busdevs ORDER BY is_active DESC, id ASC`),
        mp().query(`SELECT value FROM rr_settings WHERE key = 'rr_mode'`).catch(() => ({ rows: [] as any[] })), // tabel baru ada setelah migrasi 00024
      ]);
    let results: Awaited<ReturnType<typeof runAll>>;
    try {
      results = await runAll();
    } catch (connErr: any) {
      if (!isConnError(connErr)) throw connErr;
      console.warn('[lead-monitor/stats] Koneksi bermasalah, reset pool dan coba sekali lagi:', connErr?.message);
      resetMonitorPool();
      results = await runAll();
    }
    const [curRes, prevRes, bdRes, rrRes] = results;

    const withPhone = (r: any) => ({ ...r, display_phone: r.wa_phone || r.hp || null });
    const curRaw = (curRes.rows as any[]).map(withPhone) as MonitorLead[];
    const prevRaw = (prevRes.rows as any[]) as MonitorLead[];
    const rawCapped = curRaw.length >= RAW_ROW_CAP;

    const merged = mergeForMonitor(curRaw).map((l) => ({ ...l, latency_seconds: latencySeconds(l) }));

    // ---- isian CRM (tahap + Produk/MOQ/catatan manual) dari tabel crm_lead_state
    await attachCrmState(mp(), merged as any[]);
    const mergedPrev = hasPrev ? mergeForMonitor(prevRaw) : [];

    // ---- daftar sales
    const registered: { name: string; isActive: boolean }[] = bdRes.rows.map((r: any) => ({
      name: r.name,
      isActive: !!r.is_active,
    }));
    const activeNames = registered.filter((r) => r.isActive).map((r) => r.name);

    // ---- filter global: BusDev (kartu, grafik, dan tabel mengikuti ini)
    const scoped: ViewedLead[] =
      busdev.toLowerCase() === 'all'
        ? merged
        : merged.filter((l) => (l.assigned_to || '').toLowerCase() === busdev.toLowerCase());
    const scopedPrev =
      busdev.toLowerCase() === 'all'
        ? mergedPrev
        : mergedPrev.filter((l) => (l.assigned_to || '').toLowerCase() === busdev.toLowerCase());

    const kpi = computeKpi(scoped);
    const kpiPrev = hasPrev ? computeKpi(scopedPrev) : null;

    // ---- chat masuk per sales: selalu semua sales AKTIF (tidak ikut filter BusDev) agar perbandingannya utuh.
    // Sales nonaktif tidak ditampilkan; datanya dirangkum di `inactive` supaya total tetap cocok dengan kartu.
    const { active: busdevRows, inactive: inactiveSummary } = splitActive(perBusdev(merged, activeNames), activeNames);

    // ---- mode pembagian (hanya ada setelah migrasi round robin dijalankan)
    const rrMode: string | null = (rrRes.rows[0] as any)?.value ?? null;

    // ---- tabel
    const filtered = sortLeads(filterLeads(scoped, filters), sort, dir);
    const pg = paginate(filtered, page, pageSize);
    const slim = (l: ViewedLead) => {
      // Referrer mentah tidak dikirim ke browser (bisa memuat UTM/fbclid); hanya label bersih.
      const ref = referrerInfo(l.referrer, articleTitleOf);
      return {
      id: l.id,
      tracking_code: l.tracking_code,
      assigned_to: l.assigned_to,
      busdevs: l.busdevs,
      source: l.source,
      page_url: pagePath(l.page_url as string | null),
      codes: [l.tracking_code, ...((l.merged_tracking_codes as string[] | undefined) ?? [])],
      crm_stage: l.crm_stage ?? 'traffic',
      produk_manual: l.produk_manual ?? null,
      moq_manual: l.moq_manual ?? null,
      note: l.note ?? null,
      referrer_label: ref.label,
      referrer_kind: ref.kind,
      referrer_path: ref.path,
      status: l.status,
      nama: l.nama ?? null,
      wa_profile_name: l.wa_profile_name ?? null,
      display_phone: (l.display_phone as string) ?? l.wa_phone ?? l.hp ?? null,
      phone_from: l.wa_phone ? 'WA' : l.hp ? 'Form' : null,
      phone_country_iso2: (l.phone_country_iso2 as string) ?? null,
      whatsapp_phone_e164: (l.whatsapp_phone_e164 as string) ?? null,
      produk: l.produk ?? null,
      utm_campaign: l.utm_campaign ?? null,
      is_form_lead: !!l.is_form_lead,
      production_tier_name: l.production_tier_name ?? null,
      requested_quantity_pcs: l.requested_quantity_pcs ?? null,
      inquiry_reference: l.inquiry_reference ?? null,
      created_at: l.created_at,
      confirmed_at: l.confirmed_at,
      latency_seconds: (l as any).latency_seconds ?? null,
      duplicate_count: l.duplicate_count,
      merged_tracking_codes: l.merged_tracking_codes,
      last_seen_at: l.last_seen_at,
      };
    };

    const sources = [...new Set(scoped.map((l) => l.source || 'direct').filter((s) => s !== 'wa-direct'))].sort();
    const tiers = [...new Set(scoped.map((l) => (l.production_tier_name as string) || '').filter(Boolean))].sort();

    if (serviceMode) {
      // Format lama untuk Dashboard Leads di ERP (modul leads-dashboard): kpi datar, busdevBreakdown, leads.
      const legacy = {
        success: true,
        kpi: {
          totalClicks: kpi.totalClicks,
          confirmedChats: kpi.chat,
          dropoffClicks: kpi.dropoff,
          directChats: kpi.direct,
          conversionRate: kpi.totalClicks > 0 ? Math.round((kpi.chat / kpi.totalClicks) * 1000) / 10 : 0,
        },
        busdevBreakdown: perBusdev(merged, activeNames)
          .filter((r) => activeNames.some((n) => n.toLowerCase() === r.name.toLowerCase()) || r.clicks + r.direct > 0)
          .map((r) => ({
            busdev_name: r.name,
            is_active: activeNames.some((n) => n.toLowerCase() === r.name.toLowerCase()),
            total_clicks: r.clicks,
            confirmed_chats: r.chat,
            dropoff_clicks: r.dropoff,
            direct_chats: r.direct,
          })),
        leads: scoped.slice(0, 3000).map((l) => ({
          id: l.id,
          assigned_to: l.assigned_to ?? null,
          source: l.source ?? null,
          status: l.status ?? null,
          display_phone: (l.display_phone as string) ?? null,
          created_at: l.created_at,
          latency_seconds: (l as any).latency_seconds ?? null,
        })),
      };
      if (cacheKey) {
        if (responseCache.size > 50) responseCache.clear();
        responseCache.set(cacheKey, { at: Date.now(), body: legacy });
      }
      return NextResponse.json(legacy, { status: 200, headers: NO_STORE_HEADERS });
    }

    const body = {
        success: true,
        period: { startDate, endDate, days: rangeDays, hasPrevious: hasPrev },
        kpi: {
          current: kpi,
          previous: kpiPrev,
          delta: kpiPrev
            ? {
                totalClicks: deltaPct(kpi.totalClicks, kpiPrev.totalClicks),
                chat: deltaPct(kpi.chat, kpiPrev.chat),
                dropoff: deltaPct(kpi.dropoff, kpiPrev.dropoff),
                moqMet: deltaPct(kpi.moqMet, kpiPrev.moqMet),
              }
            : null,
        },
        busdevs: busdevRows,
        inactiveBusdevs: inactiveSummary,
        fairness: fairness(busdevRows, activeNames),
        daily: dailySeries(scoped, startDate, endDate),
        hourly: hourlyChats(scoped),
        hourlyClicks: hourlyClicks(scoped),
        sources: groupBy(scoped, sourceKey, 8),
        pages: groupBy(scoped, (l) => pagePath(l.page_url as string | null), 8),
        topLeads: topLeads(scoped, Date.now(), 5),
        stageCounts: stageCounts(scoped),
        moqOverview: computeMoqOverview(scoped, articleTitleOf, 6),
        channelFunnels: computeBusdevChannelFunnels(scoped, busdev.toLowerCase() === 'all' ? activeNames : [busdev]),
        referrers: topReferrers(scoped, articleTitleOf, 8),
        rrMode,
        // Dashboard hanya butuh kartu/grafik (light=1); tabel ada di halaman Pelanggan.
        table: sp.get('light') === '1' ? null : {
          rows: pg.rows.map(slim),
          total: filtered.length,
          page: pg.page,
          pages: pg.pages,
          pageSize,
          tabCounts: tabCounts(scoped),
          sources,
          tiers,
        },
        meta: { rawRows: curRaw.length, rawCapped, serverTime: new Date().toISOString() },
    };
    if (cacheKey) {
      if (responseCache.size > 50) responseCache.clear();
      responseCache.set(cacheKey, { at: Date.now(), body });
    }
    return NextResponse.json(body, { status: 200, headers: NO_STORE_HEADERS });
  } catch (err: any) {
    console.error('[lead-monitor/stats] Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch lead stats' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
