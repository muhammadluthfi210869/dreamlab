"use client";

import { useEffect } from "react";
import { ATTRIBUTION_PARAMS } from "@/lib/lead-routing";

/**
 * AttributionForwarder
 *
 * Meneruskan parameter atribusi iklan dari halaman landing ke halaman
 * thankyou ketika user mengklik CTA BERUPA <a>/<Link> (yang href-nya statis,
 * mis. CtaSection, ProductHero, ProductDetailTabs → /thankyou/google/).
 *
 * Masalah yang diselesaikan:
 *  - CTA <Link> statis ke /thankyou/... menyebabkan ?gclid= (Google) /
 *    ?fbclid= (Meta) / utm_* yang dibawa ad click HILANG saat navigasi
 *    → konversi ads tidak ter-atribusi ke klik.
 *
 * Solusi: pada fase capture, href link CTA ditimpa dengan param atribusi
 * dari URL halaman saat ini. Param dari ad click selalu diutamakan, param
 * yang belum ada diisi (backfill).
 *
 * Untuk tombol CTA yang navigasi programatik (floating WA, dsb.), atribusi
 * sudah diteruskan langsung oleh buildThankyouUrl() — jadi keduanya saling
 * melengkapi. Dipasang di root layout, aman untuk semua halaman.
 */
export default function AttributionForwarder() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Cari anchor terdekat (target bisa elemen anak di dalam <Link>)
      const target = (e.target as HTMLElement | null)?.closest?.("a");
      if (!target) return;

      const raw = target.getAttribute("href") || "";
      if (!raw.includes("thankyou")) return;

      const current = new URLSearchParams(window.location.search);
      const base = raw.split("?")[0];
      const qs = new URLSearchParams(raw.split("?")[1] || "");

      let changed = false;
      for (const key of ATTRIBUTION_PARAMS) {
        const val = current.get(key);
        if (val && !qs.has(key)) {
          qs.set(key, val);
          changed = true;
        }
      }
      if (!changed) return;

      target.setAttribute("href", `${base}?${qs.toString()}`);
    };

    // Capture phase → berjalan sebelum handler Link Next.js membaca href
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
