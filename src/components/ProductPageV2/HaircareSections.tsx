"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FlaskConical,
  Sliders,
  ShieldCheck,
  Palette,
  TrendingUp,
  CheckCircle2,
  Droplets,
  Leaf,
  Atom,
  Award,
  Quote,
  ArrowRight,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   1. PITA NILAI BERJALAN (MARQUEE) DI BAWAH HERO
   ═══════════════════════════════════════════════════════════════════════════ */
interface MarqueeItem {
  title: string;
  subtitle: string;
  logo?: string;
  logoAlt?: string;
}

const MARQUEE_ITEMS: MarqueeItem[] = [
  { title: "1000+", subtitle: "Brand telah dipercayakan" },
  { title: "2000+", subtitle: "Formula dikembangkan" },
  { title: "MOQ Fleksibel", subtitle: "Menyesuaikan kebutuhan brand" },
  { title: "2–3 bulan", subtitle: "Estimasi waktu produksi" },
  {
    title: "CPKB Grade A",
    subtitle: "Pabrik bersertifikat",
    logo: "/images/certifications/cpkb.png",
    logoAlt: "Logo CPKB Grade A – Dreamlab maklon kosmetik bersertifikat",
  },
  {
    title: "Halal MUI",
    subtitle: "Sertifikasi halal resmi",
    logo: "/images/certifications/halal.png",
    logoAlt: "Logo Halal MUI – Dreamlab maklon kosmetik bersertifikat",
  },
  {
    title: "BPOM RI",
    subtitle: "Notifikasi kosmetik resmi",
    logo: "/images/certifications/bpom.png",
    logoAlt: "Logo BPOM RI – Dreamlab maklon kosmetik bersertifikat",
  },
  {
    title: "HKI",
    subtitle: "Perlindungan merek dagang",
    logo: "/images/certifications/hki.png",
    logoAlt: "Logo HKI – Dreamlab maklon kosmetik bersertifikat",
  },
];

