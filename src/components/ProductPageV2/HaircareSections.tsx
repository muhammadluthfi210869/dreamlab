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
   1. PITA NILAI BERJALAN (MARQUEE) DI BAWAH HERO — WARNA ORANGE DREAMLAB
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
          className="flex items-center gap-3.5 px-6 sm:px-8 py-4 border-r border-[rgba(33,33,32,0.10)] shrink-0"
        >
          {item.logo ? (
            <div className="w-[44px] h-[44px] rounded-full bg-[#FFF3E2] flex items-center justify-center p-1.5 shrink-0">
              <Image
                src={item.logo}
                alt={ariaHidden ? "" : item.logoAlt || item.title}
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-[40px] h-[40px] rounded-full bg-[#FFF3E2] text-[#C86400] flex items-center justify-center shrink-0">
              <Sparkles className="size-4" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-display text-sm sm:text-base font-normal tracking-wide leading-tight text-[#C86400]">
              {item.title}
            </span>
            <span className="text-xs text-[#6B6762] font-medium leading-snug">
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
      className="relative w-full bg-white text-[#212120] overflow-x-auto lg:overflow-hidden select-none group border-y border-[rgba(33,33,32,0.10)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        className="w-full lg:overflow-hidden"
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
   2. SECTION VALUE: "KEUNTUNGAN MENJADI PARTNER DREAMLAB"
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
    <section className="py-[64px] sm:py-[104px] bg-[#FAF8F5]">
      <div className="mx-auto max-w-[1240px] px-[16px] sm:px-[40px]">
        <div className="text-center max-w-[680px] mx-auto mb-[32px] sm:mb-[48px]">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C86400] mb-3">
            Kenapa Dreamlab
          </span>
          <h2 className="font-display text-[clamp(28px,3.2vw,40px)] font-normal text-[#212120] leading-[1.12] uppercase">
            KEUNTUNGAN MENJADI PARTNER DREAMLAB
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {VALUE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.number}
                className="bg-white p-6 md:p-7 rounded-[18px] shadow-[0_6px_18px_-10px_rgba(60,35,10,0.18)] hover:shadow-[0_2px_4px_rgba(60,35,10,0.04),0_18px_40px_-14px_rgba(60,35,10,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between motion-reduce:transition-none motion-reduce:hover:transform-none"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="font-display text-2xl md:text-3xl text-[#C86400]">
                    {card.number}
                  </span>
                  <div className="size-[40px] rounded-full bg-[#FFF3E2] text-[#C86400] flex items-center justify-center">
                    <Icon className="size-5 stroke-[1.75]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-base md:text-lg font-normal text-[#212120] mb-2">
                    {card.title}
                  </h3>
                  <p className="text-[13.5px] text-[#6B6762] leading-relaxed">
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
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-brand-orange">
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
              <div className="w-[72px] h-[72px] rounded-2xl bg-white border border-gray-100 flex items-center justify-center p-2.5 mb-4">
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
  image: string;
}

export function getHaircareIngredientImage(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("aloe")) return "/assets/images/haircare/ingredients/aloe-vera.jpg";
  if (n.includes("ginseng") || n.includes("kemiri")) return "/assets/images/haircare/ingredients/ginseng-extract.jpg";
  if (n.includes("capixyl") || n.includes("clover") || n.includes("floral") || n.includes("rose")) return "/assets/images/haircare/ingredients/capixyl-clover.jpg";
  if (n.includes("redensyl") || n.includes("tea tree") || n.includes("rosemary") || n.includes("mint") || n.includes("green")) return "/assets/images/haircare/ingredients/botanical-redensyl.jpg";
  if (n.includes("procapil") || n.includes("argan") || n.includes("jojoba") || n.includes("olive") || n.includes("oil") || n.includes("biotin") || n.includes("vitamin")) return "/assets/images/haircare/ingredients/hair-follicle-oil.jpg";
  return "/assets/images/haircare/ingredients/peptide-protein.jpg";
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
    image: "/assets/images/haircare/ingredients/capixyl-clover.jpg",
  },
  {
    name: "Redensyl®",
    category: "Anti-rontok · Swiss",
    benefit:
      "Menargetkan sel punca folikel rambut untuk mendukung fase pertumbuhan rambut baru.",
    suitableFor: "Hair Tonic",
    featured: true,
    iconType: "peptide",
    image: "/assets/images/haircare/ingredients/botanical-redensyl.jpg",
  },
  {
    name: "Procapil™",
    category: "Anti-rontok · Peptida",
    benefit:
      "Gabungan biotinoyl tripeptide-1, apigenin, dan oleanolic acid. Memperkuat penambatan rambut di folikel.",
    suitableFor: "Hair Tonic, Scalp Care",
    featured: true,
    iconType: "peptide",
    image: "/assets/images/haircare/ingredients/hair-follicle-oil.jpg",
  },
  {
    name: "Biotin",
    category: "Vitamin B7",
    benefit:
      "Mendukung pembentukan keratin sehingga rambut lebih kuat dan tidak mudah patah.",
    suitableFor: "Hair Tonic, Shampoo",
    featured: true,
    iconType: "vitamin",
    image: "/assets/images/haircare/ingredients/hair-follicle-oil.jpg",
  },
  {
    name: "Bio-Keratin",
    category: "Protein repair",
    benefit:
      "Keratin terhidrolisis yang mengisi bagian serat rambut yang rusak.",
    suitableFor: "Hair Mask, Conditioner, Hair Serum",
    featured: true,
    iconType: "protein",
    image: "/assets/images/haircare/ingredients/peptide-protein.jpg",
  },
  {
    name: "Hydrolyzed Soy Protein",
    category: "Protein nabati",
    benefit:
      "Memperkuat batang rambut dan memberi volume pada rambut tipis.",
    suitableFor: "Shampoo, Conditioner, Hair Mask",
    featured: true,
    iconType: "protein",
    image: "/assets/images/haircare/ingredients/peptide-protein.jpg",
  },
  {
    name: "Aloe Vera",
    category: "Menenangkan",
    benefit:
      "Menenangkan dan melembapkan kulit kepala, mengurangi rasa gatal.",
    suitableFor: "Hair Tonic, Scalp Care, Hair Gel",
    featured: true,
    iconType: "botanical",
    image: "/assets/images/haircare/ingredients/aloe-vera.jpg",
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
    image: "/assets/images/haircare/ingredients/ginseng-extract.jpg",
  },
  {
    name: "Argan Oil",
    category: "Natural Oil · Kilau",
    benefit:
      "Kaya asam lemak esensial dan Vitamin E untuk melembutkan serta mengunci kilau rambut.",
    suitableFor: "Hair Serum, Hair Cuticle Coat, Hair Mask",
    featured: false,
    iconType: "oil",
    image: "/assets/images/haircare/ingredients/hair-follicle-oil.jpg",
  },
  {
    name: "Tea Tree Oil",
    category: "Antimikroba Alami",
    benefit:
      "Membersihkan sebum berlebih dan membantu meredakan ketombe serta gatal di kulit kepala.",
    suitableFor: "Shampoo, Scalp Care",
    featured: false,
    iconType: "botanical",
    image: "/assets/images/haircare/ingredients/botanical-redensyl.jpg",
  },
  {
    name: "Zinc Pyrithione",
    category: "Anti-ketombe Aktif",
    benefit:
      "Mengontrol pertumbuhan jamur penyebab ketombe dan menjaga keseimbangan kulit kepala.",
    suitableFor: "Shampoo, Scalp Care",
    featured: false,
    iconType: "mineral",
    image: "/assets/images/haircare/ingredients/peptide-protein.jpg",
  },
  {
    name: "Silk Protein",
    category: "Penghalus Kutikula",
    benefit:
      "Membentuk lapisan pelindung lembut yang membuat helaian rambut terasa licin dan mudah diatur.",
    suitableFor: "Conditioner, Hair Mask, Anti Split-End Serum",
    featured: false,
    iconType: "protein",
    image: "/assets/images/haircare/ingredients/peptide-protein.jpg",
  },
  {
    name: "Jojoba Oil",
    category: "Pelembap Biomimetik",
    benefit:
      "Menyerupai sebum alami kulit kepala untuk melembapkan batang rambut tanpa rasa lengket.",
    suitableFor: "Hair Vitamin, Beard Serum, Hair Serum",
    featured: false,
    iconType: "oil",
    image: "/assets/images/haircare/ingredients/hair-follicle-oil.jpg",
  },
];

