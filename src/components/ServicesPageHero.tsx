"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getImageTitle } from "@/lib/image-utils";

interface ServicesPageHeroProps {
  title: string;
  description: string;
  backgroundImage?: string;
}

export default function ServicesPageHero({ description }: ServicesPageHeroProps) {

  return (
    <section className="relative w-full lg:h-[calc(100vh-80px)] lg:max-h-[820px] lg:min-h-[640px] flex items-center overflow-hidden bg-white pt-28 md:pt-36 lg:pt-32 pb-10 lg:pb-0">
      {/* Background Pattern - Light warm cream fading to premium brand-orange light overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAF9F6] via-white to-[#FDF8F3]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/[0.02] rounded-full blur-[80px] pointer-events-none" />
      </div>

      <div className="container-custom relative z-10 py-2 md:py-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4 md:space-y-5 lg:space-y-6"
          >


            {/* Headline - Viga Font (Same as PremiumHero Home Page) */}
            <div className="space-y-3">
              <h1 
                className="text-brand-black text-[32px] sm:text-[44px] md:text-[52px] lg:text-[54px] xl:text-[62px] font-display font-normal leading-[1.1] tracking-tight uppercase"
              >
                Solusi <span className="text-brand-orange font-bold italic">One-Stop</span> <br className="hidden sm:inline" /> Maklon Services
              </h1>
              <p className="text-brand-orange text-lg md:text-xl font-bold font-onest tracking-wide">
                Dari Ide Sampai Siap Jual
              </p>
            </div>

            {/* Description - readable Helvetica Neue */}
            <p className="text-neutral-500 text-[13px] md:text-[15px] leading-relaxed max-w-xl font-helvetica">
              {description}
            </p>

            {/* CTA Button with brand-orange styling */}
            <div className="flex flex-col sm:flex-row gap-4 pt-1">
              <Link
                href="https://wa.me/62881027240339?text=Hi%20Dreamlab%2C%20saya%20tertarik%20dengan%20one-stop%20maklon%20services"
                target="_blank"
                className="inline-flex items-center justify-center gap-3 bg-brand-orange text-white font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-full hover:bg-brand-orange/90 transition-all duration-300 group shadow-lg shadow-brand-orange/25"
              >
                Mulai Konsultasi Gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#strategic-partnership"
                className="inline-flex items-center justify-center gap-2 border-2 border-neutral-200 text-neutral-800 font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-full hover:border-brand-orange hover:text-brand-orange transition-all duration-300"
              >
                Pelajari Alur Kerja
              </Link>
            </div>
          </motion.div>

          {/* Right: Product Image with layered rings */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-[240px] h-[240px] md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px]">
              {/* Background Circular Rings with brand-orange themes */}
              <div className="absolute inset-0 bg-brand-orange/5 rounded-full scale-110" />
              <div className="absolute inset-4 bg-brand-orange/5 rounded-full scale-105" />

              {/* Vira Portrait Image inside premium circular frame */}
              <div className="absolute inset-0 z-10 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                <Image
                  src="/new asset/people/Busdev-dreamlab.png"
                  alt="Vira - Dreamlab Team"
                  title={getImageTitle("/new%20asset/people/vira.webp")}
                  fill
                  className="object-cover hover:scale-[1.02] transition-transform duration-500"
                  priority
                  sizes="(max-width: 768px) 240px, (max-width: 1024px) 320px, 380px"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
