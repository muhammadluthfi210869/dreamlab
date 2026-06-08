"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getImageAlt, getImageTitle } from '@/lib/image-utils';


const products = [
  {
    id: 'extrait',
    name: 'Extrait de Parfum',
    target: 'Luxury Market',
    uvp: 'Targeting <span class="text-brand-orange font-bold">margin profit tertinggi</span>.',
    image: '/assets/produk/parfum/World-class_commercial_product_photography._Perfectly_202605101730.jpeg',
    isPopular: false
  },
  {
    id: 'edp',
    name: 'Eau de Parfum',
    target: 'Premium Retail',
    uvp: 'Standar emas untuk retail dengan <span class="text-brand-orange font-bold">balancing</span>.',
    image: '/assets/produk/parfum/Glass_bottle_and_packaging_box_202605101730 (1).jpeg',
    isPopular: true
  },
  {
    id: 'edt',
    name: 'Eau de Toilette',
    target: 'Mass Market',
    uvp: 'Ideal untuk <span class="text-brand-orange font-bold">volume Produksi Masif</span> dan kompetisi pasar menengah.',
    image: '/assets/produk/parfum/Glass_bottle_and_packaging_box_202605101730.jpeg',
    isPopular: false
  },
  {
    id: 'cologne',
    name: 'Cologne',
    target: 'Lifestyle / Active',
    uvp: 'Produk entry level untuk <span class="text-brand-orange font-bold">branding cepat</span>.',
    image: '/assets/produk/parfum/Glass_bottle_and_packaging_202605101730.jpeg',
    isPopular: false
  },
  {
    id: 'bodymist',
    name: 'Body Mist',
    target: 'Gen-Z / FMCG',
    uvp: 'Menargetkan <span class="text-brand-orange font-bold">turnover cepat</span>.',
    image: '/assets/produk/parfum/Glass_spray_bottle_and_box_202605101729.jpeg',
    isPopular: false
  },
  {
    id: 'atsiri',
    name: 'Minyak Atsiri',
    target: 'Therapeutic',
    uvp: 'Fokus pada <span class="text-brand-orange font-bold">100 persen pure grade</span> alami.',
    image: '/assets/produk/parfum/Glass_dropper_bottle_and_box_202605101730.jpeg',
    isPopular: false
  },
];

export default function ProductSelectionMatrix() {
  const renderCard = (product: any, index: number) => {
    const whatsappMessage = encodeURIComponent(
      `Halo Dreamlab! Saya ingin diskusi strategi maklon untuk: ${product.name}.`
    );
    const whatsappLink = `https://wa.me/6281234567890?text=${whatsappMessage}`;

    return (
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1] as any,
              delay: index * 0.08
            }
          }
        }}
        key={product.id}
      >
        <a 
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`group relative block bg-white border rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-brand-orange/10 flex flex-col h-full ${
            product.isPopular ? "border-brand-orange ring-1 ring-brand-orange/20 shadow-xl shadow-brand-orange/10" : "border-gray-100"
          }`}
        >
          {/* Visual Area - Matching Image Vibe */}
          <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F5F3]">
            <Image
              src={product.image}
              alt={getImageAlt(product.image, product.name)}
              title={getImageTitle(product.image)}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {product.isPopular && (
              <div className="absolute top-6 left-6">
                <span className="bg-brand-orange text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg">
                  Most Preferred
                </span>
              </div>
            )}
          </div>

          {/* Content Area - Simplified to exactly 2 main text elements */}
          <div className="p-8 lg:p-9 flex flex-col flex-grow">
            <div className="flex-grow">
              <h3 className="font-onest text-2xl lg:text-3xl font-black text-[#212120] leading-none tracking-tighter uppercase group-hover:text-brand-orange transition-colors">
                {product.name}
              </h3>
              <p 
                className="mt-3 text-[14px] lg:text-[15px] text-gray-500 font-medium leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.uvp }}
              />
            </div>

            {/* Action Row - Institutional B2B Style */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between group/btn">
              <div className="space-y-0.5">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#212120] block">
                  Mulai Diskusi
                </span>
                <span className="text-[10px] text-gray-400 font-medium">Konsultasi Strategi Bisnis</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#212120] flex items-center justify-center text-white group-hover/btn:bg-brand-orange group-hover/btn:scale-110 transition-all duration-500 shadow-xl">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </a>
      </motion.div>
    );
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="relative z-10 bg-[#FDFDFC] py-16 lg:py-24 overflow-hidden"
    >
      <div className="container-custom">
        
        {/* Compact Header */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: -20 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
            }
          }}
          className="max-w-3xl mb-12 lg:mb-16 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-[2px] bg-brand-orange"></div>
            <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.4em]">
              Product Discovery Hub
            </span>
          </div>
          <h2 className="font-display text-[28px] lg:text-[48px] font-normal text-[#212120] leading-[1.1] tracking-tight">
            Pilih Mesin <br />
            <span className="text-brand-orange">Pertumbuhan Anda.</span>
          </h2>
        </motion.div>

        {/* Compact 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {products.map((p, i) => renderCard(p, i))}
        </div>

      </div>
    </motion.section>
  );
}
