"use client";

import { LucideIcon } from "lucide-react";
import Image from "next/image";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";
import { useInView } from "@/lib/use-in-view";

interface InfoBoxProps {
  title: string;
  description: string;
  icon: LucideIcon | string;
  index: number;
}

export default function InfoBox({ title, description, icon: Icon, index }: InfoBoxProps) {
  const isSvg = typeof Icon === 'string';
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`group bg-white p-10 rounded-3xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="w-16 h-16 bg-brand-orange/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-orange transition-colors duration-500 overflow-hidden p-3">
        {isSvg ? (
          <div className="relative w-full h-full group-hover:invert group-hover:brightness-0 transition-all duration-500">
            <Image src={`/assets/images/${Icon}`} alt={getImageAlt(`/assets/images/${Icon}`, title)} title={getImageTitle(`/assets/images/${Icon}`)} fill className="object-contain" sizes="(max-width: 768px) 100vw, 64px" />
          </div>
        ) : (
          <Icon className="w-8 h-8 text-brand-orange group-hover:text-white transition-colors duration-500" />
        )}
      </div>
      <h3 className="text-xl font-extrabold text-brand-black mb-4 group-hover:text-brand-orange transition-colors duration-500">
        {title}
      </h3>
      <p className="text-gray-500 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}
