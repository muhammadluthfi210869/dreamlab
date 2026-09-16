"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  MessageCircle,
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

export default function LeadMonitorPage() {
  const [selectedBusdev, setSelectedBusdev] = useState<string>("Annisa");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("today");
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

  // Fetch data dari API
  const fetchData = useCallback(
    async (isManual = false) => {
      if (isManual) setRefreshing(true);
      try {
        const queryParams = new URLSearchParams({
          busdev: selectedBusdev,
          period: selectedPeriod,
          search: searchQuery,
        });

        const res = await fetch(`/api/lead-monitor/stats?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Gagal mengambil data monitoring");
        const json = await res.json();

        if (json.success) {
          setKpi(json.kpi);
          setLeads(json.leads || []);
          setBreakdown(json.busdevBreakdown || []);
          setLastUpdated(new Date());
        }
      } catch (err) {
        console.error("Error loading lead monitor:", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedBusdev, selectedPeriod, searchQuery]
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

  // Hitung total clicks per busdev dari breakdown
  const busdevTotals = useMemo(() => {
    const map: Record<string, { total: number; confirmed: number }> = {};
    for (const b of breakdown) {
      const name = b.busdev_name;
      map[name] = { total: b.total_clicks, confirmed: b.confirmed_chats };
    }
    return map;
  }, [breakdown]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased pb-20">
      {/* Top Notice Banner */}
      <div className="bg-slate-900 text-white px-4 py-2 text-xs sm:text-sm font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE MONITOR
            </span>
            <span className="text-slate-300">
              Validasi Inbound WhatsApp Resmi Meta Cloud API — Zero Auto-Reply / Bebas Spam Bot
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <span>Update Terakhir: {lastUpdated ? formatWib(lastUpdated.toISOString()) : "—"}</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                DL
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  Lead & WhatsApp Inbound Monitor
                </h1>
                <p className="text-xs text-slate-500">
                  Transparansi Konversi: Kunjungan Web vs Chat WhatsApp Masuk
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Auto-refresh toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                autoRefresh
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "bg-slate-100 border-slate-300 text-slate-600"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${autoRefresh ? "bg-emerald-500 animate-ping" : "bg-slate-400"}`}
              />
              Auto-refresh (6s): {autoRefresh ? "ON" : "PAUSED"}
            </button>

            {/* Manual Refresh button */}
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 active:scale-95 transition-all shadow-2xs disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-orange-500" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* BusDev & Filter Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* BusDev Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              BusDev:
            </span>
            {["Annisa", "Jessica", "Diaz", "Irma", "all"].map((b) => {
              const label = b === "all" ? "Semua BusDev" : b;
              const isSelected = selectedBusdev.toLowerCase() === b.toLowerCase();
              const countInfo = b === "all" ? null : busdevTotals[b];

              return (
                <button
                  key={b}
                  onClick={() => setSelectedBusdev(b)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {label}
                  {b === "Annisa" && (
                    <span className="px-1.5 py-0.2 text-[10px] rounded bg-orange-400 text-slate-950 font-bold">
                      Aktif Test
                    </span>
                  )}
                  {countInfo && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isSelected ? "bg-slate-800 text-emerald-400" : "bg-white text-slate-500"
                      }`}
                    >
                      {countInfo.confirmed}/{countInfo.total}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Time Period Pills */}
          <div className="flex items-center gap-1 shrink-0 bg-slate-100 p-1 rounded-lg">
            {[
              { id: "today", label: "Hari Ini" },
              { id: "7d", label: "7 Hari Terakhir" },
              { id: "30d", label: "30 Hari Terakhir" },
              { id: "all", label: "Semua Waktu" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPeriod(p.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  selectedPeriod === p.id
                    ? "bg-white text-slate-900 font-semibold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* 4 KPI Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Kunjungan / Klik */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Klik / Kunjungan
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Phone className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {kpi.totalClicks}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              Calon klien yang diarahkan ke WhatsApp
            </p>
          </div>

          {/* Card 2: Terkonfirmasi Chat Masuk */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-2xs relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Chat Masuk (Valid)
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-emerald-600 tracking-tight">
              {kpi.confirmedChats}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Beneran menekan "Send" di WhatsApp
            </p>
          </div>

          {/* Card 3: Hanya Klik / Drop-off */}
          <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-2xs relative overflow-hidden bg-gradient-to-br from-white to-amber-50/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Hanya Klik (Drop-off)
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-amber-600 tracking-tight">
              {kpi.dropoffClicks}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Buka WA tapi batal kirim (tidak dihitung kuota)
            </p>
          </div>

          {/* Card 4: Inbound Conversion Rate */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Konversi Chat Masuk
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-blue-600 tracking-tight">
              {kpi.conversionRate}%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Rasio klik web yang sukses jadi chat
            </p>
          </div>
        </div>

        {/* Audit Table Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* Table Header Controls */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Audit Riwayat Lead & Validasi WhatsApp
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {leads.length} data
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Menampilkan seluruh data secara transparan termasuk yang batal/drop-off
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kode, nama WA, nomor, URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4 w-12">No</th>
                  <th className="py-3 px-4">Status Validasi</th>
                  <th className="py-3 px-4">Waktu Klik</th>
                  <th className="py-3 px-4">Tracking Code</th>
                  <th className="py-3 px-4">Asal Halaman</th>
                  <th className="py-3 px-4">BusDev</th>
                  <th className="py-3 px-4">Nama Display WA</th>
                  <th className="py-3 px-4">Nomor WA Klien</th>
                  <th className="py-3 px-4">Waktu Chat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                      Memuat data lead...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      <HelpCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                      Belum ada lead yang tercatat untuk filter ini.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead, idx) => {
                    const isConfirmed = lead.status === "confirmed";

                    return (
                      <tr
                        key={lead.id || idx}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isConfirmed ? "bg-emerald-50/20" : ""
                        }`}
                      >
                        {/* No */}
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                          {idx + 1}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {isConfirmed ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Chat Masuk (Valid)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-100/90 text-amber-800 border border-amber-300">
                              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                              Hanya Klik (Drop-off)
                            </span>
                          )}
                        </td>

                        {/* Waktu Klik */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-semibold text-slate-800 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {formatWib(lead.created_at)}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {formatDateWib(lead.created_at)}
                          </div>
                        </td>

                        {/* Tracking Code */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            onClick={() => copyToClipboard(lead.tracking_code)}
                            className="group font-mono text-[11px] font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded flex items-center gap-1 transition-all"
                            title="Salin kode"
                          >
                            {lead.tracking_code}
                            {copiedCode === lead.tracking_code ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                            )}
                          </button>
                        </td>

                        {/* Asal Halaman */}
                        <td className="py-3.5 px-4 max-w-[200px]">
                          <div className="font-medium text-slate-800 truncate" title={lead.page_url || ""}>
                            {lead.page_url || "/thankyou"}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <span className="px-1 rounded bg-slate-100 font-mono">
                              {lead.source || "direct"}
                            </span>
                          </div>
                        </td>

                        {/* BusDev */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {lead.assigned_to}
                          </span>
                        </td>

                        {/* Nama Display WA */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {isConfirmed && lead.wa_profile_name ? (
                            <span className="font-bold text-emerald-800 flex items-center gap-1">
                              <MessageCircle className="w-3 h-3 text-emerald-600" />
                              {lead.wa_profile_name}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">—</span>
                          )}
                        </td>

                        {/* Nomor WA Klien */}
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                          {isConfirmed && lead.wa_phone ? (
                            <span className="text-slate-800 font-semibold">{lead.wa_phone}</span>
                          ) : (
                            <span className="text-slate-400 italic">—</span>
                          )}
                        </td>

                        {/* Waktu Chat Masuk */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {isConfirmed && lead.confirmed_at ? (
                            <span className="text-emerald-700 font-semibold text-[11px]">
                              {formatWib(lead.confirmed_at)}
                            </span>
                          ) : (
                            <span className="text-amber-600/80 text-[10px] italic">
                              Batal/Belum Chat
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

        {/* Footer Note untuk Head Marketing & Head Sales */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-xs text-slate-500 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-slate-800">
              Prinsip Keamanan & Transparansi Distribusi Lead
            </div>
            <p>
              1. <b>Zero Spam Bot:</b> Sistem tidak pernah mengirim balasan otomatis ke klien. Validasi berjalan 100% pasif melalui penerimaan sinyal Webhook Meta Cloud API.
            </p>
            <p>
              2. <b>Perlindungan Kuota BusDev:</b> Pengunjung yang berstatus <i>Hanya Klik (Drop-off)</i> tidak dihitung sebagai beban kuota sales, sehingga distribusi lead tetap adil dan akurat.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
