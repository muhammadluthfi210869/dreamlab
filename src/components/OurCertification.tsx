"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

interface OurCertificationProps {
  alt?: string;
  title?: string;
}

const CERTIFICATIONS = [
  {
    id: "bpom",
    name: "Badan POM RI",
    badge: "Izin Edar Resmi",
    description: "Registrasi notifikasi BPOM resmi untuk keamanan & legalitas produk.",
    src: "/assets/images/BPOM.webp",
    width: 120,
    height: 110,
    imgClass: "h-14 sm:h-16 w-auto object-contain",
  },
  {
    id: "cpkb",
    name: "CPKB Grade A",
    badge: "Standar Tertinggi",
    description: "Fasilitas produksi higienis berstandar Cara Pembuatan Kosmetik yang Baik.",
    src: "/images/certifications/cpkb.png",
    width: 110,
    height: 110,
    imgClass: "h-14 sm:h-16 w-auto object-contain",
  },
  {
    id: "halal",
    name: "Halal Indonesia",
    badge: "Tersertifikasi Halal",
    description: "Jaminan bahan baku dan proses produksi sesuai standar halal resmi.",
    src: "/images/certifications/halal.png",
    width: 110,
    height: 110,
    imgClass: "h-14 sm:h-16 w-auto object-contain",
  },
  {
    id: "hki",
    name: "Terdaftar HKI",
    badge: "Perlindungan Merek",
    description: "Dukungan legalitas hak kekayaan intelektual untuk keamanan brand Anda.",
    src: "/images/certifications/hki.png",
    width: 150,
    height: 54,
    imgClass: "h-10 sm:h-12 w-auto object-contain",
  },
] as const;

export default function OurCertification({
  alt = "Sertifikasi Resmi Dreamlab - BPOM RI, CPKB Grade A, Halal Indonesia, Terdaftar HKI",
}: OurCertificationProps) {
  return (
    <section
      aria-label={alt}
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#EDF4FC] via-[#E5F0FB] to-[#F4F8FD] py-16 sm:py-20 lg:py-24 border-y border-blue-100/80 select-none"
    >
      {/* Soft Animated Ice-Blue & Warm Amber Ambient Highlights */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(10,37,88,0.08) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <motion.div
        aria-hidden="true"
        animate={{ x: [-16, 16, -16], y: [-8, 10, -8] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-24 left-[12%] h-72 w-72 rounded-full bg-white/80 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        animate={{ x: [14, -14, 14], y: [8, -10, 8] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-24 right-[10%] h-80 w-80 rounded-full bg-[#F39200]/10 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        animate={{ x: [-10, 12, -10] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none -bottom-16 -left-12 absolute h-56 w-56 rounded-full bg-sky-200/45 blur-3xl"
      />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/90 bg-white/90 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#0A2558] shadow-xs backdrop-blur-md mb-4">
            <ShieldCheck className="h-3.5 w-3.5 text-[#F39200]" />
            <span>Sertifikasi &amp; Legalitas Resmi</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#0A2558] leading-tight">
            Our Certifications
          </h2>

          {/* Animated Orange Swoosh */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
            className="mx-auto mt-2 flex justify-center origin-center"
          >
            <svg width="180" height="10" viewBox="0 0 180 10" fill="none" aria-hidden="true">
              <path
                d="M2 7.5C48 2 124 1.5 178 6.5"
                stroke="url(#certSwooshLight)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="certSwooshLight" x1="2" y1="5" x2="178" y2="5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F39200" />
                  <stop offset="1" stopColor="#FBB03B" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          <p className="mt-3.5 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Dreamlab memiliki sertifikasi yang diakui{' '}
            <strong className="font-bold text-[#0A2558]">secara nasional dan internasional</strong> untuk
            menjamin kualitas, keamanan, dan legalitas setiap produk brand Anda.
          </p>
        </motion.div>

        {/* Staggered Animated Certification Cards */}
        <div className="mx-auto mt-10 sm:mt-12 grid max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {CERTIFICATIONS.map((cert, idx) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.55,
                delay: idx * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, amount: 0.2 }}
              className="group relative flex flex-col items-center rounded-3xl border border-white bg-white/95 p-6 text-center shadow-[0_14px_38px_rgba(10,37,88,0.07)] backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_22px_48px_rgba(10,37,88,0.12)]"
            >
              {/* Top Gradient Accent Bar */}
              <div className="absolute inset-x-6 top-0 h-1 rounded-b-full bg-gradient-to-r from-[#F39200] to-[#FBB03B] opacity-75 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Logo Frame with Soft Ice-Blue Glow */}
              <div className="relative mt-1 flex h-24 w-full items-center justify-center rounded-2xl bg-gradient-to-b from-[#F8FBFF] to-[#EEF5FC] px-4 border border-blue-100/70 transition-colors duration-300 group-hover:border-amber-200/80">
                <Image
                  src={cert.src}
                  alt={cert.name}
                  width={cert.width}
                  height={cert.height}
                  className={`${cert.imgClass} transition-transform duration-300 ease-out group-hover:scale-105`}
                />
              </div>

              {/* Verified Pill */}
              <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#D97706]">
                <CheckCircle2 className="h-3 w-3 text-[#F39200]" />
                {cert.badge}
              </span>

              {/* Title & Description */}
              <h3 className="mt-2.5 text-base font-extrabold text-[#0A2558] leading-snug">
                {cert.name}
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-medium">
                {cert.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Credibility Strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-[#0A2558]/75"
        >
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#F39200]" />
            Standar Mutu Nasional &amp; Internasional
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Pendampingan Legalitas End-to-End
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span>Uji Stabilitas &amp; Laboratorium Terakreditasi</span>
        </motion.div>
      </div>
    </section>
  );
}
