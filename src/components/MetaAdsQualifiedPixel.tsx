"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Fires custom Meta Pixel event `qualified_complicated` on successful
 * Meta Ads Ramadan conversion arrival (/ads/thankyou/metaads/?p=meta-ramadan).
 */
export function MetaAdsQualifiedPixel() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const p = searchParams.get("p") || "";
    const from = searchParams.get("from") || "";
    if (p === "meta-ramadan" || from.includes("/metaads/ramadan")) {
      const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
      if (typeof fbq === "function") {
        fbq("trackCustom", "qualified_complicated", {
          content_name: "Meta Ads - Ramadan Promo",
          content_category: "Landing Page Ads",
          promotion: "ramadan",
        });
      }
    }
  }, [searchParams]);

  return null;
}
