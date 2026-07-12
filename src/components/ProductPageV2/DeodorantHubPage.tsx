"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductHero from "./ProductHero";
import { ProductCategoryV2 } from "@/types/product-v2";
import { getCardImagePath } from "@/data/product-card-images";
import { aboutData } from "@/data/about-us";

const AdvantagesGrid = dynamic(() => import("@/components/AdvantagesGrid"));
const LogoScroll = dynamic(() => import("@/components/LogoScroll"));
const OurCertification = dynamic(() => import("@/components/OurCertification"));
const CtaSection = dynamic(() => import("@/components/CtaSection"));
const ProductRelated = dynamic(() => import("./ProductRelated"));

interface DeodorantHubPageProps {
  categoryData: ProductCategoryV2;
}

const premiumEase = [0.16, 1, 0.3, 1] as any;

const variantCards = [
  {
    slug: "deodorant-spray",
    label: "Spray",
    image: "/new asset/bodycare/deodorant-spray.webp",
    title: "Deodorant Spray",
    intro: "Maklon Deodorant Spray untuk menjaga kesegaran ketiak seharian, cepat kering, dan tidak lengket — formula eksklusif sesuai konsep brand Anda.",
  },
  {
    slug: "deodorant-roll-on",
    label: "Roll On",
    image: "/new asset/bodycare/deodorant-roll-on.webp",
    title: "Deodorant Roll On",
    intro: "Maklon Deodorant Roll On yang lembut di kulit, cocok untuk ketiak sensitif, dan memberikan perlindungan anti-bau sepanjang hari.",
  },
  {
    slug: "deodorant-dry-serum",
    label: "Dry Serum",
    image: "/new asset/bodycare/deodorant-dry-serum.webp",
    title: "Deodorant Dry Serum",
    intro: "Maklon Deodorant Dry Serum format serum bertekstur ringan ala tren Korea — cepat kering, tidak lengket, dan membantu mencerahkan area ketiak.",
  },
];

const fakeProductData = {
  slug: "deodorant",
  name: "Deodorant",
  heroImage: "/new asset/bodycare/deodorant-spray.webp",
  shortDescription:
    "Jasa maklon deodorant spray, roll on, dan dry serum dengan custom formula.",
};

function DeodorantHubPageInner({ categoryData }: DeodorantHubPageProps) {
  return (
    <main className="min-h-screen bg-white">
      <ProductHero
        categoryData={categoryData}
        productData={
          { ...fakeProductData, heroImage: getCardImagePath("deodorant-spray", "bodycare") || fakeProductData.heroImage } as any
        }
      />

      {/* Product Catalog Grid */}
      <section className="relative z-10 bg-[#FAF9F6] py-12 lg:py-16 overflow-hidden border-b border-gray-100">
        <div className="container-custom w-full">
          <div className="flex flex-col gap-8 lg:gap-10 w-full">
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: premiumEase }}
                className="space-y-3"
              >
                <h2 className="font-display text-[26px] md:text-[34px] lg:text-[40px] font-normal text-[#212120] leading-tight">
                  Pilihan Varian <span className="text-brand-orange font-bold">Deodorant</span> Siap Maklon
                </h2>
                <p className="text-xs md:text-sm text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
                  Pilih varian deodorant yang sesuai dengan konsep brand Anda. Setiap varian bisa dikustomisasi formula, aroma, dan kemasannya.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 xl:gap-8 w-full">
              {variantCards.map((v, index) => (
                <motion.div
                  key={v.slug}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: premiumEase, delay: index * 0.1 }}
                >
                  <Link
                    href={`/produk/bodycare/${v.slug}/`}
                    className="group relative flex flex-col bg-white p-4 rounded-[28px] border border-gray-100 transition-all duration-500 hover:shadow-lg hover:shadow-gray-200/60 hover:-translate-y-1.5 h-full"
                  >
                    <div className="relative aspect-square w-full rounded-[20px] overflow-hidden flex items-center justify-center mb-3 bg-[#FAF9F6]">
                      <Image
                        src={v.image}
                        alt={v.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-contain p-1 transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-col flex-grow">
                      <h3 className="font-onest text-sm md:text-base font-bold text-[#212120] leading-snug tracking-tight flex-grow transition-colors group-hover:text-brand-orange">
                        {v.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                        {v.intro}
                      </p>

                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className="w-full bg-[#212120] text-white text-center py-2.5 px-4 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:bg-brand-orange shadow-sm hover:shadow-md flex items-center justify-center gap-1.5">
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
      </section>

      <AdvantagesGrid title="8 Keuntungan Maklon" />
      <LogoScroll logos={aboutData.partnerLogos} />
      <OurCertification />
      <CtaSection title="Wujudkan Brand Deodorant Impian Anda dalam 3 Bulan" />

      <ProductRelated
        products={categoryData.relatedProducts}
        currentProductSlug="deodorant"
      />
    </main>
  );
}

export default function DeodorantHubPage(props: DeodorantHubPageProps) {
  return (
    <Suspense fallback={null}>
      <DeodorantHubPageInner {...props} />
    </Suspense>
  );
}
