import { NextRequest } from 'next/server';
import { getMonitorPool, resetMonitorPool } from '@/lib/db';
import { isAuthFailure, json, requireUser } from '@/lib/crm-auth';
import { articlesMeta } from '@/data/articles-meta';
import { attachCrmState, colExpr, getLeadColumns, GHOST_SQL } from '@/lib/lead-monitor-data';
import {
  classify,
  cleanName,
  computeBusdevChannelFunnels,
  mergeForMonitor,
  pagePath,
  quantityOf,
  referrerInfo,
  type MonitorLead,
} from '@/lib/lead-monitor-stats';
import {
  CRM_SOURCES,
  formatLandingOrigin,
  getWarmStageMoq,
  isAdminRole,
  normalizeCrmSource,
  normalizeStage,
  PIPELINE_STAGES,
  resolveTrafficStageByMoq,
} from '@/lib/crm-stages';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const SYSTEM_LAUNCH_DATE = '2026-10-06';
const MAX_RANGE_DAYS = 120;
const RAW_ROW_CAP = 5000;
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

function cleanPhoneDigits(p?: string | null): string {
  if (!p) return '';
  let d = String(p).replace(/\D/g, '');
  if (d.startsWith('0')) d = '62' + d.slice(1);
  return d;
}

/**
 * GET /api/crm/pipeline
 * Mendukung filter:
 *  - busdev / sales (khusus Admin; Busdev otomatis difilter ke lead miliknya sendiri)
 *  - source (Meta Ads, Google Ads, Website/SEO, WhatsApp organik, Instagram, TikTok, Referral, atau all)
 *  - campaign (bergantung pada source)
 *  - startDate & endDate (Hari ini, Kemarin, 7 hari, 30 hari, atau rentang custom)
 *  - q (pencarian nama / brand / nomor WA / produk)
 */
