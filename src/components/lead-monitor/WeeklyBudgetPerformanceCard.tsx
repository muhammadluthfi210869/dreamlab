"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Check, Copy, DollarSign, RefreshCw, Save, TrendingUp } from "lucide-react";
import { Card } from "@/components/lead-monitor/ui";
import { useMe } from "@/components/lead-monitor/filters";
import { isAdminRole } from "@/lib/crm-stages";
import type { BudgetChannelKey, ChannelCostMetrics, WeeklyChannelPerformance } from "@/app/api/crm/budgets/route";

interface ChannelMeta {
  key: BudgetChannelKey;
  label: string;
  shortLabel: string;
  dotColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

const CHANNEL_LIST: ChannelMeta[] = [
  {
    key: "meta_ads",
    label: "Meta Ads",
    shortLabel: "Meta Ads",
    dotColor: "bg-blue-600",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    badgeBorder: "border-blue-200",
  },
  {
    key: "google_ads",
    label: "Google Ads",
    shortLabel: "Google Ads",
    dotColor: "bg-emerald-600",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    badgeBorder: "border-emerald-200",
  },
  {
    key: "google_organic",
    label: "Google (Organik / SEO)",
    shortLabel: "Google Organik",
    dotColor: "bg-sky-600",
    badgeBg: "bg-sky-50",
    badgeText: "text-sky-700",
    badgeBorder: "border-sky-200",
  },
  {
    key: "social_media",
    label: "Media Sosial (Organik)",
    shortLabel: "Media Sosial",
    dotColor: "bg-purple-600",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
    badgeBorder: "border-purple-200",
  },
];

function formatRupiah(val: number | null | undefined): string {
  if (val === null || val === undefined || !Number.isFinite(val)) return "—";
  if (val === 0) return "Rp 0";
  return `Rp ${Math.round(val).toLocaleString("id-ID")}`;
}

function formatInputNumber(val: number): string {
  if (!val || val <= 0) return "";
  return Math.round(val).toLocaleString("id-ID");
}

function parseInputNumber(raw: string): number {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return 0;
  return Math.max(0, parseInt(digits, 10) || 0);
}

function calcLiveMetrics(budget: number, base: ChannelCostMetrics): ChannelCostMetrics {
  const traffic = base.traffic || 0;
  const warm = base.warm || 0;
  const hot = base.hot || 0;
  const qualified = warm + hot;
  const sample = base.sample || 0;
  return {
    ...base,
    budget,
    qualified,
    costPerTraffic: budget > 0 && traffic > 0 ? Math.round(budget / traffic) : null,
    costPerQualified: budget > 0 && qualified > 0 ? Math.round(budget / qualified) : null,
    costPerSample: budget > 0 && sample > 0 ? Math.round(budget / sample) : null,
  };
}

export function WeeklyBudgetPerformanceCard({
  busdev = "all",
  onSelectWeek,
}: {
  busdev?: string;
  onSelectWeek?: (startDate: string, endDate: string) => void;
}) {
  const me = useMe();
  const isAdmin = isAdminRole(me?.role);

  const [weeks, setWeeks] = useState<WeeklyChannelPerformance[]>([]);
  const [selectedWeekStart, setSelectedWeekStart] = useState<string>("");
  const [budgetMode, setBudgetMode] = useState<"weekly" | "custom">("weekly");
  const [customStart, setCustomStart] = useState<string>("2026-11-01");
  const [customEnd, setCustomEnd] = useState<string>("2026-11-16");
  const [customRangeData, setCustomRangeData] = useState<WeeklyChannelPerformance | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [historyChannel, setHistoryChannel] = useState<BudgetChannelKey | "total">("total");

  // Draft input budget untuk minggu / range yang sedang dipilih
  const [draftBudgets, setDraftBudgets] = useState<Record<BudgetChannelKey, number>>({
    meta_ads: 0,
    google_ads: 0,
    google_organic: 0,
    social_media: 0,
  });

  const loadBudgets = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({ weeks: "8", busdev });
      if (budgetMode === "custom" && customStart && customEnd) {
        qs.set("startDate", customStart);
        qs.set("endDate", customEnd);
      }
      const res = await fetch(`/api/crm/budgets?${qs.toString()}`, { cache: "no-store" });
      if (res.status === 401) {
        window.location.href = "/lead-monitor/masuk";
        return;
      }
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json.error || `Gagal memuat data (${res.status})`);
      }
      const list = (json.weeks ?? []) as WeeklyChannelPerformance[];
      setWeeks(list);
      setCustomRangeData((json.customRange ?? null) as WeeklyChannelPerformance | null);
      setSelectedWeekStart((prev) => {
        if (prev && list.some((w) => w.weekStart === prev)) return prev;
        return list[0]?.weekStart ?? "";
      });
    } catch (e: any) {
      setError(e?.message || "Gagal memuat performa budget mingguan");
    } finally {
      setLoading(false);
    }
  }, [busdev, isAdmin, budgetMode, customStart, customEnd]);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  const currentWeek = useMemo(() => {
    if (budgetMode === "custom" && customRangeData) return customRangeData;
    return weeks.find((w) => w.weekStart === selectedWeekStart) ?? weeks[0] ?? null;
  }, [budgetMode, customRangeData, weeks, selectedWeekStart]);

  const previousWeek = useMemo(() => {
    if (!currentWeek) return null;
    const idx = weeks.findIndex((w) => w.weekStart === currentWeek.weekStart);
    return idx >= 0 && idx + 1 < weeks.length ? weeks[idx + 1] : null;
  }, [weeks, currentWeek]);

  // Sinkronkan draft input saat minggu berganti atau data baru dimuat
  useEffect(() => {
    if (!currentWeek) return;
    setDraftBudgets({
      meta_ads: currentWeek.channels.meta_ads.budget || 0,
      google_ads: currentWeek.channels.google_ads.budget || 0,
      google_organic: currentWeek.channels.google_organic.budget || 0,
      social_media: currentWeek.channels.social_media.budget || 0,
    });
  }, [currentWeek]);

  const isDirty = useMemo(() => {
    if (!currentWeek) return false;
    return CHANNEL_LIST.some((c) => (draftBudgets[c.key] || 0) !== (currentWeek.channels[c.key].budget || 0));
  }, [currentWeek, draftBudgets]);

  // Perhitungan metrik real-time berdasarkan draftBudgets yang diketik user
  const liveChannels = useMemo(() => {
    if (!currentWeek) return null;
    const meta_ads = calcLiveMetrics(draftBudgets.meta_ads, currentWeek.channels.meta_ads);
    const google_ads = calcLiveMetrics(draftBudgets.google_ads, currentWeek.channels.google_ads);
    const google_organic = calcLiveMetrics(draftBudgets.google_organic, currentWeek.channels.google_organic);
    const social_media = calcLiveMetrics(draftBudgets.social_media, currentWeek.channels.social_media);
    const totalBudget =
      draftBudgets.meta_ads + draftBudgets.google_ads + draftBudgets.google_organic + draftBudgets.social_media;
    const total = calcLiveMetrics(totalBudget, currentWeek.total);
    return { meta_ads, google_ads, google_organic, social_media, total };
  }, [currentWeek, draftBudgets]);

  const handleSaveBudgets = async (budgetsToSave = draftBudgets) => {
    if (!currentWeek) return;
    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    try {
      const payload =
        budgetMode === "custom"
          ? { startDate: customStart, endDate: customEnd, budgets: budgetsToSave }
          : { weekStart: currentWeek.weekStart, budgets: budgetsToSave };

      const res = await fetch("/api/crm/budgets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json.error || `Gagal menyimpan budget (${res.status})`);
      }
      await loadBudgets();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e: any) {
      setError(e?.message || "Gagal menyimpan budget");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyPreviousWeek = () => {
    if (!previousWeek) return;
    const copied: Record<BudgetChannelKey, number> = {
      meta_ads: previousWeek.channels.meta_ads.budget || 0,
      google_ads: previousWeek.channels.google_ads.budget || 0,
      google_organic: previousWeek.channels.google_organic.budget || 0,
      social_media: previousWeek.channels.social_media.budget || 0,
    };
    setDraftBudgets(copied);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Card
      title="Budget & Cost Performance (Mingguan & Custom Range)"
      subtitle="Pilih mode Mingguan atau atur Rentang Tanggal Sendiri untuk menghitung Cost / Traffic, Cost / Qualified (Warm+Hot), dan Cost / Sample"
      right={
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Mode: Mingguan vs Custom Range */}
          <div className="flex items-center rounded-lg bg-slate-100 p-0.5 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setBudgetMode("weekly")}
              className={`rounded-md px-2.5 py-1 transition ${
                budgetMode === "weekly" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Per Minggu
            </button>
            <button
              type="button"
              onClick={() => setBudgetMode("custom")}
              className={`rounded-md px-2.5 py-1 transition ${
                budgetMode === "custom" ? "bg-[#D98A00] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Pilih Range Sendiri
            </button>
          </div>

          {budgetMode === "weekly" ? (
            <div className="flex items-center gap-1.5 rounded-lg border border-[#E5E2DA] bg-[#F8F9FB] px-2.5 py-1">
              <Calendar className="h-3.5 w-3.5 text-[#D98A00]" />
              <select
                aria-label="Pilih minggu evaluasi"
                value={selectedWeekStart}
                onChange={(e) => setSelectedWeekStart(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
              >
                {weeks.map((w) => (
                  <option key={w.weekStart} value={w.weekStart}>
                    {w.label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-[#E5E2DA] bg-[#F8F9FB] px-2 py-1">
              <Calendar className="h-3.5 w-3.5 text-[#D98A00]" />
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="bg-transparent text-xs font-mono font-semibold text-slate-800 outline-none"
                aria-label="Tanggal mulai budget"
              />
              <span className="text-[11px] text-slate-400">s/d</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="bg-transparent text-xs font-mono font-semibold text-slate-800 outline-none"
                aria-label="Tanggal akhir budget"
              />
            </div>
          )}

          {currentWeek && onSelectWeek && (
            <button
              type="button"
              onClick={() =>
                onSelectWeek(
                  budgetMode === "custom" ? customStart : currentWeek.weekStart,
                  budgetMode === "custom" ? customEnd : currentWeek.weekEnd
                )
              }
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E5E2DA] bg-white px-2.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition"
              title="Terapkan rentang tanggal ini ke seluruh filter Dashboard"
            >
              <span>{budgetMode === "custom" ? "Filter Range Ini" : "Filter Minggu Ini"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => loadBudgets()}
            disabled={loading}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#E5E2DA] bg-white px-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            title="Muat ulang data mingguan"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800">
            {error}
          </div>
        )}

        {/* Bar Info Rumus & Tombol Aksi Simpan Budget */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#ECEAE4] bg-[#F8F9FB] px-3.5 py-2.5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600">
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5 text-[#D98A00]" />
              Rumus Perhitungan:
            </span>
            <span>
              <b className="text-slate-800">Cost / Traffic</b> = Budget ÷ Traffic
            </span>
            <span>
              <b className="text-amber-800">Qualified Leads</b> = Warm + Hot
            </span>
            <span>
              <b className="text-amber-800">Cost / Qualified</b> = Budget ÷ (Warm + Hot)
            </span>
            <span>
              <b className="text-emerald-800">Cost / Sample</b> = Budget ÷ Sample
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {previousWeek && (
              <button
                type="button"
                onClick={handleCopyPreviousWeek}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E5E2DA] bg-white px-2.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition"
                title={`Salin nominal budget dari ${previousWeek.label}`}
              >
                <Copy className="h-3 w-3 text-slate-500" />
                <span>Salin Minggu Lalu</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSaveBudgets()}
              disabled={saving || !currentWeek}
              className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-white transition ${
                saveSuccess
                  ? "bg-emerald-600"
                  : isDirty
                  ? "bg-[#F39200] hover:bg-[#D98200] shadow-xs"
                  : "bg-slate-800 hover:bg-slate-700"
              } disabled:opacity-60`}
            >
              {saveSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Tersimpan</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>{saving ? "Menyimpan..." : "Simpan Budget"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 Ringkasan KPI Total Gabungan Minggu Terpilih */}
        {liveChannels && (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-xl border border-[#ECEAE4] bg-white p-3.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Total Budget Minggu Ini
              </div>
              <div className="mt-1 font-mono text-lg font-bold text-slate-900 tabular-nums">
                {formatRupiah(liveChannels.total.budget)}
              </div>
              <div className="mt-0.5 text-[11px] text-slate-500">
                Periode: <span className="font-mono font-medium text-slate-700">{currentWeek?.weekStart} s/d {currentWeek?.weekEnd}</span>
              </div>
            </div>

            <div className="rounded-xl border border-blue-200/80 bg-blue-50/30 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700">
                  Cost / Traffic (Rata-rata)
                </span>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-800 tabular-nums">
                  {liveChannels.total.traffic} Traffic
                </span>
              </div>
              <div className="mt-1 font-mono text-lg font-bold text-blue-950 tabular-nums">
                {formatRupiah(liveChannels.total.costPerTraffic)}
              </div>
              <div className="mt-0.5 text-[11px] text-slate-500">
                Budget ÷ Total Traffic
              </div>
            </div>

            <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
                  Cost / Qualified Lead
                </span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-900 tabular-nums">
                  {liveChannels.total.qualified} Qualified
                </span>
              </div>
              <div className="mt-1 font-mono text-lg font-bold text-amber-950 tabular-nums">
                {formatRupiah(liveChannels.total.costPerQualified)}
              </div>
              <div className="mt-0.5 text-[11px] text-amber-800/80 font-mono">
                Warm: {liveChannels.total.warm} + Hot: {liveChannels.total.hot}
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                  Cost / Sample
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-900 tabular-nums">
                  {liveChannels.total.sample} Sample
                </span>
              </div>
              <div className="mt-1 font-mono text-lg font-bold text-emerald-950 tabular-nums">
                {formatRupiah(liveChannels.total.costPerSample)}
              </div>
              <div className="mt-0.5 text-[11px] text-emerald-800/80">
                Budget ÷ Sample
              </div>
            </div>
          </div>
        )}

        {/* Tabel Utama Per Channel (Minggu Dipilih) */}
        <div className="overflow-x-auto rounded-xl border border-[#ECEAE4]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#ECEAE4] bg-[#F8F9FB] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 pl-4 pr-3">Channel Akuisisi</th>
                <th className="py-3 px-3 text-right min-w-[170px]">Weekly Budget (Rp)</th>
                <th className="py-3 px-3 text-right">Traffic</th>
                <th className="py-3 px-3 text-right bg-blue-50/40 text-blue-800">Cost / Traffic</th>
                <th className="py-3 px-3 text-right">Qualified (Warm + Hot)</th>
                <th className="py-3 px-3 text-right bg-amber-50/50 text-amber-900">Cost / Qualified Lead</th>
                <th className="py-3 px-3 text-right">Sample</th>
                <th className="py-3 pl-3 pr-4 text-right bg-emerald-50/50 text-emerald-900">Cost / Sample</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1EFEA] bg-white">
              {!liveChannels ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    {loading ? "Memuat data performa mingguan..." : "Belum ada data minggu ini."}
                  </td>
                </tr>
              ) : (
                <>
                  {CHANNEL_LIST.map((ch) => {
                    const m = liveChannels[ch.key];
                    const qualRate = m.traffic > 0 ? Math.round((m.qualified / m.traffic) * 100) : 0;
                    const sampleRate = m.traffic > 0 ? Math.round((m.sample / m.traffic) * 100) : 0;

                    return (
                      <tr key={ch.key} className="hover:bg-slate-50/70 transition">
                        {/* Nama Channel */}
                        <td className="py-3 pl-4 pr-3 font-semibold text-slate-900 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${ch.dotColor}`} />
                            <span>{ch.label}</span>
                          </div>
                        </td>

                        {/* Input Budget Mingguan */}
                        <td className="py-2.5 px-3 text-right">
                          <div className="inline-flex items-center rounded-lg border border-[#D5D9E2] bg-white px-2.5 py-1.5 focus-within:border-[#F39200] focus-within:ring-1 focus-within:ring-[#F39200]">
                            <span className="mr-1.5 font-mono text-[11px] font-semibold text-slate-400">Rp</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              aria-label={`Budget mingguan ${ch.label}`}
                              placeholder="0"
                              value={formatInputNumber(draftBudgets[ch.key])}
                              onChange={(e) => {
                                const val = parseInputNumber(e.target.value);
                                setDraftBudgets((prev) => ({ ...prev, [ch.key]: val }));
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleSaveBudgets();
                                }
                              }}
                              className="w-28 text-right font-mono text-xs font-bold text-slate-900 outline-none tabular-nums"
                            />
                          </div>
                        </td>

                        {/* Traffic */}
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-800 tabular-nums">
                          <div>{m.traffic.toLocaleString("id-ID")}</div>
                          <div className="text-[10px] font-normal text-slate-400">Cold: {m.cold}</div>
                        </td>

                        {/* Cost per Traffic */}
                        <td className="py-3 px-3 text-right font-mono font-bold text-blue-800 bg-blue-50/25 tabular-nums whitespace-nowrap">
                          <div>{formatRupiah(m.costPerTraffic)}</div>
                          <div className="text-[10px] font-normal text-slate-400">per traffic</div>
                        </td>

                        {/* Qualified Leads (Warm + Hot) */}
                        <td className="py-3 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                          <div className="font-bold text-slate-900">
                            {m.qualified.toLocaleString("id-ID")}{" "}
                            <span className="text-[10px] font-semibold text-amber-700">({qualRate}%)</span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            <span className="text-amber-700 font-semibold">{m.warm} Warm</span> ·{" "}
                            <span className="text-rose-600 font-semibold">{m.hot} Hot</span>
                          </div>
                        </td>

                        {/* Cost per Qualified Lead */}
                        <td className="py-3 px-3 text-right font-mono font-bold text-amber-900 bg-amber-50/35 tabular-nums whitespace-nowrap">
                          <div>{formatRupiah(m.costPerQualified)}</div>
                          <div className="text-[10px] font-normal text-amber-700/80">Budget ÷ (Warm+Hot)</div>
                        </td>

                        {/* Sample */}
                        <td className="py-3 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                          <div className="font-bold text-emerald-700">{m.sample.toLocaleString("id-ID")}</div>
                          <div className="text-[10px] text-slate-400">{sampleRate}% dari traffic</div>
                        </td>

                        {/* Cost per Sample */}
                        <td className="py-3 pl-3 pr-4 text-right font-mono font-bold text-emerald-900 bg-emerald-50/35 tabular-nums whitespace-nowrap">
                          <div>{formatRupiah(m.costPerSample)}</div>
                          <div className="text-[10px] font-normal text-emerald-700/80">Budget ÷ Sample</div>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Baris Total Semua Channel */}
                  <tr className="border-t-2 border-[#ECEAE4] bg-[#F8F9FB] font-bold">
                    <td className="py-3 pl-4 pr-3 text-slate-900">Total Semua Channel</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-900 tabular-nums">
                      {formatRupiah(liveChannels.total.budget)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-900 tabular-nums">
                      <div>{liveChannels.total.traffic.toLocaleString("id-ID")}</div>
                      <div className="text-[10px] font-normal text-slate-500">Cold: {liveChannels.total.cold}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-blue-900 bg-blue-100/40 tabular-nums">
                      {formatRupiah(liveChannels.total.costPerTraffic)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-900 tabular-nums">
                      <div>{liveChannels.total.qualified.toLocaleString("id-ID")}</div>
                      <div className="text-[10px] font-normal text-slate-600">
                        {liveChannels.total.warm} Warm + {liveChannels.total.hot} Hot
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-amber-950 bg-amber-100/50 tabular-nums">
                      {formatRupiah(liveChannels.total.costPerQualified)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-800 tabular-nums">
                      {liveChannels.total.sample.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 pl-3 pr-4 text-right font-mono text-emerald-950 bg-emerald-100/50 tabular-nums">
                      {formatRupiah(liveChannels.total.costPerSample)}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}

