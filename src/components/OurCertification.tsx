"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

interface OurCertificationProps {
  alt?: string;
  title?: string;
}

const CERTIFICATIONS = [
  {
    id: "bpom",
    name: "Badan POM RI",
    subtitle: "Izin Edar Resmi",
    src: "/assets/images/BPOM.webp",
    width: 112,
    height: 103,
    imgClass: "h-12 sm:h-14 w-auto object-contain",
  },
  {
    id: "cpkb",
    name: "CPKB Grade A",
    subtitle: "Standar Produksi",
    src: "/images/certifications/cpkb.png",
    width: 100,
    height: 100,
    imgClass: "h-12 sm:h-14 w-auto object-contain",
  },
  {
    id: "halal",
    name: "Halal Indonesia",
    subtitle: "Tersertifikasi Halal",
    src: "/images/certifications/halal.png",
    width: 100,
    height: 100,
    imgClass: "h-12 sm:h-14 w-auto object-contain",
  },
  {
    id: "hki",
    name: "Terdaftar HKI",
    subtitle: "Perlindungan Merek",
    src: "/images/certifications/hki.png",
    width: 140,
    height: 50,
    imgClass: "h-9 sm:h-11 w-auto object-contain",
  },
] as const;

export default function OurCertification({
  alt = "Sertifikasi Resmi Dreamlab - BPOM RI, CPKB Grade A, Halal Indonesia, Terdaftar HKI",
}: OurCertificationProps) {
  return (
    <section
      aria-label={alt}
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#F4F8FD] via-[#EDF4FC] to-[#F8FAFC] py-14 sm:py-16 lg:py-20 border-b border-slate-100 select-none"
    >
      {/* Soft ambient glass highlights */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[780px] h-[320px] rounded-full bg-white/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -left-10 w-56 h-24 rounded-full bg-[#F39200]/10 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-10 w-56 h-24 rounded-full bg-[#F39200]/10 blur-2xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, amount: 0.2 }}
        className="container-custom relative z-10"
      >
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-white/85 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0A2558] shadow-xs mb-3">
            <ShieldCheck className="h-3.5 w-3.5 text-[#F39200]" />
            <span>Sertifikasi &amp; Legalitas Resmi</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#0A2558] leading-tight">
            Our Certifications
          </h2>

          {/* Signature orange curved swoosh */}
          <div className="mx-auto mt-1.5 flex justify-center">
            <svg
              width="170"
              height="10"
              viewBox="0 0 170 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 7.5C46 2 118 1.5 168 6.5"
                stroke="url(#certSwoosh)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="certSwoosh" x1="2" y1="5" x2="168" y2="5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F39200" />
                  <stop offset="1" stopColor="#FBB03B" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Dreamlab memiliki sertifikasi yang diakui{' '}
            <strong className="font-bold text-[#0A2558]">secara nasional dan internasional.</strong>
          </p>
        </div>

        {/* Sleek Glassmorphic Pedestal Pill Bar */}
        <div className="mx-auto mt-8 sm:mt-10 max-w-4xl">
          <div className="relative rounded-3xl md:rounded-full border border-white bg-white/95 px-5 py-6 sm:px-8 sm:py-5 shadow-[0_18px_48px_rgba(10,37,88,0.08)] backdrop-blur-md">
            <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-y-6 gap-x-4 md:gap-0 md:divide-x md:divide-slate-200/80">
              {CERTIFICATIONS.map((cert) => (
                <div
                  key={cert.id}
                  className="group flex flex-col items-center justify-center px-3 text-center transition-transform duration-200 ease-out hover:-translate-y-0.5"
                >
                  <div className="flex h-14 sm:h-16 items-center justify-center">
                    <Image
                      src={cert.src}
                      alt={cert.name}
                      width={cert.width}
                      height={cert.height}
                      className={`${cert.imgClass} transition-transform duration-200 ease-out group-hover:scale-105`}
                    />
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-extrabold text-[#0A2558] leading-tight">
                      {cert.name}
                    </div>
                    <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                      {cert.subtitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subtle Pedestal Reflection */}
          <div
            aria-hidden="true"
            className="mx-auto mt-2 h-2.5 w-[86%] rounded-full bg-gradient-to-r from-transparent via-slate-300/45 to-transparent blur-xs"
          />
        </div>
      </motion.div>
    </section>
  );
}
