"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";

interface ProductItem {
  name: string;
  image: string;
}

interface CategoryTab {
  id: string;
  label: string;
  icon?: string;
  products: ProductItem[];
}

interface ProductTabsProps {
  categories: CategoryTab[];
}

export default function ProductTabs({ categories }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState(categories[0]?.id);

  return (
    <section className="py-24 bg-brand-white">
      <div className="container-custom">
        {/* Tab Headers */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 border-b border-gray-100 pb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`relative px-8 py-4 text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 font-onest flex items-center gap-3
                ${activeTab === cat.id ? 'text-brand-orange scale-110' : 'text-brand-black/40 hover:text-brand-black hover:scale-105'}`}
            >
              {cat.icon && (
                <span className={`w-6 h-6 flex items-center justify-center ${activeTab === cat.id ? 'opacity-100' : 'opacity-40'}`}>
                  {/* Icon logic would go here - for now using a placeholder or SVG if available */}
                  <div className="w-2 h-2 rounded-full bg-current" />
                </span>
              )}
              {cat.label}
              {activeTab === cat.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-[-8px] left-0 right-0 h-1 bg-brand-orange rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              {categories.find(c => c.id === activeTab)?.products.map((product, idx) => (
                <motion.div 
                  key={`${activeTab}-${idx}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-100 hover:border-brand-orange/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(246,145,30,0.1)] text-center overflow-hidden"
                >
                  <div className="aspect-square relative mb-8 overflow-hidden rounded-3xl bg-gray-50/50">
                    <Image
                      src={product.image}
                      alt={getImageAlt(product.image, product.name)}
                      title={getImageTitle(product.image)}
                      fill
                      className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-brand-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <h3 className="font-onest font-black text-brand-black uppercase tracking-wider text-[12px] md:text-[14px] leading-tight group-hover:text-brand-orange transition-colors duration-300">
                    {product.name}
                  </h3>
                  
                  {/* Decorative dot */}
                  <div className="mt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
