"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface StrategicClosingProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  productName?: string;
}

export default function StrategicClosing({ headline, subheadline, ctaText, productName }: StrategicClosingProps) {
  const whatsappMessage = encodeURIComponent(
    `Halo Dreamlab! Saya ingin menjadwalkan pembuatan sampel produk ${productName || "premium"} untuk brand saya.`
  );
  const whatsappLink = `https://wa.me/6281234567890?text=${whatsappMessage}`;
  
  const premiumEase = [0.16, 1, 0.3, 1] as any;

  const badgeVariants = {
    hidden: { opacity: 0, y: -20, rotate: -3 },
    show: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { duration: 0.8, ease: premiumEase }
    }
  };

  const headlineVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.2, duration: 0.9, ease: premiumEase }
    }
  };

  const subheadlineVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.4, duration: 0.8, ease: premiumEase }
    }
  };

  const ctaContainerVariants = {
    hidden: { opacity: 0, y: 25 },
    show: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.6, duration: 0.8, ease: premiumEase }
    }
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="py-24 bg-[#FDFDFC] text-[#212120] overflow-hidden relative border-t border-gray-100"
    >
      {/* Decorative Background Pulsing Glow Orb */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.05, 0.08, 0.05],
          x: [0, 15, 0],
          y: [0, -10, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 8, 
          ease: "easeInOut" 
        }}
        className="absolute top-0 right-0 w-1/3 h-full bg-brand-orange blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" 
      />
      
      <div className="container-custom relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          
          {/* Badge Reveal */}
          <motion.div
            variants={badgeVariants}
            className="inline-flex items-center gap-3 px-4 py-1.5 bg-brand-orange/5 rounded-full mb-8 border border-brand-orange/10 cursor-default"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
            <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em]">Risk Reversal Guarantee</span>
          </motion.div>

          {/* Headline */}
          <motion.h2 
            variants={headlineVariants}
            className="font-display text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-8"
          >
            {headline}
          </motion.h2>

          {/* Subheadline */}
          <motion.p 
            variants={subheadlineVariants}
            className="text-lg lg:text-xl text-[#212120]/60 font-medium leading-relaxed mb-12 max-w-2xl mx-auto"
          >
            {subheadline}
          </motion.p>

          {/* Action CTA Button with spring scale micro-interaction and custom dynamic breathing loop */}
          <motion.div 
            variants={ctaContainerVariants}
            className="flex flex-col items-center gap-8"
          >
            <motion.a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="group relative inline-flex items-center justify-center gap-6 bg-brand-orange hover:bg-[#212120] text-white font-bold py-6 px-14 rounded-2xl transition-all duration-500 shadow-[0_20px_40px_rgba(246,145,30,0.2)] hover:shadow-[0_25px_50px_rgba(246,145,30,0.35)]"
            >
              {/* Subtle back-glow wave on button hover */}
              <div className="absolute inset-0 rounded-2xl bg-brand-orange opacity-0 group-hover:opacity-30 group-hover:scale-105 transition-all duration-500 -z-10 blur-xl" />
              
              <span className="uppercase tracking-[0.2em] text-xs font-onest">{ctaText}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
            </motion.a>
          </motion.div>

        </div>
      </div>
    </motion.section>
  );
}
