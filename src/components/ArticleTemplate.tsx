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

interface ArticleTemplateProps {
  article: ArticleData;
  recentPosts: ArticleData[];
  allArticles: Array<{ slug: string; title: string; categories: string[] }>;
}

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({ article, recentPosts = [], allArticles = [] }) => {
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

            <div className="relative aspect-video rounded-[28px] overflow-hidden shadow-sm border border-neutral-200/40 bg-white max-w-4xl mx-auto">
              <Image
                src={featuredImageSrc}
                alt={article.title}
                title={`${article.title} - Dreamlab Indonesia`}
                fill
                className="object-cover"
                priority
                unoptimized
                sizes="(max-width: 1280px) 100vw, 896px"
              />
            </div>
          </header>

          <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
            <div className="space-y-6 min-w-0">
              <div className="bg-white border border-neutral-200/50 p-6 md:p-10 lg:p-12 rounded-[28px] text-brand-black shadow-sm font-sans text-base leading-relaxed max-w-4xl mx-auto xl:max-w-none">
                <InteractiveArticleBody
                  htmlContent={
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
                      .replace(/|[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{200D}]/gu, '')
                      .replace(/\s{3,}/g, ' ')
                  }
                />

                <div className="mt-10 pt-6 border-t border-neutral-200 flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold font-display text-lg shadow-sm">
                    {article.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Penulis</p>
                    <h4 className="text-sm font-bold text-brand-black uppercase">{article.author}</h4>
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
                          unoptimized
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

              <div className="bg-brand-black p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
                <span className="text-[9px] font-black bg-white/10 px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                  Konsultasi Gratis
                </span>
                <h3 className="text-lg font-display uppercase leading-tight mb-2">
                  Mulai Brand Anda Hari Ini
                </h3>
                <p className="text-neutral-400 text-xs mb-6 leading-relaxed font-semibold">
                  Konsultasikan formulasi produk, sertifikasi BPOM, dan desain kemasan bersama tim expert Dreamlab.
                </p>
                <Link
                  href="/thankyou/google/"
                  className="flex items-center justify-center gap-2 w-full bg-brand-orange hover:bg-[#D98200] text-white py-3.5 rounded-xl font-bold text-center text-xs tracking-wider transition-all"
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
