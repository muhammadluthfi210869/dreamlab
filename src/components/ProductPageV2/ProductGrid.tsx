"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ProductVariantV2 } from "@/types/product-v2";
import { productImageAlt, productImageTitle } from "@/lib/image-utils";
import { getCardImagePath } from "@/data/product-card-images";

interface ProductGridProps {
  products: ProductVariantV2[];
  categorySlug: string;
  subCategorySlug?: string;
}

const getCardImage = (slug: string, categorySlug: string, fallbackImage: string): string => {
  return getCardImagePath(slug, categorySlug) || fallbackImage;
};

const HAIR_CONCERN_FILTERS = [
  "Semua",
  "Kering & Rusak",
  "Rontok & Ketombe",
  "Styling & Harian",
] as const;

export default function ProductGrid({ products, categorySlug, subCategorySlug }: ProductGridProps) {
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
      className="relative z-10 bg-[#FAF9F6] py-14 lg:py-20 overflow-hidden border-b border-gray-100"
    >
      <div className="container-custom w-full">
        <div className="flex flex-col gap-8 lg:gap-10 w-full">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-brand-blue">
              Katalog Produk Maklon
            </span>
            <h2 className="font-display text-[26px] md:text-[34px] lg:text-[40px] font-normal text-brand-black leading-tight">
              {isHaircare ? (
                <>
                  13 Produk <span className="text-brand-orange font-bold">Hair Care</span> Siap Maklon
                </>
              ) : (
                <>
                  Pilihan Produk <span className="text-brand-orange font-bold">{categoryName}</span> Siap Maklon
                </>
              )}
            </h2>
            <p className="text-xs md:text-sm text-gray-600 font-medium max-w-xl mx-auto leading-relaxed">
              Pilih formulasi dasar terbaik yang siap kami sesuaikan bahan aktif, aroma, dan kemasannya untuk brand kosmetik Anda.
            </p>
          </div>

          {/* Hair Concern Filter Pills (Haircare) */}
          {isHaircare && (
            <div
              role="tablist"
              aria-label="Filter masalah rambut"
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
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
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors cursor-pointer border ${
                      isActive
                        ? "bg-brand-blue text-white border-brand-blue shadow-sm"
                        : "bg-white text-brand-black/80 border-gray-200 hover:border-brand-blue hover:text-brand-blue"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          )}

          {/* Responsive Grid: 1 col <480px, 2 col tablet, 3-4 col desktop */}
          {/* All cards remain in SSR HTML; non-matching filter cards use the `hidden` class */}
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 w-full">
            {products.map((product, index) => {
              const matchesFilter =
                !isHaircare ||
                activeFilter === "Semua" ||
                product.concernFilter === activeFilter ||
                (product.tags && product.tags.includes(activeFilter));

              const variantsList =
                product.variants && product.variants.length > 0
                  ? product.variants
                  : product.tags.filter((t) => t !== "Baru");

              const ingredientsList = (product.ingredients || []).map((ing) => ing.name).join(", ");
              const packagingList = (product.bottleOptions || []).join(", ");
              const waMessage = encodeURIComponent(
                `Halo Dreamlab, saya ingin konsultasi maklon produk ${product.name}.`
              );

              return (
                <article
                  key={product.id}
                  className={`flex flex-col bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow duration-300 h-full ${
                    matchesFilter ? "" : "hidden"
                  }`}
                >
                  {/* Product Image + Tags */}
                  <Link
                    href={productHref(product.slug)}
                    className="relative aspect-square w-full rounded-2xl overflow-hidden flex items-center justify-center mb-4 bg-[#FAF9F6] group"
                  >
                    <Image
                      src={getCardImage(product.slug, categorySlug, product.heroImage)}
                      alt={productImageAlt(product.slug, categorySlug, product.name)}
                      title={productImageTitle(product.slug, categorySlug, product.name)}
                      fill
                      sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 280px"
                      priority={index < 4}
                      loading={index < 4 ? undefined : "lazy"}
                      decoding={index < 4 ? "sync" : "async"}
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Badges / Tags */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex flex-wrap items-center gap-1.5 z-10">
                      {(product.isNew || product.tags.includes("Baru")) && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-blue text-white shadow-xs">
                          Baru
                        </span>
                      )}
                      {product.concernFilter && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-xs text-brand-black border border-gray-200/80">
                          {product.concernFilter}
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Card Body: Tag, Nama (H3), Deskripsi, Varian, Accordion Bahan Aktif & Kemasan, Tombol Konsultasi */}
                  <div className="flex flex-col flex-grow">
                    {/* Tags Row for non-haircare or additional tags */}
                    {!product.concernFilter && product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {product.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Nama (H3) */}
                    <h3 className="font-display text-base sm:text-lg font-normal text-brand-black leading-snug mb-2">
                      <Link
                        href={productHref(product.slug)}
                        className="hover:text-brand-blue transition-colors"
                      >
                        {product.name}
                      </Link>
                    </h3>

                    {/* Deskripsi */}
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      {product.shortDescription}
                    </p>

                    {/* Varian */}
                    {variantsList.length > 0 && (
                      <div className="mb-3">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                          Varian Formula:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {variantsList.map((variant) => (
                            <span
                              key={variant}
                              className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F1F7FC] text-brand-blue border border-brand-blue/15"
                            >
                              {variant}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Accordion: Bahan aktif & kemasan (SSR rendered in HTML) */}
                    <details className="group/acc mt-auto mb-4 rounded-xl border border-gray-200/80 bg-[#FAF9F6] px-3 py-2 text-xs">
                      <summary className="flex items-center justify-between cursor-pointer font-bold text-brand-black list-none select-none">
                        <span>Bahan aktif &amp; kemasan</span>
                        <ChevronDown className="size-4 text-gray-500 transition-transform duration-200 group-open/acc:rotate-180" />
                      </summary>
                      <div className="pt-2.5 mt-2 border-t border-gray-200/70 space-y-1.5 text-[11px] text-gray-700 leading-relaxed">
                        <p>
                          <strong className="text-brand-black">Bahan aktif:</strong> {ingredientsList}
                        </p>
                        <p>
                          <strong className="text-brand-black">Kemasan:</strong> {packagingList}
                        </p>
                      </div>
                    </details>

                    {/* CTA Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                      <a
                        href={`https://wa.me/6281131900095?text=${waMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-brand-orange hover:bg-brand-black text-white text-center py-2.5 px-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center"
                      >
                        Konsultasi
                      </a>
                      <Link
                        href={productHref(product.slug)}
                        className="w-full bg-white hover:bg-gray-50 text-brand-black border border-gray-200 text-center py-2.5 px-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center"
                      >
                        Detail Produk
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
