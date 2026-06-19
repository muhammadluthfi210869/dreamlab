"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";

import { CategoryTab } from "@/types";

interface HaircareTabsProps {
  categories: CategoryTab[];
}

export default function HaircareProductDetailTabs({ categories }: HaircareTabsProps) {
  const [activeGroupId, setActiveGroupId] = useState(categories[0]?.id);
  const [activeProductIdx, setActiveProductIdx] = useState(0);

  // Reset product index when group changes - handled during render to avoid cascading renders
  const [prevGroupId, setPrevGroupId] = useState(activeGroupId);
  if (activeGroupId !== prevGroupId) {
    setPrevGroupId(activeGroupId);
    setActiveProductIdx(0);
  }

  const activeGroup = categories.find(g => g.id === activeGroupId);
  const activeProduct = activeGroup?.products[activeProductIdx];

  const scrollContainer = (id: string, direction: "left" | "right") => {
    const container = document.getElementById(id);
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-8 bg-white overflow-hidden">
      <div className="container-custom">

        {/* 1. CATEGORY ICON SELECTOR (At the top, replacing text buttons with icons) */}
        <div className="relative mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.3em] font-onest">
                Haircare Categories
              </span>
              <h3 className="text-[20px] font-black text-brand-black uppercase font-onest">
                Select Your Product Type
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollContainer("hair-cat-nav", "left")}
                className="w-10 h-10 flex items-center justify-center bg-[#F3F3F3] rounded-lg hover:bg-brand-orange hover:text-white transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollContainer("hair-cat-nav", "right")}
                className="w-10 h-10 flex items-center justify-center bg-[#F3F3F3] rounded-lg hover:bg-brand-orange hover:text-white transition-all shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            id="hair-cat-nav"
            className="flex overflow-x-auto no-scrollbar gap-6 pb-4 px-2 scroll-smooth"
          >
            {categories.map((group) => (
              <button
                key={group.id}
                onClick={() => setActiveGroupId(group.id)}
                className="flex flex-col items-center gap-4 min-w-[120px] group"
              >
                <div className={`relative w-20 h-20 rounded-full overflow-hidden transition-all duration-300 border-4 
                  ${activeGroupId === group.id 
                    ? "border-brand-orange scale-110 shadow-lg shadow-brand-orange/20" 
                    : "border-gray-100 grayscale hover:grayscale-0 hover:border-brand-orange/50"}`}
                >
                  <Image
                    src={group.tabImage || group.products[0].image}
                    alt={getImageAlt(group.tabImage || group.products[0].image, group.label)}
                    title={getImageTitle(group.tabImage || group.products[0].image)}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className={`text-[12px] font-black uppercase tracking-wider text-center font-onest transition-colors
                  ${activeGroupId === group.id ? "text-brand-orange" : "text-brand-black/40 group-hover:text-brand-black"}`}
                >
                  {group.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. PRODUCT CONTENT (IMAGE + DESCRIPTION) */}
        <div className="min-h-[400px] mb-8 bg-[#F9F9F9] rounded-[2.5rem] p-6 md:p-10 border border-gray-100">
          <AnimatePresence mode="wait">
            {activeProduct ? (
              <motion.div
                key={`${activeGroupId}-${activeProductIdx}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
              >
                {/* Left: Product Image */}
                <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-white border border-gray-100 shadow-xl max-h-[350px] mx-auto lg:mx-0">
                  <Image
                    src={activeProduct.image}
                    alt={getImageAlt(activeProduct.image, activeProduct.name)}
                    title={getImageTitle(activeProduct.image)}
                    fill
                    className="object-contain p-6"
                  />
                </div>

                {/* Right: Product Text */}
                <div className="flex flex-col">
                  <div className="inline-block px-4 py-1 bg-brand-orange/10 rounded-full mb-6 w-fit">
                    <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.3em] font-onest">
                      Dreamlab Haircare
                    </span>
                  </div>

                  <h2 className="text-brand-orange mb-3 text-[32px] md:text-[42px] leading-tight font-display font-black uppercase">
                    {activeProduct.name}
                  </h2>

                  <div className="space-y-6 max-w-xl">
                    <p className="text-brand-black font-bold text-[18px] mb-2 font-onest">
                      Hi, Dreampreneur!
                    </p>
                    <p className="text-brand-black/80 text-[16px] md:text-[17px] leading-[1.8]">
                      {activeProduct.description}
                    </p>
                    {activeProduct.subDescription && (
                      <p className="text-brand-black/70 text-[15px] leading-[1.8]">
                        {activeProduct.subDescription}
                      </p>
                    )}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-4 mt-10">
                    <Link
                      href="/thankyou/google/"
                      className="flex items-center justify-between gap-4 bg-brand-orange text-white px-8 py-4 rounded-xl font-onest font-black uppercase tracking-wider text-[12px] hover:bg-brand-black transition-all shadow-lg shadow-brand-orange/20 group min-w-[240px]"
                    >
                      HUBUNGI TIM KAMI
                      <div className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                    <Link
                      href="https://calendar.google.com/"
                      className="flex items-center justify-between gap-4 bg-brand-blue text-white px-8 py-4 rounded-xl font-onest font-black uppercase tracking-wider text-[12px] hover:bg-brand-black transition-all shadow-lg shadow-brand-blue/20 group min-w-[240px]"
                    >
                      JADWALKAN PERTEMUAN
                      <div className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
