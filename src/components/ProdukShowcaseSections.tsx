import Image from "next/image";
import Link from "next/link";

const dreamlabFeatures = [
  {
    title: "Legalitas CPKB & BPOM",
    desc: "Sertifikasi CPKB Grade A, BPOM, dan Halal untuk izin edar yang aman.",
  },
  {
    title: "Layanan One-Stop",
    desc: "Didampingi mulai konsep, formulasi, kemasan, hingga siap jual.",
  },
  {
    title: "R&D Formula Juara",
    desc: "Formula eksklusif dengan bahan aktif bersertifikasi global.",
  },
  {
    title: "MOQ Fleksibel",
    desc: "Produksi awal terjangkau, ideal untuk pemula maupun korporasi.",
  },
];

const docPhotos = [
  {
    src: "/assets/images/home/service-consultation.jpg",
    label: "Konsultasi",
    line: "Diskusi konsep brand",
  },
  {
    src: "/new asset/people/vira.webp",
    label: "Business Development",
    line: "Pendampingan klien",
  },
  {
    src: "/assets/images/home/service-rnd-team.jpg",
    label: "R&D",
    line: "Riset & uji formula",
  },
  {
    src: "/assets/images/home/service-production.jpg",
    label: "Produksi",
    line: "Pabrik CPKB Grade A",
  },
  {
    src: "/assets/images/factory-showcase/factory-02-qc-inspection.jpg",
    label: "Quality Control",
    line: "Cek setiap batch",
  },
  {
    src: "/assets/images/factory-showcase/factory-03-cream-filling.jpg",
    label: "Filling",
    line: "Pengisian krim",
  },
  {
    src: "/assets/images/factory-showcase/factory-04-parfum-filling.jpg",
    label: "Parfum",
    line: "Filling parfum",
  },
  {
    src: "/assets/images/factory-showcase/factory-08-parfum-boxes.jpg",
    label: "Siap Kirim",
    line: "Produk brand klien",
  },
];

const clientLogos = [
  "Bebiboster",
  "Itnob",
  "Jilly-Daily",
  "Labbol",
  "Sense-Soul",
  "Tazzi",
  "1",
  "3",
];

const showcaseStyles = `
  .prod-focus:focus-visible {
    outline: 2px solid #F39200;
    outline-offset: 4px;
    border-radius: 6px;
  }
  @keyframes prod-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes prod-float {
    50% { transform: translateY(-14px) scale(1.04); }
  }
  @keyframes prod-mq {
    to { transform: translateX(calc(-50% - 10px)); }
  }
  @keyframes prod-mq-logo {
    to { transform: translateX(calc(-50% - 8px)); }
  }
  .prod-spin-slow {
    animation: prod-spin 16s linear infinite;
  }
  .prod-spin-ring {
    animation: prod-spin 40s linear infinite reverse;
  }
  .prod-float-blob {
    animation: prod-float 7s ease-in-out infinite;
  }
  .prod-mq-mask {
    -webkit-mask: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
    mask: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
  }
  .prod-mq-track {
    display: flex;
    gap: 20px;
    width: max-content;
    animation: prod-mq 50s linear infinite;
  }
  .prod-logo-track {
    display: flex;
    gap: 16px;
    width: max-content;
    animation: prod-mq-logo 35s linear infinite reverse;
  }
  .prod-mq-mask:hover .prod-mq-track,
  .prod-mq-mask:hover .prod-logo-track {
    animation-play-state: paused;
  }
  .prod-doc-img {
    transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .prod-doc-card:hover .prod-doc-img {
    transform: scale(1.05);
  }
  .prod-logo-img {
    transition: filter 350ms cubic-bezier(0.22, 1, 0.36, 1), opacity 350ms cubic-bezier(0.22, 1, 0.36, 1), transform 350ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .prod-logo-img:hover {
    filter: none;
    opacity: 1;
    transform: translateY(-3px);
  }
  @media (prefers-reduced-motion: reduce) {
    .prod-doc-img,
    .prod-logo-img,
    .prod-btn-p {
      transition: none !important;
    }
    .prod-spin-slow,
    .prod-spin-ring,
    .prod-float-blob,
    .prod-mq-track,
    .prod-logo-track {
      animation: none !important;
    }
    .prod-doc-card:hover .prod-doc-img,
    .prod-logo-img:hover,
    .prod-btn-p:hover {
      transform: none !important;
    }
  }
`;

