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

      // 3. Transform numbered lists (<ol>) into step cards
      const orderedLists = doc.querySelectorAll('ol.wp-block-list, ol[class*="block-list"]');
      orderedLists.forEach((ol) => {
        const items = ol.querySelectorAll('li');
        if (items.length < 2) return;

        const hasNumbers = ol.matches('[start], [class*="wp-block"]');
        const firstText = (items[0].textContent || '').toLowerCase();
        const hasStepKeywords = /^(pertama|kedua|ketiga|keempat|kelima|keenam|1\.|\d+\))/.test(firstText);
        
        if (!hasNumbers && !hasStepKeywords) {
          const hasAnyNumber = [...items].some(li => /^\d+[\.\)]/.test((li.textContent || '').trim()));
          if (!hasAnyNumber) return;
        }

        const wrapper = doc.createElement('div');
        wrapper.className = 'article-step-grid';

        items.forEach((li, index) => {
          const card = doc.createElement('div');
          card.className = 'article-step-card';

          const numberBadge = doc.createElement('div');
          numberBadge.className = 'article-step-number';
          numberBadge.textContent = String(index + 1).padStart(2, '0');
          card.appendChild(numberBadge);

          const strong = li.querySelector('strong');
          const boldEls = li.querySelectorAll('b');

          if (strong || boldEls.length > 0) {
            const headlineEl = strong || boldEls[0];
            const headline = doc.createElement('h4');
            headline.className = 'article-step-headline';
            headline.textContent = headlineEl.textContent?.replace(/[:\s]+$/, '') || '';
            card.appendChild(headline);

            const desc = doc.createElement('p');
            desc.className = 'article-step-desc';
            let remaining = li.innerHTML.replace(headlineEl.outerHTML, '').trim();
            remaining = remaining.replace(/^:\s*/, '');
            desc.innerHTML = remaining;
            card.appendChild(desc);
          } else {
            const text = li.textContent || '';
            const colonIdx = text.indexOf(':');
            if (colonIdx > 0 && colonIdx < 100) {
              const headline = doc.createElement('h4');
              headline.className = 'article-step-headline';
              headline.textContent = text.substring(0, colonIdx).trim();
              card.appendChild(headline);

              const desc = doc.createElement('p');
              desc.className = 'article-step-desc';
              desc.textContent = text.substring(colonIdx + 1).trim();
              card.appendChild(desc);
            } else {
              const desc = doc.createElement('p');
              desc.className = 'article-step-desc';
              desc.textContent = text;
              card.appendChild(desc);
            }
          }

          wrapper.appendChild(card);
        });

        if (ol.parentNode) {
          ol.parentNode.replaceChild(wrapper, ol);
        }
      });

      // 4. Inject callout classes for Chemist Lab and BPOM Alerts
      const paragraphs = doc.querySelectorAll('p:not(.article-step-desc)');
      paragraphs.forEach(p => {
        const text = p.textContent || '';
        const textLower = text.toLowerCase();
        
        const isFormula = textLower.includes('kombinasi') || 
                          textLower.includes('bahan aktif') || 
                          textLower.includes('formulasi') || 
                          textLower.includes('zat aktif');

        const isBpom = textLower.includes('bpom') || 
                       textLower.includes('regulasi') || 
                       textLower.includes('halal') || 
                       textLower.includes('cpkb') ||
                       textLower.includes('izin edar');

        if (isBpom && text.length > 45 && text.length < 250) {
          p.classList.add('article-bpom-callout');
        } else if (isFormula && text.length > 35) {
          p.classList.add('article-chemist-callout');
        }
      });

      // 5. Clean up empty & nbsp-only paragraphs
      const allParas = doc.querySelectorAll('p');
      allParas.forEach(p => {
        const html = p.innerHTML.trim();
        if (!html || html === '\u00a0' || html === '&nbsp;') {
          p.remove();
        }
      });

      // 6. Strip span.ez-toc-section and other WP artifacts
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

  // Default fallback (renders standard elementor HTML - critical for SEO pre-rendering)
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
