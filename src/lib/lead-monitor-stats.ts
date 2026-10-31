/**
 * lead-monitor-stats.ts
 *
 * Satu-satunya tempat angka lead monitor dihitung. Kartu, grafik, dan tabel
 * semuanya memakai daftar lead yang SUDAH digabung per nomor (lead-merge), jadi
 * angka di kartu selalu sama dengan jumlah baris di tab tabel yang bersangkutan.
 *
 * Definisi (satu lead = satu prospek unik, nomor sama dalam 24 jam digabung):
 *   Chat Masuk  = lead dari klik CTA yang sudah chat (status confirmed)
 *   Drop-off    = lead dari klik CTA yang belum chat
 *   Total Klik  = Chat Masuk + Drop-off
 *   Chat Langsung = chat yang masuk tanpa klik CTA (source 'wa-direct'), dihitung terpisah
 *
 * Murni fungsi, tanpa I/O.
 */

import { mergeLeads, type MergeableLead, type MergedLead } from './lead-merge';

export const MOQ_PCS = 500;
export const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Catatan Android "Memeriksa pesan baru" dsb. yang pernah tercatat sebagai chat (data lama). */
const GHOST_MESSAGE = /memeriksa pesan baru|legalitas sertifikasi bpom/i;

/**
 * Kuantitas cadangan bila requested_quantity_pcs kosong. Nama tier mengikuti form kualifikasi
 * terbaru (Starter Brand 500, Growth Brand 1.000, Enterprise 5.000, Strategic Partner 10.000,
 * Scaleup 3.000) ditambah nama lama. "Paket Bisnis" sengaja tidak punya kuantitas.
 */
const TIER_PCS: Record<string, number> = {
  'starter brand': 500,
  'growth brand': 1000,
  'enterprise': 5000,
  'strategic partner': 10000,
  'scaleup': 3000,
  'brand starter': 300,
  'brand launch': 500,
  'brand growth': 1000,
  'brand partner': 5000,
};

export interface MonitorLead extends MergeableLead {
  nama?: string | null;
  hp?: string | null;
  wa_profile_name?: string | null;
  wa_phone?: string | null;
  wa_message?: string | null;
  /** Penanda dari SQL: pesan adalah notifikasi sistem Android (data lama), bukan chat. */
  is_ghost?: boolean;
  page_url?: string | null;
  /** Halaman sebelum lead dibuat (artikel, iklan, Instagram, dst). */
  referrer?: string | null;
  utm_campaign?: string | null;
  produk?: string | null;
  production_tier_name?: string | null;
  requested_quantity_pcs?: number | null;
  inquiry_reference?: string | null;
  latency_seconds?: number | null;
}

export type ViewedLead = MergedLead<MonitorLead>;

export type LeadClass = 'chat' | 'dropoff' | 'direct';

// ---------------------------------------------------------------- dasar

/** Baris ghost-notification yang berstatus confirmed dianggap klik biasa yang belum chat. */
export function sanitizeRow<T extends MonitorLead>(row: T): T {
  const ghost = row.is_ghost === true || (typeof row.wa_message === 'string' && GHOST_MESSAGE.test(row.wa_message));
  if (row.status === 'confirmed' && ghost) {
    return { ...row, status: null, confirmed_at: null };
  }
  return row;
}

export function mergeForMonitor(rows: MonitorLead[]): ViewedLead[] {
  return mergeLeads(rows.map(sanitizeRow)) as ViewedLead[];
}

export function classify(l: MonitorLead): LeadClass {
  if (l.source === 'wa-direct') return 'direct';
  return l.status === 'confirmed' ? 'chat' : 'dropoff';
}

export function wibDate(iso: string | number | Date): string {
  const ms = typeof iso === 'number' ? iso : new Date(iso).getTime();
  return new Date(ms + WIB_OFFSET_MS).toISOString().slice(0, 10);
}

export function wibHour(iso: string | number | Date): number {
  const ms = typeof iso === 'number' ? iso : new Date(iso).getTime();
  return new Date(ms + WIB_OFFSET_MS).getUTCHours();
}

