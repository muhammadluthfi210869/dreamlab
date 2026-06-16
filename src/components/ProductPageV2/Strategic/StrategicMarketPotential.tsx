"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface StrategicMarketPotentialProps {
  headline: string;
  points: {
    title: string;
    description: string;
  }[];
  image?: string;
}

export default function StrategicMarketPotential({ headline, points, image }: StrategicMarketPotentialProps) {
  // Global premium animation settings
  const premiumEase = [0.16, 1, 0.3, 1] as any;

  const headlineVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.2, duration: 1, ease: premiumEase }
    }
  };

  const pointVariants = (index: number) => ({
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.15 + 0.3, duration: 0.8, ease: premiumEase }
    }
  });

  const pointLineVariants = (index: number) => ({
    hidden: { scaleX: 0 },
    show: {
      scaleX: 1,
      transition: { delay: index * 0.15 + 0.5, duration: 0.8, ease: premiumEase }
    }
  });

  const visualVariants = {
    hidden: { opacity: 0, y: 50, rotate: -3, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { duration: 1.2, ease: premiumEase }
    }
  };
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="py-12 lg:py-24 bg-white overflow-hidden"
    >
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row-reverse gap-16 lg:gap-24 items-center">
          
          {/* Right Side: Headline & Points */}
          <div className="w-full lg:w-3/5">
            {/* Mobile Header: Headline + Small Inset Visual (Static) */}
            <div className="lg:hidden flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <h2 className="font-display text-xl font-black text-[#212120] uppercase tracking-tighter leading-tight">
                  {headline}
                </h2>
              </div>
              
              {/* Compact Inset Visual */}
              <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg border-2 border-white flex-shrink-0 relative z-10 bg-[#FFF5F2] rotate-2">
                <Image
                  src={image || "/new asset/produk/parfum/strategic-market-visual.webp"}
                  alt="Asset"
                  fill
                  sizes="80px"
                  loading="lazy"
                  decoding="async"
                  className="object-contain p-1"
                />
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-12">
              <motion.h2 
                variants={headlineVariants}
                className="font-display text-[28px] lg:text-[48px] font-normal text-[#212120] uppercase tracking-tight leading-[1.1] max-w-2xl"
              >
                {headline}
              </motion.h2>
            </div>

            {/* Points Grid - Desktop */}
            <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
              {points.map((point, index) => (
                <motion.div
                  key={index}
                  variants={pointVariants(index)}
                  className="group flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-brand-orange font-black text-2xl lg:text-3xl opacity-20 group-hover:opacity-100 transition-opacity duration-500">0{index + 1}</span>
                    <motion.div 
                      variants={pointLineVariants(index)}
                      className="flex-grow h-px bg-gray-100 group-hover:bg-brand-orange transition-all duration-500 origin-left" 
                    />
                  </div>
                  <h3 className="font-onest text-lg lg:text-xl font-black text-[#212120] uppercase tracking-tight mb-3 transition-colors duration-300 group-hover:text-brand-orange">
                    {point.title}
                  </h3>
                  <p className="text-[#212120]/70 leading-relaxed font-medium text-sm lg:text-[15px]">
                    {point.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Points Grid - Mobile (Static Responsive, No Motion) */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
              {points.map((point, index) => (
                <div
                  key={index}
                  className="bg-[#FDFDFC] p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-[10px] font-black text-brand-orange">
                      POINT 0{index + 1}
                    </div>
                    <div className="flex-grow h-[1px] bg-brand-orange/10" />
                  </div>
                  <h3 className="font-onest text-sm font-black text-[#212120] uppercase tracking-tight mb-2 leading-tight">
                    {point.title}
                  </h3>
                  <p className="text-[#212120]/70 leading-relaxed font-medium text-xs">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Left Side: Desktop Visual Element (Hidden on Mobile) */}
          <div className="hidden lg:block lg:w-2/5 relative">
            <motion.div
              variants={visualVariants}
              className="relative aspect-square w-full max-w-[450px] mx-auto lg:mr-auto"
            >
              <motion.div 
                animate={{ rotate: [3, 4, 3], scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                className="absolute inset-4 bg-brand-orange/5 rounded-[3rem] rotate-3" 
              />
              <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl border border-white/50 bg-[#FFF5F2]">
                <Image
                  src={image || "/new asset/produk/parfum/strategic-market-visual.webp"}
                  alt="Premium Packaging Asset"
                  fill
                  sizes="(max-width: 1024px) 100vw, 450px"
                  loading="lazy"
                  decoding="async"
                  className="object-contain p-6"
                />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </motion.section>
  );
}
