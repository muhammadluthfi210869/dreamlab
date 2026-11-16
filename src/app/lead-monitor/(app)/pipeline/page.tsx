"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Filter,
  History,
  MessageSquare,
  RefreshCw,
  Search,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";
import {
  canEditLead,
  CRM_SOURCES,
  formatWaChatLink,
  getWarmStageMoq,
  isAdminRole,
  LOST_REASONS,
  PIPELINE_STAGES,
  stageLabel,
  type LostReason,
  type PipelineStage,
} from "@/lib/crm-stages";
import { BRAND, BRAND_BLUE } from "@/components/lead-monitor/ui";
import { useFilters, useMe } from "@/components/lead-monitor/filters";
import type { ChannelFunnelsOverview } from "@/lib/lead-monitor-stats";
import { BusdevFunnelCard } from "@/components/lead-monitor/BusdevFunnelCard";
import { WeeklyBudgetPerformanceCard } from "@/components/lead-monitor/WeeklyBudgetPerformanceCard";
import { BusdevConversionRateCard } from "@/components/lead-monitor/BusdevConversionRateCard";
import { CreateManualLeadModal } from "@/components/lead-monitor/CreateManualLeadModal";

const PAGE_STEP = 50;
const REFRESH_MS = 60_000;

interface PCard {
  id: number;
  key: string;
  codes: string[];
  name: string | null;
  phone: string | null;
  brand: string | null;
  produk: string | null;
  produk_manual: string | null;
  moq: number | null;
  moq_manual: number | null;
  moq_label: string | null;
  note: string | null;
  lost_reason: string | null;
  sales: string | null;
  source: string | null;
  source_raw: string | null;
  campaign: string | null;
  detection_method: string | null;
  landing_path: string | null;
  referrer: string | null;
  referrer_raw: string | null;
  referrer_kind: string;
  page: string | null;
  page_raw: string | null;
  kind: "chat" | "dropoff" | "direct";
  is_form: boolean;
  unread_count: number;
  created_at: string;
  stage_changed_at: string;
  confirmed_at: string | null;
  last_seen_at: string;
}

interface Column {
  id: string;
  count: number;
  cards: PCard[];
}

interface StageHistoryItem {
  from_stage: string;
  to_stage: string;
  changed_by: string | null;
  changed_at: string;
}

interface ApiData {
  period: { startDate: string; endDate: string };
  busdevs: string[];
  sources: readonly string[];
  availableCampaigns: string[];
  campaignsBySource: Record<string, string[]>;
  total: number;
  totalUnfiltered: number;
  capped: boolean;
  cardsPerStage: number;
  columns: Column[];
  channelFunnels?: ChannelFunnelsOverview;
}

const wibToday = () => new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);
const addDays = (d: string, n: number) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

