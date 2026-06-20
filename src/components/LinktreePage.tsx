"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const premiumEase = [0.16, 1, 0.3, 1] as any;

const categories = [
  {
    title: "Maklon Skincare",
    description: "Serum, moisturizer, toner, sunscreen & lebih",
    link: "/produk/skincare/",
  },
  {
    title: "Maklon Parfum",
    description: "EDP, EDT, parfum oil, body mist & lebih",
    link: "/produk/parfum/",
  },
  {
    title: "Maklon Hair Care",
    description: "Shampoo, conditioner, hair mask & serum",
    link: "/produk/haircare/",
  },
  {
    title: "Maklon Body Care",
    description: "Body lotion, body scrub, sabun & lebih",
    link: "/produk/bodycare/",
  },
];

const badges = [
  "Free Formula",
  "Free Desain",
  "Free BPOM",
  "Free Halal",
  "Free HKI",
];

export default function LinktreePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="landing-page-ads min-h-screen bg-[#FAF6F0] text-brand-black font-sans selection:bg-brand-orange selection:text-white relative overflow-hidden flex flex-col justify-between py-12 px-4">
      {/* Decorative ambient gradients for premium aesthetic */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-brand-orange/[0.04] rounded-full blur-[80px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-brand-orange/[0.03] rounded-full blur-[90px] pointer-events-none translate-y-1/2" />

      {/* Main Content Area */}
      <div className="w-full max-w-[440px] mx-auto flex flex-col items-center">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: premiumEase }}
          className="flex flex-col items-center text-center w-full"
        >
          {/* Logo */}
          <Link href="/" className="transition-transform duration-300 hover:scale-105 mb-6">
            <Image
              src="/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik-.webp"
              alt="Dreamlab Logo"
              width={180}
              height={58}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Subtitle / Tagline */}
          <p className="text-[13px] md:text-sm text-neutral-500 font-medium max-w-[340px] leading-relaxed font-sans">
            Solusi Maklon Skincare, Parfum, Hair Care & Body Care untuk Brand Impianmu
          </p>
        </motion.div>

        {/* Section: HUBUNGI KAMI */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex items-center gap-3 w-full my-6"
        >
          <div className="h-[1px] bg-[#E8DFD1] flex-grow" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#B58E4B] uppercase font-onest">
            HUBUNGI KAMI
          </span>
          <div className="h-[1px] bg-[#E8DFD1] flex-grow" />
        </motion.div>

        {/* WhatsApp Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: premiumEase }}
          className="w-full"
        >
          <Link
            href="/thankyou/google/"
            id="wa-button"
            className="btn-wa w-full bg-[#24C75D] hover:bg-[#1EAE4F] text-white py-4 px-6 rounded-[22px] flex items-center justify-center gap-4 transition-all duration-300 hover:scale-[1.015] active:scale-98 shadow-[0_8px_25px_rgba(36,199,93,0.22)] hover:shadow-[0_12px_30px_rgba(36,199,93,0.3)] group"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white transition-transform duration-300 group-hover:scale-105">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <div className="flex flex-col text-left">
              <span className="text-[12px] font-black uppercase tracking-wider font-onest">Hubungi Kami via WhatsApp</span>
              <span className="text-[11px] text-white/90 font-medium font-sans">Konsultasi Gratis · Respon Cepat</span>
            </div>
          </Link>
        </motion.div>

        {/* Section: LAYANAN KAMI */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex items-center gap-3 w-full my-6"
        >
          <div className="h-[1px] bg-[#E8DFD1] flex-grow" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#B58E4B] uppercase font-onest">
            LAYANAN KAMI
          </span>
          <div className="h-[1px] bg-[#E8DFD1] flex-grow" />
        </motion.div>

        {/* Category Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full flex flex-col gap-4"
        >
          {categories.map((category, idx) => (
            <motion.div key={idx} variants={itemVariants} className="w-full">
              <Link
                href={category.link}
                className="w-full bg-white hover:bg-[#FAF9F6] border border-[#E9E1D3] p-5 rounded-[22px] flex items-center justify-between transition-all duration-300 hover:scale-[1.015] active:scale-[0.99] shadow-[0_4px_12px_rgba(0,0,0,0.015)] hover:shadow-[0_8px_20px_rgba(181,142,75,0.06)] group"
              >
                <div className="flex flex-col text-left pr-4">
                  <span className="text-[15px] font-bold text-neutral-800 font-onest group-hover:text-brand-orange transition-colors">
                    {category.title}
                  </span>
                  <span className="text-[12px] text-neutral-400 font-sans font-medium mt-1 leading-snug">
                    {category.description}
                  </span>
                </div>
                {/* Arrow Icon Circle */}
                <div className="w-8 h-8 rounded-full bg-[#F9F4EB] border border-[#EBE1CD] flex items-center justify-center text-[#B58E4B] group-hover:bg-brand-orange group-hover:border-brand-orange group-hover:text-white transition-all duration-300 group-hover:scale-105 flex-shrink-0">
                  <ArrowRight size={14} className="transform transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: premiumEase }}
          className="flex flex-wrap justify-center gap-2 mt-8 max-w-[360px]"
        >
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="bg-[#F6EFE4] border border-[#EBE0CD] text-[#A58249] px-3.5 py-1.5 rounded-full text-[11px] font-bold font-onest flex items-center gap-1.5"
            >
              <Check size={11} className="stroke-[4] text-brand-orange" />
              <span>{badge}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
