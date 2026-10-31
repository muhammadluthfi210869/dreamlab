"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HelpCircle, MessageSquare, Phone, RefreshCw, Target } from "lucide-react";
import { BRAND, Card, KpiCard, Pill } from "@/components/lead-monitor/ui";
import {
  BusdevBars,
  FairnessPill,
  HBarList,
  HourChart,
  TrendChart,
  type BusdevRow,
  type DayPoint,
  type FairnessInfo,
  type GroupRow,
} from "@/components/lead-monitor/charts";
import { ReferrerCard, RR_LABEL, TopLeadsCard, type ReferrerRankRow, type TopLeadRow } from "@/components/lead-monitor/panels";
import { FilterToolbar, useFilters } from "@/components/lead-monitor/filters";

const REFRESH_MS = 20_000;

interface Kpi {
  totalClicks: number;
  chat: number;
  dropoff: number;
  direct: number;
  moqMet: number;
}

import type { MoqOverview, ChannelFunnelsOverview } from "@/lib/lead-monitor-stats";

interface ApiData {
  period: { startDate: string; endDate: string; days: number; hasPrevious: boolean };
  kpi: { current: Kpi; previous: Kpi | null; delta: { totalClicks: number | null; chat: number | null; dropoff: number | null; moqMet: number | null } | null };
  busdevs: BusdevRow[];
  inactiveBusdevs: { names: string[]; chat: number; clicks: number };
  fairness: FairnessInfo;
  daily: DayPoint[];
  hourly: { hour: number; chat: number }[];
  hourlyClicks: { hour: number; klik: number; chat: number }[];
  sources: GroupRow[];
  pages: GroupRow[];
  topLeads: TopLeadRow[];
  referrers: ReferrerRankRow[];
  moqOverview?: MoqOverview;
  channelFunnels?: ChannelFunnelsOverview;
  rrMode: string | null;
  meta: { rawRows: number; rawCapped: boolean; serverTime: string };
}

