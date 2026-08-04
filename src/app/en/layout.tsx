import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://dreamlab.id/en"),
  title: {
    default: "Dreamlab | Cosmetic & Skincare Manufacturing (Maklon) - Build Your Brand",
    template: "%s | Dreamlab",
  },
  description:
    "Dreamlab is a certified cosmetic contract manufacturer (maklon) in Indonesia: skincare, body care, hair care, perfume, decorative & baby care with BPOM, CPKB & Halal certification.",
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
    title: "Dreamlab | Cosmetic & Skincare Manufacturing (Maklon) - Build Your Brand",
    description:
      "Dreamlab is a certified cosmetic contract manufacturer in Indonesia: skincare, body care, hair care, perfume, decorative & baby care.",
    url: "https://dreamlab.id/en/",
  },
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
