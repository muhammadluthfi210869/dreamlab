"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface KatalogCarouselItem {
  id: string;
  name: string;
  tag: string;
  tagline: string;
  image: string;
  variantsText: string;
  link: string;
  alt: string;
  title: string;
  ariaLabel: string;
}

interface KatalogFloatingCarouselProps {
  items: KatalogCarouselItem[];
  catalogHref: string;
  viewAllLabel: string;
}

export default function KatalogFloatingCarousel({
  items,
  catalogHref,
  viewAllLabel,
}: KatalogFloatingCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 1) {
      setProgress(1);
      setCanPrev(false);
      setCanNext(false);
      return;
    }
    const ratio = Math.min(1, Math.max(0, el.scrollLeft / maxScroll));
    setProgress(ratio);
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState, { passive: true });
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState]);

  const scrollByCard = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>("[data-katalog-card]");
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 300;
    const gap = window.innerWidth <= 640 ? 14 : 20;
    el.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: "smooth",
    });
  };

  // Show a non-zero initial progress segment proportional to visible cards
  const fillPercent = Math.max(25, Math.round(progress * 100));

  return (
    <div className="relative">
      <style>{`
        .katalog-track {
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-snap-type: x mandatory;
          scroll-padding-left: 16px;
        }
        @media (min-width: 1024px) {
          .katalog-track {
            scroll-padding-left: 40px;
          }
        }
        .katalog-track::-webkit-scrollbar {
          display: none;
        }
        .katalog-card {
          scroll-snap-align: start;
          box-shadow: 0 1px 2px rgba(60, 35, 10, 0.04), 0 8px 24px -6px rgba(60, 35, 10, 0.1), 0 24px 48px -12px rgba(60, 35, 10, 0.14);
          transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (hover: hover) {
          .katalog-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 2px 4px rgba(60, 35, 10, 0.05), 0 16px 40px -8px rgba(60, 35, 10, 0.18), 0 36px 70px -16px rgba(60, 35, 10, 0.22);
          }
        }
        .katalog-card:focus-visible {
          transform: translateY(-6px);
          box-shadow: 0 2px 4px rgba(60, 35, 10, 0.05), 0 16px 40px -8px rgba(60, 35, 10, 0.18), 0 36px 70px -16px rgba(60, 35, 10, 0.22);
          outline: 2px solid #F39200;
          outline-offset: 4px;
        }
        .katalog-card-img {
          transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (hover: hover) {
          .katalog-card:hover .katalog-card-img {
            transform: scale(1.05);
          }
        }
        .katalog-card:focus-visible .katalog-card-img {
          transform: scale(1.05);
        }
        .katalog-variants {
          display: grid;
          grid-template-rows: 0fr;
          opacity: 0;
          margin-top: 0;
          transition: grid-template-rows 450ms cubic-bezier(0.22, 1, 0.36, 1), opacity 450ms cubic-bezier(0.22, 1, 0.36, 1), margin-top 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (hover: hover) {
          .katalog-card:hover .katalog-variants {
            grid-template-rows: 1fr;
            opacity: 1;
            margin-top: 8px;
          }
        }
        .katalog-card:focus-visible .katalog-variants {
          grid-template-rows: 1fr;
          opacity: 1;
          margin-top: 8px;
        }
        @media (max-width: 640px) {
          .katalog-variants {
            grid-template-rows: 1fr;
            opacity: 1;
            margin-top: 8px;
          }
        }
        .katalog-arrow {
          transition: background-color 450ms cubic-bezier(0.22, 1, 0.36, 1), transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (hover: hover) {
          .katalog-card:hover .katalog-arrow {
            background-color: #F39200;
            transform: rotate(-45deg);
          }
        }
        .katalog-card:focus-visible .katalog-arrow {
          background-color: #F39200;
          transform: rotate(-45deg);
        }
        @media (prefers-reduced-motion: reduce) {
          .katalog-card,
          .katalog-card-img,
          .katalog-variants,
          .katalog-arrow {
            transition: none !important;
          }
          .katalog-card:hover,
          .katalog-card:focus-visible {
            transform: none !important;
          }
          .katalog-card:hover .katalog-card-img,
          .katalog-card:focus-visible .katalog-card-img {
            transform: none !important;
          }
        }
      `}</style>

      {/* Track Container (max-width 1360px) */}
      <div className="mx-auto max-w-[1360px]">
        <div
          ref={trackRef}
          onScroll={updateScrollState}
          className="katalog-track flex flex-nowrap overflow-x-auto gap-[14px] lg:gap-[20px] px-[16px] lg:px-[40px] pt-[8px] pb-[56px] -mt-[8px] -mb-[56px]"
        >
          {items.map((item, index) => (
            <Link
              key={item.id}
              href={item.link}
              data-katalog-card
              aria-label={item.ariaLabel}
              className="katalog-card relative shrink-0 w-[78%] min-[641px]:w-[calc((100%-20px)/2.3)] min-[1025px]:w-[calc((100%-60px)/4.3)] aspect-[3/4] rounded-[20px] overflow-hidden bg-[#E9E3DC] block"
            >
              <Image
                src={item.image}
                alt={item.alt}
                title={item.title}
                fill
                loading={index < 2 ? "eager" : "lazy"}
                priority={index < 2}
                sizes="(max-width:640px) 78vw, (max-width:1024px) 43vw, 300px"
                className="katalog-card-img object-cover object-center"
              />

              {/* Top-left Formula Pill */}
              <span
                className="absolute top-[14px] left-[14px] z-10 pointer-events-none rounded-full px-[11px] py-[7px] text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#212120] bg-[rgba(255,255,255,0.92)] supports-[backdrop-filter]:bg-[rgba(255,255,255,0.8)] backdrop-blur-[8px]"
              >
                {item.tag}
              </span>

              {/* Bottom Floating Info Panel */}
              <div
                className="absolute inset-x-[12px] bottom-[12px] z-10 rounded-[14px] pt-[18px] pr-[18px] pb-[18px] pl-[20px] bg-[rgba(255,255,255,0.95)] supports-[backdrop-filter]:bg-[rgba(255,255,255,0.88)] backdrop-blur-[14px] [-webkit-backdrop-filter:blur(14px)] shadow-[0_8px_24px_-10px_rgba(60,35,10,0.25)] flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-[20px] font-normal normal-case leading-[1.15] tracking-[-0.01em] text-[#212120]">
                    {item.name}
                  </h3>
                  <p className="text-[13px] text-[#6B6762] mt-[4px] truncate">
                    {item.tagline}
                  </p>
                  <div className="katalog-variants">
                    <div className="overflow-hidden">
                      <p className="text-[12.5px] font-medium text-[#C86400] leading-snug">
                        {item.variantsText}
                      </p>
                    </div>
                  </div>
                </div>

                <span
                  aria-hidden="true"
                  className="katalog-arrow hidden sm:flex w-[36px] h-[36px] rounded-full bg-[#212120] text-white items-center justify-center shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Row inside 1280px container */}
      <div className="mx-auto max-w-[1280px] px-4 lg:px-10 mt-10 flex items-center justify-between gap-6">
        <Link
          href={catalogHref}
          className="text-[14px] font-medium text-[#212120] border-b border-[#212120]/25 hover:border-[#212120] pb-0.5 transition-colors shrink-0"
        >
          {viewAllLabel}
        </Link>

        {/* Center Progress Bar */}
        <div
          aria-hidden="true"
          className="flex-1 max-w-[240px] h-[2px] bg-[rgba(33,33,32,0.10)] rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-[#212120] transition-[width] duration-200 ease-out"
            style={{ width: `${fillPercent}%` }}
          />
        </div>

        {/* Right Prev/Next Buttons (hidden on mobile) */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label="Sebelumnya"
            className="w-[44px] h-[44px] rounded-full bg-white border border-[rgba(33,33,32,0.10)] shadow-sm flex items-center justify-center text-[#212120] hover:bg-[#212120] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#212120] transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label="Berikutnya"
            className="w-[44px] h-[44px] rounded-full bg-white border border-[rgba(33,33,32,0.10)] shadow-sm flex items-center justify-center text-[#212120] hover:bg-[#212120] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#212120] transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