export default function DashboardPage() {
  const f = useFilters();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const reqId = useRef(0);

  const query = useMemo(
    () => new URLSearchParams({ startDate: f.startDate, endDate: f.endDate, busdev: f.busdev, light: "1", pageSize: "5" }),
    [f.startDate, f.endDate, f.busdev]
  );

  const load = useCallback(
    async (manual = false) => {
      const id = ++reqId.current;
      if (manual) setRefreshing(true);
      try {
        const res = await fetch(`/api/lead-monitor/stats?${query.toString()}`, { cache: "no-store" });
        if (res.status === 401) {
          window.location.href = "/lead-monitor/masuk"; // sesi habis / dicabut
          return;
        }
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.success) throw new Error(json.error || `Server status ${res.status}`);
        if (id !== reqId.current) return; // respons usang
        setData(json as ApiData);
        setError(null);
        setUpdatedAt(new Date());
      } catch (e: any) {
        if (id !== reqId.current) return;
        setError(e?.message || "Gagal terhubung ke server");
      } finally {
        if (id === reqId.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [query]
  );

  useEffect(() => {
    if (!f.ready) return;
    setLoading(true);
    load();
  }, [load, f.ready]);

  useEffect(() => {
    if (!autoRefresh || !f.ready) return;
    const t = setInterval(() => load(), REFRESH_MS);
    return () => clearInterval(t);
  }, [autoRefresh, load, f.ready]);

  const k = data?.kpi.current;
  const d = data?.kpi.delta;
  const busdevNames = useMemo(() => (data?.busdevs ?? []).map((b) => b.name), [data?.busdevs]);
  const fmtTime = (dt: Date | null) =>
    dt ? dt.toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " WIB" : "—";

  return (
    <div>
      <header className="border-b border-[#ECEAE4] bg-white/90 backdrop-blur lg:sticky lg:top-0 lg:z-30">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
          <div>
            <h1 className="text-[17px] font-semibold leading-tight text-slate-900">Dashboard</h1>
            <p className="text-xs text-slate-500">Performa lead dan chat WhatsApp Dreamlab</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAutoRefresh((v) => !v)}
              title={autoRefresh ? "Memperbarui otomatis tiap 20 detik" : "Pembaruan otomatis dijeda"}
              className={`hidden h-9 items-center gap-2 rounded-lg border px-3 text-xs font-medium sm:inline-flex ${autoRefresh ? "border-[#F0D9A8] bg-[#FFF4DC] text-[#9A6200]" : "border-[#E5E2DA] bg-white text-slate-500"}`}
            >
              <span className={`h-2 w-2 rounded-full ${autoRefresh ? "animate-pulse bg-[#D98A00]" : "bg-slate-300"}`} />
              {autoRefresh ? "Live" : "Dijeda"}
            </button>
            <span className="hidden font-mono text-[11px] text-slate-400 md:inline">{fmtTime(updatedAt)}</span>
            <button
              type="button"
              onClick={() => load(true)}
              disabled={refreshing}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E5E2DA] bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} style={{ color: BRAND }} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 sm:px-6">
        {error && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
            <span className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>
                <b>Gagal memuat data:</b> {error}. Mencoba lagi otomatis.
              </span>
            </span>
            <button type="button" onClick={() => load(true)} className="shrink-0 rounded-md bg-amber-600 px-2.5 py-1 font-semibold text-white hover:bg-amber-700">
              Coba sekarang
            </button>
          </div>
        )}

        <FilterToolbar
          busdevNames={busdevNames}
          right={<p className="hidden text-[11px] text-slate-400 lg:block">Data dihitung sejak 06 Okt 2026 (sistem pelacakan terpadu). Zona waktu WIB.</p>}
        />

        {/* KPI */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard
            label="Total Klik CTA"
            icon={<Phone className="h-4 w-4" />}
            value={k?.totalClicks ?? "–"}
            caption="Prospek unik yang klik tombol WhatsApp"
            delta={d?.totalClicks}
            hint="Satu prospek = satu nomor. Klik berulang dari nomor sama dalam 24 jam dihitung sekali. Total klik = Chat Masuk + Drop-off."
          />
          <KpiCard
            label="Chat Masuk"
            icon={<MessageSquare className="h-4 w-4" />}
            value={k?.chat ?? "–"}
            caption={k && k.direct > 0 ? `Sudah kirim chat · +${k.direct} chat langsung` : "Sudah kirim chat"}
            delta={d?.chat}
            tone="brand"
            hint="Prospek dari klik CTA yang pesan pertamanya (berkode) sudah diterima. Chat langsung ke nomor tanpa klik dihitung terpisah."
          />
          <KpiCard
            label="Drop-off"
            icon={<HelpCircle className="h-4 w-4" />}
            value={k?.dropoff ?? "–"}
            caption="Klik, tapi belum kirim chat"
            delta={d?.dropoff}
            invertDelta
            hint="Termasuk yang sudah mengisi form tetapi belum mengirim chat."
          />
          <KpiCard
            label="Memenuhi MOQ"
            icon={<Target className="h-4 w-4" />}
            value={k?.moqMet ?? "–"}
            caption="Rencana produksi 500 pcs ke atas"
            delta={d?.moqMet}
            hint="Dari isian form atau MOQ yang diisi manual oleh busdev (isian manual yang dipakai bila ada)."
          />
        </div>

        {/* Overview Sebaran MOQ & Sumber Traffic Terbanyak */}
        {data?.moqOverview && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ECEAE4] pb-2">
              <div>
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <span>Overview Sebaran MOQ & Sumber Lead</span>
                  <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                    Kualifikasi Produksi
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Analisis sebaran volume rencana produksi (MOQ) dan asal sumber / landing page penyumbang MOQ terbanyak
                </p>
              </div>
              <div className="sm:text-right">
                <span className="font-mono text-xs font-semibold text-slate-700">
                  Total Potensi MOQ: {data.moqOverview.totalPcs.toLocaleString("id-ID")} pcs
                </span>
                <div className="text-[10px] text-slate-400">
                  dari {data.moqOverview.totalWithMoq} prospek terkualifikasi form
                </div>
              </div>
            </div>

            {/* 4 Cards: Sebaran Tier MOQ */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {/* 1.000+ pcs */}
              <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/70 via-white to-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">MOQ 1.000+ pcs</span>
                  <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-[10px] font-bold font-mono">
                    {data.moqOverview.distribution.moq1000.pct}%
                  </span>
                </div>
                <div className="text-2xl font-bold tracking-tight text-blue-900">
                  {data.moqOverview.distribution.moq1000.count.toLocaleString("id-ID")}
                  <span className="text-xs font-normal text-blue-600 ml-1">lead</span>
                </div>
                <div className="mt-1 text-xs text-blue-700 font-semibold font-mono">
                  {data.moqOverview.distribution.moq1000.totalPcs.toLocaleString("id-ID")} pcs
                </div>
                <div className="mt-0.5 text-[10px] text-slate-400">Growth / Scale / Enterprise</div>
              </div>

              {/* 500 pcs */}
              <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/70 via-white to-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">MOQ 500 pcs</span>
                  <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold font-mono">
                    {data.moqOverview.distribution.moq500.pct}%
                  </span>
                </div>
                <div className="text-2xl font-bold tracking-tight text-amber-900">
                  {data.moqOverview.distribution.moq500.count.toLocaleString("id-ID")}
                  <span className="text-xs font-normal text-amber-600 ml-1">lead</span>
                </div>
                <div className="mt-1 text-xs text-amber-700 font-semibold font-mono">
                  {data.moqOverview.distribution.moq500.totalPcs.toLocaleString("id-ID")} pcs
                </div>
                <div className="mt-0.5 text-[10px] text-slate-400">Starter Brand standard</div>
              </div>

              {/* < 500 pcs */}
              <div className="rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50/70 via-white to-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">MOQ &lt; 500 pcs</span>
                  <span className="rounded-full bg-rose-100 text-rose-800 px-2 py-0.5 text-[10px] font-bold font-mono">
                    {data.moqOverview.distribution.below500.pct}%
                  </span>
                </div>
                <div className="text-2xl font-bold tracking-tight text-rose-900">
                  {data.moqOverview.distribution.below500.count.toLocaleString("id-ID")}
                  <span className="text-xs font-normal text-rose-600 ml-1">lead</span>
                </div>
                <div className="mt-1 text-xs text-rose-700 font-semibold font-mono">
                  {data.moqOverview.distribution.below500.totalPcs.toLocaleString("id-ID")} pcs
                </div>
                <div className="mt-0.5 text-[10px] text-slate-400">Di bawah MOQ standar</div>
              </div>

              {/* Tanpa Form */}
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tanpa Form</span>
                  <span className="rounded-full bg-slate-200 text-slate-700 px-2 py-0.5 text-[10px] font-bold font-mono">
                    {data.moqOverview.distribution.noForm.pct}%
                  </span>
                </div>
                <div className="text-2xl font-bold tracking-tight text-slate-800">
                  {data.moqOverview.distribution.noForm.count.toLocaleString("id-ID")}
                  <span className="text-xs font-normal text-slate-500 ml-1">lead</span>
                </div>
                <div className="mt-1 text-xs text-slate-500 font-medium">Klik & chat langsung</div>
                <div className="mt-0.5 text-[10px] text-slate-400">Belum isi form kualifikasi</div>
              </div>
            </div>

            {/* 2 Comparative Panels: Source MOQ Terbanyak & Asal Landing Page Terbanyak */}
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Sumber / Campaign */}
              <Card
                title="Sumber & Iklan MOQ Terbanyak"
                subtitle="Peringkat sumber / campaign iklan berdasarkan volume MOQ (pcs) dan lead yang lolos MOQ"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#ECEAE4] text-[11px] font-semibold text-slate-400">
                        <th className="pb-2.5">Sumber / Iklan</th>
                        <th className="pb-2.5 text-right">Lolos MOQ</th>
                        <th className="pb-2.5 text-right">Total MOQ</th>
                        <th className="pb-2.5 text-right">% Lolos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1EFEA]">
                      {data.moqOverview.topSourcesByMoq.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-slate-400">Belum ada data sumber.</td>
                        </tr>
                      ) : (
                        data.moqOverview.topSourcesByMoq.map((s, idx) => (
                          <tr key={s.source} className="hover:bg-slate-50/80">
                            <td className="py-2.5 pr-2">
                              <div className="flex items-center gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 font-mono text-[10px] font-bold text-slate-500">
                                  {idx + 1}
                                </span>
                                <span className="font-semibold text-slate-800 truncate max-w-[200px]" title={s.source}>
                                  {s.source}
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 text-right font-mono font-medium text-slate-700">
                              {s.moqQualifiedLeads} <span className="text-[10px] text-slate-400">/ {s.totalLeads}</span>
                            </td>
                            <td className="py-2.5 text-right font-mono font-bold text-[#D98A00]">
                              {s.totalPcs.toLocaleString("id-ID")} pcs
                            </td>
                            <td className="py-2.5 text-right font-mono font-semibold text-emerald-600">
                              {s.pctQualified}%
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Asal Landing Page & Referrer */}
              <Card
                title="Berasal Dari Mana (Landing Page / Referrer)"
                subtitle="Halaman landing & referensi asal yang paling banyak mendatangkan prospek berminat MOQ tinggi"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#ECEAE4] text-[11px] font-semibold text-slate-400">
                        <th className="pb-2.5">Halaman / Asal</th>
                        <th className="pb-2.5 text-right">Lolos MOQ</th>
                        <th className="pb-2.5 text-right">Total MOQ</th>
                        <th className="pb-2.5 text-right">Skala Dominan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1EFEA]">
                      {data.moqOverview.topOriginsByMoq.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-slate-400">Belum ada data halaman asal.</td>
                        </tr>
                      ) : (
                        data.moqOverview.topOriginsByMoq.map((o, idx) => (
                          <tr key={o.origin} className="hover:bg-slate-50/80">
                            <td className="py-2.5 pr-2">
                              <div className="flex items-center gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 font-mono text-[10px] font-bold text-slate-500">
                                  {idx + 1}
                                </span>
                                <span className="font-semibold text-slate-800 truncate max-w-[200px]" title={o.origin}>
                                  {o.origin}
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 text-right font-mono font-medium text-slate-700">
                              {o.moqQualifiedLeads} <span className="text-[10px] text-slate-400">/ {o.totalLeads}</span>
                            </td>
                            <td className="py-2.5 text-right font-mono font-bold text-[#D98A00]">
                              {o.totalPcs.toLocaleString("id-ID")} pcs
                            </td>
                            <td className="py-2.5 text-right">
                              <span className="rounded-full bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-700 border border-blue-200">
                                {o.topTier}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Funnel per BusDev: Meta Ads vs Google Ads (Traffic >> MOQ >> Sample) */}
        {data?.channelFunnels && (
          <Card
            title="Funnel per BusDev: Meta Ads vs Google Ads"
            subtitle="Pantau alur konversi setiap BusDev dari Traffic iklan >> Lolos MOQ (>= 500 pcs) >> Masuk tahap Sample"
            right={
              <div className="hidden sm:flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-1 font-semibold text-blue-700 border border-blue-200">
                  <span className="h-2 w-2 rounded-full bg-blue-600" /> Meta Ads
                </span>
                <span className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 font-semibold text-emerald-700 border border-emerald-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" /> Google &amp; Google Ads
                </span>
              </div>
            }
          >
            <div className="space-y-4">
              {/* Cards per BusDev */}
              <div className="grid gap-4 md:grid-cols-3">
                {data.channelFunnels.byBusdev.map((b) => (
                  <div
                    key={b.name}
                    className="rounded-xl border border-[#ECEAE4] bg-[#FAFAF8] p-4 shadow-xs hover:border-[#D98A00]/40 transition"
                  >
                    {/* Header BusDev */}
                    <div className="flex items-center justify-between border-b border-[#ECEAE4] pb-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D98A00] text-white text-xs font-bold shadow-xs">
                          {b.name.charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{b.name}</div>
                          <div className="text-[10px] text-slate-400">Tim Sales BusDev</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-xs font-bold text-slate-800">
                          {b.totalTraffic} <span className="text-[10px] font-normal text-slate-400">lead</span>
                        </div>
                        <div className="text-[10px] font-semibold text-amber-700 font-mono">
                          {b.totalMoq} lolos MOQ
                        </div>
                      </div>
                    </div>

                    {/* Meta Ads Funnel */}
                    <div className="mb-3 rounded-lg border border-blue-100 bg-white p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-blue-800 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                          Meta Ads
                        </span>
                        <span className="font-mono text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                          {b.meta.traffic > 0 ? `${b.meta.moqRate}% lolos` : "0%"}
                        </span>
                      </div>

                      {/* Step Progression: Traffic >> MOQ >> Sample */}
                      <div className="grid grid-cols-3 gap-1.5 text-center">
                        <div className="rounded-md bg-slate-50 p-1.5">
                          <div className="text-[9px] font-medium text-slate-400 uppercase">Traffic</div>
                          <div className="font-mono text-xs font-bold text-slate-800">{b.meta.traffic}</div>
                        </div>
                        <div className="flex flex-col justify-center items-center rounded-md bg-amber-50/60 p-1.5">
                          <div className="text-[9px] font-medium text-amber-800 uppercase">MOQ &ge;500</div>
                          <div className="font-mono text-xs font-bold text-amber-700">{b.meta.moq}</div>
                        </div>
                        <div className="rounded-md bg-emerald-50/80 p-1.5">
                          <div className="text-[9px] font-medium text-emerald-700 uppercase">Sample</div>
                          <div className="font-mono text-xs font-bold text-emerald-800">{b.meta.sample}</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-2.5 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="bg-blue-500 transition-all"
                          style={{ width: `${b.meta.traffic > 0 ? Math.min(100, (b.meta.traffic / (b.totalTraffic || 1)) * 100) : 0}%` }}
                          title={`Traffic Meta: ${b.meta.traffic}`}
                        />
                        <div
                          className="bg-amber-500 transition-all"
                          style={{ width: `${b.meta.traffic > 0 ? Math.min(100, (b.meta.moq / b.meta.traffic) * 100) : 0}%` }}
                          title={`MOQ Meta: ${b.meta.moq}`}
                        />
                        <div
                          className="bg-emerald-500 transition-all"
                          style={{ width: `${b.meta.moq > 0 ? Math.min(100, (b.meta.sample / b.meta.moq) * 100) : 0}%` }}
                          title={`Sample Meta: ${b.meta.sample}`}
                        />
                      </div>
                    </div>

                    {/* Google & Google Ads Funnel */}
                    <div className="rounded-lg border border-emerald-100 bg-white p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                          Google &amp; Google Ads
                        </span>
                        <span className="font-mono text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {b.google.traffic > 0 ? `${b.google.moqRate}% lolos` : "0%"}
                        </span>
                      </div>

                      {/* Step Progression: Traffic >> MOQ >> Sample */}
                      <div className="grid grid-cols-3 gap-1.5 text-center">
                        <div className="rounded-md bg-slate-50 p-1.5">
                          <div className="text-[9px] font-medium text-slate-400 uppercase">Traffic</div>
                          <div className="font-mono text-xs font-bold text-slate-800">{b.google.traffic}</div>
                        </div>
                        <div className="flex flex-col justify-center items-center rounded-md bg-amber-50/60 p-1.5">
                          <div className="text-[9px] font-medium text-amber-800 uppercase">MOQ &ge;500</div>
                          <div className="font-mono text-xs font-bold text-amber-700">{b.google.moq}</div>
                        </div>
                        <div className="rounded-md bg-emerald-50/80 p-1.5">
                          <div className="text-[9px] font-medium text-emerald-700 uppercase">Sample</div>
                          <div className="font-mono text-xs font-bold text-emerald-800">{b.google.sample}</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-2.5 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="bg-teal-500 transition-all"
                          style={{ width: `${b.google.traffic > 0 ? Math.min(100, (b.google.traffic / (b.totalTraffic || 1)) * 100) : 0}%` }}
                          title={`Traffic Google: ${b.google.traffic}`}
                        />
                        <div
                          className="bg-amber-500 transition-all"
                          style={{ width: `${b.google.traffic > 0 ? Math.min(100, (b.google.moq / b.google.traffic) * 100) : 0}%` }}
                          title={`MOQ Google: ${b.google.moq}`}
                        />
                        <div
                          className="bg-emerald-500 transition-all"
                          style={{ width: `${b.google.moq > 0 ? Math.min(100, (b.google.sample / b.google.moq) * 100) : 0}%` }}
                          title={`Sample Google: ${b.google.sample}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Total Tim */}
              {data.channelFunnels.summary && (
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="font-semibold text-slate-700">
                    Total Konversi Gabungan Seluruh Tim:
                  </span>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-700">Meta Ads:</span>
                      <span className="font-mono text-slate-800">
                        {data.channelFunnels.summary.meta.traffic} Traffic &gt;&gt;{" "}
                        <b className="text-amber-700">{data.channelFunnels.summary.meta.moq} MOQ</b> &gt;&gt;{" "}
                        <b className="text-emerald-700">{data.channelFunnels.summary.meta.sample} Sample</b>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-700">Google Ads:</span>
                      <span className="font-mono text-slate-800">
                        {data.channelFunnels.summary.google.traffic} Traffic &gt;&gt;{" "}
                        <b className="text-amber-700">{data.channelFunnels.summary.google.moq} MOQ</b> &gt;&gt;{" "}
                        <b className="text-emerald-700">{data.channelFunnels.summary.google.sample} Sample</b>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Tren + batang per sales */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card
            title="Tren Lead per Hari"
            subtitle={data ? `${data.period.days} hari · ${data.kpi.current.totalClicks.toLocaleString("id-ID")} klik · ${data.kpi.current.chat.toLocaleString("id-ID")} chat` : undefined}
            className="lg:col-span-2"
          >
            {data ? <TrendChart data={data.daily} hourly={data.hourlyClicks} /> : <div className="h-[280px]" />}
          </Card>
          <Card
            title="Chat Masuk per BusDev"
            subtitle="Klik batang untuk memfilter semua data"
            right={
              data ? (
                <div className="flex items-center gap-1.5">
                  {data.rrMode && (
                    <span title="Cara sistem membagi klik baru ke sales">
                      <Pill tone="brand">{RR_LABEL[data.rrMode] ?? data.rrMode}</Pill>
                    </span>
                  )}
                  <FairnessPill fairness={data.fairness} />
                </div>
              ) : undefined
            }
          >
            {data ? (
              <>
                <BusdevBars rows={data.busdevs} selected={f.busdev} onSelect={(n) => f.setBusdev(n)} />
                {data.inactiveBusdevs.names.length > 0 && (
                  <p className="mt-3 border-t border-[#F1EFEA] pt-3 text-[11px] leading-relaxed text-slate-400">
                    Tidak ditampilkan: {data.inactiveBusdevs.names.join(", ")} (nonaktif) · {data.inactiveBusdevs.chat} chat dan {data.inactiveBusdevs.clicks} klik pada periode ini tetap masuk total kartu.
                  </p>
                )}
              </>
            ) : (
              <div className="h-[280px]" />
            )}
          </Card>
        </div>

        {/* Sumber / halaman / jam */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card title="Sumber & Kampanye" subtitle="Asal klik teratas">
            <HBarList rows={data?.sources ?? []} empty="Belum ada data sumber." />
          </Card>
          <Card title="Halaman Tujuan" subtitle="Landing page teratas">
            <HBarList rows={data?.pages ?? []} empty="Belum ada data halaman." />
          </Card>
          <Card title="Jam Chat Masuk" subtitle="Sebaran per jam (WIB)">
            <HourChart data={data?.hourly ?? []} />
          </Card>
        </div>

        {/* Top leads + halaman asal */}
        <div className="grid gap-4 lg:grid-cols-2">
          <TopLeadsCard rows={data?.topLeads ?? []} />
          <ReferrerCard rows={data?.referrers ?? []} />
        </div>

        {loading && !data && <p className="text-center text-xs text-slate-400">Memuat data...</p>}
      </main>
    </div>
  );
}
