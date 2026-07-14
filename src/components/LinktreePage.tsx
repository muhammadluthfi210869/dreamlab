"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useLeadAssignment } from "@/hooks/useLeadAssignment";
import { buildWhatsAppUrl } from "@/lib/lead-routing";

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
  {
    title: "Maklon Decorative",
    description: "Lipstik, eyeshadow, blush on & lebih",
    link: "/produk/decorative/",
  },
  {
    title: "Maklon Baby Care",
    description: "Baby lotion, baby oil, baby wash & lebih",
    link: "/produk/babycare/",
  },
];

const badges = [
  "Free Formula",
  "Free Desain",
  "Free BPOM",
  "Free Halal",
  "Free HKI",
];

type LinktreePageProps = {
  initialSource?: string;
};

export default function LinktreePage({ initialSource = "linktree" }: LinktreePageProps) {
  const [source, setSource] = useState(initialSource);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resolvedSource = params.get("source") || initialSource;
    setSource(resolvedSource);
  }, [initialSource]);

  const assignment = useLeadAssignment(source);

  const handleWAClick = useCallback(() => {
    if (!assignment.phone) return;
    const msg = "Halo Dreamlab, saya ingin konsultasi maklon. Bisa dibantu?";
    const url = buildWhatsAppUrl(assignment.phone, msg);
    window.location.assign(url);
  }, [assignment.phone]);

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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-brand-orange/[0.04] rounded-full blur-[80px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-brand-orange/[0.03] rounded-full blur-[90px] pointer-events-none translate-y-1/2" />

      <div className="w-full max-w-[600px] mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: premiumEase }}
          className="flex flex-col items-center text-center w-full"
        >
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

          <p className="text-[13px] md:text-sm text-neutral-500 font-medium max-w-[340px] leading-relaxed font-sans">
            Solusi Maklon Skincare, Parfum, Hair Care & Body Care untuk Brand Impianmu
          </p>
        </motion.div>

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

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: premiumEase }}
          className="w-full"
        >
          <button
            onClick={handleWAClick}
            className="btn-wa w-full bg-[#22c55e] hover:bg-[#16a34a] text-white py-5 px-6 rounded-2xl flex items-center justify-center gap-4 transition-all duration-300 shadow-[0_8px_24px_rgba(34,197,94,0.35)] hover:shadow-[0_12px_32px_rgba(34,197,94,0.45)] hover:scale-[1.02] active:scale-[0.98] group no-underline cursor-pointer border-none"
          >
            <div className="flex flex-col text-center w-full">
              <span className="text-sm font-bold tracking-wider">HUBUNGI KAMI VIA WHATSAPP</span>
              <span className="text-[12px] font-normal opacity-80 mt-1">Konsultasi Gratis - Respon Cepat</span>
            </div>
          </button>
        </motion.div>

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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {categories.map((category, idx) => (
            <motion.div key={idx} variants={itemVariants} className="w-full">
              <Link
                href={category.link}
                className="w-full h-full bg-white hover:bg-[#FAF9F6] border border-[#E9E1D3] p-5 rounded-2xl flex items-center justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] active:scale-[0.99] shadow-[0_2px_8px_rgba(0,0,0,0.04)] group"
              >
                <div className="flex flex-col text-left pr-4">
                  <span className="text-[15px] font-bold text-neutral-800 font-onest group-hover:text-brand-orange transition-colors">
                    {category.title}
                  </span>
                  <span className="text-[12px] text-neutral-400 font-sans font-medium mt-1 leading-snug">
                    {category.description}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#F9F4EB] border border-[#EBE1CD] flex items-center justify-center text-[#B58E4B] group-hover:bg-brand-orange group-hover:border-brand-orange group-hover:text-white transition-all duration-300 group-hover:scale-105 flex-shrink-0">
                  <ArrowRight size={14} className="transform transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

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
