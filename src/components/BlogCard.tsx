import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getImageAlt, getImageTitle } from "@/lib/image-utils";

export interface BlogCardProps {
  title: string;
  date: string;
  category: string;
  image: string | null;
  excerpt: string;
  link: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ title, date, category, image, excerpt, link }) => {
  return (
    <article className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full border border-gray-100">
      <div className="relative h-64 overflow-hidden">
        <Image 
          src={image || "/assets/images/placeholder-blog.webp"}
          alt={getImageAlt(image || "/assets/images/placeholder-blog.webp", title)}
          title={getImageTitle(image || "/assets/images/placeholder-blog.webp")}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-6 left-6 bg-brand-orange text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg">
          {category}
        </div>
      </div>
      
      <div className="p-8 flex-grow flex flex-col">
        <time className="text-brand-black/40 text-xs font-bold uppercase tracking-widest mb-4 block">
          {date}
        </time>
        <h3 className="text-xl font-bold text-brand-black mb-5 group-hover:text-brand-orange transition-colors leading-tight line-clamp-2">
          <Link href={link}>{title}</Link>
        </h3>
        <p className="text-brand-black/60 text-sm leading-relaxed mb-8 line-clamp-3">
          {excerpt}
        </p>
        <div className="mt-auto pt-6 border-t border-brand-black/5">
          <Link 
            href={link}
            className="inline-flex items-center gap-3 text-brand-orange font-black uppercase tracking-widest text-[10px] group/link"
          >
            BACA SELENGKAPNYA
            <span className="group-hover/link:translate-x-2 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
