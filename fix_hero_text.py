import re

with open("src/app/google-ads/maklon-parfum/page.tsx", "r") as f:
    content = f.read()

# Fix color to dark and remove margin:0
content = re.sub(
    r'\.parfum-lp \.hero-copy \{.*?\}',
    '.parfum-lp .hero-copy { position:relative; z-index:20; color:var(--dark); max-width:700px; }',
    content
)

# Fix eyebrow color to dark orange for better contrast on light bg
content = re.sub(
    r'\.parfum-lp \.eyebrow \{.*?\}',
    '.parfum-lp .eyebrow { display:inline-block; background:rgba(217,138,0,0.1); border:1px solid var(--orange); color:#b87500; padding:6px 14px; border-radius:30px; font-size:12px; font-weight:800; letter-spacing:1.5px; margin-bottom:24px; }',
    content
)

with open("src/app/google-ads/maklon-parfum/page.tsx", "w") as f:
    f.write(content)
