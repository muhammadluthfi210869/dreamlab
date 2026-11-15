"use client";

import { useMemo, useState } from "react";
import { BarChart3, Layers } from "lucide-react";
import { Card } from "@/components/lead-monitor/ui";
import type { BusdevChannelFunnel, ChannelFunnelMetrics, ChannelFunnelsOverview } from "@/lib/lead-monitor-stats";

type ChannelKey = "all" | "meta_ads" | "google_ads" | "google_organic" | "social_media";

interface ChannelDef {
  key: ChannelKey;
  label: string;
  shortLabel: string;
  dotColor: string;
  headerBg: string;
  headerText: string;
  badgeCls: string;
}

const CHANNEL_DEFS: ChannelDef[] = [
  {
    key: "all",
    label: "Total Semua Channel (Blended Channel)",
    shortLabel: "Total Semua Channel",
    dotColor: "bg-[#F39200]",
    headerBg: "bg-slate-900",
    headerText: "text-white",
    badgeCls: "bg-amber-50 text-amber-800 border-amber-200",
  },
  {
    key: "meta_ads",
    label: "Meta Ads",
    shortLabel: "Meta Ads",
    dotColor: "bg-blue-600",
    headerBg: "bg-blue-900",
    headerText: "text-white",
    badgeCls: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    key: "google_ads",
    label: "Google Ads",
    shortLabel: "Google Ads",
    dotColor: "bg-emerald-600",
    headerBg: "bg-emerald-900",
    headerText: "text-white",
    badgeCls: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    key: "google_organic",
    label: "Google (Organik / SEO)",
    shortLabel: "Google Organik",
    dotColor: "bg-sky-600",
    headerBg: "bg-sky-900",
    headerText: "text-white",
    badgeCls: "bg-sky-50 text-sky-700 border-sky-200",
  },
  {
    key: "social_media",
    label: "Media Sosial (Organik)",
    shortLabel: "Media Sosial",
    dotColor: "bg-purple-600",
    headerBg: "bg-purple-900",
    headerText: "text-white",
    badgeCls: "bg-purple-50 text-purple-700 border-purple-200",
  },
];

const FOUR_CHANNELS: Array<keyof Pick<BusdevChannelFunnel, "meta_ads" | "google_ads" | "google_organic" | "social_media">> = [
  "meta_ads",
  "google_ads",
  "google_organic",
  "social_media",
];

interface ComputedConversionBlock {
  trafficCount: number;
  prospectingCount: number;
  prospectingPct: number;
  prospectingTarget: number;
  sampleCount: number;
  samplePct: number;
  sampleTarget: number;
  warmCount: number;
  hotCount: number;
}

function sumMetrics(list: ChannelFunnelMetrics[]): {
  traffic: number;
  cold: number;
  warm: number;
  hot: number;
  sample: number;
} {
  return list.reduce(
    (acc, m) => ({
      traffic: acc.traffic + (m?.traffic || 0),
      cold: acc.cold + (m?.cold || 0),
      warm: acc.warm + (m?.warm || 0),
      hot: acc.hot + (m?.hot || 0),
      sample: acc.sample + (m?.sample || 0),
    }),
    { traffic: 0, cold: 0, warm: 0, hot: 0, sample: 0 }
  );
}

/**
 * Menghitung tabel Conversion Rate sesuai standar KPI Dreamlab:
 * - Traffic: Count = traffic
 * - Prospecting (40%):
 *     Count = Warm + Hot (atau Warm + Hot + Sample jika mode kumulatif)
 *     % = round((Prospecting Count / Traffic Count) * 100)
 *     Target KPI = round(Traffic Count * 40%)
 * - Sample (30%):
 *     Count = Sample
 *     % = round((Sample Count / Prospecting Count) * 100)
 *     Target KPI = round(Traffic Count * 40% * 30%)
 */
