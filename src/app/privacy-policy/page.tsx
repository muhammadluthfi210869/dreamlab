import { Metadata } from 'next';
import { PageSchema } from "@/components/PageSchema";

export const metadata: Metadata = {
  title: "Privacy Policy | Dreamlab Maklon Kosmetik",
  description: "Kebijakan privasi Dreamlab (PT Karya Impian Laboratoris). Bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda sesuai UU ITE Indonesia.",
  alternates: {
    canonical: 'https://dreamlab.id/privacy-policy/',
  },
  openGraph: {
    title: "Privacy Policy | Dreamlab Maklon Kosmetik",
    description: "Kebijakan privasi Dreamlab (PT Karya Impian Laboratoris). Bagaimana kami melindungi data pribadi Anda sesuai UU ITE.",
    url: 'https://dreamlab.id/privacy-policy/',
    siteName: 'Dreamlab',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Privacy Policy | Dreamlab Maklon Kosmetik",
    description: "Kebijakan privasi Dreamlab. Bagaimana kami melindungi data pribadi Anda.",
  },
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-brand-white">
      <PageSchema
        url="https://dreamlab.id/privacy-policy/"
        title="Privacy Policy | Dreamlab Maklon Kosmetik"
        description="Kebijakan privasi Dreamlab. Bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda."
        h1="Privacy Policy"
        type="category"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Privacy Policy' },
        ]}
      />
      <section className="pt-48 pb-24 bg-brand-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-brand-dark/30" />
        <div className="container-custom relative z-10">
          <div className="max-w-4xl">
            <nav className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <a href="/" className="hover:text-brand-orange transition-colors">Home</a>
              <span>/</span>
              <span className="text-white">Privacy Policy</span>
            </nav>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
              Privacy <span className="text-brand-orange">Policy</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2>1. Information We Collect</h2>
            <p>Dreamlab collects information you provide directly: name, email address, phone number, company name, and project requirements. We also automatically collect technical data such as IP address, browser type, and pages visited.</p>

            <h2>2. How We Use Your Information</h2>
            <p>We use your information to: respond to inquiries, provide maklon consultation services, process orders, improve our website, send relevant marketing communications (with your consent), and comply with legal obligations.</p>

            <h2>3. Data Protection</h2>
            <p>Dreamlab implements appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction in accordance with Indonesian UU ITE regulations.</p>

            <h2>4. Data Sharing</h2>
            <p>We do not sell your personal data. Information may be shared with trusted third-party service providers (e.g., BPOM, Halal certification bodies, logistics partners) only as necessary to fulfill our services.</p>

            <h2>5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data held by Dreamlab. Requests can be submitted via our Contact page or WhatsApp.</p>

            <h2>6. Cookies</h2>
            <p>Our website uses cookies to enhance user experience and analyze site traffic. You can control cookie preferences through your browser settings.</p>

            <h2>7. Contact</h2>
            <p>For privacy-related inquiries, contact us at: <a href="mailto:info@dreamlab.id" className="text-brand-orange">info@dreamlab.id</a> or via our Contact page.</p>

            <p className="text-gray-400 text-sm mt-12">Last updated: May 2026</p>
          </div>
        </div>
      </section>
    </main>
  );
}
