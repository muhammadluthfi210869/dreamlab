import Link from 'next/link';

export const metadata = {
  title: "404 - Page Not Found | Dreamlab Maklon Kosmetik",
  description: "Halaman yang Anda cari tidak ditemukan. Kembali ke beranda Dreamlab untuk informasi jasa maklon kosmetik BPOM & Halal.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-brand-white flex items-center justify-center">
      <div className="container-custom py-32 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-[200px] md:text-[280px] font-black text-brand-black leading-none tracking-tighter">
            404
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mt-8 mb-4">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-lg text-gray-500 mb-12 max-w-lg mx-auto">
            Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia. 
            Silakan kembali ke beranda untuk melanjutkan.
          </p>
          <Link
            href="/"
            className="inline-block bg-brand hover:bg-brand-light text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
