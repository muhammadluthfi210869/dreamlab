"use client";

import { Card, Empty, Pill } from "./ui";

export interface TopLeadRow {
  id: number;
  name: string | null;
  phone: string;
  tier: string | null;
  quantity: number | null;
  busdev: string | null;
  score: number;
  chat: boolean;
}

export interface HealthRowData {
  name: string;
  isActive: boolean;
  lastChatAt: string | null;
  chatsToday: number;
  level: "sehat" | "perhatian" | "tidak-aktif" | "di-luar-jam-kerja" | "nonaktif";
  minutesSinceChat: number | null;
}

export function ago(minutes: number | null): string {
  if (minutes === null) return "belum pernah";
  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes} mnt lalu`;
  const h = Math.floor(minutes / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

export function TopLeadsCard({ rows }: { rows: TopLeadRow[] }) {
  return (
    <Card title="Top Leads" subtitle="Prospek dengan skor tertinggi pada periode ini">
      {rows.length === 0 ? (
        <Empty>Belum ada lead berkualitas.</Empty>
      ) : (
        <ol className="space-y-3">
          {rows.map((r, i) => (
            <li key={r.id} className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-slate-900">{r.name || r.phone}</div>
                <div className="truncate text-xs text-slate-500">
                  {r.name ? `${r.phone} · ` : ""}
                  {r.tier ? `${r.tier}${r.quantity ? ` (${r.quantity.toLocaleString("id-ID")} pcs)` : ""}` : "Tier belum diisi"}
                  {r.busdev ? ` · ${r.busdev}` : ""}
                </div>
              </div>
              <span
                className="shrink-0 rounded-full bg-[#FFF4DC] px-2.5 py-1 font-mono text-xs font-semibold text-[#9A6200]"
                title={r.chat ? "Sudah chat masuk" : "Belum chat"}
              >
                {r.score}
              </span>
            </li>
          ))}
        </ol>
      )}
      <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
        Skor maks. 100: tier produksi (10–40), sudah chat (+30), isi form (+10), chat &lt; 1 jam setelah klik (+10), masuk &lt; 24 jam (+10).
      </p>
    </Card>
  );
}

const HEALTH: Record<HealthRowData["level"], { text: string; tone: "green" | "amber" | "red" | "slate"; dot: string }> = {
  sehat: { text: "Sehat", tone: "green", dot: "bg-emerald-500" },
  perhatian: { text: "Perlu dicek", tone: "amber", dot: "bg-amber-500" },
  "tidak-aktif": { text: "Tidak ada chat", tone: "red", dot: "bg-rose-500" },
  "di-luar-jam-kerja": { text: "Di luar jam kerja", tone: "slate", dot: "bg-slate-300" },
  nonaktif: { text: "Nonaktif", tone: "slate", dot: "bg-slate-300" },
};

const RR_LABEL: Record<string, string> = {
  sequential: "Giliran berurutan",
  shadow: "Mode bayangan",
  confirmed_balance: "Berdasarkan chat masuk",
};

export function HealthCard({ rows, rrMode }: { rows: HealthRowData[]; rrMode: string | null }) {
  return (
    <Card
      title="Kesehatan Nomor WhatsApp"
      subtitle="Chat terakhir yang tertangkap sistem, per sales"
      right={rrMode ? <Pill tone="brand">{RR_LABEL[rrMode] ?? rrMode}</Pill> : undefined}
    >
      {rows.length === 0 ? (
        <Empty>Belum ada sales aktif.</Empty>
      ) : (
        <ul className="divide-y divide-[#F1EFEA]">
          {rows.map((r) => {
            const h = HEALTH[r.level];
            return (
              <li key={r.name} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${h.dot}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-900">{r.name}</div>
                  <div className="text-xs text-slate-500">
                    Chat terakhir {ago(r.minutesSinceChat)} · hari ini {r.chatsToday}
                  </div>
                </div>
                <Pill tone={h.tone}>{h.text}</Pill>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
        &ldquo;Tidak ada chat&rdquo; berarti belum ada chat berkode tertangkap lebih dari 24 jam: cek koneksi WhatsApp nomor itu. Penilaian jam dijeda 21.00–08.00 WIB.
      </p>
    </Card>
  );
}
