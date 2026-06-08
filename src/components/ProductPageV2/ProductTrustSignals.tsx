"use client";

import { TrustStatV2, TrustCategoryItem } from "@/types/product-v2";

interface ProductTrustSignalsProps {
  stats: TrustStatV2[];
  categorySpecific: TrustCategoryItem[];
}

const badgeIconMap: Record<string, React.ReactNode> = {
  legalitas: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  pabrik: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  sukses: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
};

export default function ProductTrustSignals({ stats, categorySpecific }: ProductTrustSignalsProps) {
  // Hardcoded contextual badges as per the new plan for maximum trust impact
  const badges = [
    {
      id: "legalitas",
      title: "Legalitas Kami Jamin",
      description: "Produkmu otomatis terdaftar BPOM, Halal, dan HKI. Kami nggak main-main soal keamanan hukum brand kamu.",
      icon: "legalitas",
      certs: ["BPOM", "Halal", "HKI"]
    },
    {
      id: "pabrik",
      title: "Pabrik Standar Tertinggi",
      description: "Satu dari sedikit pabrik maklon yang punya sertifikasi CPKB Grade A. Standar kebersihan selevel internasional.",
      icon: "pabrik",
      certs: ["CPKB Grade A", "ISO 9001"]
    },
    {
      id: "sukses",
      title: "Sudah Teruji di Pasar",
      description: "Bukan cuma produksi, kami sudah bantu 120+ brand parfum lokal buat tembus pasar dan repeat order.",
      icon: "sukses",
      certs: ["120+ Brands", "97% Re-order"]
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        {/* Horizontal Scroll on Mobile, 3 Columns on Desktop */}
        <div className="flex overflow-x-auto pb-8 md:pb-0 md:grid md:grid-cols-3 gap-6 md:gap-10 snap-x snap-mandatory scrollbar-hide">
          {badges.map((badge) => (
            <div 
              key={badge.id}
              className="flex-shrink-0 w-[85%] md:w-full snap-center group p-8 rounded-3xl bg-brand-light-blue/30 border border-brand-light-blue hover:border-brand-orange/30 hover:bg-white hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-20 h-20 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange mb-8 group-hover:scale-110 transition-transform duration-500">
                {badgeIconMap[badge.icon]}
              </div>
              
              <h3 className="font-viga text-2xl text-brand-black mb-4">
                {badge.title}
              </h3>
              
              <p className="text-brand-gray leading-relaxed mb-8">
                {badge.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {badge.certs.map((cert) => (
                  <span 
                    key={cert}
                    className="text-[10px] font-bold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full uppercase tracking-widest"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}