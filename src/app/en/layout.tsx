import type { Metadata } from "next";

// WebSite schema English (Organization di-handle oleh OrganizationSchema bilingual di root layout)
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
    // Default fallback — terjemahan setia dari title root Indonesia.
    default: "Dreamlab | Best BPOM Cosmetic & Parfum Manufacturer Indonesia",
    template: "%s | Dreamlab",
  },
  description:
    "One-Stop Cosmetic Manufacturing (Maklon) Certified BPOM, CPKB Grade A & Halal MUI in Surabaya. 500+ brands have trusted their formulation & production with us.",
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
    title: "Dreamlab | Best BPOM Cosmetic & Parfum Manufacturer Indonesia",
    description:
      "One-Stop Cosmetic Manufacturing (Maklon) Certified BPOM, CPKB Grade A & Halal MUI in Surabaya.",
    url: "https://dreamlab.id/en/",
  },
  // NOTE: `robots` dihapus — lihat komentar di src/app/layout.tsx.
  // Mencegah konflik tag robots ganda (layout + page) yang membuat
  // halaman catch-all /en/... efektif noindex.
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {children}
    </>
  );
}
