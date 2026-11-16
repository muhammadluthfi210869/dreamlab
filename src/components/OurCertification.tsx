"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface OurCertificationProps {
  alt?: string;
  title?: string;
}

export default function OurCertification({
  alt = "Our Certifications - HSA, Kementerian Kesehatan RI, Sertifikat CPKB, Vegan, Badan POM",
  title = "Sertifikasi Resmi Dreamlab",
}: OurCertificationProps) {
  return (
    <section className="w-full bg-[#F4F8FC] overflow-hidden leading-none select-none">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, amount: 0.2 }}
        className="w-full"
      >
        <Image
          src="/assets/images/home/our-certifications.jpg"
          alt={alt}
          title={title}
          width={1920}
          height={640}
          className="w-full h-auto object-cover block"
          sizes="100vw"
          priority
        />
      </motion.div>
    </section>
  );
}
