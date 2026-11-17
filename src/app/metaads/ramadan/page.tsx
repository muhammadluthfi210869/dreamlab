"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Gift,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useMetaAdsCtaPixel } from "@/lib/meta-ads-pixel";
import { trackLeadEvent } from "@/lib/lead-analytics";
import { LeadQualificationModal } from "@/components/LeadQualificationModal";
import { AdsCredibilitySection } from "@/components/landing-pages/AdsCredibilitySection";
import LogoScroll from "@/components/LogoScroll";
import FactoryFacilityMarquee from "@/components/FactoryFacilityMarquee";
import { aboutData } from "@/data/about-us";
import { homepageData } from "@/data/homepage";

const RAMADAN_CATEGORIES = [
  {
    num: "01",
    name: "Skincare",
    tag: "15+ Formula Premium",
    tagline: "Formula glowing untuk brand skincare-mu",
    image: "/assets/images/catalog/skincare.jpg",
    alt: "Maklon Skincare Dreamlab",
  },
  {
    num: "02",
    name: "Body Care",
    tag: "20+ Formula Premium",
    tagline: "Perawatan tubuh dengan sensasi spa",
    image: "/assets/images/catalog/bodycare.jpg",
    alt: "Maklon Body Care Dreamlab",
  },
  {
    num: "03",
    name: "Hair Care",
    tag: "10+ Formula Premium",
    tagline: "Solusi rambut sehat dari akar",
    image: "/assets/images/catalog/haircare.jpg",
    alt: "Maklon Hair Care Dreamlab",
  },
  {
    num: "04",
    name: "Decorative (Makeup)",
    tag: "12+ Formula Premium",
    tagline: "Warna yang jadi signature brand-mu",
    image: "/assets/images/catalog/decorative.jpg",
    alt: "Maklon Decorative (Makeup) Dreamlab",
  },
  {
    num: "05",
    name: "Baby Care",
    tag: "8+ Formula Premium",
    tagline: "Lembut & aman untuk kulit si kecil",
    image: "/assets/images/catalog/babycare.jpg",
    alt: "Maklon Baby Care Dreamlab",
  },
  {
    num: "06",
    name: "Parfum & Fragrance",
    tag: "15+ Signature Scent",
    tagline: "Aroma khas yang mudah diingat",
    image: "/assets/images/catalog/parfum.jpg",
    alt: "Maklon Parfum & Fragrance Dreamlab",
  },
  {
    num: "07",
    name: "Foot Care & Special Care",
    tag: "10+ Formula Premium",
    tagline: "Perawatan kaki & produk spesial",
    image: "/assets/images/catalog/footcare.jpg",
    alt: "Maklon Foot Care & Special Care Dreamlab",
  },
];

const PROMO_BENEFITS = [
  {
    icon: Sparkles,
    title: "Free Custom Formula & Sampel",
    desc: "1 Client = 1 Formula eksklusif diracik tim R&D agar produk Anda tampil beda di pasar Ramadan.",
  },
  {
    icon: Gift,
    title: "Free Desain Kemasan & Marketing Kit",
    desc: "Bonus desain label, visual 3D, dan materi promosi siap pakai untuk jualan lebih cepat.",
  },
  {
    icon: ShieldCheck,
    title: "BPOM, Halal MUI & CPKB Grade A",
    desc: "Seluruh legalitas diurus tuntas oleh tim regulasi Dreamlab dengan MOQ fleksibel untuk pemula.",
  },
];

