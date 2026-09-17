"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
  AlertCircle,
  Users,
  Calendar,
  CalendarRange,
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
  wa_profile_name: string | null;
  wa_phone: string | null;
  wa_message: string | null;
  created_at: string;
  confirmed_at: string | null;
}

interface KPIStats {
  totalClicks: number;
  confirmedChats: number;
  dropoffClicks: number;
  conversionRate: number;
}

interface BusdevBreakdown {
  busdev_name: string;
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

export default function LeadMonitorPage() {
  const [selectedBusdev, setSelectedBusdev] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("today");
  const [startDate, setStartDate] = useState<string>(() => getWibDate(0));
  const [endDate, setEndDate] = useState<string>(() => getWibDate(0));
  const [searchQuery, setSearchQuery] = useState<string>("");
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
          period: selectedPeriod,
          search: searchQuery,
        });

        if (startDate) queryParams.set("startDate", startDate);
        if (endDate) queryParams.set("endDate", endDate);

        const res = await fetch(`/api/lead-monitor/stats?${queryParams.toString()}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server status ${res.status}`);
        }
        const json = await res.json();

        if (json.success) {
          setKpi(json.kpi);
          setLeads(json.leads || []);
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
    [selectedBusdev, selectedPeriod, startDate, endDate, searchQuery]
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
    } else if (preset === "7d") {
      setStartDate(getWibDate(-7));
      setEndDate(getWibDate(0));
    } else if (preset === "30d") {
      setStartDate(getWibDate(-30));
      setEndDate(getWibDate(0));
    } else if (preset === "all") {
      setStartDate("");
      setEndDate("");
    }
  };

  // Hitung total clicks per busdev dari breakdown
  const busdevTotals = useMemo(() => {
    const map: Record<string, { total: number; confirmed: number }> = {};
    for (const b of breakdown) {
      const name = b.busdev_name;
      map[name] = { total: b.total_clicks, confirmed: b.confirmed_chats };
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
              Auto 6s
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
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
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
                    const label = stats ? `${name} (${stats.confirmed}/${stats.total} lead)` : name;
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
                  { id: "7d", label: "7 Hari" },
                  { id: "30d", label: "30 Hari" },
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
                <CalendarRange className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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

        {/* Audit Table Section */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          {/* Table Toolbar */}
          <div className="px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Riwayat Validasi Lead
              </h2>
              <span className="text-[11px] font-mono font-medium px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                {leads.length} data
              </span>
            </div>

            {/* Compact Search Input */}
            <div className="relative w-full sm:w-64">
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
                  <th className="py-2.5 px-3.5">Tracking Code</th>
                  <th className="py-2.5 px-3.5">Asal Halaman & Kampanye</th>
                  <th className="py-2.5 px-3.5">BusDev</th>
                  <th className="py-2.5 px-3.5">Display Name WA</th>
                  <th className="py-2.5 px-3.5">No. HP Pengirim</th>
                  <th className="py-2.5 px-3.5">Waktu Chat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-slate-400">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-slate-400" />
                      Memuat data audit...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-slate-400">
                      <p className="font-medium text-slate-600 mb-1">
                        Tidak ada data lead untuk filter ini
                      </p>
                      <p className="text-xs text-slate-400 mb-3">
                        {selectedPeriod === "today"
                          ? "Belum ada lead baru yang tercatat untuk hari ini. Riwayat sebelumnya tetap aman."
                          : selectedPeriod === "yesterday"
                          ? "Tidak ada lead yang tercatat pada hari kemarin untuk filter ini."
                          : "Coba sesuaikan rentang tanggal, kata kunci pencarian, atau pilih Semua BusDev."}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handlePeriodPreset("7d")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                        >
                          Lihat 7 Hari Terakhir
                        </button>
                        {selectedBusdev !== "all" && (
                          <button
                            type="button"
                            onClick={() => setSelectedBusdev("all")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                          >
                            Tampilkan Semua BusDev
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handlePeriodPreset("all")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                        >
                          Semua Waktu
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  leads.map((lead, idx) => {
                    const isConfirmed = lead.status === "confirmed";

                    return (
                      <tr
                        key={lead.id || idx}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isConfirmed ? "bg-emerald-50/15" : ""
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
                              Hanya Klik
                            </span>
                          )}
                        </td>

                        {/* Waktu Klik */}
                        <td className="py-2.5 px-3.5 whitespace-nowrap font-mono text-[11px] text-slate-700">
                          <div>{formatWib(lead.created_at)}</div>
                          <div className="text-[10px] text-slate-400 font-sans">{formatDateWib(lead.created_at)}</div>
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
                        <td className="py-2.5 px-3.5 max-w-[240px]">
                          <div className="text-slate-800 font-medium truncate" title={lead.page_url || ""}>
                            {lead.page_url || "/thankyou"}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            <span className="px-1 py-0.2 rounded bg-slate-100 text-slate-600 font-mono text-[9px] uppercase">
                              {lead.source || "direct"}
                            </span>
                          </div>
                        </td>

                        {/* BusDev */}
                        <td className="py-2.5 px-3.5 whitespace-nowrap">
                          <span className="font-semibold text-slate-800">
                            {lead.assigned_to}
                          </span>
                        </td>

                        {/* Display Name WA */}
                        <td className="py-2.5 px-3.5 whitespace-nowrap">
                          {isConfirmed && lead.wa_profile_name ? (
                            <span className="font-semibold text-emerald-800 flex items-center gap-1">
                              <MessageCircle className="w-3 h-3 text-emerald-600" />
                              {lead.wa_profile_name}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>

                        {/* No. HP WA */}
                        <td className="py-2.5 px-3.5 whitespace-nowrap font-mono text-[11px]">
                          {isConfirmed && lead.wa_phone ? (
                            <span className="text-slate-900 font-semibold">{lead.wa_phone}</span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>

                        {/* Waktu Chat Masuk */}
                        <td className="py-2.5 px-3.5 whitespace-nowrap">
                          {isConfirmed && lead.confirmed_at ? (
                            <span className="text-emerald-700 font-mono text-[11px]">
                              {formatWib(lead.confirmed_at)}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px] italic">
                              Belum kirim
                            </span>
                          )}
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
