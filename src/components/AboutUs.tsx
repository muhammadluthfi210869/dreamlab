"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";

export default function AboutUs() {
  return (
    <section className="py-24 bg-white overflow-hidden relative">
      {/* Subtle Circular Pattern Background (Behind Image) */}
      <div className="absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0 border-[1px] border-black rounded-full scale-100" />
        <div className="absolute inset-0 border-[1px] border-black rounded-full scale-[0.8]" />
        <div className="absolute inset-0 border-[1px] border-black rounded-full scale-[0.6]" />
        <div className="absolute inset-0 border-[1px] border-black rounded-full scale-[0.4]" />
        <div className="absolute inset-0 border-[1px] border-black rounded-full scale-[0.2]" />
      </div>

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Product Image with Leaves (Visual) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex justify-center lg:justify-start"
          >
            <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
              {/* Product Jar */}
              <Image
                src="/new asset/wujudkan-brand-bg.png"
                alt="Dreamlab Wujudkan Brand"
                title={getImageTitle("/new asset/wujudkan-brand-bg.png")}
                fill
                className="object-contain z-10"
                priority
                sizes="(max-width: 768px) 300px, 500px"
              />
              {/* Optional: Add a shadow or leaf-like decorative element if available */}
            </div>
          </motion.div>

          {/* Right: Content Section */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 md:pl-8"
          >
            <div className="space-y-2">
              <span className="text-[#BBBBBB] text-sm md:text-base font-medium tracking-wide">
                Dreamlab #JUARA FORMULA
              </span>
              <h2 className="text-[38px] md:text-[52px] lg:text-[80px] font-normal font-display text-brand-black leading-[1.05] tracking-tight">
                Wujudkan Brand <span className="text-brand-orange">Bersama Dreamlab</span>
              </h2>
            </div>

            <div className="space-y-6 text-[#666666] text-base md:text-lg leading-relaxed font-medium">
              <p>
                Dreamlab adalah perusahaan maklon kosmetik dengan layanan lengkap dari awal hingga akhir. Kami menawarkan <span className="font-bold text-brand-black">One Stop Maklon Service</span>, mulai dari konsultasi, pembuatan formula, desain kemasan, produksi, hingga pengurusan izin BPOM dan Halal.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
