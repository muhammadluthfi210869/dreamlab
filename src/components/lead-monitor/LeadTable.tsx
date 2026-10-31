"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronRight, Copy, Download, Edit3, Search } from "lucide-react";
import { canEditLead, formatWaChatLink, PIPELINE_STAGES, stageLabel, type CrmUserInfo } from "@/lib/crm-stages";
import { BRAND, Card, Pill } from "./ui";

export interface TableRow {
  id: number;
  tracking_code: string;
  assigned_to: string | null;
  busdevs?: string[];
  source: string | null;
  /** Halaman tujuan (tempat lead dibuat), mis. /thankyou/google. */
  page_url: string | null;
  /** Halaman asal: judul artikel, path halaman sendiri, atau nama situs luar. */
  referrer_label?: string | null;
  referrer_kind?: "artikel" | "landing" | "beranda" | "situs" | "eksternal" | "langsung";
  referrer_path?: string | null;
  status: string | null;
  nama: string | null;
  wa_profile_name: string | null;
  display_phone: string | null;
  phone_from: "WA" | "Form" | null;
  phone_country_iso2: string | null;
  whatsapp_phone_e164: string | null;
  produk: string | null;
  utm_campaign: string | null;
  is_form_lead: boolean;
  production_tier_name: string | null;
  requested_quantity_pcs: number | null;
  inquiry_reference: string | null;
  created_at: string;
  confirmed_at: string | null;
  latency_seconds: number | null;
  duplicate_count?: number;
  merged_tracking_codes?: string[];
  /** Semua kode klik prospek ini (utama + gabungan 24 jam); dikirim saat menyimpan isian CRM. */
  codes?: string[];
  crm_stage?: string;
  produk_manual?: string | null;
  moq_manual?: number | null;
  note?: string | null;
}

export interface TableData {
  rows: TableRow[];
  total: number;
  page: number;
  pages: number;
  pageSize: number;
  tabCounts: { chat: number; dropoff: number; all: number; direct: number };
  sources: string[];
  tiers: string[];
}

export type Tab = "chat" | "dropoff" | "all" | "direct";
export type SortKey = "time" | "name" | "busdev" | "product" | "quantity" | "chat_time";

export interface TableState {
  tab: Tab;
  kind: "all" | "form" | "click";
  tier: string;
  moq: "all" | "met" | "below";
  source: string;
  search: string;
  stage: string;
  page: number;
  pageSize: number;
  sort: SortKey;
  dir: "asc" | "desc";
}

export const MOQ_PCS = 500;

/** Perubahan yang bisa disimpan dari tabel. Mengembalikan pesan galat, atau null bila berhasil. */
export type RowPatch = { produk_manual?: string | null; moq_manual?: number | null; stage?: string };
export type PatchHandler = (row: TableRow, patch: RowPatch) => Promise<string | null>;

const REFERRER_KIND_LABEL: Record<NonNullable<TableRow["referrer_kind"]>, string> = {
  artikel: "Artikel",
  landing: "Halaman web",
  beranda: "Beranda",
  situs: "Halaman web",
  eksternal: "Situs luar",
  langsung: "Langsung",
};

const wibTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "—";
const wibDay = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", day: "numeric", month: "short" }) : "—";

