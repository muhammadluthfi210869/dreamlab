"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { fireConversion } from "@/lib/tracking";

const numbers = ["6287776550657", "6281952417051"];

export default function ThankYouMedsos() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const processWA = useCallback(() => {
    const saved = localStorage.getItem("waIndex");
    const idx = parseInt(saved || "0", 10) % numbers.length;
    const phone = numbers[idx];
    const msg = "Halo Dreamlab, Saya mengetaui dari media social ingin konsultasi Produk lebih lanjut";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

    const next = (idx + 1) % numbers.length;
    localStorage.setItem("waIndex", String(next));
    window.open(url, "_blank");
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const src = params.get("source") || "medsos";
    fireConversion(src);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const skipWA = params.get("skip_wa") === "1";
    if (skipWA) return;

    timerRef.current = setTimeout(() => {
      processWA();
    }, 6000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [processWA]);

  return (
    <div className="landing-page-ads min-h-screen bg-[#FAF9F6] text-brand-black font-sans selection:bg-brand-orange selection:text-white flex flex-col">
      <header className="w-full bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image src="/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik-.webp" alt="Dreamlab Logo" width={160} height={52} className="h-10 sm:h-12 w-auto object-contain" priority />
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full mx-auto text-center space-y-8">
          <div className="w-20 h-20 rounded-full bg-brand-orange/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-brand-orange" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-black tracking-tight leading-[1.1] uppercase font-display">Terima Kasih 🙌</h1>
            <p className="text-sm md:text-base text-neutral-500 leading-relaxed max-w-md mx-auto font-medium">
              Tim Dreamlab akan segera menghubungi Anda untuk konsultasi produk lebih lanjut.
            </p>
          </div>
          <div className="space-y-4 pt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-orange font-onest">Klik Tombol di Bawah untuk Konsultasi GRATIS</p>
            <Link
              href="/contact-medsos"
              className="btn-wa inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-5 rounded-[50px] font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-lg hover:scale-[1.03] active:scale-95 w-full sm:w-auto mx-auto"
            >
              Hubungi Tim Dreamlab
            </Link>
            <div className="flex justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500/60 animate-pulse" />
              <span className="text-[10px] text-neutral-400 font-bold tracking-[0.2em] uppercase font-onest">RESPON CEPAT — TANPA KEWAJIBAN · 100% GRATIS</span>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-8 border-t border-gray-100 bg-white/50">
        <div className="container-custom text-center space-y-3">
          <Image src="/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik-.webp" alt="Dreamlab Logo" width={100} height={32} className="h-7 w-auto mx-auto object-contain" />
          <p className="text-[9px] font-medium text-brand-black/30 tracking-wide uppercase">© PT Karya Impian Laboratoris. All Rights Reserved.</p>
        </div>
      </footer>
      <style>{`
        .btn-wa { display: inline-flex; padding: 15px 25px; background-color: #25d366; color: white; border-radius: 50px; font-weight: bold; border: none; cursor: pointer; align-items: center; justify-content: center; transition: all 0.3s ease; text-decoration: none; }
        .btn-wa:hover { background-color: #1da851; }
      `}</style>
    </div>
  );
}
