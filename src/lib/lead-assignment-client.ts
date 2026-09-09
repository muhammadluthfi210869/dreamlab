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
  };
  whatsappUrl: string;
}

// In-flight cache untuk mencegah race condition double click atau React Strict Mode
const inFlightRequests = new Map<string, Promise<LeadAssignmentResponse>>();
// Session cache in-memory untuk menyimpan assignment per eventId selama tab terbuka
const sessionCache = new Map<string, LeadAssignmentResponse>();

/**
 * Mendapatkan atau membuat UUID eventId yang stabil di client tab.
 */
export function getOrCreateEventId(explicitId?: string): string {
  if (explicitId && explicitId.trim() !== '') {
    return explicitId;
  }

  if (typeof window !== 'undefined') {
    const sessionKey = 'dreamlab_lead_event_id';
    const existing = window.sessionStorage.getItem(sessionKey);
    if (existing) {
      return existing;
    }
    const newId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : 'evt_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    try {
      window.sessionStorage.setItem(sessionKey, newId);
    } catch {
      // Ignore if sessionStorage is disabled/full
    }
    return newId;
  }

  return 'evt_' + Date.now();
}

/**
 * Memanggil backend endpoint POST /api/leads/assign untuk mendapatkan assignment BusDev.
 */
export async function assignLeadViaClient(
  opts: LeadAssignmentRequest = {}
): Promise<LeadAssignmentResponse> {
  const eventId = getOrCreateEventId(opts.eventId);

  // Jika sudah ada di cache sesi lokal, gunakan kembali (idempotensi cepat)
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

      if (typeof window !== 'undefined') {
        landingPage = landingPage || window.location.pathname;
        referrer = referrer || document.referrer;
        const params = new URLSearchParams(window.location.search);
        utmSource = utmSource || params.get('utm_source') || undefined;
        utmMedium = utmMedium || params.get('utm_medium') || undefined;
        utmCampaign = utmCampaign || params.get('utm_campaign') || undefined;
      }

      const res = await fetch('/api/leads/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        body: JSON.stringify({
          eventId,
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

      // Simpan di session cache
      sessionCache.set(eventId, data);

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
    } catch {
      // Fallback lokal jika fetch network gagal (Irma)
      const fallbackUrl = `https://wa.me/6285133188827?text=${encodeURIComponent(
        'Halo Dreamlab, saya ingin konsultasi untuk membuat brand produk saya. Bisa dibantu?'
      )}`;

      const fallbackData: LeadAssignmentResponse = {
        success: true,
        assignmentId: 'fb_' + Date.now(),
        source: opts.source || 'unknown',
        sales: {
          id: 'irma',
          name: 'Irma',
        },
        whatsappUrl: fallbackUrl,
      };

      sessionCache.set(eventId, fallbackData);
      return fallbackData;
    } finally {
      inFlightRequests.delete(eventId);
    }
  })();

  inFlightRequests.set(eventId, promise);
  return promise;
}
