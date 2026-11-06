'use client';

import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { LeadQualificationModal } from './LeadQualificationModal';

interface InteractiveArticleBodyProps {
  htmlContent: string;
}

/**
 * Renderer artikel. HTML CONTENT SUDAH DIPROSES di server (lihat
 * `@/lib/article-content-processor`) — TOC, heading-id, CTA, FAQ, dan
 * link gambar sudah final saat SSG/ISR. Komponen ini hanya:
 *  1. render string (dangerouslySetInnerHTML) — tanpa re-parse/no-swap.
 *  2. mount komponen interaktif React (kalkulator, checklist, modal).
 *  3. kalau ada blok Instagram, pasang skeleton + muat embed.js sekali.
 */
export default function InteractiveArticleBody({ htmlContent }: InteractiveArticleBodyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leadModalState, setLeadModalState] = useState<{
    isOpen: boolean;
    category: string;
    budget?: string;
    extraWaText?: string;
  }>({
    isOpen: false,
    category: 'Bodycare',
  });

  // Hanya muat wrapper embed Instagram bila artikel benar-benar memuat blok IG.
  const hasInstagramEmbed =
    /instagram\.com\/p\//i.test(htmlContent) || /\.instagram-media[\s>]/i.test(htmlContent);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const calcRoot = el.querySelector('#production-capacity-calculator-root');
    if (calcRoot && !calcRoot.hasAttribute('data-mounted')) {
      calcRoot.setAttribute('data-mounted', 'true');
      import('react-dom/client').then(({ createRoot }) => {
        import('./ProductionCapacityCalculator').then(({ default: ProductionCapacityCalculator }) => {
          const root = createRoot(calcRoot);
          root.render(React.createElement(ProductionCapacityCalculator));
        });
      });
    }

    const hppCalcRoot = el.querySelector('#hpp-calculator-root');
    if (hppCalcRoot && !hppCalcRoot.hasAttribute('data-mounted')) {
      hppCalcRoot.setAttribute('data-mounted', 'true');
      const defaultMode =
        hppCalcRoot.getAttribute('data-default-mode') === 'quick'
          ? 'quick'
          : 'detail';
      import('react-dom/client').then(({ createRoot }) => {
        import('./HppCalculator').then(({ default: HppCalculator }) => {
          const root = createRoot(hppCalcRoot);
          root.render(React.createElement(HppCalculator, { defaultMode }));
        });
      });
    }

    const checklistRoot = el.querySelector('#bodycare-checklist-root');
    if (checklistRoot && !checklistRoot.hasAttribute('data-mounted')) {
      checklistRoot.setAttribute('data-mounted', 'true');
      const variant =
        checklistRoot.getAttribute('data-checklist-variant') === 'biaya'
          ? 'biaya'
          : 'default';
      import('react-dom/client').then(({ createRoot }) => {
        import('./ConsultationChecklist').then(({ default: ConsultationChecklist }) => {
          const root = createRoot(checklistRoot);
          root.render(React.createElement(ConsultationChecklist, { variant }));
        });
      });
    }

    const track = el.querySelector('#dl-product-carousel-track') as HTMLElement | null;
    const dotsContainer = el.querySelector('#dl-carousel-dots') as HTMLElement | null;
    const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll<HTMLButtonElement>('[data-carousel-dot]')) : [];

    const updateActiveDot = () => {
      if (!track || !dots.length) return;
      const cards = Array.from(track.querySelectorAll<HTMLElement>('.dl-carousel-card'));
      if (!cards.length) return;
      const trackRect = track.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;

      let closestIdx = 0;
      let minDistance = Infinity;
      cards.forEach((card, idx) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const dist = Math.abs(trackCenter - cardCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });

      dots.forEach((dot, idx) => {
        if (idx === closestIdx) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    let scrollRaf: number | null = null;
    const handleScroll = () => {
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(updateActiveDot);
    };

    if (track) {
      track.addEventListener('scroll', handleScroll, { passive: true });
    }

    const handleCarouselClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const modalBtn = target.closest<HTMLElement>('[data-open-lead-modal]');
      if (modalBtn) {
        e.preventDefault();
        const cat = modalBtn.getAttribute('data-category') || 'Bodycare';
        const budget = modalBtn.getAttribute('data-budget') || undefined;
        setLeadModalState({
          isOpen: true,
          category: cat,
          budget,
        });
        return;
      }

      const productCard = target.closest<HTMLElement>('[data-article-product]');
      if (productCard) {
        const productName = productCard.getAttribute('data-article-product') || '';
        const fromSlug =
          productCard.getAttribute('data-from') ||
          'biaya-maklon-bodycare-target-hpp';
        const href = productCard.getAttribute('data-product-href');

        if (typeof window !== 'undefined' && productName) {
          const w = window as unknown as {
            dataLayer?: Array<Record<string, unknown>>;
          };
          w.dataLayer = w.dataLayer || [];
          w.dataLayer.push({
            event: 'article_product_click',
            product: productName,
            from: fromSlug,
          });
        }

        const clickedAnchor = target.closest('a');
        if (!clickedAnchor && href) {
          window.location.href = href;
        }
        return;
      }

      const dotBtn = target.closest<HTMLButtonElement>('[data-carousel-dot]');
      if (dotBtn && track) {
        const idx = Number(dotBtn.getAttribute('data-carousel-dot'));
        const cards = Array.from(track.querySelectorAll<HTMLElement>('.dl-carousel-card'));
        if (cards[idx]) {
          cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
        return;
      }

      const btn = target.closest('[data-carousel-prev], [data-carousel-next]');
      if (!btn) return;
      const carTrack = (el.querySelector('#dl-product-carousel-track') || btn.parentElement?.querySelector('.dl-carousel-track')) as HTMLElement | null;
      if (!carTrack) return;
      const isPrev = btn.hasAttribute('data-carousel-prev');
      carTrack.scrollBy({ left: isPrev ? -320 : 320, behavior: 'smooth' });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const target = e.target as HTMLElement;
      const productCard = target.closest<HTMLElement>('[data-article-product]');
      if (!productCard || target.tagName === 'A') return;
      e.preventDefault();
      productCard.click();
    };

    el.addEventListener('click', handleCarouselClick);
    el.addEventListener('keydown', handleKeyDown);
    return () => {
      if (track) track.removeEventListener('scroll', handleScroll);
      el.removeEventListener('click', handleCarouselClick);
      el.removeEventListener('keydown', handleKeyDown);
    };
  }, [htmlContent]);

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
      <LeadQualificationModal
        isOpen={leadModalState.isOpen}
        onClose={() => setLeadModalState((prev) => ({ ...prev, isOpen: false }))}
        defaultCategory={leadModalState.category}
        defaultBudget={leadModalState.budget}
        extraWaText={leadModalState.extraWaText}
        source="article-cta"
        channel="other"
        landingPage={typeof window !== 'undefined' ? window.location.pathname : ''}
      />
    </>
  );
}