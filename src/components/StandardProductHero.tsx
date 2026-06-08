"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface StandardProductHeroProps {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  category: string;
  bgColor?: string;
}

export default function StandardProductHero({ 
  title, 
  subtitle, 
  description, 
  backgroundImage,
  category: _category,
  bgColor = "#eef5fa"
}: StandardProductHeroProps) {
  return (
    <section className="relative min-h-[60vh] md:min-h-[80vh] flex items-center overflow-hidden pt-28 md:pt-32" style={{ backgroundColor: bgColor }}>
      {/* Background Image - Clean and Bright */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt={title}
          title={`${title} — Dreamlab Indonesia`}
          fill
          className="object-cover object-right md:object-center"
          priority
          fetchPriority="high"
          decoding="sync"
          sizes="100vw"
        />
        {/* Subtle gradient to ensure text readability - matching the bgColor */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent md:bg-gradient-to-r" 
          style={{ 
            backgroundImage: `linear-gradient(to right, ${bgColor} 0%, ${bgColor} 40%, transparent 100%)` 
          }}
        />
      </div>

      <div className="relative z-10 py-20 px-6 md:px-16 lg:px-24 xl:px-32 w-full">
        <div className="max-w-2xl space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-2"
          >
            <h1 className="text-[38px] md:text-[52px] lg:text-[80px] font-normal text-brand-black leading-[1.05] tracking-tight uppercase">
              <span className="block">{title}</span>
              <span className="block text-brand-orange">{subtitle}</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-base md:text-lg text-brand-black/80 font-medium leading-relaxed max-w-xl"
          >
            {description}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
