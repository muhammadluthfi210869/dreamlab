"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { PartnerLogoData } from "@/types";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";
import { VIEWPORT_ONCE, fadeInUp, staggerContainer } from "@/lib/animations";

interface LogoScrollProps {
  logos: PartnerLogoData[];
  headline?: string;
  subHeadline?: string;
}

export default function LogoScroll({ logos, headline = "DIPERCAYA OLEH 150+ BRAND DI SELURUH INDONESIA", subHeadline }: LogoScrollProps) {
  // Duplikasi logo agar efek putaran infinite marquee berjalan mulus tanpa celah kosong (100% seamless)
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="py-10 md:py-14 bg-white relative overflow-hidden">
      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div 
          variants={staggerContainer(0.08, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="text-center mb-8 md:mb-12 max-w-3xl mx-auto"
        >
          <motion.span 
            variants={fadeInUp(0.6, 0, 15)}
            className="text-brand-orange font-black uppercase tracking-[0.4em] text-xs mb-3 block"
          >
            Our Partners
          </motion.span>
          <motion.h2 
            variants={fadeInUp(0.7, 0.05, 15)}
            className="text-2xl md:text-3xl lg:text-4xl font-display text-brand-black leading-[1.2] uppercase"
          >
            {headline}
          </motion.h2>
          {subHeadline && (
            <motion.p 
              variants={fadeInUp(0.7, 0.1, 15)}
              className="text-sm md:text-base text-gray-600 leading-relaxed font-medium mt-4"
            >
              {subHeadline}
            </motion.p>
          )}
          <motion.div 
            variants={fadeInUp(0.5, 0.15, 10)}
            className="w-16 h-1.5 bg-brand-orange mx-auto mt-6 rounded-full" 
          />
        </motion.div>

        {/* Single-Row Infinite Marquee - Ultra Smooth & Breathable */}
        <div className="relative overflow-hidden">
          {/* Elegant Soft Blur Gradient Overlays on Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex gap-12 md:gap-20 items-center flex-nowrap w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            {duplicatedLogos.map((logo, idx) => (
              <div
                key={`logo-${idx}`}
                className="relative h-32 sm:h-40 md:h-48 w-40 sm:w-52 md:w-64 flex-shrink-0 transition-all duration-500 hover:scale-[1.08]"
              >
                <Image
                  src={logo.path}
                  alt={getImageAlt(logo.path, logo.name)}
                  title={getImageTitle(logo.path)}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 160px, (max-width: 768px) 208px, 256px"
                  priority={idx < 6}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
