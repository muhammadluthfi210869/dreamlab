import { Viga, Onest, Poppins, Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { TrackingScripts, GTMNoScript } from "@/components/TrackingScripts";
import OrganizationSchema from "@/components/OrganizationSchema";
import SpeculationRules from "@/components/SpeculationRules";
import Script from "next/script";

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
      icon: [{ url: "/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik-.webp", sizes: "256x256", type: "image/webp" }],
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
        <TrackingScripts />
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

          {/* TikTok Pixel — server-rendered for Tag Explorer detection */}
          <Script id="tiktok-pixel" strategy="afterInteractive">
            {`!function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
              ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
              for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
              ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
              ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
              ttq.load('D0A8CHRC77UD5RFHJ6E0');
              ttq.page();
            }(window, document, 'ttq');`}
          </Script>
        </div>
      </body>
    </html>
  );
}
