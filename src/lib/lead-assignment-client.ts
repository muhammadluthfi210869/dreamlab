/**
 * lead-assignment-client.ts
 *
 * Client helper untuk frontend memanggil POST /api/leads/assign.
 * Menangani pembuatan eventId (UUID), in-flight deduplication, caching per-sesi,
 * dan event tracking ke window.dataLayer & fireConversion.
 */

import { fireConversion } from '@/lib/tracking';

export interface LeadAssignmentRequest {
  eventId?: string;
  phone?: string;
  source?: string;
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  messageKey?: string;
}

export interface LeadAssignmentResponse {
  success: boolean;
  assignmentId: string;
  source: string;
  sales: {
    id: string;
    name: string;
    phone?: string;
  };
  whatsappUrl: string;
  timing?: {
    redisMs?: number;
    neonMs?: number;
    totalMs?: number;
  };
  error?: string;
}

// In-flight cache untuk mencegah race condition double click atau React Strict Mode
const inFlightRequests = new Map<string, Promise<LeadAssignmentResponse>>();
// Session cache in-memory untuk menyimpan assignment per eventId selama tab terbuka
const sessionCache = new Map<string, LeadAssignmentResponse>();

export function generateUuidV4(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const VISITOR_ID_KEY = 'dl_visitor_id';

/**
 * Fingerprint visitor yang STABIL lintas klik/halaman/tab (localStorage & Cookie).
 * Ini kunci agar dedup 24 jam + sticky browser benar-benar aktif:
 * tanpa fingerprint yang sama, setiap klik CTA = lead baru lagi,
 * sehingga satu orang di browser yang sama bisa double chat / ganti BusDev.
 *
 * Urutan: localStorage → sessionStorage → Cookie dreamlab_vid → UUID ephemeral baru.
 */
export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return '';

  try {
    const stored =
      window.localStorage.getItem(VISITOR_ID_KEY) ||
      window.sessionStorage.getItem(VISITOR_ID_KEY);
    if (stored && /^[0-9a-zA-Z_-]{16,64}$/.test(stored)) {
      // Replikasikan ke storage lain agar konsisten lintas mode
      try {
        window.localStorage.setItem(VISITOR_ID_KEY, stored);
      } catch {
        /* abaikan */
      }
      return stored;
    }

    // Fallback ke cookie dreamlab_vid jika ada
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|;\s*)dreamlab_vid=([^;]+)/);
      if (match && match[1] && /^[0-9a-zA-Z_-]{16,64}$/.test(match[1])) {
        try {
          window.localStorage.setItem(VISITOR_ID_KEY, match[1]);
        } catch {
          /* abaikan */
        }
        return match[1];
      }
    }

    const fresh = generateUuidV4();
    let persisted = false;
    try {
      window.localStorage.setItem(VISITOR_ID_KEY, fresh);
      persisted = true;
    } catch {
      try {
        window.sessionStorage.setItem(VISITOR_ID_KEY, fresh);
        persisted = true;
      } catch {
        /* storage diblokir (private mode) — tetap pakai ephemeral */
      }
    }
    void persisted;
    return fresh;
  } catch {
    return generateUuidV4();
  }
}

/** Flag test dari URL (?test=1 / ?test_rr=true) — selaras dengan server. */
function isTestModeFromUrl(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('test') === '1' || params.get('test_rr') === 'true';
  } catch {
    return false;
  }
}

/**
 * Mendapatkan eventId yang valid (UUID v4).
 * - Jika explicitId diberikan dan valid UUID, gunakan (idempotent untuk journey yang sama / page refresh).
 * - Jika tidak diberikan, buat UUID v4 baru (CTA baru menghasilkan assignment baru, tidak terjebak).
 */
export function getOrCreateEventId(explicitId?: string): string {
  if (explicitId && explicitId.trim() !== '') {
    let clean = explicitId.trim();
    if (clean.startsWith('meta_')) {
      clean = clean.slice(5);
    }
    if (UUID_V4_REGEX.test(clean)) {
      return clean;
    }
  }

  return generateUuidV4();
}

