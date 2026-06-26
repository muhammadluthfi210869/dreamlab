import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { getSEOData, getAllSlugs } from '@/lib/seo-service';
import { cleanWordPressHtml } from '@/lib/clean-html';
import { generatePageSchema } from '@/lib/schema-generator';
import { getMaklonPage } from '@/data/maklon-pages';
import { getMaklonFAQ } from '@/data/maklon-faq';
import { getMetaKeywords } from '@/data/keywords';
import path from 'path';
import Link from 'next/link';
import seoMappingData from '@/data/seo-mapping.json';
import WaRoundRobinButton from "@/components/WaRoundRobinButton";

interface SeoMappingEntry {
  source: string;
  destination: string;
  _metadata: {
    original_title: string;
    original_h1?: string;
  };
}

const seoMapping = seoMappingData as SeoMappingEntry[];

function normalizeSlug(slug: string): string {
  return '/' + slug.replace(/^\/+/, '').replace(/\/+$/, '');
}

function isSlugValidInSeoMapping(normalizedSlug: string): boolean {
  return seoMapping.some(
    m => normalizeSlug(m.source) === normalizedSlug || normalizeSlug(m.destination) === normalizedSlug
  );
}

async function validateSlugOrReject(pathStr: string): Promise<void> {
  const normalized = normalizeSlug(pathStr);
  const articlesList = await getArticles();
  const maklonPage = getMaklonPage(pathStr);
  const seoData = await getSEOData(pathStr);

  const matchedArticle = articlesList.some(a => normalizeSlug(a.slug) === normalized);
  if (matchedArticle) return;
  if (maklonPage) return;
  if (seoData) return;
  if (isSlugValidInSeoMapping(normalized)) return;

  notFound();
}

const ArticleTemplate = dynamic(() => import('@/components/ArticleTemplate'), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div></div>
});
const JsonLd = dynamic(() => import('@/components/JsonLd'));
const RelatedLinks = dynamic(() => import('@/components/RelatedLinks'));

let articlesCache: Article[] | null = null;

