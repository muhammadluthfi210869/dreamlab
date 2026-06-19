"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AboutHeroData } from "@/types";
import { getImageTitle } from "@/lib/image-utils";
import { fadeInLeft, fadeInRight, staggerContainer } from "@/lib/animations";
import { openWARoundRobin } from "@/lib/wa-roundrobin";

export default function AboutPageHero({ data }: { data: AboutHeroData }) {
  return (
    <section className="relative w-full lg:h-screen min-h-[600px] flex items-center overflow-hidden bg-white pt-[90px] md:pt-[110px] lg:pt-[120px] pb-8 lg:pb-0">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAF9F6] via-white to-[#FFF5EB]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/[0.03] rounded-full blur-[90px]" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-brand-orange/[0.02] rounded-full blur-[70px]" />
      </div>

      <div className="container-custom relative z-10 py-6 md:py-10 lg:py-0 w-full">
        <motion.div 
          variants={staggerContainer(0.15, 0)}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center w-full"
        >
          {/* Left: Content */}
          <motion.div
            variants={fadeInLeft(0.8, 0, -30)}
            className="lg:col-span-7 space-y-5"
          >

            {/* Headline */}
            <div className="space-y-1.5">
              <h1 className="text-[32px] md:text-[46px] lg:text-[56px] xl:text-[64px] text-brand-black leading-[1.1] tracking-tight font-normal uppercase">
                {data.title}
              </h1>
              <p className="text-brand-orange text-lg md:text-xl font-bold font-onest tracking-wide">
                {data.subtitle}
              </p>
            </div>

            {/* Description */}
            <p className="text-brand-black/60 text-sm md:text-base lg:text-lg leading-relaxed max-w-xl">
              {data.description}
            </p>

            {/* CTA Button */}
            <div className="pt-1">
              {data.ctaLink.startsWith("http") || data.ctaLink.startsWith("/") ? (
                <Link
                  href={data.ctaLink}
                  target={data.ctaLink.startsWith("http") ? "_blank" : undefined}
                  className="inline-flex items-center gap-2.5 bg-brand-orange text-white font-bold text-sm md:text-base px-7 py-3.5 rounded-full hover:bg-brand-orange/90 transition-all duration-300 group shadow-lg shadow-brand-orange/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {data.ctaText}
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <button
                  onClick={() => openWARoundRobin(data.ctaLink)}
                  className="inline-flex items-center gap-2.5 bg-brand-orange text-white font-bold text-sm md:text-base px-7 py-3.5 rounded-full hover:bg-brand-orange/90 transition-all duration-300 group shadow-lg shadow-brand-orange/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {data.ctaText}
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Right: Product Image */}
          <motion.div
            variants={fadeInRight(0.8, 0.15, 30)}
            className="lg:col-span-5 relative flex justify-center lg:justify-end"
          >
            <div className="relative w-[250px] h-[250px] sm:w-[320px] sm:h-[320px] md:w-[360px] md:h-[360px] lg:w-[360px] lg:h-[360px] xl:w-[410px] xl:h-[410px]">
              {/* Background Circle */}
              <div className="absolute inset-0 bg-brand-orange/5 rounded-full scale-105" />
              <div className="absolute inset-3 bg-brand-orange/5 rounded-full scale-100" />

              {/* Product Image */}
              <Image
                src={data.productImage}
                alt="Dreamlab Cosmetic Product"
                title={getImageTitle(data.productImage)}
                fill
                className="object-contain relative z-10 drop-shadow-2xl"
                priority
                sizes="(max-width: 640px) 250px, (max-width: 768px) 320px, (max-width: 1024px) 360px, 410px"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
