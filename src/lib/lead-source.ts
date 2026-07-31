/**
 * lead-source.ts
 *
 * Atribusi sumber lead BERDASARKAN LETAK TRIGGER (path halaman),
 * supaya konsisten & mudah dilaporkan:
 *
 *   organic     → seluruh halaman website normal (floating, artikel, produk)
 *   google-ads  → /google-ads/* dan /ads/thankyou/google-ads/
 *   metaads     → /ads/* (Meta), /metaads, halaman meta-*
 *   medsos      → /contact-medsos/ (linktree) dan /thankyou-medsos
 *   ads         → halaman /ads/* lain (di luar google-ads/metaads)
 *
 * UTM (utm_source/dll) tetap disimpan terpisah untuk detail kampanye.
 */

/** Tentukan source dari path halaman saat ini. */
export function getLeadSource(pathname?: string): string {
  const p = (
    pathname ||
    (typeof window !== 'undefined' ? window.location.pathname : '') ||
    ''
  ).toLowerCase();

  if (!p) return 'organic';

  // Linktree / media sosial
  if (p.startsWith('/contact-medsos') || p.startsWith('/thankyou-medsos')) {
    return 'medsos';
  }

  // Google Ads (halaman landing + thankyou)
  if (p.includes('google-ads') || p.includes('googleads')) {
    return 'google-ads';
  }

  // Meta Ads (halaman /ads/thankyou/metaads, /metaads, /produk/metaads,
  // dan landing /ads/maklon-* yang CTA-nya memakai source=meta-*, dst.)
  if (p.includes('meta') || p.startsWith('/ads/maklon-')) {
    return 'metaads';
  }

  // Halaman /ads/* lainnya
  if (p.startsWith('/ads/')) {
    return 'ads';
  }

  // Semua halaman organik (home, artikel, produk, kategori, dll.)
  return 'organic';
}

/** Normalisasi source mentah (mis. 'meta-parfum' → 'metaads') utk laporan. */
export function normalizeLeadSource(raw?: string | null): string {
  const r = (raw || '').toLowerCase().trim();

  if (r.startsWith('meta-') || r === 'metaads' || r === 'meta') return 'metaads';
  if (r === 'google-ads' || r === 'googleads') return 'google-ads';
  if (r === 'medsos' || r === 'linktree' || r === 'social' || r === 'media-sosial') return 'medsos';
  if (r === 'ads' || r === 'direct') return 'ads';
  return 'organic';
}
