import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import seoMappingData from '@/data/seo-mapping.json';
import { SeoMappingItem } from '@/types';

const seoMapping = seoMappingData as SeoMappingItem[];

let articlesCache: any[] | null = null;

async function getArticles() {
  if (articlesCache) return articlesCache;
  const { articles } = await import('@/data/articles');
  articlesCache = articles;
  return articles;
}

interface AuthorPageProps {
  params: Promise<{
    author: string;
  }>;
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { author: slug } = await params;
  const pathStr = `/author/${slug}`;
  const mapping = seoMapping.find(m => m.source === pathStr || m.source === `${pathStr}/`);

  return {
    title: mapping?._metadata.original_title || `Posts by ${slug} | Dreamlab Indonesia`,
    description: mapping?._metadata.original_description || `Kumpulan artikel yang ditulis oleh ${slug} di Dreamlab Indonesia.`,
    robots: 'noindex, follow',
    alternates: {
        canonical: `https://dreamlab.id${pathStr}/`,
    }
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { author: slug } = await params;
  
  const articlesList = await getArticles();
  const authorName = slug === 'admin' ? 'Dreamlab Admin' : slug;
  const filteredArticles = articlesList.filter(a => a.author === authorName || a.author.toLowerCase() === slug);

  if (filteredArticles.length === 0 && slug !== 'admin') {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FFFFFB]">
      <section className="pt-48 pb-24 bg-brand-black relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white">Author Archives</span>
            </nav>
            <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-8">
              Posts by <br />
              <span className="text-brand-orange">{authorName}</span>
            </h1>
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
                <Link href={`/${article.slug}/`} className="block relative aspect-video overflow-hidden">
                  <Image 
                    src={article.featuredImage || '/assets/images/placeholder.jpg'} 
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
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
        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  return [{ author: 'admin' }];
}
