import type { Metadata } from "next";
import { buildAlternates } from "@/lib/seo-lang";

export const metadata: Metadata = {
  // Catatan: title.template di /en/layout.tsx tidak berlaku untuk halaman di segment
  // yang sama (home), jadi brand "| Dreamlab" ditambahkan manual di sini.
  title: "Private Label Cosmetic Manufacturer Indonesia | Dreamlab",
  description:
    "Dreamlab is a certified cosmetic contract manufacturer in Indonesia. Private label & OEM/ODM skincare, body care, hair care & perfume production with exclusive formulations, flexible MOQ, BPOM, CPKB Grade A & Halal certification.",
  alternates: buildAlternates("/en/"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Dreamlab",
    title: "Private Label Cosmetic Manufacturer Indonesia | Dreamlab",
    description:
      "Certified BPOM, CPKB Grade A & Halal. 500+ brands trust our private label & OEM/ODM cosmetic production in Indonesia.",
    url: "https://dreamlab.id/en/",
  },
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
};

const advantages = [
  { title: "Cost-Effective Production", desc: "Competitive unit pricing with full HPP (cost of goods) transparency to protect your margins." },
  { title: "In-House R&D & ODM", desc: "A young, highly innovative formulation team develops exclusive, custom formulas for your brand." },
  { title: "Custom Packaging Design", desc: "A creative design team ready to visualize your brand identity across packaging & labels." },
  { title: "Strong Branding", desc: "Build a strong identity so your brand is easily recognized on shelf and online." },
  { title: "Digital Marketing Support", desc: "Reach your target audience more effectively & efficiently with our free marketing guidance." },
  { title: "Exclusive Formulas", desc: "1 client, 1 formula. Your custom formula is never shared with other brands." },
  { title: "Licensed Pharmacist Formulators", desc: "STRA-registered pharmacists formulate and oversee every product for safety & quality." },
  { title: "Flexible MOQ", desc: "Minimum order quantities tailored to your budget so you can start small and scale up." },
];

const catalog = [
  { id: "skincare", name: "Skin Care", items: ["Cleansing Oil", "Cleansing Balm", "Eye Cream", "Facial Cream", "Facial Wash"] },
  { id: "body-care", name: "Body Care", items: ["Body Scrub", "Body Butter", "Bar Soap", "Organic Soap"] },
  { id: "hair-care", name: "Hair Care", items: ["Shampoo", "Hair Conditioner", "Hair Mask"] },
  { id: "decorative", name: "Decorative", items: ["Foundation", "BB Cream", "Lip Cream"] },
  { id: "baby-care", name: "Baby Care", items: ["Baby Wash", "Baby Shampoo", "Baby Lotion", "Baby Powder", "Baby Cologne"] },
];

export default function EnHome() {
  return (
    <main className="min-h-screen bg-brand-white pt-28 md:pt-36">
      {/* HERO */}
      <section className="bg-[#F1E9DA] px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">
            Indonesia&apos;s Trusted Private Label Cosmetic Manufacturer
          </p>
          <h1 className="mt-5 text-4xl md:text-6xl font-black tracking-tight text-[#1f1f1d] leading-[1.05]">
            Private Label Cosmetic Manufacturing in Indonesia
          </h1>
          <p className="mt-6 text-base md:text-lg text-neutral-700 leading-relaxed max-w-2xl mx-auto">
            Dreamlab is a certified cosmetic contract manufacturer (OEM/ODM) trusted by 500+ brands.
            Exclusive formulations, flexible MOQ, and full BPOM, CPKB &amp; Halal registration — handled
            end-to-end for your brand.
          </p>
          <div className="mt-8">
            <a
              href="https://api.whatsapp.com/send/?phone=6287712232389&text=Hi%20Dreamlab%2C%20I%20want%20a%20free%20formulation%20quote"
              className="btn-wa inline-flex items-center rounded-full bg-[#25d366] px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg hover:bg-[#1da851]"
            >
              Get a Free Formulation Quote
            </a>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="px-6 lg:px-8 py-10 bg-white">
        <p className="text-center text-[11px] font-black uppercase tracking-[0.3em] text-[#b06f00]">
          Trusted by 500+ Brands
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-8">
          {["Jilly Daily", "Tazzi", "Sense Soul", "Labbol", "Bebiboster", "Chloe Green", "Itnob"].map(
            (b) => (
              <span key={b} className="text-sm font-black uppercase tracking-wider text-neutral-400">
                {b}
              </span>
            )
          )}
        </div>
      </section>

      {/* CATALOG */}
      <section className="px-6 lg:px-8 py-14 bg-white">
        <h2 className="text-center text-3xl md:text-4xl font-black tracking-tight text-[#1f1f1d]">
          Our Private Label Manufacturing Catalog
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5 max-w-6xl mx-auto">
          {catalog.map((c) => (
            <div key={c.id} className="rounded-[24px] border border-[#eadfcf] bg-[#FAF9F6] p-6">
              <h3 className="text-base font-black text-[#1f1f1d]">{c.name}</h3>
              <ul className="mt-3 space-y-1.5">
                {c.items.map((it) => (
                  <li key={it} className="text-xs text-neutral-600">
                    • {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="px-6 lg:px-8 py-14 bg-[#FAF9F6]">
        <h2 className="text-center text-3xl md:text-4xl font-black tracking-tight text-[#1f1f1d]">
          8 Reasons to Choose Dreamlab as Your Cosmetic Manufacturer
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {advantages.map((a) => (
            <div key={a.title} className="rounded-[20px] bg-white p-6 border border-[#eadfcf]">
              <h3 className="text-sm font-black text-[#1f1f1d]">{a.title}</h3>
              <p className="mt-2 text-xs text-neutral-600 leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CERTIFICATION */}
      <section className="px-6 lg:px-8 py-14 bg-white">
        <div className="max-w-4xl mx-auto rounded-[32px] bg-[#1f1f1d] p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Officially Certified. Fully Compliant.
          </h2>
          <p className="mt-4 text-sm md:text-base text-white/80 max-w-2xl mx-auto">
            CPKB Grade A aseptic production facility, BPOM RI marketing authorization, and certified
            Halal supply chain.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {["CPKB GRADE A", "BPOM RI", "HALAL MUI"].map((c) => (
              <span key={c} className="rounded-full bg-brand-orange px-6 py-2 text-xs font-black uppercase tracking-wider text-white">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-8 py-16 bg-brand-orange">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Ready to Launch Your Own Cosmetic Brand?
          </h2>
          <p className="mt-4 text-sm md:text-base text-white/90 max-w-2xl mx-auto">
            Start with a free consultation. From exclusive formulation to certified production and
            BPOM &amp; Halal registration — one partner, everything handled.
          </p>
          <div className="mt-7">
            <a
              href="https://api.whatsapp.com/send/?phone=6287712232389&text=Hi%20Dreamlab%2C%20I%20want%20to%20start%20my%20brand"
              className="inline-flex items-center rounded-full bg-white px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-[#b06f00] shadow-lg hover:bg-black hover:text-white"
            >
              Request a Free Quote
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
