import re

with open("src/app/ads/maklon-parfum/page.tsx", "r") as f:
    content = f.read()

# Change CTA handlers from /ads/thankyou/metaads/ to /ads/thankyou/google-ads/
content = content.replace('href="/ads/thankyou/metaads/"', 'href="/ads/thankyou/google-ads/"')

# Update "Quick Value" Section
# Current: 
# <div className="checks">
#   <div className="check"><i>&#10003;</i><div><b>Custom Formula Eksklusif</b><span>Formula dikembangkan sesuai konsep brand Anda.</span></div></div>
#   <div className="check"><i>&#10003;</i><div><b>R&amp;D Perfumery</b><span>Karakter aroma dirancang bersama tim formulasi.</span></div></div>
#   <div className="check"><i>&#10003;</i><div><b>MOQ &amp; HPP Fleksibel</b><span>Skala produksi disesuaikan dengan kesiapan bisnis.</span></div></div>
#   <div className="check"><i>&#10003;</i><div><b>Support End-to-End</b><span>FREE Pengurusan Legalitas BPOM, HKI, Halal, desain kemasan, dan digital marketing.</span></div></div>
# </div>

# We will replace it with the requested 4 quick values:
new_checks = """              <div className="checks">
                <div className="check"><i>&#10003;</i><div><b>1 CLIENT, 1 CUSTOM FORMULA</b><span>Formula dikembangkan khusus untuk karakter brand Anda.</span></div></div>
                <div className="check"><i>&#10003;</i><div><b>DARI IDE SAMPAI SIAP PRODUKSI</b><span>Pendampingan proses pengembangan brand secara terarah.</span></div></div>
                <div className="check"><i>&#10003;</i><div><b>MOQ MENYESUAIKAN</b><span>Mulai sesuai kebutuhan pengembangan dan skala bisnis Anda.</span></div></div>
                <div className="check"><i>&#10003;</i><div><b>KONSULTASI BRAND</b><span>Diskusikan konsep produk, target market, dan arah aroma bersama Dreamlab.</span></div></div>
              </div>"""

content = re.sub(r'<div className="checks">[\s\S]*?</div>\s*</div>\s*</section>', new_checks + '\n            </div>\n          </section>', content)


# Metadata title and description
content = re.sub(
    r'title: ".*?",',
    'title: "Maklon Parfum Custom Formula & Signature Scent | Dreamlab",',
    content
)
content = re.sub(
    r'description: ".*?",',
    'description: "Wujudkan brand parfum dengan custom formula dan signature scent bersama Dreamlab. Didampingi dari formulasi, legalitas, produksi hingga pemasaran.",',
    content
)

# Replace the title in the Hero
content = content.replace(
    '<h1>Wujudkan Brand Parfum dengan <em>Aroma Eksklusif</em> Milik Anda</h1>',
    '<h1>Mau Buat Brand Parfum Custom dengan <em>Aroma Eksklusif?</em></h1>'
)

# 1 Client 1 Custom Formula (Make it USP Utama)
# Wait, currently the layout goes from Pilihan Produk Parfum directly to Process Section!
# But the user specifically asked for: "1 CLIENT, 1 CUSTOM FORMULA" (USP Utama) using the existing R&D visual.
# And "MOQ / BRAND READINESS" using "DARI IDE SAMPAI SIAP PRODUKSI" and "MOQ MENYESUAIKAN".
# This means I need to INJECT the Tailwind sections for 1 Client 1 Custom Formula and MOQ from the old google-ads/maklon-parfum/page.tsx into this HTML.

with open("scratch/temp_ads_content.txt", "w") as f:
    f.write(content)
