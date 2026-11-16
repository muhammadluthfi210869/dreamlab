"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
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
import { FilterToolbar, useFilters, useMe } from "@/components/lead-monitor/filters";
import { isAdminRole } from "@/lib/crm-stages";

const REFRESH_MS = 20_000;

interface Kpi {
  totalClicks: number;
  chat: number;
  dropoff: number;
  direct: number;
  moqMet: number;
}

import type { MoqOverview, ChannelFunnelsOverview } from "@/lib/lead-monitor-stats";
import { BusdevFunnelCard } from "@/components/lead-monitor/BusdevFunnelCard";
import { WeeklyBudgetPerformanceCard } from "@/components/lead-monitor/WeeklyBudgetPerformanceCard";
import { BusdevConversionRateCard } from "@/components/lead-monitor/BusdevConversionRateCard";
import { MasterHeadOverviewCard, type MasterHeadOverviewData } from "@/components/lead-monitor/MasterHeadOverviewCard";
import { KpiWeeklyTotalSection } from "@/components/lead-monitor/KpiWeeklyTotalSection";
import { WeeklyLeadConversionReportCard } from "@/components/lead-monitor/WeeklyLeadConversionReportCard";

interface ApiData {
  period: { startDate: string; endDate: string; days: number; hasPrevious: boolean };
  kpi: {
    current: Kpi;
    previous: Kpi | null;
    weekly?: Kpi;
    total?: Kpi;
    delta: { totalClicks: number | null; chat: number | null; dropoff: number | null; moqMet: number | null } | null;
  };
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
  masterHeadOverview?: MasterHeadOverviewData;
  rrMode: string | null;
  meta: { rawRows: number; rawCapped: boolean; serverTime: string };
}

export default function DashboardPage() {
  const f = useFilters();
  const me = useMe();
  const isAdmin = isAdminRole(me.role);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [showDetailAnalytics, setShowDetailAnalytics] = useState(false);
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
            <Link
              href="/lead-monitor/pipeline"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#D98A00] hover:bg-[#B45309] text-white px-3 text-xs font-semibold shadow-xs transition"
              title="Buka Papan Sales Pipeline dengan Drag & Drop dan Balas WhatsApp Langsung"
            >
              <Target className="h-3.5 w-3.5" />
              <span>Sales Pipeline &rarr;</span>
            </Link>
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

        {/* Laporan Konversi Leads: Traffic >> Prospecting >> Sample (Week 1 – Week 4) */}
        <WeeklyLeadConversionReportCard
          initialBusdev={f.busdev}
          onSelectDateRange={(start, end) => f.setRange(start, end)}
        />

        {/* Weekly Budget & Cost Performance per Channel (Khusus Head / Admin) */}
        {isAdmin && (
          <WeeklyBudgetPerformanceCard
            busdev={f.busdev}
            onSelectWeek={(start, end) => f.setRange(start, end)}
          />
        )}

        {/* Tombol Toggle Analisis Detail Campaign, Landing, MOQ & Tren Harian (Khusus Head / Admin) */}
        {isAdmin && (
          <div className="flex items-center justify-between rounded-xl border border-[#ECEAE4] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
            <div>
              <div className="text-xs font-bold text-slate-800">
                Analisis Detail Campaign, Landing Page, Sebaran MOQ &amp; Tren Harian
              </div>
              <div className="text-[11px] text-slate-500">
                Grafik tren klik per jam, performa landing page teratas, dan daftar sumber kampanye
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowDetailAnalytics((v) => !v)}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#D5D9E2] bg-[#F8F9FB] px-3 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition"
            >
              <span>{showDetailAnalytics ? "Tutup Analisis Detail" : "Buka Analisis Detail"}</span>
            </button>
          </div>
        )}

        {/* Overview Sebaran MOQ & Sumber Traffic Terbanyak (Khusus Head / Admin, saat dibuka) */}
        {isAdmin && showDetailAnalytics && data?.moqOverview && (
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

        {/* Grafik Tren, Sumber & Kampanye, Halaman Tujuan, Jam Chat Masuk (Khusus Head / Admin, saat dibuka) */}
        {isAdmin && showDetailAnalytics && (
          <>
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
          </>
        )}

        {loading && !data && <p className="text-center text-xs text-slate-400">Memuat data...</p>}
      </main>
    </div>
  );
}
