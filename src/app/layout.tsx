import { Viga, Onest } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AttributionForwarder from "@/components/AttributionForwarder";
import { TrackingScripts, GTMNoScript } from "@/components/TrackingScripts";
import { PixelsOnInteraction } from "@/components/PixelsOnInteraction";
import OrganizationSchema from "@/components/OrganizationSchema";
import SpeculationRules from "@/components/SpeculationRules";
import ClientLangSync from "@/components/ClientLangSync";

const viga = Viga({
  subsets: ["latin"],
  variable: "--font-viga",
  weight: ["400"],
});

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dreamlab.id'),
  title: "Dreamlab | Maklon Kosmetik & Parfum BPOM Terbaik Indonesia",
  description: "One-Stop Maklon Kosmetik Bersertifikat BPOM, CPKB Grade A & Halal MUI di Surabaya. 500+ Brand Sudah Mempercayakan Formulasi & Produksinya pada Kami.",
  verification: {
    google: "xbEDjXMgxa8PqdCWCHtZ9-7xbPIgRcxc2azHdOLUBCE",
  },
    icons: {
      icon: [{ url: "/assets/images/cropped-Logo-dreamlab-maklon-kosmetik-1.webp", sizes: "256x256", type: "image/webp" }],
      apple: "/assets/images/cropped-Logo-dreamlab-maklon-kosmetik-1.webp",
    },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'Dreamlab',
  title: "Dreamlab | Maklon Kosmetik & Parfum BPOM Terbaik Indonesia",
    description: "One-Stop Maklon Kosmetik Bersertifikat BPOM, CPKB Grade A & Halal MUI di Surabaya. 500+ Brand Sudah Mempercayakan Formulasi & Produksinya pada Kami.",
    url: 'https://dreamlab.id/',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Layout harus tetap static (tanpa headers()/cookies()) supaya seluruh halaman
  // (termasuk /news-blog & artikel) bisa di-cache di edge (ISR) — bukan render
  // serverless fresh tiap request. Bahasa /en/* di-sync client-side oleh
  // ClientLangSync supaya <html lang> tetap benar setelah hydrate.

  return (
    <html lang="id" className={`${viga.variable} ${onest.variable}`}>
      <body className="font-sans antialiased text-brand-black selection:bg-brand-orange selection:text-white">
        <ClientLangSync />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <SpeculationRules />
        <OrganizationSchema />
        <TrackingScripts />
        <PixelsOnInteraction />
        <AttributionForwarder />

        <div id="page" className="site">
          <Header />
          <div id="content" className="site-content">
            <main id="primary" className="content-area">
              <div id="main" className="site-main">
                {children}
              </div>
            </main>
          </div>
          <Footer />
          <WhatsAppButton />
          <GTMNoScript />
        </div>
      </body>
    </html>
  );
}
