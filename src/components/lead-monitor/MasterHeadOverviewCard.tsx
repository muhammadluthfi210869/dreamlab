"use client";

import { useMemo } from "react";
import {
  Calendar,
  Check,
  Crown,
  MessageSquare,
  Phone,
  ShieldCheck,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { BRAND, Card } from "@/components/lead-monitor/ui";

export interface BusdevOverviewItem {
  busdev: string;
  isActive: boolean;
  totalLeads: number;
  totalChat: number;
  totalMoq: number;
  weeklyLeads: number;
  weeklyChat: number;
  weeklyMoq: number;
  conversionRate: number;
  weeklyConversionRate: number;
}

export interface MasterHeadOverviewData {
  byBusdev: BusdevOverviewItem[];
  summary: {
    totalLeads: number;
    totalChat: number;
    totalMoq: number;
    weeklyLeads: number;
    weeklyChat: number;
    weeklyMoq: number;
    conversionRate: number;
    weeklyConversionRate: number;
  };
}

export function MasterHeadOverviewCard({
  data,
  activeBusdev = "all",
  onSelectBusdev,
  isAdmin = true,
}: {
  data: MasterHeadOverviewData;
  activeBusdev?: string;
  onSelectBusdev?: (name: string) => void;
  isAdmin?: boolean;
}) {
  const activeItems = useMemo(
    () => (data.byBusdev || []).filter((b) => b.busdev !== "Unassigned" && (isAdmin || b.isActive)),
    [data.byBusdev, isAdmin]
  );

  const unassignedItem = useMemo(
    () => (data.byBusdev || []).find((b) => b.busdev === "Unassigned"),
    [data.byBusdev]
  );

  return (
    <Card
      title="Overview Total Leads Tim Sales (Master Head)"
      subtitle="Rekapitulasi total pembagian leads, performa mingguan (Weekly), dan konversi prospek masing-masing BusDev"
      right={
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-900 border border-amber-200">
              <Crown className="h-3.5 w-3.5 text-[#D98A00]" />
              <span>Master Head of Sales</span>
            </span>
          )}
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-600">
            Zona Waktu: WIB
          </span>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Banner Ringkasan Gabungan Seluruh Tim */}
        <div className="rounded-2xl border border-[#ECEAE4] bg-gradient-to-br from-[#FFF9EB]/70 via-white to-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1EFEA] pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D98A00] text-white">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Total Tim Sales (Gabungan Seluruh Leads)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Total akumulasi leads masuk vs performa minggu berjalan (Senin–Minggu WIB)
                </p>
              </div>
            </div>

            {onSelectBusdev && activeBusdev !== "all" && (
              <button
                type="button"
                onClick={() => onSelectBusdev("all")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E2DA] bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <span>Tampilkan Semua Tim (Reset Filter: {activeBusdev})</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {/* Total Leads (All vs Weekly) */}
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Total Leads Tim
                </span>
                <span className="rounded-md bg-amber-100/70 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-900">
                  +{data.summary.weeklyLeads} Minggu Ini
                </span>
              </div>
              <div className="mt-1 font-mono text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
                {data.summary.totalLeads.toLocaleString("id-ID")}
              </div>
              <div className="mt-0.5 text-[11px] text-slate-500">
                Weekly: <b className="font-mono text-slate-800">{data.summary.weeklyLeads}</b> leads
              </div>
            </div>

            {/* Total Chat Masuk */}
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/30 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Chat Masuk (WA)
                </span>
                <span className="rounded-md bg-amber-200/70 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-900">
                  +{data.summary.weeklyChat} Minggu Ini
                </span>
              </div>
              <div className="mt-1 font-mono text-2xl font-bold tracking-tight text-amber-950 tabular-nums">
                {data.summary.totalChat.toLocaleString("id-ID")}
              </div>
              <div className="mt-0.5 text-[11px] text-amber-800/80">
                Rasio Chat: <b className="font-mono">{data.summary.conversionRate}%</b> dari leads
              </div>
            </div>

            {/* Lolos MOQ */}
            <div className="rounded-xl border border-blue-200/80 bg-blue-50/30 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
                  Kualifikasi MOQ
                </span>
                <span className="rounded-md bg-blue-200/70 px-1.5 py-0.5 font-mono text-[10px] font-bold text-blue-900">
                  +{data.summary.weeklyMoq} Minggu Ini
                </span>
              </div>
              <div className="mt-1 font-mono text-2xl font-bold tracking-tight text-blue-950 tabular-nums">
                {data.summary.totalMoq.toLocaleString("id-ID")}
              </div>
              <div className="mt-0.5 text-[11px] text-blue-800/80">
                Rencana produksi &ge; 500 pcs
              </div>
            </div>

            {/* Konversi Mingguan */}
            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Konversi Mingguan
                </span>
                <span className="rounded-md bg-emerald-200/70 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-900">
                  Minggu Ini
                </span>
              </div>
              <div className="mt-1 font-mono text-2xl font-bold tracking-tight text-emerald-950 tabular-nums">
                {data.summary.weeklyConversionRate}%
              </div>
              <div className="mt-0.5 text-[11px] text-emerald-800/80">
                {data.summary.weeklyChat} chat dari {data.summary.weeklyLeads} lead
              </div>
            </div>
          </div>
        </div>

        {/* Kartu Rincian Masing-Masing BusDev */}
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {activeItems.map((b) => {
            const isSelected = activeBusdev.toLowerCase() === b.busdev.toLowerCase();
            const shareOfTotal =
              data.summary.totalLeads > 0
                ? Math.round((b.totalLeads / data.summary.totalLeads) * 100)
                : 0;

            return (
              <div
                key={b.busdev}
                className={`relative flex flex-col justify-between rounded-2xl border p-4 transition-all duration-200 ${
                  isSelected
                    ? "border-[#D98A00] bg-white ring-2 ring-[#D98A00]/25 shadow-md"
                    : "border-[#ECEAE4] bg-white hover:border-slate-300 hover:shadow-xs"
                }`}
              >
                <div>
                  {/* Header BusDev */}
                  <div className="flex items-center justify-between gap-2 border-b border-[#F1EFEA] pb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                          isSelected
                            ? "bg-[#D98A00] text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {b.busdev.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-slate-900">{b.busdev}</h4>
                          {b.isActive && (
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500" title="Sales Aktif" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Porsi: <span className="font-mono font-semibold text-slate-600">{shareOfTotal}%</span> dari total leads
                        </p>
                      </div>
                    </div>

                    {onSelectBusdev && (
                      <button
                        type="button"
                        onClick={() => onSelectBusdev(isSelected ? "all" : b.busdev)}
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                          isSelected
                            ? "bg-[#D98A00] text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                        title={isSelected ? "Reset filter ke semua sales" : `Filter ke ${b.busdev}`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="h-3 w-3" />
                            <span>Terpilih</span>
                          </>
                        ) : (
                          <span>Filter</span>
                        )}
                      </button>
                    )}
                  </div>

                  {/* 4 Metrik Utama BusDev */}
                  <div className="mt-3.5 grid grid-cols-2 gap-2.5">
                    {/* Total Leads */}
                    <div className="rounded-xl border border-slate-100 bg-[#F8F9FB] p-2.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Total Leads
                      </div>
                      <div className="mt-0.5 font-mono text-xl font-bold text-slate-900 tabular-nums">
                        {b.totalLeads.toLocaleString("id-ID")}
                      </div>
                      <div className="mt-0.5 text-[10px] font-medium text-slate-500">
                        Akumulasi semua klik &amp; lead
                      </div>
                    </div>

                    {/* Weekly Leads */}
                    <div className="rounded-xl border border-amber-200/70 bg-amber-50/30 p-2.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                        Leads Minggu Ini
                      </div>
                      <div className="mt-0.5 font-mono text-xl font-bold text-amber-950 tabular-nums">
                        {b.weeklyLeads.toLocaleString("id-ID")}
                      </div>
                      <div className="mt-0.5 text-[10px] font-medium text-amber-800/80">
                        Periode berjalan (Weekly)
                      </div>
                    </div>

                    {/* Chat Masuk */}
                    <div className="rounded-xl border border-blue-200/60 bg-blue-50/20 p-2.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                        Chat Masuk
                      </div>
                      <div className="mt-0.5 font-mono text-lg font-bold text-blue-950 tabular-nums">
                        {b.totalChat.toLocaleString("id-ID")}
                      </div>
                      <div className="mt-0.5 text-[10px] text-blue-800/80 font-mono">
                        +{b.weeklyChat} minggu ini
                      </div>
                    </div>

                    {/* Lolos MOQ */}
                    <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/20 p-2.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        Lolos MOQ
                      </div>
                      <div className="mt-0.5 font-mono text-lg font-bold text-emerald-950 tabular-nums">
                        {b.totalMoq.toLocaleString("id-ID")}
                      </div>
                      <div className="mt-0.5 text-[10px] text-emerald-800/80 font-mono">
                        +{b.weeklyMoq} minggu ini
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Konversi Chat */}
                <div className="mt-3.5 border-t border-[#F1EFEA] pt-2.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Rasio Konversi Chat (Total):</span>
                    <span className="font-mono font-bold text-slate-800">{b.conversionRate}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#D98A00]"
                      style={{ width: `${Math.min(100, b.conversionRate)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Kartu Khusus Lead Tanpa Sales / Unassigned (Jika ada dan user admin) */}
          {unassignedItem && isAdmin && unassignedItem.totalLeads > 0 && (
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-200 text-slate-600 font-bold text-xs">
                      UN
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-700">Belum Terbagi (Unassigned)</h4>
                      <p className="text-[11px] text-slate-400">Lead sebelum integrasi atau antrean</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Total Leads
                    </div>
                    <div className="mt-0.5 font-mono text-xl font-bold text-slate-800 tabular-nums">
                      {unassignedItem.totalLeads.toLocaleString("id-ID")}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Minggu Ini
                    </div>
                    <div className="mt-0.5 font-mono text-xl font-bold text-slate-800 tabular-nums">
                      {unassignedItem.weeklyLeads.toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

