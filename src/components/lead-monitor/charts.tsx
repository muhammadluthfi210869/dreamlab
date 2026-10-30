"use client";

import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BRAND, BRAND_DARK, Empty, Pill } from "./ui";

export interface DayPoint {
  date: string;
  klik: number;
  chat: number;
  dropoff: number;
}
export interface BusdevRow {
  name: string;
  chat: number;
  dropoff: number;
  direct: number;
  clicks: number;
  share: number;
}
export interface GroupRow {
  key: string;
  klik: number;
  chat: number;
  dropoff: number;
}
export interface FairnessInfo {
  level: "merata" | "agak-timpang" | "timpang" | "belum-ada-data";
  spread: number;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
export function shortDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${parseInt(d, 10)} ${MONTHS[parseInt(m, 10) - 1]}`;
}

const AXIS = { fontSize: 11, fill: "#94A3B8" } as const;

function TooltipBox({ active, payload, label, labelFormatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[#ECEAE4] bg-white px-3 py-2 text-xs shadow-lg">
      <div className="mb-1 font-semibold text-slate-800">{labelFormatter ? labelFormatter(label) : label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-slate-600">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.stroke }} />
          {p.name}: <b className="text-slate-900">{p.value}</b>
        </div>
      ))}
    </div>
  );
}

export interface HourPoint {
  hour: number;
  klik: number;
  chat: number;
}

/**
 * Tren lead. Rentang >= 2 hari: per hari. Rentang 1 hari: per jam (WIB), supaya "Hari Ini" tetap
 * menampilkan garis yang bermakna dan bukan satu titik.
 */
export function TrendChart({ data, hourly }: { data: DayPoint[]; hourly?: HourPoint[] }) {
  const singleDay = data.length === 1 && !!hourly;
  const series: { x: string | number; klik: number; chat: number }[] = singleDay
    ? hourly!.map((h) => ({ x: h.hour, klik: h.klik, chat: h.chat }))
    : data.map((d) => ({ x: d.date, klik: d.klik, chat: d.chat }));
  const total = series.reduce((a, d) => a + d.klik, 0);
  if (!series.length || total === 0) return <Empty>Belum ada lead pada periode ini.</Empty>;
  const fmt = singleDay ? (h: number) => `${String(h).padStart(2, "0")}.00` : (d: string) => shortDate(d);
  return (
    <div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={series} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="gChat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BRAND} stopOpacity={0.28} />
                <stop offset="100%" stopColor={BRAND} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#F1EFEA" vertical={false} />
            <XAxis dataKey="x" tickFormatter={fmt as any} tick={AXIS} tickLine={false} axisLine={false} minTickGap={24} />
            <YAxis allowDecimals={false} tick={AXIS} tickLine={false} axisLine={false} />
            <Tooltip content={<TooltipBox labelFormatter={singleDay ? (h: number) => `Pukul ${fmt(h as never)} WIB` : fmt} />} />
            <Line type="monotone" dataKey="klik" name="Total klik" stroke="#CBD5E1" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="chat" name="Chat masuk" stroke={BRAND} strokeWidth={2.5} fill="url(#gChat)" dot={false} activeDot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center justify-center gap-5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: BRAND }} /> Chat masuk
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-300" /> Total klik
        </span>
        <span className="text-slate-400">{singleDay ? "per jam (WIB)" : "per hari"}</span>
      </div>
    </div>
  );
}

export function HourChart({ data }: { data: { hour: number; chat: number }[] }) {
  if (data.every((d) => d.chat === 0)) return <Empty>Belum ada chat masuk.</Empty>;
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
          <CartesianGrid stroke="#F1EFEA" vertical={false} />
          <XAxis dataKey="hour" tickFormatter={(h) => `${String(h).padStart(2, "0")}`} tick={AXIS} tickLine={false} axisLine={false} interval={2} />
          <YAxis allowDecimals={false} tick={AXIS} tickLine={false} axisLine={false} />
          <Tooltip cursor={{ fill: "#FFF4DC" }} content={<TooltipBox labelFormatter={(h: number) => `Pukul ${String(h).padStart(2, "0")}.00 WIB`} />} />
          <Bar dataKey="chat" name="Chat masuk" fill={BRAND} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const FAIR_LABEL: Record<FairnessInfo["level"], { text: string; tone: "green" | "amber" | "red" | "slate" }> = {
  merata: { text: "Merata", tone: "green" },
  "agak-timpang": { text: "Agak timpang", tone: "amber" },
  timpang: { text: "Timpang", tone: "red" },
  "belum-ada-data": { text: "Data belum cukup", tone: "slate" },
};

export function FairnessPill({ fairness }: { fairness: FairnessInfo }) {
  const f = FAIR_LABEL[fairness.level];
  return (
    <span title={fairness.level === "belum-ada-data" ? "Perlu minimal 8 chat masuk" : `Selisih porsi chat terbesar dan terkecil: ${fairness.spread} poin`}>
      <Pill tone={f.tone}>{f.text}</Pill>
    </span>
  );
}

/** Batang ke samping: chat masuk (oranye) ditambah drop-off (abu muda) = total klik per sales. */
export function BusdevBars({
  rows,
  selected,
  onSelect,
}: {
  rows: BusdevRow[];
  selected: string;
  onSelect: (name: string) => void;
}) {
  const max = Math.max(1, ...rows.map((r) => r.clicks));
  if (!rows.length) return <Empty>Belum ada data sales.</Empty>;
  return (
    <div className="space-y-3.5">
      {rows.map((r) => {
        const active = selected.toLowerCase() === r.name.toLowerCase();
        return (
          <button
            key={r.name}
            type="button"
            onClick={() => onSelect(active ? "all" : r.name)}
            className={`block w-full rounded-xl px-2 py-1.5 text-left transition ${active ? "bg-[#FFF4DC] ring-1 ring-[#D98A00]/40" : "hover:bg-slate-50"}`}
            title={active ? "Klik lagi untuk melepas filter" : `Filter ke ${r.name}`}
          >
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span className="font-semibold text-slate-800">{r.name}</span>
              <span className="font-mono text-xs text-slate-500">
                <b className="text-[#B87400]">{r.chat}</b> chat · {r.clicks} klik · {r.share}%
              </span>
            </div>
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full" style={{ width: `${(r.chat / max) * 100}%`, background: BRAND }} />
              <div className="h-full bg-[#F3DDB0]" style={{ width: `${(r.dropoff / max) * 100}%` }} />
            </div>
            {r.direct > 0 && <div className="mt-1 text-[11px] text-slate-400">+{r.direct} chat langsung (tanpa klik)</div>}
          </button>
        );
      })}
      <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm" style={{ background: BRAND }} /> Chat masuk
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-[#F3DDB0]" /> Drop-off
        </span>
      </div>
    </div>
  );
}

/** Daftar batang ke samping untuk sumber / halaman. */
export function HBarList({ rows, empty }: { rows: GroupRow[]; empty: string }) {
  const max = Math.max(1, ...rows.map((r) => r.klik));
  if (!rows.length) return <Empty>{empty}</Empty>;
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.key}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
            <span className="truncate font-medium text-slate-700" title={r.key}>
              {r.key}
            </span>
            <span className="shrink-0 font-mono text-slate-500">
              <b style={{ color: BRAND_DARK }}>{r.chat}</b> / {r.klik}
            </span>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full" style={{ width: `${(r.chat / max) * 100}%`, background: BRAND }} />
            <div className="h-full bg-[#F3DDB0]" style={{ width: `${(r.dropoff / max) * 100}%` }} />
          </div>
        </li>
      ))}
      <li className="pt-1 text-[11px] text-slate-400">Angka: chat masuk / total klik</li>
    </ul>
  );
}
