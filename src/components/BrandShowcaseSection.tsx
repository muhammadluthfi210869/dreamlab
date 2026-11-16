'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Factory, FlaskConical, Users } from 'lucide-react';

interface BrandShowcaseSectionProps {
  content?: {
    productsDevelopedLabel?: string;
    certifiedFacility?: string;
    innovationText?: string;
    eyebrow?: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    primaryCta?: string;
    secondaryCta?: string;
    secondaryHref?: string;
  };
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

function AnimatedStatCounter({
  target,
  suffix = '++',
  reducedMotion,
}: {
  target: number;
  suffix?: string;
  reducedMotion: boolean;
}) {
  const [val, setVal] = useState<number>(reducedMotion ? target : 0);
  const elRef = useRef<HTMLSpanElement | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      setVal(target);
      hasAnimated.current = true;
      return;
    }
    const el = elRef.current;
    if (!el || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.disconnect();
          const duration = 1100;
          const start = performance.now();

          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(1, elapsed / duration);
            // Smooth ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setVal(Math.round(eased * target));
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setVal(target);
            }
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, reducedMotion]);

  return (
    <span ref={elRef} className="tabular-nums">
      {val.toLocaleString('id-ID')}
      {suffix}
    </span>
  );
}

const SERVICE_CARDS = [
  {
    id: 'formula',
    title: 'Pengembangan',
    subtitle: 'Formula',
    image: '/assets/images/home/service-rnd-team.jpg',
    alt: 'Pengembangan Formula Kosmetik di Laboratorium R&D Dreamlab',
    href: '/services/',
    icon: FlaskConical,
    parallaxSpeed: 0.5,
    revealDelay: 150,
    labelSide: 'right' as const,
  },
  {
    id: 'production',
    title: 'Produksi',
    subtitle: 'Berkualitas',
    image: '/assets/images/home/service-production.jpg',
    alt: 'Fasilitas Produksi Berkualitas Standar CPKB Grade A Dreamlab',
    href: '/services/',
    icon: Factory,
    parallaxSpeed: 0.8,
    revealDelay: 250,
    labelSide: 'left' as const,
  },
  {
    id: 'consultation',
    title: 'Konsultasi',
    subtitle: 'dan Konsep',
    image: '/assets/images/home/service-consultation.jpg',
    alt: 'Konsultasi dan Konsep Pengembangan Produk Kosmetik Bersama Tim Dreamlab',
    href: '/thankyou/google/',
    icon: Users,
    parallaxSpeed: 0.6,
    revealDelay: 350,
    labelSide: 'right' as const,
  },
] as const;