/**
 * Memanggil backend endpoint POST /api/leads/assign untuk mendapatkan assignment BusDev.
 */
export async function assignLeadViaClient(
  opts: LeadAssignmentRequest = {}
): Promise<LeadAssignmentResponse> {
  const eventId = getOrCreateEventId(opts.eventId);
  const visitorId = getOrCreateVisitorId();

  // Jika sudah ada di cache sesi lokal, gunakan kembali (idempotensi cepat per eventId)
  if (sessionCache.has(eventId)) {
    return sessionCache.get(eventId)!;
  }

  // Jika sedang ada request yang berjalan untuk eventId yang sama, tunggu promise yang sama
  if (inFlightRequests.has(eventId)) {
    return inFlightRequests.get(eventId)!;
  }

  const promise = (async () => {
    try {
      let landingPage = opts.landingPage;
      let referrer = opts.referrer;
      let utmSource = opts.utmSource;
      let utmMedium = opts.utmMedium;
      let utmCampaign = opts.utmCampaign;
      let clientPhone = opts.phone;

      if (typeof window !== 'undefined') {
        landingPage = landingPage || window.location.pathname;
        referrer = referrer || document.referrer;
        const params = new URLSearchParams(window.location.search);
        utmSource = utmSource || params.get('utm_source') || undefined;
        utmMedium = utmMedium || params.get('utm_medium') || undefined;
        utmCampaign = utmCampaign || params.get('utm_campaign') || undefined;

        if (!clientPhone) {
          clientPhone =
            params.get('phone') ||
            params.get('hp') ||
            params.get('wa') ||
            params.get('nomor') ||
            undefined;
        }

        if (!clientPhone) {
          try {
            clientPhone = window.localStorage.getItem('dl_client_phone') || undefined;
          } catch {
            /* abaikan */
          }
        }
      }

      // Normalisasi nomor telepon klien
      if (clientPhone) {
        let clean = clientPhone.replace(/[^0-9]/g, '');
        if (clean.startsWith('0')) {
          clean = '62' + clean.slice(1);
        }
        if (clean.length >= 9) {
          clientPhone = clean;
          try {
            window.localStorage.setItem('dl_client_phone', clean);
          } catch {
            /* abaikan */
          }
        } else {
          clientPhone = undefined;
        }
      }

      const res = await fetch('/api/leads/assign/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        body: JSON.stringify({
          eventId,
          visitorId,
          phone: clientPhone,
          test: isTestModeFromUrl() || undefined,
          source: opts.source,
          landingPage,
          referrer,
          utmSource,
          utmMedium,
          utmCampaign,
          messageKey: opts.messageKey,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data: LeadAssignmentResponse = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Gagal melakukan assignment lead');
      }

      // Simpan di session cache
      sessionCache.set(eventId, data);

      // Simpan sticky sales dan client phone di browser
      if (typeof window !== 'undefined') {
        try {
          if (data.sales) {
            window.localStorage.setItem('dl_sticky_sales', JSON.stringify(data.sales));
          }
          if (clientPhone) {
            window.localStorage.setItem('dl_client_phone', clientPhone);
          }
        } catch {
          /* abaikan */
        }
      }

      // Tracking Analytics
      if (typeof window !== 'undefined') {
        // GTM dataLayer
        const dl = (window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer;
        if (Array.isArray(dl)) {
          dl.push({
            event: 'whatsapp_lead_assigned',
            source: data.source,
            sales_id: data.sales.id,
            assignment_id: data.assignmentId,
          });
        }

        // Meta & TikTok Pixel conversion
        fireConversion(data.source, eventId);
      }

      return data;
    } finally {
      inFlightRequests.delete(eventId);
    }
  })();

  inFlightRequests.set(eventId, promise);
  return promise;
}
