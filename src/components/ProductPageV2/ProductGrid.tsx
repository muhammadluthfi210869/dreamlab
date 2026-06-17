"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProductVariantV2 } from '@/types/product-v2';
import { productImageAlt, productImageTitle } from '@/lib/image-utils';
import { getCardImagePath } from '@/data/product-card-images';

interface ProductGridProps {
  products: ProductVariantV2[];
  categorySlug: string;
  subCategorySlug?: string;
}

const getCardImage = (slug: string, categorySlug: string, fallbackImage: string): string => {
  return getCardImagePath(slug, categorySlug) || fallbackImage;
};

const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};




function renderProduct(product: ProductVariantV2, index: number, categorySlug: string, subCategorySlug: string | undefined, productHref: (slug: string) => string) {
  return (
    <motion.div
      key={product.id}
      variants={{
        hidden: { opacity: 0, y: 25 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1] as any,
            delay: index * 0.04
          }
        }
      }}
      className="relative"
    >
      <Link
        href={productHref(product.slug)}
        className="group relative flex flex-col bg-white p-4 rounded-[28px] border border-gray-100 transition-all duration-500 hover:shadow-lg hover:shadow-gray-200/60 hover:-translate-y-1.5 h-full"
      >
        <div className="relative aspect-square w-full rounded-[20px] overflow-hidden flex items-center justify-center mb-3 bg-[#FAF9F6]">
          <Image 
            src={getCardImage(product.slug, categorySlug, product.heroImage)}
            alt={productImageAlt(product.slug, categorySlug, product.name)}
            title={productImageTitle(product.slug, categorySlug, product.name)}
            fill
            sizes="(max-width: 768px) 50vw, 250px"
            priority={index < 4}
            loading={index < 4 ? undefined : "lazy"}
            decoding={index < 4 ? "sync" : "async"}
            className="object-contain p-1 transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col flex-grow">
          <h3 className="font-onest text-sm md:text-base font-bold text-[#212120] leading-snug tracking-tight flex-grow transition-colors group-hover:text-brand-orange">
            {toTitleCase(product.name)}
          </h3>

          <div className="mt-4 pt-3 border-t border-gray-100">
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
  );
}

export default function ProductGrid({ products, categorySlug, subCategorySlug }: ProductGridProps) {
  const categoryName = categorySlug === 'pkrt' ? 'PKRT' : toTitleCase(categorySlug);
  const productHref = (slug: string) =>
    subCategorySlug
      ? `/produk/${categorySlug}/${subCategorySlug}/${slug}`
      : `/produk/${categorySlug}/${slug}`;

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="relative z-10 bg-[#FAF9F6] py-12 lg:py-16 overflow-hidden border-b border-gray-100"
    >
      <div className="container-custom w-full">
        <div className="flex flex-col gap-8 lg:gap-10 w-full">
          
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
                Pilihan Produk <span className="text-brand-orange font-bold">{categoryName}</span> Siap Maklon
              </h2>
              <p className="text-xs md:text-sm text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
                Pilih formulasi dasar terbaik yang siap kami sesuaikan dan daftarkan secara resmi untuk brand kosmetik Anda.
              </p>
            </motion.div>
          </div>

          <div className={`grid grid-cols-2 md:grid-cols-3 ${products.length === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-4 md:gap-6 xl:gap-8 w-full`}>
            {products.map((product, index) => renderProduct(product, index, categorySlug, subCategorySlug, productHref))}
          </div>

        </div>
      </div>
    </motion.section>
  );
}