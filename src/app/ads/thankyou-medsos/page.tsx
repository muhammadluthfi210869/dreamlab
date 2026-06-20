"use client";

import { useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fireConversion } from "@/lib/tracking";

const numbers = ["6287776550657", "6281952417051"];

const services = [
  { title: "Maklon Skincare", desc: "Serum, moisturizer, toner, sunscreen & lebih" },
  { title: "Maklon Parfum", desc: "EDP, EDT, parfum oil, body mist & lebih" },
  { title: "Maklon Hair Care", desc: "Shampoo, conditioner, hair mask & serum" },
  { title: "Maklon Body Care", desc: "Body lotion, body scrub, sabun & lebih" },
];
const badges = ["Free Formula", "Free Desain", "Free BPOM", "Free Halal", "Free HKI"];

export default function ThankYouMedsos() {
  const waOpened = useRef(false);

  const processWA = useCallback(() => {
    if (waOpened.current) return;
    waOpened.current = true;
    const saved = localStorage.getItem("waIndex");
    const idx = parseInt(saved || "0", 10) % numbers.length;
    const phone = numbers[idx];
    const msg = "Halo Dreamlab, saya tertarik untuk membuat brand kosmetik saya sendiri. Bisa dibantu?";
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
    const timer = setTimeout(() => {
      if (!waOpened.current) processWA();
    }, 3000);
    return () => clearTimeout(timer);
  }, [processWA]);

  useEffect(() => {
    const onFocus = () => { waOpened.current = false; };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  return (
    <div className="landing-page-ads min-h-screen bg-[#FAF9F6] text-brand-black font-sans selection:bg-brand-orange selection:text-white flex flex-col">
      <header className="w-full bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image src="/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik-.webp" alt="Dreamlab Logo" width={160} height={52} className="h-10 sm:h-12 w-auto object-contain" priority />
          </Link>
        </div>
      </header>
      <main className="flex-1 px-4 py-12">
        <div className="max-w-md mx-auto text-center space-y-6">
          <Image src="/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik-.webp" alt="Dreamlab" width={140} height={45} className="h-10 w-auto mx-auto object-contain" />
          <h3 className="text-lg md:text-xl font-bold text-brand-black leading-snug max-w-sm mx-auto">
            Solusi Maklon Skincare, Parfum, Hair Care & Body Care untuk Brand Impianmu
          </h3>
          <p className="text-[11px] font-black tracking-[0.25em] text-brand-orange uppercase font-onest">HUBUNGI KAMI</p>
          <button onClick={processWA} className="btn-wa w-full text-center px-6 py-5 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg hover:scale-[1.02]">
            <div>HUBUNGI KAMI VIA WHATSAPP</div>
            <div className="text-[11px] font-normal mt-1 opacity-80">Konsultasi Gratis - Respon Cepat</div>
          </button>
          <p className="text-[11px] font-black tracking-[0.25em] text-brand-orange uppercase font-onest pt-4">LAYANAN KAMI</p>
          <div className="space-y-3 text-left">
            {services.map((svc, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-50 flex items-center justify-between group hover:border-brand-orange/20 hover:shadow-md transition-all cursor-pointer">
                <div>
                  <h4 className="text-sm font-bold text-brand-black">{svc.title}</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{svc.desc}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#efe7d6] flex items-center justify-center shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {badges.map((b, i) => (
              <span key={i} className="bg-[#fdf5e6] border border-[#d4c5a9] px-3 py-1 rounded-full text-[10px] font-bold text-[#856404]">✓ {b}</span>
            ))}
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
        .btn-wa { display: block; background: #22c55e; color: white; border-radius: 12px; font-weight: bold; border: none; cursor: pointer; transition: all 0.3s ease; }
        .btn-wa:hover { background: #16a34a; }
      `}</style>
    </div>
  );
}
