import { NextRequest } from 'next/server';
import { getMonitorPool, resetMonitorPool } from '@/lib/db';
import { isAuthFailure, json, requireUser } from '@/lib/crm-auth';
import { isAdminRole } from '@/lib/crm-stages';
import { attachCrmState, colExpr, getLeadColumns, GHOST_SQL } from '@/lib/lead-monitor-data';
import { computeBusdevChannelFunnels, mergeForMonitor, type MonitorLead } from '@/lib/lead-monitor-stats';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export const BUDGET_CHANNELS = ['meta_ads', 'google_ads', 'google_organic', 'social_media'] as const;
export type BudgetChannelKey = (typeof BUDGET_CHANNELS)[number];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const wibDateStr = (ms = Date.now()) => new Date(ms + 7 * 3600_000).toISOString().slice(0, 10);
const addDays = (d: string, n: number) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

/**
 * Mengembalikan tanggal hari Senin (awal minggu ISO) dari tanggal YYYY-MM-DD.
 */
function getMondayOf(dateStr: string): string {
  const dt = new Date(`${dateStr}T00:00:00Z`);
  const day = dt.getUTCDay(); // 0=Minggu, 1=Senin, ...
  const diffToMonday = day === 0 ? -6 : 1 - day;
  return addDays(dateStr, diffToMonday);
}

function formatWeekLabel(monday: string, sunday: string): string {
  try {
    const m = new Date(`${monday}T00:00:00Z`).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      timeZone: 'UTC',
    });
    const s = new Date(`${sunday}T00:00:00Z`).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
    return `${m} – ${s}`;
  } catch {
    return `${monday} – ${sunday}`;
  }
}

