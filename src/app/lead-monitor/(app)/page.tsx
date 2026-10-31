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
