"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CalendarDays, Users } from "lucide-react";
import type { CrmUserInfo } from "@/lib/crm-stages";

export const SYSTEM_LAUNCH = "2026-10-06";

export function wibDate(offsetDays = 0): string {
  const t = new Date(Date.now() + 7 * 3600_000 + offsetDays * 86_400_000);
  return t.toISOString().slice(0, 10);
}

export const PRESETS = [
  { id: "today", label: "Hari Ini" },
  { id: "yesterday", label: "Kemarin" },
  { id: "7d", label: "7 Hari" },
  { id: "30d", label: "30 Hari" },
  { id: "since", label: "Sejak 06 Okt" },
] as const;

export function presetRange(id: string): { start: string; end: string } {
  switch (id) {
    case "yesterday":
      return { start: wibDate(-1), end: wibDate(-1) };
    case "7d":
      return { start: wibDate(-6), end: wibDate(0) };
    case "30d":
      return { start: wibDate(-29), end: wibDate(0) };
    case "since":
      return { start: SYSTEM_LAUNCH, end: wibDate(0) };
    default:
      return { start: wibDate(0), end: wibDate(0) };
  }
}

interface FilterState {
  preset: string;
  startDate: string;
  endDate: string;
  busdev: string;
}

interface FilterCtx extends FilterState {
  ready: boolean;
  applyPreset: (id: string) => void;
  setRange: (start: string, end: string) => void;
  setBusdev: (name: string) => void;
}

const FiltersContext = createContext<FilterCtx | null>(null);
const MeContext = createContext<CrmUserInfo | null>(null);

const STORE_KEY = "dl_monitor_filters_v1";

export function MonitorProviders({ user, children }: { user: CrmUserInfo; children: ReactNode }) {
  const [state, setState] = useState<FilterState>(() => ({ preset: "today", startDate: wibDate(0), endDate: wibDate(0), busdev: "all" }));
  const [ready, setReady] = useState(false);

  // Pulihkan pilihan terakhir (sesi tab ini) supaya pindah halaman tidak mereset rentang waktu dan sales.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as Partial<FilterState>;
        const valid = (d: unknown) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d);
        if (valid(s.startDate) && valid(s.endDate) && typeof s.busdev === "string" && typeof s.preset === "string") {
          // Preset relatif ("Hari Ini", "7 Hari") dihitung ulang supaya tidak basi bila tab dibiarkan terbuka semalam.
          if (s.preset !== "custom" && PRESETS.some((p) => p.id === s.preset)) {
            const r = presetRange(s.preset);
            setState({ preset: s.preset, startDate: r.start < SYSTEM_LAUNCH ? SYSTEM_LAUNCH : r.start, endDate: r.end, busdev: s.busdev });
          } else {
            setState({ preset: "custom", startDate: s.startDate!, endDate: s.endDate!, busdev: s.busdev });
          }
        }
      }
    } catch {
      /* penyimpanan tidak tersedia: pakai bawaan */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch {
      /* abaikan */
    }
  }, [state, ready]);

  const applyPreset = useCallback((id: string) => {
    const r = presetRange(id);
    setState((s) => ({ ...s, preset: id, startDate: r.start < SYSTEM_LAUNCH ? SYSTEM_LAUNCH : r.start, endDate: r.end }));
  }, []);
  const setRange = useCallback((start: string, end: string) => setState((s) => ({ ...s, preset: "custom", startDate: start, endDate: end })), []);
  const setBusdev = useCallback((name: string) => setState((s) => ({ ...s, busdev: name })), []);

  const value = useMemo<FilterCtx>(() => ({ ...state, ready, applyPreset, setRange, setBusdev }), [state, ready, applyPreset, setRange, setBusdev]);
  return (
    <MeContext.Provider value={user}>
      <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
    </MeContext.Provider>
  );
}

export function useFilters(): FilterCtx {
  const c = useContext(FiltersContext);
  if (!c) throw new Error("useFilters harus di dalam MonitorProviders");
  return c;
}

export function useMe(): CrmUserInfo {
  const c = useContext(MeContext);
  if (!c) throw new Error("useMe harus di dalam MonitorProviders");
  return c;
}

const inputCls =
  "h-9 rounded-lg border border-[#E5E2DA] bg-white px-2.5 text-xs font-medium text-slate-700 focus:border-[#D98A00] focus:outline-none focus:ring-2 focus:ring-[#D98A00]/20";

/** Bilah filter waktu (+ pilihan sales) yang sama di semua halaman. */
export function FilterToolbar({ busdevNames, showBusdev = true, right }: { busdevNames: string[]; showBusdev?: boolean; right?: ReactNode }) {
  const f = useFilters();
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#ECEAE4] bg-white p-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex items-center rounded-xl bg-slate-100 p-1">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => f.applyPreset(p.id)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition ${f.preset === p.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5 rounded-lg border border-[#E5E2DA] bg-white px-2.5 py-1">
        <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
        <input
          type="date"
          aria-label="Dari tanggal"
          min={SYSTEM_LAUNCH}
          max={f.endDate}
          value={f.startDate}
          onChange={(e) => f.setRange(e.target.value || SYSTEM_LAUNCH, f.endDate)}
          className="bg-transparent font-mono text-xs text-slate-800 focus:outline-none"
        />
        <span className="text-xs text-slate-400">s/d</span>
        <input
          type="date"
          aria-label="Sampai tanggal"
          min={f.startDate}
          max={wibDate(0)}
          value={f.endDate}
          onChange={(e) => f.setRange(f.startDate, e.target.value || wibDate(0))}
          className="bg-transparent font-mono text-xs text-slate-800 focus:outline-none"
        />
      </div>

      {showBusdev && (
        <div className="flex items-center gap-2 rounded-lg border border-[#E5E2DA] bg-white px-2.5">
          <Users className="h-3.5 w-3.5 text-slate-400" />
          <select aria-label="BusDev" value={f.busdev} onChange={(e) => f.setBusdev(e.target.value)} className={`${inputCls} border-0 bg-transparent px-0 focus:ring-0`}>
            <option value="all">Semua BusDev</option>
            {busdevNames.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}
      {right && <div className="ml-auto flex items-center gap-2">{right}</div>}
    </div>
  );
}
