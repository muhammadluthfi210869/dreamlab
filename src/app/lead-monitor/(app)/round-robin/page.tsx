"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Clock, RefreshCw, Repeat, ShieldAlert, UserCheck } from "lucide-react";
import { BRAND, Card, Pill } from "@/components/lead-monitor/ui";
import { useMe } from "@/components/lead-monitor/filters";
import { isAdminRole } from "@/lib/crm-stages";

interface SalesCard {
  id: number;
  name: string;
  wa_number: string | null;
  is_active: boolean;
  off_reason: string | null;
  off_until: string | null;
  rr_order: number;
  is_archived: boolean;
  is_next: boolean;
  total_leads: number;
  today_leads: number;
  active_leads: number;
  deal_leads: number;
}

interface AssignmentLog {
  id: number;
  tracking_code: string | null;
  lead_name: string | null;
  customer_phone: string | null;
  source: string | null;
  sales_name: string;
  method: "round_robin" | "sticky" | "manual" | "queue";
  skipped_sales: string[];
  assigned_at: string;
}

const OFF_REASONS = ["Cuti", "Sakit", "Libur", "Off shift"] as const;

export default function RoundRobinPage() {
  const me = useMe();
  const isAdmin = isAdminRole(me.role);
  const [cards, setCards] = useState<SalesCard[]>([]);
  const [logs, setLogs] = useState<AssignmentLog[]>([]);
  const [stickyEnabled, setStickyEnabled] = useState(true);
  const [queuedCount, setQueuedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [offModal, setOffModal] = useState<{ card: SalesCard; reason: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/crm/round-robin", { cache: "no-store" });
      if (res.status === 401) {
        window.location.href = "/lead-monitor/masuk";
        return;
      }
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.success) {
        setErr(j.error || "Gagal memuat data Round Robin");
      } else {
        setCards(j.cards || []);
        setLogs(j.logs || []);
        setStickyEnabled(j.sticky_enabled !== false);
        setQueuedCount(Number(j.queued_count || 0));
        setErr(null);
      }
    } catch {
      setErr("Tidak bisa terhubung ke server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const toggleSticky = async () => {
    setBusy(true);
    const res = await fetch("/api/crm/round-robin", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sticky_enabled: !stickyEnabled }),
    });
    setBusy(false);
    if (res.ok) {
      setStickyEnabled(!stickyEnabled);
      showToast(!stickyEnabled ? "Sticky owner diaktifkan" : "Sticky owner dimatikan");
    }
  };

  const toggleSalesStatus = async (card: SalesCard, nextActive: boolean, offReason?: string) => {
    setBusy(true);
    const res = await fetch("/api/crm/round-robin", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toggle: {
          sales_id: card.id,
          is_active: nextActive,
          off_reason: nextActive ? null : offReason || "Off shift",
        },
      }),
    });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok || !j.success) {
      setErr(j.error || "Gagal mengubah status sales");
      return;
    }
    setOffModal(null);
    showToast(
      nextActive
        ? `${card.name} aktif kembali${j.drainedCount ? ` (${j.drainedCount} antrean dibagi)` : ""}`
        : `${card.name} dinonaktifkan (${offReason || "Off shift"})`
    );
    load();
  };

  const moveOrder = async (index: number, delta: -1 | 1) => {
    const activeList = cards.filter((c) => !c.is_archived);
    const targetIdx = index + delta;
    if (targetIdx < 0 || targetIdx >= activeList.length) return;
    const reordered = [...activeList];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);

    setBusy(true);
    const res = await fetch("/api/crm/round-robin", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: reordered.map((c) => c.id) }),
    });
    setBusy(false);
    if (res.ok) {
      showToast("Urutan giliran disimpan");
      load();
    }
  };

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6">
        <div className="rounded-[10px] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">
          Halaman Round Robin hanya dapat diakses oleh Admin.
        </div>
      </main>
    );
  }

  const activeCards = cards.filter((c) => !c.is_archived);
  const archivedCards = cards.filter((c) => c.is_archived);

  return (
    <div>
      <header className="border-b border-[#E2E6ED] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6">
          <div>
            <h1 className="text-[17px] font-semibold leading-tight text-[#212120]">Round Robin</h1>
            <p className="text-xs text-slate-500">Pembagian lead otomatis, urutan giliran, dan log penugasan</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={toggleSticky}
              className={`inline-flex h-8 items-center gap-1.5 rounded-[8px] border px-3 text-xs font-semibold transition ${
                stickyEnabled
                  ? "border-[#1F6FB2]/30 bg-blue-50 text-[#1F6FB2]"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              <Repeat className="h-3.5 w-3.5" />
              Sticky owner: {stickyEnabled ? "ON" : "OFF"}
            </button>
            <button
              type="button"
              onClick={load}
              className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Segarkan
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] space-y-5 px-4 py-6 sm:px-6">
        {toast && (
          <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-800">
            {toast}
          </div>
        )}
        {err && (
          <div className="rounded-[8px] border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-800">
            {err}
          </div>
        )}

        {queuedCount > 0 && (
          <div className="flex items-center justify-between rounded-[8px] border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-900">
            <div className="flex items-center gap-2 font-medium">
              <ShieldAlert className="h-4 w-4 text-[#F39200]" />
              <span>
                Ada <strong className="font-mono tabular-nums">{queuedCount}</strong> lead di antrean (otomatis dibagi saat ada sales ON).
              </span>
            </div>
          </div>
        )}

        {/* Kartu tiap sales */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-[10px] border border-slate-200 bg-white animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCards.map((card, idx) => (
              <div
                key={card.id}
                className={`rounded-[10px] border bg-white p-4 transition ${
                  card.is_next ? "border-[#F39200] ring-1 ring-[#F39200]/30" : "border-[#E2E6ED]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#212120]">{card.name}</span>
                      {card.is_next && (
                        <span
                          className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                          style={{ background: BRAND }}
                        >
                          Giliran berikutnya
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-slate-500 tabular-nums">
                      {card.wa_number || "Belum ada nomor WA"}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={busy || idx === 0}
                      onClick={() => moveOrder(idx, -1)}
                      title="Naikkan urutan"
                      className="inline-flex h-6 w-6 items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-35"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled={busy || idx === activeCards.length - 1}
                      onClick={() => moveOrder(idx, 1)}
                      title="Turunkan urutan"
                      className="inline-flex h-6 w-6 items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-35"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  {card.is_active ? (
                    <Pill tone="green">
                      <UserCheck className="mr-1 inline h-3 w-3" /> ON · Terima lead
                    </Pill>
                  ) : (
                    <Pill tone="amber">
                      <Clock className="mr-1 inline h-3 w-3" /> OFF · {card.off_reason || "Off shift"}
                    </Pill>
                  )}

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      card.is_active
                        ? setOffModal({ card, reason: "Cuti" })
                        : toggleSalesStatus(card, true)
                    }
                    className={`rounded-[6px] border px-2.5 py-1 text-[11px] font-semibold transition ${
                      card.is_active
                        ? "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                        : "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                    }`}
                  >
                    {card.is_active ? "Set OFF" : "Aktifkan ON"}
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2 border-t border-slate-100 pt-3 text-center">
                  <div>
                    <div className="font-mono text-sm font-semibold text-[#212120] tabular-nums">{card.total_leads}</div>
                    <div className="text-[10px] text-slate-500">Total</div>
                  </div>
                  <div>
                    <div className="font-mono text-sm font-semibold text-[#1F6FB2] tabular-nums">{card.today_leads}</div>
                    <div className="text-[10px] text-slate-500">Hari ini</div>
                  </div>
                  <div>
                    <div className="font-mono text-sm font-semibold text-[#212120] tabular-nums">{card.active_leads}</div>
                    <div className="text-[10px] text-slate-500">Aktif</div>
                  </div>
                  <div>
                    <div className="font-mono text-sm font-semibold text-emerald-700 tabular-nums">{card.deal_leads}</div>
                    <div className="text-[10px] text-slate-500">Deal</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {archivedCards.length > 0 && (
          <Card title="Sales Diarsipkan" subtitle="Data lead, chat, dan laporan tetap tersimpan">
            <div className="flex flex-wrap gap-3">
              {archivedCards.map((c) => (
                <div key={c.id} className="rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                  <span className="font-semibold text-slate-700">{c.name}</span>{" "}
                  <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">arsip</span>
                  <span className="ml-2 font-mono text-slate-500 tabular-nums">{c.total_leads} lead</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Log Penugasan */}
        <Card title="Log Penugasan Round Robin" subtitle="80 penugasan terakhir">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-2 pr-3">Waktu</th>
                  <th className="py-2 px-3">Lead</th>
                  <th className="py-2 px-3">Source</th>
                  <th className="py-2 px-3">Sales</th>
                  <th className="py-2 px-3">Cara</th>
                  <th className="py-2 pl-3">Dilewati</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Belum ada log penugasan round robin. Penugasan dari rotator WA atau lead baru akan muncul di sini.
                    </td>
                  </tr>
                ) : (
                  logs.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/70">
                      <td className="whitespace-nowrap py-2.5 pr-3 font-mono text-[11px] text-slate-600 tabular-nums">
                        {new Date(l.assigned_at).toLocaleString("id-ID", {
                          timeZone: "Asia/Jakarta",
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-slate-800">{l.lead_name || l.customer_phone || l.tracking_code || "—"}</div>
                        {l.tracking_code && <div className="font-mono text-[10px] text-slate-400">{l.tracking_code}</div>}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{l.source || "—"}</td>
                      <td className="py-2.5 px-3 font-semibold text-[#212120]">{l.sales_name}</td>
                      <td className="py-2.5 px-3">
                        <Pill tone={l.method === "queue" ? "amber" : l.method === "sticky" ? "slate" : "green"}>
                          {l.method}
                        </Pill>
                      </td>
                      <td className="py-2.5 pl-3 text-slate-500">
                        {l.skipped_sales && l.skipped_sales.length > 0 ? l.skipped_sales.join(", ") : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* Modal Alasan OFF */}
      {offModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-[10px] border border-slate-200 bg-white p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#212120]">Nonaktifkan {offModal.card.name}</h3>
            <p className="text-xs text-slate-600">
              {offModal.card.name} tidak akan menerima lead baru dari round robin. Lead dan chat yang sudah ada tetap aman.
            </p>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                Alasan OFF
              </label>
              <select
                value={offModal.reason}
                onChange={(e) => setOffModal({ ...offModal, reason: e.target.value })}
                className="h-9 w-full rounded-[6px] border border-slate-200 px-2.5 text-xs text-slate-800"
              >
                {OFF_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOffModal(null)}
                className="h-8 rounded-[6px] border border-slate-200 px-3 text-xs font-semibold text-slate-600"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => toggleSalesStatus(offModal.card, false, offModal.reason)}
                className="h-8 rounded-[6px] px-3 text-xs font-semibold text-white"
                style={{ background: BRAND }}
              >
                Simpan OFF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
