import re

with open("src/app/google-ads/maklon-parfum/page.tsx", "r") as f:
    content = f.read()

# 1. FIX TEXT CONTRAST & TYPOGRAPHY
# Process title to white
content = content.replace('.parfum-lp .process .title p { color:rgba(255,255,255,0.8); }', '.parfum-lp .process .title h2 { color:#fff; }\n        .parfum-lp .process .title p { color:rgba(255,255,255,0.78); }')

# 2. PROCESS CARD TEXT
# Bottom overlay stronger gradient
old_overlay = 'background:linear-gradient(to top, rgba(5,15,30,0.96) 0%, rgba(5,15,30,0.82) 30%, rgba(5,15,30,0.35) 60%, rgba(5,15,30,0.05) 100%);'
new_overlay = 'background:linear-gradient(to top, rgba(5,15,30,0.96) 0%, rgba(5,15,30,0.75) 38%, rgba(5,15,30,0.20) 70%, transparent 100%);'
content = content.replace(old_overlay, new_overlay)

# Z-index fixing for process card
content = content.replace('z-index:2; color:#fff;', 'z-index:20; color:#fff;')
content = content.replace('z-index:1;', 'z-index:10;')

# 3. GLOBAL SECTION SPACING
content = content.replace('.parfum-lp .section { padding:80px 0; }', '.parfum-lp .section { padding:64px 0; }')
content = content.replace('.parfum-lp .title { text-align:center; max-width:700px; margin:0 auto 50px; }', '.parfum-lp .title { text-align:center; max-width:700px; margin:0 auto 32px; }')
content = content.replace('.parfum-lp .title h2 { font-size:42px; font-weight:900; margin:16px 0 20px; text-transform:uppercase; line-height:1.15; }', '.parfum-lp .title h2 { font-size:36px; font-weight:900; margin:12px 0 16px; text-transform:uppercase; line-height:1.15; }')

# 4. HEADING TO CONTENT GAP (Desktop & Mobile handled via title margin above)

# 5. PRODUCT CATALOG (Grid row gap 16-20px)
content = content.replace('.parfum-lp .product-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }', '.parfum-lp .product-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }')
# Margin bottom before process section
content = content.replace('.parfum-lp .catalog { padding-bottom:0; }', '.parfum-lp .catalog { padding-bottom:64px; }')
content = content.replace('pb-0 mt-8', 'pb-0 mt-0') # Remove extra mt-8 from section tailwind classes

# 6. USP Section (1 Client 1 Formula) gap reduction
# Current: <section className="section bg-gray-50 pb-0">
# Wait, it was <section className="section bg-gray-50 pb-0">
content = content.replace('<section className="section bg-gray-50 pb-0">', '<section className="section bg-gray-50 py-16">')

# 7. PROCESS SECTION spacing
# Cards -> CTA: 28-32px
content = content.replace('<div style={{ textAlign: "center", marginTop: "48px" }}>', '<div style={{ textAlign: "center", marginTop: "32px" }}>')

# 8. COMMUNITY SECTION (Academy)
content = content.replace('.parfum-lp .academy-copy h2 { font-size:42px; font-weight:900; margin:16px 0 20px; text-transform:uppercase; line-height:1.15; }', '.parfum-lp .academy-copy h2 { font-size:36px; font-weight:900; margin:12px 0 12px; text-transform:uppercase; line-height:1.15; }')
content = content.replace('.parfum-lp .academy-copy p { font-size:18px; color:#555; line-height:1.6; margin:0 0 24px; }', '.parfum-lp .academy-copy p { font-size:16px; color:#555; line-height:1.6; margin:0 0 24px; }')

# 9. OUR CLIENT SECTION
content = content.replace('.parfum-lp .clients-card { background:#fff; border:1px solid var(--line); border-radius:32px; padding:48px; text-align:center; }', '.parfum-lp .clients-card { background:#fff; border:1px solid var(--line); border-radius:32px; padding:32px; text-align:center; }')

# 10. FINAL CTA
content = content.replace('.parfum-lp .closing { text-align:center; background:#fff; padding:100px 24px; border-top:1px solid var(--line); }', '.parfum-lp .closing { text-align:center; background:#fff; padding:64px 24px; border-top:1px solid var(--line); }')
content = content.replace('.parfum-lp .closing h2 { font-size:48px; font-weight:900; margin:16px auto 20px; max-width:800px; text-transform:uppercase; line-height:1.15; }', '.parfum-lp .closing h2 { font-size:42px; font-weight:900; margin:12px auto 16px; max-width:800px; text-transform:uppercase; line-height:1.15; }')
content = content.replace('.parfum-lp .closing p { font-size:20px; color:#555; margin:0 auto 40px; }', '.parfum-lp .closing p { font-size:18px; color:#555; margin:0 auto 24px; }')

# MOBILE adjustments
content = content.replace('.parfum-lp .section { padding:50px 0; }', '.parfum-lp .section { padding:48px 0; }')
content = content.replace('.parfum-lp .closing { padding:60px 20px; }', '.parfum-lp .closing { padding:48px 20px; }')
content = content.replace('.parfum-lp .title { margin-bottom:30px; }', '.parfum-lp .title { margin-bottom:24px; }')

with open("src/app/google-ads/maklon-parfum/page.tsx", "w") as f:
    f.write(content)
