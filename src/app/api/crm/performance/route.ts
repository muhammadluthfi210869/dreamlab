import { NextRequest } from 'next/server';
import { getMonitorPool } from '@/lib/db';
import { isAuthFailure, json, requireUser } from '@/lib/crm-auth';
import { isAdminRole, normalizeCrmSource, normalizeStage } from '@/lib/crm-stages';

export const dynamic = 'force-dynamic';

const WARM_PLUS = new Set([
  'warm_below_500',
  'warm_up_500',
  'warm_below_1000',
  'warm_up_1000',
  'hot',
  'sample',
  'deal',
]);

/**
 * Pure helper untuk menghitung CPL, Cost/Warm+, Cost/Sample, CAC, Revenue, dan ROAS.
 */
export function computePerformanceMetrics(input: {
  spend: number;
  otherCosts?: number;
  leads: number;
  warmPlus: number;
  sample: number;
  deal: number;
  revenue: number;
}) {
  const { spend, otherCosts = 0, leads, warmPlus, sample, deal, revenue } = input;
  return {
    spend,
    leads,
    cpl: leads > 0 ? Math.round(spend / leads) : 0,
    warmPlus,
    costPerWarmPlus: warmPlus > 0 ? Math.round(spend / warmPlus) : 0,
    sample,
    costPerSample: sample > 0 ? Math.round(spend / sample) : 0,
    deal,
    cacAd: deal > 0 ? Math.round(spend / deal) : 0,
    cacFull: deal > 0 ? Math.round((spend + otherCosts) / deal) : 0,
    revenue,
    roas: spend > 0 ? Math.round((revenue / spend) * 100) / 100 : 0,
    leadToSamplePct: leads > 0 ? Math.round((sample / leads) * 1000) / 10 : 0,
    leadToDealPct: leads > 0 ? Math.round((deal / leads) * 1000) / 10 : 0,
  };
}

/**
 * Resolusi aturan bentrok auto vs manual:
 * Jika pada (tanggal, source, campaign_key) terdapat baris `auto`, maka baris `auto` dipakai
 * dan baris `manual` diabaikan dalam perhitungan (diberi flag `overriddenByAuto = true`).
 */
export function resolveSpendConflict<
  T extends { tanggal: string; source: string; campaign_key: string; input_type: 'manual' | 'auto'; amount: number }
