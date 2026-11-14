"use client";

import React from "react";
import {
  MessageSquare,
  FlaskConical,
  Beaker,
  ClipboardCheck,
  ShieldCheck,
  Factory,
  Megaphone,
  ShoppingBag,
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
    icon: MessageSquare,
  },
  {
    id: "02",
    title: "FORMULASI TEPAT",
    description: "Jika anda belum memiliki formulasi, kami siapkan formulasi yang tepat sesuai keinginan anda",
    icon: FlaskConical,
  },
  {
    id: "03",
    title: "PEMBUATAN SAMPLE",
    description: "Pembuatan sample",
    icon: Beaker,
  },
  {
    id: "04",
    title: "DISKUSI HASIL",
    description: "Diskusi hasil sample",
    icon: ClipboardCheck,
  },
  {
    id: "05",
    title: "LEGALITAS & DESAIN",
    description: "Pembuatan legalitas dan sertifikat dan mempersiapkan desain kemasan",
    icon: ShieldCheck,
  },
  {
    id: "06",
    title: "PRODUKSI",
    description: "Produksi di pabrik bersertifikat CPKB Grade A",
    icon: Factory,
  },
  {
    id: "07",
    title: "MEDIA PROMOSI",
    description: "Persiapkan media promosi",
    icon: Megaphone,
  },
  {
    id: "08",
    title: "PEMASARAN",
    description: "Pemasaran online atau pemasaran offline",
    icon: ShoppingBag,
  },
];

interface AlurMaklonTimelineProps {
  hideHeader?: boolean;
  content?: {
    eyebrow: string;
    title: string;
    steps: { id: string; title: string; description: string }[];
  };
}

export default function AlurMaklonTimeline({ hideHeader = false, content }: AlurMaklonTimelineProps) {
  const timelineSteps = content?.steps
    ? content.steps.map((step, index) => ({ ...step, icon: steps[index]?.icon || MessageSquare }))
    : steps;

  return (
    <section className={`relative w-full overflow-hidden ${hideHeader ? "py-6" : "py-16 md:py-24 bg-white"}`}>
      {!hideHeader && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[60%] bg-brand-orange/[0.02] blur-[150px] rounded-full pointer-events-none -z-10" />
      )}

      <div className="container-custom relative z-10 w-full mx-auto px-4 md:px-8">
        {!hideHeader && (
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16 space-y-4">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-brand-orange/5 border border-brand-orange/15 rounded-full">
              <span className="size-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest text-brand-orange uppercase">
                {content?.eyebrow || "tahapan praktis dan mudah untuk brand kosmetik anda"}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-normal text-brand-black leading-tight uppercase">
              {content?.title || "PROSES MAKLON"}
            </h2>
          </div>
        )}

        {/* Single Responsive Timeline Version (No Duplicate DOM Nodes) */}
        <div className="relative w-full py-4">
          {/* Desktop horizontal connector line */}
          <div className="hidden xl:block absolute top-[52px] left-[6%] right-[6%] h-1 bg-brand-orange/25 rounded-full -z-10" />

          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6 xl:gap-4 w-full">
            {timelineSteps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.id}
                  className="flex flex-row min-[480px]:flex-col items-start min-[480px]:items-center text-left min-[480px]:text-center gap-4 min-[480px]:gap-3 group relative bg-white min-[480px]:bg-transparent p-4 min-[480px]:p-2 rounded-2xl border border-gray-100 min-[480px]:border-0 shadow-xs min-[480px]:shadow-none"
                >
                  {/* Step Circular Node */}
                  <div className="relative flex-shrink-0">
                    <div className="size-14 sm:size-16 xl:size-20 rounded-full bg-white border-3 border-brand-orange/30 group-hover:border-brand-orange flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-105 relative z-10 overflow-hidden">
                      <div className="absolute inset-0 rounded-full bg-brand-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                      <IconComponent className="size-6 sm:size-7 xl:size-8 text-brand-black group-hover:text-white transition-colors duration-300 stroke-[1.4]" />
                    </div>
                  </div>

                  {/* Step Details */}
                  <div className="flex flex-col min-[480px]:items-center space-y-1.5">
                    <span className="text-lg xl:text-2xl font-mono font-bold tracking-tighter text-brand-orange">
                      {step.id}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold font-onest text-brand-black uppercase tracking-tight leading-snug group-hover:text-brand-orange transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed max-w-[200px] xl:max-w-[140px] font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