let tableEnsured = false;
async function ensureBudgetTable() {
  if (tableEnsured) return;
  const pool = getMonitorPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS crm_weekly_budgets (
      week_start  DATE NOT NULL,
      channel     TEXT NOT NULL CHECK (channel IN ('meta_ads', 'google_ads', 'google_organic', 'social_media')),
      budget_idr  BIGINT NOT NULL DEFAULT 0 CHECK (budget_idr >= 0),
      updated_by  TEXT,
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (week_start, channel)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS crm_range_budgets (
      start_date  DATE NOT NULL,
      end_date    DATE NOT NULL,
      channel     TEXT NOT NULL CHECK (channel IN ('meta_ads', 'google_ads', 'google_organic', 'social_media')),
      budget_idr  BIGINT NOT NULL DEFAULT 0 CHECK (budget_idr >= 0),
      updated_by  TEXT,
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (start_date, end_date, channel)
    )
  `);
  tableEnsured = true;
}

export interface ChannelCostMetrics {
  channel: BudgetChannelKey | 'total';
  budget: number;
  traffic: number;
  cold: number;
  warm: number;
  hot: number;
  /** Qualified Leads = Warm + Hot */
  qualified: number;
  sample: number;
  /** Cost per Traffic = Budget / Traffic */
  costPerTraffic: number | null;
  /** Cost per Qualified Lead = Budget / (Warm + Hot) */
  costPerQualified: number | null;
  /** Cost per Sample = Budget / Sample */
  costPerSample: number | null;
}

export interface WeeklyChannelPerformance {
  weekStart: string;
  weekEnd: string;
  label: string;
  channels: Record<BudgetChannelKey, ChannelCostMetrics>;
  total: ChannelCostMetrics;
}

function buildCostMetrics(
  channel: BudgetChannelKey | 'total',
  budget: number,
  funnel: { traffic: number; cold: number; warm: number; hot: number; sample: number }
): ChannelCostMetrics {
  const traffic = funnel.traffic || 0;
  const cold = funnel.cold || 0;
  const warm = funnel.warm || 0;
  const hot = funnel.hot || 0;
  const qualified = warm + hot;
  const sample = funnel.sample || 0;

  return {
    channel,
    budget,
    traffic,
    cold,
    warm,
    hot,
    qualified,
    sample,
    costPerTraffic: budget > 0 && traffic > 0 ? Math.round(budget / traffic) : null,
    costPerQualified: budget > 0 && qualified > 0 ? Math.round(budget / qualified) : null,
    costPerSample: budget > 0 && sample > 0 ? Math.round(budget / sample) : null,
  };
}

/**
 * GET /api/crm/budgets?weeks=8&busdev=all
 * Mengembalikan performa mingguan (Senin-Minggu) per channel:
 *  - Budget (Rp)
 *  - Traffic & Cost per Traffic (Budget / Traffic)
 *  - Qualified Leads (Warm + Hot) & Cost per Qualified Lead (Budget / (Warm + Hot))
 *  - Sample & Cost per Sample (Budget / Sample)
 */
export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;
  const isAdmin = isAdminRole(user.role);

  if (!isAdmin) {
    return json({ success: false, error: 'Akses laporan performa budget hanya untuk Head & Admin' }, 403);
  }

  const sp = new URL(req.url).searchParams;
  const weeksCount = Math.min(16, Math.max(4, parseInt(sp.get('weeks') || '8', 10) || 8));
  const requestedBusdev = (sp.get('busdev') || 'all').trim();
  const effectiveBusdev = requestedBusdev;
  const rawCustomStart = (sp.get('startDate') || '').trim();
  const rawCustomEnd = (sp.get('endDate') || '').trim();
  const hasCustomRange = DATE_RE.test(rawCustomStart) && DATE_RE.test(rawCustomEnd) && rawCustomStart <= rawCustomEnd;

  try {
    await ensureBudgetTable();
    const pool = getMonitorPool();

    const todayWib = wibDateStr();
    const currentMonday = getMondayOf(todayWib);

    // Susun daftar minggu dari terbaru ke terlama
    const weekRanges: Array<{ weekStart: string; weekEnd: string; label: string }> = [];
    for (let i = 0; i < weeksCount; i++) {
      const ws = addDays(currentMonday, -i * 7);
      const we = addDays(ws, 6);
      weekRanges.push({
        weekStart: ws,
        weekEnd: we,
        label: i === 0 ? `Minggu Ini (${formatWeekLabel(ws, we)})` : i === 1 ? `Minggu Lalu (${formatWeekLabel(ws, we)})` : formatWeekLabel(ws, we),
      });
    }

    const earliestWeekDate = weekRanges[weekRanges.length - 1].weekStart;
    const latestWeekDate = weekRanges[0].weekEnd;
    const earliestDate = hasCustomRange && rawCustomStart < earliestWeekDate ? rawCustomStart : earliestWeekDate;
    const latestDate = hasCustomRange && rawCustomEnd > latestWeekDate ? rawCustomEnd : latestWeekDate;

    const cols = await getLeadColumns(pool);
    const formExpr = cols.has('inquiry_reference')
      ? `(inquiry_reference IS NOT NULL OR intent LIKE '[QUALIFIED]%')`
      : `(intent LIKE '[QUALIFIED]%')`;
    const ownerFilterSql = isAdmin ? '' : `AND lower(COALESCE(assigned_to, '')) = lower($3)`;
    const sqlParams = isAdmin ? [earliestDate, latestDate] : [earliestDate, latestDate, user.name];

    const [leadsRes, bdsRes, budgetsRes, rangeBudgetsRes] = await Promise.all([
      pool.query(
        `SELECT id, tracking_code, assigned_to, source, left(page_url, 200) AS page_url, left(referrer, 300) AS referrer, status,
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
          LIMIT 15000`,
        sqlParams
      ),
      pool.query(`SELECT name FROM busdevs WHERE is_active = TRUE ORDER BY id ASC`),
      pool.query(
        `SELECT to_char(week_start, 'YYYY-MM-DD') AS week_start, channel, budget_idr
           FROM crm_weekly_budgets
          WHERE week_start >= $1::date AND week_start <= $2::date`,
        [earliestDate, latestDate]
      ),
      hasCustomRange
        ? pool.query(
            `SELECT channel, budget_idr
               FROM crm_range_budgets
              WHERE start_date = $1::date AND end_date = $2::date`,
            [rawCustomStart, rawCustomEnd]
          )
        : Promise.resolve({ rows: [] }),
    ]);

    const busdevNames = bdsRes.rows.map((r: any) => r.name as string);
    const rawLeads = leadsRes.rows.map((r: any) => ({ ...r, display_phone: r.wa_phone || r.hp || null })) as MonitorLead[];
    let merged = mergeForMonitor(rawLeads) as any[];
    await attachCrmState(pool, merged);

    if (effectiveBusdev.toLowerCase() !== 'all') {
      merged = merged.filter((l) => (l.assigned_to || '').toLowerCase() === effectiveBusdev.toLowerCase());
    }

    // Petakan budget dari DB
    const budgetMap = new Map<string, Record<BudgetChannelKey, number>>();
    for (const r of budgetsRes.rows) {
      const ws = String(r.week_start);
      const ch = r.channel as BudgetChannelKey;
      if (!budgetMap.has(ws)) {
        budgetMap.set(ws, { meta_ads: 0, google_ads: 0, google_organic: 0, social_media: 0 });
      }
      if (BUDGET_CHANNELS.includes(ch)) {
        budgetMap.get(ws)![ch] = Number(r.budget_idr || 0);
      }
    }

    // Kelompokkan lead per minggu (berdasarkan created_at dalam WIB)
    const leadsByWeek = new Map<string, any[]>();
    for (const w of weekRanges) leadsByWeek.set(w.weekStart, []);

    for (const l of merged) {
      const createdWib = wibDateStr(new Date(l.created_at).getTime());
      const monday = getMondayOf(createdWib);
      if (leadsByWeek.has(monday)) {
        leadsByWeek.get(monday)!.push(l);
      }
    }

    const weeks: WeeklyChannelPerformance[] = weekRanges.map((w) => {
      const weekLeads = leadsByWeek.get(w.weekStart) ?? [];
      const funnel = computeBusdevChannelFunnels(weekLeads, busdevNames);
      const b = budgetMap.get(w.weekStart) ?? { meta_ads: 0, google_ads: 0, google_organic: 0, social_media: 0 };

      const chMetrics: Record<BudgetChannelKey, ChannelCostMetrics> = {
        meta_ads: buildCostMetrics('meta_ads', b.meta_ads, funnel.summary.meta_ads),
        google_ads: buildCostMetrics('google_ads', b.google_ads, funnel.summary.google_ads),
        google_organic: buildCostMetrics('google_organic', b.google_organic, funnel.summary.google_organic),
        social_media: buildCostMetrics('social_media', b.social_media, funnel.summary.social_media),
      };

      const totalBudget = b.meta_ads + b.google_ads + b.google_organic + b.social_media;
      const totalFunnel = {
        traffic: BUDGET_CHANNELS.reduce((acc, k) => acc + chMetrics[k].traffic, 0),
        cold: BUDGET_CHANNELS.reduce((acc, k) => acc + chMetrics[k].cold, 0),
        warm: BUDGET_CHANNELS.reduce((acc, k) => acc + chMetrics[k].warm, 0),
        hot: BUDGET_CHANNELS.reduce((acc, k) => acc + chMetrics[k].hot, 0),
        sample: BUDGET_CHANNELS.reduce((acc, k) => acc + chMetrics[k].sample, 0),
      };

      return {
        weekStart: w.weekStart,
        weekEnd: w.weekEnd,
        label: w.label,
        channels: chMetrics,
        total: buildCostMetrics('total', totalBudget, totalFunnel),
      };
    });

    let customRange: WeeklyChannelPerformance | null = null;
    if (hasCustomRange) {
      const customLeads = merged.filter((l) => {
        const createdWib = wibDateStr(new Date(l.created_at).getTime());
        return createdWib >= rawCustomStart && createdWib <= rawCustomEnd;
      });
      const customFunnel = computeBusdevChannelFunnels(customLeads, busdevNames);
      const cb: Record<BudgetChannelKey, number> = {
        meta_ads: 0,
        google_ads: 0,
        google_organic: 0,
        social_media: 0,
      };
      for (const r of rangeBudgetsRes.rows) {
        const ch = r.channel as BudgetChannelKey;
        if (BUDGET_CHANNELS.includes(ch)) cb[ch] = Number(r.budget_idr || 0);
      }
      const chMetrics: Record<BudgetChannelKey, ChannelCostMetrics> = {
        meta_ads: buildCostMetrics('meta_ads', cb.meta_ads, customFunnel.summary.meta_ads),
        google_ads: buildCostMetrics('google_ads', cb.google_ads, customFunnel.summary.google_ads),
        google_organic: buildCostMetrics('google_organic', cb.google_organic, customFunnel.summary.google_organic),
        social_media: buildCostMetrics('social_media', cb.social_media, customFunnel.summary.social_media),
      };
      const totalBudget = cb.meta_ads + cb.google_ads + cb.google_organic + cb.social_media;
      const totalFunnel = {
        traffic: BUDGET_CHANNELS.reduce((acc, k) => acc + chMetrics[k].traffic, 0),
        cold: BUDGET_CHANNELS.reduce((acc, k) => acc + chMetrics[k].cold, 0),
        warm: BUDGET_CHANNELS.reduce((acc, k) => acc + chMetrics[k].warm, 0),
        hot: BUDGET_CHANNELS.reduce((acc, k) => acc + chMetrics[k].hot, 0),
        sample: BUDGET_CHANNELS.reduce((acc, k) => acc + chMetrics[k].sample, 0),
      };
      customRange = {
        weekStart: rawCustomStart,
        weekEnd: rawCustomEnd,
        label: `Custom Range (${formatWeekLabel(rawCustomStart, rawCustomEnd)})`,
        channels: chMetrics,
        total: buildCostMetrics('total', totalBudget, totalFunnel),
      };
    }

    return json({
      success: true,
      currentWeekStart: currentMonday,
      weeks,
      customRange,
    });
  } catch (e: any) {
    console.error('[crm/budgets] GET error:', e?.message);
    resetMonitorPool();
    return json({ success: false, error: 'Gagal memuat data budget mingguan' }, 500);
  }
}

/**
 * PUT /api/crm/budgets
 * Body: { weekStart?: 'YYYY-MM-DD', startDate?: 'YYYY-MM-DD', endDate?: 'YYYY-MM-DD', budgets: { ... } }
 */
export async function PUT(req: NextRequest) {
  const auth = await requireUser(req, { write: true });
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;

  if (!isAdminRole(user.role)) {
    return json({ success: false, error: 'Hanya Head dan Admin yang dapat mengubah budget mingguan' }, 403);
  }

  const body = await req.json().catch(() => null);
  const rawStart = typeof body?.startDate === 'string' ? body.startDate.trim() : '';
  const rawEnd = typeof body?.endDate === 'string' ? body.endDate.trim() : '';
  const isCustomRange = DATE_RE.test(rawStart) && DATE_RE.test(rawEnd) && rawStart <= rawEnd;

  const rawWeek = typeof body?.weekStart === 'string' ? body.weekStart.trim() : '';
  if (!isCustomRange && !DATE_RE.test(rawWeek)) {
    return json({ success: false, error: 'Format tanggal minggu atau rentang tanggal tidak valid' }, 400);
  }
  const weekStart = isCustomRange ? rawStart : getMondayOf(rawWeek);
  const budgetsIn = body?.budgets;
  if (!budgetsIn || typeof budgetsIn !== 'object') {
    return json({ success: false, error: 'Data budgets wajib diisi' }, 400);
  }

  try {
    await ensureBudgetTable();
    const pool = getMonitorPool();

    for (const ch of BUDGET_CHANNELS) {
      if (Object.prototype.hasOwnProperty.call(budgetsIn, ch)) {
        const rawVal = budgetsIn[ch];
        const cleanNum =
          typeof rawVal === 'number'
            ? Math.max(0, Math.round(rawVal))
            : Math.max(0, parseInt(String(rawVal || '0').replace(/[^\d]/g, ''), 10) || 0);

        if (isCustomRange) {
          await pool.query(
            `INSERT INTO crm_range_budgets (start_date, end_date, channel, budget_idr, updated_by, updated_at)
             VALUES ($1::date, $2::date, $3, $4, $5, NOW())
             ON CONFLICT (start_date, end_date, channel) DO UPDATE SET
               budget_idr = EXCLUDED.budget_idr,
               updated_by = EXCLUDED.updated_by,
               updated_at = NOW()`,
            [rawStart, rawEnd, ch, cleanNum, user.name]
          );
        } else {
          await pool.query(
            `INSERT INTO crm_weekly_budgets (week_start, channel, budget_idr, updated_by, updated_at)
             VALUES ($1::date, $2, $3, $4, NOW())
             ON CONFLICT (week_start, channel) DO UPDATE SET
               budget_idr = EXCLUDED.budget_idr,
               updated_by = EXCLUDED.updated_by,
               updated_at = NOW()`,
            [weekStart, ch, cleanNum, user.name]
          );
        }
      }
    }

    return json({ success: true, weekStart, isCustomRange });
  } catch (e: any) {
    console.error('[crm/budgets] PUT error:', e?.message);
    return json({ success: false, error: 'Gagal menyimpan budget' }, 500);
  }
}

