"use client";

import { useState } from "react";
import { 
  MapPin, 
  Clock, 
  Factory, 
  ChevronDown, 
  ChevronRight, 
  HelpCircle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getImageTitle } from "@/lib/image-utils";
import { VIEWPORT_ONCE, fadeInUp, staggerContainer, staggerItemUp } from "@/lib/animations";

const premiumEase = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function ContactHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#FAF9F6] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <div className="absolute top-0 right-0 w-[650px] h-[650px] bg-brand-orange/[0.04] rounded-full blur-[130px]" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-brand-orange/[0.02] rounded-full blur-[100px]" />
      </div>

      <div className="container-custom relative z-10 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Typography & One CTA Only */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Clean Editorial Title & Subtitle */}
            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: premiumEase }}
                className="text-brand-black text-[38px] sm:text-[46px] md:text-[52px] lg:text-[60px] font-display font-normal leading-[1.08] tracking-tight uppercase"
              >
                Wujudkan <br />
                <span className="text-brand-orange font-bold italic">Brand Impian Anda</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="text-neutral-500 text-sm sm:text-base md:text-lg leading-relaxed font-sans max-w-xl"
              >
                Dreamlab adalah mitra maklon terpercaya di Jawa Timur yang siap mendampingi Anda di setiap langkah pembuatan produk maklon kosmetik, skincare, bodycare, dan parfum.
              </motion.p>
            </div>

            {/* Single CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="pt-2"
            >
              <Link
                href="/thankyou/google/"
                className="inline-flex items-center gap-3 bg-brand-orange hover:bg-neutral-950 text-white px-10 py-5 rounded-2xl font-onest font-extrabold uppercase tracking-wider text-xs sm:text-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-brand-orange/25 hover:shadow-neutral-950/15 group"
              >
                <span>Mulai Konsultasi Gratis</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Premium Studio Photo Mockup */}
          <div className="lg:col-span-5 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: premiumEase }}
              className="relative aspect-[4/5] w-full rounded-[40px] overflow-hidden shadow-2xl border-4 border-white bg-neutral-100 group"
            >
              <Image 
                src="/assets/images/medium-shot-korean-woman-posing-with-serum-bottle.webp"
                alt="Wujudkan Brand Kosmetik Impian Anda"
                title={getImageTitle("/assets/images/medium-shot-korean-woman-posing-with-serum-bottle.webp")}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

