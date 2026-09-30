import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pabrik Maklon Parfum Custom Formula & BPOM Terbaik | Dreamlab",
  description: "Wujudkan brand parfum eksklusif milik Anda bersama Dreamlab. 1 Client 1 Custom Formula, R&D Perfumery, MOQ fleksibel, FREE pengurusan BPOM & desain kemasan.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function MaklonParfumAdsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
