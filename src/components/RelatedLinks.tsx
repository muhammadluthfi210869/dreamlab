import React from 'react';
import Link from 'next/link';

interface RelatedLinksProps {
  currentSlug: string;
  categories: string[];
  allArticles: Array<{ slug: string; title: string; categories: string[] }>;
}

const RelatedLinks: React.FC<RelatedLinksProps> = ({ currentSlug, categories, allArticles }) => {
  const relatedArticles = allArticles
    .filter(a => 
      a.slug !== currentSlug && 
      a.categories.some(cat => categories.includes(cat))
    )
    .slice(0, 4);

  const displayArticles = relatedArticles.length > 0 
    ? relatedArticles 
    : allArticles.filter(a => a.slug !== currentSlug).slice(0, 4);

  if (displayArticles.length === 0) return null;

  return (
    <div className="mt-20 py-12 border-t border-gray-100">
      <h2 className="text-2xl font-display uppercase tracking-tighter text-brand-black mb-8">
        Layanan & Wawasan Terkait
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayArticles.map((article, idx) => (
          <Link 
            key={idx} 
            href={`${article.slug}/`}
            className="group bg-white p-6 rounded-3xl border border-gray-50 shadow-sm hover:shadow-xl hover:border-brand-orange/20 transition-all duration-500"
          >
            <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest mb-3 block">
              {article.categories[0]}
            </span>
            <h3 className="text-sm font-bold text-brand-black leading-tight group-hover:text-brand-orange transition-colors line-clamp-2">
              {article.title}
            </h3>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase text-gray-300 group-hover:text-brand-orange transition-colors">
              Lihat Detail <span className="w-4 h-[1px] bg-gray-200 group-hover:bg-brand-orange transition-colors"></span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedLinks;
