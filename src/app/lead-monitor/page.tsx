"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, HelpCircle, MessageSquare, Phone, RefreshCw, Target, Users } from "lucide-react";
import { BRAND, Card, KpiCard } from "@/components/lead-monitor/ui";
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
import { HealthCard, TopLeadsCard, type HealthRowData, type TopLeadRow } from "@/components/lead-monitor/panels";
import { LeadTable, rowsToCsv, type TableData, type TableState } from "@/components/lead-monitor/LeadTable";

const SYSTEM_LAUNCH = "2026-10-06";
const REFRESH_MS = 20_000;

interface Kpi {
  totalClicks: number;
  chat: number;
  dropoff: number;
  direct: number;
  moqMet: number;
}

interface ApiData {
  period: { startDate: string; endDate: string; days: number; hasPrevious: boolean };
  kpi: { current: Kpi; previous: Kpi | null; delta: { totalClicks: number | null; chat: number | null; dropoff: number | null; moqMet: number | null } | null };
  busdevs: BusdevRow[];
  fairness: FairnessInfo;
  daily: DayPoint[];
  hourly: { hour: number; chat: number }[];
  hourlyClicks: { hour: number; klik: number; chat: number }[];
  sources: GroupRow[];
  pages: GroupRow[];
  topLeads: TopLeadRow[];
  health: HealthRowData[];
  rrMode: string | null;
  table: TableData;
  meta: { rawRows: number; rawCapped: boolean; serverTime: string };
}

function wibDate(offsetDays = 0): string {
  const t = new Date(Date.now() + 7 * 3600_000 + offsetDays * 86_400_000);
  return t.toISOString().slice(0, 10);
}

const PRESETS = [
  { id: "today", label: "Hari Ini" },
  { id: "yesterday", label: "Kemarin" },
  { id: "7d", label: "7 Hari" },
  { id: "30d", label: "30 Hari" },
  { id: "since", label: "Sejak 06 Okt" },
] as const;

function presetRange(id: string): { start: string; end: string } {
  switch (id) {
    case "yesterday":
      return { start: wibDate(-1), end: wibDate(-1) };
    case "7d":
      return { start: wibDate(-6), end: wibDate(0) };
    case "30d":
      return { start: wibDate(-29), end: wibDate(0) };
    case "since":
      return { start: SYSTEM_LAUNCH, end: wibDate(0) };
    default:
      return { start: wibDate(0), end: wibDate(0) };
  }
}

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

const inputCls =
  "h-9 rounded-lg border border-[#E5E2DA] bg-white px-2.5 text-xs font-medium text-slate-700 focus:border-[#D98A00] focus:outline-none focus:ring-2 focus:ring-[#D98A00]/20";