async function getArticles(): Promise<Article[]> {
  if (articlesCache) return articlesCache;
  const { articles } = await import('@/data/articles');
  articlesCache = articles;
  return articles;
}

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  publishDate: string;
  author: string;
  categories: string[];
}

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  if (!resolvedParams?.slug) notFound();

  const pathStr = `/${resolvedParams.slug.join('/')}`;
  const seoData = await getSEOData(pathStr);
  const articlesList = await getArticles();
  const article = articlesList.find(a => a.slug === resolvedParams.slug.join('/') || a.slug === pathStr);
  const maklonPage = getMaklonPage(pathStr);

  if (!article && !maklonPage && !seoData) {
    const normalized = '/' + pathStr.replace(/^\/+/, '').replace(/\/+$/, '');
    const isValid = seoMapping.some(
      m => normalizeSlug(m.source) === normalized || normalizeSlug(m.destination) === normalized
    );
    if (!isValid) notFound();
  }

  const categorySlug = resolvedParams.slug[0]?.replace(/^maklon-/, '').replace(/-care$/, 'care') || '';
  const title = seoData?.meta_title || (article ? article.title : 'Dreamlab');
  const description = seoData?.meta_description || (article ? article.excerpt : 'Dreamlab - Maklon Kosmetik & Skincare Terbaik BPOM Indonesia');
  const canonical = (seoData?.canonical || `https://dreamlab.id${pathStr}`).replace(/\/?$/, '/');

  return {
    title,
    description,
    keywords: getMetaKeywords(categorySlug, resolvedParams.slug?.[1] || ''),
    alternates: { canonical },
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Dreamlab',
      locale: 'id_ID',
      type: article ? 'article' : 'website',
      ...(article?.featuredImage && { images: [{ url: article.featuredImage, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(article?.featuredImage && { images: [article.featuredImage] }),
    },
    other: {
      'article:published_time': article?.publishDate || '',
      'article:author': article?.author || 'Dreamlab Maklon Kosmetik',
    },
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const resolvedParams = await params;
  if (!resolvedParams?.slug) notFound();

  const pathStr = `/${resolvedParams.slug.join('/')}`;
  await validateSlugOrReject(pathStr);
  const seoData = await getSEOData(pathStr);
  const articlesList = await getArticles();
  const article = articlesList.find(a => 
    a.slug === resolvedParams.slug.join('/') || 
    a.slug === pathStr || 
    a.slug === pathStr.replace(/^\//, '')
  );

  // Only render as Article if there is actual content, otherwise treat as Programmatic Service Page
  if (article && article.content && article.content.trim() !== '') {
    const cleanedArticle = {
      ...article,
      content: cleanWordPressHtml(article.content),
    };
    const recentPosts = [...articlesList]
      .filter(a => a.slug !== article.slug && a.title)
      .sort((a, b) => {
        const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
        const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);
    const allArticlesLight = articlesList.map(({ slug, title, categories }) => ({ slug, title, categories }));
    return (
      <main className="min-h-screen">
        <ArticleTemplate article={cleanedArticle} recentPosts={recentPosts} allArticles={allArticlesLight} />
      </main>
    );
  }

  if (!seoData) notFound();

  const maklonPage = getMaklonPage(pathStr);
  const maklonFaqs = getMaklonFAQ(pathStr);

  const heroFilename = seoData.hero_image_url && !seoData.hero_image_url.startsWith('data:') 
    ? path.basename(new URL(seoData.hero_image_url).pathname) 
    : null;

  const pageSchema = generatePageSchema({
    url: pathStr,
    title: seoData.meta_title || '',
    description: seoData.meta_description || '',
    h1: seoData.h1 || '',
    type: 'service',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: seoData.h1 || resolvedParams.slug[resolvedParams.slug.length - 1].replace(/-/g, ' ') },
    ],
    image: seoData.hero_image_url || undefined,
    faqs: (maklonFaqs.length > 0 ? maklonFaqs : (seoData.faq_json || [])).map((f: { question: string; answer: string }) => ({
      question: f.question,
      answer: f.answer,
    })),
  });

  return (
    <main className="min-h-screen">
      {/* Dynamic Schema Markup (Programmatic SEO) */}
      <JsonLd data={pageSchema} />

      {/* Hero Banner with Fetch Priority */}
      <section className="relative w-full h-[300px] md:h-[450px] overflow-hidden bg-gray-900">
        {heroFilename ? (
          <Image 
            src={`/assets/images/${heroFilename}`}
            alt={seoData.h1 || 'Hero Image'}
            fill
            className="object-cover opacity-60"
            priority
            fetchPriority="high"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand-dark opacity-80" />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-3xl md:text-5xl font-bold max-w-4xl drop-shadow-xl mb-4">
            {seoData.h1}
          </h1>
          <nav className="flex text-white/80 text-sm space-x-2">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white font-semibold">{resolvedParams.slug[resolvedParams.slug.length - 1].replace(/-/g, ' ')}</span>
          </nav>
        </div>
      </section>

      {/* Programmatic Content Body */}
      <section className="py-20 container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            {/* Information Gain Section: Quantitative Data Table */}
            {seoData.data_table_json && seoData.data_table_json.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-brand-black p-6">
                        <h2 className="text-white text-xl font-bold">Spesifikasi Teknis & Kapasitas Produksi</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 font-bold text-gray-700">Fitur / Layanan</th>
                                    <th className="p-4 font-bold text-gray-700">Detail Spesifikasi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {seoData.data_table_json.map((row: { label: string; value: string }, idx: number) => (
                                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 font-medium text-gray-800">{row.label}</td>
                                        <td className="p-4 text-gray-600">{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Maklon Product Rich Content */}
            {maklonPage ? (
              <div className="space-y-12">
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {maklonPage.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                      <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Product Sections */}
                {maklonPage.sections.map((section, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                    {section.type === 'header' && (
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.content}</h2>
                    )}
                    {section.type === 'product' && (
                      <div className="prose prose-lg max-w-none text-gray-600">
                        <p>{section.content}</p>
                      </div>
                    )}
                    {section.type === 'kemasan' && (
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="font-bold text-gray-800 mb-2">Kemasan</h3>
                        <p className="text-gray-600">{section.content}</p>
                      </div>
                    )}
                  </div>
                ))}

                {/* Product Types */}
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Varian Produk {maklonPage.category}</h2>
                  <div className="flex flex-wrap gap-3">
                    {maklonPage.productTypes.map((pt, idx) => (
                      <span key={idx} className="px-4 py-2 bg-brand/5 text-brand-dark border border-brand/20 rounded-full text-sm font-medium">
                        {pt}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="bg-gradient-to-r from-brand/5 to-brand/10 rounded-2xl p-8 border border-brand/20">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Sertifikasi & Legalitas</h2>
                  <div className="flex flex-wrap gap-3">
                    {maklonPage.certifications.map((cert, idx) => (
                      <span key={idx} className="px-4 py-2 bg-white text-gray-800 border border-gray-200 rounded-full text-sm font-medium shadow-sm">
                        {cert}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-gray-600 text-sm">Semua produk maklon Dreamlab telah bersertifikasi resmi dan terdaftar di BPOM serta Halal.</p>
                </div>
              </div>
            ) : (
              <div className="prose prose-lg max-w-none text-gray-600">
                <div className="bg-orange-50 border-l-8 border-brand p-8 rounded-r-xl shadow-sm mb-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Modernisasi Layanan Dreamlab</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Kami sedang memutakhirkan infrastruktur digital kami untuk mendukung skalabilitas brand Anda. 
                    Halaman ini sedang dalam proses optimasi visual premium untuk memastikan performa SEO terbaik dan pengalaman pengguna yang klinis.
                  </p>
                </div>
                <div className="space-y-6">
                  <p className="font-medium text-gray-800">
                    Dreamlab Indonesia (PT Karya Impian Laboratoris) adalah mitra strategis di balik brand-brand kosmetik sukses di Indonesia. 
                    Dengan sertifikasi CPKB Grade A dan Halal, kami menjamin kualitas produk yang absolut.
                  </p>
                </div>
              </div>
            )}

            {/* FAQ Section (Programmatic) */}
            {(() => {
              const activeFaqs = maklonFaqs.length > 0 ? maklonFaqs : (seoData.faq_json || []);
              if (activeFaqs.length === 0) return null;
              return (
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-brand pl-4">Pertanyaan Seputar {seoData.h1}</h2>
                    <div className="grid gap-4">
                        {activeFaqs.map((faq: { question: string; answer: string }, idx: number) => (
                            <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-lg text-gray-800 mb-2">{faq.question}</h3>
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
              );
            })()}

            {/* Semantic Internal Linking */}
            <RelatedLinks 
                currentSlug={pathStr} 
                categories={seoData.supporting_entities || []} 
                allArticles={articlesList}
            />
          </div>

          {/* Sidebar Sidebar remains premium */}
          <aside className="space-y-8">
            <div className="bg-brand-black p-8 rounded-2xl text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-brand/30 transition-all" />
              <h3 className="text-2xl font-bold mb-4 relative z-10">Konsultasi Gratis</h3>
              <p className="text-white/70 mb-8 relative z-10">Dapatkan formulasi eksklusif dan pendampingan BPOM gratis untuk brand Anda.</p>
              <WaRoundRobinButton message="Halo Dreamlab, saya ingin konsultasi maklon" className="block w-full bg-brand hover:bg-brand-light text-white text-center py-4 rounded-xl font-bold transition-all shadow-lg">
                Chat Ahli Maklon
              </WaRoundRobinButton>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-lg font-bold mb-4 text-gray-800">{maklonPage ? `Produk ${maklonPage.category}` : 'Layanan Unggulan'}</h3>
              <div className="flex flex-wrap gap-2">
                {(maklonPage ? maklonPage.productTypes.slice(0, 6) : ['Maklon Skincare', 'Maklon Parfum', 'Maklon Body Care', 'Maklon Baby Care', 'BPOM & Halal']).map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600">
                        {tag}
                    </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  
  const isValidSlug = (s: string) => {
    if (!s || s === '/' || s.startsWith('http')) return false;
    if (s.length > 200) return false;
    if (s.includes('%20') || s.includes(' ') || s.includes(':')) return false;
    return true;
  };

  const params = slugs.filter(isValidSlug).map(s => ({
    slug: s.replace(/^\//, '').replace(/\/$/, '').split('/').filter(Boolean)
  }));

  // Add article slugs - lazy load
  const articlesList = await getArticles();
  const articleParams = articlesList.map(a => ({
    slug: a.slug.replace(/^\//, '').replace(/\/$/, '').split('/').filter(Boolean)
  }));

  const allParams = [...params, ...articleParams];
  // Deduplicate
  const uniqueParams = Array.from(new Map(allParams.map(p => [p.slug.join('/'), p])).values());

  return uniqueParams;
}

// ISR: Regenerate halaman setiap 1 jam untuk konten fresh tanpa full rebuild
export const revalidate = 3600;

