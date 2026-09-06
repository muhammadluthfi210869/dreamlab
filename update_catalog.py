import re

with open("src/app/google-ads/maklon-body-care/page.tsx", "r") as f:
    content = f.read()

# Update the filter logic
old_filter = 'const filteredProducts = bodycareData?.products?.filter(p => !["deodorant-spray", "deodorant-roll-on", "deodorant-dry-serum", "deodorant-balm"].includes(p.slug)) || [];'
new_filter = 'const targetSlugs = ["body-serum", "body-scrub", "body-wash", "underarm-cream"];\n  const filteredProducts = bodycareData?.products?.filter(p => targetSlugs.includes(p.slug)) || [];'
content = content.replace(old_filter, new_filter)

# Add the button below ProductGrid
old_catalog_section = """          <section className="catalog section pb-0 mt-0">
            <div className="wrap" style={{maxWidth: "1280px"}}>
              {bodycareData && filteredProducts.length > 0 && (
                <ProductGrid products={filteredProducts} categorySlug={bodycareData.slug} />
              )}
            </div>
          </section>"""
new_catalog_section = """          <section className="catalog section pb-0 mt-0" style={{paddingBottom: "64px"}}>
            <div className="wrap" style={{maxWidth: "1280px"}}>
              {bodycareData && filteredProducts.length > 0 && (
                <ProductGrid products={filteredProducts} categorySlug={bodycareData.slug} />
              )}
              <div style={{ textAlign: "center", marginTop: "40px" }}>
                <a className="btn" style={{background: "var(--dark)", color: "#fff"}} href="/produk/bodycare/">EXPLORE PRODUK LAINNYA &rarr;</a>
              </div>
            </div>
          </section>"""
content = content.replace(old_catalog_section, new_catalog_section)

with open("src/app/google-ads/maklon-body-care/page.tsx", "w") as f:
    f.write(content)
