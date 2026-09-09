'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CertItem {
  id: string;
  num: string;
  title: string;
  badge: string;
  desc: string;
  image: string;
  imageAlt: string;
  aspect: 'square' | 'wide';
}

const CERTIFICATIONS: CertItem[] = [
  {
    id: 'cpkb',
    num: '01',
    title: 'CPKB GRADE A',
    badge: 'Standar Mutu Pabrik',
    desc: 'Standar produksi yang mendukung penerapan Cara Pembuatan Kosmetika yang Baik.',
    image: '/assets/images/certifications/cpkb.png',
    imageAlt: 'Sertifikat Cara Pembuatan Kosmetika yang Baik (CPKB) Grade A',
    aspect: 'square',
  },
  {
    id: 'bpom',
    num: '02',
    title: 'BPOM',
    badge: 'Izin Edar Resmi',
    desc: 'Mendukung proses pengembangan dan produksi kosmetik sesuai ketentuan yang berlaku.',
    image: '/assets/images/certifications/bpom.png',
    imageAlt: 'Badan Pengawas Obat dan Makanan (BPOM) RI',
    aspect: 'square',
  },
  {
    id: 'halal',
    num: '03',
    title: 'HALAL',
    badge: 'Jaminan Halal',
    desc: 'Mendukung kebutuhan brand dalam mempersiapkan aspek halal produk.',
    image: '/assets/images/certifications/halal.png',
    imageAlt: 'Sertifikasi Halal Indonesia',
    aspect: 'square',
  },
  {
    id: 'hki',
    num: '04',
    title: 'HKI',
    badge: 'Kekayaan Intelektual',
    desc: 'Mendukung kebutuhan perlindungan kekayaan intelektual brand.',
    image: '/assets/images/certifications/hki.png',
    imageAlt: 'Hak Kekayaan Intelektual (HKI) DJKI Pengayoman',
    aspect: 'wide',
  },
];

interface AdsCredibilitySectionProps {
  channel?: 'google-ads' | 'metaads';
  ctaHref?: string;
  className?: string;
  bgLight?: boolean;
}

