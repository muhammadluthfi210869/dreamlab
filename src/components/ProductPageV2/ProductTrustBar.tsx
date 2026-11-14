"use client";

import React from "react";
import { Award, FlaskConical, Layers, Palette, Megaphone } from "lucide-react";

export interface USPItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ProductTrustBarProps {
  usps?: USPItem[];
  items?: { title: string; description: string }[];
}

export default function ProductTrustBar({ usps, items: textItems }: ProductTrustBarProps) {
  const defaultUSPs: USPItem[] = [
    {
      icon: <Award className="w-8 h-8 md:w-9 md:h-9 text-[#FFF8F0] stroke-[1.35]" />,
      title: "Juaranya Formula",
      description: "Formulasi kustom eksklusif dari tim RnD ahli",
    },
    {
      icon: <FlaskConical className="w-8 h-8 md:w-9 md:h-9 text-[#FFF8F0] stroke-[1.35]" />,
      title: "1 Client, 1 Formula",
      description: "Formula dikembangkan sesuai kebutuhan dan karakter setiap brand.",
    },
    {
      icon: <Layers className="w-8 h-8 md:w-9 md:h-9 text-[#FFF8F0] stroke-[1.35]" />,
      title: "MOQ Fleksibel",
      description: "Skala produksi ramah bagi pemula & scale-up",
    },
    {
      icon: <Palette className="w-8 h-8 md:w-9 md:h-9 text-[#FFF8F0] stroke-[1.35]" />,
      title: "Free Desain Kemasan",
      description: "Desain logo & kemasan eksklusif serta siap cetak",
    },
    {
      icon: <Megaphone className="w-8 h-8 md:w-9 md:h-9 text-[#FFF8F0] stroke-[1.35]" />,
      title: "Free Marketing Support",
      description: "Pendampingan branding & media sosial komprehensif",
    },
  ];

  const items =
    usps ||
    (textItems
      ? defaultUSPs.map((usp, index) => ({
          ...usp,
          title: textItems[index]?.title || usp.title,
          description: textItems[index]?.description || usp.description,
        }))
      : defaultUSPs);

  // Duplicate items for seamless infinite left-moving marquee
  const marqueeTrack = [...items, ...items];

  return (
    <section
      aria-label="Keunggulan Dreamlab"
      className="relative z-30 w-full overflow-hidden bg-gradient-to-r from-[#C86400] via-[#DF7800] to-[#C86400] border-y border-white/15 py-5 md:py-6"
    >
      <div className="trustbar-marquee-track flex w-max items-center">
        {marqueeTrack.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="flex items-center shrink-0"
          >
            <div className="flex items-center gap-4 md:gap-5 px-6 md:px-9">
              <div className="shrink-0 flex items-center justify-center">
                {item.icon}
              </div>
              <div className="space-y-1 text-left">
                <h3 className="text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] text-white font-onest leading-tight">
                  {item.title}
                </h3>
                <p className="text-[11px] md:text-xs text-[#FFF5E8]/90 leading-[1.4] font-sans max-w-[220px] md:max-w-[240px]">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Vertical Divider matching screenshot */}
            <div
              aria-hidden="true"
              className="h-10 md:h-12 w-px bg-white/30 shrink-0"
            />
          </div>
        ))}
      </div>

      <style>{`
        .trustbar-marquee-track {
          animation: trustbarSlideLeft 28s linear infinite;
          will-change: transform;
        }
        @keyframes trustbarSlideLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>
    </section>
  );
}
