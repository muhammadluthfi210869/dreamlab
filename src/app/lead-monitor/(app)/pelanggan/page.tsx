"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HelpCircle, MessageSquare, Phone, RefreshCw, Target } from "lucide-react";
import { PIPELINE_STAGES, isAdminRole } from "@/lib/crm-stages";
import { BRAND, Card, KpiCard } from "@/components/lead-monitor/ui";
import { FilterToolbar, useFilters, useMe } from "@/components/lead-monitor/filters";
import { LeadTable, rowsToCsv, type PatchHandler, type TableData, type TableState } from "@/components/lead-monitor/LeadTable";
import type { ChannelFunnelsOverview } from "@/lib/lead-monitor-stats";
import { BusdevConversionRateCard } from "@/components/lead-monitor/BusdevConversionRateCard";
import { WeeklyBudgetPerformanceCard } from "@/components/lead-monitor/WeeklyBudgetPerformanceCard";
import { MasterHeadOverviewCard, type MasterHeadOverviewData } from "@/components/lead-monitor/MasterHeadOverviewCard";
import { KpiWeeklyTotalSection } from "@/components/lead-monitor/KpiWeeklyTotalSection";
import { WeeklyLeadConversionReportCard } from "@/components/lead-monitor/WeeklyLeadConversionReportCard";

const REFRESH_MS = 30_000;

interface Kpi {
  totalClicks: number;
  chat: number;
  dropoff: number;
  direct: number;
  moqMet: number;
}

