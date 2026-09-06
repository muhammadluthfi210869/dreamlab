import re

with open("src/app/google-ads/maklon-body-care/page.tsx", "r") as f:
    content = f.read()

# 1. Update text "VALUE DREAMLAB" to "500++ BRAND BEKERJASAMA | 1000++ PRODUK"
# Wait, let's see exactly what the text is.
content = content.replace('<span className="eyebrow">VALUE DREAMLAB</span>', '<span className="eyebrow">500++ BRAND BEKERJASAMA | 1000++ PRODUK</span>')

# 2. Make the .checks grid responsive
# The inline style currently says:
# <div className="checks" style={{marginTop: "0px", gridTemplateColumns: "repeat(4, 1fr)"}}>
# Let's remove the inline style gridTemplateColumns and handle it in the style tag.
content = content.replace('style={{marginTop: "0px", gridTemplateColumns: "repeat(4, 1fr)"}}', 'style={{marginTop: "0px"}} className="checks value-checks"')

# Add CSS for .value-checks to make it 4 cols on desktop and 1 col on mobile
# Find where the CSS block is.
css_to_insert = """
          .bodycare-lp .value-checks { display:grid; grid-template-columns:repeat(4, 1fr); gap:16px; }
          @media (max-width: 1024px) {
            .bodycare-lp .value-checks { grid-template-columns:repeat(2, 1fr); }
          }
          @media (max-width: 768px) {
            .bodycare-lp .value-checks { grid-template-columns:1fr; }
            .bodycare-lp .process-grid { grid-template-columns:1fr; gap:16px; }
          }
"""
content = content.replace('.bodycare-lp .checks {', css_to_insert + '\n          .bodycare-lp .checks {')

with open("src/app/google-ads/maklon-body-care/page.tsx", "w") as f:
    f.write(content)
