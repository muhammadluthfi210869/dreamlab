"use client";

import { useCallback } from "react";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const handleClick = useCallback(() => {
    const pageTitle = document.title || "Dreamlab";
    const pageUrl = window.location.href;

    let context = "produk kosmetik";
    if (pageUrl.includes("/maklon/")) context = "jasa maklon";
    else if (pageUrl.includes("/produk/skincare")) context = "produk skincare";
    else if (pageUrl.includes("/produk/parfum")) context = "produk parfum";
    else if (pageUrl.includes("/about-us")) context = "profil perusahaan";

    const message = encodeURIComponent(
      `Halo Dreamlab! Saya ingin tahu lebih lanjut tentang ${context}. Bisa dibantu?`
    );

    window.open(`https://wa.me/6285179450990?text=${message}`, "_blank");
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