"use client";

import type { ReactNode } from "react";
import { ArrowUpRight, Info, Minus } from "lucide-react";

/** Warna aksen Dreamlab. Hijau Convia diganti oranye ini. */
export const BRAND = "#D98A00";
export const BRAND_DARK = "#B87400";
export const BRAND_SOFT = "#FFF4DC";

export function Card({
  title,
  subtitle,
  right,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-[#ECEAE4] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ${className}`}>
      {(title || right) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-[15px] font-semibold text-slate-900">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
          </div>
          {right}
        </header>
      )}
      {children}
    </section>
  );
}

export function DeltaChip({ value, invert = false }: { value: number | null | undefined; invert?: boolean }) {
  if (value === null || value === undefined) {
    return <span className="text-[11px] text-slate-400">belum ada pembanding</span>;
  }
  if (value === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
        <Minus className="h-3 w-3" /> 0% vs periode lalu
      </span>
    );
  }
  // invert: untuk metrik yang naik = buruk (mis. drop-off)
  const good = invert ? value < 0 : value > 0;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${good ? "text-emerald-600" : "text-rose-600"}`}>
      <ArrowUpRight className={`h-3.5 w-3.5 ${value > 0 ? "" : "rotate-90"}`} />
      {Math.abs(value).toLocaleString("id-ID")}% <span className="font-normal text-slate-400">vs periode lalu</span>
    </span>
  );
}

export function KpiCard({
  label,
  icon,
  value,
  caption,
  delta,
  invertDelta,
  hint,
  tone = "default",
}: {
  label: string;
  icon: ReactNode;
  value: number | string;
  caption: string;
  delta?: number | null;
  invertDelta?: boolean;
  hint?: string;
  tone?: "default" | "brand";
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-[#ECEAE4] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex items-center justify-between text-slate-500">
        <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
          <span style={{ color: tone === "brand" ? BRAND : undefined }}>{icon}</span>
          {label}
        </span>
        {hint && (
          <span title={hint} className="cursor-help text-slate-300 hover:text-slate-500">
            <Info className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <div className="mt-3 text-[32px] font-semibold leading-none tracking-tight text-slate-900" style={tone === "brand" ? { color: BRAND_DARK } : undefined}>
        {typeof value === "number" ? value.toLocaleString("id-ID") : value}
      </div>
      <div className="mt-1.5 text-xs text-slate-500">{caption}</div>
      <div className="mt-4 border-t border-[#F1EFEA] pt-3">
        <DeltaChip value={delta} invert={invertDelta} />
      </div>
    </div>
  );
}

export function Pill({ children, tone = "slate" }: { children: ReactNode; tone?: "slate" | "brand" | "green" | "amber" | "red" }) {
  const map = {
    slate: "bg-slate-100 text-slate-600",
    brand: "bg-[#FFF4DC] text-[#9A6200]",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-rose-50 text-rose-700",
  } as const;
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${map[tone]}`}>{children}</span>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="flex h-full min-h-[120px] items-center justify-center text-center text-sm text-slate-400">{children}</div>;
}
