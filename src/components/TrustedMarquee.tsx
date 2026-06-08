"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";

interface TrustedMarqueeProps {
  title: string;
  subtitle?: string;
  logos: { name: string; src: string }[];
}

export default function TrustedMarquee({ title, subtitle, logos }: TrustedMarqueeProps) {
  return (
    <section className="py-28 lg:py-36 bg-white overflow-hidden">
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto mb-20">
          {/* Main Title - Orange & Large */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[32px] md:text-[48px] lg:text-[56px] font-extrabold font-display uppercase tracking-tight text-brand-orange leading-tight mb-8"
          >
            {title}
          </motion.h2>

          {/* Subtitle - Centered & Gray */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[#777777] text-[16px] md:text-[18px] lg:text-[20px] font-text leading-[1.7] font-medium"
            >
              {subtitle.split('500+').map((part, i) => (
                <span key={i}>
                  {i === 0 ? part : <><span className="font-bold text-brand-black">500+</span>{part}</>}
                </span>
              ))}
            </motion.p>
          )}
        </div>
      </div>

      {/* Infinite Marquee Wrapper */}
      <div className="relative flex overflow-x-hidden mt-12">
        <motion.div
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            ease: "linear",
            duration: 35,
            repeat: Infinity,
          }}
          className="flex w-max"
        >
          {/* First set of logos */}
          <div className="flex gap-x-32 lg:gap-x-40 items-center px-16 lg:px-24">
            {logos.map((logo, idx) => (
              <div key={`set1-${idx}`} className="flex-shrink-0 flex items-center justify-center h-40 md:h-52 lg:h-64 min-w-[280px] md:min-w-[320px]">
                <Image
                  src={logo.src}
                  alt={getImageAlt(logo.src, logo.name)}
                  title={getImageTitle(logo.src)}
                  width={380}
                  height={200}
                  className="max-h-full w-auto object-contain transition-transform duration-500 hover:scale-110"
                />
              </div>
            ))}
          </div>
          {/* Second set of logos for seamless loop */}
          <div className="flex gap-x-32 lg:gap-x-40 items-center px-16 lg:px-24">
            {logos.map((logo, idx) => (
              <div key={`set2-${idx}`} className="flex-shrink-0 flex items-center justify-center h-40 md:h-52 lg:h-64 min-w-[280px] md:min-w-[320px]">
                <Image
                  src={logo.src}
                  alt={getImageAlt(logo.src, logo.name)}
                  title={getImageTitle(logo.src)}
                  width={380}
                  height={200}
                  className="max-h-full w-auto object-contain transition-transform duration-500 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