function computeConversionBlock(
  raw: { traffic: number; warm: number; hot: number; sample: number },
  prospectingRatePct = 40,
  sampleRatePct = 30,
  includeSampleInProspecting = false
): ComputedConversionBlock {
  const trafficCount = raw.traffic || 0;
  const warmCount = raw.warm || 0;
  const hotCount = raw.hot || 0;
  const sampleCount = raw.sample || 0;

  const prospectingCount = includeSampleInProspecting
    ? warmCount + hotCount + sampleCount
    : warmCount + hotCount;

  const prospectingPct =
    trafficCount > 0 ? Math.round((prospectingCount / trafficCount) * 100) : 0;

  const exactProspectingTarget = trafficCount * (prospectingRatePct / 100);
  const prospectingTarget = Math.round(exactProspectingTarget);

  const samplePct =
    prospectingCount > 0 ? Math.round((sampleCount / prospectingCount) * 100) : 0;

  const sampleTarget = Math.round(exactProspectingTarget * (sampleRatePct / 100));

  return {
    trafficCount,
    prospectingCount,
    prospectingPct,
    prospectingTarget,
    sampleCount,
    samplePct,
    sampleTarget,
    warmCount,
    hotCount,
  };
}

function getBusdevRawMetrics(
  b: BusdevChannelFunnel,
  chKey: ChannelKey
): { traffic: number; warm: number; hot: number; sample: number } {
  if (chKey === "all") {
    return sumMetrics([b.meta_ads, b.google_ads, b.google_organic, b.social_media, b.other]);
  }
  return b[chKey];
}

function getBlendedRawMetrics(
  channelFunnels: ChannelFunnelsOverview,
  chKey: ChannelKey
): { traffic: number; warm: number; hot: number; sample: number } {
  const s = channelFunnels.summary;
  if (chKey === "all") {
    return sumMetrics([s.meta_ads, s.google_ads, s.google_organic, s.social_media, s.other]);
  }
  return s[chKey];
}

