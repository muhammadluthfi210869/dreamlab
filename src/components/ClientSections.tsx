"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { clientLogos } from "@/data/clients";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";
import { VIEWPORT_ONCE, fadeInUp, staggerContainer } from "@/lib/animations";

export const PartnerTrustSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white pt-24 pb-20">
      {/* Background Blurs for Premium Aesthetics */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6] via-white to-white" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/[0.01] rounded-full blur-[100px]" />
      </div>

      <motion.div 
        variants={staggerContainer(0.08, 0)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="container-custom relative z-10 text-center mb-20 px-4"
      >
        {/* Monospace Eyebrow */}
        <motion.div
          variants={fadeInUp(0.6, 0, 15)}
          className="inline-flex items-center gap-2.5 mb-4"
        >
          <span className="text-brand-orange font-bold text-[11px] uppercase tracking-[0.25em] border-b-2 border-brand-orange/30 pb-1 font-onest">
            Trusted Partners
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
        </motion.div>

        {/* Title */}
        <motion.h2
          variants={fadeInUp(0.8, 0.05, 20)}
          className="text-3xl md:text-5xl lg:text-6xl font-display font-normal text-brand-black leading-tight uppercase tracking-tight mb-8"
        >
          Bangun Brand Kosmetik Anda dengan <br className="hidden md:inline" />
          <span className="text-brand-orange font-bold italic">Partner Terpercaya</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={fadeInUp(0.8, 0.1, 20)}
          className="text-neutral-500 max-w-4xl mx-auto text-sm md:text-base leading-relaxed font-helvetica"
        >
          Lebih dari 5.000 Brand Telah Memilih Dreamlab Sebagai Maklon Kosmetik Utama Mereka. Kepuasan Anda adalah prioritas utama kami. 
          Dreamlab berkomitmen untuk menghadirkan produk berkualitas, serta layanan purna jual (after-sales service) yang profesional and memuaskan.
        </motion.p>
      </motion.div>

      {/* Infinite Marquee - Enlarged Full Color Logos */}
      <div className="relative w-full overflow-hidden flex items-center py-12 border-t border-b border-gray-100/80 bg-white/40 backdrop-blur-sm">
        {/* Soft edge fade shadows */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-white/95 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-white/95 to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex w-max"
        >
          {/* Set 1 */}
          <div className="flex space-x-20 md:space-x-32 items-center px-10 md:px-20">
            {clientLogos.map((logo, idx) => (
              <div
                key={`trust-set1-${idx}`}
                className="relative w-48 h-28 md:w-64 md:h-36 flex-shrink-0 flex items-center justify-center transition-transform duration-500 hover:scale-105"
              >
                <Image
                  src={logo.src}
                  alt={getImageAlt(logo.src, logo.name)}
                  title={getImageTitle(logo.src)}
                  width={240}
                  height={110}
                  className="max-h-full w-auto object-contain"
                  sizes="(max-width: 768px) 192px, 256px"
                />
              </div>
            ))}
          </div>
          {/* Set 2 */}
          <div className="flex space-x-20 md:space-x-32 items-center px-10 md:px-20">
            {clientLogos.map((logo, idx) => (
              <div
                key={`trust-set2-${idx}`}
                className="relative w-48 h-28 md:w-64 md:h-36 flex-shrink-0 flex items-center justify-center transition-transform duration-500 hover:scale-105"
              >
                <Image
                  src={logo.src}
                  alt={getImageAlt(logo.src, logo.name)}
                  title={getImageTitle(logo.src)}
                  width={240}
                  height={110}
                  className="max-h-full w-auto object-contain"
                  sizes="(max-width: 768px) 192px, 256px"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
