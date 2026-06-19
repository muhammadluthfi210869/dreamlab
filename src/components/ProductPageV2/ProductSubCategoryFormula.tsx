"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProductSubCategoryFormulaProps {
  categorySlug: string;
  subCategoryName: string;
}

export default function ProductSubCategoryFormula({
  categorySlug,
  subCategoryName,
}: ProductSubCategoryFormulaProps) {
  const waUrl = `/thankyou/google/`;

  const lowercaseName = subCategoryName.toLowerCase();
  
  // Custom copywriting specifically for Day & Night Cream subcategory
  const isDayNightCream = lowercaseName.includes("day") || lowercaseName.includes("night");

  const displayParagraph = isDayNightCream
    ? (
      <p>
        Ingin punya day cream & night cream sendiri? <strong className="text-brand-orange font-extrabold">Dreamlab juaranya formula</strong> adalah pilihannya. 
        Tim Research & Development kami yang expert mengembangkan setiap formula, dan sebagai partner Anda bebas menentukan ingredient, tekstur, serta aroma.
      </p>
    ) : (
      <p>
        Ingin punya {lowercaseName} sendiri? <strong className="text-brand-orange font-extrabold">Dreamlab juaranya formula</strong> adalah pilihannya. 
        Tim Research & Development kami yang expert mengembangkan setiap formula, dan sebagai partner Anda bebas menentukan ingredient, tekstur, serta aroma.
      </p>
    );

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="relative py-10 md:py-14 overflow-hidden bg-white border-b border-gray-100 w-full"
    >
      {/* Decorative ambient highlights */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-12 left-1/4 w-60 h-60 bg-brand-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center space-y-5">
          
          {/* Main bold headline: FORMULA */}
          <h2 className="font-display text-2xl md:text-3.5xl font-black text-brand-orange tracking-[0.2em] uppercase">
            FORMULA
          </h2>

          <div className="h-[2px] w-12 bg-brand-orange/40 rounded-full" />

          {/* Microcopy Block */}
          <div className="space-y-4 text-xs sm:text-sm md:text-base text-gray-500 font-medium leading-relaxed font-onest max-w-3xl">
            {displayParagraph}
            <p className="border-l-4 border-brand-orange pl-6 py-2 italic text-gray-600 bg-brand-orange/5 rounded-r-2xl text-left max-w-2xl mx-auto">
              Di Dreamlab berlaku <strong className="text-gray-900 font-black">1 klien, 1 formula</strong> - eksklusif milik brand Anda.
            </p>
          </div>

          {/* CTA Link */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link
              href={waUrl}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#212120] hover:bg-brand-orange text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-md hover:-translate-y-0.5"
            >
              <span className="uppercase tracking-[0.15em] text-[9px] font-black">Konsultasi Formula</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <span className="text-[11px] text-gray-400 font-medium font-onest">Free Konsultasi dengan RnD Team Kami</span>
          </div>

        </div>
      </div>
    </motion.section>
  );
}
