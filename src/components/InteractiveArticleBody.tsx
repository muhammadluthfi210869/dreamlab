'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Script from 'next/script';

interface InteractiveArticleBodyProps {
  htmlContent: string;
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

const THANKYOU_URL = '/thankyou/google/';

const CTA_TITLE = 'YUK KONSULTASI PRODUK ANDA';
const CTA_BODY = 'Diskusikan konsep produk, HPP produk, dan strategi brand-mu bersama tim Dreamlab.';
const CTA_BUTTON_TEXT = 'Konsultasi Gratis dengan Dreamlab';

export default function InteractiveArticleBody({ htmlContent }: InteractiveArticleBodyProps) {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setIsMounted(true); }, []);

  const parsedHtml = useMemo(() => {
    if (!isMounted || typeof window === 'undefined') return null;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      const bodyEl = doc.body;
      bodyEl.innerHTML = bodyEl.innerHTML.replace(/\u00a0/g, ' ').replace(/&#xa0;/g, ' ').replace(/&nbsp;/g, ' ');

      // 1. Remove legacy TOC containers
      const legacyTocs = doc.querySelectorAll('[class*="ez-toc"], [id*="ez-toc"], [class*="toc"], [id*="toc"]');
      legacyTocs.forEach(el => el.remove());

      // 1b. Strip manual ToCs (Daftar Isi / Ringkasan Isi) — avoid duplicates with auto ToC
      const manualTocs = doc.querySelectorAll('nav, .article-daftar-isi, .table-of-content, [class*="daftar-isi"]');
      manualTocs.forEach(el => {
        const text = el.textContent?.toLowerCase() || '';
        if (text.includes('daftar isi') || text.includes('ringkasan isi')) {
          el.remove();
        }
      });

      // 1c. Clean up empty wrapper divs left behind by ToC stripping
      doc.querySelectorAll('div').forEach(el => {
        if (!el.innerHTML.trim() && !el.getAttribute('style')) {
          el.remove();
        }
      });

      // 2. Inject slugified IDs to H2 and H3 elements
      const headings = doc.querySelectorAll('h2, h3');
      headings.forEach(h => {
        const text = h.textContent || '';
        const headingId = slugify(text);
        if (headingId) {
          h.setAttribute('id', headingId);
          h.setAttribute('class', h.tagName.toLowerCase() === 'h2' ? 'article-h2' : 'article-h3');
        }
      });

      // 2b. Generate automatic Daftar Isi from H2 headings only
      const h2Headings = doc.querySelectorAll('h2.article-h2');
      const firstH2 = h2Headings[0];
      if (h2Headings.length >= 2) {
        const tocNav = doc.createElement('nav');
        tocNav.className = 'article-outline';

        const tocLabel = doc.createElement('p');
        tocLabel.className = 'article-outline-label';
        tocLabel.textContent = 'Daftar Isi';
        tocNav.appendChild(tocLabel);

        const tocList = doc.createElement('ol');
        h2Headings.forEach(h2 => {
          const text = h2.textContent || '';
          const id = h2.getAttribute('id');
          if (id && text.trim()) {
            const li = doc.createElement('li');
            const a = doc.createElement('a');
            a.href = `#${id}`;
            a.textContent = text.trim();
            li.appendChild(a);
            tocList.appendChild(li);
          }
        });
        tocNav.appendChild(tocList);

        firstH2.parentNode?.insertBefore(tocNav, firstH2);
      }

      // 2b2. Convert inline-styled navy gradient CTAs to shared .article-cta class
      // Must run before auto-CTA check to avoid duplicates + ensure CSS centering
      const inlineCtas = doc.querySelectorAll('div[style*="1a1a2e"]');
      inlineCtas.forEach(el => {
        const btn = el.querySelector('a');
        if (!btn) return;
        const textParts: string[] = [];
        const h3El = el.querySelector('h3');
        if (h3El) {
          const txt = h3El.textContent?.trim();
          if (txt) textParts.push(txt);
        }
        el.querySelectorAll('p').forEach(p => {
          const txt = p.textContent?.trim();
          if (txt) textParts.push(txt);
        });
        const cta = doc.createElement('div');
        cta.className = 'article-cta';
        const title = doc.createElement('h3');
        title.textContent = textParts[0] || 'Konsultasi Gratis dengan Dreamlab';
        cta.appendChild(title);
        const body = doc.createElement('p');
        body.textContent = textParts.slice(1).join(' ') || 'Diskusikan konsep produk bersama tim Dreamlab.';
        cta.appendChild(body);
        const a = doc.createElement('a');
        a.href = btn.getAttribute('href') || THANKYOU_URL;
        a.className = 'cta-button';
        a.textContent = btn.textContent?.trim() || 'Konsultasi Gratis Sekarang';
        cta.appendChild(a);
        el.parentNode?.replaceChild(cta, el);
      });

      // 2c. Insert auto CTA right after ToC (or before first H2 if no ToC),
      // but only if article doesn't already have an in-content CTA
      const existingCta = doc.querySelector('.article-cta');
      if (!existingCta) {
        const autoCta = doc.createElement('div');
        autoCta.className = 'article-cta';

        const ctaTitle = doc.createElement('h3');
        ctaTitle.textContent = CTA_TITLE;
        autoCta.appendChild(ctaTitle);

        const ctaBody = doc.createElement('p');
        ctaBody.textContent = CTA_BODY;
        autoCta.appendChild(ctaBody);

        const ctaBtn = doc.createElement('a');
        ctaBtn.href = THANKYOU_URL;
        ctaBtn.className = 'cta-button';
        ctaBtn.textContent = CTA_BUTTON_TEXT;
        autoCta.appendChild(ctaBtn);

        const toc = doc.querySelector('.article-outline');
        if (toc) {
          toc.parentNode?.insertBefore(autoCta, toc.nextSibling);
        } else if (firstH2) {
          firstH2.parentNode?.insertBefore(autoCta, firstH2);
        } else {
          const content = doc.querySelector('.elementor-widget-theme-post-content') || doc.body;
          content.appendChild(autoCta);
        }
      }

      // 3. Clean up empty & nbsp-only paragraphs
      const allParas = doc.querySelectorAll('p');
      allParas.forEach(p => {
        const html = p.innerHTML.trim();
        if (!html || html === '\u00a0' || html === '&nbsp;') {
          p.remove();
        }
      });

      // 4. Normalize CTA & legalitas images — make clickable → /thankyou/google/

      // 4a. Rewrite <a> wrapping images → thankyou/google
      const oldAnchors = doc.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href*="dreamlab.id"], a[href*="thankyoupage-google"], a[href*="thankyou-page"]');
      oldAnchors.forEach(a => {
        if (!a.querySelector('img')) return;
        a.setAttribute('href', THANKYOU_URL);
      });

      // 4b. Wrap orphan legalitas/artikel images in <a href="...">
      const unwrappedImgs = doc.querySelectorAll('img[src*="legalitas"], img[src*="artikel-mid"], img[src*="cta-wa"], img[src*="artikel-cta"]');
      unwrappedImgs.forEach(img => {
        if (img.closest('a')) return;
        const wrapper = doc.createElement('a');
        wrapper.setAttribute('href', THANKYOU_URL);
        wrapper.setAttribute('style', 'display:block;cursor:pointer;text-decoration:none;');
        img.parentNode?.insertBefore(wrapper, img);
        wrapper.appendChild(img);
      });

      // 4c. Fix broken thankyoupage-google links
      const brokenLinks = doc.querySelectorAll('a[href*="thankyoupage-google"], a[href*="thankyou-page"]');
      brokenLinks.forEach(a => {
        if (a.querySelector('img')) return;
        a.setAttribute('href', THANKYOU_URL);
      });

      // 4d. Remove figcaption with broken URLs
      const brokenCaptions = doc.querySelectorAll('figcaption');
      brokenCaptions.forEach(fc => {
        if (fc.textContent?.includes('thankyoupage-google') || fc.textContent?.includes('thankyou-page')) {
          fc.remove();
        }
      });

      // 4e. Normalize inline-styled CTAs (navy-gradient with hardcoded inline styles) — use proper classes
      const ctaDivs = doc.querySelectorAll('div.article-cta');
      ctaDivs.forEach(el => {
        el.removeAttribute('style');
        el.querySelectorAll('div').forEach(d => {
          if (!d.textContent?.trim()) d.remove();
        });
        el.querySelectorAll('h3, p').forEach(p => p.removeAttribute('style'));
        const btn = el.querySelector('a[href*="thankyou"]');
        if (btn) {
          btn.className = 'cta-button';
          btn.removeAttribute('style');
          btn.setAttribute('href', THANKYOU_URL);
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
          const marker = summary.querySelector('span');
          if (marker && marker.textContent?.trim() === '+') {
            marker.remove();
          }
        }
      });

      // 5b. Add "Pertanyaan yang Sering Diajukan" heading before FAQ section if none exists
      const faqDetails = doc.querySelectorAll('details.article-faq');
      if (faqDetails.length >= 2) {
        const firstFaq = faqDetails[0];
        const prev = firstFaq.previousElementSibling;
        const hasFaqHeading = prev && (prev.tagName === 'H2' || prev.tagName === 'H3');
        if (!hasFaqHeading) {
          const faqHeading = doc.createElement('h2');
          faqHeading.id = 'pertanyaan-yang-sering-diajukan';
          faqHeading.className = 'article-h2';
          faqHeading.textContent = 'Pertanyaan yang Sering Diajukan';
          firstFaq.parentNode?.insertBefore(faqHeading, firstFaq);
        }
      }

      // 6. Strip double <br> artifacts
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
          el.querySelectorAll('.ig-skeleton').forEach(s => s.remove());
        }
      };

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

  // SSR fallback — raw HTML without JS transforms
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
