'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Check, ChevronRight, HelpCircle, ExternalLink } from 'lucide-react';

interface InteractiveArticleBodyProps {
  htmlContent: string;
}

export default function InteractiveArticleBody({ htmlContent }: InteractiveArticleBodyProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Safe client-side parsing using DOMParser
  const parsedContent = useMemo(() => {
    if (!isMounted || typeof window === 'undefined') return null;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const body = doc.body;

      let headingCounter = 0;

      return Array.from(body.childNodes).map((node, index) => {
        const nodeName = node.nodeName;

        // 1. Process Headings (H2 / H3)
        if (nodeName === 'H2' || nodeName === 'H3') {
          headingCounter++;
          const text = node.textContent || '';
          const isH2 = nodeName === 'H2';
          
          return (
            <div key={index} className={`relative group ${isH2 ? 'mt-16 mb-8' : 'mt-10 mb-6'}`}>
              {isH2 ? (
                <>
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-brand-orange rounded-full scale-y-75 group-hover:scale-y-100 transition-transform duration-300 hidden md:block" />
                  <h2 className="text-2xl md:text-3.5xl font-display text-brand-black tracking-tight pl-0 md:pl-2 flex items-center gap-3 uppercase">
                    <span className="text-xs font-black text-brand-orange bg-brand-orange/10 w-7 h-7 rounded-lg flex items-center justify-center font-sans">
                      {headingCounter.toString().padStart(2, '0')}
                    </span>
                    {text}
                  </h2>
                </>
              ) : (
                <h3 className="text-xl md:text-2xl font-display text-brand-black tracking-tight flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                  {text}
                </h3>
              )}
            </div>
          );
        }

        // 2. Process Paragraphs (P)
        if (nodeName === 'P') {
          const textContent = node.textContent || '';
          
          // Check if paragraph is an empty spacer
          if (textContent.trim() === '' && !(node as HTMLElement).querySelector('img')) {
            return null;
          }

          // Check if it's a "Baca Juga" or internal link callout
          const anchor = (node as HTMLElement).querySelector('a');
          if (anchor && (textContent.startsWith('Baca Juga') || textContent.startsWith('Baca juga'))) {
            const href = anchor.getAttribute('href') || '#';
            const linkText = anchor.textContent || '';
            return (
              <Link 
                key={index}
                href={href}
                className="block my-8 p-6 bg-gradient-to-r from-brand-orange/5 to-transparent border-l-4 border-brand-orange rounded-r-3xl hover:from-brand-orange/10 transition-all group"
              >
                <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest block mb-1">Rekomendasi Artikel</span>
                <span className="text-sm font-bold text-brand-black group-hover:text-brand-orange transition-colors flex items-center gap-1">
                  {linkText}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            );
          }

          // Check if paragraph is just a call to action
          if (anchor && (textContent.includes('Hubungi') || textContent.includes('WhatsApp') || textContent.includes('Klik Di Sini'))) {
            const href = anchor.getAttribute('href') || '#';
            return (
              <div key={index} className="my-8">
                <a 
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-100 hover:border-emerald-500 px-6 py-3 rounded-2xl text-xs font-black tracking-wider transition-all shadow-md shadow-emerald-500/5 group"
                >
                  {anchor.textContent}
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            );
          }

          // Render normal paragraph
          return (
            <p key={index} className="text-base md:text-lg text-brand-black/75 leading-relaxed mb-6 font-sans">
              {textContent}
            </p>
          );
        }

        // 3. Process Unordered Lists (UL)
        if (nodeName === 'UL') {
          const listItems = Array.from((node as HTMLElement).querySelectorAll('li'));
          
          // Make list look like a gorgeous grid of cards
          return (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
              {listItems.map((li, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-5 rounded-2xl border border-gray-100/80 shadow-sm flex items-start gap-3.5 hover:border-brand-orange/20 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-6 h-6 bg-brand-orange/10 group-hover:bg-brand-orange/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-brand-orange transition-colors">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-medium text-brand-black/80">{li.textContent}</span>
                </div>
              ))}
            </div>
          );
        }

        // 4. Process Blockquotes
        if (nodeName === 'BLOCKQUOTE') {
          const text = node.textContent || '';
          return (
            <div key={index} className="my-12 p-8 md:p-10 bg-gray-50 border-l-8 border-brand-orange rounded-r-[32px] relative overflow-hidden shadow-inner">
              <span className="absolute -top-10 -right-6 text-[150px] text-brand-orange/5 font-serif select-none pointer-events-none font-black leading-none">“</span>
              <div className="relative z-10 text-lg md:text-xl font-medium text-brand-black/75 italic leading-relaxed font-sans">
                {text}
              </div>
            </div>
          );
        }

        // 5. Process Tables
        if (nodeName === 'TABLE') {
          const rows = Array.from((node as HTMLElement).querySelectorAll('tr'));
          const headers = Array.from(rows[0]?.querySelectorAll('th, td') || []);
          const bodyRows = rows.slice(1);
          
          return (
            <div key={index} className="my-10 border border-gray-100 rounded-3xl overflow-hidden shadow-lg bg-white">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-brand-black text-white border-b border-gray-800">
                      {headers.map((h, i) => (
                        <th key={i} className="p-5 font-black uppercase tracking-wider text-[10px] text-white/90">
                          {h.textContent}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bodyRows.map((row, rIdx) => {
                      const cells = Array.from(row.querySelectorAll('td'));
                      return (
                        <tr key={rIdx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          {cells.map((c, cIdx) => (
                            <td key={cIdx} className="p-5 font-medium text-brand-black/75">
                              {c.textContent}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

        // 6. Process Figures / Images
        if (nodeName === 'FIGURE' || nodeName === 'IMG') {
          const imgEl = nodeName === 'IMG' ? (node as HTMLImageElement) : (node as HTMLElement).querySelector('img');
          const figcaption = (node as HTMLElement).querySelector('figcaption');
          if (!imgEl) return null;
          
          const src = imgEl.getAttribute('src') || '';
          const alt = imgEl.getAttribute('alt') || '';
          
          return (
            <div key={index} className="my-12 text-center">
              <div className="inline-block relative overflow-hidden rounded-[32px] shadow-xl border-8 border-white max-w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt} className="max-h-[520px] object-cover hover:scale-[1.02] transition-transform duration-500" />
              </div>
              {figcaption && (
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-4">
                  {figcaption.textContent}
                </p>
              )}
            </div>
          );
        }

        // Fallback for raw elements (so no custom styles are lost, like layout gaps or generic elements)
        const outerHtml = (node as HTMLElement).outerHTML || '';
        return (
          <div 
            key={index} 
            className="article-raw-fallback"
            dangerouslySetInnerHTML={{ __html: outerHtml }} 
          />
        );
      });

    } catch (e) {
      console.error('HTML parsing error, falling back to standard rendering: ', e);
      return null;
    }
  }, [htmlContent, isMounted]);

  // Default fallback (renders standard elementor HTML - critical for SEO pre-rendering)
  if (!isMounted || !parsedContent) {
    return (
      <div 
        className="article-content legacy-content-wrapper entry-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
      />
    );
  }

  return (
    <div className="article-content-interactive space-y-6">
      {parsedContent}
    </div>
  );
}
