'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { AdsCredibilitySection } from '@/components/landing-pages/AdsCredibilitySection';
import { aboutData } from '@/data/about-us';
import { LeadQualificationModal } from '@/components/LeadQualificationModal';

const LogoScroll = dynamic(() => import('@/components/LogoScroll'), {
  ssr: true,
  loading: () => <div className="py-14 bg-white" />,
});

export function GoogleAdsMaklonParfumClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        :root { --orange: #D98A00; --orange-hover: #b87500; --dark: #111827; --paper: #f8f9fa; --line: #e2e8f0; --shadow: 0 12px 24px rgba(0,0,0,0.08); }
        .parfum-lp { font-family:var(--font-sans), system-ui, -apple-system, sans-serif; color:var(--dark); background:#fff; overflow-x:hidden; }
        .parfum-lp h1, .parfum-lp h2, .parfum-lp h3, .parfum-lp b { font-family:var(--font-display), inherit; }
        .parfum-lp img { max-width:100%; height:auto; }
        .parfum-lp a, .parfum-lp button { text-decoration:none; color:inherit; font-family:inherit; }
        .parfum-lp .wrap { max-width:1160px; margin:0 auto; padding:0 24px; }
        .parfum-lp .section { padding:64px 0; }
        
        .parfum-lp .btn { display:inline-block; background:var(--orange); color:#fff; font-weight:800; font-size:15px; letter-spacing:1px; text-transform:uppercase; padding:18px 40px; border-radius:50px; box-shadow:0 12px 24px rgba(217,138,0,0.3); transition:.2s; text-align:center; border:none; cursor:pointer; }
        .parfum-lp .btn:hover { transform:translateY(-2px); filter:saturate(1.08); }
        
        .parfum-lp .hero { position:relative; min-height:85vh; display:flex; align-items:center; padding:100px 0 60px; background:#FAF9F6; overflow:hidden; }
        .parfum-lp .hero-bg { opacity:1; object-position:82% center; }
        .parfum-lp .hero-shade { position:absolute; inset:0; background:linear-gradient(to right, rgba(18,28,45,0.95) 0%, rgba(18,28,45,0.7) 50%, rgba(18,28,45,0) 100%); z-index:10; }
        .parfum-lp .hero-copy { position:relative; z-index:20; color:#fff; max-width:700px; }
        .parfum-lp .eyebrow { display:inline-block; background:rgba(217,138,0,0.2); border:1px solid var(--orange); color:#ffb732; padding:6px 14px; border-radius:30px; font-size:12px; font-weight:800; letter-spacing:1.5px; margin-bottom:24px; }
        .parfum-lp .hero h1 { font-size:52px; font-weight:900; line-height:1.1; margin:0 0 24px; text-transform:uppercase; letter-spacing:-1px; }
        .parfum-lp .hero h1 em { color:var(--orange); font-style:italic; }
        .parfum-lp .hero p { font-size:18px; line-height:1.6; color:rgba(255,255,255,0.8); font-weight:500; margin:0 0 40px; }

        .parfum-lp .metrics { background:var(--paper); padding:40px 0; border-bottom:1px solid var(--line); }
        .parfum-lp .metric-card { background:#fff; border-radius:24px; padding:32px 40px; box-shadow:var(--shadow); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:32px; margin-top:-90px; position:relative; z-index:10; }
        .parfum-lp .metric-card h2 { font-size:24px; font-weight:800; margin:0; max-width:300px; line-height:1.3; }
        .parfum-lp .metric { display:flex; flex-direction:column; }
        .parfum-lp .metric b { font-size:42px; font-weight:900; color:var(--orange); line-height:1; }
        .parfum-lp .metric span { font-size:14px; font-weight:600; color:var(--dark); text-transform:uppercase; letter-spacing:1px; margin-top:4px; }
        .parfum-lp .checks { display:grid; grid-template-columns:repeat(5,1fr); gap:16px; margin-top:40px; align-items: stretch; }
        .parfum-lp .check { display:flex; flex-direction:column; align-items:center; text-align:center; gap:12px; background:#fff; border:1px solid var(--line); padding:20px 16px; border-radius:20px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .parfum-lp .check i { display:flex; align-items:center; justify-content:center; width:40px; height:40px; background:rgba(217,138,0,0.1); color:var(--orange); border-radius:50%; font-style:normal; font-size:20px; font-weight:900; flex-shrink:0; }
        .parfum-lp .check b { display:block; font-size:14px; font-weight:800; text-transform:uppercase; margin:0; line-height:1.3; color:var(--dark); }
        .parfum-lp .check span { font-size:14px; line-height:1.5; color:#555; }

        .parfum-lp .title { text-align:center; max-width:700px; margin:0 auto 32px; }
        .parfum-lp .title h2 { font-size:36px; font-weight:900; margin:12px 0 16px; text-transform:uppercase; line-height:1.15; }
        .parfum-lp .title p { font-size:17px; color:#555; margin:0; }

        .parfum-lp .product-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .parfum-lp .product { position:relative; height:320px; border-radius:24px; overflow:hidden; background:#000; box-shadow:var(--shadow); transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .parfum-lp .product:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(8,18,35,0.25); z-index: 10; }
        .parfum-lp .product img { width:100%; height:100%; object-fit:cover; display:block; transition: transform 0.7s ease; }
        .parfum-lp .product:hover img { transform: scale(1.06); }
        .parfum-lp .product:after { content:''; position:absolute; inset:0; background:linear-gradient(to top, rgba(10,20,35,0.95) 0%, rgba(10,20,35,0.5) 40%, transparent 100%); pointer-events:none; }
        .parfum-lp .product-copy { position:absolute; bottom:24px; left:24px; right:24px; z-index:2; }
        .parfum-lp .product-copy h3 { color:#fff; font-size:24px; font-weight:900; margin:0 0 8px; text-transform:uppercase; text-shadow:0 2px 10px rgba(0,0,0,0.5); }
        .parfum-lp .product-copy p { color:rgba(255,255,255,0.9); font-size:15px; margin:0; line-height:1.5; }

        .parfum-lp .process { background:#4898D3; color:#fff; }
        .parfum-lp .process .title h2 { color:#fff; }
        .parfum-lp .process .title p { color:rgba(255,255,255,0.78); }
        .parfum-lp .process-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:15px; }
        .parfum-lp .step { position:relative; height:340px; border-radius:20px; overflow:hidden; background:#367baf; box-shadow:var(--shadow); display:block; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease; cursor: pointer; }
        .parfum-lp .step:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
        .parfum-lp .step img { width:100%; height:100%; display:block; object-fit:cover; position:relative; z-index:0; transition: transform 0.7s ease; }
        .parfum-lp .step:hover img { transform: scale(1.06); }
        .parfum-lp .step:after { content:''; position:absolute; inset:0; background:linear-gradient(to top, rgba(45,115,165,0.96) 0%, rgba(45,115,165,0.75) 38%, rgba(45,115,165,0.20) 70%, transparent 100%); pointer-events:none; z-index:10; }
        .parfum-lp .step-copy { position:absolute; bottom:28px; left:28px; right:28px; z-index:20; color:#fff; pointer-events:none; }
        .parfum-lp .step-copy b { display:block; color:var(--orange); font-size:14px; font-weight:800; letter-spacing:1px; margin-bottom:8px; text-transform:uppercase; }
        .parfum-lp .step-copy h3 { margin:0 0 12px; font-size:26px; font-weight:800; text-transform:uppercase; color:#fff; line-height:1.15; text-shadow:0 2px 8px rgba(0,0,0,0.35); }
        .parfum-lp .step-copy p { margin:0; color:rgba(255,255,255,0.92); font-size:17px; line-height:1.55; }

        .parfum-lp .academy { background:var(--paper); }
        .parfum-lp .academy-grid { display:grid; grid-template-columns:1.07fr .93fr; gap:58px; align-items:center; }
        .parfum-lp .academy-photo { position:relative; }
        .parfum-lp .academy-photo img { display:block; width:100%; height:500px; object-fit:cover; border-radius:28px; box-shadow:var(--shadow); }
        .parfum-lp .academy-badge { position:absolute; right:-18px; bottom:24px; background:var(--orange); color:#fff; padding:17px 20px; border-radius:16px; font-weight:800; }
        .parfum-lp .academy-copy h2 { font-size:36px; font-weight:900; margin:12px 0 12px; text-transform:uppercase; line-height:1.15; }
        .parfum-lp .academy-copy p { font-size:16px; color:#555; line-height:1.6; margin:0 0 24px; }
        .parfum-lp .academy-list { list-style:none; padding:0; margin:0 0 36px; display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .parfum-lp .academy-list li { background:#fff; border:1px solid var(--line); padding:16px 20px; border-radius:16px; font-weight:700; font-size:15px; display:flex; align-items:center; gap:12px; min-height:80px; }
        .parfum-lp .academy-list li:before { content:'✓'; color:var(--orange); font-size:18px; font-weight:900; }
        .parfum-lp .academy-collage { display:grid; grid-template-columns:1fr 1fr; grid-template-rows:260px 220px; gap:12px; }
        .parfum-lp .academy-collage img { border-radius:20px; }
        .parfum-lp .academy-collage img:first-child { grid-column:1 / -1; }

        .parfum-lp .legal-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .parfum-lp .legal-card { background:#fff; border:1px solid var(--line); border-radius:20px; padding:24px; text-align:center; transition: transform 0.3s ease, border-color 0.3s ease; }
        .parfum-lp .legal-card:hover { transform: translateY(-5px); border-color: var(--orange); }
        .parfum-lp .legal-card b { display:block; font-size:16px; font-weight:800; }

        .parfum-lp .clients-card { background:#fff; border:1px solid var(--line); border-radius:32px; padding:32px; text-align:center; }
        .parfum-lp .clients-card img { max-width:980px; margin:0 auto; display:block; }

        .parfum-lp .closing { text-align:center; background:#fff; padding:64px 24px; border-top:1px solid var(--line); }
        .parfum-lp .closing h2 { font-size:42px; font-weight:900; margin:12px auto 16px; max-width:800px; text-transform:uppercase; line-height:1.15; }
        .parfum-lp .closing p { font-size:18px; color:#555; margin:0 auto 24px; }

        .parfum-lp .wa { position:fixed; bottom:24px; right:24px; width:60px; height:60px; background:#25D366; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:32px; box-shadow:0 12px 24px rgba(37,211,102,0.3); z-index:90; transition:.2s; border:none; cursor:pointer; }
        .parfum-lp .wa:hover { transform:scale(1.1); }

        @media(max-width:1024px){
          .parfum-lp .hero h1 { font-size:42px; }
          .parfum-lp .checks { grid-template-columns:1fr 1fr; }
          .parfum-lp .product-grid { grid-template-columns:1fr 1fr; }
          .parfum-lp .process-grid { grid-template-columns:1fr 1fr; }
          .parfum-lp .academy-grid { grid-template-columns:1fr; }
          .parfum-lp .academy-collage { display:grid; margin-top:32px; }
        }
        @media(max-width:768px){
          .parfum-lp .section { padding:48px 0; }
          .parfum-lp .hero { padding:70px 0 40px; min-height:auto; }
          .parfum-lp .hero h1 { font-size:32px; }
          .parfum-lp .hero p { font-size:16px; }
          .parfum-lp .hero-shade { background:linear-gradient(to bottom, rgba(45,115,165,0.3) 0%, rgba(45,115,165,0.85) 50%, rgba(45,115,165,0.98) 100%); }
          .parfum-lp .metric-card { flex-direction:column; text-align:center; padding:30px 20px; gap:20px; margin-top:20px; }
          .parfum-lp .checks { grid-template-columns:1fr; gap:12px; margin-top:24px; }
          .parfum-lp .check { padding:16px; }
          .parfum-lp .title { margin-bottom:24px; }
          .parfum-lp .title h2 { font-size:28px; }
          .parfum-lp .title p { font-size:15px; }
          .parfum-lp .product-grid { grid-template-columns:1fr; gap:12px; }
          .parfum-lp .process-grid { grid-template-columns:1fr; gap:10px; }
          .parfum-lp .step { display:block; height:300px; min-height:auto; }
          .parfum-lp .step img { height:100%; min-height:auto; }
          .parfum-lp .step-copy { bottom:20px; left:20px; right:20px; padding:0; }
          .parfum-lp .step-copy b { font-size:13px; margin-bottom:8px; }
          .parfum-lp .step-copy h3 { font-size:22px; margin-bottom:10px; }
          .parfum-lp .step-copy p { font-size:15px; }
          .parfum-lp .academy-copy h2 { font-size:32px; }
          .parfum-lp .academy-list { grid-template-columns:1fr; gap:8px; margin:20px 0 24px; }
          .parfum-lp .academy-list li { min-height:0; padding:13px 14px; font-size:14px; line-height:1.4; }
          .parfum-lp .academy .btn { width:100%; }
          .parfum-lp .legal-grid { grid-template-columns:1fr 1fr; gap:9px; }
          .parfum-lp .legal-card { padding:16px; border-radius:12px; }
          .parfum-lp .legal-card img { height:50px !important; margin-bottom:12px !important; }
          .parfum-lp .legal-card b { font-size:13px; }
          .parfum-lp .clients-card { padding:20px; border-radius:16px; }
          .parfum-lp .closing h2 { font-size:32px; }
          .parfum-lp .closing p { font-size:16px; }
          .parfum-lp .closing { padding:48px 20px; }
        }
      `,
        }}
      />
      <div className="parfum-lp">
        <main>
          <section className="hero">
            <Image
              className="hero-bg"
              src="/assets/maklon-parfum/hero-parfum.webp"
              alt="Koleksi botol parfum untuk pengembangan brand"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
            <div className="hero-shade"></div>
            <div className="wrap hero-copy">
              <span className="eyebrow">#1 MAKLON PARFUM CUSTOM AROMA</span>
              <h1>
                <span style={{ color: '#fff' }}>Mau Buat Brand Parfum Custom dengan</span>{' '}
                <em>Aroma Eksklusif?</em>
              </h1>
              <p>
                Dreamlab membantu Anda mengembangkan parfum dari konsep aroma, formulasi, sample,
                legalitas, hingga siap diproduksi dan dipasarkan.
              </p>
              <button
                type="button"
                className="btn track"
                data-location="hero"
                onClick={() => setIsModalOpen(true)}
              >
                KONSULTASI BRAND ANDA &rarr;
              </button>
            </div>
          </section>

          <section className="metrics">
            <div className="wrap">
              <div className="checks" style={{ marginTop: '0px' }}>
                <div className="check">
                  <i>&#10003;</i>
                  <b>1 CLIENT, 1 CUSTOM FORMULA</b>
                </div>
                <div className="check">
                  <i>&#10003;</i>
                  <b>MOQ MENYESUAIKAN</b>
                </div>
                <div className="check">
                  <i>&#10003;</i>
                  <b>FREE Konsultasi Bisnis</b>
                </div>
                <div className="check">
                  <i>&#10003;</i>
                  <b>FREE Pengurusan Legalitas BPOM</b>
                </div>
                <div className="check">
                  <i>&#10003;</i>
                  <b>FREE Marketing KIT Photo Produk</b>
                </div>
              </div>
            </div>
          </section>

          {/* CATALOG SECTION */}
          <section className="section" style={{ background: '#FAF9F6' }}>
            <div className="wrap">
              <div className="title">
                <h2>Ragam Kategori Produk Parfum</h2>
                <p>Formula aroma eksklusif siap kami racik khusus untuk brand Anda.</p>
              </div>

              <div className="product-grid">
                <div className="product" onClick={() => setIsModalOpen(true)}>
                  <Image
                    src="/new asset/produk/parfum/edp.webp"
                    alt="Eau De Parfum"
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="product-copy">
                    <h3>Eau De Parfum</h3>
                    <p>Konsentrasi minyak wangi 15-20%, daya tahan 6-8 jam.</p>
                  </div>
                </div>

                <div className="product" onClick={() => setIsModalOpen(true)}>
                  <Image
                    src="/new asset/produk/parfum/edt.webp"
                    alt="Eau De Toilette"
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="product-copy">
                    <h3>Eau De Toilette</h3>
                    <p>Aroma lebih segar, konsentrasi 5-15%, tahan 3-5 jam.</p>
                  </div>
                </div>

                <div className="product" onClick={() => setIsModalOpen(true)}>
                  <Image
                    src="/new asset/produk/parfum/bodymist.webp"
                    alt="Body Mist / Cologne"
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="product-copy">
                    <h3>Body Mist</h3>
                    <p>Ringan, cocok untuk pemakaian sehari-hari.</p>
                  </div>
                </div>

                <div className="product" onClick={() => setIsModalOpen(true)}>
                  <Image
                    src="/new asset/produk/parfum/solid.webp"
                    alt="Extrait De Parfum"
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="product-copy">
                    <h3>Extrait De Parfum</h3>
                    <p>Konsentrasi tertinggi hingga 30-40%, tahan 12+ jam.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PROCESS SECTION */}
          <section className="process section">
            <div className="wrap">
              <div className="title">
                <h2>Tahapan Maklon Parfum Bersama Dreamlab</h2>
                <p>Alur terstruktur dan pendampingan menyeluruh dari konsep hingga distribusi.</p>
              </div>

              <div className="process-grid">
                <div className="step" onClick={() => setIsModalOpen(true)}>
                  <Image
                    src="/assets/maklon-parfum/konsultasi.webp"
                    alt="Konsultasi Konsep"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="step-copy">
                    <b>Langkah 1</b>
                    <h3>Konsultasi Konsep</h3>
                    <p>Diskusikan target pasar, karakter wangi, dan strategi brand Anda.</p>
                  </div>
                </div>

                <div className="step" onClick={() => setIsModalOpen(true)}>
                  <Image
                    src="/assets/maklon-parfum/formulasi-sample.webp"
                    alt="Formulasi & Sampling"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="step-copy">
                    <b>Langkah 2</b>
                    <h3>Formulasi &amp; Sample</h3>
                    <p>Pengembangan aroma unik sampai Anda menemukan racikan yang tepat.</p>
                  </div>
                </div>

                <div className="step" onClick={() => setIsModalOpen(true)}>
                  <Image
                    src="/assets/maklon-parfum/legalitas.webp"
                    alt="Legalitas & Desain"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="step-copy">
                    <b>Langkah 3</b>
                    <h3>Legalitas &amp; Desain</h3>
                    <p>Pengurusan izin edar BPOM, Halal, serta desain kemasan eksklusif.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CREDIBILITY & CLIENT LOGOS */}
          <AdsCredibilitySection channel="google-ads" />
          <LogoScroll
            logos={aboutData.partnerLogos}
            headline="DIPERCAYA 500+ BRAND UNTUK MENGEMBANGKAN PRODUK BEAUTY"
            subHeadline="Dipercaya oleh berbagai brand beauty untuk mengembangkan produk yang siap bersaing di pasar."
          />

          {/* CLOSING SECTION */}
          <section className="closing">
            <div className="wrap">
              <h2>Siap Luncurkan Brand Parfum Anda Sendiri?</h2>
              <p>Konsultasikan rencana formula, MOQ, dan legalitas bersama Business Consultant Dreamlab.</p>
              <button
                type="button"
                className="btn track"
                data-location="closing"
                onClick={() => setIsModalOpen(true)}
              >
                KONSULTASIKAN SEKARANG &rarr;
              </button>
            </div>
          </section>
        </main>

        {/* Floating WA Button */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="wa track"
          data-location="floating-whatsapp"
          aria-label="Konsultasi WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </button>
      </div>

      {/* Production Journey Qualification Modal */}
      <LeadQualificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultCategory="Parfum"
        source="google-parfum"
        channel="google-ads"
        landingPage="/google-ads/maklon-parfum/"
      />
    </>
  );
}
