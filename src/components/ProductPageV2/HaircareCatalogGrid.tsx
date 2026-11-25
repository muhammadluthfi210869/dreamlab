"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProductVariantV2 } from "@/types/product-v2";
import { productImageAlt, productImageTitle } from "@/lib/image-utils";
import { getCardImagePath } from "@/data/product-card-images";

interface HaircareCatalogGridProps {
  products: ProductVariantV2[];
  categorySlug: string;
}

const HAIR_CONCERN_FILTERS = [
  "Semua",
  "Kering & Rusak",
  "Rontok & Ketombe",
  "Styling & Harian",
] as const;

function getCardImage(slug: string, categorySlug: string, fallbackImage: string): string {
  return getCardImagePath(slug, categorySlug) || fallbackImage;
}

function matchesConcern(product: ProductVariantV2, filter: string): boolean {
  if (filter === "Semua") return true;
  return (
    product.concernFilter === filter ||
    Boolean(product.tags && product.tags.includes(filter))
  );
}

export default function HaircareCatalogGrid({
  products,
  categorySlug,
}: HaircareCatalogGridProps) {
  const [activeFilter, setActiveFilter] = useState<string>("Semua");
  const [columns, setColumns] = useState<number>(4);

  useEffect(() => {
    const updateCols = () => {
      const w = window.innerWidth;
      if (w <= 640) setColumns(2);
      else if (w <= 1024) setColumns(3);
      else setColumns(4);
    };
    updateCols();
    window.addEventListener("resize", updateCols, { passive: true });
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  const filterCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const f of HAIR_CONCERN_FILTERS) {
      map[f] = products.filter((p) => matchesConcern(p, f)).length;
    }
    return map;
  }, [products]);

  const visibleCount = filterCounts[activeFilter] ?? products.length;
  const ctaColSpan =
    columns === 2 ? 2 : columns - (visibleCount % columns);

  return (
    <section
      id="katalog-produk"
      className="relative z-10 bg-[#FAF8F5] py-[72px] lg:py-[104px] overflow-x-clip"
    >
      <style>{`
        .hc-filter-row {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hc-filter-row::-webkit-scrollbar {
          display: none;
        }
        .hc-card {
          box-shadow: 0 1px 2px rgba(60, 35, 10, 0.04), 0 8px 24px -6px rgba(60, 35, 10, 0.1), 0 24px 48px -12px rgba(60, 35, 10, 0.14);
          transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (hover: hover) {
          .hc-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 2px 4px rgba(60, 35, 10, 0.05), 0 16px 40px -8px rgba(60, 35, 10, 0.18), 0 36px 70px -16px rgba(60, 35, 10, 0.22);
          }
        }
        .hc-card:focus-within {
          transform: translateY(-6px);
          box-shadow: 0 2px 4px rgba(60, 35, 10, 0.05), 0 16px 40px -8px rgba(60, 35, 10, 0.18), 0 36px 70px -16px rgba(60, 35, 10, 0.22);
        }
        .hc-card a:focus-visible,
        .hc-cta-btn:focus-visible,
        .hc-filter-btn:focus-visible {
          outline: 2px solid #F39200;
          outline-offset: 4px;
        }
        .hc-card-img {
          transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (hover: hover) {
          .hc-card:hover .hc-card-img {
            transform: scale(1.05);
          }
        }
        .hc-card:focus-within .hc-card-img {
          transform: scale(1.05);
        }
        .hc-card-expand {
          display: grid;
          grid-template-rows: 0fr;
          opacity: 0;
          margin-top: 0;
          transition: grid-template-rows 450ms cubic-bezier(0.22, 1, 0.36, 1), opacity 450ms cubic-bezier(0.22, 1, 0.36, 1), margin-top 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (hover: hover) {
          .hc-card:hover .hc-card-expand {
            grid-template-rows: 1fr;
            opacity: 1;
            margin-top: 8px;
          }
        }
        .hc-card:focus-within .hc-card-expand {
          grid-template-rows: 1fr;
          opacity: 1;
          margin-top: 8px;
        }
        .hc-card-arrow {
          transition: background-color 450ms cubic-bezier(0.22, 1, 0.36, 1), transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (hover: hover) {
          .hc-card:hover .hc-card-arrow {
            background-color: #F39200;
            transform: rotate(-45deg);
          }
        }
        .hc-card:focus-within .hc-card-arrow {
          background-color: #F39200;
          transform: rotate(-45deg);
        }
        .hc-last-cta {
          background-color: #EFE7DE;
          background-image: url('/new%20asset/background-visual-hero-section/haircare.webp');
          background-size: cover;
          background-position: 72% center;
          box-shadow: 0 1px 2px rgba(60, 35, 10, 0.04), 0 8px 24px -6px rgba(60, 35, 10, 0.1), 0 24px 48px -12px rgba(60, 35, 10, 0.14);
        }
        .hc-last-cta::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(250, 246, 241, 0.96) 0%, rgba(250, 246, 241, 0.85) 55%, rgba(250, 246, 241, 0.3) 100%);
          z-index: 0;
        }
        @media (min-width: 641px) {
          .hc-last-cta {
            background-position: right center;
          }
          .hc-last-cta::before {
            background: linear-gradient(90deg, rgba(250, 246, 241, 0.97) 0%, rgba(250, 246, 241, 0.9) 38%, rgba(250, 246, 241, 0.35) 62%, transparent 80%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hc-card,
          .hc-card-img,
          .hc-card-expand,
          .hc-card-arrow,
          .hc-cta-btn {
            transition: none !important;
          }
          .hc-card:hover,
          .hc-card:focus-within {
            transform: none !important;
          }
          .hc-card:hover .hc-card-img,
          .hc-card:focus-within .hc-card-img {
            transform: none !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-[1240px] px-[16px] lg:px-[40px]">
        {/* Header */}
        <div className="text-center max-w-[760px] mx-auto mb-10 lg:mb-12">
          <span className="inline-block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#C86400] mb-3">
            13 FORMULA SIAP PRODUKSI
          </span>
          <h2 className="font-display text-[28px] sm:text-[36px] lg:text-[42px] font-normal text-[#212120] leading-[1.15] mb-4">
            Katalog <span className="text-[#F39200]">Maklon Hair Care</span>: Shampoo, Hair Tonic &amp; Serum Rambut
          </h2>
          <p className="text-[16px] text-[#6B6762] leading-relaxed">
            Pilih formula dasar maklon haircare, mulai dari shampoo, conditioner, hair tonic, hair serum, hingga pomade, yang siap kami sesuaikan bahan aktif, aroma, dan kemasannya untuk brand Anda.
          </p>
        </div>

        {/* Filter Pills */}
        <div
          aria-label="Filter kategori masalah rambut"
          className="hc-filter-row flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-2.5 overflow-x-auto pb-2 mb-8 lg:mb-10"
        >
          {HAIR_CONCERN_FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            const count = filterCounts[filter] ?? 0;
            return (
              <button
                key={filter}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveFilter(filter)}
                className={`hc-filter-btn shrink-0 rounded-full px-[18px] py-[10px] text-[14px] font-medium border transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#F39200] text-[#212120] border-[#F39200] shadow-[0_6px_18px_-10px_rgba(243,146,0,0.6)]"
                    : "bg-white text-[#212120] border-[rgba(33,33,32,0.10)] shadow-[0_6px_18px_-10px_rgba(60,35,10,0.18)] hover:border-[#212120]"
                }`}
              >
                <span>{filter}</span>
                <sup
                  className={`ml-1 text-[10px] font-semibold ${
                    isActive ? "text-[#212120]/75" : "text-[#9A958F]"
                  }`}
                >
                  {count}
                </sup>
              </button>
            );
          })}
        </div>

        {/* Product Grid + Last-Row CTA Card */}
        <div className="grid grid-cols-2 min-[641px]:grid-cols-3 min-[1025px]:grid-cols-4 gap-[12px] sm:gap-[22px]">
          {products.map((product) => {
            const matches = matchesConcern(product, activeFilter);
            const isNew = Boolean(product.isNew || (product.tags && product.tags.includes("Baru")));
            const variantsList =
              product.variants && product.variants.length > 0
                ? product.variants
                : (product.tags || []).filter((t) => t !== "Baru");
            const detailHref = `/produk/${categorySlug}/${product.slug}/`;
            const consultHref = `/thankyou/google/?source=haircare-catalog&product=${encodeURIComponent(product.slug)}`;

            return (
              <article
                key={product.id}
                className={`hc-card group relative aspect-[4/5] rounded-[16px] sm:rounded-[22px] overflow-hidden bg-[#F2EEE9] ${
                  matches ? "block" : "hidden"
                }`}
              >
                <Image
                  src={getCardImage(product.slug, categorySlug, product.heroImage)}
                  alt={productImageAlt(product.slug, categorySlug, product.name)}
                  title={productImageTitle(product.slug, categorySlug, product.name)}
                  fill
                  loading="lazy"
                  sizes="(max-width:640px) 46vw, (max-width:1024px) 30vw, 280px"
                  className="hc-card-img object-cover object-center"
                />

                {/* Stretched detail link */}
                <Link
                  href={detailHref}
                  aria-label={`Lihat detail ${product.name}`}
                  className="absolute inset-0 z-10 rounded-[16px] sm:rounded-[20px]"
                />

                {/* Top-left Pills */}
                <div className="absolute top-[10px] left-[10px] sm:top-[14px] sm:left-[14px] z-10 pointer-events-none flex flex-wrap items-center gap-1.5">
                  {isNew && (
                    <span className="rounded-full bg-[#F39200] px-2.5 py-1 text-[9px] sm:text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white">
                      BARU
                    </span>
                  )}
                  {product.concernFilter && (
                    <span className="rounded-full bg-[rgba(255,255,255,0.9)] supports-[backdrop-filter]:bg-[rgba(255,255,255,0.82)] backdrop-blur-[8px] px-2.5 py-1 text-[9px] sm:text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#212120]">
                      {product.concernFilter}
                    </span>
                  )}
                </div>

                {/* Bottom Floating Panel */}
                <div className="absolute inset-x-[8px] bottom-[8px] sm:inset-x-[12px] sm:bottom-[12px] z-20 pointer-events-none rounded-[12px] sm:rounded-[14px] bg-[rgba(255,255,255,0.96)] supports-[backdrop-filter]:bg-[rgba(255,255,255,0.90)] backdrop-blur-[14px] [-webkit-backdrop-filter:blur(14px)] p-[12px] sm:pt-[16px] sm:pr-[16px] sm:pb-[16px] sm:pl-[18px] shadow-[0_8px_24px_-10px_rgba(60,35,10,0.25)]">
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-[15px] sm:text-[19px] font-normal text-[#212120] leading-snug">
                        {product.name}
                      </h3>
                      <p className="hidden sm:block text-[12.5px] text-[#6B6762] mt-1 line-clamp-1 group-hover:line-clamp-3 group-focus-within:line-clamp-3">
                        {product.shortDescription}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="hc-card-arrow hidden sm:flex w-[34px] h-[34px] rounded-full bg-[#FFF3E2] text-[#C86400] items-center justify-center shrink-0"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Desktop Hover / Focus Expandable Variants & Consult Link */}
                  <div className="hidden sm:block">
                    <div className="hc-card-expand">
                      <div className="overflow-hidden border-t border-[rgba(33,33,32,0.10)] pt-2">
                        {variantsList.length > 0 && (
                          <p className="text-[12px] font-medium text-[#C86400] leading-snug">
                            {variantsList.join(" · ")}
                          </p>
                        )}
                        <Link
                          href={consultHref}
                          rel="nofollow"
                          className="pointer-events-auto relative z-30 inline-block mt-1.5 text-[12px] font-semibold text-[#212120] underline underline-offset-2 hover:text-[#C86400]"
                        >
                          Konsultasi produk ini
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {/* Last-Row Photo-Background CTA Card */}
          <div
            style={{ gridColumn: `span ${ctaColSpan} / span ${ctaColSpan}` }}
            className="hc-last-cta relative min-h-[300px] sm:min-h-[340px] rounded-[20px] overflow-hidden flex items-center"
          >
            <div className="relative z-10 p-[26px] sm:p-[36px] max-w-[460px]">
              <span className="inline-block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#C86400] mb-2">
                FORMULA CUSTOM
              </span>
              <h3 className="font-display text-[22px] sm:text-[26px] font-normal text-[#212120] leading-[1.2] mb-2.5">
                Belum menemukan produk yang pas untuk brand-mu?
              </h3>
              <p className="text-[14px] text-[#6B6762] leading-relaxed mb-5">
                Tim R&amp;D kami bisa kembangkan formula hair care baru sesuai konsep dan target pasar Anda.
              </p>
              <Link
                href="/thankyou/google/?source=haircare-custom-cta"
                rel="nofollow"
                className="hc-cta-btn inline-flex items-center gap-2 rounded-full bg-[#F39200] hover:bg-[#C86400] text-[#212120] hover:text-white font-semibold text-[14px] px-[22px] py-[13px] transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Konsultasi Formula Gratis →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

