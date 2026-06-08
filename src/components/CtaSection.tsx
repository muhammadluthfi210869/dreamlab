"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { getImageTitle } from "@/lib/image-utils";
import { VIEWPORT_ONCE, fadeInLeft, fadeIn, staggerContainer } from "@/lib/animations";

interface CtaSectionProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}

export default function CtaSection({ 
  title = "Wujudkan Brand Kosmetik Impian Anda dalam 3 Bulan",
  subtitle
}: CtaSectionProps) {

  return (
    <section className="relative w-full overflow-hidden bg-white min-h-[420px] sm:min-h-[480px] md:min-h-[500px] lg:min-h-[580px] flex items-center border-t border-b border-neutral-100">
      
      {/* Background Image Visual (sampul-web-2.webp) - Full bleed with precise responsive alignment */}
      <motion.div 
        variants={fadeIn(1.0, 0)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="absolute inset-0 z-0 select-none pointer-events-none bg-white"
      >
        <Image 
          src="/new asset/new-icon-packing-design/sampul-web-2.webp" 
          alt="Dreamlab Cosmetics Showcase"
          title={getImageTitle("/new asset/new-icon-packing-design/sampul-web-2.webp")}
          fill
          unoptimized={true}
          priority={true}
          className="object-cover object-[78%_center] sm:object-[82%_center] md:object-[86%_center] lg:object-[88%_center] xl:object-[92%_center]"
        />
        {/* Soft, premium gradient masks to blend text background with studio environment */}
        <div className="absolute inset-y-0 left-0 w-[50%] bg-gradient-to-r from-white via-white/60 to-transparent z-10 hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/45 to-transparent md:hidden z-10" />
      </motion.div>

      <motion.div 
        variants={staggerContainer(0.12, 0.15)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="container-custom relative z-20 w-full px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full py-16 md:py-24">
          
          {/* Left Column: Premium Editorial Text & CTA Button (Always visible) */}
          <motion.div 
            variants={fadeInLeft(0.8, 0, -25)}
            className="col-span-12 md:col-span-6 lg:col-span-6 text-left z-20 flex flex-col justify-center"
          >
            <h2 className="text-[#F39200] text-[30px] sm:text-[40px] md:text-[38px] lg:text-[48px] xl:text-[54px] font-display font-extrabold leading-[1.12] tracking-tight font-onest mb-6 uppercase">
              {title}
            </h2>

            {subtitle && (
              <p className="text-neutral-500 text-sm md:text-base leading-relaxed mb-8 font-sans max-w-lg">
                {subtitle}
              </p>
            )}

            <div className="rounded-2xl w-fit mt-2">
              <Link 
                href="https://wa.me/62881027240339?text=Hi%20Dreamlab%2C%20saya%20ingin%20konsultasi%20membuat%20brand%20kosmetik"
                target="_blank"
                className="inline-flex items-center justify-center bg-[#F39200] hover:bg-[#D98200] hover:scale-[1.03] text-white px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-extrabold text-sm md:text-base lg:text-lg uppercase tracking-wider transition-all duration-300 shadow-xl shadow-[#F39200]/15 w-fit"
              >
                KONSULTASI HARI INI !
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Empty spacer to reserve space for the background mockup */}
          <div className="hidden md:block md:col-span-6 lg:col-span-6 h-full" />

        </div>
      </motion.div>
    </section>
  );
}
