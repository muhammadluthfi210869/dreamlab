"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Check,
  ChevronRight,
  Filter,
  Layers,
  RefreshCw,
  SlidersHorizontal,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card } from "@/components/lead-monitor/ui";

interface ConversionMetrics {
  traffic: number;
  prospecting: number;
  sample: number;
  prospectingTarget: number;
  prospectingPct: number;
  sampleTarget: number;
  samplePct: number;
}

interface WeekSlice {
  key: string;
  label: string;
  dateRange: string;
  startDate: string;
  endDate: string;
}

interface BusdevWeeklyData {
  busdev: string;
  channels: Record<string, Record<string, ConversionMetrics>>;
  conversion: Record<string, ConversionMetrics>;
}

interface ApiResponse {
  success: boolean;
  period: {
    month: string;
    title: string;
    startDate: string;
    endDate: string;
  };
  weeks: WeekSlice[];
  busdevNames: string[];
  blended: {
    channels: Record<string, Record<string, ConversionMetrics>>;
    conversion: Record<string, ConversionMetrics>;
  };
  byBusdev: BusdevWeeklyData[];
}

const CHANNEL_OPTIONS = [
  { key: "all", label: "Semua Channel", dot: "bg-[#F39200]" },
  { key: "meta_ads", label: "Meta Ads", dot: "bg-blue-600" },
  { key: "google_ads", label: "Google Ads", dot: "bg-emerald-600" },
  { key: "google_organic", label: "Google Organik", dot: "bg-sky-600" },
  { key: "social_media", label: "Media Sosial", dot: "bg-purple-600" },
];

