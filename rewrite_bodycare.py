import re

with open("src/app/google-ads/maklon-parfum/page.tsx", "r") as f:
    parfum_content = f.read()

# Make it a body care page
content = parfum_content.replace('GoogleAdsMaklonParfum', 'GoogleAdsMaklonBodyCare')
content = content.replace('Maklon Parfum', 'Maklon Body Care')
content = content.replace('parfum dari konsep aroma,', 'produk body care dari konsep bahan aktif,')
content = content.replace('Koleksi botol parfum', 'Koleksi produk body care')
content = content.replace('MAKLON PARFUM CUSTOM', 'MAKLON BODY CARE CUSTOM')
content = content.replace('Mau Buat Brand Parfum Custom', 'Mau Buat Brand Body Care Custom')
content = content.replace('Aroma Eksklusif?', 'Formula Eksklusif?</span>')
# Fix the h1 explicitly:
content = re.sub(r'<h1>.*?</h1>', '<h1><span style={{color:"#fff"}}>Mau Buat Brand Body Care Custom dengan</span> <em>Formula Eksklusif?</em></h1>', content)

# Change hero image
content = content.replace('/assets/maklon-parfum/hero-parfum.webp', '/new asset/landing page/skincare.webp')

# Change class namespace
content = content.replace('parfum-lp', 'bodycare-lp')

# Change Quick Values to Body Care Trends (4 trends)
trends_html = """<div className="checks" style={{marginTop: "0px", gridTemplateColumns: "repeat(4, 1fr)"}}>
                <div className="check"><i>&#10003;</i><b>Fokus Skin Barrier & Hidrasi</b></div>
                <div className="check"><i>&#10003;</i><b>Tren Body Serum & Sunscreen</b></div>
                <div className="check"><i>&#10003;</i><b>Body Care Wangi Parfum Premium</b></div>
                <div className="check"><i>&#10003;</i><b>Infusi Bahan Aktif Skincare</b></div>
              </div>"""
content = re.sub(r'<div className="checks".*?</div>\s*</div>', trends_html + '\n            </div>', content, flags=re.DOTALL)
# Fix grid-template-columns in CSS for checks
content = content.replace('grid-template-columns:repeat(5,1fr);', 'grid-template-columns:repeat(4,1fr);')

# Add imports for ProductGrid at the top
imports = """import { Metadata } from "next";
import Image from "next/image";
import { getProductDataV2 } from "@/data/products-v2";
import ProductGrid from "@/components/ProductPageV2/ProductGrid";
"""
content = re.sub(r'import { Metadata } from "next";\nimport Image from "next/image";', imports, content)

# Inject getting the data inside the component
content = content.replace('export default function GoogleAdsMaklonBodyCare() {', 'export default function GoogleAdsMaklonBodyCare() {\n  const bodycareData = getProductDataV2("bodycare");')

# Replace Catalog section with ProductGrid
catalog_html = """<section className="catalog section pb-0 mt-0">
            <div className="wrap" style={{maxWidth: "1280px"}}>
              {bodycareData && bodycareData.products && (
                <ProductGrid products={bodycareData.products} categorySlug={bodycareData.slug} />
              )}
            </div>
          </section>"""
content = re.sub(r'<section className="catalog section pb-0 mt-0">.*?</section>', catalog_html, content, flags=re.DOTALL)

# Fix Process texts
content = content.replace('MAKLON PARFUM DARI', 'MAKLON BODY CARE DARI')
content = content.replace('konsep parfum,', 'konsep body care,')
content = content.replace('karakter aroma yang ingin dibangun.', 'formula dan tekstur yang ingin dibangun.')
content = content.replace('SAMPLE AROMA', 'SAMPLE FORMULA')
content = content.replace('karakter aroma yang tepat.', 'tekstur dan khasiat yang tepat.')
content = content.replace('PARFUM ANDA?', 'BODY CARE ANDA?')
content = content.replace('konsep aroma sampai', 'konsep formulasi sampai')
content = content.replace('MULAI DARI IDE AROMA ANDA', 'MULAI DARI IDE BODY CARE ANDA')

# Fix metadata description
content = content.replace('Wujudkan brand parfum dengan custom formula dan signature scent bersama Dreamlab.', 'Wujudkan brand body care dengan custom formula bersama Dreamlab.')
content = content.replace('https://dreamlab.id/google-ads/maklon-parfum/', 'https://dreamlab.id/google-ads/maklon-body-care/')

with open("src/app/google-ads/maklon-body-care/page.tsx", "w") as f:
    f.write(content)