>(rows: T[]) {
  const autoKeys = new Set<string>();
  for (const r of rows) {
    if (r.input_type === 'auto') {
      autoKeys.add(`${r.tanggal}::${r.source}::${r.campaign_key || ''}`);
    }
  }
  return rows.map((r) => {
    const key = `${r.tanggal}::${r.source}::${r.campaign_key || ''}`;
    const overriddenByAuto = r.input_type === 'manual' && autoKeys.has(key);
    return { ...r, overriddenByAuto };
  });
}

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (isAuthFailure(auth)) return auth;
  if (!isAdminRole(auth.user.role)) {
    return json({ success: false, error: 'Akses ditolak: halaman Performance & CAC hanya untuk Admin' }, 403);
  }

  const sp = req.nextUrl.searchParams;
  const nowWib = new Date(Date.now() + 7 * 3600_000);
  const todayStr = nowWib.toISOString().slice(0, 10);
  const startDate = sp.get('startDate')?.trim() || `${todayStr.slice(0, 7)}-01`;
  const endDate = sp.get('endDate')?.trim() || todayStr;

  const pool = getMonitorPool();

  const [spendRes, otherRes, mapRes, leadsRes, weeklyBudgetRes] = await Promise.all([
    pool.query(
      `SELECT id, to_char(tanggal, 'YYYY-MM-DD') AS tanggal, source, campaign_key, campaign_name,
              amount::bigint AS amount, input_type, provider_ref, note, created_by, created_at
         FROM ad_spend
        WHERE tanggal >= $1::date AND tanggal <= $2::date
        ORDER BY tanggal DESC, id DESC`,
      [startDate, endDate]
    ),
    pool.query(
      `SELECT id, bulan, kategori, amount::bigint AS amount, note, created_by, created_at
         FROM other_costs
        WHERE bulan >= $1 AND bulan <= $2
        ORDER BY bulan DESC, id DESC`,
      [startDate.slice(0, 7), endDate.slice(0, 7)]
    ),
    pool.query(`SELECT id, provider_ref, ad_campaign_name, source, campaign_key FROM campaign_map ORDER BY id DESC`),
    pool.query(
      `SELECT l.id, l.tracking_code, l.source, l.utm_source, l.utm_medium, l.utm_campaign, l.page_url, l.referrer,
              to_char(l.created_at AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD') AS lead_date,
              COALESCE(cls.source_manual, NULL) AS source_manual,
              COALESCE(cls.stage, 'lead_masuk') AS stage,
              COALESCE(cls.deal_value, 0)::bigint AS deal_value
         FROM leads l
         LEFT JOIN crm_lead_state cls ON cls.tracking_code = l.tracking_code
        WHERE l.is_test IS NOT TRUE
          AND l.created_at >= (($1::date)::timestamp AT TIME ZONE 'Asia/Jakarta')
          AND l.created_at <  ((($2::date + 1))::timestamp AT TIME ZONE 'Asia/Jakarta')`,
      [startDate, endDate]
    ),
    pool.query(
      `SELECT channel, budget_idr::bigint AS budget_idr, month, week_index
         FROM crm_weekly_budgets
        WHERE month >= $1 AND month <= $2`,
      [startDate.slice(0, 7), endDate.slice(0, 7)]
    ).catch(() => ({ rows: [] as any[] })),
  ]);

  const resolvedSpend = resolveSpendConflict(
    spendRes.rows.map((r: any) => ({
      ...r,
      id: Number(r.id),
      amount: Number(r.amount || 0),
    }))
  );

  const effectiveSpendRows = resolvedSpend.filter((r) => !r.overriddenByAuto);
  const totalAdSpend = effectiveSpendRows.reduce((s, r) => s + r.amount, 0);
  const totalOtherCosts = otherRes.rows.reduce((s, r: any) => s + Number(r.amount || 0), 0);
  const weeklyBudgetTotal = weeklyBudgetRes.rows.reduce((s: number, r: any) => s + Number(r.budget_idr || 0), 0);

  // Hitung metrik cohort berdasarkan tanggal lead masuk
  let totalLeads = 0;
  let totalWarmPlus = 0;
  let totalSample = 0;
  let totalDeal = 0;
  let totalRevenue = 0;

  const sourceBuckets = new Map<string, { spend: number; leads: number; warmPlus: number; sample: number; deal: number; revenue: number }>();
  const campaignBuckets = new Map<string, { source: string; campaign: string; spend: number; leads: number; warmPlus: number; sample: number; deal: number; revenue: number }>();
  const detectedCampaigns = new Set<string>();

  const ensureSource = (src: string) => {
    let b = sourceBuckets.get(src);
    if (!b) {
      b = { spend: 0, leads: 0, warmPlus: 0, sample: 0, deal: 0, revenue: 0 };
      sourceBuckets.set(src, b);
    }
    return b;
  };

  const ensureCampaign = (src: string, camp: string) => {
    const key = `${src}::${camp}`;
    let b = campaignBuckets.get(key);
    if (!b) {
      b = { source: src, campaign: camp, spend: 0, leads: 0, warmPlus: 0, sample: 0, deal: 0, revenue: 0 };
      campaignBuckets.set(key, b);
    }
    return b;
  };

  const daySeries = new Map<string, { date: string; spend: number; deals: number }>();

  for (const row of leadsRes.rows) {
    const srcInfo = normalizeCrmSource({
      source: row.source_manual || row.source,
      utm_source: row.utm_source,
      utm_medium: row.utm_medium,
      utm_campaign: row.utm_campaign,
      page_url: row.page_url,
      referrer: row.referrer,
    });
    const src = srcInfo.source;
    const camp = (row.utm_campaign || '').trim() || '(Tanpa campaign)';
    if (row.utm_campaign) detectedCampaigns.add(String(row.utm_campaign).trim());
    const stage = normalizeStage(row.stage);
    const rev = stage === 'deal' ? Number(row.deal_value || 0) : 0;

    totalLeads++;
    const sb = ensureSource(src);
    const cb = ensureCampaign(src, camp);
    sb.leads++;
    cb.leads++;

    if (WARM_PLUS.has(stage)) {
      totalWarmPlus++;
      sb.warmPlus++;
      cb.warmPlus++;
    }
    if (stage === 'sample' || stage === 'deal') {
      totalSample++;
      sb.sample++;
      cb.sample++;
    }
    if (stage === 'deal') {
      totalDeal++;
      totalRevenue += rev;
      sb.deal++;
      sb.revenue += rev;
      cb.deal++;
      cb.revenue += rev;

      const d = daySeries.get(row.lead_date) || { date: row.lead_date, spend: 0, deals: 0 };
      d.deals++;
      daySeries.set(row.lead_date, d);
    }
  }

  let unmappedSpendTotal = 0;
  for (const spRow of effectiveSpendRows) {
    const sb = ensureSource(spRow.source);
    sb.spend += spRow.amount;

    const campKey = (spRow.campaign_key || spRow.campaign_name || '').trim();
    if (campKey) {
      const cb = ensureCampaign(spRow.source, campKey);
      cb.spend += spRow.amount;
      if (!detectedCampaigns.has(campKey) && !mapRes.rows.some((m: any) => m.campaign_key === campKey)) {
        unmappedSpendTotal += spRow.amount;
      }
    }

    const d = daySeries.get(spRow.tanggal) || { date: spRow.tanggal, spend: 0, deals: 0 };
    d.spend += spRow.amount;
    daySeries.set(spRow.tanggal, d);
  }

  const summary = computePerformanceMetrics({
    spend: totalAdSpend,
    otherCosts: totalOtherCosts,
    leads: totalLeads,
    warmPlus: totalWarmPlus,
    sample: totalSample,
    deal: totalDeal,
    revenue: totalRevenue,
  });

  return json({
    success: true,
    period: { startDate, endDate },
    summary: { ...summary, otherCosts: totalOtherCosts, weeklyBudgetTotal },
    bySource: Array.from(sourceBuckets.entries()).map(([source, b]) => ({
      source,
      ...computePerformanceMetrics(b),
    })),
    byCampaign: Array.from(campaignBuckets.values())
      .map((b) => ({
        source: b.source,
        campaign: b.campaign,
        ...computePerformanceMetrics(b),
      }))
      .sort((a, b) => b.spend - a.spend || b.leads - a.leads),
    unmappedSpendTotal,
    detectedCampaigns: Array.from(detectedCampaigns).sort(),
    spendHistory: resolvedSpend,
    otherCosts: otherRes.rows,
    campaignMaps: mapRes.rows,
    chartSeries: Array.from(daySeries.values()).sort((a, b) => a.date.localeCompare(b.date)),
    integrations: {
      metaAdsConnected: Boolean(process.env.META_ADS_ACCESS_TOKEN && process.env.META_AD_ACCOUNT_ID),
      googleAdsConnected: Boolean(process.env.GOOGLE_ADS_DEVELOPER_TOKEN && process.env.GOOGLE_ADS_CUSTOMER_ID),
    },
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireUser(req, { write: true });
  if (isAuthFailure(auth)) return auth;
  if (!isAdminRole(auth.user.role)) {
    return json({ success: false, error: 'Akses ditolak: hanya Admin' }, 403);
  }

  const body = await req.json().catch(() => null);
  const kind = body?.kind || 'spend';
  const pool = getMonitorPool();

  if (kind === 'other_cost') {
    const bulan = String(body?.bulan || '').trim();
    const kategori = String(body?.kategori || '').trim();
    const amount = parseInt(String(body?.amount || '0'), 10);
    const note = body?.note ? String(body.note).trim() : null;
    if (!/^\d{4}-\d{2}$/.test(bulan) || !kategori || !Number.isInteger(amount) || amount < 0) {
      return json({ success: false, error: 'Bulan (YYYY-MM), kategori, dan jumlah wajib valid' }, 400);
    }
    await pool.query(
      `INSERT INTO other_costs (bulan, kategori, amount, note, created_by) VALUES ($1, $2, $3, $4, $5)`,
      [bulan, kategori, amount, note, auth.user.name]
    );
    return json({ success: true });
  }

  if (kind === 'campaign_map') {
    const source = String(body?.source || '').trim();
    const adName = String(body?.ad_campaign_name || '').trim();
    const campKey = String(body?.campaign_key || '').trim();
    if (!source || !adName || !campKey) {
      return json({ success: false, error: 'Source, nama campaign iklan, dan campaign CRM wajib diisi' }, 400);
    }
    await pool.query(
      `INSERT INTO campaign_map (source, ad_campaign_name, campaign_key, created_by)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (source, ad_campaign_name) DO UPDATE SET campaign_key = EXCLUDED.campaign_key`,
      [source, adName, campKey, auth.user.name]
    );
    return json({ success: true });
  }

  // Input spend (rentang tanggal dibagi rata per hari, atau batch CSV)
  const items: Array<{ tanggal: string; source: string; campaign_key?: string; amount: number; note?: string }> = Array.isArray(body?.items)
    ? body.items
    : [];

  if (items.length === 0 && body?.startDate && body?.endDate && body?.source) {
    const t0 = new Date(`${body.startDate}T00:00:00Z`).getTime();
    const t1 = new Date(`${body.endDate}T00:00:00Z`).getTime();
    const totalAmt = parseInt(String(body.amount || '0'), 10);
    if (!Number.isFinite(t0) || !Number.isFinite(t1) || t1 < t0 || !Number.isInteger(totalAmt) || totalAmt < 0) {
      return json({ success: false, error: 'Rentang tanggal atau nominal biaya tidak valid' }, 400);
    }
    const days = Math.floor((t1 - t0) / 86_400_000) + 1;
    const perDay = Math.floor(totalAmt / days);
    const remainder = totalAmt - perDay * days;

    for (let i = 0; i < days; i++) {
      const dateStr = new Date(t0 + i * 86_400_000).toISOString().slice(0, 10);
      items.push({
        tanggal: dateStr,
        source: String(body.source).trim(),
        campaign_key: body.campaign ? String(body.campaign).trim() : '',
        amount: perDay + (i === days - 1 ? remainder : 0),
        note: body.note ? String(body.note).trim() : undefined,
      });
    }
  }

  if (items.length === 0) {
    return json({ success: false, error: 'Tidak ada data biaya yang valid untuk disimpan' }, 400);
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const it of items) {
      const campKey = (it.campaign_key || '').trim();
      const res = await client.query(
        `INSERT INTO ad_spend (tanggal, source, campaign_key, campaign_name, amount, input_type, note, created_by, updated_at)
         VALUES ($1::date, $2, $3, NULLIF($3, ''), $4, 'manual', $5, $6, NOW())
         ON CONFLICT (tanggal, source, campaign_key, input_type) DO UPDATE SET
           amount = EXCLUDED.amount,
           note = COALESCE(EXCLUDED.note, ad_spend.note),
           updated_at = NOW()
         RETURNING id`,
        [it.tanggal, it.source, campKey, Math.round(it.amount), it.note || null, auth.user.name]
      );
      await client.query(
        `INSERT INTO ad_spend_audit_log (ad_spend_id, action, new_amount, summary, actor)
         VALUES ($1, 'create', $2, $3, $4)`,
        [res.rows[0].id, Math.round(it.amount), `${it.tanggal} · ${it.source} ${campKey}`, auth.user.name]
      );
    }
    await client.query('COMMIT');
    return json({ success: true, count: items.length });
  } catch (e: any) {
    await client.query('ROLLBACK').catch(() => undefined);
    console.error('[crm/performance] POST error:', e?.message);
    return json({ success: false, error: 'Gagal menyimpan biaya iklan' }, 500);
  } finally {
    client.release();
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireUser(req, { write: true });
  if (isAuthFailure(auth)) return auth;
  if (!isAdminRole(auth.user.role)) {
    return json({ success: false, error: 'Akses ditolak: hanya Admin' }, 403);
  }

  const id = parseInt(req.nextUrl.searchParams.get('id') || '0', 10);
  const kind = req.nextUrl.searchParams.get('kind') || 'spend';
  if (!Number.isInteger(id) || id <= 0) {
    return json({ success: false, error: 'ID tidak valid' }, 400);
  }

  const pool = getMonitorPool();
  if (kind === 'other_cost') {
    await pool.query(`DELETE FROM other_costs WHERE id = $1`, [id]);
    return json({ success: true });
  }

  const oldRes = await pool.query(`DELETE FROM ad_spend WHERE id = $1 AND input_type = 'manual' RETURNING amount, source`, [id]);
  if (oldRes.rowCount) {
    await pool.query(
      `INSERT INTO ad_spend_audit_log (ad_spend_id, action, old_amount, summary, actor)
       VALUES ($1, 'delete', $2, $3, $4)`,
      [id, oldRes.rows[0].amount, `Hapus biaya ${oldRes.rows[0].source}`, auth.user.name]
    );
  }
  return json({ success: true });
}
