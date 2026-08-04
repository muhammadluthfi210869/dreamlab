import type { Metadata } from "next";
import { buildAlternates } from "@/lib/seo-lang";

export const metadata: Metadata = {
  title: "Cosmetic Contract Manufacturing Services | OEM, ODM & Private Label",
  description:
    "One-stop cosmetic contract manufacturing: free brand consultation, custom OEM/ODM formulation, packaging design, BPOM & Halal registration, and digital marketing support.",
  alternates: buildAlternates("/en/services/"),
  openGraph: {
    title: "Cosmetic Contract Manufacturing Services | OEM, ODM & Private Label | Dreamlab",
    description:
      "End-to-end cosmetic contract manufacturing: custom formulation, packaging design, BPOM & Halal registration, and certified production in Indonesia.",
    url: "https://dreamlab.id/en/services/",
    siteName: "Dreamlab",
    locale: "en_US",
    type: "website",
  },
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
};

const categories = [
  { name: "Skincare Manufacturing", desc: "Facial wash, serum, sunscreen, toner, mask, moisturizer & more" },
  { name: "Body Care Manufacturing", desc: "Body wash, body scrub, body butter, soap, massage products" },
  { name: "Hair Care Manufacturing", desc: "Shampoo, conditioner, hair mask, scalp care, pomade" },
  { name: "Color Cosmetics", desc: "Foundation, BB cream, blush, mascara, highlighter" },
  { name: "Baby Care Manufacturing", desc: "Baby wash, baby shampoo, baby lotion, baby powder" },
  { name: "Fragrance & Perfume Manufacturing", desc: "EDP, EDT, EDC, body mist, essential oil, extrait de parfum" },
];

export default function EnServicesPage() {
  return (
    <main className="min-h-screen bg-brand-white pt-28 md:pt-36">
      {/* HERO */}
      <section className="px-6 lg:px-8 py-12 md:py-16 text-center max-w-4xl mx-auto">
        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">Cosmetic Contract Manufacturing</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-[#1f1f1d]">
          Cosmetic Contract Manufacturing Services — OEM/ODM &amp; Private Label
        </h1>
        <p className="mt-5 text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
          Free brand consultation • Custom OEM/ODM formulation • Custom logo &amp; packaging design •
          BPOM &amp; Halal registration • Free digital marketing support
        </p>
      </section>

      {/* ONE-STOP POINTS */}
      <section className="px-6 lg:px-8 pb-12 max-w-5xl mx-auto">
        <h2 className="text-center text-3xl font-black tracking-tight text-[#1f1f1d]">
          Turnkey Cosmetic Manufacturing Services
        </h2>
        <p className="mt-3 text-center text-sm text-neutral-500">
          No need to coordinate with dozens of vendors. Dreamlab handles your entire manufacturing
          journey — from formula to shelf.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Free brand concept consultation",
            "Free custom formula development (OEM/ODM)",
            "Free custom logo & packaging design",
            "BPOM & Halal legal registration",
            "Free digital marketing support",
            "After-sales R&D consultation",
          ].map((t) => (
            <div key={t} className="rounded-[20px] border border-[#eadfcf] bg-white p-5 text-center">
              <span className="text-2xl">✔️</span>
              <p className="mt-2 text-sm font-bold text-[#1f1f1d]">{t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-6 lg:px-8 pb-12 max-w-5xl mx-auto">
        <h2 className="text-center text-3xl font-black tracking-tight text-[#1f1f1d]">
          Cosmetic Categories We Manufacture
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {categories.map((c) => (
            <div key={c.name} className="rounded-[24px] border border-[#eadfcf] bg-white p-6">
              <h3 className="text-base font-black text-[#1f1f1d]">{c.name}</h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CERTIFICATION */}
      <section className="px-6 lg:px-8 pb-14 max-w-5xl mx-auto">
        <div className="rounded-[32px] bg-white p-8 md:p-12 border border-[#eadfcf]">
          <h2 className="text-center text-3xl font-black tracking-tight text-[#1f1f1d]">
            Certified Cosmetic Factory — CPKB Grade A
          </h2>
          <p className="mt-3 text-center text-sm text-neutral-500">
            Officially verified CPKB Grade A aseptic production facility.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Official CPKB Grade A certificate (No. CPKB/2023/18260-A)",
              "Official BPOM RI marketing authorization (active verification)",
              "Certified Halal supply chain (No. ID00410000219461221)",
              "Independent R&D research laboratory",
              "Licensed pharmacist formulators (STRA No. 1991)",
              "Industrial-scale production capacity",
            ].map((t) => (
              <div key={t} className="rounded-[20px] bg-[#FAF9F6] p-5 text-sm font-semibold text-[#1f1f1d]">
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-8 pb-16">
        <div className="mx-auto max-w-5xl rounded-[32px] bg-brand-orange p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Get a Free Manufacturing &amp; Formulation Quote
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-sm md:text-base text-white/90">
            Request a free formula sample, visit our Surabaya factory, or consult with our R&amp;D
            pharmacists on WhatsApp.
          </p>
          <div className="mt-6">
            <a
              href="https://api.whatsapp.com/send/?phone=6287712232389&text=Hi%20Dreamlab%2C%20I%20want%20to%20discuss%20my%20cosmetic%20brand"
              className="inline-flex items-center rounded-full bg-white px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-[#b06f00] shadow-lg hover:bg-black hover:text-white"
            >
              Talk to Our R&amp;D Team
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