export default function LeadMonitorPage() {
  const [preset, setPreset] = useState<string>("today");
  const [startDate, setStartDate] = useState(wibDate(0));
  const [endDate, setEndDate] = useState(wibDate(0));
  const [busdev, setBusdev] = useState("all");
  const [table, setTable] = useState<TableState>({
    tab: "chat",
    kind: "all",
    tier: "all",
    moq: "all",
    source: "all",
    search: "",
    page: 1,
    pageSize: 25,
    sort: "time",
    dir: "desc",
  });
  const [autoRefresh, setAutoRefresh] = useState(true);

  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const search = useDebounced(table.search, 350);
  const reqId = useRef(0);

  const query = useMemo(() => {
    const p = new URLSearchParams({
      startDate,
      endDate,
      busdev,
      tab: table.tab,
      kind: table.kind,
      tier: table.tier,
      moq: table.moq,
      source: table.source,
      search,
      page: String(table.page),
      pageSize: String(table.pageSize),
      sort: table.sort,
      dir: table.dir,
    });
    return p;
  }, [startDate, endDate, busdev, table.tab, table.kind, table.tier, table.moq, table.source, search, table.page, table.pageSize, table.sort, table.dir]);

  const load = useCallback(
    async (manual = false) => {
      const id = ++reqId.current;
      if (manual) setRefreshing(true);
      try {
        const res = await fetch(`/api/lead-monitor/stats?${query.toString()}`, { cache: "no-store" });
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
    setLoading(true);
    load();
  }, [load]);

  useEffect(() => {
    if (!autoRefresh) return;
    const t = setInterval(() => load(), REFRESH_MS);
    return () => clearInterval(t);
  }, [autoRefresh, load]);

  const applyPreset = (id: string) => {
    const r = presetRange(id);
    setPreset(id);
    setStartDate(r.start < SYSTEM_LAUNCH ? SYSTEM_LAUNCH : r.start);
    setEndDate(r.end);
    setTable((t) => ({ ...t, page: 1 }));
  };

  const patchTable = (patch: Partial<TableState>) => setTable((t) => ({ ...t, ...patch }));

  const exportCsv = async () => {
    setExporting(true);
    try {
      const p = new URLSearchParams(query);
      p.set("export", "1");
      p.set("page", "1");
      const res = await fetch(`/api/lead-monitor/stats?${p.toString()}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Gagal ekspor");
      const blob = new Blob([rowsToCsv(json.table.rows)], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `lead-monitor_${startDate}_${endDate}.csv`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    } catch (e: any) {
      setError(e?.message || "Gagal ekspor CSV");
    } finally {
      setExporting(false);
    }
  };

  const k = data?.kpi.current;
  const d = data?.kpi.delta;
  const busdevNames = useMemo(() => (data?.busdevs ?? []).map((b) => b.name), [data?.busdevs]);
  const fmtTime = (dt: Date | null) =>
    dt ? dt.toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " WIB" : "—";

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-slate-800 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#ECEAE4] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: BRAND }}>
              DL
            </div>
            <div>
              <h1 className="text-[17px] font-semibold leading-tight text-slate-900">Lead Monitor</h1>
              <p className="text-xs text-slate-500">Performa lead dan chat WhatsApp Dreamlab</p>
            </div>
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

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#ECEAE4] bg-white p-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <div className="flex items-center rounded-xl bg-slate-100 p-1">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition ${preset === p.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-[#E5E2DA] bg-white px-2.5 py-1">
            <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
            <input
              type="date"
              aria-label="Dari tanggal"
              min={SYSTEM_LAUNCH}
              max={endDate}
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value || SYSTEM_LAUNCH);
                setPreset("custom");
                patchTable({ page: 1 });
              }}
              className="bg-transparent font-mono text-xs text-slate-800 focus:outline-none"
            />
            <span className="text-xs text-slate-400">s/d</span>
            <input
              type="date"
              aria-label="Sampai tanggal"
              min={startDate}
              max={wibDate(0)}
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value || wibDate(0));
                setPreset("custom");
                patchTable({ page: 1 });
              }}
              className="bg-transparent font-mono text-xs text-slate-800 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-[#E5E2DA] bg-white px-2.5">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            <select
              aria-label="BusDev"
              value={busdev}
              onChange={(e) => {
                setBusdev(e.target.value);
                patchTable({ page: 1 });
              }}
              className={`${inputCls} border-0 bg-transparent px-0 focus:ring-0`}
            >
              <option value="all">Semua BusDev</option>
              {busdevNames.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <p className="ml-auto hidden text-[11px] text-slate-400 lg:block">
            Data dihitung sejak 06 Okt 2026 (sistem pelacakan terpadu). Zona waktu WIB.
          </p>
        </div>

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
            hint="Dari lead yang mengisi form dan memilih tier produksi."
          />
        </div>

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
            right={data ? <FairnessPill fairness={data.fairness} /> : undefined}
          >
            {data ? <BusdevBars rows={data.busdevs} selected={busdev} onSelect={(n) => { setBusdev(n); patchTable({ page: 1 }); }} /> : <div className="h-[280px]" />}
          </Card>
        </div>

        {/* Sumber / halaman / jam */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card title="Sumber & Kampanye" subtitle="Asal klik teratas">
            <HBarList rows={data?.sources ?? []} empty="Belum ada data sumber." />
          </Card>
          <Card title="Halaman Asal" subtitle="Landing page teratas">
            <HBarList rows={data?.pages ?? []} empty="Belum ada data halaman." />
          </Card>
          <Card title="Jam Chat Masuk" subtitle="Sebaran per jam (WIB)">
            <HourChart data={data?.hourly ?? []} />
          </Card>
        </div>

        {/* Top leads + kesehatan */}
        <div className="grid gap-4 lg:grid-cols-2">
          <TopLeadsCard rows={data?.topLeads ?? []} />
          <HealthCard rows={data?.health ?? []} rrMode={data?.rrMode ?? null} />
        </div>

        {/* Tabel */}
        <LeadTable
          data={data?.table ?? null}
          state={table}
          loading={loading || refreshing}
          onChange={patchTable}
          onExport={exportCsv}
          exporting={exporting}
          truncated={!!data?.meta.rawCapped}
        />
      </main>
    </div>
  );
}
