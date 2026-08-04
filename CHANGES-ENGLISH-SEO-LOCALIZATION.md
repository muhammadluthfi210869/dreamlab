# ✅ VALIDASI PERUBAHAN — SEO Localization English (/en/)

> Dokumen ini berisi **SEMUA perubahan** yang dilakukan pada file-file berikut, dalam format
> **SEBELUM → SESUDAH**, agar bisa divalidasi satu per satu.
>
> **Metode:** SEO localization (bukan terjemahan harfiah). Istilah B2B internasional:
> *Private Label*, *OEM/ODM*, *Cosmetic Contract Manufacturing*, *Cosmetic Factory Indonesia*.
>
> **Status teknis:** `tsc` ✅ | `eslint` ✅ | production build ✅ (6 route /en/) | render runtime ✅

---

## 📁 Daftar file yang diubah

| # | File | Jenis perubahan |
|---|------|-----------------|
| 1 | `src/app/en/layout.tsx` | Metadata global + JSON-LD |
| 2 | `src/app/en/page.tsx` | Home — semua elemen |
| 3 | `src/app/en/produk/page.tsx` | Products |
| 4 | `src/app/en/about-us/page.tsx` | About Us |
| 5 | `src/app/en/services/page.tsx` | Services |
| 6 | `src/app/en/our-client/page.tsx` | Our Client |
| 7 | `src/app/en/contact-us/page.tsx` | Contact Us |
| 8 | `src/components/Header.tsx` | Dropdown produk → bilingual |
| 9 | `src/components/Footer.tsx` | Footer → bilingual |
| 10 | `ENGLISH-CONTENT-REVIEW.md` | Ditulis ulang (copy final) |

---

## 1. `src/app/en/layout.tsx` — Metadata Global + JSON-LD

| Elemen | SEBELUM | SESUDAH |
|--------|---------|---------|
| Title (default) | `Dreamlab \| Cosmetic & Skincare Manufacturing (Maklon) - Build Your Brand` | `Private Label Cosmetic & Skincare Manufacturer Indonesia` |
| Description | `Dreamlab is a certified cosmetic contract manufacturer (maklon) in Indonesia: skincare, body care, hair care, perfume, decorative & baby care with BPOM, CPKB & Halal certification.` | `Dreamlab is a certified private label cosmetic manufacturer in Indonesia. OEM/ODM skincare, body care, hair care, perfume, decorative & baby care contract manufacturing with BPOM, CPKB & Halal certification.` |
| OG title | `Dreamlab \| Cosmetic & Skincare Manufacturing (Maklon) - Build Your Brand` | `Private Label Cosmetic & Skincare Manufacturer Indonesia \| Dreamlab` |
| OG description | `Dreamlab is a certified cosmetic contract manufacturer in Indonesia: ...` | `Certified cosmetic contract manufacturing in Indonesia: private label & OEM/ODM skincare, body care, hair care, perfume, decorative & baby care with BPOM, CPKB & Halal certification.` |
| JSON-LD Organization description | `Indonesian certified cosmetic contract manufacturer: skincare, ...` | `Private label & OEM/ODM cosmetic contract manufacturer in Indonesia: skincare, body care, hair care, perfume, decorative & baby care with BPOM, CPKB & Halal certification.` |

> ℹ️ **Catatan template title:** `title.template = "%s | Dreamlab"` — otomatis menambah suffix brand ke semua sub-halaman /en/ (kecuali home, lihat baris Home).

---

## 2. `src/app/en/page.tsx` — HOME