function MarqueeItemList({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      aria-hidden={ariaHidden ? "true" : undefined}
      className="flex items-center shrink-0"
    >
      {MARQUEE_ITEMS.map((item, idx) => (
        <div
          key={`${item.title}-${idx}`}
          className="flex items-center gap-3.5 px-6 sm:px-8 py-3.5 border-r border-white/20 shrink-0"
        >
          {item.logo && (
            <div className="w-[46px] h-[46px] rounded-full bg-white flex items-center justify-center p-1.5 shrink-0 shadow-xs">
              <Image
                src={item.logo}
                alt={ariaHidden ? "" : item.logoAlt || item.title}
                width={36}
                height={36}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="flex flex-col text-white">
            <span className="font-display text-sm sm:text-base font-normal tracking-wide leading-tight">
              {item.title}
            </span>
            <span className="text-xs text-white/85 font-medium leading-snug">
              {item.subtitle}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function HaircareMarqueeBand() {
  return (
    <section
      aria-label="Keunggulan dan Sertifikasi Dreamlab"
      className="relative w-full bg-brand-blue text-white overflow-hidden select-none group border-y border-white/15"
    >
      <div
        className="w-full overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
      >
        <div className="flex w-max animate-[marquee_36s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          <MarqueeItemList />
          <MarqueeItemList ariaHidden />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. SECTION VALUE: "Nilai yang Kamu Dapat dari Dreamlab"
   ═══════════════════════════════════════════════════════════════════════════ */
const VALUE_CARDS = [
  {
    number: "01",
    title: "1 Klien, 1 Formula",
    description: "Formula eksklusif untuk brand kamu, tidak dijual ke brand lain.",
    icon: Sparkles,
  },
  {
    number: "02",
    title: "R&D dan Apoteker In-house",
    description:
      "Tim R&D dan apoteker penanggung jawab mengembangkan formula dengan bahan aktif teruji.",
    icon: FlaskConical,
  },
  {
    number: "03",
    title: "MOQ dan HPP Fleksibel",
    description:
      "MOQ dan harga pokok disesuaikan dengan modal dan target pasar.",
    icon: Sliders,
  },
  {
    number: "04",
    title: "Legalitas Diurus Tuntas",
    description:
      "BPOM, Halal MUI, dan HKI diurus tim regulasi atas nama brand klien.",
    icon: ShieldCheck,
  },
  {
    number: "05",
    title: "Desain dan Branding",
    description:
      "Tim kreatif menyiapkan logo, kemasan, dan identitas brand.",
    icon: Palette,
  },
  {
    number: "06",
    title: "Pendampingan Digital Marketing",
    description:
      "Foto produk, materi promosi, dan strategi jualan online maupun offline.",
    icon: TrendingUp,
  },
];

export function HaircareValueSection() {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-gray-100">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-3">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">
            Kenapa Dreamlab
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-brand-black leading-tight">
            Nilai yang Kamu Dapat dari Dreamlab
          </h2>
        </div>

        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {VALUE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.number}
                className="bg-[#FAF9F6] hover:bg-white p-6 md:p-7 rounded-3xl border border-gray-200/80 hover:border-brand-blue/40 transition-all duration-300 shadow-2xs hover:shadow-md flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="font-display text-2xl md:text-3xl text-brand-blue">
                    {card.number}
                  </span>
                  <div className="size-11 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                    <Icon className="size-5 stroke-[1.75]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-base md:text-lg font-normal text-brand-black mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. SECTION OUR CERTIFICATIONS: "Legalitas dan Sertifikasi Resmi"
   ═══════════════════════════════════════════════════════════════════════════ */
const CERTIFICATIONS = [
  {
    name: "CPKB Grade A",
    logo: "/images/certifications/cpkb.png",
    description:
      "Pabrik memenuhi standar Cara Pembuatan Kosmetik yang Baik dari BPOM.",
  },
  {
    name: "Notifikasi BPOM RI",
    logo: "/images/certifications/bpom.png",
    description:
      "Produk terdaftar resmi dan aman dijual di marketplace maupun retail.",
  },
  {
    name: "Halal MUI",
    logo: "/images/certifications/halal.png",
    description:
      "Bahan dan proses produksi bersertifikat halal untuk pasar Indonesia.",
  },
  {
    name: "HKI / Merek",
    logo: "/images/certifications/hki.png",
    description:
      "Pendaftaran merek dagang agar brand terlindungi secara hukum.",
  },
];

export function HaircareCertificationsSection() {
  return (
    <section className="py-16 md:py-24 bg-[#FAF9F6] border-b border-gray-100">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">
            Standar Mutu &amp; Regulasi
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-brand-black leading-tight">
            Legalitas dan Sertifikasi Resmi
          </h2>
        </div>

        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {CERTIFICATIONS.map((cert) => (
            <div
              key={cert.name}
              className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              <div className="w-[72px] h-[72px] rounded-2xl bg-[#FAF9F6] border border-gray-100 flex items-center justify-center p-2.5 mb-4">
                <Image
                  src={cert.logo}
                  alt={`Logo ${cert.name} – Dreamlab maklon kosmetik bersertifikat`}
                  width={72}
                  height={72}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-display text-base md:text-lg font-normal text-brand-black mb-2">
                {cert.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {cert.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3b. SECTION BAHAN AKTIF (SLIDER): "Bahan Aktif Unggulan Hair Care"
   ═══════════════════════════════════════════════════════════════════════════ */
interface ActiveIngredientItem {
  name: string;
  category: string;
  benefit: string;
  suitableFor: string;
  featured: boolean;
  iconType: "peptide" | "vitamin" | "protein" | "botanical" | "oil" | "mineral";
}

const ACTIVE_INGREDIENTS: ActiveIngredientItem[] = [
  {
    name: "Capixyl™",
    category: "Anti-rontok · Peptida",
    benefit:
      "Kombinasi peptida biomimetik dan ekstrak red clover. Membantu menguatkan akar dan mengurangi kerontokan.",
    suitableFor: "Hair Tonic, Scalp Care",
    featured: true,
    iconType: "peptide",
  },
  {
    name: "Redensyl®",
    category: "Anti-rontok · Swiss",
    benefit:
      "Menargetkan sel punca folikel rambut untuk mendukung fase pertumbuhan rambut baru.",
    suitableFor: "Hair Tonic",
    featured: true,
    iconType: "peptide",
  },
  {
    name: "Procapil™",
    category: "Anti-rontok · Peptida",
    benefit:
      "Gabungan biotinoyl tripeptide-1, apigenin, dan oleanolic acid. Memperkuat penambatan rambut di folikel.",
    suitableFor: "Hair Tonic, Scalp Care",
    featured: true,
    iconType: "peptide",
  },
  {
    name: "Biotin",
    category: "Vitamin B7",
    benefit:
      "Mendukung pembentukan keratin sehingga rambut lebih kuat dan tidak mudah patah.",
    suitableFor: "Hair Tonic, Shampoo",
    featured: true,
    iconType: "vitamin",
  },
  {
    name: "Bio-Keratin",
    category: "Protein repair",
    benefit:
      "Keratin terhidrolisis yang mengisi bagian serat rambut yang rusak.",
    suitableFor: "Hair Mask, Conditioner, Hair Serum",
    featured: true,
    iconType: "protein",
  },
  {
    name: "Hydrolyzed Soy Protein",
    category: "Protein nabati",
    benefit:
      "Memperkuat batang rambut dan memberi volume pada rambut tipis.",
    suitableFor: "Shampoo, Conditioner, Hair Mask",
    featured: true,
    iconType: "protein",
  },
  {
    name: "Aloe Vera",
    category: "Menenangkan",
    benefit:
      "Menenangkan dan melembapkan kulit kepala, mengurangi rasa gatal.",
    suitableFor: "Hair Tonic, Scalp Care, Hair Gel",
    featured: true,
    iconType: "botanical",
  },
  // Bahan pendukung
  {
    name: "Ginseng Extract",
    category: "Botanical · Sirkulasi",
    benefit:
      "Melancarkan sirkulasi mikro di kulit kepala dan menutrisi akar rambut yang lemah.",
    suitableFor: "Hair Tonic, Shampoo, Scalp Care",
    featured: false,
    iconType: "botanical",
  },
  {
    name: "Argan Oil",
    category: "Natural Oil · Kilau",
    benefit:
      "Kaya asam lemak esensial dan Vitamin E untuk melembutkan serta mengunci kilau rambut.",
    suitableFor: "Hair Serum, Hair Cuticle Coat, Hair Mask",
    featured: false,
    iconType: "oil",
  },
  {
    name: "Tea Tree Oil",
    category: "Antimikroba Alami",
    benefit:
      "Membersihkan sebum berlebih dan membantu meredakan ketombe serta gatal di kulit kepala.",
    suitableFor: "Shampoo, Scalp Care",
    featured: false,
    iconType: "botanical",
  },
  {
    name: "Zinc Pyrithione",
    category: "Anti-ketombe Aktif",
    benefit:
      "Mengontrol pertumbuhan jamur penyebab ketombe dan menjaga keseimbangan kulit kepala.",
    suitableFor: "Shampoo, Scalp Care",
    featured: false,
    iconType: "mineral",
  },
  {
    name: "Silk Protein",
    category: "Penghalus Kutikula",
    benefit:
      "Membentuk lapisan pelindung lembut yang membuat helaian rambut terasa licin dan mudah diatur.",
    suitableFor: "Conditioner, Hair Mask, Anti Split-End Serum",
    featured: false,
    iconType: "protein",
  },
  {
    name: "Jojoba Oil",
    category: "Pelembap Biomimetik",
    benefit:
      "Menyerupai sebum alami kulit kepala untuk melembapkan batang rambut tanpa rasa lengket.",
    suitableFor: "Hair Vitamin, Beard Serum, Hair Serum",
    featured: false,
    iconType: "oil",
  },
];

function IngredientIcon({ type, featured }: { type: ActiveIngredientItem["iconType"]; featured: boolean }) {
  const baseClass = featured
    ? "bg-white text-brand-blue border border-brand-blue/20"
    : "bg-brand-blue/10 text-brand-blue";

  return (
    <div className={`size-11 rounded-2xl flex items-center justify-center shrink-0 ${baseClass}`}>
      {type === "peptide" && <Atom className="size-5" />}
      {type === "vitamin" && <Award className="size-5" />}
      {type === "protein" && <FlaskConical className="size-5" />}
      {type === "botanical" && <Leaf className="size-5" />}
      {type === "oil" && <Droplets className="size-5" />}
      {type === "mineral" && <Sparkles className="size-5" />}
    </div>
  );
}

export function HaircareActiveIngredientsSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateScrollState = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);

    const cardWidth = el.firstElementChild?.clientWidth || 280;
    const idx = Math.round(scrollLeft / (cardWidth + 20));
    setActiveIndex(Math.min(Math.max(idx, 0), ACTIVE_INGREDIENTS.length - 1));
  }, []);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByCard = (direction: "left" | "right") => {
    const el = sliderRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth || 300;
    const scrollAmount = direction === "left" ? -(cardWidth + 20) : cardWidth + 20;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const scrollToIndex = (index: number) => {
    const el = sliderRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement | undefined;
    if (child) {
      el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByCard("left");
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByCard("right");
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white border-b border-gray-100">
      <div className="container-custom">
        {/* Header + Top-Right Round Navigation Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">
              Formulasi R&amp;D Teruji
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-brand-black leading-tight">
              Bahan Aktif Unggulan Hair Care
            </h2>
          </div>

          <div className="flex items-center gap-2 self-end">
            <button
              type="button"
              onClick={() => scrollByCard("left")}
              disabled={!canScrollLeft}
              aria-label="Geser bahan aktif ke kiri"
              className="size-11 rounded-full border border-gray-200 bg-white text-brand-black flex items-center justify-center hover:border-brand-blue hover:text-brand-blue disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard("right")}
              disabled={!canScrollRight}
              aria-label="Geser bahan aktif ke kanan"
              className="size-11 rounded-full border border-gray-200 bg-white text-brand-black flex items-center justify-center hover:border-brand-blue hover:text-brand-blue disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer shadow-2xs"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {/* Horizontal CSS Scroll-Snap Slider: ~1.2 cards on mobile, 2 on tablet, 4 on desktop */}
        <div
          ref={sliderRef}
          tabIndex={0}
          role="region"
          aria-label="Slider Bahan Aktif Unggulan Hair Care"
          onKeyDown={handleKeyDown}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 focus:outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {ACTIVE_INGREDIENTS.map((item) => (
            <article
              key={item.name}
              className={`snap-start shrink-0 w-[82%] min-[480px]:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3*1.25rem)/4)] p-6 rounded-3xl border flex flex-col justify-between transition-shadow hover:shadow-md ${
                item.featured
                  ? "bg-gradient-to-br from-[#EAF4FC] via-[#F3F9FE] to-white border-brand-blue/25"
                  : "bg-[#FAF9F6] border-gray-200/80"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <IngredientIcon type={item.iconType} featured={item.featured} />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      item.featured
                        ? "bg-brand-blue text-white"
                        : "bg-gray-200/70 text-gray-700"
                    }`}
                  >
                    {item.category}
                  </span>
                </div>

                <h3 className="font-display text-lg font-normal text-brand-black mb-2">
                  {item.name}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  {item.benefit}
                </p>
              </div>

              <div className="pt-3 border-t border-brand-blue/10 text-xs text-brand-black/80">
                <strong className="text-brand-blue">Cocok untuk:</strong> {item.suitableFor}
              </div>
            </article>
          ))}
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-6" role="tablist" aria-label="Indikator slide bahan aktif">
          {ACTIVE_INGREDIENTS.map((item, idx) => (
            <button
              key={item.name}
              type="button"
              aria-label={`Ke bahan aktif ${item.name}`}
              onClick={() => scrollToIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeIndex === idx ? "w-6 bg-brand-blue" : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. SECTION PAKET BISNIS: "Simulasi Paket Maklon Hair Care"
   ═══════════════════════════════════════════════════════════════════════════ */
const BUSINESS_PACKAGES = [
  {
    name: "Starter Hair Tonic",
    quantity: "500 botol × 100 ml",
    totalCapital: "± Rp 23,5 jt",
    hpp: "± Rp 47.000/botol",
    suggestedRetailPrice: "Rp 129.000",
    includes: [
      "R&D sampel dan aroma custom",
      "BPOM 1 SKU",
      "Botol spray amber + label + dus",
      "Uji stabilitas",
    ],
    featured: false,
  },
  {
    name: "Shampoo Sulfate-Free",
    quantity: "1.000 botol × 250 ml",
    totalCapital: "± Rp 37,25 jt",
    hpp: "± Rp 37.250/botol",
    suggestedRetailPrice: "Rp 99.000–119.000",
    includes: [
      "Formula tanpa SLS dengan keratin",
      "BPOM 1 SKU",
      "Botol pump + stiker vinyl",
      "QA + Halal",
    ],
    featured: true,
    badge: "Paling diminati",
  },
  {
    name: "Duo Scalp Regimen",
    quantity: "1.000 shampoo + 1.000 tonic",
    totalCapital: "± Rp 65 jt",
    hpp: "± Rp 32.500/unit",
    suggestedRetailPrice: "Rp 199.000 per bundling",
    includes: [
      "R&D 2 formula",
      "BPOM 2 SKU",
      "Kemasan 2.000 unit",
      "Uji lab + Halal + QC",
    ],
    featured: false,
  },
];

const PAYMENT_STEPS = [
  {
    step: "1",
    text: "Commitment fee untuk sampel",
  },
  {
    step: "2",
    text: "DP 50% setelah formula dan desain disetujui",
  },
  {
    step: "3",
    text: "Pelunasan 50% setelah produksi selesai dan lolos QC",
  },
];

export function HaircareBusinessPackages() {
  return (
    <section className="py-16 md:py-24 bg-[#FAF9F6] border-b border-gray-100">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-14 space-y-3">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">
            Estimasi Investasi Brand
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-brand-black leading-tight">
            Simulasi Paket Maklon Hair Care
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Pilih simulasi paket sesuai rencana peluncuran brand Anda. Semua paket dapat disesuaikan kembali saat konsultasi.
          </p>
        </div>

        {/* 3 Package Cards */}
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch mb-10">
          {BUSINESS_PACKAGES.map((pkg) => {
            const waText = encodeURIComponent(
              `Halo Dreamlab, saya tertarik konsultasi mengenai paket maklon "${pkg.name}" (${pkg.quantity}).`
            );
            return (
              <div
                key={pkg.name}
                className={`relative bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-shadow ${
                  pkg.featured
                    ? "border-2 border-brand-blue shadow-lg"
                    : "border border-gray-200/80 shadow-xs hover:shadow-md"
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-block bg-brand-blue text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-xs">
                      {pkg.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="mb-5 pb-5 border-b border-gray-100">
                    <h3 className="font-display text-xl font-normal text-brand-black mb-1">
                      {pkg.name}
                    </h3>
                    <p className="text-xs font-bold text-brand-blue">
                      {pkg.quantity}
                    </p>
                  </div>

                  {/* Pricing rows */}
                  <div className="space-y-3 mb-6 text-xs sm:text-sm">
                    <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                      <span className="text-gray-500">Modal total</span>
                      <span className="font-display text-lg text-brand-black">
                        {pkg.totalCapital}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                      <span className="text-gray-500">Estimasi HPP</span>
                      <span className="font-bold text-brand-black">{pkg.hpp}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                      <span className="text-gray-500">Saran harga jual</span>
                      <span className="font-bold text-brand-blue">
                        {pkg.suggestedRetailPrice}
                      </span>
                    </div>
                  </div>

                  {/* Included items */}
                  <div className="mb-8">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                      Termasuk:
                    </span>
                    <ul className="space-y-2">
                      {pkg.includes.map((inc) => (
                        <li
                          key={inc}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700"
                        >
                          <CheckCircle2 className="size-4 text-brand-blue shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <a
                  href={`https://wa.me/6281131900095?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-brand-orange hover:bg-brand-black text-white text-center font-bold py-3.5 px-5 rounded-xl text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
                >
                  <span>Konsultasi Paket Ini</span>
                  <ArrowRight className="size-4" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Baris Pembayaran Bertahap (3 Langkah) */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8">
          <h3 className="font-display text-base sm:text-lg font-normal text-brand-black text-center mb-6">
            Skema Pembayaran Bertahap yang Ringan
          </h3>
          <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-4 sm:gap-6">
            {PAYMENT_STEPS.map((item) => (
              <div
                key={item.step}
                className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FAF9F6] border border-gray-100"
              >
                <span className="size-9 rounded-full bg-brand-blue text-white font-display text-sm flex items-center justify-center shrink-0">
                  {item.step}
                </span>
                <span className="text-xs sm:text-sm font-medium text-brand-black leading-snug">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-500 mt-5">
            Angka adalah simulasi, bukan penawaran harga resmi.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. SECTION OUR CLIENT: "Dipercaya 1000+ Brand di Indonesia"
   ═══════════════════════════════════════════════════════════════════════════ */
const HAIRCARE_CLIENTS = [
  { name: "Bebiboster", src: "/assets/images/Bebiboster-300x300.webp" },
  { name: "Itnob", src: "/assets/images/Itnob-300x300.webp" },
  { name: "Jilly Daily", src: "/assets/images/Jilly-Daily-300x300.webp" },
  { name: "Labbol", src: "/assets/images/Labbol-300x300.webp" },
  { name: "Sense Soul", src: "/assets/images/Sense-Soul-300x300.webp" },
  { name: "Tazzi", src: "/assets/images/Tazzi-300x300.webp" },
];

export function HaircareClientsSection() {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-gray-100">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">
            Mitra Brand Kami
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-brand-black leading-tight">
            Dipercaya 1000+ Brand di Indonesia
          </h2>
        </div>

        {/* Dinding Logo Klien: 2 kolom di HP, 6 kolom di desktop, grayscale -> berwarna saat hover */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 mb-12">
          {HAIRCARE_CLIENTS.map((client) => (
            <div
              key={client.name}
              className="bg-[#FAF9F6] hover:bg-white rounded-2xl border border-gray-100 hover:border-brand-blue/30 p-5 flex items-center justify-center h-28 transition-all duration-300 group"
            >
              <Image
                src={client.src}
                alt={`Logo ${client.name} – Klien Maklon Kosmetik Dreamlab`}
                width={140}
                height={80}
                className="max-h-16 w-auto object-contain grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>

        {/* Kartu Testimoni Klien Haircare */}
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#EAF4FC] via-[#F5FAFE] to-white rounded-3xl border border-brand-blue/20 p-6 sm:p-8 md:p-10 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="size-12 rounded-2xl bg-brand-blue text-white flex items-center justify-center shrink-0">
              <Quote className="size-6" />
            </div>
            <div className="space-y-4">
              <blockquote className="text-sm sm:text-base text-brand-black leading-relaxed italic">
                &ldquo;Tim R&amp;D Dreamlab sangat membantu kami merumuskan formula Hair Tonic dan Hair Serum yang pas untuk karakter rambut konsumen Indonesia. Pengurusan BPOM dan Halal MUI berjalan rapi hingga produk kami siap rilis tepat waktu.&rdquo;
              </blockquote>
              <div>
                <h3 className="font-display text-base font-normal text-brand-black">
                  Founder Brand Hair Care Mitra Dreamlab
                </h3>
                <p className="text-xs text-brand-blue font-semibold">
                  Produk: Hair Tonic &amp; Anti Split-End Smoothing Serum
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Link "Lihat semua klien" ke /our-client */}
        <div className="text-center">
          <Link
            href="/our-client/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-blue hover:text-brand-orange transition-colors"
          >
            <span>Lihat semua klien</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

