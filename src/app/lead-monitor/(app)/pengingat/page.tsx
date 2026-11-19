"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BellRing, CheckCheck, Clock, MessageCircle } from "lucide-react";
import { Card, Empty, Pill } from "@/components/lead-monitor/ui";
import { useMe } from "@/components/lead-monitor/filters";
import { PIPELINE_STAGES, formatWaChatLink } from "@/lib/crm-stages";

type State = "overdue" | "today" | "upcoming";
interface Item {
  tracking_code: string;
  name: string;
  phone: string | null;
  pic: string | null;
  stage: string;
  produk: string | null;
  moq: number | null;
  last_activity_at: string | null;
  due_at: string;
  due_source: "otomatis" | "manual";
  state: State;
  interval_days: number;
  note: string | null;
  can_edit: boolean;
}
interface Payload {
  success: boolean;
  reminders: Item[];
  counts: { overdue: number; today: number; upcoming: number; total: number };
  pics: string[];
  error?: string;
}

const STATE_LABEL: Record<State, string> = { overdue: "Terlambat", today: "Hari ini", upcoming: "Mendatang" };
const STATE_TONE: Record<State, "red" | "amber" | "green"> = { overdue: "red", today: "amber", upcoming: "green" };
const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("id-ID", { timeZone: "Asia/Jakarta", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";
const fmtDay = (iso: string) => new Date(iso).toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", weekday: "short", day: "2-digit", month: "short", year: "numeric" });
const stageLabel = (id: string) => PIPELINE_STAGES.find((s) => s.id === id)?.label ?? id;
const wibInputDate = (iso: string) => new Date(new Date(iso).getTime() + 7 * 3_600_000).toISOString().slice(0, 10);

export default function PengingatPage() {
  const me = useMe();
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [state, setState] = useState<"all" | State>("all");
  const [stage, setStage] = useState<"all" | "warm" | "hot">("all");
  const [pic, setPic] = useState("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editNote, setEditNote] = useState("");

  const load = useCallback(async () => {
    try {
      const qs = me.role === "head" && pic !== "all" ? `?pic=${encodeURIComponent(pic)}` : "";
      const res = await fetch(`/api/crm/reminders${qs}`, { cache: "no-store" });
      const j: Payload = await res.json();
      if (!j.success) throw new Error(j.error || "Gagal memuat jadwal");
      setData(j);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Gagal memuat jadwal");
    }
  }, [me.role, pic]);

  useEffect(() => {
    load();
    const id = setInterval(() => document.visibilityState === "visible" && load(), 60_000);
    return () => clearInterval(id);
  }, [load]);

  const rows = useMemo(() => {
    const all = data?.reminders ?? [];
    return all.filter((r) => (state === "all" || r.state === state) && (stage === "all" || (stage === "hot" ? r.stage === "hot" : r.stage !== "hot")));
  }, [data, state, stage]);

  async function act(code: string, method: "POST" | "PATCH", payload: Record<string, unknown>, okMsg: string) {
    setBusy(code);
    setError(null);
    try {
      const res = await fetch("/api/crm/reminders", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tracking_code: code, ...payload }) });
      const j = await res.json();
      if (!j.success) throw new Error(j.error || "Gagal menyimpan");
      setInfo(okMsg);
      setEditing(null);
      await load();
    } catch (e: any) {
      setError(e?.message || "Gagal menyimpan");
    } finally {
      setBusy(null);
    }
  }

  const btn = "inline-flex h-8 items-center gap-1 rounded-md border border-[#E5E2DA] bg-white px-2.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50";
  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-xs font-semibold ${active ? "border-slate-900 bg-slate-900 text-white" : "border-[#E5E2DA] bg-white text-slate-600 hover:bg-slate-50"}`;

  return (
    <div>
      <header className="border-b border-[#ECEAE4] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center px-4 sm:px-6">
          <div>
            <h1 className="text-[17px] font-semibold leading-tight text-slate-900">Pengingat Follow-up</h1>
            <p className="text-xs text-slate-500">Jadwal follow-up lead di semua tahap Warm dan Hot{me.role === "head" ? " (semua PIC)" : ` milik ${me.name}`}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] space-y-5 px-4 py-6 sm:px-6">
        {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800">{error}</div>}
        {info && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">{info}</div>}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {([["overdue", "Terlambat", "text-rose-600"], ["today", "Hari ini", "text-amber-600"], ["upcoming", "Mendatang", "text-emerald-600"]] as const).map(([k, label, color]) => (
            <button key={k} onClick={() => setState(state === k ? "all" : k)} className={`rounded-xl border bg-white p-4 text-left ${state === k ? "border-slate-900" : "border-[#ECEAE4]"}`}>
              <div className="text-xs text-slate-500">{label}</div>
              <div className={`text-2xl font-semibold ${color}`}>{data?.counts[k] ?? "–"}</div>
            </button>
          ))}
          <div className="rounded-xl border border-[#ECEAE4] bg-white p-4">
            <div className="text-xs text-slate-500">Total lead Warm + Hot</div>
            <div className="text-2xl font-semibold text-slate-900">{data?.counts.total ?? "–"}</div>
          </div>
        </div>

        <Card
          title="Jadwal"
          subtitle="Warm: tindak lanjut 3 hari setelah percakapan terakhir. Hot: 1 hari. Jadwal maju sendiri bila ada pesan baru; Anda juga bisa menjadwalkan sendiri."
        >
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button className={chip(stage === "all")} onClick={() => setStage("all")}>Warm + Hot</button>
            <button className={chip(stage === "warm")} onClick={() => setStage("warm")}>Warm</button>
            <button className={chip(stage === "hot")} onClick={() => setStage("hot")}>Hot</button>
            {me.role === "head" && (
              <select value={pic} onChange={(e) => setPic(e.target.value)} className="ml-auto h-8 rounded-md border border-[#E5E2DA] bg-white px-2 text-xs" aria-label="Filter PIC">
                <option value="all">Semua PIC</option>
                {(data?.pics ?? []).map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            )}
          </div>

          {!data ? (
            <Empty>Memuat jadwal…</Empty>
          ) : rows.length === 0 ? (
            <Empty>Belum ada lead di tahap Warm / Hot untuk filter ini. Lead masuk ke Warm otomatis setelah 5 pesan dua arah, atau pindahkan dari Sales Pipeline.</Empty>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#ECEAE4] text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3">Lead</th>
                    <th className="py-2 pr-3">PIC</th>
                    <th className="py-2 pr-3">Tahap</th>
                    <th className="py-2 pr-3">Jadwal follow-up</th>
                    <th className="py-2 pr-3">Aktivitas terakhir</th>
                    <th className="py-2 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const wa = r.phone ? formatWaChatLink(r.phone, r.name, r.pic, r.produk) : null;
                    const isEditing = editing === r.tracking_code;
                    return (
                      <tr key={r.tracking_code} className="border-b border-[#F3F1EC] align-top">
                        <td className="py-3 pr-3">
                          <div className="font-semibold text-slate-900">{r.name}</div>
                          <div className="text-[11px] text-slate-500">{r.phone || "nomor belum ada"} · {r.tracking_code}</div>
                        </td>
                        <td className="py-3 pr-3 text-slate-700">{r.pic || "—"}</td>
                        <td className="py-3 pr-3"><Pill tone={r.stage === "hot" ? "red" : "amber"}>{stageLabel(r.stage)}</Pill></td>
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-1.5 text-slate-900"><BellRing size={14} className="text-slate-400" />{fmtDay(r.due_at)}</div>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <Pill tone={STATE_TONE[r.state]}>{STATE_LABEL[r.state]}</Pill>
                            <span className="text-[11px] text-slate-500">{r.due_source === "manual" ? "dijadwalkan manual" : `otomatis (${r.interval_days} hari)`}</span>
                          </div>
                          {r.note && <div className="mt-1 text-[11px] text-slate-600">“{r.note}”</div>}
                        </td>
                        <td className="py-3 pr-3 text-xs text-slate-600">{fmt(r.last_activity_at)}</td>
                        <td className="py-3 text-right">
                          {isEditing ? (
                            <div className="flex flex-col items-end gap-2">
                              <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="h-8 rounded-md border border-[#E5E2DA] px-2 text-xs" aria-label="Tanggal jadwal" />
                              <input value={editNote} onChange={(e) => setEditNote(e.target.value)} maxLength={300} placeholder="Catatan (opsional)" className="h-8 w-48 rounded-md border border-[#E5E2DA] px-2 text-xs" />
                              <div className="flex gap-1.5">
                                <button className={btn} disabled={busy === r.tracking_code || !editDate} onClick={() => act(r.tracking_code, "POST", { due_at: editDate, note: editNote }, "Jadwal disimpan")}>Simpan</button>
                                <button className={btn} onClick={() => setEditing(null)}>Batal</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-wrap justify-end gap-1.5">
                              {wa && <a className={btn} href={wa} target="_blank" rel="noreferrer"><MessageCircle size={13} />WA</a>}
                              {r.can_edit && (
                                <>
                                  <button className={btn} disabled={busy === r.tracking_code} onClick={() => act(r.tracking_code, "PATCH", { action: "done" }, `Follow-up ${r.name} dicatat; jadwal berikutnya dihitung ulang`)}><CheckCheck size={13} />Sudah follow-up</button>
                                  <button className={btn} disabled={busy === r.tracking_code} onClick={() => act(r.tracking_code, "PATCH", { action: "snooze", days: 1 }, "Ditunda 1 hari")}><Clock size={13} />Tunda 1 hari</button>
                                  <button className={btn} onClick={() => { setEditing(r.tracking_code); setEditDate(wibInputDate(r.due_at)); setEditNote(r.note || ""); }}>Jadwalkan</button>
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
