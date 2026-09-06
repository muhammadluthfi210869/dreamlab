import re

with open("src/app/google-ads/maklon-parfum/page.tsx", "r") as f:
    content = f.read()

# Fix Hero background and text color to clean Dreamlab theme
content = content.replace('.parfum-lp .hero { position:relative; min-height:85vh; display:flex; align-items:center; padding:100px 0 60px; background:#000; overflow:hidden; }', '.parfum-lp .hero { position:relative; min-height:85vh; display:flex; align-items:center; padding:100px 0 60px; background:#FAF9F6; overflow:hidden; }')
content = content.replace('.parfum-lp .hero-bg { opacity:0.65; object-position:75% center; }', '.parfum-lp .hero-bg { opacity:1; object-position:82% center; }')
content = content.replace('.parfum-lp .hero-shade { position:absolute; inset:0; background:linear-gradient(to right, rgba(18,28,45,0.95) 0%, rgba(18,28,45,0.7) 50%, rgba(18,28,45,0) 100%); z-index:1; }', '.parfum-lp .hero-shade { position:absolute; inset:0; background:linear-gradient(to right, rgba(250,249,246,0.95) 0%, rgba(250,249,246,0.85) 40%, rgba(250,249,246,0.2) 100%); z-index:1; }')
content = content.replace('.parfum-lp .hero-copy { position:relative; z-index:2; color:#fff; max-width:700px; margin:0; }', '.parfum-lp .hero-copy { position:relative; z-index:2; color:var(--dark); max-width:700px; margin:0; }')
content = content.replace('.parfum-lp .hero p { font-size:18px; line-height:1.6; color:rgba(255,255,255,0.9); margin:0 0 40px; }', '.parfum-lp .hero p { font-size:18px; line-height:1.6; color:#555; font-weight:500; margin:0 0 40px; }')

# Fix text size for hero h1 if they said "tidak terlihat" maybe they want it bigger or darker?
# It inherits color:var(--dark); so it will be very visible on off-white.

# Delete .hero-trust CSS
content = re.sub(r'\.parfum-lp \.hero-trust \{.*?\}', '', content)
content = re.sub(r'\.parfum-lp \.hero-trust span \{.*?\}', '', content)
content = re.sub(r'\.parfum-lp \.hero-trust span:before \{.*?\}', '', content)

# Delete .hero-trust HTML
content = re.sub(r'<div className="hero-trust">.*?</div>', '', content)

# Update .checks grid
content = content.replace('.parfum-lp .checks { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; margin-top:40px; }', '.parfum-lp .checks { display:grid; grid-template-columns:repeat(5,1fr); gap:16px; margin-top:40px; align-items: stretch; }')
content = content.replace('.parfum-lp .check { display:flex; gap:16px; background:#fff; border:1px solid var(--line); padding:24px; border-radius:20px; }', '.parfum-lp .check { display:flex; flex-direction:column; align-items:center; text-align:center; gap:12px; background:#fff; border:1px solid var(--line); padding:20px 16px; border-radius:20px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }')
content = content.replace('.parfum-lp .check i { display:flex; align-items:center; justify-content:center; width:32px; height:32px; background:rgba(217,138,0,0.1); color:var(--orange); border-radius:50%; font-style:normal; font-weight:900; flex-shrink:0; }', '.parfum-lp .check i { display:flex; align-items:center; justify-content:center; width:40px; height:40px; background:rgba(217,138,0,0.1); color:var(--orange); border-radius:50%; font-style:normal; font-size:20px; font-weight:900; flex-shrink:0; }')
content = content.replace('.parfum-lp .check b { display:block; font-size:16px; font-weight:800; margin-bottom:6px; text-transform:uppercase; }', '.parfum-lp .check b { display:block; font-size:14px; font-weight:800; text-transform:uppercase; margin:0; line-height:1.3; color:var(--dark); }')

# Replace the checks HTML entirely
old_checks = """              <div className="checks" style={{marginTop: "0px"}}>
                <div className="check"><i>&#10003;</i><div><b>1 CLIENT, 1 CUSTOM FORMULA</b><span>Formula dikembangkan khusus untuk karakter brand Anda.</span></div></div>
                <div className="check"><i>&#10003;</i><div><b>DARI IDE SAMPAI SIAP PRODUKSI</b><span>Pendampingan proses pengembangan brand secara terarah.</span></div></div>
                <div className="check"><i>&#10003;</i><div><b>MOQ MENYESUAIKAN</b><span>Mulai sesuai kebutuhan pengembangan dan skala bisnis Anda.</span></div></div>
                <div className="check"><i>&#10003;</i><div><b>KONSULTASI BRAND</b><span>Diskusikan konsep produk, target market, dan arah aroma bersama Dreamlab.</span></div></div>
              </div>"""

new_checks = """              <div className="checks" style={{marginTop: "0px"}}>
                <div className="check"><i>&#10003;</i><b>1 CLIENT, 1 CUSTOM FORMULA</b></div>
                <div className="check"><i>&#10003;</i><b>MOQ MENYESUAIKAN</b></div>
                <div className="check"><i>&#10003;</i><b>FREE Konsultasi Bisnis</b></div>
                <div className="check"><i>&#10003;</i><b>FREE Pengurusan Legalitas BPOM</b></div>
                <div className="check"><i>&#10003;</i><b>FREE Marketing KIT Photo Produk</b></div>
              </div>"""

content = content.replace(old_checks, new_checks)

# Fix mobile checks grid from 1fr 1fr to 2fr or 3fr?
# wait, .parfum-lp .checks { grid-template-columns:1fr 1fr; } was in mobile media query.
# Let's let it be 1fr 1fr on mobile, it will wrap 5 items just fine (2 rows of 2, 1 row of 1). Or 1fr.
# Actually, the user's mobile query was `.parfum-lp .checks { grid-template-columns:1fr; gap:12px; margin-top:24px; }`. That works.

# Remove hero-shade mobile override
content = content.replace('.parfum-lp .hero-shade { background:linear-gradient(to bottom, rgba(18,28,45,0.85) 0%, rgba(18,28,45,0.95) 100%); }', '.parfum-lp .hero-shade { background:linear-gradient(to bottom, rgba(250,249,246,0.85) 0%, rgba(250,249,246,0.98) 100%); }')

with open("src/app/google-ads/maklon-parfum/page.tsx", "w") as f:
    f.write(content)
