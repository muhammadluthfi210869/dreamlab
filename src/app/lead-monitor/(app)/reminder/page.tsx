"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Clock, MessageSquare, RefreshCw, Save } from "lucide-react";
import { BRAND, Card, Pill } from "@/components/lead-monitor/ui";
import { useMe } from "@/components/lead-monitor/filters";
import { isAdminRole, stageLabel } from "@/lib/crm-stages";

const todayWib = () => new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);

export default function ReminderPage() {
  const me = useMe();
  const isAdmin = isAdminRole(me.role);
  const [startDate, setStartDate] = useState(() => `${todayWib().slice(0, 7)}-01`);
  const [endDate, setEndDate] = useState(() => todayWib());
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [slaMin, setSlaMin] = useState("15");
  const [fu1Days, setFu1Days] = useState("1");
  const [fu2Days, setFu2Days] = useState("3");
  const [lostDays, setLostDays] = useState("7");
  const [toast, setToast] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/crm/reminder?startDate=${startDate}&endDate=${endDate}`, { cache: "no-store" });
      if (res.status === 401) {
        window.location.href = "/lead-monitor/masuk";
        return;
      }
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.success) {
        setData(j);
        if (j.settings) {
          setSlaMin(String(j.settings.sla_minutes ?? 15));
          setFu1Days(String(j.settings.fu1_days ?? 1));
          setFu2Days(String(j.settings.fu2_days ?? 3));
          setLostDays(String(j.settings.lost_suggest_days ?? 7));
        }
        setErr(null);
      } else {
        setErr(j.error || "Gagal memuat data reminder");
      }
    } catch {
      setErr("Tidak bisa terhubung ke server");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    load();
  }, [load]);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/crm/reminder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sla_minutes: Number(slaMin),
        fu1_days: Number(fu1Days),
        fu2_days: Number(fu2Days),
        lost_suggest_days: Number(lostDays),
      }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok || !j.success) {
      setErr(j.error || "Gagal menyimpan pengaturan");
      return;
    }
    setToast("Pengaturan SLA & Follow-Up disimpan");
    setTimeout(() => setToast(null), 3000);
    load();
  };

  return (
    <div>
      <header className="border-b border-[#E2E6ED] bg-white/95 backdrop-blur">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-3 max-w-[1280px] px-4 py-3 sm:px-6">
          <div>
            <h1 className="text-[17px] font-semibold text-[#212120]">Reminder &amp; Kecepatan Balas</h1>
            <p className="text-xs text-slate-500">Pantau antrean chat masuk, SLA jam kerja 08:00–20:00 WIB, dan daftar FU 1 / FU 2</p>
          </div>
          <div className="flex items-center gap-2">
            <input type="date" value={startDate} max={todayWib()} onChange={(e) => setStartDate(e.target.value)} className="h-8 rounded-[6px] border border-slate-200 px-2 font-mono text-xs" />
            <span className="text-xs text-slate-400">–</span>
            <input type="date" value={endDate} max={todayWib()} onChange={(e) => setEndDate(e.target.value)} className="h-8 rounded-[6px] border border-slate-200 px-2 font-mono text-xs" />
            <button type="button" onClick={load} className="inline-flex h-8 items-center gap-1 rounded-[6px] border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700">
              <RefreshCw className="h-3.5 w-3.5" /> Segarkan
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] space-y-5 px-4 py-6 sm:px-6">
        {toast && <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-800">{toast}</div>}
        {err && <div className="rounded-[8px] border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-800">{err}</div>}

        {loading || !data ? (
          <div className="h-44 rounded-[10px] border border-slate-200 bg-white animate-pulse" />
        ) : (
          <>
            {/* KPI Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="rounded-[8px] border border-[#E2E6ED] bg-white px-3.5 py-2.5">
                <div className="text-[10px] font-bold uppercase text-slate-500">Balasan Pertama</div>
                <div className="mt-1 font-mono text-base font-bold text-[#212120] tabular-nums">{data.kpi.avgFirstReplyMin} mnt</div>
              </div>
              <div className="rounded-[8px] border border-[#E2E6ED] bg-white px-3.5 py-2.5">
                <div className="text-[10px] font-bold uppercase text-slate-500">Rata-rata Balas</div>
                <div className="mt-1 font-mono text-base font-bold text-[#212120] tabular-nums">{data.kpi.avgAllReplyMin} mnt</div>
              </div>
              <div className="rounded-[8px] border border-[#E2E6ED] bg-white px-3.5 py-2.5">
                <div className="text-[10px] font-bold uppercase text-slate-500">% ≤ Target (80%)</div>
                <div className={`mt-1 font-mono text-base font-bold tabular-nums ${data.kpi.withinTargetPct >= 80 ? "text-emerald-700" : "text-rose-600"}`}>
                  {data.kpi.withinTargetPct}%
                </div>
              </div>
              <div className="rounded-[8px] border border-[#E2E6ED] bg-white px-3.5 py-2.5">
                <div className="text-[10px] font-bold uppercase text-slate-500">Menunggu / Telat</div>
                <div className="mt-1 font-mono text-base font-bold tabular-nums">
                  <span className="text-[#1F6FB2]">{data.kpi.waitingCount}</span>
                  {" / "}
                  <span className="text-rose-600">{data.kpi.lateCount}</span>
                </div>
              </div>
              <div className="rounded-[8px] border border-[#E2E6ED] bg-white px-3.5 py-2.5">
                <div className="text-[10px] font-bold uppercase text-slate-500">FU 1 (H+{fu1Days})</div>
                <div className="mt-1 font-mono text-base font-bold text-[#F39200] tabular-nums">{data.kpi.fu1Count}</div>
              </div>
              <div className="rounded-[8px] border border-[#E2E6ED] bg-white px-3.5 py-2.5">
                <div className="text-[10px] font-bold uppercase text-slate-500">FU 2 (H+{fu2Days})</div>
                <div className="mt-1 font-mono text-base font-bold text-rose-600 tabular-nums">{data.kpi.fu2Count}</div>
              </div>
            </div>

            {/* Perlu dibalas sekarang */}
            <Card title="Perlu Dibalas Sekarang" subtitle="Diurutkan dari pelanggan yang paling lama menunggu balasan sales">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-bold uppercase text-slate-500">
                      <th className="py-2 text-left">Lead</th>
                      <th className="py-2 text-left">Sales</th>
                      <th className="py-2 text-left">Stage</th>
                      <th className="py-2 text-left">Status Tunggu</th>
                      <th className="py-2 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.waitingList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400">
                          Semua chat pelanggan sudah dibalas.
                        </td>
                      </tr>
                    ) : (
                      data.waitingList.map((w: any) => (
                        <tr key={w.id}>
                          <td className="py-2.5">
                            <div className="font-semibold text-[#212120]">{w.lead_name}</div>
                            <div className="text-[11px] text-slate-500 truncate max-w-xs">{w.last_text}</div>
                          </td>
                          <td className="py-2.5 text-slate-700">{w.sales_name}</td>
                          <td className="py-2.5"><Pill tone="slate">{stageLabel(w.stage)}</Pill></td>
                          <td className="py-2.5">
                            <Pill tone={w.is_late ? "red" : "brand"}>
                              <Clock className="mr-1 inline h-3 w-3" />
                              {w.is_late ? `Telat ${w.waiting_minutes}m` : `Menunggu ${w.waiting_minutes}m`}
                            </Pill>
                          </td>
                          <td className="py-2.5 text-right">
                            <Link
                              href={`/lead-monitor/chat?phone=${encodeURIComponent(w.phone || "")}`}
                              className="inline-flex h-7 items-center gap-1 rounded-[6px] px-2.5 text-[11px] font-semibold text-white"
                              style={{ background: BRAND }}
                            >
                              <MessageSquare className="h-3 w-3" /> Balas
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* FU 1 & FU 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card title={`Daftar FU 1 (H+${fu1Days})`} subtitle="Pesan terakhir dari sales, belum ada balasan pelanggan">
                {data.fu1List.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">Tidak ada lead di status FU 1.</p>
                ) : (
                  <div className="space-y-2">
                    {data.fu1List.map((f: any) => (
                      <div key={f.id} className="flex items-center justify-between rounded-[8px] border border-slate-200 px-3 py-2 text-xs">
                        <div>
                          <div className="font-semibold text-[#212120]">{f.lead_name || f.phone}</div>
                          <div className="text-[11px] text-slate-500">{f.sales_name} · {stageLabel(f.stage)}</div>
                        </div>
                        <Link href={`/lead-monitor/chat?phone=${encodeURIComponent(f.phone || "")}`} className="text-xs font-semibold text-[#1F6FB2] hover:underline">
                          Buka Chat
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card title={`Daftar FU 2 (H+${fu2Days}) & Saran Lost (H+${lostDays})`} subtitle="Prioritas follow-up lanjutan atau tandai Lost">
                {data.fu2List.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">Tidak ada lead di status FU 2.</p>
                ) : (
                  <div className="space-y-2">
                    {data.fu2List.map((f: any) => (
                      <div key={f.id} className="flex items-center justify-between rounded-[8px] border border-slate-200 px-3 py-2 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#212120]">{f.lead_name || f.phone}</span>
                            <Pill tone={f.fu_status === "Saran Lost" ? "red" : "amber"}>{f.fu_status}</Pill>
                          </div>
                          <div className="text-[11px] text-slate-500">{f.sales_name} · {stageLabel(f.stage)}</div>
                        </div>
                        <Link href={`/lead-monitor/chat?phone=${encodeURIComponent(f.phone || "")}`} className="text-xs font-semibold text-[#1F6FB2] hover:underline">
                          Buka Chat
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {isAdmin && data.perSales && (
              <Card title="Kecepatan Balas per Sales (Admin)">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] font-bold uppercase text-slate-500">
                        <th className="py-2 text-left">Sales</th>
                        <th className="py-2 text-right">Balasan</th>
                        <th className="py-2 text-right">Balas 1</th>
                        <th className="py-2 text-right">Rata-rata</th>
                        <th className="py-2 text-right">% ≤ Target</th>
                        <th className="py-2 text-right">Menunggu</th>
                        <th className="py-2 text-right">Telat</th>
                        <th className="py-2 text-right">FU 1</th>
                        <th className="py-2 text-right">FU 2</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.perSales.map((s: any) => (
                        <tr key={s.sales_name}>
                          <td className="py-2 font-semibold text-[#212120]">{s.sales_name}</td>
                          <td className="py-2 text-right font-mono tabular-nums">{s.replyCount}</td>
                          <td className="py-2 text-right font-mono tabular-nums">{s.avgFirstMin}m</td>
                          <td className="py-2 text-right font-mono tabular-nums">{s.avgAllMin}m</td>
                          <td className={`py-2 text-right font-mono tabular-nums font-semibold ${s.withinTargetPct >= 80 ? "text-emerald-700" : "text-rose-600"}`}>{s.withinTargetPct}%</td>
                          <td className="py-2 text-right font-mono tabular-nums">{s.waitingCount}</td>
                          <td className="py-2 text-right font-mono tabular-nums text-rose-600">{s.lateCount}</td>
                          <td className="py-2 text-right font-mono tabular-nums">{s.fu1Count}</td>
                          <td className="py-2 text-right font-mono tabular-nums">{s.fu2Count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {isAdmin && (
              <Card title="Pengaturan Target SLA & Follow-Up">
                <form onSubmit={saveSettings} className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Target Balas (menit)</label>
                    <input type="number" min={1} value={slaMin} onChange={(e) => setSlaMin(e.target.value)} className="h-9 w-full rounded-[6px] border border-slate-200 px-2.5 font-mono text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">FU 1 (H+)</label>
                    <input type="number" min={1} value={fu1Days} onChange={(e) => setFu1Days(e.target.value)} className="h-9 w-full rounded-[6px] border border-slate-200 px-2.5 font-mono text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">FU 2 (H+)</label>
                    <input type="number" min={2} value={fu2Days} onChange={(e) => setFu2Days(e.target.value)} className="h-9 w-full rounded-[6px] border border-slate-200 px-2.5 font-mono text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Saran Lost (H+)</label>
                    <input type="number" min={3} value={lostDays} onChange={(e) => setLostDays(e.target.value)} className="h-9 w-full rounded-[6px] border border-slate-200 px-2.5 font-mono text-xs" />
                  </div>
                  <button type="submit" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[6px] px-3 text-xs font-semibold text-white" style={{ background: BRAND }}>
                    <Save className="h-3.5 w-3.5" /> Simpan
                  </button>
                </form>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}
