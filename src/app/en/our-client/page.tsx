import type { Metadata } from "next";
import { buildAlternates } from "@/lib/seo-lang";

export const metadata: Metadata = {
  title: "500+ Brands Trust Our Cosmetic Contract Manufacturing",
  description:
    "Discover the cosmetics & skincare brands that manufacture with Dreamlab. 500+ brands trust our certified private label & OEM/ODM production for their products.",
  alternates: buildAlternates("/en/our-client/"),
  openGraph: {
    title: "500+ Brands Trust Our Cosmetic Contract Manufacturing | Dreamlab",
    description:
      "See the cosmetic & skincare brands already manufacturing with Dreamlab — and become our next partner.",
    url: "https://dreamlab.id/en/our-client/",
    siteName: "Dreamlab",
    locale: "en_US",
    type: "website",
  },
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
};

const partners = [
  "Jilly Daily",
  "Tazzi",
  "Sense Soul",
  "Labbol",
  "Bebiboster",
  "Chloe Green",
  "Itnob",
];

export default function EnOurClientPage() {
  return (
    <main className="min-h-screen bg-brand-white pt-28 md:pt-36">
      <section className="px-6 lg:px-8 py-12 md:py-16 text-center max-w-4xl mx-auto">
        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">Trusted by Global Cosmetic Brands</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-[#1f1f1d]">
          500+ Brands Trust Our Cosmetic Manufacturing
        </h1>
        <p className="mt-5 text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
          From emerging startups to established names, beauty brands across Indonesia choose Dreamlab
          as their primary contract manufacturing (OEM/ODM) partner.
        </p>
      </section>

      <section className="px-6 lg:px-8 pb-12 max-w-5xl mx-auto">
        <div className="rounded-[32px] border border-[#eadfcf] bg-white p-8 md:p-12">
          <h2 className="text-center text-2xl font-black tracking-tight text-[#1f1f1d]">
            Brands We Manufacture For
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {partners.map((p) => (
              <div
                key={p}
                className="flex items-center justify-center rounded-[20px] bg-[#FAF9F6] px-4 py-6 text-sm font-black uppercase tracking-wider text-neutral-500"
              >
                {p}
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-neutral-500">
            … and 500+ more brands that trust Dreamlab&apos;s certified private label &amp; OEM/ODM production.
          </p>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="px-6 lg:px-8 pb-14 max-w-3xl mx-auto">
        <div className="rounded-[32px] bg-white p-8 md:p-10 border border-[#eadfcf] text-center">
          <span className="text-4xl">💬</span>
          <p className="mt-4 text-base md:text-lg text-neutral-700 leading-relaxed">
            &ldquo;Dreamlab&apos;s manufacturing process is highly professional and guided from start
            to finish. The team always updates progress, responds quickly, and offers solutions. Our
            skincare product entered the market in record time!&rdquo;
          </p>
          <p className="mt-5 text-sm font-black text-[#1f1f1d]">Owner of a Skincare Brand</p>
          <p className="text-xs text-neutral-500">Dreamlab Partner</p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-8 pb-16">
        <div className="mx-auto max-w-5xl rounded-[32px] bg-brand-orange p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Become Our Next Success Story
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-sm md:text-base text-white/90">
            Join 500+ brands that trust Dreamlab&apos;s certified private label &amp; OEM/ODM manufacturing.
          </p>
          <div className="mt-6">
            <a
              href="https://api.whatsapp.com/send/?phone=6287712232389&text=Hi%20Dreamlab%2C%20I%20want%20to%20become%20a%20partner"
              className="inline-flex items-center rounded-full bg-white px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-[#b06f00] shadow-lg hover:bg-black hover:text-white"
            >
              Become a Partner
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
