"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight
} from "lucide-react";

const premiumEase = [0.16, 1, 0.3, 1] as any;

const haircareBg = "#E7ECFE";

export default function MaklonHaircareAdsLP() {
  const benefits = [
    "Kamu pilih konsep",
    "Formula GRATIS dari formulator",
    "Kemasan premium kami desainkan",
    "BPOM, Halal, HKI-beres",
    "Kamu tinggal jual"
  ];

  return (
    <div className="landing-page-ads min-h-screen bg-[#FAF9F6] text-brand-black font-sans selection:bg-brand-orange selection:text-white">

      {/* 1. HERO */}
      <section className="relative min-h-[600px] lg:min-h-screen xl:min-h-[800px] flex items-center overflow-hidden bg-white pt-24 pb-16 lg:pt-36 lg:pb-24">
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
            src="/new asset/background-visual-hero-section/haircare.webp"
            alt="Dreamlab Premium Hair Care"
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
          <div className="max-w-3xl lg:max-w-4xl transform -translate-y-4 lg:-translate-y-16">

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="inline-flex items-center gap-3 px-3.5 py-1.5 bg-brand-orange/5 rounded-full mb-4 md:mb-6 border border-brand-orange/20 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[9px] lg:text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] font-onest">
                Dreamlab #JUARAFORMULA
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1, ease: premiumEase }}
              className="font-normal text-brand-black mb-4 md:mb-6 leading-[1.1] tracking-tight uppercase text-[28px] sm:text-[38px] md:text-[48px] lg:text-[60px] xl:text-[68px]"
            >
              Mau Buat Brand
              <br />
              <span className="text-brand-orange italic font-display font-bold">Hair Care Premium?</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="text-neutral-600 font-sans text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-2xl"
            >
              Wujudkan produk impian Anda dengan formula kualitas klinik, sampel gratis dari formulator ahli, desain kemasan mewah, dan legalitas BPOM lengkap. Kami tangani semuanya dari A sampai Z.
            </motion.p>

            {/* Workflow Steps - Responsive Grid, No Scrollbars */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="mb-8 w-full"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="flex flex-col justify-between bg-white/75 backdrop-blur-md border border-brand-orange/10 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-orange/30 transition-all duration-300 min-h-[100px]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black text-brand-orange bg-brand-orange/10 w-5 h-5 rounded-lg flex items-center justify-center">
                        0{i + 1}
                      </span>
                      {i < benefits.length - 1 && (
                        <span className="text-brand-orange/30 text-xs hidden lg:inline-block font-bold">→</span>
                      )}
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-neutral-800 leading-tight">
                      {benefit}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA + Reassurance Microcopy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6"
            >
              <a
                href="/thankyou-maklon/"
                className="group relative inline-flex items-center justify-center gap-3 bg-brand-orange hover:bg-brand-black text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-[0_12px_24px_rgba(243,146,0,0.2)] hover:shadow-[0_18px_32px_rgba(243,146,0,0.3)] hover:-translate-y-0.5"
              >
                <span className="uppercase tracking-wider text-[11px] font-display">Mulai Konsultasi Gratis</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              <div className="text-[10px] text-neutral-400 font-medium tracking-wide flex flex-col gap-0.5 justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span>Respon Cepat via WhatsApp</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span>Tanpa Biaya & Komitmen Awal</span>
                </div>
              </div>
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

      {/* 3. CLOSING CTA — Homepage style background visual */}
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
              <h2 className="text-brand-orange text-[30px] sm:text-[40px] md:text-[38px] lg:text-[48px] xl:text-[54px] font-display font-extrabold leading-[1.12] tracking-tight font-onest mb-6 uppercase">
                Mulai Brand Hair Care Hari Ini
              </h2>

              <p className="text-neutral-500 text-sm md:text-base leading-relaxed mb-8 font-sans max-w-lg">
                Chat sekarang — gratis, tanpa komitmen. 3 bulan lagi brandmu sudah bisa jualan.
              </p>

              <div className="rounded-2xl w-fit mt-2 flex flex-col items-start gap-3">
                <a
                  href="/thankyou-maklon/"
                  className="inline-flex flex-col items-center justify-center bg-brand-orange hover:bg-[#D98200] hover:scale-[1.03] text-white px-6 py-3 sm:px-8 sm:py-3.5 rounded-2xl font-extrabold text-xs md:text-sm uppercase tracking-wider leading-tight transition-all duration-300 shadow-xl shadow-brand-orange/15 w-fit"
                >
                  <span>Mulai Brand Hair Careku</span>
                  <span>— Gratis</span>
                </a>
                <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-neutral-400 font-onest">
                  RESPON CEPAT . TANPA KEWAJIBAN . 100% GRATIS
                </span>
              </div>
            </motion.div>

            <div className="hidden md:block md:col-span-6 lg:col-span-6 h-full" />

          </div>
        </div>
      </section>

      {/* FLOATING WA BUTTON */}
      <a
        href="/thankyou-maklon/"
        className="fixed bottom-6 right-6 z-50 bg-[#25d366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
        aria-label="Contact via WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
        <span className="absolute right-full mr-4 bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-bold shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">Chat with us!</span>
      </a>

      {/* 4. FOOTER — Haircare blue tone */}
      <footer
        className="py-10 border-t"
        style={{ backgroundColor: `${haircareBg}88`, borderColor: `${haircareBg}44` }}
      >
        <div className="container-custom text-center space-y-4">
          <Image
            src="/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik-.webp"
            alt="Dreamlab Logo"
            width={120}
            height={38}
            className="h-8 w-auto mx-auto object-contain"
          />
          <p className="text-[10px] font-medium text-brand-black/40 tracking-wide uppercase mt-4">
            © PT Karya Impian Laboratoris. All Rights Reserved.
          </p>
          <div className="flex justify-center gap-6 text-[10px] text-brand-black/40 font-bold uppercase tracking-wider">
            <Link href="/privacy-policy" className="hover:text-brand-orange transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms-of-service" className="hover:text-brand-orange transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
