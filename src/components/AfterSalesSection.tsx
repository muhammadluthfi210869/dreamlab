"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HeartHandshake, ShieldCheck, Headphones, BadgeCheck } from "lucide-react";
import { AfterSalesSectionData } from "@/types";
import { getImageTitle } from "@/lib/image-utils";
import { openWARoundRobin } from "@/lib/wa-roundrobin";

interface AfterSalesSectionProps {
  data: AfterSalesSectionData;
}

export default function AfterSalesSection({ data }: AfterSalesSectionProps) {
  // Gunakan dsc00997.webp sebagai visual utama (indeks ke-0 di data.images)
  const mainImg = data.images[0] || "/new%20asset/people/dsc00997.webp";

  return (
    <section className="py-20 md:py-28 bg-[#FAF9F6] relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-orange/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-orange/[0.015] rounded-full blur-[100px] pointer-events-none" />

      <div className="container-custom relative z-10 mx-auto px-4 md:px-8">
        
        {/* Top Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 animate-fadeIn mb-16 text-center flex flex-col items-center"
        >
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-brand-orange block">
            [ LAYANAN PREMIUM ]
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-[45px] font-extrabold font-display leading-[1.15] text-neutral-900 tracking-tight uppercase max-w-3xl mx-auto">
            Layanan <span className="text-brand-orange italic font-normal">Maklon Kosmetik</span> Terlengkap, Dari Nol Sampai Siap di Market
          </h2>
          <div className="w-16 h-1 bg-brand-orange rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Premium Enhanced Single Image Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 w-full relative flex justify-center"
          >
            <div className="relative w-full max-w-[480px] aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white/60 group">
              <Image
                src={mainImg}
                alt="Dreamlab Maklon Kosmetik Terlengkap"
                title={getImageTitle(mainImg)}
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-4 border border-white/20 rounded-[24px] pointer-events-none" />
            </div>
          </motion.div>

          {/* Right Column: Cards Grid & CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Grid 2x2 of Cards */}
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

              {/* Card 2: Quality Is Number 1 */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="flex gap-4 bg-white border border-neutral-200/50 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-brand-orange/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-brand-orange/5 border border-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 shadow-sm">
                  <ShieldCheck className="w-5.5 h-5.5 stroke-[1.5]" />
                </div>
                <div className="space-y-1.5 pt-0.5">
                  <h3 className="text-sm md:text-base font-extrabold font-onest text-neutral-800 uppercase tracking-wide">
                    Quality Is Number 1
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

            {/* CTA Button */}
            <div className="pt-4">
              <button
                onClick={() => openWARoundRobin(data.ctaLink)}
                className="bg-brand-orange hover:bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl transition-all duration-300 group inline-flex items-center gap-2.5 shadow-lg shadow-brand-orange/15 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Mulai Maklon Sekarang</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
