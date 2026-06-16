"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { getImageAlt, getImageTitle } from '@/lib/image-utils';

interface ProductWhyUsProps {
  categorySlug?: string;
}

const wcuImages = [
  '/new asset/produk/parfum/card1_wcu.webp',
  '/new asset/produk/parfum/card2-wcu.webp',
  '/new asset/produk/parfum/card3-wcu.webp',
  '/new asset/produk/parfum/card4-wcu.webp',
];

const sellingPointsByCategory: Record<string, { id: string; title: string; image: string }[]> = {
  skincare: [
    { id: '01', title: 'Formulasi yang Diuji Klinis', image: wcuImages[0] },
    { id: '02', title: 'Packaging Premium', image: wcuImages[1] },
    { id: '03', title: 'Margin Kompetitif', image: wcuImages[2] },
    { id: '04', title: 'Branding yang Mengesankan', image: wcuImages[3] },
  ],
  bodycare: [
    { id: '01', title: 'Formula Spa-Grade', image: wcuImages[0] },
    { id: '02', title: 'Kemasan Elegan', image: wcuImages[1] },
    { id: '03', title: 'Biaya Terjangkau', image: wcuImages[2] },
    { id: '04', title: 'Tampilan Mewah', image: wcuImages[3] },
  ],
  haircare: [
    { id: '01', title: 'Formulasi untuk Iklim Tropis', image: wcuImages[0] },
    { id: '02', title: 'Kemasan Praktis', image: wcuImages[1] },
    { id: '03', title: 'Skalabilitas Bisnis', image: wcuImages[2] },
    { id: '04', title: 'Desain yang Trustworthy', image: wcuImages[3] },
  ],
  babycare: [
    { id: '01', title: 'Aman untuk Newborn', image: wcuImages[0] },
    { id: '02', title: 'Kemasan Aman & Praktis', image: wcuImages[1] },
    { id: '03', title: 'Investasi Terjangkau', image: wcuImages[2] },
    { id: '04', title: 'Desain yang Trustworthy', image: wcuImages[3] },
  ],
  parfum: [
    { id: '01', title: '500+ Fragrance Library', image: wcuImages[0] },
    { id: '02', title: 'Akses Botol Premium', image: wcuImages[1] },
    { id: '03', title: 'Margin Tinggi', image: wcuImages[2] },
    { id: '04', title: 'Finishing Eksklusif', image: wcuImages[3] },
  ],
  decorative: [
    { id: '01', title: 'Ultra-Pigmentasi', image: wcuImages[0] },
    { id: '02', title: 'Packaging Modern', image: wcuImages[1] },
    { id: '03', title: 'Harga Kompetitif', image: wcuImages[2] },
    { id: '04', title: '1000+ Custom Shades', image: wcuImages[3] },
  ],
  pkrt: [
    { id: '01', title: 'Formulasi yang Diuji Klinis', image: wcuImages[0] },
    { id: '02', title: 'Packaging Premium', image: wcuImages[1] },
    { id: '03', title: 'Margin Kompetitif', image: wcuImages[2] },
    { id: '04', title: 'Branding yang Mengesankan', image: wcuImages[3] },
  ],
  footcare: [
    { id: '01', title: 'Formulasi yang Diuji Klinis', image: wcuImages[0] },
    { id: '02', title: 'Packaging Premium', image: wcuImages[1] },
    { id: '03', title: 'Margin Kompetitif', image: wcuImages[2] },
    { id: '04', title: 'Branding yang Mengesankan', image: wcuImages[3] },
  ],
};

