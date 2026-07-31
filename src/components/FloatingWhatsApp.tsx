"use client";

import { useCallback } from "react";
import { MessageCircle } from "lucide-react";
import { buildThankyouUrl } from "@/lib/lead-routing";
import { getPageContext } from "@/lib/wa-message";
import { getLeadSource } from "@/lib/lead-source";

export default function FloatingWhatsApp() {
  const handleClick = useCallback(() => {
    const source = getLeadSource(window.location.pathname);
    const ctx = getPageContext(window.location.href);
    // Semua klik → halaman thankyou sesuai channel, lalu auto-redirect ke WA
    window.location.assign(buildThankyouUrl({ source, ctx }));
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50 wa-float">
      <button
        onClick={handleClick}
        className="flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform group cursor-pointer border-0"
        aria-label="Contact via WhatsApp"
      >
        <MessageCircle className="w-8 h-8 fill-current" />

        <span className="absolute right-20 bg-white text-brand-black px-4 py-2 rounded-lg text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100">
          Konsultasi Gratis
        </span>
      </button>
      <style>{`
        .wa-float {
          animation: wa-appear 0.4s ease-out 1s both;
        }
        @media (prefers-reduced-motion: reduce) {
          .wa-float {
            animation: none;
          }
        }
        @keyframes wa-appear {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}