"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, MessageSquare, RefreshCw, X } from "lucide-react";
import { canEditLead, formatWaChatLink, PIPELINE_STAGES, stageLabel } from "@/lib/crm-stages";
import { BRAND, Pill } from "@/components/lead-monitor/ui";
import { FilterToolbar, useFilters, useMe } from "@/components/lead-monitor/filters";
import type { ChannelFunnelsOverview } from "@/lib/lead-monitor-stats";
import { BusdevFunnelCard } from "@/components/lead-monitor/BusdevFunnelCard";

const PAGE_STEP = 40;
const REFRESH_MS = 60_000;

interface PCard {
  key: string;
  codes: string[];
  name: string | null;
  phone: string | null;
  produk: string | null;
  produk_manual: string | null;
  moq: number | null;
  moq_manual: number | null;
  note: string | null;
  sales: string | null;
  source: string | null;
  referrer: string | null;
  referrer_kind: string;
  page: string | null;
  kind: "chat" | "dropoff" | "direct";
  is_form: boolean;
  created_at: string;
  confirmed_at: string | null;
  last_seen_at: string;
}

interface Column {
  id: string;
  count: number;
  cards: PCard[];
}

interface ApiData {
  period: { startDate: string; endDate: string };
  busdevs: string[];
  total: number;
  capped: boolean;
  cardsPerStage: number;
  columns: Column[];
  channelFunnels?: ChannelFunnelsOverview;
}

function ago(iso: string): string {
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return "baru saja";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} mnt lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

const KIND: Record<PCard["kind"], { text: string; tone: "green" | "amber" | "slate" }> = {
  chat: { text: "Sudah chat", tone: "green" },
  dropoff: { text: "Belum chat", tone: "amber" },
  direct: { text: "Chat langsung", tone: "slate" },
};

