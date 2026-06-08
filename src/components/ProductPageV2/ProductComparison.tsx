"use client";

import { ProductCategoryV2 } from "@/types/product-v2";

interface ProductComparisonProps {
  data: ProductCategoryV2;
  currentProductSlug?: string;
}

export default function ProductComparison({ 
  data, 
  currentProductSlug 
}: ProductComparisonProps) {
  const isCategoryPage = !currentProductSlug;

  // Human-centric path selection data
  const paths = [
    {
      title: "Eau de Parfum (EDP)",
      description: "Wangi awet seharian. Pilihan tepat untuk target market yang cari kemewahan.",
      icon: "✨",
      tag: "Best for Luxury Brands",
      bgColor: "bg-[#FDF8F3]",
      borderColor: "border-brand-orange/20"
    },
    {
      title: "Eau de Toilette (EDT)",
      description: "Segar dan ringan. Cocok untuk penggunaan harian yang aktif.",
      icon: "🌿",
      tag: "Perfect for Daily Wear",
      bgColor: "bg-[#FAF9F6]",
      borderColor: "border-brand-orange/10"
    },
    {
      title: "Body Mist",
      description: "Ringan dan terjangkau. Pas untuk jangkau pasar yang lebih luas.",
      icon: "💧",
      tag: "Trending for Mass Market",
      bgColor: "bg-[#FDF8F3]",
      borderColor: "border-brand-orange/15"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-brand-light-blue/20">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-viga text-3xl md:text-4xl text-brand-black mb-4">
            Pilih Karakter Brand Anda
          </h2>
          <p className="text-lg text-brand-gray max-w-2xl mx-auto">
            Setiap tipe parfum punya target market yang berbeda. Mana yang paling cocok dengan visi brand Anda?
          </p>
        </div>

        {/* 3 Path Selection Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16">
          {paths.map((path) => (
            <div 
              key={path.title}
              className={`${path.bgColor} ${path.borderColor} border-2 p-8 rounded-3xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group`}
            >
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{path.icon}</div>
              <div className="inline-block px-3 py-1 bg-white rounded-full text-[10px] font-bold text-brand-orange uppercase tracking-widest mb-4 shadow-sm">
                {path.tag}
              </div>
              <h3 className="font-viga text-2xl text-brand-black mb-4">
                {path.title}
              </h3>
              <p className="text-brand-gray leading-relaxed">
                {path.description}
              </p>
            </div>
          ))}
        </div>

        {/* Simplified Comparison Table - Desktop Only */}
        <div className="hidden lg:block bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-4">
            {/* Header Row */}
            <div className="p-6 bg-gray-50/50 font-bold text-brand-gray border-b border-gray-100">Spesifikasi</div>
            <div className="p-6 font-viga text-xl text-brand-black border-b border-gray-100">EDP</div>
            <div className="p-6 font-viga text-xl text-brand-black border-b border-gray-100">EDT</div>
            <div className="p-6 font-viga text-xl text-brand-black border-b border-gray-100">Body Mist</div>

            {/* Rows */}
            {[
              { label: "Ketahanan", values: ["6-12 Jam", "3-5 Jam", "2-4 Jam"] },
              { label: "Konsentrasi", values: ["15-20%", "8-15%", "1-3%"] },
              { label: "MOQ", values: ["1.000 Pcs", "1.000 Pcs", "3.000 Pcs"] },
              { label: "Positioning", values: ["Premium / Luxury", "Daily Wear", "Mass Market"] },
            ].map((row, idx) => (
              <div key={idx} className="contents">
                <div className="p-6 bg-gray-50/30 text-sm font-semibold text-brand-gray border-b border-gray-100">{row.label}</div>
                {row.values.map((val, vIdx) => (
                  <div key={vIdx} className="p-6 text-brand-black font-medium border-b border-gray-100">{val}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Quick Guide for Mobile instead of table */}
        <div className="lg:hidden text-center mt-8">
           <p className="text-sm text-brand-gray italic">
             * Geser ke atas untuk melihat detail perbandingan teknis
           </p>
        </div>
      </div>
    </section>
  );
}