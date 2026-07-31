import { normalizeLeadSource } from './lead-source';

export function buildWhatsAppUrl(phone: string, message: string) {
  const encodedMessage = encodeURIComponent(message);

  let cleaned = (phone ?? '').replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('+')) cleaned = cleaned.slice(1);
  if (cleaned.startsWith('0')) cleaned = '62' + cleaned.slice(1);

  return `https://wa.me/${cleaned}?text=${encodedMessage}`;
}

/**
 * Peta channel → halaman thankyou.
 * Semua channel di luar google-ads / metaads / medsos DIANGGAP ORGANIK
 * → /thankyou/google/ (pesan otomatis menyebut "Google").
 */
export function getThankyouPath(source: string): string {
  switch (normalizeLeadSource(source)) {
    case 'google-ads':
      return '/ads/thankyou/google-ads/';
    case 'metaads':
      return '/ads/thankyou/metaads/';
    case 'medsos':
      return '/thankyou-medsos/';
    default:
      return '/thankyou/google/';
  }
}

/**
 * Bangun URL halaman thankyou dari channel + konteks/custom message.
 * Semua CTA (floating, tombol WA, form) DIWAJIBKAN lewat halaman thankyou
 * supaya atribusi (source, utm, gclid/fbclid) & event konversi tercatat dulu,
 * baru auto-redirect ke WhatsApp dengan pesan yang menyebut channel sumber.
 *
 * - source → channel (organic | google-ads | metaads | medsos | ads)
 * - ctx    → konteks produk utk buildWaMessage (mis. "produk parfum")
 * - msg    → custom message lengkap (artikel / brief form / dsb.) yang
 *            akan di-prefix channel oleh halaman thankyou
 */
export function buildThankyouUrl(opts: { source?: string; ctx?: string; msg?: string }): string {
  const source = opts.source || 'organic';
  const path = getThankyouPath(source);
  const params = new URLSearchParams();

  // Hanya source spesifik yang diteruskan; organik/ads → default thankyou google
  const src = normalizeLeadSource(source);
  if (src === 'google-ads' || src === 'metaads' || src === 'medsos') {
    params.set('source', source);
  }
  if (opts.ctx) params.set('ctx', opts.ctx);
  if (opts.msg) params.set('msg', opts.msg);

  // Teruskan atribusi iklan (gclid/fbclid/utm_*) dari URL halaman saat ini
  // ke halaman thankyou — khusus tombol CTA yang navigasi programatik
  // (bukan <a>), sehingga konversi ads tetap ter-atribusi ke klik.
  if (typeof window !== 'undefined') {
    const cur = new URLSearchParams(window.location.search);
    for (const key of ATTRIBUTION_PARAMS) {
      const val = cur.get(key);
      if (val && !params.has(key)) params.set(key, val);
    }
  }

  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

/** Parameter atribusi iklan yang wajib diteruskan ke halaman thankyou. */
export const ATTRIBUTION_PARAMS = [
  'gclid',
  'fbclid',
  'gbraid',
  'wbraid',
  'msclkid',
  'ttclid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_id',
  'utm_term',
  'utm_content',
] as const;
