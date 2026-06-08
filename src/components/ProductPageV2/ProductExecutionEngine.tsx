"use client";

import React from 'react';
import Image from 'next/image';

export default function ProductExecutionEngine() {
  const points = [
    { title: "Kalibrasi Performa 3:1", desc: "Sillage tajam, longevity 8+ jam, anti-degradasi, dan bebas noda pada pakaian." },
    { title: "Ekosistem Sourcing Kemasan", desc: "Akses langsung ke ribuan opsi botol kaca premium dan desain box rigid." },
    { title: "Jalur Cepat Legalitas", desc: "100% terima beres untuk pendaftaran BPOM dan sertifikasi Halal." },
    { title: "Kerahasiaan IP Absolut", desc: "DNA formulasi Anda dilindungi NDA. Tidak akan pernah diduplikasi untuk brand lain." }
  ];

  return (
    <section className="relative z-10 bg-[#FDFDFC] py-24 lg:py-32 overflow-hidden border-t border-gray-50">
      <div className="container-custom">
        <div className="relative aspect-video bg-white rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col lg:flex-row">
          <div className="flex-1 p-10 lg:p-20 flex flex-col justify-center space-y-12">
            <h2 className="font-display text-[28px] lg:text-[48px] font-normal text-[#212120] leading-[1.1] tracking-tight uppercase">
              Arsitektur Produksi <br />
              <span className="text-brand-orange">& Sourcing Terpadu.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
              {points.map((point, i) => (
                <div key={i} className="space-y-3">
                  <h4 className="font-onest text-sm lg:text-base font-black text-[#212120] uppercase tracking-tight">{point.title}</h4>
                  <p className="font-poppins text-xs lg:text-sm text-[#212120]/60 leading-relaxed">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-[45%] relative bg-[#F8F8FF] overflow-hidden">
            <div className="relative w-full h-full p-12">
              <Image src="/assets/images/Perfume_bottles_on_podiums_202605101341.webp" alt="Your Brand Execution" title="Eksekusi Brand Parfum — Dreamlab Maklon Kosmetik" fill sizes="(max-width: 1024px) 100vw, 45vw" loading="lazy" decoding="async" className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