export default function BrandShowcaseSection({ content }: BrandShowcaseSectionProps) {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [entered, setEntered] = useState(false);
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDesktopPointer, setIsDesktopPointer] = useState(false);
  const [scrollFade, setScrollFade] = useState<{ opacity: number; scale: number }>({
    opacity: 1,
    scale: 1,
  });

  // Entrance trigger (IntersectionObserver once)
  useEffect(() => {
    if (reducedMotion) {
      setEntered(true);
      return;
    }
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setEntered(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reducedMotion]);

  // Detect desktop non-touch for subtle mouse parallax
  useEffect(() => {
    if (typeof window === 'undefined' || reducedMotion) return;
    const check = () => {
      const fine = window.matchMedia('(pointer: fine)').matches;
      setIsDesktopPointer(fine && window.innerWidth >= 1024);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [reducedMotion]);

  // Subtle scroll-past transition (Rule 13)
  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < -80) {
            const past = Math.min(1, Math.abs(rect.top + 80) / 420);
            setScrollFade({
              opacity: 1 - past * 0.04,
              scale: 1 - past * 0.01,
            });
          } else {
            setScrollFade({ opacity: 1, scale: 1 });
          }
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reducedMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isDesktopPointer || reducedMotion || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 .. 1
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 .. 1
    setMouseOffset({ x: normX * 4, y: normY * 3 });
  };

  const handleMouseLeave = () => {
    if (!isDesktopPointer) return;
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden bg-[#F8FAFC] py-16 md:py-22 lg:py-24 border-b border-slate-100"
      style={{
        opacity: scrollFade.opacity,
        transform: `scale(${scrollFade.scale})`,
        transition: 'opacity 180ms ease-out, transform 180ms ease-out',
      }}
    >
      {/* Inline Keyframes for subtle waves & floating accent (GPU transform only) */}
      <style jsx>{`
        @keyframes dreamlabWaveDrift {
          0%, 100% {
            transform: translate3d(-10px, 0, 0);
          }
          50% {
            transform: translate3d(10px, 0, 0);
          }
        }
        @keyframes dreamlabAccentFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -4px, 0);
          }
        }
        .wave-motion {
          animation: dreamlabWaveDrift 10s ease-in-out infinite;
        }
        .accent-float {
          animation: dreamlabAccentFloat 4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .wave-motion,
          .accent-float {
            animation: none !important;
          }
        }
      `}</style>

      {/* Subtle Decorative Orange Background Waves (Rule 8) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 -left-12 w-[560px] h-[220px] opacity-35 wave-motion select-none z-0"
      >
        <svg viewBox="0 0 600 240" fill="none" className="w-full h-full">
          <path
            d="M0 160 C120 90, 260 220, 420 130 C500 85, 560 110, 600 95 L600 240 L0 240 Z"
            fill="url(#dlWaveGrad1)"
          />
          <path
            d="M0 195 C140 135, 310 230, 480 155 C540 128, 575 140, 600 132 L600 240 L0 240 Z"
            fill="url(#dlWaveGrad2)"
          />
          <defs>
            <linearGradient id="dlWaveGrad1" x1="0" y1="90" x2="600" y2="240" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE2B8" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#FDE2B8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="dlWaveGrad2" x1="0" y1="130" x2="600" y2="240" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F9BC60" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F9BC60" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Subtle Floating Orange Accent Dot (Rule 12) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-[6%] w-3 h-3 rounded-full bg-[#F39200]/25 accent-float hidden md:block z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-16 right-[4%] w-2.5 h-2.5 rounded-full bg-[#F39200]/20 accent-float hidden lg:block z-0"
        style={{ animationDelay: '1.5s' }}
      />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT COLUMN: Headline, Description, Dynamic Stats, CTA */}
          <div className="lg:col-span-5 space-y-6 text-left">
            {/* 1. Headline (600ms, translateY 20px -> 0) */}
            <div
              style={{
                opacity: entered ? 1 : 0,
                transform: entered || reducedMotion ? 'translate3d(0,0,0)' : 'translate3d(0,20px,0)',
                transition: reducedMotion ? 'opacity 150ms ease' : 'opacity 600ms ease-out, transform 600ms ease-out',
              }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0A2558] tracking-tight leading-[1.15]">
                {content?.title || (
                  <>
                    Wujudkan Brand
                    <br />
                    Bersama Dreamlab
                  </>
                )}
              </h2>
              {/* 11. Headline Micro Interaction: orange underline width 0% -> 100%, 700ms, delay 400ms */}
              <div className="mt-2.5 h-1 w-28 overflow-hidden rounded-full bg-transparent">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#F39200] to-[#FBB03B]"
                  style={{
                    width: entered || reducedMotion ? '100%' : '0%',
                    transition: reducedMotion ? 'none' : 'width 700ms ease-out 400ms',
                  }}
                />
              </div>
            </div>

            {/* 2. Description (delay 100ms, translateY 15px -> 0) */}
            <p
              className="text-sm sm:text-[15px] text-slate-600 leading-relaxed font-medium"
              style={{
                opacity: entered ? 1 : 0,
                transform: entered || reducedMotion ? 'translate3d(0,0,0)' : 'translate3d(0,15px,0)',
                transition: reducedMotion
                  ? 'opacity 150ms ease'
                  : 'opacity 600ms ease-out 100ms, transform 600ms ease-out 100ms',
              }}
            >
              {content?.description || (
                <>
                  Dreamlab adalah perusahaan maklon kosmetik dengan layanan lengkap dari awal hingga akhir. Kami menawarkan{' '}
                  <strong className="font-bold text-[#0A2558]">One Stop Maklon Service</strong>, mulai dari konsultasi,
                  pembuatan formula, desain kemasan, produksi, hingga pengurusan izin BPOM dan Halal.
                </>
              )}
            </p>

            {/* 3. Dynamic Statistic Cards (delay 200ms, translateY 15px -> 0) */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
              style={{
                opacity: entered ? 1 : 0,
                transform: entered || reducedMotion ? 'translate3d(0,0,0)' : 'translate3d(0,15px,0)',
                transition: reducedMotion
                  ? 'opacity 150ms ease'
                  : 'opacity 600ms ease-out 200ms, transform 600ms ease-out 200ms',
              }}
            >
              {/* Stat Card 1: 1.000++ Brand Terpercaya */}
              <div className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 shadow-[0_4px_16px_rgba(10,37,88,0.05)] transition-all duration-200 ease-out hover:-translate-y-[3px] hover:shadow-[0_10px_24px_rgba(10,37,88,0.09)]">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#F39200] transition-transform duration-200 ease-out group-hover:scale-105">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-[#0A2558] leading-tight">
                    <AnimatedStatCounter target={1000} suffix="++" reducedMotion={reducedMotion} />
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600">Brand Terpercaya</div>
                </div>
              </div>

              {/* Stat Card 2: 2.000++ Formula Terkembangkan */}
              <div className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 shadow-[0_4px_16px_rgba(10,37,88,0.05)] transition-all duration-200 ease-out hover:-translate-y-[3px] hover:shadow-[0_10px_24px_rgba(10,37,88,0.09)]">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#F39200] transition-transform duration-200 ease-out group-hover:scale-105">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-[#0A2558] leading-tight">
                    <AnimatedStatCounter target={2000} suffix="++" reducedMotion={reducedMotion} />
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600">Formula Terkembangkan</div>
                </div>
              </div>
            </div>

            {/* 4. Primary CTA Button (delay 300ms, translateY 15px -> 0) */}
            <div
              className="pt-1"
              style={{
                opacity: entered ? 1 : 0,
                transform: entered || reducedMotion ? 'translate3d(0,0,0)' : 'translate3d(0,15px,0)',
                transition: reducedMotion
                  ? 'opacity 150ms ease'
                  : 'opacity 600ms ease-out 300ms, transform 600ms ease-out 300ms',
              }}
            >
              <Link
                href="/thankyou/google/"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#E67E00] via-[#F39200] to-[#F7A623] px-7 py-3.5 text-sm sm:text-[15px] font-bold text-white shadow-[0_10px_25px_rgba(243,146,0,0.32)] transition-all duration-200 ease-out hover:-translate-y-[2px] hover:shadow-[0_14px_30px_rgba(243,146,0,0.42)] active:scale-[0.98]"
              >
                <svg
                  className="h-5 w-5 shrink-0 transition-transform duration-200 ease-out group-hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>{content?.primaryCta || 'Konsultasi Gratis Sekarang'}</span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-[5px]" />
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: Asymmetric Editorial Bento Showcase (3 Full-Framing Interactive Cards) */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
              {/* Featured Tall Card (Pengembangan Formula) */}
              {(() => {
                const card = SERVICE_CARDS[0];
                const IconComp = card.icon;
                const px = isDesktopPointer && !reducedMotion ? mouseOffset.x * card.parallaxSpeed : 0;
                const py = isDesktopPointer && !reducedMotion ? mouseOffset.y * card.parallaxSpeed : 0;

                return (
                  <div
                    className="sm:col-span-6"
                    style={{
                      opacity: entered ? 1 : 0,
                      transform: entered || reducedMotion
                        ? `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0)`
                        : 'translate3d(30px, 25px, 0)',
                      transition: entered
                        ? 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 600ms ease-out'
                        : `opacity 600ms ease-out ${card.revealDelay}ms, transform 600ms ease-out ${card.revealDelay}ms`,
                    }}
                  >
                    <Link
                      href={card.href}
                      className="group relative block h-[320px] sm:h-[424px] w-full overflow-hidden rounded-[24px] border-[3px] border-white bg-white shadow-[0_12px_34px_rgba(10,37,88,0.1)] transition-all duration-300 ease-out hover:scale-[1.015] hover:shadow-[0_18px_42px_rgba(10,37,88,0.14)] active:scale-[0.99]"
                    >
                      <Image
                        src={card.image}
                        alt={card.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 28vw"
                        className="object-cover object-top transition-all duration-500 ease-out group-hover:scale-[1.025] group-hover:brightness-[1.03]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A2558]/40 via-transparent to-transparent" />

                      {/* Floating Frosted-Glass Pill */}
                      <div className="absolute bottom-4 left-4 right-4 transition-transform duration-300 ease-out group-hover:-translate-y-1">
                        <div className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/92 px-3.5 py-2 shadow-[0_8px_24px_rgba(10,37,88,0.14)] backdrop-blur-md">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-[#F39200] transition-transform duration-300 ease-out group-hover:rotate-[4deg]">
                            <IconComp className="h-4 w-4" />
                          </div>
                          <div className="pr-1 leading-tight">
                            <div className="text-xs sm:text-[13px] font-extrabold text-[#0A2558]">{card.title}</div>
                            <div className="text-xs sm:text-[13px] font-extrabold text-[#0A2558]">{card.subtitle}</div>
                          </div>
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F39200] text-white transition-transform duration-300 ease-out group-hover:translate-x-[4px]">
                            <ArrowRight className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })()}

              {/* Right Stack: Produksi Berkualitas & Konsultasi dan Konsep */}
              <div className="sm:col-span-6 flex flex-col gap-4">
                {SERVICE_CARDS.slice(1).map((card) => {
                  const IconComp = card.icon;
                  const px = isDesktopPointer && !reducedMotion ? mouseOffset.x * card.parallaxSpeed : 0;
                  const py = isDesktopPointer && !reducedMotion ? mouseOffset.y * card.parallaxSpeed : 0;

                  return (
                    <div
                      key={card.id}
                      style={{
                        opacity: entered ? 1 : 0,
                        transform: entered || reducedMotion
                          ? `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0)`
                          : 'translate3d(30px, 25px, 0)',
                        transition: entered
                          ? 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 600ms ease-out'
                          : `opacity 600ms ease-out ${card.revealDelay}ms, transform 600ms ease-out ${card.revealDelay}ms`,
                      }}
                    >
                      <Link
                        href={card.href}
                        className="group relative block h-[204px] w-full overflow-hidden rounded-[24px] border-[3px] border-white bg-white shadow-[0_12px_34px_rgba(10,37,88,0.1)] transition-all duration-300 ease-out hover:scale-[1.015] hover:shadow-[0_18px_42px_rgba(10,37,88,0.14)] active:scale-[0.99]"
                      >
                        <Image
                          src={card.image}
                          alt={card.alt}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 28vw"
                          className={`object-cover transition-all duration-500 ease-out group-hover:scale-[1.025] group-hover:brightness-[1.03] ${
                            card.id === 'production' ? 'object-[center_22%]' : 'object-center'
                          }`}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A2558]/40 via-transparent to-transparent" />

                        {/* Floating Frosted-Glass Pill */}
                        <div className="absolute bottom-3.5 left-3.5 right-3.5 transition-transform duration-300 ease-out group-hover:-translate-y-1">
                          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/80 bg-white/92 px-3 py-1.5 shadow-[0_8px_24px_rgba(10,37,88,0.14)] backdrop-blur-md">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-[#F39200] transition-transform duration-300 ease-out group-hover:rotate-[4deg]">
                              <IconComp className="h-4 w-4" />
                            </div>
                            <div className="pr-1 leading-tight">
                              <div className="text-xs font-extrabold text-[#0A2558]">{card.title}</div>
                              <div className="text-xs font-extrabold text-[#0A2558]">{card.subtitle}</div>
                            </div>
                            <div className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-[#F39200] text-white transition-transform duration-300 ease-out group-hover:translate-x-[4px]">
                              <ArrowRight className="h-3.5 w-3.5" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
