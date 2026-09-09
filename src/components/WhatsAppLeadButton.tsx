"use client";

import React, { useState, useCallback } from 'react';
import { assignLeadViaClient } from '@/lib/lead-assignment-client';

export interface WhatsAppLeadButtonProps {
  source?: string;
  messageKey?: string;
  className?: string;
  children?: React.ReactNode;
  loadingText?: string;
  onClickBefore?: () => void;
  ariaLabel?: string;
}

export default function WhatsAppLeadButton({
  source,
  messageKey,
  className = "inline-flex items-center justify-center px-6 py-3 bg-[#25D366] text-white font-bold rounded-xl hover:opacity-90 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
  children = "Konsultasi via WhatsApp",
  loadingText = "Menghubungkan...",
  onClickBefore,
  ariaLabel = "Konsultasi via WhatsApp",
}: WhatsAppLeadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (isLoading) return;

      setIsLoading(true);
      if (onClickBefore) {
        try {
          onClickBefore();
        } catch {
          // Abaikan error callback tambahan agar flow WhatsApp tetap jalan
        }
      }

      try {
        const assignment = await assignLeadViaClient({
          source,
          messageKey,
        });

        if (assignment && assignment.whatsappUrl) {
          window.location.href = assignment.whatsappUrl;
        }
      } catch {
        // Fallback langsung ke wa.me
        window.location.href = "https://wa.me/6285133188827?text=Halo%20Dreamlab";
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, source, messageKey, onClickBefore]
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      aria-label={ariaLabel}
      className={className}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
