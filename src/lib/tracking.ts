import { GTM_ID, GA4_ID } from "@/components/TrackingScripts";

/** URL ERP API — ganti di .env.local untuk production */
const NEXERP_API_URL = process.env.NEXT_PUBLIC_NEXERP_API_URL || "http://localhost:3002";

/** Data tambahan yang dikirim ke CRM untuk auto-tracking */
export interface NexerpCRMData {
  source: string;
  pageUrl: string;
  pageTitle?: string;
  campaign?: string;
  assignedTo?: string;
  assignedPhone?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  routeKey?: string;
  visitorId?: string;
  nama?: string;
  perusahaan?: string;
  hp?: string;
  produk?: string;
}

export function fireConversion(source: string, eventID?: string) {
  // dataLayer (GTM)
  if (typeof window !== "undefined") {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: "conversion",
      source,
      page: window.location.pathname,
    });
  }

// GA4 event via gtag
  if (typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "conversion", {
      send_to: GA4_ID,
      event_category: "lead",
      event_label: source,
      source,
    });
  }

  // Meta Pixel Lead event
  if (typeof (window as any).fbq === "function") {
    const opts = eventID ? { eventID } : {}; // dedup: eventID sama utk landing & thankyou
    (window as any).fbq("track", "Lead", { source }, opts);
  }

  // TikTok Pixel Lead event
  if (typeof (window as any).ttq === "object" && typeof (window as any).ttq.track === "function") {
    (window as any).ttq.track("Lead", { source });
  }
}

