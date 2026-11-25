"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductAboutProps {
  categoryName: string;
}

export default function ProductAbout({ categoryName }: ProductAboutProps) {
  const waUrl = `/thankyou/google/`;

  return (
    <section className="relative py-[64px] sm:py-[104px] overflow-hidden bg-white">
      <style>{`
        @keyframes cat-intro-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes cat-intro-float {
          50% { transform: translateY(-14px) scale(1.04); }
        }
        .cat-intro-spin-slow {
          animation: cat-intro-spin 16s linear infinite;
        }
        .cat-intro-spin-ring {
          animation: cat-intro-spin 40s linear infinite reverse;
        }
        .cat-intro-float-blob {
          animation: cat-intro-float 7s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .cat-intro-spin-slow,
          .cat-intro-spin-ring,
          .cat-intro-float-blob {
            animation: none !important;
          }
          .cat-intro-btn {
            transition: none !important;
          }
          .cat-intro-btn:hover {
            transform: none !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-[1240px] px-[16px] sm:px-[40px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] lg:gap-[88px] items-center">
          {/* Left Side: Visual Collage */}
          <div className="relative py-[40px] pl-[24px] sm:py-[56px] sm:pl-[48px] max-w-[560px] mx-auto w-full lg:max-w-none">
            <span
              aria-hidden="true"
              className="cat-intro-spin-ring absolute right-[-60px] sm:right-[-40px] top-0 size-[180px] sm:size-[260px] rounded-full border-[1.5px] border-dashed border-[rgba(243,146,0,0.35)]"
            />
            <span
              aria-hidden="true"
              className="cat-intro-float-blob absolute left-0 bottom-[10px] size-[220px] rounded-full bg-[radial-gradient(circle,#FFE4BF_0%,rgba(255,228,191,0)_70%)]"
            />

            {/* Main Photo */}
            <div className="relative aspect-[4/5] rounded-[20px_80px_20px_20px] sm:rounded-[28px_120px_28px_28px] overflow-hidden shadow-[0_30px_60px_-28px_rgba(60,35,10,0.35)] bg-[#FAF8F5]">
              <Image
                src="/assets/images/home/service-consultation.jpg"
                alt="Dreamlab RnD Expert Team"
                title="Tim R&D dan Apoteker Ahli — Dreamlab Maklon Kosmetik"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 92vw, 520px"
                className="object-cover object-center"
              />
            </div>

            {/* Inset Photo */}
            <div className="absolute left-0 bottom-0 w-[44%] aspect-[1/1.05] rounded-[18px] sm:rounded-[24px] overflow-hidden border-[5px] sm:border-[8px] border-white shadow-[0_20px_44px_-18px_rgba(60,35,10,0.35)] bg-white">
              <Image
                src="/new asset/people/Busdev-dreamlab.png"
                alt="Apoteker Penanggung Jawab Dreamlab"
                title="Apoteker Penanggung Jawab — Dreamlab Maklon Kosmetik"
                fill
                sizes="(max-width: 1024px) 45vw, 260px"
                loading="lazy"
                className="object-cover object-[center_35%]"
              />
            </div>

            {/* Rotating Badge with existing "1000++ / Brand Sukses" text */}
            <div
              aria-label="1000++ Brand Sukses"
              className="absolute left-0 top-0 sm:left-[4px] sm:top-[8px] size-[118px] sm:size-[168px] rounded-full bg-[#F39200] shadow-[0_18px_40px_-14px_rgba(243,146,0,0.75)] grid place-items-center z-20"
            >
              <svg
                viewBox="0 0 168 168"
                aria-hidden="true"
                className="cat-intro-spin-slow absolute inset-0 w-full h-full"
              >
                <defs>
                  <path
                    id="cat-intro-circ"
                    d="M84,84 m-66,0 a66,66 0 1,1 132,0 a66,66 0 1,1 -132,0"
                  />
                </defs>
                <text className="fill-white font-semibold uppercase text-[11px] sm:text-[11.5px] tracking-[0.24em] sm:tracking-[0.32em]">
                  <textPath href="#cat-intro-circ">
                    Brand Sukses • Maklon Dreamlab •{" "}
                  </textPath>
                </text>
              </svg>
              <div className="text-center text-white leading-none">
                <span className="block font-display text-[25px] sm:text-[34px] font-normal">
                  1000++
                </span>
                <span className="block font-sans font-semibold text-[8px] sm:text-[9.5px] uppercase tracking-[0.14em] mt-[4px]">
                  Brand Sukses
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Existing Copywriting & Value Propositions */}
          <div>
            <div className="inline-flex items-center gap-[8px] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C86400] bg-[#FFF3E2] rounded-full px-[14px] py-[8px]">
              <span
                aria-hidden="true"
                className="size-[6px] rounded-full bg-[#F39200]"
              />
              <span>One-Stop Maklon Service</span>
            </div>

            <h2 className="mt-[18px] font-display font-normal text-[clamp(28px,3.2vw,40px)] leading-[1.12] tracking-[-0.01em] text-[#212120]">
              Wujudkan Brand{" "}
              <span className="text-[#F39200]">{categoryName}</span> Juaranya
              Formula
            </h2>

            <p className="mt-[18px] text-[15.5px] sm:text-[17px] leading-[1.7] text-[#6B6762]">
              Dreamlab adalah perusahaan maklon {categoryName} dengan layanan
              lengkap dari awal hingga akhir. Kami menawarkan{" "}
              <strong className="text-[#212120] font-semibold">
                One Stop Maklon Service
              </strong>
              . Didukung penuh oleh sertifikasi resmi{" "}
              <strong className="text-[#212120] font-semibold">
                CPKB Grade A, BPOM, dan Halal
              </strong>{" "}
              untuk menjamin keamanan serta standar kualitas produk premium Anda
              di pasar.
            </p>

            {/* Value Checklists (2x2 Grid) */}
            <div className="mt-[32px] pb-[32px] border-b border-[rgba(33,33,32,0.10)] grid grid-cols-1 sm:grid-cols-2 gap-[16px] sm:gap-x-[32px] sm:gap-y-[24px]">
              <div className="grid grid-cols-[28px_1fr] gap-x-[12px]">
                <div className="row-span-2 size-[28px] rounded-full bg-[#FFF3E2] flex items-center justify-center text-[#C86400] shrink-0">
                  <svg
                    className="size-[13px]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h4 className="font-display font-normal text-[16px] text-[#212120]">
                  Legalitas CPKB &amp; BPOM
                </h4>
                <p className="mt-[4px] text-[13.5px] text-[#6B6762] leading-[1.55]">
                  Sertifikasi manufaktur CPKB Grade A, BPOM, dan Halal — jaminan
                  izin edar aman.
                </p>
              </div>

              <div className="grid grid-cols-[28px_1fr] gap-x-[12px]">
                <div className="row-span-2 size-[28px] rounded-full bg-[#FFF3E2] flex items-center justify-center text-[#C86400] shrink-0">
                  <svg
                    className="size-[13px]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h4 className="font-display font-normal text-[16px] text-[#212120]">
                  Layanan One Stop Maklon
                </h4>
                <p className="mt-[4px] text-[13.5px] text-[#6B6762] leading-[1.55]">
                  Pendampingan penuh mulai konsep, formulasi, hingga siap jual.
                </p>
              </div>

              <div className="grid grid-cols-[28px_1fr] gap-x-[12px]">
                <div className="row-span-2 size-[28px] rounded-full bg-[#FFF3E2] flex items-center justify-center text-[#C86400] shrink-0">
                  <svg
                    className="size-[13px]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h4 className="font-display font-normal text-[16px] text-[#212120]">
                  RnD Formula Juara
                </h4>
                <p className="mt-[4px] text-[13.5px] text-[#6B6762] leading-[1.55]">
                  Pengembangan formula unik menggunakan bahan aktif
                  bersertifikasi global.
                </p>
              </div>

              <div className="grid grid-cols-[28px_1fr] gap-x-[12px]">
                <div className="row-span-2 size-[28px] rounded-full bg-[#FFF3E2] flex items-center justify-center text-[#C86400] shrink-0">
                  <svg
                    className="size-[13px]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h4 className="font-display font-normal text-[16px] text-[#212120]">
                  MOQ Fleksibel
                </h4>
                <p className="mt-[4px] text-[13.5px] text-[#6B6762] leading-[1.55]">
                  Skala produksi awal terjangkau, ideal bagi pemula maupun
                  korporasi.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-[28px]">
              <Link
                href={waUrl}
                rel="nofollow"
                className="cat-intro-btn w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#F39200] text-[#212120] font-semibold text-[15px] py-[16px] px-[28px] rounded-full transition-all duration-300 shadow-[0_10px_24px_-10px_rgba(243,146,0,0.7)] hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-10px_rgba(243,146,0,0.8)] focus-visible:outline-2 focus-visible:outline-[#F39200] focus-visible:outline-offset-4"
              >
                <span>Konsultasi Sekarang</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
