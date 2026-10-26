"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { articlesMeta, ArticleMeta } from '@/data/articles-meta';
import { resolveArticleImageSrc } from '@/lib/asset-paths';

const MONTHS_ID = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];

function sortByDateDesc(list: ArticleMeta[]) {
  return [...list].sort((a, b) => {
    const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
    const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
    return dateB - dateA;
  });
}

function formatDate(dateStr: string) {
  if (!dateStr || dateStr.trim() === '') return { day: '01', month: 'JAN', year: '2026', full: '01 Jan 2026' };
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { day: '01', month: 'JAN', year: '2026', full: '01 Jan 2026' };
    const monthIndex = d.getMonth();
    const monthLabel = MONTHS_ID[monthIndex];
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear().toString();
    
    const monthsFull = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const full = `${day} ${monthsFull[monthIndex]} ${year}`;
    
    return {
      day,
      month: monthLabel,
      year,
      full
    };
  } catch (e) {
    return { day: '01', month: 'JAN', year: '2026', full: '01 Jan 2026' };
  }
}

function getReadingTime(article: { readingMinutes: number }) {
  return Math.max(1, article.readingMinutes || 1);
}

export const PILLAR_CATEGORIES = [
  'Maklon Kosmetik',
  'Panduan Bisnis',
  'Formula & R&D',
  'Legalitas & Regulasi',
  'Tren & Inovasi',
  'AIpreneur',
  'Event & Aktivitas',
];
const POSTS_PER_PAGE = 12;

export default function BlogArchivePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredByBlog = useMemo(() => {
    return sortByDateDesc(articlesMeta.filter(a => (a.categories || []).length > 0));
  }, []);

  const categories = ['All', ...PILLAR_CATEGORIES];

  const filteredArticles = useMemo(() => {
    let result = filteredByBlog;
    
    // Filter by Category
    if (activeCategory !== 'All') {
      result = result.filter(a => (a.categories || []).includes(activeCategory));
    }
    
    // Filter by Search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(query) || 
        (a.excerpt || '').toLowerCase().includes(query) ||
        (a.categories || []).some(cat => cat.toLowerCase().includes(query)) ||
        (a.tags || []).some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return result;
  }, [activeCategory, searchQuery, filteredByBlog]);

  const totalPages = Math.ceil(filteredArticles.length / POSTS_PER_PAGE);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );
  
  // Reset page when filter changes
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

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
            quality={40}
            sizes="100vw"
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

      {/* Category Navigation Bar - Responsive & Horizontal Scroll on Mobile */}
      <div className="bg-white border-b border-gray-100 py-4 sticky top-16 md:top-20 z-20 backdrop-blur-md bg-white/95 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`relative whitespace-nowrap px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeCategory === cat 
                    ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20 scale-[1.02]' 
                    : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100 hover:text-brand-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Search Input - Under categories, above content */}
      <div className="block lg:hidden container-custom pt-8">
        <div className="relative">
          <input 
            type="text" 
            value={searchQuery}
