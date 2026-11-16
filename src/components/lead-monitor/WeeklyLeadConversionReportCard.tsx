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
import { useMe } from "@/components/lead-monitor/filters";
import { isAdminRole } from "@/lib/crm-stages";

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

interface SourceOverviewRow {
  channel: string;
  label: string;
  traffic: number;
  prospecting: number;
  prospectingPct: number;
  sample: number;
  samplePct: number;
  isTopScaleUp: boolean;
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
  sourceOverview?: SourceOverviewRow[];
  simpleSourceOverview?: { google: number; meta: number; other: number };
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
  const me = useMe();
  const isAdmin = isAdminRole(me?.role);

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [month, setMonth] = useState<string>("2026-11");
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [customStart, setCustomStart] = useState<string>("2026-11-01");
  const [customEnd, setCustomEnd] = useState<string>("2026-11-30");

  const [selectedSales, setSelectedSales] = useState<string>(() => {
    if (!isAdminRole(me?.role)) return me?.name || "all";
    return initialBusdev || "blended";
  });
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"standard" | "matrix" | "daily">("standard");
  const [prospectTargetPct, setProspectTargetPct] = useState<number>(40);
  const [sampleTargetPct, setSampleTargetPct] = useState<number>(30);

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
      subtitle={`Evaluasi konversi mingguan: Target Prospecting ${prospectTargetPct}% dari Traffic · Target Sample ${sampleTargetPct}% dari Target Prospecting`}
      right={
        <div className="flex flex-wrap items-center gap-2">
          {/* Kustomisasi Target % */}
          <div className="flex items-center gap-1.5 rounded-lg border border-[#E5E2DA] bg-[#F8F9FB] px-2 py-1 text-[11px]">
            <span className="font-semibold text-slate-500">Target %:</span>
            <label className="flex items-center gap-0.5 font-mono">
              <span className="text-amber-800 font-bold">Prosp</span>
              <input
                type="number"
                min={1}
                max={100}
                value={prospectTargetPct}
                onChange={(e) => setProspectTargetPct(Math.max(1, Math.min(100, Number(e.target.value) || 40)))}
                className="w-10 rounded border border-[#D5D9E2] bg-white px-1 py-0.5 text-center font-bold text-slate-900 outline-none focus:border-[#D98A00]"
              />
              <span>%</span>
            </label>
            <span className="text-slate-300">·</span>
            <label className="flex items-center gap-0.5 font-mono">
              <span className="text-emerald-800 font-bold">Smpl</span>
              <input
                type="number"
                min={1}
                max={100}
                value={sampleTargetPct}
                onChange={(e) => setSampleTargetPct(Math.max(1, Math.min(100, Number(e.target.value) || 30)))}
                className="w-10 rounded border border-[#D5D9E2] bg-white px-1 py-0.5 text-center font-bold text-slate-900 outline-none focus:border-[#D98A00]"
              />
              <span>%</span>
            </label>
          </div>

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

            {/* Pilihan Tampilan: Standar vs Matriks Tim (Admin) vs Matriks Harian Manual */}
            <div className="flex flex-wrap items-center rounded-xl bg-slate-200/70 p-1 text-[11px] font-semibold">
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
              {isAdmin && (
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
              )}
              <button
                type="button"
                onClick={() => setViewMode("daily")}
                className={`rounded-lg px-2.5 py-1 transition ${
                  viewMode === "daily"
                    ? "bg-[#D98A00] text-white shadow-xs font-bold"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                Matriks Harian (Input Manual)
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

              {isAdmin ? (
                <>
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
                </>
              ) : (
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#D98A00]/10 border border-[#D98A00]/30 px-3 py-1 text-xs font-bold text-[#9A6200]">
                  <span>👤 Laporan Saya: <b>{me.name}</b></span>
                </div>
              )}
            </div>

            {/* Filter Channel (Khusus Head / Admin) */}
            {isAdmin && (
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
            )}
          </div>
        </div>

        {/* OVERVIEW SUMBER PROSPECT LEADS (UNTUK REKOMENDASI SCALE-UP BUDGET) */}
        {isAdmin && data?.sourceOverview && data.sourceOverview.length > 0 && (
          <div className="rounded-xl border border-[#ECEAE4] bg-white p-3.5">
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#D98A00]" />
                <span className="text-xs font-bold text-slate-900">
                  Sumber Prospect Leads Terbanyak (Panduan Scale-Up Budget)
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Klik kartu channel untuk memfilter tabel di bawah
              </span>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
              {data.sourceOverview.map((src) => {
                const isSelected = selectedChannel === src.channel;
                return (
                  <button
                    key={src.channel}
                    type="button"
                    onClick={() =>
                      setSelectedChannel((prev) => (prev === src.channel ? "all" : src.channel))
                    }
                    className={`relative text-left rounded-xl border p-3 transition ${
                      isSelected
                        ? "border-[#D98A00] bg-[#FFFDF7] ring-2 ring-[#D98A00]/20"
                        : src.isTopScaleUp
                        ? "border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/70"
                        : "border-[#ECEAE4] bg-[#FAFAF8] hover:bg-slate-50"
                    }`}
                  >
                    {src.isTopScaleUp && (
                      <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                        Rekomendasi Scale-Up
                      </span>
                    )}
                    <div className="text-xs font-bold text-slate-900 truncate">{src.label}</div>
                    <div className="mt-2 grid grid-cols-3 gap-1 text-[10px]">
                      <div>
                        <div className="text-slate-400">Traffic</div>
                        <div className="font-mono font-bold text-slate-800">{src.traffic}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Prospect</div>
                        <div className="font-mono font-bold text-[#9A6200]">
                          {src.prospecting} <span className="text-[9px] text-slate-500">({src.prospectingPct}%)</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400">Sample</div>
                        <div className="font-mono font-bold text-emerald-700">
                          {src.sample}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* OVERVIEW SEDERHANA UNTUK BUSDEV: Google, Meta, Lainnya */}
        {!isAdmin && data?.simpleSourceOverview && (
          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Google</div>
              <div className="mt-1 font-mono text-xl font-bold text-slate-900">
                {data.simpleSourceOverview.google.toLocaleString("id-ID")}
              </div>
              <div className="text-[10px] text-slate-500">Leads dari Google</div>
            </div>
            <div className="rounded-xl border border-blue-200/80 bg-blue-50/40 p-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800">Meta</div>
              <div className="mt-1 font-mono text-xl font-bold text-slate-900">
                {data.simpleSourceOverview.meta.toLocaleString("id-ID")}
              </div>
              <div className="text-[10px] text-slate-500">Leads dari Meta</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Lainnya</div>
              <div className="mt-1 font-mono text-xl font-bold text-slate-900">
                {data.simpleSourceOverview.other.toLocaleString("id-ID")}
              </div>
              <div className="text-[10px] text-slate-500">Medsos / Direct / Lain</div>
            </div>
          </div>
        )}

        {/* TAMPILAN 3: Matriks Harian Manual & Mingguan (Total Week 1, Week 2 + Growth %) */}
        {viewMode === "daily" && (
          <DailyManualMetricsSection
            month={month}
            isCustomDate={isCustomDate}
            customStart={customStart}
            customEnd={customEnd}
            isAdmin={isAdmin}
            myName={me.name}
            onSaved={() => loadReport()}
          />
        )}

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

                {/* BARIS 2: PROSPECTING (TARGET CUSTOM %) */}
                <tr className="hover:bg-amber-50/20 transition">
                  <td className="border-r border-[#D5D9E2] px-4 py-3 font-bold text-slate-900 whitespace-nowrap bg-[#FDFCFB]">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-2 w-2 rounded-full bg-[#D98A00]" />
                      <span>2. Prospecting (<b className="text-amber-800">{prospectTargetPct}%</b>)</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      Warm + Hot (Lolos Kualifikasi MOQ &ge; 500 pcs)
                    </div>
                  </td>

                  {weeks.map((w) => {
                    const m = activeConversionMap ? activeConversionMap[w.key] : null;
                    const target = Math.round((m?.traffic ?? 0) * (prospectTargetPct / 100));
                    const pass = (m?.prospectingPct ?? 0) >= prospectTargetPct;
                    return (
                      <MetricCellTriplet
                        key={w.key}
                        count={m?.prospecting ?? 0}
                        pct={m?.prospectingPct ?? 0}
                        target={target}
                        isGood={pass}
                      />
                    );
                  })}

                  {/* Total Prospecting */}
                  <MetricCellTriplet
                    count={activeConversionMap?.total.prospecting ?? 0}
                    pct={activeConversionMap?.total.prospectingPct ?? 0}
                    target={Math.round((activeConversionMap?.total.traffic ?? 0) * (prospectTargetPct / 100))}
                    isGood={(activeConversionMap?.total.prospectingPct ?? 0) >= prospectTargetPct}
                    isTotal
                  />
                </tr>

                {/* BARIS 3: SAMPLE (TARGET CUSTOM %) */}
                <tr className="hover:bg-emerald-50/20 transition">
                  <td className="border-r border-[#D5D9E2] px-4 py-3 font-bold text-slate-900 whitespace-nowrap bg-[#FDFCFB]">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-600" />
                      <span>3. Sample (<b className="text-emerald-800">{sampleTargetPct}%</b>)</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      Tahap Pembuatan Sampel Formula / Deal
                    </div>
                  </td>

                  {weeks.map((w) => {
                    const m = activeConversionMap ? activeConversionMap[w.key] : null;
                    const pTarget = Math.round((m?.traffic ?? 0) * (prospectTargetPct / 100));
                    const sTarget = Math.round(pTarget * (sampleTargetPct / 100));
                    const pass = (m?.samplePct ?? 0) >= sampleTargetPct;
                    return (
                      <MetricCellTriplet
                        key={w.key}
                        count={m?.sample ?? 0}
                        pct={m?.samplePct ?? 0}
                        target={sTarget}
                        isGood={pass}
                      />
                    );
                  })}

                  {/* Total Sample */}
                  <MetricCellTriplet
                    count={activeConversionMap?.total.sample ?? 0}
                    pct={activeConversionMap?.total.samplePct ?? 0}
                    target={Math.round(
                      Math.round((activeConversionMap?.total.traffic ?? 0) * (prospectTargetPct / 100)) *
                        (sampleTargetPct / 100)
                    )}
                    isGood={(activeConversionMap?.total.samplePct ?? 0) >= sampleTargetPct}
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

interface DailyCounts {
  traffic: number;
  cold: number;
  warm: number;
  hot: number;
  sample: number;
}

interface DailyEntry {
  auto: DailyCounts;
  manual: (DailyCounts & { updatedBy: string | null; updatedAt: string }) | null;
  effective: DailyCounts;
}

interface DailyRow {
  date: string;
  byBusdev: Record<string, DailyEntry>;
}

function DailyManualMetricsSection({
  month,
  isCustomDate,
  customStart,
  customEnd,
  isAdmin,
  myName,
  onSaved,
}: {
  month: string;
  isCustomDate: boolean;
  customStart: string;
  customEnd: string;
  isAdmin: boolean;
  myName: string;
  onSaved: () => void;
}) {
  const [rows, setRows] = useState<DailyRow[]>([]);
  const [busdevNames, setBusdevNames] = useState<string[]>([]);
  const [selectedBusdev, setSelectedBusdev] = useState<string>(isAdmin ? "" : myName);
  const [drafts, setDrafts] = useState<Record<string, DailyCounts>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const loadDaily = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const qs = new URLSearchParams();
      if (isCustomDate) {
        qs.set("startDate", customStart);
        qs.set("endDate", customEnd);
      } else {
        qs.set("month", month);
      }
      const res = await fetch(`/api/crm/reports/daily-metrics?${qs.toString()}`, { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json.error || `Gagal memuat data harian (${res.status})`);
      }
      const loadedRows: DailyRow[] = json.days || [];
      const names: string[] = json.busdevNames || [];
      setRows(loadedRows);
      setBusdevNames(names);
      setSelectedBusdev((prev) => (prev && names.includes(prev) ? prev : names[0] || ""));

      const nextDrafts: Record<string, DailyCounts> = {};
      for (const r of loadedRows) {
        for (const b of names) {
          const eff = r.byBusdev[b]?.effective ?? { traffic: 0, cold: 0, warm: 0, hot: 0, sample: 0 };
          nextDrafts[`${r.date}__${b}`] = { ...eff };
        }
      }
      setDrafts(nextDrafts);
    } catch (e: any) {
      setErr(e?.message || "Gagal memuat data harian");
    } finally {
      setLoading(false);
    }
  }, [month, isCustomDate, customStart, customEnd]);

  useEffect(() => {
    loadDaily();
  }, [loadDaily]);

  const [dirtyKeys, setDirtyKeys] = useState<Record<string, boolean>>({});

  const updateCell = (date: string, busdev: string, field: keyof DailyCounts, val: string) => {
    const num = Math.max(0, parseInt(val.replace(/[^0-9]/g, "") || "0", 10) || 0);
    const key = `${date}__${busdev}`;
    setDrafts((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || { traffic: 0, cold: 0, warm: 0, hot: 0, sample: 0 }),
        [field]: num,
      },
    }));
    setDirtyKeys((prev) => ({ ...prev, [key]: true }));
  };

  const handleSaveAll = async () => {
    const keysToSave = Object.keys(dirtyKeys).filter((k) => dirtyKeys[k]);
    if (keysToSave.length === 0) {
      setMsg("Tidak ada perubahan untuk disimpan.");
      setTimeout(() => setMsg(null), 2500);
      return;
    }
    setSaving(true);
    setErr(null);
    setMsg(null);
    try {
      const entries = keysToSave.map((k) => {
        const [date, busdev] = k.split("__");
        const d = drafts[k] || { traffic: 0, cold: 0, warm: 0, hot: 0, sample: 0 };
        return { date, busdev, ...d };
      });
      const res = await fetch("/api/crm/reports/daily-metrics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json.error || `Gagal menyimpan (${res.status})`);
      }
      setDirtyKeys({});
      setMsg(`Tersimpan ${entries.length} baris harian. Laporan Week 1–4 telah dihitung ulang.`);
      await loadDaily();
      onSaved();
      setTimeout(() => setMsg(null), 4000);
    } catch (e: any) {
      setErr(e?.message || "Gagal menyimpan data harian");
    } finally {
      setSaving(false);
    }
  };

  const handleResetRow = async (date: string, busdev: string) => {
    setSaving(true);
    setErr(null);
    try {
      const res = await fetch("/api/crm/reports/daily-metrics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset", date, busdev }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.error || "Gagal reset");
      setDirtyKeys((prev) => {
        const next = { ...prev };
        delete next[`${date}__${busdev}`];
        return next;
      });
      await loadDaily();
      onSaved();
    } catch (e: any) {
      setErr(e?.message || "Gagal reset ke Auto");
    } finally {
      setSaving(false);
    }
  };

  const activeSales = isAdmin ? (selectedBusdev || busdevNames[0] || "") : myName;

  // Kelompokkan baris harian ke Week 1 (1-7), Week 2 (8-14), Week 3 (15-21), Week 4 (22-28), Week 5 (29+)
  const weekGroups = useMemo(() => {
    const groups: { weekIndex: number; label: string; days: DailyRow[]; totals: DailyCounts }[] = [
      { weekIndex: 1, label: "Total Week 1", days: [], totals: { traffic: 0, cold: 0, warm: 0, hot: 0, sample: 0 } },
      { weekIndex: 2, label: "Total Week 2", days: [], totals: { traffic: 0, cold: 0, warm: 0, hot: 0, sample: 0 } },
      { weekIndex: 3, label: "Total Week 3", days: [], totals: { traffic: 0, cold: 0, warm: 0, hot: 0, sample: 0 } },
      { weekIndex: 4, label: "Total Week 4", days: [], totals: { traffic: 0, cold: 0, warm: 0, hot: 0, sample: 0 } },
      { weekIndex: 5, label: "Total Week 5", days: [], totals: { traffic: 0, cold: 0, warm: 0, hot: 0, sample: 0 } },
    ];
    for (const r of rows) {
      const dayNum = parseInt(r.date.slice(8, 10), 10) || 1;
      const wIdx = dayNum <= 7 ? 0 : dayNum <= 14 ? 1 : dayNum <= 21 ? 2 : dayNum <= 28 ? 3 : 4;
      groups[wIdx].days.push(r);
      const entry = r.byBusdev[activeSales];
      const d = drafts[`${r.date}__${activeSales}`] || entry?.effective;
      if (d) {
        groups[wIdx].totals.traffic += d.traffic;
        groups[wIdx].totals.cold += d.cold;
        groups[wIdx].totals.warm += d.warm;
        groups[wIdx].totals.hot += d.hot;
        groups[wIdx].totals.sample += d.sample;
      }
    }
    return groups.filter((g) => g.days.length > 0);
  }, [rows, drafts, activeSales]);

  const totals = useMemo(() => {
    const t = { traffic: 0, cold: 0, warm: 0, hot: 0, sample: 0 };
    for (const g of weekGroups) {
      t.traffic += g.totals.traffic;
      t.cold += g.totals.cold;
      t.warm += g.totals.warm;
      t.hot += g.totals.hot;
      t.sample += g.totals.sample;
    }
    return t;
  }, [weekGroups]);

  const dirtyCount = Object.values(dirtyKeys).filter(Boolean).length;

  const formatGrowth = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? "+100%" : "–";
    const pct = Math.round(((curr - prev) / prev) * 100);
    return `${pct > 0 ? "+" : ""}${pct}%`;
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs">
        <div>
          <div className="font-bold text-amber-950">
            Matriks Harian &amp; Mingguan ({activeSales}) — Input Manual + Cross-Check
          </div>
          <div className="text-[11px] text-amber-900">
            Isi / koreksi angka harian (<b>Traffic, Cold, Warm, Hot, Sample</b>). Total Week 1–4, Growth %, dan Laporan Konversi otomatis terhitung ulang.
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <div className="flex items-center rounded-lg bg-white p-0.5 border border-amber-200">
              {busdevNames.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedBusdev(name)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                    activeSales === name
                      ? "bg-[#D98A00] text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving || dirtyCount === 0}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-40 transition"
          >
            <Check className="h-3.5 w-3.5" />
            <span>{saving ? "Menyimpan..." : `Simpan Perubahan${dirtyCount > 0 ? ` (${dirtyCount})` : ""}`}</span>
          </button>
        </div>
      </div>

      {err && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
          {err}
        </div>
      )}
      {msg && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
          {msg}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-[#D5D9E2]">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#D5D9E2] bg-blue-100/70 text-[11px] font-bold text-slate-900">
              <th className="px-3 py-2.5 text-left">Matriks ({activeSales})</th>
              <th className="px-2 py-2.5 text-center">Traffic</th>
              <th className="px-2 py-2.5 text-center">Cold</th>
              <th className="px-2 py-2.5 text-center">Warm</th>
              <th className="px-2 py-2.5 text-center">Hot</th>
              <th className="px-2 py-2.5 text-center bg-emerald-100/70 text-emerald-950">Sample</th>
              <th className="px-3 py-2.5 text-center">Status / Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECEAE4]">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  Memuat data harian...
                </td>
              </tr>
            ) : (
              weekGroups.map((grp, gIdx) => {
                const prevGrp = gIdx > 0 ? weekGroups[gIdx - 1] : null;
                const fields: (keyof DailyCounts)[] = ["traffic", "cold", "warm", "hot", "sample"];

                return (
                  <FragmentGroup key={grp.weekIndex}>
                    {grp.days.map((r) => {
                      const entry = r.byBusdev[activeSales];
                      if (!entry) return null;
                      const key = `${r.date}__${activeSales}`;
                      const d = drafts[key] || entry.effective;
                      const isManual = !!entry.manual;
                      const isDirty = !!dirtyKeys[key];

                      return (
                        <tr
                          key={r.date}
                          className={`transition-colors ${
                            isDirty
                              ? "bg-amber-50/70"
                              : isManual
                              ? "bg-sky-50/30"
                              : "hover:bg-slate-50/70"
                          }`}
                        >
                          <td className="px-3 py-2 font-mono text-[11px] font-semibold text-slate-800 whitespace-nowrap">
                            {r.date}
                          </td>
                          {fields.map((fld) => (
                            <td key={fld} className={`px-2 py-1.5 text-center ${fld === "sample" ? "bg-emerald-50/30" : ""}`}>
                              <input
                                type="number"
                                min={0}
                                value={d[fld]}
                                onChange={(e) => updateCell(r.date, activeSales, fld, e.target.value)}
                                className="h-7 w-16 rounded border border-[#D5D9E2] bg-white px-1.5 text-center font-mono text-xs font-bold text-slate-900 focus:border-[#D98A00] focus:outline-none"
                              />
                              <div className="mt-0.5 font-mono text-[9px] text-slate-400">
                                Auto: {entry.auto[fld]}
                              </div>
                            </td>
                          ))}
                          <td className="px-3 py-1.5 text-center whitespace-nowrap">
                            {isManual ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-900">
                                  Manual
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleResetRow(r.date, activeSales)}
                                  className="text-[10px] text-slate-500 underline hover:text-slate-800"
                                  title="Hapus input manual dan gunakan hitungan otomatis sistem"
                                >
                                  Reset Auto
                                </button>
                              </div>
                            ) : (
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                                Auto (Sistem)
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Baris Total Week X (Kuning seperti Excel) */}
                    <tr className="border-y-2 border-amber-300 bg-[#FEF08A]/80 font-mono text-xs font-bold text-slate-950">
                      <td className="px-3 py-2 font-sans">{grp.label}</td>
                      {fields.map((fld) => (
                        <td key={fld} className="px-2 py-2 text-center tabular-nums">
                          {grp.totals[fld].toLocaleString("id-ID")}
                        </td>
                      ))}
                      <td className="px-3 py-2 text-center font-sans text-[10px] text-amber-950">
                        Prospect: {(grp.totals.warm + grp.totals.hot).toLocaleString("id-ID")}
                      </td>
                    </tr>

                    {/* Baris Growth % (Peach seperti Excel, untuk Week 2 ke atas) */}
                    {prevGrp && (
                      <tr className="border-b-2 border-[#D5D9E2] bg-[#FFEDD5]/80 font-mono text-[11px] font-semibold text-slate-800">
                        <td className="px-3 py-1.5 font-sans">Growth %</td>
                        {fields.map((fld) => {
                          const gText = formatGrowth(grp.totals[fld], prevGrp.totals[fld]);
                          const isPos = gText.startsWith("+");
                          const isNeg = gText.startsWith("-");
                          return (
                            <td
                              key={fld}
                              className={`px-2 py-1.5 text-center tabular-nums ${
                                isPos ? "text-emerald-700 font-bold" : isNeg ? "text-rose-700" : "text-slate-500"
                              }`}
                            >
                              {gText}
                            </td>
                          );
                        })}
                        <td className="px-3 py-1.5 text-center font-sans text-[10px] text-slate-500">
                          vs Week {prevGrp.weekIndex}
                        </td>
                      </tr>
                    )}
                  </FragmentGroup>
                );
              })
            )}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-400 bg-[#FFFDF7] font-mono text-xs font-bold text-slate-950">
              <td className="px-3 py-2.5 font-sans">TOTAL BULAN ({activeSales})</td>
              <td className="px-2 py-2.5 text-center">{totals.traffic.toLocaleString("id-ID")}</td>
              <td className="px-2 py-2.5 text-center">{totals.cold.toLocaleString("id-ID")}</td>
              <td className="px-2 py-2.5 text-center">{totals.warm.toLocaleString("id-ID")}</td>
              <td className="px-2 py-2.5 text-center">{totals.hot.toLocaleString("id-ID")}</td>
              <td className="px-2 py-2.5 text-center text-emerald-700">{totals.sample.toLocaleString("id-ID")}</td>
              <td className="px-3 py-2.5 text-center font-sans text-[10px] text-slate-600">
                Prospecting: {(totals.warm + totals.hot).toLocaleString("id-ID")}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function FragmentGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

