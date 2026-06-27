"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  smallTitle?: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}

export default function PremiumHero({ smallTitle, title, subtitle, ctaText, ctaLink }: HeroProps) {
  return (
    <section className="relative w-full min-h-screen overflow-hidden flex items-center pt-24 lg:pt-0">

      {/* Background Visual Image (Full Screen) */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/new asset/background-visual-hero-section/home-page.webp"
          alt="Dreamlab Indonesia Premium Hero Visual"
          title="Jasa Maklon Kosmetik BPOM Halal — Dreamlab Indonesia"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6]/95 via-[#FAF9F6]/80 to-[#FAF9F6]/15 md:from-[#FAF9F6]/92 md:via-[#FAF9F6]/65 md:to-transparent" />
      </div>

      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-brand-orange/[0.02] blur-[120px] rounded-full pointer-events-none z-10" />

      <div className="container-custom relative z-20 w-full py-16 md:py-24 lg:py-32 flex items-center">
        <div className="max-w-xl md:max-w-2xl lg:max-w-3xl text-left space-y-6 md:space-y-8">

          {smallTitle && (
            <div className="hero-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-brand-orange/5 border border-brand-orange/15 rounded-full backdrop-blur-sm">
                <span className="size-2 rounded-full bg-brand-orange animate-pulse" />
                <span className="text-[10px] md:text-xs font-helvetica font-bold tracking-widest text-brand-orange uppercase">
                  {smallTitle}
                </span>
              </div>
            </div>
          )}

          <h1 className="hero-fade-in" style={{ animationDelay: "0.35s" }}>
            <span className="block text-brand-orange text-[32px] md:text-[46px] lg:text-[60px] font-normal leading-[1.08] tracking-tight max-w-[740px] uppercase font-display">
              Jasa Maklon
            </span>
            <span className="block text-brand-orange italic font-normal text-[32px] md:text-[46px] lg:text-[60px] leading-[1.08] tracking-tight max-w-[740px] uppercase font-display">
              Skincare & Kosmetik
            </span>
            <span className="block text-brand-black text-[32px] md:text-[46px] lg:text-[60px] font-normal leading-[1.08] tracking-tight max-w-[740px] uppercase font-display">
              Terpercaya Indonesia
            </span>
          </h1>

          <div className="hero-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="text-neutral-500 text-sm md:text-base leading-relaxed max-w-xl font-helvetica">
              {subtitle.split('.').map((sentence: string, idx: number) => {
                const trimmed = sentence.trim();
                if (!trimmed) return null;
                return (
                  <p key={idx} className="mb-3 last:mb-0">
                    {trimmed.includes('FORMULA YANG KUAT') ? (
                      <>Di balik setiap brand hebat ada <span className="font-bold text-neutral-800 border-b border-brand-orange/30 pb-0.5">FORMULA YANG KUAT</span></>
                    ) : trimmed.includes('JUARANYA FORMULA') ? (
                      <>Solusi Maklon terpercaya untuk <span className="font-bold text-brand-orange uppercase tracking-wider font-helvetica">JUARANYA FORMULA</span></>
                    ) : trimmed}
                  </p>
                );
              })}
            </div>
          </div>

          <div className="hero-fade-in" style={{ animationDelay: "0.65s" }}>
            <div className="flex flex-wrap items-center gap-4">
              {ctaLink && (
                ctaLink.startsWith("http") || ctaLink.startsWith("/") || ctaLink.startsWith("#") ? (
                  <Link
                    href={ctaLink}
                    target={ctaLink.startsWith("http") ? "_blank" : undefined}
                    className="bg-brand-orange text-white px-8 py-4 rounded-xl font-bold text-xs md:text-sm font-onest uppercase tracking-wider shadow-lg shadow-brand-orange/15 hover:bg-neutral-900 transition-all duration-300 inline-flex items-center justify-center gap-3 group"
                  >
                    <span>FREE KONSULTASI BISNIS</span>
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-brand-orange transition-colors">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                ) : (
                  <Link
                    href="/thankyou/google/"
                    className="bg-brand-orange text-white px-8 py-4 rounded-xl font-bold text-xs md:text-sm font-onest uppercase tracking-wider shadow-lg shadow-brand-orange/15 hover:bg-neutral-900 transition-all duration-300 inline-flex items-center justify-center gap-3 group"
                  >
                    <span>FREE KONSULTASI BISNIS</span>
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-brand-orange transition-colors">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>

        </div>
      </div>
      <style>{`
        .hero-fade-in {
          opacity: 0;
          animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-fade-in {
            opacity: 1;
            animation: none;
          }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}