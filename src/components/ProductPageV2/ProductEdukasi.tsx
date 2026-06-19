"use client";

import { useState } from "react";
import { EdukasiItemV2 } from "@/types/product-v2";
import Link from "next/link";

interface ProductEdukasiProps {
  items: EdukasiItemV2[];
}

export default function ProductEdukasi({ items }: ProductEdukasiProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Content Left */}
          <div>
            <h2 className="font-viga text-4xl md:text-5xl text-brand-black mb-6 leading-tight">
              Punya Pertanyaan <br/>
              <span className="text-brand-orange">Sebelum Memulai?</span>
            </h2>
            <p className="text-lg text-brand-gray mb-10 leading-relaxed">
              Kami paham, membangun brand butuh keyakinan. Kami di sini untuk menjawab keraguan Anda dan memastikan langkah Anda legal, aman, dan menguntungkan.
            </p>
            
            <div className="p-8 rounded-3xl bg-brand-light-blue border border-brand-light-blue relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
               <h4 className="font-viga text-xl text-brand-black mb-2 relative z-10">Butuh Jawaban Cepat?</h4>
               <p className="text-brand-gray mb-6 relative z-10">Tim konsultan kami siap bantu bedah strategi brand kamu via WhatsApp.</p>
               <Link
                href="/thankyou/google/"
                className="inline-flex items-center gap-2 font-bold text-brand-orange hover:gap-4 transition-all"
               >
                 Tanya Langsung Sekarang
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                 </svg>
               </Link>
            </div>
          </div>

          {/* Accordion Right */}
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className={`border-2 rounded-2xl transition-all duration-300 ${
                  expandedIndex === index ? "border-brand-orange bg-white shadow-lg" : "border-gray-100 bg-gray-50/50"
                }`}
              >
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className={`font-bold text-lg ${expandedIndex === index ? "text-brand-orange" : "text-brand-black"}`}>
                    {item.title}
                  </span>
                  <span className={`flex-shrink-0 w-6 h-6 transition-transform duration-300 ${expandedIndex === index ? "rotate-180 text-brand-orange" : "text-brand-gray"}`}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    expandedIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <div className="p-6 pt-0 text-brand-gray leading-relaxed">
                    {item.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}