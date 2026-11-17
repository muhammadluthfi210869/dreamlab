"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Download, Plus, Trash2, Upload } from "lucide-react";
import { BRAND, Card, Pill } from "@/components/lead-monitor/ui";
import { useMe } from "@/components/lead-monitor/filters";
import { CRM_SOURCES, isAdminRole } from "@/lib/crm-stages";

const todayWib = () => new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);
const addDaysWib = (iso: string, delta: number) => {
  const t = new Date(`${iso}T00:00:00Z`).getTime() + delta * 86_400_000;
  return new Date(t).toISOString().slice(0, 10);
};
const fmtIdr = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n || 0);

export default function LaporanPage() {
  const me = useMe();
  const isAdmin = isAdminRole(me.role);

  const [tab, setTab] = useState<"source" | "performance">("source");
  const [startDate, setStartDate] = useState(() => `${todayWib().slice(0, 7)}-01`);
  const [endDate, setEndDate] = useState(() => todayWib());

  const [scData, setScData] = useState<any>(null);
  const [perfData, setPerfData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Form input biaya
  const [spStart, setSpStart] = useState(() => todayWib());
  const [spEnd, setSpEnd] = useState(() => todayWib());
  const [spSource, setSpSource] = useState<string>("Meta Ads");
  const [spCamp, setSpCamp] = useState("");
  const [spAmount, setSpAmount] = useState("");
  const [spNote, setSpNote] = useState("");
  const [busy, setBusy] = useState(false);

  // Other costs
  const [ocKategori, setOcKategori] = useState("gaji busdev");
  const [ocAmount, setOcAmount] = useState("");
  const [ocBulan, setOcBulan] = useState(() => todayWib().slice(0, 7));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = `startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
      const [scRes, pfRes] = await Promise.all([
        fetch(`/api/crm/reports/source-campaign?${qs}`, { cache: "no-store" }),
        isAdmin ? fetch(`/api/crm/performance?${qs}`, { cache: "no-store" }) : Promise.resolve(null),
      ]);
      if (scRes.status === 401) {
        window.location.href = "/lead-monitor/masuk";
        return;
      }
      const scJson = await scRes.json().catch(() => ({}));
      if (scRes.ok && scJson.success) setScData(scJson);

      if (pfRes) {
        const pfJson = await pfRes.json().catch(() => ({}));
        if (pfRes.ok && pfJson.success) setPerfData(pfJson);
      }
      setErr(null);
    } catch {
      setErr("Gagal memuat data laporan");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, isAdmin]);

  useEffect(() => {
    load();
  }, [load]);

  const setPreset = (days: number | "month" | "today" | "yesterday") => {
    const t = todayWib();
    if (days === "today") {
      setStartDate(t);
      setEndDate(t);
    } else if (days === "yesterday") {
      const y = addDaysWib(t, -1);
      setStartDate(y);
      setEndDate(y);
    } else if (days === "month") {
      setStartDate(`${t.slice(0, 7)}-01`);
      setEndDate(t);
    } else {
      setStartDate(addDaysWib(t, -(days - 1)));
      setEndDate(t);
    }
  };

  const submitSpend = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const res = await fetch("/api/crm/performance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "spend",
        startDate: spStart,
        endDate: spEnd,
        source: spSource,
        campaign: spCamp,
        amount: parseInt(spAmount.replace(/\D/g, "") || "0", 10),
        note: spNote,
      }),
    });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok || !j.success) {
      setErr(j.error || "Gagal menyimpan biaya");
      return;
    }
    setSpAmount("");
    setSpNote("");
    setToast(`Biaya iklan tersimpan (${j.count} hari)`);
    setTimeout(() => setToast(null), 3000);
    load();
  };

  const submitOtherCost = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/crm/performance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "other_cost",
        bulan: ocBulan,
        kategori: ocKategori,
        amount: parseInt(ocAmount.replace(/\D/g, "") || "0", 10),
      }),
    });
    setBusy(false);
    if (res.ok) {
      setOcAmount("");
      setToast("Biaya non-iklan ditambahkan");
      setTimeout(() => setToast(null), 3000);
      load();
    }
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const items: any[] = [];
    for (let i = 0; i < lines.length; i++) {
      const cols = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
      if (i === 0 && cols[0].toLowerCase().includes("tanggal")) continue;
      if (cols.length >= 4 && /^\d{4}-\d{2}-\d{2}$/.test(cols[0])) {
        items.push({
          tanggal: cols[0],
          source: cols[1],
          campaign_key: cols[2],
          amount: parseInt(cols[3].replace(/\D/g, "") || "0", 10),
        });
      }
    }
    if (items.length === 0) {
      setErr("Format CSV tidak valid. Gunakan kolom: tanggal (YYYY-MM-DD), source, campaign, amount");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/crm/performance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "spend", items }),
    });
    setBusy(false);
    if (res.ok) {
      setToast(`${items.length} baris biaya CSV diimpor`);
      setTimeout(() => setToast(null), 3000);
      load();
    }
  };

  return (
    <div>
      <header className="border-b border-[#E2E6ED] bg-white/95 backdrop-blur">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-3 max-w-[1280px] px-4 py-3 sm:px-6">
          <div>
            <h1 className="text-[17px] font-semibold text-[#212120]">Laporan &amp; Performance</h1>
            <p className="text-xs text-slate-500">Analisis Source, Campaign, CPL, CAC, dan ROAS</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button type="button" onClick={() => setPreset("today")} className="h-7 rounded-[6px] border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50">Hari ini</button>
            <button type="button" onClick={() => setPreset("yesterday")} className="h-7 rounded-[6px] border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50">Kemarin</button>
            <button type="button" onClick={() => setPreset(7)} className="h-7 rounded-[6px] border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50">7 hari</button>
            <button type="button" onClick={() => setPreset(30)} className="h-7 rounded-[6px] border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50">30 hari</button>
            <button type="button" onClick={() => setPreset("month")} className="h-7 rounded-[6px] border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50">Bulan ini</button>
            <input type="date" value={startDate} max={todayWib()} onChange={(e) => setStartDate(e.target.value)} className="h-7 rounded-[6px] border border-slate-200 px-2 font-mono text-[11px]" />
            <span className="text-xs text-slate-400">–</span>
            <input type="date" value={endDate} max={todayWib()} onChange={(e) => setEndDate(e.target.value)} className="h-7 rounded-[6px] border border-slate-200 px-2 font-mono text-[11px]" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] space-y-5 px-4 py-6 sm:px-6">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setTab("source")}
            className={`rounded-[6px] px-3 py-1.5 text-xs font-semibold transition ${
              tab === "source" ? "text-white" : "bg-white text-slate-600 border border-slate-200"
            }`}
            style={tab === "source" ? { background: BRAND } : undefined}
          >
            Source &amp; Campaign
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setTab("performance")}
              className={`rounded-[6px] px-3 py-1.5 text-xs font-semibold transition ${
                tab === "performance" ? "text-white" : "bg-white text-slate-600 border border-slate-200"
              }`}
              style={tab === "performance" ? { background: BRAND } : undefined}
            >
              Performance &amp; CAC
            </button>
          )}
        </div>

        {toast && <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-800">{toast}</div>}
        {err && <div className="rounded-[8px] border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-800">{err}</div>}

        {loading ? (
          <div className="h-48 rounded-[10px] border border-slate-200 bg-white animate-pulse" />
        ) : tab === "source" && scData ? (
          <div className="space-y-5">
            <Card title="Laporan per Source" subtitle={`Total ${scData.totalLeads} lead pada periode ${startDate} s/d ${endDate}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-bold uppercase text-slate-500">
                      <th className="py-2 text-left">Source</th>
                      <th className="py-2 text-right">Leads</th>
                      <th className="py-2 text-right">Porsi</th>
                      <th className="py-2 text-right">Warm+</th>
                      <th className="py-2 text-right">Sample+</th>
                      <th className="py-2 text-right">Deal</th>
                      <th className="py-2 text-right">Lost</th>
                      <th className="py-2 text-right">Rasio Deal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(scData.bySource || []).map((r: any) => (
                      <tr key={r.source}>
                        <td className="py-2.5 font-semibold text-[#212120]">{r.source}</td>
                        <td className="py-2.5 text-right font-mono tabular-nums">{r.total}</td>
                        <td className="py-2.5 text-right font-mono tabular-nums text-slate-500">{r.sharePct}%</td>
                        <td className="py-2.5 text-right font-mono tabular-nums">{r.warmPlus}</td>
                        <td className="py-2.5 text-right font-mono tabular-nums font-semibold text-[#1F6FB2]">{r.samplePlus}</td>
                        <td className="py-2.5 text-right font-mono tabular-nums text-emerald-700 font-semibold">{r.deal}</td>
                        <td className="py-2.5 text-right font-mono tabular-nums text-rose-600">{r.lost}</td>
                        <td className="py-2.5 text-right font-mono tabular-nums">{r.dealRatioPct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card title="Laporan per Campaign" subtitle="Diurutkan dari Sample+ terbanyak. Klik campaign untuk membuka Pipeline terfilter.">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-bold uppercase text-slate-500">
                      <th className="py-2 text-left">Campaign</th>
                      <th className="py-2 text-left">Source</th>
                      <th className="py-2 text-right">Leads</th>
                      <th className="py-2 text-right bg-amber-50/70 px-2">Sample</th>
                      <th className="py-2 text-right">Deal</th>
                      <th className="py-2 text-right">Sample+ (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(scData.byCampaign || []).map((c: any) => (
                      <tr key={`${c.source}:${c.campaign}`} className="hover:bg-slate-50">
                        <td className="py-2.5 font-medium">
                          <Link
                            href={`/lead-monitor/pipeline?campaign=${encodeURIComponent(c.campaign)}`}
                            className="text-[#1F6FB2] hover:underline"
                          >
                            {c.campaign}
                          </Link>
                        </td>
                        <td className="py-2.5 text-slate-600">{c.source}</td>
                        <td className="py-2.5 text-right font-mono tabular-nums">{c.total}</td>
                        <td className="py-2.5 text-right font-mono tabular-nums bg-amber-50/50 px-2 font-semibold text-[#D97706]">{c.sample}</td>
                        <td className="py-2.5 text-right font-mono tabular-nums text-emerald-700">{c.deal}</td>
                        <td className="py-2.5 text-right font-mono tabular-nums font-semibold">{c.samplePlus} ({c.samplePlusPct}%)</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        ) : tab === "performance" && isAdmin && perfData ? (
          <div className="space-y-5">
            {/* Satu baris ringkasan angka */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "Total Spend", val: fmtIdr(perfData.summary.spend) },
                { label: "CPL", val: fmtIdr(perfData.summary.cpl) },
                { label: "Cost / Sample", val: fmtIdr(perfData.summary.costPerSample) },
                { label: "CAC Iklan", val: fmtIdr(perfData.summary.cacAd) },
                { label: "CAC Penuh", val: fmtIdr(perfData.summary.cacFull) },
                { label: "ROAS", val: `${perfData.summary.roas}x` },
              ].map((m) => (
                <div key={m.label} className="rounded-[8px] border border-[#E2E6ED] bg-white px-3.5 py-2.5">
                  <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{m.label}</div>
                  <div className="mt-1 font-mono text-sm font-bold text-[#212120] tabular-nums">{m.val}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 rounded-[8px] border border-blue-200/70 bg-blue-50/50 px-3.5 py-2 text-[11px] text-slate-700">
              <span>Catatan atribusi: Lead &amp; Deal dihitung berdasarkan <strong>tanggal lead MASUK</strong> (cohort) agar biaya &amp; hasil iklan sebanding.</span>
              <span className="flex items-center gap-2">
                <Pill tone={perfData.integrations.metaAdsConnected ? "green" : "slate"}>
                  Meta Ads: {perfData.integrations.metaAdsConnected ? "Tersambung" : "Belum tersambung (Manual)"}
                </Pill>
                <Pill tone={perfData.integrations.googleAdsConnected ? "green" : "slate"}>
                  Google Ads: {perfData.integrations.googleAdsConnected ? "Tersambung" : "Belum tersambung (Manual)"}
                </Pill>
              </span>
            </div>

            <Card title="Input Biaya Iklan (Manual & CSV)" subtitle="Rentang tanggal otomatis dibagi rata per hari">
              <form onSubmit={submitSpend} className="grid grid-cols-1 sm:grid-cols-6 gap-2.5 items-end">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Dari</label>
                  <input type="date" value={spStart} onChange={(e) => setSpStart(e.target.value)} className="h-9 w-full rounded-[6px] border border-slate-200 px-2 font-mono text-xs" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Sampai</label>
                  <input type="date" value={spEnd} onChange={(e) => setSpEnd(e.target.value)} className="h-9 w-full rounded-[6px] border border-slate-200 px-2 font-mono text-xs" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Source</label>
                  <select value={spSource} onChange={(e) => setSpSource(e.target.value)} className="h-9 w-full rounded-[6px] border border-slate-200 bg-white px-2 text-xs">
                    {CRM_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Campaign (opsional)</label>
                  <input list="camp-opts" value={spCamp} onChange={(e) => setSpCamp(e.target.value)} placeholder="Nama campaign" className="h-9 w-full rounded-[6px] border border-slate-200 px-2.5 text-xs" />
                  <datalist id="camp-opts">
                    {(perfData.detectedCampaigns || []).map((c: string) => <option key={c} value={c} />)}
                  </datalist>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Total Biaya (IDR)</label>
                  <input value={spAmount} onChange={(e) => setSpAmount(e.target.value.replace(/\D/g, ""))} placeholder="1500000" className="h-9 w-full rounded-[6px] border border-slate-200 px-2.5 font-mono text-xs" required />
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={busy} className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-[6px] px-3 text-xs font-semibold text-white" style={{ background: BRAND }}>
                    <Plus className="h-3.5 w-3.5" /> Simpan
                  </button>
                  <label className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-[6px] border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50" title="Upload CSV (tanggal,source,campaign,amount)">
                    <Upload className="h-3.5 w-3.5" />
                    <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
                  </label>
                </div>
              </form>
            </Card>

            <Card title="Performance per Source">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-bold uppercase text-slate-500">
                      <th className="py-2 text-left">Source</th>
                      <th className="py-2 text-right">Spend</th>
                      <th className="py-2 text-right">Leads</th>
                      <th className="py-2 text-right">CPL</th>
                      <th className="py-2 text-right">Sample</th>
                      <th className="py-2 text-right">Cost/Sample</th>
                      <th className="py-2 text-right">Deal</th>
                      <th className="py-2 text-right">CAC</th>
                      <th className="py-2 text-right">ROAS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(perfData.bySource || []).map((r: any) => (
                      <tr key={r.source}>
                        <td className="py-2.5 font-semibold text-[#212120]">{r.source}</td>
                        <td className="py-2.5 text-right font-mono tabular-nums">{fmtIdr(r.spend)}</td>
                        <td className="py-2.5 text-right font-mono tabular-nums">{r.leads}</td>
                        <td className="py-2.5 text-right font-mono tabular-nums">{fmtIdr(r.cpl)}</td>
                        <td className="py-2.5 text-right font-mono tabular-nums">{r.sample}</td>
                        <td className="py-2.5 text-right font-mono tabular-nums">{fmtIdr(r.costPerSample)}</td>
                        <td className="py-2.5 text-right font-mono tabular-nums text-emerald-700 font-semibold">{r.deal}</td>
                        <td className="py-2.5 text-right font-mono tabular-nums">{fmtIdr(r.cacAd)}</td>
                        <td className="py-2.5 text-right font-mono tabular-nums font-semibold">{r.roas}x</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        ) : null}
      </main>
    </div>
  );
}
