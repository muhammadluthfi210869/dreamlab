"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
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

type VariantKey = "spray" | "roll-on" | "dry-serum";

interface VariantContent {
  key: VariantKey;
  label: string;
  image: string;
  title: string;
  intro: string;
  benefits: { title: string; description: string }[];
  packaging: string;
}

const variants: VariantContent[] = [
  {
    key: "spray",
    label: "Spray",
    image: "/new asset/bodycare/deodorant-spray.webp",
    title: "Deodorant Spray",
    intro:
      "Ingin punya brand deodorant spray sendiri? Dreamlab adalah solusi Anda untuk mengembangkan deodorant spray yang menjaga kesegaran ketiak seharian, cepat kering, dan tidak lengket — formula eksklusif sesuai konsep brand Anda.",
    benefits: [
      {
        title: "FREE Custom Formula",
        description:
          "Anda menentukan bahan aktif (anti-bau/antiperspirant) dan aroma deodorant spray.",
      },
      {
        title: "FREE Pengurusan Legalitas",
        description:
          "BPOM, HKI, dan Halal diurus sampai tuntas oleh tim kami.",
      },
      {
        title: "FREE Desain Logo & Kemasan",
        description: "dibantu tim kreatif Dreamlab.",
      },
      {
        title: "1 Client, 1 Formula",
        description:
          "formula eksklusif milik brand Anda, tidak dipakai brand lain.",
      },
    ],
    packaging: "Spray Bottle, Custom",
  },
  {
    key: "roll-on",
    label: "Roll On",
    image: "/new asset/bodycare/deodorant-roll-on.webp",
    title: "Deodorant Roll On",
    intro:
      "Ingin punya brand deodorant roll on sendiri? Dreamlab adalah solusi Anda untuk mengembangkan deodorant roll on yang lembut di kulit, cocok untuk ketiak sensitif, dan memberikan perlindungan anti-bau sepanjang hari.",
    benefits: [
      {
        title: "FREE Custom Formula",
        description:
          "Anda menentukan bahan aktif (soothing/anti-bau) dan tekstur roll on.",
      },
      {
        title: "FREE Pengurusan Legalitas",
        description:
          "BPOM, HKI, dan Halal diurus sampai tuntas oleh tim kami.",
      },
      {
        title: "FREE Desain Logo & Kemasan",
        description: "dibantu tim kreatif Dreamlab.",
      },
      {
        title: "1 Client, 1 Formula",
        description:
          "formula eksklusif milik brand Anda, tidak dipakai brand lain.",
      },
    ],
    packaging: "Roll On Bottle, Custom",
  },
  {
    key: "dry-serum",
    label: "Dry Serum",
    image: "/new asset/bodycare/deodorant-dry-serum.webp",
    title: "Deodorant Dry Serum",
    intro:
      "Ingin punya brand deodorant dry serum sendiri? Dreamlab adalah solusi Anda untuk mengembangkan deodorant format serum bertekstur ringan ala tren Korea — cepat kering, tidak lengket, dan membantu mencerahkan area ketiak.",
    benefits: [
      {
        title: "FREE Custom Formula",
        description:
          "Anda menentukan bahan aktif (pencerah/anti-bau) dan tekstur serum.",
      },
      {
        title: "FREE Pengurusan Legalitas",
        description:
          "BPOM, HKI, dan Halal diurus sampai tuntas oleh tim kami.",
      },
      {
        title: "FREE Desain Logo & Kemasan",
        description: "dibantu tim kreatif Dreamlab.",
      },
      {
        title: "1 Client, 1 Formula",
        description:
          "formula eksklusif milik brand Anda, tidak dipakai brand lain.",
      },
    ],
    packaging: "Dropper Bottle / Roll On Bottle, Custom",
  },
];

const faqItems = [
  {
    q: "Apa itu maklon deodorant dan varian apa saja yang tersedia di Dreamlab?",
    a: "Maklon deodorant adalah layanan produksi deodorant dengan brand Anda sendiri. Dreamlab menyediakan 3 varian: Deodorant Spray, Deodorant Roll On, dan Deodorant Dry Serum.",
  },
  {
    q: "Apa bedanya deodorant spray, roll on, dan dry serum?",
    a: "Deodorant Spray cocok untuk daily use dengan aroma segar dan cepat kering. Deodorant Roll On memiliki tekstur lembut, cocok untuk kulit sensitif. Deodorant Dry Serum adalah format serum ringan ala Korea yang cepat kering dan tidak lengket.",
  },
  {
    q: "Berapa biaya, MOQ, dan lama proses maklon deodorant di Dreamlab?",
    a: "Biaya menyesuaikan formula dan kemasan. MOQ fleksibel dengan estimasi proses sekitar 3 bulan hingga siap edar, sudah termasuk BPOM dan Halal.",
  },
  {
    q: "Apakah sudah termasuk BPOM & Halal, dan bagaimana cara memulai?",
    a: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal. Mulai dengan konsultasi gratis via WhatsApp.",
  },
  {
    q: "Bisa pilih lebih dari 1 varian dalam satu brand?",
    a: "Tentu. Dreamlab dapat memproduksi beberapa varian deodorant sekaligus dalam satu brand dengan formula eksklusif masing-masing.",
  },
];