export function quantityOf(l: MonitorLead): number | null {
  if (l.requested_quantity_pcs && l.requested_quantity_pcs > 0) return l.requested_quantity_pcs;
  const t = l.production_tier_name ? TIER_PCS[l.production_tier_name.trim().toLowerCase()] : undefined;
  return t ?? null;
}

export const meetsMoq = (l: MonitorLead): boolean => (quantityOf(l) ?? 0) >= MOQ_PCS;

/** Selang klik -> chat dalam detik. Dihitung dari timestamp karena hanya baris gabungan yang membawa latency_seconds. */
export function latencySeconds(l: MonitorLead): number | null {
  if (l.status !== 'confirmed' || !l.confirmed_at) return null;
  const d = (new Date(l.confirmed_at).getTime() - new Date(l.created_at).getTime()) / 1000;
  return Number.isFinite(d) ? Math.max(0, Math.round(d)) : null;
}

export function leadPhone(l: MonitorLead): string | null {
  return (l.display_phone as string) || l.wa_phone || l.hp || null;
}

/** Nama hanya dipakai bila memuat huruf/angka (isian seperti "...." atau "-" dianggap kosong). */
export function cleanName(v: unknown): string | null {
  const t = typeof v === 'string' ? v.trim() : '';
  return t && /[\p{L}\p{N}]/u.test(t) ? t : null;
}

export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return '—';
  const d = String(phone).replace(/\D/g, '');
  return d.length >= 4 ? `***${d.slice(-4)}` : '***';
}

// ---------------------------------------------------------------- KPI

export interface Kpi {
  totalClicks: number;
  chat: number;
  dropoff: number;
  direct: number;
  moqMet: number;
}

export function computeKpi(leads: MonitorLead[]): Kpi {
  const k: Kpi = { totalClicks: 0, chat: 0, dropoff: 0, direct: 0, moqMet: 0 };
  for (const l of leads) {
    const c = classify(l);
    if (c === 'direct') k.direct++;
    else {
      k.totalClicks++;
      if (c === 'chat') k.chat++;
      else k.dropoff++;
    }
    if (meetsMoq(l)) k.moqMet++;
  }
  return k;
}

