import type { Metadata } from "next";
import Link from "next/link";
import KatalogProduk from "@/components/KatalogProduk";
import CtaSection from "@/components/CtaSection";
import JsonLd from "@/components/JsonLd";
import { catalogContentEn, ctaContentEn } from "@/data/en/site";
import { buildAlternates } from "@/lib/seo-lang";

export const metadata: Metadata = {
  // /en/produk/ dan /produk/ sekarang punya pasangan resiprokal — hreflang
  // dihasilkan otomatis oleh buildAlternates() dari EN_TRANSLATED_PATHS.
  title: {
    absolute: "Dreamlab | Cosmetic Manufacturing Product Catalog",
  },
  description:
    "Dreamlab cosmetic manufacturing catalog: skincare, body care, hair care, makeup, baby care, perfume & foot care. BPOM, CPKB Grade A & Halal.",
  alternates: buildAlternates("/en/produk/"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Dreamlab",
    title: "Dreamlab | Cosmetic Manufacturing Product Catalog",
    description:
      "Dreamlab cosmetic manufacturing catalog: skincare, body care, hair care, makeup, baby care, perfume & foot care. BPOM, CPKB Grade A & Halal.",
    url: "https://dreamlab.id/en/produk/",
  },
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
};

const enCategorySummaries = [
  {
    name: "Skincare & Face Care",
    href: "/produk/skincare/",
    description:
      "Daily and targeted facial care products including facial wash, essence toner, facial serum, moisturizer cream, and sunscreen. Built for new beauty brands, aesthetic clinics, and skincare lines seeking custom active formulations with full BPOM registration.",
  },
  {
    name: "Body Care",
    href: "/produk/bodycare/",
    description:
      "Comprehensive body care formulations such as body wash, body scrub, body lotion, body serum, and body butter. Ideal for brands targeting everyday personal care routines with strong repeat-purchase potential.",
  },
  {
    name: "Hair Care",
    href: "/produk/haircare/",
    description:
      "Scalp and hair treatment solutions spanning bonding shampoo, hair conditioner, hair mask, hair serum, and hair mist. Well suited for salon-grade lines, personal care brands, and hair-health specialists.",
  },
  {
    name: "Decorative (Makeup)",
    href: "/produk/decorative/",
    description:
      "Modern color cosmetics covering lip cream, lip matte, peptide lip treatment, cushion, and foundation with customizable shade ranges. Designed for trend-driven beauty brands entering the color cosmetics market.",
  },
  {
    name: "Baby Care",
    href: "/produk/babycare/",
    description:
      "Gentle formulations tailored for delicate baby and kids skin, including baby 2-in-1 wash, baby shampoo, baby lotion, and baby cologne. Created for family-focused brands that prioritize mildness and safety.",
  },
  {
    name: "Perfume & Fragrance",
    href: "/produk/parfum/",
    description:
      "Fine fragrance lines ranging from Eau de Parfum and Extrait de Parfum to body mist and signature scents. A strong fit for lifestyle brands, fashion labels, and creators launching signature fragrances.",
  },
  {
    name: "Foot Care",
    href: "/produk/footcare/",
    description:
      "Specialized foot treatments such as moisturizing foot cream designed to soften dry heels and soothe tired skin. Works well as an add-on SKU for body care brands, clinics, and spa lines.",
  },
];

const enProcessSteps = [
  {
    step: "01",
    title: "Concept & Market Consultation",
    detail:
      "Align on your target audience, hero product idea, target cost of goods (COGS), and category strategy with our Business Development team.",
  },
  {
    step: "02",
    title: "R&D Formulation & Sampling",
    detail:
      "Our laboratory develops an exclusive custom formula (1 Client = 1 Formula) and prepares physical samples for texture, scent, and performance testing.",
  },
  {
    step: "03",
    title: "Packaging Design & Legal Registration",
    detail:
      "We support packaging visualization while our regulatory team handles BPOM RI distribution permits, Halal MUI certification, and trademark guidance.",
  },
  {
    step: "04",
    title: "Mass Production in CPKB Grade A Facility",
    detail:
      "Once samples are approved and compliance is underway, production runs at our CPKB Grade A certified factory in Surabaya.",
  },
  {
    step: "05",
    title: "Quality Control & Delivery",
    detail:
      "Every finished batch undergoes quality inspection and final packaging before being shipped to your warehouse or distribution hub.",
  },
];

