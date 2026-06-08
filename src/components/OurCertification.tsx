"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";

export default function OurCertification() {
  return (
    <section className="w-full bg-[#FAF9F5] overflow-hidden leading-none select-none">
      <motion.div
        initial={{ opacity: 0.9, y: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="w-full"
      >
        <Image
          src="/new asset/banner-bawah.webp"
          alt="Sertifikasi Resmi Dreamlab CPKB BPOM Halal Kemenkumham"
          title={getImageTitle("/new asset/banner-bawah.webp")}
          width={1920}
          height={800}
          className="w-full h-auto object-contain block"
          sizes="100vw"
          priority
        />
      </motion.div>
    </section>
  );
}
