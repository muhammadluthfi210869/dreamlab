import { getLeadSource, normalizeLeadSource } from './lead-source';

/**
 * wa-message.ts
 *
 * SATU-SATUNYA sumber template pesan WA untuk SEMUA tombol/trigger.
 * Pesan otomatis menyebutkan channel/sumber (Google, Google Ads, Meta Ads,
 * media sosial) berdasarkan letak halaman, supaya customer menyebut dari
 * mana mereka mengetahui Dreamlab. Atribusi juga disimpan di DB
 * (kolom `leads.source` + utm_*).
 */

/** Konteks produk berdasarkan URL halaman (era lama yang disukai user). */
export function getPageContext(url?: string): string {
  if (!url) return 'produk Dreamlab';
  if (url.includes('/maklon/')) return 'jasa maklon kosmetik';
  if (url.includes('/produk/parfum')) return 'produk parfum';
  if (url.includes('/produk/hair')) return 'produk haircare';
  if (url.includes('/produk/skin') || url.includes('/skincare')) return 'produk skincare';
  if (url.includes('/produk/')) return 'produk kosmetik';
  if (url.includes('/category/')) return 'informasi maklon';
  if (url.includes('/about-us')) return 'profil perusahaan';
  if (url.includes('/services')) return 'layanan maklon';
  return 'produk Dreamlab';
}

/**
 * Label channel yang tampil di pesan WA, dari source:
 *   organic     → Google
 *   google-ads  → Google Ads
 *   metaads     → Meta Ads
 *   medsos      → media sosial
 *   ads (lain)  → iklan Dreamlab
 */
export function getChannelLabel(source: string): string {
  switch (normalizeLeadSource(source)) {
    case 'google-ads':
      return 'Google Ads';
    case 'metaads':
      return 'Meta Ads';
    case 'medsos':
      return 'media sosial';
    case 'ads':
      return 'iklan Dreamlab';
    case 'dreampreneur':
      return 'Dreampreneur Vol. 2';
    default:
      return 'Google';
  }
}

/** Label channel dari halaman yang sedang dibuka (client-side). */
export function getPageChannelLabel(): string {
  const p = typeof window !== 'undefined' ? window.location.pathname : '';
  return getChannelLabel(getLeadSource(p));
}

/** Pesan WA standar yang tampil di chat customer + menyebut channel sumber. */
export function buildWaMessage(context?: string, source?: string, label?: string): string {
  const c = (context || 'produk Dreamlab').trim();
  const channel = label || (source ? getChannelLabel(source) : getPageChannelLabel());
  return `Hi Dreamlab, saya mengetahui dari ${channel}. Saya tertarik dengan ${c} dan ingin konsultasi untuk brand saya, apakah bisa dibantu?`;
}

/**
 * Tambahkan opener channel di depan pesan custom (mis. dari props halaman),
 * tanpa mengulang sapaan "Halo/Hi Dreamlab" di awal pesan.
 * `label` opsional untuk meng-override label channel (mis. kampanye event).
 */
export function buildChannelPrefixedMessage(body: string, source?: string, label?: string): string {
  const channel = label || (source ? getChannelLabel(source) : getPageChannelLabel());
  // Buang sapaan pembuka ("Halo Dreamlab, / Hi Dreamlab!") agar tidak dobel
  const cleaned = (body || '').trim().replace(/^(halo|hi)\s+dreamlab\s*[,!.\-–—:]?\s*/i, '');
  const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return `Hi Dreamlab, saya mengetahui dari ${channel}. ${capitalized}`;
}
