import type { Metadata } from "next";

// Semua halaman /ads/ (landing & thankyou ads) TIDAK boleh di-index.
// Ini sekaligus memperbaiki "Duplikat tanpa kanonis" di GSC.
export const metadata: Metadata = {
  robots: "noindex, follow",
};

export default function AdsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
