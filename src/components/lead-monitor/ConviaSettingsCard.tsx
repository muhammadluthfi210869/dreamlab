"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, RefreshCw, Smartphone, Radio } from "lucide-react";
import { Card } from "@/components/lead-monitor/ui";

interface ConviaPhoneNumber {
  id: string;
  display_phone_number?: string;
  verified_name?: string;
  quality_rating?: string;
  code_verification_status?: string;
  status?: string;
}

interface SalesRow {
  id: number;
  name: string;
  wa_number: string | null;
  role: string;
  is_active: boolean;
  convia_phone_id: string | null;
}

interface ConviaSettingsData {
  convia: {
    health: {
      ok: boolean;
      configured: boolean;
      status?: string;
      statusCode?: number;
      error?: string;
    };
    phoneNumbers: ConviaPhoneNumber[];
    phoneError: string | null;
  };
  sales: SalesRow[];
}

export function ConviaSettingsCard() {
  const [data, setData] = useState<ConviaSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<number | null>(null);

  const loadData = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/crm/settings/convia", { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json.error || `Gagal memuat status Convia (${res.status})`);
      }
      setData(json);
    } catch (err: any) {
      setError(err?.message || "Gagal menghubungi server");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleMapSales = async (salesId: number, conviaPhoneId: string) => {
    setSavingId(salesId);
    try {
      const res = await fetch("/api/crm/settings/convia", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sales_id: salesId,
          convia_phone_id: conviaPhoneId || null,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan pemetaan");
      }
      setSaveSuccess(salesId);
      setTimeout(() => setSaveSuccess(null), 2500);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sales: prev.sales.map((s) =>
            s.id === salesId ? { ...s, convia_phone_id: conviaPhoneId || null } : s
          ),
        };
      });
    } catch (err: any) {
      alert(err?.message || "Gagal menyimpan pemetaan");
    } finally {
      setSavingId(null);
    }
  };

  const health = data?.convia?.health;
  const phoneNumbers = data?.convia?.phoneNumbers || [];
  const salesList = data?.sales || [];

  return (
    <Card
      title="Integrasi WhatsApp Convia (Coexistence)"
      subtitle="Status koneksi Meta/Convia API dan pemetaan nomor WhatsApp ke tim sales BusDev"
      right={
        <button
          type="button"
          onClick={() => loadData(true)}
          disabled={loading || refreshing}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E5E2DA] bg-white px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          <span>Refresh Status</span>
        </button>
      }
    >
      <div className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Status GET /health */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[#ECEAE4] bg-[#F8F9FB] p-3.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Koneksi API Convia (GET /health)
            </div>
            <div className="mt-2 flex items-center gap-2">
              {loading ? (
                <span className="text-xs text-slate-400">Memeriksa status...</span>
              ) : health?.ok ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700">
                    Tersambung (Status: {health.status || "OK"})
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-rose-600" />
                  <span className="text-xs font-bold text-rose-700">
                    {health?.configured ? health.error || "Gagal" : "API Key Belum Dikonfigurasi"}
                  </span>
                </>
              )}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              Endpoint: <code className="font-mono text-[10px] text-slate-700">GET /health</code>
            </div>
          </div>

          <div className="rounded-xl border border-[#ECEAE4] bg-[#F8F9FB] p-3.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Nomor Terdaftar (GET /phone-numbers)
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-blue-600" />
              <span className="font-mono text-sm font-bold text-slate-900">
                {phoneNumbers.length} Nomor Aktif
              </span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              Nomor resmi WABA yang terhubung ke Convia
            </div>
          </div>
        </div>

        {/* 2. Daftar Nomor Convia */}
        {phoneNumbers.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5 text-[#F39200]" />
              <span>Daftar Nomor WhatsApp di Akun Convia</span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-[#ECEAE4]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#ECEAE4] bg-[#F8F9FB] text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-2.5 pl-4 pr-3">Nomor WhatsApp</th>
                    <th className="py-2.5 px-3">Nama Terverifikasi</th>
                    <th className="py-2.5 px-3">Quality Rating</th>
                    <th className="py-2.5 pl-3 pr-4 font-mono">Convia Phone ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1EFEA] bg-white">
                  {phoneNumbers.map((p) => {
                    const quality = (p.quality_rating || "").toUpperCase();
                    const isGreen = quality === "GREEN" || quality === "GOOD";
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 pl-4 pr-3 font-mono font-bold text-slate-900">
                          {p.display_phone_number || "—"}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">
                          {p.verified_name || "—"}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                              isGreen
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {p.quality_rating || "UNKNOWN"}
                          </span>
                        </td>
                        <td className="py-2.5 pl-3 pr-4 font-mono text-[11px] text-slate-500">
                          {p.id}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Pemetaan Sales ke Nomor Convia */}
        <div className="space-y-2 pt-2 border-t border-[#ECEAE4]">
          <div className="text-xs font-bold text-slate-800">
            Pemetaan Nomor WhatsApp Convia ke Tim Sales BusDev
          </div>
          <p className="text-[11px] text-slate-500">
            Pilih nomor Convia yang dipegang oleh masing-masing sales agar pesan keluar dan alur chat diarahkan ke nomor yang tepat.
          </p>

          <div className="overflow-x-auto rounded-xl border border-[#ECEAE4]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#ECEAE4] bg-[#F8F9FB] text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-2.5 pl-4 pr-3">Nama Sales</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Nomor WA Database</th>
                  <th className="py-2.5 pl-3 pr-4 min-w-[220px]">Nomor Convia Terpetakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1EFEA] bg-white">
                {salesList.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 pl-4 pr-3 font-semibold text-slate-900">
                      {s.name}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="capitalize text-slate-500">{s.role}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">
                      {s.wa_number || "—"}
                    </td>
                    <td className="py-2.5 pl-3 pr-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={s.convia_phone_id || ""}
                          onChange={(e) => handleMapSales(s.id, e.target.value)}
                          disabled={savingId === s.id}
                          className="h-8 rounded-lg border border-[#D5D9E2] bg-white px-2 text-xs font-medium text-slate-800 outline-none focus:border-[#F39200]"
                        >
                          <option value="">-- Belum Dipetakan --</option>
                          {phoneNumbers.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.display_phone_number || p.id} ({p.verified_name || "Convia"})
                            </option>
                          ))}
                        </select>
                        {savingId === s.id && (
                          <span className="text-[10px] text-slate-400 animate-pulse">Menyimpan...</span>
                        )}
                        {saveSuccess === s.id && (
                          <span className="text-[10px] font-semibold text-emerald-600">Tersimpan!</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
}
