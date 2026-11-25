"use client";

import Image from "next/image";
import { CheckCircle2, Sparkles } from "lucide-react";

interface OurCertificationProps {
  alt?: string;
  title?: string;
}

const CERTIFICATIONS = [
  {
    id: "bpom",
    name: "Badan POM RI",
    badge: "Izin Edar Resmi",
    description:
      "Registrasi notifikasi BPOM resmi untuk keamanan & legalitas produk.",
    src: "/assets/images/BPOM.webp",
    width: 120,
    height: 110,
  },
  {
    id: "cpkb",
    name: "CPKB Grade A",
    badge: "Standar Tertinggi",
    description:
      "Fasilitas produksi higienis berstandar Cara Pembuatan Kosmetik yang Baik.",
    src: "/images/certifications/cpkb.png",
    width: 110,
    height: 110,
  },
  {
    id: "halal",
    name: "Halal Indonesia",
    badge: "Tersertifikasi Halal",
    description:
      "Jaminan bahan baku dan proses produksi sesuai standar halal resmi.",
    src: "/images/certifications/halal.png",
    width: 110,
    height: 110,
  },
  {
    id: "hki",
    name: "Terdaftar HKI",
    badge: "Perlindungan Merek",
    description:
      "Dukungan legalitas hak kekayaan intelektual untuk keamanan brand Anda.",
    src: "/images/certifications/hki.png",
    width: 150,
    height: 54,
  },
] as const;

export default function OurCertification({
  alt = "Sertifikasi Resmi Dreamlab - BPOM RI, CPKB Grade A, Halal Indonesia, Terdaftar HKI",
}: OurCertificationProps) {
  return (
    <section
      aria-label={alt}
      className="relative w-full overflow-hidden bg-white py-[64px] sm:py-[104px]"
    >
      <div className="mx-auto max-w-[1240px] px-[16px] sm:px-[40px]">
        <div className="text-center max-w-[680px] mx-auto mb-[32px] sm:mb-[48px]">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C86400] mb-[12px]">
            Sertifikasi &amp; Legalitas Resmi
          </span>
          <h2 className="font-display font-normal text-[clamp(28px,3.2vw,40px)] leading-[1.12] tracking-[-0.01em] text-[#212120]">
            Our Certifications
          </h2>
          <p className="mt-[14px] text-[15px] sm:text-[16px] leading-[1.6] text-[#6B6762]">
            Dreamlab memiliki sertifikasi yang diakui{" "}
            <strong className="font-semibold text-[#212120]">
              secara nasional dan internasional
            </strong>{" "}
            untuk menjamin kualitas, keamanan, dan legalitas setiap produk brand
            Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {CERTIFICATIONS.map((cert) => (
            <div
              key={cert.id}
              className="group flex flex-col items-center rounded-[18px] bg-white p-6 text-center shadow-[0_6px_18px_-10px_rgba(60,35,10,0.18)] hover:shadow-[0_2px_4px_rgba(60,35,10,0.04),0_18px_40px_-14px_rgba(60,35,10,0.18)] hover:-translate-y-1 transition-all duration-300 border border-[rgba(33,33,32,0.06)] motion-reduce:transition-none motion-reduce:hover:transform-none"
            >
              <div className="flex h-20 w-full items-center justify-center rounded-[14px] bg-[#FAF8F5] px-4">
                <Image
                  src={cert.src}
                  alt={cert.name}
                  width={cert.width}
                  height={cert.height}
                  loading="lazy"
                  className="h-[48px] w-auto object-contain"
                />
              </div>

              <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-[#FFF3E2] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#C86400]">
                <CheckCircle2 className="h-3 w-3 text-[#F39200]" />
                {cert.badge}
              </span>

              <h3 className="mt-2.5 font-display text-[17px] font-normal text-[#212120] leading-snug">
                {cert.name}
              </h3>
              <p className="mt-1.5 text-[13.5px] text-[#6B6762] leading-relaxed">
                {cert.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#6B6762]">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#F39200]" />
            Standar Mutu Nasional &amp; Internasional
          </span>
          <span className="hidden sm:inline text-[#9A958F]">•</span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#F39200]" />
            Pendampingan Legalitas 100% Terima Beres
          </span>
        </div>
      </div>
    </section>
  );
}
