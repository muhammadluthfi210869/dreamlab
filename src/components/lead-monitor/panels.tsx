"use client";

import { formatWaChatLink } from "@/lib/crm-stages";
import { Card, Empty } from "./ui";

export interface TopLeadRow {
  id: number;
  name: string | null;
  phone: string;
  rawPhone?: string | null;
  product?: string | null;
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
          {rows.map((r, i) => {
            const waUrl = r.rawPhone ? formatWaChatLink(r.rawPhone, r.name, r.busdev, r.product) : null;
            return (
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
                {waUrl && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Balas chat langsung via WhatsApp"
                    className="inline-flex items-center gap-1 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 px-2 py-1 text-[11px] font-semibold text-[#128C7E] transition shrink-0 shadow-xs"
                  >
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.074-1.808-.412-1.428-.592-2.34-2.029-2.411-2.123-.07-.094-.576-.767-.576-1.464 0-.697.362-1.04.49-1.182.129-.143.282-.179.377-.179.094 0 .188.001.27.006.086.004.202-.033.315.24.116.282.399.974.433 1.045.035.07.058.153.012.247-.046.094-.07.153-.139.235-.07.082-.147.184-.21.247-.07.07-.144.146-.062.287.082.141.365.602.784.975.54.481.996.63 1.137.7.141.07.224.059.306-.035.083-.094.354-.412.448-.553.094-.141.189-.118.318-.07.13.047.824.388.966.459.141.07.236.106.271.165.035.059.035.341-.109.746z" />
                    </svg>
                    <span className="hidden sm:inline">Balas WA</span>
                  </a>
                )}
                <span
                  className="shrink-0 rounded-full bg-[#FFF4DC] px-2.5 py-1 font-mono text-xs font-semibold text-[#9A6200]"
                  title={r.chat ? "Sudah chat masuk" : "Belum chat"}
                >
                  {r.score}
                </span>
              </li>
            );
          })}
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
