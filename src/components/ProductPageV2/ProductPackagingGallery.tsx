"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, Sparkles, Palette } from "lucide-react";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";
import Link from "next/link";

interface PackagingIcon {
  name: string;
  path: string;
  folder: string;
}

interface ProductPackagingGalleryProps {
  productSlug: string;
  categorySlug: string;
  productName: string;
}

const productToFolderMap: Record<string, Record<string, string>> = {
  skincare: {
    // Old flat slugs (for backward compatibility)
    "facial-serum": "facial-serum",
    "facial-toner": "facial-toner",
    "facial-wash": "face-wash",
    "facial-sunscreen": "sunscreen",
    "facial-moisturizer": "cream",
    "micellar-cleansing-gel": "cleansing",

    // Day & Night Cream
    "face-cream": "cream",
    "moisturizing-cream": "cream",
    "brightening-cream": "cream",
    "eye-cream": "cream",

    // Face Mask
    "peel-off-mask": "face-mask",
    "brightening-mask": "face-mask",
    "wash-off-mask": "face-mask",
    "sleeping-mask": "face-mask",

    // Sunscreen
    "physical-sunscreen": "sunscreen",
    "hybrid-sunscreen": "sunscreen",
    "chemical-sunscreen": "sunscreen",
    "tone-up-sunscreen": "sunscreen",
    "sunscreen-gel": "sunscreen",

    // Cleansing
    "face-cleansing-oil": "cleansing",
    "milk-cleanser": "cleansing",
    "cleansing-balm": "cleansing",
    "cleansing-oil": "cleansing",

    // Facial Wash
    "brightening-facial-wash": "face-wash",
    "acne-facial-wash": "face-wash",
    "moisturizing-facial-wash": "face-wash",

    // Facial Toner
    "acne-facial-toner": "facial-toner",
    "moisturizing-facial-toner": "facial-toner",
    "brightening-facial-toner": "facial-toner",

    // Facial Serum
    "serum-gel": "facial-serum",
    "radiant-advance-serum": "facial-serum",
    "acne-serum": "facial-serum",
    "peeling-serum": "facial-serum",
  },
};

const iconFiles: Record<string, string[]> = {
  "facial-serum": ["bottle.webp"],
  "facial-toner": ["bottle.webp"],
  "face-wash": ["bottle.webp"],
  sunscreen: ["bottle.webp"],
  cream: ["bottle.webp"],
  "face-mask": ["bottle.webp"],
  cleansing: ["bottle.webp"],
};

const folderToConfigMap: Record<string, { price: string; moq: string }> = {
  cream: { price: "Rp 15.000", moq: "1.000 Pcs" },
  "face-mask": { price: "Rp 10.000", moq: "2.000 Pcs" },
  sunscreen: { price: "Rp 16.000", moq: "1.000 Pcs" },
  cleansing: { price: "Rp 14.000", moq: "1.000 Pcs" },
  "face-wash": { price: "Rp 12.000", moq: "1.000 Pcs" },
  "facial-toner": { price: "Rp 12.000", moq: "1.000 Pcs" },
  "facial-serum": { price: "Rp 18.000", moq: "1.000 Pcs" },
};



const getPackagingIcons = (productSlug: string, categorySlug: string): PackagingIcon[] => {
  const folderMap = productToFolderMap[categorySlug];
  if (!folderMap) return [];

  const folderName = folderMap[productSlug];
  if (!folderName) return [];

  const files = iconFiles[folderName];
  if (!files) return [];

  // Map to PackagingIcon objects
  const allIcons = files.map((file) => ({
    name: file.replace(/\.(png|svg)$/i, "").replace(/-/g, " "),
    path: `/new asset/new-icon-packing-design/${file}`,
    folder: folderName,
  }));

  // Smart Reordering: find the icon that corresponds to the active product page and place it at index 0 (Featured)
  const sortedIcons = [...allIcons];
  const matchingIndex = sortedIcons.findIndex((icon) => {
    const iconNameNormalized = icon.name.toLowerCase().replace(/\s+/g, "-");
    const slugNormalized = productSlug.toLowerCase();
    
    return (
      iconNameNormalized.includes(slugNormalized) ||
      slugNormalized.includes(iconNameNormalized) ||
      // Special mappings for assets with slightly different names
      (slugNormalized === "face-cream" && iconNameNormalized.includes("facial-cream")) ||
      (slugNormalized === "micellar-cleansing-gel" && iconNameNormalized.includes("micellar-water")) ||
      (slugNormalized === "acne-facial-toner" && iconNameNormalized.includes("acne-facial-toner"))
    );
  });

  if (matchingIndex > 0) {
    const [matchingIcon] = sortedIcons.splice(matchingIndex, 1);
    sortedIcons.unshift(matchingIcon);
  }

  return sortedIcons;
};

