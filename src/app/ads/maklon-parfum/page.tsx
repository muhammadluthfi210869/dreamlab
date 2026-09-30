"use client";

import { useEffect } from "react";
import { useMetaAdsCtaPixel } from "@/lib/meta-ads-pixel";
import Image from "next/image";
import dynamic from "next/dynamic";
import { AdsCredibilitySection } from "@/components/landing-pages/AdsCredibilitySection";
import { aboutData } from "@/data/about-us";

const LogoScroll = dynamic(() => import("@/components/LogoScroll"), { 
  ssr: true,
  loading: () => <div className="py-14 bg-white" />
});

export default function MaklonParfumAdsLP() {
  useMetaAdsCtaPixel("Maklon Parfum");

  useEffect(() => {
    // Analytics & interaction script
    const dataLayer = ((window as any).dataLayer = (window as any).dataLayer || []);
    dataLayer.push({ event: 'view_landing_page', service: 'maklon_parfum' });
    
    document.querySelectorAll('.track').forEach((a) =>
      a.addEventListener('click', () =>
        dataLayer.push({
          event: 'cta_click',
          location: (a as HTMLElement).dataset.location,
          service: 'maklon_parfum'
        })
      )
    );
    
    const observer = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        document.querySelectorAll('[data-count]').forEach((el) => {
          const targetElement = el as HTMLElement;
          const target = +(targetElement.dataset.count || 0);
          const suffix = target === 500 ? '++' : '+';
          let n = 0;
          const timer = setInterval(() => {
            n = Math.min(target, n + Math.ceil(target / 42));
            targetElement.textContent = n.toLocaleString('id-ID') + suffix;
            if (n === target) clearInterval(timer);
          }, 28);
        });
        observer.disconnect();
      });
    }, { threshold: 0.25 });
    
    const metricsSection = document.querySelector('.metrics');
    if (metricsSection) observer.observe(metricsSection);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Viga&display=swap');
        :root{--blue:#4299d4;--blue2:#eaf6ff;--orange:#f78c1f;--green:#235f42;--ink:#172b3a;--muted:#607485;--paper:#fffdf7;--white:#fff;--line:#dbeaf4;--shadow:0 18px 55px rgba(23,75,109,.12)}
        .parfum-lp { box-sizing:border-box; scroll-behavior:smooth; margin:0; font-family:Helvetica,Arial,sans-serif; color:var(--ink); background:var(--paper); }
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
        
        .parfum-lp .btn { display:inline-flex; align-items:center; justify-content:center; gap:14px; min-height:54px; padding:0 28px; border-radius:14px; background:var(--orange); color:#fff; font-weight:800; font-size:15px; box-shadow:0 12px 28px rgba(247,140,31,.32); transition:all .25s ease; cursor:pointer; }
        .parfum-lp .btn:hover { transform:translateY(-2px); box-shadow:0 16px 36px rgba(247,140,31,.42); filter:saturate(1.08); }

        /* Top Brand Bar */
        .parfum-lp .hero-topbar { position:relative; z-index:10; width:100%; padding:22px 0; }
        .parfum-lp .hero-topbar-inner { display:flex; align-items:center; justify-content:space-between; }
        .parfum-lp .hero-logo-wrap { display:flex; align-items:center; }
        .parfum-lp .hero-logo { height:46px; width:auto; object-fit:contain; }
        .parfum-lp .btn-nav { display:inline-flex; align-items:center; gap:8px; padding:10px 20px; border-radius:99px; background:rgba(255,255,255,0.14); border:1px solid rgba(255,255,255,0.28); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); color:#fff; font-size:13px; font-weight:800; letter-spacing:0.3px; transition:all .2s ease; cursor:pointer; }
        .parfum-lp .btn-nav:hover { background:var(--orange); border-color:var(--orange); transform:translateY(-1px); box-shadow:0 6px 20px rgba(247,140,31,0.3); }

        /* Hero */
        .parfum-lp .hero { position:relative; min-height:720px; display:flex; flex-direction:column; justify-content:space-between; overflow:hidden; background:#081e30; }
        .parfum-lp .hero-bg { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center; }
        .parfum-lp .hero-shade { position:absolute; inset:0; background:linear-gradient(90deg,rgba(7,31,49,.94) 0%,rgba(7,31,49,.76) 45%,rgba(7,31,49,.18) 80%); }
        .parfum-lp .hero-copy { position:relative; z-index:2; max-width:700px; color:#fff; text-shadow:0 2px 18px rgba(0,0,0,.25); padding-bottom:80px; padding-top:20px; }
        .parfum-lp .hero-copy .eyebrow { font-size:12px; color:#ffd092; }
        .parfum-lp .hero h1 { font-size:60px; line-height:1.04; letter-spacing:-2.4px; margin:0 0 20px; color:#fff; }
        .parfum-lp .hero h1 em { font-style:normal; color:var(--orange); }
        .parfum-lp .hero p { font-size:18px; line-height:1.65; color:#f0f7fb; max-width:620px; margin:0 0 30px; }
        .parfum-lp .hero-trust { display:flex; gap:22px; margin-top:28px; font-size:13px; font-weight:700; color:#fff; flex-wrap:wrap; }
        .parfum-lp .hero-trust span:before { content:'✓'; color:#7ce5a9; margin-right:7px; font-weight:900; }
        
        /* Metrics */
        .parfum-lp .metrics { position:relative; margin-top:-46px; z-index:5; }
        .parfum-lp .metric-card { background:#fff; border:1px solid var(--line); border-radius:24px; box-shadow:var(--shadow); display:grid; grid-template-columns:1.4fr 1fr 1fr; align-items:center; padding:28px 36px; }
        .parfum-lp .metric-card h2 { font-size:22px; line-height:1.3; margin:0; }
        .parfum-lp .metric { padding-left:32px; border-left:1px solid var(--line); }
        .parfum-lp .metric b { display:block; color:var(--blue); font-size:36px; font-weight:900; letter-spacing:-0.5px; }
        .parfum-lp .metric span { font-size:13px; color:var(--muted); }
        
        /* Value / Benefits */
        .parfum-lp .value { background:#fff; }
        .parfum-lp .value-grid { display:grid; grid-template-columns:.95fr 1.05fr; gap:64px; align-items:center; }
        .parfum-lp .value-copy h2 { font-size:44px; line-height:1.12; letter-spacing:-1.6px; margin:0 0 18px; }
        .parfum-lp .value-copy p { color:var(--muted); font-size:17px; line-height:1.65; margin:0; }
        .parfum-lp .checks { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .parfum-lp .check { min-height:115px; padding:22px; border:1px solid var(--line); border-radius:18px; background:#fff; box-shadow:0 8px 25px rgba(23,75,109,.06); display:flex; gap:14px; align-items:flex-start; }
        .parfum-lp .check i { font-style:normal; width:28px; height:28px; flex:0 0 28px; border-radius:50%; display:grid; place-items:center; background:#e4f7eb; color:#1f9e57; font-weight:900; font-size:14px; margin-top:2px; }
        .parfum-lp .check b { font-size:15px; line-height:1.4; color:var(--ink); }
        .parfum-lp .check span { display:block; font-size:13px; line-height:1.5; color:var(--muted); margin-top:6px; }
        
        /* Catalog */
        .parfum-lp .catalog { background:var(--blue2); }
        .parfum-lp .product-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
        .parfum-lp .product { position:relative; height:390px; border-radius:22px; overflow:hidden; background:#173248; box-shadow:var(--shadow); display:block; transition:transform .4s ease, box-shadow .4s ease; cursor:pointer; }
        .parfum-lp .product img { width:100%; height:100%; object-fit:cover; transition:transform .6s ease; }
        .parfum-lp .product:hover { transform:translateY(-6px); box-shadow:0 24px 50px rgba(10,35,55,.18); }
        .parfum-lp .product:hover img { transform:scale(1.06); }
        .parfum-lp .product:after { content:''; position:absolute; inset:0; background:linear-gradient(180deg, transparent 0%, rgba(10,20,40,0.1) 35%, rgba(8,18,35,0.92) 100%); pointer-events:none; }
        .parfum-lp .product-badge { position:absolute; top:18px; right:18px; z-index:3; background:rgba(255,255,255,0.92); color:var(--ink); font-size:11px; font-weight:800; padding:6px 14px; border-radius:99px; backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); box-shadow:0 4px 12px rgba(0,0,0,0.15); transition:all .3s ease; }
        .parfum-lp .product:hover .product-badge { background:var(--orange); color:#fff; }
        .parfum-lp .product-copy { position:absolute; left:24px; right:24px; bottom:24px; z-index:2; color:#fff; pointer-events:none; }
        .parfum-lp .product-copy h3 { font-size:26px; margin:0 0 6px; font-weight:800; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,0.3); }
        .parfum-lp .product-copy p { font-size:14px; line-height:1.5; margin:0; color:#f8fbfd; opacity:0.95; max-width:250px; }
        
        /* 5-Step Process */
        .parfum-lp .process { background:#fff; }
        .parfum-lp .process-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:18px; }
        .parfum-lp .step { grid-column:span 2; position:relative; height:350px; border-radius:20px; overflow:hidden; background:#173248; box-shadow:var(--shadow); display:block; transition:transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease; cursor:pointer; }
        .parfum-lp .step:nth-child(4) { grid-column:2 / span 2; }
        .parfum-lp .step:nth-child(5) { grid-column:4 / span 2; }
        .parfum-lp .step:hover { transform:translateY(-8px); box-shadow:0 24px 50px rgba(0,0,0,0.22); }
        .parfum-lp .step img { width:100%; height:100%; display:block; object-fit:cover; position:relative; z-index:0; transition:transform 0.7s ease; }
        .parfum-lp .step:hover img { transform:scale(1.07); }
        .parfum-lp .step:after { content:''; position:absolute; inset:0; background:linear-gradient(to top, rgba(5,15,30,0.96) 0%, rgba(5,15,30,0.82) 35%, rgba(5,15,30,0.35) 65%, rgba(5,15,30,0.05) 100%); pointer-events:none; z-index:1; }
        .parfum-lp .step-copy { position:absolute; bottom:28px; left:28px; right:28px; z-index:2; color:#fff; pointer-events:none; }
        .parfum-lp .step-copy b { display:block; color:var(--orange); font-size:14px; font-weight:800; letter-spacing:1px; margin-bottom:8px; text-transform:uppercase; }
        .parfum-lp .step-copy h3 { margin:0 0 12px; font-size:24px; font-weight:800; text-transform:uppercase; color:#fff; line-height:1.18; text-shadow:0 2px 8px rgba(0,0,0,0.35); }
        .parfum-lp .step-copy p { margin:0; color:rgba(255,255,255,0.94); font-size:15px; line-height:1.55; }

        /* Academy Community */
        .parfum-lp .academy { background:var(--paper); }
        .parfum-lp .academy-grid { display:grid; grid-template-columns:.9fr 1.1fr; gap:58px; align-items:center; }
        .parfum-lp .academy-copy h2 { font-size:39px; line-height:1.16; letter-spacing:-.8px; margin:0 0 16px; }
        .parfum-lp .academy-copy p { max-width:620px; margin:0; font-size:17px; line-height:1.65; color:var(--muted); }
        .parfum-lp .academy-list { list-style:none; padding:0; margin:24px 0 28px; display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .parfum-lp .academy-list li { display:flex; align-items:flex-start; gap:12px; min-height:76px; padding:15px 16px; border:1px solid var(--line); border-radius:14px; background:#fff; font-size:14px; font-weight:700; line-height:1.45; box-shadow:0 7px 20px rgba(23,75,109,.05); }
        .parfum-lp .academy-list li:before { content:'✓'; display:grid; place-items:center; flex:0 0 25px; width:25px; height:25px; margin-top:1px; border-radius:50%; background:#e4f7eb; color:#179a51; font-size:14px; font-weight:900; }
        .parfum-lp .academy-collage { display:grid; grid-template-columns:1fr 1fr; grid-template-rows:250px 220px; gap:10px; }
        .parfum-lp .academy-collage img { width:100%; height:100%; object-fit:cover; border-radius:18px; }
        .parfum-lp .academy-collage img:first-child { grid-row:1/3; }

        /* Closing Section */
        .parfum-lp .closing { padding:84px 20px 96px; text-align:center; background:#fff; }
        .parfum-lp .closing h2 { font-size:46px; line-height:1.1; letter-spacing:-1.8px; max-width:780px; margin:0 auto 16px; }
        .parfum-lp .closing p { color:var(--muted); font-size:17px; line-height:1.6; max-width:640px; margin:0 auto 30px; }
        .parfum-lp .closing-guarantees { display:flex; justify-content:center; gap:24px; margin-top:28px; font-size:13px; font-weight:700; color:var(--muted); flex-wrap:wrap; }
        .parfum-lp .closing-guarantees span { color:var(--ink); }

        /* Floating WhatsApp Button */
        .parfum-lp .wa { position:fixed; right:24px; bottom:24px; z-index:99; height:56px; border-radius:99px; background:#25d366; color:#fff; display:inline-flex; align-items:center; gap:10px; padding:0 20px 0 16px; box-shadow:0 12px 30px rgba(37,211,102,0.45); font-size:14px; font-weight:800; text-decoration:none; transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .parfum-lp .wa:hover { transform:translateY(-3px) scale(1.02); box-shadow:0 18px 40px rgba(37,211,102,0.55); }
        .parfum-lp .wa-ping { position:absolute; top:-3px; right:-3px; width:14px; height:14px; background:#ff3b30; border:2px solid #fff; border-radius:50%; animation:wa-pulse 2s infinite; }
        @keyframes wa-pulse {
          0% { transform:scale(0.9); opacity:1; }
          50% { transform:scale(1.3); opacity:0.5; }
          100% { transform:scale(0.9); opacity:1; }
        }

        /* Mobile & Responsive */
        @media(max-width:960px) and (min-width:761px) {
          .parfum-lp .process-grid { grid-template-columns:repeat(2,1fr); }
          .parfum-lp .step { grid-column:span 1 !important; }
          .parfum-lp .step:nth-child(5) { grid-column:1 / -1 !important; }
        }

        @media(max-width:760px) {
          .parfum-lp .wrap { width:min(100% - 32px,1160px); }
          .parfum-lp .section { padding:54px 0; }
          .parfum-lp .title { margin-bottom:25px; }
          .parfum-lp .title h2 { font-size:32px; letter-spacing:-0.8px; }
          .parfum-lp .title p { font-size:15px; }
          
          /* Hero Mobile */
          .parfum-lp .hero { min-height:640px; }
          .parfum-lp .hero-topbar { padding:16px 0; }
          .parfum-lp .hero-logo { height:36px; }
          .parfum-lp .btn-nav { padding:8px 14px; font-size:12px; }
          .parfum-lp .hero-bg { object-position:62% center; }
          .parfum-lp .hero-shade { background:linear-gradient(0deg,rgba(7,29,46,.98) 0%,rgba(7,29,46,.85) 55%,rgba(7,29,46,.2) 85%); }
          .parfum-lp .hero-copy { padding-bottom:60px; padding-top:10px; text-align:center; }
          .parfum-lp .hero h1 { font-size:38px; letter-spacing:-1.4px; line-height:1.1; margin-bottom:16px; }
          .parfum-lp .hero p { font-size:15px; margin-bottom:24px; }
          .parfum-lp .hero .btn { width:100%; }
          .parfum-lp .hero-trust { justify-content:center; gap:10px; font-size:11px; margin-top:20px; }
          
          /* Metrics Mobile */
          .parfum-lp .metrics { margin-top:-28px; }
          .parfum-lp .metric-card { grid-template-columns:1fr 1fr; padding:20px 16px; text-align:center; }
          .parfum-lp .metric-card h2 { grid-column:1/-1; font-size:18px; margin-bottom:16px; }
          .parfum-lp .metric { padding:0; border:0; }
          .parfum-lp .metric + .metric { border-left:1px solid var(--line); }
          .parfum-lp .metric b { font-size:28px; }
          .parfum-lp .metric span { font-size:11px; }
          
          /* Value & Checks Mobile - Full 1 Column for Easy Reading */
          .parfum-lp .value-grid, .parfum-lp .academy-grid { grid-template-columns:1fr; gap:28px; }
          .parfum-lp .value-copy h2 { font-size:30px; letter-spacing:-0.8px; }
          .parfum-lp .value-copy p, .parfum-lp .academy-copy p { font-size:15px; }
          .parfum-lp .checks { grid-template-columns:1fr; gap:12px; }
          .parfum-lp .check { min-height:auto; padding:16px 18px; display:flex; flex-direction:row; align-items:flex-start; gap:14px; border-radius:16px; }
          .parfum-lp .check i { flex:0 0 28px; width:28px; height:28px; margin-top:2px; font-size:14px; }
          .parfum-lp .check b { font-size:15px; display:block; margin-bottom:4px; }
          .parfum-lp .check span { font-size:13px; line-height:1.45; }
          
          /* Catalog Mobile */
          .parfum-lp .product-grid { grid-template-columns:1fr 1fr; gap:10px; }
          .parfum-lp .product { height:280px; border-radius:16px; }
          .parfum-lp .product-badge { top:10px; right:10px; font-size:10px; padding:4px 10px; opacity:0.95; }
          .parfum-lp .product-copy { left:16px; right:16px; bottom:18px; }
          .parfum-lp .product-copy h3 { font-size:20px; }
          .parfum-lp .product-copy p { font-size:11px; line-height:1.4; }
          
          /* Process Mobile */
          .parfum-lp .process-grid { grid-template-columns:1fr; gap:14px; }
          .parfum-lp .step { grid-column:span 1 !important; height:290px; border-radius:16px; }
          .parfum-lp .step-copy { bottom:20px; left:20px; right:20px; padding:0; }
          .parfum-lp .step-copy b { font-size:13px; margin-bottom:6px; }
          .parfum-lp .step-copy h3 { font-size:20px; margin-bottom:8px; }
          .parfum-lp .step-copy p { font-size:14px; line-height:1.45; }
          
          /* Academy Mobile */
          .parfum-lp .academy-copy h2 { font-size:28px; line-height:1.18; letter-spacing:-.4px; }
          .parfum-lp .academy-list { grid-template-columns:1fr; gap:8px; margin:20px 0 24px; }
          .parfum-lp .academy-list li { min-height:0; padding:13px 14px; font-size:14px; line-height:1.4; }
          .parfum-lp .academy .btn { width:100%; }
          .parfum-lp .academy-collage { grid-template-rows:190px 155px; gap:8px; }
          .parfum-lp .academy-collage img { border-radius:14px; }
          
          /* Closing Mobile */
          .parfum-lp .closing { padding:56px 18px 110px; }
          .parfum-lp .closing h2 { font-size:32px; letter-spacing:-0.8px; }
          .parfum-lp .closing .btn { width:100%; }
          .parfum-lp .closing-guarantees { gap:12px; font-size:12px; flex-direction:column; align-items:center; }
          
          /* Floating WA Button Mobile */
          .parfum-lp .wa { width:54px; height:54px; right:16px; bottom:16px; padding:0; justify-content:center; border-radius:50%; }
          .parfum-lp .wa-label { display:none; }
        }
      `}</style>

      <div className="parfum-lp">
        <main>
          {/* 1. HERO SECTION */}
          <section className="hero">
            <Image
              className="hero-bg"
              src="/assets/maklon-parfum/hero-parfum.webp"
              alt="Koleksi botol parfum untuk pengembangan brand"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
            <div className="hero-shade"></div>

            {/* Top Brand Bar */}
            <div className="hero-topbar">
              <div className="wrap hero-topbar-inner">
                <div className="hero-logo-wrap">
                  <Image
                    src="/assets/images/LOGO-DREAMLAB-1-white.webp"
                    alt="Dreamlab Maklon Parfum"
                    width={150}
                    height={48}
                    className="hero-logo"
                    priority
                  />
                </div>
                <a
                  className="btn-nav track"
                  data-location="top-nav"
                  href="/ads/thankyou/metaads/?source=meta-parfum&from=/ads/maklon-parfum/"
                >
                  Konsultasi Gratis &rarr;
                </a>
              </div>
            </div>

            {/* Hero Main Copy */}
            <div className="wrap hero-copy">
              <span className="eyebrow">#1 MAKLON PARFUM CUSTOM AROMA</span>
              <h1>Wujudkan Brand Parfum dengan <em>Aroma Eksklusif</em> Milik Anda</h1>
              <p>Dari konsep aroma hingga siap dipasarkan, Dreamlab membantu Anda mengembangkan parfum dengan formula khas yang sesuai target market.</p>
              <a
                className="btn track"
                data-location="hero"
                href="/ads/thankyou/metaads/?source=meta-parfum&from=/ads/maklon-parfum/"
              >
                KONSULTASI BRAND ANDA &rarr;
              </a>
              <div className="hero-trust">
                <span>1 Client, 1 Custom Formula</span>
                <span>FREE LEGALITAS BPOM</span>
                <span>Siap Produksi</span>
              </div>
            </div>
          </section>

          {/* 2. METRICS SECTION */}
          <section className="metrics">
            <div className="wrap">
              <div className="metric-card">
                <h2>Dipercaya untuk Mengembangkan Brand Beauty</h2>
                <div className="metric"><b data-count="500">500++</b><span>Brand bekerja sama</span></div>
                <div className="metric"><b data-count="1000">1.000+</b><span>Produk dikembangkan</span></div>
              </div>
            </div>
          </section>

          {/* 3. VALUE & BENEFITS SECTION */}
          <section className="value section">
            <div className="wrap value-grid">
              <div className="value-copy">
                <span className="eyebrow">FASILITAS &amp; KEUNTUNGAN MAKLON</span>
                <h2>Semua Kebutuhan Brand Parfum Anda dalam Satu Partner</h2>
                <p>Dreamlab mendampingi pengembangan formula, visual brand, legalitas, produksi, hingga persiapan pemasaran.</p>
              </div>
              <div className="checks">
                <div className="check">
                  <i>&#10003;</i>
                  <div>
                    <b>Custom Formula Eksklusif</b>
                    <span>Formula dikembangkan sesuai konsep brand Anda dengan prinsip 1 Client 1 Formula.</span>
                  </div>
                </div>
                <div className="check">
                  <i>&#10003;</i>
                  <div>
                    <b>R&amp;D Perfumery</b>
                    <span>Karakter aroma dirancang langsung bersama tim perfumer dan formulator berpengalaman.</span>
                  </div>
                </div>
                <div className="check">
                  <i>&#10003;</i>
                  <div>
                    <b>MOQ &amp; HPP Fleksibel</b>
                    <span>Skala produksi disesuaikan dengan kesiapan bisnis Anda untuk maksimalkan margin laba.</span>
                  </div>
                </div>
                <div className="check">
                  <i>&#10003;</i>
                  <div>
                    <b>Support End-to-End</b>
                    <span>FREE Pengurusan Legalitas BPOM, HKI, Halal, desain kemasan, dan digital marketing mentoring.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. CATALOG SECTION */}
          <section className="catalog section">
            <div className="wrap">
              <div className="title">
                <span className="eyebrow">KATALOG MAKLON PARFUM</span>
                <h2>Pilihan Produk Parfum yang Bisa Anda Develop</h2>
                <p>Tentukan produk sesuai positioning dan target market. Formula, karakter aroma, serta tampilannya dapat dikembangkan bersama Dreamlab.</p>
              </div>
              <div className="product-grid">
                <a
                  className="product track"
                  data-location="catalog-edp"
                  href="/ads/thankyou/metaads/?source=meta-parfum&from=/ads/maklon-parfum/"
                >
                  <Image src="/assets/maklon-parfum/edp.webp" alt="Eau de Parfum" fill loading="lazy" sizes="(max-width: 760px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                  <span className="product-badge">Konsultasi &rarr;</span>
                  <div className="product-copy"><h3>Eau de Parfum</h3><p>Karakter aroma intens dan elegan.</p></div>
                </a>
                <a
                  className="product track"
                  data-location="catalog-edt"
                  href="/ads/thankyou/metaads/?source=meta-parfum&from=/ads/maklon-parfum/"
                >
                  <Image src="/assets/maklon-parfum/edt.webp" alt="Eau de Toilette" fill loading="lazy" sizes="(max-width: 760px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                  <span className="product-badge">Konsultasi &rarr;</span>
                  <div className="product-copy"><h3>Eau de Toilette</h3><p>Segar dan nyaman untuk pemakaian harian.</p></div>
                </a>
                <a
                  className="product track"
                  data-location="catalog-edc"
                  href="/ads/thankyou/metaads/?source=meta-parfum&from=/ads/maklon-parfum/"
                >
                  <Image src="/assets/maklon-parfum/edc.webp" alt="Eau de Cologne" fill loading="lazy" sizes="(max-width: 760px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                  <span className="product-badge">Konsultasi &rarr;</span>
                  <div className="product-copy"><h3>Eau de Cologne</h3><p>Ringan dengan kesan menyegarkan.</p></div>
                </a>
                <a
                  className="product track"
                  data-location="catalog-extrait"
                  href="/ads/thankyou/metaads/?source=meta-parfum&from=/ads/maklon-parfum/"
                >
                  <Image src="/assets/maklon-parfum/extrait.webp" alt="Extrait de Parfum" fill loading="lazy" sizes="(max-width: 760px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                  <span className="product-badge">Konsultasi &rarr;</span>
                  <div className="product-copy"><h3>Extrait de Parfum</h3><p>Konsentrasi tinggi untuk lini premium.</p></div>
                </a>
                <a
                  className="product track"
                  data-location="catalog-body-mist"
                  href="/ads/thankyou/metaads/?source=meta-parfum&from=/ads/maklon-parfum/"
                >
                  <Image src="/assets/maklon-parfum/body-mist.webp" alt="Body Mist" fill loading="lazy" sizes="(max-width: 760px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                  <span className="product-badge">Konsultasi &rarr;</span>
                  <div className="product-copy"><h3>Body Mist</h3><p>Ringan, praktis, dan mudah digunakan ulang.</p></div>
                </a>
                <a
                  className="product track"
                  data-location="catalog-essential-oil"
                  href="/ads/thankyou/metaads/?source=meta-parfum&from=/ads/maklon-parfum/"
                >
                  <Image src="/assets/maklon-parfum/essential-oil.webp" alt="Essential Oil" fill loading="lazy" sizes="(max-width: 760px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                  <span className="product-badge">Konsultasi &rarr;</span>
                  <div className="product-copy"><h3>Essential Oil</h3><p>Eksplorasi aroma dari bahan esensial.</p></div>
                </a>
              </div>
            </div>
          </section>

          {/* 5. PROCESS SECTION (5 Balanced Steps) */}
          <section className="process section">
            <div className="wrap">
              <div className="title">
                <span className="eyebrow">ALUR PENGEMBANGAN</span>
                <h2>5 Langkah Mudah Wujudkan Brand Parfum Anda</h2>
                <p>Setiap tahap didampingi agar proses membangun brand terasa lebih jelas dan terarah.</p>
              </div>
              <div className="process-grid">
                <a
                  className="step track"
                  data-location="step-1"
                  href="/ads/thankyou/metaads/?source=meta-parfum&from=/ads/maklon-parfum/"
                >
                  <Image src="/assets/maklon-parfum/consultation.webp" alt="Konsultasi IDE" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                  <div className="step-copy"><b>STEP 01</b><h3>KONSULTASI BRAND &amp; TARGET MARKET</h3><p>Diskusikan konsep parfum, target market, karakter aroma, dan positioning brand Anda.</p></div>
                </a>
                <a
                  className="step track"
                  data-location="step-2"
                  href="/ads/thankyou/metaads/?source=meta-parfum&from=/ads/maklon-parfum/"
                >
                  <Image src="/assets/maklon-parfum/sample.webp" alt="Formulasi & Sample" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                  <div className="step-copy"><b>STEP 02</b><h3>FORMULASI &amp; SAMPLE AROMA</h3><p>Tim R&amp;D mengembangkan formula dan sample parfum sesuai brief serta karakter brand.</p></div>
                </a>
                <a
                  className="step track"
                  data-location="step-3"
                  href="/ads/thankyou/metaads/?source=meta-parfum&from=/ads/maklon-parfum/"
                >
                  <Image src="/assets/maklon-parfum/legal-design.webp" alt="Legalitas & Desain" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                  <div className="step-copy"><b>STEP 03</b><h3>LEGALITAS &amp; DESAIN</h3><p>Setelah formula disetujui, proses dilanjutkan ke legalitas dan pengembangan desain kemasan.</p></div>
                </a>
                <a
                  className="step track"
                  data-location="step-4"
                  href="/ads/thankyou/metaads/?source=meta-parfum&from=/ads/maklon-parfum/"
                >
                  <Image src="/assets/maklon-parfum/production.webp" alt="Produksi & Quality Control" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                  <div className="step-copy"><b>STEP 04</b><h3>PRODUKSI &amp; QUALITY CONTROL</h3><p>Produk diproduksi sesuai standar fasilitas Dreamlab dan melalui proses quality control ketat.</p></div>
                </a>
                <a
                  className="step track"
                  data-location="step-5"
                  href="/ads/thankyou/metaads/?source=meta-parfum&from=/ads/maklon-parfum/"
                >
                  <Image src="/assets/maklon-parfum/delivery.webp" alt="Delivery" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                  <div className="step-copy"><b>STEP 05</b><h3>DELIVERY &amp; SIAP LAUNCHING</h3><p>Produk yang sudah selesai dipersiapkan untuk dikirim dan siap masuk ke tahap pemasaran.</p></div>
                </a>
              </div>
            </div>
          </section>

          {/* 6. ACADEMY / VALUE ADD */}
          <section className="academy section">
            <div className="wrap academy-grid">
              <div className="academy-copy">
                <span className="eyebrow">FREE BEAUTYPRENEUR COMMUNITY</span>
                <h2>Hanya di Dreamlab, Brand Anda Bukan Sekadar Diproduksi, tetapi Juga Dibimbing untuk Bertumbuh</h2>
                <p>Nikmati pendampingan praktis untuk memperkuat branding dan meningkatkan penjualan online.</p>
                <ul className="academy-list">
                  <li>Mentoring strategi digital marketing &amp; iklan</li>
                  <li>Panduan membangun branding dan positioning produk</li>
                  <li>Strategi memasarkan dan menjual produk secara online</li>
                  <li>Networking bersama komunitas beautypreneur</li>
                </ul>
                <a
                  className="btn track"
                  data-location="academy"
                  href="/ads/thankyou/metaads/?source=meta-parfum&from=/ads/maklon-parfum/"
                >
                  Jadi Partner Dreamlab &rarr;
                </a>
              </div>
              <div className="academy-collage">
                <Image src="/assets/maklon-parfum/academy-community.webp" alt="Komunitas beautypreneur Dreamlab" width={500} height={500} loading="lazy" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                <Image src="/assets/maklon-parfum/academy-digital-marketing.webp" alt="Mentoring digital marketing" width={500} height={500} loading="lazy" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                <Image src="/assets/maklon-parfum/academy-branding.webp" alt="Sesi branding Dreamlab Academy" width={500} height={500} loading="lazy" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              </div>
            </div>
          </section>

          {/* 7. INTERACTIVE CERTIFICATION / TRUST SECTION */}
          <AdsCredibilitySection channel="metaads" />

          {/* 8. BRAND / OUR CLIENT - LOGO BERJALAN */}
          <LogoScroll 
            logos={aboutData.partnerLogos} 
            headline="Brand yang Telah Bertumbuh Bersama Dreamlab"
            subHeadline="Dipercaya oleh berbagai brand beauty untuk mengembangkan produk yang siap bersaing di pasar."
          />

          {/* 9. CLOSING SECTION */}
          <section className="closing">
            <span className="eyebrow">MULAI DARI IDE AROMA ANDA</span>
            <h2>Wujudkan Brand Parfum dengan Formula yang Punya Karakter</h2>
            <p>Konsultasikan konsep parfum Anda bersama tim Dreamlab sekarang. Nikmati FREE konsultasi formula, desain kemasan, hingga legalitas BPOM.</p>
            <a
              className="btn track"
              data-location="closing"
              href="/ads/thankyou/metaads/?source=meta-parfum&from=/ads/maklon-parfum/"
            >
              KONSULTASI BRAND ANDA SEKARANG &rarr;
            </a>
            <div className="closing-guarantees">
              <span>✓ Respon Cepat &lt; 15 Menit</span>
              <span>✓ FREE Konsultasi &amp; Sample</span>
              <span>✓ MoU Kerahasiaan Formula (NDA)</span>
            </div>
          </section>
        </main>
        
        {/* Floating WhatsApp CTA */}
        <a
          className="wa track"
          data-location="floating-whatsapp"
          href="/ads/thankyou/metaads/?source=meta-parfum&from=/ads/maklon-parfum/"
          aria-label="Konsultasi WhatsApp Langsung"
        >
          <span className="wa-ping"></span>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span className="wa-label">Konsultasi WhatsApp</span>
        </a>
      </div>
    </>
  );
}
