"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";

interface ProductDetail {
  name: string;
  image: string;
  description: string;
  subDescription?: string;
}

interface CategoryTab {
  id: string;
  label: string;
  tabImage?: string;
  products: ProductDetail[];
}

interface BodyCareProductDetailTabsProps {
  categories: CategoryTab[];
}

export default function BodyCareProductDetailTabs({ categories }: BodyCareProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState(categories[0]?.id);
  const activeCategory = categories.find((c) => c.id === activeTab);
  const activeProduct = activeCategory?.products[0];

  const scrollTabs = (direction: "left" | "right") => {
    const container = document.getElementById("body-cat-nav");
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        {/* Sub-category Navigation (Top Section) */}
        <div className="relative mb-20 pb-16 border-b border-gray-100">
          <div className="flex items-center justify-between mb-8 md:hidden">
            <button onClick={() => scrollTabs("left")} className="p-2 bg-gray-100 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Geser untuk lainnya</span>
            <button onClick={() => scrollTabs("right")} className="p-2 bg-gray-100 rounded-full"><ChevronRight className="w-5 h-5" /></button>
          </div>

          <div 
            id="body-cat-nav" 
            className="flex overflow-x-auto no-scrollbar gap-8 md:gap-12 pb-4 px-8 scroll-smooth"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`group flex flex-col items-center gap-6 min-w-[140px] transition-all duration-500 flex-shrink-0 scroll-snap-align-center
                  ${activeTab === cat.id ? "scale-110" : "opacity-40 hover:opacity-100 hover:scale-105"}`}
              >
                <div className={`relative w-24 h-24 md:w-28 md:h-28 rounded-[2rem] flex items-center justify-center transition-all duration-500
                  ${activeTab === cat.id 
                    ? "bg-white border-2 border-brand-orange shadow-[0_20px_50px_rgba(246,145,30,0.15)]" 
                    : "bg-gray-50/50 border border-gray-100"}`}
                >
                  <div className="relative w-16 h-16 md:w-20 md:h-20">
                    <Image
                      src={cat.tabImage || cat.products[0]?.image || "/assets/images/placeholder.webp"}
                      alt={getImageAlt(cat.tabImage || cat.products[0]?.image, cat.label)}
                      title={getImageTitle(cat.tabImage || cat.products[0]?.image)}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className={`text-[12px] md:text-[13px] font-black uppercase tracking-[0.15em] text-center leading-tight max-w-[140px] transition-colors
                    ${activeTab === cat.id ? "text-brand-orange" : "text-brand-black"}`}
                  >
                    {cat.label}
                  </span>
                  {activeTab === cat.id && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="w-12 h-1.5 bg-brand-orange rounded-full mt-1" 
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Product Detail Content (Bottom Section) */}
        <div>
          <AnimatePresence mode="wait">
            {activeProduct ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
              >
                {/* Left: Product Image */}
                <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-[#F9F9F9] shadow-sm border border-gray-100">
                  <Image
                    src={activeProduct.image}
                    alt={getImageAlt(activeProduct.image, activeProduct.name)}
                    title={getImageTitle(activeProduct.image)}
                    fill
                    className="object-contain p-12"
                    priority
                  />
                </div>

                {/* Right: Product Text Content */}
                <div className="flex flex-col">
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-brand-orange mb-8 text-[36px] md:text-[48px] leading-tight normal-case font-display font-bold"
                  >
                    {activeProduct.name}
                  </motion.h2>
                  
                  <div className="space-y-6">
                    <p className="text-brand-black/80 text-[16px] leading-[1.8] font-sans">
                      {activeProduct.description}
                    </p>

                    {activeProduct.subDescription && (
                      <p className="text-brand-black/70 text-[16px] leading-[1.8] font-sans italic">
                        {activeProduct.subDescription}
                      </p>
                    )}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-4 mt-12">
                    <Link
                      href="/thankyou/google/"
                      className="flex items-center gap-3 bg-brand-orange text-white px-10 py-5 rounded-xl font-onest font-black uppercase tracking-wider text-[13px] hover:bg-brand-black transition-all shadow-xl shadow-brand-orange/20 group"
                    >
                      HUBUNGI TIM KAMI
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    
                    <Link 
                      href="/contact-us" 
                      className="flex items-center gap-3 bg-brand-orange text-white px-10 py-5 rounded-xl font-onest font-black uppercase tracking-wider text-[13px] hover:bg-brand-black transition-all shadow-xl shadow-brand-orange/20 group"
                    >
                      JADWALKAN PERTEMUAN
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="min-h-[400px] flex items-center justify-center text-brand-black/30 italic">
                Content coming soon...
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

