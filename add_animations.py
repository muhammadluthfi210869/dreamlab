import re

with open("src/app/ads/maklon-parfum/page.tsx", "r") as f:
    content = f.read()

# Add animations to .step
old_step_css = """        .parfum-lp .step { position:relative; height:340px; border-radius:20px; overflow:hidden; background:#173248; box-shadow:var(--shadow); display:block; }
        .parfum-lp .step img { width:100%; height:100%; display:block; object-fit:cover; position:relative; z-index:0; }"""

new_step_css = """        .parfum-lp .step { position:relative; height:340px; border-radius:20px; overflow:hidden; background:#173248; box-shadow:var(--shadow); display:block; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease; cursor: pointer; }
        .parfum-lp .step:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
        .parfum-lp .step img { width:100%; height:100%; display:block; object-fit:cover; position:relative; z-index:0; transition: transform 0.7s ease; }
        .parfum-lp .step:hover img { transform: scale(1.06); }"""
content = content.replace(old_step_css, new_step_css)

# Add animations to .product
old_product_css = """        .parfum-lp .product { position:relative; height:390px; border-radius:18px; overflow:hidden; display:block; }
        .parfum-lp .product img { width:100%; height:100%; object-fit:cover; display:block; }"""

new_product_css = """        .parfum-lp .product { position:relative; height:390px; border-radius:18px; overflow:hidden; display:block; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease; }
        .parfum-lp .product:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(8,18,35,0.25); z-index: 10; }
        .parfum-lp .product img { width:100%; height:100%; object-fit:cover; display:block; transition: transform 0.7s ease; }
        .parfum-lp .product:hover img { transform: scale(1.06); }"""
content = content.replace(old_product_css, new_product_css)

# Add animations to .legal-card
old_legal_css = """        .parfum-lp .legal-card { background:#fff; border:1px solid var(--line); border-radius:20px; padding:24px; text-align:center; }"""

new_legal_css = """        .parfum-lp .legal-card { background:#fff; border:1px solid var(--line); border-radius:20px; padding:24px; text-align:center; transition: transform 0.3s ease, border-color 0.3s ease; }
        .parfum-lp .legal-card:hover { transform: translateY(-5px); border-color: var(--orange); }"""
content = content.replace(old_legal_css, new_legal_css)

with open("src/app/ads/maklon-parfum/page.tsx", "w") as f:
    f.write(content)

