import type { Metadata } from "next";
import Link from "next/link";
import { buildAlternates } from "@/lib/seo-lang";

export const metadata: Metadata = {
  title: "Contact Us | Private Label Cosmetic Manufacturer Indonesia",
  description:
    "Contact Dreamlab for a free cosmetic manufacturing quote. Certified private label, OEM & ODM contract manufacturer in Surabaya, East Java, Indonesia — BPOM & Halal certified.",
  alternates: buildAlternates("/en/contact-us/"),
  openGraph: {
    title: "Contact Us | Private Label Cosmetic Manufacturer Indonesia | Dreamlab",
    description:
      "Get a free quote for your cosmetic brand. Private label, OEM & ODM contract manufacturing in Surabaya, East Java, Indonesia — BPOM & Halal certified.",
    url: "https://dreamlab.id/en/contact-us/",
    siteName: "Dreamlab",
    locale: "en_US",
    type: "website",
  },
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
};

export default function EnContactPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] pt-28 md:pt-36">
      {/* HERO */}
      <section className="px-6 lg:px-8 py-12 md:py-16 text-center max-w-4xl mx-auto">
        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">Get a Free Manufacturing Quote</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-[#1f1f1d]">
          Start Your Cosmetic Brand — Get a Free Quote
        </h1>
        <p className="mt-5 text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
          Get a free consultation with our R&D pharmacists and formulation experts. Whether you are
          starting from an idea or scaling an existing brand, Dreamlab is your one-stop cosmetic
          contract manufacturing partner.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://api.whatsapp.com/send/?phone=6287712232389&text=Hi%20Dreamlab%2C%20I%20want%20to%20consult%20about%20my%20cosmetic%20brand"
            className="btn-wa inline-flex items-center gap-3 rounded-full bg-[#25d366] px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg hover:bg-[#1da851]"
          >
            WhatsApp Us Now
          </a>
          <Link
            href="mailto:Official@dreamlab.id"
            className="inline-flex items-center rounded-full border-2 border-[#1f1f1d] px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-[#1f1f1d] hover:bg-[#1f1f1d] hover:text-white"
          >
            Email Us
          </Link>
        </div>
      </section>

      {/* CONTACT DETAILS */}
      <section className="px-6 lg:px-8 pb-16 max-w-5xl mx-auto">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Factory & Office",
              lines: ["SIER Rungkut, Surabaya", "East Java, Indonesia"],
            },
            {
              title: "Business Hours",
              lines: ["Monday - Saturday", "08:00 - 17:00 WIB"],
            },
            {
              title: "Free Consultation",
              lines: ["R&D Pharmacists", "Formulation & Legal (BPOM/Halal)"],
            },
          ].map((c) => (
            <div key={c.title} className="rounded-[24px] border border-[#eadfcf] bg-white p-7 text-center">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#b06f00]">{c.title}</h2>
              {c.lines.map((l) => (
                <p key={l} className="mt-2 text-sm text-neutral-600">{l}</p>
              ))}
            </div>
          ))}
        </div>

        {/* CTA BANNER */}
        <div className="mt-12 rounded-[32px] bg-brand-orange p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Turn Your Idea Into a Market-Ready Cosmetic Product
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-sm md:text-base text-white/90">
            Exclusive formulation, certified CPKB production, and BPOM & Halal registration handled
            end-to-end. One partner, everything taken care of.
          </p>
          <div className="mt-6">
            <a
              href="https://api.whatsapp.com/send/?phone=6287712232389&text=Hi%20Dreamlab%2C%20I%20want%20to%20start%20my%20cosmetic%20brand"
              className="inline-flex items-center rounded-full bg-white px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-[#b06f00] shadow-lg hover:bg-black hover:text-white"
            >
              Start Free Consultation
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