export function WeeklyLeadConversionReportCard({
  initialBusdev = "all",
  onSelectDateRange,
}: {
  initialBusdev?: string;
  onSelectDateRange?: (start: string, end: string) => void;
}) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [month, setMonth] = useState<string>("2026-11");
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [customStart, setCustomStart] = useState<string>("2026-11-01");
  const [customEnd, setCustomEnd] = useState<string>("2026-11-30");

  const [selectedSales, setSelectedSales] = useState<string>(initialBusdev || "blended");
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"standard" | "matrix">("standard");

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      if (isCustomDate) {
        qs.set("startDate", customStart);
        qs.set("endDate", customEnd);
      } else {
        qs.set("month", month);
      }

      const res = await fetch(`/api/crm/reports/weekly-conversion?${qs.toString()}`, {
        cache: "no-store",
      });
      if (res.status === 401) {
        window.location.href = "/lead-monitor/masuk";
        return;
      }
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json.error || `Gagal memuat laporan (${res.status})`);
      }
      setData(json as ApiResponse);
    } catch (e: any) {
      setError(e?.message || "Gagal memuat laporan konversi mingguan");
    } finally {
      setLoading(false);
    }
  }, [isCustomDate, customStart, customEnd, month]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  // Dapatkan metrik konversi aktif untuk sales & channel yang dipilih
  const activeConversionMap = useMemo(() => {
    if (!data) return null;
    if (selectedSales === "blended" || selectedSales === "all") {
      return data.blended.channels[selectedChannel] || data.blended.conversion;
    }
    const found = data.byBusdev.find(
      (b) => b.busdev.toLowerCase() === selectedSales.toLowerCase()
    );
    if (!found) return data.blended.conversion;
    return found.channels[selectedChannel] || found.conversion;
  }, [data, selectedSales, selectedChannel]);

  const weeks = data?.weeks ?? [];
  const weekKeys = useMemo(() => weeks.map((w) => w.key), [weeks]);

  return (
    <Card
      title="Laporan Konversi Leads: Traffic >> Prospecting >> Sample (Week 1 – Week 4)"
      subtitle="Evaluasi konversi mingguan sesuai target standar KPI Dreamlab: Target Prospecting 40% dari Traffic · Target Sample 30% dari Target Prospecting"
      right={
        <div className="flex flex-wrap items-center gap-2">
          {/* Tombol Refresh */}
          <button
            type="button"
            onClick={() => loadReport()}
            disabled={loading}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#E5E2DA] bg-white px-2.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            title="Segarkan data laporan konversi"
          >
            <RefreshCw className={`h-3 w-3 text-[#D98A00] ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800">
            {error}
          </div>
        )}

        {/* Bilah Pengaturan Tanggal (Bulan / Custom) & Filter Channel */}
        <div className="flex flex-col gap-3 rounded-2xl border border-[#ECEAE4] bg-[#F8F9FB] p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Pemilih Bulan / Tanggal */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-[#D98A00]" />
                <span>Periode:</span>
              </span>

              {!isCustomDate ? (
                <div className="flex items-center gap-1 rounded-lg border border-[#E5E2DA] bg-white px-2.5 py-1">
                  <select
                    aria-label="Pilih Bulan Evaluasi"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="bg-transparent font-mono text-xs font-bold text-slate-900 outline-none cursor-pointer"
                  >
                    <option value="2026-11">November 2026 (Bulan Ini)</option>
                    <option value="2026-10">Oktober 2026</option>
                    <option value="2026-12">Desember 2026</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 rounded-lg border border-[#E5E2DA] bg-white px-2.5 py-1">
                  <input
                    type="date"
                    aria-label="Dari tanggal"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="bg-transparent font-mono text-xs text-slate-800 outline-none"
                  />
                  <span className="text-xs text-slate-400">s/d</span>
                  <input
                    type="date"
                    aria-label="Sampai tanggal"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="bg-transparent font-mono text-xs text-slate-800 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => loadReport()}
                    className="ml-1 rounded bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-slate-800"
                  >
                    Terapkan
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsCustomDate((v) => !v)}
                className="text-[11px] font-semibold text-[#1F6FB2] hover:underline"
              >
                {isCustomDate ? "Pilih Format Bulan Standar" : "Atur Rentang Tanggal..."}
              </button>
            </div>

            {/* Pilihan Tampilan: Standar vs Matriks */}
            <div className="flex items-center rounded-xl bg-slate-200/70 p-1 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setViewMode("standard")}
                className={`rounded-lg px-2.5 py-1 transition ${
                  viewMode === "standard"
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tabel Week 1–4
              </button>
              <button
                type="button"
                onClick={() => setViewMode("matrix")}
                className={`rounded-lg px-2.5 py-1 transition ${
                  viewMode === "matrix"
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Matriks Semua Tim
              </button>
            </div>
          </div>

          {/* Tab Pemilih Sales (Blended vs Tiap BusDev) */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#EAE7DF] pt-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-slate-600" />
                <span>Sales:</span>
              </span>

              <button
                type="button"
                onClick={() => setSelectedSales("blended")}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                  selectedSales === "blended" || selectedSales === "all"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-[#E5E2DA] hover:bg-slate-50"
                }`}
              >
                🏆 Blended Tim (Total)
              </button>

              {(data?.busdevNames || ["Annisa", "Diaz", "Jessica"]).map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedSales(name)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                    selectedSales.toLowerCase() === name.toLowerCase()
                      ? "bg-[#D98A00] text-white shadow-xs"
                      : "bg-white text-slate-700 border border-[#E5E2DA] hover:bg-slate-50"
                  }`}
                >
                  👤 {name}
                </button>
              ))}
            </div>

            {/* Filter Channel */}
            <div className="flex flex-wrap items-center gap-1">
              {CHANNEL_OPTIONS.map((ch) => (
                <button
                  key={ch.key}
                  type="button"
                  onClick={() => setSelectedChannel(ch.key)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold transition ${
                    selectedChannel === ch.key
                      ? "bg-slate-800 text-white"
                      : "bg-white text-slate-600 border border-[#E5E2DA] hover:bg-slate-50"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${ch.dot}`} />
                  <span>{ch.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TAMPILAN 1: Tabel Standar Week 1, Week 2, Week 3, Week 4, Total */}
        {viewMode === "standard" && (
          <div className="overflow-x-auto rounded-xl border border-[#D5D9E2]">
            <table className="w-full border-collapse text-xs">
              <thead>
                {/* Header Baris 1: Tahapan Konversi | Week 1 ... Week 4 | Total */}
                <tr className="border-b border-[#D5D9E2] bg-[#F8F9FB] text-slate-900">
                  <th
                    rowSpan={2}
                    className="min-w-[190px] border-r border-[#D5D9E2] bg-[#F8F9FB] px-4 py-3 text-left font-bold text-slate-900 align-middle"
                  >
                    <div>
                      <span className="text-xs uppercase tracking-wider">Tahapan Konversi Leads</span>
                      <div className="text-[10px] font-normal text-slate-500">
                        Target: Prospecting 40% · Sample 30%
                      </div>
                    </div>
                  </th>

                  {weeks.map((w) => (
                    <th
                      key={w.key}
                      colSpan={3}
                      className="border-r border-[#D5D9E2] px-3 py-2 text-center text-xs font-bold text-slate-900 bg-white"
                    >
                      <div>{w.label}</div>
                      <div className="font-mono text-[10px] font-normal text-slate-500">{w.dateRange}</div>
                    </th>
                  ))}

                  {/* Kolom TOTAL */}
                  <th
                    colSpan={3}
                    className="bg-[#FFF4DC] text-[#9A6200] px-3 py-2 text-center text-xs font-bold"
                  >
                    <div>TOTAL BULAN</div>
                    <div className="font-mono text-[10px] font-normal text-amber-800/80">
                      {data?.period.title ?? "Semua Minggu"}
                    </div>
                  </th>
                </tr>

                {/* Header Baris 2: Sub-kolom Count | % | Target KPI */}
                <tr className="border-b border-[#D5D9E2] bg-[#F8F9FB] text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {weeks.map((w) => (
                    <SubHeaderColumns key={w.key} />
                  ))}
                  <SubHeaderColumns isTotal />
                </tr>
              </thead>

              <tbody className="divide-y divide-[#D5D9E2] bg-white">
                {/* BARIS 1: TRAFFIC */}
                <tr className="hover:bg-slate-50/70 transition">
                  <td className="border-r border-[#D5D9E2] px-4 py-3 font-bold text-slate-900 whitespace-nowrap bg-[#FDFCFB]">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                      <span>1. Traffic (Klik CTA)</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal">100% Volume Prospek Masuk</div>
                  </td>

                  {weeks.map((w) => {
                    const m = activeConversionMap ? activeConversionMap[w.key] : null;
                    return (
                      <td
                        key={w.key}
                        colSpan={3}
                        className="border-r border-[#D5D9E2] px-3 py-3 text-center font-mono text-sm font-bold text-slate-900 tabular-nums"
                      >
                        {m?.traffic.toLocaleString("id-ID") ?? "0"}
                        <span className="ml-1 text-[10px] font-normal text-slate-400">leads</span>
                      </td>
                    );
                  })}

                  {/* Total Traffic */}
                  <td
                    colSpan={3}
                    className="bg-[#FFFDF7] px-3 py-3 text-center font-mono text-base font-bold text-amber-950 tabular-nums"
                  >
                    {activeConversionMap?.total.traffic.toLocaleString("id-ID") ?? "0"}
                    <span className="ml-1 text-[10px] font-normal text-amber-800/70">leads</span>
                  </td>
                </tr>

                {/* BARIS 2: PROSPECTING (TARGET 40%) */}
                <tr className="hover:bg-amber-50/20 transition">
                  <td className="border-r border-[#D5D9E2] px-4 py-3 font-bold text-slate-900 whitespace-nowrap bg-[#FDFCFB]">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-2 w-2 rounded-full bg-[#D98A00]" />
                      <span>2. Prospecting (<b className="text-amber-800">40%</b>)</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      Warm + Hot (Lolos Kualifikasi MOQ &ge; 500 pcs)
                    </div>
                  </td>

                  {weeks.map((w) => {
                    const m = activeConversionMap ? activeConversionMap[w.key] : null;
                    const pass = (m?.prospectingPct ?? 0) >= 40;
                    return (
                      <MetricCellTriplet
                        key={w.key}
                        count={m?.prospecting ?? 0}
                        pct={m?.prospectingPct ?? 0}
                        target={m?.prospectingTarget ?? 0}
                        isGood={pass}
                      />
                    );
                  })}

                  {/* Total Prospecting */}
                  <MetricCellTriplet
                    count={activeConversionMap?.total.prospecting ?? 0}
                    pct={activeConversionMap?.total.prospectingPct ?? 0}
                    target={activeConversionMap?.total.prospectingTarget ?? 0}
                    isGood={(activeConversionMap?.total.prospectingPct ?? 0) >= 40}
                    isTotal
                  />
                </tr>

                {/* BARIS 3: SAMPLE (TARGET 30%) */}
                <tr className="hover:bg-emerald-50/20 transition">
                  <td className="border-r border-[#D5D9E2] px-4 py-3 font-bold text-slate-900 whitespace-nowrap bg-[#FDFCFB]">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-600" />
                      <span>3. Sample (<b className="text-emerald-800">30%</b>)</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      Tahap Pembuatan Sampel Formula / Deal
                    </div>
                  </td>

                  {weeks.map((w) => {
                    const m = activeConversionMap ? activeConversionMap[w.key] : null;
                    const pass = (m?.samplePct ?? 0) >= 30;
                    return (
                      <MetricCellTriplet
                        key={w.key}
                        count={m?.sample ?? 0}
                        pct={m?.samplePct ?? 0}
                        target={m?.sampleTarget ?? 0}
                        isGood={pass}
                      />
                    );
                  })}

                  {/* Total Sample */}
                  <MetricCellTriplet
                    count={activeConversionMap?.total.sample ?? 0}
                    pct={activeConversionMap?.total.samplePct ?? 0}
                    target={activeConversionMap?.total.sampleTarget ?? 0}
                    isGood={(activeConversionMap?.total.samplePct ?? 0) >= 30}
                    isTotal
                  />
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* TAMPILAN 2: Matriks Perbandingan Seluruh Tim (Setiap BusDev Berdampingan) */}
        {viewMode === "matrix" && (
          <div className="overflow-x-auto rounded-xl border border-[#D5D9E2]">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#D5D9E2] bg-[#F8F9FB] text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  <th className="border-r border-[#D5D9E2] px-4 py-3 text-left">Nama Sales / Tim</th>
                  {weeks.map((w) => (
                    <th key={w.key} className="border-r border-[#D5D9E2] px-3 py-2 text-center">
                      <div>{w.label}</div>
                      <div className="font-mono text-[9px] font-normal text-slate-400">Traffic &gt;&gt; Prosp &gt;&gt; Sample</div>
                    </th>
                  ))}
                  <th className="bg-[#FFF4DC] text-[#9A6200] px-3 py-2 text-center">
                    <div>TOTAL BULAN</div>
                    <div className="font-mono text-[9px] font-normal text-amber-800/80">Traffic &gt;&gt; Prosp &gt;&gt; Sample</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D5D9E2] bg-white">
                {/* Baris Tiap Sales */}
                {data?.byBusdev.map((b) => (
                  <tr key={b.busdev} className="hover:bg-slate-50 transition">
                    <td className="border-r border-[#D5D9E2] px-4 py-2.5 font-bold text-slate-900 whitespace-nowrap">
                      👤 {b.busdev}
                    </td>
                    {weeks.map((w) => {
                      const m = b.conversion[w.key];
                      return (
                        <td key={w.key} className="border-r border-[#D5D9E2] px-2.5 py-2 text-center font-mono text-[11px] tabular-nums">
                          <span className="font-bold text-slate-900">{m?.traffic ?? 0}</span>
                          <span className="mx-1 text-slate-300">&gt;&gt;</span>
                          <span className="font-bold text-amber-800">{m?.prospecting ?? 0} ({m?.prospectingPct ?? 0}%)</span>
                          <span className="mx-1 text-slate-300">&gt;&gt;</span>
                          <span className="font-bold text-emerald-700">{m?.sample ?? 0}</span>
                        </td>
                      );
                    })}
                    <td className="bg-[#FFFDF7] px-2.5 py-2 text-center font-mono text-[11px] font-bold text-slate-900 tabular-nums">
                      <span>{b.conversion.total.traffic}</span>
                      <span className="mx-1 text-slate-300">&gt;&gt;</span>
                      <span className="text-amber-800">{b.conversion.total.prospecting} ({b.conversion.total.prospectingPct}%)</span>
                      <span className="mx-1 text-slate-300">&gt;&gt;</span>
                      <span className="text-emerald-700">{b.conversion.total.sample}</span>
                    </td>
                  </tr>
                ))}

                {/* Baris Total Blended */}
                <tr className="bg-[#F8F9FB] font-bold border-t-2 border-[#D5D9E2]">
                  <td className="border-r border-[#D5D9E2] px-4 py-3 text-slate-900 whitespace-nowrap">
                    🏆 Blended (Total Seluruh Tim)
                  </td>
                  {weeks.map((w) => {
                    const m = data?.blended.conversion[w.key];
                    return (
                      <td key={w.key} className="border-r border-[#D5D9E2] px-2.5 py-3 text-center font-mono text-xs tabular-nums">
                        <span className="text-slate-900">{m?.traffic ?? 0}</span>
                        <span className="mx-1 text-slate-300">&gt;&gt;</span>
                        <span className="text-amber-800">{m?.prospecting ?? 0} ({m?.prospectingPct ?? 0}%)</span>
                        <span className="mx-1 text-slate-300">&gt;&gt;</span>
                        <span className="text-emerald-700">{m?.sample ?? 0}</span>
                      </td>
                    );
                  })}
                  <td className="bg-[#FFF4DC] text-[#9A6200] px-2.5 py-3 text-center font-mono text-xs font-bold tabular-nums">
                    <span>{data?.blended.conversion.total.traffic ?? 0}</span>
                    <span className="mx-1 text-amber-700/50">&gt;&gt;</span>
                    <span>{data?.blended.conversion.total.prospecting ?? 0} ({data?.blended.conversion.total.prospectingPct ?? 0}%)</span>
                    <span className="mx-1 text-amber-700/50">&gt;&gt;</span>
                    <span>{data?.blended.conversion.total.sample ?? 0}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}

function SubHeaderColumns({ isTotal = false }: { isTotal?: boolean }) {
  return (
    <>
      <th
        className={`px-2 py-1.5 text-right font-mono ${
          isTotal ? "bg-[#FFF4DC] text-[#9A6200]" : "border-r border-[#E5E2DA] bg-[#F8F9FB]"
        }`}
      >
        Count
      </th>
      <th
        className={`px-2 py-1.5 text-right font-mono ${
          isTotal ? "bg-[#FFF4DC] text-[#9A6200]" : "border-r border-[#E5E2DA] bg-[#F8F9FB]"
        }`}
      >
        %
      </th>
      <th
        className={`px-2 py-1.5 text-right font-mono ${
          isTotal ? "bg-[#FFF4DC] text-[#9A6200]" : "border-r border-[#D5D9E2] bg-[#F8F9FB]"
        }`}
      >
        Target
      </th>
    </>
  );
}

function MetricCellTriplet({
  count,
  pct,
  target,
  isGood,
  isTotal = false,
}: {
  count: number;
  pct: number;
  target: number;
  isGood: boolean;
  isTotal?: boolean;
}) {
  return (
    <>
      {/* Count */}
      <td
        className={`px-2 py-2.5 text-right font-mono font-bold tabular-nums ${
          isTotal ? "bg-[#FFFDF7] text-slate-900" : "border-r border-[#EAE7DF]"
        }`}
      >
        {count.toLocaleString("id-ID")}
      </td>

      {/* Percentage with badge */}
      <td
        className={`px-2 py-2.5 text-right font-mono font-bold tabular-nums ${
          isTotal ? "bg-[#FFFDF7]" : "border-r border-[#EAE7DF]"
        }`}
      >
        <span
          className={`inline-block rounded px-1.5 py-0.5 text-[11px] ${
            isGood
              ? "bg-emerald-100 text-emerald-800"
              : count === 0
              ? "text-slate-400 font-normal"
              : "bg-amber-100 text-amber-900"
          }`}
        >
          {pct}%
        </span>
      </td>

      {/* Target KPI */}
      <td
        className={`px-2 py-2.5 text-right font-mono text-slate-500 tabular-nums ${
          isTotal ? "bg-[#FFFDF7] font-semibold" : "border-r border-[#D5D9E2]"
        }`}
      >
        {target.toLocaleString("id-ID")}
      </td>
    </>
  );
}

