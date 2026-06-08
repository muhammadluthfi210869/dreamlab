"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRightCircle } from "lucide-react";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";

interface OneStopProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
  ctaLink: string;
}

export default function OneStopSection({ title, subtitle, description, image, cta, ctaLink }: OneStopProps) {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Image Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative aspect-[4/3] w-full rounded-[20px] overflow-hidden shadow-2xl">
              <Image 
                src={image}
                alt="Production Line"
                title={getImageTitle(image)}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 600px"
              />
            </div>
          </motion.div>

          {/* Text Column */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2 space-y-8"
          >
            <div className="space-y-0">
              <h2 className="text-[38px] md:text-[52px] lg:text-[80px] font-normal font-display leading-[1.05] tracking-tight text-brand-black normal-case">
                One Stop Maklon<br />
                Kosmetik <span className="text-brand-orange">Dari ide<br />
                hingga siap jual</span>
              </h2>
            </div>

            <p className="text-[#777777] text-[15px] md:text-[16px] leading-[1.8] font-normal max-w-xl">
              {description.split(/(perusahaan maklon kosmetik terpercaya|500\+ Brand|nilai jual tinggi di pasar)/).map((part, i) => (
                <span key={i} className={
                  part === "perusahaan maklon kosmetik terpercaya" || 
                  part === "500+ Brand" || 
                  part === "nilai jual tinggi di pasar" ? "font-bold text-brand-black" : ""
                }>
                  {part}
                </span>
              ))}
            </p>

            <div className="pt-4">
              <a 
                href={ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-brand-orange text-white px-7 py-3.5 rounded-full font-black text-[12px] tracking-widest hover:bg-brand-black transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-brand-orange/10"
              >
                {cta}
                <ArrowRightCircle className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
