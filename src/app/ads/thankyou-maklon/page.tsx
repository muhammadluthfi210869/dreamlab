"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { fireConversion } from "@/lib/tracking";

const numbers = ["628777650657", "6281952417051"];

// message per source
const WA_MSGS: Record<string, string> = {
  "meta-parfum": "Halo Dreamlab, saya lihat iklan di meta ads parfum dan ingin konsultasi buat brand parfum saya. Bisa dibantu?",
  "meta-skincare": "Halo Dreamlab, saya lihat iklan di meta ads skincare dan ingin konsultasi buat brand skincare saya. Bisa dibantu?",
  "meta-haircare": "Halo Dreamlab, saya lihat iklan di meta ads haircare dan ingin konsultasi buat brand haircare saya. Bisa dibantu?",
  "google-ads": "Hi Dreamlab saya mengetahui dari Google saya ingin konsultasi untuk brand saya, apakah bisa dibantu?",
};

const services = [
  { title: "Maklon Skincare", desc: "Serum, moisturizer, toner, sunscreen & lebih" },
  { title: "Maklon Parfum", desc: "EDP, EDT, parfum oil, body mist & lebih" },
  { title: "Maklon Hair Care", desc: "Shampoo, conditioner, hair mask & serum" },
  { title: "Maklon Body Care", desc: "Body lotion, body scrub, sabun & lebih" },
];

const badges = ["Free Formula", "Free Desain", "Free BPOM", "Free Halal", "Free HKI"];

export default function ThankYouMaklon() {
  const [source, setSource] = useState("direct");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const src = params.get("source") || "direct";
    setSource(src);
    fireConversion(src);
  }, []);

  const processWA = useCallback(() => {
    if (loading) return;
    setLoading(true);

    setTimeout(() => {
      const saved = localStorage.getItem("waIndex");
      const idx = parseInt(saved || "0", 10) % numbers.length;
      const phone = numbers[idx];
      const msg = WA_MSGS[source] || "Halo Dreamlab, saya ingin konsultasi buat brand kosmetik saya sendiri. Bisa dibantu?";
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

      const next = (idx + 1) % numbers.length;
      localStorage.setItem("waIndex", String(next));
      setLoading(false);
      window.open(url, "_blank");
    }, 3000);
  }, [loading, source]);

  // ── ADS Variant (meta / google) ──
  if (source.startsWith("meta-") || source === "google-ads") {
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
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-black tracking-tight leading-[1.1] uppercase font-display">Terima Kasih!</h1>
              <p className="text-sm md:text-base text-neutral-500 leading-relaxed max-w-md mx-auto font-medium">
                Kami sudah menerima minat Anda. Sekarang, saatnya ngobrol langsung dengan tim kami.
              </p>
            </div>
            <div className="space-y-4 pt-4">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-orange font-onest">Klik Tombol di Bawah untuk Konsultasi GRATIS</p>
              <button
                onClick={processWA}
                disabled={loading}
                className={`btn-wa inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-5 rounded-[50px] font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-lg hover:scale-[1.03] active:scale-95 w-full sm:w-auto mx-auto ${loading ? "opacity-70" : ""}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                <span>{loading ? "Menghubungkan ke Admin..." : "Hubungi Kami via WhatsApp"}</span>
              </button>
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
          .btn-wa { display: inline-flex; padding: 15px 25px; background-color: #25d366; color: white; border-radius: 50px; font-weight: bold; text-align: center; border: none; cursor: pointer; align-items: center; justify-content: center; transition: all 0.3s ease; }
          .btn-wa:hover { background-color: #1da851; }
          .btn-wa:disabled { cursor: not-allowed; }
        `}</style>
      </div>
    );
  }

  // ── LINKTREE Variant (organic / direct / default) ──
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

          <button
            onClick={processWA}
            disabled={loading}
            className={`btn-wa w-full text-center px-6 py-5 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg ${loading ? "opacity-70" : "hover:scale-[1.02]"}`}
          >
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
              <span key={i} className="bg-[#fdf5e6] border border-[#d4c5a9] px-3 py-1 rounded-full text-[10px] font-bold text-[#856404]">
                ✓ {b}
              </span>
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
        .btn-wa:disabled { cursor: not-allowed; }
      `}</style>
    </div>
  );
}
