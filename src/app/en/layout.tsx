import type { Metadata } from "next";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Dreamlab",
  url: "https://dreamlab.id/en/",
  description:
    "Private label & OEM/ODM cosmetic contract manufacturer in Indonesia: skincare, body care, hair care, perfume, decorative & baby care with BPOM, CPKB & Halal certification.",
  areaServed: "Worldwide",
  sameAs: ["https://www.instagram.com/dreamlab_official"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Dreamlab",
  url: "https://dreamlab.id/en/",
  inLanguage: "en",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://dreamlab.id/en"),
  title: {
    default: "Private Label Cosmetic & Skincare Manufacturer Indonesia",
    template: "%s | Dreamlab",
  },
  description:
    "Dreamlab is a certified private label cosmetic manufacturer in Indonesia. OEM/ODM skincare, body care, hair care, perfume, decorative & baby care contract manufacturing with BPOM, CPKB & Halal certification.",
  alternates: {
    languages: {
      "id-ID": "https://dreamlab.id/",
      "en-US": "https://dreamlab.id/en/",
      "x-default": "https://dreamlab.id/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Dreamlab",
    title: "Private Label Cosmetic & Skincare Manufacturer Indonesia | Dreamlab",
    description:
      "Certified cosmetic contract manufacturing in Indonesia: private label & OEM/ODM skincare, body care, hair care, perfume, decorative & baby care with BPOM, CPKB & Halal certification.",
    url: "https://dreamlab.id/en/",
  },
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* JSON-LD English (Organization + WebSite) untuk semua halaman /en/ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {children}
    </>
  );
}
