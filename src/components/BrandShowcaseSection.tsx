'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';

const premiumEase = [0.16, 1, 0.3, 1] as any;

export default function BrandShowcaseSection() {
  return (
    <section className="relative py-20 md:py-28 bg-white overflow-hidden border-b border-gray-50">
      
      {/* Concentric Circular Background Lines - Matching screenshot */}
      <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none hidden md:flex items-center justify-center z-0">
        <div className="absolute w-[600px] h-[600px] rounded-full border border-gray-100 flex items-center justify-center">
          <div className="w-[500px] h-[500px] rounded-full border border-gray-100 flex items-center justify-center">
            <div className="w-[400px] h-[400px] rounded-full border border-gray-100 flex items-center justify-center">
              <div className="w-[300px] h-[300px] rounded-full border border-gray-100 flex items-center justify-center">
                <div className="w-[200px] h-[200px] rounded-full border border-gray-100" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Sunscreen Product Image with Leaves */}
          <motion.div 
            initial={{ opacity: 0, x: -50, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: premiumEase }}
            className="lg:col-span-6 flex justify-center relative select-none"
          >
            {/* Ambient shadow glow behind product */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-orange/5 rounded-full blur-[80px] -z-10" />
            
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative w-full max-w-[480px] aspect-[4/3] md:aspect-[1.5/1]"
            >
              <Image 
                src="/new asset/wujudkan-brand-bg.png" 
                alt="Wujudkan Brand Kosmetik Sunscreen Bersama Dreamlab" 
                title="Sunscreen Maklon Premium — Dreamlab Indonesia"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </motion.div>

          {/* Right Column: Copywriting & CTAs */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: premiumEase, delay: 0.1 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <div className="space-y-2">
              <span className="text-[11px] font-black tracking-[0.25em] text-brand-orange uppercase">
                Dreamlab #JUARA FORMULA
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-brand-black tracking-tight leading-[1.1] uppercase">
                Wujudkan Brand <span className="text-brand-orange text-glow">Bersama Dreamlab</span>
              </h2>
            </div>
            
            <div className="h-[2px] w-16 bg-brand-orange/40 rounded-full" />

            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-medium">
              Dreamlab adalah perusahaan maklon kosmetik dengan layanan lengkap dari awal hingga akhir. Kami menawarkan <strong className="text-brand-black">One Stop Maklon Service</strong>, mulai dari konsultasi, pembuatan formula, desain kemasan, produksi, hingga pengurusan izin BPOM dan Halal.
            </p>

            {/* Interactive CTAs to enhance conversion */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a 
                href="https://wa.me/62881027240339?text=Halo%20Dreamlab%2C%20saya%20tertarik%20untuk%20mewujudkan%20brand%20kosmetik%20saya%20sendiri%20dari%20halaman%20depan%20website%20Anda."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-brand-orange hover:bg-brand-black text-white hover:text-white px-8 py-4 rounded-2xl font-black text-xs tracking-widest transition-all duration-300 shadow-xl shadow-brand-orange/10 hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                KONSULTASI GRATIS (WA)
              </a>

              <Link 
                href="/services/"
                className="flex items-center gap-1.5 hover:text-brand-orange text-brand-black font-black text-xs tracking-widest py-4 px-6 rounded-2xl group transition-colors"
              >
                PELAJARI ALUR MAKLON
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
