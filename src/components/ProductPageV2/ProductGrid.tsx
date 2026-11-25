"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductVariantV2 } from "@/types/product-v2";
import { productImageAlt, productImageTitle } from "@/lib/image-utils";
import { getCardImagePath } from "@/data/product-card-images";

interface ProductGridProps {
  products: ProductVariantV2[];
  categorySlug: string;
  subCategorySlug?: string;
}

const getCardImage = (
  slug: string,
  categorySlug: string,
  fallbackImage: string
): string => {
  return getCardImagePath(slug, categorySlug) || fallbackImage;
};

const HAIR_CONCERN_FILTERS = [
  "Semua",
  "Kering & Rusak",
  "Rontok & Ketombe",
  "Styling & Harian",
] as const;

export default function ProductGrid({
  products,
  categorySlug,
  subCategorySlug,
}: ProductGridProps) {
  const [activeFilter, setActiveFilter] = useState<string>("Semua");

  const isHaircare = categorySlug === "haircare";
  const categoryName =
    categorySlug === "pkrt"
      ? "PKRT"
      : categorySlug === "haircare"
        ? "Hair Care"
        : categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

  const productHref = (slug: string) =>
    subCategorySlug
      ? `/produk/${categorySlug}/${subCategorySlug}/${slug}/`
      : `/produk/${categorySlug}/${slug}/`;

  return (
    <section
      id="katalog-produk"
      className="relative z-10 bg-[#FAF8F5] py-[64px] sm:py-[104px] overflow-x-clip"
    >
      <style>{`
        .pg-card {
          box-shadow: 0 2px 6px rgba(60, 35, 10, 0.05), 0 14px 32px -16px rgba(60, 35, 10, 0.22);
          transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (hover: hover) {
          .pg-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 2px 4px rgba(60, 35, 10, 0.04), 0 18px 40px -14px rgba(60, 35, 10, 0.18);
          }
          .pg-card:hover .pg-card-img {
            transform: scale(1.05);
          }
          .pg-card:hover .pg-card-expand {
            grid-template-rows: 1fr;
            opacity: 1;
            margin-top: 10px;
          }
          .pg-card:hover .pg-card-arrow {
            background-color: #F39200;
            color: #212120;
            transform: rotate(-45deg);
          }
        }
        .pg-card:focus-within {
          transform: translateY(-6px);
          box-shadow: 0 2px 4px rgba(60, 35, 10, 0.04), 0 18px 40px -14px rgba(60, 35, 10, 0.18);
        }
        .pg-card:focus-within .pg-card-expand {
          grid-template-rows: 1fr;
          opacity: 1;
          margin-top: 10px;
        }
        .pg-card-img {
          transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .pg-card-expand {
          display: grid;
          grid-template-rows: 0fr;
          opacity: 0;
          margin-top: 0;
          transition: grid-template-rows 450ms cubic-bezier(0.22, 1, 0.36, 1), opacity 450ms cubic-bezier(0.22, 1, 0.36, 1), margin-top 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .pg-card-arrow {
          transition: background-color 450ms cubic-bezier(0.22, 1, 0.36, 1), color 450ms cubic-bezier(0.22, 1, 0.36, 1), transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .pg-card a:focus-visible,
        .pg-filter-btn:focus-visible {
          outline: 2px solid #F39200;
          outline-offset: 4px;
        }
        @media (prefers-reduced-motion: reduce) {
          .pg-card,
          .pg-card-img,
          .pg-card-expand,
          .pg-card-arrow {
            transition: none !important;
          }
          .pg-card:hover,
          .pg-card:focus-within,
          .pg-card:hover .pg-card-img {
            transform: none !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-[1240px] px-[16px] sm:px-[40px]">
        {/* Header */}
        <div className="text-center max-w-[680px] mx-auto mb-[32px] sm:mb-[48px]">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C86400] mb-[12px]">
            Katalog Produk Maklon
          </span>
          <h2 className="font-display font-normal text-[clamp(28px,3.2vw,40px)] leading-[1.12] tracking-[-0.01em] text-[#212120]">
            {isHaircare ? (
              <>
                13 Produk{" "}
                <span className="text-[#F39200]">Hair Care</span> Siap Maklon
              </>
            ) : (
              <>
                Pilihan Produk{" "}
                <span className="text-[#F39200]">{categoryName}</span> Siap
                Maklon
              </>
            )}
          </h2>
          <p className="mt-[14px] text-[15px] sm:text-[16px] leading-[1.6] text-[#6B6762]">
            Pilih formulasi dasar terbaik yang siap kami sesuaikan bahan aktif,
            aroma, dan kemasannya untuk brand kosmetik Anda.
          </p>
        </div>

        {/* Hair Concern Filter Pills */}
        {isHaircare && (
          <div
            role="tablist"
            aria-label="Filter masalah rambut"
            className="flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-2.5 overflow-x-auto pb-2 mb-8 lg:mb-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {HAIR_CONCERN_FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(filter)}
                  className={`pg-filter-btn shrink-0 px-[18px] py-[10px] rounded-full text-[14px] font-medium transition-colors cursor-pointer border ${isActive
                    ? "bg-[#F39200] text-[#212120] border-[#F39200] shadow-[0_6px_18px_-10px_rgba(243,146,0,0.6)]"
                    : "bg-white text-[#212120] border-[rgba(33,33,32,0.10)] shadow-[0_6px_18px_-10px_rgba(60,35,10,0.18)] hover:border-[#212120]"
                    }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        )}

        {/* Floating-Panel Grid */}
        <div className="grid grid-cols-2 min-[641px]:grid-cols-3 min-[1025px]:grid-cols-4 gap-[12px] sm:gap-[24px] w-full">
          {products.map((product) => {
            const matchesFilter =
              !isHaircare ||
              activeFilter === "Semua" ||
              product.concernFilter === activeFilter ||
              (product.tags && product.tags.includes(activeFilter));

            const variantsList =
              product.variants && product.variants.length > 0
                ? product.variants
                : product.tags.filter((t) => t !== "Baru");

            const consultHref = `/thankyou/google/?source=${encodeURIComponent(categorySlug)}-catalog&product=${encodeURIComponent(product.slug)}`;

            return (
              <article
                key={product.id}
                className={`pg-card group relative aspect-[4/5] rounded-[16px] sm:rounded-[22px] overflow-hidden bg-[#F2EEE9] ${matchesFilter ? "block" : "hidden"
                  }`}
              >
                <Image
                  src={getCardImage(
                    product.slug,
                    categorySlug,
                    product.heroImage
                  )}
                  alt={productImageAlt(
                    product.slug,
                    categorySlug,
                    product.name
                  )}
                  title={productImageTitle(
                    product.slug,
                    categorySlug,
                    product.name
                  )}
                  fill
                  sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 280px"
                  loading="lazy"
                  className="pg-card-img object-cover object-center"
                />

                <Link
                  href={productHref(product.slug)}
                  aria-label={`${product.name} — Detail Produk`}
                  className="absolute inset-0 z-10 rounded-[16px] sm:rounded-[22px]"
                />

                {/* Top-left Badges / Tags */}
                <div className="absolute top-[10px] left-[10px] sm:top-[14px] sm:left-[14px] z-10 pointer-events-none flex flex-wrap items-center gap-1.5">
                  {(product.isNew || product.tags.includes("Baru")) && (
                    <span className="px-2.5 py-1 rounded-full text-[9px] sm:text-[10.5px] font-semibold uppercase tracking-[0.1em] bg-[#F39200] text-white">
                      Baru
                    </span>
                  )}
                  {product.concernFilter ? (
                    <span className="px-2.5 py-1 rounded-full text-[9px] sm:text-[10.5px] font-semibold uppercase tracking-[0.1em] bg-[rgba(255,255,255,0.9)] supports-[backdrop-filter]:bg-[rgba(255,255,255,0.82)] backdrop-blur-[8px] text-[#212120]">
                      {product.concernFilter}
                    </span>
                  ) : (
                    product.tags &&
                    product.tags[0] && (
                      <span className="px-2.5 py-1 rounded-full text-[9px] sm:text-[10.5px] font-semibold uppercase tracking-[0.1em] bg-[rgba(255,255,255,0.9)] supports-[backdrop-filter]:bg-[rgba(255,255,255,0.82)] backdrop-blur-[8px] text-[#212120]">
                        {product.tags[0]}
                      </span>
                    )
                  )}
                </div>

                {/* Floating Glass Panel at Bottom */}
                <div className="absolute inset-x-[8px] bottom-[8px] sm:inset-x-[12px] sm:bottom-[12px] z-20 pointer-events-none rounded-[12px] sm:rounded-[16px] bg-[rgba(255,255,255,0.96)] supports-[backdrop-filter]:bg-[rgba(255,255,255,0.90)] backdrop-blur-[14px] p-[12px] sm:pt-[16px] sm:pr-[16px] sm:pb-[16px] sm:pl-[18px] shadow-[0_8px_24px_-10px_rgba(60,35,10,0.25)]">
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-[15px] sm:text-[19px] font-normal text-[#212120] leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-[11.5px] sm:text-[12.5px] text-[#6B6762] mt-1 line-clamp-2 sm:line-clamp-1 group-hover:sm:line-clamp-3 group-focus-within:sm:line-clamp-3">
                        {product.shortDescription}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="pg-card-arrow hidden sm:flex w-[34px] h-[34px] rounded-full bg-[#FFF3E2] text-[#C86400] items-center justify-center shrink-0"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Desktop Hover / Focus Expandable Variants & Consult Link */}
                  <div className="hidden sm:block">
                    <div className="pg-card-expand">
                      <div className="overflow-hidden border-t border-[rgba(33,33,32,0.10)] pt-2">
                        {variantsList.length > 0 && (
                          <p className="text-[12px] font-medium text-[#C86400] leading-snug">
                            {variantsList.join(" · ")}
                          </p>
                        )}
                        <div className="mt-1.5 flex items-center gap-3 pointer-events-auto relative z-30">
                          <Link
                            href={consultHref}
                            rel="nofollow"
                            className="text-[12px] font-semibold text-[#212120] underline underline-offset-2 hover:text-[#C86400]"
                          >
                            Konsultasi
                          </Link>
                          <Link
                            href={productHref(product.slug)}
                            className="text-[12px] font-semibold text-[#C86400] hover:underline underline-offset-2"
                          >
                            Detail Produk →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
