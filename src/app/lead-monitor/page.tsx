"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  MessageSquare,
  Phone,
  TrendingUp,
  RefreshCw,
  Search,
  CheckCircle2,
  HelpCircle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Users,
  CalendarDays,
  Info,
  FileText,
  Sparkles,
} from "lucide-react";

interface LeadItem {
  id: number;
  tracking_code: string;
  assigned_to: string;
  assigned_phone: string;
  source: string;
  page_url: string | null;
  page_title: string | null;
  status: string | null;
  nama?: string | null;
  hp?: string | null;
  wa_profile_name: string | null;
  wa_phone: string | null;
  display_phone?: string | null;
  wa_message: string | null;
  created_at: string;
  confirmed_at: string | null;
  latency_seconds?: number | null;
  // Hasil form kualifikasi (kosong untuk klik WA biasa)
  is_form_lead?: boolean;
  produk?: string | null;
  utm_campaign?: string | null;
  production_tier_name?: string | null;
  lead_segment?: string | null;
  requested_quantity_pcs?: number | null;
  inquiry_reference?: string | null;
  crm_sync_status?: string | null;
  wa_clicked_at?: string | null;
  whatsapp_phone_e164?: string | null;
}

interface QualificationSummary {
  form_total: number;
  form_confirmed: number;
  form_wa_clicked: number;
  crm_synced: number;
  crm_pending: number;
  crm_failed: number;
  last_form_at: string | null;
  tiers: { tier: string; total: number; confirmed: number }[];
  categories: { category: string; total: number }[];
  pages: { page: string; total: number }[];
}

const TIER_ORDER = [
  { name: "Brand Starter", qty: "300 pcs", bar: "bg-sky-400" },
  { name: "Brand Launch", qty: "500 pcs", bar: "bg-indigo-400" },
  { name: "Brand Growth", qty: "1.000 pcs", bar: "bg-emerald-500" },
  { name: "Brand Partner", qty: "5.000 pcs", bar: "bg-amber-500" },
];

