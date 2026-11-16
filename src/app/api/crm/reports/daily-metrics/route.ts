import { NextRequest } from "next/server";
import { getMonitorPool } from "@/lib/db";
import { isAuthFailure, json, requireUser } from "@/lib/crm-auth";
import { isAdminRole } from "@/lib/crm-stages";
import { detectAdChannel, type AdChannel } from "@/lib/lead-monitor-stats";
import {
  ensureDailyMetricsTable,
  type DailyBusdevCounts,
  type DailyBusdevEntry,
  type DailyMetricRow,
  type SourceOverviewRow,
} from "@/lib/crm-daily-metrics";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CHANNEL_LABELS: Record<AdChannel, string> = {
  meta_ads: "Meta Ads",
  google_ads: "Google Ads",
  google_organic: "Google Organik (SEO)",
  social_media: "Media Sosial (IG / TikTok)",
  other: "Lainnya / Direct",
};

function getDatesInRange(start: string, end: string): string[] {
  const res: string[] = [];
  let cur = Date.parse(`${start}T00:00:00Z`);
  const last = Date.parse(`${end}T00:00:00Z`);
  let guard = 0;
  while (cur <= last && guard < 62) {
    res.push(new Date(cur).toISOString().slice(0, 10));
    cur += 86_400_000;
    guard++;
  }
  return res;
}

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;
  const isAdmin = isAdminRole(user.role);

  const sp = req.nextUrl.searchParams;
  const nowWib = new Date(Date.now() + 7 * 3600_000);
  const currentMonthStr = nowWib.toISOString().slice(0, 7);
  const monthParam = sp.get("month") || currentMonthStr;
  const customStart = sp.get("startDate");
  const customEnd = sp.get("endDate");

  let startDate: string;
  let endDate: string;

  if (customStart && customEnd && /^\d{4}-\d{2}-\d{2}$/.test(customStart) && /^\d{4}-\d{2}-\d{2}$/.test(customEnd)) {
    startDate = customStart;
    endDate = customEnd;
  } else {
    const [yrStr, moStr] = monthParam.split("-");
    const year = parseInt(yrStr, 10) || nowWib.getUTCFullYear();
    const month = parseInt(moStr, 10) || nowWib.getUTCMonth() + 1;
    const validMonth = Math.max(1, Math.min(12, month));
    const lastDay = new Date(Date.UTC(year, validMonth, 0)).getUTCDate();
    const moPad = String(validMonth).padStart(2, "0");
    startDate = `${year}-${moPad}-01`;
    endDate = `${year}-${moPad}-${String(lastDay).padStart(2, "0")}`;
  }

  try {
    await ensureDailyMetricsTable();
    const pool = getMonitorPool();

    const bdRes = await pool.query(`SELECT name FROM busdevs WHERE is_active = TRUE ORDER BY id ASC`);
    const allBusdevs: string[] = bdRes.rows.map((r: any) => r.name);
    const targetBusdevs = isAdmin
      ? allBusdevs
      : allBusdevs.filter((n) => n.toLowerCase() === user.name.toLowerCase());

    const [leadsRes, manualRes] = await Promise.all([
      pool.query(
        `
        SELECT
          COALESCE(l.assigned_to, 'Unassigned') AS assigned_to,
          l.source,
          l.referrer,
          l.page_url,
          l.requested_quantity_pcs,
          l.production_tier_name,
          l.tier,
          to_char(l.created_at AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD') AS lead_date,
          cls.stage AS crm_stage
        FROM leads l
        LEFT JOIN crm_lead_state cls ON cls.tracking_code = l.tracking_code
        WHERE l.is_test IS NOT TRUE
          AND l.created_at >= (($1::date)::timestamp AT TIME ZONE 'Asia/Jakarta')
          AND l.created_at <  ((($2::date + 1))::timestamp AT TIME ZONE 'Asia/Jakarta')
        `,
        [startDate, endDate]
      ),
      pool.query(
        `
        SELECT
          to_char(metric_date, 'YYYY-MM-DD') AS metric_date,
          busdev_name,
          traffic,
          cold,
          warm,
          hot,
          sample,
          updated_by,
          updated_at
        FROM crm_daily_busdev_metrics
        WHERE metric_date >= $1::date AND metric_date <= $2::date
        `,
        [startDate, endDate]
      ),
    ]);

    const dates = getDatesInRange(startDate, endDate);
    const autoMap: Record<string, Record<string, DailyBusdevCounts>> = {};
    for (const d of dates) {
      autoMap[d] = {};
      for (const b of targetBusdevs) {
        autoMap[d][b] = { traffic: 0, cold: 0, warm: 0, hot: 0, sample: 0 };
      }
    }

    const sourceAgg: Record<AdChannel, { traffic: number; prospecting: number; sample: number }> = {
      meta_ads: { traffic: 0, prospecting: 0, sample: 0 },
      google_ads: { traffic: 0, prospecting: 0, sample: 0 },
      google_organic: { traffic: 0, prospecting: 0, sample: 0 },
      social_media: { traffic: 0, prospecting: 0, sample: 0 },
      other: { traffic: 0, prospecting: 0, sample: 0 },
    };

    for (const l of leadsRes.rows) {
      const d = l.lead_date as string;
      const assigned = targetBusdevs.find(
        (n) => n.toLowerCase() === String(l.assigned_to || "").trim().toLowerCase()
      );
      const ch = detectAdChannel(l);

      const moq = Number(l.requested_quantity_pcs) || 0;
      const tierName = String(l.production_tier_name || "").toLowerCase();
      const tier = String(l.tier || "").toLowerCase();
      const rawStage = String(l.crm_stage || "").toLowerCase();

      const isSample = rawStage === "sample" || rawStage === "deal";
      const isHot = rawStage === "hot";
      const isWarm =
        rawStage === "warm" ||
        rawStage.startsWith("warm_") ||
        (!rawStage &&
          (moq >= 500 ||
            tierName === "scale_up" ||
            tierName === "enterprise" ||
            tier === "tier_2" ||
            tier === "tier_3"));
      const isQualified = isWarm || isHot || isSample;

      if (isAdmin || assigned) {
        sourceAgg[ch].traffic++;
        if (isQualified) sourceAgg[ch].prospecting++;
        if (isSample) sourceAgg[ch].sample++;
      }

      if (assigned && autoMap[d]?.[assigned]) {
        autoMap[d][assigned].traffic++;
        if (isSample) {
          autoMap[d][assigned].sample++;
        } else if (isHot) {
          autoMap[d][assigned].hot++;
        } else if (isWarm) {
          autoMap[d][assigned].warm++;
        } else {
          autoMap[d][assigned].cold++;
        }
      }
    }

    const manualMap: Record<string, Record<string, DailyBusdevCounts & { updatedBy: string | null; updatedAt: string }>> = {};
    for (const row of manualRes.rows) {
      const d = row.metric_date as string;
      const b = targetBusdevs.find((n) => n.toLowerCase() === String(row.busdev_name || "").toLowerCase());
      if (!b) continue;
      if (!manualMap[d]) manualMap[d] = {};
      manualMap[d][b] = {
        traffic: Number(row.traffic) || 0,
        cold: Number(row.cold) || 0,
        warm: Number(row.warm) || 0,
        hot: Number(row.hot) || 0,
        sample: Number(row.sample) || 0,
        updatedBy: row.updated_by || null,
        updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : "",
      };
    }

    const days: DailyMetricRow[] = dates.map((d) => {
      const byBusdev: Record<string, DailyBusdevEntry> = {};
      for (const b of targetBusdevs) {
        const auto = autoMap[d]?.[b] ?? { traffic: 0, cold: 0, warm: 0, hot: 0, sample: 0 };
        const manual = manualMap[d]?.[b] ?? null;
        byBusdev[b] = {
          auto,
          manual,
          effective: manual
            ? {
                traffic: manual.traffic,
                cold: manual.cold,
                warm: manual.warm,
                hot: manual.hot,
                sample: manual.sample,
              }
            : auto,
        };
      }
      return { date: d, byBusdev };
    });

    // Source breakdown untuk rekomendasi scale-up budget
    const channelsOrder: AdChannel[] = ["meta_ads", "google_ads", "google_organic", "social_media", "other"];
    let maxProspecting = 0;
    for (const ch of channelsOrder) {
      if (sourceAgg[ch].prospecting > maxProspecting) maxProspecting = sourceAgg[ch].prospecting;
    }
    const sourceOverview: SourceOverviewRow[] = channelsOrder.map((ch) => {
      const agg = sourceAgg[ch];
      const prospectingPct = agg.traffic > 0 ? Math.round((agg.prospecting / agg.traffic) * 100) : 0;
      const samplePct = agg.prospecting > 0 ? Math.round((agg.sample / agg.prospecting) * 100) : 0;
      return {
        channel: ch,
        label: CHANNEL_LABELS[ch],
        traffic: agg.traffic,
        prospecting: agg.prospecting,
        prospectingPct,
        sample: agg.sample,
        samplePct,
        isTopScaleUp: maxProspecting > 0 && agg.prospecting === maxProspecting,
      };
    });

    return json({
      success: true,
      startDate,
      endDate,
      busdevNames: targetBusdevs,
      days,
      sourceOverview,
    });
  } catch (err: any) {
    console.error("[daily-metrics] GET error:", err?.message);
    return json({ success: false, error: "Gagal memuat data harian metrics" }, 500);
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireUser(req, { write: true });
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;
  const isAdmin = isAdminRole(user.role);

  if (!isAdmin) {
    return json({ success: false, error: "Hanya Head dan Admin yang dapat mengisi input harian manual" }, 403);
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return json({ success: false, error: "Payload tidak valid" }, 400);
  }

  try {
    await ensureDailyMetricsTable();
    const pool = getMonitorPool();

    if (body.action === "reset") {
      const dateStr = typeof body.date === "string" ? body.date.trim() : "";
      const busdev = typeof body.busdev === "string" ? body.busdev.trim() : "";
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr) || !busdev) {
        return json({ success: false, error: "Parameter reset tidak valid" }, 400);
      }
      if (!isAdmin && busdev.toLowerCase() !== user.name.toLowerCase()) {
        return json({ success: false, error: "Anda hanya bisa mereset data milik Anda sendiri" }, 403);
      }
      await pool.query(
        `DELETE FROM crm_daily_busdev_metrics WHERE metric_date = $1::date AND lower(busdev_name) = lower($2)`,
        [dateStr, busdev]
      );
      return json({ success: true, reset: true });
    }

    const entries = Array.isArray(body.entries) ? body.entries : [body];
    if (entries.length === 0 || entries.length > 200) {
      return json({ success: false, error: "Jumlah entri tidak valid (1..200)" }, 400);
    }

    if (!isAdmin) {
      const unauthorized = entries.some(
        (e: any) => String(e?.busdev || "").trim().toLowerCase() !== user.name.toLowerCase()
      );
      if (unauthorized) {
        return json({ success: false, error: "Anda hanya bisa mengubah data harian milik Anda sendiri" }, 403);
      }
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const e of entries) {
        const d = typeof e?.date === "string" ? e.date.trim() : "";
        const busdev = typeof e?.busdev === "string" ? e.busdev.trim() : "";
        if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || !busdev) continue;

        const cleanInt = (v: unknown) => {
          const n = typeof v === "number" ? v : parseInt(String(v || "0"), 10);
          return Number.isFinite(n) && n >= 0 ? Math.min(100_000, Math.round(n)) : 0;
        };

        await client.query(
          `
          INSERT INTO crm_daily_busdev_metrics
            (metric_date, busdev_name, traffic, cold, warm, hot, sample, updated_by, updated_at)
          VALUES
            ($1::date, $2, $3, $4, $5, $6, $7, $8, NOW())
          ON CONFLICT (metric_date, busdev_name)
          DO UPDATE SET
            traffic    = EXCLUDED.traffic,
            cold       = EXCLUDED.cold,
            warm       = EXCLUDED.warm,
            hot        = EXCLUDED.hot,
            sample     = EXCLUDED.sample,
            updated_by = EXCLUDED.updated_by,
            updated_at = NOW()
          `,
          [
            d,
            busdev,
            cleanInt(e.traffic),
            cleanInt(e.cold),
            cleanInt(e.warm),
            cleanInt(e.hot),
            cleanInt(e.sample),
            user.name,
          ]
        );
      }
      await client.query("COMMIT");
    } catch (txErr) {
      await client.query("ROLLBACK").catch(() => undefined);
      throw txErr;
    } finally {
      client.release();
    }

    return json({ success: true, saved: entries.length });
  } catch (err: any) {
    console.error("[daily-metrics] PUT error:", err?.message);
    return json({ success: false, error: "Gagal menyimpan data harian manual" }, 500);
  }
}
