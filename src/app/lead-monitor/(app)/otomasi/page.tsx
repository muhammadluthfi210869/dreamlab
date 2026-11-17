"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Play, Plus, RefreshCw, Send, Trash2 } from "lucide-react";
import { BRAND, Card, Pill } from "@/components/lead-monitor/ui";
import { useMe } from "@/components/lead-monitor/filters";
import { isAdminRole, PIPELINE_STAGES, stageLabel } from "@/lib/crm-stages";

export default function OtomasiPage() {
  const me = useMe();
  const isAdmin = isAdminRole(me.role);
  const [tab, setTab] = useState<"rules" | "segments">(isAdmin ? "rules" : "segments");

  const [rules, setRules] = useState<any>({
    form_to_cold: true,
    reply_to_warm: true,
    chat_count_to_warm: true,
    first_sales_reply_to_cold: false,
  });
  const [chatThreshold, setChatThreshold] = useState(5);
  const [triggers, setTriggers] = useState<any[]>([]);
  const [newPhrase, setNewPhrase] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newStage, setNewStage] = useState("hot");

  // Simulator "Coba aturan"
  const [simStage, setSimStage] = useState("lead_masuk");
  const [simText, setSimText] = useState("Data Form Klien\nNama: Budi\nBrand: GlowLab\nProduk: Serum\nQty: 600");
  const [simResult, setSimResult] = useState<any>(null);

  // Segmen
  const [segments, setSegments] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [segStage, setSegStage] = useState("all");
  const [segHasChat, setSegHasChat] = useState(true);
  const [segName, setSegName] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [segRes, autoRes] = await Promise.all([
      fetch("/api/crm/segments", { cache: "no-store" }),
      isAdmin ? fetch("/api/crm/automation", { cache: "no-store" }) : Promise.resolve(null),
    ]);
    const segJson = await segRes.json().catch(() => ({}));
    if (segRes.ok && segJson.success) {
      setSegments(segJson.segments || []);
      setContacts(segJson.contacts || []);
    }
    if (autoRes) {
      const autoJson = await autoRes.json().catch(() => ({}));
      if (autoRes.ok && autoJson.success) {
        if (autoJson.settings?.rules) setRules(autoJson.settings.rules);
        if (autoJson.settings?.chat_threshold) setChatThreshold(Number(autoJson.settings.chat_threshold));
        setTriggers(autoJson.triggers || []);
      }
    }
  }, [isAdmin]);

  useEffect(() => {
    load();
  }, [load]);

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 3000);
  };

  const saveRules = async (nextRules: any, nextThresh: number) => {
    await fetch("/api/crm/automation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save_settings", rules: nextRules, chat_threshold: nextThresh }),
    });
    showToast("Aturan otomasi disimpan");
  };

  const addTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/crm/automation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save_trigger", phrase: newPhrase, label: newLabel, target_stage: newStage }),
    });
    setNewPhrase("");
    setNewLabel("");
    load();
  };

  const runSimulate = async () => {
    const res = await fetch("/api/crm/automation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "simulate", currentStage: simStage, messageText: simText }),
    });
    const j = await res.json().catch(() => ({}));
    setSimResult(j);
  };

  const filteredContacts = contacts.filter((c) => {
    if (segHasChat && !c.has_chatted) return false;
    if (segStage !== "all" && c.stage !== segStage) return false;
    return true;
  });

  const syncToConvia = async () => {
    const name = segName.trim() || (segStage === "all" ? "semua-lead" : segStage);
    const phones = filteredContacts.map((c) => c.phone).filter(Boolean);
    const res = await fetch("/api/crm/segments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "sync_convia", name, phones }),
    });
    const j = await res.json().catch(() => ({}));
    if (res.ok && j.success) {
      showToast(`Tag ${j.tag} disinkronkan ke ${j.synced} kontak Convia`);
      load();
    }
  };

  const exportCsv = () => {
    const header = ["Nama", "Nomor WA", "Brand", "Produk", "Stage", "Source", "Campaign", "Sales"];
    const rows = filteredContacts.map((c) => [c.name, c.phone, c.brand, c.produk, c.stage, c.source, c.campaign, c.sales_name]);
    const csv = "\uFEFF" + [header, ...rows].map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `segmen-dreamlab-${todayName()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  function todayName() {
    return new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);
  }

  return (
    <div>
      <header className="border-b border-[#E2E6ED] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6">
          <div>
            <h1 className="text-[17px] font-semibold text-[#212120]">Otomasi Stage &amp; Segmen Convia</h1>
            <p className="text-xs text-slate-500">Aturan perpindahan stage otomatis, coba aturan, dan sinkron tag segmen ke Convia</p>
          </div>
          <button type="button" onClick={load} className="inline-flex h-8 items-center gap-1 rounded-[6px] border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700">
            <RefreshCw className="h-3.5 w-3.5" /> Segarkan
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] space-y-5 px-4 py-6 sm:px-6">
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          {isAdmin && (
            <button
              type="button"
              onClick={() => setTab("rules")}
              className={`rounded-[6px] px-3 py-1.5 text-xs font-semibold ${tab === "rules" ? "text-white" : "bg-white border border-slate-200 text-slate-600"}`}
              style={tab === "rules" ? { background: BRAND } : undefined}
            >
              Otomasi Stage
            </button>
          )}
          <button
            type="button"
            onClick={() => setTab("segments")}
            className={`rounded-[6px] px-3 py-1.5 text-xs font-semibold ${tab === "segments" ? "text-white" : "bg-white border border-slate-200 text-slate-600"}`}
            style={tab === "segments" ? { background: BRAND } : undefined}
          >
            Segmen &amp; Sync Convia
          </button>
        </div>

        {toast && <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-800">{toast}</div>}

        {tab === "rules" && isAdmin ? (
          <div className="space-y-5">
            <Card title="Aturan Perpindahan Otomatis" subtitle="Hanya bergerak maju, tidak pernah mundur atau menyentuh Deal/Lost">
              <div className="space-y-2.5 text-xs">
                {[
                  { key: "form_to_cold", label: 'Isi form ("Data Form Klien") → pindah Lead Masuk ke Cold' },
                  { key: "reply_to_warm", label: "Pelanggan membalas lagi setelah sales membalas di Cold → pindah ke Warm sesuai MOQ" },
                  { key: "chat_count_to_warm", label: `Total bubble chat > ${chatThreshold} → pindah ke Warm sesuai MOQ` },
                  { key: "first_sales_reply_to_cold", label: "Balasan pertama sales → pindah Lead Masuk ke Cold (opsional)" },
                ].map((r) => (
                  <label key={r.key} className="flex items-center justify-between rounded-[8px] border border-slate-200 px-3.5 py-2.5 cursor-pointer">
                    <span className="font-medium text-[#212120]">{r.label}</span>
                    <input
                      type="checkbox"
                      checked={Boolean(rules[r.key])}
                      onChange={(e) => {
                        const next = { ...rules, [r.key]: e.target.checked };
                        setRules(next);
                        saveRules(next, chatThreshold);
                      }}
                    />
                  </label>
                ))}
              </div>
            </Card>

            <Card title="Trigger Frasa" subtitle='Beberapa frasa dipisah dengan "|", tidak peka huruf besar/kecil'>
              <div className="space-y-2 mb-4">
                {triggers.map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-[8px] border border-slate-200 px-3 py-2 text-xs">
                    <div>
                      <span className="font-semibold text-[#212120]">{t.label}</span>
                      <span className="ml-2 font-mono text-slate-500">{t.phrase}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Pill tone="brand">→ {stageLabel(t.target_stage)}</Pill>
                      <button
                        type="button"
                        onClick={async () => {
                          await fetch("/api/crm/automation", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ action: "delete_trigger", id: t.id }),
                          });
                          load();
                        }}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={addTrigger} className="flex flex-wrap gap-2">
                <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Label (mis. Siap bayar)" className="h-8 rounded-[6px] border border-slate-200 px-2.5 text-xs" required />
                <input value={newPhrase} onChange={(e) => setNewPhrase(e.target.value)} placeholder="Frasa (pisah dengan |)" className="h-8 flex-1 min-w-[200px] rounded-[6px] border border-slate-200 px-2.5 text-xs" required />
                <select value={newStage} onChange={(e) => setNewStage(e.target.value)} className="h-8 rounded-[6px] border border-slate-200 bg-white px-2 text-xs">
                  {PIPELINE_STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <button type="submit" className="inline-flex h-8 items-center gap-1 rounded-[6px] px-3 text-xs font-semibold text-white" style={{ background: BRAND }}>
                  <Plus className="h-3.5 w-3.5" /> Tambah
                </button>
              </form>
            </Card>

            <Card title="Coba Aturan (Simulasi)" subtitle="Uji hasil perpindahan stage & parser form tanpa mengubah data">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <select value={simStage} onChange={(e) => setSimStage(e.target.value)} className="h-8 w-full rounded-[6px] border border-slate-200 bg-white px-2 text-xs">
                    {PIPELINE_STAGES.map((s) => <option key={s.id} value={s.id}>Stage awal: {s.label}</option>)}
                  </select>
                  <textarea value={simText} onChange={(e) => setSimText(e.target.value)} rows={4} className="w-full rounded-[6px] border border-slate-200 p-2.5 font-mono text-xs" />
                  <button type="button" onClick={runSimulate} className="inline-flex h-8 items-center gap-1 rounded-[6px] px-3 text-xs font-semibold text-white" style={{ background: BRAND }}>
                    <Play className="h-3.5 w-3.5" /> Jalankan Simulasi
                  </button>
                </div>
                <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-3 text-xs space-y-2">
                  <div className="font-semibold text-slate-700">Hasil Simulasi:</div>
                  {simResult ? (
                    <>
                      <div>Stage tujuan: <strong>{simResult.simulation?.nextStage ? stageLabel(simResult.simulation.nextStage) : "Tetap (tidak berubah)"}</strong></div>
                      {simResult.simulation?.reason && <div className="text-slate-600">Alasan: {simResult.simulation.reason}</div>}
                      <pre className="rounded bg-white p-2 font-mono text-[11px] border border-slate-200">{JSON.stringify(simResult.parsedForm, null, 2)}</pre>
                    </>
                  ) : (
                    <div className="text-slate-400">Klik "Jalankan Simulasi" untuk melihat hasil.</div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <Card title="Segmen & Sinkron ke Convia" subtitle="Broadcast tetap dikirim dari Convia menggunakan tag crm-*">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <select value={segStage} onChange={(e) => setSegStage(e.target.value)} className="h-8 rounded-[6px] border border-slate-200 bg-white px-2 text-xs">
                <option value="all">Semua Stage</option>
                {PIPELINE_STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-700">
                <input type="checkbox" checked={segHasChat} onChange={(e) => setSegHasChat(e.target.checked)} />
                Hanya lead yang pernah chat (izin consent)
              </label>
              <input value={segName} onChange={(e) => setSegName(e.target.value)} placeholder="Nama segmen (mis. sample-nov)" className="h-8 rounded-[6px] border border-slate-200 px-2.5 text-xs" />
              <button type="button" onClick={syncToConvia} className="inline-flex h-8 items-center gap-1 rounded-[6px] px-3 text-xs font-semibold text-white" style={{ background: BRAND }}>
                <Send className="h-3.5 w-3.5" /> Sinkron ke Convia ({filteredContacts.length})
              </button>
              <button type="button" onClick={exportCsv} className="inline-flex h-8 items-center gap-1 rounded-[6px] border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700">
                <Download className="h-3.5 w-3.5" /> Ekspor CSV
              </button>
            </div>
            <div className="text-xs text-slate-500">
              Menampilkan <strong className="font-mono text-[#212120]">{filteredContacts.length}</strong> kontak cocok (opt-out dikecualikan otomatis).
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
