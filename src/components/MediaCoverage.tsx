"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";
import { VIEWPORT_ONCE, fadeInUp } from "@/lib/animations";

interface MediaProps {
  title: string;
  logos: { name: string; src: string }[];
}

export default function MediaCoverage({ title, logos }: MediaProps) {
  // Duplikasi logo agar efek putaran infinite marquee berjalan mulus tanpa celah kosong
  const duplicatedLogos = [...logos, ...logos, ...logos];

  // Function to render title with bold parts
  const renderTitle = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <span key={i} className="font-extrabold text-[#F39200]">
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <section className="py-16 md:py-20 bg-white border-y border-gray-100 overflow-hidden relative">
      <div className="container-custom max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          variants={fadeInUp(0.8, 0, 15)}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl font-display text-brand-black leading-[1.2] uppercase">
            {renderTitle(title)}
          </h2>
        </motion.div>

        {/* Single-Row Infinite Marquee - Ultra Smooth & Breathable */}
        <div className="relative overflow-hidden w-full">
          {/* Elegant Soft Blur Gradient Overlays on Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex gap-12 md:gap-20 items-center flex-nowrap w-max"
            animate={{ x: ["0%", "-33.333%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            {duplicatedLogos.map((logo, idx) => (
              <div
                key={`media-logo-${idx}`}
                className="relative h-24 sm:h-32 md:h-40 w-48 sm:w-64 md:w-80 flex-shrink-0 transition-all duration-500 hover:scale-105"
              >
                <Image
                  src={logo.src}
                  alt={getImageAlt(logo.src, logo.name)}
                  title={getImageTitle(logo.src)}
                  fill
                  className="object-contain filter-none opacity-100 drop-shadow-sm hover:drop-shadow-md"
                  sizes="(max-width: 640px) 192px, (max-width: 768px) 256px, 320px"
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


