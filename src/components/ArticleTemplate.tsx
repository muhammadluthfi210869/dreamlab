'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  Copy,
  MessageCircle,
  Share2,
} from 'lucide-react';
import JsonLd from './JsonLd';
import { generatePageSchema } from '@/lib/schema-generator';
import RelatedLinks from './RelatedLinks';
import InteractiveArticleBody from './InteractiveArticleBody';
import { resolveArticleImageSrc, resolveSiteImageUrl } from '@/lib/asset-paths';
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

interface RecentPostData {
  slug: string;
  title: string;
  featuredImage: string | null;
  publishDate: string;
}

interface ArticleTemplateProps {
  article: ArticleData;
  recentPosts: RecentPostData[];
  allArticles: Array<{ slug: string; title: string; categories: string[] }>;
  faqs?: { question: string; answer: string }[];
}

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({ article, recentPosts = [], allArticles = [], faqs = [] }) => {
  const [copied, setCopied] = useState(false);

  const articleUrl = `https://dreamlab.id${article.slug.startsWith('/') ? article.slug : `/${article.slug}`}`;

  const readingTime = useMemo(() => {
    const text = article.content.replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).length;
    const time = Math.ceil(wordCount / 200);
    return time < 1 ? 1 : time;
  }, [article.content]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const featuredImageSrc = resolveArticleImageSrc(article.featuredImage);

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
    image: resolveSiteImageUrl(article.featuredImage),
    article: {
      headline: article.title,
      image: resolveSiteImageUrl(article.featuredImage),
      datePublished: article.publishDate,
      author: article.author,
    },
    faqs: faqs.length > 0 ? faqs : undefined,
  });

  return (
    <>
      <JsonLd data={pageSchema} />

      <div className="bg-[#FAF9F6] min-h-screen pt-24 pb-16 md:pt-28 lg:pt-32">
        <div className="container-custom">
          <header className="max-w-5xl mx-auto text-center space-y-6 mb-10">
            <nav className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400">
              <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
              <span>/</span>
              <Link href="/news-blog" className="hover:text-brand-orange transition-colors">News & Blog</Link>
              <span>/</span>
              <span className="text-neutral-500">{article.categories[0] || 'Uncategorized'}</span>
            </nav>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                {article.categories[0] || 'Uncategorized'}
              </span>
              <span className="text-neutral-300">•</span>
              <span className="text-neutral-500 text-xs font-bold">
                {new Date(article.publishDate).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span className="text-neutral-300">•</span>
              <div className="flex items-center gap-1 text-brand-orange text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>{readingTime} Menit Baca</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-brand-black leading-tight tracking-tight max-w-4xl mx-auto">
              {article.title}
            </h1>

            <p className="max-w-3xl mx-auto text-sm md:text-lg leading-relaxed text-neutral-600 font-medium">
              {article.excerpt}
            </p>

            <div className="rounded-[28px] overflow-hidden shadow-sm border border-neutral-200/40 bg-white max-w-4xl mx-auto">
              <Image
                src={featuredImageSrc}
                alt={article.title}
                title={`${article.title} - Dreamlab Indonesia`}
                width={1200}
                height={630}
                quality={75}
                className="w-full h-auto"
                priority
                sizes="(max-width: 1280px) 100vw, 896px"
              />
            </div>
          </header>

          <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
            <div className="space-y-6 min-w-0">
              <div className="bg-white border border-neutral-200/50 p-6 md:p-10 lg:p-12 rounded-[28px] text-brand-black shadow-sm font-sans text-base leading-relaxed max-w-4xl mx-auto xl:max-w-none">
                <InteractiveArticleBody htmlContent={article.content} />

                <div className="mt-10 pt-6 border-t border-neutral-200 flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold font-display text-lg shadow-sm">
                      {article.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Penulis &amp; Editor</p>
                      <h4 className="text-sm font-bold text-brand-black uppercase">{article.author}</h4>
                    </div>
                  </div>
                  <div className="text-[11px] text-neutral-500 bg-neutral-50 border border-neutral-200/60 px-3 py-1.5 rounded-lg">
                    <span className="font-bold text-neutral-700">Ditinjau oleh:</span> Tim Regulasi &amp; Formulator R&amp;D Dreamlab (CPKB Grade A)
                  </div>
                </div>

                {/* Contextual B2B Manufacturing Service Box */}
                <div className="mt-8 p-6 md:p-8 bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl text-white border border-neutral-800 shadow-md">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 bg-brand-orange/20 text-brand-orange border border-brand-orange/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                        <span>Solusi Manufaktur B2B</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-display font-normal text-white uppercase leading-snug">
                        Tertarik Memproduksi Kosmetik dengan Standar Pabrik Resmi?
                      </h3>
                      <p className="text-white/70 text-xs md:text-sm leading-relaxed max-w-xl">
                        Dreamlab melayani maklon kosmetik satu atap: riset formula eksklusif (1 Client = 1 Formula), perizinan BPOM &amp; Halal, hingga produksi massal bersertifikat CPKB Grade A.
                      </p>
                      <div className="flex flex-wrap gap-3 pt-2 text-xs font-bold text-neutral-300">
                        <Link href="/jasa-maklon-kosmetik" className="hover:text-brand-orange underline underline-offset-4 decoration-brand-orange/40">
                          → Layanan Maklon Kosmetik
                        </Link>
                        <Link href="/biaya-maklon-skincare" className="hover:text-brand-orange underline underline-offset-4 decoration-brand-orange/40">
                          → Biaya &amp; HPP Maklon
                        </Link>
                        <Link href="/moq-maklon-kosmetik" className="hover:text-brand-orange underline underline-offset-4 decoration-brand-orange/40">
                          → Panduan MOQ 500+ Pcs
                        </Link>
                      </div>
                    </div>
                    <Link
                      href={`/thankyou/google/?source=organic&from=${encodeURIComponent(article.slug)}&cta=article_body_box`}
                      className="shrink-0 bg-brand-orange hover:bg-[#D98200] text-white px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-brand-orange/25"
                    >
                      Konsultasi Gratis
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-neutral-200/50 text-xs max-w-4xl mx-auto xl:max-w-none">
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 bg-white hover:bg-neutral-50 text-neutral-600 px-3.5 py-2 rounded-xl transition-all font-bold border border-neutral-200"
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
                    className="flex items-center gap-2 bg-white hover:bg-neutral-50 text-neutral-600 px-3.5 py-2 rounded-xl transition-all font-bold border border-neutral-200"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Bagikan WA</span>
                  </a>
                </div>
              </div>

              <div className="max-w-4xl mx-auto xl:max-w-none">
                <RelatedLinks currentSlug={article.slug} categories={article.categories} allArticles={allArticles} />
              </div>

            </div>

            <aside className="w-full max-w-4xl mx-auto xl:max-w-none xl:sticky xl:top-28 space-y-8">
              <div className="bg-white p-6 rounded-2xl border border-neutral-200/60 shadow-sm">
                <h3 className="text-[10px] font-black mb-6 flex items-center gap-3 text-neutral-400 uppercase tracking-widest">
                  LATEST NEWS
                  <span className="flex-grow h-[1px] bg-neutral-100" />
                </h3>
                <div className="space-y-6">
                  {recentPosts.slice(0, 4).map((post, i) => (
                    <Link key={i} href={`${post.slug.startsWith('/') ? post.slug : `/${post.slug}`}`} className="flex gap-4 group">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-50 border border-neutral-100">
                        <Image
                          src={resolveArticleImageSrc(post.featuredImage)}
                          alt={post.title}
                          title={`${post.title} - Dreamlab Indonesia`}
                          fill
                          className="object-contain"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-xs font-bold leading-snug group-hover:text-brand-orange transition-colors line-clamp-2 uppercase">
                          {post.title}
                        </h4>
                        <span className="text-[9px] text-neutral-400 font-bold uppercase mt-1">
                          {new Date(post.publishDate).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-brand-black p-6 rounded-2xl text-white shadow-md relative overflow-hidden border border-neutral-800">
                <span className="text-[9px] font-black bg-brand-orange/20 text-brand-orange border border-brand-orange/30 px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                  Konsultasi Pabrik Kosmetik
                </span>
                <h3 className="text-lg font-display uppercase leading-tight mb-2 text-white">
                  Mulai Brand Anda Hari Ini
                </h3>
                <p className="text-neutral-400 text-xs mb-4 leading-relaxed font-semibold">
                  Konsultasikan formulasi produk, sertifikasi BPOM, dan desain kemasan bersama tim expert Dreamlab.
                </p>
                <div className="space-y-2 mb-6 text-[10px] font-bold text-neutral-300">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-orange font-black">✓</span>
                    <span>MOQ fleksibel (target awal 500+ pcs)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-orange font-black">✓</span>
                    <span>1 Client = 1 Custom Formula</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-orange font-black">✓</span>
                    <span>Pabrik CPKB Grade A &amp; BPOM</span>
                  </div>
                </div>
                <Link
                  href={`/thankyou/google/?source=organic&from=${encodeURIComponent(article.slug)}&cta=sidebar_article`}
                  className="flex items-center justify-center gap-2 w-full bg-brand-orange hover:bg-[#D98200] text-white py-3.5 rounded-xl font-bold text-center text-xs tracking-wider transition-all shadow-md shadow-brand-orange/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  KONSULTASI VIA WHATSAPP
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleTemplate;