| Elemen | SEBELUM | SESUDAH |
|--------|---------|---------|
| Title | `Dreamlab \| Cosmetic & Skincare Contract Manufacturer Indonesia` | `Private Label Cosmetic Manufacturer Indonesia \| Dreamlab` *(suffix manual — template tdk berlaku utk home segment)* |
| Meta description | `Dreamlab is Indonesia's trusted cosmetic contract manufacturer (maklon). BPOM certified, CPKB Grade A & Halal. 500+ brands trust our private label production.` | `Dreamlab is a certified cosmetic contract manufacturer in Indonesia. Private label & OEM/ODM skincare, body care, hair care & perfume production with exclusive formulations, flexible MOQ, BPOM, CPKB Grade A & Halal certification.` |
| OG title | `Dreamlab \| Cosmetic & Skincare Contract Manufacturer Indonesia` | `Private Label Cosmetic Manufacturer Indonesia \| Dreamlab` |
| OG description | `Certified BPOM, CPKB Grade A & Halal. 500+ brands trust our private label cosmetic production in Indonesia.` | `Certified BPOM, CPKB Grade A & Halal. 500+ brands trust our private label & OEM/ODM cosmetic production in Indonesia.` |
| Hero eyebrow | `Indonesia's Trusted Contract Manufacturer` | `Indonesia's Trusted Private Label Cosmetic Manufacturer` |
| **H1** | `Behind Every Great Brand is a Powerful Formula` | `Private Label Cosmetic Manufacturing in Indonesia` |
| Hero subtitle | `Trusted cosmetic & skincare manufacturing (maklon) for brands that want a winning formula — certified, scalable, and market-ready.` | `Dreamlab is a certified cosmetic contract manufacturer (OEM/ODM) trusted by 500+ brands. Exclusive formulations, flexible MOQ, and full BPOM, CPKB & Halal registration — handled end-to-end for your brand.` |
| Hero CTA | `Free Formula Consultation` | `Get a Free Formulation Quote` |
| Catalog heading | `Our Manufacturing Catalog` | `Our Private Label Manufacturing Catalog` |
| Advantages heading | `8 Advantages of Manufacturing with Dreamlab` | `8 Reasons to Choose Dreamlab as Your Cosmetic Manufacturer` |
| Advantage #1 | `Competitive Pricing — HPP (cost of goods) that adapts to your needs.` | `Cost-Effective Production — Competitive unit pricing with full HPP (cost of goods) transparency to protect your margins.` |
| Advantage #2 | `Innovative Formulas — Young, highly innovative R&D team.` | `In-House R&D & ODM — A young, highly innovative formulation team develops exclusive, custom formulas for your brand.` |
| Advantage #3 | `Creative Design — A creative design team ready to visualize your brand.` | `Custom Packaging Design — A creative design team ready to visualize your brand identity across packaging & labels.` |
| Advantage #4 | `Strong Branding — Build a strong identity so your brand is easily recognized.` | `Strong Branding — Build a strong identity so your brand is easily recognized on shelf and online.` |
| Advantage #5 | `Digital Marketing — Reach your target audience more effectively & efficiently.` | `Digital Marketing Support — Reach your target audience more effectively & efficiently with our free marketing guidance.` |
| Advantage #6 | `Exclusive Formula — 1 client, 1 formula. Make your dream formula and stand out.` | `Exclusive Formulas — 1 client, 1 formula. Your custom formula is never shared with other brands.` |
| Advantage #7 | `Product Formulation — Highly innovative young R&D team.` *(duplikat #2)* | `Licensed Pharmacist Formulators — STRA-registered pharmacists formulate and oversee every product for safety & quality.` |
| Advantage #8 | `Flexible MOQ — MOQ tailored to your client's needs.` | `Flexible MOQ — Minimum order quantities tailored to your budget so you can start small and scale up.` |
| CTA heading | `Ready to Build Your Brand?` | `Ready to Launch Your Own Cosmetic Brand?` |
| CTA body | `...legal registration — one partner, everything handled.` | `...BPOM & Halal registration — one partner, everything handled.` |
| CTA button | `Consult Now` | `Request a Free Quote` |

---

## 3. `src/app/en/produk/page.tsx` — PRODUCTS