onChange={(e) => handleSearch(e.target.value)}
            placeholder="Cari artikel..."
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-orange outline-none transition-all"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400">
              {searchQuery ? (
                <button onClick={() => handleSearch('')} className="hover:text-brand-orange cursor-pointer">
                <i className="ri-close-line text-lg"></i>
              </button>
            ) : (
              <i className="ri-search-line text-lg"></i>
            )}
          </span>
        </div>
      </div>

      <section className="pt-8 pb-16 md:pt-10 md:pb-24">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-16">
              
              {/* Main Content Grid */}
              <div className="flex-grow">
                
                {/* Zero Result State */}
                {filteredArticles.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                    <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <i className="ri-search-line text-2xl text-brand-orange"></i>
                    </div>
                    <h3 className="text-2xl font-viga text-brand-black mb-4">Artikel Tidak Ditemukan</h3>
                    <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
                      Kami tidak dapat menemukan artikel yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;. Coba periksa ejaan atau gunakan kata kunci lain.
                    </p>
                    <button
                      onClick={() => handleCategoryChange('All')}
                      className="px-8 py-3.5 bg-brand-orange text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-brand-black transition-colors shadow-lg shadow-brand-orange/20 cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  </div>
                ) : (
                  /* Regular Search Grid */
                  <div className="space-y-10">
                    <div className="mb-6">
                      <h3 className="text-xl font-viga text-brand-black">
                        Hasil Pencarian: <span className="text-brand-orange">{filteredArticles.length} Artikel</span> ditemukan
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                      {paginatedArticles.map((article, index) => (
                        <article 
                          key={index}
                          className="group bg-white rounded-[32px] border border-gray-100 overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-700 flex flex-col h-full"
                        >
                          <Link href={`${article.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-50 bg-[#FAF9F6]">
                            <Image 
                              src={resolveArticleImageSrc(article.featuredImage)} 
                              alt={article.title}
                              fill
                              className="object-contain group-hover:scale-105 transition-transform duration-1000"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              priority={index < 4}
                            />
                            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl flex flex-col items-center justify-center shadow-md border border-white/50">
                              <span className="text-brand-orange font-black text-lg leading-none">
                                {formatDate(article.publishDate).day}
                              </span>
                              <span className="text-brand-black font-black text-[9px] uppercase tracking-widest mt-0.5">
                                {formatDate(article.publishDate).month}
                              </span>
                            </div>
                          </Link>

                          <div className="p-8 md:p-10 flex flex-col flex-grow">
                            <div className="flex items-center gap-3 mb-4 text-[10px] font-black uppercase tracking-widest text-brand-black/40">
                              <span className="text-brand-orange">{article.categories?.[0] || 'Uncategorized'}</span>
                              <span>•</span>
                              <span>{getReadingTime(article)} Min Read</span>
                            </div>
                            
                            <h3 className="text-xl md:text-2xl font-viga font-normal text-brand-black leading-tight mb-4 group-hover:text-brand-orange transition-colors">
                              <Link href={`${article.slug}`}>
                                {article.title}
                              </Link>
                            </h3>
                            
                            <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                              {article.excerpt}
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-400 font-bold uppercase">BY</span>
                                <span className="text-[10px] font-black uppercase tracking-wider text-brand-black">{article.author || 'Dreamlab'}</span>
                              </div>
                              <Link 
                                href={`${article.slug}`}
                                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-black group/link"
                              >
                                Read More 
                                <span className="w-6 h-[2px] bg-brand-orange group-hover/link:w-10 transition-all"></span>
                              </Link>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}

                {/* Numbered Pagination */}
                {totalPages > 1 && (
                  <div className="mt-16 flex flex-wrap justify-center items-center gap-3">
                    {currentPage > 1 && (
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="px-5 py-3 rounded-xl bg-gray-50 text-[10px] font-black uppercase tracking-widest hover:bg-brand-orange hover:text-white transition-all cursor-pointer"
                      >
                        Previous
                      </button>
                    )}
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-11 h-11 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            currentPage === pageNum
                              ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                              : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {currentPage < totalPages && (
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className="px-5 py-3 rounded-xl bg-gray-50 text-[10px] font-black uppercase tracking-widest hover:bg-brand-orange hover:text-white transition-all cursor-pointer"
                      >
                        Next
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Premium Sidebar (Desktop only for Search) */}
              <aside className="lg:w-[380px] space-y-12 shrink-0">
                
                {/* Search Widget */}
                <div className="hidden lg:block bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                  <h4 className="text-sm font-black uppercase tracking-widest mb-8 border-b border-gray-100 pb-4">Search</h4>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search articles..."
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-orange outline-none transition-all"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300">
                      {searchQuery ? (
                        <button onClick={() => handleSearch('')} className="text-gray-400 hover:text-brand-orange cursor-pointer">
                          <i className="ri-close-line text-lg animate-fade-in"></i>
                        </button>
                      ) : (
                        <i className="ri-search-line text-lg"></i>
                      )}
                    </span>
                  </div>
                </div>

                {/* B2B Manufacturing Consultation Widget */}
                <div className="bg-brand-black p-8 rounded-[36px] text-white shadow-xl relative overflow-hidden border border-neutral-800">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none"></div>
                  <span className="text-[10px] font-black bg-brand-orange/20 text-brand-orange border border-brand-orange/30 px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                    Konsultasi Pabrik Kosmetik
                  </span>
                  <h4 className="text-xl font-display font-normal uppercase leading-tight mb-3 text-white">
                    Rencanakan Brand Kosmetik Anda
                  </h4>
                  <p className="text-white/70 text-xs mb-6 leading-relaxed font-medium">
                    Konsultasikan konsep produk, formulasi custom bersama R&amp;D Dreamlab, dan pengurusan izin edar BPOM resmi.
                  </p>
                  <div className="space-y-2.5 mb-6 text-[11px] font-bold text-white/90">
                    <div className="flex items-center gap-2">
                      <span className="text-brand-orange font-black">✓</span>
                      <span>MOQ fleksibel (target awal 500+ pcs)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-brand-orange font-black">✓</span>
                      <span>Prinsip 1 Client = 1 Custom Formula</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-brand-orange font-black">✓</span>
                      <span>Fasilitas CPKB Grade A &amp; Halal MUI</span>
                    </div>
                  </div>
                  <Link
                    href="/thankyou/google/?source=organic&from=/news-blog/"
                    className="flex items-center justify-center gap-2 w-full bg-brand-orange hover:bg-[#D98200] text-white py-3.5 px-6 rounded-2xl font-black text-xs tracking-wider transition-all shadow-lg shadow-brand-orange/30 text-center"
                  >
                    <span>KONSULTASI VIA WHATSAPP</span>
                    <span>→</span>
                  </Link>
                </div>

                {/* Latest Insights Widget */}
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                  <h4 className="text-sm font-black uppercase tracking-widest mb-8 border-b border-gray-100 pb-4">Latest Insights</h4>
                  <div className="space-y-8">
                    {sortByDateDesc(articlesMeta).slice(0, 5).map((a, i) => (
                      <Link href={`${a.slug}`} key={i} className="flex gap-4 group">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 bg-[#FAF9F6]">
                          <Image 
                            src={resolveArticleImageSrc(a.featuredImage)} 
                            alt={a.title} 
                            fill 
                            className="object-contain group-hover:scale-110 transition-transform duration-500" 
                            sizes="64px" 
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h5 className="text-[11px] font-black leading-snug group-hover:text-brand-orange transition-colors line-clamp-2 uppercase tracking-tight">
                            {a.title}
                          </h5>
                          <div className="flex items-center gap-2 mt-1.5 text-[9px] text-gray-400 font-bold uppercase">
                            <span>{a.publishDate ? formatDate(a.publishDate).month + ' ' + formatDate(a.publishDate).day : 'JAN 1'}</span>
                            <span>•</span>
                            <span>{getReadingTime(a)} MIN READ</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
              
            </div>
        </div>
      </section>
    </main>
  );
}
