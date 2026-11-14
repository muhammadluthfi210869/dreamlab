/**
 * Tahap sales pipeline sesuai spesifikasi CRM Dreamlab (Tahap 1):
 * Lead Masuk → Cold → Warm below 500 → Warm up 500 → Warm below 1000 → Warm up 1000 → Hot → Sample → Deal → Lost
 * Urutan di sini = urutan kolom Kanban dari kiri ke kanan (tetap).
 */
export const PIPELINE_STAGES = [
  { id: 'lead_masuk', label: 'Lead Masuk', hint: 'Lead baru masuk dari iklan, organik, atau form website', tone: '#64748B' },
  { id: 'cold', label: 'Cold', hint: 'Sudah dihubungi / balasan awal, belum masuk kualifikasi MOQ Warm', tone: '#0284C7' },
  { id: 'warm_below_500', label: 'Warm below 500', hint: 'Tertarik maklon dengan estimasi MOQ di bawah 500 pcs', tone: '#D97706' },
  { id: 'warm_up_500', label: 'Warm up 500', hint: 'Tertarik maklon skala Starter (MOQ 500 pcs)', tone: '#F39200' },
  { id: 'warm_below_1000', label: 'Warm below 1000', hint: 'Tertarik maklon dengan estimasi MOQ 500–999 pcs', tone: '#1F6FB2' },
  { id: 'warm_up_1000', label: 'Warm up 1000', hint: 'Tertarik maklon skala bisnis (MOQ 1.000+ pcs)', tone: '#1D4ED8' },
  { id: 'hot', label: 'Hot', hint: 'Prospek panas, negosiasi HPP / MOU aktif', tone: '#EA580C' },
  { id: 'sample', label: 'Sample', hint: 'Sedang proses formulasi & pembuatan sampel produk', tone: '#0D9488' },
  { id: 'deal', label: 'Deal', hint: 'Deal produksi / pembayaran DP selesai', tone: '#15803D' },
  { id: 'lost', label: 'Lost', hint: 'Prospek batal / tidak lanjut (wajib alasan)', tone: '#B91C1C' },
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number]['id'];

export const STAGE_IDS: readonly string[] = PIPELINE_STAGES.map((s) => s.id);
export const DEFAULT_STAGE: PipelineStage = 'lead_masuk';

/**
 * Alasan wajib saat memindahkan lead ke stage Lost.
 */
export const LOST_REASONS = [
  'Harga tidak masuk',
  'MOQ terlalu besar',
  'Tidak respons',
  'Pilih pabrik lain',
  'Belum siap modal',
] as const;

export type LostReason = (typeof LOST_REASONS)[number];

export const isLostReason = (v: unknown): v is LostReason =>
  typeof v === 'string' && (LOST_REASONS as readonly string[]).includes(v.trim());

/**
 * Perkiraan MOQ otomatis saat pindah ke stage Warm:
 * - Warm below 500 -> 'below 500' (300 pcs numerik kompatibilitas)
 * - Warm up 500    -> '500' (500 pcs)
 * - Warm below 1000-> 'below 1000' (750 pcs)
 * - Warm up 1000   -> '1000' (1000 pcs)
 */
export const WARM_STAGE_MOQ: Record<
  'warm_below_500' | 'warm_up_500' | 'warm_below_1000' | 'warm_up_1000',
  { label: string; numeric: number }
> = {
  warm_below_500: { label: 'below 500', numeric: 300 },
  warm_up_500: { label: '500', numeric: 500 },
  warm_below_1000: { label: 'below 1000', numeric: 750 },
  warm_up_1000: { label: '1000', numeric: 1000 },
};

export function getWarmStageMoq(stage: string): { label: string; numeric: number } | null {
  if (stage in WARM_STAGE_MOQ) {
    return WARM_STAGE_MOQ[stage as keyof typeof WARM_STAGE_MOQ];
  }
  return null;
}

/**
 * Daftar source standar CRM Dreamlab.
 */
export const CRM_SOURCES = [
  'Meta Ads',
  'Google Ads',
  'Website/SEO',
  'WhatsApp organik',
  'Instagram',
  'TikTok',
  'Referral',
] as const;

export type CrmSource = (typeof CRM_SOURCES)[number];

/**
 * Menerima stage baru maupun alias lama agar kompatibel mundur.
 */
const LEGACY_STAGE_MAP: Record<string, PipelineStage> = {
  traffic: 'lead_masuk',
  traffic_below_500: 'cold',
  warm_500: 'warm_up_500',
  traffic_500: 'warm_up_500',
  warm: 'warm_up_500',
  warm_1000: 'warm_up_1000',
  traffic_1000: 'warm_up_1000',
};

