import re

with open("src/app/ads/maklon-parfum/page.tsx", "r") as f:
    content = f.read()

# CSS Desktop
old_css = """        .parfum-lp .step { border:1px solid var(--line); border-radius:20px; overflow:hidden; background:#fff; }
        .parfum-lp .step img { width:100%; height:235px; display:block; object-fit:cover; }
        .parfum-lp .step-copy { padding:20px; }
        .parfum-lp .step-copy b { color:var(--orange); font-size:12px; letter-spacing:1px; }
        .parfum-lp .step-copy h3 { margin:7px 0 7px; font-size:20px; }
        .parfum-lp .step-copy p { margin:0; color:var(--muted); font-size:14px; line-height:1.55; }"""

new_css = """        .parfum-lp .step { position:relative; height:340px; border-radius:20px; overflow:hidden; background:#173248; box-shadow:var(--shadow); display:block; }
        .parfum-lp .step img { width:100%; height:100%; display:block; object-fit:cover; }
        .parfum-lp .step:after { content:''; position:absolute; inset:0; background:linear-gradient(180deg, transparent 0%, rgba(8,18,35,0.85) 100%); pointer-events:none; }
        .parfum-lp .step-copy { position:absolute; bottom:24px; left:24px; right:24px; z-index:2; color:#fff; pointer-events:none; }
        .parfum-lp .step-copy b { display:block; color:#ffc06f; font-size:12px; font-weight:800; letter-spacing:1px; margin-bottom:6px; }
        .parfum-lp .step-copy h3 { margin:0 0 8px; font-size:22px; font-weight:800; text-transform:uppercase; text-shadow:0 1px 3px rgba(0,0,0,0.3); }
        .parfum-lp .step-copy p { margin:0; color:#f8fbfd; font-size:14px; line-height:1.55; opacity:0.95; }"""

content = content.replace(old_css, new_css)

# CSS Mobile
old_mob_css = """          .parfum-lp .step { display:grid; grid-template-columns:42% 58%; min-height:145px; }
          .parfum-lp .step img { height:100%; min-height:145px; }
          .parfum-lp .step-copy { padding:15px; }
          .parfum-lp .step-copy h3 { font-size:17px; }
          .parfum-lp .step-copy p { font-size:12px; }"""

new_mob_css = """          .parfum-lp .step { display:block; height:300px; min-height:auto; }
          .parfum-lp .step img { height:100%; min-height:auto; }
          .parfum-lp .step-copy { bottom:20px; left:20px; right:20px; padding:0; }
          .parfum-lp .step-copy h3 { font-size:20px; margin-bottom:6px; }
          .parfum-lp .step-copy p { font-size:13px; }"""

content = content.replace(old_mob_css, new_mob_css)

# HTML Items
steps_html = """              <div className="process-grid">
                <article className="step"><Image src="/assets/maklon-parfum/consultation.webp" alt="Konsultasi IDE" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} /><div className="step-copy"><b>STEP 01</b><h3>KONSULTASI IDE</h3><p>Diskusikan konsep parfum, target market, karakter aroma, dan positioning brand Anda.</p></div></article>
                <article className="step"><Image src="/assets/maklon-parfum/sample.webp" alt="Formulasi & Sample" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} /><div className="step-copy"><b>STEP 02</b><h3>FORMULASI &amp; SAMPLE</h3><p>Tim R&amp;D mengembangkan formula dan sample parfum sesuai brief serta karakter brand.</p></div></article>
                <article className="step"><Image src="/assets/maklon-parfum/legal-design.webp" alt="Legalitas & Desain" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} /><div className="step-copy"><b>STEP 03</b><h3>LEGALITAS &amp; DESAIN</h3><p>Setelah formula disetujui, proses dilanjutkan ke legalitas dan pengembangan desain kemasan.</p></div></article>
                <article className="step"><Image src="/assets/maklon-parfum/production.webp" alt="Produksi & Quality Control" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} /><div className="step-copy"><b>STEP 04</b><h3>PRODUKSI &amp; QUALITY CONTROL</h3><p>Produk diproduksi sesuai standar fasilitas Dreamlab dan melalui proses quality control.</p></div></article>
                <article className="step"><Image src="/assets/maklon-parfum/delivery.webp" alt="Delivery" fill loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} /><div className="step-copy"><b>STEP 05</b><h3>DELIVERY</h3><p>Produk yang sudah selesai dipersiapkan untuk dikirim dan siap masuk ke tahap pemasaran.</p></div></article>
              </div>"""

# Find and replace the process-grid block
pattern = r'<div className="process-grid">.*?</div>\s*</div>\s*</section>'
replacement = steps_html + "\n            </div>\n          </section>"

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open("src/app/ads/maklon-parfum/page.tsx", "w") as f:
    f.write(content)