export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;
  const isAdmin = isAdminRole(user.role);

  const sp = new URL(req.url).searchParams;
  let endDate = DATE_RE.test(sp.get('endDate') || '') ? sp.get('endDate')! : wibToday();
  let startDate = DATE_RE.test(sp.get('startDate') || '') ? sp.get('startDate')! : endDate;
  if (startDate < SYSTEM_LAUNCH_DATE) startDate = SYSTEM_LAUNCH_DATE;
  if (endDate < startDate) endDate = startDate;
  if (daysBetween(startDate, endDate) >= MAX_RANGE_DAYS) startDate = addDays(endDate, -(MAX_RANGE_DAYS - 1));

  const requestedBusdev = (sp.get('busdev') || sp.get('sales') || 'all').trim();
  if (!isAdmin && requestedBusdev.toLowerCase() !== 'all' && requestedBusdev.toLowerCase() !== user.name.toLowerCase()) {
    return json({ success: false, error: 'Anda hanya memiliki izin melihat pipeline milik Anda sendiri' }, 403);
  }
  const effectiveBusdev = isAdmin ? requestedBusdev : user.name;

  const filterSource = (sp.get('source') || 'all').trim();
  const filterCampaign = (sp.get('campaign') || 'all').trim();
  const searchQuery = (sp.get('q') || '').trim().toLowerCase();

  const run = async () => {
    const pool = getMonitorPool();
    const cols = await getLeadColumns(pool);
    const formExpr = cols.has('inquiry_reference')
      ? `(inquiry_reference IS NOT NULL OR intent LIKE '[QUALIFIED]%')`
      : `(intent LIKE '[QUALIFIED]%')`;
    const ownerFilterSql = isAdmin ? '' : `AND lower(COALESCE(assigned_to, '')) = lower($3)`;
    const sqlParams = isAdmin ? [startDate, endDate] : [startDate, endDate, user.name];
    const sql = `SELECT id, tracking_code, assigned_to, source, utm_source, utm_medium, utm_campaign,
                  left(page_url, 200) AS page_url, left(referrer, 300) AS referrer, status,
                  nama, hp, wa_profile_name, wa_phone, produk,
                  COALESCE(${formExpr}, FALSE) AS is_form_lead, COALESCE(${GHOST_SQL}, FALSE) AS is_ghost,
                  ${colExpr(cols, 'production_tier_name')}, ${colExpr(cols, 'requested_quantity_pcs')},
                  created_at, confirmed_at
             FROM leads
            WHERE is_test IS NOT TRUE
              AND created_at >= (($1::date)::timestamp AT TIME ZONE 'Asia/Jakarta')
              AND created_at <  ((($2::date + 1))::timestamp AT TIME ZONE 'Asia/Jakarta')
              ${ownerFilterSql}
            ORDER BY created_at DESC
            LIMIT ${RAW_ROW_CAP}`;
    const [rows, bds, unreadRes] = await Promise.all([
      pool.query(sql, sqlParams),
      pool.query(`SELECT name FROM busdevs WHERE is_active = TRUE ORDER BY id ASC`),
      pool
        .query(
          `SELECT customer_phone, COUNT(*)::int AS unread
             FROM wa_messages
            WHERE direction = 'inbound' AND read_at IS NULL
            GROUP BY customer_phone`
        )
        .catch(() => ({ rows: [] as any[] })),
    ]);
    const allBusdevs = bds.rows.map((r: any) => r.name as string);
    const unreadByPhone = new Map<string, number>(
      unreadRes.rows.map((r: any) => [cleanPhoneDigits(r.customer_phone), Number(r.unread || 0)])
    );
    return {
      rows: rows.rows as any[],
      busdevNames: isAdmin ? allBusdevs : allBusdevs.filter((n) => n.toLowerCase() === user.name.toLowerCase()),
      unreadByPhone,
    };
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

    if (effectiveBusdev.toLowerCase() !== 'all') {
      merged = merged.filter((l) => (l.assigned_to || '').toLowerCase() === effectiveBusdev.toLowerCase());
    }

    // Hitung daftar campaign yang tersedia (bergantung pada source terpilih)
    const campaignsSet = new Set<string>();
    const campaignsBySource: Record<string, string[]> = {};

    const enriched = merged.map((l) => {
      const srcInfo = normalizeCrmSource({
        source: l.source_manual || l.source,
        utm_source: l.utm_source,
        utm_medium: l.utm_medium,
        utm_campaign: l.utm_campaign,
        page_url: l.page_url,
        referrer: l.referrer,
      });
      const ref = referrerInfo(l.referrer, articleTitleOf);
      const campaignLabel =
        (l.utm_campaign && String(l.utm_campaign).trim()) ||
        (l.page_url && l.page_url.includes('/google-ads/')
          ? l.page_url.split('?')[0].replace(/^https?:\/\/[^/]+/, '').replace(/\/+$/, '')
          : null) ||
        (l.page_url && l.page_url.includes('/metaads/')
          ? l.page_url.split('?')[0].replace(/^https?:\/\/[^/]+/, '').replace(/\/+$/, '')
          : null) ||
        (ref.kind === 'artikel' ? ref.label : null);

      if (campaignLabel) {
        if (!campaignsBySource[srcInfo.source]) campaignsBySource[srcInfo.source] = [];
        if (!campaignsBySource[srcInfo.source].includes(campaignLabel)) {
          campaignsBySource[srcInfo.source].push(campaignLabel);
        }
        if (filterSource === 'all' || srcInfo.source.toLowerCase() === filterSource.toLowerCase()) {
          campaignsSet.add(campaignLabel);
        }
      }

      const landingOrigin = formatLandingOrigin(l.page_url, l.referrer);
      const phoneDigits = cleanPhoneDigits(l.display_phone);
      const unreadCount = phoneDigits ? (loaded.unreadByPhone.get(phoneDigits) ?? 0) : 0;

      return {
        raw: l,
        srcInfo,
        ref,
        campaignLabel,
        landingOrigin,
        unreadCount,
      };
    });

    // Terapkan filter source, campaign, dan pencarian (nama / brand / nomor WA / produk)
    const filtered = enriched.filter(({ raw: l, srcInfo, campaignLabel }) => {
      if (filterSource !== 'all' && srcInfo.source.toLowerCase() !== filterSource.toLowerCase()) {
        return false;
      }
      if (filterCampaign !== 'all' && (campaignLabel || '').toLowerCase() !== filterCampaign.toLowerCase()) {
        return false;
      }
      if (searchQuery) {
        const nameStr = (cleanName(l.nama) || cleanName(l.wa_profile_name) || '').toLowerCase();
        const brandStr = (l.brand || '').toLowerCase();
        const phoneStr = (l.display_phone || '').toLowerCase();
        const phoneClean = cleanPhoneDigits(l.display_phone);
        const qDigits = searchQuery.replace(/\D/g, '');
        const prodStr = (l.produk_manual || l.produk || '').toLowerCase();
        const codeStr = (l.tracking_code || '').toLowerCase();

        const matchText =
          nameStr.includes(searchQuery) ||
          brandStr.includes(searchQuery) ||
          phoneStr.includes(searchQuery) ||
          prodStr.includes(searchQuery) ||
          codeStr.includes(searchQuery) ||
          (qDigits.length >= 4 && phoneClean.includes(qDigits));
        if (!matchText) return false;
      }
      return true;
    });

    const byStage = new Map<string, any[]>(PIPELINE_STAGES.map((s) => [s.id as string, []]));
    for (const { raw: l, srcInfo, ref, campaignLabel, landingOrigin, unreadCount } of filtered) {
      const moq = quantityOf(l);
      const mappedStage = normalizeStage(l.crm_stage);
      let st = l.has_manual_stage && byStage.has(mappedStage) ? mappedStage : resolveTrafficStageByMoq(moq);
      if (!byStage.has(st)) st = 'lead_masuk';

      const warmMoq = getWarmStageMoq(st);
      const moqLabel = l.moq_label || (warmMoq ? warmMoq.label : moq ? `${moq}` : null);

      byStage.get(st)!.push({
        id: Number(l.id),
        key: l.tracking_code,
        codes: [l.tracking_code, ...(l.merged_tracking_codes ?? [])],
        name: cleanName(l.nama) || cleanName(l.wa_profile_name),
        phone: l.display_phone ?? null,
        brand: l.brand ?? null,
        produk: l.produk_manual || l.produk || null,
        produk_manual: l.produk_manual ?? null,
        moq,
        moq_manual: l.moq_manual ?? null,
        moq_label: moqLabel,
        note: l.note ?? null,
        lost_reason: l.lost_reason ?? null,
        sales: l.assigned_to ?? null,
        source: srcInfo.source,
        source_raw: l.source ?? null,
        campaign: campaignLabel,
        detection_method: srcInfo.detectionMethod,
        landing_path: landingOrigin,
        referrer: ref.label,
        referrer_raw: l.referrer ?? null,
        referrer_kind: ref.kind,
        page: pagePath(l.page_url),
        page_raw: l.page_url ?? null,
        kind: classify(l), // 'chat' | 'dropoff' | 'direct'
        is_form: !!l.is_form_lead,
        unread_count: unreadCount,
        created_at: l.created_at,
        stage_changed_at: l.stage_changed_at || l.created_at,
        confirmed_at: l.confirmed_at,
        last_seen_at: l.last_seen_at,
      });
    }

    const columns = PIPELINE_STAGES.map((s) => {
      const list = byStage.get(s.id)!;
      return { id: s.id, count: list.length, cards: list.slice(0, CARDS_PER_STAGE) };
    });

    const channelFunnels = computeBusdevChannelFunnels(merged, loaded.busdevNames);

    return json({
      success: true,
      period: { startDate, endDate },
      busdevs: loaded.busdevNames,
      sources: CRM_SOURCES,
      availableCampaigns: Array.from(campaignsSet).sort(),
      campaignsBySource,
      total: filtered.length,
      totalUnfiltered: merged.length,
      capped,
      cardsPerStage: CARDS_PER_STAGE,
      columns,
      channelFunnels,
    });
  } catch (e: any) {
    console.error('[crm/pipeline] error:', e?.message);
    return json({ success: false, error: 'Gagal memuat pipeline' }, 500);
  }
}
