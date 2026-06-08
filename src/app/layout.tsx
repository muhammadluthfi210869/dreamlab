import { Viga, Onest, Poppins, Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import OrganizationSchema from "@/components/OrganizationSchema";
import SpeculationRules from "@/components/SpeculationRules";

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

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dreamlab.id'),
  title: "Dreamlab | Maklon Kosmetik & Parfum BPOM Terbaik Indonesia",
  description: "One-Stop Maklon Kosmetik Bersertifikat BPOM, CPKB Grade A & Halal MUI di Surabaya. 500+ Brand Sudah Mempercayakan Formulasi & Produksinya pada Kami.",
    icons: {
      icon: "/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik-.webp",
      apple: "/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik-.webp",
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
  return (
    <html lang="id" className={`${viga.variable} ${onest.variable} ${poppins.variable} ${inter.variable}`}>
      <body className="font-sans antialiased text-brand-black selection:bg-brand-orange selection:text-white">
        <link rel="preconnect" href="https://dreamlab.id" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://dreamlab.id" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preload" href="/new%20asset/background-visual-hero-section/home-page.webp" as="image" fetchPriority="high" />
        <SpeculationRules />
        <OrganizationSchema />
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
        </div>
      </body>
    </html>
  );
}
