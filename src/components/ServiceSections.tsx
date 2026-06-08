"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { serviceCategories, ServiceCategory } from "@/data/services";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";
import { 
  VIEWPORT_ONCE, 
  fadeInLeft, 
  fadeInRight, 
  fadeInUp, 
  staggerContainer, 
  staggerItemUp 
} from "@/lib/animations";

export function ServiceHero() {
  const [activeTab, setActiveTab] = useState(serviceCategories[0].id);
  const activeCategory = serviceCategories.find((c) => c.id === activeTab) || serviceCategories[0];
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  
  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setCurrentPage(0);
  };
  
  const totalPages = Math.ceil(activeCategory.items.length / itemsPerPage);
  const currentItems = activeCategory.items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <section className="pt-40 pb-24 bg-brand-white overflow-hidden">
      <div className="container-custom space-y-16">
        {/* Title */}
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-brand-orange normal-case"
          >
            Jasa Maklon Kosmetik BPOM & Halal Terlengkap
          </motion.h1>
        </div>

        {/* Tabs Navigation */}
        <div className="flex overflow-x-auto no-scrollbar gap-8 justify-start lg:justify-center border-b border-gray-100">
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleTabChange(category.id)}
              className={`whitespace-nowrap pb-6 px-2 text-sm md:text-base font-bold uppercase tracking-wider transition-all relative ${
                activeTab === category.id ? "text-brand-orange" : "text-brand-black/40 hover:text-brand-black"
              }`}
            >
              {category.name === "Skincare" ? "SKINCARE / FACE CARE" : category.name.toUpperCase()}
              {activeTab === category.id && (
                <motion.div 
                  layoutId="activeServiceTab"
                  className="absolute bottom-0 left-[-10%] right-[-10%] h-1 bg-brand-orange"
                />
              )}
            </button>
          ))}
        </div>

        {/* Carousel Content */}
        <div className="space-y-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${currentPage}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {currentItems.map((item, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="aspect-square relative rounded-[2rem] overflow-hidden bg-white shadow-sm border border-gray-50 mb-4 transition-transform duration-500 group-hover:scale-[1.02]">
                    <Image 
                      src={item.image}
                      alt={getImageAlt(item.image, item.title)}
                      title={getImageTitle(item.image)}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-3">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentPage === idx ? "bg-brand-black w-8" : "bg-gray-200 hover:bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServiceCategoryTabs() {
  const [activeTab, setActiveTab] = useState(serviceCategories[0].id);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeCategory = serviceCategories.find((c) => c.id === activeTab) || serviceCategories[0];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container-custom">
        {/* Tabs Navigation */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto pb-8 mb-16 no-scrollbar gap-4 md:gap-8 justify-start lg:justify-center border-b border-brand-black/5"
        >
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`whitespace-nowrap px-6 py-4 text-sm md:text-base font-black uppercase tracking-widest transition-all relative ${
                activeTab === category.id ? "text-brand-orange" : "text-brand-black/40 hover:text-brand-black"
              }`}
            >
              {category.name}
              {activeTab === category.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-brand-orange"
                />
              )}
            </button>
          ))}
        </div>

        {/* Category Content (Carousel) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <ServiceItemsCarousel category={activeCategory} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function ServiceItemsCarousel({ category }: { category: ServiceCategory }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group">
      <div 
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-10"
      >
        {category.items.map((item, idx) => (
          <div 
            key={idx}
            className="min-w-[280px] md:min-w-[320px] lg:min-w-[380px] snap-center"
          >
            <div className="bg-white rounded-[40px] p-8 border border-gray-100 hover:border-brand-orange/20 transition-all group/item overflow-hidden h-full flex flex-col items-center text-center shadow-sm">
              <div className="relative w-full aspect-square mb-8 rounded-[32px] overflow-hidden bg-brand-white/50">
                <Image 
                  src={item.image}
                  alt={getImageAlt(item.image, item.title)}
                  title={getImageTitle(item.image)}
                  fill
                  className="object-contain p-4 transition-transform duration-700 group-hover/item:scale-110"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-onest text-brand-black uppercase leading-tight mb-4">
                {item.title}
              </h3>
              <div className="w-12 h-1 bg-brand-orange/20 group-hover/item:w-20 group-hover/item:bg-brand-orange transition-all duration-500" />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -left-4 -translate-y-1/2 md:-left-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
        <button 
          onClick={() => scroll("left")}
          className="w-16 h-16 rounded-full bg-white shadow-2xl flex items-center justify-center text-brand-black hover:text-brand-orange transition-all active:scale-90"
        >
          <ChevronLeft size={32} />
        </button>
      </div>
      <div className="absolute top-1/2 -right-4 -translate-y-1/2 md:-right-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
        <button 
          onClick={() => scroll("right")}
          className="w-16 h-16 rounded-full bg-white shadow-2xl flex items-center justify-center text-brand-black hover:text-brand-orange transition-all active:scale-90"
        >
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  );
}

export function ServicePromoCarousel() {
  const promos = [
    { 
      src: "https://dreamlab.id/wp-content/uploads/al_opt_content/IMAGE/dreamlab.id/wp-content/uploads/2025/09/1.webp.bv.webp?bv_host=dreamlab.id",
      title: "The Expert Parfume Product",
      cta: "FREE KONSULTASI + SAMPEL",
      id: 1
    },
    { 
      src: "https://dreamlab.id/wp-content/uploads/al_opt_content/IMAGE/dreamlab.id/wp-content/uploads/2025/09/2.webp.bv.webp?bv_host=dreamlab.id",
      title: "Juaranya Formula",
      subtitle: "Make Your Skincare Brand With Us",
      cta: "MULAI BISNIS MU SEKARANG",
      id: 2
    },
    { 
      src: "https://dreamlab.id/wp-content/uploads/al_opt_content/IMAGE/dreamlab.id/wp-content/uploads/2025/09/3.webp.bv.webp?bv_host=dreamlab.id",
      title: "BE YOUR OWN BOSS SKINCARE",
      subtitle: "Mulai Bisnis Kosmetikmu Sekarang",
      cta: "FREE Konsultasi",
      id: 3
    },
  ];

  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <section className="py-24 bg-brand-white overflow-hidden">
      <div className="container-custom">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display text-brand-black leading-tight normal-case"
          >
            <span className="text-brand-orange">Let&apos;s</span> Create Your Skincare Business with <span className="text-brand-orange font-bold">DreamLab</span>
          </motion.h2>
        </div>

        <div className="relative flex justify-center items-center gap-4 lg:gap-10">
          {/* Navigation Arrows */}
          <button className="absolute left-0 lg:left-10 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-brand-black">
            <ChevronLeft size={32} />
          </button>
          <button className="absolute right-0 lg:right-10 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-brand-black">
            <ChevronRight size={32} />
          </button>

          {promos.map((promo, idx) => (
            <motion.div
              key={promo.id}
              animate={{
                scale: activeIndex === idx ? 1 : 0.85,
                opacity: activeIndex === idx ? 1 : 0.5,
                zIndex: activeIndex === idx ? 10 : 0
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`relative rounded-[2rem] overflow-hidden shadow-2xl cursor-pointer transition-all duration-500 ${
                activeIndex === idx ? "w-[45%] aspect-square" : "w-[30%] aspect-square"
              }`}
              onClick={() => setActiveIndex(idx)}
            >
              <Image 
                src={promo.src}
                alt={getImageAlt(promo.src, promo.title)}
                title={getImageTitle(promo.src)}
                fill
                className="object-cover"
                unoptimized // Using external URLs from user
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ValuePropsSection() {
  const props = [
    { title: "One Stop Service", description: "Layanan lengkap dari konsep produk hingga siap dipasarkan.", icon: "/assets/images/factory_9637040.svg" },
    { title: "Quality Is Number 1", description: "Standar kualitas tinggi dengan pengawasan ketat di setiap proses.", icon: "/assets/images/business_14210936.svg" },
    { title: "Personalize Formula", description: "Formula eksklusif yang disesuaikan dengan identitas brand Anda.", icon: "/assets/images/business_14170355.svg" },
    { title: "Marketing Strategy", description: "Bantuan strategi pemasaran untuk melejitkan potensi brand Anda.", icon: "/assets/images/communication_14907803.svg" },
    { title: "Creative Design", description: "Desain visual premium yang memukau dan berkesan.", icon: "/assets/images/business_14165589.svg" },
  ];

  return (
    <section className="py-24 md:py-40 bg-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <motion.div 
          variants={staggerContainer(0.15, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="flex flex-col lg:flex-row gap-20 items-center"
        >
          <motion.div 
            variants={fadeInLeft(0.8, 0, -30)}
            className="lg:w-1/2 space-y-12"
          >
            <div>
              <span className="text-brand-orange font-black uppercase tracking-[0.4em] text-xs md:text-sm mb-4 inline-block">Our Advantage</span>
              <h2 className="text-4xl md:text-7xl font-display text-brand-black leading-[1.1] uppercase">
                The Best Place To Make Your <span className="text-brand-orange">Dreams</span> Come True
              </h2>
              <div className="w-24 h-2 bg-brand-orange mt-8" />
            </div>
            <p className="text-brand-black/60 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
              Dreamlab Indonesia hadir memberikan solusi untuk anda yang ingin memulai bisnis kosmetik dengan merek sendiri.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer(0.08, 0.1)}
            className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {props.map((prop, idx) => (
              <motion.div 
                key={idx} 
                variants={staggerItemUp(20)}
                className={`bg-white p-8 rounded-[40px] border border-gray-100 hover:border-brand-orange/20 transition-all group shadow-sm ${
                  idx === 0 ? "md:col-span-2" : ""
                }`}
              >
                <div className="flex gap-6 items-start">
                  <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <Image src={prop.icon} alt={getImageAlt(prop.icon, prop.title)} title={getImageTitle(prop.icon)} width={32} height={32} className="opacity-80" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-onest text-brand-black uppercase leading-tight">{prop.title}</h3>
                    <p className="text-brand-black/60 text-sm leading-relaxed">{prop.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
