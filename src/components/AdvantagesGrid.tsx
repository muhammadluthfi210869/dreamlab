"use client";

import { useInView } from "@/lib/use-in-view";
import { 
  Sparkles, 
  FlaskConical, 
  Lightbulb, 
  Sliders, 
  Coins, 
  Palette, 
  Target, 
  TrendingUp 
} from "lucide-react";

interface AdvantagesProps {
  title: string;
  items?: { title: string; desc: string; icon: string }[];
  hideCertification?: boolean;
}

const bentoPoints = [
  {
    index: "01",
    title: "Formula Eksklusif",
    desc: "1 klien 1 formula. Wujudkan formula impian dan jadilah berbeda.",
    icon: Sparkles
  },
  {
    index: "02",
    title: "Formulasi Produk",
    desc: "Tim R&D Muda yang sangat inovatif.",
    icon: FlaskConical
  },
  {
    index: "03",
    title: "Inovatif",
    desc: "Formulasi produk RnD muda yang sangat inovatif.",
    icon: Lightbulb
  },
  {
    index: "04",
    title: "MOQ Menyesuaikan",
    desc: "Menyesuaikan MOQ sesuai kebutuhan klien.",
    icon: Sliders
  },
  {
    index: "05",
    title: "Harga",
    desc: "Harga HPP yang bisa menyesuaikan.",
    icon: Coins
  },
  {
    index: "06",
    title: "Kreatif",
    desc: "Team design creative yang siap memvisualisasikan brand anda.",
    icon: Palette
  },
  {
    index: "07",
    title: "Branding",
    desc: "Membangun identitas yang kuat sehingga brand mudah dikenali dalam proses pemasaran.",
    icon: Target
  },
  {
    index: "08",
    title: "Digital Marketing",
    desc: "Tim digital marketing siap menjangkau target audience brand jauh lebih efektif dan efisien.",
    icon: TrendingUp
  }
];

// Elite Custom Easing Curve (Apple / Tom Ford Premium Ease-Out)
const premiumEase = [0.16, 1, 0.3, 1] as any;

interface AdvantageCardProps {
  point: typeof bentoPoints[0];
  idx: number;
}

function AdvantageCard({ point, idx }: AdvantageCardProps) {
  const { ref, isInView } = useInView();
  const IconComponent = point.icon;

  return (
    <div
      ref={ref as any}
      className={`bg-white p-6 md:p-7 flex flex-col justify-start min-h-[175px] md:min-h-[195px] transition-all duration-700 hover:bg-[#FAF9F5]/40 group cursor-pointer ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${idx * 60}ms` }}
    >
      {/* Card Header: Elegant thin number & premium icon */}
      <div className="flex justify-between items-center mb-6">
        <span className="font-display text-2xl md:text-3xl font-light text-brand-orange/30 leading-none">
          {point.index}
        </span>
        <div className="size-10 rounded-full bg-brand-orange/5 border border-brand-orange/15 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 shadow-sm">
          <IconComponent className="size-5 stroke-[1.5]" />
        </div>
      </div>

      {/* Text Content - Perfectly aligned to start from the top! */}
      <div className="flex flex-col">
        <h3 className="font-display text-[14px] md:text-[15px] font-bold tracking-tight text-brand-black mb-1.5 uppercase group-hover:text-brand-orange transition-colors">
          {point.title}
        </h3>
        <p className="font-sans text-[12px] md:text-[13px] text-gray-600 leading-relaxed font-medium">
          {point.desc}
        </p>
      </div>
    </div>
  );
}

function HeaderSection() {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref as any}
      className={`max-w-3xl mx-auto text-center mb-10 md:mb-12 transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <span className="text-[9px] font-bold tracking-[0.3em] text-brand-orange uppercase bg-brand-orange/5 px-4 py-1.2 rounded-full inline-block mb-3 border border-brand-orange/10">
        Dreamlab Advantages
      </span>
      <h2 className="text-3xl md:text-4xl lg:text-[42px] font-normal font-display tracking-tight text-brand-black mb-3 uppercase">
        8 Keuntungan <span className="text-brand-orange font-bold">Maklon di Dreamlab</span>
      </h2>
      <div className="h-[1.5px] w-12 bg-brand-orange/40 mx-auto mb-3" />
      <p className="text-gray-500 font-sans text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
        Komitmen Dreamlab untuk menghadirkan solusi manufaktur kosmetik hulu ke hilir yang komprehensif, eksklusif, dan berkualitas dunia.
      </p>
    </div>
  );
}

export default function AdvantagesGrid({ title }: AdvantagesProps) {
  return (
    <section className="py-14 md:py-16 lg:py-20 bg-[#FAF9F5] relative overflow-hidden flex items-center min-h-[85vh]">
      {/* Subtle luxury brand glowing ambiance */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-brand-orange/[0.02] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/[0.01] rounded-full blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10 w-full">
        
        {/* Centered Header Section */}
        <HeaderSection />

        {/* Seamless Luxury 4x2 Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-gray-200/60 rounded-[2rem] overflow-hidden border border-gray-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.015)]">
          {bentoPoints.map((point, idx) => (
            <AdvantageCard
              key={point.index}
              point={point}
              idx={idx}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
