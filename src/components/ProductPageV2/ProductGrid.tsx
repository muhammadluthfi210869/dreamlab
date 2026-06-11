"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProductVariantV2 } from '@/types/product-v2';
import { productImageAlt, productImageTitle } from '@/lib/image-utils';

interface ProductGridProps {
  products: ProductVariantV2[];
  categorySlug: string;
  subCategorySlug?: string;
}

// Mapping from product slug to card image filename based on actual files in public/assets/produk/
const slugToCardImageMap: Record<string, Record<string, string>> = {
  skincare: {
    // Main products
    "facial-serum": "new asset/skincare&facecare/serum-gel.webp",
    "facial-toner": "new asset/skincare&facecare/mois-facial-toner.webp",
    "facial-wash": "new asset/skincare&facecare/facial-wash.webp",
    "micellar-cleansing-gel": "new asset/skincare&facecare/micellar-cleansing-gel.webp",
    "facial-sunscreen": "new asset/skincare&facecare/physical-sunscreen.webp",
    "facial-moisturizer": "new asset/skincare&facecare/moizturizing-cream.webp",
    "acne-cream": "new asset/skincare&facecare/acne.webp",
    "moisturizing-cream": "new asset/skincare&facecare/moizturizing-cream.webp",
    "brightening-cream": "new asset/skincare&facecare/brightening.webp",
    "eye-cream": "new asset/skincare&facecare/eye-cream.webp",
    // Subcategory: face-cream (Day & Night Cream product)
    "day-night-cream": "new asset/skincare&facecare/facial-cream.webp",
    // Subcategory: face-mask
    "peel-off-mask": "new asset/skincare&facecare/peel-mask.webp",
    "brightening-mask": "new asset/skincare&facecare/brightening-mask.webp",
    "wash-off-mask": "new asset/skincare&facecare/wash-off-mask.webp",
    "sleeping-mask": "new asset/skincare&facecare/sleeping-mask.webp",
    // Subcategory: sunscreen
    "physical-sunscreen": "new asset/skincare&facecare/physical-sunscreen.webp",
    "hybrid-sunscreen": "new asset/make up/hybrid-sunscreen.webp",
    "chemical-sunscreen": "new asset/skincare&facecare/chemical-sunscreen.webp",
    "tone-up-sunscreen": "new asset/skincare&facecare/tone-up-suncreen.webp",
    "sunscreen-gel": "new asset/skincare&facecare/sunscreen-gel.webp",
    // Subcategory: cleansing
    "face-cleansing-oil": "new asset/skincare&facecare/face-cleansing-oil.webp",
    "milk-cleanser": "new asset/skincare&facecare/milk-cleanser.webp",
    "cleansing-balm": "new asset/skincare&facecare/cleasing-balm.webp",
    "cleansing-oil": "new asset/skincare&facecare/cleansing-oill.webp",
    // Subcategory: facial-wash
    "brightening-facial-wash": "new asset/skincare&facecare/facial-wash.webp",
    "acne-facial-wash": "new asset/skincare&facecare/acne-facial-wash.webp",
    "moisturizing-facial-wash": "new asset/skincare&facecare/mois-facial-wash.webp",
    // Subcategory: facial-toner
    "acne-facial-toner": "new asset/skincare&facecare/acne-facial-toner.webp",
    "moisturizing-facial-toner": "new asset/skincare&facecare/mois-facial-toner.webp",
    "brightening-facial-toner": "new asset/skincare&facecare/bright-toner.webp",
    // Subcategory: facial-serum
    "serum-gel": "new asset/skincare&facecare/serum-gel.webp",
    "radiant-advance-serum": "new asset/skincare&facecare/radiant-serum.webp",
    "acne-serum": "new asset/skincare&facecare/acne-serum.webp",
    "peeling-serum": "new asset/skincare&facecare/peeling-serum.webp",
  },
  bodycare: {
    "massage-oil": "new asset/bodycare/massage-oil.webp",
    "body-butter": "new asset/bodycare/body-butter.webp",
    "body-scrub": "new asset/bodycare/body-scrub.webp",
    "body-wash": "new asset/bodycare/body-wash.webp",
    "body-oil": "new asset/bodycare/body-serum.webp",
    "body-lotion": "new asset/skincare&facecare/Dreamlab-maklon-bodylotion.png",
    "anti-bacterial-soap": "new asset/bodycare/anti-bacterial-soap.webp",
    "shower-gel": "new asset/bodycare/shower-gel.webp",
    "bath-salt": "new asset/bodycare/bath-salt.webp",
    "organic-soap": "new asset/bodycare/organic-soap.webp",
    "body-serum": "new asset/bodycare/body-serum.webp",
    "transparent-soap": "new asset/bodycare/transparant-soap.webp",
    "underarm-cream": "new asset/bodycare/underarm-cream.webp",
    "whitening-soap": "new asset/bodycare/whitening-soap.webp",
    "bar-soap": "new asset/bodycare/bar-soap.webp",
    "massage-cream": "new asset/bodycare/massage-cream.webp",
    "soothing-gel": "new asset/bodycare/soothing-gel.webp",
    "neck-cream": "new asset/bodycare/neck-cream.webp",
  },
  haircare: {
    "shampoo": "new asset/haircare/shampoo.webp",
    "hair-mask": "new asset/haircare/hair-mask.webp",
    "hair-serum": "new asset/haircare/maklon-hair-serum-dreamlab.png",
    "hair-tonic": "new asset/haircare/sclap-care.webp",
    "hair-gel": "new asset/haircare/hair-gel.webp",
    "scalp-care": "new asset/haircare/sclap-care.webp",
    "beard-serum": "new asset/haircare/beard-serum.webp",
    "pomade": "new asset/haircare/pomade.webp",
    "hair-conditioner": "new asset/haircare/hair-conditioner.webp",
  },
  babycare: {
    "baby-wash": "new asset/baby-care/baby-wash.webp",
    "baby-shampoo": "new asset/baby-care/baby-shampoo.webp",
    "baby-lotion": "new asset/baby-care/baby-lotion.webp",
    "baby-powder": "new asset/baby-care/baby-powder.webp",
    "baby-cologne": "new asset/baby-care/baby-cologne.webp",
  },
  pkrt: {
    "hand-sanitizer": "new asset/pkrt/hand-sanis.webp",
    "hand-wash": "new asset/pkrt/hand-wash.webp",
    "disinfectant-spray": "new asset/pkrt/herbal-soap.webp",
    "floor-cleaner": "new asset/pkrt/bar-soap.webp",
    "room-spray": "new asset/pkrt/herbal-soap.webp",
    "bar-soap-pkrt": "new asset/pkrt/bar-soap.webp",
    "herbal-soap": "new asset/pkrt/herbal-soap.webp",
  },
  parfum: {
    "body-mist": "new asset/parfum/body-mist.webp",
    "eau-de-parfum": "new asset/parfum/edpp.webp",
    "eau-de-toilette": "new asset/parfum/edt.webp",
    "eau-de-cologne": "new asset/parfum/edc.webp",
    "extrait-de-parfum": "new asset/parfum/extrait-de-parfum.webp",
    "minyak-atsiri": "new asset/parfum/essential-oil.webp",
  },
  decorative: {
    // Main products
    "lip-matte": "new asset/lipcare/lip-matte.webp",
    "lip-gloss": "new asset/lipcare/lip-gloss.webp",
    "liquid-foundation": "new asset/make up/foundation.webp",
    "cushion-foundation": "new asset/make up/foundationserum.webp",
    "loose-powder": "new asset/make up/face-primer.webp",
    // Subcategory: make-up
    "liquid-highlighter": "new asset/make up/liquid-highlighter.webp",
    "mascara": "new asset/make up/mascara.webp",
    "cream-blush": "new asset/make up/cream-blush.webp",
    "foundation-serum": "new asset/make up/foundationserum.webp",
    "liquid-blush": "new asset/make up/liquid-blush.webp",
    "eyebrow-gel": "new asset/make up/eyebrow-gel.webp",
    "foundation": "new asset/make up/foundation.webp",
    "bb-cream": "new asset/make up/bb-cream.webp",
    "face-primer": "new asset/make up/face-primer.webp",
    // Subcategory: lipcare
    "lip-cream": "new asset/lipcare/lip-cream.webp",
    "lip-serum": "new asset/lipcare/lip-serum.webp",
    "lip-balm": "new asset/lipcare/lip-balm.webp",
    "tinted-lip-balm": "new asset/lipcare/tinted-lip-balm.webp",
    "lip-scrub": "new asset/lipcare/lip-scrub.webp",
    "lip-blush": "new asset/lipcare/lip-blush.webp",
  },
  footcare: {
    "foot-cream": "new asset/footcare/Footcream-maklon .png",
    "foot-mask": "new asset/footcare/footmask-maklonkosmetik-dreamlab .png",
    "foot-scrub": "new asset/footcare/footscrub-maklonkosmetik-dreamlab.png",
    "foot-spray": "new asset/footcare/footspray-dreamlab-maklonkosmetik .png",
    "foot-anti-bacterial": "new asset/footcare/foot antibacterial-maklon ksometik.png",
  },
};

const getCardImage = (slug: string, categorySlug: string, fallbackImage: string): string => {
  const categoryMap = slugToCardImageMap[categorySlug];
  if (categoryMap && categoryMap[slug]) {
    const path = categoryMap[slug];
    const encodedPath = path.split('/').map(p => p.replace(/ /g, '%20')).join('/');
    return `/${encodedPath}`;
  }
  return fallbackImage;
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