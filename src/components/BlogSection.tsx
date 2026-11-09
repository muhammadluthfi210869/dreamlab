"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export interface BlogPost {
  title: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
  link: string;
  readingTime?: string;
}

interface BlogSectionProps {
  title: string;
  subtitle?: string;
  posts: BlogPost[];
  seeAllText?: string;
  readMoreText?: string;
}

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// Elite Custom Easing Curve (Apple / Tom Ford Premium Ease-Out)
const premiumEase = [0.16, 1, 0.3, 1] as any;

const BlogSection: React.FC<BlogSectionProps> = ({
  title,
  subtitle = "Strategi peluncuran produk, kalkulasi HPP transparan, regulasi BPOM, dan riset formulasi kecantikan.",
  posts,
  seeAllText = "Lihat Semua Artikel",
  readMoreText = "BACA SELENGKAPNYA",
}) => {
  // Stagger Container
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Staggered Spring reveals for article cards
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 22,
      },
    },
  };

  if (!posts || posts.length === 0) return null;

  // Determine grid columns dynamically based on posts count (4 columns on desktop when >= 4 posts)
  const gridColsClass =
    posts.length >= 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : posts.length === 3
      ? "grid-cols-1 md:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto";

  return (
    <section className="py-24 md:py-32 bg-[#faf9f6] relative overflow-hidden w-full border-t border-neutral-100">
      {/* Decorative ambient gradients */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-brand-orange/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-blue-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: premiumEase }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16"
        >
          <div className="max-w-2xl">
            <span className="text-brand-orange font-black uppercase tracking-[0.2em] text-xs block mb-3">
              Insight &amp; Riset Bisnis Kecantikan
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#111827] tracking-tight uppercase leading-[1.15]">
              {title}
            </h2>
            <div className="w-20 h-1.5 bg-brand-orange mt-4 mb-4 rounded-full" />
            {subtitle && (
              <p className="text-neutral-600 text-sm md:text-base leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <Link
            href="/news-blog"
            className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full border border-neutral-200 bg-white hover:border-brand-orange hover:bg-brand-orange/5 text-[#111827] hover:text-brand-orange text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow"
          >
            {seeAllText}
            <ArrowRight size={15} className="text-brand-orange" />
          </Link>
        </motion.div>

        {/* 4-Card Staggered Article Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className={`grid ${gridColsClass} gap-6 lg:gap-7`}
        >
          {posts.map((post, index) => {
            const formattedDate = formatDisplayDate(post.date);

            return (
              <motion.article
                key={index}
                variants={cardVariants}
                whileHover={{
                  y: -6,
                  transition: { duration: 0.3, ease: premiumEase },
                }}
                className="group bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-neutral-200/80 hover:border-brand-orange/40"
              >
                {/* Image Frame with Aspect Ratio */}
                <Link
                  href={post.link}
                  className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 block"
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    title={`${post.title} — Dreamlab Indonesia`}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Subtle dark bottom scrim for readability on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Floating category badge */}
                  <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md text-[#111827] text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full shadow-sm border border-neutral-100 transition-all duration-300 group-hover:bg-brand-orange group-hover:text-white">
                    {post.category}
                  </div>
                </Link>

                {/* Content Panel */}
                <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between">
                  <div>
                    {/* Meta Info: Date & Reading Time */}
                    <div className="flex items-center gap-2 text-neutral-400 text-[11px] font-semibold tracking-wider mb-2.5">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={13} className="text-brand-orange" />
                        {formattedDate}
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={12} />
                        {post.readingTime || "4 min baca"}
                      </span>
                    </div>

                    {/* Article Title */}
                    <h3 className="text-base sm:text-lg font-bold text-[#111827] mb-2.5 group-hover:text-brand-orange transition-colors leading-snug line-clamp-2">
                      <Link href={post.link}>{post.title}</Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="mt-auto pt-3.5 border-t border-neutral-100">
                    <Link
                      href={post.link}
                      className="inline-flex items-center gap-2 text-brand-orange font-black uppercase tracking-wider text-xs group/link hover:gap-2.5 transition-all"
                    >
                      <span>{readMoreText}</span>
                      <ArrowRight size={14} className="transform transition-transform duration-200 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Mobile View All Button */}
        <div className="mt-10 text-center md:hidden">
          <Link
            href="/news-blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111827] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:bg-brand-orange transition-colors"
          >
            {seeAllText}
            <ArrowRight size={14} className="text-brand-orange" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
