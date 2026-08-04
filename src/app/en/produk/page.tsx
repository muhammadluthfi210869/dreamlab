import type { Metadata } from "next";
import { buildAlternates } from "@/lib/seo-lang";

export const metadata: Metadata = {
  title: "Products | Cosmetic & Skincare Manufacturing Catalog",
  description:
    "Explore Dreamlab's cosmetic manufacturing catalog: skincare, body care, hair care, decorative, baby care, perfume & foot care. Custom private label production.",
  alternates: buildAlternates("/en/produk/"),
  openGraph: {
    title: "Products | Cosmetic & Skincare Manufacturing Catalog",
    description:
      "Private label cosmetic production: skincare, body care, hair care, baby care, perfume & more with BPOM & Halal certification.",
    url: "https://dreamlab.id/en/produk/",
    siteName: "Dreamlab",
    locale: "en_US",
    type: "website",
  },
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
};

const categories = [
  { name: "Skincare", emoji: "🧴", products: "Facial wash, serum, sunscreen, toner, cream, mask" },
  { name: "Body Care", emoji: "🧼", products: "Body wash, scrub, butter, soap, massage products" },
  { name: "Hair Care", emoji: "💆", products: "Shampoo, conditioner, mask, scalp care" },
  { name: "Decorative", emoji: "💄", products: "Foundation, BB cream, blush, mascara" },
  { name: "Baby Care", emoji: "👶", products: "Baby wash, shampoo, lotion, powder, cologne" },
  { name: "Perfume", emoji: "🌸", products: "EDP, EDT, EDC, body mist, essential oil" },
  { name: "Foot Care", emoji: "🦶", products: "Foot cream & specialized foot care" },
  { name: "PKRT", emoji: "🧼", products: "Hand wash, hand sanitizer, soap" },
];

export default function EnProdukPage() {
  return (
    <main className="min-h-screen bg-brand-white pt-28 md:pt-36">
      <section className="px-6 lg:px-8 py-12 md:py-16 text-center max-w-4xl mx-auto">
        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">Our Products</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-[#1f1f1d]">
          Private Label Cosmetic Manufacturing
        </h1>
        <p className="mt-5 text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
          Develop your own branded products across 8 categories — formulated, produced, and certified
          under your brand name.
        </p>
      </section>

      <section className="px-6 lg:px-8 pb-12 max-w-6xl mx-auto">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <div
              key={c.name}
              className="rounded-[24px] border border-[#eadfcf] bg-white p-6 text-center transition hover:shadow-lg"
            >
              <span className="text-4xl">{c.emoji}</span>
              <h2 className="mt-3 text-base font-black text-[#1f1f1d]">{c.name}</h2>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{c.products}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 lg:px-8 pb-16">
        <div className="mx-auto max-w-5xl rounded-[32px] bg-brand-orange p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Need a Custom Product Formulation?
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-sm md:text-base text-white/90">
            Tell us your product idea and our R&amp;D pharmacists will formulate an exclusive formula
            tailored to your brand.
          </p>
          <div className="mt-6">
            <a
              href="https://api.whatsapp.com/send/?phone=6287712232389&text=Hi%20Dreamlab%2C%20I%20want%20a%20custom%20product%20formulation"
              className="inline-flex items-center rounded-full bg-white px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-[#b06f00] shadow-lg hover:bg-black hover:text-white"
            >
              Request Custom Formula
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
