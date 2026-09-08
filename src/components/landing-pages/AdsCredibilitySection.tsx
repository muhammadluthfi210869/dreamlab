'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface AdsCredibilitySectionProps {
  channel?: 'google-ads' | 'metaads';
  ctaHref?: string;
  className?: string;
  bgLight?: boolean;
}

export function AdsCredibilitySection({
  channel = 'google-ads',
  ctaHref,
  className = '',
  bgLight = true,
}: AdsCredibilitySectionProps) {
  const targetHref =
    ctaHref ||
    (channel === 'metaads'
      ? '/ads/thankyou/metaads/'
      : '/ads/thankyou/google-ads/');

  return (
    <section
      className={`py-12 md:py-16 ${
        bgLight ? 'bg-[#FAF9F6]' : 'bg-white'
      } relative z-10 ${className}`}
    >
      <div className="container-custom max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative group block"
        >
          <Link
            href={targetHref}
            className="block relative rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-neutral-200/80 transition-all duration-500 hover:-translate-y-1 bg-white"
            aria-label="Konsultasi Pabrik Maklon Bersertifikat Halal, BPOM, dan DJKI"
          >
            <div className="relative w-full aspect-[16/9]">
              <Image
                src="/assets/images/dreamlab-sertifikasi-pabrik-maklon.webp"
                alt="Dreamlab adalah Pabrik Maklon yang Sudah Bersertifikat - Halal Indonesia, DJKI Kemenkumham, dan BPOM"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1024px"
                className="object-cover object-center transform transition-transform duration-700 group-hover:scale-[1.015]"
                priority={false}
              />
            </div>

            {/* Subtle glow / hover border effect */}
            <div className="absolute inset-0 rounded-2xl md:rounded-3xl ring-1 ring-inset ring-black/5 pointer-events-none group-hover:ring-brand-orange/40 transition-colors duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default AdsCredibilitySection;
