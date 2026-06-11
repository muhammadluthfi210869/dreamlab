'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  BookOpen, 
  Check, 
  MessageCircle, 
  Share2, 
  Copy, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  Award,
  ExternalLink,
  ChevronDown,
  ArrowUpRight,
  ThumbsUp,
  ThumbsDown,
  List,
  X
} from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import JsonLd from './JsonLd';
import { generatePageSchema } from '@/lib/schema-generator';
import RelatedLinks from './RelatedLinks';
import InteractiveArticleBody from './InteractiveArticleBody';
import '@/styles/legacy-elementor.css';

interface ArticleData {
  slug: string;
  title: string;
  categories: string[];
  excerpt: string;
  content: string;
  featuredImage: string | null;
  publishDate: string;
  author: string;
}

interface ArticleTemplateProps {
  article: ArticleData;
  recentPosts: ArticleData[];
  allArticles: Array<{ slug: string; title: string; categories: string[] }>;
}

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({ article, recentPosts = [], allArticles = [] }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showMobileCta, setShowMobileCta] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const [showMobileToc, setShowMobileToc] = useState(false);
  const [isEeatOpen, setIsEeatOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<'like' | 'dislike' | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const articleUrl = `https://dreamlab.id${article.slug.startsWith('/') ? article.slug : `/${article.slug}`}`;
  const articleImage = article.featuredImage
    ? `https://dreamlab.id/assets/images/blog/${article.featuredImage}`
    : 'https://dreamlab.id/assets/images/placeholder.jpg';

  // Calculate Reading Time (assuming average 200 WPM)
  const readingTime = useMemo(() => {
    const text = article.content.replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).length;
    const time = Math.ceil(wordCount / 200);
    return time < 1 ? 1 : time;
  }, [article.content]);

  // Key Takeaways Builder
  const takeaways = useMemo(() => {
    const cat = article.categories[0] || '';
    if (cat.toLowerCase().includes('skincare') || article.title.toLowerCase().includes('skincare')) {
      return [
        "Tren formulasi skincare saat ini berfokus pada kekuatan skin barrier dan kombinasi bahan aktif herbal.",
        "Prosedur maklon skincare di Dreamlab sudah mencakup formulasi kustom, izin BPOM, serta sertifikat Halal resmi.",
        "Kuantitas minimum produksi (MOQ) terjangkau untuk memudahkan pemilik brand baru memulai bisnis kecantikan."
      ];
    }
    if (cat.toLowerCase().includes('kosmetik') || article.title.toLowerCase().includes('kosmetik') || article.title.toLowerCase().includes('lip')) {
      return [
        "Permintaan produk kosmetik/makeup lokal (cushion, lip cream) dengan ketahanan tinggi sedang melonjak.",
        "Dreamlab menghadirkan formula makeup hibrida (skincare-infused makeup) yang merawat kulit sekaligus mempercantik.",
        "Layanan lengkap satu pintu (One-Stop Service) mulai dari sampel awal, lisensi, hingga desain kemasan siap jual."
      ];
    }
    return [
      "Wawasan mendalam tentang peluang industri kecantikan dan maklon kosmetik di Indonesia.",
      "Panduan standar kualitas produksi CPKB Grade A yang menjamin mutu dan higienitas produk.",
      "Cara cerdas membangun brand kosmetik sendiri dengan investasi terukur dan pendampingan ahli dari Dreamlab."
    ];
  }, [article.categories, article.title]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const headings = useMemo(() => {
    if (typeof window === 'undefined') return [];
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(article.content, 'text/html');
      const hElements = doc.querySelectorAll('h2, h3');
      const slugify = (str: string) => {
        return str
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
      };
      
      // Filter out headings that belong to the legacy TOC container
      return Array.from(hElements)
        .filter(h => {
          let parent = h.parentElement;
          while (parent) {
            if (parent.className.includes('ez-toc') || parent.id.includes('ez-toc')) {
              return false;
            }
            parent = parent.parentElement;
          }
          return true;
        })
        .map(h => {
          const text = h.textContent || '';
          return {
            id: slugify(text),
            text,
            level: h.tagName.toLowerCase() === 'h2' ? 2 : 3
          };
        });
    } catch (e) {
      console.error(e);
      return [];
    }
  }, [article.content]);

  useEffect(() => {
    if (!isMounted) return;
    
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
      
      // Show mobile sticky CTA after scrolling past 400px
      if (window.scrollY > 400) {
        setShowMobileCta(true);
      } else {
        setShowMobileCta(false);
      }

      // Scroll Spy for Headings
      const hElements = document.querySelectorAll('.article-content-interactive h2, .article-content-interactive h3');
      let currentActive = '';
      
      for (let i = 0; i < hElements.length; i++) {
        const el = hElements[i];
        const rect = el.getBoundingClientRect();
        if (rect.top < 150) {
          currentActive = el.id;
        } else {
          break;
        }
      }
      
      if (currentActive) {
        setActiveId(currentActive);
      } else if (hElements.length > 0) {
        setActiveId(hElements[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMounted, article.content]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pageSchema = generatePageSchema({
    url: article.slug,
    title: article.title,
    description: article.excerpt,
    h1: article.title,
    type: 'article',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'News & Blog', url: '/news-blog/' },
      { name: article.title },
    ],
    image: articleImage,
    article: {
      headline: article.title,
      image: articleImage,
      datePublished: article.publishDate,
      author: article.author,
    },
  });

  return (
    <>
      <JsonLd data={pageSchema} />

      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-[6px] bg-brand-orange z-[9999] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      <article className="bg-[#FFFFFB] min-h-screen">
        {/* Centered Banner Hero Section */}
        <section className="relative pt-44 pb-28 overflow-hidden bg-brand-black">
          {/* Background Image Overlay with subtle blur & parallax effect */}
          <div className="absolute inset-0 opacity-25">
            <Image 
              src={article.featuredImage ? `/assets/images/blog/${article.featuredImage}` : '/assets/images/placeholder.jpg'} 
              alt={article.title} 
              title={`${article.title} — Dreamlab Indonesia`}
              fill 
              className="object-cover scale-105 blur-[2px]"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/90 to-transparent" />
          </div>

          <div className="relative z-10 container-custom">
            <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
              <Breadcrumb 
                items={[
                  { label: "Home", path: "/" },
                  { label: "News & Blog", path: "/news-blog" },
                  { label: article.title, path: "" }
                ]} 
              />
              
              <div className="flex flex-wrap items-center justify-center gap-4 mt-8 mb-6">
                <span className="bg-brand-orange text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-orange/20">
                  {article.categories[0] || "Uncategorized"}
                </span>
                
                <div className="flex items-center gap-2 text-white/50 text-xs font-bold">
                  <span>•</span>
                  <span>{new Date(article.publishDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-brand-orange">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{readingTime} Menit Baca</span>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-display text-white leading-[1.15] tracking-tight mb-6 text-center max-w-3xl">
                {article.title}
              </h1>

              {/* Centered Author badge */}
              <div className="flex flex-col items-center gap-2 border-t border-white/10 pt-6 mt-8 w-full max-w-xs">
                <div className="w-12 h-12 rounded-full bg-brand-orange flex items-center justify-center text-white font-black text-base shadow-md">
                  {article.author.charAt(0).toUpperCase()}
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-white/40 uppercase tracking-widest font-black">Dipublikasikan Oleh</p>
                  <p className="text-sm font-bold text-white uppercase mt-0.5">{article.author}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2-Column Editorial Grid Layout */}
        <section className="container-custom py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Main Content (8 cols on lg) */}
            <div className="col-span-12 lg:col-span-8 space-y-12">
              
              {/* Featured Image */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative aspect-video rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl group border-4 border-white"
              >
                <Image 
                  src={article.featuredImage ? `/assets/images/blog/${article.featuredImage}` : '/assets/images/placeholder.jpg'} 
                  alt={article.title} 
                  title={`${article.title} — Dreamlab Indonesia`}
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
              </motion.div>

              {/* Key Takeaways Box */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-white rounded-[32px] p-6 md:p-8 border border-gray-100 shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 rounded-full blur-2xl" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center text-brand-orange">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-black uppercase tracking-tight font-display">
                    Ringkasan Cepat (Key Takeaways)
                  </h3>
                </div>

                <ul className="space-y-4">
                  {takeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-brand-black/75 leading-relaxed">
                      <div className="w-5 h-5 bg-brand-orange/15 border border-brand-orange/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-brand-orange">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="font-semibold">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Share & Article Info Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-100 text-xs">
                <div className="flex items-center gap-3 text-gray-400 font-bold uppercase tracking-wider">
                  <span>Merek: <strong className="text-brand-black">Dreamlab</strong></span>
                  <span>|</span>
                  <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-brand-orange" /> Grade A CPKB & Halal</span>
                </div>
                
                {/* Share Actions */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 bg-gray-50 hover:bg-brand-orange/10 text-gray-600 hover:text-brand-orange px-3.5 py-2 rounded-xl transition-all font-bold border border-gray-100"
                    title="Salin Tautan"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-500">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Salin Link</span>
                      </>
                    )}
                  </button>

                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent(`${article.title} - ${articleUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-600 px-3.5 py-2 rounded-xl transition-all font-bold border border-emerald-100"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Bagikan WA</span>
                  </a>
                </div>
              </div>

              {/* Centered Main Reading Content Container */}
              <div className="bg-white border border-gray-100 p-8 md:p-12 rounded-[32px] text-brand-black shadow-sm font-sans text-base leading-relaxed max-w-[720px] mx-auto">
                
                {/* Native Table of Contents (Inline at the top of the article body) */}
                {headings.length > 0 && (
                  <div className="bg-gradient-to-br from-brand-orange/5 to-[#FFFBF8] border border-brand-orange/10 p-6 md:p-8 rounded-3xl mb-10 shadow-sm">
                    <h3 className="text-sm font-bold text-brand-black uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2 font-display">
                      <List className="w-4.5 h-4.5 text-brand-orange" />
                      Daftar Isi Artikel
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5">
                      {headings.map((h, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            const el = document.getElementById(h.id);
                            if (el) {
                              const yOffset = -120; // sticky header offset
                              const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
                              window.scrollTo({ top: y, behavior: 'smooth' });
                            }
                          }}
                          className={`text-left hover:text-brand-orange transition-all duration-300 text-xs font-semibold flex items-center gap-2 group ${
                            h.level === 3 ? 'pl-4 text-brand-black/60 font-medium' : 'text-brand-black/85'
                          }`}
                        >
                          <ChevronRight className="w-3 h-3 text-brand-orange/40 group-hover:text-brand-orange group-hover:translate-x-0.5 transition-transform shrink-0" />
                          <span className="truncate">{h.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* E-E-A-T Quality & Compliance Accordion */}
                <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm mb-10 overflow-hidden transition-all duration-300">
                  <button 
                    onClick={() => setIsEeatOpen(!isEeatOpen)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                      <div>
                        <p className="font-black uppercase tracking-wider text-[9px] text-emerald-600 leading-none">Terverifikasi & Layak Audit</p>
                        <p className="text-sm font-bold text-brand-black group-hover:text-brand-orange transition-colors mt-1.5 leading-none">
                          Formulasi CPKB Grade A & Regulasi BPOM RI
                        </p>
                      </div>
                    </div>
                    <div className={`p-1.5 rounded-lg bg-gray-50 text-gray-400 group-hover:text-brand-orange transition-all ${isEeatOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isEeatOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-6 mt-6 border-t border-gray-100 space-y-4">
                          <p className="text-xs text-brand-black/60 leading-relaxed font-semibold">
                            Dokumen artikel ini telah melalui verifikasi teknis oleh tim riset, pengembangan (R&D) formula, dan kepatuhan regulasi di Dreamlab Indonesia. Konten disusun agar sesuai dengan pedoman Cara Pembuatan Kosmetika yang Baik (CPKB) dan persyaratan sertifikasi resmi.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-[11px] font-bold text-brand-black/80">
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              Standar CPKB Grade A Terpenuhi
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              Sertifikasi Halal MUI/BPJPH
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              Formula Bebas Bahan Berbahaya
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              Dukungan Regulasi BPOM 100%
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-2 text-[10px]">
                            <a href="https://pom.go.id" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange rounded-lg transition-colors font-bold">
                              Direktorat Registrasi BPOM <ArrowUpRight className="w-3 h-3" />
                            </a>
                            <a href="https://halal.go.id" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange rounded-lg transition-colors font-bold">
                              BPJPH Kemenag Halal <ArrowUpRight className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <InteractiveArticleBody htmlContent={
                  article.content
                    .replace(/https?:\/\/dreamlab\.id\/wp-content\/uploads\/[^\s"'>]*\/([^\/\s"'>]+\.(?:webp|png|jpg|jpeg|svg|gif))/gi, '/assets/images/$1')
                    .replace(/\/wp-content\/uploads\/[^\s"'>]*\/([^\/\s"'>]+\.(?:webp|png|jpg|jpeg|svg|gif))/gi, '/assets/images/$1')
                    .replace(/bv-data-src=/gi, 'data-src=')
                    .replace(/src="data:image\/svg\+xml[^"]*"/gi, '')
                    .replace(/data-src=/gi, 'src=')
                    .replace(/srcset="[^"]*"/g, '')
                    .replace(/<img\s/gi, '<img loading="lazy" ')
                    .replace(/loading="lazy"\s+loading="lazy"/gi, 'loading="lazy"')
                    .replace(/bv-data-srcset="[^"]*"/g, '')
                    .replace(/sizes="[^"]*"/g, '')
                    .replace(/data-id="[^"]*"/g, '')
                    .replace(/�|[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{200D}]/gu, '')
                    .replace(/\s{3,}/g, ' ')
                } />

                {/* Citations index in reading wrapper */}
                <div className="mt-12 pt-8 border-t border-gray-100 space-y-6">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-brand-orange" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-brand-black">Sitasi & Rujukan Regulasi</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a 
                      href="https://pom.go.id/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-4 rounded-xl border border-gray-100 hover:border-brand-orange/20 hover:shadow-sm text-brand-black/80 transition-all flex items-center justify-between group bg-white"
                    >
                      <div>
                        <span className="text-[9px] font-black text-brand-orange uppercase block mb-1">Standar Regulasi</span>
                        <span className="text-xs font-bold text-brand-black">Direktorat Registrasi Kosmetik BPOM RI</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-orange group-hover:translate-x-0.5 transition-all" />
                    </a>
                    <a 
                      href="https://dgip.go.id/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-4 rounded-xl border border-gray-100 hover:border-brand-orange/20 hover:shadow-sm text-brand-black/80 transition-all flex items-center justify-between group bg-white"
                    >
                      <div>
                        <span className="text-[9px] font-black text-brand-orange uppercase block mb-1">Perlindungan HKI</span>
                        <span className="text-xs font-bold text-brand-black">Sertifikasi Paten Kemenkumham RI</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-orange group-hover:translate-x-0.5 transition-all" />
                    </a>
                  </div>
                </div>

              </div>

              {/* Reader Feedback Survey Widget */}
              <div className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm text-center space-y-6 max-w-[720px] mx-auto">
                {!feedbackSubmitted ? (
                  <>
                    <h4 className="text-base font-bold text-brand-black uppercase tracking-wider">
                      Apakah informasi maklon ini membantu Anda?
                    </h4>
                    <p className="text-xs text-brand-black/60 font-semibold max-w-md mx-auto leading-relaxed">
                      Kritik dan saran Anda sangat membantu kami dalam menyajikan wawasan bisnis dan formulasi kecantikan yang akurat.
                    </p>
                    <div className="flex justify-center gap-4 pt-2">
                      <button
                        onClick={() => {
                          setFeedbackRating('like');
                          setFeedbackSubmitted(true);
                        }}
                        className="flex items-center gap-2 px-5 py-3 border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-500 hover:text-white text-emerald-600 rounded-2xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Bermanfaat
                      </button>
                      <button
                        onClick={() => {
                          setFeedbackRating('dislike');
                          setFeedbackSubmitted(true);
                        }}
                        className="flex items-center gap-2 px-5 py-3 border border-rose-100 bg-rose-50/50 hover:bg-rose-500 hover:text-white text-rose-600 rounded-2xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        Kurang Membantu
                      </button>
                    </div>
                  </>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-4 space-y-2 text-emerald-600"
                  >
                    <CheckCircle2 className="w-12 h-12 mx-auto stroke-[2]" />
                    <h4 className="text-base font-bold uppercase tracking-wider">Terima kasih atas tanggapan Anda!</h4>
                    <p className="text-xs text-brand-black/60 font-semibold leading-relaxed">
                      Masukan Anda telah kami catat untuk perbaikan berkelanjutan wawasan R&D Dreamlab.
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Inline Call-to-Action Card for Mobile readers */}
              <div className="bg-gradient-to-br from-[#1A1A1A] to-brand-black p-8 rounded-[32px] text-white overflow-hidden relative shadow-xl border border-white/5 lg:hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/20 rounded-full blur-3xl" />
                <h3 className="text-xl font-bold uppercase leading-tight font-display mb-4">Konsultasi Dengan Ahli Maklon</h3>
                <p className="text-white/70 text-xs mb-6 leading-relaxed font-semibold">
                  Diskusikan visi produk kecantikan Anda hari ini. Kami bantu dari formulasi bahan baku berkualitas, desain, hingga pendaftaran izin BPOM & Halal.
                </p>
                <Link 
                  href="https://wa.me/62881027240339"
                  className="flex items-center justify-center gap-2 w-full bg-brand-orange hover:bg-white text-white hover:text-brand-orange py-3.5 rounded-2xl font-black text-center text-xs tracking-widest transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  KONSULTASI GRATIS
                </Link>
              </div>

              {/* Author Section */}
              <div className="p-8 md:p-10 bg-white rounded-[32px] border border-gray-100 flex flex-col md:flex-row gap-6 md:gap-8 items-center shadow-sm max-w-[720px] mx-auto">
                <div className="w-20 h-20 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange font-black text-3xl shrink-0">
                  {article.author.charAt(0).toUpperCase()}
                </div>
                <div className="text-center md:text-left flex-1">
                  <span className="text-[9px] font-black text-brand-orange uppercase tracking-widest mb-1 block">Penulis Wawasan</span>
                  <h4 className="text-xl font-display text-brand-black uppercase mb-2">{article.author}</h4>
                  <p className="text-brand-black/60 text-xs font-semibold leading-relaxed">
                    Tim formulator dan pakar bisnis kecantikan dari Dreamlab Indonesia. Kami berkomitmen menyajikan wawasan ilmiah dan panduan industri untuk membantu Anda membangun merek kosmetik yang sukses dan kompetitif.
                  </p>
                </div>
              </div>

              {/* Semantic Internal Linking */}
              <div className="max-w-[720px] mx-auto">
                <RelatedLinks currentSlug={article.slug} categories={article.categories} allArticles={allArticles} />
              </div>
            </div>

            {/* RIGHT COLUMN: Sticky Latest News & WhatsApp CTA */}
            <aside className="col-span-12 lg:col-span-4 sticky top-8 max-h-[calc(100vh-80px)] overflow-y-auto no-scrollbar py-2 shrink-0 space-y-8">
              
              {/* Latest News Widget */}
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <h3 className="text-[10px] font-black mb-6 flex items-center gap-3 text-brand-black/40 uppercase tracking-widest">
                  LATEST NEWS
                  <span className="flex-grow h-[1px] bg-gray-100" />
                </h3>
                <div className="space-y-6">
                  {recentPosts.slice(0, 4).map((post, i) => (
                    <Link key={i} href={`${post.slug.startsWith('/') ? post.slug : `/${post.slug}`}`} className="flex gap-4 group">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-sm bg-gray-50 border border-gray-100">
                        <Image 
                          src={post.featuredImage ? `/assets/images/blog/${post.featuredImage}` : '/assets/images/placeholder.jpg'} 
                          alt={post.title} 
                          title={`${post.title} — Dreamlab Indonesia`} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500" 
                          sizes="80px" 
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-xs font-bold leading-snug group-hover:text-brand-orange transition-colors line-clamp-2 uppercase">
                          {post.title}
                        </h4>
                        <span className="text-[9px] text-gray-400 font-bold uppercase mt-1.5">
                          {new Date(post.publishDate).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sticky CTA Widget */}
              <div className="bg-brand-orange p-6 rounded-[32px] text-white overflow-hidden group shadow-xl relative">
                <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
                <div className="relative z-10">
                  <span className="text-[9px] font-black bg-white/15 px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                    Konsultasi Gratis
                  </span>
                  <h3 className="text-xl font-display uppercase leading-tight mb-4">
                    Punya Ide Formulasi Skincare?
                  </h3>
                  <p className="text-white/85 text-xs mb-8 leading-relaxed font-semibold">
                    Formulasi eksklusif dengan riset laboratorium, sertifikasi BPOM halal, dan kemasan kosmetik premium. Mari jadikan nyata bersama Dreamlab.
                  </p>
                  <Link 
                    href="https://wa.me/62881027240339?text=Halo%20Dreamlab%2C%20saya%20ingin%20konsultasi%20mengenai%20pembuatan%20brand%20kosmetik%20saya%20sendiri."
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full bg-white hover:bg-brand-black text-brand-orange hover:text-white py-3.5 rounded-xl font-black text-center text-xs tracking-widest transition-all shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    HUBUNGI WHATSAPP
                  </Link>
                </div>
              </div>
            </aside>

          </div>
        </section>
      </article>

      {/* Floating Bottom Sticky CTA for Mobile devices */}
      <AnimatePresence>
        {showMobileCta && (
          <motion.div 
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A] border-t border-white/5 px-5 py-4 flex items-center justify-between md:hidden shadow-[0_-8px_30px_rgb(0,0,0,0.3)]"
          >
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-brand-orange uppercase tracking-widest leading-none">Konsultasi Maklon</span>
              <span className="text-xs font-bold text-white mt-1 leading-none">Gratis Formulasi & BPOM</span>
            </div>
            
            <a 
              href="https://wa.me/62881027240339?text=Halo%20Dreamlab%2C%20saya%20ingin%20konsultasi%20maklon%20dari%20halaman%20artikel%20Anda."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-brand-orange text-white px-4 py-2.5 rounded-xl text-[11px] font-black tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              CHAT WA
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ArticleTemplate;