interface ApiData {
  period: { startDate: string; endDate: string; days: number };
  kpi: {
    current: Kpi;
    previous: Kpi | null;
    weekly?: Kpi;
    total?: Kpi;
    delta: { totalClicks: number | null; chat: number | null; dropoff: number | null; moqMet: number | null } | null;
  };
  busdevs: { name: string }[];
  stageCounts: Record<string, number>;
  channelFunnels?: ChannelFunnelsOverview;
  masterHeadOverview?: MasterHeadOverviewData;
  table: TableData;
  meta: { rawCapped: boolean };
}

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export default function PelangganPage() {
  const f = useFilters();
  const me = useMe();
  const [table, setTable] = useState<TableState>({
    tab: "all",
    kind: "all",
    tier: "all",
    moq: "all",
    source: "all",
    stage: "all",
    qualifiedOnly: false,
    search: "",
    page: 1,
    pageSize: 25,
    sort: "time",
    dir: "desc",
  });
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const search = useDebounced(table.search, 350);
  const reqId = useRef(0);

  const query = useMemo(
    () =>
      new URLSearchParams({
        startDate: f.startDate,
        endDate: f.endDate,
        busdev: f.busdev,
        tab: table.tab,
        kind: table.kind,
        tier: table.tier,
        moq: table.moq,
        source: table.source,
        stage: table.stage,
        qualified_only: table.qualifiedOnly ? "1" : "0",
        search,
        page: String(table.page),
        pageSize: String(table.pageSize),
        sort: table.sort,
        dir: table.dir,
      }),
    [f.startDate, f.endDate, f.busdev, table.tab, table.kind, table.tier, table.moq, table.source, table.stage, table.qualifiedOnly, search, table.page, table.pageSize, table.sort, table.dir]
  );

  const load = useCallback(
    async (manual = false) => {
      const id = ++reqId.current;
      if (manual) setRefreshing(true);
      try {
        const res = await fetch(`/api/lead-monitor/stats?${query.toString()}`, { cache: "no-store" });
        if (res.status === 401) {
          window.location.href = "/lead-monitor/masuk";
          return;
        }
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.success) throw new Error(json.error || `Server status ${res.status}`);
        if (id !== reqId.current) return;
        setData(json as ApiData);
        setError(null);
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
    if (!f.ready) return;
    const t = setInterval(() => load(), REFRESH_MS);
    return () => clearInterval(t);
  }, [load, f.ready]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const patchTable = (patch: Partial<TableState>) => setTable((t) => ({ ...t, ...patch }));
  const busdevNames = useMemo(() => (data?.busdevs ?? []).map((b) => b.name), [data?.busdevs]);

  /** Simpan perubahan ke server; tampilan diperbarui hanya setelah server menjawab sukses. */
  const onPatch: PatchHandler = useCallback(
    async (row, patch) => {
      try {
        const res = await fetch("/api/crm/lead", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codes: row.codes && row.codes.length ? row.codes : [row.tracking_code], ...patch }),
        });
        if (res.status === 401) {
          window.location.href = "/lead-monitor/masuk";
          return "Sesi habis";
        }
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.success) {
          const m = json.error || "Gagal menyimpan";
          setToast(m);
          return m;
        }
        setData((d) =>
          d
            ? {
              ...d,
              table: {
                ...d.table,
                rows: d.table.rows.map((x) =>
                  x.id === row.id
                    ? {
                      ...x,
                      ...(patch.produk_manual !== undefined ? { produk_manual: patch.produk_manual } : {}),
                      ...(patch.moq_manual !== undefined ? { moq_manual: patch.moq_manual } : {}),
                      ...(patch.stage !== undefined ? { crm_stage: patch.stage } : {}),
                    }
                    : x
                ),
              },
            }
            : d
        );
        setToast("Tersimpan");
        load(); // segarkan kartu dan jumlah per tahap
        return null;
      } catch {
        return "Tidak bisa terhubung ke server";
      }
    },
    [load]
  );

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
      a.download = `pelanggan_${f.startDate}_${f.endDate}.csv`;
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
  const counts = data?.stageCounts ?? {};

  return (
    <div>
      <header className="border-b border-[#ECEAE4] bg-white/90 backdrop-blur lg:sticky lg:top-0 lg:z-30">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
          <div>
            <h1 className="text-[17px] font-semibold leading-tight text-slate-900">Pelanggan</h1>
            <p className="text-xs text-slate-500">Database prospek dan pelanggan Dreamlab</p>
          </div>
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
      </header>

      <main className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 sm:px-6">
        {error && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
            <span className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>
                <b>Gagal memuat data:</b> {error}
              </span>
            </span>
            <button type="button" onClick={() => load(true)} className="shrink-0 rounded-md bg-amber-600 px-2.5 py-1 font-semibold text-white hover:bg-amber-700">
              Coba sekarang
            </button>
          </div>
        )}

        <FilterToolbar busdevNames={busdevNames} showBusdev={isAdminRole(me.role)} />

        {/* Ringkasan Buku Tamu: Total Leads & Sumber Masuk */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-2xl border border-[#ECEAE4] bg-white p-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Leads Masuk</div>
            <div className="mt-1 font-mono text-2xl font-bold text-slate-900">
              {(data?.kpi.current.totalClicks ?? 0).toLocaleString("id-ID")}
            </div>
            <div className="text-[10px] text-slate-400">Semua klik &amp; form periode ini</div>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Chat Masuk</div>
            <div className="mt-1 font-mono text-2xl font-bold text-[#9A6200]">
              {(data?.kpi.current.chat ?? 0).toLocaleString("id-ID")}
            </div>
            <div className="text-[10px] text-slate-500">Prospek terhubung WA</div>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800">Meta Ads</div>
            <div className="mt-1 font-mono text-2xl font-bold text-blue-900">
              {(data?.channelFunnels?.summary?.meta_ads.traffic ?? 0).toLocaleString("id-ID")}
            </div>
            <div className="text-[10px] text-slate-500">FB / IG Ads</div>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Google Ads</div>
            <div className="mt-1 font-mono text-2xl font-bold text-emerald-900">
              {(data?.channelFunnels?.summary?.google_ads.traffic ?? 0).toLocaleString("id-ID")}
            </div>
            <div className="text-[10px] text-slate-500">Iklan Pencarian</div>
          </div>
          <div className="rounded-2xl border border-sky-200 bg-sky-50/40 p-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-800">Google Organik</div>
            <div className="mt-1 font-mono text-2xl font-bold text-sky-900">
              {(data?.channelFunnels?.summary?.google_organic.traffic ?? 0).toLocaleString("id-ID")}
            </div>
            <div className="text-[10px] text-slate-500">SEO / Artikel</div>
          </div>
          <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-800">Medsos &amp; Lainnya</div>
            <div className="mt-1 font-mono text-2xl font-bold text-purple-900">
              {(
                (data?.channelFunnels?.summary?.social_media.traffic ?? 0) +
                (data?.channelFunnels?.summary?.other.traffic ?? 0)
              ).toLocaleString("id-ID")}
            </div>
            <div className="text-[10px] text-slate-500">IG / TikTok / Direct</div>
          </div>
        </div>

        <Card title="Prospek per Tahap" subtitle="Klik tahap untuk memfilter tabel · atur tahap di halaman Sales Pipeline">
          <div className="flex flex-wrap gap-2">
            {PIPELINE_STAGES.map((st) => {
              const active = table.stage === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => patchTable({ stage: active ? "all" : st.id, page: 1 })}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${active ? "border-[#D98A00] bg-[#FFF4DC] text-[#9A6200]" : "border-[#E5E2DA] bg-white text-slate-700 hover:bg-slate-50"}`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: st.tone }} />
                  {st.label}
                  <span className="font-mono text-slate-500">{(counts[st.id] ?? 0).toLocaleString("id-ID")}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <LeadTable
          data={data?.table ?? null}
          state={table}
          loading={loading || refreshing}
          busdev={f.busdev}
          busdevNames={busdevNames}
          onBusdev={(n) => {
            f.setBusdev(n);
            patchTable({ page: 1 });
          }}
          me={me}
          onPatch={onPatch}
          onChange={patchTable}
          onExport={exportCsv}
          exporting={exporting}
          truncated={!!data?.meta.rawCapped}
        />
      </main>

      {toast && (
        <div role="status" className="fixed bottom-5 right-5 z-50 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
