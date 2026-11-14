"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface HeroProps {
  smallTitle?: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}

const HERO_SLIDES = [
  {
    id: "hero-01",
    src: "/assets/images/hero/hero-01.jpg",
    alt: "Dreamlab Indonesia Premium Hero Visual 1",
  },
  {
    id: "hero-02",
    src: "/assets/images/hero/hero-02.jpg",
    alt: "Dreamlab Indonesia Premium Hero Visual 2",
  },
  {
    id: "hero-03",
    src: "/assets/images/hero/hero-03.jpg",
    alt: "Dreamlab Indonesia Premium Hero Visual 3",
  },
] as const;

const AUTOPLAY_INTERVAL_MS = 2500;

export default function PremiumHero({ smallTitle, title, subtitle, ctaText, ctaLink }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [interactionTick, setInteractionTick] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalSlides = HERO_SLIDES.length;

  const titleLines =
    title.split("&").length === 2 && title.includes("Trusted")
      ? ["Trusted Cosmetic", "& Skincare Manufacturing", "Services in Indonesia"]
      : null;

  const goToSlide = useCallback(
    (index: number) => {
      setActiveIndex(((index % totalSlides) + totalSlides) % totalSlides);
      setInteractionTick((t) => t + 1);
    },
    [totalSlides]
  );

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
    setInteractionTick((t) => t + 1);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setInteractionTick((t) => t + 1);
  }, [totalSlides]);

  // Continuous automatic rotation without hover-lock so images change immediately and continuously
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [totalSlides, interactionTick]);

  // Touch swipe handlers for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchStartX.current - touchEndX.current;
      const minSwipeDistance = 40;
      if (distance > minSwipeDistance) {
        handleNext();
      } else if (distance < -minSwipeDistance) {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative w-full md:min-h-[600px] lg:min-h-screen overflow-hidden flex flex-col md:flex-row md:items-center pt-24 md:pt-28 lg:pt-0 bg-gradient-to-b from-[#D2E6FE] via-[#E1EEFF] to-[#EEF6FF] md:bg-[#D8E9FE]"
    >
      {/* Background Visual Carousel Layer (Fits Mobile, Tablet, and Desktop; extends behind top Header bar) */}
      <div className="relative order-2 md:order-none w-full aspect-[2/1] md:aspect-auto md:absolute md:inset-0 z-0 select-none pointer-events-none">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              data-slide={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-200 ease-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                title={`${title} - Dreamlab Indonesia`}
                fill
                priority
                fetchPriority={index === 0 ? "high" : "auto"}
                loading="eager"
                decoding="sync"
                className="object-cover object-right md:object-[72%_center] lg:object-right"
                sizes="100vw"
                quality={92}
              />
            </div>
          );
        })}

        {/* Mobile top edge feather so the product image blends seamlessly with the light-blue copy & navbar area */}
        <div className="md:hidden absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#E1EEFF] to-transparent z-20" />

        {/* Tablet & Desktop left-side & top-bar soft gradient so the navbar and original copy remain 100% readable */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#EAF3FE]/95 via-[#EAF3FE]/75 to-transparent md:from-[#EAF3FE]/90 md:via-[#EAF3FE]/55 md:to-transparent lg:from-[#EAF3FE]/85 lg:via-[#EAF3FE]/40 lg:to-transparent z-20" />
        <div className="hidden md:block absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#EAF3FE]/65 via-[#EAF3FE]/25 to-transparent z-20" />
      </div>

      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-brand-orange/[0.02] blur-[120px] rounded-full pointer-events-none z-10" />

      {/* Copy Layer (Previous Dreamlab Copy Restored) */}
      <div className="container-custom relative z-20 order-1 md:order-none w-full pt-4 pb-6 md:py-24 lg:py-32 flex items-center">
        <div className="max-w-xl md:max-w-[52%] lg:max-w-2xl xl:max-w-3xl text-left space-y-5 md:space-y-7">
          {smallTitle && (
            <div className="hero-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-white/80 border border-brand-orange/25 rounded-full backdrop-blur-sm shadow-xs">
                <span className="size-2 rounded-full bg-brand-orange animate-pulse" />
                <span className="text-[10px] md:text-xs font-helvetica font-bold tracking-widest text-brand-orange uppercase">
                  {smallTitle}
                </span>
              </div>
            </div>
          )}

          <h1 className="space-y-1">
            <span className="block text-brand-orange text-[30px] sm:text-[34px] md:text-[40px] lg:text-[54px] xl:text-[60px] font-normal leading-[1.08] tracking-tight max-w-[740px] uppercase font-display">
              {titleLines?.[0] || "Jasa Maklon"}
            </span>
            <span className="block text-brand-orange italic font-normal text-[30px] sm:text-[34px] md:text-[40px] lg:text-[54px] xl:text-[60px] leading-[1.08] tracking-tight max-w-[740px] uppercase font-display">
              {titleLines?.[1] || "Skincare & Kosmetik"}
            </span>
            <span className="block text-brand-black text-[30px] sm:text-[34px] md:text-[40px] lg:text-[54px] xl:text-[60px] font-normal leading-[1.08] tracking-tight max-w-[740px] uppercase font-display">
              {titleLines?.[2] || "Terpercaya Indonesia"}
            </span>
          </h1>

          <div className="hero-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="text-neutral-700 text-sm md:text-base leading-relaxed max-w-xl font-helvetica">
              {subtitle.split(".").map((sentence: string, idx: number) => {
                const trimmed = sentence.trim();
                if (!trimmed) return null;
                return (
                  <p key={idx} className="mb-2.5 last:mb-0">
                    {trimmed.includes("A STRONG FORMULA") ? (
                      <>
                        Behind every great brand is{" "}
                        <span className="font-bold text-neutral-900 border-b border-brand-orange/40 pb-0.5">
                          A STRONG FORMULA
                        </span>
                      </>
                    ) : trimmed.includes("THE CHAMPION OF FORMULAS") ? (
                      <>
                        A trusted manufacturing solution for{" "}
                        <span className="font-bold text-brand-orange uppercase tracking-wider font-helvetica">
                          THE CHAMPION OF FORMULAS
                        </span>
                      </>
                    ) : trimmed.includes("FORMULA YANG KUAT") ? (
                      <>
                        Di balik setiap brand hebat ada{" "}
                        <span className="font-bold text-neutral-900 border-b border-brand-orange/40 pb-0.5">
                          FORMULA YANG KUAT
                        </span>
                      </>
                    ) : trimmed.includes("JUARANYA FORMULA") ? (
                      <>
                        Solusi Maklon terpercaya untuk{" "}
                        <span className="font-bold text-brand-orange uppercase tracking-wider font-helvetica">
                          JUARANYA FORMULA
                        </span>
                      </>
                    ) : (
                      trimmed
                    )}
                  </p>
                );
              })}
            </div>
          </div>

          <div className="hero-fade-in" style={{ animationDelay: "0.65s" }}>
            <div className="flex flex-wrap items-center gap-4">
              {ctaLink &&
              (ctaLink.startsWith("http") || ctaLink.startsWith("/") || ctaLink.startsWith("#")) ? (
                <Link
                  href={ctaLink}
                  target={ctaLink.startsWith("http") ? "_blank" : undefined}
                  className="bg-brand-orange text-white px-8 py-4 rounded-xl font-bold text-xs md:text-sm font-onest uppercase tracking-wider shadow-lg shadow-brand-orange/15 hover:bg-neutral-900 transition-all duration-300 inline-flex items-center justify-center gap-3 group"
                >
                  <span>{ctaText || "FREE KONSULTASI BISNIS"}</span>
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-brand-orange transition-colors">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ) : (
                <Link
                  href="/thankyou/google/"
                  className="bg-brand-orange text-white px-8 py-4 rounded-xl font-bold text-xs md:text-sm font-onest uppercase tracking-wider shadow-lg shadow-brand-orange/15 hover:bg-neutral-900 transition-all duration-300 inline-flex items-center justify-center gap-3 group"
                >
                  <span>{ctaText || "FREE KONSULTASI BISNIS"}</span>
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-brand-orange transition-colors">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Navigation Arrows */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Slide sebelumnya"
        className="absolute left-3 md:left-5 bottom-[18%] md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-30 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/75 hover:bg-white text-brand-black hover:text-brand-orange border border-white/90 shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Slide berikutnya"
        className="absolute right-3 md:right-5 bottom-[18%] md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-30 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/75 hover:bg-white text-brand-black hover:text-brand-orange border border-white/90 shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Bottom Carousel Indicators: ● ○ ○ */}
      <div
        role="tablist"
        aria-label="Pilih slide hero"
        className="absolute bottom-3.5 md:bottom-6 left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/75 backdrop-blur-xs border border-white/80 shadow-sm"
      >
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Tampilkan ${slide.id}`}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-200 rounded-full cursor-pointer ${
                isActive
                  ? "w-6 h-2.5 bg-brand-orange border border-brand-orange"
                  : "w-2.5 h-2.5 bg-transparent border-[1.5px] border-brand-black/50 hover:border-brand-black"
              }`}
            />
          );
        })}
      </div>

      <style>{`
        .hero-fade-in {
          animation: heroFadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-fade-in {
            opacity: 1;
            animation: none;
          }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