export default function ProductPackagingGallery({ productSlug, categorySlug, productName }: ProductPackagingGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  const icons = getPackagingIcons(productSlug, categorySlug);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const checkScroll = () => {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
    };

    container.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => container.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.7;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (icons.length === 0) return null;

  const waUrl = `/thankyou/google/`;

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-[#F9F7F2] via-white to-[#F9F7F2]">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={{ opacity: opacityFade }}
          className="absolute top-20 -left-32 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl" 
        />
        <motion.div 
          style={{ opacity: opacityFade }}
          className="absolute bottom-20 -right-32 w-80 h-80 bg-[#212120]/3 rounded-full blur-3xl" 
        />
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #212120 1px, transparent 0)`,
          backgroundSize: "40px 40px"
        }} />
      </div>

      <div className="container-custom relative z-10">
        {/* Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 lg:mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-orange/30 to-brand-orange/30" />
            <motion.div 
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              className="flex items-center gap-2 px-4 py-2 bg-brand-orange/10 rounded-full border border-brand-orange/20"
            >
              <Palette className="w-4 h-4 text-brand-orange" />
              <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.25em]">Packaging Studio</span>
            </motion.div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-brand-orange/30 to-brand-orange/30" />
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#212120] mb-6 leading-tight"
            >
              Design Packaging yang{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-brand-orange">Bercerita</span>
                <motion.span
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "100%" } : {}}
                  transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-2 left-0 h-3 bg-brand-orange/10 -z-0"
                />
              </span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-[#212120]/60 max-w-2xl mx-auto leading-relaxed"
            >
              Setiap packaging adalah kanvas untuk brand Anda. Jelajahi koleksi design kami yang dapat dikustomisasi sepenuhnya.
            </motion.p>
          </div>
        </motion.div>

        {/* Carousel Container */}
        <motion.div
          style={{ y: yParallax }}
          className="relative"
        >
          {/* Scroll Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all duration-300 ${
                canScrollLeft
                  ? "border-[#212120]/20 bg-white hover:bg-brand-orange hover:border-brand-orange hover:text-white text-[#212120]/60"
                  : "border-[#212120]/10 bg-[#F3F3F3]/50 text-[#212120]/20 cursor-not-allowed"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all duration-300 ${
                canScrollRight
                  ? "border-[#212120]/20 bg-white hover:bg-brand-orange hover:border-brand-orange hover:text-white text-[#212120]/60"
                  : "border-[#212120]/10 bg-[#F3F3F3]/50 text-[#212120]/20 cursor-not-allowed"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Scrollable Track */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-8 px-4 snap-x snap-mandatory no-scrollbar"
            style={{ scrollBehavior: "smooth" }}
          >
            {icons.map((icon, index) => {
              const isFeatured = index === 0;
              const isHovered = hoveredIndex === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`snap-center flex-shrink-0 relative group cursor-pointer ${
                    isFeatured ? "w-[280px] md:w-[320px]" : "w-[240px] md:w-[280px]"
                  }`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className={`relative flex flex-col bg-white p-4 rounded-[28px] border border-gray-100 transition-all duration-500 h-full ${
                    isHovered 
                      ? "shadow-xl shadow-brand-orange/5 -translate-y-1.5" 
                      : "shadow-md shadow-[#212120]/3"
                  }`}>
                    {/* Visual Container - Premium Warm Sand Backdrop */}
                    <div className={`relative w-full rounded-[20px] overflow-hidden flex items-center justify-center mb-4 bg-[#FAF9F6] border border-gray-100 ${
                      isFeatured ? "aspect-[4/5]" : "aspect-square"
                    }`}>
                      <div className="absolute inset-0 bg-gradient-to-tr from-neutral-100/5 via-transparent to-transparent" />
                      
                      {/* Featured Badge */}
                      {isFeatured && (
                        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 bg-brand-orange/10 backdrop-blur-sm rounded-full border border-brand-orange/20">
                          <Sparkles className="w-2.5 h-2.5 text-brand-orange" />
                          <span className="text-[8px] font-black text-brand-orange uppercase tracking-wider">Featured</span>
                        </div>
                      )}

                      <div className={`relative w-4/5 h-4/5 transition-transform duration-500 flex items-center justify-center ${
                        isHovered ? "scale-108" : "scale-100"
                      }`}>
                        <Image
                          src={icon.path}
                          alt={getImageAlt(icon.path, icon.name)}
                          title={getImageTitle(icon.path)}
                          fill
                          sizes={isFeatured ? "(max-w: 768px) 70vw, 300px" : "(max-w: 768px) 50vw, 250px"}
                          className="object-contain p-2"
                          priority={index < 2}
                        />
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="flex flex-col flex-grow">
                      <h4 className="font-onest text-sm md:text-base font-bold text-[#212120] leading-snug tracking-tight flex-grow transition-colors duration-300 group-hover:text-brand-orange min-h-[40px] flex items-center">
                        {icon.name}
                      </h4>

                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 lg:mt-20 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-8 lg:p-10 bg-white rounded-3xl shadow-xl shadow-[#212120]/5 border border-[#F3F3F3]">
            <div className="text-left">
              <h3 className="text-xl lg:text-2xl font-bold text-[#212120] mb-2">
                Punya design sendiri?
              </h3>
              <p className="text-sm text-[#212120]/60 max-w-md">
                Tim design kami siap membantu merealisasikan visi packaging brand Anda dari konsep hingga produksi.
              </p>
            </div>
            <Link
              href={waUrl}
              className="group flex items-center gap-3 bg-brand-orange hover:bg-[#212120] text-white font-bold py-4 px-8 rounded-xl transition-all duration-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex-shrink-0"
            >
              <span className="text-[10px] uppercase tracking-[0.2em]">Konsultasi Design</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </motion.div>

        {/* Trust Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-[#212120]/40 italic">
            {icons.length}+ design tersedia · 100% dapat dikustomisasi · Termasuk artwork & printing
          </p>
        </motion.div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
