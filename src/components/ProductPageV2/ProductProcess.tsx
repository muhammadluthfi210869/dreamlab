"use client";

import React from "react";

interface StepItem {
  id: string;
  title: string;
  description: string;
}

const DEFAULT_STEPS: StepItem[] = [
  {
    id: "01",
    title: "KONSULTASI IDE",
    description: "Konsultasikan ide kosmetik impian anda kepada kami",
  },
  {
    id: "02",
    title: "FORMULASI TEPAT",
    description:
      "Jika anda belum memiliki formulasi, kami siapkan formulasi yang tepat sesuai keinginan anda",
  },
  {
    id: "03",
    title: "PEMBUATAN SAMPLE",
    description: "Pembuatan sample",
  },
  {
    id: "04",
    title: "DISKUSI HASIL",
    description: "Diskusi hasil sample",
  },
  {
    id: "05",
    title: "LEGALITAS & DESAIN",
    description:
      "Pembuatan legalitas dan sertifikat dan mempersiapkan desain kemasan",
  },
  {
    id: "06",
    title: "PRODUKSI",
    description: "Produksi di pabrik bersertifikat CPKB Grade A",
  },
  {
    id: "07",
    title: "MEDIA PROMOSI",
    description: "Persiapkan media promosi",
  },
  {
    id: "08",
    title: "PEMASARAN",
    description: "Pemasaran online atau pemasaran offline",
  },
];

export default function ProductProcess() {
  return (
    <section
      className="py-[64px] sm:py-[104px] overflow-hidden"
      style={{
        background:
          "radial-gradient(70% 60% at 50% 0%, #FFE9CC 0%, rgba(255, 233, 204, 0) 70%), linear-gradient(180deg, #FFF8EF 0%, #FBF4EC 100%)",
      }}
    >
      <div className="mx-auto max-w-[1240px] px-[16px] sm:px-[40px]">
        <div className="text-center max-w-[680px] mx-auto mb-[32px] sm:mb-[48px]">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C86400] mb-[12px]">
            tahapan praktis dan mudah untuk brand kosmetik anda
          </span>
          <h2 className="font-display font-normal text-[clamp(28px,3.2vw,40px)] leading-[1.12] tracking-[-0.01em] text-[#212120] uppercase">
            PROSES MAKLON
          </h2>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px] sm:gap-[16px]">
          {DEFAULT_STEPS.map((step) => (
            <li
              key={step.id}
              className="grid grid-cols-[40px_1fr] sm:block gap-x-[16px] rounded-[18px] bg-[rgba(255,255,255,0.92)] supports-[backdrop-filter]:bg-[rgba(255,255,255,0.82)] backdrop-blur-[10px] border border-[rgba(255,255,255,0.9)] p-[20px] sm:px-[22px] sm:py-[26px] shadow-[0_6px_18px_-10px_rgba(60,35,10,0.18)] hover:shadow-[0_2px_4px_rgba(60,35,10,0.04),0_18px_40px_-14px_rgba(60,35,10,0.18)] hover:-translate-y-1 transition-all duration-300 motion-reduce:transition-none motion-reduce:hover:transform-none"
            >
              <span className="row-span-2 sm:row-span-1 grid place-items-center size-[40px] rounded-full bg-[#FFF3E2] text-[#C86400] font-semibold text-[13px]">
                {step.id}
              </span>
              <h3 className="font-sans !font-semibold sm:mt-[18px] text-[16px] leading-[1.35] text-[#212120]">
                {step.title}
              </h3>
              <p className="mt-[8px] text-[13.5px] leading-[1.6] text-[#6B6762]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
