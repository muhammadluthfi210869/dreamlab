import { NextRequest } from "next/server";
import { getMonitorPool } from "@/lib/db";
import { isAuthFailure, json, requireUser } from "@/lib/crm-auth";
import { isAdminRole } from "@/lib/crm-stages";
import { detectAdChannel, type AdChannel } from "@/lib/lead-monitor-stats";

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
    // Ambil daftar sales aktif
    const bdRes = await pool.query(
      `SELECT name FROM busdevs WHERE is_active = TRUE ORDER BY id ASC`
    );
    const busdevNames = bdRes.rows.map((r: any) => r.name);

    // Ambil semua leads pada rentang waktu ini
    const leadsRes = await pool.query(
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
    );

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

    for (const l of leadsRes.rows) {
      const wk = findWeekKey(l.lead_date);
      const ch = detectAdChannel(l);
      const assigned = busdevNames.find(
        (n) => n.toLowerCase() === (l.assigned_to || "").trim().toLowerCase()
      );

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

      // Tambahkan ke Blended (All Channel & Specific Channel)
      addLead(store.blended.all);
      if (store.blended[ch]) {
        addLead(store.blended[ch]);
      }

      // Tambahkan ke Sales bersangkutan
      if (assigned && store[assigned]) {
        addLead(store[assigned].all);
        if (store[assigned][ch]) {
          addLead(store[assigned][ch]);
        }
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
      blended: {
        channels: blendedChannelsRes,
        conversion: blendedChannelsRes.all,
      },
      byBusdev: resultByBusdev,
    });
  } catch (err: any) {
    console.error("[api/crm/reports/weekly-conversion] Error:", err);
    return json({ success: false, error: err?.message || "Gagal memuat laporan konversi mingguan" }, 500);
  }
}