export default function MetaAdsRamadanPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Skincare");

  useMetaAdsCtaPixel("Meta Ads - Ramadan Promo");

  const openQualification = (location: string, category = "Skincare") => {
    setSelectedCategory(category);
    trackLeadEvent("consultation_cta_clicked", {
      source: "meta-ramadan",
      channel: "metaads",
      category,
      location,
    });
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-white text-[#212120] overflow-x-clip">
      {/* 1. HERO (Full-bleed visible product background behind copy on both Mobile & Desktop) */}
      <section className="relative w-full min-h-[600px] sm:min-h-[640px] md:min-h-[620px] lg:min-h-[660px] flex items-center overflow-hidden bg-[#EAF2FA]">
        {/* Mobile Full-Bleed Background */}
        <Image
          src="/assets/ramadan/hero-mobile.webp"
          alt="Paket maklon kosmetik Ramadan Dreamlab"
          fill
          priority
          sizes="100vw"
          className="md:hidden object-cover object-center"
        />

        {/* Desktop Full-Bleed Background */}
        <Image
          src="/assets/ramadan/hero-desktop.webp"
          alt="Paket maklon kosmetik Ramadan Dreamlab"
          fill
          priority
          sizes="100vw"
          className="hidden md:block object-cover object-right"
        />

        {/* Mobile Translucent Readability Scrim (keeps product objects visible behind text) */}
        <div
          aria-hidden="true"
          className="md:hidden absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-white/70 via-white/55 to-white/35"
        />

        {/* Desktop Left-to-Right Readability Gradient */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-white/95 via-white/80 via-45% to-transparent"
        />

        <div className="relative z-20 mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
          <div className="max-w-[520px]">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF3E2]/95 border border-[#F39200]/30 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C86400] mb-4">
              <span className="h-2 w-2 rounded-full bg-[#F39200]" />
              Promo Maklon Ramadan · Kuota Terbatas
            </span>

            <h1 className="font-display text-[30px] sm:text-[42px] lg:text-[50px] font-normal leading-[1.08] tracking-[-0.02em] text-[#212120] mb-3.5 drop-shadow-[0_1px_8px_rgba(255,255,255,0.85)]">
              Wujudkan Brand Kosmetik Anda Siap Panen di{" "}
              <span className="text-[#F39200]">Momen Ramadan</span>
            </h1>

            <p className="text-[14.5px] sm:text-[17px] text-[#212120]/85 md:text-[#6B6762] font-medium md:font-normal leading-relaxed mb-5 drop-shadow-[0_1px_6px_rgba(255,255,255,0.9)]">
              Buat brand skincare, parfum, hingga hamper Lebaran dengan merek Anda sendiri. Formula eksklusif, MOQ fleksibel, dan legalitas BPOM &amp; Halal diurus tuntas.
            </p>

            <ul className="space-y-2 mb-6 text-[13.5px] sm:text-[14px] font-semibold md:font-medium text-[#212120] drop-shadow-[0_1px_6px_rgba(255,255,255,0.9)]">
              {[
                "Gratis Konsultasi Formula & Rencana HPP",
                "MOQ Ramah Pemula + Skema Pembayaran Bertahap",
                "Gratis Desain Kemasan & Pendampingan BPOM / Halal",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F39200] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => openQualification("hero", "Skincare")}
              className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto rounded-full bg-gradient-to-r from-[#F39200] to-[#E07B00] text-white font-bold text-[14px] sm:text-[15px] px-7 py-4 shadow-[0_12px_28px_-8px_rgba(243,146,0,0.65)] hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Klaim Promo Ramadan Sekarang</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. PROMO BENEFITS */}
      <section className="bg-[#F7FAFE] py-12 sm:py-16 border-y border-blue-100/70">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PROMO_BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="rounded-2xl bg-white border border-blue-100/80 p-6 shadow-xs"
                >
                  <div className="size-10 rounded-xl bg-[#FFF3E2] text-[#C86400] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-[18px] text-[#212120] mb-1.5">
                    {b.title}
                  </h2>
                  <p className="text-[13.5px] text-[#6B6762] leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. KATEGORI PRODUK RAMADAN (Continuous + Swipeable Floating Panel Marquee) */}
      <section className="py-14 sm:py-20 bg-[#FAF8F5] overflow-x-clip">
        <style>{`
          @keyframes ramadan-cat-marquee {
            0% {
              transform: translate3d(0, 0, 0);
            }
            100% {
              transform: translate3d(-50%, 0, 0);
            }
          }
          .ramadan-marquee-viewport {
            overflow-x: auto;
            overflow-y: hidden;
            scrollbar-width: none;
            -ms-overflow-style: none;
            -webkit-overflow-scrolling: touch;
            padding: 8px 0 40px;
            -webkit-mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent);
            mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent);
          }
          .ramadan-marquee-viewport::-webkit-scrollbar {
            display: none;
          }
          .ramadan-marquee-track {
            display: flex;
            width: max-content;
            gap: 16px;
            animation: ramadan-cat-marquee 40s linear infinite;
            will-change: transform;
          }
          @media (min-width: 640px) {
            .ramadan-marquee-track {
              gap: 20px;
            }
          }
          @media (hover: hover) {
            .ramadan-marquee-viewport:hover .ramadan-marquee-track {
              animation-play-state: paused;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .ramadan-marquee-track {
              animation: none;
            }
            .ramadan-marquee-dup {
              display: none !important;
            }
          }
        `}</style>

        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 mb-10 sm:mb-12 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-[#C86400] mb-2">
            KATALOG PRODUK BEST-SELLER RAMADAN
          </span>
          <h2 className="font-display text-[26px] sm:text-[36px] text-[#212120] leading-tight mb-3">
            Pilih Kategori Produk untuk{" "}
            <span className="text-[#F39200]">Brand Anda</span>
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#6B6762] max-w-2xl mx-auto">
            Semua kategori tersedia dalam paket promo Ramadan dengan formula custom dan kemasan siap edar. Geser atau klik untuk konsultasi.
          </p>
        </div>

        <div className="ramadan-marquee-viewport">
          <div className="ramadan-marquee-track">
            {[0, 1].map((trackIdx) => (
              <div
                key={trackIdx}
                aria-hidden={trackIdx === 1 ? "true" : undefined}
                className={`flex shrink-0 flex-nowrap gap-4 sm:gap-5 ${
                  trackIdx === 1 ? "ramadan-marquee-dup" : ""
                }`}
              >
                {RAMADAN_CATEGORIES.map((cat) => (
                  <button
                    key={`${trackIdx}-${cat.num}`}
                    type="button"
                    onClick={() => openQualification(`catalog-${cat.name.toLowerCase()}`, cat.name)}
                    tabIndex={trackIdx === 1 ? -1 : undefined}
                    className="group relative shrink-0 w-[72vw] max-w-[270px] sm:w-[290px] lg:w-[310px] sm:max-w-none aspect-[2/3] rounded-[20px] overflow-hidden bg-[#E9E3DC] shadow-[0_8px_24px_-6px_rgba(60,35,10,0.12),0_20px_40px_-14px_rgba(60,35,10,0.16)] block text-left cursor-pointer"
                  >
                    <Image
                      src={cat.image}
                      alt={trackIdx === 0 ? cat.alt : ""}
                      fill
                      loading="eager"
                      sizes="(max-width: 640px) 72vw, 310px"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-3.5 left-3.5 z-10 rounded-full bg-white/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#212120]">
                      {cat.tag}
                    </span>
                    <div className="absolute inset-x-3 bottom-3 z-10 rounded-[14px] bg-white/92 backdrop-blur-md p-4 shadow-[0_8px_24px_-10px_rgba(60,35,10,0.25)] flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-[18px] sm:text-[20px] text-[#212120] leading-snug">
                          {cat.name}
                        </h3>
                        <p className="text-[12.5px] text-[#6B6762] mt-1 leading-snug line-clamp-2">
                          {cat.tagline}
                        </p>
                      </div>
                      <span
                        aria-hidden="true"
                        className="size-9 rounded-full bg-[#212120] group-hover:bg-[#F39200] text-white flex items-center justify-center shrink-0 transition-all duration-300 group-hover:-rotate-45"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LOGO BRAND PARTNER DREAMLAB */}
      <LogoScroll
        logos={aboutData.partnerLogos}
        headline={homepageData.trustedBrands.title}
        subHeadline={homepageData.trustedBrands.subtitle}
      />

      {/* 5. DOKUMENTASI FASILITAS PRODUKSI ("BRAND TERBAIK ANDA DIMULAI DARI SINI") */}
      <FactoryFacilityMarquee />

      {/* 6. CREDIBILITY */}
      <AdsCredibilitySection />

      {/* 5. FINAL CTA */}
      <section className="py-14 sm:py-20 bg-gradient-to-b from-[#F4F8FD] to-white border-t border-blue-100/70">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-[26px] sm:text-[36px] text-[#212120] leading-tight mb-3">
            Siap Mulai Produksi Brand Kosmetik Anda Sebelum Ramadan?
          </h2>
          <p className="text-[14.5px] sm:text-[16px] text-[#6B6762] mb-7">
            Konsultasikan konsep produk, estimasi HPP, dan slot produksi promo Ramadan bersama Business Development Dreamlab sekarang.
          </p>
          <button
            type="button"
            onClick={() => openQualification("final-cta", "Skincare")}
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto rounded-full bg-gradient-to-r from-[#F39200] to-[#E07B00] text-white font-bold text-[15px] px-8 py-4 shadow-[0_12px_28px_-8px_rgba(243,146,0,0.65)] hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 shrink-0" />
            <span>Konsultasi Promo Ramadan Gratis</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </section>

      <LeadQualificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultCategory={selectedCategory}
        source="meta-ramadan"
        channel="metaads"
        landingPage="/metaads/ramadan/"
        campaign="Promo Maklon Ramadan"
      />
    </main>
  );
}
