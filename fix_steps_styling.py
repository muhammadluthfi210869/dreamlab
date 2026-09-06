import re

with open("src/app/ads/maklon-parfum/page.tsx", "r") as f:
    content = f.read()

# CSS Desktop Replace
old_css = """        .parfum-lp .step { position:relative; height:340px; border-radius:20px; overflow:hidden; background:#173248; box-shadow:var(--shadow); display:block; }
        .parfum-lp .step img { width:100%; height:100%; display:block; object-fit:cover; }
        .parfum-lp .step:after { content:''; position:absolute; inset:0; background:linear-gradient(180deg, transparent 0%, rgba(8,18,35,0.85) 100%); pointer-events:none; }
        .parfum-lp .step-copy { position:absolute; bottom:24px; left:24px; right:24px; z-index:2; color:#fff; pointer-events:none; }
        .parfum-lp .step-copy b { display:block; color:#ffc06f; font-size:12px; font-weight:800; letter-spacing:1px; margin-bottom:6px; }
        .parfum-lp .step-copy h3 { margin:0 0 8px; font-size:22px; font-weight:800; text-transform:uppercase; text-shadow:0 1px 3px rgba(0,0,0,0.3); }
        .parfum-lp .step-copy p { margin:0; color:#f8fbfd; font-size:14px; line-height:1.55; opacity:0.95; }"""

new_css = """        .parfum-lp .step { position:relative; height:340px; border-radius:20px; overflow:hidden; background:#173248; box-shadow:var(--shadow); display:block; }
        .parfum-lp .step img { width:100%; height:100%; display:block; object-fit:cover; position:relative; z-index:0; }
        .parfum-lp .step:after { content:''; position:absolute; inset:0; background:linear-gradient(to top, rgba(5,15,30,0.96) 0%, rgba(5,15,30,0.82) 30%, rgba(5,15,30,0.35) 60%, rgba(5,15,30,0.05) 100%); pointer-events:none; z-index:1; }
        .parfum-lp .step-copy { position:absolute; bottom:28px; left:28px; right:28px; z-index:2; color:#fff; pointer-events:none; }
        .parfum-lp .step-copy b { display:block; color:var(--orange); font-size:14px; font-weight:800; letter-spacing:1px; margin-bottom:8px; text-transform:uppercase; }
        .parfum-lp .step-copy h3 { margin:0 0 12px; font-size:26px; font-weight:800; text-transform:uppercase; color:#fff; line-height:1.15; text-shadow:0 2px 8px rgba(0,0,0,0.35); }
        .parfum-lp .step-copy p { margin:0; color:rgba(255,255,255,0.92); font-size:17px; line-height:1.55; }"""

content = content.replace(old_css, new_css)

# CSS Mobile Replace
old_mob_css = """          .parfum-lp .step { display:block; height:300px; min-height:auto; }
          .parfum-lp .step img { height:100%; min-height:auto; }
          .parfum-lp .step-copy { bottom:20px; left:20px; right:20px; padding:0; }
          .parfum-lp .step-copy h3 { font-size:20px; margin-bottom:6px; }
          .parfum-lp .step-copy p { font-size:13px; }"""

new_mob_css = """          .parfum-lp .step { display:block; height:300px; min-height:auto; }
          .parfum-lp .step img { height:100%; min-height:auto; }
          .parfum-lp .step-copy { bottom:20px; left:20px; right:20px; padding:0; }
          .parfum-lp .step-copy b { font-size:13px; margin-bottom:8px; }
          .parfum-lp .step-copy h3 { font-size:22px; margin-bottom:10px; }
          .parfum-lp .step-copy p { font-size:15px; }"""

content = content.replace(old_mob_css, new_mob_css)

# HTML Replace
content = content.replace('<h3>KONSULTASI IDE</h3>', '<h3>KONSULTASI BRAND &amp; TARGET MARKET</h3>')
content = content.replace('<h3>FORMULASI &amp; SAMPLE</h3>', '<h3>FORMULASI &amp; SAMPLE AROMA</h3>')
# Legalitas & Desain stays the same
content = content.replace('<h3>DELIVERY</h3>', '<h3>DELIVERY &amp; SIAP LAUNCHING</h3>')

with open("src/app/ads/maklon-parfum/page.tsx", "w") as f:
    f.write(content)