| Elemen | SEBELUM | SESUDAH |
|--------|---------|---------|
| Title | `Products \| Cosmetic & Skincare Manufacturing Catalog` | `Cosmetic Manufacturing Catalog \| Private Label & OEM/ODM` |
| Meta description | `Explore Dreamlab's cosmetic manufacturing catalog: skincare, body care, hair care, decorative, baby care, perfume & foot care. Custom private label production.` | `Browse our OEM/ODM cosmetic manufacturing catalog: skincare, body care, hair care, decorative, baby care, perfume & foot care. Private label production with BPOM & Halal certification.` |
| OG title | `Products \| Cosmetic & Skincare Manufacturing Catalog` | `Cosmetic Manufacturing Catalog \| Private Label & OEM/ODM \| Dreamlab` |
| OG description | `Private label cosmetic production: skincare, body care, hair care, baby care, perfume & more with BPOM & Halal certification.` | `OEM/ODM & private label cosmetic production across 8 categories — skincare, body care, hair care, baby care, perfume & more, certified BPOM & Halal.` |
| **H1** | `Private Label Cosmetic Manufacturing` | `Private Label & OEM/ODM Cosmetic Manufacturing` |
| Hero subtitle | `Develop your own branded products across 8 categories — formulated, produced, and certified under your brand name.` | `Launch your own branded products across 8 categories — exclusive formulation, production, and certification under your brand name.` |
| Kategori #1 | `Skincare` | `Skincare Manufacturing` |
| Kategori #2 | `Body Care` | `Body Care Manufacturing` |
| Kategori #3 | `Hair Care` | `Hair Care Manufacturing` |
| Kategori #4 | `Decorative` | `Color Cosmetics` |
| Kategori #5 | `Baby Care` | `Baby Care Manufacturing` |
| Kategori #6 | `Perfume` | `Fragrance & Perfume` |
| Kategori #7 | `Foot Care` | `Foot Care Manufacturing` |
| Kategori #8 | `PKRT` *(istilah Indonesia)* | `Hand Care & Hygiene` |
| CTA heading | `Need a Custom Product Formulation?` | `Need a Custom OEM/ODM Formulation?` |
| CTA button | `Request Custom Formula` | `Request a Custom Formula` |

---

## 4. `src/app/en/about-us/page.tsx` — ABOUT US

| Elemen | SEBELUM | SESUDAH |
|--------|---------|---------|
| Title | `About Dreamlab \| Certified Cosmetic Manufacturer Since 1989` | `Certified Cosmetic Contract Manufacturer Since 1989` |
| Meta description | `Dreamlab is an Indonesian cosmetic contract manufacturer trusted since 1989. CPKB Grade A certified factory, licensed pharmacists, full BPOM & Halal registration.` | `Dreamlab is a certified Indonesian cosmetic contract manufacturer trusted since 1989. CPKB Grade A factory, licensed pharmacists, and full BPOM & Halal registration for private label & OEM/ODM brands.` |
| OG title | `About Dreamlab \| Certified Cosmetic Manufacturer Since 1989` | `Certified Cosmetic Contract Manufacturer Since 1989 \| Dreamlab` |
| OG description | `CPKB Grade A certified factory, licensed pharmacists, full BPOM & Halal registration. One partner, everything taken care of.` | `Since 1989, a trusted cosmetic contract manufacturer — CPKB Grade A factory, licensed pharmacists, and full BPOM & Halal registration.` |
| Hero eyebrow | `About Dreamlab` | `About Us — Cosmetic Factory Indonesia` |
| **H1** | `Launch Your Cosmetic Brand in 3 Months` | `Certified Cosmetic Manufacturer in Indonesia Since 1989` *(value "3 months" dipindah ke subtitle)* |
| Hero subtitle | `From idea to market-ready. Exclusive formulation, certified CPKB production, and BPOM & Halal registration all handled by one trusted partner.` | `From idea to market-ready in as little as 3 months. Exclusive OEM/ODM formulation, certified CPKB production, and BPOM & Halal registration handled by one trusted partner.` |
| Sertifikasi #1 | `CPKB Grade A Certification` | `CPKB Grade A Certified Factory` |
| Sertifikasi #2 | `BPOM RI & Halal Certified` | `BPOM RI & Halal Certified Manufacturer` |
| Steps heading | `Simple Process. Maximum Results.` | `How OEM/ODM Manufacturing Works` |
| Steps subheading | `Four easy steps from consultation to market-ready product.` | `Four simple steps from consultation to market-ready product.` |
| Step 1 | `Consultation & Ideation — We discuss your brand concept, target market, and the right product type for your vision.` | `Consultation & Product Planning — We discuss your brand concept, target market, product type, and budget — then map your manufacturing roadmap.` |
| Step 2 | `Research & Formulation — Our licensed pharmacists develop an exclusive formula with high-quality active ingredients.` | `R&D & Custom Formulation — Our licensed pharmacists develop an exclusive formula with high-quality active ingredients, tested to your brief.` |
| Step 3 | `Production & Compliance — Mass production at our CPKB Grade A facility with BPOM & Halal registration handled simultaneously.` | `Certified Production & Compliance — Mass production at our CPKB Grade A facility with BPOM & Halal registration handled simultaneously.` |
| Step 4 | `After-Sales Support — Ongoing support after launch: reformulation, consultation, and quality assurance.` | `Launch & After-Sales Support — Ongoing support after launch: reformulation, quality assurance, and scale-up as your brand grows.` |
| CTA heading | `Start Building Your Brand Today` | `Ready to Start Your OEM/ODM Project?` |
| CTA button | `Free Consultation` | `Start Free Consultation` |

