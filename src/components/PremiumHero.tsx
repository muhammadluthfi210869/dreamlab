"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export interface HeroProps {
  smallTitle?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImage?: string;
}

const HERO_SLIDES = [
  {
    id: "hero-01",
    src: "/assets/images/hero/hero-01.jpg",
    alt: "Dreamlab Maklon Kosmetik - Rangkaian Produk Skincare Custom Brand",
  },
  {
    id: "hero-02",
    src: "/assets/images/hero/hero-02.jpg",
    alt: "Dreamlab Maklon Kosmetik - Inovasi Formula Barrier & Moisture Care",
  },
  {
    id: "hero-03",
    src: "/assets/images/hero/hero-03.jpg",
    alt: "Dreamlab Maklon Kosmetik - Lini Lengkap Produk Skincare Brand Anda",
  },
] as const;

const AUTOPLAY_INTERVAL_MS = 3000;

export default function PremiumHero({
  smallTitle = "Dreamlab Maklon Kosmetik",
  subtitle = "Custom formula untuk brand kosmetik Anda.",
  ctaText = "Konsultasikan Produk",
  ctaLink = "/thankyou/google/",
  secondaryCtaText = "Lihat Produk",
  secondaryCtaLink = "/produk/",
}: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [interactionTick, setInteractionTick] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalSlides = HERO_SLIDES.length;

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

  // Continuous 3-second rotation: hero-01 -> hero-02 -> hero-03 -> hero-01
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isPaused, totalSlides, interactionTick]);

  // Touch swipe handlers for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
    setIsPaused(true);
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
    setIsPaused(false);
  };

  const resolvedPrimaryHref =
    ctaLink && (ctaLink.startsWith("http") || ctaLink.startsWith("/") || ctaLink.startsWith("#"))
      ? ctaLink
      : "/thankyou/google/";

  return (
    <div className="w-full bg-white">
      {/* Clean top navbar backdrop so header navigation remains 100% legible and never overlaps product packaging */}
      <div className="w-full h-22 md:h-28 bg-white border-b border-[#E2EEFB]" />

      {/* ONE Full-Width Dynamic Hero Section */}
      <section
        aria-label="Dreamlab Hero Carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="premium-hero relative w-full overflow-hidden bg-gradient-to-b from-[#CCE2FD] via-[#DCEBFE] to-[#EAF3FF] md:bg-[#CCE2FD] flex flex-col md:block md:aspect-[16/7.8] lg:aspect-[16/7.2] xl:aspect-[2/1] md:min-h-[430px] lg:min-h-[520px] xl:min-h-[600px] 2xl:max-h-[760px] select-none"
      >
        {/*LEFT COPY LAYER (Above visual on Mobile, Left negative space on Tablet & Desktop) */}
        <div className="relative z-20 w-full md:h-full flex items-center order-1 md:order-none pt-7 pb-5 md:py-0">
          <div className="max-w-[1280px] w-full mx-auto px-5 sm:px-8 lg:px-12">
            <div className="w-full md:max-w-[46%] lg:max-w-[47%] xl:max-w-[540px] text-left space-y-4 md:space-y-5 lg:space-y-6">
              {/* Brand Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-white shadow-[0_2px_10px_rgba(12,35,64,0.06)]">
                <span className="w-2 h-2 rounded-full bg-[#F39200]" />
                <span className="text-[11px] md:text-xs font-bold uppercase tracking-[0.16em] text-[#0C2340] font-onest">
                  {smallTitle || "Dreamlab Maklon Kosmetik"}
                </span>
              </div>

              {/* Primary Headline */}
              <div className="space-y-2">
                <h1 className="font-display uppercase tracking-tight leading-[1.06] text-[#0C2340]">
                  <span className="block text-[32px] sm:text-[38px] md:text-[36px] lg:text-[48px] xl:text-[56px]">
                    WUJUDKAN
                  </span>
                  <span className="block text-[32px] sm:text-[38px] md:text-[36px] lg:text-[48px] xl:text-[56px] text-[#0C2340]">
                    YOUR DREAM BRAND
                  </span>
                </h1>
                <div className="w-20 md:w-24 h-1.5 rounded-full bg-[#F39200]" />
              </div>

              {/* Supporting Copy */}
              <p className="text-[#1A3654] text-base sm:text-lg md:text-[15px] lg:text-lg xl:text-[19px] font-medium leading-relaxed max-w-md font-helvetica">
                {subtitle && !subtitle.includes("FORMULA YANG KUAT")
                  ? subtitle
                  : "Custom formula untuk brand kosmetik Anda."}
              </p>

              {/* CTA Buttons */}
              <div className="pt-1 md:pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  href={resolvedPrimaryHref}
                  target={resolvedPrimaryHref.startsWith("http") ? "_blank" : undefined}
                  className="bg-[#F39200] hover:bg-[#0C2340] text-white px-6 sm:px-7 lg:px-8 py-3.5 lg:py-4 rounded-xl font-bold text-xs sm:text-sm font-onest tracking-wider uppercase shadow-[0_10px_24px_rgba(243,146,0,0.28)] hover:shadow-[0_10px_24px_rgba(12,35,64,0.22)] transition-colors duration-300 inline-flex items-center justify-center gap-2.5 group"
                >
                  <span>{ctaText || "Konsultasikan Produk"}</span>
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </span>
                </Link>

                <Link
                  href={secondaryCtaLink || "/produk/"}
                  className="bg-white/95 hover:bg-white text-[#0C2340] hover:text-[#F39200] border border-[#0C2340]/15 hover:border-[#F39200] px-6 sm:px-7 lg:px-8 py-3.5 lg:py-4 rounded-xl font-bold text-xs sm:text-sm font-onest tracking-wider uppercase shadow-[0_4px_14px_rgba(12,35,64,0.06)] transition-colors duration-300 inline-flex items-center justify-center"
                >
                  <span>{secondaryCtaText || "Lihat Produk"}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT VISUAL CAROUSEL LAYER */}
        <div className="relative order-2 md:order-none w-full aspect-[16/9] sm:aspect-[2/1] md:aspect-auto md:absolute md:inset-0 z-10 overflow-hidden">
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === activeIndex;
            const isFirst = index === 0;

            return (
              <div
                key={slide.id}
                aria-hidden={!isActive}
                data-slide={slide.id}
                className={`absolute inset-0 w-full h-full transition-all duration-[850ms] ease-out will-change-[opacity,transform] ${
                  isActive
                    ? "opacity-100 translate-x-0 z-10"
                    : "opacity-0 translate-x-1.5 z-0 pointer-events-none"
                }`}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={isFirst}
                  fetchPriority={isFirst ? "high" : "auto"}
                  loading={isFirst ? "eager" : "lazy"}
                  decoding={isFirst ? "sync" : "async"}
                  sizes="100vw"
                  quality={92}
                  className="object-cover object-[82%_center] sm:object-right md:object-[72%_center] lg:object-right"
                />
              </div>
            );
          })}

          {/* Subtle left readability veil on tablet so text on the left negative space stays ultra-crisp without touching the right-side products */}
          <div
            aria-hidden="true"
            className="hidden md:block lg:hidden absolute inset-y-0 left-0 w-[52%] bg-gradient-to-r from-[#CFE4FE]/65 via-[#CFE4FE]/30 to-transparent z-15 pointer-events-none"
          />
        </div>

        {/* MANUAL NAVIGATION: Previous & Next Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Slide sebelumnya"
          className="absolute left-2.5 sm:left-4 lg:left-5 bottom-[24%] md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-30 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/80 hover:bg-white text-[#0C2340] hover:text-[#F39200] border border-white/90 shadow-[0_4px_14px_rgba(12,35,64,0.12)] flex items-center justify-center transition-all duration-200 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Slide berikutnya"
          className="absolute right-2.5 sm:right-4 lg:right-5 bottom-[24%] md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-30 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/80 hover:bg-white text-[#0C2340] hover:text-[#F39200] border border-white/90 shadow-[0_4px_14px_rgba(12,35,64,0.12)] flex items-center justify-center transition-all duration-200 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* SUBTLE CAROUSEL INDICATORS NEAR BOTTOM: ● ○ ○ */}
        <div
          role="tablist"
          aria-label="Pilih slide hero"
          className="absolute bottom-3.5 md:bottom-5 left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/75 backdrop-blur-xs border border-white/80 shadow-[0_2px_10px_rgba(12,35,64,0.08)]"
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
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? "w-6 h-2.5 bg-[#F39200] border border-[#F39200]"
                    : "w-2.5 h-2.5 bg-transparent border-[1.5px] border-[#0C2340]/55 hover:border-[#0C2340]"
                }`}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
