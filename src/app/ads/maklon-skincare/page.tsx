"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const premiumEase = [0.16, 1, 0.3, 1] as any;

const skincareBg = "#EADBC8";
const skincareVivid = "#CFB185";

export default function MaklonSkincareAdsLP() {
  const benefits = [
    "FREE Formula Custom",
    "FREE Desain Logo & Kemasan",
    "FREE Pengurusan BPOM & Halal",
    "MOQ Fleksibel",
    "FREE Digital Marketing Support"
  ];

  return (
    <div className="landing-page-ads min-h-screen bg-[#FAF9F6] text-brand-black font-sans selection:bg-brand-orange selection:text-white">

      {/* 1. HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-8 lg:pt-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "translate3d(0,0,0)",
          }}
        >
          <Image
            src="/new asset/background-visual-hero-section/skincare.webp"
            alt="Dreamlab Premium Skincare"
            fill
            priority
            fetchPriority="high"
            decoding="sync"
            className="object-cover"
            sizes="100vw"
            style={{
              imageRendering: "auto",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.0 }}
            className="absolute inset-0 bg-gradient-to-r from-white/55 via-white/20 to-transparent z-10 hidden lg:block"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.0 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.45)_0%,transparent_95%)] lg:hidden z-10"
          />
        </motion.div>

        <div className="container-custom relative z-20 w-full">
          <div className="max-w-2xl lg:max-w-3xl">

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="inline-flex items-center gap-3 px-3 py-1 bg-brand-orange/5 rounded-full mb-2.5 md:mb-4 border border-brand-orange/20 backdrop-blur-sm"
            >
              <span className="w-1 h-1 rounded-full bg-brand-orange" />
              <span className="text-[9px] lg:text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] font-onest">
                Dreamlab #JUARAFORMULA
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 1, ease: premiumEase }}
              className="font-extrabold text-brand-black mb-3 md:mb-4 leading-[1.1] tracking-tight uppercase text-[28px] sm:text-[38px] md:text-[48px] lg:text-[64px] xl:text-[72px]"
              style={{ textShadow: '0 0 30px rgba(255,255,255,0.8)' }}
            >
              <span className="text-brand-orange">Mau Buat Brand</span>
              <br />
              <span className="text-brand-orange">Skincare Premium?</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 1 }}
              className="text-xs sm:text-sm text-brand-black/80 lg:text-brand-black/70 font-medium leading-relaxed mb-6 md:mb-8 max-w-xl lg:text-[18px] xl:text-[20px]"
              style={{ textShadow: '0 0 20px rgba(255,255,255,0.5)' }}
            >
              Wujudkan brand skincare yang siap bersaing di market melalui formula inovatif, custom ingredient, dan pendampingan dari awal hingga produk siap dipasarkan.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="flex flex-wrap gap-3 mb-8 max-w-2xl"
            >
              {benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-brand-orange/15 px-4 py-2.5 rounded-xl shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                  <span className="text-[12px] sm:text-sm font-bold text-brand-black/90 tracking-wide font-onest">
                    {benefit}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9, duration: 0.8 }}
              className="flex flex-col items-start gap-3"
            >
              <a
                href="/ads/thankyou/metaads/?source=meta-skincare"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-brand-orange hover:bg-brand-black text-white font-bold py-4 px-10 rounded-xl transition-all duration-500 shadow-[0_15px_30px_rgba(246,145,30,0.15)] hover:-translate-y-1"
              >
                <span className="uppercase tracking-[0.2em] text-[10px] font-onest">KONSULTASIKAN BRAND ANDA SEKARANG</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </motion.div>

          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 1 }}
          className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F9F7F2] to-transparent z-10"
        />
      </section>

      {/* 2. DREAMLAB MEMBANTU MEWUJUDKAN BRAND SKINCARE ANDA */}
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(180deg, ${skincareBg}15 0%, transparent 40%, transparent 60%, ${skincareVivid}15 100%)` }} />
        <div className="container-custom relative z-10 w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-6"
            >
              <h2 className="text-brand-black text-[28px] sm:text-[36px] md:text-[44px] lg:text-[50px] font-display font-extrabold leading-[1.12] tracking-tight uppercase">
                Dreamlab Membantu Mewujudkan<br />
                <span className="text-brand-orange">Brand Skincare Anda</span>
              </h2>

              <p className="text-neutral-500 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-sans">
                Brand skincare memang terus bertumbuh setiap tahunnya. Namun jangan khawatir, karena pelanggan selalu mencari produk yang mampu menjawab kebutuhan mereka. Dreamlab membantu Anda menciptakan produk yang memiliki konsep, formula, dan nilai yang mampu bersaing di market.
              </p>

              <div className="flex items-center justify-center gap-3 py-4">
                <div className="h-px w-12 bg-brand-orange/30" />
                <span className="text-[11px] font-black tracking-[0.25em] text-brand-orange uppercase font-onest">
                  Dipercaya oleh 500+ Brand Owner
                </span>
                <div className="h-px w-12 bg-brand-orange/30" />
              </div>

              <p className="text-neutral-500 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-sans">
                Produk yang sukses bukan hanya memiliki kemasan yang menarik, tetapi juga formula yang membuat pelanggan kembali membeli.
              </p>

              <div className="pt-4">
                <span className="inline-block text-brand-black text-[13px] sm:text-sm font-bold font-onest uppercase tracking-widest border-b-2 border-brand-orange/40 pb-1">
                  Mulai Perjalanan Brand Anda Bersama Dreamlab
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. CLOSING CTA — Homepage style background visual */}
      <section className="relative w-full overflow-hidden bg-white min-h-[420px] sm:min-h-[480px] md:min-h-[500px] lg:min-h-[580px] flex items-center border-t border-b border-neutral-100">

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0 }}
          className="absolute inset-0 z-0 select-none pointer-events-none bg-white"
        >
          <Image
            src="/new asset/new-icon-packing-design/sampul-web-2.webp"
            alt="Dreamlab Cosmetics Showcase"
            fill
            unoptimized={true}
            priority={true}
            className="object-cover object-[78%_center] sm:object-[82%_center] md:object-[86%_center] lg:object-[88%_center] xl:object-[92%_center]"
          />
          <div className="absolute inset-y-0 left-0 w-[50%] bg-gradient-to-r from-white via-white/60 to-transparent z-10 hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/45 to-transparent md:hidden z-10" />
        </motion.div>

        <div className="container-custom relative z-20 w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full py-16 md:py-24">

            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-span-12 md:col-span-6 lg:col-span-6 text-left z-20 flex flex-col justify-center"
            >
              <span className="text-[9px] md:text-[10px] font-black tracking-[0.3em] uppercase font-onest text-brand-orange mb-3">
                CHAT SEKARANG — GRATIS, TANPA KOMITMEN
              </span>
              <h2 className="text-brand-orange text-[30px] sm:text-[40px] md:text-[38px] lg:text-[48px] xl:text-[54px] font-display font-extrabold leading-[1.12] tracking-tight font-onest mb-6 uppercase">
                Pilih Formulamu.
                <br />
                <span className="text-brand-orange/90">Sisanya Urusan Kami.</span>
              </h2>

              <p className="text-neutral-500 text-sm md:text-base leading-relaxed mb-8 font-sans max-w-lg">
                Chat sekarang — gratis, tanpa komitmen. Tim kami siap bantu kamu mulai hari ini.
              </p>

              <div className="rounded-2xl w-fit mt-2 flex flex-col items-start gap-3">
                <a
                  href="/ads/thankyou/metaads/?source=meta-skincare"
                  className="inline-flex items-center justify-center bg-brand-orange hover:bg-[#D98200] hover:scale-[1.03] text-white px-8 py-4 rounded-2xl font-extrabold text-xs md:text-sm uppercase tracking-wider transition-all duration-300 shadow-xl shadow-brand-orange/15 w-fit"
                >
                  <span>FREE KONSULTASI BISNIS</span>
                </a>
                <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-neutral-400 font-onest">
                  RESPON CEPAT — TANPA KEWAJIBAN · 100% GRATIS
                </span>
              </div>
            </motion.div>

            <div className="hidden md:block md:col-span-6 lg:col-span-6 h-full" />

          </div>
        </div>
      </section>

      {/* FLOATING WA BUTTON */}
      <a
        href="/ads/thankyou/metaads/?source=meta-skincare"
        className="fixed bottom-6 right-6 z-50 bg-[#25d366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
        aria-label="Contact via WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
        <span className="absolute right-full mr-4 bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-bold shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">Chat with us!</span>
      </a>

    </div>
  );
}
