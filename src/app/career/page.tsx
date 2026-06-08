import Image from "next/image";
import Link from "next/link";
import PremiumHero from "@/components/PremiumHero";
import { careerData } from "@/data/career";

export const metadata = {
  title: "Career - Dreamlab Indonesia",
  description: "Build Your Career With Dreamlab. Join our team and be part of beauty innovation in Indonesia.",
};

export default function CareerPage() {
  const { hero, listings, ctaSection } = careerData;

  return (
    <main className="bg-brand-white">
      {/* Hero Section */}
      <PremiumHero 
        title={hero.title}
        subtitle={hero.description}
        backgroundImage={hero.image}
        ctaLink={hero.ctaLink}
        ctaText={hero.cta}
      />

      {/* Listings Section */}
      <section id="listings" className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-[38px] md:text-[52px] lg:text-[80px] font-display font-normal text-brand-black mb-6 uppercase tracking-tight leading-[1.05]">
              Lowongan <span className="text-brand-orange underline">Terbaru</span>
            </h2>
            <p className="text-xl text-brand-black/60 max-w-2xl mx-auto">
              Temukan kesempatan karir yang sesuai dengan passion dan keahlian Anda di Dreamlab.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-[4/5] md:aspect-[3/2] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
              <Image 
                src={listings.image}
                alt={listings.alt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 flex justify-center">
                <Link 
                  href={ctaSection.ctaLink} 
                  className="bg-brand-orange text-white text-xl font-black py-5 px-12 rounded-xl uppercase tracking-tighter shadow-2xl hover:scale-105 transition-transform"
                >
                  Apply via WhatsApp 🚀
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="section-padding bg-brand-white text-brand-black overflow-hidden">
        <div className="container-custom relative">
          {/* Decorative background element */}
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-xl">
                <Image 
                  src="/assets/images/641.webp" 
                  alt="Dreamlab Culture"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Stats/Badges */}
              <div className="absolute -bottom-6 -right-6 bg-brand-orange p-8 rounded-3xl shadow-2xl text-white">
                <div className="text-4xl font-onest font-black leading-none">500+</div>
                <div className="text-xs uppercase font-black tracking-widest mt-2 opacity-80">Clients Trusted</div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-[38px] md:text-[52px] lg:text-[80px] font-display font-normal mb-8 uppercase leading-tight leading-[1.05] text-brand-black">
                {ctaSection.title}
              </h2>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                {ctaSection.description} At Dreamlab, we believe in people. We offer more than just a job; we offer a platform for growth, innovation, and career excellence.
              </p>
              <div className="space-y-6">
                {["Creativity & Innovation", "Ownership & Responsibility", "Continuous Learning"].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                    <span className="text-xl font-bold uppercase tracking-tight text-brand-black">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding text-center">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto bg-brand-orange p-12 md:p-20 rounded-[3rem] shadow-2xl text-white">
            <h3 className="text-3xl md:text-5xl font-onest font-black mb-8 uppercase leading-tight">
              Belum menemukan posisi yang pas?
            </h3>
            <p className="text-xl mb-12 opacity-90">
              Kirimkan CV Anda ke database talent kami. Kami akan menghubungi Anda jika ada posisi yang sesuai di masa depan.
            </p>
              <Link 
                href="mailto:hr@dreamlab.id" 
                className="bg-white text-brand-orange hover:bg-gray-100 transition-all duration-300 text-xl font-black py-6 px-12 rounded-2xl uppercase tracking-tighter shadow-xl"
              >
              Kirim CV ke HR 📧
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