export default function PipelinePage() {
  const f = useFilters();
  const me = useMe();
  const [data, setData] = useState<ApiData | null>(null);
  const [cols, setCols] = useState<Record<string, Column>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [visible, setVisible] = useState<Record<string, number>>({});
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ card: PCard; stage: string } | null>(null);
  const [showFunnel, setShowFunnel] = useState(true);
  const busy = useRef(false); // true saat menyimpan / menyeret: jangan timpa tampilan dengan data polling
  const reqId = useRef(0);

  const query = useMemo(() => new URLSearchParams({ startDate: f.startDate, endDate: f.endDate, busdev: f.busdev }), [f.startDate, f.endDate, f.busdev]);

  const load = useCallback(
    async (manual = false) => {
      const id = ++reqId.current;
      if (manual) setRefreshing(true);
      try {
        const res = await fetch(`/api/crm/pipeline?${query.toString()}`, { cache: "no-store" });
        if (res.status === 401) {
          window.location.href = "/lead-monitor/masuk";
          return;
        }
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.success) throw new Error(json.error || `Server status ${res.status}`);
        if (id !== reqId.current) return;
        setData(json as ApiData);
        setCols(Object.fromEntries((json as ApiData).columns.map((c) => [c.id, c])));
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
    setVisible({});
    load();
  }, [load, f.ready]);

  useEffect(() => {
    if (!f.ready) return;
    const t = setInterval(() => {
      if (!busy.current && !selected && !dragKey) load();
    }, REFRESH_MS);
    return () => clearInterval(t);
  }, [load, f.ready, selected, dragKey]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const patchLead = async (card: PCard, body: Record<string, unknown>): Promise<string | null> => {
    try {
      const res = await fetch("/api/crm/lead", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codes: card.codes, ...body }),
      });
      if (res.status === 401) {
        window.location.href = "/lead-monitor/masuk";
        return "Sesi habis";
      }
      const json = await res.json().catch(() => ({}));
      return !res.ok || !json.success ? json.error || "Gagal menyimpan" : null;
    } catch {
      return "Tidak bisa terhubung ke server";
    }
  };

  /** Pindah tahap: tampilan langsung bergeser, dikembalikan bila server menolak. */
  const moveCard = async (card: PCard, from: string, to: string) => {
    if (from === to) return;
    if (!canEditLead(me, card.sales)) {
      setToast("Anda hanya bisa memindahkan lead milik Anda sendiri");
      return;
    }
    const snapshot = cols;
    busy.current = true;
    setCols((c) => {
      const next = { ...c };
      next[from] = { ...c[from], count: Math.max(0, c[from].count - 1), cards: c[from].cards.filter((x) => x.key !== card.key) };
      next[to] = { ...c[to], count: c[to].count + 1, cards: [card, ...c[to].cards] };
      return next;
    });
    const err = await patchLead(card, { stage: to });
    busy.current = false;
    if (err) {
      setCols(snapshot);
      setToast(err);
    } else {
      setToast(`Dipindah ke ${stageLabel(to)}`);
    }
  };

  const saveDetail = async (card: PCard, stage: string, values: { produk: string; moq: string; note: string }, newStage: string): Promise<string | null> => {
    const body: Record<string, unknown> = {
      produk_manual: values.produk.trim() === "" ? null : values.produk.trim(),
      moq_manual: values.moq.trim() === "" ? null : parseInt(values.moq.replace(/\D/g, ""), 10),
      note: values.note.trim() === "" ? null : values.note.trim(),
    };
    if (newStage !== stage) body.stage = newStage;
    busy.current = true;
    const err = await patchLead(card, body);
    busy.current = false;
    if (err) return err;
    await load();
    setToast("Tersimpan");
    return null;
  };

  const total = data?.total ?? 0;

  // Daftar sales terurut (Annisa, Jessica, Diaz)
  const salesList = useMemo(() => {
    const raw = data?.busdevs && data.busdevs.length > 0 ? [...data.busdevs] : ["Annisa", "Jessica", "Diaz"];
    const preferred = ["Annisa", "Jessica", "Diaz"];
    return raw.sort((a, b) => {
      const ia = preferred.findIndex((p) => p.toLowerCase() === a.toLowerCase());
      const ib = preferred.findIndex((p) => p.toLowerCase() === b.toLowerCase());
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [data?.busdevs]);

  // Hitungan kartu per sales
  const salesCounts = useMemo(() => {
    const m: Record<string, number> = {};
    if (!data?.columns) return m;
    for (const col of data.columns) {
      for (const card of col.cards) {
        const s = (card.sales || "").trim().toLowerCase();
        if (s) m[s] = (m[s] || 0) + 1;
      }
    }
    return m;
  }, [data?.columns]);

  return (
    <div>
      <header className="border-b border-[#ECEAE4] bg-white/90 backdrop-blur lg:sticky lg:top-0 lg:z-30">
        <div className="mx-auto flex h-16 max-w-[1920px] items-center justify-between gap-4 px-4 sm:px-6">
          <div>
            <h1 className="text-[17px] font-semibold leading-tight text-slate-900">Sales Pipeline</h1>
            <p className="text-xs text-slate-500">
              Kelola prospek & stage traffic MOQ · Klik tombol WA untuk langsung balas chat
            </p>
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

      <main className="mx-auto max-w-[1920px] space-y-4 px-4 py-5 sm:px-6">
        {error && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
            <span className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>
                <b>Gagal memuat:</b> {error}
              </span>
            </span>
            <button type="button" onClick={() => load(true)} className="shrink-0 rounded-md bg-amber-600 px-2.5 py-1 font-semibold text-white hover:bg-amber-700">
              Coba sekarang
            </button>
          </div>
        )}

        <FilterToolbar
          busdevNames={data?.busdevs ?? []}
          showBusdev={false}
          right={<span className="font-mono text-[11px] text-slate-400">{total.toLocaleString("id-ID")} prospek</span>}
        />

        {data?.capped && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Data periode ini sangat besar dan dipotong di 5.000 baris terbaru. Persempit rentang tanggal agar lengkap.
          </div>
        )}

        {/* Layout: Sales Switcher di Kiri + Kanban Board di Kanan */}
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Sales Pipeline Switcher di Kiri */}
          <aside className="w-full lg:w-64 shrink-0 rounded-2xl border border-[#ECEAE4] bg-white p-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] lg:sticky lg:top-20">
            <div className="mb-3 px-1">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sales Pipeline</h2>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-600">
                  {total.toLocaleString("id-ID")} lead
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500">Pilih tim sales untuk menyaring</p>
            </div>

            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-1">
              <button
                type="button"
                onClick={() => f.setBusdev("all")}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition text-left ${
                  f.busdev === "all"
                    ? "border border-[#F0D9A8] bg-[#FFF8EA] text-[#B45309] font-semibold shadow-xs"
                    : "border border-transparent bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      f.busdev === "all" ? "bg-[#D98A00] text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    All
                  </span>
                  <div className="truncate">
                    <div className="truncate font-semibold">Semua Pipeline</div>
                    <div className="text-[10px] text-slate-400">Gabungan tim</div>
                  </div>
                </div>
                <span className="ml-2 font-mono text-[11px] font-semibold text-slate-500">
                  {total}
                </span>
              </button>

              {salesList.map((salesName) => {
                const active = f.busdev.toLowerCase() === salesName.toLowerCase();
                const initial = salesName.charAt(0).toUpperCase();
                const count = salesCounts[salesName.toLowerCase()] ?? 0;
                return (
                  <button
                    key={salesName}
                    type="button"
                    onClick={() => f.setBusdev(salesName)}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition text-left ${
                      active
                        ? "border border-[#F0D9A8] bg-[#FFF8EA] text-[#B45309] font-semibold shadow-xs"
                        : "border border-transparent bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                          active ? "bg-[#D98A00] text-white" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {initial}
                      </span>
                      <div className="truncate">
                        <div className="truncate font-semibold">{salesName}</div>
                        <div className="text-[10px] text-slate-400">BusDev Sales</div>
                      </div>
                    </div>
                    <span className="ml-2 font-mono text-[11px] font-semibold text-slate-500">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Kanban Board di Kanan */}
          <div className="flex-1 min-w-0 w-full overflow-hidden space-y-4">
            {/* Funnel per BusDev Card (sesuai screenshot: Traffic >> MOQ >= 500 >> Sample) */}
            {data?.channelFunnels && (
              <div className="rounded-2xl border border-[#ECEAE4] bg-[#FAFAF8] p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                <div className="flex items-center justify-between border-b border-[#ECEAE4] pb-2.5 mb-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>
                        {f.busdev !== "all"
                          ? `Funnel Sales: ${f.busdev}`
                          : "Funnel per BusDev: Meta Ads, Google Ads, Google Organik & Media Sosial"}
                      </span>
                      <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        Traffic &gt;&gt; MOQ &ge; 500 &gt;&gt; Sample
                      </span>
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pantau alur konversi dari Traffic iklan &amp; organik &gt;&gt; Lolos MOQ (&ge; 500 pcs) &gt;&gt; Masuk tahap Sample
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFunnel((v) => !v)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E2DA] bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    {showFunnel ? (
                      <>
                        <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                        <span>Sembunyikan</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                        <span>Lihat Funnel</span>
                      </>
                    )}
                  </button>
                </div>

                {showFunnel && (
                  <div>
                    {f.busdev !== "all" ? (
                      (() => {
                        const targetFunnel = data.channelFunnels.byBusdev.find(
                          (b) => b.name.toLowerCase() === f.busdev.toLowerCase()
                        );
                        return targetFunnel ? (
                          <BusdevFunnelCard funnel={targetFunnel} compact />
                        ) : (
                          <p className="text-xs text-slate-400 py-2">Data funnel untuk {f.busdev} belum tersedia.</p>
                        );
                      })()
                    ) : (
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
                        {data.channelFunnels.byBusdev.map((funnel) => (
                          <BusdevFunnelCard key={funnel.name} funnel={funnel} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="-mx-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6">
              <div className="flex min-w-max gap-3">
                {PIPELINE_STAGES.map((st) => {
                  const col = cols[st.id];
                  const shown = visible[st.id] ?? PAGE_STEP;
                  const list = col?.cards ?? [];
                  const isOver = overStage === st.id && dragKey !== null;
                  return (
                    <section
                      key={st.id}
                      aria-label={st.label}
                      onDragOver={(e) => {
                        if (dragKey) {
                          e.preventDefault();
                          setOverStage(st.id);
                        }
                      }}
                      onDragLeave={() => setOverStage((o) => (o === st.id ? null : o))}
                      onDrop={(e) => {
                        e.preventDefault();
                        const key = e.dataTransfer.getData("text/plain") || dragKey;
                        setOverStage(null);
                        setDragKey(null);
                        if (!key) return;
                        for (const [from, c] of Object.entries(cols)) {
                          const card = c.cards.find((x) => x.key === key);
                          if (card) {
                            moveCard(card, from, st.id);
                            break;
                          }
                        }
                      }}
                      className={`flex w-[280px] shrink-0 flex-col rounded-2xl border bg-[#FAFAF8] transition ${
                        isOver ? "border-[#D98A00] bg-[#FFF9EC]" : "border-[#ECEAE4]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-[#ECEAE4] px-3.5 py-3" title={st.hint}>
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: st.tone }} />
                          <span className="truncate text-[13px] font-semibold text-slate-900">{st.label}</span>
                        </div>
                        <span className="rounded-full bg-white px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-600 ring-1 ring-[#ECEAE4]">
                          {(col?.count ?? 0).toLocaleString("id-ID")}
                        </span>
                      </div>

                      <div className="max-h-[calc(100vh-270px)] min-h-[140px] space-y-2.5 overflow-y-auto p-2.5">
                        {!col && loading && <p className="py-6 text-center text-xs text-slate-400">Memuat...</p>}
                        {col && list.length === 0 && <p className="py-6 text-center text-xs text-slate-400">Kosong</p>}
                        {list.slice(0, shown).map((c) => {
                          const editable = canEditLead(me, c.sales);
                          const k = KIND[c.kind];
                          const moqOk = (c.moq ?? 0) >= 500;
                          const waUrl = c.phone ? formatWaChatLink(c.phone, c.name, c.sales, c.produk) : null;

                          return (
                            <article
                              key={c.key}
                              draggable={editable}
                              onDragStart={(e) => {
                                e.dataTransfer.setData("text/plain", c.key);
                                e.dataTransfer.effectAllowed = "move";
                                setDragKey(c.key);
                              }}
                              onDragEnd={() => {
                                setDragKey(null);
                                setOverStage(null);
                              }}
                              className={`rounded-xl border border-[#ECEAE4] bg-white p-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ${
                                editable ? "cursor-grab active:cursor-grabbing" : ""
                              } ${dragKey === c.key ? "opacity-40" : ""}`}
                            >
                              <button type="button" onClick={() => setSelected({ card: c, stage: st.id })} className="block w-full text-left">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <div className="truncate text-[13px] font-semibold text-slate-900">
                                      {c.name || c.phone || <span className="text-slate-400">Tanpa nama</span>}
                                    </div>
                                    {c.name && c.phone && <div className="truncate font-mono text-[11px] text-slate-500">{c.phone}</div>}
                                  </div>
                                  <Pill tone={k.tone}>{k.text}</Pill>
                                </div>
                                {(c.produk || c.moq) && (
                                  <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[11px] text-slate-600">
                                    {c.produk && <span className="truncate">{c.produk}</span>}
                                    {c.moq ? <Pill tone={moqOk ? "green" : "amber"}>{c.moq.toLocaleString("id-ID")} pcs</Pill> : null}
                                  </div>
                                )}
                                <div className="mt-1.5 truncate text-[11px] text-slate-400" title={c.referrer ?? ""}>
                                  {c.referrer ? `${c.referrer}` : "Langsung"} {c.page ? `→ ${c.page}` : ""}
                                </div>
                                {c.note && <div className="mt-1.5 line-clamp-2 rounded-md bg-slate-50 px-2 py-1 text-[11px] text-slate-600">{c.note}</div>}
                                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                                  <span className="font-semibold text-slate-600">{c.sales || "—"}</span>
                                  <span>{ago(c.last_seen_at)}</span>
                                </div>
                              </button>

                              {/* Tombol Balas WhatsApp Langsung */}
                              {waUrl && (
                                <a
                                  href={waUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  title="Balas chat lead langsung via WhatsApp"
                                  className="mt-2.5 flex items-center justify-center gap-1.5 w-full rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 py-1.5 px-2 text-[11px] font-semibold text-[#128C7E] transition shadow-xs"
                                >
                                  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.074-1.808-.412-1.428-.592-2.34-2.029-2.411-2.123-.07-.094-.576-.767-.576-1.464 0-.697.362-1.04.49-1.182.129-.143.282-.179.377-.179.094 0 .188.001.27.006.086.004.202-.033.315.24.116.282.399.974.433 1.045.035.07.058.153.012.247-.046.094-.07.153-.139.235-.07.082-.147.184-.21.247-.07.07-.144.146-.062.287.082.141.365.602.784.975.54.481.996.63 1.137.7.141.07.224.059.306-.035.083-.094.354-.412.448-.553.094-.141.189-.118.318-.07.13.047.824.388.966.459.141.07.236.106.271.165.035.059.035.341-.109.746z" />
                                  </svg>
                                  <span>Balas via WA</span>
                                </a>
                              )}

                              {editable && (
                                <select
                                  aria-label={`Pindahkan ${c.name || c.phone || "lead"} ke tahap`}
                                  value={st.id}
                                  onChange={(e) => moveCard(c, st.id, e.target.value)}
                                  className="mt-2 h-7 w-full rounded-md border border-[#E5E2DA] bg-white px-1.5 text-[11px] text-slate-600 focus:border-[#D98A00] focus:outline-none"
                                >
                                  {PIPELINE_STAGES.map((s2) => (
                                    <option key={s2.id} value={s2.id}>
                                      Pindah ke: {s2.label}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </article>
                          );
                        })}
                        {list.length > shown && (
                          <button
                            type="button"
                            onClick={() => setVisible((v) => ({ ...v, [st.id]: shown + PAGE_STEP }))}
                            className="w-full rounded-lg border border-dashed border-[#E5E2DA] py-2 text-[11px] font-semibold text-slate-500 hover:bg-white"
                          >
                            Tampilkan {Math.min(PAGE_STEP, list.length - shown)} lagi ({(list.length - shown).toLocaleString("id-ID")} tersisa)
                          </button>
                        )}
                        {col && col.count > list.length && (
                          <p className="px-1 pb-1 text-center text-[10px] text-slate-400">
                            {(col.count - list.length).toLocaleString("id-ID")} lagi tidak dimuat. Persempit rentang tanggal.
                          </p>
                        )}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {selected && (
        <DetailModal
          key={selected.card.key}
          card={selected.card}
          stage={selected.stage}
          editable={canEditLead(me, selected.card.sales)}
          onClose={() => setSelected(null)}
          onSave={(values, newStage) => saveDetail(selected.card, selected.stage, values, newStage)}
        />
      )}

      {toast && (
        <div role="status" className="fixed bottom-5 right-5 z-50 max-w-sm rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function DetailModal({
  card,
  stage,
  editable,
  onClose,
  onSave,
}: {
  card: PCard;
  stage: string;
  editable: boolean;
  onClose: () => void;
  onSave: (values: { produk: string; moq: string; note: string }, newStage: string) => Promise<string | null>;
}) {
  const [produk, setProduk] = useState(card.produk_manual ?? "");
  const [moq, setMoq] = useState(card.moq_manual !== null && card.moq_manual !== undefined ? String(card.moq_manual) : "");
  const [note, setNote] = useState(card.note ?? "");
  const [newStage, setNewStage] = useState(stage);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    const r = await onSave({ produk, moq, note }, newStage);
    setSaving(false);
    if (r) setErr(r);
    else onClose();
  };

  const field =
    "w-full rounded-lg border border-[#E5E2DA] bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#D98A00] focus:outline-none focus:ring-2 focus:ring-[#D98A00]/20 disabled:bg-slate-50 disabled:text-slate-500";

  const waUrl = card.phone ? formatWaChatLink(card.phone, card.name, card.sales, card.produk_manual || card.produk) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Detail lead">
      <button type="button" aria-label="Tutup" className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <form onSubmit={submit} className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-slate-900">{card.name || card.phone || "Tanpa nama"}</h2>
            {card.name && card.phone && <p className="font-mono text-xs text-slate-500">{card.phone}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Tutup" className="rounded-md p-1 text-slate-400 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* WhatsApp Direct Reply Box */}
        {waUrl && (
          <div className="mb-4 rounded-xl border border-[#25D366]/30 bg-[#25D366]/5 p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.074-1.808-.412-1.428-.592-2.34-2.029-2.411-2.123-.07-.094-.576-.767-.576-1.464 0-.697.362-1.04.49-1.182.129-.143.282-.179.377-.179.094 0 .188.001.27.006.086.004.202-.033.315.24.116.282.399.974.433 1.045.035.07.058.153.012.247-.046.094-.07.153-.139.235-.07.082-.147.184-.21.247-.07.07-.144.146-.062.287.082.141.365.602.784.975.54.481.996.63 1.137.7.141.07.224.059.306-.035.083-.094.354-.412.448-.553.094-.141.189-.118.318-.07.13.047.824.388.966.459.141.07.236.106.271.165.035.059.035.341-.109.746z" />
                </svg>
                Balas Chat WhatsApp
              </span>
              <span className="font-mono text-[11px] text-slate-500">{card.phone}</span>
            </div>
            <p className="text-[11px] text-slate-600 mb-2.5">
              Buka WhatsApp Web / App dengan sapaan personalisasi nama & produk otomatis:
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-[#25D366] hover:bg-[#20BD5A] text-white py-2 px-3 text-xs font-semibold shadow-sm transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Buka Chat WhatsApp Sekarang</span>
            </a>
          </div>
        )}

        <dl className="mb-4 grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl bg-[#FAFAF8] p-3 text-xs">
          <div>
            <dt className="text-slate-400">Sales</dt>
            <dd className="font-semibold text-slate-800">{card.sales || "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Status</dt>
            <dd className="font-semibold text-slate-800">{KIND[card.kind].text}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-slate-400">Asal → Halaman tujuan</dt>
            <dd className="font-medium text-slate-800">
              {card.referrer || "Langsung"} {card.page ? `→ ${card.page}` : ""}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Sumber</dt>
            <dd className="font-medium text-slate-800">{card.source || "direct"}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Klik</dt>
            <dd className="font-medium text-slate-800">{ago(card.created_at)}</dd>
          </div>
        </dl>

        {!editable && (
          <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Lead ini milik {card.sales || "sales lain"}. Anda hanya bisa melihatnya.
          </p>
        )}

        <label className="mb-1 block text-xs font-semibold text-slate-600">Tahap Pipeline</label>
        <select disabled={!editable} value={newStage} onChange={(e) => setNewStage(e.target.value)} className={`${field} mb-3`}>
          {PIPELINE_STAGES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>

        <label className="mb-1 block text-xs font-semibold text-slate-600">
          Produk{card.produk && !card.produk_manual ? <span className="ml-1 font-normal text-slate-400">(form: {card.produk})</span> : null}
        </label>
        <input
          disabled={!editable}
          value={produk}
          maxLength={120}
          onChange={(e) => setProduk(e.target.value)}
          placeholder="mis. Serum wajah, parfum"
          className={`${field} mb-3`}
        />

        <label className="mb-1 block text-xs font-semibold text-slate-600">
          MOQ (pcs){card.moq && card.moq_manual === null ? <span className="ml-1 font-normal text-slate-400">(form: {card.moq.toLocaleString("id-ID")})</span> : null}
        </label>
        <input
          disabled={!editable}
          value={moq}
          inputMode="numeric"
          maxLength={9}
          onChange={(e) => setMoq(e.target.value.replace(/\D/g, ""))}
          placeholder="mis. 1000"
          className={`${field} mb-3`}
        />

        <label className="mb-1 block text-xs font-semibold text-slate-600">Catatan</label>
        <textarea
          disabled={!editable}
          value={note}
          maxLength={500}
          rows={3}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Hasil diskusi, kebutuhan, jadwal follow up"
          className={`${field} mb-1 resize-none`}
        />
        <div className="mb-3 text-right text-[10px] text-slate-400">{note.length}/500</div>

        {err && (
          <div role="alert" className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
            {err}
          </div>
        )}
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="h-10 flex-1 rounded-lg border border-[#E5E2DA] bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50">
            {editable ? "Batal" : "Tutup"}
          </button>
          {editable && (
            <button type="submit" disabled={saving} className="h-10 flex-1 rounded-lg text-sm font-semibold text-white disabled:opacity-60" style={{ background: BRAND }}>
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
