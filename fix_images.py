import re

with open("src/app/ads/maklon-parfum/page.tsx", "r") as f:
    content = f.read()

# Add Image import
if "import Image" not in content:
    content = content.replace('import { useMetaAdsCtaPixel } from "@/lib/meta-ads-pixel";',
                              'import { useMetaAdsCtaPixel } from "@/lib/meta-ads-pixel";\nimport Image from "next/image";')

# 1. Hero Image
content = re.sub(
    r'<img className="hero-bg" src="([^"]+)" alt="([^"]+)" />',
    r'<Image className="hero-bg" src="\1" alt="\2" fill priority sizes="100vw" style={{ objectFit: "cover" }} />',
    content
)

# 2. Hero CTA
content = content.replace('Konsultasikan Signature Scent Anda &rarr;', 'KONSULTASI BRAND ANDA &rarr;')
content = content.replace('Konsultasi Maklon Parfum &rarr;', 'KONSULTASI BRAND ANDA &rarr;')

# 3. Product Catalog
content = re.sub(
    r'<img src="(/assets/maklon-parfum/(edp|edt|edc|extrait|body-mist|essential-oil).webp)" alt="([^"]+)" />',
    r'<Image src="\1" alt="\3" fill loading="lazy" sizes="(max-width: 760px) 50vw, 33vw" style={{ objectFit: "cover" }} />',
    content
)

# 4. Process Steps
content = re.sub(
    r'<img src="(/assets/maklon-parfum/(consultation|sample|legal-design|production|delivery).webp)" alt="([^"]+)" />',
    r'<Image src="\1" alt="\3" width={400} height={300} loading="lazy" style={{ objectFit: "cover", width: "100%", height: "100%", minHeight: "145px" }} />',
    content
)

# 5. Academy Collage
content = re.sub(
    r'<img src="(/assets/maklon-parfum/academy-.*?.webp)" alt="([^"]+)" />',
    r'<Image src="\1" alt="\2" width={500} height={500} loading="lazy" style={{ objectFit: "cover", width: "100%", height: "100%" }} />',
    content
)

# 6. Legal Icons
content = re.sub(
    r'<img src="(/assets/maklon-parfum/(bpom|halal|cpkb|hki).webp)" alt="([^"]+)" />',
    r'<Image src="\1" alt="\2" width={200} height={100} loading="lazy" style={{ objectFit: "contain", width: "100%", height: "75px", marginBottom: "16px" }} />',
    content
)

# 7. Our Clients
content = re.sub(
    r'<img src="(/assets/maklon-parfum/our-clients.webp)" alt="([^"]+)" />',
    r'<Image src="\1" alt="\2" width={980} height={400} loading="lazy" style={{ width: "100%", height: "auto" }} />',
    content
)

with open("src/app/ads/maklon-parfum/page.tsx", "w") as f:
    f.write(content)
