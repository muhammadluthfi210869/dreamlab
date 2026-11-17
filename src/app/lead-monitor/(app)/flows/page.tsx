"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Layers, Play, Plus, Save, Trash2 } from "lucide-react";
import { BRAND, Card, Pill } from "@/components/lead-monitor/ui";
import { useMe } from "@/components/lead-monitor/filters";
import { isAdminRole } from "@/lib/crm-stages";

const STEP_TYPES = [
  { type: "send_wa", label: "Kirim pesan WA" },
  { type: "wait", label: "Tunggu (jam/hari)" },
  { type: "check_reply", label: "Cek balasan pelanggan" },
  { type: "move_stage", label: "Pindah stage" },
  { type: "add_tag", label: "Tambah tag" },
  { type: "create_task", label: "Buat tugas untuk sales" },
  { type: "notify", label: "Notifikasi sales / admin" },
] as const;

export default function FlowsPage() {
  const me = useMe();
  const isAdmin = isAdminRole(me.role);
  const [flows, setFlows] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [newFlowName, setNewFlowName] = useState("");
  const [simOutput, setSimOutput] = useState<string[] | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/crm/flows", { cache: "no-store" });
    if (res.status === 401) {
      window.location.href = "/lead-monitor/masuk";
      return;
    }
    const j = await res.json().catch(() => ({}));
    if (res.ok && j.success) {
      setFlows(j.flows || []);
      if (!selectedId && j.flows?.length > 0) {
        setSelectedId(j.flows[0].id);
        setSteps(j.flows[0].steps || []);
      } else if (selectedId) {
        const cur = (j.flows || []).find((f: any) => f.id === selectedId);
        if (cur) setSteps(cur.steps || []);
      }
    }
  }, [selectedId]);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-[10px] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">
          Halaman Flow Journey hanya dapat diakses oleh Admin.
        </div>
      </main>
    );
  }

  const selectedFlow = flows.find((f) => f.id === selectedId) || null;

  const toggleFlow = async (f: any) => {
    await fetch("/api/crm/flows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle", id: f.id, is_active: !f.is_active }),
    });
    load();
  };

  const saveSteps = async () => {
    if (!selectedFlow) return;
    await fetch("/api/crm/flows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save_steps", id: selectedFlow.id, steps }),
    });
    setToast("Langkah flow disimpan");
    setTimeout(() => setToast(null), 3000);
    load();
  };

  const addStep = (type: string) => {
    setSteps((prev) => [
      ...prev,
      {
        type,
        config:
          type === "send_wa"
            ? { message: "Halo {nama}, bagaimana kelanjutan rencana maklon {produk}?" }
            : type === "wait"
              ? { amount: 24, unit: "hours" }
              : {},
      },
    ]);
  };

  const moveStep = (idx: number, delta: -1 | 1) => {
    const next = [...steps];
    const target = idx + delta;
    if (target < 0 || target >= next.length) return;
    const [m] = next.splice(idx, 1);
    next.splice(target, 0, m);
    setSteps(next);
  };

  const runSimulation = () => {
    const out: string[] = [];
    let hourOffset = 0;
    steps.forEach((s, i) => {
      if (s.type === "wait") {
        const hrs = s.config?.unit === "days" ? Number(s.config?.amount || 1) * 24 : Number(s.config?.amount || 1);
        hourOffset += hrs;
        out.push(`Langkah ${i + 1}: Tunggu ${hrs} jam (T+${hourOffset}j)`);
      } else {
        out.push(`Langkah ${i + 1} (T+${hourOffset}j): ${STEP_TYPES.find((t) => t.type === s.type)?.label || s.type}`);
      }
    });
    setSimOutput(out.length > 0 ? out : ["Belum ada langkah di flow ini."]);
  };

  return (
    <div>
      <header className="border-b border-[#E2E6ED] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6">
          <div>
            <h1 className="text-[17px] font-semibold text-[#212120]">Flow Journey</h1>
            <p className="text-xs text-slate-500">Otomasi perjalanan pelanggan (editor langkah vertikal, jam kirim 08:00–20:00 WIB, opt-out STOP)</p>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!newFlowName.trim()) return;
              await fetch("/api/crm/flows", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "create", name: newFlowName }),
              });
              setNewFlowName("");
              load();
            }}
            className="flex items-center gap-2"
          >
            <input value={newFlowName} onChange={(e) => setNewFlowName(e.target.value)} placeholder="Nama flow baru..." className="h-8 rounded-[6px] border border-slate-200 px-2.5 text-xs" />
            <button type="submit" className="inline-flex h-8 items-center gap-1 rounded-[6px] px-3 text-xs font-semibold text-white" style={{ background: BRAND }}>
              <Plus className="h-3.5 w-3.5" /> Buat Flow
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] space-y-5 px-4 py-6 sm:px-6">
        {toast && <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-800">{toast}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Daftar Flow */}
          <div className="lg:col-span-5 space-y-2.5">
            {flows.map((f) => (
              <div
                key={f.id}
                onClick={() => {
                  setSelectedId(f.id);
                  setSteps(f.steps || []);
                  setSimOutput(null);
                }}
                className={`cursor-pointer rounded-[10px] border bg-white p-4 transition ${
                  selectedId === f.id ? "border-[#F39200] ring-1 ring-[#F39200]/30" : "border-[#E2E6ED] hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#1F6FB2]" />
                    <span className="text-sm font-semibold text-[#212120]">{f.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFlow(f);
                    }}
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      f.is_active ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {f.is_active ? "AKTIF" : "MATI"}
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                  <span>{f.steps?.length || 0} langkah</span>
                  <span>·</span>
                  <span>Berjalan: <strong className="font-mono text-[#212120]">{f.running_count}</strong></span>
                  <span>·</span>
                  <span>Selesai: <strong className="font-mono text-emerald-700">{f.done_count}</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Editor Langkah Vertikal */}
          <div className="lg:col-span-7">
            {selectedFlow ? (
              <Card
                title={`Editor: ${selectedFlow.name}`}
                subtitle={`Pemicu: ${selectedFlow.trigger?.type || "custom"} · Batas maks 3 pesan flow / 24 jam · Jam kirim 08:00–20:00 WIB`}
              >
                <div className="space-y-3">
                  {steps.length === 0 ? (
                    <div className="rounded-[8px] border border-dashed border-slate-200 py-8 text-center text-xs text-slate-400">
                      Belum ada langkah. Tambahkan langkah pertama di bawah ini.
                    </div>
                  ) : (
                    steps.map((s, idx) => (
                      <div key={idx} className="rounded-[8px] border border-slate-200 bg-slate-50/70 p-3 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#212120]">
                            {idx + 1}. {STEP_TYPES.find((t) => t.type === s.type)?.label || s.type}
                          </span>
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => moveStep(idx, -1)} className="rounded border border-slate-200 bg-white p-1 text-slate-500"><ChevronUp className="h-3 w-3" /></button>
                            <button type="button" onClick={() => moveStep(idx, 1)} className="rounded border border-slate-200 bg-white p-1 text-slate-500"><ChevronDown className="h-3 w-3" /></button>
                            <button type="button" onClick={() => setSteps(steps.filter((_, i) => i !== idx))} className="rounded border border-slate-200 bg-white p-1 text-rose-500"><Trash2 className="h-3 w-3" /></button>
                          </div>
                        </div>
                        {s.type === "send_wa" && (
                          <textarea
                            value={s.config?.message || ""}
                            onChange={(e) => {
                              const next = [...steps];
                              next[idx] = { ...s, config: { ...s.config, message: e.target.value } };
                              setSteps(next);
                            }}
                            rows={2}
                            placeholder="Gunakan variabel {nama} {sales} {produk} {brand}"
                            className="w-full rounded-[6px] border border-slate-200 bg-white p-2 text-xs"
                          />
                        )}
                        {s.type === "wait" && (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={1}
                              value={s.config?.amount || 24}
                              onChange={(e) => {
                                const next = [...steps];
                                next[idx] = { ...s, config: { ...s.config, amount: Number(e.target.value) } };
                                setSteps(next);
                              }}
                              className="h-7 w-20 rounded border border-slate-200 bg-white px-2 font-mono text-xs"
                            />
                            <select
                              value={s.config?.unit || "hours"}
                              onChange={(e) => {
                                const next = [...steps];
                                next[idx] = { ...s, config: { ...s.config, unit: e.target.value } };
                                setSteps(next);
                              }}
                              className="h-7 rounded border border-slate-200 bg-white px-2 text-xs"
                            >
                              <option value="minutes">Menit</option>
                              <option value="hours">Jam</option>
                              <option value="days">Hari</option>
                            </select>
                          </div>
                        )}
                      </div>
                    ))
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {STEP_TYPES.map((st) => (
                      <button
                        key={st.type}
                        type="button"
                        onClick={() => addStep(st.type)}
                        className="rounded-[6px] border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                      >
                        + {st.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 border-t border-slate-200 pt-3">
                    <button type="button" onClick={saveSteps} className="inline-flex h-8 items-center gap-1 rounded-[6px] px-3 text-xs font-semibold text-white" style={{ background: BRAND }}>
                      <Save className="h-3.5 w-3.5" /> Simpan Langkah
                    </button>
                    <button type="button" onClick={runSimulation} className="inline-flex h-8 items-center gap-1 rounded-[6px] border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700">
                      <Play className="h-3.5 w-3.5" /> Simulasi
                    </button>
                  </div>

                  {simOutput && (
                    <div className="rounded-[8px] border border-blue-200 bg-blue-50/50 p-3 text-xs space-y-1">
                      <div className="font-semibold text-[#1F6FB2]">Pratinjau Simulasi:</div>
                      {simOutput.map((line, i) => (
                        <div key={i} className="font-mono text-[11px] text-slate-700">{line}</div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
