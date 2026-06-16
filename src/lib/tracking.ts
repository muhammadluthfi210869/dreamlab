import { GTM_ID, GA4_ID, META_PIXEL_ID } from "@/components/TrackingScripts";

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
}
