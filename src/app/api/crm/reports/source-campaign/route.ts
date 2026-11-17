import { NextRequest } from 'next/server';
import { getMonitorPool } from '@/lib/db';
import { isAuthFailure, json, requireUser } from '@/lib/crm-auth';
import { isAdminRole, normalizeCrmSource, normalizeStage } from '@/lib/crm-stages';

export const dynamic = 'force-dynamic';

/**
 * GET /api/crm/reports/source-campaign?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * Laporan per Source, per Campaign (diurutkan Sample+ terbanyak), dan Source x Sales (Admin saja).
 */
export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;
  const isAdmin = isAdminRole(user.role);

  const sp = req.nextUrl.searchParams;
  const nowWib = new Date(Date.now() + 7 * 3600_000);
  const todayStr = nowWib.toISOString().slice(0, 10);
  const defaultStart = `${todayStr.slice(0, 7)}-01`;

  const startDate = sp.get('startDate')?.trim() || defaultStart;
  const endDate = sp.get('endDate')?.trim() || todayStr;

  const pool = getMonitorPool();
  const res = await pool.query(
    `SELECT l.id, l.tracking_code, l.source, l.utm_source, l.utm_medium, l.utm_campaign,
            l.page_url, l.referrer,
            COALESCE(NULLIF(cls.owner, ''), l.assigned_to, 'Unassigned') AS owner_name,
            COALESCE(cls.source_manual, NULL) AS source_manual,
            COALESCE(cls.stage, 'lead_masuk') AS stage
       FROM leads l
       LEFT JOIN crm_lead_state cls ON cls.tracking_code = l.tracking_code
      WHERE l.is_test IS NOT TRUE
        AND l.created_at >= (($1::date)::timestamp AT TIME ZONE 'Asia/Jakarta')
        AND l.created_at <  ((($2::date + 1))::timestamp AT TIME ZONE 'Asia/Jakarta')
        ${isAdmin ? '' : 'AND lower(COALESCE(NULLIF(cls.owner, \'\'), l.assigned_to, \'\')) = lower($3)'}`,
    isAdmin ? [startDate, endDate] : [startDate, endDate, user.name]
  );

  const totalLeads = res.rows.length;

  const sourceMap = new Map<
    string,
    {
      source: string;
      total: number;
      warmPlus: number;
      samplePlus: number;
      deal: number;
      lost: number;
      stages: Record<string, number>;
    }
  >();

  const campaignMap = new Map<
    string,
    {
      campaign: string;
      source: string;
      total: number;
      sample: number;
      deal: number;
      samplePlus: number;
      stages: Record<string, number>;
    }
  >();

  const sourceSalesMap = new Map<string, Record<string, number>>();
  const salesSet = new Set<string>();

  const WARM_PLUS = new Set(['warm_below_500', 'warm_up_500', 'warm_below_1000', 'warm_up_1000', 'hot', 'sample', 'deal']);

  for (const row of res.rows) {
    const srcInfo = normalizeCrmSource({
      source: row.source_manual || row.source,
      utm_source: row.utm_source,
      utm_medium: row.utm_medium,
      utm_campaign: row.utm_campaign,
      page_url: row.page_url,
      referrer: row.referrer,
    });
    const source = srcInfo.source;
    const stage = normalizeStage(row.stage);
    const campaign = (row.utm_campaign || '').trim() || '(Tanpa campaign)';
    const owner = row.owner_name || 'Unassigned';

    // 1. Source aggregation
    let sAgg = sourceMap.get(source);
    if (!sAgg) {
      sAgg = { source, total: 0, warmPlus: 0, samplePlus: 0, deal: 0, lost: 0, stages: {} };
      sourceMap.set(source, sAgg);
    }
    sAgg.total++;
    sAgg.stages[stage] = (sAgg.stages[stage] || 0) + 1;
    if (WARM_PLUS.has(stage)) sAgg.warmPlus++;
    if (stage === 'sample' || stage === 'deal') sAgg.samplePlus++;
    if (stage === 'deal') sAgg.deal++;
    if (stage === 'lost') sAgg.lost++;

    // 2. Campaign aggregation
    const campKey = `${source}::${campaign}`;
    let cAgg = campaignMap.get(campKey);
    if (!cAgg) {
      cAgg = { campaign, source, total: 0, sample: 0, deal: 0, samplePlus: 0, stages: {} };
      campaignMap.set(campKey, cAgg);
    }
    cAgg.total++;
    cAgg.stages[stage] = (cAgg.stages[stage] || 0) + 1;
    if (stage === 'sample') cAgg.sample++;
    if (stage === 'deal') cAgg.deal++;
    if (stage === 'sample' || stage === 'deal') cAgg.samplePlus++;

    // 3. Source x Sales (Admin)
    if (isAdmin) {
      salesSet.add(owner);
      const cur = sourceSalesMap.get(source) || {};
      cur[owner] = (cur[owner] || 0) + 1;
      sourceSalesMap.set(source, cur);
    }
  }

  const bySource = Array.from(sourceMap.values())
    .map((s) => ({
      ...s,
      sharePct: totalLeads > 0 ? Math.round((s.total / totalLeads) * 1000) / 10 : 0,
      dealRatioPct: s.total > 0 ? Math.round((s.deal / s.total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.total - a.total);

  const byCampaign = Array.from(campaignMap.values())
    .map((c) => ({
      ...c,
      samplePlusPct: c.total > 0 ? Math.round((c.samplePlus / c.total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.samplePlus - a.samplePlus || b.total - a.total);

  const sourceBySales = isAdmin
    ? Array.from(sourceMap.keys()).map((source) => ({
        source,
        counts: sourceSalesMap.get(source) || {},
      }))
    : null;

  return json({
    success: true,
    period: { startDate, endDate },
    totalLeads,
    bySource,
    byCampaign,
    salesColumns: isAdmin ? Array.from(salesSet).sort() : [],
    sourceBySales,
  });
}
