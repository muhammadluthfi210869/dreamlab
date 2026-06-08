"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";

interface BreadcrumbItem {
  label: string;
  link: string;
}

interface AboutHeroProps {
  title: string;
  description?: string;
  backgroundImage: string;
  breadcrumb?: BreadcrumbItem[];
}

export default function AboutHero({ title, description, backgroundImage, breadcrumb }: AboutHeroProps) {
  return (
    <section className="relative w-full min-h-[400px] md:min-h-[450px] lg:min-h-[500px] flex items-center overflow-hidden bg-[#F1E9DA] pt-28 md:pt-32">
      {/* Background Image - Full width per reference */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt={getImageAlt(backgroundImage, title)}
          title={getImageTitle(backgroundImage)}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>

      <div className="relative z-10 py-16 md:py-24 px-6 md:px-16 lg:px-24 xl:px-32 w-full">
        <div className="max-w-[700px]">
          {/* Main Heading - Orange, All Caps */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[38px] md:text-[52px] lg:text-[80px] text-[#F7941D] font-normal leading-[1.05] tracking-tight uppercase"
          >
            {title.includes('MAKLON') ? (
              title.split('MAKLON').map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && <><br className="hidden md:block" />MAKLON</>}
                </span>
              ))
            ) : (
              <span className="block">{title}</span>
            )}
          </motion.h1>

          {/* Description - Normal case, smaller size */}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[#333333] text-[15px] md:text-[17px] font-text leading-[1.6] max-w-2xl"
            >
              {description.split('BPOM, Halal MUI, dan CPKB.').map((text, i, arr) => (
                <span key={i}>
                  {text}
                  {i < arr.length - 1 && <span className="font-bold">BPOM, Halal MUI, dan CPKB.</span>}
                </span>
              ))}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}