function ConversionRateTable({
  channelDef,
  channelFunnels,
  prospectingTargetPct,
  sampleTargetPct,
  includeSampleInProspecting,
}: {
  channelDef: ChannelDef;
  channelFunnels: ChannelFunnelsOverview;
  prospectingTargetPct: number;
  sampleTargetPct: number;
  includeSampleInProspecting: boolean;
}) {
  const busdevs = channelFunnels.byBusdev;

  const columns = useMemo(() => {
    const perBusdev = busdevs.map((b) => ({
      id: b.name,
      title: b.name,
      isBlended: false,
      metrics: computeConversionBlock(
        getBusdevRawMetrics(b, channelDef.key),
        prospectingTargetPct,
        sampleTargetPct,
        includeSampleInProspecting
      ),
    }));

    const blended = {
      id: "__blended__",
      title: "Blended (Total)",
      isBlended: true,
      metrics: computeConversionBlock(
        getBlendedRawMetrics(channelFunnels, channelDef.key),
        prospectingTargetPct,
        sampleTargetPct,
        includeSampleInProspecting
      ),
    };

    return [...perBusdev, blended];
  }, [busdevs, channelFunnels, channelDef.key, prospectingTargetPct, sampleTargetPct, includeSampleInProspecting]);

  return (
    <div className="overflow-hidden rounded-xl border border-[#D5D9E2] bg-white shadow-xs">
      {/* Sub-header Nama Channel */}
      <div className="flex items-center justify-between border-b border-[#D5D9E2] bg-[#F8F9FB] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${channelDef.dotColor}`} />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            {channelDef.label}
          </span>
        </div>
        <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold ${channelDef.badgeCls}`}>
          Prospecting ({prospectingTargetPct}%) · Sample ({sampleTargetPct}%)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            {/* Baris Header 1: Conversion Rate | Nama BusDev ... | Blended (Total) */}
            <tr className="border-b border-[#D5D9E2] bg-white text-slate-900">
              <th
                rowSpan={2}
                className="min-w-[175px] border-r border-[#D5D9E2] bg-[#F8F9FB] px-3.5 py-3 text-left text-xs font-bold text-slate-900 align-middle"
              >
                Conversion Rate
              </th>
              {columns.map((col) => (
                <th
                  key={col.id}
                  colSpan={3}
                  className={`border-r border-[#D5D9E2] px-3 py-2 text-center text-xs font-bold last:border-r-0 ${
                    col.isBlended
                      ? "bg-[#FFF4DC] text-[#9A6200]"
                      : "bg-[#F8F9FB] text-slate-900"
                  }`}
                >
                  {col.title}
                </th>
              ))}
            </tr>

            {/* Baris Header 2: Count | % | Target KPI */}
            <tr className="border-b border-[#D5D9E2] bg-[#F8F9FB] text-[11px] font-bold text-slate-700">
              {columns.map((col) => (
                <FragmentGroupHeader key={col.id} isBlended={col.isBlended} />
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#D5D9E2]">
            {/* BARIS 1: Traffic */}
            <tr>
              <td className="border-r border-[#D5D9E2] bg-white px-3.5 py-2.5 font-semibold text-slate-900 whitespace-nowrap">
                Traffic
              </td>
              {columns.map((col) => (
                <TrafficRowCells key={col.id} m={col.metrics} isBlended={col.isBlended} />
              ))}
            </tr>

            {/* BARIS 2: Prospecting (40%) */}
            <tr>
              <td className="border-r border-[#D5D9E2] bg-white px-3.5 py-2.5 font-medium text-slate-900 whitespace-nowrap">
                Prospecting (<b className="font-bold"> {prospectingTargetPct}%</b>)
                <div className="text-[10px] text-slate-400 font-normal">
                  {includeSampleInProspecting ? "Warm + Hot + Sample" : "Warm + Hot (Qualified)"}
                </div>
              </td>
              {columns.map((col) => (
                <ProspectingRowCells
                  key={col.id}
                  m={col.metrics}
                  targetPct={prospectingTargetPct}
                  isBlended={col.isBlended}
                />
              ))}
            </tr>

            {/* BARIS 3: Sample (30%) */}
            <tr>
              <td className="border-r border-[#D5D9E2] bg-white px-3.5 py-2.5 font-medium text-slate-900 whitespace-nowrap">
                Sample (<b className="font-bold">{sampleTargetPct}%</b>)
                <div className="text-[10px] text-slate-400 font-normal">
                  % terhadap Prospecting
                </div>
              </td>
              {columns.map((col) => (
                <SampleRowCells
                  key={col.id}
                  m={col.metrics}
                  targetPct={sampleTargetPct}
                  isBlended={col.isBlended}
                />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FragmentGroupHeader({ isBlended }: { isBlended: boolean }) {
  const baseBg = isBlended ? "bg-[#FFF9EB]" : "bg-[#F8F9FB]";
  return (
    <>
      <th className={`border-r border-[#D5D9E2] px-2.5 py-1.5 text-center font-bold ${baseBg}`}>
        Count
      </th>
      <th className={`border-r border-[#D5D9E2] px-2.5 py-1.5 text-center font-bold ${baseBg}`}>
        %
      </th>
      <th className={`border-r border-[#D5D9E2] px-2.5 py-1.5 text-center font-bold last:border-r-0 ${baseBg}`}>
        Target KPI
      </th>
    </>
  );
}

function TrafficRowCells({ m, isBlended }: { m: ComputedConversionBlock; isBlended: boolean }) {
  return (
    <>
      <td
        className={`border-r border-[#D5D9E2] px-3 py-2.5 text-right font-mono font-bold tabular-nums ${
          isBlended ? "bg-[#FFF2B2] text-slate-950" : "bg-[#FEF08A]/70 text-slate-900"
        }`}
      >
        {m.trafficCount.toLocaleString("id-ID")}
      </td>
      <td className="border-r border-[#D5D9E2] bg-slate-300/75 px-2.5 py-2.5 text-center font-mono text-slate-400">
        &nbsp;
      </td>
      <td className="border-r border-[#D5D9E2] bg-slate-300/75 px-2.5 py-2.5 text-center font-mono text-slate-400 last:border-r-0">
        &nbsp;
      </td>
    </>
  );
}

function ProspectingRowCells({
  m,
  targetPct,
  isBlended,
}: {
  m: ComputedConversionBlock;
  targetPct: number;
  isBlended: boolean;
}) {
  const metTarget = m.trafficCount > 0 && m.prospectingPct >= targetPct;
  return (
    <>
      <td
        className={`border-r border-[#D5D9E2] px-3 py-2.5 text-right font-mono font-bold tabular-nums ${
          isBlended ? "bg-[#FFF2B2] text-slate-950" : "bg-[#FEF08A]/70 text-slate-900"
        }`}
        title={`Warm: ${m.warmCount} + Hot: ${m.hotCount}`}
      >
        {m.prospectingCount.toLocaleString("id-ID")}
      </td>
      <td
        className={`border-r border-[#D5D9E2] px-2.5 py-2.5 text-center font-mono font-semibold tabular-nums ${
          metTarget ? "text-emerald-700 bg-emerald-50/40" : "text-slate-800 bg-white"
        }`}
      >
        {m.prospectingPct}%
      </td>
      <td className="border-r border-[#D5D9E2] bg-white px-2.5 py-2.5 text-center font-mono font-semibold text-slate-700 tabular-nums last:border-r-0">
        {m.prospectingTarget.toLocaleString("id-ID")}
      </td>
    </>
  );
}

function SampleRowCells({
  m,
  targetPct,
  isBlended,
}: {
  m: ComputedConversionBlock;
  targetPct: number;
  isBlended: boolean;
}) {
  const metTarget = m.prospectingCount > 0 && m.samplePct >= targetPct;
  return (
    <>
      <td
        className={`border-r border-[#D5D9E2] px-3 py-2.5 text-right font-mono font-bold tabular-nums ${
          isBlended ? "bg-[#FFF2B2] text-slate-950" : "bg-[#FEF08A]/70 text-slate-900"
        }`}
      >
        {m.sampleCount.toLocaleString("id-ID")}
      </td>
      <td
        className={`border-r border-[#D5D9E2] px-2.5 py-2.5 text-center font-mono font-semibold tabular-nums ${
          metTarget ? "text-emerald-700 bg-emerald-50/40" : "text-slate-800 bg-white"
        }`}
      >
        {m.samplePct}%
      </td>
      <td className="border-r border-[#D5D9E2] bg-white px-2.5 py-2.5 text-center font-mono font-semibold text-slate-700 tabular-nums last:border-r-0">
        {m.sampleTarget.toLocaleString("id-ID")}
      </td>
    </>
  );
}

export function BusdevConversionRateCard({
  channelFunnels,
}: {
  channelFunnels: ChannelFunnelsOverview;
}) {
  const [viewMode, setViewMode] = useState<"all_tables" | ChannelKey>("all_tables");
  const [includeSampleInProspecting, setIncludeSampleInProspecting] = useState<boolean>(false);

  const visibleChannels = useMemo(() => {
    if (viewMode === "all_tables") return CHANNEL_DEFS;
    return CHANNEL_DEFS.filter((c) => c.key === viewMode);
  }, [viewMode]);

  return (
    <Card
      title="Conversion Rate per BusDev & Laporan Blended (Total & Per Channel)"
      subtitle="Evaluasi Count, % Conversion Rate, dan Target KPI (Prospecting 40% dari Traffic · Sample 30% dari Prospecting) untuk setiap BusDev serta gabungan Blended"
      right={
        <div className="flex flex-wrap items-center gap-2">
          {/* Opsi cara hitung Prospecting */}
          <button
            type="button"
            onClick={() => setIncludeSampleInProspecting((v) => !v)}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E5E2DA] bg-[#F8F9FB] px-2.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition"
            title="Pilih apakah baris Prospecting menghitung Warm + Hot saja atau Warm + Hot + Sample"
          >
            <BarChart3 className="h-3.5 w-3.5 text-[#F39200]" />
            <span>
              Prospecting: {includeSampleInProspecting ? "Warm + Hot + Sample" : "Warm + Hot"}
            </span>
          </button>

          {/* Filter Tampilan Channel */}
          <div className="flex items-center gap-1 rounded-lg border border-[#E5E2DA] bg-[#F8F9FB] p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("all_tables")}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
                viewMode === "all_tables"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="h-3 w-3" />
              <span>Tampilkan Semua (Total + 4 Channel)</span>
            </button>
            {CHANNEL_DEFS.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setViewMode(c.key)}
                className={`hidden md:inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                  viewMode === c.key
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${c.dotColor}`} />
                <span>{c.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Pilihan Channel untuk layar mobile */}
        <div className="flex flex-wrap gap-1.5 md:hidden">
          <button
            type="button"
            onClick={() => setViewMode("all_tables")}
            className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${
              viewMode === "all_tables" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            Semua Tabel
          </button>
          {CHANNEL_DEFS.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setViewMode(c.key)}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold ${
                viewMode === c.key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${c.dotColor}`} />
              <span>{c.shortLabel}</span>
            </button>
          ))}
        </div>

        {/* Render Tabel untuk Total & Setiap Channel */}
        <div className="space-y-4">
          {visibleChannels.map((ch) => (
            <ConversionRateTable
              key={ch.key}
              channelDef={ch}
              channelFunnels={channelFunnels}
              prospectingTargetPct={40}
              sampleTargetPct={30}
              includeSampleInProspecting={includeSampleInProspecting}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}

