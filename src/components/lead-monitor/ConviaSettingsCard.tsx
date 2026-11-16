"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, RefreshCw, Smartphone, Radio, Users2, ShieldAlert } from "lucide-react";
import { Card } from "@/components/lead-monitor/ui";

interface ConviaNumberRow {
  convia_id: string;
  display_phone_number: string;
  verified_name: string | null;
  quality_rating: "GREEN" | "YELLOW" | "RED" | "UNKNOWN";
  is_primary: boolean;
  sales_id: number | null;
  is_shared: boolean;
  synced_at: string;
  sales_name: string | null;
}

interface SalesRow {
  id: number;
  name: string;
  wa_number: string | null;
  role: string;
  is_active: boolean;
}

interface ConviaHealthInfo {
  ok: boolean;
  status: string;
  statusCode?: number;
  checkedAt: string;
  error?: string;
}

export function ConviaSettingsCard() {
  const [health, setHealth] = useState<ConviaHealthInfo | null>(null);
  const [numbers, setNumbers] = useState<ConviaNumberRow[]>([]);
  const [salesList, setSalesList] = useState<SalesRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crm/settings/convia", { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json.error || `Gagal memuat status Convia (${res.status})`);
      }
      setHealth(json.health);
      setNumbers(json.numbers || []);
      setSalesList(json.sales || []);
    } catch (err: any) {
      setError(err?.message || "Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSyncNumbers = async () => {
    setSyncing(true);
    setError(null);
    try {
      const res = await fetch("/api/crm/settings/convia", { method: "POST" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal sinkronisasi nomor Convia");
      }
      await loadData();
    } catch (err: any) {
      setError(err?.message || "Gagal sinkronisasi nomor Convia");
    } finally {
      setSyncing(false);
    }
  };

  const handleUpdateMapping = async (conviaId: string, salesId: number | null, isShared: boolean) => {
    setSavingId(conviaId);
    try {
      const res = await fetch("/api/crm/settings/convia", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          convia_id: conviaId,
          sales_id: isShared ? null : salesId,
          is_shared: isShared,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan pemetaan nomor");
      }
      setNumbers((prev) =>
        prev.map((n) =>
          n.convia_id === conviaId
            ? {
                ...n,
                sales_id: isShared ? null : salesId,
                is_shared: isShared,
                sales_name: isShared ? null : salesList.find((s) => s.id === salesId)?.name || null,
              }
            : n
        )
      );
    } catch (err: any) {
      alert(err?.message || "Gagal menyimpan pemetaan nomor");
    } finally {
      setSavingId(null);
    }
  };

  const isWarningRating = (r: string) => r === "YELLOW" || r === "RED";

  return (
    <Card
      title="Integrasi WhatsApp Convia (Banyak Nomor)"
      subtitle="Koneksi resmi Convia API, sinkronisasi nomor WhatsApp WABA, dan pemetaan ke masing-masing sales BusDev"
      right={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSyncNumbers}
            disabled={syncing || loading}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#D98A00] hover:bg-[#B45309] text-white px-3 text-xs font-semibold shadow-xs transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${syncing ? "animate-spin" : ""}`} />
            <span>{syncing ? "Menyinkronkan..." : "Sinkronkan Nomor"}</span>
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Status GET /health & Quality Alert */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[#ECEAE4] bg-[#F8F9FB] p-3.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Koneksi Convia API (GET /health)
            </div>
            <div className="mt-2 flex items-center gap-2">
              {loading ? (
                <span className="text-xs text-slate-400">Memeriksa status...</span>
              ) : health?.ok ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700">
                    Tersambung (Status: {health.status.toUpperCase()})
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-rose-600" />
                  <span className="text-xs font-bold text-rose-700">
                    Gagal ({health?.error || "Koneksi terputus"})
                  </span>
                </>
              )}
            </div>
            <div className="mt-1 text-[11px] text-slate-400 font-mono">
              Terakhir dicek: {health?.checkedAt ? new Date(health.checkedAt).toLocaleTimeString("id-ID") + " WIB" : "—"}
            </div>
          </div>

          <div className="rounded-xl border border-[#ECEAE4] bg-[#F8F9FB] p-3.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total Nomor Tersinkronisasi (convia_numbers)
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-blue-600" />
              <span className="font-mono text-sm font-bold text-slate-900">
                {numbers.length} Nomor Terdaftar
              </span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              Klik &quot;Sinkronkan Nomor&quot; untuk memperbarui dari server Convia
            </div>
          </div>
        </div>

        {/* Peringatan Quality Rating Kuning/Merah jika ada */}
        {numbers.some((n) => isWarningRating(n.quality_rating)) && (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
            <div>
              <div className="font-bold">Peringatan Kualitas Nomor (Meta Quality Rating)</div>
              <div>
                Terdapat nomor dengan status kualitas <b>YELLOW</b> atau <b>RED</b>. Kurangi pengiriman pesan massal dan pastikan respon cepat agar nomor tidak terblokir oleh Meta.
              </div>
            </div>
          </div>
        )}

        {/* 2. Tabel Pemetaan Nomor convia_numbers */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 text-[#F39200]" />
            <span>Daftar Nomor WhatsApp & Pemetaan Sales</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#ECEAE4]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#ECEAE4] bg-[#F8F9FB] text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-2.5 pl-4 pr-3">Nomor WhatsApp</th>
                  <th className="py-2.5 px-3">Nama Akun WABA</th>
                  <th className="py-2.5 px-3">Quality Rating</th>
                  <th className="py-2.5 pl-3 pr-4 min-w-[240px]">Pemegang Nomor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1EFEA] bg-white">
                {numbers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      Belum ada nomor tersinkron. Klik tombol &quot;Sinkronkan Nomor&quot; di atas.
                    </td>
                  </tr>
                ) : (
                  numbers.map((n) => {
                    const isYellowOrRed = isWarningRating(n.quality_rating);
                    return (
                      <tr key={n.convia_id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 pl-4 pr-3">
                          <div className="font-mono font-bold text-slate-900">
                            {n.display_phone_number || n.convia_id}
                          </div>
                          {n.is_primary && (
                            <span className="inline-block rounded-sm bg-blue-50 text-blue-700 px-1 py-0.2 text-[9px] font-semibold border border-blue-200">
                              Primary
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">
                          {n.verified_name || "—"}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 font-mono text-[10px] font-bold border ${
                              n.quality_rating === "GREEN"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : n.quality_rating === "YELLOW"
                                ? "bg-amber-100 text-amber-900 border-amber-300 font-extrabold"
                                : n.quality_rating === "RED"
                                ? "bg-rose-100 text-rose-900 border-rose-300 font-extrabold"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {n.quality_rating}
                          </span>
                        </td>
                        <td className="py-2.5 pl-3 pr-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <select
                                value={n.is_shared ? "shared" : String(n.sales_id || "")}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === "shared") {
                                    handleUpdateMapping(n.convia_id, null, true);
                                  } else {
                                    handleUpdateMapping(n.convia_id, val ? Number(val) : null, false);
                                  }
                                }}
                                disabled={savingId === n.convia_id}
                                className="h-8 rounded-lg border border-[#D5D9E2] bg-white px-2 text-xs font-medium text-slate-800 outline-none focus:border-[#F39200]"
                              >
                                <option value="">-- Belum Dipetakan --</option>
                                <option value="shared">Nomor Bersama (Round Robin)</option>
                                <optgroup label="Tugaskan ke BusDev:">
                                  {salesList.map((s) => (
                                    <option key={s.id} value={s.id}>
                                      {s.name} ({s.role})
                                    </option>
                                  ))}
                                </optgroup>
                              </select>

                              {savingId === n.convia_id && (
                                <span className="text-[10px] text-slate-400 animate-pulse">Menyimpan...</span>
                              )}
                            </div>

                            {n.is_shared ? (
                              <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-700">
                                <Users2 className="h-3 w-3" />
                                <span>Nomor Bersama: Lead baru dibagi bergiliran via Round Robin</span>
                              </span>
                            ) : n.sales_name ? (
                              <span className="text-[11px] text-slate-500">
                                Dikelola langsung oleh: <b className="text-slate-800">{n.sales_name}</b>
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Pilih sales atau nomor bersama</span>
                            )}
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
      </div>
    </Card>
  );
}
