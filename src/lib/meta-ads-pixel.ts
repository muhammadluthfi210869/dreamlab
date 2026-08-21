"use client";

import { useEffect } from "react";

/**
 * meta-ads-pixel.ts — Browser pixel untuk CTA Meta Ads landing pages.
 *
 * Saat CTA (`a[href*="thankyou/metaads"]`) diklik:
 *   1. Generate eventID (dedup Browser + Server).
 *   2. Firing browser `fbq('track','Lead',{}, { eventID })` SEBELUM navigasi.
 *   3. Navigasi ke `/ads/thankyou/metaads/?event_id=...` — server route
 *      memakai eventID yang sama untuk Meta CAPI (dedup).
 *
 * Menghindari AddToCart lama yang tidak sesuai funnel Meta Ads.
 */
function makeEventId(): string {
  let id = "meta_";
  try {
    const uuid = crypto.randomUUID ? crypto.randomUUID() : "";
    id += uuid || `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
  } catch {
    id += `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
  }
  return id;
}

export function useMetaAdsCtaPixel(contentName: string): void {
  useEffect(() => {
    const ctas = document.querySelectorAll<HTMLAnchorElement>('a[href*="thankyou/metaads"]');
    const handler = (e: Event) => {
      const el = e.currentTarget as HTMLAnchorElement;
      e.preventDefault();
      const eventID = makeEventId();
      const fbq = (window as any).fbq;
      if (typeof fbq === "function") {
        fbq("track", "Lead", { content_name: contentName, content_category: "Landing Page Ads" }, { eventID });
      }
      const sep = el.href.includes("?") ? "&" : "?";
      window.location.assign(`${el.href}${sep}event_id=${encodeURIComponent(eventID)}`);
    };
    ctas.forEach((el) => el.addEventListener("click", handler));
    return () => ctas.forEach((el) => el.removeEventListener("click", handler));
  }, [contentName]);
}