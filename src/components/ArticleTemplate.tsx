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
  Award
} from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import JsonLd from './JsonLd';
import { generatePageSchema } from '@/lib/schema-generator';
import RelatedLinks from './RelatedLinks';
import MaklonCalculator from './MaklonCalculator';
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
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        {/* Banner Hero Section */}
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
            <div className="max-w-4xl">
              <Breadcrumb 
                items={[
                  { label: "Home", path: "/" },
                  { label: "News & Blog", path: "/news-blog" },
                  { label: article.title, path: "" }
                ]} 
              />
              
              <div className="flex flex-wrap items-center gap-4 mt-8 mb-6">
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

              <h1 className="text-4xl md:text-6xl font-display text-white leading-[1.15] tracking-tight mb-6">
                {article.title}
              </h1>

              {/* Author badge in Hero */}
              <div className="flex items-center gap-3 border-t border-white/10 pt-6 mt-8">
                <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white font-black text-sm shadow-md">
                  {article.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest font-black">Dipublikasikan Oleh</p>
                  <p className="text-sm font-bold text-white uppercase mt-0.5">{article.author}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Area */}
        <section className="container-custom py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Main Content (8 cols on lg) */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Featured Image card with gradient and visual indicators */}
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

              {/* Key Takeaways Box (UI-Based element) */}
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
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Share & Article Info Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-100 text-xs">
                <div className="flex items-center gap-3 text-gray-500 font-bold uppercase tracking-wider">
                  <span>Merek: <strong className="text-brand-black">Dreamlab Indonesia</strong></span>
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

              {/* Main Text Content - Rendered with interactive UI-based components */}
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
              } />
              
              {/* Inline Call-to-Action Card for Mobile readers */}
              <div className="bg-gradient-to-br from-[#1A1A1A] to-brand-black p-8 rounded-[32px] text-white overflow-hidden relative shadow-xl border border-white/5 lg:hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/20 rounded-full blur-3xl" />
                <h3 className="text-xl font-bold uppercase leading-tight font-display mb-4">Konsultasi Dengan Ahli Maklon</h3>
                <p className="text-white/70 text-xs mb-6 leading-relaxed font-medium">
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
              <div className="p-8 md:p-10 bg-white rounded-[32px] border border-gray-100 flex flex-col md:flex-row gap-6 md:gap-8 items-center shadow-sm">
                <div className="w-20 h-20 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange font-black text-3xl">
                  {article.author.charAt(0).toUpperCase()}
                </div>
                <div className="text-center md:text-left flex-1">
                  <span className="text-[9px] font-black text-brand-orange uppercase tracking-widest mb-1 block">Penulis Wawasan</span>
                  <h4 className="text-xl font-display text-brand-black uppercase mb-2">{article.author}</h4>
                  <p className="text-brand-black/60 text-xs font-semibold leading-relaxed max-w-xl">
                    Tim formulator dan pakar bisnis kecantikan dari Dreamlab Indonesia. Kami berkomitmen menyajikan wawasan ilmiah dan panduan industri untuk membantu Anda membangun merek kosmetik yang sukses dan kompetitif.
                  </p>
                </div>
              </div>

              {/* Semantic Internal Linking */}
              <RelatedLinks currentSlug={article.slug} categories={article.categories} allArticles={allArticles} />
            </div>

            {/* Premium Interactive Sidebar (4 cols on lg) */}
            <aside className="lg:col-span-4 space-y-8">
              
              {/* Dynamic Maklon Cost Calculator Widget - Conversion Focus! */}
              <div className="sticky top-28 space-y-8">
                <MaklonCalculator />

                {/* Latest News Widget */}
                <div className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm">
                  <h3 className="text-base font-bold mb-6 flex items-center gap-3 text-brand-black uppercase tracking-wider">
                    LATEST NEWS
                    <span className="flex-grow h-[1px] bg-gray-100" />
                  </h3>
                  <div className="space-y-6">
                    {recentPosts.slice(0, 4).map((post, i) => (
                      <Link key={i} href={`${post.slug.startsWith('/') ? post.slug : `/${post.slug}`}`} className="flex gap-4 group">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-sm bg-gray-50 border border-gray-100">
                          <Image 
                            src={post.featuredImage ? `/assets/images/blog/${post.featuredImage}` : '/assets/images/placeholder.jpg'} 
                            alt={post.title} 
                            title={`${post.title} — Dreamlab Indonesia`} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-500" 
                            sizes="120px" 
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
                <div className="bg-brand-orange p-8 md:p-10 rounded-[32px] text-white overflow-hidden group shadow-xl relative">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
                  <div className="relative z-10">
                    <span className="text-[9px] font-black bg-white/15 px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                      Konsultasi Gratis
                    </span>
                    <h3 className="text-2xl font-display uppercase leading-tight mb-4">
                      Punya Ide Formulasi Skincare?
                    </h3>
                    <p className="text-white/80 text-xs mb-8 leading-relaxed font-semibold">
                      Formulasi eksklusif dengan riset laboratorium, sertifikasi BPOM halal, dan kemasan kosmetik premium. Mari jadikan nyata bersama Dreamlab.
                    </p>
                    <Link 
                      href="https://wa.me/62881027240339?text=Halo%20Dreamlab%2C%20saya%20ingin%20konsultasi%20mengenai%20pembuatan%20brand%20kosmetik%20saya%20sendiri."
                      target="_blank"
                      className="flex items-center justify-center gap-2 w-full bg-white hover:bg-brand-black text-brand-orange hover:text-white py-4 rounded-2xl font-black text-center text-xs tracking-widest transition-all shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4" />
                      HUBUNGI WHATSAPP
                    </Link>
                  </div>
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