/** Selisih persen terhadap periode lalu. Null bila periode lalu 0 (tidak bisa dibandingkan). */
export function deltaPct(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

// ---------------------------------------------------------------- agregat

export interface BusdevStat {
  name: string;
  chat: number;
  dropoff: number;
  direct: number;
  clicks: number;
  /** Porsi chat masuk terhadap total chat semua sales (0-100). */
  share: number;
}

export function perBusdev(leads: MonitorLead[], names: string[]): BusdevStat[] {
  const map = new Map<string, BusdevStat>();
  const key = (n: string) => n.trim().toLowerCase();
  for (const n of names) map.set(key(n), { name: n, chat: 0, dropoff: 0, direct: 0, clicks: 0, share: 0 });
  for (const l of leads) {
    const who = (l.assigned_to || 'Unassigned').trim();
    if (!map.has(key(who))) map.set(key(who), { name: who, chat: 0, dropoff: 0, direct: 0, clicks: 0, share: 0 });
    const s = map.get(key(who))!;
    const c = classify(l);
    if (c === 'chat') {
      s.chat++;
      s.clicks++;
    } else if (c === 'dropoff') {
      s.dropoff++;
      s.clicks++;
    } else s.direct++;
  }
  const rows = [...map.values()];
  const totalChat = rows.reduce((a, r) => a + r.chat, 0);
  for (const r of rows) r.share = totalChat > 0 ? Math.round((r.chat / totalChat) * 1000) / 10 : 0;
  return rows;
}

/** Sales "Unassigned" tanpa aktivitas disembunyikan; sales terdaftar selalu tampil. */
export function visibleBusdevs(rows: BusdevStat[], registered: string[]): BusdevStat[] {
  const reg = new Set(registered.map((n) => n.toLowerCase()));
  return rows.filter((r) => reg.has(r.name.toLowerCase()) || r.chat + r.dropoff + r.direct > 0);
}

export interface InactiveSummary {
  names: string[];
  chat: number;
  clicks: number;
}

/**
 * Memisahkan sales aktif dari yang nonaktif (mis. kontrak selesai) atau tanpa nama. Kartu dan navigasi hanya
 * menampilkan sales aktif, dengan porsi dihitung ulang di antara mereka; data sales nonaktif tidak dibuang dan
 * dirangkum agar totalnya tetap cocok dengan kartu Chat Masuk.
 */
export function splitActive(rows: BusdevStat[], activeNames: string[]): { active: BusdevStat[]; inactive: InactiveSummary } {
  const act = new Set(activeNames.map((n) => n.toLowerCase()));
  const active = rows.filter((r) => act.has(r.name.toLowerCase())).map((r) => ({ ...r }));
  const rest = rows.filter((r) => !act.has(r.name.toLowerCase()) && r.chat + r.dropoff > 0);
  const totalChat = active.reduce((a, r) => a + r.chat, 0);
  for (const r of active) r.share = totalChat > 0 ? Math.round((r.chat / totalChat) * 1000) / 10 : 0;
  return {
    active,
    inactive: { names: rest.map((r) => r.name), chat: rest.reduce((a, r) => a + r.chat, 0), clicks: rest.reduce((a, r) => a + r.clicks, 0) },
  };
}

export type Fairness = { level: 'merata' | 'agak-timpang' | 'timpang' | 'belum-ada-data'; spread: number };

/** Selisih porsi chat terbesar - terkecil antar sales aktif. <=10 poin merata, <=20 agak timpang. */
export function fairness(rows: BusdevStat[], activeNames: string[]): Fairness {
  const act = new Set(activeNames.map((n) => n.toLowerCase()));
  const pool = rows.filter((r) => act.has(r.name.toLowerCase()));
  const total = pool.reduce((a, r) => a + r.chat, 0);
  if (pool.length < 2 || total < 8) return { level: 'belum-ada-data', spread: 0 };
  const shares = pool.map((r) => (r.chat / total) * 100);
  const spread = Math.round((Math.max(...shares) - Math.min(...shares)) * 10) / 10;
  return { level: spread <= 10 ? 'merata' : spread <= 20 ? 'agak-timpang' : 'timpang', spread };
}

export interface DayPoint {
  date: string;
  klik: number;
  chat: number;
  dropoff: number;
}

/** Deret harian (WIB) dari startDate sampai endDate (inklusif), hari kosong tetap muncul bernilai 0. */
export function dailySeries(leads: MonitorLead[], startDate: string, endDate: string): DayPoint[] {
  const days: DayPoint[] = [];
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return days;
  const idx = new Map<string, DayPoint>();
  for (let t = start; t <= end && days.length < 400; t += 86_400_000) {
    const p: DayPoint = { date: new Date(t).toISOString().slice(0, 10), klik: 0, chat: 0, dropoff: 0 };
    days.push(p);
    idx.set(p.date, p);
  }
  for (const l of leads) {
    const c = classify(l);
    if (c === 'direct') continue;
    const p = idx.get(wibDate(l.created_at));
    if (!p) continue;
    p.klik++;
    if (c === 'chat') p.chat++;
    else p.dropoff++;
  }
  return days;
}

/** Klik dan chat per jam (WIB, 0-23) berdasarkan waktu klik. Dipakai grafik tren saat rentang hanya satu hari. */
export function hourlyClicks(leads: MonitorLead[]): { hour: number; klik: number; chat: number }[] {
  const out = Array.from({ length: 24 }, (_, hour) => ({ hour, klik: 0, chat: 0 }));
  for (const l of leads) {
    const c = classify(l);
    if (c === 'direct') continue;
    const slot = out[wibHour(l.created_at)];
    slot.klik++;
    if (c === 'chat') slot.chat++;
  }
  return out;
}

/** Chat masuk per jam (WIB, 0-23), berdasarkan waktu chat. */
export function hourlyChats(leads: MonitorLead[]): { hour: number; chat: number }[] {
  const out = Array.from({ length: 24 }, (_, hour) => ({ hour, chat: 0 }));
  for (const l of leads) {
    if (l.status !== 'confirmed') continue;
    const at = l.confirmed_at || l.created_at;
    out[wibHour(at)].chat++;
  }
  return out;
}

export interface GroupStat {
  key: string;
  klik: number;
  chat: number;
  dropoff: number;
}

export function groupBy(leads: MonitorLead[], keyOf: (l: MonitorLead) => string | null, limit = 8): GroupStat[] {
  const m = new Map<string, GroupStat>();
  for (const l of leads) {
    const c = classify(l);
    if (c === 'direct') continue;
    const key = keyOf(l) || '(tidak diketahui)';
    if (!m.has(key)) m.set(key, { key, klik: 0, chat: 0, dropoff: 0 });
    const g = m.get(key)!;
    g.klik++;
    if (c === 'chat') g.chat++;
    else g.dropoff++;
  }
  return [...m.values()].sort((a, b) => b.klik - a.klik || b.chat - a.chat).slice(0, limit);
}

export function pagePath(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = url.startsWith('http') ? new URL(url) : new URL(url, 'https://dreamlab.id');
    const p = u.pathname.replace(/\/+$/, '') || '/';
    return p;
  } catch {
    return url.split('?')[0] || null;
  }
}