const enProdukFaqs = [
  {
    question: "What is the Minimum Order Quantity (MOQ) at Dreamlab?",
    answer:
      "Dreamlab offers a flexible MOQ adjusted to your chosen product category, packaging format, and active ingredient specifications. This allows both emerging brands and established businesses to test the market without excessive inventory risk.",
  },
  {
    question: "How long does the manufacturing and BPOM registration process take?",
    answer:
      "Most projects take around 2 to 3 months end-to-end. This covers R&D formula development (around 2–4 weeks), BPOM RI distribution permit registration (around 4–8 weeks), Halal certification, and mass production (around 2–3 weeks).",
  },
  {
    question: "Will my product formula remain exclusive to my brand?",
    answer:
      "Yes. Dreamlab follows a strict 1 Client = 1 Formula policy, meaning your custom formulation is developed specifically for your brand brief and is not duplicated for other clients.",
  },
  {
    question: "Does Dreamlab handle BPOM, Halal MUI, and trademark registration?",
    answer:
      "Yes. As a One-Stop Manufacturing Service partner, our regulatory compliance team manages BPOM RI notification, Halal MUI certification, and trademark (HAKI) registration support.",
  },
  {
    question: "How does formula sampling work before mass production?",
    answer:
      "Initial product concept consultation and first R&D sample creation are free of charge. You can evaluate the sample and request sensory or texture adjustments until it meets your brand standards prior to mass production.",
  },
];

const enFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: enProdukFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function EnProdukPage() {
  return (
    <main className="min-h-screen bg-brand-white">
      <JsonLd data={enFaqSchema} />

      <section className="py-16 bg-brand-black">
        <div className="container-custom text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-5">
            Dreamlab Cosmetic Manufacturing Product Catalog
          </h1>
          <p className="text-white/80 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
            Dreamlab is a Surabaya-based cosmetic and perfume manufacturer offering end-to-end private label and custom formulation services across skincare, body care, hair care, color cosmetics, baby care, fragrance, and foot care. Designed for new beauty founders, aesthetic clinics, resellers, and growing brands, our catalog lets you launch market-ready products without building your own factory. Every SKU is developed under our 1 Client = 1 Formula principle in a CPKB Grade A facility, complete with BPOM RI registration and Halal MUI compliance.
          </p>
        </div>
      </section>

      {/* Katalog produk — komponen KatalogProduk yang sama persis dengan home
          Indonesia, diisi konten English (visual categories) */}
      <KatalogProduk content={catalogContentEn} />

      <section className="py-16 bg-[#FAF9F6] border-t border-neutral-100">
        <div className="container-custom">
          <div className="max-w-3xl mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-black mb-3">
              Product Categories &amp; Formulation Capabilities
            </h2>
            <p className="text-neutral-600 text-sm md:text-base leading-relaxed">
              Explore each product line below to see available formats and find the best fit for your brand positioning and target customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enCategorySummaries.map((cat) => (
              <div
                key={cat.href}
                className="bg-white rounded-2xl border border-neutral-200/80 p-6 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <h3 className="text-lg font-bold text-brand-black mb-2">{cat.name}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>
                <Link
                  href={cat.href}
                  className="inline-flex items-center text-sm font-bold text-brand-orange hover:underline"
                >
                  Explore {cat.name} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-neutral-100">
        <div className="container-custom max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-black mb-4">
            How to Choose the Right Cosmetic Product for Your Brand
          </h2>
          <div className="space-y-4 text-sm md:text-base text-neutral-600 leading-relaxed">
            <p>
              Selecting your first hero product is one of the most important decisions when launching a beauty brand. Start by identifying a clear consumer need—such as barrier repair, acne care, daily sun protection, scalp health, or a signature everyday fragrance. Products used daily with predictable replenishment cycles typically generate healthier repeat-order rates.
            </p>
            <p>
              Next, match your product scope and packaging format with your launch budget and primary sales channels. Many first-time brand owners begin with one or two focused SKUs to keep marketing spend efficient and inventory turnover manageable. You can review our full end-to-end capabilities on the{" "}
              <Link href="/en/services/" className="text-brand-orange font-semibold hover:underline">
                Dreamlab manufacturing services
              </Link>{" "}
              page, learn more about our quality standards on{" "}
              <Link href="/en/about-us/" className="text-brand-orange font-semibold hover:underline">
                About Dreamlab
              </Link>
              , or reach out via{" "}
              <Link href="/en/contact-us/" className="text-brand-orange font-semibold hover:underline">
                our contact page
              </Link>{" "}
              to request a consultation.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#FAF9F6] border-t border-neutral-100">
        <div className="container-custom max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-brand-black mb-2">
                Our Manufacturing Process at Dreamlab
              </h2>
              <p className="text-sm md:text-base text-neutral-600">
                A structured five-step workflow from initial brief to market-ready inventory.
              </p>
            </div>
            <Link
              href="/en/services/"
              className="text-sm font-bold text-brand-orange hover:underline shrink-0"
            >
              View Full Services →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enProcessSteps.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm"
              >
                <span className="text-xs font-black tracking-widest text-brand-orange">
                  STEP {item.step}
                </span>
                <h3 className="text-base font-bold text-brand-black mt-2 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-neutral-100">
        <div className="container-custom max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-black mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {enProdukFaqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-2xl border border-neutral-200 bg-[#FAF9F6] p-5"
              >
                <summary className="cursor-pointer font-bold text-brand-black text-sm md:text-base">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CtaSection {...ctaContentEn} />
    </main>
  );
}
