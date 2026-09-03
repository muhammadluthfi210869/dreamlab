"use client";

import { useCallback } from "react";
import { buildThankyouUrl } from "@/lib/lead-routing";
import { getLeadSource } from "@/lib/lead-source";

interface WaRoundRobinButtonProps {
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * WhatsApp CTA button.
 * Semua klik → halaman thankyou sesuai channel (organik → /thankyou/google/),
 * custom message (mis. judul artikel) dikirim via ?msg= lalu di-prefix channel
 * oleh halaman thankyou; atribusi & conversion dicatat di halaman thankyou,
 * kemudian auto-redirect ke WhatsApp.
 */
export default function WaRoundRobinButton({ message, className, children }: WaRoundRobinButtonProps) {
  const handleClick = useCallback(() => {
    const source = getLeadSource(window.location.pathname);
    const msg = message || document.title || "produk Dreamlab";
    // Lead attribution journey (Batch 4 §3) — pass source page + CTA id.
    const from = window.location.pathname.slice(0, 500);
    window.location.assign(buildThankyouUrl({ source, msg, from, cta: 'wa-round-robin-button' }));
  }, [message]);

  return <button onClick={handleClick} className={className}>{children}</button>;
}
