'use client';
  
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Script from 'next/script';
  
interface InteractiveArticleBodyProps {
  htmlContent: string;
}
  
export default function InteractiveArticleBody({ htmlContent }: InteractiveArticleBodyProps) {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
 
  // Safe client-side parsing using DOMParser
  const parsedHtml = useMemo(() => {
    if (!isMounted || typeof window === 'undefined') return null;
 
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      // 0. Replace non-breaking spaces with regular spaces for mobile wrapping
      const bodyEl = doc.body;
      bodyEl.innerHTML = bodyEl.innerHTML.replace(/\u00a0/g, ' ').replace(/&#xa0;/g, ' ').replace(/&nbsp;/g, ' ');

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
 
      // 4. Round Robin: buat CTA & legalitas images jadi clickable → thankyou/google
      const THANKYOU_URL = '/thankyou/google/';

      // 4a. Ganti href <a> yang mengandung img → thankyou/google
      const oldAnchors = doc.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href*="dreamlab.id"], a[href*="thankyoupage-google"], a[href*="thankyou-page"]');
      oldAnchors.forEach(a => {
        if (!a.querySelector('img')) return;
        a.setAttribute('href', THANKYOU_URL);
      });

      // 4b. Wrap img legalitas/CTA/artikel yang belum punya <a>
      const unwrappedImgs = doc.querySelectorAll('img[src*="legalitas"], img[src*="artikel-mid"], img[src*="cta-wa"], img[src*="artikel-cta"]');
      unwrappedImgs.forEach(img => {
        if (img.closest('a')) return;
        const wrapper = doc.createElement('a');
        wrapper.setAttribute('href', THANKYOU_URL);
        wrapper.setAttribute('style', 'display:block;cursor:pointer;text-decoration:none;');
        img.parentNode?.insertBefore(wrapper, img);
        wrapper.appendChild(img);
      });

      // 4c. Redirect semua link thankyoupage-google yang rusak
      const brokenLinks = doc.querySelectorAll('a[href*="thankyoupage-google"], a[href*="thankyou-page"]');
      brokenLinks.forEach(a => {
        if (a.querySelector('img')) return; // sudah ditangani di 4a
        a.setAttribute('href', THANKYOU_URL);
      });

      // 4d. Hapus figcaption yang mengandung URL rusak
      const brokenCaptions = doc.querySelectorAll('figcaption');
      brokenCaptions.forEach(fc => {
        if (fc.textContent?.includes('thankyoupage-google') || fc.textContent?.includes('thankyou-page')) {
          fc.remove();
        }
      });

      // 5. Style FAQ details as accordion cards via CSS class
      const detailsEls = doc.querySelectorAll('details');
      detailsEls.forEach(d => {
        d.classList.add('article-faq');
        d.removeAttribute('style');
        const summary = d.querySelector('summary');
        if (summary) {
          summary.removeAttribute('style');
          // Remove inline marker span (CSS ::after handles it)
          const marker = summary.querySelector('span');
          if (marker && marker.textContent?.trim() === '+') {
            marker.remove();
          }
        }
      });

      // 6. Strip span.ez-toc-section and other WP artifacts
      
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

  useEffect(() => {
    if (!isMounted) return;

    const timer = setTimeout(() => {
      const el = containerRef.current;
      if (!el) return;
      const igBlocks = el.querySelectorAll('.instagram-media');
      if (!igBlocks.length) return;

      const processEmbeds = () => {
        if ((window as any).instgrm?.Embeds) {
          igBlocks.forEach(() => {
            try { (window as any).instgrm.Embeds.process(); } catch {}
          });
          // Hide skeleton placeholders
          el.querySelectorAll('.ig-skeleton').forEach(s => s.remove());
        }
      };

      // Show skeleton placeholders while loading
      igBlocks.forEach(block => {
        if (!block.parentElement?.querySelector('.ig-skeleton')) {
          const skeleton = document.createElement('div');
          skeleton.className = 'ig-skeleton';
          skeleton.innerHTML = '<div class="ig-skeleton-inner"></div>';
          skeleton.style.cssText = 'position:absolute;inset:0;background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:ig-skeleton-shimmer 1.5s infinite;border-radius:3px;z-index:1';
          if (block.parentElement) {
            const parent = block.parentElement;
            if (getComputedStyle(parent).position === 'static') {
              parent.style.position = 'relative';
            }
            parent.appendChild(skeleton);
          }
        }
      });

      if ((window as any).instgrm?.Embeds) {
        processEmbeds();
      } else {
        const script = document.createElement('script');
        script.src = '//www.instagram.com/embed.js';
        script.async = true;
        script.onload = processEmbeds;
        document.body.appendChild(script);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isMounted, htmlContent]);
  
  // Default fallback (renders standard elementor HTML)
  if (!isMounted || !parsedHtml) {
    return (
      <>
        <div 
          className="article-content legacy-content-wrapper entry-content"
          ref={containerRef}
          dangerouslySetInnerHTML={{ __html: htmlContent.replace(/\u00a0/g, ' ').replace(/&#xa0;/g, ' ').replace(/&nbsp;/g, ' ') }} 
        />
        <Script
          src="//www.instagram.com/embed.js"
          strategy="afterInteractive"
          onLoad={() => {
            try { (window as any).instgrm?.Embeds?.process(); } catch {}
          }}
        />
      </>
    );
  }
  
  return (
    <>
      <div 
        className="article-content legacy-content-wrapper entry-content article-content-interactive"
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: parsedHtml }} 
      />
      <Script
        src="//www.instagram.com/embed.js"
        strategy="afterInteractive"
        onLoad={() => {
          try { (window as any).instgrm?.Embeds?.process(); } catch {}
        }}
      />
    </>
  );
}
