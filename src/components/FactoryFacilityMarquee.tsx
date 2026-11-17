import Image from "next/image";

const FACTORY_PANELS = [
  {
    src: "/assets/images/factory-showcase/factory-01-lotion-line.jpg",
    alt: "Lini produksi body lotion tube di fasilitas maklon kosmetik Dreamlab",
    objectPosition: "center center",
  },
  {
    src: "/assets/images/factory-showcase/factory-02-qc-inspection.jpg",
    alt: "Inspeksi kualitas produk serum oleh staf quality control bersarung tangan steril",
    objectPosition: "center center",
  },
  {
    src: "/assets/images/factory-showcase/factory-03-cream-filling.jpg",
    alt: "Mesin pengisian krim otomatis higienis pada kemasan jar kosmetik",
    objectPosition: "center center",
  },
  {
    src: "/assets/images/factory-showcase/factory-04-parfum-filling.jpg",
    alt: "Proses pengisian botol parfum otomatis di lini produksi parfum Dreamlab",
    objectPosition: "center center",
  },
  {
    src: "/assets/images/factory-showcase/factory-05-deodorant-line.jpg",
    alt: "Produksi massal deodorant spray siap kemas di pabrik kosmetik Dreamlab",
    objectPosition: "center center",
  },
  {
    src: "/assets/images/factory-showcase/factory-06-laser-qc.jpg",
    alt: "Pemindaian laser dan kontrol kualitas kemasan pada jalur konveyor",
    objectPosition: "center center",
  },
  {
    src: "/assets/images/factory-showcase/factory-07-shrink-wrap.jpg",
    alt: "Proses pengemasan akhir shrink-wrap higienis pada jalur produksi",
    objectPosition: "center center",
  },
  {
    src: "/assets/images/factory-showcase/factory-08-parfum-boxes.jpg",
    alt: "Kemasan dus parfum siap edar hasil produksi pabrik maklon Dreamlab",
    objectPosition: "center center",
  },
] as const;

export default function FactoryFacilityMarquee() {
  return (
    <section
      aria-label="Brand Terbaik Anda Dimulai Dari Sini - Fasilitas Produksi Dreamlab"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#F4F8FD] via-[#E9F2FC] to-[#F7FAFE] py-16 sm:py-20 lg:py-28"
    >
      <style>{`
        @keyframes dreamlab-factory-marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .dreamlab-marquee-track {
          animation: dreamlab-factory-marquee 48s linear infinite;
          will-change: transform;
        }
        @media (hover: hover) {
          .dreamlab-marquee-viewport:hover .dreamlab-marquee-track {
            animation-play-state: paused;
          }
        }
        @media (max-width: 639px) {
          .dreamlab-marquee-track {
            animation: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .dreamlab-marquee-track {
            animation: none;
          }
        }
        .dreamlab-no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .dreamlab-no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Section Title above the visual strip (styled at H1 scale while preserving single H1 on page) */}
      <div className="mx-auto max-w-4xl px-4 text-center mb-10 sm:mb-12 lg:mb-14">
        <div
          aria-hidden="true"
          className="mx-auto mb-5 h-[2px] w-14 rounded-full bg-gradient-to-r from-transparent via-[#F39200]/70 to-transparent"
        />
        <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-black uppercase tracking-tight leading-[1.15] text-[#0A2558]">
          BRAND TERBAIK ANDA DIMULAI DARI SINI
        </h2>
      </div>

      {/* Centered panoramic curved container */}
      <div className="mx-auto max-w-[1440px] px-0 sm:px-6 lg:px-10">
        <div className="dreamlab-marquee-viewport relative overflow-hidden sm:rounded-[28px] bg-white/70 ring-1 ring-blue-100/80">
          {/* Subtle top concave panoramic arc */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1440 42"
            preserveAspectRatio="none"
            className="pointer-events-none absolute top-0 left-0 z-20 hidden sm:block h-6 md:h-8 lg:h-10 w-full"
          >
            <path
              d="M0,0 L1440,0 L1440,4 Q720,40 0,4 Z"
              fill="#EFF5FC"
            />
          </svg>

          {/* Horizontally scrollable on mobile; continuous GPU marquee on sm+ */}
          <div className="dreamlab-no-scrollbar overflow-x-auto sm:overflow-hidden scroll-smooth">
            <div className="dreamlab-marquee-track flex w-max flex-nowrap items-stretch">
              {[0, 1].map((trackIdx) => (
                <div
                  key={trackIdx}
                  aria-hidden={trackIdx === 1 ? "true" : undefined}
                  className={`flex shrink-0 flex-nowrap gap-[6px] sm:gap-2 px-[3px] sm:px-1 ${
                    trackIdx === 1 ? "hidden sm:flex" : "flex"
                  }`}
                >
                  {FACTORY_PANELS.map((panel, idx) => (
                    <div
                      key={`${trackIdx}-${idx}`}
                      className="relative shrink-0 w-[64vw] max-w-[260px] sm:w-[240px] md:w-[265px] lg:w-[285px] sm:max-w-none h-[320px] sm:h-[360px] md:h-[400px] lg:h-[440px] overflow-hidden rounded-xl sm:rounded-2xl bg-[#E9F2FC] border border-white"
                    >
                      <Image
                        src={panel.src}
                        alt={trackIdx === 0 ? panel.alt : ""}
                        fill
                        loading="lazy"
                        sizes="(max-width: 639px) 64vw, (max-width: 1023px) 265px, 285px"
                        className="object-cover brightness-[1.01] contrast-[1.02]"
                        style={{ objectPosition: panel.objectPosition }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Subtle bottom concave panoramic arc */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1440 42"
            preserveAspectRatio="none"
            className="pointer-events-none absolute bottom-0 left-0 z-20 hidden sm:block h-6 md:h-8 lg:h-10 w-full"
          >
            <path
              d="M0,38 Q720,2 1440,38 L1440,42 L0,42 Z"
              fill="#F3F8FD"
            />
          </svg>
        </div>
      </div>

      {/* Subtle bottom hairline */}
      <div
        aria-hidden="true"
        className="mx-auto mt-8 sm:mt-10 h-[2px] w-16 rounded-full bg-gradient-to-r from-transparent via-[#0A2558]/15 to-transparent"
      />
    </section>
  );
}