const testimonialsByCategory: Record<string, { quote: string; name: string; brand: string }[]> = {
  skincare: [
    { quote: "Produk serum kami langsung jadi best seller setelah launch. Konsumen suka tekstur ringan dan hasil nyata dalam 2 minggu.", name: "Jessica", brand: "GlowUp Beauty" },
    { quote: "Tim R&D Dreamlab sangat memahami kulit Indonesia. Bukan sekadar follow tren, tapi benar-benar formulasi yang sesuai.", name: "Amanda", brand: "SkinRev Indonesia" },
    { quote: "Margin kami sangat kompetitif. Dengan kualitas premium ini, kami bisa price di range yang menarik konsumen.", name: "Reza", brand: "DermaCare Indonesia" },
  ],
  bodycare: [
    { quote: "Body butter Dreamlab jadi produk paling laris. Teksturnya kaya tapi tidak lengket — konsumen langsung merasa value for money.", name: "Maya", brand: "Velvet Skin Indonesia" },
    { quote: "Aroma signature produk kami sekarang berbeda dari kompetitor. Tidak ada yang punya fragrance seperti ini.", name: "Sari", brand: "Spa Natur Indonesia" },
    { quote: "Kemasan mereka benar-benar elevate brand kami. Dari yang sederhana jadi terlihat premium.", name: "Dian", brand: "Luxe Body Care" },
  ],
  haircare: [
    { quote: "Hair mask dari Dreamlab menyelamatkan klien kami yang rambutnya rusak. Sekarang mereka loyal karena hasil yang nyata.", name: "Budi", brand: "Silk Lock Indonesia" },
    { quote: "Produk haircare kami tidak terasa oily meskipun di iklim tropis. Teksturnya ringan tapi tetap efektif.", name: "Ratna", brand: "HairJoy Indonesia" },
    { quote: "Sangat mudah bekerja sama. Timnya responsive dan hasil produknya konsisten dari batch ke batch.", name: "Sarah", brand: "Mane Masters Indonesia" },
  ],
  babycare: [
    { quote: "Anak saya tidak pernah mengalami iritasi meski pakai everyday. Kulitnya tetap sehat.", name: "Dewi", brand: "Orang Tua (Jakarta)" },
    { quote: "Kemasan mereka sangat thoughtful untuk ibu-ibu. Ada child-proof cap-nya, cara pakainya mudah.", name: "Andi", brand: "Ortucia Indonesia" },
    { quote: "Di komunitas ibu-ibu tempat saya aktif, brand yang pakai Dreamlab langsung dianggap trusted.", name: "Lisa", brand: "BabyZone Indonesia" },
  ],
  parfum: [
    { quote: "Aroma EDP kami diakui setara brand internasional. Sillage-nya kuat dan tahan 8+ jam di cuaca Jakarta.", name: "Nadia", brand: "Fleur Indonesia" },
    { quote: "Tim Dreamlab sangat sabar membantu kami menemukan signature scent. Launch langsung sold out dalam seminggu.", name: "Raka", brand: "Aromatic Co." },
    { quote: "Tidak ada biaya tersembunyi. Semua jelas dari awal — formula, packaging, labeling, BPOM, Halal.", name: "Anisa", brand: "Essence Jakarta" },
  ],
  decorative: [
    { quote: "Lip matte kami jadi best seller karena warnanya vibrant dan tidak membuat bibir kering.", name: "Putri", brand: "Luxe Lips Indonesia" },
    { quote: "Shade untuk kulit sawo matang tersedia lengkap. Hasilnya dewy alami, tidak berminyak.", name: "Amel", brand: "Glow Beauty Indonesia" },
    { quote: "Color matching mereka sangat akurat. Kami kasih referensi dari foto, hasilnya langsung match.", name: "Cindy", brand: "MakeUp First Indonesia" },
  ],
  pkrt: [
    { quote: "Produk hand sanitizer kami langsung jadi best seller. Kualitasnya setara brand internasional.", name: "Budi", brand: "CleanCare Indonesia" },
    { quote: "Kemasan premium dengan harga factory langsung. Sangat menguntungkan untuk brand kami.", name: "Rina", brand: "Hygiene Pro Indonesia" },
    { quote: "Timnya sangat profesional. Mulai dari formulasi hingga legalitas semua ditangani dengan baik.", name: "Doni", brand: "Sanimax Indonesia" },
  ],
  footcare: [
    { quote: "Foot cream kami sangat efektif untuk kulit kaki kering. Konsumen repeat order terus.", name: "Siti", brand: "FootCare Indonesia" },
    { quote: "Formulasi yang sesuai dengan iklim Indonesia. Produk tidak mudah rusak meski disimpan di suhu ruangan.", name: "Hendra", brand: "SoleMate Indonesia" },
    { quote: "Kemasan praktis dan desain yang menarik. Konsumen第一印象 sangat positif.", name: "Maya", brand: "HappyFeet Indonesia" },
  ],
};

