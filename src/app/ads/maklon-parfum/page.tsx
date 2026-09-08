"use client";

import { useEffect } from "react";
import { useMetaAdsCtaPixel } from "@/lib/meta-ads-pixel";
import Image from "next/image";
import { AdsCredibilitySection } from "@/components/landing-pages/AdsCredibilitySection";

export default function MaklonParfumAdsLP() {
  useMetaAdsCtaPixel("Maklon Parfum");

  useEffect(() => {
    // Analytics & interaction script from HTML export
    const dataLayer = (window as any).dataLayer = (window as any).dataLayer || [];
    dataLayer.push({event:'view_landing_page',service:'maklon_parfum'});
    document.querySelectorAll('.track').forEach(a=>a.addEventListener('click',()=>dataLayer.push({event:'cta_click',location:(a as HTMLElement).dataset.location,service:'maklon_parfum'})));
    
    const observer = new IntersectionObserver(es=>es.forEach(e=>{
      if(!e.isIntersecting) return;
      document.querySelectorAll('[data-count]').forEach(el=>{
        const targetElement = el as HTMLElement;
        const target = +(targetElement.dataset.count || 0);
        const suffix = target === 500 ? '++' : '+';
        let n = 0;
        const timer = setInterval(()=>{
          n = Math.min(target, n + Math.ceil(target/42));
          targetElement.textContent = n.toLocaleString('id-ID') + suffix;
          if(n===target) clearInterval(timer);
        }, 28);
      });
      observer.disconnect();
    }), {threshold:.25});
    
    const metricsSection = document.querySelector('.metrics');
    if (metricsSection) observer.observe(metricsSection);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Viga&display=swap');
        :root{--blue:#4299d4;--blue2:#eaf6ff;--orange:#f78c1f;--green:#235f42;--ink:#172b3a;--muted:#607485;--paper:#fffdf7;--white:#fff;--line:#dbeaf4;--shadow:0 18px 55px rgba(23,75,109,.12)}
        .parfum-lp { box-sizing:border-box; scroll-behavior:smooth; margin:0; font-family:Helvetica,Arial,sans-serif; color:var(--ink); background:var(--paper) }
        .parfum-lp * { box-sizing:border-box; }
        .parfum-lp h2 { font-family:'Viga',Helvetica,Arial,sans-serif; font-weight:400; text-transform:uppercase; }
        .parfum-lp img { max-width:100%; }
        .parfum-lp a { text-decoration:none; color:inherit; }
        .parfum-lp .wrap { width:min(1160px,calc(100% - 40px)); margin:auto; }
        .parfum-lp .eyebrow { display:inline-block; font-size:11px; letter-spacing:1.5px; font-weight:800; color:var(--blue); margin-bottom:12px; }
        .parfum-lp .section { padding:88px 0; }
        .parfum-lp .title { max-width:720px; margin:0 auto 38px; text-align:center; }
        .parfum-lp .title h2 { font-size:44px; line-height:1.12; letter-spacing:-1.2px; margin:0 0 14px; }
        .parfum-lp .title p { font-size:17px; color:var(--muted); line-height:1.65; margin:0; }
        .parfum-lp .btn { display:inline-flex; align-items:center; justify-content:center; gap:18px; min-height:54px; padding:0 24px; border-radius:14px; background:var(--orange); color:#fff; font-weight:800; font-size:15px; box-shadow:0 12px 28px rgba(247,140,31,.28); transition:.2s; }
        .parfum-lp .btn:hover { transform:translateY(-2px); filter:saturate(1.08); }
        .parfum-lp .hero { position:relative; min-height:700px; display:flex; align-items:center; overflow:hidden; background:#dfeff8; }
        .parfum-lp .hero-bg { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center; }
        .parfum-lp .hero-shade { position:absolute; inset:0; background:linear-gradient(90deg,rgba(8,30,48,.86) 0%,rgba(8,30,48,.58) 45%,rgba(8,30,48,.06) 75%); }
        .parfum-lp .hero-copy { position:relative; z-index:1; max-width:670px; color:#fff; }
        .parfum-lp .hero-copy .eyebrow { color:#ffc06f; }
        .parfum-lp .hero h1 { font-size:60px; line-height:1.02; letter-spacing:-2.7px; margin:0 0 20px; }
        .parfum-lp .hero h1 em { font-style:normal; color:var(--orange); }
        .parfum-lp .hero p { font-size:18px; line-height:1.65; color:#e9f4fb; max-width:600px; margin:0 0 28px; }
        .parfum-lp .hero-trust { display:flex; gap:22px; margin-top:25px; font-size:13px; font-weight:700; color:#fff; }
        .parfum-lp .hero-trust span:before { content:'✓'; color:#7ce5a9; margin-right:7px; }
        .parfum-lp .hero .btn { background:var(--orange); }
        .parfum-lp .metrics { position:relative; margin-top:-44px; z-index:3; }
        .parfum-lp .metric-card { background:#fff; border:1px solid var(--line); border-radius:22px; box-shadow:var(--shadow); display:grid; grid-template-columns:1.4fr 1fr 1fr; align-items:center; padding:27px 32px; }
        .parfum-lp .metric-card h2 { font-size:22px; line-height:1.3; margin:0; }
        .parfum-lp .metric { padding-left:30px; border-left:1px solid var(--line); }
        .parfum-lp .metric b { display:block; color:var(--blue); font-size:34px; }
        .parfum-lp .metric span { font-size:13px; color:var(--muted); }
        .parfum-lp .value { background:#fff; }
        .parfum-lp .value-grid { display:grid; grid-template-columns:.95fr 1.05fr; gap:64px; align-items:center; }
        .parfum-lp .value-copy h2 { font-size:44px; line-height:1.12; letter-spacing:-1.6px; margin:0 0 18px; }
        .parfum-lp .value-copy p { color:var(--muted); font-size:17px; line-height:1.65; }
        .parfum-lp .checks { display:grid; grid-template-columns:1fr 1fr; gap:13px; }
        .parfum-lp .check { min-height:105px; padding:20px; border:1px solid var(--line); border-radius:18px; background:var(--paper); display:flex; gap:12px; align-items:flex-start; }
        .parfum-lp .check i { font-style:normal; width:27px; height:27px; flex:0 0 27px; border-radius:50%; display:grid; place-items:center; background:#e4f7eb; color:#1f9e57; font-weight:900; }
        .parfum-lp .check b { font-size:14px; line-height:1.5; }
        .parfum-lp .catalog { background:var(--blue2); }
        .parfum-lp .product-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .parfum-lp .product { position:relative; height:390px; border-radius:22px; overflow:hidden; background:#173248; box-shadow:var(--shadow); display:block; }
        .parfum-lp .product img { width:100%; height:100%; object-fit:cover; transition:.5s; }
        .parfum-lp .product:hover img { transform:scale(1.04); }
        .parfum-lp .product:after { content:''; position:absolute; inset:0; background:linear-gradient(180deg, transparent 0%, rgba(10,20,40,0.1) 40%, rgba(8,18,35,0.9) 100%); pointer-events:none; }
        .parfum-lp .product-copy { position:absolute; left:24px; right:24px; bottom:24px; z-index:2; color:#fff; pointer-events:none; }
        .parfum-lp .product-copy h3 { font-size:26px; margin:0 0 6px; font-weight:800; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,0.3); }
        .parfum-lp .product-copy p { font-size:14px; line-height:1.5; margin:0; color:#f8fbfd; opacity:0.95; max-width:250px; }
        .parfum-lp .process { background:#fff; }
        .parfum-lp .process-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:15px; }
        .parfum-lp .step { position:relative; height:340px; border-radius:20px; overflow:hidden; background:#173248; box-shadow:var(--shadow); display:block; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease; cursor: pointer; }
        .parfum-lp .step:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
        .parfum-lp .step img { width:100%; height:100%; display:block; object-fit:cover; position:relative; z-index:0; transition: transform 0.7s ease; }
        .parfum-lp .step:hover img { transform: scale(1.06); }
        .parfum-lp .step:after { content:''; position:absolute; inset:0; background:linear-gradient(to top, rgba(5,15,30,0.96) 0%, rgba(5,15,30,0.82) 30%, rgba(5,15,30,0.35) 60%, rgba(5,15,30,0.05) 100%); pointer-events:none; z-index:1; }
        .parfum-lp .step-copy { position:absolute; bottom:28px; left:28px; right:28px; z-index:2; color:#fff; pointer-events:none; }
        .parfum-lp .step-copy b { display:block; color:var(--orange); font-size:14px; font-weight:800; letter-spacing:1px; margin-bottom:8px; text-transform:uppercase; }
        .parfum-lp .step-copy h3 { margin:0 0 12px; font-size:26px; font-weight:800; text-transform:uppercase; color:#fff; line-height:1.15; text-shadow:0 2px 8px rgba(0,0,0,0.35); }
        .parfum-lp .step-copy p { margin:0; color:rgba(255,255,255,0.92); font-size:17px; line-height:1.55; }
        .parfum-lp .academy { background:var(--paper); }
        .parfum-lp .academy-grid { display:grid; grid-template-columns:1.07fr .93fr; gap:58px; align-items:center; }
        .parfum-lp .academy-photo { position:relative; }
        .parfum-lp .academy-photo img { display:block; width:100%; height:500px; object-fit:cover; border-radius:28px; box-shadow:var(--shadow); }
        .parfum-lp .academy-badge { position:absolute; right:-18px; bottom:24px; background:var(--orange); color:#fff; padding:17px 20px; border-radius:16px; font-weight:800; }
        .parfum-lp .academy-copy h2 { font-size:39px; line-height:1.16; letter-spacing:-.8px; margin:0 0 16px; }
        .parfum-lp .academy-copy p { max-width:620px; margin:0; font-size:17px; line-height:1.65; color:var(--muted); }
        .parfum-lp .academy-list { list-style:none; padding:0; margin:24px 0 28px; display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .parfum-lp .academy-list li { display:flex; align-items:flex-start; gap:11px; min-height:76px; padding:15px 16px; border:1px solid var(--line); border-radius:14px; background:#fff; font-size:14px; font-weight:700; line-height:1.45; box-shadow:0 7px 20px rgba(23,75,109,.05); }
        .parfum-lp .academy-list li:before { content:'✓'; display:grid; place-items:center; flex:0 0 25px; width:25px; height:25px; margin-top:1px; border-radius:50%; background:#e4f7eb; color:#179a51; font-size:14px; font-weight:900; }
        .parfum-lp .legal { background:var(--blue); color:#fff; }
        .parfum-lp .legal .title .eyebrow { color:#dff3ff; }
        .parfum-lp .legal .title p { color:#e5f3fb; }
        .parfum-lp .legal-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
        .parfum-lp .legal-card { min-height:180px; background:#fff; border-radius:19px; padding:24px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:var(--ink); }
        .parfum-lp .legal-card img { height:75px; width:100%; object-fit:contain; margin-bottom:16px; }
        .parfum-lp .legal-card b { font-size:14px; }
        .parfum-lp .clients { background:#fff; }
        .parfum-lp .clients-card { max-width:980px; margin:auto; padding:28px; border:1px solid var(--line); border-radius:24px; background:#fff; box-shadow:var(--shadow); }
        .parfum-lp .clients-card img { display:block; width:100%; height:auto; }
        .parfum-lp .closing { padding:84px 20px; text-align:center; background:#fff; }
        .parfum-lp .closing h2 { font-size:47px; line-height:1.08; letter-spacing:-1.8px; max-width:780px; margin:0 auto 16px; }
        .parfum-lp .closing p { color:var(--muted); font-size:17px; margin:0 auto 26px; }
        .parfum-lp .wa { position:fixed; right:20px; bottom:20px; z-index:20; width:58px; height:58px; border-radius:50%; background:#25d366; color:#fff; display:grid; place-items:center; box-shadow:0 14px 30px rgba(0,0,0,.22); font-size:25px; font-weight:900; text-decoration: none; }
        
        .parfum-lp .hero-shade { background:linear-gradient(90deg,rgba(7,31,49,.93),rgba(7,31,49,.75) 43%,rgba(7,31,49,.1) 78%); }
        .parfum-lp .hero-copy { max-width:700px; text-shadow:0 2px 18px rgba(0,0,0,.25); }
        .parfum-lp .hero-copy .eyebrow { font-size:12px; color:#ffd092; }
        .parfum-lp .hero h1 { font-size:62px; color:#fff; }
        .parfum-lp .hero p { color:#fff; }
        .parfum-lp .value-grid { grid-template-columns:.9fr 1.1fr; gap:72px; }
        .parfum-lp .check { min-height:122px; border-radius:16px; background:#fff; box-shadow:0 8px 25px rgba(23,75,109,.06); }
        .parfum-lp .check b { font-size:15px; }
        .parfum-lp .check span { display:block; font-size:13px; line-height:1.5; color:var(--muted); margin-top:6px; }
        .parfum-lp .academy-grid { grid-template-columns:.9fr 1.1fr; }
        .parfum-lp .academy-collage { display:grid; grid-template-columns:1fr 1fr; grid-template-rows:250px 220px; gap:10px; }
        .parfum-lp .academy-collage img { width:100%; height:100%; object-fit:cover; border-radius:18px; }
        .parfum-lp .academy-collage img:first-child { grid-row:1/3; }
        
        @media(max-width:760px) {
          .parfum-lp .wrap { width:min(100% - 28px,1160px); }
          .parfum-lp .section { padding:54px 0; }
          .parfum-lp .title { margin-bottom:25px; }
          .parfum-lp .title h2 { font-size:32px; }
          .parfum-lp .title p { font-size:15px; }
          .parfum-lp .hero { min-height:630px; align-items:flex-end; }
          .parfum-lp .hero-bg { object-position:62% center; }
          .parfum-lp .hero-shade { background:linear-gradient(0deg,rgba(7,29,46,.98),rgba(7,29,46,.84) 49%,rgba(7,29,46,.12) 82%); }
          .parfum-lp .hero-copy { padding-bottom:70px; text-align:center; }
          .parfum-lp .hero h1 { font-size:40px; letter-spacing:-1.7px; }
          .parfum-lp .hero p { font-size:15px; }
          .parfum-lp .hero .btn { width:100%; }
          .parfum-lp .hero-trust { justify-content:center; gap:12px; flex-wrap:wrap; font-size:11px; }
          .parfum-lp .metrics { margin-top:-28px; }
          .parfum-lp .metric-card { grid-template-columns:1fr 1fr; padding:20px 16px; text-align:center; }
          .parfum-lp .metric-card h2 { grid-column:1/-1; font-size:18px; margin-bottom:17px; }
          .parfum-lp .metric { padding:0; border:0; }
          .parfum-lp .metric+ .metric { border-left:1px solid var(--line); }
          .parfum-lp .metric b { font-size:28px; }
          .parfum-lp .metric span { font-size:10px; }
          .parfum-lp .value-grid, .parfum-lp .academy-grid { grid-template-columns:1fr; gap:28px; }
          .parfum-lp .value-copy h2 { font-size:32px; }
          .parfum-lp .academy-copy h2 { font-size:28px; line-height:1.18; letter-spacing:-.35px; }
          .parfum-lp .value-copy p, .parfum-lp .academy-copy p { font-size:15px; }
          .parfum-lp .checks { gap:9px; }
          .parfum-lp .check { min-height:142px; padding:14px; display:block; }
          .parfum-lp .check i { margin-bottom:9px; }
          .parfum-lp .check b { font-size:12px; }
          .parfum-lp .check span { font-size:11px; }
          .parfum-lp .product-grid { grid-template-columns:1fr 1fr; gap:9px; }
          .parfum-lp .product { height:280px; border-radius:16px; }
          .parfum-lp .product-copy { left:18px; right:18px; bottom:20px; }
          .parfum-lp .product-copy h3 { font-size:20px; }
          .parfum-lp .product-copy p { font-size:11px; }
          .parfum-lp .process-grid { grid-template-columns:1fr; gap:10px; }
          .parfum-lp .step { display:block; height:300px; min-height:auto; }
          .parfum-lp .step img { height:100%; min-height:auto; }
          .parfum-lp .step-copy { bottom:20px; left:20px; right:20px; padding:0; }
          .parfum-lp .step-copy b { font-size:13px; margin-bottom:8px; }
          .parfum-lp .step-copy h3 { font-size:22px; margin-bottom:10px; }
          .parfum-lp .step-copy p { font-size:15px; }
          .parfum-lp .academy-list { grid-template-columns:1fr; gap:8px; margin:20px 0 24px; }
          .parfum-lp .academy-list li { min-height:0; padding:13px 14px; font-size:14px; line-height:1.4; }
          .parfum-lp .academy .btn { width:100%; }
          .parfum-lp .academy-collage { grid-template-rows:190px 155px; gap:7px; }
          .parfum-lp .academy-collage img { border-radius:13px; }
          .parfum-lp .legal-grid { grid-template-columns:1fr 1fr; gap:9px; }
          .parfum-lp .legal-card { min-height:145px; padding:15px; }
          .parfum-lp .legal-card img { height:55px; }
          .parfum-lp .clients-card { padding:12px; border-radius:16px; }
          .parfum-lp .closing { padding:60px 18px 92px; }
          .parfum-lp .closing h2 { font-size:34px; }
          .parfum-lp .closing .btn { width:100%; }
          .parfum-lp .wa { width:54px; height:54px; right:15px; bottom:15px; }
        }
      `}</style>
      <div className="parfum-lp">
        <main>
          <section className="hero">
            <Image className="hero-bg" src="/assets/maklon-parfum/hero-parfum.webp" alt="Koleksi botol parfum untuk pengembangan brand" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
            <div className="hero-shade"></div>
            <div className="wrap hero-copy">
              <span className="eyebrow">#1 MAKLON PARFUM CUSTOM AROMA</span>
              <h1>Wujudkan Brand Parfum dengan <em>Aroma Eksklusif</em> Milik Anda</h1>
              <p>Dari konsep aroma hingga siap dipasarkan, Dreamlab membantu Anda mengembangkan parfum dengan formula khas yang sesuai target market.</p>
              <a className="btn track" data-location="hero" href="/ads/thankyou/metaads/">KONSULTASI BRAND ANDA &rarr;</a>
              <div className="hero-trust"><span>1 Client, 1 Custom Formula</span><span>FREE LEGALITAS BPOM</span><span>Siap Produksi</span></div>
            </div>
          </section>

          <section className="metrics">
            <div className="wrap">
              <div className="metric-card">
                <h2>Dipercaya untuk Mengembangkan Brand Beauty</h2>
                <div className="metric"><b data-count="500">0++</b><span>Brand bekerja sama</span></div>
                <div className="metric"><b data-count="1000">0+</b><span>Produk dikembangkan</span></div>
              </div>
            </div>
          </section>

          <section className="value section">
            <div className="wrap value-grid">
              <div className="value-copy">
                <span className="eyebrow">FASILITAS &amp; KEUNTUNGAN MAKLON</span>
                <h2>Semua Kebutuhan Brand Parfum Anda dalam Satu Partner</h2>
                <p>Dreamlab mendampingi pengembangan formula, visual brand, legalitas, produksi, hingga persiapan pemasaran.</p>
              </div>
              <div className="checks">
                <div className="check"><i>&#10003;</i><div><b>Custom Formula Eksklusif</b><span>Formula dikembangkan sesuai konsep brand Anda.</span></div></div>
                <div className="check"><i>&#10003;</i><div><b>R&amp;D Perfumery</b><span>Karakter aroma dirancang bersama tim formulasi.</span></div></div>
                <div className="check"><i>&#10003;</i><div><b>MOQ &amp; HPP Fleksibel</b><span>Skala produksi disesuaikan dengan kesiapan bisnis.</span></div></div>
                <div className="check"><i>&#10003;</i><div><b>Support End-to-End</b><span>FREE Pengurusan Legalitas BPOM, HKI, Halal, desain kemasan, dan digital marketing.</span></div></div>
              </div>
            </div>
          </section>

          <section className="catalog section">
            <div className="wrap">
              <div className="title">
                <span className="eyebrow">KATALOG MAKLON PARFUM</span>
                <h2>Pilihan Produk Parfum yang Bisa Anda Develop</h2>
                <p>Tentukan produk sesuai positioning dan target market. Formula, karakter aroma, serta tampilannya dapat dikembangkan bersama Dreamlab.</p>
              </div>
              <div className="product-grid">
                <a className="product" href="/ads/thankyou/metaads/">
                  <Image src="/assets/maklon-parfum/edp.webp" alt="Eau de Parfum" fill loading="lazy" sizes="(max-width: 760px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                  <div className="product-copy"><h3>Eau de Parfum</h3><p>Karakter aroma intens dan elegan.</p></div>
                </a>
                <a className="product" href="/ads/thankyou/metaads/">
                  <Image src="/assets/maklon-parfum/edt.webp" alt="Eau de Toilette" fill loading="lazy" sizes="(max-width: 760px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                  <div className="product-copy"><h3>Eau de Toilette</h3><p>Segar dan nyaman untuk pemakaian harian.</p></div>
                </a>
                <a className="product" href="/ads/thankyou/metaads/">
                  <Image src="/assets/maklon-parfum/edc.webp" alt="Eau de Cologne" fill loading="lazy" sizes="(max-width: 760px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                  <div className="product-copy"><h3>Eau de Cologne</h3><p>Ringan dengan kesan menyegarkan.</p></div>
                </a>
                <a className="product" href="/ads/thankyou/metaads/">
                  <Image src="/assets/maklon-parfum/extrait.webp" alt="Extrait de Parfum" fill loading="lazy" sizes="(max-width: 760px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                  <div className="product-copy"><h3>Extrait de Parfum</h3><p>Konsentrasi tinggi untuk lini premium.</p></div>
                </a>
                <a className="product" href="/ads/thankyou/metaads/">
                  <Image src="/assets/maklon-parfum/body-mist.webp" alt="Body Mist" fill loading="lazy" sizes="(max-width: 760px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                  <div className="product-copy"><h3>Body Mist</h3><p>Ringan, praktis, dan mudah digunakan ulang.</p></div>
                </a>
                <a className="product" href="/ads/thankyou/metaads/">
                  <Image src="/assets/maklon-parfum/essential-oil.webp" alt="Essential Oil" fill loading="lazy" sizes="(max-width: 760px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                  <div className="product-copy"><h3>Essential Oil</h3><p>Eksplorasi aroma dari bahan esensial.</p></div>
                </a>
              </div>
            </div>
          </section>

          <section className="process section">
            <div className="wrap">
              <div className="title">
                <span className="eyebrow">ALUR PENGEMBANGAN</span>
                <h2>5 Langkah Mudah Wujudkan Brand Parfum Anda</h2>
                <p>Setiap tahap didampingi agar proses membangun brand terasa lebih jelas dan terarah.</p>
              </div>
                            <div className="process-grid">
                <article className="step"><Image src="/assets/maklon-parfum/consultation.webp" alt="Konsultasi IDE" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} /><div className="step-copy"><b>STEP 01</b><h3>KONSULTASI BRAND &amp; TARGET MARKET</h3><p>Diskusikan konsep parfum, target market, karakter aroma, dan positioning brand Anda.</p></div></article>
                <article className="step"><Image src="/assets/maklon-parfum/sample.webp" alt="Formulasi & Sample" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} /><div className="step-copy"><b>STEP 02</b><h3>FORMULASI &amp; SAMPLE AROMA</h3><p>Tim R&amp;D mengembangkan formula dan sample parfum sesuai brief serta karakter brand.</p></div></article>
                <article className="step"><Image src="/assets/maklon-parfum/legal-design.webp" alt="Legalitas & Desain" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} /><div className="step-copy"><b>STEP 03</b><h3>LEGALITAS &amp; DESAIN</h3><p>Setelah formula disetujui, proses dilanjutkan ke legalitas dan pengembangan desain kemasan.</p></div></article>
                <article className="step"><Image src="/assets/maklon-parfum/production.webp" alt="Produksi & Quality Control" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} /><div className="step-copy"><b>STEP 04</b><h3>PRODUKSI &amp; QUALITY CONTROL</h3><p>Produk diproduksi sesuai standar fasilitas Dreamlab dan melalui proses quality control.</p></div></article>
                <article className="step"><Image src="/assets/maklon-parfum/delivery.webp" alt="Delivery" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} /><div className="step-copy"><b>STEP 05</b><h3>DELIVERY &amp; SIAP LAUNCHING</h3><p>Produk yang sudah selesai dipersiapkan untuk dikirim dan siap masuk ke tahap pemasaran.</p></div></article>
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
                <a className="btn track" data-location="academy" href="/ads/thankyou/metaads/">Jadi Partner Dreamlab &rarr;</a>
              </div>
              <div className="academy-collage">
                <Image src="/assets/maklon-parfum/academy-community.webp" alt="Komunitas beautypreneur Dreamlab" width={500} height={500} loading="lazy" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                <Image src="/assets/maklon-parfum/academy-digital-marketing.webp" alt="Mentoring digital marketing" width={500} height={500} loading="lazy" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                <Image src="/assets/maklon-parfum/academy-branding.webp" alt="Sesi branding Dreamlab Academy" width={500} height={500} loading="lazy" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              </div>
            </div>
          </section>

          <section className="legal section">
            <div className="wrap">
              <div className="title">
                <span className="eyebrow">LEGALITAS &amp; STANDAR PABRIK</span>
                <h2>Brand Anda Lebih Terjamin dengan Standar yang Jelas</h2>
                <p>Proses produksi dan legalitas didampingi agar produk Anda lebih siap dan aman masuk ke pasar.</p>
              </div>
              <div className="legal-grid">
                <div className="legal-card"><Image src="/assets/maklon-parfum/bpom.webp" alt="bpom" width={200} height={100} loading="lazy" style={{ objectFit: "contain", width: "100%", height: "75px", marginBottom: "16px" }} /><b>Legalitas BPOM</b></div>
                <div className="legal-card"><Image src="/assets/maklon-parfum/halal.webp" alt="halal" width={200} height={100} loading="lazy" style={{ objectFit: "contain", width: "100%", height: "75px", marginBottom: "16px" }} /><b>Sertifikasi Halal</b></div>
                <div className="legal-card"><Image src="/assets/maklon-parfum/cpkb.webp" alt="cpkb" width={200} height={100} loading="lazy" style={{ objectFit: "contain", width: "100%", height: "75px", marginBottom: "16px" }} /><b>Fasilitas CPKB Grade A</b></div>
                <div className="legal-card"><Image src="/assets/maklon-parfum/hki.webp" alt="hki" width={200} height={100} loading="lazy" style={{ objectFit: "contain", width: "100%", height: "75px", marginBottom: "16px" }} /><b>Pendampingan HKI</b></div>
              </div>
            </div>
          </section>

          <section className="clients section">
            <div className="wrap">
              <div className="title">
                <span className="eyebrow">OUR CLIENT</span>
                <h2>Brand yang Telah Bertumbuh Bersama Dreamlab</h2>
                <p>Dipercaya oleh berbagai brand beauty untuk mengembangkan produk yang siap bersaing di pasar.</p>
              </div>
              <div className="clients-card"><Image src="/assets/maklon-parfum/our-clients.webp" alt="Logo client yang telah bekerja sama dengan Dreamlab" width={980} height={400} loading="lazy" style={{ width: "100%", height: "auto" }} /></div>
            </div>
          </section>

          <section className="closing">
            <span className="eyebrow">MULAI DARI IDE AROMA ANDA</span>
            <h2>Wujudkan Brand Parfum dengan Formula yang Punya Karakter</h2>
            <p>Konsultasikan konsep parfum Anda bersama tim Dreamlab.</p>
            <a className="btn track" data-location="closing" href="/ads/thankyou/metaads/">KONSULTASI BRAND ANDA &rarr;</a>
          </section>

          {/* CREDIBILITY / CERTIFICATIONS BANNER */}
          <AdsCredibilitySection channel="metaads" />
        </main>
        
        <a className="wa track" data-location="floating-whatsapp" href="/ads/thankyou/metaads/" aria-label="Konsultasi WhatsApp">
          ✆
        </a>
      </div>
    </>
  );
}
