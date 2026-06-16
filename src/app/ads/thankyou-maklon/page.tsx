"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function ThankYouMaklon() {
  const numbers = ["628777650657", "6281952417051"];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [source, setSource] = useState("direct");

  useEffect(() => {
    // 1. Baca source dari URL parameter
    const params = new URLSearchParams(window.location.search);
    const src = params.get("source") || "direct";
    setSource(src);

    // 2. Kirim ke dataLayer GTM
    if (typeof window !== "undefined") {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: "conversion",
        source: src,
        campaign: src,
        page: window.location.pathname,
      });
    }

    // 3. Rotate WA index
    const saved = localStorage.getItem("waIndex");
    if (saved !== null) {
      setCurrentIndex(parseInt(saved, 10) % numbers.length);
    }
  }, [numbers.length]);

  const getWAMessage = () => {
    const msgs = {
      "meta-parfum": "Halo Dreamlab, saya dari landing page Meta Ads Parfum dan ingin konsultasi buat brand parfum saya.",
      "meta-skincare": "Halo Dreamlab, saya dari landing page Meta Ads Skincare dan ingin konsultasi buat brand skincare saya.",
      "meta-haircare": "Halo Dreamlab, saya dari landing page Meta Ads Haircare dan ingin konsultasi buat brand haircare saya.",
      "google-ads": "Halo Dreamlab, saya dari Google Ads dan tertarik untuk memulai brand kosmetik saya sendiri.",
      organic: "Halo Dreamlab, saya dari pencarian Google dan ingin konsultasi buat brand kosmetik saya.",
    };
    return msgs[source as keyof typeof msgs] || "Halo Dreamlab, saya ingin konsultasi buat brand kosmetik saya sendiri.";
  };

  const handleWaClick = useCallback(() => {
    const phone = numbers[currentIndex];
    const msg = getWAMessage();
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    const next = (currentIndex + 1) % numbers.length;
    setCurrentIndex(next);
    localStorage.setItem("waIndex", String(next));
    window.open(url, "_blank");
  }, [currentIndex, numbers, source]);

  return (
    <div className="landing-page-ads min-h-screen bg-[#FAF9F6] text-brand-black font-sans selection:bg-brand-orange selection:text-white flex flex-col">

      {/* HEADER */}
      <header className="w-full bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik-.webp"
              alt="Dreamlab Logo"
              width={160}
              height={52}
              className="h-10 sm:h-12 w-auto object-contain"
              priority
            />
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full mx-auto text-center space-y-8">

          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-brand-orange/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-brand-orange" />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-black tracking-tight leading-[1.1] uppercase font-display">
              Terima Kasih!
            </h1>
            <p className="text-sm md:text-base text-neutral-500 leading-relaxed max-w-md mx-auto font-medium">
              Kami sudah menerima minat Anda. Sekarang, saatnya ngobrol langsung dengan tim kami.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-orange font-onest">
              Klik Tombol di Bawah untuk Konsultasi GRATIS
            </p>

            <button
              onClick={handleWaClick}
              className="btn-wa inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-5 rounded-[50px] font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-lg hover:scale-[1.03] active:scale-95 w-full sm:w-auto mx-auto"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>Hubungi Kami via WhatsApp</span>
            </button>

            <p className="text-[10px] text-neutral-400 font-bold tracking-[0.2em] uppercase font-onest">
              RESPON CEPAT — TANPA KEWAJIBAN · 100% GRATIS
            </p>
          </div>

        </div>
      </main>

      {/* FLOATING WA BUTTON */}
      <a
        href="/thankyou-maklon/"
        className="fixed bottom-6 right-6 z-50 bg-[#25d366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
        aria-label="Contact via WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
        <span className="absolute right-full mr-4 bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-bold shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">Chat with us!</span>
      </a>

      {/* FOOTER */}
      <footer className="py-8 border-t border-gray-100 bg-white/50">
        <div className="container-custom text-center space-y-3">
          <Image
            src="/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik-.webp"
            alt="Dreamlab Logo"
            width={100}
            height={32}
            className="h-7 w-auto mx-auto object-contain"
          />
          <p className="text-[9px] font-medium text-brand-black/30 tracking-wide uppercase">
            © PT Karya Impian Laboratoris. All Rights Reserved.
          </p>
        </div>
      </footer>

      <style>{`
        .btn-wa {
          display: inline-flex;
          padding: 15px 25px;
          background-color: #25d366;
          color: white;
          text-decoration: none;
          border-radius: 50px;
          font-weight: bold;
          text-align: center;
          border: none;
          cursor: pointer;
          align-items: center;
          justify-content: center;
        }
        .btn-wa:hover {
          background-color: #1da851;
        }
      `}</style>
    </div>
  );
}
