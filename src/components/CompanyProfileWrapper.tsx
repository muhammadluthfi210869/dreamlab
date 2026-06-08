"use client";

import { aboutData } from "@/data/about-us";
import AboutPageHero from "./AboutPageHero";
import AuthoritySection from "./AuthoritySection";
import AfterSalesSection from "./AfterSalesSection";
import AlurMaklonTimeline from "./AlurMaklonTimeline";
import LogoScroll from "./LogoScroll";
import CtaSection from "./CtaSection";

export default function CompanyProfileWrapper() {
  const { hero, authority, afterSales, partnerLogos } = aboutData;

  return (
    <div className="w-full relative overflow-hidden bg-[#FAF9F6] text-[#1C1C1C] font-sans antialiased">

      {/* SECTION 1: HERO (BeauTen Style) */}
      <AboutPageHero data={hero} />

      {/* SECTION 2: AUTHORITY & CERTIFICATION (IT Solutions Style) */}
      <AuthoritySection data={authority} />

      {/* SECTION 3: AFTER-SALES COMMITMENT (Mirrored IT Solutions Style) */}
      <AfterSalesSection data={afterSales} />

      {/* SECTION 4: ALUR MAKLON TIMELINE (8 Steps) */}
      <AlurMaklonTimeline />

      {/* SECTION 5: LOGO SCROLL */}
      <LogoScroll logos={partnerLogos} />

      {/* SECTION 6: FINAL CTA */}
      <CtaSection />

    </div>
  );
}
