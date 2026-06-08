"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { articles } from '@/data/articles';

const MONTHS_ID = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];

function formatDate(dateStr: string) {
  if (!dateStr || dateStr.trim() === '') return { day: '01', month: 'JAN' };
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { day: '01', month: 'JAN' };
    return {
      day: d.getDate().toString().padStart(2, '0'),
      month: MONTHS_ID[d.getMonth()]
    };
  } catch (e) {
    return { day: '01', month: 'JAN' };
  }
}

export default function BlogArchivePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(9); // Initial visible articles

  const filteredByBlog = useMemo(() => {
    return articles.filter(a => (a.categories || []).length > 0);
  }, []);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(filteredByBlog.flatMap(a => a.categories || []).filter(Boolean))];
    return cats;
  }, [filteredByBlog]);

  const filteredArticles = useMemo(() => {
    if (activeCategory === 'All') return filteredByBlog;
    return filteredByBlog.filter(a => (a.categories || []).includes(activeCategory));
  }, [activeCategory, filteredByBlog]);

  return (
    <main className="min-h-screen bg-[#FFFFFB]">
      {/* Premium Header */}
      <section className="pt-32 pb-16 bg-brand-black relative overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/Sampul WEB (1).png" 
            alt="Dreamlab News & Blog Background" 
            fill 
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-orange/10 skew-x-[-20deg] translate-x-32"></div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white">News & Blog</span>
            </nav>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight mb-6">
              Temukan Wawasan Bisnis Kosmetik di Blog Kami
            </h1>
            <p className="text-white/60 text-base md:text-lg font-medium max-w-2xl leading-relaxed">
              Temukan analisis tren industri kecantikan di artikel Dreamlab. Persiapkan langkah strategis Anda dalam membangun brand skincare, kosmetik, dan parfum impian Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="container-custom">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                    ? 'bg-brand-orange text-white shadow-xl shadow-brand-orange/30 scale-105' 
                    : 'bg-gray-50 text-brand-black/40 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="py-24">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Main Content Grid */}
            <div className="flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {filteredArticles.slice(0, visibleCount).map((article, index) => (
                  <article 
                    key={index}
                    className="group bg-white rounded-[48px] border border-gray-100 overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700"
                  >
                    <Link href={`${article.slug}`} className="block relative aspect-[4/3] overflow-hidden">
                      <Image 
                        src={article.featuredImage ? `/assets/images/blog/${article.featuredImage}` : '/assets/images/placeholder.jpg'} 
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index < 4}
                      />
                      <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-5 py-4 rounded-3xl flex flex-col items-center justify-center shadow-2xl">
                        <span className="text-brand-orange font-black text-2xl leading-none">
                          {formatDate(article.publishDate).day}
                        </span>
                        <span className="text-brand-black font-black text-[10px] uppercase tracking-widest">
                          {formatDate(article.publishDate).month}
                        </span>
                      </div>
                    </Link>

                    <div className="p-10 md:p-12">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="bg-brand-orange/10 text-brand-orange px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                          {article.categories?.[0] || 'Uncategorized'}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-black text-brand-black leading-tight mb-6 group-hover:text-brand-orange transition-colors">
                        <Link href={`${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-10 line-clamp-3">
                        {article.excerpt}
                      </p>

                      <Link 
                        href={`${article.slug}`}
                        className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-brand-black group/link"
                      >
                        Read More 
                        <span className="w-8 h-[2px] bg-brand-orange group-hover/link:w-12 transition-all"></span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < filteredArticles.length && (
                <div className="mt-20 flex justify-center">
                  <button 
                    onClick={() => setVisibleCount(prev => prev + 9)}
                    className="group relative px-12 py-5 bg-brand-orange text-white font-bold rounded-full overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_20px_40px_-10px_rgba(255,107,0,0.3)]"
                  >
                    <span className="relative z-10">MUAT LEBIH BANYAK</span>
                    <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </button>
                </div>
              )}
            </div>

            {/* Premium Sidebar */}
            <aside className="lg:w-[380px] space-y-12">
              {/* Search */}
              <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                <h4 className="text-sm font-black uppercase tracking-widest mb-8 border-b border-gray-100 pb-4">Search</h4>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search articles..."
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-orange outline-none transition-all"
                  />
                  <i className="ri-search-line absolute right-6 top-1/2 -translate-y-1/2 text-gray-300"></i>
                </div>
              </div>

              {/* Recent Posts */}
              <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                <h4 className="text-sm font-black uppercase tracking-widest mb-8 border-b border-gray-100 pb-4">Latest Insights</h4>
                <div className="space-y-8">
                  {articles.slice(0, 5).map((a, i) => (
                    <Link href={`${a.slug}`} key={i} className="flex gap-4 group">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                        <Image src={a.featuredImage ? `/assets/images/blog/${a.featuredImage}` : '/assets/images/placeholder.jpg'} alt={a.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="80px" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h5 className="text-xs font-bold leading-snug group-hover:text-brand-orange transition-colors line-clamp-2 uppercase">
                          {a.title}
                        </h5>
                        <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                          {a.publishDate ? new Date(a.publishDate).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }) : 'Jan 1'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="pattern-orange p-10 rounded-[40px] text-white">
                <h4 className="text-xl font-black uppercase tracking-tight mb-4">Join the Inner Circle</h4>
                <p className="text-white/80 text-sm mb-8 leading-relaxed">Get exclusive industry trends and formulation insights delivered to your inbox.</p>
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full bg-white/20 border border-white/30 rounded-2xl px-6 py-4 text-sm placeholder:text-white/60 outline-none mb-4"
                />
                <button className="w-full bg-white text-brand-orange py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-brand-black hover:text-white transition-all">
                  Subscribe
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
