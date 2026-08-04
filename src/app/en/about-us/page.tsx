import type { Metadata } from "next";
import { buildAlternates } from "@/lib/seo-lang";

export const metadata: Metadata = {
  title: "About Dreamlab | Certified Cosmetic Manufacturer Since 1989",
  description:
    "Dreamlab is an Indonesian cosmetic contract manufacturer trusted since 1989. CPKB Grade A certified factory, licensed pharmacists, full BPOM & Halal registration.",
  alternates: buildAlternates("/en/about-us/"),
  openGraph: {
    title: "About Dreamlab | Certified Cosmetic Manufacturer Since 1989",
    description:
      "CPKB Grade A certified factory, licensed pharmacists, full BPOM & Halal registration. One partner, everything taken care of.",
    url: "https://dreamlab.id/en/about-us/",
    siteName: "Dreamlab",
    locale: "en_US",
    type: "website",
  },
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
};

const steps = [
  {
    step: "01",
    title: "Consultation & Ideation",
    desc: "We discuss your brand concept, target market, and the right product type for your vision.",
  },
  {
    step: "02",
    title: "Research & Formulation",
    desc: "Our licensed pharmacists develop an exclusive formula with high-quality active ingredients.",
  },
  {
    step: "03",
    title: "Production & Compliance",
    desc: "Mass production at our CPKB Grade A facility with BPOM & Halal registration handled simultaneously.",
  },
  {
    step: "04",
    title: "After-Sales Support",
    desc: "Ongoing support after launch: reformulation, consultation, and quality assurance.",
  },
];

export default function EnAboutPage() {
  return (
    <main className="min-h-screen bg-brand-white pt-28 md:pt-36">
      {/* HERO */}
      <section className="px-6 lg:px-8 py-12 md:py-16 text-center max-w-4xl mx-auto">
        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">About Dreamlab</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-[#1f1f1d]">
          Launch Your Cosmetic Brand in 3 Months
        </h1>
        <p className="mt-5 text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
          From idea to market-ready. Exclusive formulation, certified CPKB production, and BPOM &amp;
          Halal registration all handled by one trusted partner.
        </p>
      </section>

      {/* CERTIFICATIONS */}
      <section className="px-6 lg:px-8 pb-12 max-w-5xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[24px] border border-[#eadfcf] bg-white p-8">
            <div className="inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/10 text-xl">🛡️</span>
              <h2 className="text-lg font-black text-[#1f1f1d]">CPKB Grade A Certification</h2>
            </div>
            <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
              No. CPKB/2023/18260-A — international-standard hygiene for cosmetic production, ensuring
              safe and consistent quality for every batch.
            </p>
          </div>
          <div className="rounded-[24px] border border-[#eadfcf] bg-white p-8">
            <div className="inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/10 text-xl">✅</span>
              <h2 className="text-lg font-black text-[#1f1f1d]">BPOM RI &amp; Halal Certified</h2>
            </div>
            <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
              Active BPOM registration verification — every product is officially listed and fully
              compliant, with Halal MUI certification.
            </p>
          </div>
        </div>
      </section>

      {/* 4 STEPS */}
      <section className="px-6 lg:px-8 pb-14 max-w-5xl mx-auto">
        <h2 className="text-center text-3xl font-black tracking-tight text-[#1f1f1d]">
          Simple Process. Maximum Results.
        </h2>
        <p className="mt-3 text-center text-sm text-neutral-500">
          Four easy steps from consultation to market-ready product.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {steps.map((s) => (
            <div key={s.step} className="rounded-[24px] border border-[#eadfcf] bg-white p-6">
              <span className="text-4xl font-black text-brand-orange/30">{s.step}</span>
              <h3 className="mt-3 text-base font-black text-[#1f1f1d]">{s.title}</h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-8 pb-16">
        <div className="mx-auto max-w-5xl rounded-[32px] bg-brand-orange p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Start Building Your Brand Today
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-sm md:text-base text-white/90">
            Request a free formula sample, schedule a factory visit, or consult with our R&amp;D
            pharmacists about your product idea.
          </p>
          <div className="mt-6">
            <a
              href="https://api.whatsapp.com/send/?phone=6287712232389&text=Hi%20Dreamlab%2C%20I%20want%20to%20build%20my%20cosmetic%20brand"
              className="inline-flex items-center rounded-full bg-white px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-[#b06f00] shadow-lg hover:bg-black hover:text-white"
            >
              Free Consultation
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
