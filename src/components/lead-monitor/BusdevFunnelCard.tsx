"use client";

import type { BusdevChannelFunnel, ChannelFunnelMetrics } from "@/lib/lead-monitor-stats";

interface ChannelConfig {
  key: keyof Pick<BusdevChannelFunnel, "meta_ads" | "google_ads" | "google_organic" | "social_media">;
  label: string;
  dotColor: string;
  borderCls: string;
  badgeCls: string;
  barColor: string;
}

const CHANNELS: ChannelConfig[] = [
  {
    key: "meta_ads",
    label: "Meta Ads",
    dotColor: "bg-blue-600",
    borderCls: "border-blue-100",
    badgeCls: "bg-blue-50 text-blue-700 border border-blue-200",
    barColor: "bg-blue-500",
  },
  {
    key: "google_ads",
    label: "Google Ads",
    dotColor: "bg-emerald-600",
    borderCls: "border-emerald-100",
    badgeCls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    barColor: "bg-emerald-500",
  },
  {
    key: "google_organic",
    label: "Google (Organik / SEO)",
    dotColor: "bg-sky-600",
    borderCls: "border-sky-100",
    badgeCls: "bg-sky-50 text-sky-700 border border-sky-200",
    barColor: "bg-sky-500",
  },
  {
    key: "social_media",
    label: "Media Sosial (Organik)",
    dotColor: "bg-purple-600",
    borderCls: "border-purple-100",
    badgeCls: "bg-purple-50 text-purple-700 border border-purple-200",
    barColor: "bg-purple-500",
  },
];

export function BusdevFunnelCard({
  funnel,
  className = "",
  compact = false,
}: {
  funnel: BusdevChannelFunnel;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={`rounded-2xl border border-[#ECEAE4] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ${className}`}>
      {/* Header BusDev */}
      <div className="flex items-center justify-between border-b border-[#ECEAE4] pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D98A00] text-white text-xs font-bold shadow-xs">
            {funnel.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <div className="font-bold text-slate-900 text-sm leading-snug">{funnel.name}</div>
            <div className="text-[10px] text-slate-400">Tim Sales BusDev</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-xs font-bold text-slate-800">
            {funnel.totalTraffic} <span className="text-[10px] font-normal text-slate-400">lead</span>
          </div>
          <div className="text-[10px] font-bold text-amber-700 font-mono">
            {funnel.totalMoq} lolos MOQ
          </div>
        </div>
      </div>

      {/* Channels Funnel Grid */}
      <div className={compact ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5" : "space-y-2.5"}>
        {CHANNELS.map((ch) => {
          const m: ChannelFunnelMetrics = funnel[ch.key];
          return (
            <div
              key={ch.key}
              className={`rounded-xl border ${ch.borderCls} bg-white p-3 shadow-xs transition hover:border-[#D98A00]/40`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${ch.dotColor}`} />
                  <span className="truncate">{ch.label}</span>
                </span>
                <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full ${ch.badgeCls}`}>
                  {m.traffic > 0 ? `${m.moqRate}% lolos` : "0% lolos"}
                </span>
              </div>

              {/* 3 Step Boxes: TRAFFIC >> MOQ >= 500 >> SAMPLE */}
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="rounded-lg bg-[#F5F8FA] border border-slate-100 p-2">
                  <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Traffic</div>
                  <div className="font-mono text-sm font-bold text-slate-900 mt-0.5">{m.traffic}</div>
                </div>
                <div className="rounded-lg bg-[#FFF9F0] border border-amber-100/80 p-2">
                  <div className="text-[9px] font-semibold text-[#B45309] uppercase tracking-wider">MOQ &ge;500</div>
                  <div className="font-mono text-sm font-bold text-[#B45309] mt-0.5">{m.moq}</div>
                </div>
                <div className="rounded-lg bg-[#F0FAF5] border border-emerald-100/80 p-2">
                  <div className="text-[9px] font-semibold text-[#15803D] uppercase tracking-wider">Sample</div>
                  <div className="font-mono text-sm font-bold text-[#15803D] mt-0.5">{m.sample}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2.5 flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`${ch.barColor} transition-all`}
                  style={{ width: `${m.traffic > 0 ? Math.min(100, (m.traffic / (funnel.totalTraffic || 1)) * 100) : 0}%` }}
                  title={`Traffic: ${m.traffic}`}
                />
                <div
                  className="bg-amber-500 transition-all"
                  style={{ width: `${m.traffic > 0 ? Math.min(100, (m.moq / m.traffic) * 100) : 0}%` }}
                  title={`MOQ: ${m.moq}`}
                />
                <div
                  className="bg-emerald-500 transition-all"
                  style={{ width: `${m.moq > 0 ? Math.min(100, (m.sample / m.moq) * 100) : 0}%` }}
                  title={`Sample: ${m.sample}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
