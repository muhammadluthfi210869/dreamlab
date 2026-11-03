'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Users, Sparkles, TrendingUp, Palette } from 'lucide-react';

interface AdsBeautyAcademySectionProps {
  onCtaClick?: () => void;
  categoryName?: string;
  theme?: 'light' | 'warm';
}

export function AdsBeautyAcademySection({
  onCtaClick,
  categoryName = 'Produk',
  theme = 'light',
}: AdsBeautyAcademySectionProps) {
  const pillars = [
    {
      num: '01',
      title: 'PRODUCT & FORMULA POSITIONING',
      desc: 'Membantu mempertajam konsep produk, karakter formula, dan diferensiasi agar brand Anda memiliki daya saing kuat.',
      icon: Sparkles,
    },
    {
      num: '02',
      title: 'BRANDING & PACKAGING IDENTITY',
      desc: 'Membangun identitas visual kemasan yang mewah dan memikat konsumen di etalase toko maupun marketplace online.',
      icon: Palette,
    },
    {
      num: '03',
      title: 'DIGITAL MARKETING & ADS STRATEGY',
      desc: 'Pendampingan taktik pemasaran modern: panduan Meta Ads, TikTok live shopping, affiliate marketing, dan funnel konversi.',
      icon: TrendingUp,
    },
    {
      num: '04',
      title: 'BRAND COMMUNITY OWNER NETWORK',
      desc: 'Akses eksklusif jejaring komunitas sesama founder brand kecantikan alumni Dreamlab untuk sharing data tren dan scale-up bisnis.',
      icon: Users,
    },
  ];

  return (
    <section className="bg-[#FAF9F6] py-16 md:py-24 border-t border-neutral-200/70 overflow-hidden">
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Sisi Kiri: Copy, Value Proposition, & 4 Pilar */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[10px] md:text-xs font-black tracking-widest uppercase font-onest">
                BEAUTY ACADEMY & BRAND COMMUNITY OWNER
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-[36px] font-black text-brand-black tracking-tight leading-[1.15] uppercase font-display mb-4">
              HANYA DI DREAMLAB, BRAND ANDA BUKAN SEKADAR DIPRODUKSI, TETAPI JUGA{' '}
              <span className="text-brand-orange">DIBIMBING UNTUK BERTUMBUH</span>
            </h2>

            <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-8 max-w-2xl font-medium">
              Kami tidak hanya menyediakan fasilitas pabrik maklon. Setiap mitra produksi Dreamlab otomatis 
              mendapatkan akses eksklusif ke <strong>Dreampreneur Beauty Academy</strong> sebagai <strong>Brand Community Owner</strong> — 
              ekosistem mentoring bisnis, riset tren formula, hingga strategi digital marketing untuk akselerasi penjualan brand Anda.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {pillars.map((pillar) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={pillar.num}
                    className="bg-white border border-neutral-200/90 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-brand-orange tracking-wider font-onest">
                        {pillar.num}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300">
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-xs sm:text-sm font-black uppercase text-brand-black mb-1.5 font-display tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {onCtaClick && (
              <div>
                <button
                  type="button"
                  onClick={onCtaClick}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-brand-orange text-white rounded-full font-bold uppercase tracking-wider text-xs sm:text-sm hover:bg-neutral-900 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-xl shadow-brand-orange/20 cursor-pointer"
                >
                  <span>KONSULTASI & GABUNG BRAND COMMUNITY OWNER</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Sisi Kanan: Real Photo Collage Dreampreneur Academy */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            <div className="col-span-2 relative rounded-2xl overflow-hidden aspect-[16/10] shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-neutral-200/80 group">
              <Image
                src="/assets/maklon-parfum/academy-community.webp"
                alt="Brand Community Owner Dreamlab Beauty Academy"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs font-bold tracking-wide uppercase font-onest">
                  Brand Community Owner Gathering
                </span>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-neutral-200/80 group">
              <Image
                src="/assets/maklon-parfum/academy-digital-marketing.webp"
                alt="Mentoring Digital Marketing Beauty Academy"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                <span className="text-white text-[11px] font-bold tracking-wide uppercase font-onest">
                  Marketing Mentoring
                </span>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-neutral-200/80 group">
              <Image
                src="/assets/maklon-parfum/academy-branding.webp"
                alt="Sesi Branding & Packaging Dreamlab Academy"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                <span className="text-white text-[11px] font-bold tracking-wide uppercase font-onest">
                  Branding Strategy
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