export function LocationDetails() {
  const locations = [
    {
      title: "Kantor Pemasaran Surabaya",
      address: "Dukuh Kupang Timur XX No.77B, Pakis, Kec. Sawahan, Surabaya, Jawa Timur 60256",
      maps: "https://maps.app.goo.gl/UDWzjzsL9ZjTPzLJ6",
      type: "HEAD MARKETING OFFICE",
      hours: "Senin - Jumat | 08:00 - 17:00 WIB",
      icon: <Clock className="w-5 h-5 text-brand-orange" />
    },
    {
      title: "Pabrik Produksi Pasuruan",
      address: "Gang Mindi, RT.04/RW.03, Kolursari, Sidowayah, Kec. Beji, Pasuruan, Jawa Timur 67154",
      maps: "https://maps.app.goo.gl/ZPA1xX3CEvY6qNvz6",
      type: "MAIN PRODUCTION PLANT",
      hours: "Senin - Sabtu | 08:00 - 16:00 WIB",
      icon: <Factory className="w-5 h-5 text-brand-orange" />
    }
  ];

  return (
    <section className="py-24 md:py-28 bg-[#FAF9F6] relative border-t border-b border-neutral-200/50">
      <div className="container-custom mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-brand-orange font-bold text-[10px] uppercase tracking-[0.25em] font-onest border-b border-brand-orange/20 pb-1">
            Lokasi Kami
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-normal text-brand-black leading-tight uppercase tracking-tight">
            Kunjungi Kantor <span className="text-brand-orange font-bold italic">& Pabrik Kami</span>
          </h2>
          <p className="text-neutral-500 text-sm font-sans">
            Kami menyambut hangat kedatangan Anda untuk konsultasi offline langsung dengan tim bisnis kami.
          </p>
        </div>

        {/* Bento Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {locations.map((loc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: premiumEase, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 md:p-10 rounded-[32px] border border-neutral-200/50 hover:border-brand-orange/20 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-sm"
            >
              <div className="space-y-6">
                
                {/* Card Type Header */}
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-bold text-brand-orange uppercase tracking-[0.25em] font-onest border-b border-brand-orange/20 pb-1">
                    {loc.type}
                  </span>
                  <div className="w-10 h-10 bg-brand-orange/5 border border-brand-orange/10 rounded-xl flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                    {loc.icon}
                  </div>
                </div>

                {/* Card Title */}
                <h3 className="text-xl md:text-2xl font-bold font-onest text-neutral-800 uppercase tracking-tight leading-snug">
                  {loc.title}
                </h3>
                
                {/* Address Description */}
                <p className="text-neutral-500 text-sm leading-relaxed font-sans font-medium">
                  {loc.address}
                </p>

                {/* Operating Hours Block */}
                <div className="flex items-center gap-2 bg-[#FAF9F6] border border-neutral-200/30 rounded-xl py-2.5 px-3.5 w-fit">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="text-neutral-600 text-[11px] font-semibold font-onest uppercase tracking-wide">
                    {loc.hours}
                  </span>
                </div>

              </div>
              
              {/* Navigation button */}
              <Link 
                href={loc.maps}
                target="_blank"
                className="mt-8 inline-flex items-center justify-center gap-2.5 bg-neutral-950 hover:bg-brand-orange text-white px-6 py-4 rounded-xl font-onest font-extrabold uppercase tracking-wider text-xs transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] w-fit shadow-md shadow-neutral-900/10 hover:shadow-brand-orange/15 group/btn"
              >
                <MapPin className="w-4 h-4 group-hover/btn:translate-y-[-1px] transition-transform" />
                <span>Petunjuk Arah Maps</span>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

export function ContactFAQ() {
  const faqs = [
    {
      question: "Berapa modal awal (MOQ) untuk membuat brand kosmetik sendiri?",
      answer: "Dreamlab menerapkan MOQ (Minimum Order Quantity) yang bersahabat dan fleksibel. Kami berkomitmen mendukung wirausaha baru dari skala mikro hingga besar, dengan program khusus yang memungkinkan peluncuran produk kosmetik tanpa modal miliaran rupiah."
    },
    {
      question: "Berapa lama proses pembuatan produk maklon dari awal hingga siap jual?",
      answer: "Umumnya seluruh tahapan membutuhkan waktu sekitar 2 sampai 3 bulan. Rinciannya mencakup proses riset formula custom R&D (2-4 minggu), pendaftaran izin edar BPOM (4-8 minggu), sertifikasi Halal, serta produksi massal di pabrik (2-3 minggu)."
    },
    {
      question: "Apakah formula produk saya dijamin unik dan tidak sama dengan brand lain?",
      answer: "Ya, 100% eksklusif. Tim formulator R&D ahli kami merancang formula secara custom dan unik untuk setiap klien berdasarkan konsep produk yang disepakati. Kami menjamin kerahasiaan formula Anda melalui perjanjian kerahasiaan formal (NDA)."
    },
    {
      question: "Apakah Dreamlab membantu proses pendaftaran BPOM, Halal, dan HAKI?",
      answer: "Tentu saja. Sebagai jasa maklon One-Stop Service, tim regulatory compliance kami akan mengurus semua administrasi legalitas Anda sepenuhnya—mulai dari pendaftaran Hak Kekayaan Intelektual (HAKI) merek, sertifikasi uji laboratorium, hingga terbitnya nomor BPOM dan sertifikat Halal MUI."
    },
    {
      question: "Bagaimana jika saya belum memiliki desain kemasan (packaging)?",
      answer: "Jangan khawatir! Kami menyediakan layanan desain kemasan gratis. Tim desainer grafis in-house kami akan membantu merancang konsep visual logo, label wadah/botol, hingga box luar produk Anda sesuai dengan karakter brand yang ingin dibangun."
    }
  ];

  // Accordion state
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setActiveIndex(prev => (prev === idx ? null : idx));
  };  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Soft background visual ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-brand-orange/[0.015] blur-[150px] rounded-full pointer-events-none -z-10" />

      <motion.div 
        variants={staggerContainer(0.12, 0)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="container-custom max-w-4xl mx-auto px-4 relative z-10"
      >
        {/* Header */}
        <motion.div 
          variants={fadeInUp(0.8, 0, 20)}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-brand-orange/5 border border-brand-orange/15 rounded-full">
            <HelpCircle className="w-3.5 h-3.5 text-brand-orange" />
            <span className="text-[10px] font-bold tracking-widest text-brand-orange uppercase font-onest">
              Tanya Jawab Maklon
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-normal text-brand-black leading-tight uppercase tracking-tight">
            Kenali Proses Maklon <span className="text-brand-orange font-bold italic">Lebih Jauh</span>
          </h2>
          <p className="text-neutral-500 text-sm max-w-xl mx-auto font-sans leading-relaxed">
            Dapatkan jawaban cepat untuk pertanyaan umum mengenai modal awal, regulasi BPOM, kepemilikan formula, dan alur pengerjaan.
          </p>
        </motion.div>
        
        {/* FAQ Accordion List */}
        <motion.div 
          variants={staggerContainer(0.08, 0.15)}
          className="space-y-4 max-w-3xl mx-auto"
        >
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <motion.div
                key={idx}
                variants={staggerItemUp(15)}
                className={`border rounded-2xl transition-all duration-300 ${
                  isOpen 
                    ? "border-brand-orange bg-white shadow-md shadow-brand-orange/5" 
                    : "border-neutral-200/60 bg-[#FAF9F6]/50 hover:bg-white hover:border-neutral-300"
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between text-left p-6 md:p-7 focus:outline-none cursor-pointer group"
                >
                  <h4 className={`text-sm md:text-base font-extrabold uppercase tracking-wide font-onest transition-colors duration-300 ${
                    isOpen ? "text-brand-orange" : "text-neutral-800 group-hover:text-brand-orange"
                  }`}>
                    {faq.question}
                  </h4>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 ml-4 ${
                    isOpen 
                      ? "bg-brand-orange border-brand-orange text-white rotate-180" 
                      : "bg-white border-neutral-200 text-neutral-500"
                  }`}>
                    <ChevronDown className="w-4 h-4 stroke-[2]" />
                  </div>
                </button>

                {/* Accordion Content Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: premiumEase }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 md:px-7 md:pb-7 pt-0 border-t border-neutral-100">
                        <p className="text-neutral-500 text-xs md:text-sm leading-relaxed font-sans font-medium pt-4">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

      </motion.div>
    </section>
  );
}