export default function ProductWhyUs({ categorySlug = 'parfum' }: ProductWhyUsProps) {
  const reasons = sellingPointsByCategory[categorySlug] || sellingPointsByCategory['parfum'];
  const testimonials = testimonialsByCategory[categorySlug] || testimonialsByCategory['parfum'];
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="relative z-10 bg-white pt-24 lg:pt-32 pb-12 lg:pb-16 overflow-hidden"
    >
      {/* Brand Decorative Elements - Lavender Mist */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#F8F8FF]/50 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="flex flex-col gap-20">
          
          {/* Header Area - Clean & Authoritative */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="max-w-4xl space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-[3px] bg-brand-orange"></div>
              <span className="text-xs font-black text-brand-orange uppercase tracking-[0.4em]">
                Strategic Manufacturing Partner
              </span>
            </div>
            <h2 className="font-display text-[38px] lg:text-[80px] font-normal text-[#212120] leading-[1.05] tracking-tighter uppercase">
              Mengapa Brand Besar <br />
              <span className="text-brand-orange">Memilih Dreamlab?</span>
            </h2>
          </motion.div>

          {/* High-Key Floating Grid - Z-Pattern on Mobile, 4-Cols on Desktop */}
          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 lg:gap-8">
            {reasons.map((reason, index) => (
              <motion.div 
                key={reason.id} 
                variants={{
                  hidden: { opacity: 0, x: index % 2 === 0 ? -40 : 40 },
                  show: { opacity: 1, x: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 } }
                }}
                className={`group relative flex ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"} lg:flex-col items-center lg:items-stretch bg-white rounded-[1.5rem] lg:rounded-[2.5rem] p-4 lg:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] lg:shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-50 transition-all duration-700 hover:shadow-[0_30px_70px_rgba(246,145,30,0.1)] lg:hover:-translate-y-2 overflow-hidden`}
              >
                {/* Visual Area - Adaptive for Mobile & Desktop */}
                <div className="relative w-24 h-24 lg:w-full lg:h-full lg:aspect-square lg:absolute lg:inset-0 z-0 flex-shrink-0 lg:flex-shrink-1 overflow-hidden rounded-[1rem] lg:rounded-none lg:opacity-40 lg:group-hover:opacity-100 transition-all duration-1000 grayscale lg:grayscale group-hover:grayscale-0">
                  <Image
                    src={reason.image}
                    alt={getImageAlt(reason.image, reason.title)}
                    title={getImageTitle(reason.image)}
                    fill
                    className="object-cover"
                  />
                  {/* Desktop Only: Soft White Gradient for Readability */}
                  <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                </div>

                {/* Content Area */}
                <div className="relative z-10 flex flex-col flex-grow px-4 lg:px-0 lg:mt-auto space-y-2 lg:space-y-4">
                  {/* Logic Marker - Identity */}
                  <div className="flex justify-between items-start mb-1 lg:mb-0">
                    <span className="font-mono text-[8px] lg:text-[10px] font-black text-brand-orange/40 group-hover:text-brand-orange transition-colors">
                      PILLAR_{reason.id}
                    </span>
                    <div className="hidden lg:flex w-8 h-8 rounded-full border border-gray-100 items-center justify-center text-[#212120] group-hover:bg-brand-orange group-hover:text-white group-hover:border-brand-orange transition-all duration-500 shadow-sm">
                      <span className="text-[10px] font-black">{reason.id}</span>
                    </div>
                  </div>

                  <div className="hidden lg:block w-6 h-[2px] bg-brand-orange/20 group-hover:w-12 group-hover:bg-brand-orange transition-all duration-500"></div>
                  
                   <h3 className="font-onest text-[11px] lg:text-2xl font-black text-[#212120] leading-tight tracking-tighter uppercase transition-colors">
                    {reason.title}
                  </h3>
                </div>

                {/* Desktop Decorative Corner */}
                <div className="hidden lg:block absolute bottom-0 right-0 w-12 h-12 bg-brand-orange/5 translate-x-6 translate-y-6 rotate-45 group-hover:bg-brand-orange/10 transition-colors" />
              </motion.div>
            ))}
          </div>

          {/* Testimonials Section */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 } }
            }}
            className="mt-16"
          >
            <div className="text-center mb-12">
              <h3 className="font-onest text-2xl lg:text-4xl font-black text-[#212120] tracking-tighter uppercase">
                Apa Kata Mereka?
              </h3>
              <div className="w-24 h-1.5 bg-brand-orange mx-auto rounded-full mt-4" />
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: index * 0.15 } }
                  }}
                  className="bg-[#F9F7F2] rounded-2xl p-6 lg:p-8 border border-gray-100"
                >
                  <svg className="w-10 h-10 text-brand-orange/20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-brand-black text-base lg:text-lg leading-relaxed italic mb-6">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center">
                      <span className="text-brand-orange font-bold text-sm">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-brand-black text-sm">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-brand-black/60">
                        {testimonial.brand}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>



        </div>
      </div>
    </motion.section>
  );
}
