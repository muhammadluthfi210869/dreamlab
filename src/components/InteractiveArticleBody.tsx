'use client';
 
import React, { useState, useEffect, useMemo } from 'react';
 
interface InteractiveArticleBodyProps {
  htmlContent: string;
}
 
export default function InteractiveArticleBody({ htmlContent }: InteractiveArticleBodyProps) {
  const [isMounted, setIsMounted] = useState(false);
 
  useEffect(() => {
    setIsMounted(true);
  }, []);
 
  // Safe client-side parsing using DOMParser
  const parsedHtml = useMemo(() => {
    if (!isMounted || typeof window === 'undefined') return null;
 
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      // 1. Remove legacy TOC containers directly from the DOM tree
      const legacyTocs = doc.querySelectorAll('[class*="ez-toc"], [id*="ez-toc"], [class*="toc"], [id*="toc"]');
      legacyTocs.forEach(el => el.remove());
 
      // 2. Inject slugified ID attributes to H2 and H3 elements
      const slugify = (str: string) => {
        return str
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
      };
 
      const headings = doc.querySelectorAll('h2, h3');
      headings.forEach(h => {
        const text = h.textContent || '';
        const headingId = slugify(text);
        if (headingId) {
          h.setAttribute('id', headingId);
          h.setAttribute('class', h.tagName.toLowerCase() === 'h2' ? 'article-h2' : 'article-h3');
        }
      });
 
      // 3. Clean up empty & nbsp-only paragraphs
      const allParas = doc.querySelectorAll('p');
      allParas.forEach(p => {
        const html = p.innerHTML.trim();
        if (!html || html === '\u00a0' || html === '&nbsp;') {
          p.remove();
        }
      });
 
      // 4. Strip span.ez-toc-section and other WP artifacts
      const tocSections = doc.querySelectorAll('span.ez-toc-section, span.ez-toc-section-end');
      tocSections.forEach(el => el.remove());
      
      const brTags = doc.querySelectorAll('br');
      brTags.forEach((br, idx) => {
        if (br.nextSibling?.nodeType === 1 && (br.nextSibling as Element).tagName === 'BR') {
          br.remove();
        }
      });
 
      return doc.body.innerHTML;
    } catch (e) {
      console.error('HTML parsing error, falling back to standard rendering: ', e);
      return null;
    }
  }, [htmlContent, isMounted]);
 
  // Default fallback (renders standard elementor HTML)
  if (!isMounted || !parsedHtml) {
    return (
      <div 
        className="article-content legacy-content-wrapper entry-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
      />
    );
  }
 
  return (
    <div 
      className="article-content legacy-content-wrapper entry-content article-content-interactive"
      dangerouslySetInnerHTML={{ __html: parsedHtml }} 
    />
  );
}
