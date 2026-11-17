"use client";

import { useState } from "react";
import { Play, Upload } from "lucide-react";
import { BRAND, Card } from "@/components/lead-monitor/ui";
import { useMe } from "@/components/lead-monitor/filters";
import { isAdminRole } from "@/lib/crm-stages";

export default function MigrasiPage() {
  const me = useMe();
  const isAdmin = isAdminRole(me.role);
  const [sourceSystem, setSourceSystem] = useState<"convia" | "kommo">("convia");
  const [result, setResult] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-[10px] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">
          Halaman Migrasi hanya untuk Admin.
        </div>
      </main>
    );
  }

  const run = async (dryRun: boolean) => {
    setBusy(true);
    setErr(null);
    const res = await fetch("/api/crm/migrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceSystem, dryRun }),
    });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok || !j.success) {
      setErr(j.error || "Gagal menjalankan migrasi");
      return;
    }
    setResult(j);
  };

  return (
    <div>
      <header className="border-b border-[#E2E6ED] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[960px] items-center px-4 sm:px-6">
          <div>
            <h1 className="text-[17px] font-semibold text-[#212120]">Migrasi Data (Convia &amp; Kommo)</h1>
            <p className="text-xs text-slate-500">Import satu kali dengan pengecekan duplikat E.164 dan wajib Dry-Run terlebih dahulu</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[960px] space-y-5 px-4 py-6 sm:px-6">
        {err && <div className="rounded-[8px] border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs text-rose-800">{err}</div>}

        <Card title="Sumber Migrasi" subtitle="Pilih sumber data lalu jalankan Dry-Run untuk melihat ringkasan sebelum menulis ke database">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={sourceSystem}
              onChange={(e) => setSourceSystem(e.target.value as "convia" | "kommo")}
              className="h-9 rounded-[6px] border border-slate-200 bg-white px-3 text-xs font-medium"
            >
              <option value="convia">Convia Contacts (API)</option>
              <option value="kommo">Kommo API v4</option>
            </select>
            <button
              type="button"
              disabled={busy}
              onClick={() => run(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-[6px] border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Play className="h-3.5 w-3.5" /> Dry-Run (Simulasi)
            </button>
            {result?.dryRun && result?.newLeads > 0 && (
              <button
                type="button"
                disabled={busy}
                onClick={() => run(false)}
                className="inline-flex h-9 items-center gap-1.5 rounded-[6px] px-3.5 text-xs font-semibold text-white"
                style={{ background: BRAND }}
              >
                <Upload className="h-3.5 w-3.5" /> Jalankan Import ({result.newLeads} lead baru)
              </button>
            )}
          </div>
        </Card>

        {result && (
          <Card title="Ringkasan Hasil">
            <div className="space-y-2 text-xs">
              <div>Mode: <strong>{result.dryRun ? "Dry-Run (belum menulis ke DB)" : "Import Selesai"}</strong></div>
              {result.dryRun ? (
                <>
                  <div>Total diambil: <strong className="font-mono">{result.totalFetched}</strong></div>
                  <div>Lead baru siap masuk: <strong className="font-mono text-emerald-700">{result.newLeads}</strong></div>
                  <div>Duplikat E.164 dilewati: <strong className="font-mono text-slate-500">{result.duplicatesSkipped}</strong></div>
                </>
              ) : (
                <div>Berhasil diimpor: <strong className="font-mono text-emerald-700">{result.inserted}</strong> (duplikat dilewati: {result.duplicatesSkipped})</div>
              )}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
