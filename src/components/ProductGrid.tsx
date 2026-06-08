"use client";

import React from "react";
import Image from "next/image";

export default function ProductGrid() {
  const showcaseProducts = [
    {
      id: "extrait",
      name: "EXTRAIT DE PARFUM",
      uvp: "Konsentrasi Tertinggi untuk target market Luxury & Niche.",
      highlight: "Luxury & Niche",
      image: "/assets/produk/parfum/World-class_commercial_product_photography._Perfectly_202605101730.jpeg"
    },
    {
      id: "edp",
      name: "EAU DE PARFUM",
      uvp: "Standar Emas industri dengan Sillage & Longevity optimal.",
      highlight: "Longevity optimal",
      image: "/assets/produk/parfum/Glass_bottle_and_packaging_box_202605101730.jpeg",
      isMostPreferred: true
    },
    {
      id: "edt",
      name: "EAU DE TOILETTE",
      uvp: "Opsi Mass Market terbaik untuk Volume Produksi masif.",
      highlight: "Volume Produksi masif",
      image: "/assets/produk/parfum/Glass_bottle_and_packaging_202605101730.jpeg"
    },
    {
      id: "cologne",
      name: "COLOGNE",
      uvp: "Produk Entry-Level ideal untuk penetrasi pasar cepat.",
      highlight: "penetrasi pasar cepat",
      image: "/assets/produk/parfum/Glass_bottle_and_packaging_box_202605101730 (1).jpeg"
    },
    {
      id: "bodymist",
      name: "BODY MIST",
      uvp: "Varian Gen-Z dengan High Turnover & biaya efisien.",
      highlight: "High Turnover",
      image: "/assets/produk/parfum/Glass_spray_bottle_and_box_202605101729.jpeg"
    },
    {
      id: "atsiri",
      name: "MINYAK ATSIRI",
      uvp: "100% Pure Grade untuk segmentasi Therapeutic alami.",
      highlight: "Therapeutic alami",
      image: "/assets/produk/parfum/Glass_dropper_bottle_and_box_202605101730.jpeg"
    }
  ];

  const whatsappLink = (name: string) => `https://wa.me/6281234567890?text=Halo%20Dreamlab!%20Saya%20tertarik%20dengan%20${name}.%20Bisa%20bantu%20info%20detailnya?`;

  return (
    <section className="py-24 lg:py-32 bg-white border-t border-gray-50">
      <div className="container-custom">
        
        {/* Header */}
        <div className="flex flex-col gap-6 mb-16 lg:mb-24">
          <div className="flex items-center gap-4">
            <div className="w-12 h-[3px] bg-brand-orange"></div>
            <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.4em]">
              Product Selection Matrix
            </span>
          </div>
          <h2 className="font-display text-[38px] md:text-[52px] lg:text-[80px] font-normal text-[#212120] leading-[1.05] tracking-tighter uppercase">
            PILIH MESIN <br />
            <span className="text-brand-orange">PERTUMBUHAN ANDA.</span>
          </h2>
        </div>

        {/* 4-Column Square Grid (Low Scroll Fatigue) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {showcaseProducts.map((product) => (
            <div 
              key={product.id}
              className={`group relative aspect-square rounded-[2rem] overflow-hidden border transition-all duration-700 ${
                product.isMostPreferred 
                  ? "border-brand-orange/30 shadow-2xl" 
                  : "border-gray-100 hover:border-brand-orange/20"
              }`}
            >
              {/* Image Layer */}
              <div className="absolute inset-0 bg-[#F8F8FF]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-8 transition-transform duration-1000 group-hover:scale-110"
                />
                {/* Clean Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Text Content Layer (Fixed at bottom) */}
              <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end">
                <div className="space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-onest text-lg lg:text-xl font-black text-[#212120] leading-none uppercase">
                    {product.name}
                  </h3>
                  
                  {/* The UVP Sentence */}
                  <p className="text-[10px] lg:text-[11px] font-poppins text-[#212120]/60 leading-relaxed max-w-[90%]">
                    {product.uvp.split(product.highlight)[0]}
                    <span className="font-black text-brand-orange">{product.highlight}</span>
                    {product.uvp.split(product.highlight)[1]}
                  </p>
                </div>

                {/* Hidden "Diskusi" Trigger on hover */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                   <a 
                    href={whatsappLink(product.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[9px] font-black text-brand-orange uppercase tracking-widest"
                   >
                     Mulai Diskusi 
                     <div className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                     </div>
                   </a>
                </div>
              </div>

              {/* Preferred Badge */}
              {product.isMostPreferred && (
                <div className="absolute top-4 right-4 z-10 bg-brand-orange text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  Preferred
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
