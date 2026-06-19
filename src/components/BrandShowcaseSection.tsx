'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { openWARoundRobin } from "@/lib/wa-roundrobin";

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
          
          {/* Left Column: 4-Grid Asymmetric Layout */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 w-full"
          >
            <div className="grid grid-cols-12 gap-4 items-stretch relative">
              
              {/* Top Left: Main Image (Lab / Scientist) */}
              <div className="col-span-7 relative rounded-[24px] overflow-hidden shadow-xl border border-neutral-100 group min-h-[220px] lg:min-h-[260px]">
                <Image
                  src="/new asset/people/17.webp"
                  alt="Dreamlab R&D Lab"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 60vw, 30vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                <div className="absolute top-1/2 -right-6 -translate-y-1/2 z-20">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="w-12 h-12 rounded-full bg-brand-orange flex items-center justify-center text-white shadow-xl cursor-pointer hover:bg-neutral-900 transition-colors"
                  >
                    <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.div>
                </div>
              </div>

              {/* Top Right: Portfolio Numbers Card */}
              <div className="col-span-5 bg-brand-black border border-brand-orange/15 rounded-[24px] p-5 flex flex-col justify-center items-center text-center shadow-xl text-white">
                <span className="text-3xl md:text-4xl font-extrabold font-onest text-white leading-none tracking-tight">1.000+</span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-orange mt-2 leading-tight">Produk Dikembangkan</span>
                <p className="text-[9px] text-white/50 mt-2 leading-tight">Fasilitas produksi bersertifikat CPKB Grade A</p>
              </div>

              {/* Bottom Left: World Class Innovation Card */}
              <div className="col-span-5 bg-brand-orange rounded-[24px] p-5 flex flex-col justify-center items-center text-center shadow-xl text-white">
                <span className="text-3xl md:text-4xl font-extrabold font-onest text-white leading-none tracking-tight">World Class</span>
                <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-wider leading-tight">Innovation</span>
                <p className="text-[9px] text-white/70 mt-2 leading-tight">500+ formulasi untuk brand di 15+ negara</p>
              </div>

              {/* Bottom Right: Secondary Image (Quality Control) */}
              <div className="col-span-7 relative rounded-[24px] overflow-hidden shadow-xl border border-neutral-100 group min-h-[220px] lg:min-h-[260px]">
                <Image
                  src="/new asset/people/Busdev-dreamlab.png"
                  alt="Dreamlab Quality Control"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 60vw, 30vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl py-1.5 px-3 flex items-center gap-1.5 shadow-md border border-brand-orange/10">
                  <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-brand-black font-onest">BPOM VERIFIED</span>
                </div>
              </div>
              
            </div>
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
              <button
                onClick={() => openWARoundRobin("Halo Dreamlab, saya tertarik untuk mewujudkan brand kosmetik saya sendiri dari halaman depan website Anda.")}
                className="flex items-center gap-2 bg-brand-orange hover:bg-brand-black text-white hover:text-white px-8 py-4 rounded-2xl font-black text-xs tracking-widest transition-all duration-300 shadow-xl shadow-brand-orange/10 hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                KONSULTASI GRATIS (WA)
              </button>

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