---

## 5. `src/app/en/services/page.tsx` — SERVICES

| Elemen | SEBELUM | SESUDAH |
|--------|---------|---------|
| Title | `Services \| Complete Cosmetic Private Label Manufacturing` | `Cosmetic Contract Manufacturing Services \| OEM, ODM & Private Label` |
| Meta description | `One-stop cosmetic manufacturing services: free brand consultation, custom formula, custom packaging design, BPOM & Halal registration, and digital marketing support.` | `One-stop cosmetic contract manufacturing: free brand consultation, custom OEM/ODM formulation, packaging design, BPOM & Halal registration, and digital marketing support.` |
| OG title | `Services \| Complete Cosmetic Private Label Manufacturing` | `Cosmetic Contract Manufacturing Services \| OEM, ODM & Private Label \| Dreamlab` |
| OG description | `Skincare, body care, hair care, perfume, decorative, baby care & more — all with BPOM, CPKB & Halal certification.` | `End-to-end cosmetic contract manufacturing: custom formulation, packaging design, BPOM & Halal registration, and certified production in Indonesia.` |
| Hero eyebrow | `Our Services` | `Cosmetic Contract Manufacturing` |
| **H1** | `One-Stop Manufacturing for Your Cosmetic Brand` | `Cosmetic Contract Manufacturing Services — OEM/ODM & Private Label` |
| Hero subtitle | `Free brand consultation • Custom formula • Custom logo & packaging design • Legal registration • Free digital marketing support` | `Free brand consultation • Custom OEM/ODM formulation • Custom logo & packaging design • BPOM & Halal registration • Free digital marketing support` |
| One-stop heading | `Everything You Need, One Partner` | `Turnkey Cosmetic Manufacturing Services` |
| One-stop body | `No need to coordinate with dozens of vendors. Dreamlab handles your entire manufacturing journey.` | `No need to coordinate with dozens of vendors. Dreamlab handles your entire manufacturing journey — from formula to shelf.` |
| One-stop list item | `Free custom formula development` | `Free custom formula development (OEM/ODM)` |
| Categories heading | `Product Categories We Manufacture` | `Cosmetic Categories We Manufacture` |
| Kategori #1–6 | `Skincare`, `Body Care`, `Hair Care`, `Decorative`, `Baby Care`, `Perfume` | `Skincare Manufacturing`, `Body Care Manufacturing`, `Hair Care Manufacturing`, `Color Cosmetics`, `Baby Care Manufacturing`, `Fragrance & Perfume Manufacturing` |
| Certification heading | `Aseptic Laboratory. Highest Certification.` | `Certified Cosmetic Factory — CPKB Grade A` |
| Certification body | `Officially verified CPKB Grade A facility.` | `Officially verified CPKB Grade A aseptic production facility.` |
| CTA heading | `Start Building Your Brand Empire Today` | `Get a Free Manufacturing & Formulation Quote` |
| CTA button | `Consult R&D Pharmacist` | `Talk to Our R&D Team` |

