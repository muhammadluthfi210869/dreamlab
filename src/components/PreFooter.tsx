"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import { openWARoundRobin } from "@/lib/wa-roundrobin";

const PreFooter = () => {
  return (
    <section 
      className="relative overflow-hidden bg-[#DCD1C1] min-h-[400px] md:min-h-[450px] flex items-center"
      style={{
        backgroundImage: 'url("/assets/images/prefooter-bg.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'right center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container-custom py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Content */}
          <div className="text-center lg:text-left z-10 lg:max-w-xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-[#333333] mb-4 leading-tight"
            >
              Wujudkan Brand Kosmetik<br className="hidden md:block" /> Impian Anda Bersama Ahlinya!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[#666666] text-base md:text-lg mb-10"
            >
              Dreamlab siap membantu dengan layanan maklon lengkap dari formulasi hingga legalitas
            </motion.p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <motion.button
                onClick={() => openWARoundRobin("Halo Dreamlab, saya ingin konsultasi pembuatan brand kosmetik")}
                whileHover={{ scale: 1.02 }}
                className="bg-[#F7941D] text-white px-6 py-3 rounded-md font-bold text-xs uppercase tracking-wider flex items-center gap-3 transition-colors hover:bg-orange-600"
              >
                Hubungi Tim Kami
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <FaChevronRight className="text-[8px]" />
                </span>
              </motion.button>

              <motion.div whileHover={{ scale: 1.02 }}>
                <Link
                  href="/product"
                  className="bg-[#222222] text-white px-6 py-3 rounded-md font-bold text-xs uppercase tracking-wider flex items-center gap-3 transition-colors hover:bg-black"
                >
                  Explore Catalog
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <FaChevronRight className="text-[8px]" />
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Right spacer for background woman */}
          <div className="hidden lg:block lg:w-[45%] h-[300px]" />
        </div>
      </div>
    </section>
  );
};

export default PreFooter;