const premiumEase = [0.16, 1, 0.3, 1] as any;

const fakeProductData = {
  slug: "deodorant",
  name: "Deodorant",
  heroImage: "/new asset/bodycare/deodorant-spray.webp",
  shortDescription:
    "Jasa maklon deodorant spray, roll on, dan dry serum dengan custom formula.",
};

function DeodorantHubPageInner({ categoryData }: DeodorantHubPageProps) {
  const searchParams = useSearchParams();
  const variantParam = searchParams.get("variant") as VariantKey | null;
  const defaultVariant: VariantKey = "spray";
  const activeVariant = variants.find((v) => v.key === variantParam)
    ? variantParam!
    : defaultVariant;

  return (
    <main className="min-h-screen bg-white">
      <ProductHero
        categoryData={categoryData}
        productData={
          { ...fakeProductData, heroImage: getCardImagePath("deodorant-spray", "bodycare") || fakeProductData.heroImage } as any
        }
      />

      {/* Tab Selector */}
      <section className="py-8 lg:py-12 bg-white">
        <div className="container-custom">
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-100 rounded-full p-1.5 gap-1">
              {variants.map((v) => {
                const isActive = activeVariant === v.key;
                return (
                  <a
                    key={v.key}
                    href={`?variant=${v.key}`}
                    className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                      isActive
                        ? "bg-brand-orange text-white shadow-lg"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {v.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Tab Content Panels */}
      {variants.map((v) => {
        const isActive = activeVariant === v.key;
        return (
          <section
            key={v.key}
            className={`${isActive ? "flex" : "hidden"} flex-col`}
          >
            <div className="container-custom py-8 lg:py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: premiumEase }}
                  className="relative aspect-square w-full max-w-md mx-auto"
                >
                  <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-[#FFF5F2] shadow-xl border border-white/50">
                    <Image
                      src={v.image}
                      alt={v.title}
                      fill
                      className="object-contain p-8"
                      sizes="(max-width: 768px) 100vw, 500px"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </motion.div>

                {/* Content */}
                <div className="space-y-6">
                  <motion.h2
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.8, ease: premiumEase }}
                    className="font-display text-3xl lg:text-[40px] font-black text-[#212120] uppercase tracking-tight leading-tight"
                  >
                    {v.title}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35, duration: 0.8, ease: premiumEase }}
                    className="text-[#212120]/70 leading-relaxed font-medium text-sm lg:text-[15px]"
                  >
                    {v.intro}
                  </motion.p>

                  {/* Benefits Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {v.benefits.map((b, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.5 + i * 0.1,
                          duration: 0.6,
                          ease: premiumEase,
                        }}
                        className="bg-[#FDFDFC] p-5 rounded-2xl border border-gray-100 shadow-sm"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="text-[10px] font-black text-brand-orange">
                            POINT 0{i + 1}
                          </div>
                          <div className="flex-grow h-[1px] bg-brand-orange/10" />
                        </div>
                        <h3 className="font-onest text-sm font-black text-[#212120] uppercase tracking-tight mb-2 leading-tight">
                          {b.title}
                        </h3>
                        <p className="text-[#212120]/70 leading-relaxed font-medium text-xs">
                          {b.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Packaging Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9, duration: 0.6, ease: premiumEase }}
                    className="pt-2"
                  >
                    <span className="text-xs font-black text-brand-orange uppercase tracking-wider">
                      Packaging:
                    </span>
                    <span className="text-sm text-[#212120]/80 font-medium ml-2">
                      {v.packaging}
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <AdvantagesGrid title="8 Keuntungan Maklon" />
      <LogoScroll logos={aboutData.partnerLogos} />
      <OurCertification />
      <CtaSection title="Wujudkan Brand Deodorant Impian Anda dalam 3 Bulan" />

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-custom max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: premiumEase }}
            className="font-display text-[28px] lg:text-[42px] font-black text-[#212120] uppercase tracking-tight text-center mb-12"
          >
            FAQ Maklon Deodorant
          </motion.h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  ease: premiumEase,
                }}
                className="group bg-[#FDFDFC] border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
              >
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none">
                  <span className="font-onest text-sm font-bold text-[#212120] pr-4">
                    {item.q}
                  </span>
                  <svg
                    className="w-5 h-5 text-brand-orange flex-shrink-0 transition-transform duration-300 group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-[#212120]/70 leading-relaxed text-sm font-medium">
                    {item.a}
                  </p>
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

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
