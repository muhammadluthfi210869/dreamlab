"use client";

import { useCallback } from "react";

interface WaRoundRobinButtonProps {
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * WhatsApp button that opens direct chat with pre-filled message.
 * FIXED: Previously linked to /thankyou/google/ which returned 410 (dead page).
 * Now opens WhatsApp directly with the provided message or page-aware context.
 */
export default function WaRoundRobinButton({ message, className, children }: WaRoundRobinButtonProps) {
  const handleClick = useCallback(() => {
    const text = message
      ? encodeURIComponent(message)
      : encodeURIComponent(
          `Halo Dreamlab! Saya tertarik dengan produk kosmetik. Bisa konsultasi?`
        );

    window.open(`https://wa.me/6285179450990?text=${text}`, "_blank");
  }, [message]);

  return (
    <button
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
}
