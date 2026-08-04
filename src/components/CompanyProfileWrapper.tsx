"use client";

import type { ComponentProps, ReactNode } from "react";
import { aboutData } from "@/data/about-us";
import AboutPageHero from "./AboutPageHero";
import AuthoritySection from "./AuthoritySection";
import AfterSalesSection from "./AfterSalesSection";
import AlurMaklonTimeline from "./AlurMaklonTimeline";
import LogoScroll from "./LogoScroll";
import CtaSection from "./CtaSection";
import type { AboutData } from "@/data/about-us";

interface CompanyProfileWrapperProps {
  data?: AboutData;
  cta?: {
    title?: ReactNode;
    buttonText?: string;
  };
  content?: {
    authority?: ComponentProps<typeof AuthoritySection>["content"];
    afterSales?: ComponentProps<typeof AfterSalesSection>["content"];
    timeline?: ComponentProps<typeof AlurMaklonTimeline>["content"];
  };
}

export default function CompanyProfileWrapper({ data = aboutData, cta, content }: CompanyProfileWrapperProps) {
  const { hero, authority, afterSales, partnerLogos } = data;

  return (
    <div className="w-full relative overflow-hidden bg-[#FAF9F6] text-[#1C1C1C] font-sans antialiased">

      {/* SECTION 1: HERO (BeauTen Style) */}
      <AboutPageHero data={hero} />

      {/* SECTION 2: AUTHORITY & CERTIFICATION (IT Solutions Style) */}
      <AuthoritySection data={authority} content={content?.authority} />

      {/* SECTION 3: AFTER-SALES COMMITMENT (Mirrored IT Solutions Style) */}
      <AfterSalesSection data={afterSales} content={content?.afterSales} />

      {/* SECTION 4: ALUR MAKLON TIMELINE (8 Steps) */}
      <AlurMaklonTimeline content={content?.timeline} />

      {/* SECTION 5: LOGO SCROLL */}
      <LogoScroll logos={partnerLogos} />

      {/* SECTION 6: FINAL CTA */}
      <CtaSection title={cta?.title} buttonText={cta?.buttonText} />

    </div>
  );
}
