"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { 
  BadgeCheck, 
  Palette, 
  MessageSquare, 
  Headset, 
  Globe, 
  FlaskConical,
  LucideIcon
} from "lucide-react";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";

interface MarqueeItem {
  text: string;
  icon: string;
}

interface AlurHeroProps {
  title: string;
  description: string;
  image: string;
  marquee: MarqueeItem[];
}

const iconMap: Record<string, LucideIcon> = {
  shield: BadgeCheck,
  palette: Palette,
  message: MessageSquare,
  headset: Headset,
  globe: Globe,
  beaker: FlaskConical,
  "message-square": MessageSquare,
  "flask-conical": FlaskConical,
};

export default function AlurHero({ title, description, image, marquee }: AlurHeroProps) {
  // Triple the marquee items for smooth infinite loop
  const duplicatedMarquee = [...marquee, ...marquee, ...marquee];

  return (
    <section className="relative w-full overflow-hidden pt-28 md:pt-32">
      {/* Background Image Container */}
      <div className="relative w-full h-[450px] md:h-[550px] lg:h-[650px] flex items-center">
        <Image
          src={image}
          alt="Hero Background"
          title={getImageTitle(image)}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Subtle overlay to improve text readability if needed */}
        <div className="absolute inset-0 bg-white/10" />

        <div className="relative z-10 w-full h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 xl:px-32">
          <div className="max-w-[800px] space-y-8">
            {/* Title - Orange, Uppercase */}
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-[38px] md:text-[52px] lg:text-[80px] text-brand-orange font-normal leading-[1.05] tracking-tight uppercase"
            >
              {title.toLowerCase().includes("maklon") ? (
                <>
                  {title.substring(0, title.toLowerCase().indexOf("maklon"))}
                  <br className="hidden md:block" />
                  {title.substring(title.toLowerCase().indexOf("maklon"))}
                </>
              ) : (
                <span>{title}</span>
              )}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-brand-black text-[15px] md:text-[16px] font-text leading-relaxed max-w-2xl font-normal opacity-80"
            >
              {description}
            </motion.p>
          </div>
        </div>

        {/* Orange Marquee Pinned to Bottom */}
        <div className="absolute bottom-0 left-0 w-full bg-brand-orange h-14 md:h-16 flex items-center overflow-hidden z-20">
          <motion.div
            animate={{
              x: ["0%", "-33.33%"],
            }}
            transition={{
              ease: "linear",
              duration: 25,
              repeat: Infinity,
            }}
            className="flex whitespace-nowrap items-center"
          >
            {duplicatedMarquee.map((item, idx) => {
              const Icon = iconMap[item.icon] || BadgeCheck;
              return (
                <div key={idx} className="flex items-center gap-3 px-10 text-white font-bold text-[11px] md:text-[13px] uppercase tracking-widest">
                  <Icon className="w-4 h-4 md:w-5 h-5" />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
