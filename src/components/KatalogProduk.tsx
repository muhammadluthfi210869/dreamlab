"use client";

import type { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";

interface KatalogProps {
  title?: string;
  categories?: {
    id: string;
    name: string;
    items: { name: string; src: string }[];
  }[];
  content?: {
    eyebrow: string;
    title: ReactNode;
    description: string;
    categories: typeof visualCategories;
  };
}

const visualCategories = [
  {
    id: "skincare",
    name: "Skincare",
    tag: "15+ Formula Premium",
    image: "/assets/images/catalog/skincare.jpg",
    subcategories: "Essence Toner • Face Serum • Moisturizer Cream • Gel Cleanser • Sunscreen",
    link: "/produk/skincare",
  },
  {
    id: "bodycare",
    name: "Body Care",
    tag: "20+ Formula Premium",
    image: "/assets/images/catalog/bodycare.jpg",
    subcategories: "Body Wash • Body Mask • Body Serum • Body Lotion • Body Scrub",
    link: "/produk/bodycare",
  },
  {
    id: "haircare",
    name: "Hair Care",
    tag: "10+ Formula Premium",
    image: "/assets/images/catalog/haircare.jpg",
    subcategories: "Bonding Shampoo • Hair Mask • Hair Serum • Hair Mist • No Wash Treatment",
    link: "/produk/haircare",
  },
  {
    id: "decorative",
    name: "Decorative (Makeup)",
    tag: "12+ Formula Premium",
    image: "/assets/images/catalog/decorative.jpg",
    subcategories: "Peptide Lip Treatment • Lip Matte • Lip Cream • Cushion • Foundation",
    link: "/produk/decorative",
  },
  {
    id: "babycare",
    name: "Baby Care",
    tag: "8+ Formula Premium",
    image: "/assets/images/catalog/babycare.jpg",
    subcategories: "Baby Hair & Body Wash • Baby Lotion • Baby Massage Oil • Baby Face Cream",
    link: "/produk/babycare",
  },
  {
    id: "parfum",
    name: "Parfum & Fragrance",
    tag: "15+ Signature Scent",
    image: "/assets/images/catalog/parfum.jpg",
    subcategories: "Extrait de Parfum • Eau de Parfum • Eau de Toilette • Body Mist",
    link: "/produk/parfum",
  },
  {
    id: "footcare",
    name: "Foot Care & Special Care",
    tag: "10+ Formula Premium",
    image: "/assets/images/catalog/footcare.jpg",
    subcategories: "Hydrating Foot Scrub • Foot Serum • Cooling Foot Gel • Foot Cream",
    link: "/produk/footcare",
  },
];

const premiumEase = [0.16, 1, 0.3, 1] as any;

export default function KatalogProduk({ content }: KatalogProps) {
  const categories = content?.categories || visualCategories;
  const isEn = Boolean(content);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: premiumEase,
      },
    },
  };

  return (
    <section
      id="katalog"
      className="py-20 lg:py-28 bg-gradient-to-b from-[#FAF8F5] via-white to-[#FAF8F5] relative overflow-hidden"
    >
      {/* Subtle Ambient Accents */}
      <div className="absolute top-0 left-1/4 w-[480px] h-[480px] bg-brand-orange/[0.03] rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[520px] h-[520px] bg-sky-200/20 rounded-full blur-[130px] pointer-events-none translate-y-1/2" />

      <div className="container-custom max-w-[1280px] relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: premiumEase }}
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-3xl mx-auto text-center mb-14 lg:mb-18"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-[#C86400] uppercase bg-[#FFF5E9] px-4 py-1.5 rounded-full mb-4 border border-[#F39200]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F39200]" />
            {content?.eyebrow || "Formulasi Eksklusif & CPKB Grade A"}
          </span>

          <h2 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight text-brand-black mb-5 uppercase">
            {content?.title || (
              <>
                Katalog Layanan <span className="text-brand-orange">Maklon Premium</span>
              </>
            )}
          </h2>

          <div className="h-1 w-16 bg-brand-orange mx-auto mb-5 rounded-full" />

          <p className="text-sm md:text-base text-neutral-600 leading-relaxed font-medium">
            {content?.description ||
              "Dari formulasi riset laboratorium (R&D) kustom, visualisasi desain branding eksklusif, hingga pendaftaran legalitas resmi BPOM, Halal, & HKI — kami mewujudkan brand kecantikan juara Anda."}
          </p>
        </motion.div>

        {/* Tidy, Symmetrical 7-Category Editorial Grid (4 top + 3 centered bottom on Desktop) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-wrap justify-center gap-6 lg:gap-7"
        >
          {categories.map((category, index) => {
            const subItems = category.subcategories
              .split(/[•·]/)
              .map((s) => s.trim())
              .filter(Boolean);

            return (
              <motion.div
                key={category.id}
                variants={cardVariants}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-21px)] flex"
              >
                <Link
                  href={category.link}
                  className="group flex flex-col w-full rounded-[22px] bg-white border border-neutral-200/80 hover:border-brand-orange/45 shadow-[0_8px_28px_rgba(12,35,64,0.04)] hover:shadow-[0_20px_44px_rgba(243,146,0,0.12)] transition-all duration-500 overflow-hidden hover:-translate-y-1.5"
                >
                  {/* Unobstructed 4:5 Studio Image Stage */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#F2F6FA]">
                    <Image
                      src={category.image}
                      alt={
                        isEn
                          ? `${category.name} manufacturing service`
                          : `Maklon ${category.name} Dreamlab`
                      }
                      title={
                        isEn
                          ? `${category.name} manufacturing service - Dreamlab`
                          : `Maklon ${category.name} - Dreamlab Indonesia`
                      }
                      fill
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      quality={90}
                    />

                    {/* Top Floating Formula Count Badge & Index */}
                    <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10 pointer-events-none">
                      <span className="px-3 py-1 rounded-full bg-white/92 backdrop-blur-xs border border-white text-[10px] font-bold uppercase tracking-[0.12em] text-[#C86400] shadow-xs font-onest">
                        {category.tag}
                      </span>
                      <span className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs border border-white text-[10px] font-bold text-neutral-700 flex items-center justify-center shadow-xs font-onest">
                        0{index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Clean White Editorial Footer */}
                  <div className="p-5 lg:p-5.5 flex flex-col justify-between flex-1 bg-white border-t border-neutral-100">
                    <div>
                      {/* Title & Action Icon */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <h3 className="text-[15px] lg:text-base font-extrabold font-onest text-brand-black uppercase tracking-wide group-hover:text-brand-orange transition-colors duration-300">
                          {category.name}
                        </h3>
                        <span className="w-8 h-8 rounded-full bg-[#FFF6EB] border border-brand-orange/20 text-brand-orange group-hover:bg-brand-orange group-hover:border-brand-orange group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0">
                          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>

                      {/* Tidy Subcategory Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {subItems.slice(0, 4).map((sub) => (
                          <span
                            key={sub}
                            className="inline-block text-[11px] font-medium text-neutral-600 bg-[#F8F9FA] group-hover:bg-[#FFF9F2] border border-neutral-200/70 group-hover:border-brand-orange/20 px-2.5 py-0.5 rounded-md transition-colors duration-300"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Subtle Bottom Link Prompt */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500 group-hover:text-brand-orange transition-colors duration-300 font-onest">
                      <span>{isEn ? "Explore Category" : "Lihat Varian Produk"}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA to Full Product Hub */}
        <div className="mt-12 lg:mt-14 text-center">
          <Link
            href={isEn ? "/en/produk/" : "/produk/"}
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl bg-white hover:bg-brand-orange text-brand-black hover:text-white border border-neutral-200 hover:border-brand-orange font-bold text-xs md:text-sm uppercase tracking-[0.15em] font-onest shadow-xs hover:shadow-lg hover:shadow-brand-orange/15 transition-all duration-300 group"
          >
            <span>{isEn ? "View Full Product Catalog" : "Lihat Seluruh Katalog Produk"}</span>
            <ArrowRight className="w-4 h-4 text-brand-orange group-hover:text-white transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