export type ReferrerKind = 'artikel' | 'landing' | 'beranda' | 'situs' | 'eksternal' | 'langsung';

export interface ReferrerInfo {
  kind: ReferrerKind;
  /** Teks utama: judul artikel, path halaman, atau nama situs luar. Tanpa query string. */
  label: string | null;
  /** Path halaman dreamlab.id (hanya untuk halaman sendiri). */
  path: string | null;
}

const LANDING_PREFIX = /^\/(ads|google-ads|thankyou|produk|dreampreneur|contact-us|contact-medsos)(\/|$)/;

/**
 * Menerjemahkan referrer mentah menjadi label yang enak dibaca. Query string (UTM, fbclid, dst) dibuang
 * supaya tidak membocorkan parameter iklan ke tampilan. `titleOf` opsional: path -> judul artikel.
 */
export function referrerInfo(ref: string | null | undefined, titleOf?: (path: string) => string | null): ReferrerInfo {
  if (!ref || !ref.trim()) return { kind: 'langsung', label: null, path: null };
  try {
    const u = new URL(ref.trim());
    const host = u.hostname.replace(/^www\./, '').toLowerCase();
    if (host === 'dreamlab.id') {
      const path = u.pathname.replace(/\/+$/, '') || '/';
      if (path === '/') return { kind: 'beranda', label: 'Beranda', path };
      if (LANDING_PREFIX.test(path)) return { kind: 'landing', label: path, path };
      const title = titleOf?.(path) ?? null;
      if (title) return { kind: 'artikel', label: title, path };
      return { kind: 'situs', label: path, path };
    }
    return { kind: 'eksternal', label: host, path: null };
  } catch {
    return { kind: 'eksternal', label: ref.trim().slice(0, 60), path: null };
  }
}

export interface ReferrerRank {
  key: string;
  label: string;
  kind: ReferrerKind;
  klik: number;
  chat: number;
  /** Persen klik yang menjadi chat (0-100, satu desimal). */
  rate: number;
}

/**
 * Peringkat halaman asal. Satu halaman = satu path (atau satu situs luar); query string diabaikan.
 * Diurutkan dari chat terbanyak, lalu klik terbanyak. Chat langsung tidak ikut (tidak punya halaman asal).
 */
export function topReferrers(
  leads: ViewedLead[],
  titleOf?: (path: string) => string | null,
  limit = 8
): ReferrerRank[] {
  const m = new Map<string, ReferrerRank>();
  for (const l of leads) {
    const c = classify(l);
    if (c === 'direct') continue;
    const info = referrerInfo(l.referrer, titleOf);
    if (info.kind === 'langsung' || !info.label) continue;
    const key = info.path ?? info.label;
    if (!m.has(key)) m.set(key, { key, label: info.label, kind: info.kind, klik: 0, chat: 0, rate: 0 });
    const g = m.get(key)!;
    g.klik++;
    if (c === 'chat') g.chat++;
  }
  const rows = [...m.values()].map((g) => ({ ...g, rate: g.klik ? Math.round((g.chat / g.klik) * 1000) / 10 : 0 }));
  return rows.sort((a, b) => b.chat - a.chat || b.klik - a.klik).slice(0, limit);
}

