"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { HeartHandshake, ShieldCheck, Headphones, BadgeCheck } from "lucide-react";
import AdvantagesGrid from "./AdvantagesGrid";
import LogoScroll from "./LogoScroll";
import CtaSection from "./CtaSection";
import { aboutData } from "@/data/about-us";
import { getImageTitle } from "@/lib/image-utils";

const premiumEase = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function ServicesWrapper() {
  return (
    <div className="w-full relative overflow-hidden bg-[#FAF9F6] text-[#1C1C1C] font-sans antialiased">
      
      {/* SECTION 1: ONE-STOP SOLUTION */}
      <section className="py-24 md:py-32 bg-[#FAF9F6] relative border-b border-neutral-200/60">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/[0.01] rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          
          {/* Top Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: premiumEase }}
            viewport={{ once: true }}
            className="space-y-4 animate-fadeIn mb-16 text-center flex flex-col items-center"
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-brand-orange block">
              [ LAYANAN PREMIUM ]
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-[45px] font-extrabold font-display leading-[1.15] text-neutral-900 tracking-tight uppercase max-w-3xl mx-auto">
              Tempat Terbaik Untuk <span className="text-brand-orange italic font-normal">Mewujudkan</span> Brand Impian Anda
            </h2>
            <div className="w-16 h-1 bg-brand-orange mt-6 rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Visual Column */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: premiumEase }}
              viewport={{ once: true }}
              className="lg:col-span-5 relative"
            >
              <div className="absolute -inset-4 bg-brand-orange/[0.02] rounded-[32px] -rotate-2 pointer-events-none" />
              <div className="relative aspect-square rounded-[32px] overflow-hidden shadow-2xl border border-neutral-200 group">
                <Image 
                  src="/new%20asset/people/dsc01435.webp" 
                  alt="Tempat Terbaik Mewujudkan Brand Impian" 
                  title={getImageTitle("/new%20asset/people/dsc01435.webp")}
                  fill
                  className="object-cover hover:scale-[1.02] transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
              </div>
            </motion.div>

            {/* Content Column */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Card 1: One Stop Service */}
                <motion.div 
                  whileHover={{ y: -4 }}
                  className="flex gap-4 bg-white border border-neutral-200/50 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-brand-orange/20 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-brand-orange/5 border border-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 shadow-sm">
                    <HeartHandshake className="w-5.5 h-5.5 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <h3 className="text-sm md:text-base font-extrabold font-onest text-neutral-800 uppercase tracking-wide">
                      One Stop Service
                    </h3>
                    <p className="text-neutral-500 text-xs md:text-sm leading-relaxed">
                      Layanan mencakup merek dagang, desain kemasan, BPOM, dan sertifikasi HALAL.
                    </p>
                  </div>
                </motion.div>

                {/* Card 2: Quality is Number 1 */}
                <motion.div 
                  whileHover={{ y: -4 }}
                  className="flex gap-4 bg-white border border-neutral-200/50 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-brand-orange/20 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-brand-orange/5 border border-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 shadow-sm">
                    <ShieldCheck className="w-5.5 h-5.5 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <h3 className="text-sm md:text-base font-extrabold font-onest text-neutral-800 uppercase tracking-wide">
                      Quality is Number 1
                    </h3>
                    <p className="text-neutral-500 text-xs md:text-sm leading-relaxed">
                      Didukung tim R&D ahli, kami menghadirkan produk custom dan ready stock berkualitas.
                    </p>
                  </div>
                </motion.div>

                {/* Card 3: After Sales */}
                <motion.div 
                  whileHover={{ y: -4 }}
                  className="flex gap-4 bg-white border border-neutral-200/50 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-brand-orange/20 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-brand-orange/5 border border-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 shadow-sm">
                    <Headphones className="w-5.5 h-5.5 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <h3 className="text-sm md:text-base font-extrabold font-onest text-neutral-800 uppercase tracking-wide">
                      After Sales
                    </h3>
                    <p className="text-neutral-500 text-xs md:text-sm leading-relaxed">
                      Kami berkomitmen pada kualitas dengan harga produksi yang bersaing untuk mendukung pertumbuhan brand Anda.
                    </p>
                  </div>
                </motion.div>

                {/* Card 4: Bersertifikat */}
                <motion.div 
                  whileHover={{ y: -4 }}
                  className="flex gap-4 bg-white border border-neutral-200/50 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-brand-orange/20 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-brand-orange/5 border border-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 shadow-sm">
                    <BadgeCheck className="w-5.5 h-5.5 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <h3 className="text-sm md:text-base font-extrabold font-onest text-neutral-800 uppercase tracking-wide">
                      Bersertifikat
                    </h3>
                    <p className="text-neutral-500 text-xs md:text-sm leading-relaxed">
                      Produk terjamin aman dan legal dengan standar BPOM RI, CPKB Grade A, dan Halal MUI.
                    </p>
                  </div>
                </motion.div>
                
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: 8 KEUNTUNGAN MAKLON */}
      <AdvantagesGrid title="8 Keuntungan Maklon" />

      {/* SECTION 3: DI PERCAYA 150+ BRAND (LOGO SCROLL) */}
      <LogoScroll logos={aboutData.partnerLogos} />

      {/* SECTION 4: FINAL CTA */}
      <CtaSection />

    </div>
  );
}
