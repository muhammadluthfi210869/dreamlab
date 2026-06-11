import { Metadata } from 'next';
import { PageSchema } from "@/components/PageSchema";

export const metadata: Metadata = {
  title: "Terms of Service | Dreamlab Maklon Kosmetik",
  description: "Syarat dan ketentuan layanan maklon kosmetik Dreamlab (PT Karya Impian Laboratoris). Baca kebijakan penggunaan jasa, formulasi, produksi, dan hak kekayaan intelektual.",
  alternates: {
    canonical: 'https://dreamlab.id/terms-of-service/',
  },
  openGraph: {
    title: "Terms of Service | Dreamlab Maklon Kosmetik",
    description: "Syarat dan ketentuan layanan maklon kosmetik Dreamlab (PT Karya Impian Laboratoris).",
    url: 'https://dreamlab.id/terms-of-service/',
    siteName: 'Dreamlab',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Terms of Service | Dreamlab Maklon Kosmetik",
    description: "Syarat dan ketentuan layanan maklon kosmetik Dreamlab.",
  },
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-brand-white">
      <PageSchema
        url="https://dreamlab.id/terms-of-service/"
        title="Terms of Service | Dreamlab Maklon Kosmetik"
        description="Syarat dan ketentuan layanan maklon kosmetik Dreamlab."
        h1="Terms of Service"
        type="category"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Terms of Service' },
        ]}
      />
      <section className="pt-48 pb-24 bg-brand-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-brand-dark/30" />
        <div className="container-custom relative z-10">
          <div className="max-w-4xl">
            <nav className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <a href="/" className="hover:text-brand-orange transition-colors">Home</a>
              <span>/</span>
              <span className="text-white">Terms of Service</span>
            </nav>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
              Terms of <span className="text-brand-orange">Service</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using the services provided by PT Karya Impian Laboratoris (&ldquo;Dreamlab&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>

            <h2>2. Services Description</h2>
            <p>Dreamlab provides contract manufacturing and private label services for cosmetic products including skincare, body care, hair care, parfum, decorative makeup, baby care, foot care, and PKRT. Services include formulation, production, packaging, and regulatory compliance (BPOM & Halal certification).</p>

            <h2>3. Client Responsibilities</h2>
            <p>Clients agree to provide accurate information regarding their brand concept, product requirements, and any intellectual property claims. Clients are responsible for reviewing and approving samples before mass production.</p>

            <h2>4. Intellectual Property</h2>
            <p>All formulations developed specifically for a client remain the exclusive property of that client. Dreamlab&rsquo;s proprietary technologies and existing formulations remain the property of Dreamlab.</p>

            <h2>5. Payment Terms</h2>
            <p>Payment terms are agreed upon during the contract negotiation phase and are detailed in the service agreement. Late payments may result in production delays.</p>

            <h2>6. Limitation of Liability</h2>
            <p>Dreamlab&rsquo;s liability is limited to the value of the services rendered. Dreamlab is not liable for any indirect damages resulting from product use or market performance.</p>

            <h2>7. Termination</h2>
            <p>Either party may terminate the agreement with written notice as specified in the service contract. Upon termination, client shall pay for all services rendered up to the termination date.</p>

            <h2>8. Governing Law</h2>
            <p>These terms are governed by the laws of the Republic of Indonesia. Any disputes shall be resolved in the courts of Surabaya, East Java.</p>

            <p className="text-gray-400 text-sm mt-12">Last updated: May 2026</p>
          </div>
        </div>
      </section>
    </main>
  );
}