const CRM_BADGE: Record<string, { label: string; cls: string }> = {
  synced: { label: "Kommo OK", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  pending_configuration: { label: "Kommo belum diset", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  failed: { label: "Kommo gagal", cls: "bg-red-50 text-red-700 border-red-200" },
  pending: { label: "Kommo menunggu", cls: "bg-slate-100 text-slate-600 border-slate-200" },
};

interface KPIStats {
  totalClicks: number;
  confirmedChats: number;
  dropoffClicks: number;
  conversionRate: number;
}

interface BusdevBreakdown {
  busdev_name: string;
  is_active?: boolean;
  total_clicks: number;
  confirmed_chats: number;
  dropoff_clicks: number;
}

function getWibDate(offsetDays = 0): string {
  const now = new Date();
  const target = new Date(now.getTime() + offsetDays * 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(target);
}

function formatLatency(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined) return "—";
  if (seconds < 60) return `${seconds} dtk`;
  const mins = Math.floor(seconds / 60);
  const remSecs = seconds % 60;
  if (mins < 60) return `${mins}m ${remSecs > 0 ? remSecs + 's' : ''}`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}j ${mins % 60}m`;
}

export default function LeadMonitorPage() {
  const [selectedBusdev, setSelectedBusdev] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all"); // 'all' | 'confirmed' | 'dropoff'
  const [selectedPeriod, setSelectedPeriod] = useState<string>("today");
  const [startDate, setStartDate] = useState<string>(() => getWibDate(0));
  const [endDate, setEndDate] = useState<string>(() => getWibDate(0));
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedKind, setSelectedKind] = useState<string>("all"); // 'all' | 'form' | 'click'
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [kpi, setKpi] = useState<KPIStats>({
    totalClicks: 0,
    confirmedChats: 0,
    dropoffClicks: 0,
    conversionRate: 0,
  });
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [breakdown, setBreakdown] = useState<BusdevBreakdown[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [qualification, setQualification] = useState<QualificationSummary | null>(null);
  const [qualificationReady, setQualificationReady] = useState<boolean>(true);
  const [freshIds, setFreshIds] = useState<Set<number>>(new Set());
  const [newLeadNotice, setNewLeadNotice] = useState<string | null>(null);

  // Deteksi lead baru antar polling. Di-reset saat filter berubah supaya hasil
  // filter baru tidak ditandai "baru" semua.
  const seenIdsRef = useRef<Set<number> | null>(null);
  const filterKeyRef = useRef<string>("");

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch data dari API
  const fetchData = useCallback(
    async (isManual = false) => {
      if (isManual) setRefreshing(true);
      try {
        setErrorMsg(null);
        const queryParams = new URLSearchParams({
          busdev: selectedBusdev,
          status: selectedStatus,
          period: selectedPeriod,
          search: searchQuery,
          kind: selectedKind,
        });

        if (selectedPeriod === "custom") {
          if (startDate) queryParams.set("startDate", startDate);
          if (endDate) queryParams.set("endDate", endDate);
        }

        const res = await fetch(`/api/lead-monitor/stats?${queryParams.toString()}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server status ${res.status}`);
        }
        const json = await res.json();

        if (json.success) {
          const incoming: LeadItem[] = json.leads || [];
          const filterKey = queryParams.toString();
          if (filterKeyRef.current !== filterKey || seenIdsRef.current === null) {
            filterKeyRef.current = filterKey;
            seenIdsRef.current = new Set(incoming.map((l) => l.id));
          } else {
            const seen = seenIdsRef.current;
            const fresh = incoming.filter((l) => !seen.has(l.id));
            if (fresh.length > 0) {
              fresh.forEach((l) => seen.add(l.id));
              const ids = fresh.map((l) => l.id);
              const formCount = fresh.filter((l) => l.is_form_lead).length;
              setFreshIds((prev) => new Set([...prev, ...ids]));
              setNewLeadNotice(
                formCount > 0
                  ? `${formCount} lead form baru masuk${fresh.length > formCount ? ` (+${fresh.length - formCount} klik WA)` : ""}`
                  : `${fresh.length} klik WA baru masuk`
              );
              setTimeout(() => {
                setFreshIds((prev) => {
                  const next = new Set(prev);
                  ids.forEach((id) => next.delete(id));
                  return next;
                });
              }, 12000);
              setTimeout(() => setNewLeadNotice(null), 8000);
            }
          }
          setKpi(json.kpi);
          setQualification(json.qualification || null);
          setQualificationReady(json.qualificationColumnsReady !== false);
          setLeads(incoming);
          setBreakdown(json.busdevBreakdown || []);
          setLastUpdated(new Date());
        }
      } catch (err: any) {
        console.error("Error loading lead monitor:", err);
        setErrorMsg(err?.message || "Gagal menghubungkan ke database");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedBusdev, selectedStatus, selectedPeriod, startDate, endDate, searchQuery, selectedKind]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh interval 6 detik
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchData();
    }, 6000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatWib = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleTimeString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) + " WIB";
  };

  const formatDateWib = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "numeric",
      month: "short",
    });
  };

  const handlePeriodPreset = (preset: string) => {
    setSelectedPeriod(preset);
    if (preset === "today") {
      setStartDate(getWibDate(0));
      setEndDate(getWibDate(0));
    } else if (preset === "yesterday") {
      setStartDate(getWibDate(-1));
      setEndDate(getWibDate(-1));
    } else if (preset === "since_new_system") {
      setStartDate("2026-10-06");
      setEndDate(getWibDate(0));
    } else if (preset === "7d") {
      setStartDate("2026-10-06");
      setEndDate(getWibDate(0));
    } else if (preset === "30d") {
      setStartDate("2026-10-06");
      setEndDate(getWibDate(0));
    } else if (preset === "all") {
      setStartDate("2026-10-06");
      setEndDate(getWibDate(0));
    }
  };

  // Hitung total clicks per busdev dari breakdown
  const busdevTotals = useMemo(() => {
    const map: Record<string, { total: number; confirmed: number; isActive?: boolean }> = {};
    for (const b of breakdown) {
      const name = b.busdev_name;
      map[name] = { total: b.total_clicks, confirmed: b.confirmed_chats, isActive: b.is_active };
    }
    return map;
  }, [breakdown]);

  // Daftar BusDev yang tersedia
  const busdevList = useMemo(() => {
    const defaults = ["Annisa", "Jessica", "Diaz", "Irma"];
    const names = new Set(defaults);
    for (const b of breakdown) {
      if (b.busdev_name && b.busdev_name !== "Unassigned") {
        names.add(b.busdev_name);
      }
    }
    return Array.from(names);
  }, [breakdown]);

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 antialiased font-sans">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand & Page Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-2xs">
              DL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-900 tracking-tight">
                  Lead & WhatsApp Inbound Monitor
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Meta Webhook Active
                </span>
              </div>
            </div>
          </div>

          {/* Top Right Quick Controls */}
          <div className="flex items-center gap-2.5">
            {/* Auto Refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              title={autoRefresh ? "Auto-refresh aktif tiap 6s" : "Auto-refresh dijeda"}
              className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                autoRefresh
                  ? "bg-emerald-50/70 border-emerald-200 text-emerald-700"
                  : "bg-slate-100 border-slate-200 text-slate-500"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${autoRefresh ? "bg-emerald-500 animate-ping" : "bg-slate-400"}`} />
              Live · 6 dtk
            </button>

            {/* Refresh Button */}
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 transition-all shadow-2xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-orange-500" : "text-slate-500"}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Last updated timestamp */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-400 shrink-0 font-mono ml-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{lastUpdated ? formatWib(lastUpdated.toISOString()) : "—"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-5">
        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-xs text-amber-900 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Koneksi Database Terhambat:</strong> {errorMsg}. Mencoba kembali secara otomatis...
              </span>
            </div>
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="px-2.5 py-1 bg-amber-600 text-white rounded-md text-[11px] font-medium hover:bg-amber-700 transition shrink-0"
            >
              {refreshing ? "Memuat..." : "Coba Sekarang"}
            </button>
          </div>
        )}

        {/* Peringatan migrasi: kolom form kualifikasi belum ada di database */}
        {!qualificationReady && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-900 flex items-start gap-2.5 shadow-2xs">
            <HelpCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>
              <strong>Migrasi database belum dijalankan.</strong> Kolom hasil form (tier, segmen, status Kommo) belum ada,
              jadi lead form hanya dikenali dari teks intent. Jalankan{" "}
              <code className="font-mono">00022_lead_qualification_fields.sql</code> dan{" "}
              <code className="font-mono">00023_production_tiers_and_international_phone.sql</code>.
            </span>
          </div>
        )}

        {/* Notifikasi lead baru (hilang sendiri) */}
        {newLeadNotice && (
          <div className="bg-emerald-600 text-white rounded-xl px-4 py-2.5 text-xs font-semibold flex items-center gap-2 shadow-xs animate-pulse">
            <Sparkles className="w-4 h-4" />
            {newLeadNotice}
          </div>
        )}

        {/* Unified Filter Toolbar Card (BusDev Dropdown + Custom Date Range) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
            {/* Filter Group: BusDev Dropdown + Date Range */}
            <div className="flex flex-wrap items-center gap-3">
              {/* BusDev Dropdown Selector (Bukan Navbar) */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
                <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">BusDev:</span>
                <select
                  value={selectedBusdev}
                  onChange={(e) => setSelectedBusdev(e.target.value)}
                  className="text-xs bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
                >
                  <option value="all">Semua BusDev (Total: {kpi.totalClicks})</option>
                  {busdevList.map((name) => {
                    const stats = busdevTotals[name];
                    const statusNote = stats?.isActive === false ? " (Nonaktif)" : "";
                    const label = stats ? `${name}${statusNote} (${stats.confirmed}/${stats.total} lead)` : name;
                    return (
                      <option key={name} value={name}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Date Presets Pills */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 overflow-x-auto">
                {[
                  { id: "today", label: "Hari Ini" },
                  { id: "yesterday", label: "Kemarin" },
                  { id: "since_new_system", label: "Sejak Sistem Baru (06 Okt)" },
                  { id: "7d", label: "7 Hari (Sistem Baru)" },
                  { id: "all", label: "Semua Waktu" },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePeriodPreset(p.id)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                      selectedPeriod === p.id
                        ? "bg-white text-slate-900 font-semibold shadow-2xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Custom Date Range: Dari ... Ke ... */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-600 shadow-2xs">
                <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-[11px] font-medium text-slate-500">Dari:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setSelectedPeriod("custom");
                  }}
                  className="bg-transparent text-xs font-mono text-slate-800 focus:outline-hidden cursor-pointer"
                />
                <span className="text-[11px] font-medium text-slate-400">s/d</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setSelectedPeriod("custom");
                  }}
                  className="bg-transparent text-xs font-mono text-slate-800 focus:outline-hidden cursor-pointer"
                />
              </div>
            </div>

            {/* Right Badge: Active Filter Status */}
            <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
              {selectedPeriod === "custom" && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  Rentang Kustom: {startDate || "—"} s/d {endDate || "—"}
                </span>
              )}
              {selectedBusdev !== "all" && (
                <button
                  type="button"
                  onClick={() => setSelectedBusdev("all")}
                  className="text-[11px] text-slate-500 hover:text-slate-800 underline transition"
                >
                  Reset BusDev
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Baseline Info Banner */}
        <div className="bg-blue-50/80 border border-blue-200/70 rounded-xl px-4 py-2.5 text-xs text-blue-900 flex items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-[11.5px] leading-relaxed text-blue-800">
              <strong className="font-semibold text-blue-900">Baseline Sistem Terpadu:</strong> Pelacakan presisi MacroDroid & Confirmed Auto-Balancer aktif mulai <strong>06 Oktober 2026</strong>. Filter preset dibatasi mulai tanggal ini agar perbandingan performa antar sales adil tanpa bias data lama.
            </p>
          </div>
        </div>

        {/* Compact KPI Cards (1 Row, 4 Columns) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Total Kunjungan Web */}
          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Total Klik CTA
              </span>
              <Phone className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
              {kpi.totalClicks}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 truncate">
              Kunjungan diarahkan ke WA
            </div>
          </div>

          {/* Card 2: Chat Masuk (Valid) */}
          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Chat Masuk (Valid)
              </span>
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-emerald-600">
              {kpi.confirmedChats}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 truncate">
              Pesan terkonfirmasi masuk
            </div>
          </div>

          {/* Card 3: Hanya Klik (Drop-off) */}
          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Hanya Klik (Drop-off)
              </span>
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-amber-600">
              {kpi.dropoffClicks}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 truncate">
              Buka WA tanpa kirim pesan
            </div>
          </div>

          {/* Card 4: Rasio Konversi */}
          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Conversion Rate
              </span>
              <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
              {kpi.conversionRate}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1 truncate">
              Rasio klik berhasil jadi chat
            </div>
          </div>
        </div>

        {/* 4 Cards Performa Tiap BusDev */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Performa Tiap Sales (BusDev)
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Klik card untuk memfilter riwayat per sales
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {["Annisa", "Diaz", "Jessica", "Irma"].map((targetName) => {
              const b = breakdown.find(
                (item) => item.busdev_name.toLowerCase() === targetName.toLowerCase()
              ) || {
                busdev_name: targetName,
                is_active: true,
                total_clicks: 0,
                confirmed_chats: 0,
                dropoff_clicks: 0,
                direct_chats: 0,
              };

              const isSelected = selectedBusdev.toLowerCase() === targetName.toLowerCase();
              const convPct =
                b.total_clicks > 0
                  ? ((b.confirmed_chats / b.total_clicks) * 100).toFixed(0) + "%"
                  : "0%";

              const badgeColors: Record<string, { bg: string; text: string; initial: string }> = {
                annisa: { bg: "bg-indigo-50 border-indigo-200 text-indigo-700", text: "text-indigo-600", initial: "AN" },
                diaz: { bg: "bg-blue-50 border-blue-200 text-blue-700", text: "text-blue-600", initial: "DZ" },
                jessica: { bg: "bg-emerald-50 border-emerald-200 text-emerald-700", text: "text-emerald-600", initial: "JS" },
                irma: { bg: "bg-amber-50 border-amber-200 text-amber-700", text: "text-amber-600", initial: "IR" },
              };
              const color = badgeColors[targetName.toLowerCase()] || badgeColors.annisa;

              return (
                <div
                  key={targetName}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedBusdev("all");
                    } else {
                      setSelectedBusdev(targetName);
                    }
                  }}
                  className={`bg-white rounded-xl p-3.5 sm:p-4 border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    isSelected
                      ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10 shadow-xs"
                      : "border-slate-200/90 hover:border-slate-300 hover:shadow-2xs shadow-2xs"
                  }`}
                >
                  {/* Card Header: Avatar, Name, Status Pill */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] border ${color.bg}`}
                      >
                        {color.initial}
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        {targetName}
                      </span>
                    </div>
                    {b.is_active === false ? (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                        Nonaktif
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-500" />
                        Aktif
                      </span>
                    )}
                  </div>

                  {/* Main Metric: Jumlah yang Chat */}
                  <div className="my-1">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                      Chat Masuk (Valid)
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-bold font-mono tracking-tight text-emerald-600">
                        {b.confirmed_chats}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">
                        chat
                      </span>
                    </div>
                  </div>

                  {/* Sub Metrics: Total Klik & Drop-off */}
                  <div className="pt-2 mt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Total Klik
                      </span>
                      <span className="font-mono font-bold text-slate-700">
                        {b.total_clicks}
                      </span>
                    </div>
                    <div>
                      <span className="text-amber-600/80 block text-[10px] uppercase font-semibold">
                        Drop-off
                      </span>
                      <span className="font-mono font-bold text-amber-600">
                        {b.dropoff_clicks}
                      </span>
                    </div>
                  </div>

                  {/* Footer note: Conversion & Filter Indicator */}
                  <div className="mt-2 pt-1.5 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400">
                    <span>
                      Konversi: <strong className="text-slate-600 font-mono">{convPct}</strong>
                    </span>
                    {isSelected && (
                      <span className="text-emerald-600 font-semibold">Filter Aktif ✓</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Funnel Form Kualifikasi */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Funnel Form Kualifikasi
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">
              {qualification?.last_form_at
                ? `Form terakhir: ${formatDateWib(qualification.last_form_at)}, ${formatWib(qualification.last_form_at)}`
                : "Belum ada form masuk pada filter ini"}
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {(() => {
              const q = qualification;
              const total = q?.form_total ?? 0;
              const pct = (n: number) => (total > 0 ? `${Math.round((n / total) * 100)}%` : "0%");
              const crmProblem = (q?.crm_pending ?? 0) + (q?.crm_failed ?? 0);
              const stats = [
                { label: "Form Masuk", value: total, note: "Lead mengisi form", tone: "text-slate-900" },
                { label: "Klik WA Thank-you", value: q?.form_wa_clicked ?? 0, note: `${pct(q?.form_wa_clicked ?? 0)} dari form`, tone: "text-blue-600" },
                { label: "Chat Terkonfirmasi", value: q?.form_confirmed ?? 0, note: `${pct(q?.form_confirmed ?? 0)} dari form`, tone: "text-emerald-600" },
                {
                  label: "Sync Kommo",
                  value: q?.crm_synced ?? 0,
                  note: crmProblem > 0 ? `${crmProblem} belum/gagal sync` : "Semua tersinkron",
                  tone: crmProblem > 0 ? "text-amber-600" : "text-emerald-600",
                },
              ];
              return stats.map((st) => (
                <div key={st.label} className="rounded-lg border border-slate-200/80 bg-slate-50/50 p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{st.label}</div>
                  <div className={`text-2xl font-bold font-mono tracking-tight mt-0.5 ${st.tone}`}>{st.value}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 truncate">{st.note}</div>
                </div>
              ));
            })()}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Sebaran tier */}
            <div className="space-y-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Sebaran Tier Produksi</div>
              {(() => {
                const rows = TIER_ORDER.map((t) => {
                  const hit = qualification?.tiers.find((x) => x.tier === t.name);
                  return { ...t, total: hit?.total ?? 0, confirmed: hit?.confirmed ?? 0 };
                });
                const max = Math.max(1, ...rows.map((r) => r.total));
                return rows.map((r) => (
                  <div key={r.name}>
                    <div className="flex items-center justify-between text-[11px] mb-0.5">
                      <span className="font-medium text-slate-700">
                        {r.name} <span className="text-slate-400">· {r.qty}</span>
                      </span>
                      <span className="font-mono text-slate-600">
                        {r.total} <span className="text-emerald-600">({r.confirmed} chat)</span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full rounded-full ${r.bar}`} style={{ width: `${(r.total / max) * 100}%` }} />
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Kategori produk */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Produk yang Diminati</div>
              {(qualification?.categories.length ?? 0) === 0 ? (
                <p className="text-[11px] text-slate-400">Belum ada data.</p>
              ) : (
                qualification!.categories.map((c) => (
                  <div key={c.category} className="flex items-center justify-between text-[11px] border-b border-slate-100 pb-1">
                    <span className="text-slate-700 truncate pr-2">{c.category}</span>
                    <span className="font-mono font-semibold text-slate-800">{c.total}</span>
                  </div>
                ))
              )}
            </div>

            {/* Landing page */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Form per Landing Page</div>
              {(qualification?.pages.length ?? 0) === 0 ? (
                <p className="text-[11px] text-slate-400">Belum ada data.</p>
              ) : (
                qualification!.pages.map((pg) => (
                  <div key={pg.page} className="flex items-center justify-between text-[11px] border-b border-slate-100 pb-1">
                    <span className="text-slate-700 truncate pr-2 font-mono" title={pg.page}>{pg.page}</span>
                    <span className="font-mono font-semibold text-slate-800">{pg.total}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Audit Table Section */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          {/* Table Toolbar */}
          <div className="px-4 py-3 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Riwayat Validasi Lead
              </h2>
              <span className="text-[11px] font-mono font-medium px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                {leads.length} data
              </span>

              {/* Status Filter Tabs (Semua / Valid / Drop-off) */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 ml-1">
                <button
                  type="button"
                  onClick={() => setSelectedStatus("all")}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                    selectedStatus === "all"
                      ? "bg-white text-slate-900 font-semibold shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Semua ({kpi.totalClicks})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatus("confirmed")}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all flex items-center gap-1.5 ${
                    selectedStatus === "confirmed"
                      ? "bg-white text-emerald-700 font-semibold shadow-2xs"
                      : "text-slate-500 hover:text-emerald-700"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Chat Masuk ({kpi.confirmedChats})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatus("dropoff")}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all flex items-center gap-1.5 ${
                    selectedStatus === "dropoff"
                      ? "bg-white text-amber-700 font-semibold shadow-2xs"
                      : "text-slate-500 hover:text-amber-700"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Drop-off ({kpi.dropoffClicks})
                </button>
              </div>
            </div>

            {/* Jenis lead: form kualifikasi vs klik WA biasa */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/60">
              {[
                { id: "all", label: "Semua Jenis" },
                { id: "form", label: "Form Kualifikasi" },
                { id: "click", label: "Klik WA" },
              ].map((k) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setSelectedKind(k.id)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all whitespace-nowrap ${
                    selectedKind === k.id
                      ? "bg-white text-slate-900 font-semibold shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {k.label}
                </button>
              ))}
            </div>

            {/* Compact Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kode, nama, nomor, URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-md text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-400 transition-all"
              />
            </div>
          </div>

          {/* Dense Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-semibold text-[11px] tracking-wide">
                  <th className="py-2.5 px-3.5 w-10 text-center">#</th>
                  <th className="py-2.5 px-3.5">Status Validasi</th>
                  <th className="py-2.5 px-3.5">Waktu Klik</th>
                  <th className="py-2.5 px-3.5">Waktu Chat</th>
                  <th className="py-2.5 px-3.5">Latency (Selisih)</th>
                  <th className="py-2.5 px-3.5">No. HP Pengirim</th>
                  <th className="py-2.5 px-3.5">BusDev</th>
                  <th className="py-2.5 px-3.5">Kualifikasi Form</th>
                  <th className="py-2.5 px-3.5">Display Name WA</th>
                  <th className="py-2.5 px-3.5">Tracking Code</th>
                  <th className="py-2.5 px-3.5">Asal Halaman & Kampanye</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={11} className="py-10 text-center text-slate-400">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-slate-400" />
                      Memuat data audit...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-10 text-center text-slate-400">
                      <p className="font-medium text-slate-600 mb-1">
                        Tidak ada data lead untuk filter ini
                      </p>
                      <p className="text-xs text-slate-400 mb-3">
                        {selectedPeriod === "today"
                          ? "Belum ada lead baru yang tercatat untuk filter ini hari ini."
                          : "Coba sesuaikan rentang tanggal, status validasi, atau pilih Semua BusDev."}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        {selectedStatus !== "all" && (
                          <button
                            type="button"
                            onClick={() => setSelectedStatus("all")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                          >
                            Tampilkan Semua Status
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handlePeriodPreset("7d")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                        >
                          Lihat 7 Hari Terakhir
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  leads.map((lead, idx) => {
                    const isConfirmed = lead.status === "confirmed";
                    const clientPhone = lead.display_phone || lead.wa_phone || lead.hp;
                    const phoneSource = lead.wa_phone ? "WA" : lead.hp ? "Form Web" : null;
                    const crmBadge = lead.crm_sync_status ? CRM_BADGE[lead.crm_sync_status] : null;

                    return (
                      <tr
                        key={lead.id || idx}
                        className={`hover:bg-slate-50/70 transition-colors duration-700 ${
                          freshIds.has(lead.id)
                            ? "bg-amber-100/70"
                            : isConfirmed
                              ? "bg-emerald-50/15"
                              : ""
                        }`}
                      >
                        {/* Number */}
                        <td className="py-2.5 px-3.5 text-center text-slate-400 font-mono text-[11px]">
                          {idx + 1}
                        </td>

                        {/* Status Chip */}
                        <td className="py-2.5 px-3.5 whitespace-nowrap">
                          {isConfirmed ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Chat Masuk
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              {lead.is_form_lead ? "Form, belum chat" : "Hanya Klik"}
                            </span>
                          )}
                        </td>

                        {/* Waktu Klik */}
                        <td className="py-2.5 px-3.5 whitespace-nowrap font-mono text-[11px] text-slate-700">
                          <div>{formatWib(lead.created_at)}</div>
                          <div className="text-[10px] text-slate-400 font-sans">{formatDateWib(lead.created_at)}</div>
                        </td>

                        {/* Waktu Chat Masuk */}
                        <td className="py-2.5 px-3.5 whitespace-nowrap">
                          {isConfirmed && lead.confirmed_at ? (
                            <div className="font-mono text-[11px] text-emerald-700">
                              <div>{formatWib(lead.confirmed_at)}</div>
                              <div className="text-[10px] text-emerald-500 font-sans">{formatDateWib(lead.confirmed_at)}</div>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[10px] italic">
                              Belum kirim
                            </span>
                          )}
                        </td>

                        {/* Latency (Selisih Waktu) */}
                        <td className="py-2.5 px-3.5 whitespace-nowrap font-mono text-[11px]">
                          {isConfirmed ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                              {formatLatency(lead.latency_seconds)}
                            </span>
                          ) : (
                            <span className="text-amber-600 text-[10px] font-sans">
                              Drop-off
                            </span>
                          )}
                        </td>

                        {/* No. HP Klien (Universal with Form Fallback) */}
                        <td className="py-2.5 px-3.5 whitespace-nowrap font-mono text-[11px]">
                          {clientPhone ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-900 font-semibold">{clientPhone}</span>
                              {phoneSource && (
                                <span
                                  className={`text-[9px] px-1.5 py-0.2 rounded font-sans font-medium uppercase ${
                                    phoneSource === "WA"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                  title={phoneSource === "WA" ? "Nomor WhatsApp pengirim" : "Nomor formulir web sebelum drop-off"}
                                >
                                  {phoneSource}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>

                        {/* BusDev */}
                        <td className="py-2.5 px-3.5 whitespace-nowrap">
                          <span className="font-semibold text-slate-800">
                            {lead.assigned_to}
                          </span>
                        </td>

                        {/* Kualifikasi Form */}
                        <td className="py-2.5 px-3.5 whitespace-nowrap">
                          {lead.is_form_lead ? (
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-slate-800">
                                  {lead.production_tier_name || "Tier tidak tercatat"}
                                </span>
                                {lead.requested_quantity_pcs ? (
                                  <span className="text-[10px] font-mono text-slate-500">
                                    {lead.requested_quantity_pcs.toLocaleString("id-ID")} pcs
                                  </span>
                                ) : null}
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                {lead.produk && <span>{lead.produk}</span>}
                                {lead.lead_segment && (
                                  <span className="px-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                                    {lead.lead_segment}
                                  </span>
                                )}
                                {crmBadge && (
                                  <span className={`px-1 rounded border ${crmBadge.cls}`}>{crmBadge.label}</span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>

                        {/* Display Name WA */}
                        <td className="py-2.5 px-3.5 whitespace-nowrap">
                          {isConfirmed && lead.wa_profile_name ? (
                            <span className="font-semibold text-emerald-800 flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-emerald-600" />
                              {lead.wa_profile_name}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>

                        {/* Tracking Code */}
                        <td className="py-2.5 px-3.5 whitespace-nowrap">
                          <button
                            onClick={() => copyToClipboard(lead.tracking_code)}
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-1.5 py-0.5 rounded transition-all"
                            title="Klik untuk salin kode"
                          >
                            <span>{lead.tracking_code}</span>
                            {copiedCode === lead.tracking_code ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-2.5 h-2.5 text-slate-400" />
                            )}
                          </button>
                        </td>

                        {/* Asal Halaman */}
                        <td className="py-2.5 px-3.5 max-w-[200px]">
                          <div className="text-slate-800 font-medium truncate" title={lead.page_url || ""}>
                            {lead.page_url || "/thankyou"}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            <span className="px-1 py-0.2 rounded bg-slate-100 text-slate-600 font-mono text-[9px] uppercase">
                              {lead.source || "direct"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
