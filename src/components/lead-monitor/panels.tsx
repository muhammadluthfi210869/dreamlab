"use client";

import { Card, Empty } from "./ui";

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

export interface ReferrerRankRow {
  key: string;
  label: string;
  kind: "artikel" | "landing" | "beranda" | "situs" | "eksternal" | "langsung";
  klik: number;
  chat: number;
  rate: number;
}

const KIND_LABEL: Record<ReferrerRankRow["kind"], string> = {
  artikel: "Artikel",
  landing: "Halaman web",
  beranda: "Beranda",
  situs: "Halaman web",
  eksternal: "Situs luar",
  langsung: "Langsung",
};

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

export const RR_LABEL: Record<string, string> = {
  sequential: "Giliran berurutan",
  shadow: "Mode bayangan",
  confirmed_balance: "Berdasarkan chat masuk",
};

/** Peringkat halaman asal: mana yang benar-benar menghasilkan chat, bukan sekadar klik. */
export function ReferrerCard({ rows }: { rows: ReferrerRankRow[] }) {
  const max = Math.max(1, ...rows.map((r) => r.klik));
  return (
    <Card title="Artikel & Halaman Penyumbang Chat" subtitle="Halaman asal teratas, urut dari chat terbanyak">
      {rows.length === 0 ? (
        <Empty>Belum ada data halaman asal pada periode ini.</Empty>
      ) : (
        <ol className="space-y-3.5">
          {rows.map((r, i) => (
            <li key={r.key}>
              <div className="mb-1 flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-500">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-slate-900" title={r.label}>
                    {r.label}
                  </div>
                  <div className="text-[11px] text-slate-400">{KIND_LABEL[r.kind]}</div>
                </div>
                <div className="shrink-0 text-right font-mono text-xs text-slate-500">
                  <b className="text-[#B87400]">{r.chat}</b> chat / {r.klik} klik
                  <div className={r.klik >= 10 && r.rate < 5 ? "text-rose-600" : "text-slate-400"}>{r.rate.toLocaleString("id-ID")}% jadi chat</div>
                </div>
              </div>
              <div className="ml-9 flex h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-[#D98A00]" style={{ width: `${(r.chat / max) * 100}%` }} />
                <div className="h-full bg-[#F3DDB0]" style={{ width: `${((r.klik - r.chat) / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ol>
      )}
      <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
        Merah = sudah 10 klik lebih tetapi kurang dari 5% yang chat: halaman ramai namun tidak menghasilkan prospek.
      </p>
    </Card>
  );
}
