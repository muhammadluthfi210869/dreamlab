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
    window.location.assign(buildThankyouUrl({ source, msg }));
  }, [message]);

  return <button onClick={handleClick} className={className}>{children}</button>;
}
