"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";

interface Product {
  name: string;
  image: string;
}

interface BabyCareCatalogProps {
  products: Product[];
}

export default function BabyCareCatalog({ products }: BabyCareCatalogProps) {
  return (
    <section className="py-10 bg-white overflow-hidden">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Left Side: Branding Banner (Visual from Image 2) */}
          <div className="w-full lg:w-1/3 relative">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[3/4]">
              <Image 
                src="/assets/images/beautiful-girl-sitting-bed-with-beauty-products-scaled.webp" 
                alt="Ciptakan Brand Kosmetik Bayi Sendiri — Maklon Baby Care Dreamlab"
                title="Ciptakan Brand Baby Care — Maklon Kosmetik Bayi BPOM Dreamlab"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-orange/80 via-transparent to-transparent flex flex-col justify-end p-10">
                <h3 className="text-white text-[32px] font-onest font-black leading-tight mb-4">
                  CIPTAKAN<br />
                  BRAND<br />
                  KOSMETIK
                </h3>
                <p className="text-white/90 font-medium">Hanya Dalam 3 Bulan</p>
              </div>
            </div>
          </div>

          {/* Right Side: Catalog Grid */}
          <div className="w-full lg:w-2/3">
            <div className="mb-6">
              <div className="inline-block px-4 py-1 bg-brand-orange/10 rounded-full mb-6">
                <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.3em] font-onest">
                  Ide Bisnis Produk Bayi
                </span>
              </div>
              <h2 className="text-brand-black mb-4">
                <span className="font-light">KATALOG PRODUK</span><br />
                <span className="font-black text-brand-orange">BABY CARE</span>
              </h2>
              <div className="w-24 h-1.5 bg-brand-orange rounded-full mb-12" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {products.map((product, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F9F9F9] mb-4 border border-brand-black/5 group-hover:border-brand-orange/30 transition-colors">
                    <Image 
                      src={product.image} 
                      alt={getImageAlt(product.image, product.name)}
                      title={getImageTitle(product.image)}
                      fill
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-center font-onest font-bold text-brand-black text-sm uppercase tracking-wider">
                    {product.name}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link 
                href="https://wa.me/62881027240339" 
                className="flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-xl font-onest font-black uppercase tracking-wider text-[11px] hover:bg-brand-black transition-all shadow-lg group"
              >
                HUBUNGI TIM KAMI
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/contact-us" 
                className="flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-xl font-onest font-black uppercase tracking-wider text-[11px] hover:bg-brand-black transition-all shadow-lg group"
              >
                JADWALKAN PERTEMUAN
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

