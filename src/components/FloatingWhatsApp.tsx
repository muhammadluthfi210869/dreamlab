"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function FloatingWhatsApp() {
  return (
    <div className="fixed bottom-8 right-8 z-50 wa-float">
      <Link
        href="/thankyou/google/"
        className="flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform group"
        aria-label="Contact via WhatsApp"
      >
        <MessageCircle className="w-8 h-8 fill-current" />

        <span className="absolute right-20 bg-white text-brand-black px-4 py-2 rounded-lg text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100">
          Chat with us!
        </span>
      </Link>
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