export const sourceKey = (l: MonitorLead): string | null =>
  l.utm_campaign ? `${l.source || 'direct'} · ${l.utm_campaign}` : l.source || 'direct';

// ---------------------------------------------------------------- Top Leads

/** Bobot skor ada di satu tempat supaya mudah diubah Head marketing. */
export const SCORE_WEIGHTS = {
  tier: { partner: 40, growth: 30, launch: 20, starter: 10 },
  chat: 30,
  form: 10,
  fastChatSeconds: 3600,
  fast: 10,
  recentHours: 24,
  recent: 10,
} as const;

export function leadScore(l: MonitorLead, nowMs: number): number {
  let s = 0;
  const q = quantityOf(l) ?? 0;
  if (q >= 5000) s += SCORE_WEIGHTS.tier.partner;
  else if (q >= 1000) s += SCORE_WEIGHTS.tier.growth;
  else if (q >= 500) s += SCORE_WEIGHTS.tier.launch;
  else if (q > 0) s += SCORE_WEIGHTS.tier.starter;
  if (l.status === 'confirmed') s += SCORE_WEIGHTS.chat;
  if (l.is_form_lead) s += SCORE_WEIGHTS.form;
  const lat = latencySeconds(l);
  if (lat !== null && lat <= SCORE_WEIGHTS.fastChatSeconds) s += SCORE_WEIGHTS.fast;
  if (nowMs - new Date(l.last_seen_at as string || l.created_at).getTime() <= SCORE_WEIGHTS.recentHours * 3_600_000)
    s += SCORE_WEIGHTS.recent;
  return s;
}

export interface TopLead {
  id: number;
  name: string | null;
  phone: string;
  tier: string | null;
  quantity: number | null;
  busdev: string | null;
  score: number;
  chat: boolean;
}

export function topLeads(leads: ViewedLead[], nowMs: number, limit = 5): TopLead[] {
  return leads
    .filter((l) => l.status === 'confirmed' || l.is_form_lead)
    .map((l) => ({ l, score: leadScore(l, nowMs) }))
    .sort((a, b) => b.score - a.score || new Date(b.l.created_at).getTime() - new Date(a.l.created_at).getTime())
    .slice(0, limit)
    .map(({ l, score }) => ({
      id: l.id,
      name: cleanName(l.nama) || cleanName(l.wa_profile_name),
      phone: maskPhone(leadPhone(l)),
      tier: (l.production_tier_name as string) || null,
      quantity: quantityOf(l),
      busdev: l.assigned_to,
      score,
      chat: l.status === 'confirmed',
    }));
}

// ---------------------------------------------------------------- kesehatan nomor

export type HealthLevel = 'sehat' | 'perhatian' | 'tidak-aktif' | 'di-luar-jam-kerja' | 'nonaktif';

export interface HealthInput {
  name: string;
  isActive: boolean;
  lastChatAt: string | null;
  chatsToday: number;
}

export interface HealthRow extends HealthInput {
  level: HealthLevel;
  minutesSinceChat: number | null;
}

export const WORK_HOURS_WIB = { from: 8, to: 21 };

/**
 * Sehat: chat terakhir < 3 jam. Perhatian: 3-24 jam. Tidak aktif: > 24 jam atau belum pernah.
 * Di luar jam kerja (21:00-08:00 WIB) selisih jam tidak dinilai agar tidak ada alarm palsu di malam hari.
 */