---

## 6. `src/app/en/our-client/page.tsx` — OUR CLIENT

| Elemen | SEBELUM | SESUDAH |
|--------|---------|---------|
| Title | `Our Clients \| 500+ Brands Trust Dreamlab Production` | `500+ Brands Trust Our Cosmetic Contract Manufacturing` |
| Meta description | `Discover the cosmetics & skincare brands that partner with Dreamlab. 500+ brands trust our certified contract manufacturing for their products.` | `Discover the cosmetics & skincare brands that manufacture with Dreamlab. 500+ brands trust our certified private label & OEM/ODM production for their products.` |
| OG title | `Our Clients \| 500+ Brands Trust Dreamlab Production` | `500+ Brands Trust Our Cosmetic Contract Manufacturing \| Dreamlab` |
| OG description | `See the cosmetic & skincare brands already working with Dreamlab, and become our next partner.` | `See the cosmetic & skincare brands already manufacturing with Dreamlab — and become our next partner.` |
| Hero eyebrow | `Our Clients` | `Trusted by Global Cosmetic Brands` |
| **H1** | `500+ Brands Trust Dreamlab` | `500+ Brands Trust Our Cosmetic Manufacturing` |
| Hero subtitle | `From emerging startups to established names, cosmetic brands across Indonesia choose Dreamlab as their primary contract manufacturing partner.` | `From emerging startups to established names, beauty brands across Indonesia choose Dreamlab as their primary contract manufacturing (OEM/ODM) partner.` |
| Partner heading | `Some Brands We Have Partnered With` | `Brands We Manufacture For` |
| Closing | `… and 500+ more brands that trust Dreamlab's certified production.` | `… and 500+ more brands that trust Dreamlab's certified private label & OEM/ODM production.` |
| CTA body | `Join 500+ brands that trust Dreamlab's certified cosmetic manufacturing.` | `Join 500+ brands that trust Dreamlab's certified private label & OEM/ODM manufacturing.` |
| CTA button | `Start Partnership` | `Become a Partner` |

> Testimonial **tidak diubah** (bahasa aslinya sudah native English).

---

## 7. `src/app/en/contact-us/page.tsx` — CONTACT US

| Elemen | SEBELUM | SESUDAH |
|--------|---------|---------|
| Title | `Contact Dreamlab \| Cosmetic Manufacturing Surabaya, Indonesia` | `Contact Us \| Private Label Cosmetic Manufacturer Indonesia` |
| Meta description | `Contact Dreamlab for a free consultation on your cosmetic or skincare brand. Certified BPOM & Halal contract manufacturing in Surabaya, East Java, Indonesia.` | `Contact Dreamlab for a free cosmetic manufacturing quote. Certified private label, OEM & ODM contract manufacturer in Surabaya, East Java, Indonesia — BPOM & Halal certified.` |
| OG title | `Contact Dreamlab \| Cosmetic Manufacturing Surabaya, Indonesia` | `Contact Us \| Private Label Cosmetic Manufacturer Indonesia \| Dreamlab` |
| OG description | `Free consultation. Start your cosmetic & skincare brand with Dreamlab's certified contract manufacturing in East Java, Indonesia.` | `Get a free quote for your cosmetic brand. Private label, OEM & ODM contract manufacturing in Surabaya, East Java, Indonesia — BPOM & Halal certified.` |
| Hero eyebrow | `Contact Us` | `Get a Free Manufacturing Quote` |
| **H1** | `Let's Build Your Cosmetic Brand` | `Start Your Cosmetic Brand — Get a Free Quote` |
| Hero subtitle | `...Dreamlab is your one-stop cosmetic manufacturing partner.` | `...Dreamlab is your one-stop cosmetic contract manufacturing partner.` |
| Email (mailto) | `hello@dreamlab.id` *(placeholder)* | `Official@dreamlab.id` *(disamakan dengan footer)* |
| CTA banner heading | `Turn Your Idea Into a Market-Ready Product` | `Turn Your Idea Into a Market-Ready Cosmetic Product` |

---

