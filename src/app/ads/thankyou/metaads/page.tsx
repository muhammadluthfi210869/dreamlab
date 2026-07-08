"use client";

import { useEffect, useRef } from "react";

export default function ThankYouMetaAds() {
  const redirected = useRef(false);

  useEffect(() => {
    document.title = "Terima Kasih | Dreamlab";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    if (redirected.current) return;
    redirected.current = true;
    const timer = setTimeout(() => {
      window.location.href = "/ads/thankyou/metaads/redirect?campaign=metaads";
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        :root {
          --brand-dark: #0f1f18;
          --brand-primary: #1f6e4d;
          --brand-primary-light: #2f9c6c;
          --wa-green: #25d366;
          --wa-green-dark: #1ebe5d;
          --text-muted: #6b7280;
          --bg-soft: #f6faf8;
          --radius: 16px;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background: linear-gradient(180deg, var(--bg-soft) 0%, #ffffff 55%);
          color: var(--brand-dark);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .header-metaads {
          padding: 20px 24px;
          display: flex;
          justify-content: center;
        }
        .header-metaads img {
          height: 40px;
          object-fit: contain;
        }
        .main-metaads {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 20px 60px;
        }
        .card {
          width: 100%;
          max-width: 480px;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 12px 40px rgba(15, 31, 24, 0.08);
          padding: 44px 32px 36px;
          text-align: center;
          animation: fadeUp 0.5s ease-out;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .check-badge {
          width: 68px;
          height: 68px;
          margin: 0 auto 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--brand-primary-light), var(--brand-primary));
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(31, 110, 77, 0.28);
        }
        .check-badge svg {
          width: 32px;
          height: 32px;
          stroke: #fff;
          stroke-width: 3;
          fill: none;
        }
        .card h1 {
          font-size: 26px;
          font-weight: 800;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }
        p.lead {
          color: var(--text-muted);
          font-size: 15.5px;
          line-height: 1.6;
          margin-bottom: 6px;
        }
        p.instruction {
          color: var(--brand-dark);
          font-weight: 600;
          font-size: 15px;
          margin: 22px 0 18px;
        }
        .wa-button {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          background: linear-gradient(135deg, var(--wa-green), var(--wa-green-dark));
          color: #fff;
          text-decoration: none;
          font-weight: 800;
          font-size: 15px;
          letter-spacing: 0.05em;
          padding: 17px 20px;
          border-radius: var(--radius);
          box-shadow: 0 10px 24px rgba(37, 211, 102, 0.35);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          border: none;
          cursor: pointer;
        }
        .wa-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(37, 211, 102, 0.42);
        }
        .wa-button:active {
          transform: translateY(0);
        }
        .wa-button svg {
          width: 24px;
          height: 24px;
          fill: #fff;
          flex-shrink: 0;
        }
        .pulse-ring {
          position: absolute;
          inset: 0;
          border-radius: var(--radius);
          border: 2px solid var(--wa-green);
          animation: pulse 2s ease-out infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.08); opacity: 0; }
        }
        .trust-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px 14px;
          margin-top: 18px;
          font-size: 12.5px;
          color: var(--text-muted);
        }
        .trust-row span {
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 600;
        }
        .trust-row span::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--brand-primary-light);
        }
        .divider {
          height: 1px;
          background: #eef1ef;
          margin: 28px 0 22px;
        }
        .social-proof {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 13.5px;
          color: var(--brand-dark);
          font-weight: 600;
        }
        .badges {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 14px;
          flex-wrap: wrap;
        }
        .badge {
          font-size: 11.5px;
          font-weight: 700;
          color: var(--brand-primary);
          background: rgba(31, 110, 77, 0.08);
          padding: 6px 12px;
          border-radius: 999px;
        }
        footer {
          text-align: center;
          padding: 22px 16px 30px;
          font-size: 12px;
          color: var(--text-muted);
        }
        @media (max-width: 380px) {
          .card { padding: 36px 22px 28px; }
          .card h1 { font-size: 22px; }
        }
        .progress-track {
          width: 100%;
          height: 4px;
          background: rgba(31, 110, 77, 0.12);
          border-radius: 999px;
          overflow: hidden;
          margin: 4px 0 18px;
        }
        .progress-fill {
          height: 100%;
          width: 0%;
          background: var(--brand-primary-light);
          border-radius: 999px;
          animation: fillProgress 1s linear forwards;
        }
        @keyframes fillProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>

      <header className="header-metaads">
        <img
          src="https://dreamlab.id/assets/images/LOGO-DREAMLAB-1-white.webp"
          alt="Dreamlab"
          style={{ filter: "invert(1) grayscale(1) brightness(0.3)" }}
        />
      </header>

      <main className="main-metaads">
        <div className="card">
          <div className="check-badge">
            <svg viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1>Terima Kasih! 🎉</h1>
          <p className="lead">
            Kami sudah menerima minat Anda. Sekarang, saatnya ngobrol langsung dengan tim kami.
          </p>
          <p className="instruction">
            Mengalihkan otomatis ke WhatsApp...
          </p>

          <div className="progress-track">
            <div className="progress-fill" />
          </div>

          <a
            id="waButton"
            href="/ads/thankyou/metaads/redirect?campaign=metaads"
            className="wa-button"
            rel="noopener"
          >
            <span className="pulse-ring" />
            <svg viewBox="0 0 24 24">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.81-.11a16.6 16.6 0 0 1-1.63-.6c-2.87-1.24-4.74-4.14-4.89-4.33-.14-.19-1.17-1.56-1.17-2.97 0-1.42.74-2.11 1-2.4.27-.29.58-.36.78-.36.19 0 .39 0 .55.01.18.01.42-.07.65.5.24.58.83 2 .9 2.15.07.14.12.31.02.5-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.35 1.46.29.14.46.12.63-.07.17-.19.72-.84.92-1.13.19-.29.39-.24.65-.15.27.1 1.7.8 1.99.95.29.14.48.22.55.34.07.13.07.75-.17 1.43z" />
            </svg>
            <span>HUBUNGI MELALUI WA</span>
          </a>

          <div className="trust-row">
            <span>Respon Cepat</span>
            <span>Tanpa Kewajiban</span>
            <span>100% Gratis</span>
          </div>

          <div className="divider" />

          <div className="social-proof">
            500+ Brand Sudah Mempercayakan Formulasinya
          </div>
          <div className="badges">
            <span className="badge">BPOM RI</span>
            <span className="badge">CPKB Grade A</span>
            <span className="badge">Halal MUI</span>
          </div>
        </div>
      </main>

      <footer>
        © PT Karya Impian Laboratoris. All Rights Reserved.
      </footer>
    </>
  );
}
