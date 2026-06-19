"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";
import { openWARoundRobin } from "@/lib/wa-roundrobin";

import { CategoryTab } from "@/types";

interface DecorativeTabsProps {
  categories: CategoryTab[];
}

export default function DecorativeProductDetailTabs({ categories }: DecorativeTabsProps) {
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
    <section className="py-6 bg-white overflow-hidden">
      <div className="container-custom">

        {/* 1. LEVEL 1: PRIMARY CATEGORIES (MAKEUP | LIPCARE) - AT THE TOP */}
        <div className="flex flex-col items-center mb-6">
          {/* Navigation Arrows - Centered like Image 2 */}
          <div className="flex justify-center gap-2 mb-3">
            <button
              onClick={() => scrollContainer("main-cat-nav", "left")}
              className="w-10 h-10 flex items-center justify-center bg-[#F3F3F3] rounded-lg hover:bg-[#E8E8E8] transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-brand-black/60" />
            </button>
            <button
              onClick={() => scrollContainer("main-cat-nav", "right")}
              className="w-10 h-10 flex items-center justify-center bg-[#F3F3F3] rounded-lg hover:bg-[#E8E8E8] transition-all"
            >
              <ChevronRight className="w-5 h-5 text-brand-black/60" />
            </button>
          </div>

          <div id="main-cat-nav" className="flex overflow-x-auto no-scrollbar gap-3 pb-4 px-2 scroll-smooth">
            {categories.map((group) => (
              <button
                key={group.id}
                onClick={() => setActiveGroupId(group.id)}
                className={`relative px-10 py-4 whitespace-nowrap text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 font-onest rounded-lg
                  ${activeGroupId === group.id
                    ? "text-brand-orange"
                    : "bg-[#F3F3F3] text-brand-black/40 hover:text-brand-black"}`}
              >
                {group.label}
                {activeGroupId === group.id && (
                  <motion.div
                    layoutId="activeGroupTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-orange"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 2. PRODUCT CONTENT (IMAGE + DESCRIPTION) - IN THE MIDDLE */}
        <div className="min-h-[400px] mb-6 bg-gray-50/30 rounded-[2.5rem] p-6 md:p-10 border border-gray-100">
          <AnimatePresence mode="wait">
            {activeProduct ? (
              <motion.div
                key={`${activeGroupId}-${activeProductIdx}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
              >
                {/* Left: Product Image */}
                <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-white border border-gray-100 shadow-xl group max-h-[350px] mx-auto lg:mx-0">
                  <Image
                    src={activeProduct.image}
                    alt={getImageAlt(activeProduct.image, activeProduct.name)}
                    title={getImageTitle(activeProduct.image)}
                    fill
                    className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Right: Product Text */}
                <div className="flex flex-col">
                  <div className="inline-block px-3 py-0.5 bg-brand-orange/10 rounded-full mb-3 w-fit">
                    <span className="text-[9px] font-black text-brand-orange uppercase tracking-[0.3em] font-onest">
                      {activeGroup?.label} Collection
                    </span>
                  </div>

                  <h2 className="text-brand-orange mb-3 text-[32px] md:text-[42px] leading-tight font-display font-black uppercase">
                    {activeProduct.name}
                  </h2>

                  <div className="space-y-4 max-w-xl">
                    <p className="text-brand-black font-bold text-[16px] mb-1 font-onest">
                      Hi, Dreampreneur!
                    </p>
                    <p className="text-brand-black/80 text-[14px] md:text-[15px] leading-[1.6]">
                      {activeProduct.description}
                    </p>
                    {activeProduct.subDescription && (
                      <p className="text-brand-black/70 text-[13px] leading-[1.6]">
                        {activeProduct.subDescription}
                      </p>
                    )}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-3 mt-6">
                    <button
                      onClick={() => openWARoundRobin("Halo Dreamlab, saya tertarik dengan produk kosmetik dekoratif. Mohon info lebih lanjut.")}
                      className="flex items-center justify-between gap-4 bg-brand-orange text-white px-6 py-3 rounded-xl font-onest font-black uppercase tracking-wider text-[11px] hover:bg-brand-black transition-all shadow-lg shadow-brand-orange/20 group min-w-[200px]"
                    >
                      HUBUNGI TIM KAMI
                      <div className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </button>
                    <Link
                      href="https://calendar.google.com/"
                      className="flex items-center justify-between gap-4 bg-brand-blue text-white px-6 py-3 rounded-xl font-onest font-black uppercase tracking-wider text-[11px] hover:bg-brand-black transition-all shadow-lg shadow-brand-blue/20 group min-w-[200px]"
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

        {/* 3. LEVEL 2: PRODUCT LIST (CLEAN STYLE) - AT THE BOTTOM */}
        <div className="relative pt-6 border-t border-gray-100">
          {/* Navigation Arrows - Centered like Image 2 */}
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => scrollContainer(`prod-nav-${activeGroupId}`, "left")}
              className="w-10 h-10 flex items-center justify-center bg-[#F3F3F3] rounded-lg hover:bg-[#E8E8E8] transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-brand-black/60" />
            </button>
            <button
              onClick={() => scrollContainer(`prod-nav-${activeGroupId}`, "right")}
              className="w-10 h-10 flex items-center justify-center bg-[#F3F3F3] rounded-lg hover:bg-[#E8E8E8] transition-all"
            >
              <ChevronRight className="w-5 h-5 text-brand-black/60" />
            </button>
          </div>

          <div
            id={`prod-nav-${activeGroupId}`}
            className="flex overflow-x-auto no-scrollbar gap-3 pb-4 px-2 scroll-smooth"
          >
            {activeGroup?.products.map((prod, idx) => (
              <button
                key={idx}
                onClick={() => setActiveProductIdx(idx)}
                className={`relative px-6 py-4 whitespace-nowrap text-[15px] font-medium transition-all duration-300 rounded-lg
                  ${activeProductIdx === idx
                    ? "text-brand-orange"
                    : "bg-[#F3F3F3] text-brand-black/60 hover:bg-[#E8E8E8]"}`}
              >
                {prod.name}
                {activeProductIdx === idx && (
                  <motion.div
                    layoutId="activeProductIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-orange"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
