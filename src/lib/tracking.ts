// Tracking Config — isi ID tracking kamu di sini
export const TRACKING = {
  GA4_ID: "", // G-XXXXXXXXXX
  ADS_ID: "", // AW-XXXXXXXXX
  ADS_LABEL: "", // conversion label
  META_PIXEL_ID: "", // Facebook Pixel ID
};

// Fire GA4 conversion event
export function fireConversion(source: string) {
  // dataLayer (untuk GTM)
  if (typeof window !== "undefined") {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: "conversion",
      source,
      page: window.location.pathname,
    });
  }

  // GA4 direct (jika gtag tersedia)
  if (TRACKING.GA4_ID && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "conversion", {
      send_to: TRACKING.GA4_ID,
      event_category: "lead",
      event_label: source,
      source,
    });
  }

  // Google Ads (jika di-set)
  if (TRACKING.ADS_ID && TRACKING.ADS_LABEL && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "conversion", {
      send_to: `${TRACKING.ADS_ID}/${TRACKING.ADS_LABEL}`,
      source,
    });
  }

  // Meta Pixel
  if (TRACKING.META_PIXEL_ID && typeof (window as any).fbq === "function") {
    (window as any).fbq("track", "Lead", { source });
  }
}