function IngredientIcon({ type, featured }: { type: ActiveIngredientItem["iconType"]; featured: boolean }) {
  const baseClass = featured
    ? "bg-white text-brand-blue border border-brand-blue/20"
    : "bg-brand-orange/10 text-brand-orange";

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

const MARQUEE_INGREDIENT_CONFIG: Array<{
  name: string;
  image: string;
  mirror?: boolean;
  star?: boolean;
}> = [
  { name: "Capixyl™", image: "/assets/images/haircare/ingredients/capixyl-clover.jpg", star: true },
  { name: "Redensyl®", image: "/assets/images/haircare/ingredients/botanical-redensyl.jpg", star: true },
  { name: "Procapil™", image: "/assets/images/haircare/ingredients/procapil-peptide.jpg", star: true },
  { name: "Bio-Keratin", image: "/assets/images/haircare/ingredients/bio-keratin.jpg" },
  { name: "Ginseng Extract", image: "/assets/images/haircare/ingredients/ginseng-extract.jpg" },
  { name: "Aloe Vera", image: "/assets/images/haircare/ingredients/aloe-vera.jpg" },
  { name: "Tea Tree Oil", image: "/assets/images/haircare/ingredients/tea-tree-oil.jpg" },
  { name: "Argan Oil", image: "/assets/images/haircare/ingredients/argan-oil.jpg" },
];

export interface MarqueeIngredientCardItem {
  name: string;
  category: string;
  benefit: string;
  suitableFor: string;
  image: string;
  mirror?: boolean;
  star?: boolean;
}

export function HaircareActiveIngredientsSlider({
  categoryLabel = "Hair Care",
  customItems,
}: {
  categoryLabel?: string;
  customItems?: MarqueeIngredientCardItem[];
} = {}) {
  const marqueeItems: MarqueeIngredientCardItem[] =
    customItems ||
    MARQUEE_INGREDIENT_CONFIG.map((cfg) => {
      const found = ACTIVE_INGREDIENTS.find((i) => i.name === cfg.name);
      return {
        name: cfg.name,
        category: found?.category || "",
        benefit: found?.benefit || "",
        suitableFor: found?.suitableFor || "",
        image: cfg.image,
        mirror: Boolean(cfg.mirror),
        star: Boolean(cfg.star),
      };
    });

  const renderCard = (
    item: (typeof marqueeItems)[number],
    idx: number,
    isDuplicate: boolean
  ) => (
    <article
      key={`${isDuplicate ? "dup" : "main"}-${item.name}-${idx}`}
      tabIndex={isDuplicate ? -1 : 0}
      style={{ ["--fx" as string]: item.mirror ? -1 : 1 }}
      className="hc-ing-card group relative shrink-0 w-[240px] sm:w-[290px] aspect-[4/5] rounded-[22px] overflow-hidden bg-[#ECE6DF]"
    >
      <Image
        src={item.image}
        alt={isDuplicate ? "" : `${item.name} - Bahan Aktif Maklon Hair Care Dreamlab`}
        fill
        loading="eager"
        sizes="290px"
        className="hc-ing-img object-cover object-center"
      />

      {item.star && (
        <span className="absolute top-[16px] left-[16px] z-10 pointer-events-none rounded-full bg-[#F39200] px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-white">
          BAHAN BINTANG
        </span>
      )}

      <div className="absolute inset-x-[12px] bottom-[12px] z-10 rounded-[14px] bg-[rgba(255,255,255,0.96)] supports-[backdrop-filter]:bg-[rgba(255,255,255,0.90)] backdrop-blur-[14px] [-webkit-backdrop-filter:blur(14px)] px-[18px] py-[16px] shadow-[0_8px_24px_-10px_rgba(60,35,10,0.25)]">
        <span className="block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#C86400] mb-1">
          {item.category}
        </span>
        <h3 className="font-display text-[21px] font-normal text-[#212120] leading-[1.15]">
          {item.name}
        </h3>

        <div className="hidden sm:block">
          <div className="hc-ing-desc">
            <div className="overflow-hidden">
              <p className="text-[13px] text-[#6B6762] leading-relaxed">
                {item.benefit}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[rgba(33,33,32,0.10)] mt-2.5 pt-2 text-[12px]">
          <span className="text-[#6B6762]">Cocok untuk: </span>
          <span className="font-medium text-[#212120]">{item.suitableFor}</span>
        </div>
      </div>
    </article>
  );

  return (
    <section className="py-[72px] lg:py-[104px] bg-[#F3EEE8] overflow-x-clip">
      <style>{`
        @keyframes hc-ing-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 10px));
          }
        }
        .hc-ing-viewport {
          margin: 0 calc(50% - 50vw);
          padding: 10px 0 40px;
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }
        .hc-ing-viewport::-webkit-scrollbar {
          display: none;
        }
        .hc-ing-track {
          display: flex;
          width: max-content;
          gap: 20px;
          animation: hc-ing-marquee 48s linear infinite;
          will-change: transform;
        }
        .hc-ing-viewport:hover .hc-ing-track,
        .hc-ing-viewport:focus-within .hc-ing-track {
          animation-play-state: paused;
        }
        .hc-ing-card {
          box-shadow: 0 1px 2px rgba(60, 35, 10, 0.04), 0 8px 24px -6px rgba(60, 35, 10, 0.1), 0 24px 48px -12px rgba(60, 35, 10, 0.14);
          transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .hc-ing-card:focus-visible {
          outline: 2px solid #F39200;
          outline-offset: 4px;
        }
        @media (hover: hover) {
          .hc-ing-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 2px 4px rgba(60, 35, 10, 0.05), 0 16px 40px -8px rgba(60, 35, 10, 0.18), 0 36px 70px -16px rgba(60, 35, 10, 0.22);
          }
        }
        .hc-ing-card:focus-within {
          transform: translateY(-6px);
          box-shadow: 0 2px 4px rgba(60, 35, 10, 0.05), 0 16px 40px -8px rgba(60, 35, 10, 0.18), 0 36px 70px -16px rgba(60, 35, 10, 0.22);
        }
        .hc-ing-img {
          transform: scaleX(var(--fx, 1)) scale(1.45);
          transform-origin: center;
          transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (hover: hover) {
          .hc-ing-card:hover .hc-ing-img {
            transform: scaleX(var(--fx, 1)) scale(1.52);
          }
        }
        .hc-ing-card:focus-within .hc-ing-img {
          transform: scaleX(var(--fx, 1)) scale(1.52);
        }
        .hc-ing-desc {
          display: grid;
          grid-template-rows: 0fr;
          opacity: 0;
          margin-top: 0;
          transition: grid-template-rows 450ms cubic-bezier(0.22, 1, 0.36, 1), opacity 450ms cubic-bezier(0.22, 1, 0.36, 1), margin-top 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (hover: hover) {
          .hc-ing-card:hover .hc-ing-desc {
            grid-template-rows: 1fr;
            opacity: 1;
            margin-top: 6px;
          }
        }
        .hc-ing-card:focus-within .hc-ing-desc {
          grid-template-rows: 1fr;
          opacity: 1;
          margin-top: 6px;
        }
        .hc-ing-hint {
          display: block;
        }
        @media (hover: none) {
          .hc-ing-hint {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hc-ing-viewport {
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-mask-image: none;
            mask-image: none;
            padding-left: 16px;
            padding-right: 16px;
          }
          .hc-ing-track {
            animation: none !important;
          }
          .hc-ing-dup {
            display: none !important;
          }
          .hc-ing-card {
            scroll-snap-align: start;
            transition: none !important;
          }
          .hc-ing-img,
          .hc-ing-desc {
            transition: none !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-[1240px] px-[16px] lg:px-[40px]">
        <div className="text-center max-w-[760px] mx-auto mb-10 lg:mb-12">
          <span className="inline-block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#C86400] mb-3">
            FORMULASI R&amp;D TERUJI
          </span>
          <h2 className="font-display text-[28px] sm:text-[36px] lg:text-[42px] font-normal text-[#212120] leading-[1.15]">
            Bahan Aktif Unggulan <span className="text-[#F39200]">{categoryLabel}</span>
          </h2>
        </div>
      </div>

      {/* Full-bleed continuous marquee */}
      <div
        role="region"
        aria-label={`Bahan Aktif Unggulan ${categoryLabel}`}
        className="hc-ing-viewport"
      >
        <div className="hc-ing-track">
          <div className="flex flex-nowrap gap-[20px] shrink-0">
            {marqueeItems.map((item, idx) => renderCard(item, idx, false))}
          </div>
          <div
            aria-hidden="true"
            className="hc-ing-dup flex flex-nowrap gap-[20px] shrink-0"
          >
            {marqueeItems.map((item, idx) => renderCard(item, idx, true))}
          </div>
        </div>
      </div>

      <p className="hc-ing-hint text-center text-[12px] text-[#6B6762]">
        Arahkan kursor untuk berhenti
      </p>
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
    hppAmount: "± Rp 47.000",
    hppUnit: "/botol",
    suggestedRetailPrice: "Rp 129.000",
    bpomCount: "1 SKU",
    featured: false,
  },
  {
    name: "Shampoo Sulfate-Free",
    quantity: "1.000 botol × 250 ml",
    hppAmount: "± Rp 37.250",
    hppUnit: "/botol",
    suggestedRetailPrice: "Rp 99.000–119.000",
    bpomCount: "1 SKU",
    featured: true,
    badge: "PALING DIMINATI",
  },
  {
    name: "Duo Scalp Regimen",
    quantity: "1.000 shampoo + 1.000 tonic",
    hppAmount: "± Rp 32.500",
    hppUnit: "/unit",
    suggestedRetailPrice: "Rp 199.000 per bundling",
    bpomCount: "2 SKU",
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

export interface BusinessPackageItem {
  name: string;
  quantity: string;
  hppAmount: string;
  hppUnit: string;
  suggestedRetailPrice: string;
  bpomCount: string;
  featured: boolean;
  badge?: string;
}

export function HaircareBusinessPackages({
  categoryLabel = "Hair Care",
  packages = BUSINESS_PACKAGES,
}: {
  categoryLabel?: string;
  packages?: BusinessPackageItem[];
} = {}) {
  return (
    <section className="py-[72px] lg:py-[104px] bg-[#FAF8F5]">
      <style>{`
        .hc-pkg-card {
          box-shadow: 0 1px 2px rgba(60, 35, 10, 0.04), 0 8px 24px -6px rgba(60, 35, 10, 0.1), 0 24px 48px -12px rgba(60, 35, 10, 0.14);
          transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (hover: hover) {
          .hc-pkg-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 2px 4px rgba(60, 35, 10, 0.05), 0 16px 40px -8px rgba(60, 35, 10, 0.18), 0 36px 70px -16px rgba(60, 35, 10, 0.22);
          }
        }
        .hc-pkg-featured {
          background: linear-gradient(180deg, #FFF4E5 0%, #FFFFFF 55%);
          border: 2px solid #F39200;
          box-shadow: 0 2px 4px rgba(243, 146, 0, 0.08), 0 24px 50px -16px rgba(243, 146, 0, 0.35);
          transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (min-width: 1024px) {
          .hc-pkg-featured {
            transform: translateY(-12px);
          }
          .hc-pkg-featured:hover {
            transform: translateY(-16px);
          }
        }
        .hc-pkg-btn:focus-visible {
          outline: 2px solid #F39200;
          outline-offset: 4px;
        }
        @media (prefers-reduced-motion: reduce) {
          .hc-pkg-card,
          .hc-pkg-featured {
            transition: none !important;
          }
          .hc-pkg-card:hover {
            transform: none !important;
          }
          @media (min-width: 1024px) {
            .hc-pkg-featured:hover {
              transform: translateY(-12px) !important;
            }
          }
        }
      `}</style>

      <div className="mx-auto max-w-[1240px] px-[16px] lg:px-[40px]">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-14 space-y-3">
          <span className="inline-block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#C86400]">
            ESTIMASI INVESTASI BRAND
          </span>
          <h2 className="font-display text-[28px] sm:text-[36px] lg:text-[42px] font-normal text-[#212120] leading-[1.15]">
            Simulasi Paket Maklon <span className="text-[#F39200]">{categoryLabel}</span>
          </h2>
          <p className="text-[14px] sm:text-[16px] text-[#6B6762]">
            Pilih simulasi paket sesuai rencana peluncuran brand Anda. Semua paket dapat disesuaikan kembali saat konsultasi.
          </p>
        </div>

        {/* 3 Package Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[22px] max-w-[520px] lg:max-w-none mx-auto items-stretch mb-10">
          {packages.map((pkg) => {
            const waText = encodeURIComponent(
              `Halo Dreamlab, saya tertarik konsultasi mengenai paket maklon "${pkg.name}" (${pkg.quantity}).`
            );
            const includedItems = [
              { pill: "EKSKLUSIF", label: "1 Klien, 1 Formula" },
              { pill: "FREE", label: `Pengurusan BPOM ${pkg.bpomCount}` },
              { pill: "FREE", label: "Desain custom" },
              { pill: "FREE", label: "Desain logo & kemasan" },
              { pill: "FREE", label: "Digital marketing kit" },
            ];

            return (
              <div
                key={pkg.name}
                className={`relative rounded-[22px] p-[32px_28px_28px] flex flex-col justify-between ${pkg.featured ? "hc-pkg-featured" : "hc-pkg-card bg-white"
                  }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-block bg-[#F39200] text-[#212120] text-[11px] font-bold uppercase tracking-wider px-4 py-1 rounded-full whitespace-nowrap">
                      {pkg.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="mb-5">
                    <h3 className="font-display text-[22px] font-normal text-[#212120] mb-1">
                      {pkg.name}
                    </h3>
                    <p className="text-[14px] text-[#6B6762]">
                      {pkg.quantity}
                    </p>
                  </div>

                  {/* Estimate box */}
                  <div
                    className={`rounded-[16px] p-[20px] mb-6 ${pkg.featured
                      ? "bg-white border border-[rgba(243,146,0,0.25)]"
                      : "bg-[#FAF8F5]"
                      }`}
                  >
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B6762] mb-1">
                      ESTIMASI HPP
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`font-display text-[32px] leading-tight ${pkg.featured ? "text-[#C86400]" : "text-[#212120]"
                          }`}
                      >
                        {pkg.hppAmount}
                      </span>
                      <span className="text-[13px] font-medium text-[#6B6762]">
                        {pkg.hppUnit}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#6B6762] mt-1.5">
                      Saran harga jual{" "}
                      <span className="font-semibold text-[#212120]">
                        {pkg.suggestedRetailPrice}
                      </span>
                    </p>
                  </div>

                  {/* Included items */}
                  <div className="mb-7">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B6762] mb-3">
                      TERMASUK
                    </span>
                    <ul className="space-y-[11px]">
                      {includedItems.map((inc) => (
                        <li
                          key={inc.label}
                          className="flex items-center gap-2.5 text-[14px] text-[#212120]"
                        >
                          <span className="size-5 rounded-full bg-[#FFF3E2] text-[#C86400] flex items-center justify-center shrink-0">
                            <CheckCircle2 className="size-3.5" />
                          </span>
                          <span className="inline-flex items-center gap-1.5 flex-wrap">
                            <span className="rounded-full bg-[#F39200] px-[7px] py-[3px] text-[9.5px] font-bold uppercase tracking-wider text-white leading-none">
                              {inc.pill}
                            </span>
                            <span>{inc.label}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link
                  href={`/thankyou/google/?source=haircare-paket&package=${encodeURIComponent(pkg.name)}`}
                  rel="nofollow"
                  className={`hc-pkg-btn w-full rounded-full py-3.5 px-5 text-[13px] font-semibold transition-colors inline-flex items-center justify-center gap-2 ${pkg.featured
                    ? "bg-[#F39200] text-[#212120] hover:bg-[#C86400] hover:text-white"
                    : "bg-white text-[#212120] border border-[rgba(33,33,32,0.10)] hover:border-[#F39200] hover:bg-[#FFF3E2]"
                    }`}
                >
                  <span>Konsultasi Paket Ini →</span>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Payment Strip */}
        <div className="bg-white rounded-[20px] shadow-[0_1px_2px_rgba(60,35,10,.04),0_6px_18px_-8px_rgba(60,35,10,.12)] p-[28px_32px] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <h3 className="font-display text-[18px] font-normal text-[#212120] shrink-0">
            Skema Pembayaran Bertahap yang Ringan
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            {PAYMENT_STEPS.map((item) => (
              <div key={item.step} className="flex items-center gap-3">
                <span className="size-[28px] rounded-full bg-[#FFF3E2] text-[#C86400] text-[12px] font-bold flex items-center justify-center shrink-0">
                  {item.step}
                </span>
                <span className="text-[13.5px] text-[#6B6762] leading-snug">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[12.5px] text-[#6B6762] mt-5">
          Angka adalah simulasi, bukan penawaran harga resmi.
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. SECTION OUR CLIENT: "Dipercaya 1000+ Brand di Indonesia"
   — LOGO PARTNER BERJALAN (MARQUEE), DIPERBESAR, TANPA SHAPE/BOX
   ═══════════════════════════════════════════════════════════════════════════ */
const HAIRCARE_CLIENTS = [
  { name: "Bebiboster", src: "/assets/images/Bebiboster-300x300.webp" },
  { name: "Itnob", src: "/assets/images/Itnob-300x300.webp" },
  { name: "Jilly Daily", src: "/assets/images/Jilly-Daily-300x300.webp" },
  { name: "Labbol", src: "/assets/images/Labbol-300x300.webp" },
  { name: "Sense Soul", src: "/assets/images/Sense-Soul-300x300.webp" },
  { name: "Tazzi", src: "/assets/images/Tazzi-300x300.webp" },
];

function ClientLogoStrip({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      aria-hidden={ariaHidden ? "true" : undefined}
      className="flex items-center gap-4 px-2 shrink-0"
    >
      {HAIRCARE_CLIENTS.map((client, idx) => (
        <div
          key={`${client.name}-${idx}`}
          className="relative w-[88px] h-[88px] sm:w-[120px] sm:h-[120px] shrink-0 bg-white rounded-[12px] sm:rounded-[16px] p-[6px] sm:p-[10px] shadow-[0_2px_8px_-4px_rgba(60,35,10,0.12)] flex items-center justify-center grayscale opacity-75 hover:grayscale-0 hover:opacity-100 hover:-translate-y-[3px] transition-all duration-300 motion-reduce:transition-none motion-reduce:hover:transform-none"
        >
          <Image
            src={client.src}
            alt={ariaHidden ? "" : `Logo ${client.name} – Klien Maklon Kosmetik Dreamlab`}
            width={120}
            height={120}
            className="max-h-full w-auto object-contain"
            sizes="(max-width: 640px) 88px, 120px"
          />
        </div>
      ))}
    </div>
  );
}

export function HaircareClientsSection({
  quoteText = "Tim R&D Dreamlab sangat membantu kami merumuskan formula Hair Tonic dan Hair Serum yang pas untuk karakter rambut konsumen Indonesia. Pengurusan BPOM dan Halal MUI berjalan rapi hingga produk kami siap rilis tepat waktu.",
  quoteAuthor = "Founder Brand Hair Care Mitra Dreamlab",
  quoteProduct = "Produk: Hair Tonic & Anti Split-End Smoothing Serum",
}: {
  quoteText?: string;
  quoteAuthor?: string;
  quoteProduct?: string;
} = {}) {
  return (
    <section className="py-[64px] sm:py-[104px] bg-[#FAF8F5] overflow-hidden">
      <div className="mx-auto max-w-[1240px] px-[16px] sm:px-[40px]">
        <div className="text-center max-w-[680px] mx-auto mb-[32px] sm:mb-[48px]">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C86400] mb-3">
            Mitra Brand Kami
          </span>
          <h2 className="font-display text-[clamp(28px,3.2vw,40px)] font-normal text-[#212120] leading-[1.12]">
            Dipercaya 1000+ Brand di Indonesia
          </h2>
        </div>

        {/* Marquee Logo Partner */}
        <div
          className="relative w-full overflow-hidden py-4 mb-10 group"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          <div className="flex w-max animate-[marquee_28s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            <ClientLogoStrip />
            <ClientLogoStrip ariaHidden />
          </div>
        </div>

        {/* Kartu Testimoni Klien Haircare */}
        <div className="max-w-3xl mx-auto bg-white rounded-[22px] shadow-[0_2px_6px_rgba(60,35,10,0.05),0_14px_32px_-16px_rgba(60,35,10,0.22)] p-6 sm:p-8 md:p-10 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="size-12 rounded-2xl bg-[#FFF3E2] text-[#C86400] flex items-center justify-center shrink-0">
              <Quote className="size-6" />
            </div>
            <div className="space-y-4">
              <blockquote className="text-sm sm:text-base text-[#212120] leading-relaxed italic">
                &ldquo;{quoteText}&rdquo;
              </blockquote>
              <div>
                <h3 className="font-display text-base font-normal text-[#212120]">
                  {quoteAuthor}
                </h3>
                <p className="text-xs text-[#C86400] font-semibold">
                  {quoteProduct}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Link "Lihat semua klien" ke /our-client */}
        <div className="text-center">
          <Link
            href="/our-client/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#212120] border-b border-[#F39200] pb-0.5 hover:text-[#C86400] transition-colors focus-visible:outline-2 focus-visible:outline-[#F39200] focus-visible:outline-offset-4"
          >
            <span>Lihat semua klien</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
