"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SubCategoryV2 } from "@/types/product-v2";
import { productImageAlt, productImageTitle } from "@/lib/image-utils";

interface SubCategoryGridProps {
  subCategories: SubCategoryV2[];
  categorySlug: string;
  categoryName: string;
}

export default function SubCategoryGrid({
  subCategories,
  categorySlug,
  categoryName,
}: SubCategoryGridProps) {
  const getSubCardImage = (slug: string) => {
    const cardImageMap: Record<string, Record<string, string>> = {
      skincare: {
        "face-cream": "new asset/skincare&facecare/moizturizing-cream.webp",
        "day-night-cream": "new asset/skincare&facecare/day-and-night-cream.webp",
        "face-mask": "new asset/skincare&facecare/brightening-mask.webp",
        sunscreen: "new asset/skincare&facecare/physical-sunscreen.webp",
        cleansing: "new asset/skincare&facecare/milk-cleanser.webp",
        "facial-wash": "new asset/skincare&facecare/facial-wash.webp",
        "facial-toner": "new asset/skincare&facecare/mois-facial-toner.webp",
        "facial-serum": "new asset/skincare&facecare/serum-gel.webp",
      },
      decorative: {
        "make-up": "new asset/make up/foundation.webp",
        lipcare: "new asset/lipcare/lip-matte.webp",
      },
    };
    const maps = cardImageMap[categorySlug];
    if (maps && maps[slug]) {
      const path = maps[slug];
      const encodedPath = path
        .split("/")
        .map((p) => p.replace(/ /g, "%20"))
        .join("/");
      return path.startsWith("/") ? path : `/${encodedPath}`;
    }
    return null;
  };

  return (
    <section
      id="katalog-produk"
      className="relative z-10 bg-[#FAF8F5] py-[64px] sm:py-[104px] overflow-x-clip"
    >
      <style>{`
        .sub-cat-card {
          box-shadow: 0 2px 6px rgba(60, 35, 10, 0.05), 0 14px 32px -16px rgba(60, 35, 10, 0.22);
          transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (hover: hover) {
          .sub-cat-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 2px 4px rgba(60, 35, 10, 0.04), 0 18px 40px -14px rgba(60, 35, 10, 0.18);
          }
          .sub-cat-card:hover .sub-cat-img {
            transform: scale(1.05);
          }
          .sub-cat-card:hover .sub-cat-expand {
            grid-template-rows: 1fr;
            opacity: 1;
            margin-top: 10px;
          }
          .sub-cat-card:hover .sub-cat-arrow {
            background-color: #F39200;
            color: #212120;
            transform: rotate(-45deg);
          }
        }
        .sub-cat-card:focus-within {
          transform: translateY(-6px);
          box-shadow: 0 2px 4px rgba(60, 35, 10, 0.04), 0 18px 40px -14px rgba(60, 35, 10, 0.18);
        }
        .sub-cat-card:focus-within .sub-cat-expand {
          grid-template-rows: 1fr;
          opacity: 1;
          margin-top: 10px;
        }
        .sub-cat-img {
          transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sub-cat-expand {
          display: grid;
          grid-template-rows: 0fr;
          opacity: 0;
          margin-top: 0;
          transition: grid-template-rows 450ms cubic-bezier(0.22, 1, 0.36, 1), opacity 450ms cubic-bezier(0.22, 1, 0.36, 1), margin-top 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sub-cat-arrow {
          transition: background-color 450ms cubic-bezier(0.22, 1, 0.36, 1), color 450ms cubic-bezier(0.22, 1, 0.36, 1), transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sub-cat-card a:focus-visible {
          outline: 2px solid #F39200;
          outline-offset: 4px;
        }
        @media (prefers-reduced-motion: reduce) {
          .sub-cat-card,
          .sub-cat-img,
          .sub-cat-expand,
          .sub-cat-arrow {
            transition: none !important;
          }
          .sub-cat-card:hover,
          .sub-cat-card:focus-within,
          .sub-cat-card:hover .sub-cat-img {
            transform: none !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-[1240px] px-[16px] sm:px-[40px]">
        {/* Centered Headline */}
        <div className="text-center max-w-[680px] mx-auto mb-[32px] sm:mb-[48px]">
          <h2 className="font-display font-normal text-[clamp(28px,3.2vw,40px)] leading-[1.12] tracking-[-0.01em] text-[#212120]">
            Kategori <span className="text-[#F39200]">{categoryName}</span> Siap
            Maklon
          </h2>
          <p className="mt-[14px] text-[15px] sm:text-[16px] leading-[1.6] text-[#6B6762]">
            Pilih kategori produk yang sesuai dengan kebutuhan brand Anda.
            Setiap kategori memiliki varian produk yang bisa dikustomisasi.
          </p>
        </div>

        {/* Sub-Category Floating-Panel Grid */}
        <div className="grid grid-cols-2 min-[641px]:grid-cols-3 min-[1025px]:grid-cols-4 gap-[12px] sm:gap-[24px] w-full">
          {subCategories.map((sub) => (
            <article
              key={sub.slug}
              className="sub-cat-card group relative aspect-[4/5] rounded-[16px] sm:rounded-[22px] overflow-hidden bg-[#F2EEE9]"
            >
              <Image
                src={getSubCardImage(sub.slug) || sub.heroImage}
                alt={productImageAlt(sub.slug, categorySlug, sub.name)}
                title={productImageTitle(sub.slug, categorySlug, sub.name)}
                fill
                sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 280px"
                loading="lazy"
                className="sub-cat-img object-cover object-center"
              />

              <Link
                href={`/produk/${categorySlug}/${sub.slug}/`}
                aria-label={`${sub.name} — LIHAT PRODUK`}
                className="absolute inset-0 z-10 rounded-[16px] sm:rounded-[22px]"
              />

              {/* Product count badge (top-left glass pill) */}
              <div className="absolute top-[10px] left-[10px] sm:top-[14px] sm:left-[14px] z-10 pointer-events-none">
                <span className="rounded-full bg-[rgba(255,255,255,0.9)] supports-[backdrop-filter]:bg-[rgba(255,255,255,0.82)] backdrop-blur-[8px] px-2.5 py-1 text-[9px] sm:text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#212120]">
                  {sub.products.length} Produk
                </span>
              </div>

              {/* Floating glass panel at bottom */}
              <div className="absolute inset-x-[8px] bottom-[8px] sm:inset-x-[12px] sm:bottom-[12px] z-20 pointer-events-none rounded-[12px] sm:rounded-[16px] bg-[rgba(255,255,255,0.96)] supports-[backdrop-filter]:bg-[rgba(255,255,255,0.90)] backdrop-blur-[14px] p-[12px] sm:pt-[16px] sm:pr-[16px] sm:pb-[16px] sm:pl-[18px] shadow-[0_8px_24px_-10px_rgba(60,35,10,0.25)]">
                <div className="flex items-center justify-between gap-2.5">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-[15px] sm:text-[19px] font-normal text-[#212120] leading-snug">
                      {sub.name}
                    </h3>
                    <p className="text-[11.5px] sm:text-[12.5px] text-[#6B6762] mt-1 line-clamp-2 sm:line-clamp-1 group-hover:sm:line-clamp-3 group-focus-within:sm:line-clamp-3">
                      {sub.description}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="sub-cat-arrow hidden sm:flex w-[34px] h-[34px] rounded-full bg-[#FFF3E2] text-[#C86400] items-center justify-center shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>

                <div className="hidden sm:block">
                  <div className="sub-cat-expand">
                    <div className="overflow-hidden border-t border-[rgba(33,33,32,0.10)] pt-2">
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-[#C86400]">
                        <span>LIHAT PRODUK</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