export const isStage = (v: unknown): v is PipelineStage =>
  typeof v === 'string' && (STAGE_IDS.includes(v) || v in LEGACY_STAGE_MAP);

export function normalizeStage(st: string | null | undefined): PipelineStage {
  if (!st) return 'lead_masuk';
  const clean = st.trim();
  if (STAGE_IDS.includes(clean)) return clean as PipelineStage;
  if (clean in LEGACY_STAGE_MAP) return LEGACY_STAGE_MAP[clean];
  return 'lead_masuk';
}

export const stageLabel = (id: string | null | undefined): string => {
  const norm = normalizeStage(id);
  return PIPELINE_STAGES.find((s) => s.id === norm)?.label ?? PIPELINE_STAGES[0].label;
};

export function resolveTrafficStageByMoq(moq: number | null | undefined): PipelineStage {
  if (typeof moq !== 'number' || moq <= 0) return 'lead_masuk';
  if (moq < 500) return 'cold';
  if (moq === 500) return 'warm_up_500';
  if (moq < 1000) return 'warm_below_1000';
  return 'warm_up_1000';
}

/**
 * Deteksi source standar & metode deteksi campaign/source untuk kartu Lead Masuk dan panel Detail Lead.
 */
export function normalizeCrmSource(input: {
  source?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  page_url?: string | null;
  referrer?: string | null;
}): { source: CrmSource; detectionMethod: string } {
  const rawSource = (input.source || '').trim();
  if ((CRM_SOURCES as readonly string[]).includes(rawSource)) {
    return { source: rawSource as CrmSource, detectionMethod: 'Dikoreksi manual / tersimpan di CRM' };
  }
  const lowSrc = rawSource.toLowerCase();
  const utmSrc = (input.utm_source || '').toLowerCase();
  const utmMed = (input.utm_medium || '').toLowerCase();
  const page = (input.page_url || '').toLowerCase();
  const ref = (input.referrer || '').toLowerCase();

  if (
    lowSrc.includes('google-ads') ||
    lowSrc.includes('google ads') ||
    utmSrc === 'google' ||
    page.includes('/google-ads') ||
    page.includes('/thankyou/google') ||
    page.includes('gclid=') ||
    ref.includes('/google-ads')
  ) {
    const how = page.includes('gclid=')
      ? 'Parameter gclid pada URL'
      : utmSrc === 'google'
        ? `UTM (${input.utm_source}/${input.utm_medium || '-'})`
        : page.includes('/google-ads') || ref.includes('/google-ads')
          ? 'Landing path /google-ads/*'
          : 'Tag source Google Ads';
    return { source: 'Google Ads', detectionMethod: how };
  }

  if (
    lowSrc.includes('meta') ||
    lowSrc.includes('fb') ||
    lowSrc.includes('ig ads') ||
    utmSrc === 'facebook' ||
    utmSrc === 'fb' ||
    utmSrc === 'ig' ||
    utmSrc === 'meta' ||
    page.includes('/metaads') ||
    page.includes('/ads/') ||
    ref.includes('/metaads') ||
    ref.includes('/ads/')
  ) {
    const how =
      utmSrc
        ? `UTM (${input.utm_source}/${input.utm_medium || '-'})`
        : page.includes('/metaads') || ref.includes('/metaads')
          ? 'Landing path /metaads/*'
          : 'Tag source Meta Ads';
    return { source: 'Meta Ads', detectionMethod: how };
  }

  if (lowSrc.includes('tiktok') || utmSrc.includes('tiktok') || ref.includes('tiktok.com')) {
    return { source: 'TikTok', detectionMethod: ref.includes('tiktok.com') ? 'Referrer tiktok.com' : 'UTM / Source TikTok' };
  }

  if (
    lowSrc.includes('instagram') ||
    lowSrc.includes('medsos') ||
    utmSrc.includes('instagram') ||
    ref.includes('instagram.com') ||
    page.includes('/contact-medsos') ||
    ref.includes('/contact-medsos')
  ) {
    return {
      source: 'Instagram',
      detectionMethod: ref.includes('instagram.com')
        ? 'Referrer l.instagram.com'
        : page.includes('/contact-medsos') || ref.includes('/contact-medsos')
          ? 'Halaman bio /contact-medsos'
          : 'Tag source Instagram',
    };
  }

  if (lowSrc.includes('referral') || utmMed === 'referral') {
    return { source: 'Referral', detectionMethod: 'Referrer eksternal / rujukan' };
  }

  if (lowSrc.includes('wa') || lowSrc.includes('whatsapp') || lowSrc === 'direct_wa' || (!page && !ref && !rawSource)) {
    return { source: 'WhatsApp organik', detectionMethod: 'Chat langsung ke nomor WhatsApp Busdev' };
  }

  return {
    source: 'Website/SEO',
    detectionMethod: ref.includes('google.') ? 'Pencarian organik Google (SEO)' : 'Halaman artikel / produk website dreamlab.id',
  };
}

