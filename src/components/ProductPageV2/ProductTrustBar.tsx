"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Layers, Palette, Megaphone } from "lucide-react";

export interface USPItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ProductTrustBarProps {
  usps?: USPItem[];
}

export default function ProductTrustBar({ usps }: ProductTrustBarProps) {
  // Data USP Dreamlab default yang world-class
  const defaultUSPs: USPItem[] = [
    {
      icon: <Award className="w-7 h-7 text-[#F39200] stroke-[1.5]" />,
      title: "Juaranya Formula",
      description: "Formulasi kustom eksklusif dari tim RnD ahli",
    },
    {
      icon: <Layers className="w-7 h-7 text-[#F39200] stroke-[1.5]" />,
      title: "MOQ Fleksibel",
      description: "Skala produksi ramah bagi pemula & scale-up",
    },
    {
      icon: <Palette className="w-7 h-7 text-[#F39200] stroke-[1.5]" />,
      title: "Free Desain Kemasan",
      description: "Desain logo & kemasan eksklusif serta siap cetak",
    },
    {
      icon: <Megaphone className="w-7 h-7 text-[#F39200] stroke-[1.5]" />,
      title: "Free Marketing Support",
      description: "Pendampingan branding & media sosial komprehensif",
    },
  ];

  const items = usps || defaultUSPs;

  return (
    <section className="relative z-30 bg-transparent -mt-12 md:-mt-16 lg:-mt-20 overflow-visible py-4">
      <div className="container-custom max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "50px" }}
          className="bg-gradient-to-r from-white to-[#FAF9F6] text-gray-900 rounded-3xl p-6 md:p-8 lg:px-10 lg:py-8 shadow-xl shadow-[#F39200]/5 border border-gray-100 hover:border-[#F39200]/20 transition-all duration-500"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-4 items-stretch">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -3 }}
                className="flex items-center gap-4 group cursor-default"
              >
                {/* Icon Container with elegant scale and bg color transition */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#F39200]/5 group-hover:bg-[#F39200]/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm border border-[#F39200]/10">
                  {item.icon}
                </div>

                {/* Text Content */}
                <div className="space-y-0.5">
                  <h3 className="text-xs md:text-sm font-extrabold text-gray-900 tracking-wide font-onest group-hover:text-[#F39200] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed font-sans font-semibold">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
