'use client';

import React, { useEffect, useRef } from 'react';
import Script from 'next/script';

interface InteractiveArticleBodyProps {
  htmlContent: string;
}

/**
 * Renderer artikel. HTML CONTENT SUDAH DIPROSES di server (lihat
 * `@/lib/article-content-processor`) — TOC, heading-id, CTA, FAQ, dan
 * link gambar sudah final saat SSG/ISR. Komponen ini hanya:
 *  1. render string (dangerouslySetInnerHTML) — tanpa re-parse/no-swap.
 *  2. kalau ada blok Instagram, pasang skeleton + muat embed.js sekali.
 */
export default function InteractiveArticleBody({ htmlContent }: InteractiveArticleBodyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Hanya muat wrapper embed Instagram bila artikel benar-benar memuat blok IG.
  const hasInstagramEmbed =
    /instagram\.com\/p\//i.test(htmlContent) || /\.instagram-media[\s>]/i.test(htmlContent);

  useEffect(() => {
    if (!hasInstagramEmbed) return;

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
  }, [hasInstagramEmbed]);

  return (
    <>
      <div
        className="article-content legacy-content-wrapper entry-content article-content-interactive"
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      {hasInstagramEmbed && (
        <Script
          src="//www.instagram.com/embed.js"
          strategy="lazyOnload"
          onLoad={() => {
            try { (window as any).instgrm?.Embeds?.process(); } catch {}
          }}
        />
      )}
    </>
  );
}