/**
 * Format tampilan asal halaman (landing path) seperti contoh spesifikasi:
 * "/google-ads/maklon-parfum → /thankyou/google"
 */
export function formatLandingOrigin(pageUrl?: string | null, referrer?: string | null): string {
  const cleanPath = (u?: string | null): string | null => {
    if (!u) return null;
    const t = u.trim();
    if (!t) return null;
    try {
      if (t.startsWith('http://') || t.startsWith('https://')) {
        const parsed = new URL(t);
        if (parsed.hostname.includes('dreamlab.id')) {
          const p = parsed.pathname.replace(/\/+$/, '') || '/';
          return p;
        }
        return parsed.hostname.replace(/^www\./, '');
      }
    } catch {
      // fall through
    }
    if (t.startsWith('/')) return t.split('?')[0].replace(/\/+$/, '') || '/';
    return t.slice(0, 60);
  };

  const dest = cleanPath(pageUrl);
  const orig = cleanPath(referrer);

  if (orig && dest && orig !== dest) {
    return `${orig} → ${dest}`;
  }
  return dest || orig || '/';
}

/**
 * Role CRM:
 *  - 'admin' (kompatibel mundur dengan 'head')
 *  - 'busdev' (kompatibel mundur dengan 'sales')
 */
export type CrmRole = 'admin' | 'busdev' | 'head' | 'sales';
export type NormalizedCrmRole = 'admin' | 'busdev';

export function normalizeRole(role: string | null | undefined): NormalizedCrmRole {
  return role === 'admin' || role === 'head' ? 'admin' : 'busdev';
}

export function isAdminRole(role: string | null | undefined): boolean {
  return normalizeRole(role) === 'admin';
}

export function rolesMatch(actualRole: string | null | undefined, requiredRole: CrmRole): boolean {
  return normalizeRole(actualRole) === normalizeRole(requiredRole);
}

export interface CrmUserInfo {
  id: number;
  name: string;
  role: CrmRole;
}

/**
 * Aturan akses & edit:
 *  - Admin ('admin' / 'head') boleh membaca & mengubah semua lead.
 *  - Busdev ('busdev' / 'sales') HANYA boleh membaca & mengubah lead dengan owner_sales_id = dirinya
 *    (atau assigned_to sesuai namanya untuk baris lama yang belum punya owner_sales_id).
 */
export function canEditLead(
  user: { id?: number; name: string; role: CrmRole },
  assignedToOrOwnerId: string | number | null | undefined,
  ownerSalesId?: number | null
): boolean {
  if (isAdminRole(user.role)) return true;
  if (typeof ownerSalesId === 'number' && ownerSalesId > 0 && typeof user.id === 'number' && user.id > 0) {
    return ownerSalesId === user.id;
  }
  if (typeof assignedToOrOwnerId === 'number' && assignedToOrOwnerId > 0 && typeof user.id === 'number' && user.id > 0) {
    return assignedToOrOwnerId === user.id;
  }
  if (typeof assignedToOrOwnerId === 'string' && assignedToOrOwnerId.trim() !== '') {
    return assignedToOrOwnerId.trim().toLowerCase() === user.name.trim().toLowerCase();
  }
  return false;
}

export const canReadLead = canEditLead;

export const PRODUK_MAX = 120;
export const NOTE_MAX = 500;
export const MOQ_MAX = 10_000_000;

/**
 * Format link wa.me dengan sapaan pembuka personalisasi nama, sales, dan produk
 */
export function formatWaChatLink(
  phone: string | null | undefined,
  name?: string | null,
  sales?: string | null,
  produk?: string | null
): string | null {
  if (!phone) return null;
  let clean = String(phone).replace(/\D/g, '');
  if (!clean) return null;
  if (clean.startsWith('0')) clean = '62' + clean.slice(1);
  if (!clean.startsWith('62')) clean = '62' + clean;

  const sName = sales ? sales : 'tim BusDev';
  const kName = name ? `Kak ${name}` : 'Kak';
  const pName = produk ? `maklon ${produk}` : 'maklon kosmetik';

  const text = `Halo ${kName}, saya ${sName} dari Dreamlab Kosmetik.\nTerima kasih sudah menghubungi kami mengenai rencana ${pName}. Ada yang bisa saya bantu diskusikan?`;
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}
