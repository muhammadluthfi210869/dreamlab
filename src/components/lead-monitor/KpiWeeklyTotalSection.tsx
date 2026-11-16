"use client";

import { useState } from "react";
import {
  Calendar,
  Globe,
  HelpCircle,
  Info,
  MessageSquare,
  Phone,
  SlidersHorizontal,
  Target,
} from "lucide-react";
import { BRAND, BRAND_DARK, DeltaChip } from "@/components/lead-monitor/ui";

export interface KpiData {
  totalClicks: number;
  chat: number;
  dropoff: number;
  direct: number;
  moqMet: number;
}

export type KpiViewMode = "weekly" | "total" | "period";

export function KpiWeeklyTotalSection({
  current,
  weekly,
  total,
  delta,
  presetLabel = "Periode Terpilih",
  onSelectWeekly,
  onSelectTotal,
}: {
  current?: KpiData | null;
  weekly?: KpiData | null;
  total?: KpiData | null;
  delta?: {
    totalClicks: number | null;
    chat: number | null;
    dropoff: number | null;
    moqMet: number | null;
  } | null;
  presetLabel?: string;
  onSelectWeekly?: () => void;
  onSelectTotal?: () => void;
}) {
  const [mode, setMode] = useState<KpiViewMode>("period");

  const effWeekly: KpiData = weekly ?? {
    totalClicks: 0,
    chat: 0,
    dropoff: 0,
    direct: 0,
    moqMet: 0,
  };

  const effTotal: KpiData = total ?? {
    totalClicks: 0,
    chat: 0,
    dropoff: 0,
    direct: 0,
    moqMet: 0,
  };

  const effCurrent: KpiData = current ?? {
    totalClicks: 0,
    chat: 0,
    dropoff: 0,
    direct: 0,
    moqMet: 0,
  };

  const activeKpi = mode === "weekly" ? effWeekly : mode === "total" ? effTotal : effCurrent;

  return (
    <div className="space-y-3">
      {/* Header KPI dengan Tombol Pilihan Mode: Weekly vs Total */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-2xl border border-[#ECEAE4] bg-white p-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>KPI Performa Leads: Weekly &amp; Total</span>
            <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
              Evaluasi Performa
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Perbandingan angka capaian mingguan berjalan (Weekly: Senin–Minggu WIB) dan akumulasi keseluruhan (Total)
          </p>
        </div>

        {/* Tab Toggle View */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMode("weekly");
              if (onSelectWeekly) onSelectWeekly();
            }}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              mode === "weekly"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
            title="Tampilkan data performa Minggu Ini (Senin s/d hari ini)"
          >
            <Calendar className="h-3.5 w-3.5 text-[#D98A00]" />
            <span>KPI Weekly (Minggu Ini)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("total");
              if (onSelectTotal) onSelectTotal();
            }}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              mode === "total"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
            title="Tampilkan data total akumulasi sejak awal tracking terpadu"
          >
            <Globe className="h-3.5 w-3.5 text-blue-600" />
            <span>KPI Total (Semua)</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("period")}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              mode === "period"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
            title="Tampilkan data sesuai tanggal filter saat ini"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <span>Filter: {presetLabel}</span>
          </button>
        </div>
      </div>

      {/* 4 Kartu KPI Utama dengan Rincian Weekly & Total di Masing-masing Kartu */}
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {/* Total Klik CTA */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#ECEAE4] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
                <Phone className="h-3.5 w-3.5 text-slate-600" />
                <span>Total Klik CTA</span>
              </span>
              <span
                title="Satu prospek = satu nomor unik. Total klik = Chat Masuk + Drop-off."
                className="cursor-help text-slate-300 hover:text-slate-500"
              >
                <Info className="h-3.5 w-3.5" />
              </span>
            </div>

            <div className="mt-2.5 font-mono text-[30px] font-bold leading-none tracking-tight text-slate-900 tabular-nums">
              {activeKpi.totalClicks.toLocaleString("id-ID")}
            </div>

            <div className="mt-1.5 text-xs text-slate-500">
              {mode === "weekly"
                ? "Prospek unik minggu berjalan"
                : mode === "total"
                ? "Total akumulasi semua prospek unik"
                : `Prospek unik pada ${presetLabel}`}
            </div>
          </div>

          <div className="mt-3.5 border-t border-[#F1EFEA] pt-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
              <span className="text-slate-500">
                Weekly: <b className="text-amber-800 font-semibold">{effWeekly.totalClicks.toLocaleString("id-ID")}</b>
              </span>
              <span className="text-slate-500">
                Total: <b className="text-slate-800 font-semibold">{effTotal.totalClicks.toLocaleString("id-ID")}</b>
              </span>
            </div>
            {mode === "period" && delta?.totalClicks !== undefined && (
              <div className="mt-1">
                <DeltaChip value={delta?.totalClicks} />
              </div>
            )}
          </div>
        </div>

        {/* Chat Masuk */}
        <div className="flex flex-col justify-between rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/40 via-white to-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <div>
            <div className="flex items-center justify-between text-amber-800">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
                <MessageSquare className="h-3.5 w-3.5 text-[#D98A00]" />
                <span>Chat Masuk (WA)</span>
              </span>
              <span
                title="Pesan pertama berkode sudah diterima di WhatsApp CRM."
                className="cursor-help text-amber-300 hover:text-amber-600"
              >
                <Info className="h-3.5 w-3.5" />
              </span>
            </div>

            <div
              className="mt-2.5 font-mono text-[30px] font-bold leading-none tracking-tight tabular-nums"
              style={{ color: BRAND_DARK }}
            >
              {activeKpi.chat.toLocaleString("id-ID")}
            </div>

            <div className="mt-1.5 text-xs text-slate-500">
              {mode === "weekly"
                ? "Pesan WA terkonfirmasi minggu ini"
                : mode === "total"
                ? "Total pesan WA terkonfirmasi"
                : "Sudah kirim chat berkode"}
            </div>
          </div>

          <div className="mt-3.5 border-t border-amber-100 pt-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
              <span className="text-slate-500">
                Weekly: <b className="text-[#D98A00] font-semibold">{effWeekly.chat.toLocaleString("id-ID")}</b>
              </span>
              <span className="text-slate-500">
                Total: <b className="text-slate-800 font-semibold">{effTotal.chat.toLocaleString("id-ID")}</b>
              </span>
            </div>
            {mode === "period" && delta?.chat !== undefined && (
              <div className="mt-1">
                <DeltaChip value={delta?.chat} />
              </div>
            )}
          </div>
        </div>

        {/* Drop-off */}
        <div className="flex flex-col justify-between rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50/30 via-white to-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <div>
            <div className="flex items-center justify-between text-rose-800">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
                <HelpCircle className="h-3.5 w-3.5 text-rose-600" />
                <span>Drop-off</span>
              </span>
              <span
                title="Klik CTA tetapi belum mengirim pesan WhatsApp berkode."
                className="cursor-help text-rose-300 hover:text-rose-600"
              >
                <Info className="h-3.5 w-3.5" />
              </span>
            </div>

            <div className="mt-2.5 font-mono text-[30px] font-bold leading-none tracking-tight text-rose-950 tabular-nums">
              {activeKpi.dropoff.toLocaleString("id-ID")}
            </div>

            <div className="mt-1.5 text-xs text-slate-500">
              {mode === "weekly"
                ? "Klik tanpa chat minggu ini"
                : mode === "total"
                ? "Total klik tanpa chat"
                : "Klik tanpa kirim chat"}
            </div>
          </div>

          <div className="mt-3.5 border-t border-rose-100 pt-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
              <span className="text-slate-500">
                Weekly: <b className="text-rose-800 font-semibold">{effWeekly.dropoff.toLocaleString("id-ID")}</b>
              </span>
              <span className="text-slate-500">
                Total: <b className="text-slate-800 font-semibold">{effTotal.dropoff.toLocaleString("id-ID")}</b>
              </span>
            </div>
            {mode === "period" && delta?.dropoff !== undefined && (
              <div className="mt-1">
                <DeltaChip value={delta?.dropoff} invert />
              </div>
            )}
          </div>
        </div>

        {/* Memenuhi MOQ */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/30 via-white to-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <div>
            <div className="flex items-center justify-between text-blue-800">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
                <Target className="h-3.5 w-3.5 text-blue-600" />
                <span>Memenuhi MOQ</span>
              </span>
              <span
                title="Rencana produksi 500 pcs ke atas dari form atau diisi manual oleh busdev."
                className="cursor-help text-blue-300 hover:text-blue-600"
              >
                <Info className="h-3.5 w-3.5" />
              </span>
            </div>

            <div className="mt-2.5 font-mono text-[30px] font-bold leading-none tracking-tight text-blue-950 tabular-nums">
              {activeKpi.moqMet.toLocaleString("id-ID")}
            </div>

            <div className="mt-1.5 text-xs text-slate-500">
              {mode === "weekly"
                ? "Kualifikasi 500+ pcs minggu ini"
                : mode === "total"
                ? "Total kualifikasi 500+ pcs"
                : "Rencana produksi 500 pcs ke atas"}
            </div>
          </div>

          <div className="mt-3.5 border-t border-blue-100 pt-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
              <span className="text-slate-500">
                Weekly: <b className="text-blue-800 font-semibold">{effWeekly.moqMet.toLocaleString("id-ID")}</b>
              </span>
              <span className="text-slate-500">
                Total: <b className="text-slate-800 font-semibold">{effTotal.moqMet.toLocaleString("id-ID")}</b>
              </span>
            </div>
            {mode === "period" && delta?.moqMet !== undefined && (
              <div className="mt-1">
                <DeltaChip value={delta?.moqMet} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

