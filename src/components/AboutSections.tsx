"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, Download, CheckCircle2 } from "lucide-react";
import { AboutSectionData, LayananMaklonData, TrustedBannerData, FinalCTAData } from "@/types";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";
import { 
  EASE_EXPO, 
  VIEWPORT_ONCE, 
  fadeInLeft, 
  fadeInRight, 
  fadeInUp, 
  staggerContainer, 
  staggerItemUp 
} from "@/lib/animations";

export function KenaliDreamlab({ data }: { data: AboutSectionData }) {
  return (
    <section className="py-24 md:py-40 bg-white relative overflow-hidden">
      <div className="container-custom">
        <motion.div 
          variants={staggerContainer(0.15, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center"
        >
          {/* Left: Image Box */}
          <motion.div 
            variants={fadeInLeft(0.8, 0, -30)}
            className="relative order-2 lg:order-1"
          >
            <div className="absolute -inset-4 bg-brand-orange/5 rounded-[40px] -rotate-3 transition-transform group-hover:rotate-0 duration-700" />
            <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl">
              <Image 
                src={data.image} 
                alt="Kenali Dreamlab" 
                title={getImageTitle(data.image)}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Floating Badge */}
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute top-10 -right-10 bg-white p-6 rounded-3xl shadow-3xl border border-brand-black/5 hidden md:block"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange">
                  <Star fill="currentColor" />
                </div>
                <div>
                  <p className="font-onest text-brand-black text-sm uppercase">{data.badge.title}</p>
                  <p className="text-brand-black/40 text-[10px] font-bold uppercase tracking-widest">{data.badge.name}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Content Text */}
          <motion.div 
            variants={fadeInRight(0.8, 0.1, 30)}
            className="space-y-10 order-1 lg:order-2"
          >
            <div>
              <span className="text-brand-orange font-black uppercase tracking-[0.4em] text-sm mb-4 inline-block">Architect Behind The Brand</span>
              <h2 className="text-4xl md:text-6xl font-display text-brand-black leading-[1.1] uppercase">
                {data.title.split(' ').slice(0, 2).join(' ')} <span className="text-brand-orange">{data.title.split(' ').slice(2).join(' ')}</span>
              </h2>
              <div className="w-24 h-2 bg-brand-orange mt-8" />
            </div>
            
            <p className="text-brand-black/60 text-lg md:text-xl leading-relaxed font-medium">
              {data.description}
            </p>

            <div className="pt-6">
              <Link href={data.ctaLink} className="btn-primary flex items-center gap-4 w-fit px-10 py-5 rounded-2xl group">
                <Download size={20} className="group-hover:translate-y-1 transition-transform" />
                {data.cta}
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function LayananMaklon({ data }: { data: LayananMaklonData }) {
  return (
    <section className="py-24 md:py-40 bg-brand-white relative overflow-hidden">
      <div className="container-custom">
        <motion.div 
          variants={staggerContainer(0.15, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="flex flex-col lg:flex-row gap-20 items-center"
        >
          {/* Left Panel: Service Header + Staggered Cards */}
          <motion.div 
            variants={fadeInLeft(0.8, 0, -30)}
            className="lg:w-1/2 space-y-12"
          >
            <div>
              <span className="text-brand-orange font-black uppercase tracking-[0.4em] text-sm mb-4 inline-block">#1 One Stop Solution</span>
              <h2 className="text-4xl md:text-6xl font-display text-brand-black leading-[1.1] uppercase max-w-xl">
                {data.title}
              </h2>
              <p className="text-brand-orange font-bold text-lg mt-6">{data.subtitle}</p>
            </div>

            {/* List items stagger */}
            <motion.div 
              variants={staggerContainer(0.08, 0.2)}
              className="grid gap-8"
            >
              {data.items.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  variants={staggerItemUp(15)}
                  className="bg-white p-8 rounded-[32px] border border-gray-100 hover:border-brand-orange/20 transition-all group shadow-sm"
                >
                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-brand-orange text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-orange/30 group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-onest text-brand-black uppercase">{item.title}</h3>
                      <p className="text-brand-black/60 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Panel: Feature Image */}
          <motion.div 
            variants={fadeInRight(0.8, 0.2, 30)}
            className="lg:w-1/2 relative group"
          >
            <div className="relative aspect-square rounded-[60px] overflow-hidden shadow-3xl">
              <Image 
                src={data.image} 
                alt={getImageAlt(data.image, data.title)}
                title={getImageTitle(data.image)}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function TrustedBanner({ data }: { data: TrustedBannerData }) {
  return (
    <section className="py-16 bg-white border-y border-brand-black/5 overflow-hidden">
      <div className="container-custom">
        <motion.div 
          variants={staggerContainer(0.08, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="flex flex-col md:flex-row items-center justify-between gap-12"
        >
          <motion.h3 
            variants={fadeInUp(0.6, 0, 15)}
            className="text-2xl md:text-3xl font-onest text-brand-black uppercase text-center md:text-left max-w-lg"
          >
            {data.text}
          </motion.h3>
          <motion.div 
            variants={staggerContainer(0.06, 0.15)}
            className="flex flex-wrap justify-center gap-8 md:gap-16 items-center"
          >
            {data.logos.map((logo: string, idx: number) => (
              <motion.div 
                key={idx} 
                variants={staggerItemUp(15)}
                className="relative h-16 md:h-20 w-32 md:w-40 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              >
                <Image src={logo} alt="Certificate" title={getImageTitle(logo)} fill className="object-contain" sizes="(max-width: 768px) 120px, 160px" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function FinalCTA({ data }: { data: FinalCTAData }) {
  return (
    <section className="py-32 md:py-56 bg-brand-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pattern-orange" />
      
      <div className="container-custom relative z-10">
        <motion.div 
          variants={staggerContainer(0.15, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="flex flex-col lg:flex-row items-center gap-20"
        >
          {/* Left Panel: Brand CTA Text */}
          <motion.div 
            variants={fadeInLeft(0.8, 0, -30)}
            className="lg:w-3/5 text-center lg:text-left space-y-12"
          >
            <h2 className="text-brand-black text-5xl md:text-8xl font-display uppercase leading-[0.9] tracking-tighter">
              {data.title.split(' Ahlinya!')[0]} <span className="text-brand-orange">Ahlinya!</span>
            </h2>
            <p className="text-gray-600 text-xl md:text-2xl font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {data.subtitle}
            </p>
            <div className="pt-4">
              <Link href={data.ctaLink} target="_blank" className="btn-primary text-xl px-16 py-7 rounded-2xl shadow-3xl shadow-brand-orange/30 transform hover:scale-105 active:scale-95 transition-all inline-block">
                {data.ctaText}
              </Link>
            </div>
          </motion.div>
          
          {/* Right Panel: Visual Image Card */}
          <motion.div 
            variants={fadeInRight(0.8, 0.1, 30)}
            className="lg:w-2/5 relative"
          >
            <div className="relative aspect-[4/5] rounded-[48px] overflow-hidden shadow-3xl border-4 border-white">
              <Image 
                src={data.image} 
                alt="Wujudkan Brand" 
                title={getImageTitle(data.image)}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            {/* Floating Element */}
            <motion.div 
              animate={{ rotate: [12, 8, 12] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-orange rounded-full flex items-center justify-center p-8 text-center shadow-2xl"
            >
              <p className="text-white font-onest text-xs uppercase leading-tight">Start Your Brand Now!</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
