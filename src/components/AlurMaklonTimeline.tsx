"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  FlaskConical, 
  Beaker, 
  ClipboardCheck, 
  ShieldCheck, 
  Factory, 
  Megaphone, 
  ShoppingBag
} from "lucide-react";

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

const steps: Step[] = [
  {
    id: "01",
    title: "KONSULTASI IDE",
    description: "Konsultasikan ide kosmetik impian anda kepada kami",
    icon: MessageSquare
  },
  {
    id: "02",
    title: "FORMULASI TEPAT",
    description: "Jika anda belum memiliki formulasi, kami siapkan formulasi yang tepat sesuai keinginan anda",
    icon: FlaskConical
  },
  {
    id: "03",
    title: "PEMBUATAN SAMPLE",
    description: "Pembuatan sample",
    icon: Beaker
  },
  {
    id: "04",
    title: "DISKUSI HASIL",
    description: "Diskusi hasil sample",
    icon: ClipboardCheck
  },
  {
    id: "05",
    title: "LEGALITAS & DESAIN",
    description: "Pembuatan legalitas dan sertifikat dan mempersiapkan desain kemasan",
    icon: ShieldCheck
  },
  {
    id: "06",
    title: "PRODUKSI",
    description: "Produksi",
    icon: Factory
  },
  {
    id: "07",
    title: "MEDIA PROMOSI",
    description: "Persiapkan media promosi",
    icon: Megaphone
  },
  {
    id: "08",
    title: "PEMASARAN",
    description: "Pemasaran online atau pemasaran offline",
    icon: ShoppingBag
  }
];

const premiumEase = [0.16, 1, 0.3, 1] as any;

interface AlurMaklonTimelineProps {
  hideHeader?: boolean;
}

export default function AlurMaklonTimeline({ hideHeader = false }: AlurMaklonTimelineProps) {
  return (
    <section className={`relative w-full overflow-hidden ${hideHeader ? "py-8" : "py-16 md:py-24 bg-white"}`}>
      {/* Decorative Soft Background Blurs */}
      {!hideHeader && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[60%] bg-brand-orange/[0.02] blur-[150px] rounded-full pointer-events-none -z-10" />
      )}

      <div className="container-custom relative z-10 w-full mx-auto px-4 md:px-8">
        {/* Section Header */}
        {!hideHeader && (
          <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24 space-y-4">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-brand-orange/5 border border-brand-orange/15 rounded-full">
              <span className="size-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest text-brand-orange uppercase">
                tahapan praktis dan mudah untuk brand kosmetik anda
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-normal text-brand-black leading-tight uppercase">
              PROSES MAKLON
            </h2>
          </div>
        )}

        {/* ── DESKTOP & TABLET HORIZONTAL FLOW ── */}
        <div className="hidden lg:block relative w-full pt-10 pb-20">
          {/* Continuous Horizontal Gradient Timeline Bar */}
          <div className="absolute lg:top-[85px] xl:top-[101px] left-[6%] right-[6%] h-1 bg-brand-orange/20 rounded-full -z-10">
            <div className="w-full h-full bg-brand-orange rounded-full opacity-90" />
          </div>

          <div className="grid grid-cols-8 gap-4 w-full">
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, ease: premiumEase, delay: idx * 0.08 }}
                  className="flex flex-col items-center text-center group relative px-1"
                >
                  {/* Step Circular Node Container */}
                  <div className="relative h-[90px] xl:h-[106px] w-full flex justify-center">
                    {/* Circle Node */}
                    <div className="size-20 xl:size-24 rounded-full bg-white border-4 border-brand-orange/30 group-hover:border-brand-orange flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-105 cursor-pointer relative z-10 overflow-hidden">
                      {/* Inner Colored Gradient Background on Hover */}
                      <div className="absolute inset-0 rounded-full bg-brand-orange opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                      
                      <IconComponent className="size-7 xl:size-9 text-brand-black group-hover:text-white transition-colors duration-500 stroke-[1.2]" />
                    </div>

                    {/* Pointer Triangle */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-brand-orange/30 group-hover:border-t-brand-orange transition-colors duration-500 z-0" />
                  </div>

                  {/* Step Details Below Pointers */}
                  <div className="mt-6 flex flex-col items-center space-y-2">
                    <span className="text-2xl xl:text-3xl font-mono font-bold tracking-tighter text-brand-orange transition-colors">
                      {step.id}
                    </span>
                    <h3 className="text-xs xl:text-sm font-bold font-onest text-brand-black uppercase tracking-tight leading-snug group-hover:text-brand-orange transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-[10px] xl:text-[11px] text-gray-500 leading-relaxed max-w-[130px] font-medium">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── MOBILE & TABLET VERTICAL TIMELINE ── */}
        <div className="lg:hidden relative max-w-md mx-auto pl-10 md:pl-16 py-4">
          {/* Vertical Gradient Timeline Line */}
          <div className="absolute top-0 bottom-0 left-[26px] md:left-[34px] w-1 bg-brand-orange/20 rounded-full -z-10">
            <div className="w-full h-full bg-brand-orange rounded-full opacity-90" />
          </div>

          <div className="flex flex-col gap-10 md:gap-12">
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, ease: premiumEase, delay: idx * 0.05 }}
                  className="relative flex flex-col md:flex-row md:items-center gap-4 group"
                >
                  {/* Step Circle Node Indicator */}
                  <div className="absolute top-0 md:top-1/2 left-[-48px] md:left-[-62px] -translate-y-0 md:-translate-y-1/2 size-12 md:size-16 rounded-full bg-white border-3 border-brand-orange/30 group-hover:border-brand-orange flex items-center justify-center shadow-md transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 rounded-full bg-brand-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                    <IconComponent className="size-5 md:size-7 text-brand-black group-hover:text-white transition-colors duration-300 stroke-[1.2]" />
                  </div>

                  {/* Step Description Content */}
                  <div className="flex flex-col space-y-1 md:space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base md:text-lg font-mono font-bold text-brand-orange">
                        {step.id}
                      </span>
                      <h3 className="text-xs md:text-sm font-bold font-onest text-brand-black uppercase tracking-wider group-hover:text-brand-orange transition-colors">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
