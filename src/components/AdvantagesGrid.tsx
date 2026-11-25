"use client";

import type { ReactNode } from "react";
import {
  Sparkles,
  FlaskConical,
  Lightbulb,
  Sliders,
  Coins,
  Palette,
  Target,
  TrendingUp,
} from "lucide-react";

interface AdvantagesProps {
  title: string;
  items?: { title: string; desc: string; icon: string }[];
  hideCertification?: boolean;
  content?: {
    eyebrow: string;
    title: ReactNode;
    description: string;
    points: { index: string; title: string; desc: string }[];
  };
}

const bentoPoints = [
  {
    index: "01",
    title: "Formula Eksklusif",
    desc: "1 klien 1 formula. Wujudkan formula impian dan jadilah berbeda.",
    icon: Sparkles,
  },
  {
    index: "02",
    title: "Formulasi Produk",
    desc: "Tim R&D Muda yang sangat inovatif.",
    icon: FlaskConical,
  },
  {
    index: "03",
    title: "Inovatif",
    desc: "Formulasi produk RnD muda yang sangat inovatif.",
    icon: Lightbulb,
  },
  {
    index: "04",
    title: "MOQ Menyesuaikan",
    desc: "Menyesuaikan MOQ sesuai kebutuhan klien.",
    icon: Sliders,
  },
  {
    index: "05",
    title: "Harga",
    desc: "Harga HPP yang bisa menyesuaikan.",
    icon: Coins,
  },
  {
    index: "06",
    title: "Kreatif",
    desc: "Team design creative yang siap memvisualisasikan brand anda.",
    icon: Palette,
  },
  {
    index: "07",
    title: "Branding",
    desc: "Membangun identitas yang kuat sehingga brand mudah dikenali dalam proses pemasaran.",
    icon: Target,
  },
  {
    index: "08",
    title: "Digital Marketing",
    desc: "Tim digital marketing siap menjangkau target audience brand jauh lebih efektif dan efisien.",
    icon: TrendingUp,
  },
];

export default function AdvantagesGrid({ content }: AdvantagesProps) {
  const points = content?.points
    ? content.points.map((point, idx) => ({
        ...point,
        icon: bentoPoints[idx]?.icon || Sparkles,
      }))
    : bentoPoints;

  return (
    <section className="py-[64px] sm:py-[104px] bg-[#FAF8F5]">
      <div className="mx-auto max-w-[1240px] px-[16px] sm:px-[40px]">
        <div className="text-center max-w-[680px] mx-auto mb-[32px] sm:mb-[48px]">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C86400] mb-[12px]">
            {content?.eyebrow || "Dreamlab Advantages"}
          </span>
          <h2 className="font-display font-normal text-[clamp(28px,3.2vw,40px)] leading-[1.12] tracking-[-0.01em] text-[#212120] uppercase">
            {content?.title || (
              <>
                8 Keuntungan{" "}
                <span className="text-[#F39200]">Maklon di Dreamlab</span>
              </>
            )}
          </h2>
          <p className="mt-[14px] text-[15px] sm:text-[16px] leading-[1.6] text-[#6B6762]">
            {content?.description ||
              "Komitmen Dreamlab untuk menghadirkan solusi manufaktur kosmetik hulu ke hilir yang komprehensif, eksklusif, dan berkualitas dunia."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {points.map((point) => {
            const IconComponent = point.icon || Sparkles;
            return (
              <div
                key={point.index}
                className="bg-white p-6 md:p-7 rounded-[18px] shadow-[0_6px_18px_-10px_rgba(60,35,10,0.18)] hover:shadow-[0_2px_4px_rgba(60,35,10,0.04),0_18px_40px_-14px_rgba(60,35,10,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between motion-reduce:transition-none motion-reduce:hover:transform-none"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="font-display text-2xl md:text-3xl text-[#C86400] leading-none">
                    {point.index}
                  </span>
                  <div className="size-[40px] rounded-full bg-[#FFF3E2] text-[#C86400] flex items-center justify-center">
                    <IconComponent className="size-5 stroke-[1.75]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-base md:text-lg font-normal text-[#212120] mb-2">
                    {point.title}
                  </h3>
                  <p className="text-[13.5px] text-[#6B6762] leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
