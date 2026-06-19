"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";

import { CategoryTab } from "@/types";

interface ProductDetailTabsProps {
  categories: CategoryTab[];
}

export default function ProductDetailTabs({ categories }: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState(categories[0]?.id);
  const activeCategory = categories.find((c) => c.id === activeTab);
  const activeProduct = activeCategory?.products[0];

  const scrollTabs = (direction: "left" | "right") => {
    const container = document.getElementById("sub-cat-nav");
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-8 bg-brand-white">
      <div className="container-custom">
        {/* Navigation Arrows */}
        <div className="flex justify-center gap-2 mb-6">
          <button 
            onClick={() => scrollTabs("left")}
            className="w-10 h-10 flex items-center justify-center bg-[#F3F3F3] rounded-lg hover:bg-[#E8E8E8] transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-brand-black/60" />
          </button>
          <button 
            onClick={() => scrollTabs("right")}
            className="w-10 h-10 flex items-center justify-center bg-[#F3F3F3] rounded-lg hover:bg-[#E8E8E8] transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-brand-black/60" />
          </button>
        </div>

        {/* Sub-category Navbar (Tabs) */}
        <div id="sub-cat-nav" className="flex overflow-x-auto no-scrollbar gap-3 mb-8 pb-4 scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`relative px-6 py-4 whitespace-nowrap text-[15px] font-medium transition-all duration-300 rounded-lg
                ${activeTab === cat.id 
                  ? "text-brand-orange" 
                  : "bg-[#F3F3F3] text-brand-black/60 hover:bg-[#E8E8E8]"}`}
            >
              {cat.label}
              {activeTab === cat.id && (
                <motion.div
                  layoutId="activeSubTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-orange"
                />
              )}
            </button>
          ))}
        </div>

        {/* Product Detail Content */}
        <AnimatePresence mode="wait">
          {activeProduct ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {/* Left: Product Image */}
              <div className="relative aspect-square max-h-[350px] rounded-2xl overflow-hidden bg-[#F9F9F9] shadow-sm mx-auto lg:mx-0">
                <Image
                  src={activeProduct.image}
                  alt={getImageAlt(activeProduct.image, activeProduct.name)}
                  title={getImageTitle(activeProduct.image)}
                  fill
                  className="object-contain p-6"
                />
              </div>

              {/* Right: Product Text Content */}
              <div className="flex flex-col">
                <h2 className="text-brand-orange mb-4 text-[28px] md:text-[36px] leading-tight normal-case font-display">
                  {activeProduct.name}
                </h2>
                
                <p className="text-brand-black/70 mb-6 text-[16px] leading-relaxed">
                  {activeProduct.description}
                </p>

                {activeProduct.subDescription && (
                  <p className="text-brand-black/70 mb-6 text-[15px] leading-relaxed">
                    {activeProduct.subDescription}
                  </p>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/thankyou/google/"
                    className="flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-xl font-onest font-black uppercase tracking-wider text-[11px] hover:bg-brand-black transition-all shadow-lg group"
                  >
                    HUBUNGI TIM KAMI
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <Link 
                    href="/contact-us" 
                    className="flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-xl font-onest font-black uppercase tracking-wider text-[11px] hover:bg-brand-black transition-all shadow-lg group"
                  >
                    JADWALKAN PERTEMUAN
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="min-h-[400px] flex items-center justify-center text-brand-black/30 italic">
              Coming Soon
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
