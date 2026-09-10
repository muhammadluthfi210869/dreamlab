/**
 * lead-source.ts
 *
 * Klasifikasi dan normalisasi channel sumber lead Dreamlab.
 * Seluruh source menggunakan satu antrean round robin global.
 * Source tetap dicatat untuk analisis channel.
 */

export type LeadSource =
  | "meta-ads"
  | "google-ads"
  | "social-media"
  | "google-organic"
  | "direct"
  | "unknown";

export interface SourceDetectionInput {
  sourceParam?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  referrer?: string | null;
  pathname?: string | null;
}

/**
 * Normalisasi string source mentah ke dalam tipe resmi LeadSource.
 */
export function normalizeSourceToLeadSource(raw?: string | null): LeadSource {
  if (!raw) return "unknown";
  const r = raw.toLowerCase().trim();

  // Meta Ads variants
  if (
    r === "meta-ads" ||
    r === "metaads" ||
    r === "meta" ||
    r.startsWith("meta-") ||
    r === "facebook" ||
    r === "fb" ||
    r === "instagram" ||
    r === "ig" ||
    r.includes("facebook") ||
    r.includes("instagram") ||
    r.startsWith("promo-kemerdekaan")
  ) {
    return "meta-ads";
  }

  // Google Ads variants
  if (
    r === "google-ads" ||
    r === "googleads" ||
    r === "google-cpc" ||
    r === "cpc" ||
    r === "gads" ||
    (r.startsWith("google-") && r !== "google-organic" && r !== "google-search")
  ) {
    return "google-ads";
  }

  // Social Media variants
  if (
    r === "social-media" ||
    r === "medsos" ||
    r === "social" ||
    r === "media-sosial" ||
    r === "linktree" ||
    r === "tiktok" ||
    r === "youtube" ||
    r === "linkedin"
  ) {
    return "social-media";
  }

  // Google Organic
  if (
    r === "google-organic" ||
    r === "organic" ||
    r === "google-search"
  ) {
    return "google-organic";
  }

  // Direct
  if (r === "direct") {
    return "direct";
  }

  return "unknown";
}

/**
 * Identifikasi source berdasarkan prioritas:
 * 1. Query parameter source
 * 2. utm_source, utm_medium, dan utm_campaign
 * 3. Referrer
 * 4. Path landing page
 * 5. Fallback direct atau unknown
 */
export function identifyLeadSource(input: SourceDetectionInput): LeadSource {
  // 1. Query parameter source
  if (input.sourceParam && input.sourceParam.trim() !== '') {
    const fromParam = normalizeSourceToLeadSource(input.sourceParam);
    if (fromParam !== 'unknown') {
      return fromParam;
    }
  }

  // 2. utm_source, utm_medium, utm_campaign
  const utmSrc = (input.utmSource || '').toLowerCase();
  const utmMed = (input.utmMedium || '').toLowerCase();
  const utmCmp = (input.utmCampaign || '').toLowerCase();

  if (
    utmSrc.includes('facebook') ||
    utmSrc.includes('instagram') ||
    utmSrc.includes('meta') ||
    utmMed.includes('paid_social') ||
    utmMed.includes('paidsocial')
  ) {
    return 'meta-ads';
  }

  if (
    utmSrc.includes('google') &&
    (utmMed.includes('cpc') || utmMed.includes('paid') || utmMed.includes('ads') || utmCmp.includes('search'))
  ) {
    return 'google-ads';
  }

  if (
    utmMed.includes('social') ||
    utmSrc.includes('tiktok') ||
    utmSrc.includes('youtube') ||
    utmSrc.includes('linkedin')
  ) {
    return 'social-media';
  }

  // 3. Referrer
  const ref = (input.referrer || '').toLowerCase();
  if (ref) {
    if (ref.includes('facebook.com') || ref.includes('instagram.com') || ref.includes('fb.com')) {
      return 'social-media';
    }
    if (ref.includes('tiktok.com') || ref.includes('t.co') || ref.includes('twitter.com') || ref.includes('linkedin.com')) {
      return 'social-media';
    }
    if (ref.includes('google.') || ref.includes('googleusercontent.')) {
      return 'google-organic';
    }
  }

  // 4. Path landing page
  const path = (input.pathname || '').toLowerCase();
  if (path) {
    if (path.includes('google-ads') || path.includes('/google-ads/')) {
      return 'google-ads';
    }
    if (path.startsWith('/ads/maklon-') || path.includes('/ads/thankyou/metaads') || path.includes('metaads')) {
      return 'meta-ads';
    }
    if (path.startsWith('/contact-medsos') || path.startsWith('/thankyou-medsos')) {
      return 'social-media';
    }
    if (path.startsWith('/ads/')) {
      return 'meta-ads';
    }
  }

  // 5. Fallback: tanpa UTM dan referrer -> direct
  if (!utmSrc && !utmMed && !utmCmp && !ref) {
    return 'direct';
  }

  return 'unknown';
}

/** Backwards-compatible helper for legacy callers */
export function getLeadSource(pathname?: string): string {
  const p = (
    pathname ||
    (typeof window !== 'undefined' ? window.location.pathname : '') ||
    ''
  ).toLowerCase();

  if (!p) return 'organic';
  if (p.startsWith('/contact-medsos') || p.startsWith('/thankyou-medsos')) return 'medsos';
  if (p.includes('google-ads') || p.includes('googleads')) return 'google-ads';
  if (p.includes('meta') || p.startsWith('/ads/maklon-')) return 'metaads';
  if (p.startsWith('/ads/')) return 'ads';
  return 'organic';
}

/** Backwards-compatible helper for legacy callers */
export function normalizeLeadSource(raw?: string | null): string {
  const r = (raw || '').toLowerCase().trim();
  if (r.startsWith('meta-') || r === 'metaads' || r === 'meta' || r === 'meta-ads') return 'metaads';
  if (r === 'google-ads' || r === 'googleads') return 'google-ads';
  if (r === 'medsos' || r === 'linktree' || r === 'social' || r === 'social-media' || r === 'media-sosial') return 'medsos';
  if (r === 'ads' || r === 'direct') return 'ads';
  if (r === 'dreampreneur' || r.startsWith('dreampreneur')) return 'dreampreneur';
  if (r.startsWith('promo-kemerdekaan')) return 'metaads';
  return 'organic';
}
