import { GTM_ID, GA4_ID, META_PIXEL_ID, TIKTOK_PIXEL_ID } from "@/components/TrackingScripts";

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

export function fireConversion(source: string) {
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
    (window as any).fbq("track", "Lead", { source });
  }

  // TikTok Pixel Lead event
  if (typeof (window as any).ttq === "object" && typeof (window as any).ttq.track === "function") {
    (window as any).ttq.track("Lead", { source });
  }
}

/**
 * Kirim data konversi ke nexerp.id CRM (auto-tracking lead)
 * Dipanggil dari ThankYouRoundRobin saat user klik WhatsApp
 * Fire-and-forget — tidak memblok pengalaman user
 */
export function trackToNexerpCRM(data: NexerpCRMData) {
  if (typeof window === "undefined") return;

  const payload = {
    source: data.source,
    pageUrl: data.pageUrl,
    pageTitle: data.pageTitle || "",
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
  };

  // Fire-and-forget — tidak perlu await
  fetch(`${NEXERP_API_URL}/api/marketing/landing-tracker/public/wa-conversion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {
    // Gagal kirim ke CRM -> tidak kritis, user tetap redirect ke WA
  });
}