function stageAge(iso: string | null | undefined): string {
  if (!iso) return "baru";
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return "<1m";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}j`;
  return `${Math.floor(h / 24)}h`;
}

function formatDateTimeWib(iso: string | null | undefined): string {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function PipelinePage() {
  const f = useFilters();
  const me = useMe();
  const isAdmin = isAdminRole(me.role);

  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [campaignFilter, setCampaignFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [periodPreset, setPeriodPreset] = useState<"today" | "yesterday" | "7d" | "30d" | "custom">("7d");

  const [data, setData] = useState<ApiData | null>(null);
  const [cols, setCols] = useState<Record<string, Column>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);
  const [salesList, setSalesList] = useState<Array<{ id: number; name: string; role: string }>>([]);
  const [visible, setVisible] = useState<Record<string, number>>({});
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ card: PCard; stage: string } | null>(null);
  const [pendingLostMove, setPendingLostMove] = useState<{ card: PCard; targetStage: "lost"; reason: LostReason } | null>(null);
  const [showFunnel, setShowFunnel] = useState(false);

  const busy = useRef(false);
  const reqId = useRef(0);

  // Debounce pencarian
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 220);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Reset campaign jika source berubah dan campaign lama tidak ada di source baru
  useEffect(() => {
    setCampaignFilter("all");
  }, [sourceFilter]);

  const applyPeriodPreset = (preset: "today" | "yesterday" | "7d" | "30d" | "custom") => {
    setPeriodPreset(preset);
    const today = wibToday();
    if (preset === "today") {
      f.setRange(today, today);
    } else if (preset === "yesterday") {
      const y = addDays(today, -1);
      f.setRange(y, y);
    } else if (preset === "7d") {
      f.setRange(addDays(today, -6), today);
    } else if (preset === "30d") {
      f.setRange(addDays(today, -29), today);
    }
  };

  const query = useMemo(() => {
    const params = new URLSearchParams({
      startDate: f.startDate,
      endDate: f.endDate,
      busdev: isAdmin ? f.busdev : me.name,
    });
    if (sourceFilter !== "all") params.set("source", sourceFilter);
    if (campaignFilter !== "all") params.set("campaign", campaignFilter);
    if (debouncedSearch) params.set("q", debouncedSearch);
    return params;
  }, [f.startDate, f.endDate, f.busdev, isAdmin, me.name, sourceFilter, campaignFilter, debouncedSearch]);

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
        if (Array.isArray((json as any).sales)) {
          setSalesList((json as any).sales);
        } else if (Array.isArray((json as ApiData).busdevs)) {
          setSalesList((json as ApiData).busdevs.map((name: string, i: number) => ({ id: i + 1, name, role: "busdev" })));
        }
        setError(null);
      } catch (e: any) {
        if (id !== reqId.current) return;
        setError(e?.message || "Gagal memuat data pipeline");
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
    const id = setInterval(() => {
      if (!document.hidden && !busy.current) load();
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, [load, f.ready]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const findCard = (key: string): { stage: string; card: PCard } | null => {
    for (const s of PIPELINE_STAGES) {
      const c = cols[s.id]?.cards.find((x) => x.key === key);
      if (c) return { stage: s.id, card: c };
    }
    return null;
  };

  /**
   * Eksekusi pindah stage (optimistic UI + simpan ke /api/crm/lead).
   */
  const executeMoveCard = async (key: string, toStage: string, lostReason?: LostReason) => {
    const found = findCard(key);
    if (!found || found.stage === toStage) return;
    if (!canEditLead(me, found.card.sales)) {
      setToast("Anda hanya bisa memindahkan lead milik Anda sendiri.");
      return;
    }

    // Jika pindah ke Lost tanpa alasan, buka modal pilih alasan Lost dulu
    if (toStage === "lost" && !lostReason) {
      setPendingLostMove({ card: found.card, targetStage: "lost", reason: LOST_REASONS[0] });
      return;
    }

    const warmMoq = getWarmStageMoq(toStage);
    const updatedCard: PCard = {
      ...found.card,
      moq_label: warmMoq ? warmMoq.label : found.card.moq_label,
      moq: warmMoq ? warmMoq.numeric : found.card.moq,
      lost_reason: toStage === "lost" ? (lostReason ?? null) : null,
      stage_changed_at: new Date().toISOString(),
    };

    const snapshot = cols;
    busy.current = true;
    setCols((prev) => {
      const from = prev[found.stage];
      const to = prev[toStage] ?? { id: toStage, count: 0, cards: [] };
      if (!from) return prev;
      return {
        ...prev,
        [found.stage]: {
          ...from,
          count: Math.max(0, from.count - 1),
          cards: from.cards.filter((x) => x.key !== key),
        },
        [toStage]: {
          ...to,
          count: to.count + 1,
          cards: [updatedCard, ...to.cards.filter((x) => x.key !== key)],
        },
      };
    });
    setSelected((cur) => (cur && cur.card.key === key ? { card: updatedCard, stage: toStage } : cur));

    try {
      const payload: Record<string, unknown> = {
        codes: found.card.codes,
        stage: toStage,
      };
      if (toStage === "lost" && lostReason) {
        payload.lost_reason = lostReason;
      }
      if (warmMoq) {
        payload.moq = warmMoq.label;
      }

      const res = await fetch("/api/crm/lead", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        window.location.href = "/lead-monitor/masuk";
        return;
      }
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.success) throw new Error(j.error || `Gagal (${res.status})`);
      setToast(
        warmMoq
          ? `Dipindahkan ke ${stageLabel(toStage)} · MOQ otomatis diisi "${warmMoq.label}"`
          : `Dipindahkan ke ${stageLabel(toStage)}`
      );
    } catch (e: any) {
      setCols(snapshot);
      setToast(e?.message || "Gagal memindahkan tahap, dikembalikan ke posisi semula");
    } finally {
      busy.current = false;
    }
  };

  /**
   * Simpan perubahan dari panel detail lead.
   */
  const saveDetail = async (
    card: PCard,
    currentStage: string,
    patch: {
      stage: string;
      lost_reason: string | null;
      sales: string | null;
      source: string | null;
      brand: string | null;
      produk_manual: string | null;
      moq_label: string | null;
      note: string | null;
    }
  ): Promise<boolean> => {
    if (!canEditLead(me, card.sales)) {
      setToast("Anda hanya bisa mengubah lead milik Anda sendiri.");
      return false;
    }
    if (patch.stage === "lost" && !patch.lost_reason) {
      setToast("Pilih alasan Lost terlebih dahulu.");
      return false;
    }

    busy.current = true;
    try {
      const body: Record<string, unknown> = {
        codes: card.codes,
        stage: patch.stage,
        brand: patch.brand,
        produk_manual: patch.produk_manual,
        moq: patch.moq_label,
        source: patch.source,
        note: patch.note,
      };
      if (patch.stage === "lost") {
        body.lost_reason = patch.lost_reason;
      }
      if (isAdmin && patch.sales && patch.sales !== card.sales) {
        body.sales = patch.sales;
      }

      const res = await fetch("/api/crm/lead", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status === 401) {
        window.location.href = "/lead-monitor/masuk";
        return false;
      }
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.success) throw new Error(j.error || `Gagal (${res.status})`);

      const warmMoq = getWarmStageMoq(patch.stage);
      const effectiveMoqLabel = patch.moq_label || (warmMoq ? warmMoq.label : card.moq_label);
      const nextCard: PCard = {
        ...card,
        brand: patch.brand,
        produk_manual: patch.produk_manual,
        produk: patch.produk_manual || card.produk,
        moq_label: effectiveMoqLabel,
        source: patch.source || card.source,
        note: patch.note,
        lost_reason: patch.stage === "lost" ? patch.lost_reason : null,
        sales: isAdmin && patch.sales ? patch.sales : card.sales,
        stage_changed_at: patch.stage !== currentStage ? new Date().toISOString() : card.stage_changed_at,
      };

      setCols((prev) => {
        const next: Record<string, Column> = {};
        for (const s of PIPELINE_STAGES) {
          const col = prev[s.id] ?? { id: s.id, count: 0, cards: [] };
          const without = col.cards.filter((c) => c.key !== card.key);
          if (s.id === patch.stage) {
            next[s.id] = {
              ...col,
              count: currentStage === patch.stage ? col.count : col.count + 1,
              cards: [nextCard, ...without],
            };
          } else if (s.id === currentStage && currentStage !== patch.stage) {
            next[s.id] = {
              ...col,
              count: Math.max(0, col.count - 1),
              cards: without,
            };
          } else {
            next[s.id] = col;
          }
        }
        return next;
      });

      setSelected({ card: nextCard, stage: patch.stage });
      setToast("Perubahan lead tersimpan");
      return true;
    } catch (e: any) {
      setToast(e?.message || "Gagal menyimpan perubahan");
      return false;
    } finally {
      busy.current = false;
    }
  };

  const availableCampaigns = useMemo(() => {
    if (!data) return [];
    if (sourceFilter !== "all" && data.campaignsBySource?.[sourceFilter]) {
      return data.campaignsBySource[sourceFilter];
    }
    return data.availableCampaigns ?? [];
  }, [data, sourceFilter]);

  return (
    <main className="mx-auto max-w-[1920px] px-3 py-4 sm:px-5">
      {/* Header Bar Padat */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <h1 className="text-[18px] font-bold tracking-tight" style={{ color: "var(--crm-text-primary)" }}>
            Pipeline Sales
          </h1>
          <span
            className="crm-mono inline-flex items-center rounded-[6px] border px-2 py-0.5 text-xs font-semibold"
            style={{
              borderColor: "var(--crm-border)",
              background: "var(--crm-bg-surface)",
              color: "var(--crm-text-secondary)",
            }}
          >
            {(data?.total ?? 0).toLocaleString("id-ID")} lead
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowManualModal(true)}
            className="inline-flex h-8 items-center gap-1.5 rounded-[6px] bg-[#F39200] hover:bg-[#D98200] text-white px-2.5 text-xs font-semibold shadow-xs transition"
            title="Tambah lead baru secara manual"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>+ Lead manual</span>
          </button>
          {data?.channelFunnels && (
            <button
              type="button"
              onClick={() => setShowFunnel((v) => !v)}
              className="inline-flex h-8 items-center gap-1.5 rounded-[6px] border px-2.5 text-xs font-semibold transition"
              style={{
                borderColor: "var(--crm-border)",
                background: "var(--crm-bg-surface)",
                color: "var(--crm-text-secondary)",
              }}
            >
              {showFunnel ? <ChevronUp className="h-3.5 w-3.5" strokeWidth={1.75} /> : <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.75} />}
              Ringkasan Funnel
            </button>
          )}
          <button
            type="button"
            onClick={() => load(true)}
            disabled={refreshing}
            className="inline-flex h-8 items-center gap-1.5 rounded-[6px] border px-2.5 text-xs font-semibold transition disabled:opacity-50"
            style={{
              borderColor: "var(--crm-border)",
              background: "var(--crm-bg-surface)",
              color: "var(--crm-text-primary)",
            }}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} strokeWidth={1.75} />
            Muat ulang
          </button>
        </div>
      </div>

      {/* Filter Bar Tahap 1: Sales (Admin), Source, Campaign (bergantung Source), Periode, Pencarian */}
      <section
        aria-label="Filter pipeline"
        className="mb-3 rounded-[8px] border p-2.5"
        style={{ borderColor: "var(--crm-border)", background: "var(--crm-bg-surface)" }}
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Pencarian nama / brand / nomor WA */}
          <div className="relative min-w-[210px] flex-1 sm:max-w-[260px]">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
              strokeWidth={1.75}
              style={{ color: "var(--crm-text-muted)" }}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, brand, nomor WA..."
              aria-label="Cari nama, brand, atau nomor WA"
              className="h-9 w-full rounded-[6px] border pl-8 pr-7 text-xs outline-none transition"
              style={{
                borderColor: "var(--crm-border)",
                background: "var(--crm-bg-subtle)",
                color: "var(--crm-text-primary)",
              }}
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Bersihkan pencarian"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2"
                style={{ color: "var(--crm-text-muted)" }}
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            )}
          </div>

          {/* Filter Sales (Hanya Admin yang bisa ganti; Busdev terkunci ke dirinya sendiri) */}
          {isAdmin ? (
            <div className="flex items-center gap-1.5">
              <label htmlFor="filter-sales" className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--crm-text-muted)" }}>
                Sales
              </label>
              <select
                id="filter-sales"
                value={f.busdev}
                onChange={(e) => f.setBusdev(e.target.value)}
                className="h-9 rounded-[6px] border px-2.5 text-xs font-medium outline-none"
                style={{
                  borderColor: "var(--crm-border)",
                  background: "var(--crm-bg-subtle)",
                  color: "var(--crm-text-primary)",
                }}
              >
                <option value="all">Semua Sales</option>
                {(data?.busdevs ?? []).map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <span
              className="inline-flex h-9 items-center gap-1.5 rounded-[6px] border px-2.5 text-xs font-semibold"
              style={{
                borderColor: "var(--crm-accent-border)",
                background: "var(--crm-accent-soft)",
                color: BRAND,
              }}
            >
              <UserCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
              Sales: {me.name}
            </span>
          )}

          {/* Filter Source */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="filter-source" className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--crm-text-muted)" }}>
              Source
            </label>
            <select
              id="filter-source"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="h-9 rounded-[6px] border px-2.5 text-xs font-medium outline-none"
              style={{
                borderColor: "var(--crm-border)",
                background: "var(--crm-bg-subtle)",
                color: "var(--crm-text-primary)",
              }}
            >
              <option value="all">Semua Source</option>
              {CRM_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Campaign (bergantung pada Source) */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="filter-campaign" className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--crm-text-muted)" }}>
              Campaign
            </label>
            <select
              id="filter-campaign"
              value={campaignFilter}
              onChange={(e) => setCampaignFilter(e.target.value)}
              className="h-9 max-w-[200px] truncate rounded-[6px] border px-2.5 text-xs font-medium outline-none"
              style={{
                borderColor: "var(--crm-border)",
                background: "var(--crm-bg-subtle)",
                color: "var(--crm-text-primary)",
              }}
            >
              <option value="all">
                {sourceFilter === "all" ? "Semua Campaign" : `Semua Campaign (${sourceFilter})`}
              </option>
              {availableCampaigns.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Periode: Hari ini, Kemarin, 7 hari, 30 hari, Custom */}
          <div className="flex flex-wrap items-center gap-1">
            {(
              [
                { id: "today", label: "Hari ini" },
                { id: "yesterday", label: "Kemarin" },
                { id: "7d", label: "7 hari" },
                { id: "30d", label: "30 hari" },
                { id: "custom", label: "Custom" },
              ] as const
            ).map((p) => {
              const active = periodPreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPeriodPreset(p.id)}
                  className="h-9 rounded-[6px] border px-2.5 text-xs font-semibold transition"
                  style={
                    active
                      ? {
                          borderColor: BRAND,
                          background: BRAND,
                          color: "#FFFFFF",
                        }
                      : {
                          borderColor: "var(--crm-border)",
                          background: "var(--crm-bg-subtle)",
                          color: "var(--crm-text-secondary)",
                        }
                  }
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Rentang tanggal Dari - Sampai */}
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              aria-label="Dari tanggal"
              value={f.startDate}
              max={f.endDate}
              onChange={(e) => {
                setPeriodPreset("custom");
                f.setRange(e.target.value, f.endDate);
              }}
              className="crm-mono h-9 rounded-[6px] border px-2 text-xs outline-none"
              style={{
                borderColor: "var(--crm-border)",
                background: "var(--crm-bg-subtle)",
                color: "var(--crm-text-primary)",
              }}
            />
            <span className="text-xs" style={{ color: "var(--crm-text-muted)" }}>
              –
            </span>
            <input
              type="date"
              aria-label="Sampai tanggal"
              value={f.endDate}
              min={f.startDate}
              onChange={(e) => {
                setPeriodPreset("custom");
                f.setRange(f.startDate, e.target.value);
              }}
              className="crm-mono h-9 rounded-[6px] border px-2 text-xs outline-none"
              style={{
                borderColor: "var(--crm-border)",
                background: "var(--crm-bg-subtle)",
                color: "var(--crm-text-primary)",
              }}
            />
          </div>
        </div>
      </section>

      {error && (
        <div
          className="mb-3 flex items-center justify-between rounded-[8px] border px-3.5 py-2.5 text-xs font-medium"
          style={{
            borderColor: "var(--crm-status-lost-border)",
            background: "var(--crm-status-lost-bg)",
            color: "var(--crm-status-lost-fg)",
          }}
        >
          <span>{error}</span>
          <button type="button" onClick={() => load(true)} className="underline font-semibold">
            Coba lagi
          </button>
        </div>
      )}

      {showFunnel && data?.channelFunnels && (
        <section className="mb-3 space-y-3">
          <BusdevConversionRateCard channelFunnels={data.channelFunnels} />
          <WeeklyBudgetPerformanceCard
            busdev={f.busdev}
            onSelectWeek={(start, end) => {
              setPeriodPreset("custom");
              f.setRange(start, end);
            }}
          />
          <BusdevFunnelCard data={data.channelFunnels} loading={loading && !data} activeBusdev={f.busdev} />
        </section>
      )}

      {/* Papan Kanban 10 Stage */}
      <div className="flex gap-2.5 overflow-x-auto pb-4" role="region" aria-label="Papan Kanban 10 Stage">
        {PIPELINE_STAGES.map((s) => {
          const col = cols[s.id] ?? { id: s.id, count: 0, cards: [] };
          const limit = visible[s.id] ?? PAGE_STEP;
          const shown = col.cards.slice(0, limit);
          const remaining = col.cards.length - shown.length;
          const isOver = overStage === s.id;
          const isDeal = s.id === "deal";
          const isLost = s.id === "lost";

          return (
            <section
              key={s.id}
              onDragOver={(e) => {
                e.preventDefault();
                if (overStage !== s.id) setOverStage(s.id);
              }}
              onDragLeave={() => setOverStage((v) => (v === s.id ? null : v))}
              onDrop={(e) => {
                e.preventDefault();
                const k = e.dataTransfer.getData("text/plain") || dragKey;
                setOverStage(null);
                setDragKey(null);
                if (k) executeMoveCard(k, s.id);
              }}
              className="flex w-[272px] shrink-0 flex-col rounded-[8px] border transition"
              style={{
                background: isOver ? "var(--crm-accent-soft)" : "var(--crm-bg-column)",
                borderColor: isOver
                  ? BRAND
                  : isDeal
                    ? "var(--crm-status-deal-border)"
                    : isLost
                      ? "var(--crm-status-lost-border)"
                      : "var(--crm-border)",
                borderStyle: isOver ? "dashed" : "solid",
                borderWidth: isOver ? "2px" : "1px",
              }}
            >
              {/* Header Kolom */}
              <header
                className="flex items-center justify-between border-b px-3 py-2.5"
                style={{
                  borderColor: "var(--crm-border)",
                  background: isDeal
                    ? "var(--crm-status-deal-bg)"
                    : isLost
                      ? "var(--crm-status-lost-bg)"
                      : "var(--crm-bg-surface)",
                  borderTopLeftRadius: "7px",
                  borderTopRightRadius: "7px",
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: s.tone }}
                  />
                  <h2
                    className="truncate text-[13px] font-semibold"
                    style={{
                      color: isDeal
                        ? "var(--crm-status-deal-fg)"
                        : isLost
                          ? "var(--crm-status-lost-fg)"
                          : "var(--crm-text-primary)",
                    }}
                  >
                    {s.label}
                  </h2>
                </div>
                <span
                  className="crm-mono rounded-[6px] border px-1.5 py-0.5 text-[11px] font-semibold"
                  style={{
                    borderColor: isDeal
                      ? "var(--crm-status-deal-border)"
                      : isLost
                        ? "var(--crm-status-lost-border)"
                        : "var(--crm-border)",
                    background: "var(--crm-bg-surface)",
                    color: isDeal
                      ? "var(--crm-status-deal-fg)"
                      : isLost
                        ? "var(--crm-status-lost-fg)"
                        : "var(--crm-text-secondary)",
                  }}
                >
                  {col.count.toLocaleString("id-ID")}
                </span>
              </header>

              {/* Daftar Kartu */}
              <div className="flex-1 space-y-2 overflow-y-auto p-2" style={{ maxHeight: "calc(100vh - 210px)" }}>
                {loading && !data ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="h-24 animate-pulse rounded-[6px] border"
                      style={{ borderColor: "var(--crm-border)", background: "var(--crm-bg-surface)" }}
                    />
                  ))
                ) : shown.length === 0 ? (
                  <div
                    className="flex h-24 items-center justify-center rounded-[6px] border border-dashed text-[11px]"
                    style={{ borderColor: "var(--crm-border)", color: "var(--crm-text-muted)" }}
                  >
                    Kosong · seret kartu ke sini
                  </div>
                ) : (
                  shown.map((c) => (
                    <KanbanCard
                      key={c.key}
                      card={c}
                      stage={s.id}
                      editable={canEditLead(me, c.sales)}
                      dragging={dragKey === c.key}
                      onDragStart={() => setDragKey(c.key)}
                      onDragEnd={() => {
                        setDragKey(null);
                        setOverStage(null);
                      }}
                      onOpen={() => setSelected({ card: c, stage: s.id })}
                    />
                  ))
                )}

                {remaining > 0 && (
                  <button
                    type="button"
                    onClick={() => setVisible((v) => ({ ...v, [s.id]: limit + PAGE_STEP }))}
                    className="w-full rounded-[6px] border py-1.5 text-xs font-semibold transition"
                    style={{
                      borderColor: "var(--crm-border)",
                      background: "var(--crm-bg-surface)",
                      color: "var(--crm-text-secondary)",
                    }}
                  >
                    Tampilkan {Math.min(PAGE_STEP, remaining)} lagi ({remaining} tersisa)
                  </button>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Modal Wajib Alasan Lost saat drag & drop ke kolom Lost */}
      {pendingLostMove && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lost-modal-title"
        >
          <div
            className="w-full max-w-[380px] rounded-[8px] border p-4"
            style={{ borderColor: "var(--crm-border)", background: "var(--crm-bg-surface)" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 id="lost-modal-title" className="text-sm font-bold" style={{ color: "var(--crm-status-lost-fg)" }}>
                Pilih Alasan Lost (Wajib)
              </h3>
              <button
                type="button"
                aria-label="Batal"
                onClick={() => setPendingLostMove(null)}
                style={{ color: "var(--crm-text-muted)" }}
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
            <p className="mb-3 text-xs" style={{ color: "var(--crm-text-secondary)" }}>
              Lead <strong>{pendingLostMove.card.name || pendingLostMove.card.phone || pendingLostMove.card.key}</strong> akan dipindahkan ke <strong>Lost</strong>. Pilih alasan batal:
            </p>
            <div className="space-y-1.5">
              {LOST_REASONS.map((reason) => {
                const checked = pendingLostMove.reason === reason;
                return (
                  <label
                    key={reason}
                    className="flex cursor-pointer items-center gap-2.5 rounded-[6px] border px-3 py-2 text-xs font-medium transition"
                    style={{
                      borderColor: checked ? "var(--crm-status-lost-fg)" : "var(--crm-border)",
                      background: checked ? "var(--crm-status-lost-bg)" : "var(--crm-bg-subtle)",
                      color: checked ? "var(--crm-status-lost-fg)" : "var(--crm-text-primary)",
                    }}
                  >
                    <input
                      type="radio"
                      name="lost_reason"
                      value={reason}
                      checked={checked}
                      onChange={() => setPendingLostMove({ ...pendingLostMove, reason })}
                      className="accent-[#B91C1C]"
                    />
                    {reason}
                  </label>
                );
              })}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingLostMove(null)}
                className="h-8 rounded-[6px] border px-3 text-xs font-semibold"
                style={{
                  borderColor: "var(--crm-border)",
                  background: "var(--crm-bg-surface)",
                  color: "var(--crm-text-secondary)",
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  const { card, reason } = pendingLostMove;
                  setPendingLostMove(null);
                  executeMoveCard(card.key, "lost", reason);
                }}
                className="h-8 rounded-[6px] px-3 text-xs font-semibold text-white"
                style={{ background: "#B91C1C" }}
              >
                Pindah ke Lost
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Panel Slide-over Detail Lead */}
      {selected && (
        <LeadDetailDrawer
          card={selected.card}
          stage={selected.stage}
          isAdmin={isAdmin}
          busdevs={data?.busdevs ?? []}
          editable={canEditLead(me, selected.card.sales)}
          onClose={() => setSelected(null)}
          onSave={saveDetail}
        />
      )}

      {/* Modal Tambah Lead Manual */}
      <CreateManualLeadModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        onCreated={() => {
          setToast("Lead manual berhasil ditambahkan");
          load(true);
        }}
        isAdmin={isAdmin}
        userName={me.name}
        salesList={salesList}
        availableCampaigns={data?.availableCampaigns ?? []}
      />

      {toast && (
        <div
          role="status"
          className="fixed bottom-4 right-4 z-50 rounded-[8px] border px-3.5 py-2.5 text-xs font-semibold text-white"
          style={{ background: "#212120", borderColor: "#3A4356" }}
        >
          {toast}
        </div>
      )}
    </main>
  );
}

/**
 * Kartu Kanban sesuai spesifikasi Tahap 1:
 * - Kartu `Lead Masuk` (`lead_masuk`): WAJIB menampilkan `source`, `campaign`, dan `landing_path` asal
 *   (contoh: `/google-ads/maklon-parfum → /thankyou/google`).
 * - Kartu lain: menampilkan `nama`, `produk`, `MOQ`, `source`, `umur di stage`, `avatar sales`, dan `badge chat belum dibaca`.
 */
function KanbanCard({
  card,
  stage,
  editable,
  dragging,
  onDragStart,
  onDragEnd,
  onOpen,
}: {
  card: PCard;
  stage: string;
  editable: boolean;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onOpen: () => void;
}) {
  const isLeadMasuk = stage === "lead_masuk";
  const age = stageAge(card.stage_changed_at || card.created_at);
  const salesInitial = (card.sales || "?").slice(0, 1).toUpperCase();

  return (
    <article
      draggable={editable}
      onDragStart={(e) => {
        if (!editable) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData("text/plain", card.key);
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Buka detail lead ${card.name || card.phone || card.key}`}
      className={`group rounded-[6px] border p-2.5 text-left transition ${
        editable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
      } ${dragging ? "opacity-40" : ""}`}
      style={{
        borderColor: "var(--crm-border)",
        background: "var(--crm-bg-surface)",
      }}
    >
      {/* Baris Atas: Nama / Nomor + Umur di Stage & Badge Unread */}
      <div className="flex items-start justify-between gap-1.5">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold leading-snug" style={{ color: "var(--crm-text-primary)" }}>
            {card.name || (card.phone ? <span className="crm-mono">{card.phone}</span> : "Prospek Baru")}
          </div>
          {card.brand && (
            <div className="truncate text-[11px] font-medium" style={{ color: "var(--crm-text-secondary)" }}>
              Brand: {card.brand}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {card.unread_count > 0 && (
            <span
              title={`${card.unread_count} pesan WA belum dibaca`}
              className="crm-mono inline-flex items-center gap-0.5 rounded-[5px] px-1.5 py-0.5 text-[10px] font-bold text-white"
              style={{ background: BRAND }}
            >
              <MessageSquare className="h-2.5 w-2.5" strokeWidth={2} />
              {card.unread_count}
            </span>
          )}
          <span
            title="Umur di stage ini"
            className="crm-mono inline-flex items-center gap-0.5 rounded-[5px] border px-1.5 py-0.5 text-[10px] font-medium"
            style={{
              borderColor: "var(--crm-border)",
              background: "var(--crm-bg-subtle)",
              color: "var(--crm-text-muted)",
            }}
          >
            <Clock className="h-2.5 w-2.5" strokeWidth={1.75} />
            {age}
          </span>
        </div>
      </div>

      {/* Konten Khusus Kartu Lead Masuk: Source, Campaign, dan Landing Path Asal */}
      {isLeadMasuk ? (
        <div className="mt-2 space-y-1.5">
          <div className="flex flex-wrap items-center gap-1">
            <span
              className="inline-flex items-center rounded-[5px] border px-1.5 py-0.5 text-[10.5px] font-semibold"
              style={{
                borderColor: "var(--crm-accent-border)",
                background: "var(--crm-accent-soft)",
                color: BRAND,
              }}
            >
              {card.source || "Website/SEO"}
            </span>
            {card.campaign && (
              <span
                className="max-w-[165px] truncate rounded-[5px] border px-1.5 py-0.5 text-[10.5px] font-semibold"
                style={{
                  borderColor: "var(--crm-blue-border)",
                  background: "var(--crm-blue-soft)",
                  color: BRAND_BLUE,
                }}
                title={`Campaign: ${card.campaign}`}
              >
                {card.campaign}
              </span>
            )}
          </div>
          <div
            className="crm-mono truncate rounded-[5px] border px-1.5 py-1 text-[10.5px]"
            style={{
              borderColor: "var(--crm-border)",
              background: "var(--crm-bg-subtle)",
              color: "var(--crm-text-secondary)",
            }}
            title={card.landing_path || "/"}
          >
            {card.landing_path || "/"}
          </div>
        </div>
      ) : (
        /* Konten Kartu Stage Lainnya: Produk, MOQ, Source, Lost Reason */
        <div className="mt-2 space-y-1.5">
          <div className="flex flex-wrap items-center gap-1">
            {card.produk ? (
              <span
                className="max-w-[150px] truncate rounded-[5px] border px-1.5 py-0.5 text-[10.5px] font-semibold"
                style={{
                  borderColor: "var(--crm-accent-border)",
                  background: "var(--crm-accent-soft)",
                  color: BRAND,
                }}
              >
                {card.produk}
              </span>
            ) : (
              <span className="text-[11px] italic" style={{ color: "var(--crm-text-muted)" }}>
                Produk belum diisi
              </span>
            )}

            {card.moq_label && (
              <span
                className="crm-mono inline-flex items-center rounded-[5px] border px-1.5 py-0.5 text-[10.5px] font-semibold"
                style={{
                  borderColor: "var(--crm-blue-border)",
                  background: "var(--crm-blue-soft)",
                  color: BRAND_BLUE,
                }}
              >
                MOQ {card.moq_label}
              </span>
            )}
          </div>

          {stage === "lost" && card.lost_reason && (
            <div
              className="truncate rounded-[5px] border px-1.5 py-0.5 text-[10.5px] font-semibold"
              style={{
                borderColor: "var(--crm-status-lost-border)",
                background: "var(--crm-status-lost-bg)",
                color: "var(--crm-status-lost-fg)",
              }}
            >
              Alasan: {card.lost_reason}
            </div>
          )}
        </div>
      )}

      {/* Footer Kartu: Source (untuk kartu non-Lead Masuk), Nomor WA, & Avatar Sales */}
      <div
        className="mt-2 flex items-center justify-between border-t pt-1.5 text-[11px]"
        style={{ borderColor: "var(--crm-border)", color: "var(--crm-text-muted)" }}
      >
        <div className="truncate">
          {!isLeadMasuk && card.source ? (
            <span className="font-medium" style={{ color: "var(--crm-text-secondary)" }}>
              {card.source}
            </span>
          ) : card.phone ? (
            <span className="crm-mono">{card.phone}</span>
          ) : (
            <span className="crm-mono">{card.key}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span
            title={`Sales: ${card.sales || "Antrean"}`}
            className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
            style={{
              background: "var(--crm-bg-subtle)",
              color: "var(--crm-text-primary)",
              border: "1px solid var(--crm-border)",
            }}
          >
            {salesInitial}
          </span>
          <span className="text-[11px] font-medium" style={{ color: "var(--crm-text-secondary)" }}>
            {card.sales || "Antrean"}
          </span>
        </div>
      </div>
    </article>
  );
}

/**
 * Panel Slide-over Detail Lead sesuai spesifikasi Tahap 1:
 * Menampilkan & mengedit:
 * - Stage (10 stage tetap; pindah ke Warm otomatis mengisi perkiraan MOQ)
 * - Alasan Lost (wajib jika stage = Lost)
 * - Sales (Hanya Admin yang bisa mengganti pemilik lead)
 * - Source (bisa dikoreksi dari daftar CRM_SOURCES)
 * - Campaign + cara terdeteksi
 * - Asal halaman (landing_path, page_url, referrer)
 * - Brand, Produk, MOQ, Catatan
 * - Riwayat perpindahan stage (dari API /api/crm/lead?code=...)
 */
function LeadDetailDrawer({
  card,
  stage,
  isAdmin,
  busdevs,
  editable,
  onClose,
  onSave,
}: {
  card: PCard;
  stage: string;
  isAdmin: boolean;
  busdevs: string[];
  editable: boolean;
  onClose: () => void;
  onSave: (
    card: PCard,
    currentStage: string,
    patch: {
      stage: string;
      lost_reason: string | null;
      sales: string | null;
      source: string | null;
      brand: string | null;
      produk_manual: string | null;
      moq_label: string | null;
      note: string | null;
    }
  ) => Promise<boolean>;
}) {
  const [st, setSt] = useState<string>(stage);
  const [lostReason, setLostReason] = useState<string>(card.lost_reason ?? LOST_REASONS[0]);
  const [sales, setSales] = useState<string>(card.sales ?? "");
  const [source, setSource] = useState<string>(card.source ?? "Website/SEO");
  const [brand, setBrand] = useState<string>(card.brand ?? "");
  const [produk, setProduk] = useState<string>(card.produk_manual ?? card.produk ?? "");
  const [moqLabel, setMoqLabel] = useState<string>(
    card.moq_label ?? (card.moq !== null ? String(card.moq) : "")
  );
  const [note, setNote] = useState<string>(card.note ?? "");
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<StageHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Tutup dengan tombol Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Ambil riwayat stage dari /api/crm/lead?code=...
  useEffect(() => {
    let active = true;
    setLoadingHistory(true);
    fetch(`/api/crm/lead?code=${encodeURIComponent(card.key)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (!active) return;
        if (j?.success && Array.isArray(j.history)) {
          setHistory(j.history);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoadingHistory(false);
      });
    return () => {
      active = false;
    };
  }, [card.key]);

  // Saat stage diganti ke Warm, otomatis isi perkiraan MOQ sesuai aturan Tahap 1
  const handleStageChange = (nextStage: string) => {
    setSt(nextStage);
    const warmMoq = getWarmStageMoq(nextStage);
    if (warmMoq) {
      setMoqLabel(warmMoq.label);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editable) return;
    setSaving(true);
    const ok = await onSave(card, stage, {
      stage: st,
      lost_reason: st === "lost" ? lostReason : null,
      sales: sales.trim() || null,
      source: source.trim() || null,
      brand: brand.trim() || null,
      produk_manual: produk.trim() || null,
      moq_label: moqLabel.trim() || null,
      note: note.trim() || null,
    });
    setSaving(false);
    if (ok) onClose();
  };

  const waHref = formatWaChatLink(card.phone, card.name, sales || card.sales, produk || card.produk);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" role="dialog" aria-modal="true" aria-label="Detail lead">
      <button type="button" aria-label="Tutup panel" className="flex-1 cursor-default" onClick={onClose} />
      <div
        className="flex h-full w-full max-w-[460px] flex-col border-l overflow-y-auto"
        style={{ borderColor: "var(--crm-border)", background: "var(--crm-bg-surface)", color: "var(--crm-text-primary)" }}
      >
        {/* Header Drawer */}
        <header
          className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b px-4 py-3.5"
          style={{ borderColor: "var(--crm-border)", background: "var(--crm-bg-surface)" }}
        >
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--crm-text-muted)" }}>
              Detail Lead · <span className="crm-mono">{card.key}</span>
            </div>
            <h2 className="mt-0.5 truncate text-base font-bold" style={{ color: "var(--crm-text-primary)" }}>
              {card.name || card.phone || card.key}
            </h2>
            {card.phone && (
              <div className="crm-mono mt-0.5 text-xs font-medium" style={{ color: "var(--crm-text-secondary)" }}>
                {card.phone}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] border"
            style={{ borderColor: "var(--crm-border)", background: "var(--crm-bg-subtle)", color: "var(--crm-text-secondary)" }}
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 space-y-4 p-4 text-xs">
          {/* 1. Stage & Alasan Lost */}
          <div className="space-y-2 rounded-[8px] border p-3" style={{ borderColor: "var(--crm-border)", background: "var(--crm-bg-subtle)" }}>
            <label htmlFor="detail-stage" className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--crm-text-secondary)" }}>
              Stage Pipeline
            </label>
            <select
              id="detail-stage"
              disabled={!editable}
              value={st}
              onChange={(e) => handleStageChange(e.target.value)}
              className="h-9 w-full rounded-[6px] border px-2.5 text-xs font-semibold outline-none disabled:opacity-60"
              style={{ borderColor: "var(--crm-border)", background: "var(--crm-bg-surface)", color: "var(--crm-text-primary)" }}
            >
              {PIPELINE_STAGES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>

            {st === "lost" && (
              <div className="pt-2">
                <label htmlFor="detail-lost-reason" className="mb-1 block text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--crm-status-lost-fg)" }}>
                  Alasan Lost (Wajib)
                </label>
                <select
                  id="detail-lost-reason"
                  disabled={!editable}
                  value={lostReason}
                  onChange={(e) => setLostReason(e.target.value)}
                  className="h-9 w-full rounded-[6px] border px-2.5 text-xs font-semibold outline-none"
                  style={{
                    borderColor: "var(--crm-status-lost-border)",
                    background: "var(--crm-status-lost-bg)",
                    color: "var(--crm-status-lost-fg)",
                  }}
                >
                  {LOST_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 2. Sales Pemilik (Admin saja yang bisa ganti) & Source (bisa dikoreksi) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="detail-sales" className="mb-1 block text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--crm-text-secondary)" }}>
                Sales Pemilik {isAdmin ? "(Admin)" : "(Terkunci)"}
              </label>
              {isAdmin ? (
                <select
                  id="detail-sales"
                  value={sales}
                  onChange={(e) => setSales(e.target.value)}
                  className="h-9 w-full rounded-[6px] border px-2.5 text-xs font-medium outline-none"
                  style={{ borderColor: "var(--crm-border)", background: "var(--crm-bg-surface)", color: "var(--crm-text-primary)" }}
                >
                  {busdevs.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              ) : (
                <div
                  className="flex h-9 items-center rounded-[6px] border px-2.5 text-xs font-semibold"
                  style={{ borderColor: "var(--crm-border)", background: "var(--crm-bg-subtle)", color: "var(--crm-text-secondary)" }}
                >
                  {card.sales || "-"}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="detail-source" className="mb-1 block text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--crm-text-secondary)" }}>
                Source (Bisa Dikoreksi)
              </label>
              <select
                id="detail-source"
                disabled={!editable}
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="h-9 w-full rounded-[6px] border px-2.5 text-xs font-medium outline-none disabled:opacity-60"
                style={{ borderColor: "var(--crm-border)", background: "var(--crm-bg-surface)", color: "var(--crm-text-primary)" }}
              >
                {CRM_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Campaign, Cara Terdeteksi, dan Asal Halaman */}
          <div
            className="space-y-2 rounded-[8px] border p-3"
            style={{ borderColor: "var(--crm-border)", background: "var(--crm-bg-subtle)" }}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--crm-text-muted)" }}>
              Atribusi & Asal Halaman
            </div>
            <div className="grid grid-cols-[110px_1fr] gap-y-1.5 text-xs">
              <span style={{ color: "var(--crm-text-muted)" }}>Campaign</span>
              <span className="font-semibold" style={{ color: BRAND_BLUE }}>
                {card.campaign || "-"}
              </span>

              <span style={{ color: "var(--crm-text-muted)" }}>Cara deteksi</span>
              <span className="font-medium" style={{ color: "var(--crm-text-primary)" }}>
                {card.detection_method || "Otomatis dari parameter halaman"}
              </span>

              <span style={{ color: "var(--crm-text-muted)" }}>Alur halaman</span>
              <span className="crm-mono break-all text-[11px]" style={{ color: "var(--crm-text-primary)" }}>
                {card.landing_path || "/"}
              </span>

              {card.referrer_raw && (
                <>
                  <span style={{ color: "var(--crm-text-muted)" }}>Referrer</span>
                  <span className="crm-mono break-all text-[11px]" style={{ color: "var(--crm-text-secondary)" }}>
                    {card.referrer_raw}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* 4. Brand, Produk, Perkiraan MOQ, Catatan */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="detail-brand" className="mb-1 block text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--crm-text-secondary)" }}>
                Nama Brand
              </label>
              <input
                id="detail-brand"
                type="text"
                disabled={!editable}
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Contoh: GlowLab"
                className="h-9 w-full rounded-[6px] border px-2.5 text-xs outline-none disabled:opacity-60"
                style={{ borderColor: "var(--crm-border)", background: "var(--crm-bg-surface)", color: "var(--crm-text-primary)" }}
              />
            </div>

            <div>
              <label htmlFor="detail-moq" className="mb-1 block text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--crm-text-secondary)" }}>
                Perkiraan MOQ
              </label>
              <input
                id="detail-moq"
                type="text"
                disabled={!editable}
                value={moqLabel}
                onChange={(e) => setMoqLabel(e.target.value)}
                placeholder="below 500 / 500 / 1000"
                className="crm-mono h-9 w-full rounded-[6px] border px-2.5 text-xs outline-none disabled:opacity-60"
                style={{ borderColor: "var(--crm-border)", background: "var(--crm-bg-surface)", color: "var(--crm-text-primary)" }}
              />
              <div className="mt-1 flex flex-wrap gap-1">
                {(["below 500", "500", "below 1000", "1000"] as const).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    disabled={!editable}
                    onClick={() => setMoqLabel(preset)}
                    className="crm-mono rounded-[4px] border px-1.5 py-0.5 text-[10px] font-semibold"
                    style={{
                      borderColor: moqLabel === preset ? BRAND : "var(--crm-border)",
                      background: moqLabel === preset ? "var(--crm-accent-soft)" : "var(--crm-bg-subtle)",
                      color: moqLabel === preset ? BRAND : "var(--crm-text-secondary)",
                    }}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="detail-produk" className="mb-1 block text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--crm-text-secondary)" }}>
              Produk Maklon
            </label>
            <input
              id="detail-produk"
              type="text"
              disabled={!editable}
              value={produk}
              onChange={(e) => setProduk(e.target.value)}
              placeholder="Contoh: Brightening Serum 20ml, Eau de Parfum"
              className="h-9 w-full rounded-[6px] border px-2.5 text-xs outline-none disabled:opacity-60"
              style={{ borderColor: "var(--crm-border)", background: "var(--crm-bg-surface)", color: "var(--crm-text-primary)" }}
            />
          </div>

          <div>
            <label htmlFor="detail-note" className="mb-1 block text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--crm-text-secondary)" }}>
              Catatan Follow-up
            </label>
            <textarea
              id="detail-note"
              rows={3}
              disabled={!editable}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ringkasan hasil diskusi HPP, bahan aktif, atau jadwal kirim sampel..."
              className="w-full rounded-[6px] border p-2.5 text-xs outline-none disabled:opacity-60"
              style={{ borderColor: "var(--crm-border)", background: "var(--crm-bg-surface)", color: "var(--crm-text-primary)" }}
            />
          </div>

          {/* 5. Riwayat Perpindahan Stage */}
          <div
            className="rounded-[8px] border p-3"
            style={{ borderColor: "var(--crm-border)", background: "var(--crm-bg-subtle)" }}
          >
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--crm-text-muted)" }}>
              <History className="h-3.5 w-3.5" strokeWidth={1.75} />
              Riwayat Stage
            </div>
            {loadingHistory ? (
              <div className="text-[11px]" style={{ color: "var(--crm-text-muted)" }}>
                Memuat riwayat...
              </div>
            ) : history.length === 0 ? (
              <div className="text-[11px]" style={{ color: "var(--crm-text-muted)" }}>
                Belum ada riwayat perpindahan stage. Masuk pada{" "}
                <span className="crm-mono">{formatDateTimeWib(card.created_at)}</span>.
              </div>
            ) : (
              <ul className="space-y-1.5">
                {history.slice(0, 10).map((h, i) => (
                  <li key={i} className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="flex items-center gap-1 font-medium" style={{ color: "var(--crm-text-primary)" }}>
                      <span>{stageLabel(h.from_stage)}</span>
                      <ArrowRight className="h-3 w-3" strokeWidth={1.75} style={{ color: "var(--crm-text-muted)" }} />
                      <strong style={{ color: BRAND }}>{stageLabel(h.to_stage)}</strong>
                    </span>
                    <span className="crm-mono text-[10.5px]" style={{ color: "var(--crm-text-muted)" }}>
                      {h.changed_by || "-"} · {formatDateTimeWib(h.changed_at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center justify-between gap-2 border-t pt-3" style={{ borderColor: "var(--crm-border)" }}>
            {waHref ? (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-[6px] border px-3 text-xs font-semibold transition"
                style={{
                  borderColor: "var(--crm-status-deal-border)",
                  background: "var(--crm-status-deal-bg)",
                  color: "var(--crm-status-deal-fg)",
                }}
              >
                <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.75} />
                Chat WhatsApp
                <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
              </a>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-9 rounded-[6px] border px-3 text-xs font-semibold"
                style={{
                  borderColor: "var(--crm-border)",
                  background: "var(--crm-bg-surface)",
                  color: "var(--crm-text-secondary)",
                }}
              >
                Tutup
              </button>
              {editable && (
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-9 items-center gap-1.5 rounded-[6px] px-4 text-xs font-semibold text-white transition disabled:opacity-50"
                  style={{ background: BRAND }}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={2} />
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