export function AdsCredibilitySection({
  className = '',
  bgLight = true,
}: AdsCredibilitySectionProps) {
  // Desktop: active card on hover/focus (defaults to card 0)
  const [activeDesktop, setActiveDesktop] = useState<number>(0);

  // Mobile: only ONE card open at a time, tap toggles (defaults to card 0)
  const [activeMobile, setActiveMobile] = useState<number>(0);

  const handleMobileToggle = (idx: number) => {
    setActiveMobile((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <section
      aria-labelledby="certification-heading"
      className={`py-16 md:py-24 ${
        bgLight ? 'bg-[#FAF9F6]' : 'bg-white'
      } border-t border-neutral-100 relative overflow-hidden ${className}`}
    >
      {/* Background Soft Glow Tint (Dreamlab Light Blue & Soft Amber) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[340px] bg-gradient-to-r from-[#2F6BFF]/5 via-[#FAF9F6] to-brand-orange/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container-custom max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* ================================================== */}
        {/* SECTION HEADER                                     */}
        {/* ================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2F6BFF]/10 text-[#2F6BFF] text-[10px] md:text-xs font-black tracking-[0.2em] uppercase mb-3 font-onest">
            <ShieldCheck className="w-3.5 h-3.5" />
            STANDAR &amp; LEGALITAS RESMI
          </div>

          <h2
            id="certification-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-[#11253c] tracking-tight leading-[1.15] uppercase font-display mb-3"
          >
            TIDAK PERLU KHAWATIR,{' '}
            <span className="text-brand-orange">DREAMLAB SUDAH BERSERTIFIKASI</span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed font-sans max-w-2xl mx-auto">
            Didukung standar dan legalitas yang menunjang proses pengembangan dan produksi brand Anda.
          </p>
        </div>

        {/* ================================================== */}
        {/* DESKTOP: 4 EXPANDING CARDS (HOVER / KEYBOARD FOCUS) */}
        {/* ================================================== */}
        <div
          className="hidden md:flex flex-row gap-3.5 lg:gap-4.5 w-full items-stretch min-h-[380px] lg:min-h-[420px]"
          role="region"
          aria-label="Interactive Certification Cards"
        >
          {CERTIFICATIONS.map((item, idx) => {
            const isActive = activeDesktop === idx;
            return (
              <article
                key={item.id}
                onMouseEnter={() => setActiveDesktop(idx)}
                onFocus={() => setActiveDesktop(idx)}
                tabIndex={0}
                role="button"
                aria-expanded={isActive}
                aria-label={`${item.title} — ${item.desc}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveDesktop(idx);
                  }
                }}
                className={`group relative overflow-hidden rounded-2xl lg:rounded-3xl border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer flex flex-col justify-between p-6 lg:p-7 select-none outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] ${
                  isActive
                    ? 'flex-[2.4] bg-gradient-to-b from-white via-[#F4F8FF] to-[#EAF2FF] border-[#2F6BFF]/40 shadow-xl shadow-blue-900/5 ring-1 ring-[#2F6BFF]/25'
                    : 'flex-1 bg-white hover:bg-[#FAF9F6] border-neutral-200/80 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Top: Card Number & Badge */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-black tracking-wider uppercase font-onest px-2.5 py-1 rounded-md transition-colors duration-300 ${
                      isActive
                        ? 'bg-brand-orange text-white'
                        : 'bg-neutral-100 text-neutral-500 group-hover:bg-brand-orange/10 group-hover:text-brand-orange'
                    }`}
                  >
                    {item.num}
                  </span>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider font-onest transition-opacity duration-300 ${
                      isActive
                        ? 'opacity-100 text-[#2F6BFF] bg-[#2F6BFF]/10 px-2.5 py-0.5 rounded-full'
                        : 'opacity-0'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* Center: Visual Emblem / Logo */}
                <div className="my-auto py-4 flex flex-col items-center justify-center text-center">
                  <div
                    className={`relative rounded-2xl p-3.5 bg-white border border-neutral-200/70 shadow-xs transition-all duration-500 flex items-center justify-center ${
                      isActive
                        ? 'w-24 h-24 lg:w-28 lg:h-28 scale-105 shadow-md border-[#2F6BFF]/30'
                        : 'w-16 h-16 lg:w-20 lg:h-20 grayscale-30 group-hover:grayscale-0'
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      width={item.aspect === 'wide' ? 104 : 80}
                      height={80}
                      className="object-contain max-h-full max-w-full transform transition-transform duration-500"
                    />
                  </div>

                  <h3
                    className={`font-display font-black uppercase tracking-tight text-[#11253c] mt-4 transition-all duration-300 ${
                      isActive
                        ? 'text-xl lg:text-2xl text-[#11253c]'
                        : 'text-sm lg:text-base text-neutral-700'
                    }`}
                  >
                    {item.title}
                  </h3>
                </div>

                {/* Bottom: Description (Revealed smoothly on active) */}
                <div className="w-full min-h-[64px] flex items-end">
                  <p
                    className={`text-xs lg:text-[13px] leading-relaxed font-sans font-medium text-neutral-600 transition-all duration-400 ${
                      isActive
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-2 pointer-events-none line-clamp-2'
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>

                {/* Subtle active top accent line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange via-[#2F6BFF] to-brand-orange transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden="true"
                />
              </article>
            );
          })}
        </div>

        {/* ================================================== */}
        {/* MOBILE: ACCORDION TAP INTERACTION (+ / −)         */}
        {/* ================================================== */}
        <div
          className="flex md:hidden flex-col gap-3 w-full"
          role="region"
          aria-label="Daftar Sertifikasi Dreamlab"
        >
          {CERTIFICATIONS.map((item, idx) => {
            const isOpen = activeMobile === idx;
            return (
              <article
                key={item.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-gradient-to-b from-white to-[#F4F8FF] border-[#2F6BFF]/40 shadow-md ring-1 ring-[#2F6BFF]/25'
                    : 'bg-white border-neutral-200/80 shadow-xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleMobileToggle(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`cert-mobile-desc-${item.id}`}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[11px] font-black font-onest px-2.5 py-1 rounded transition-colors ${
                        isOpen
                          ? 'bg-brand-orange text-white'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {item.num}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-[#11253c] font-display uppercase tracking-tight">
                      {item.title}
                    </h3>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-brand-orange/10 text-brand-orange'
                        : 'bg-neutral-100 text-neutral-500'
                    }`}
                    aria-hidden="true"
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-brand-orange stroke-[2.5]" />
                    ) : (
                      <Plus className="w-4 h-4 text-neutral-600 stroke-[2.5]" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`cert-mobile-desc-${item.id}`}
                    className="px-4 pb-5 sm:px-5 sm:pb-6 pt-1 border-t border-neutral-100 animate-fadeIn"
                  >
                    <div className="flex items-center gap-4 pt-2">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-white rounded-xl border border-neutral-200/70 p-2 shadow-xs flex items-center justify-center">
                        <Image
                          src={item.image}
                          alt={item.imageAlt}
                          width={item.aspect === 'wide' ? 84 : 64}
                          height={64}
                          className="object-contain max-h-full max-w-full"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="inline-block text-[10px] font-bold text-[#2F6BFF] uppercase tracking-wider">
                          {item.badge}
                        </span>
                        <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed font-sans">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* ================================================== */}
        {/* TRUST MESSAGE (BELOW INTERACTIVE CARDS)            */}
        {/* ================================================== */}
        <div className="mt-12 md:mt-16 text-center max-w-3xl mx-auto px-4">
          <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#11253c] tracking-tight uppercase font-display mb-3">
            SATU PARTNER, LEBIH TENANG MENGEMBANGKAN BRAND
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-neutral-600 font-medium leading-relaxed font-sans max-w-2xl mx-auto">
            Mulai dari pengembangan formula hingga produksi, Dreamlab hadir sebagai One Stop Maklon Partner untuk membantu kebutuhan brand Anda.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AdsCredibilitySection;