export function formatLatency(s: number | null | undefined): string {
  if (s === null || s === undefined) return "—";
  if (s < 60) return `${s} dtk`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} mnt${s % 60 ? ` ${s % 60} dtk` : ""}`;
  const h = Math.floor(m / 60);
  return `${h} j ${m % 60} mnt`;
}

function csvCell(v: unknown): string {
  let s = v === null || v === undefined ? "" : String(v);
  // Cegah injeksi rumus saat dibuka di Excel / Sheets.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export function rowsToCsv(rows: TableRow[]): string {
  const head = ["Waktu Klik (WIB)", "Nama", "Nomor", "Produk", "Tier", "Pcs", "MOQ", "Tahap Pipeline", "Catatan", "BusDev", "Status", "Waktu Chat (WIB)", "Latency (detik)", "Kode", "Halaman Asal", "Halaman Tujuan", "Sumber", "Kampanye"];
  const body = rows.map((r) => {
    const qty = r.moq_manual ?? r.requested_quantity_pcs;
    const status = r.source === "wa-direct" ? "Chat langsung" : r.status === "confirmed" ? "Chat masuk" : "Drop-off";
    return [
      new Date(r.created_at).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
      r.nama || r.wa_profile_name,
      r.display_phone,
      r.produk_manual || r.produk,
      r.production_tier_name,
      qty,
      qty ? (qty >= MOQ_PCS ? "Memenuhi" : "Di bawah") : "",
      stageLabel(r.crm_stage),
      r.note,
      r.assigned_to,
      status,
      r.confirmed_at ? new Date(r.confirmed_at).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) : "",
      r.latency_seconds,
      r.tracking_code,
      r.referrer_label,
      r.page_url,
      r.source,
      r.utm_campaign,
    ]
      .map(csvCell)
      .join(",");
  });
  return "﻿" + [head.map(csvCell).join(","), ...body].join("\r\n");
}

function SortHead({ label, k, state, onSort, className = "" }: { label: string; k: SortKey; state: TableState; onSort: (k: SortKey) => void; className?: string }) {
  const active = state.sort === k;
  return (
    <th className={`px-4 py-3 ${className}`}>
      <button type="button" onClick={() => onSort(k)} className={`inline-flex items-center gap-1 font-semibold uppercase tracking-wide ${active ? "text-slate-900" : "text-slate-500 hover:text-slate-800"}`}>
        {label}
        <ChevronDown className={`h-3 w-3 ${active ? (state.dir === "asc" ? "rotate-180" : "") : "opacity-30"}`} style={active ? { color: BRAND } : undefined} />
      </button>
    </th>
  );
}

/** Sel yang bisa diklik untuk diisi. Hanya pemilik lead (atau Head) yang melihat tombol edit. */
function InlineEdit({
  value,
  display,
  numeric,
  placeholder,
  canEdit,
  onSave,
  maxLength,
}: {
  value: string | number | null;
  display?: React.ReactNode;
  numeric?: boolean;
  placeholder: string;
  canEdit: boolean;
  onSave: (v: string | null) => Promise<string | null>;
  maxLength?: number;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const current = value === null || value === undefined ? "" : String(value);

  const start = () => {
    if (!canEdit) return;
    setDraft(current);
    setErr(null);
    setEditing(true);
  };
  const commit = async () => {
    const v = (numeric ? draft.replace(/[^\d]/g, "") : draft).trim();
    if (v === current) return setEditing(false);
    setBusy(true);
    const e = await onSave(v === "" ? null : v);
    setBusy(false);
    if (e) setErr(e);
    else setEditing(false);
  };

  if (editing) {
    return (
      <div>
        <input
          autoFocus
          value={draft}
          inputMode={numeric ? "numeric" : undefined}
          maxLength={maxLength}
          disabled={busy}
          onChange={(e) => setDraft(numeric ? e.target.value.replace(/[^\d]/g, "") : e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            if (e.key === "Escape") {
              setEditing(false);
              setErr(null);
            }
          }}
          className="h-8 w-32 rounded-md border border-[#D98A00] bg-white px-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D98A00]/25 disabled:opacity-60"
        />
        {err && <div className="mt-1 max-w-[180px] text-[10px] text-rose-600">{err}</div>}
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={start}
      disabled={!canEdit}
      title={canEdit ? "Klik untuk mengisi / mengubah" : "Hanya pemilik lead atau Head yang bisa mengubah"}
      className={`group inline-flex items-center gap-1.5 rounded-md text-left ${canEdit ? "cursor-pointer hover:bg-[#FFF4DC]" : "cursor-default"} px-1 py-0.5 -mx-1`}
    >
      {current ? <span className="text-slate-800">{display ?? current}</span> : <span className={canEdit ? "text-slate-400" : "text-slate-300"}>{canEdit ? placeholder : "—"}</span>}
      {canEdit && <Edit3 className="h-3 w-3 shrink-0 text-slate-300 opacity-0 transition group-hover:opacity-100" />}
    </button>
  );
}

const selectCls =
  "h-9 rounded-lg border border-[#E5E2DA] bg-white px-2.5 text-xs font-medium text-slate-700 focus:border-[#D98A00] focus:outline-none focus:ring-2 focus:ring-[#D98A00]/20";

export function LeadTable({
  data,
  state,
  loading,
  onChange,
  onExport,
  exporting,
  truncated,
  busdev,
  busdevNames,
  onBusdev,
  me,
  onPatch,
}: {
  data: TableData | null;
  state: TableState;
  loading: boolean;
  /** Sales terpilih ("all" = semua). Sama dengan filter BusDev di bagian atas halaman. */
  busdev: string;
  busdevNames: string[];
  onBusdev: (name: string) => void;
  me: CrmUserInfo;
  onPatch: PatchHandler;
  onChange: (patch: Partial<TableState>) => void;
  onExport: () => void;
  exporting: boolean;
  truncated: boolean;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => undefined);
    setCopied(code);
    setTimeout(() => setCopied(null), 1800);
  };
  const onSort = (k: SortKey) => onChange({ sort: k, dir: state.sort === k && state.dir === "desc" ? "asc" : "desc", page: 1 });

  const tabs: { id: Tab; label: string; count: number | undefined }[] = [
    { id: "chat", label: "Chat Masuk", count: data?.tabCounts.chat },
    { id: "dropoff", label: "Drop-off", count: data?.tabCounts.dropoff },
    { id: "all", label: "Semua Klik", count: data?.tabCounts.all },
    { id: "direct", label: "Chat Langsung", count: data?.tabCounts.direct },
  ];

  const total = data?.total ?? 0;
  const from = total === 0 ? 0 : (data!.page - 1) * data!.pageSize + 1;
  const to = Math.min(total, (data?.page ?? 1) * (data?.pageSize ?? 25));
  const filtersActive = state.kind !== "all" || state.tier !== "all" || state.moq !== "all" || state.source !== "all" || state.stage !== "all" || state.search !== "";

  return (
    <Card
      title="Database Pelanggan"
      subtitle="Satu baris per prospek (nomor sama dalam 24 jam digabung). Produk, MOQ, dan Tahap bisa diisi busdev pemilik lead; Head bisa mengubah semua."
      right={
        <button
          type="button"
          onClick={onExport}
          disabled={exporting || total === 0}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E5E2DA] bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          {exporting ? "Menyiapkan..." : "Ekspor CSV"}
        </button>
      }
    >
      {truncated && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Data periode ini sangat besar dan dipotong di 5.000 baris terbaru. Persempit rentang tanggal agar angka lengkap.
        </div>
      )}

      {/* Tab status */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center rounded-xl bg-slate-100 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange({ tab: t.id, page: 1 })}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${state.tab === t.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              {t.label} <span className="ml-1 font-mono" style={state.tab === t.id ? { color: BRAND } : undefined}>{t.count ?? "–"}</span>
            </button>
          ))}
        </div>

        {/* Pilih sales */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1" role="group" aria-label="Pilih sales">
          {["all", ...busdevNames].map((n) => {
            const active = busdev.toLowerCase() === n.toLowerCase();
            return (
              <button
                key={n}
                type="button"
                onClick={() => onBusdev(n)}
                aria-pressed={active}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                style={active ? { color: BRAND } : undefined}
              >
                {n === "all" ? "Semua Sales" : n}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1 md:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={state.search}
            onChange={(e) => onChange({ search: e.target.value, page: 1 })}
            placeholder="Cari nama, nomor, kode, halaman"
            className="h-9 w-full rounded-lg border border-[#E5E2DA] bg-white pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#D98A00] focus:outline-none focus:ring-2 focus:ring-[#D98A00]/20"
          />
        </div>
        <select aria-label="Jenis lead" className={selectCls} value={state.kind} onChange={(e) => onChange({ kind: e.target.value as TableState["kind"], page: 1 })}>
          <option value="all">Semua jenis</option>
          <option value="form">Isi form</option>
          <option value="click">Klik WA saja</option>
        </select>
        <select aria-label="Tier produksi" className={selectCls} value={state.tier} onChange={(e) => onChange({ tier: e.target.value, page: 1 })}>
          <option value="all">Semua tier</option>
          {(data?.tiers ?? []).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select aria-label="MOQ" className={selectCls} value={state.moq} onChange={(e) => onChange({ moq: e.target.value as TableState["moq"], page: 1 })}>
          <option value="all">Semua MOQ</option>
          <option value="met">Memenuhi MOQ</option>
          <option value="below">Di bawah MOQ</option>
        </select>
        <select aria-label="Tahap pipeline" className={selectCls} value={state.stage} onChange={(e) => onChange({ stage: e.target.value, page: 1 })}>
          <option value="all">Semua tahap</option>
          {PIPELINE_STAGES.map((st) => (
            <option key={st.id} value={st.id}>
              {st.label}
            </option>
          ))}
        </select>
        <select aria-label="Sumber" className={selectCls} value={state.source} onChange={(e) => onChange({ source: e.target.value, page: 1 })}>
          <option value="all">Semua sumber</option>
          {(data?.sources ?? []).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {filtersActive && (
          <button
            type="button"
            onClick={() => onChange({ kind: "all", tier: "all", moq: "all", source: "all", stage: "all", search: "", page: 1 })}
            className="h-9 rounded-lg px-2 text-xs font-medium text-slate-500 underline hover:text-slate-800"
          >
            Reset filter
          </button>
        )}
      </div>

      {/* Tabel */}
      <div className="-mx-5 overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-y border-[#ECEAE4] bg-[#FAFAF8] text-[11px] uppercase tracking-wide">
              <SortHead label="Waktu Klik" k="time" state={state} onSort={onSort} />
              <SortHead label="Nama" k="name" state={state} onSort={onSort} />
              <th className="px-4 py-3 font-semibold text-slate-500">Nomor WhatsApp</th>
              <SortHead label="Produk" k="product" state={state} onSort={onSort} />
              <SortHead label="MOQ (pcs)" k="quantity" state={state} onSort={onSort} />
              <th className="px-4 py-3 font-semibold text-slate-500">Asal → Halaman Tujuan</th>
              <SortHead label="Sales" k="busdev" state={state} onSort={onSort} />
              <th className="px-4 py-3 font-semibold text-slate-500">Tahap</th>
              <SortHead label="Waktu Chat" k="chat_time" state={state} onSort={onSort} />
              <th className="px-4 py-3 font-semibold text-slate-500">Kode</th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-[#F1EFEA] ${loading ? "opacity-60" : ""}`}>
            {!data ? (
              <tr>
                <td colSpan={10} className="py-14 text-center text-slate-400">
                  Memuat data...
                </td>
              </tr>
            ) : data.rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-14 text-center text-slate-400">
                  <p className="mb-1 font-medium text-slate-600">Tidak ada lead untuk filter ini</p>
                  <p>Ubah rentang tanggal, tab status, atau reset filter.</p>
                </td>
              </tr>
            ) : (
              data.rows.map((r) => {
                const isChat = r.status === "confirmed";
                const direct = r.source === "wa-direct";
                const clean = (v: string | null) => (v && /[\p{L}\p{N}]/u.test(v) ? v.trim() : null);
                const name = clean(r.nama) || clean(r.wa_profile_name);
                const qty = r.moq_manual ?? r.requested_quantity_pcs;
                const canEdit = canEditLead(me, r.assigned_to);
                const foreign = r.phone_country_iso2 && r.phone_country_iso2 !== "ID" ? r.phone_country_iso2 : null;
                return (
                  <tr key={r.id} className="transition-colors hover:bg-[#FFFCF5]">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-slate-700">
                      <div>{wibTime(r.created_at)}</div>
                      <div className="font-sans text-[10px] text-slate-400">{wibDay(r.created_at)}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {name ? (
                        <div>
                          <div className="font-semibold text-slate-900">{name}</div>
                          {r.is_form_lead && <Pill tone="brand">Isi form</Pill>}
                        </div>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px]">
                      {r.display_phone ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900" title={r.phone_from === "WA" ? "Nomor pengirim WhatsApp" : "Nomor dari isian form"}>
                            {r.display_phone}
                            {foreign && <span className="ml-1.5 rounded bg-sky-50 px-1 font-sans text-[9px] font-medium text-sky-700">{foreign}</span>}
                          </span>
                          <a
                            href={formatWaChatLink(r.display_phone, name, r.assigned_to, r.produk_manual || r.produk) || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Balas chat langsung via WhatsApp"
                            className="inline-flex items-center justify-center h-5 w-5 rounded-md bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] transition shrink-0"
                          >
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.074-1.808-.412-1.428-.592-2.34-2.029-2.411-2.123-.07-.094-.576-.767-.576-1.464 0-.697.362-1.04.49-1.182.129-.143.282-.179.377-.179.094 0 .188.001.27.006.086.004.202-.033.315.24.116.282.399.974.433 1.045.035.07.058.153.012.247-.046.094-.07.153-.139.235-.07.082-.147.184-.21.247-.07.07-.144.146-.062.287.082.141.365.602.784.975.54.481.996.63 1.137.7.141.07.224.059.306-.035.083-.094.354-.412.448-.553.094-.141.189-.118.318-.07.13.047.824.388.966.459.141.07.236.106.271.165.035.059.035.341-.109.746z" />
                            </svg>
                          </a>
                        </div>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="max-w-[180px] px-4 py-3">
                      <InlineEdit
                        value={r.produk_manual ?? null}
                        display={<span className="font-medium">{r.produk_manual}</span>}
                        placeholder={r.produk ? r.produk : "+ isi produk"}
                        canEdit={canEdit}
                        maxLength={120}
                        onSave={(v) => onPatch(r, { produk_manual: v })}
                      />
                      {!r.produk_manual && r.produk && !canEdit && <span className="text-slate-700">{r.produk}</span>}
                      {r.produk_manual && r.produk && r.produk !== r.produk_manual && <div className="text-[10px] text-slate-400" title="Isian dari form">Form: {r.produk}</div>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <InlineEdit
                        value={r.moq_manual ?? null}
                        numeric
                        display={<span className="font-mono font-semibold">{(r.moq_manual ?? 0).toLocaleString("id-ID")}</span>}
                        placeholder={r.requested_quantity_pcs ? `${r.requested_quantity_pcs.toLocaleString("id-ID")} (form)` : "+ isi MOQ"}
                        canEdit={canEdit}
                        maxLength={9}
                        onSave={(v) => onPatch(r, { moq_manual: v === null ? null : parseInt(v, 10) })}
                      />
                      {r.moq_manual === null && r.requested_quantity_pcs && !canEdit && <span className="font-mono text-slate-700">{r.requested_quantity_pcs.toLocaleString("id-ID")}</span>}
                      <div className="mt-0.5 flex items-center gap-1">
                        {qty ? <Pill tone={qty >= MOQ_PCS ? "green" : "amber"}>{qty >= MOQ_PCS ? "Memenuhi MOQ" : "< MOQ"}</Pill> : null}
                        {r.production_tier_name && <span className="text-[10px] text-slate-400">{r.production_tier_name}</span>}
                      </div>
                    </td>
                    <td className="max-w-[300px] px-4 py-3">
                      <div className="flex items-start gap-1.5">
                        <span className="mt-0.5 w-9 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Dari</span>
                        <div className="min-w-0">
                          <div className="truncate font-medium text-slate-800" title={r.referrer_label || ""}>
                            {r.referrer_label || <span className="text-slate-300">Langsung / tidak tercatat</span>}
                          </div>
                          {r.referrer_kind && (
                            <span className="rounded bg-slate-100 px-1 text-[9px] font-medium uppercase text-slate-600">{REFERRER_KIND_LABEL[r.referrer_kind]}</span>
                          )}
                        </div>
                      </div>
                      <div className="mt-1.5 flex items-start gap-1.5">
                        <span className="mt-0.5 w-9 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Ke</span>
                        <div className="min-w-0">
                          <div className="truncate font-mono text-[11px] font-medium" style={{ color: BRAND }} title={r.page_url || ""}>
                            {r.page_url || "—"}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <span className="rounded bg-slate-100 px-1 font-mono text-[9px] uppercase text-slate-600">{r.source || "direct"}</span>
                            {r.utm_campaign && (
                              <span className="truncate" title={r.utm_campaign}>
                                {r.utm_campaign}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="font-semibold text-slate-800">{r.assigned_to || "—"}</span>
                      {(r.busdevs?.length ?? 0) > 1 && (
                        <span className="ml-1.5" title={`Prospek ini tercatat di beberapa BusDev: ${r.busdevs!.join(", ")}`}>
                          <Pill tone="red">Ganda</Pill>
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {canEdit ? (
                        <select
                          aria-label="Tahap pipeline"
                          value={r.crm_stage || "traffic"}
                          onChange={(e) => onPatch(r, { stage: e.target.value })}
                          className="h-8 rounded-md border border-[#E5E2DA] bg-white px-1.5 text-[11px] font-medium text-slate-700 focus:border-[#D98A00] focus:outline-none"
                        >
                          {PIPELINE_STAGES.map((st) => (
                            <option key={st.id} value={st.id}>
                              {st.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Pill tone="slate">{stageLabel(r.crm_stage)}</Pill>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {direct ? (
                        <div>
                          <div className="font-mono text-[11px] text-emerald-700">{wibTime(r.confirmed_at)}</div>
                          <Pill tone="slate">Chat langsung</Pill>
                        </div>
                      ) : isChat && r.confirmed_at ? (
                        <div>
                          <div className="font-mono text-[11px] text-emerald-700">{wibTime(r.confirmed_at)}</div>
                          <Pill tone="green">{formatLatency(r.latency_seconds)}</Pill>
                        </div>
                      ) : (
                        <Pill tone="amber">Drop-off</Pill>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        type="button"
                        onClick={() => copy(r.tracking_code)}
                        title="Salin kode"
                        className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-700 transition hover:bg-slate-200"
                      >
                        {r.tracking_code.length > 16 ? `${r.tracking_code.slice(0, 14)}…` : r.tracking_code}
                        {copied === r.tracking_code ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-2.5 w-2.5 text-slate-400" />}
                      </button>
                      {r.inquiry_reference && r.inquiry_reference !== r.tracking_code && (
                        <div className="mt-1 font-mono text-[10px] text-slate-400">Konsultasi: {r.inquiry_reference}</div>
                      )}
                      {(r.duplicate_count ?? 0) > 0 && (
                        <div className="mt-1 text-[10px] text-slate-400" title={(r.merged_tracking_codes ?? []).join(", ")}>
                          +{r.duplicate_count} baris digabung
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span>
            {total === 0 ? "0 lead" : `${from.toLocaleString("id-ID")}–${to.toLocaleString("id-ID")} dari ${total.toLocaleString("id-ID")} lead`}
          </span>
          <label className="flex items-center gap-1.5">
            Baris
            <select className={selectCls} value={state.pageSize} onChange={(e) => onChange({ pageSize: parseInt(e.target.value, 10), page: 1 })}>
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!data || data.page <= 1}
            onClick={() => onChange({ page: state.page - 1 })}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E2DA] bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[88px] text-center font-mono">
            {data?.page ?? 1} / {data?.pages ?? 1}
          </span>
          <button
            type="button"
            disabled={!data || data.page >= data.pages}
            onClick={() => onChange({ page: state.page + 1 })}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E2DA] bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
            aria-label="Halaman berikutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}
