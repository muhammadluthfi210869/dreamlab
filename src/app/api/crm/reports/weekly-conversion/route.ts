import { NextRequest } from "next/server";
import { getMonitorPool } from "@/lib/db";
import { isAuthFailure, json, requireUser } from "@/lib/crm-auth";
import { isAdminRole } from "@/lib/crm-stages";
import { detectAdChannel, type AdChannel } from "@/lib/lead-monitor-stats";
import { ensureDailyMetricsTable, type SourceOverviewRow } from "@/lib/crm-daily-metrics";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export interface ConversionMetrics {
  traffic: number;
  prospecting: number;
  sample: number;
  prospectingTarget: number;
  prospectingPct: number;
  sampleTarget: number;
  samplePct: number;
}

export interface WeekSlice {
  key: string; // 'w1', 'w2', 'w3', 'w4', 'w5'
  label: string; // 'Week 1', 'Week 2'
  dateRange: string; // '01 Nov – 07 Nov'
  startDate: string;
  endDate: string;
}

function calcConversionMetrics(
  traffic: number,
  prospecting: number,
  sample: number,
  prospectingTargetPct = 40,
  sampleTargetPct = 30
): ConversionMetrics {
  const prospectingTarget = Math.round(traffic * (prospectingTargetPct / 100));
  const prospectingPct = traffic > 0 ? Math.round((prospecting / traffic) * 100) : 0;
  const sampleTarget = Math.round(prospectingTarget * (sampleTargetPct / 100));
  const samplePct = prospecting > 0 ? Math.round((sample / prospecting) * 100) : 0;

  return {
    traffic,
    prospecting,
    sample,
    prospectingTarget,
    prospectingPct,
    sampleTarget,
    samplePct,
  };
}

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;
  const isAdmin = isAdminRole(user.role);

  const sp = req.nextUrl.searchParams;
  const nowWib = new Date(Date.now() + 7 * 3600_000);
  const currentMonthStr = nowWib.toISOString().slice(0, 7); // '2026-11'

  const monthParam = sp.get("month") || currentMonthStr; // 'YYYY-MM'
  const customStart = sp.get("startDate");
  const customEnd = sp.get("endDate");

  let startDate: string;
  let endDate: string;
  let weekSlices: WeekSlice[] = [];
  let periodTitle: string;

  if (customStart && customEnd && /^\d{4}-\d{2}-\d{2}$/.test(customStart) && /^\d{4}-\d{2}-\d{2}$/.test(customEnd)) {
    startDate = customStart;
    endDate = customEnd;
    periodTitle = `${customStart} s/d ${customEnd}`;

    // Split custom date range into 4 weeks/quarters
    const tStart = new Date(`${startDate}T00:00:00Z`).getTime();
    const tEnd = new Date(`${endDate}T23:59:59Z`).getTime();
    const totalDays = Math.max(1, Math.round((tEnd - tStart) / 86_400_000));
    const step = Math.max(1, Math.floor(totalDays / 4));

    weekSlices = [
      {
        key: "w1",
        label: "Week 1",
        dateRange: `Hari 1–${step}`,
        startDate: new Date(tStart).toISOString().slice(0, 10),
        endDate: new Date(tStart + (step - 1) * 86_400_000).toISOString().slice(0, 10),
      },
      {
        key: "w2",
        label: "Week 2",
        dateRange: `Hari ${step + 1}–${step * 2}`,
        startDate: new Date(tStart + step * 86_400_000).toISOString().slice(0, 10),
        endDate: new Date(tStart + (step * 2 - 1) * 86_400_000).toISOString().slice(0, 10),
      },
      {
        key: "w3",
        label: "Week 3",
        dateRange: `Hari ${step * 2 + 1}–${step * 3}`,
        startDate: new Date(tStart + step * 2 * 86_400_000).toISOString().slice(0, 10),
        endDate: new Date(tStart + (step * 3 - 1) * 86_400_000).toISOString().slice(0, 10),
      },
      {
        key: "w4",
        label: "Week 4",
        dateRange: `Hari ${step * 3 + 1}–akhir`,
        startDate: new Date(tStart + step * 3 * 86_400_000).toISOString().slice(0, 10),
        endDate: endDate,
      },
    ];
  } else {
    // Standard Month Slicing (Week 1: 01-07, Week 2: 08-14, Week 3: 15-21, Week 4: 22-28, Week 5: 29-end)
    const [year, month] = monthParam.split("-").map(Number);
    const validYear = year >= 2026 && year <= 2030 ? year : 2026;
    const validMonth = month >= 1 && month <= 12 ? month : 11;
    const monthPad = String(validMonth).padStart(2, "0");

    startDate = `${validYear}-${monthPad}-01`;
    const lastDayOfMonth = new Date(validYear, validMonth, 0).getDate();
    endDate = `${validYear}-${monthPad}-${String(lastDayOfMonth).padStart(2, "0")}`;

    const monthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    periodTitle = `${monthNames[validMonth - 1]} ${validYear}`;

    weekSlices = [
      {
        key: "w1",
        label: "Week 1",
        dateRange: `01–07 ${monthNames[validMonth - 1].slice(0, 3)}`,
        startDate: `${validYear}-${monthPad}-01`,
        endDate: `${validYear}-${monthPad}-07`,
      },
      {
        key: "w2",
        label: "Week 2",
        dateRange: `08–14 ${monthNames[validMonth - 1].slice(0, 3)}`,
        startDate: `${validYear}-${monthPad}-08`,
        endDate: `${validYear}-${monthPad}-14`,
      },
      {
        key: "w3",
        label: "Week 3",
        dateRange: `15–21 ${monthNames[validMonth - 1].slice(0, 3)}`,
        startDate: `${validYear}-${monthPad}-15`,
        endDate: `${validYear}-${monthPad}-21`,
      },
      {
        key: "w4",
        label: "Week 4",
        dateRange: `22–28 ${monthNames[validMonth - 1].slice(0, 3)}`,
        startDate: `${validYear}-${monthPad}-22`,
        endDate: `${validYear}-${monthPad}-28`,
      },
    ];

    if (lastDayOfMonth > 28) {
      weekSlices.push({
        key: "w5",
        label: "Week 5",
        dateRange: `29–${lastDayOfMonth} ${monthNames[validMonth - 1].slice(0, 3)}`,
        startDate: `${validYear}-${monthPad}-29`,
        endDate: `${validYear}-${monthPad}-${String(lastDayOfMonth).padStart(2, "0")}`,
      });
    }
  }

  const pool = getMonitorPool();
  try {
    await ensureDailyMetricsTable();

    // Ambil daftar sales aktif
    const bdRes = await pool.query(
      `SELECT name FROM busdevs WHERE is_active = TRUE ORDER BY id ASC`
    );
    const busdevNames: string[] = bdRes.rows.map((r: any) => r.name);

    // Ambil semua leads & input manual harian secara paralel
    const [leadsRes, manualRes] = await Promise.all([
      pool.query(
        `
        SELECT
          l.id,
          COALESCE(l.assigned_to, 'Unassigned') AS assigned_to,
          l.source,
          l.referrer,
          l.page_url,
          l.status,
          l.confirmed_at,
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
        ORDER BY l.created_at ASC
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
          sample
        FROM crm_daily_busdev_metrics
        WHERE metric_date >= $1::date AND metric_date <= $2::date
        `,
        [startDate, endDate]
      ),
    ]);

    const weekKeys = weekSlices.map((w) => w.key);
    const channelList: AdChannel[] = ["meta_ads", "google_ads", "google_organic", "social_media", "other"];

    type RawBlock = { traffic: number; prospecting: number; sample: number };
    const createEmptyBlock = (): RawBlock => ({ traffic: 0, prospecting: 0, sample: 0 });

    type WeekMap = Record<string, RawBlock>; // 'w1'...'w5', 'total'
    const createWeekMap = (): WeekMap => {
      const map: WeekMap = {};
      for (const k of [...weekKeys, "total"]) {
        map[k] = createEmptyBlock();
      }
      return map;
    };

    // Struktur penyimpanan: [sales/blended][channel/all][weekKey] -> { traffic, prospecting, sample }
    const store: Record<string, Record<string, WeekMap>> = {
      blended: { all: createWeekMap() },
    };

    for (const ch of channelList) {
      store.blended[ch] = createWeekMap();
    }

    for (const name of busdevNames) {
      store[name] = { all: createWeekMap() };
      for (const ch of channelList) {
        store[name][ch] = createWeekMap();
      }
    }

    // Pemetaan tanggal lead ke week slice
    const findWeekKey = (dateStr: string): string => {
      for (const w of weekSlices) {
        if (dateStr >= w.startDate && dateStr <= w.endDate) {
          return w.key;
        }
      }
      return weekKeys[weekKeys.length - 1]; // fallback ke minggu terakhir
    };

    // Hitung auto per (date, busdev) agar bisa di-override oleh input manual harian jika ada
    const autoDaily: Record<string, Record<string, RawBlock>> = {};
    const unassignedDaily: Record<string, RawBlock> = {};

    const sourceAgg: Record<AdChannel, RawBlock> = {
      meta_ads: createEmptyBlock(),
      google_ads: createEmptyBlock(),
      google_organic: createEmptyBlock(),
      social_media: createEmptyBlock(),
      other: createEmptyBlock(),
    };

    const otherSubAgg: Record<string, Record<string, number>> = { blended: {} };
    for (const name of busdevNames) otherSubAgg[name] = {};

    const classifyOtherLabel = (l: any): string => {
      const s = `${l.source || ""} ${l.referrer || ""} ${l.page_url || ""}`.toLowerCase();
      if (s.includes("tiktok")) return "TikTok";
      if (s.includes("instagram") || s.includes("ig") || s.includes("medsos")) return "Instagram / Medsos";
      if (s.includes("linktree") || s.includes("link_tree")) return "Linktree";
      if (s.includes("wa-direct") || s.includes("whatsapp")) return "WA Langsung";
      if (s.includes("referral")) return "Referral";
      return "Direct / Web";
    };

    for (const l of leadsRes.rows) {
      const d = l.lead_date as string;
      const wk = findWeekKey(d);
      const ch = detectAdChannel(l);
      const assigned = busdevNames.find(
        (n) => n.toLowerCase() === (l.assigned_to || "").trim().toLowerCase()
      );

      if (ch === "social_media" || ch === "other") {
        const subLbl = classifyOtherLabel(l);
        otherSubAgg.blended[subLbl] = (otherSubAgg.blended[subLbl] || 0) + 1;
        if (assigned && otherSubAgg[assigned]) {
          otherSubAgg[assigned][subLbl] = (otherSubAgg[assigned][subLbl] || 0) + 1;
        }
      }

      const moq = Number(l.requested_quantity_pcs) || 0;
      const tierName = String(l.production_tier_name || "").toLowerCase();
      const tier = String(l.tier || "").toLowerCase();
      const rawStage = String(l.crm_stage || "").toLowerCase();

      // Qualified Prospecting = Warm + Hot (MOQ >= 500 atau tier bisnis)
      const isQualified =
        moq >= 500 ||
        tierName === "scale_up" ||
        tierName === "enterprise" ||
        tier === "tier_2" ||
        tier === "tier_3" ||
        rawStage === "warm" ||
        rawStage.startsWith("warm_") ||
        rawStage === "hot" ||
        rawStage === "sample" ||
        rawStage === "deal";

      const isSample = rawStage === "sample" || rawStage === "deal";

      // Source overview agg
      sourceAgg[ch].traffic++;
      if (isQualified) sourceAgg[ch].prospecting++;
      if (isSample) sourceAgg[ch].sample++;

      const addLead = (targetWeekMap: WeekMap) => {
        targetWeekMap[wk].traffic++;
        targetWeekMap.total.traffic++;
        if (isQualified) {
          targetWeekMap[wk].prospecting++;
          targetWeekMap.total.prospecting++;
        }
        if (isSample) {
          targetWeekMap[wk].sample++;
          targetWeekMap.total.sample++;
        }
      };

      // Tambahkan ke specific channel (tetap dari tracking)
      if (store.blended[ch]) addLead(store.blended[ch]);
      if (assigned && store[assigned]?.[ch]) addLead(store[assigned][ch]);

      // Kumpulkan per (date, busdev) untuk `all` (digabung dengan manual override)
      if (assigned) {
        if (!autoDaily[d]) autoDaily[d] = {};
        if (!autoDaily[d][assigned]) autoDaily[d][assigned] = createEmptyBlock();
        autoDaily[d][assigned].traffic++;
        if (isQualified) autoDaily[d][assigned].prospecting++;
        if (isSample) autoDaily[d][assigned].sample++;
      } else {
        if (!unassignedDaily[d]) unassignedDaily[d] = createEmptyBlock();
        unassignedDaily[d].traffic++;
        if (isQualified) unassignedDaily[d].prospecting++;
        if (isSample) unassignedDaily[d].sample++;
      }
    }

    // Pemetaan manual overrides: [date][busdev] -> RawBlock
    const manualDaily: Record<string, Record<string, RawBlock>> = {};
    for (const row of manualRes.rows) {
      const d = row.metric_date as string;
      const b = busdevNames.find((n) => n.toLowerCase() === String(row.busdev_name || "").toLowerCase());
      if (!b) continue;
      if (!manualDaily[d]) manualDaily[d] = {};
      manualDaily[d][b] = {
        traffic: Number(row.traffic) || 0,
        prospecting: (Number(row.warm) || 0) + (Number(row.hot) || 0),
        sample: Number(row.sample) || 0,
      };
    }

    // Gabungkan semua tanggal (baik yang ada di autoDaily maupun manualDaily) ke store[busdev].all dan store.blended.all
    const allDates = new Set([...Object.keys(autoDaily), ...Object.keys(manualDaily), ...Object.keys(unassignedDaily)]);
    for (const d of allDates) {
      const wk = findWeekKey(d);
      for (const b of busdevNames) {
        const eff = manualDaily[d]?.[b] ?? autoDaily[d]?.[b];
        if (!eff) continue;
        store[b].all[wk].traffic += eff.traffic;
        store[b].all[wk].prospecting += eff.prospecting;
        store[b].all[wk].sample += eff.sample;
        store[b].all.total.traffic += eff.traffic;
        store[b].all.total.prospecting += eff.prospecting;
        store[b].all.total.sample += eff.sample;

        store.blended.all[wk].traffic += eff.traffic;
        store.blended.all[wk].prospecting += eff.prospecting;
        store.blended.all[wk].sample += eff.sample;
        store.blended.all.total.traffic += eff.traffic;
        store.blended.all.total.prospecting += eff.prospecting;
        store.blended.all.total.sample += eff.sample;
      }
      const un = unassignedDaily[d];
      if (un) {
        store.blended.all[wk].traffic += un.traffic;
        store.blended.all[wk].prospecting += un.prospecting;
        store.blended.all[wk].sample += un.sample;
        store.blended.all.total.traffic += un.traffic;
        store.blended.all.total.prospecting += un.prospecting;
        store.blended.all.total.sample += un.sample;
      }
    }

    // Format output dengan KPI Conversion Rate terhitung
    const formatWeekConversion = (weekMap: WeekMap): Record<string, ConversionMetrics> => {
      const res: Record<string, ConversionMetrics> = {};
      for (const [k, raw] of Object.entries(weekMap)) {
        res[k] = calcConversionMetrics(raw.traffic, raw.prospecting, raw.sample, 40, 30);
      }
      return res;
    };

    const targetBusdevs = isAdmin
      ? busdevNames
      : busdevNames.filter((n) => n.toLowerCase() === user.name.toLowerCase());

    const resultByBusdev = targetBusdevs.map((name) => {
      const channelsRes: Record<string, Record<string, ConversionMetrics>> = {};
      for (const ch of ["all", ...channelList]) {
        channelsRes[ch] = formatWeekConversion(store[name][ch] || createWeekMap());
      }
      return {
        busdev: name,
        channels: channelsRes,
        conversion: channelsRes.all,
      };
    });

    const blendedChannelsRes: Record<string, Record<string, ConversionMetrics>> = {};
    for (const ch of ["all", ...channelList]) {
      blendedChannelsRes[ch] = formatWeekConversion(store.blended[ch] || createWeekMap());
    }

    const userBusdevData = resultByBusdev.find((r) => r.busdev.toLowerCase() === user.name.toLowerCase());
    const blendedData = isAdmin
      ? {
          channels: blendedChannelsRes,
          conversion: blendedChannelsRes.all,
        }
      : {
          channels: userBusdevData?.channels || {},
          conversion: userBusdevData?.conversion || ({} as any),
        };

    const CHANNEL_LABELS: Record<AdChannel, string> = {
      meta_ads: "Meta Ads",
      google_ads: "Google Ads",
      google_organic: "Google Organik (SEO)",
      social_media: "Media Sosial (IG / TikTok)",
      other: "Lainnya / Direct",
    };

    let maxProspecting = 0;
    for (const ch of channelList) {
      if (sourceAgg[ch].prospecting > maxProspecting) maxProspecting = sourceAgg[ch].prospecting;
    }
    const sourceOverview: SourceOverviewRow[] = isAdmin
      ? channelList.map((ch) => {
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
        })
      : [];

    const chSrc = isAdmin ? blendedChannelsRes : (userBusdevData?.channels || {});
    const targetSubMap = isAdmin
      ? otherSubAgg.blended
      : otherSubAgg[userBusdevData?.busdev || ""] || {};
    const otherBreakdown = Object.entries(targetSubMap)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

    const simpleSourceOverview = {
      google: (chSrc.google_ads?.total?.traffic || 0) + (chSrc.google_organic?.total?.traffic || 0),
      meta: chSrc.meta_ads?.total?.traffic || 0,
      other: (chSrc.social_media?.total?.traffic || 0) + (chSrc.other?.total?.traffic || 0),
      otherBreakdown,
    };

    return json({
      success: true,
      period: {
        month: monthParam,
        title: periodTitle,
        startDate,
        endDate,
      },
      weeks: weekSlices,
      busdevNames: targetBusdevs,
      blended: blendedData,
      byBusdev: resultByBusdev,
      sourceOverview,
      simpleSourceOverview,
    });
  } catch (err: any) {
    console.error("[api/crm/reports/weekly-conversion] Error:", err);
    return json({ success: false, error: err?.message || "Gagal memuat laporan konversi mingguan" }, 500);
  }
}

