import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getSEOData } from '@/lib/seo-service';

let articlesCache: any[] | null = null;
const THIN_CATEGORY_MAX_ARTICLES = 2;

async function getArticles() {
  if (articlesCache) return articlesCache;
  const { articles } = await import('@/data/articles');
  articlesCache = articles;
  return articles;
}

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

// Helper to match slug to category name
async function getCategoryName(slug: string): Promise<string | null> {
  const articlesList = await getArticles();
  const categoryNames = Array.from(new Set(articlesList.flatMap((a: any) => a.categories).filter(Boolean)));
  return categoryNames.find((name: string) => 
    name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === slug
  ) || null;
}

async function getCategoryArticleCount(slug: string): Promise<number> {
  const categoryName = await getCategoryName(slug);
  if (!categoryName) return 0;

  const articlesList = await getArticles();
  return articlesList.filter((a: any) => 
    a.categories.includes(categoryName) || (a.tags || []).includes(categoryName)
  ).length;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const categoryName = await getCategoryName(slug);
  const pathStr = `/category/${slug}`;
  const articleCount = await getCategoryArticleCount(slug);
  const seoData = await getSEOData(pathStr);

  if (!categoryName && !seoData) return { title: 'Category Not Found' };

  const canonical = (seoData?.canonical || `https://dreamlab.id${pathStr}/`).replace(/\/?$/, '/');
  const isThinCategory = articleCount > 0 && articleCount <= THIN_CATEGORY_MAX_ARTICLES;

  return {
    title: seoData?.meta_title || `${categoryName} Archives | Dreamlab Indonesia`,
    description: seoData?.meta_description || `Kumpulan artikel dan berita seputar ${categoryName} dari Dreamlab Indonesia.`,
    alternates: { canonical },
    robots: isThinCategory
      ? 'noindex, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    openGraph: {
      title: seoData?.meta_title || `${categoryName} Archives | Dreamlab Indonesia`,
      description: seoData?.meta_description || `Kumpulan artikel dan berita seputar ${categoryName} dari Dreamlab Indonesia.`,
      url: canonical,
      siteName: 'Dreamlab',
      locale: 'id_ID',
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const categoryName = await getCategoryName(slug);
  
  if (!categoryName) {
    notFound();
  }

  const articlesList = await getArticles();
  const filteredArticles = articlesList
    .filter((a: any) => a.categories.includes(categoryName))
    .sort((a: any, b: any) => {
      const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
      const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
      return dateB - dateA;
    });
  const seoData = await getSEOData(`/category/${slug}`);

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
              <span className="text-white">{categoryName}</span>
            </nav>
            <h1 className="text-[38px] md:text-[52px] lg:text-[80px] font-display font-normal text-white uppercase tracking-tight leading-[1.05] mb-8">
              {seoData?.h1 || categoryName}
            </h1>
            <p className="text-white/60 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
              {seoData?.meta_description || `Arsip artikel dan wawasan premium seputar ${categoryName.toLowerCase()}.`}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredArticles.map((article, index) => (
              <article 
                key={index}
                className="group bg-white rounded-[40px] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-700"
              >
                <Link href={`/${article.slug}/`} className="block relative aspect-video overflow-hidden bg-[#FAF9F6] p-2">
                  <Image 
                    src={article.featuredImage ? `/assets/images/blog/${article.featuredImage}` : '/assets/images/placeholder.jpg'} 
                    alt={article.title}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-1000"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Link>
                <div className="p-10">
                   <h3 className="text-xl font-black text-brand-black leading-tight mb-4 group-hover:text-brand-orange transition-colors uppercase">
                    <Link href={`/${article.slug}/`}>{article.title}</Link>
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6">
                    {article.excerpt}
                  </p>
                  <Link 
                    href={`/${article.slug}/`}
                    className="text-[10px] font-black uppercase tracking-widest text-brand-orange flex items-center gap-2"
                  >
                    Read More <span className="w-4 h-[1px] bg-brand-orange"></span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
          
          {filteredArticles.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400">Belum ada artikel dalam kategori ini.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  const PILLARS = ['maklon-kosmetik', 'panduan-bisnis-kosmetik', 'dreampreneur-beauty-academy', 'event'];
  return PILLARS.map(category => ({ category }));
}

export const revalidate = 3600;
