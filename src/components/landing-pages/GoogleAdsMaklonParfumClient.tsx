'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { AdsCredibilitySection } from '@/components/landing-pages/AdsCredibilitySection';
import { aboutData } from '@/data/about-us';
import { LeadQualificationModal } from '@/components/LeadQualificationModal';
import { trackLeadEvent } from '@/lib/lead-analytics';

const LogoScroll = dynamic(() => import('@/components/LogoScroll'), {
  ssr: true,
  loading: () => <div className="py-14 bg-white" />,
});

export function GoogleAdsMaklonParfumClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const dataLayer = ((window as any).dataLayer = (window as any).dataLayer || []);
    dataLayer.push({ event: 'view_landing_page', service: 'google_maklon_parfum' });
  }, []);

  const openQualification = (location: string) => {
    trackLeadEvent('consultation_cta_clicked', {
      source: 'google-parfum',
      channel: 'google-ads',
      category: 'Parfum',
    });
    setIsModalOpen(true);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
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
        .parfum-lp .title p { font-size:18px; color:#555; line-height:1.6; margin:0; }

        .parfum-lp .product-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .parfum-lp .product { position:relative; height:390px; border-radius:18px; overflow:hidden; display:block; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease; cursor:pointer; }
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
        .parfum-lp .academy-copy h2 { font-size:38px; font-weight:900; margin:12px 0 16px; line-height:1.15; text-transform:uppercase; }
        .parfum-lp .academy-copy p { font-size:18px; color:#555; line-height:1.6; margin:0 0 24px; }
        .parfum-lp .academy-list { list-style:none; padding:0; margin:0 0 32px; display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .parfum-lp .academy-list li { display:flex; align-items:center; gap:12px; font-size:15px; font-weight:700; color:var(--dark); background:#fff; padding:16px 20px; border-radius:16px; border:1px solid var(--line); box-shadow:0 4px 12px rgba(0,0,0,0.02); }
        .parfum-lp .academy-list li:before { content:'✓'; display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; background:rgba(217,138,0,0.1); color:var(--orange); border-radius:50%; font-size:14px; font-weight:900; flex-shrink:0; }
        .parfum-lp .academy-collage { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .parfum-lp .academy-collage img { width:100%; height:180px; object-fit:cover; border-radius:18px; box-shadow:var(--shadow); }
        .parfum-lp .academy-collage img:first-child { grid-column:span 2; height:240px; }

        .parfum-lp .closing { text-align:center; padding:96px 24px; background:#FAF9F6; position:relative; overflow:hidden; }
        .parfum-lp .closing h2 { font-size:48px; font-weight:900; margin:12px 0 16px; text-transform:uppercase; line-height:1.1; }
        .parfum-lp .closing p { font-size:18px; color:#555; line-height:1.6; max-width:600px; margin:0 auto 36px; }

        .parfum-lp .wa { position:fixed; bottom:32px; right:32px; width:64px; height:64px; background:#25d366; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:32px; box-shadow:0 8px 24px rgba(37,211,102,0.4); z-index:99; transition:transform .2s; border:none; cursor:pointer; }
        .parfum-lp .wa:hover { transform:scale(1.08); }

        @media(max-width:1024px){
          .parfum-lp .checks { grid-template-columns:repeat(2,1fr); }
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
      `}} />
      <div className="parfum-lp">
        <main>
          <section className="hero">
            <Image className="hero-bg" src="/assets/maklon-parfum/hero-parfum.webp" alt="Koleksi botol parfum untuk pengembangan brand" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
            <div className="hero-shade"></div>
            <div className="wrap hero-copy">
              <span className="eyebrow">#1 MAKLON PARFUM CUSTOM AROMA</span>
              <h1><span style={{color:"#fff"}}>Mau Buat Brand Parfum Custom dengan</span> <em>Aroma Eksklusif?</em></h1>
              <p>Dreamlab membantu Anda mengembangkan parfum dari konsep aroma, formulasi, sample, legalitas, hingga siap diproduksi dan dipasarkan.</p>
              
              {/* Primary Google Ads CTA */}
              <button
                type="button"
                className="btn track"
                data-location="hero"
                onClick={() => openQualification('hero')}
              >
                Konsultasikan Produksi Anda &rarr;
              </button>
            </div>
          </section>

          <section className="metrics">
            <div className="wrap">
              <div className="metric-card">
                <h2>BANYAK BRAND TELAH MEMULAI BERSAMA KAMI</h2>
                <div className="metric"><b>500+</b><span>Brand Aktif</span></div>
                <div className="metric"><b>1.000+</b><span>Formula Teruji</span></div>
                <div className="metric"><b>Grade A</b><span>Standar Pabrik</span></div>
              </div>
              <div className="checks">
                <div className="check"><i>✓</i><b>1 CLIENT 1 FORMULA</b><span>Formula eksklusif tidak diduplikasi</span></div>
                <div className="check"><i>✓</i><b>FREE FORMULA &amp; SAMPLE</b><span>Uji sampel hingga karakter aroma sesuai</span></div>
                <div className="check"><i>✓</i><b>FREE DESAIN KEMASAN</b><span>Didukung tim desainer profesional</span></div>
                <div className="check"><i>✓</i><b>LEGALITAS LENGKAP</b><span>Izin BPOM &amp; Halal kami bantu proses</span></div>
                <div className="check"><i>✓</i><b>DIGITAL MARKETING</b><span>Dukungan edukasi strategi penjualan</span></div>
              </div>
            </div>
          </section>

          <section className="catalog section">
            <div className="wrap">
              <div className="title">
                <span className="eyebrow">KATALOG MAKLON PARFUM</span>
                <h2>PILIHAN KATEGORI PRODUK PARFUM</h2>
                <p>Tentukan konsentrasi dan karakter wewangian yang sesuai dengan konsep brand dan target market Anda.</p>
              </div>
              <div className="product-grid">
                <div className="product" onClick={() => openQualification('catalog-edp')} role="button" tabIndex={0}>
                  <Image src="/assets/maklon-parfum/edp.webp" alt="Eau de Parfum" fill loading="lazy" sizes="(max-width: 760px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                  <div className="product-copy"><h3>Eau de Parfum</h3><p>Konsentrasi aroma kuat dan tahan lama.</p></div>
                </div>
                <div className="product" onClick={() => openQualification('catalog-edt')} role="button" tabIndex={0}>
                  <Image src="/assets/maklon-parfum/edt.webp" alt="Eau de Toilette" fill loading="lazy" sizes="(max-width: 760px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                  <div className="product-copy"><h3>Eau de Toilette</h3><p>Segar dan nyaman untuk pemakaian harian.</p></div>
                </div>
                <div className="product" onClick={() => openQualification('catalog-edc')} role="button" tabIndex={0}>
                  <Image src="/assets/maklon-parfum/edc.webp" alt="Eau de Cologne" fill loading="lazy" sizes="(max-width: 760px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                  <div className="product-copy"><h3>Eau de Cologne</h3><p>Ringan dengan kesan menyegarkan.</p></div>
                </div>
                <div className="product" onClick={() => openQualification('catalog-extrait')} role="button" tabIndex={0}>
                  <Image src="/assets/maklon-parfum/extrait.webp" alt="Extrait de Parfum" fill loading="lazy" sizes="(max-width: 760px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                  <div className="product-copy"><h3>Extrait de Parfum</h3><p>Konsentrasi tinggi untuk lini premium.</p></div>
                </div>
                <div className="product" onClick={() => openQualification('catalog-body-mist')} role="button" tabIndex={0}>
                  <Image src="/assets/maklon-parfum/body-mist.webp" alt="Body Mist" fill loading="lazy" sizes="(max-width: 760px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                  <div className="product-copy"><h3>Body Mist</h3><p>Ringan, praktis, dan mudah digunakan ulang.</p></div>
                </div>
                <div className="product" onClick={() => openQualification('catalog-essential-oil')} role="button" tabIndex={0}>
                  <Image src="/assets/maklon-parfum/essential-oil.webp" alt="Essential Oil" fill loading="lazy" sizes="(max-width: 760px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                  <div className="product-copy"><h3>Essential Oil</h3><p>Eksplorasi aroma dari bahan esensial.</p></div>
                </div>
              </div>
            </div>
          </section>

          <section className="process section">
            <div className="wrap">
              <div className="title">
                <span className="eyebrow">ALUR PENGEMBANGAN</span>
                <h2>5 TAHAP MAKLON PARFUM DARI IDE HINGGA SIAP PRODUKSI</h2>
                <p>Setiap tahap didampingi Dreamlab, mulai dari menentukan konsep aroma, formulasi, legalitas, produksi, hingga produk siap dikirim.</p>
              </div>
              <div className="process-grid">
                <article className="step" onClick={() => openQualification('step-1')}><Image src="/assets/maklon-parfum/consultation.webp" alt="Konsultasi IDE" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} /><div className="step-copy"><b>STEP 01</b><h3>KONSULTASI BRAND &amp; TARGET MARKET</h3><p>Diskusikan konsep parfum, target market, positioning, dan karakter aroma yang ingin dibangun.</p></div></article>
                <article className="step" onClick={() => openQualification('step-2')}><Image src="/assets/maklon-parfum/sample.webp" alt="Formulasi & Sample" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} /><div className="step-copy"><b>STEP 02</b><h3>FORMULASI &amp; SAMPLE AROMA</h3><p>Tim R&amp;D mengembangkan formula dan sample sesuai brief hingga menemukan karakter aroma yang tepat.</p></div></article>
                <article className="step" onClick={() => openQualification('step-3')}><Image src="/assets/maklon-parfum/legal-design.webp" alt="Legalitas & Desain" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} /><div className="step-copy"><b>STEP 03</b><h3>LEGALITAS &amp; DESAIN</h3><p>Setelah formula disetujui, proses dilanjutkan ke legalitas serta pengembangan desain kemasan brand.</p></div></article>
                <article className="step" onClick={() => openQualification('step-4')}><Image src="/assets/maklon-parfum/production.webp" alt="Produksi & Quality Control" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} /><div className="step-copy"><b>STEP 04</b><h3>PRODUKSI &amp; QUALITY CONTROL</h3><p>Produk masuk tahap produksi dan quality control sesuai standar fasilitas Dreamlab.</p></div></article>
                <article className="step" onClick={() => openQualification('step-5')}><Image src="/assets/maklon-parfum/delivery.webp" alt="Delivery" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} /><div className="step-copy"><b>STEP 05</b><h3>DELIVERY &amp; SIAP LAUNCHING</h3><p>Produk yang selesai diproduksi dipersiapkan untuk pengiriman dan siap masuk ke tahap pemasaran.</p></div></article>
              </div>
              
              <div style={{ textAlign: "center", marginTop: "32px" }}>
                <button
                  type="button"
                  className="btn track"
                  data-location="process"
                  onClick={() => openQualification('process')}
                >
                  Konsultasikan Produksi Anda &rarr;
                </button>
              </div>
            </div>
          </section>

          <section className="academy section">
            <div className="wrap academy-grid">
              <div className="academy-copy">
                <span className="eyebrow">FREE BEAUTYPRENEUR COMMUNITY</span>
                <h2>Hanya di Dreamlab, Brand Anda Bukan Sekadar Diproduksi, tetapi Juga Dibimbing untuk Bertumbuh</h2>
                <p>Nikmati pendampingan praktis untuk memperkuat branding dan meningkatkan penjualan online.</p>
                <ul className="academy-list">
                  <li>Mentoring strategi digital marketing</li>
                  <li>Panduan membangun branding dan positioning produk</li>
                  <li>Strategi memasarkan dan menjual produk secara online</li>
                  <li>Networking bersama komunitas beautypreneur</li>
                </ul>
                <button
                  type="button"
                  className="btn track"
                  data-location="academy"
                  onClick={() => openQualification('academy')}
                >
                  Jadi Partner Dreamlab &rarr;
                </button>
              </div>
              <div className="academy-collage">
                <Image src="/assets/maklon-parfum/academy-community.webp" alt="Komunitas beautypreneur Dreamlab" width={500} height={500} loading="lazy" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                <Image src="/assets/maklon-parfum/academy-digital-marketing.webp" alt="Mentoring digital marketing" width={500} height={500} loading="lazy" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                <Image src="/assets/maklon-parfum/academy-branding.webp" alt="Sesi branding Dreamlab Academy" width={500} height={500} loading="lazy" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              </div>
            </div>
          </section>

          {/* CREDIBILITY / CERTIFICATIONS BANNER */}
          <AdsCredibilitySection channel="google-ads" />

          {/* BRAND / OUR CLIENT - LOGO BERJALAN */}
          <LogoScroll 
            logos={aboutData.partnerLogos} 
            headline="DIPERCAYA 500+ BRAND UNTUK MENGEMBANGKAN PRODUK BEAUTY"
            subHeadline="Dipercaya oleh berbagai brand beauty untuk mengembangkan produk yang siap bersaing di pasar."
          />

          <section className="closing">
            <span className="eyebrow">MULAI DARI IDE AROMA ANDA</span>
            <h2>SIAP MEMBANGUN BRAND PARFUM ANDA?</h2>
            <p>Mulai dari konsep aroma sampai siap masuk market bersama Dreamlab.</p>
            <button
              type="button"
              className="btn track"
              data-location="closing"
              onClick={() => openQualification('closing')}
            >
              Konsultasikan Produksi Anda &rarr;
            </button>
          </section>
        </main>
        
        {/* Floating WhatsApp Button */}
        <button
          type="button"
          className="wa track"
          data-location="floating-whatsapp"
          onClick={() => openQualification('floating-whatsapp')}
          aria-label="Konsultasi WhatsApp"
        >
          ✆
        </button>
      </div>

      {/* Qualification Modal */}
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
