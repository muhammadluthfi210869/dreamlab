"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Award,
  Headphones,
  TrendingUp,
  FlaskConical
} from "lucide-react";
import { useMetaAdsCtaPixel } from "@/lib/meta-ads-pixel";
import { AdsCredibilitySection } from "@/components/landing-pages/AdsCredibilitySection";
import { AdsBeautyAcademySection } from "@/components/landing-pages/AdsBeautyAcademySection";
import { LeadQualificationModal } from "@/components/LeadQualificationModal";
import { FloatingWhatsAppCTA } from "@/components/FloatingWhatsAppCTA";

const premiumEase = [0.16, 1, 0.3, 1] as any;

const haircareBg = "#E7ECFE";

export default function HaircareMetaAdsLP() {
  useMetaAdsCtaPixel("Hair Care");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openQualification = (_ctaId: string) => {
    setIsModalOpen(true);
  };
  const benefits = [
    { title: "Formula Custom", icon: FlaskConical },
    { title: "Desain Kemasan", icon: Sparkles },
    { title: "Legalitas Lengkap", icon: ShieldCheck },
    { title: "Perlindungan HKI", icon: Award },
    { title: "Konsultasi Privat", icon: Headphones },
    { title: "MOQ Fleksibel", icon: TrendingUp }
  ];

  return (
    <div className="landing-page-ads min-h-screen bg-[#FAF9F6] text-brand-black font-sans selection:bg-brand-orange selection:text-white">

      {/* 1. HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-8 lg:pt-12">
        <div className="absolute inset-0 z-0">
          <Image
            src="/new asset/background-visual-hero-section/haircare.webp"
            alt="Dreamlab Premium Hair Care"
            fill
            priority
            fetchPriority="high"
            decoding="sync"
            className="object-cover"
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-white/55 via-white/20 to-transparent z-10 hidden lg:block" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.45)_0%,transparent_95%)] lg:hidden z-10" />
        </div>

        <div className="container-custom relative z-20 w-full">
          <div className="max-w-3xl lg:max-w-4xl transform -translate-y-4 lg:-translate-y-16">

            <div className="inline-flex items-center gap-3 px-3.5 py-1.5 bg-brand-orange/5 rounded-full mb-4 md:mb-6 border border-brand-orange/20 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[9px] lg:text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] font-onest">
                Dreamlab #JUARAFORMULA
              </span>
            </div>

            <h1
              className="font-normal text-brand-black mb-4 md:mb-6 leading-[1.1] tracking-tight uppercase text-[28px] sm:text-[38px] md:text-[48px] lg:text-[60px] xl:text-[68px]"
            >
              Mau Buat Brand
              <br />
              <span className="text-brand-orange italic font-display font-bold">Hair Care Premium?</span>
            </h1>

            <p className="text-neutral-600 font-sans text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              Wujudkan produk impian Anda dengan formula kualitas klinik, sampel gratis dari formulator ahli, desain kemasan mewah, dan legalitas BPOM lengkap. Kami tangani semuanya dari A sampai Z.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6 md:mb-8 max-w-2xl"
            >
              {benefits.map((benefit, i) => {
                const IconComponent = benefit.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white/45 hover:bg-white/80 backdrop-blur-md border border-brand-orange/10 hover:border-brand-orange/30 px-3.5 py-3 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(243,146,0,0.08)] hover:-translate-y-0.5 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[13px] font-bold text-brand-black/90 font-onest leading-tight">
                      {benefit.title}
                    </span>
                  </div>
                );
              })}
            </motion.div>

            {/* CTA + Reassurance Microcopy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6"
            >
              <button
                type="button"
                onClick={() => openQualification('hero')}
                className="group relative inline-flex items-center justify-center gap-3 bg-brand-orange hover:bg-brand-black text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-[0_12px_24px_rgba(243,146,0,0.2)] hover:shadow-[0_18px_32px_rgba(243,146,0,0.3)] hover:-translate-y-0.5 cursor-pointer"
              >
                <span className="uppercase tracking-wider text-[11px] font-display">Mulai Konsultasi Gratis</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

            </motion.div>

          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 1 }}
          className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F9F7F2] to-transparent z-10"
        />
      </section>

      {/* BEAUTY ACADEMY & BRAND COMMUNITY OWNER */}
      <AdsBeautyAcademySection
        onCtaClick={() => openQualification('beauty-academy')}
        categoryName="Hair Care"
      />

      {/* 3. CLOSING CTA — Homepage style background visual */}
      <section className="relative w-full overflow-hidden bg-white min-h-[420px] sm:min-h-[480px] md:min-h-[500px] lg:min-h-[580px] flex items-center border-t border-b border-neutral-100">

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0 }}
          className="absolute inset-0 z-0 select-none pointer-events-none bg-white"
        >
          <Image
            src="/new asset/new-icon-packing-design/sampul-web-2.webp"
            alt="Dreamlab Cosmetics Showcase"
            fill
            unoptimized={true}
            priority={true}
            className="object-cover object-[78%_center] sm:object-[82%_center] md:object-[86%_center] lg:object-[88%_center] xl:object-[92%_center]"
          />
          <div className="absolute inset-y-0 left-0 w-[50%] bg-gradient-to-r from-white via-white/60 to-transparent z-10 hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/45 to-transparent md:hidden z-10" />
        </motion.div>

        <div className="container-custom relative z-20 w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full py-16 md:py-24">

            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-span-12 md:col-span-6 lg:col-span-6 text-left z-20 flex flex-col justify-center"
            >
              <h2 className="text-brand-orange text-[30px] sm:text-[40px] md:text-[38px] lg:text-[48px] xl:text-[54px] font-display font-extrabold leading-[1.12] tracking-tight font-onest mb-6 uppercase">
                Mulai Brand Hair Care Hari Ini
              </h2>

              <p className="text-neutral-500 text-sm md:text-base leading-relaxed mb-8 font-sans max-w-lg">
                Chat sekarang — gratis, tanpa komitmen. 3 bulan lagi brandmu sudah bisa jualan.
              </p>

              <div className="rounded-2xl w-fit mt-2 flex flex-col items-start gap-3">
                <button
                  type="button"
                  onClick={() => openQualification('closing')}
                  className="inline-flex flex-col items-center justify-center bg-brand-orange hover:bg-[#D98200] hover:scale-[1.03] text-white px-6 py-3 sm:px-8 sm:py-3.5 rounded-2xl font-extrabold text-xs md:text-sm uppercase tracking-wider leading-tight transition-all duration-300 shadow-xl shadow-brand-orange/15 w-fit cursor-pointer"
                >
                  <span>Mulai Brand Hair Careku</span>
                  <span>— Gratis</span>
                </button>
                <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-neutral-400 font-onest">
                  RESPON CEPAT . TANPA KEWAJIBAN . 100% GRATIS
                </span>
              </div>
            </motion.div>

            <div className="hidden md:block md:col-span-6 lg:col-span-6 h-full" />

          </div>
        </div>
      </section>

      {/* CREDIBILITY / CERTIFICATIONS BANNER */}
      <AdsCredibilitySection channel="metaads" />

      {/* FLOATING WA BUTTON */}
      <FloatingWhatsAppCTA onClick={() => openQualification('floating-whatsapp')} />

      {/* Lead Qualification Modal */}
      <LeadQualificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultCategory="Haircare"
        source="meta-haircare"
        channel="metaads"
        landingPage="/hair-care/metaads/"
      />

    </div>
  );
}