export function DreamlabIntroSection({
  ctaHref = "/thankyou/google/?source=produk-tentang",
}: {
  ctaHref?: string;
}) {
  return (
    <section className="bg-white py-[64px] sm:py-[104px] overflow-hidden">
      <style>{showcaseStyles}</style>
      <div className="mx-auto max-w-[1240px] px-[16px] sm:px-[40px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] lg:gap-[88px] items-center">
          {/* Left visual */}
          <div className="relative py-[40px] pl-[24px] sm:py-[56px] sm:pl-[48px] max-w-[560px] mx-auto w-full lg:max-w-none">
            <span
              aria-hidden="true"
              className="prod-spin-ring absolute right-[-60px] sm:right-[-40px] top-0 size-[180px] sm:size-[260px] rounded-full border-[1.5px] border-dashed border-[rgba(243,146,0,0.35)]"
            />
            <span
              aria-hidden="true"
              className="prod-float-blob absolute left-0 bottom-[10px] size-[220px] rounded-full bg-[radial-gradient(circle,#FFE4BF_0%,rgba(255,228,191,0)_70%)]"
            />

            <div className="relative aspect-[4/5] rounded-[20px_80px_20px_20px] sm:rounded-[28px_120px_28px_28px] overflow-hidden shadow-[0_30px_60px_-28px_rgba(60,35,10,0.35)]">
              <Image
                src="/assets/images/home/service-consultation.jpg"
                alt="Sesi konsultasi brand bersama tim Dreamlab maklon kosmetik"
                fill
                loading="lazy"
                sizes="(max-width:1024px) 92vw, 520px"
                className="object-cover"
              />
            </div>

            <div className="absolute left-0 bottom-0 w-[44%] aspect-[1/1.05] rounded-[18px] sm:rounded-[24px] overflow-hidden border-[5px] sm:border-[8px] border-white shadow-[0_20px_44px_-18px_rgba(60,35,10,0.35)] bg-white">
              <Image
                src="/new asset/people/Busdev-dreamlab.png"
                alt="Tim Business Development Dreamlab"
                fill
                loading="lazy"
                sizes="(max-width:1024px) 45vw, 260px"
                className="object-cover object-[center_35%]"
              />
              <span className="absolute left-[8px] bottom-[8px] text-[10.5px] font-semibold bg-[rgba(255,255,255,0.92)] rounded-full px-[10px] py-[4px] text-[#C86400]">
                Tim BD Dreamlab
              </span>
            </div>

            {/* Rotating badge */}
            <div
              aria-label="1000+ brand sukses"
              className="absolute left-0 top-0 sm:left-[4px] sm:top-[8px] size-[118px] sm:size-[168px] rounded-full bg-[#F39200] shadow-[0_18px_40px_-14px_rgba(243,146,0,0.75)] grid place-items-center z-20"
            >
              <svg viewBox="0 0 168 168" aria-hidden="true" className="prod-spin-slow absolute inset-0 w-full h-full">
                <defs>
                  <path id="prod-badge-circ" d="M84,84 m-66,0 a66,66 0 1,1 132,0 a66,66 0 1,1 -132,0" />
                </defs>
                <text className="fill-white font-semibold uppercase text-[11px] sm:text-[11.5px] tracking-[0.24em] sm:tracking-[0.32em]">
                  <textPath href="#prod-badge-circ">Brand Sukses • Maklon Dreamlab • </textPath>
                </text>
              </svg>
              <b className="font-display font-normal text-[27px] sm:text-[38px] text-white leading-none text-center">
                1000+
                <small className="block font-sans font-semibold text-[8px] sm:text-[9.5px] tracking-[0.16em] mt-[4px]">
                  BRAND
                </small>
              </b>
            </div>
          </div>

          {/* Right text */}
          <div>
            <span className="inline-flex items-center gap-[8px] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C86400] bg-[#FFF3E2] rounded-full px-[14px] py-[8px]">
              <i aria-hidden="true" className="size-[6px] rounded-full bg-[#F39200]" />
              One-Stop Maklon Service
            </span>

            <h2 className="mt-[18px] font-display font-normal text-[clamp(28px,3.2vw,40px)] leading-[1.12] tracking-[-0.01em] text-[#212120]">
              Wujudkan Brand Kosmetik <span className="text-[#F39200]">Juaranya</span> Formula
            </h2>

            <p className="mt-[18px] text-[15.5px] sm:text-[17px] leading-[1.7] text-[#6B6762]">
              Dreamlab adalah perusahaan maklon kosmetik di Surabaya yang mendampingi brand Anda dari konsep sampai siap jual, didukung sertifikasi{" "}
              <strong className="font-semibold text-[#212120]">CPKB Grade A, BPOM, dan Halal</strong>.
            </p>

            <ul className="mt-[32px] pb-[32px] border-b border-[rgba(33,33,32,0.10)] grid grid-cols-1 sm:grid-cols-2 gap-[16px] sm:gap-x-[32px] sm:gap-y-[24px]">
              {dreamlabFeatures.map((feat) => (
                <li key={feat.title} className="grid grid-cols-[28px_1fr] gap-x-[12px]">
                  <span
                    aria-hidden="true"
                    className="row-span-2 size-[28px] rounded-full bg-[#FFF3E2] flex items-center justify-center shrink-0"
                  >
                    <svg className="size-[13px]" viewBox="0 0 24 24" fill="none" stroke="#C86400" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                  <b className="font-display font-normal text-[16px] text-[#212120]">
                    {feat.title}
                  </b>
                  <span className="mt-[4px] text-[13.5px] leading-[1.55] text-[#6B6762]">
                    {feat.desc}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href={ctaHref}
              rel="nofollow"
              className="prod-focus prod-btn-p mt-[28px] inline-block w-full sm:w-auto text-center rounded-full bg-[#F39200] text-[#212120] text-[15px] font-semibold px-[28px] py-[16px] shadow-[0_10px_24px_-10px_rgba(243,146,0,0.7)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_14px_28px_-10px_rgba(243,146,0,0.8)]"
            >
              Konsultasi Sekarang →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DreamlabDocumentationSection({
  showLogos = true,
}: {
  showLogos?: boolean;
}) {
  return (
    <section className="bg-[#F7F5F2] py-[64px] sm:py-[104px] overflow-hidden">
      <style>{showcaseStyles}</style>
      <div className="mx-auto max-w-[1240px] px-[16px] sm:px-[40px]">
        <div className="text-center max-w-[680px] mx-auto mb-[32px] sm:mb-[48px]">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C86400] mb-[12px]">
            Dokumentasi Dreamlab
          </span>
          <h2 className="font-display font-normal text-[clamp(28px,3.2vw,40px)] leading-[1.12] tracking-[-0.01em] text-[#212120]">
            Brand Mereka Dimulai dari Sini
          </h2>
          <p className="mt-[14px] text-[15px] sm:text-[16px] leading-[1.6] text-[#6B6762]">
            Dari meja konsultasi, laboratorium R&amp;D, sampai lini produksi. Begini perjalanan brand klien bersama Dreamlab.
          </p>
        </div>
      </div>

      {/* Full-width photo marquee */}
      <div className="prod-mq-mask relative">
        <div className="prod-mq-track">
          {[0, 1].map((dupIdx) =>
            docPhotos.map((doc) => (
              <figure
                key={`${dupIdx}-${doc.src}`}
                aria-hidden={dupIdx === 1 ? "true" : undefined}
                className="prod-doc-card relative w-[220px] sm:w-[300px] aspect-[4/5] rounded-[20px] overflow-hidden shrink-0 shadow-[0_6px_18px_-10px_rgba(60,35,10,0.18)]"
              >
                <Image
                  src={doc.src}
                  alt={`${doc.line} – dokumentasi Dreamlab maklon kosmetik`}
                  fill
                  loading="lazy"
                  sizes="(max-width:640px) 220px, 300px"
                  className="prod-doc-img object-cover"
                />
                <figcaption className="absolute left-[12px] right-[12px] bottom-[12px] rounded-[14px] bg-[rgba(255,255,255,0.95)] supports-[backdrop-filter]:bg-[rgba(255,255,255,0.9)] backdrop-blur-[12px] px-[14px] py-[12px]">
                  <small className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C86400]">
                    {doc.label}
                  </small>
                  <b className="block text-[14px] font-semibold text-[#212120] mt-[2px]">
                    {doc.line}
                  </b>
                </figcaption>
              </figure>
            ))
          )}
        </div>
      </div>

      {showLogos && (
        <div className="mx-auto max-w-[1240px] px-[16px] sm:px-[40px]">
          <p className="text-center mt-[56px] mb-[20px] text-[12px] text-[#9A958F] tracking-[0.04em]">
            Sebagian brand yang diproduksi di Dreamlab
          </p>
          <div className="prod-mq-mask relative">
            <div className="prod-logo-track pt-[6px] pb-[10px]">
              {[0, 1].map((dupIdx) =>
                clientLogos.map((logo) => (
                  <Image
                    key={`${dupIdx}-${logo}`}
                    src={`/assets/images/${logo}-300x300.webp`}
                    alt={dupIdx === 1 ? "" : "Logo brand klien Dreamlab"}
                    aria-hidden={dupIdx === 1 ? "true" : undefined}
                    width={120}
                    height={120}
                    loading="lazy"
                    sizes="(max-width:640px) 88px, 120px"
                    className="prod-logo-img w-[88px] h-[88px] sm:w-[120px] sm:h-[120px] shrink-0 object-contain bg-white rounded-[12px] sm:rounded-[16px] p-[6px] sm:p-[10px] grayscale opacity-75 shadow-[0_2px_8px_-4px_rgba(60,35,10,0.12)]"
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

