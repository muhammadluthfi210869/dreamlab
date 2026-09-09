'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';

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

  return (
    <section
      aria-labelledby="certification-heading"
      className={`py-14 md:py-20 ${
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
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2F6BFF]/10 text-[#2F6BFF] text-[10px] md:text-xs font-black tracking-[0.2em] uppercase mb-3 font-onest">
            <ShieldCheck className="w-3.5 h-3.5" />
            STANDAR &amp; LEGALITAS RESMI
          </div>

          <h2
            id="certification-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black text-[#11253c] tracking-tight leading-[1.15] uppercase font-display mb-3"
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
          className="hidden md:flex flex-row gap-3.5 lg:gap-4.5 w-full items-stretch min-h-[310px] lg:min-h-[340px]"
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
                className={`group relative overflow-hidden rounded-2xl lg:rounded-3xl border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer flex flex-col justify-between p-5 lg:p-6 select-none outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] ${
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

                {/* Center: Visual Emblem / Logo (Compact square shape) */}
                <div className="my-auto py-3 flex flex-col items-center justify-center text-center">
                  <div
                    className={`relative rounded-xl p-2.5 bg-white border border-neutral-200/70 shadow-xs transition-all duration-500 flex items-center justify-center ${
                      isActive
                        ? 'w-16 h-16 lg:w-20 lg:h-20 shadow-md border-[#2F6BFF]/30'
                        : 'w-11 h-11 lg:w-13 lg:h-13 opacity-75 group-hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      width={item.aspect === 'wide' ? 64 : 48}
                      height={48}
                      className="object-contain max-h-full max-w-full transform transition-transform duration-500"
                    />
                  </div>

                  <h3
                    className={`font-display font-black uppercase tracking-tight text-[#11253c] mt-3 transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? 'text-lg lg:text-xl text-[#11253c]'
                        : 'text-xs lg:text-sm text-neutral-700'
                    }`}
                  >
                    {item.title}
                  </h3>
                </div>

                {/* Bottom: Description (Revealed smoothly on active) */}
                <div className="w-full min-h-[56px] flex items-end">
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
        {/* MOBILE: DIRECT VIEW CARDS (NO TOGGLE / ACCORDION)  */}
        {/* ================================================== */}
        <div
          className="flex md:hidden flex-col gap-3 w-full"
          role="region"
          aria-label="Daftar Sertifikasi Dreamlab"
        >
          {CERTIFICATIONS.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-xs"
            >
              <div className="flex items-start gap-3.5">
                {/* Visual Emblem Square (Compact & Clean) */}
                <div className="relative w-12 h-12 shrink-0 rounded-xl bg-[#F8FAFC] border border-neutral-200/70 p-1.5 flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    width={item.aspect === 'wide' ? 44 : 32}
                    height={32}
                    className="object-contain max-h-full max-w-full"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5 mb-1 flex-wrap">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-black font-onest px-1.5 py-0.5 rounded bg-brand-orange text-white shrink-0">
                        {item.num}
                      </span>
                      <h3 className="text-sm sm:text-base font-black text-[#11253c] font-display uppercase tracking-tight whitespace-nowrap">
                        {item.title}
                      </h3>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider font-onest text-[#2F6BFF] bg-[#2F6BFF]/10 px-2 py-0.5 rounded-full shrink-0">
                      {item.badge}
                    </span>
                  </div>

                  <p className="text-xs sm:text-[13px] text-neutral-600 font-medium leading-relaxed font-sans mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdsCredibilitySection;