export interface AssignedLeadTrackingParams {
  source: string;
  eventId: string;
  assignmentId: string;
  sales: {
    id: string;
    name: string;
    phone?: string;
  };
  whatsappUrl: string;
  landingPage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface AssignedLeadTrackingResult {
  success: boolean;
  errors: string[];
}

/**
 * Menjalankan seluruh tracking konversi setelah sales assignment berhasil:
 * - Meta Pixel Lead (dengan eventID untuk dedup browser & CAPI)
 * - Google Ads conversion via gtag
 * - Google Analytics (GA4) generate_lead via gtag
 * - GTM dataLayer (lead_assigned & conversion)
 * - TikTok Pixel Lead
 * - NexERP CRM auto-tracking via navigator.sendBeacon
 * - whatsapp_redirect_attempted event
 *
 * Seluruh tracking dibungkus try/catch agar kegagalan salah satu tracker
 * tidak pernah memblokir redirect ke WhatsApp.
 */
export function fireAssignedLeadTracking(
  params: AssignedLeadTrackingParams
): AssignedLeadTrackingResult {
  const errors: string[] = [];
  if (typeof window === "undefined") {
    return { success: true, errors };
  }

  const {
    source,
    eventId,
    assignmentId,
    sales,
    whatsappUrl,
    landingPage,
    utmSource,
    utmMedium,
    utmCampaign,
  } = params;

  // 1. Meta Pixel Lead (dengan eventID sama untuk deduplikasi CAPI)
  try {
    const win = window as any;
    if (typeof win.fbq === "function") {
      win.fbq(
        "track",
        "Lead",
        {
          content_name: "WhatsApp Lead",
          content_category: source,
          value: 1,
          currency: "IDR",
          sales_id: sales.id,
          sales_name: sales.name,
        },
        { eventID: eventId }
      );
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`Meta Pixel error: ${msg}`);
    console.warn("[Tracking] Meta Pixel Lead error:", err);
  }

  // 2. Google Ads conversion via gtag
  try {
    const win = window as any;
    if (typeof win.gtag === "function") {
      win.gtag("event", "conversion", {
        send_to: "AW-10940853039/hTv7CJOs-OwaEK_WgOEo",
        value: 1.0,
        currency: "IDR",
        transaction_id: eventId,
      });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`Google Ads gtag error: ${msg}`);
    console.warn("[Tracking] Google Ads conversion error:", err);
  }

  // 3. Google Analytics (GA4) generate_lead via gtag
  try {
    const win = window as any;
    if (typeof win.gtag === "function") {
      win.gtag("event", "generate_lead", {
        send_to: GA4_ID,
        event_category: "lead",
        event_label: source,
        sales_id: sales.id,
        sales_name: sales.name,
        assignment_id: assignmentId,
        event_id: eventId,
        value: 1,
      });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`GA4 gtag error: ${msg}`);
    console.warn("[Tracking] GA4 generate_lead error:", err);
  }

  // 4. dataLayer.push (GTM)
  try {
    const win = window as any;
    win.dataLayer = win.dataLayer || [];
    win.dataLayer.push({
      event: "lead_assigned",
      source,
      page: landingPage || window.location.pathname,
      sales_id: sales.id,
      sales_name: sales.name,
      assignment_id: assignmentId,
      event_id: eventId,
      whatsapp_url: whatsappUrl,
    });
    win.dataLayer.push({
      event: "conversion",
      source,
      page: window.location.pathname,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`dataLayer error: ${msg}`);
    console.warn("[Tracking] dataLayer error:", err);
  }

  // 5. TikTok Pixel Lead
  try {
    const win = window as any;
    if (typeof win.ttq === "object" && typeof win.ttq.track === "function") {
      win.ttq.track("Lead", {
        content_id: sales.id,
        content_type: "product",
        source,
        event_id: eventId,
      });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`TikTok Pixel error: ${msg}`);
    console.warn("[Tracking] TikTok Pixel error:", err);
  }

  // 6. NexERP CRM auto-tracking via navigator.sendBeacon
  try {
    trackToNexerpCRM({
      source,
      pageUrl: landingPage || (typeof window !== "undefined" ? window.location.href : ""),
      assignedTo: sales.name,
      assignedPhone: sales.phone,
      utmSource,
      utmMedium,
      utmCampaign,
      routeKey: assignmentId,
      visitorId: eventId,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`NexERP CRM error: ${msg}`);
    console.warn("[Tracking] NexERP CRM error:", err);
  }

  // 7. Track Redirect Attempted event (Membedakan metrik: assignment vs redirect attempted)
  try {
    const win = window as any;
    if (win.dataLayer) {
      win.dataLayer.push({
        event: "whatsapp_redirect_attempted",
        sales_id: sales.id,
        assignment_id: assignmentId,
        event_id: eventId,
        timestamp: new Date().toISOString(),
      });
    }
    if (typeof win.gtag === "function") {
      win.gtag("event", "whatsapp_redirect_attempted", {
        sales_id: sales.id,
        assignment_id: assignmentId,
        event_id: eventId,
      });
    }
  } catch (err) {
    // Non-critical
  }

  return { success: errors.length === 0, errors };
}

/**
 * Kirim data konversi ke nexerp.id CRM (auto-tracking lead).
 * Menggunakan navigator.sendBeacon() agar data tetap terkirim saat browser berpindah halaman.
 * Fallback ke fetch(..., { keepalive: true }).
 */
export function trackToNexerpCRM(data: NexerpCRMData) {
  if (typeof window === "undefined") return;

  const payload = JSON.stringify({
    source: data.source,
    pageUrl: data.pageUrl,
    pageTitle: data.pageTitle || (typeof document !== "undefined" ? document.title : ""),
    campaign: data.campaign || "",
    assignedTo: data.assignedTo || "",
    assignedPhone: data.assignedPhone || "",
    utmSource: data.utmSource || "",
    utmMedium: data.utmMedium || "",
    utmCampaign: data.utmCampaign || "",
    routeKey: data.routeKey || "",
    visitorId: data.visitorId || "",
    nama: data.nama || "",
    perusahaan: data.perusahaan || "",
    hp: data.hp || "",
    produk: data.produk || "",
    timestamp: new Date().toISOString(),
  });

  const url = `${NEXERP_API_URL}/api/marketing/landing-tracker/public/wa-conversion`;

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    try {
      const blob = new Blob([payload], { type: "application/json" });
      const sent = navigator.sendBeacon(url, blob);
      if (sent) return;
    } catch {
      // Fall through to keepalive fetch
    }
  }

  try {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Non-blocking
  }
}
