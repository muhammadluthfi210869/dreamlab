import type { Metadata } from "next";

// Halaman khusus funnel Google Ads Promo Kemerdekaan — tidak boleh di-index.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://dreamlab.id/promo-kemerdekaan/thankyou-googleads/",
  },
};

export default function ThankYouPromoGoogleAdsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}