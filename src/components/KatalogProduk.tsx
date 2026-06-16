"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";

interface KatalogProps {
  title: string;
  categories?: {
    id: string;
    name: string;
    items: { name: string; src: string }[];
  }[];
}

const visualCategories = [
  {
    id: "skincare",
    name: "Skincare",
    tag: "15+ Formula Premium",
    image: "/new asset/skincare&facecare/cleansing-oill.webp",
    subcategories: "Day & Night Cream • Sunscreen • Facial Wash • Face Serum • Masker",
    link: "/produk/skincare"
  },
  {
    id: "bodycare",
    name: "Body Care",
    tag: "20+ Formula Premium",
    image: "/new asset/bodycare/body-scrub.webp",
    subcategories: "Body Scrub • Body Lotion • Body Butter • Shower Gel • Bath Salt",
    link: "/produk/bodycare"
  },
  {
    id: "haircare",
    name: "Hair Care",
    tag: "10+ Formula Premium",
    image: "/new asset/haircare/shampoo.webp",
    subcategories: "Shampoo • Conditioner • Hair Mask • Pomade • Beard Serum",
    link: "/produk/haircare"
  },
  {
    id: "decorative",
    name: "Decorative (Makeup)",
    tag: "12+ Formula Premium",
    image: "/new asset/lipcare/lip-cream.webp",
    subcategories: "Lip Matte • Lip Cream • Foundation • Cushion • Face Primer",
    link: "/produk/decorative"
  },
  {
    id: "babycare",
    name: "Baby Care",
    tag: "8+ Formula Premium",
    image: "/new asset/baby-care/baby-cologne.webp",
    subcategories: "Baby Oil • Baby Cologne • Shampoo Baby • Baby Wash • Lotion",
    link: "/produk/babycare"
  },
  {
    id: "parfum",
    name: "Parfum & Fragrance",
    tag: "15+ Signature Scent",
    image: "/new asset/parfum/edpp.webp",
    subcategories: "Extrait de Parfum • Eau de Parfum • Eau de Toilette • Body Mist",
    link: "/produk/parfum"
  },
  {
    id: "footcare",
    name: "Foot Care & Special Care",
    tag: "10+ Formula Premium",
    image: "/new asset/footcare/Footcream-maklon .png",
    subcategories: "Foot Cream • Foot Scrub • Underarm Cream • Soothing Gel",
    link: "/produk/footcare"
  }
];

// Elite Custom Easing Curve (Apple / Tom Ford Premium Ease-Out)
const premiumEase = [0.16, 1, 0.3, 1] as any;

export default function KatalogProduk({ title }: KatalogProps) {
  
  // Container stagger animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  // Staggered Spring reveals for cards
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 85,
        damping: 20
      }
    }
  };

  return (
    <section id="katalog" className="py-20 lg:py-28 bg-[#FDFCF9] relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-orange/[0.03] rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-orange/[0.02] rounded-full blur-[140px] pointer-events-none translate-y-1/2" />

      <div className="container-custom relative z-10">
        
        {/* Header Section - Elegant Slide Down */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: premiumEase }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto text-center mb-16 lg:mb-20"
        >
          <span className="text-[11px] font-bold tracking-[0.2em] text-brand-orange uppercase bg-brand-orange/10 px-4 py-1.5 rounded-full inline-block mb-4 shadow-sm border border-brand-orange/10">
            Formulasi Eksklusif & CPKB Grade A
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight text-brand-black mb-6 uppercase">
            Katalog Layanan <span className="text-brand-orange">Maklon Premium</span>
          </h2>
          <div className="h-[2px] w-20 bg-brand-orange/40 mx-auto mb-6 rounded-full" />
          <p className="text-sm md:text-base text-gray-600 leading-relaxed font-medium">
            Dari formulasi riset laboratorium (R&D) kustom, visualisasi desain branding eksklusif, hingga pendaftaran legalitas resmi BPOM, Halal, & HKI — kami mewujudkan brand kecantikan juara Anda tanpa batas.
          </p>
        </motion.div>

        {/* Visual 8-Category Portal Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {visualCategories.map((category) => (
            <Link 
              key={category.id}
              href={category.link}
              className="block group"
            >
              <motion.div 
                variants={cardVariants}
                whileHover={{ 
                  y: -8, 
                  scale: 1.015, 
                  transition: { duration: 0.45, ease: premiumEase } 
                }}
                className="relative overflow-hidden aspect-[4/5] rounded-[2rem] border border-gray-100/60 shadow-[0_12px_35px_rgba(0,0,0,0.015)] group-hover:shadow-[0_22px_50px_rgba(33,33,32,0.065)] transition-shadow duration-500 bg-white cursor-pointer"
              >
                {/* Background Product Image - slow Focusing zoom on hover */}
                <Image
                  src={category.image}
                  alt={`Maklon ${category.name}`}
                  title={getImageTitle(category.image)}
                  fill
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-108"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {/* Dark Vignette Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent z-10 transition-opacity duration-500 group-hover:from-neutral-950 group-hover:via-neutral-950/50" />

                {/* Card Content (Aligned to Bottom) */}
                <div className="absolute bottom-0 inset-x-0 p-6 lg:p-7 z-20 flex flex-col justify-end min-h-[50%]">
                  
                  {/* Category Tag - slides down and fades in on hover */}
                  <span className="text-[10px] font-bold text-brand-orange tracking-widest uppercase mb-2 block transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-75">
                    {category.tag}
                  </span>

                  {/* Title & Chevron Indicator */}
                  <div className="flex justify-between items-center mb-2.5">
                    <h3 className="text-lg lg:text-xl font-bold font-onest text-white tracking-wide uppercase transition-colors duration-300 group-hover:text-brand-orange">
                      {category.name}
                    </h3>
                    
                    {/* Glassmorphic Chevron Arrow - scales and changes color on hover */}
                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-500 group-hover:bg-brand-orange group-hover:border-brand-orange group-hover:scale-110 shadow-inner">
                      <ArrowUpRight size={15} className="text-white transform transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* Subcategories (Bullet point layout) - slides up slightly on hover */}
                  <p className="text-[11px] text-neutral-300/80 font-medium leading-relaxed tracking-wide group-hover:text-white transition-all duration-500 transform translate-y-1 group-hover:translate-y-0">
                    {category.subcategories}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>


      </div>
    </section>
  );
}
