import re

with open("src/app/google-ads/maklon-parfum/page.tsx", "r") as f:
    content = f.read()

# 1. Make Academy collage visible on mobile
# Under @media(max-width:1024px)
content = content.replace('.parfum-lp .academy-collage { display:none; }', '.parfum-lp .academy-collage { display:grid; margin-top:32px; }')

# 2. Change hero text to WHITE and hero-shade to DARK (Charcoal #111827 / rgba(17,24,39))
content = content.replace(
    '.parfum-lp .hero-copy { position:relative; z-index:20; color:var(--dark); max-width:700px; }',
    '.parfum-lp .hero-copy { position:relative; z-index:20; color:#fff; max-width:700px; }'
)
content = content.replace(
    '.parfum-lp .hero p { font-size:18px; line-height:1.6; color:#555; font-weight:500; margin:0 0 40px; }',
    '.parfum-lp .hero p { font-size:18px; line-height:1.6; color:rgba(255,255,255,0.8); font-weight:500; margin:0 0 40px; }'
)
# Change eyebrow back to bright orange for dark background
content = content.replace(
    '.parfum-lp .eyebrow { display:inline-block; background:rgba(217,138,0,0.1); border:1px solid var(--orange); color:#b87500;',
    '.parfum-lp .eyebrow { display:inline-block; background:rgba(217,138,0,0.2); border:1px solid var(--orange); color:#ffb732;'
)

# Change hero-shade to dark charcoal gradient
content = content.replace(
    'background:linear-gradient(to right, rgba(250,249,246,0.9) 0%, rgba(250,249,246,0.65) 45%, rgba(250,249,246,0) 100%)',
    'background:linear-gradient(to right, rgba(17,24,39,0.95) 0%, rgba(17,24,39,0.7) 45%, rgba(17,24,39,0) 100%)'
)
# Change mobile hero-shade
content = content.replace(
    'background:linear-gradient(to bottom, rgba(250,249,246,0.4) 0%, rgba(250,249,246,0.85) 50%, rgba(250,249,246,0.98) 100%)',
    'background:linear-gradient(to bottom, rgba(17,24,39,0.3) 0%, rgba(17,24,39,0.85) 50%, rgba(17,24,39,0.98) 100%)'
)

# Replace the specific h1 text explicitly just to be safe
content = content.replace(
    '<h1>Mau Buat Brand Parfum Custom dengan <em>Aroma Eksklusif?</em></h1>',
    '<h1><span style={{color:"#fff"}}>Mau Buat Brand Parfum Custom dengan</span> <em>Aroma Eksklusif?</em></h1>'
)


with open("src/app/google-ads/maklon-parfum/page.tsx", "w") as f:
    f.write(content)
