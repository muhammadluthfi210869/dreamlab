import type { Metadata } from "next";
import { buildAlternates } from "@/lib/seo-lang";

export const metadata: Metadata = {
  title: "Services | Complete Cosmetic Private Label Manufacturing",
  description:
    "One-stop cosmetic manufacturing services: free brand consultation, custom formula, custom packaging design, BPOM & Halal registration, and digital marketing support.",
  alternates: buildAlternates("/en/services/"),
  openGraph: {
    title: "Services | Complete Cosmetic Private Label Manufacturing",
    description:
      "Skincare, body care, hair care, perfume, decorative, baby care & more — all with BPOM, CPKB & Halal certification.",
    url: "https://dreamlab.id/en/services/",
    siteName: "Dreamlab",
    locale: "en_US",
    type: "website",
  },
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
};

const categories = [
  { name: "Skincare", desc: "Facial wash, serum, sunscreen, toner, mask, moisturizer & more" },
  { name: "Body Care", desc: "Body wash, body scrub, body butter, soap, massage products" },
  { name: "Hair Care", desc: "Shampoo, conditioner, hair mask, scalp care, pomade" },
  { name: "Decorative", desc: "Foundation, BB cream, blush, mascara, highlighter" },
  { name: "Baby Care", desc: "Baby wash, baby shampoo, baby lotion, baby powder" },
  { name: "Perfume", desc: "EDP, EDT, EDC, body mist, essential oil, extrait de parfum" },
];

export default function EnServicesPage() {
  return (
    <main className="min-h-screen bg-brand-white pt-28 md:pt-36">
      {/* HERO */}
      <section className="px-6 lg:px-8 py-12 md:py-16 text-center max-w-4xl mx-auto">
        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">Our Services</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-[#1f1f1d]">
          One-Stop Manufacturing for Your Cosmetic Brand
        </h1>
        <p className="mt-5 text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
          Free brand consultation • Custom formula • Custom logo &amp; packaging design • Legal
          registration • Free digital marketing support
        </p>
      </section>

      {/* ONE-STOP POINTS */}
      <section className="px-6 lg:px-8 pb-12 max-w-5xl mx-auto">
        <h2 className="text-center text-3xl font-black tracking-tight text-[#1f1f1d]">
          Everything You Need, One Partner
        </h2>
        <p className="mt-3 text-center text-sm text-neutral-500">
          No need to coordinate with dozens of vendors. Dreamlab handles your entire manufacturing
          journey.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Free brand concept consultation",
            "Free custom formula development",
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
          Product Categories We Manufacture
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
            Aseptic Laboratory. Highest Certification.
          </h2>
          <p className="mt-3 text-center text-sm text-neutral-500">
            Officially verified CPKB Grade A facility.
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
            Start Building Your Brand Empire Today
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
              Consult R&D Pharmacist
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
