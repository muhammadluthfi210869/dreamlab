"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { articles, Article } from '@/data/articles';

const MONTHS_ID = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];

function sortByDateDesc(list: Article[]) {
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

function getReadingTime(content: string) {
  if (!content) return 1;
  const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 225));
}

export default function BlogArchivePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(9); // Initial visible articles for search grid

  const filteredByBlog = useMemo(() => {
    return sortByDateDesc(articles.filter(a => (a.categories || []).length > 0));
  }, []);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(filteredByBlog.flatMap(a => a.categories || []).filter(Boolean))];
    return cats;
  }, [filteredByBlog]);

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
        (a.categories || []).some(cat => cat.toLowerCase().includes(query))
      );
    }
    
    return result;
  }, [activeCategory, searchQuery, filteredByBlog]);

  // Curated Clusters for Dashboard (Opsi A) - 4 Pillars
  // Pilar 1: Bisnis & Permodalan
  const businessArticles = useMemo(() => {
    return filteredByBlog.filter(a => 
      a.title.toLowerCase().includes('hpp') || 
      a.title.toLowerCase().includes('bisnis') || 
      a.title.toLowerCase().includes('hitung') || 
      a.title.toLowerCase().includes('modal') || 
      a.title.toLowerCase().includes('moq') || 
      a.title.toLowerCase().includes('harga') || 
      a.title.toLowerCase().includes('untung') || 
      a.title.toLowerCase().includes('profit') || 
      (a.categories || []).some(cat => 
        cat.toLowerCase().includes('bisnis') || 
        cat.toLowerCase().includes('keuangan') ||
        cat.toLowerCase().includes('marketing')
      )
    );
  }, [filteredByBlog]);

  // Pilar 2: Tren Produk & Formulasi
  const productArticles = useMemo(() => {
    return filteredByBlog.filter(a => 
      (a.categories || []).some(cat => 
        cat.toLowerCase().includes('maklon') || 
        cat.toLowerCase().includes('personal') || 
        cat.toLowerCase().includes('hair') || 
        cat.toLowerCase().includes('foot') || 
        cat.toLowerCase().includes('dekoratif') || 
        cat.toLowerCase().includes('skincare') || 
        cat.toLowerCase().includes('parfum') || 
        cat.toLowerCase().includes('baby')
      ) ||
      a.title.toLowerCase().includes('formulasi') ||
      a.title.toLowerCase().includes('bahan aktif') ||
      a.title.toLowerCase().includes('serum') ||
      a.title.toLowerCase().includes('deodoran') ||
      a.title.toLowerCase().includes('deodorant') ||
      a.title.toLowerCase().includes('foot care') ||
      a.title.toLowerCase().includes('hair care') ||
      a.title.toLowerCase().includes('baby care') ||
      a.title.toLowerCase().includes('skincare') ||
      a.title.toLowerCase().includes('parfum') ||
      a.title.toLowerCase().includes('dekoratif') ||
      a.title.toLowerCase().includes('produk')
    );
  }, [filteredByBlog]);

  // Pilar 3: Legalitas & Regulasi BPOM
  const complianceArticles = useMemo(() => {
    return filteredByBlog.filter(a => 
      a.title.toLowerCase().includes('bpom') || 
      a.title.toLowerCase().includes('izin') || 
      a.title.toLowerCase().includes('regulasi') || 
      a.title.toLowerCase().includes('halal') || 
      a.title.toLowerCase().includes('hki') || 
      a.title.toLowerCase().includes('cpkb') ||
      a.title.toLowerCase().includes('legalitas') ||
      a.title.toLowerCase().includes('sertifikasi') ||
      a.title.toLowerCase().includes('merek') ||
      (a.categories || []).some(cat => 
        cat.toLowerCase().includes('regulasi') || 
        cat.toLowerCase().includes('legalitas') ||
        cat.toLowerCase().includes('bpom')
      )
    );
  }, [filteredByBlog]);

  // Pilar 4: Branding & Strategi Peluncuran
  const brandingArticles = useMemo(() => {
    return filteredByBlog.filter(a => 
      a.title.toLowerCase().includes('branding') || 
      a.title.toLowerCase().includes('pemasaran') || 
      a.title.toLowerCase().includes('launch') || 
      a.title.toLowerCase().includes('kemasan') || 
      a.title.toLowerCase().includes('desain') || 
      a.title.toLowerCase().includes('viral') || 
      a.title.toLowerCase().includes('marketing') ||
      a.title.toLowerCase().includes('membangun') ||
      (a.categories || []).some(cat => 
        cat.toLowerCase().includes('branding') || 
        cat.toLowerCase().includes('pemasaran') ||
        cat.toLowerCase().includes('marketing')
      )
    );
  }, [filteredByBlog]);

  const showDashboard = searchQuery.trim() === '' && activeCategory === 'All';

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

      {/* Category Navigation Bar */}
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="container-custom">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchQuery(''); // Reset search when switching categories
                  setVisibleCount(9);
                }}
                className={`relative whitespace-nowrap pb-4 text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                  activeCategory === cat 
                    ? 'text-brand-orange scale-105 font-bold' 
                    : 'text-brand-black/40 hover:text-brand-black/80'
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-orange rounded-full animate-fade-in" />
                )}
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
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari artikel..."
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-orange outline-none transition-all"
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400">
            {searchQuery ? (
              <button onClick={() => setSearchQuery('')} className="hover:text-brand-orange cursor-pointer">
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
          {showDashboard ? (
            /* --- OPSI A: THE STRUCTURED EDITORIAL MAGAZINE (4 Pillars & Light Sidebar) --- */
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              
              {/* LEFT COLUMN: Curated Clusters (70%) */}
              <div className="w-full lg:w-[68%] space-y-16">
                
                {/* CLUSTER 1: Bisnis & Permodalan */}
                {businessArticles.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-8 pb-3 border-b border-gray-100">
                      <span className="bg-brand-orange/15 text-brand-orange text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md">
                        Pilar 01
                      </span>
                      <h3 className="text-xl font-viga text-brand-black">Bisnis & Permodalan</h3>
                    </div>

                    <div className="space-y-10">
                      {/* Featured Big Card */}
                      <div className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)] transition-all duration-700">
                        <Link href={`${businessArticles[0].slug}`} className="block relative aspect-[21/9] w-full overflow-hidden bg-gray-50 bg-[#FAF9F6]">
                          <Image 
                            src={businessArticles[0].featuredImage ? `/assets/images/blog/${businessArticles[0].featuredImage}` : '/assets/images/placeholder.jpg'} 
                            alt={businessArticles[0].title}
                            fill
                            className="object-contain group-hover:scale-103 transition-transform duration-1000"
                            sizes="(max-width: 1024px) 100vw, 70vw"
                            priority
                          />
                        </Link>
                        <div className="p-8">
                          <div className="flex items-center gap-2 mb-3 text-[9px] text-gray-400 font-bold uppercase">
                            <span>{formatDate(businessArticles[0].publishDate).full}</span>
                            <span>•</span>
                            <span>{getReadingTime(businessArticles[0].content)} MIN READ</span>
                          </div>
                          <h4 className="text-xl md:text-2xl font-viga font-normal text-brand-black mb-3 group-hover:text-brand-orange transition-colors">
                            <Link href={`${businessArticles[0].slug}`}>{businessArticles[0].title}</Link>
                          </h4>
                          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6">
                            {businessArticles[0].excerpt}
                          </p>
                          <Link href={`${businessArticles[0].slug}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-black group/link">
                            Read Guide <span className="w-6 h-[2px] bg-brand-orange group-hover/link:w-10 transition-all"></span>
                          </Link>
                        </div>
                      </div>

                      {/* Staggered Sub-articles (2 Columns) */}
                      {businessArticles.length > 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {businessArticles.slice(1, 3).map((a, idx) => (
                            <div key={idx} className="group/sub bg-white p-6 rounded-2xl border border-gray-50 hover:shadow-md transition-shadow duration-500 flex flex-col h-full">
                              <Link href={`${a.slug}`} className="block relative aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-gray-50 bg-[#FAF9F6]">
                                <Image 
                                  src={a.featuredImage ? `/assets/images/blog/${a.featuredImage}` : '/assets/images/placeholder.jpg'} 
                                  alt={a.title}
                                  fill
                                  className="object-contain group-hover/sub:scale-105 transition-transform duration-750"
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                />
                              </Link>
                              <div className="flex items-center gap-2 mb-2 text-[9px] text-gray-400 font-bold uppercase">
                                <span>{formatDate(a.publishDate).full}</span>
                                <span>•</span>
                                <span>{getReadingTime(a.content)} MIN READ</span>
                              </div>
                              <h5 className="text-base font-viga text-brand-black leading-snug group-hover/sub:text-brand-orange transition-colors mb-3 line-clamp-2">
                                <Link href={`${a.slug}`}>{a.title}</Link>
                              </h5>
                              <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
                                {a.excerpt}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* CLUSTER 2: Tren Produk & Formulasi */}
                {productArticles.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-8 pb-3 border-b border-gray-100">
                      <span className="bg-brand-orange/15 text-brand-orange text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md">
                        Pilar 02
                      </span>
                      <h3 className="text-xl font-viga text-brand-black">Tren Produk & Formulasi</h3>
                    </div>

                    <div className="space-y-10">
                      {/* Featured Big Card */}
                      <div className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)] transition-all duration-700">
                        <Link href={`${productArticles[0].slug}`} className="block relative aspect-[21/9] w-full overflow-hidden bg-gray-50 bg-[#FAF9F6]">
                          <Image 
                            src={productArticles[0].featuredImage ? `/assets/images/blog/${productArticles[0].featuredImage}` : '/assets/images/placeholder.jpg'} 
                            alt={productArticles[0].title}
                            fill
                            className="object-contain group-hover:scale-103 transition-transform duration-1000"
                            sizes="(max-width: 1024px) 100vw, 70vw"
                          />
                        </Link>
                        <div className="p-8">
                          <div className="flex items-center gap-2 mb-3 text-[9px] text-gray-400 font-bold uppercase">
                            <span>{formatDate(productArticles[0].publishDate).full}</span>
                            <span>•</span>
                            <span>{getReadingTime(productArticles[0].content)} MIN READ</span>
                          </div>
                          <h4 className="text-xl md:text-2xl font-viga font-normal text-brand-black mb-3 group-hover:text-brand-orange transition-colors">
                            <Link href={`${productArticles[0].slug}`}>{productArticles[0].title}</Link>
                          </h4>
                          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6">
                            {productArticles[0].excerpt}
                          </p>
                          <Link href={`${productArticles[0].slug}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-black group/link">
                            Read Guide <span className="w-6 h-[2px] bg-brand-orange group-hover/link:w-10 transition-all"></span>
                          </Link>
                        </div>
                      </div>

                      {/* Staggered Sub-articles (2 Columns) */}
                      {productArticles.length > 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {productArticles.slice(1, 3).map((a, idx) => (
                            <div key={idx} className="group/sub bg-white p-6 rounded-2xl border border-gray-50 hover:shadow-md transition-shadow duration-500 flex flex-col h-full">
                              <Link href={`${a.slug}`} className="block relative aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-gray-50 bg-[#FAF9F6]">
                                <Image 
                                  src={a.featuredImage ? `/assets/images/blog/${a.featuredImage}` : '/assets/images/placeholder.jpg'} 
                                  alt={a.title}
                                  fill
                                  className="object-contain group-hover/sub:scale-105 transition-transform duration-750"
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                />
                              </Link>
                              <div className="flex items-center gap-2 mb-2 text-[9px] text-gray-400 font-bold uppercase">
                                <span>{formatDate(a.publishDate).full}</span>
                                <span>•</span>
                                <span>{getReadingTime(a.content)} MIN READ</span>
                              </div>
                              <h5 className="text-base font-viga text-brand-black leading-snug group-hover/sub:text-brand-orange transition-colors mb-3 line-clamp-2">
                                <Link href={`${a.slug}`}>{a.title}</Link>
                              </h5>
                              <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
                                {a.excerpt}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* CLUSTER 3: Legalitas & Regulasi BPOM */}
                {complianceArticles.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-8 pb-3 border-b border-gray-100">
                      <span className="bg-brand-orange/15 text-brand-orange text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md">
                        Pilar 03
                      </span>
                      <h3 className="text-xl font-viga text-brand-black">Legalitas & Regulasi BPOM</h3>
                    </div>

                    <div className="space-y-10">
                      {/* Featured Big Card */}
                      <div className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)] transition-all duration-700">
                        <Link href={`${complianceArticles[0].slug}`} className="block relative aspect-[21/9] w-full overflow-hidden bg-gray-50 bg-[#FAF9F6]">
                          <Image 
                            src={complianceArticles[0].featuredImage ? `/assets/images/blog/${complianceArticles[0].featuredImage}` : '/assets/images/placeholder.jpg'} 
                            alt={complianceArticles[0].title}
                            fill
                            className="object-contain group-hover:scale-103 transition-transform duration-1000"
                            sizes="(max-width: 1024px) 100vw, 70vw"
                          />
                        </Link>
                        <div className="p-8">
                          <div className="flex items-center gap-2 mb-3 text-[9px] text-gray-400 font-bold uppercase">
                            <span>{formatDate(complianceArticles[0].publishDate).full}</span>
                            <span>•</span>
                            <span>{getReadingTime(complianceArticles[0].content)} MIN READ</span>
                          </div>
                          <h4 className="text-xl md:text-2xl font-viga font-normal text-brand-black mb-3 group-hover:text-brand-orange transition-colors">
                            <Link href={`${complianceArticles[0].slug}`}>{complianceArticles[0].title}</Link>
                          </h4>
                          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6">
                            {complianceArticles[0].excerpt}
                          </p>
                          <Link href={`${complianceArticles[0].slug}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-black group/link">
                            Read Guide <span className="w-6 h-[2px] bg-brand-orange group-hover/link:w-10 transition-all"></span>
                          </Link>
                        </div>
                      </div>

                      {/* Staggered Sub-articles (2 Columns) */}
                      {complianceArticles.length > 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {complianceArticles.slice(1, 3).map((a, idx) => (
                            <div key={idx} className="group/sub bg-white p-6 rounded-2xl border border-gray-50 hover:shadow-md transition-shadow duration-500 flex flex-col h-full">
                              <Link href={`${a.slug}`} className="block relative aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-gray-50 bg-[#FAF9F6]">
                                <Image 
                                  src={a.featuredImage ? `/assets/images/blog/${a.featuredImage}` : '/assets/images/placeholder.jpg'} 
                                  alt={a.title}
                                  fill
                                  className="object-contain group-hover/sub:scale-105 transition-transform duration-750"
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                />
                              </Link>
                              <div className="flex items-center gap-2 mb-2 text-[9px] text-gray-400 font-bold uppercase">
                                <span>{formatDate(a.publishDate).full}</span>
                                <span>•</span>
                                <span>{getReadingTime(a.content)} MIN READ</span>
                              </div>
                              <h5 className="text-base font-viga text-brand-black leading-snug group-hover/sub:text-brand-orange transition-colors mb-3 line-clamp-2">
                                <Link href={`${a.slug}`}>{a.title}</Link>
                              </h5>
                              <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
                                {a.excerpt}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* CLUSTER 4: Branding & Strategi Peluncuran */}
                {brandingArticles.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-8 pb-3 border-b border-gray-100">
                      <span className="bg-brand-orange/15 text-brand-orange text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md">
                        Pilar 04
                      </span>
                      <h3 className="text-xl font-viga text-brand-black">Branding & Pemasaran</h3>
                    </div>

                    <div className="space-y-10">
                      {/* Featured Big Card */}
                      <div className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)] transition-all duration-700">
                        <Link href={`${brandingArticles[0].slug}`} className="block relative aspect-[21/9] w-full overflow-hidden bg-gray-50 bg-[#FAF9F6]">
                          <Image 
                            src={brandingArticles[0].featuredImage ? `/assets/images/blog/${brandingArticles[0].featuredImage}` : '/assets/images/placeholder.jpg'} 
                            alt={brandingArticles[0].title}
                            fill
                            className="object-contain group-hover:scale-103 transition-transform duration-1000"
                            sizes="(max-width: 1024px) 100vw, 70vw"
                          />
                        </Link>
                        <div className="p-8">
                          <div className="flex items-center gap-2 mb-3 text-[9px] text-gray-400 font-bold uppercase">
                            <span>{formatDate(brandingArticles[0].publishDate).full}</span>
                            <span>•</span>
                            <span>{getReadingTime(brandingArticles[0].content)} MIN READ</span>
                          </div>
                          <h4 className="text-xl md:text-2xl font-viga font-normal text-brand-black mb-3 group-hover:text-brand-orange transition-colors">
                            <Link href={`${brandingArticles[0].slug}`}>{brandingArticles[0].title}</Link>
                          </h4>
                          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6">
                            {brandingArticles[0].excerpt}
                          </p>
                          <Link href={`${brandingArticles[0].slug}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-black group/link">
                            Read Guide <span className="w-6 h-[2px] bg-brand-orange group-hover/link:w-10 transition-all"></span>
                          </Link>
                        </div>
                      </div>

                      {/* Staggered Sub-articles (2 Columns) */}
                      {brandingArticles.length > 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {brandingArticles.slice(1, 3).map((a, idx) => (
                            <div key={idx} className="group/sub bg-white p-6 rounded-2xl border border-gray-50 hover:shadow-md transition-shadow duration-500 flex flex-col h-full">
                              <Link href={`${a.slug}`} className="block relative aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-gray-50 bg-[#FAF9F6]">
                                <Image 
                                  src={a.featuredImage ? `/assets/images/blog/${a.featuredImage}` : '/assets/images/placeholder.jpg'} 
                                  alt={a.title}
                                  fill
                                  className="object-contain group-hover/sub:scale-105 transition-transform duration-750"
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                />
                              </Link>
                              <div className="flex items-center gap-2 mb-2 text-[9px] text-gray-400 font-bold uppercase">
                                <span>{formatDate(a.publishDate).full}</span>
                                <span>•</span>
                                <span>{getReadingTime(a.content)} MIN READ</span>
                              </div>
                              <h5 className="text-base font-viga text-brand-black leading-snug group-hover/sub:text-brand-orange transition-colors mb-3 line-clamp-2">
                                <Link href={`${a.slug}`}>{a.title}</Link>
                              </h5>
                              <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
                                {a.excerpt}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* RIGHT COLUMN: The Hottest Articles (30% - Sticky, LIGHT MODE) */}
              <div className="w-full lg:w-[32%] lg:sticky lg:top-8 lg:max-h-[calc(100vh-80px)] lg:overflow-y-auto no-scrollbar space-y-8 shrink-0 pb-6">
                <div className="bg-white text-brand-black p-8 rounded-[32px] border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] relative overflow-hidden">
                  
                  <div className="relative z-10 mb-8 border-b border-gray-100 pb-4 flex items-center justify-between">
                    <div>
                      <span className="text-brand-orange text-[9px] font-black uppercase tracking-widest">Trending Now</span>
                      <h4 className="text-base font-viga text-brand-black mt-1 uppercase">Hottest Articles</h4>
                    </div>
                    <i className="ri-fire-line text-xl text-brand-orange"></i>
                  </div>

                  <div className="space-y-6 relative z-10">
                    {filteredByBlog.slice(0, 4).map((a, idx) => (
                      <div key={idx} className="group/radar relative pb-6 border-b border-gray-50 last:border-0 last:pb-0 min-h-[80px] flex flex-col justify-center">
                        {/* Watermark Number Index in Background */}
                        <div className="text-5xl font-black font-viga text-brand-orange/10 select-none pointer-events-none absolute right-2 bottom-3 group-hover/radar:text-brand-orange/20 transition-colors duration-500">
                          #0{idx+1}
                        </div>
                        {/* Text Content */}
                        <div className="relative z-10 pr-12">
                          <h5 className="text-[11px] font-bold leading-snug text-brand-black/80 group-hover/radar:text-brand-orange transition-colors line-clamp-2 uppercase tracking-wide">
                            <Link href={`${a.slug}`}>{a.title.replace(/\n/g, ' ')}</Link>
                          </h5>
                          <div className="flex items-center gap-2 mt-2 text-[9px] text-gray-400 font-bold uppercase">
                            <span>{formatDate(a.publishDate).month} {formatDate(a.publishDate).day}</span>
                            <span>•</span>
                            <span>{getReadingTime(a.content)} MIN READ</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Elegant B2B Call to Action Box (Light Mode / Soft Cream) */}
                <div className="bg-[#FDF8F3] text-brand-black p-8 rounded-[32px] border border-brand-orange/10 shadow-[0_20px_40px_-15px_rgba(246,145,30,0.05)] relative overflow-hidden group/cta">
                  {/* Subtle background glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-3xl -translate-y-8 translate-x-8"></div>
                  
                  <div className="relative z-10">
                    <span className="text-[9px] font-black uppercase tracking-widest text-brand-orange">Wujudkan Brand Anda</span>
                    <h4 className="text-xl font-viga text-brand-black mt-2 mb-4 leading-tight">Mulai Bisnis Kosmetik Bersama Dreamlab</h4>
                    <p className="text-gray-500 text-xs leading-relaxed mb-6">
                      Rancang formula premium, kemasan eksklusif, dan legalitas BPOM lengkap di bawah bimbingan para ahli kami.
                    </p>
                    <Link 
                      href="https://dreamlab.id/thankyou-page/" 
                      className="inline-flex items-center gap-2 bg-brand-orange text-white hover:bg-brand-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-md cursor-pointer"
                    >
                      Hubungi Kami <i className="ri-arrow-right-line"></i>
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* --- FALLBACK: STANDARD SEARCH/FILTER RESULTS GRID --- */
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
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('All');
                      }}
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
                      {filteredArticles.slice(0, visibleCount).map((article, index) => (
                        <article 
                          key={index}
                          className="group bg-white rounded-[32px] border border-gray-100 overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-700 flex flex-col h-full"
                        >
                          <Link href={`${article.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-50 bg-[#FAF9F6]">
                            <Image 
                              src={article.featuredImage ? `/assets/images/blog/${article.featuredImage}` : '/assets/images/placeholder.jpg'} 
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
                              <span>{getReadingTime(article.content)} Min Read</span>
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

                {/* Load More Button */}
                {visibleCount < filteredArticles.length && (
                  <div className="mt-16 flex justify-center">
                    <button 
                      onClick={() => setVisibleCount(prev => prev + 8)}
                      className="group relative px-12 py-5 bg-brand-orange text-white font-bold rounded-xl overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_20px_40px_-10px_rgba(255,107,0,0.2)] cursor-pointer"
                    >
                      <span className="relative z-10 text-xs tracking-wider">MUAT LEBIH BANYAK</span>
                      <div className="absolute inset-0 bg-brand-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </button>
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
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search articles..."
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-orange outline-none transition-all"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300">
                      {searchQuery ? (
                        <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-brand-orange cursor-pointer">
                          <i className="ri-close-line text-lg animate-fade-in"></i>
                        </button>
                      ) : (
                        <i className="ri-search-line text-lg"></i>
                      )}
                    </span>
                  </div>
                </div>

                {/* Latest Insights Widget */}
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                  <h4 className="text-sm font-black uppercase tracking-widest mb-8 border-b border-gray-100 pb-4">Latest Insights</h4>
                  <div className="space-y-8">
                    {sortByDateDesc(articles).slice(0, 5).map((a, i) => (
                      <Link href={`${a.slug}`} key={i} className="flex gap-4 group">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 bg-[#FAF9F6]">
                          <Image 
                            src={a.featuredImage ? `/assets/images/blog/${a.featuredImage}` : '/assets/images/placeholder.jpg'} 
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
                            <span>{getReadingTime(a.content)} MIN READ</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
              
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
