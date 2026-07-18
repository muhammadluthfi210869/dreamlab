import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { articles, Article } from '@/data/articles';
import seoMappingData from '@/data/seo-mapping.json';
import { SeoMappingItem } from '@/types';
import { resolveArticleImageSrc } from '@/lib/asset-paths';

const seoMapping = seoMappingData as SeoMappingItem[];
const POSTS_PER_PAGE = 6;

interface BlogPaginationProps {
  params: Promise<{
    num: string;
  }>;
}

export async function generateMetadata({ params }: BlogPaginationProps): Promise<Metadata> {
  const { num } = await params;
  const pathStr = `/news-blog/page/${num}`;
  const mapping = seoMapping.find(m => m.source === pathStr || m.source === `${pathStr}/`);

  const canonical = `https://dreamlab.id${pathStr}/`.replace(/\/?$/, '/');
  const blogArticles = articles.filter(a => (a.categories || []).length > 0);
  const totalPages = Math.ceil(blogArticles.length / 6);

  return {
    title: mapping?._metadata.original_title || `Blog Maklon Kosmetik & Skincare — Halaman ${num} | Dreamlab`,
    description: mapping?._metadata.original_description || `Wawasan untuk beautypreneur Indonesia, temukan tren dan cara menjadi beautypreneur. Dreamlab maklon kosmetik yang tepat untuk bisnis anda.`,
    alternates: { canonical },
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    other: {
      ...(parseInt(num) > 1 ? { 'prev': `https://dreamlab.id/news-blog/page/${parseInt(num) - 1}/` } : {}),
      ...(parseInt(num) < totalPages ? { 'next': `https://dreamlab.id/news-blog/page/${parseInt(num) + 1}/` } : {}),
    },
    openGraph: {
      title: mapping?._metadata.original_title || `Blog Bisnis Kosmetik & Skincare — Halaman ${num} | Dreamlab`,
      description: mapping?._metadata.original_description || `Wawasan untuk beautypreneur Indonesia, temukan tren dan cara menjadi beautypreneur. Dreamlab maklon kosmetik yang tepat untuk bisnis anda.`,
      url: canonical,
      siteName: 'Dreamlab',
      locale: 'id_ID',
      type: 'website',
    },
  };
}

export default async function BlogPaginationPage({ params }: BlogPaginationProps) {
  const { num } = await params;
  const pageNum = parseInt(num);
  
  if (isNaN(pageNum) || pageNum < 1) {
    notFound();
  }

  const blogArticles = articles.filter(a => (a.categories || []).length > 0);
  const sortedArticles: Article[] = [...blogArticles].sort((a, b) => {
    const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
    const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
    return dateB - dateA;
  });
  const start = (pageNum - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  const paginatedArticles = sortedArticles.slice(start, end);
  const totalPages = Math.ceil(sortedArticles.length / POSTS_PER_PAGE);

  if (paginatedArticles.length === 0 && pageNum > 1) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FFFFFB]">
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
              <Link href="/news-blog" className="hover:text-brand-orange transition-colors">News & Blog</Link>
              <span>/</span>
              <span className="text-white">Page {num}</span>
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

      <section className="py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {paginatedArticles.map((article, index) => (
              <article 
                key={index}
                className="group bg-white rounded-[40px] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-700"
              >
                <Link href={`${article.slug}/`} className="block relative aspect-video overflow-hidden bg-[#FAF9F6] p-2">
                  <Image 
                    src={resolveArticleImageSrc(article.featuredImage)} 
                    alt={article.title}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-1000"
                    unoptimized
                  />
                </Link>
                <div className="p-10">
                   <h3 className="text-xl font-black text-brand-black leading-tight mb-4 group-hover:text-brand-orange transition-colors uppercase">
                    <Link href={`${article.slug}/`}>{article.title}</Link>
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6">
                    {article.excerpt}
                  </p>
                  <Link 
                    href={`${article.slug}/`}
                    className="text-[10px] font-black uppercase tracking-widest text-brand-orange flex items-center gap-2"
                  >
                    Read More <span className="w-4 h-[1px] bg-brand-orange"></span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="mt-20 flex justify-center items-center gap-4">
            {pageNum > 1 && (
              <Link 
                href={pageNum === 2 ? '/news-blog' : `/news-blog/page/${pageNum - 1}`}
                className="px-6 py-3 rounded-xl bg-gray-50 text-[10px] font-black uppercase tracking-widest hover:bg-brand-orange hover:text-white transition-all"
              >
                Previous
              </Link>
            )}
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Page {pageNum} of {totalPages}
            </span>
            {pageNum < totalPages && (
              <Link 
                href={`/news-blog/page/${pageNum + 1}`}
                className="px-6 py-3 rounded-xl bg-gray-50 text-[10px] font-black uppercase tracking-widest hover:bg-brand-orange hover:text-white transition-all"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  const blogArticles = articles.filter(a => (a.categories || []).length > 0);
  const totalPages = Math.ceil(blogArticles.length / POSTS_PER_PAGE);
  const params = [];
  for (let i = 2; i <= totalPages; i++) {
    params.push({ num: i.toString() });
  }
  return params;
}

export const revalidate = 3600;
