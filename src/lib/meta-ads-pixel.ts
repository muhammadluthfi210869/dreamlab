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
import { ATTRIBUTION_PARAMS } from "@/lib/lead-routing";

function makeEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
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

      // Parse target URL dan teruskan parameter atribusi serta 'from'
      const origin = typeof window !== "undefined" ? window.location.origin : "https://dreamlab.id";
      const targetUrl = new URL(el.getAttribute("href") || el.href, origin);
      const current = new URLSearchParams(window.location.search);

      for (const key of ATTRIBUTION_PARAMS) {
        const val = current.get(key);
        if (val && !targetUrl.searchParams.has(key)) {
          targetUrl.searchParams.set(key, val);
        }
      }

      if (!targetUrl.searchParams.has("source")) {
        targetUrl.searchParams.set("source", current.get("source") || "metaads");
      }

      if (!targetUrl.searchParams.has("from")) {
        targetUrl.searchParams.set("from", window.location.pathname);
      }

      targetUrl.searchParams.set("event_id", eventID);

      window.location.assign(targetUrl.toString());
    };
    ctas.forEach((el) => el.addEventListener("click", handler));
    return () => ctas.forEach((el) => el.removeEventListener("click", handler));
  }, [contentName]);
}