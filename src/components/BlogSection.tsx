"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface BlogPost {
  title: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
  link: string;
}

interface BlogSectionProps {
  title: string;
  posts: BlogPost[];
}

// Elite Custom Easing Curve (Apple / Tom Ford Premium Ease-Out)
const premiumEase = [0.16, 1, 0.3, 1] as any;

const BlogSection: React.FC<BlogSectionProps> = ({ title, posts }) => {

  // Stagger Container
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15 // Beautiful sequential delay gaps!
      }
    }
  };

  // Staggered Spring reveals for article cards
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
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

  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-32 bg-brand-white relative overflow-hidden w-full">
      {/* Decorative ambient gradients */}
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-brand-orange/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="container-custom relative z-10">
        
        {/* Section Header - Elegant Slide Down */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: premiumEase }}
          viewport={{ once: true }}
          className="flex justify-between items-end mb-20"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-display text-brand-black uppercase">
              {title}
            </h2>
            <div className="w-24 h-1.5 bg-brand-orange mt-6 rounded-full" />
          </div>
          <Link 
            href="/news-blog"
            className="hidden md:flex items-center gap-3 text-brand-black font-black uppercase tracking-widest text-sm hover:text-brand-orange transition-all hover:translate-x-1"
          >
            Lihat Semua Artikel
            <ArrowRight size={16} className="text-brand-orange" />
          </Link>
        </motion.div>

        {/* 3-Card Staggered Article Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          {posts.map((post, index) => (
            <motion.article 
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.015, 
                transition: { duration: 0.45, ease: premiumEase } 
              }}
              className="group bg-white rounded-[40px] overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500 flex flex-col h-full cursor-pointer border border-neutral-100/50"
            >
              {/* Image Frame */}
              <div className="relative h-64 overflow-hidden">
                {/* Slow Focusing image scale zoom on hover */}
                <Image 
                  src={post.image}
                  alt={post.title}
                  title={`${post.title} — Dreamlab Indonesia`}
                  fill
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-108"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Floating category badge with custom hover reaction */}
                <div className="absolute top-6 left-6 bg-brand-orange text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-md transition-all duration-300 group-hover:bg-brand-black group-hover:scale-105">
                  {post.category}
                </div>
              </div>
              
              {/* Content Panel */}
              <div className="p-10 flex-grow flex flex-col">
                <time className="text-brand-black/40 text-xs font-bold uppercase tracking-widest mb-4 block">
                  {post.date}
                </time>
                <h3 className="text-xl font-bold text-brand-black mb-6 group-hover:text-brand-orange transition-colors leading-tight">
                  <Link href={post.link}>{post.title}</Link>
                </h3>
                <p className="text-brand-black/60 text-sm leading-relaxed mb-8 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-auto pt-8 border-t border-brand-black/5">
                  <Link 
                    href={post.link}
                    className="inline-flex items-center gap-3 text-brand-orange font-black uppercase tracking-widest text-xs group/link"
                  >
                    BACA SELENGKAPNYA
                    <span className="group-hover/link:translate-x-2 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
