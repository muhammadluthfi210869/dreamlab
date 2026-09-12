"use client";
import Link from "next/link";
import Script from "next/script";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getProductDataV2 } from "@/data/products-v2";
import ProductGrid from "@/components/ProductPageV2/ProductGrid";
import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { AdsCredibilitySection } from "@/components/landing-pages/AdsCredibilitySection";
import { aboutData } from "@/data/about-us";
import { useMetaAdsCtaPixel } from "@/lib/meta-ads-pixel";

const LogoScroll = dynamic(() => import("@/components/LogoScroll"), { 
  ssr: true,
  loading: () => <div className="py-14 bg-white" />
});

export default function MaklonBodyCareLanding({ source }: { source: "google_ads" | "meta_ads" }) {
  useMetaAdsCtaPixel(source === "meta_ads" ? "Maklon Body Care" : "");

  const ctaHref = source === "meta_ads"
    ? "/ads/thankyou/metaads/?source=meta-bodycare&from=/maklon-bodycare-ads/"
    : "/ads/thankyou/google-ads/?source=google-bodycare&from=/google-ads/maklon-body-care/";
  const bodycareData = getProductDataV2("bodycare");
  const targetSlugs = ["body-serum", "body-scrub", "body-wash", "underarm-cream"];
  const filteredProducts = bodycareData?.products?.filter(p => targetSlugs.includes(p.slug)) || [];
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root { --orange: #D98A00; --orange-hover: #b87500; --dark: #111827; --paper: #f8f9fa; --line: #e2e8f0; --shadow: 0 12px 24px rgba(0,0,0,0.08); }
        .bodycare-lp { font-family:var(--font-sans), system-ui, -apple-system, sans-serif; color:var(--dark); background:#fff; overflow-x:hidden; }
        .bodycare-lp h1, .bodycare-lp h2, .bodycare-lp h3, .bodycare-lp b { font-family:var(--font-display), inherit; }
        .bodycare-lp img { max-width:100%; height:auto; }
        .bodycare-lp a { text-decoration:none; color:inherit; }
        .bodycare-lp .wrap { max-width:1160px; margin:0 auto; padding:0 24px; }
        .bodycare-lp .section { padding:64px 0; }
        
        .bodycare-lp .btn { display:inline-block; background:var(--orange); color:#fff; font-weight:800; font-size:15px; letter-spacing:1px; text-transform:uppercase; padding:18px 40px; border-radius:50px; box-shadow:0 12px 24px rgba(217,138,0,0.3); transition:.2s; text-align:center; }
        .bodycare-lp .btn:hover { transform:translateY(-2px); filter:saturate(1.08); }
        
        .bodycare-lp .hero { position:relative; min-height:85vh; display:flex; align-items:center; padding:100px 0 60px; background:#FAF9F6; overflow:hidden; }
        .bodycare-lp .hero-bg { opacity:1; object-position:82% center; }
        .bodycare-lp .hero-shade { position:absolute; inset:0; background:linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 45%, rgba(255,255,255,0) 100%); z-index:10; }
        .bodycare-lp .hero-copy { position:relative; z-index:20; color:var(--dark); max-width:760px; margin-left: 48px; }
        .bodycare-lp .eyebrow { display:inline-block; background:rgba(217,138,0,0.2); border:1px solid var(--orange); color:#ffb732; padding:6px 14px; border-radius:30px; font-size:12px; font-weight:800; letter-spacing:1.5px; margin-bottom:24px; }
        .bodycare-lp .hero h1 { font-size:52px; font-weight:900; line-height:1.1; margin:0 0 24px; text-transform:uppercase; letter-spacing:-1px; }
        .bodycare-lp .hero h1 em { color:var(--orange); font-style:italic; }
        .bodycare-lp .hero p { font-size:18px; line-height:1.6; color:#555; font-weight:500; margin:0 0 40px; }
        
        
        

        
          .bodycare-lp .metrics { position:relative; margin-top:-32px; z-index:50; }
          .bodycare-lp .metric-card { background:#FFFFFF; border:1px solid #E5EAF2; border-radius:24px; padding:28px; box-shadow:0 4px 20px rgba(0,0,0,0.04); display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); align-items:center; width:calc(100% - 32px); max-width:760px; margin-left:auto; margin-right:auto; margin-bottom:60px; }
          .bodycare-lp .stat { text-align:center; }
          .bodycare-lp .stat.divider { border-left:1px solid #E5EAF2; }
          .bodycare-lp .number { color:#2F6BFF; font-weight:800; font-size:48px; line-height:1; }
          .bodycare-lp .label { margin-top:8px; color:#334155; font-weight:700; font-size:14px; line-height:1.35; letter-spacing:0.03em; text-transform:uppercase; }
        
          .bodycare-lp .value-checks { display:grid; grid-template-columns:repeat(4, 1fr); gap:16px; }
          @media (max-width: 1024px) {
            .bodycare-lp .value-checks { grid-template-columns:repeat(2, 1fr); }
          }
          @media (max-width: 768px) {
            .bodycare-lp .value-checks { grid-template-columns:1fr; }
            .bodycare-lp .process-grid { grid-template-columns:1fr; gap:16px; }
          }

          .bodycare-lp .checks { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-top:40px; align-items: stretch; }
        .bodycare-lp .check { display:flex; flex-direction:column; align-items:center; text-align:center; gap:12px; background:#fff; border:1px solid var(--line); padding:20px 16px; border-radius:20px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .bodycare-lp .check i { display:flex; align-items:center; justify-content:center; width:40px; height:40px; background:rgba(217,138,0,0.1); color:var(--orange); border-radius:50%; font-style:normal; font-size:20px; font-weight:900; flex-shrink:0; }
        .bodycare-lp .check b { display:block; font-size:14px; font-weight:800; text-transform:uppercase; margin:0; line-height:1.3; color:var(--dark); }
        .bodycare-lp .check span { font-size:14px; line-height:1.5; color:#555; }

        .bodycare-lp .title { text-align:center; max-width:700px; margin:0 auto 32px; }
        .bodycare-lp .title h2 { font-size:36px; font-weight:900; margin:12px 0 16px; text-transform:uppercase; line-height:1.15; }
        .bodycare-lp .title p { font-size:18px; color:#555; line-height:1.6; margin:0; }

        .bodycare-lp .product-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:16px; }
        .bodycare-lp .product { position:relative; height:390px; border-radius:18px; overflow:hidden; display:block; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease; }
        .bodycare-lp .product:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(8,18,35,0.25); z-index: 10; }
        .bodycare-lp .product img { width:100%; height:100%; object-fit:cover; display:block; transition: transform 0.7s ease; }
        .bodycare-lp .product:hover img { transform: scale(1.06); }
        .bodycare-lp .product:after { content:''; position:absolute; inset:0; background:linear-gradient(to top, rgba(10,20,35,0.95) 0%, rgba(10,20,35,0.5) 40%, transparent 100%); pointer-events:none; }
        .bodycare-lp .product-copy { position:absolute; bottom:24px; left:24px; right:24px; z-index:2; }
        .bodycare-lp .product-copy h3 { color:#fff; font-size:24px; font-weight:900; margin:0 0 8px; text-transform:uppercase; text-shadow:0 2px 10px rgba(0,0,0,0.5); }
        .bodycare-lp .product-copy p { color:rgba(255,255,255,0.9); font-size:15px; margin:0; line-height:1.5; }

        .bodycare-lp .process { background:#4898D3; color:#fff; }
        .bodycare-lp .process .title h2 { color:#fff; }
        .bodycare-lp .process .title p { color:rgba(255,255,255,0.78); }
        .bodycare-lp .process-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:15px; }
        .bodycare-lp .step { position:relative; height:400px; border-radius:20px; overflow:hidden; background:#367baf; box-shadow:var(--shadow); display:block; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease; cursor: pointer; }
        .bodycare-lp .step:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
        .bodycare-lp .step img { width:100%; height:100%; display:block; object-fit:cover; position:relative; z-index:0; transition: transform 0.7s ease; }
        .bodycare-lp .step:hover img { transform: scale(1.06); }
        .bodycare-lp .step:after { content:''; position:absolute; inset:0; background:linear-gradient(to top, rgba(45,115,165,0.96) 0%, rgba(45,115,165,0.75) 38%, rgba(45,115,165,0.20) 70%, transparent 100%); pointer-events:none; z-index:10; }
        .bodycare-lp .step-copy { position:absolute; bottom:28px; left:28px; right:28px; z-index:20; color:#fff; pointer-events:none; }
        .bodycare-lp .step-copy b { display:block; color:var(--orange); font-size:14px; font-weight:800; letter-spacing:1px; margin-bottom:8px; text-transform:uppercase; }
        .bodycare-lp .step-copy h3 { margin:0 0 12px; font-size:18px; font-weight:800; text-transform:uppercase; color:#fff; line-height:1.15; text-shadow:0 2px 8px rgba(0,0,0,0.35); }
        .bodycare-lp .step-copy p { margin:0; color:rgba(255,255,255,0.92); font-size:14px; line-height:1.55; }

        .bodycare-lp .academy { background:var(--paper); }
        .bodycare-lp .academy-grid { display:grid; grid-template-columns:1.07fr .93fr; gap:58px; align-items:center; }
        .bodycare-lp .academy-photo { position:relative; }
        .bodycare-lp .academy-photo img { display:block; width:100%; height:500px; object-fit:cover; border-radius:28px; box-shadow:var(--shadow); }
        .bodycare-lp .academy-badge { position:absolute; right:-18px; bottom:24px; background:var(--orange); color:#fff; padding:17px 20px; border-radius:16px; font-weight:800; }
        .bodycare-lp .academy-copy h2 { font-size:36px; font-weight:900; margin:12px 0 12px; text-transform:uppercase; line-height:1.15; }
        .bodycare-lp .academy-copy p { font-size:16px; color:#555; line-height:1.6; margin:0 0 24px; }
        .bodycare-lp .academy-list { list-style:none; padding:0; margin:0 0 36px; display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .bodycare-lp .academy-list li { background:#fff; border:1px solid var(--line); padding:16px 20px; border-radius:16px; font-weight:700; font-size:15px; display:flex; align-items:center; gap:12px; min-height:80px; }
        .bodycare-lp .academy-list li:before { content:'✓'; color:var(--orange); font-size:18px; font-weight:900; }
        .bodycare-lp .academy-collage { display:grid; grid-template-columns:1fr 1fr; grid-template-rows:260px 220px; gap:12px; }
        .bodycare-lp .academy-collage img { border-radius:20px; }
        .bodycare-lp .academy-collage img:first-child { grid-column:1 / -1; }

        .bodycare-lp .legal-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .bodycare-lp .legal-card { background:#fff; border:1px solid var(--line); border-radius:20px; padding:24px; text-align:center; transition: transform 0.3s ease, border-color 0.3s ease; }
        .bodycare-lp .legal-card:hover { transform: translateY(-5px); border-color: var(--orange); }
        .bodycare-lp .legal-card b { display:block; font-size:16px; font-weight:800; }

        .bodycare-lp .clients-card { background:#fff; border:1px solid var(--line); border-radius:32px; padding:32px; text-align:center; }
        .bodycare-lp .clients-card img { max-width:980px; margin:0 auto; display:block; }

        .bodycare-lp .closing { text-align:center; background:#fff; padding:64px 24px; border-top:1px solid var(--line); }
        .bodycare-lp .closing h2 { font-size:42px; font-weight:900; margin:12px auto 16px; max-width:800px; text-transform:uppercase; line-height:1.15; }
        .bodycare-lp .closing p { font-size:18px; color:#555; margin:0 auto 24px; }

        .bodycare-lp .wa { position:fixed; bottom:24px; right:24px; width:60px; height:60px; background:#25D366; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:32px; box-shadow:0 12px 24px rgba(37,211,102,0.3); z-index:90; transition:.2s; text-decoration:none; }
        .bodycare-lp .wa:hover { transform:scale(1.1); }

        @media(max-width:1024px){
          .bodycare-lp .hero h1 { font-size:42px; }
          
          .bodycare-lp .value-checks { display:grid; grid-template-columns:repeat(4, 1fr); gap:16px; }
          @media (max-width: 1024px) {
            .bodycare-lp .value-checks { grid-template-columns:repeat(2, 1fr); }
          }
          @media (max-width: 768px) {
            .bodycare-lp .value-checks { grid-template-columns:1fr; }
            .bodycare-lp .process-grid { grid-template-columns:1fr; gap:16px; }
          }

          .bodycare-lp .checks { grid-template-columns:1fr 1fr; }
          .bodycare-lp .product-grid { grid-template-columns:1fr 1fr; }
          .bodycare-lp .process-grid { grid-template-columns:repeat(3,1fr); gap: 16px; }
          .bodycare-lp .academy-grid { grid-template-columns:1fr; }
          .bodycare-lp .academy-collage { display:grid; margin-top:32px; }
        }
        @media(max-width:768px){
          .bodycare-lp .section { padding:48px 0; }
          .bodycare-lp .hero { padding:160px 0 60px; min-height:auto; }
          .bodycare-lp .hero h1 { font-size:32px; }
          .bodycare-lp .hero p { font-size:16px; }
          .bodycare-lp .hero-copy { text-align:center; margin:0 auto; display:flex; flex-direction:column; align-items:center; }
          .bodycare-lp .hero-shade { background:linear-gradient(to bottom, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,1) 100%); }
          .bodycare-lp .metric-card { grid-template-columns:1fr; padding:24px 16px; gap:24px; }
          .bodycare-lp .stat.divider { border-left:none; border-top:1px solid #E5EAF2; padding-top:24px; }
          .bodycare-lp .number { font-size:40px; }
          
          .bodycare-lp .value-checks { display:grid; grid-template-columns:repeat(4, 1fr); gap:16px; }
          @media (max-width: 1024px) {
            .bodycare-lp .value-checks { grid-template-columns:repeat(2, 1fr); }
          }
          @media (max-width: 768px) {
            .bodycare-lp .value-checks { grid-template-columns:1fr; }
            .bodycare-lp .process-grid { grid-template-columns:1fr; gap:16px; }
          }

          .bodycare-lp .checks { grid-template-columns:1fr; gap:12px; margin-top:24px; }
          .bodycare-lp .check { padding:16px; }
          .bodycare-lp .title { margin-bottom:24px; }
          .bodycare-lp .title h2 { font-size:28px; }
          .bodycare-lp .title p { font-size:15px; }
          .bodycare-lp .product-grid { grid-template-columns:1fr; gap:12px; }
          .bodycare-lp .process-grid { grid-template-columns:1fr; gap:10px; }
          .bodycare-lp .step { display:block; height:300px; min-height:auto; }
          .bodycare-lp .step img { height:100%; min-height:auto; }
          .bodycare-lp .step-copy { bottom:20px; left:20px; right:20px; padding:0; }
          .bodycare-lp .step-copy b { font-size:13px; margin-bottom:8px; }
          .bodycare-lp .step-copy h3 { font-size:22px; margin-bottom:10px; }
          .bodycare-lp .step-copy p { font-size:15px; }
          .bodycare-lp .academy-copy h2 { font-size:32px; }
          .bodycare-lp .academy-list { grid-template-columns:1fr; gap:8px; margin:20px 0 24px; }
          .bodycare-lp .academy-list li { min-height:0; padding:13px 14px; font-size:14px; line-height:1.4; }
          .bodycare-lp .academy .btn { width:100%; }
          .bodycare-lp .legal-grid { grid-template-columns:1fr 1fr; gap:9px; }
          .bodycare-lp .legal-card { padding:16px; border-radius:12px; }
          .bodycare-lp .legal-card img { height:50px !important; margin-bottom:12px !important; }
          .bodycare-lp .legal-card b { font-size:13px; }
          .bodycare-lp .clients-card { padding:20px; border-radius:16px; }
          .bodycare-lp .closing h2 { font-size:32px; }
          .bodycare-lp .closing p { font-size:16px; }
          .bodycare-lp .closing { padding:48px 20px; }
          
        }
      `}} />
      <div className="bodycare-lp">
        <main>
          <section className="hero">
            <Image className="hero-bg" src="/new asset/landing page/skincare.webp" alt="Koleksi produk body care untuk pengembangan brand" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
            <div className="hero-shade"></div>
            <div className="wrap hero-copy">
              <span className="eyebrow">#1 Maklon Bodycare</span>
              <h1><span>Mau Buat Brand Body Care Custom dengan</span> <em>Formula Eksklusif?</em></h1>
              <a className="btn track" data-location="hero" href={ctaHref}>KONSULTASI BRAND ANDA &rarr;</a>
              
            </div>
          </section>

          
          <section className="metrics">
            <div className="metric-card">
              <div className="stat">
                <div className="number">500++</div>
                <div className="label">BRAND TELAH BEKERJA SAMA</div>
              </div>
              <div className="stat divider">
                <div className="number">1000+</div>
                <div className="label">PRODUK TELAH DIKEMBANGKAN</div>
              </div>
            </div>
            <div className="wrap">
              <div className="title" style={{marginBottom: "20px", marginTop: "60px"}}>
                <h2 style={{fontSize:"28px"}}>MENGAPA MEMILIH DREAMLAB?</h2>
              </div>
              <div className="checks value-checks" style={{marginTop: "0px"}}>
                <div className="check" style={{background: "#fff", borderColor:"var(--orange)"}}><i>&#10003;</i><b>1 Klien 1 Formula</b><span>Formula eksklusif tidak pasaran</span></div>
                <div className="check" style={{background: "#fff", borderColor:"var(--orange)"}}><i>&#10003;</i><b>3 Bulan Siap Jual</b><span>Proses cepat dari nol</span></div>
                <div className="check" style={{background: "#fff", borderColor:"var(--orange)"}}><i>&#10003;</i><b>MOQ Fleksibel</b><span>Mulai brand tanpa ribet</span></div>
                <div className="check" style={{background: "#fff", borderColor:"var(--orange)"}}><i>&#10003;</i><b>BPOM & Halal</b><span>Terjamin kualitasnya</span></div>
              </div>
            </div>
          </section>



          

          <section className="catalog section pb-0 mt-0" style={{paddingBottom: "64px"}}>
            <div className="wrap" style={{maxWidth: "1280px"}}>
              {bodycareData && filteredProducts.length > 0 && (
                <ProductGrid products={filteredProducts} categorySlug={bodycareData.slug} />
              )}
              <div style={{ textAlign: "center", marginTop: "40px" }}>
                <a className="btn" style={{background: "var(--dark)", color: "#fff"}} href="/produk/bodycare/">EXPLORE PRODUK LAINNYA &rarr;</a>
              </div>
            </div>
          </section>

          <section className="metrics" style={{paddingTop: "20px", borderBottom: "none", backgroundColor: "#fdfdfd"}}>
            <div className="wrap">
              <div className="title" style={{marginBottom: "20px"}}>
                <h2 style={{fontSize:"28px"}}>TREND BODYCARE 2026</h2>
                <p>Formula yang paling dicari oleh konsumen saat ini.</p>
              </div>

              <div className="checks value-checks" style={{marginTop: "0px"}}>
                <div className="check"><i>&#10003;</i><b>Barrier & Hydration</b></div>
                <div className="check"><i>&#10003;</i><b>Body Serum & Sunscreen</b></div>
                <div className="check"><i>&#10003;</i><b>Signature Fragrance</b></div>
                <div className="check"><i>&#10003;</i><b>Active Ingredient Body Care</b></div>
              </div>
            </div>
          </section>

          <section className="process section">
            <div className="wrap">
              <div className="title">
                <span className="eyebrow">ALUR PENGEMBANGAN</span>
                <h2>5 TAHAP MAKLON BODY CARE DARI IDE HINGGA SIAP PRODUKSI</h2>
                <p>Setiap tahap didampingi Dreamlab, mulai dari menentukan konsep aroma, formulasi, legalitas, produksi, hingga produk siap dikirim.</p>
              </div>
              <div className="process-grid">
                <article className="step"><Image src="/assets/maklon-parfum/consultation.webp" alt="Konsultasi IDE" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} /><div className="step-copy"><b>STEP 01</b><h3>KONSULTASI BRAND &amp; TARGET MARKET</h3><p>Diskusikan konsep body care, target market, positioning, dan formula dan tekstur yang ingin dibangun.</p></div></article>
                <article className="step"><Image src="/assets/maklon-parfum/sample.webp" alt="Formulasi & Sample" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} /><div className="step-copy"><b>STEP 02</b><h3>FORMULASI &amp; SAMPLE FORMULA</h3><p>Tim R&amp;D mengembangkan formula dan sample sesuai brief hingga menemukan tekstur dan khasiat yang tepat.</p></div></article>
                <article className="step"><Image src="/assets/maklon-parfum/legal-design.webp" alt="Legalitas & Desain" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} /><div className="step-copy"><b>STEP 03</b><h3>LEGALITAS &amp; DESAIN</h3><p>Setelah formula disetujui, proses dilanjutkan ke legalitas serta pengembangan desain kemasan brand.</p></div></article>
                <article className="step"><Image src="/assets/maklon-parfum/production.webp" alt="Produksi & Quality Control" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} /><div className="step-copy"><b>STEP 04</b><h3>PRODUKSI &amp; QUALITY CONTROL</h3><p>Produk masuk tahap produksi dan quality control sesuai standar fasilitas Dreamlab.</p></div></article>
                <article className="step"><Image src="/assets/maklon-parfum/delivery.webp" alt="Delivery" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} /><div className="step-copy"><b>STEP 05</b><h3>DELIVERY &amp; SIAP LAUNCHING</h3><p>Produk yang selesai diproduksi dipersiapkan untuk pengiriman dan siap masuk ke tahap pemasaran.</p></div></article>
              </div>
              
              <div style={{ textAlign: "center", marginTop: "32px" }}>
                <a className="btn track" data-location="process" href={ctaHref}>KONSULTASI BRAND ANDA &rarr;</a>
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
                <a className="btn track" data-location="academy" href={ctaHref}>Jadi Partner Dreamlab &rarr;</a>
              </div>
              <div className="academy-collage">
                <Image src="/assets/maklon-parfum/academy-community.webp" alt="Komunitas beautypreneur Dreamlab" width={500} height={500} loading="lazy" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                <Image src="/assets/maklon-parfum/academy-digital-marketing.webp" alt="Mentoring digital marketing" width={500} height={500} loading="lazy" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                <Image src="/assets/maklon-parfum/academy-branding.webp" alt="Sesi branding Dreamlab Academy" width={500} height={500} loading="lazy" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              </div>
            </div>
          </section>

          {/* CREDIBILITY / CERTIFICATIONS BANNER (Directly below Beautypreneur section) */}
          <AdsCredibilitySection ctaHref={ctaHref} channel={source === "meta_ads" ? "metaads" : "google-ads"} />

          {/* BRAND / OUR CLIENT - LOGO BERJALAN */}
          <LogoScroll 
            logos={aboutData.partnerLogos} 
            headline="DIPERCAYA 500+ BRAND UNTUK MENGEMBANGKAN PRODUK BEAUTY"
            subHeadline="Dipercaya oleh berbagai brand beauty untuk mengembangkan produk yang siap bersaing di pasar."
          />

          <section className="closing">
            <span className="eyebrow">MULAI DARI IDE BODY CARE ANDA</span>
            <h2>SIAP MEMBANGUN BRAND BODY CARE ANDA?</h2>
            <p>Mulai dari konsep formulasi sampai siap masuk market bersama Dreamlab.</p>
            <a className="btn track" data-location="closing" href={ctaHref}>KONSULTASI BRAND ANDA &rarr;</a>
          </section>
        </main>
        
        <a className="wa track" data-location="floating-whatsapp" href={ctaHref} aria-label="Konsultasi WhatsApp">
          ✆
        </a>
      </div>
    </>
  );
}
