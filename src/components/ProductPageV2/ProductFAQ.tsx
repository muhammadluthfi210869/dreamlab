"use client";

import { getProductFaqs } from "@/data/product-faqs";

interface ProductFAQProps {
  categorySlug: string;
  categoryName: string;
  subCategorySlug?: string;
  productSlug?: string;
  productName?: string;
}

export default function ProductFAQ({
  categorySlug,
  categoryName,
  subCategorySlug,
  productSlug,
  productName,
}: ProductFAQProps) {
  const faqs = getProductFaqs(categorySlug, subCategorySlug, productSlug);
  const displayName = productName || categoryName;

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="bg-white py-[64px] sm:py-[104px] w-full">
      <style>{`
        details.cat-faq summary {
          list-style: none;
        }
        details.cat-faq summary::-webkit-details-marker {
          display: none;
        }
        details.cat-faq summary:focus-visible {
          outline: 2px solid #F39200;
          outline-offset: 4px;
          border-radius: 6px;
        }
        details.cat-faq[open] .cat-faq-icon {
          background-color: #F39200;
          color: #212120;
          border-color: #F39200;
          transform: rotate(45deg);
        }
        @media (prefers-reduced-motion: reduce) {
          .cat-faq-icon {
            transition: none !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-[1240px] px-[16px] sm:px-[40px]">
        <div className="text-center max-w-[680px] mx-auto mb-[32px] sm:mb-[48px]">
          <h2 className="font-display font-normal text-[clamp(28px,3.2vw,40px)] leading-[1.12] tracking-[-0.01em] text-[#212120] uppercase">
            Ketahui Lebih Lanjut Maklon{" "}
            <span className="text-[#F39200]">{displayName}</span> Dreamlab
          </h2>
        </div>

        <div className="max-w-[820px] mx-auto">
          {faqs.map((item, idx) => (
            <details
              key={idx}
              open={idx === 0}
              className={`cat-faq border-b border-[rgba(33,33,32,0.10)] ${
                idx === 0 ? "border-t" : ""
              }`}
            >
              <summary className="cursor-pointer flex items-center justify-between gap-[24px] py-[24px] text-[15px] sm:text-[16px] font-medium leading-[1.45] text-[#212120]">
                <h3 className="font-sans !font-medium text-[15px] sm:text-[16px] leading-[1.45] text-[#212120]">
                  {item.question}
                </h3>
                <span
                  aria-hidden="true"
                  className="cat-faq-icon shrink-0 size-[28px] rounded-full border border-[rgba(33,33,32,0.10)] grid place-items-center text-[16px] font-normal transition-all duration-300"
                >
                  +
                </span>
              </summary>
              <p className="pb-[24px] pr-0 sm:pr-[52px] text-[14.5px] leading-[1.75] text-[#6B6762]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