## 8. `src/components/Header.tsx` — DROPDOWN PRODUK (bilingual)

> Nama di halaman `/en/` tampil dalam English; halaman Indonesia **tidak berubah**.

| SEBELUM (semua bahasa) | SESUDAH di /en/ |
|------------------------|-----------------|
| `Maklon Skincare` | `Skincare Manufacturing` |
| `Maklon Body Care` | `Body Care Manufacturing` |
| `Maklon Baby Care` | `Baby Care Manufacturing` |
| `Maklon Hair Care` | `Hair Care Manufacturing` |
| `Maklon Decorative` | `Color Cosmetics Manufacturing` |
| `Maklon Parfum` | `Fragrance Manufacturing` |
| `Maklon Foot Care` | `Foot Care Manufacturing` |

---

## 9. `src/components/Footer.tsx` — FOOTER (bilingual)

| Bagian | SEBELUM | SESUDAH di /en/ |
|--------|---------|-----------------|
| Kolom 1 — deskripsi | `Dreamlab Cosmetics adalah manufaktur kosmetik berkualitas tinggi yang menggabungkan tren kecantikan Eropa dan Korea melalui konsep Natural Mix` | `Dreamlab Cosmetics is a high-quality cosmetic contract manufacturer combining European and Korean beauty trends through our Natural Mix concept.` |
| Kolom 2 — `Maklon Skincare` dst. | `Maklon Skincare`, `Maklon Baby Care`, `Maklon Body Care`, `Maklon Hair Care`, `Maklon Parfum`, `Maklon Decorative`, `Maklon Foot Care` | `Skincare Manufacturing`, `Baby Care Manufacturing`, `Body Care Manufacturing`, `Hair Care Manufacturing`, `Fragrance Manufacturing`, `Color Cosmetics Manufacturing`, `Foot Care Manufacturing` |
| Kolom 3 — label jadwal | `Jadwalkan Pertemuan` | `Schedule a Meeting` |
| Kolom 4 — judul | `Interesting Link` | `Interesting Links` |
| Kolom 4 — `Pabrik Kosmetik` | `Pabrik Kosmetik` | `Cosmetic Factory` |
| Kolom 4 — `Pabrik Parfum` | `Pabrik Parfum` | `Perfume Factory` |
| Kolom 4 — `Jasa Maklon Kosmetik` | `Jasa Maklon Kosmetik` | `Cosmetic Manufacturing Services` |
| Kolom 4 — `Private Label` | `Private Label` | `Private Label Cosmetics` |
| Kolom 4 — `Estimasi Biaya Maklon` | `Estimasi Biaya Maklon` | `Manufacturing Cost Estimate` |
| Kolom 4 — `Panduan` | `Panduan` | `Guide` |

---

## 10. `ENGLISH-CONTENT-REVIEW.md` — DITULIS ULANG

- Sekarang berisi **seluruh copy English final** pasca SEO-localization (336 baris, 8 bagian).
- Bisa dijadikan acuan review bahasa oleh Head Marketing.

---

## 🔧 Bug yang diperbaiki selama proses

| Bug | Detail | Solusi |
|-----|--------|--------|
| Title home duplikat/kehilangan brand | `title.template = "%s \| Dreamlab"` **tidak berlaku** untuk halaman di segment yang sama dengan layout (home `/en`) — hanya berlaku untuk sub-segment (`/en/produk`, dst.). | Suffix `\| Dreamlab` ditambahkan **manual** di title home. |

---

## ⚠️ Hal yang belum diubah (butuh keputusan Anda)

1. **Nomor WhatsApp CTA** semua halaman /en/ → `6287712232389` (CS 1). Belum round-robin.
2. **Kemunculan kata "maklon"** yang tersisa hanya pada **nama file gambar** (logo webp, favicon, OG image) — tidak terlihat oleh pengunjung. Tidak diubah agar tidak merusak referensi aset.
3. **Halaman produk kategori individual English** (`/en/produk/skincare/`, dst.) belum dibuat — sudah terdaftar di `EN_TRANSLATED_PATHS` untuk hreflang, tetapi belum ada halamannya.