export function healthRows(inputs: HealthInput[], nowMs: number): HealthRow[] {
  const hour = wibHour(nowMs);
  const working = hour >= WORK_HOURS_WIB.from && hour < WORK_HOURS_WIB.to;
  return inputs.map((i) => {
    const mins = i.lastChatAt ? Math.max(0, Math.round((nowMs - new Date(i.lastChatAt).getTime()) / 60_000)) : null;
    let level: HealthLevel;
    if (!i.isActive) level = 'nonaktif';
    else if (mins === null || mins > 24 * 60) level = 'tidak-aktif';
    else if (mins <= 180) level = 'sehat';
    else level = working ? 'perhatian' : 'di-luar-jam-kerja';
    return { ...i, level, minutesSinceChat: mins };
  });
}

// ---------------------------------------------------------------- tabel

export type StatusTab = 'chat' | 'dropoff' | 'all' | 'direct';

export interface TableFilters {
  tab: StatusTab;
  busdev: string;
  kind: 'all' | 'form' | 'click';
  tier: string;
  moq: 'all' | 'met' | 'below';
  source: string;
  search: string;
}

export const defaultFilters: TableFilters = {
  tab: 'chat',
  busdev: 'all',
  kind: 'all',
  tier: 'all',
  moq: 'all',
  source: 'all',
  search: '',
};

export function matchesTab(l: MonitorLead, tab: StatusTab): boolean {
  const c = classify(l);
  if (tab === 'all') return c !== 'direct';
  return c === tab;
}

export function tabCounts(leads: MonitorLead[]): Record<StatusTab, number> {
  const k = computeKpi(leads);
  return { chat: k.chat, dropoff: k.dropoff, all: k.totalClicks, direct: k.direct };
}

const norm = (v: unknown) => String(v ?? '').toLowerCase();

export function filterLeads(leads: ViewedLead[], f: TableFilters): ViewedLead[] {
  const q = f.search.trim().toLowerCase();
  return leads.filter((l) => {
    if (!matchesTab(l, f.tab)) return false;
    if (f.busdev !== 'all' && norm(l.assigned_to) !== f.busdev.toLowerCase()) return false;
    if (f.kind === 'form' && !l.is_form_lead) return false;
    if (f.kind === 'click' && l.is_form_lead) return false;
    if (f.tier !== 'all' && norm(l.production_tier_name) !== f.tier.toLowerCase()) return false;
    if (f.moq === 'met' && !meetsMoq(l)) return false;
    if (f.moq === 'below' && (meetsMoq(l) || !quantityOf(l))) return false;
    if (f.source !== 'all' && (l.source || 'direct') !== f.source) return false;
    if (q) {
      const hay = [l.tracking_code, l.nama, l.wa_profile_name, l.wa_phone, l.hp, l.page_url, l.referrer, l.produk, l.inquiry_reference]
        .map(norm)
        .join(' ');
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export type SortKey = 'time' | 'name' | 'busdev' | 'product' | 'quantity' | 'chat_time';

export function sortLeads(leads: ViewedLead[], key: SortKey, dir: 'asc' | 'desc'): ViewedLead[] {
  const m = dir === 'asc' ? 1 : -1;
  const val = (l: ViewedLead): string | number => {
    switch (key) {
      case 'name':
        return norm(l.nama || l.wa_profile_name);
      case 'busdev':
        return norm(l.assigned_to);
      case 'product':
        return norm(l.produk);
      case 'quantity':
        return quantityOf(l) ?? -1;
      case 'chat_time':
        return l.confirmed_at ? new Date(l.confirmed_at).getTime() : -1;
      default:
        return new Date(l.last_seen_at).getTime();
    }
  };
  return [...leads].sort((a, b) => {
    const va = val(a);
    const vb = val(b);
    if (va < vb) return -1 * m;
    if (va > vb) return 1 * m;
    return 0;
  });
}

export function paginate<T>(rows: T[], page: number, pageSize: number): { rows: T[]; page: number; pages: number } {
  const size = Math.min(Math.max(1, Math.floor(pageSize) || 25), 5000);
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const p = Math.min(Math.max(1, Math.floor(page) || 1), pages);
  return { rows: rows.slice((p - 1) * size, p * size), page: p, pages };
}
