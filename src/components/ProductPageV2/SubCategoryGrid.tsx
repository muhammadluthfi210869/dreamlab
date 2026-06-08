"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SubCategoryV2 } from "@/types/product-v2";
import { productImageAlt, productImageTitle } from "@/lib/image-utils";

interface SubCategoryGridProps {
  subCategories: SubCategoryV2[];
  categorySlug: string;
  categoryName: string;
}

export default function SubCategoryGrid({ subCategories, categorySlug, categoryName }: SubCategoryGridProps) {
  const getSubCardImage = (slug: string) => {
    const cardImageMap: Record<string, Record<string, string>> = {
      skincare: {
        "day-night-cream": "new asset/skincare&facecare/facial-cream.webp",
        "face-mask": "new asset/skincare&facecare/brightening-mask.webp",
        "sunscreen": "new asset/skincare&facecare/physical-sunscreen.webp",
        "cleansing": "new asset/skincare&facecare/milk-cleanser.webp",
        "facial-wash": "new asset/skincare&facecare/facial-wash.webp",
        "facial-toner": "new asset/skincare&facecare/mois-facial-toner.webp",
        "facial-serum": "new asset/skincare&facecare/serum-gel.webp",
      },
      decorative: {
        "make-up": "new asset/make up/foundation.webp",
        "lipcare": "new asset/lipcare/lip-matte.webp",
      },
    };
    const maps = cardImageMap[categorySlug];
    if (maps && maps[slug]) {
      const path = maps[slug];
      const encodedPath = path.split('/').map(p => p.replace(/ /g, '%20')).join('/');
      return path.startsWith('/') ? path : `/${encodedPath}`;
    }
    return null;
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="relative z-10 bg-[#FAF9F6] py-12 lg:py-16 overflow-hidden border-b border-gray-100"
    >
      <div className="container-custom w-full">
        <div className="flex flex-col gap-8 lg:gap-10 w-full">
          
          {/* Centered Headline */}
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -20 },
                show: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
                }
              }}
              className="space-y-3"
            >
              <h2 className="font-display text-[26px] md:text-[34px] lg:text-[40px] font-normal text-[#212120] leading-tight">
                Kategori <span className="text-brand-orange font-bold">{categoryName}</span> Siap Maklon
              </h2>
              <p className="text-xs md:text-sm text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
                Pilih kategori produk yang sesuai dengan kebutuhan brand Anda. Setiap kategori memiliki varian produk yang bisa dikustomisasi.
              </p>
            </motion.div>
          </div>

          {/* Sub-Category Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 xl:gap-8 w-full">
            {subCategories.map((sub, index) => (
              <motion.div
                key={sub.slug}
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1] as any,
                      delay: index * 0.06
                    }
                  }
                }}
                className="relative"
              >
                <Link 
                  href={`/produk/${categorySlug}/${sub.slug}/`}
                  className="group relative flex flex-col bg-white rounded-[28px] border border-gray-100 transition-all duration-500 hover:shadow-lg hover:shadow-gray-200/60 hover:-translate-y-1.5 h-full overflow-hidden"
                >
                  {/* Hero Image Area */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image 
                      src={getSubCardImage(sub.slug) || sub.heroImage}
                      alt={productImageAlt(sub.slug, categorySlug, sub.name)}
                      title={productImageTitle(sub.slug, categorySlug, sub.name)}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      priority={index < 4}
                      loading={index < 4 ? undefined : "lazy"}
                      decoding={index < 4 ? "sync" : "async"}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    
                    {/* Product count badge */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="bg-white/90 backdrop-blur-sm text-[#212120] text-[10px] font-black tracking-wider px-3 py-1.5 rounded-full uppercase shadow-sm">
                        {sub.products.length} Produk
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-grow p-5">
                    <h3 className="font-onest text-base md:text-lg font-bold text-[#212120] leading-snug tracking-tight transition-colors group-hover:text-brand-orange">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-2 leading-relaxed line-clamp-2">
                      {sub.description}
                    </p>
                    
                    {/* CTA Button - matches ProductGrid style */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="w-full bg-[#212120] text-white text-center py-2.5 px-4 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 group-hover:bg-brand-orange shadow-sm group-hover:shadow-md flex items-center justify-center gap-1.5">
                        <span>LIHAT PRODUK</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 md:w-3.5 md:h-3.5 transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </motion.section>
  );
}
