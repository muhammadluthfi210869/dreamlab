# MASTER BLUEPRINT SEO B2B DREAMLAB — MAKLOON KOSMETIK ORGANIC LEAD ENGINE

Kamu adalah senior full-stack engineer, technical SEO architect, dan B2B growth strategist. Tugasmu adalah membaca repository website Dreamlab, lalu merancang implementation plan yang sangat detail untuk membangun mesin organic traffic dan organic leads untuk bisnis B2B maklon kosmetik.

Jangan langsung coding sebelum membuat plan. Pertama, audit struktur repo, routing, komponen, tracking, metadata, sitemap, schema, halaman existing, dan sistem konten yang sudah ada. Setelah itu buat rencana implementasi teknis yang bisa dieksekusi bertahap selama 90 hari.

## 1. Konteks bisnis

Dreamlab adalah perusahaan B2B maklon kosmetik. Target visitor utama adalah calon brand owner, klinik kecantikan, reseller, influencer, owner bisnis, dan perusahaan yang ingin membuat produk skincare, bodycare, haircare, parfum, baby care, decorative, foot care, PKRT, atau kosmetik private label.

Masalah bisnis utama:

* Perusahaan terlalu bergantung pada Meta Ads.
* Budget iklan sekitar Rp20 juta/bulan.
* Leads dari ads banyak, tapi organic website belum menjadi sumber leads utama.
* Website harus diubah dari company profile pasif menjadi organic acquisition engine.
* Target 90 hari bukan langsung mengalahkan Meta Ads, tetapi membuktikan momentum: impression naik, query commercial muncul, traffic organic masuk, WA click/form submit dari organic mulai tercatat.

## 2. Tujuan utama project

Bangun sistem SEO B2B yang bisa:

1. Meningkatkan organic impressions.
2. Meningkatkan organic traffic dari keyword commercial intent.
3. Menghasilkan organic leads lewat WhatsApp click, form submit, dan product brief.
4. Membuat halaman SEO yang scalable tapi tidak thin content.
5. Membangun topical authority di niche maklon kosmetik.
6. Membuat tracking yang bisa membuktikan performa ke owner/bos.
7. Membuat struktur website yang siap di-scale dalam 3–6 bulan.

## 2A. Koreksi prioritas pilot

Koreksi ini mengoverride asumsi lama jika ada konflik di dokumen:

1. Jangan memprioritaskan interactive tool berat seperti quiz atau kalkulator dinamis pada fase pilot awal.
2. Untuk lead assist di 90 hari pertama, utamakan side-by-side visual comparison statis yang tajam dan cepat dipahami visitor B2B.
3. Infrastruktur kategori, URL, internal linking, dan copy capability harus merepresentasikan 8 kategori utama pabrik:
   - skincare
   - bodycare
   - haircare
   - parfum
   - baby care
   - decorative
   - foot care
   - PKRT
4. Jangan biarkan roadmap awal memberi sinyal ke Googlebot bahwa pabrik hanya menangani skincare dan parfum.

## 3. Prinsip strategi

Gunakan pendekatan berikut:

Prioritas utama:

1. Technical SEO dan tracking.
2. Money pages commercial intent.
3. Topic cluster BOFU/MOFU.
4. Landing page kategori, produk, concern, packaging, dan use case.
5. Trust pages untuk meningkatkan conversion.
6. Selective programmatic SEO, bukan mass page generator.
7. Internal linking otomatis dan manual.
8. CRO untuk mengubah traffic menjadi leads.
9. Dashboard performa SEO dan leads.
10. Retargeting-ready event tracking.

Jangan menjadikan pSEO sebagai tulang punggung utama. pSEO hanya digunakan sebagai layer tambahan setelah data unik dan struktur halaman cukup kuat.

## 4. Teknik yang harus dipakai

### A. Technical SEO

Audit dan implementasikan:

* Dynamic metadata per halaman.
* Title tag unik.
* Meta description unik.
* Canonical URL.
* Open Graph metadata.
* Twitter card metadata.
* Robots.txt.
* Dynamic sitemap.xml.
* Breadcrumb.
* Schema JSON-LD.
* Clean URL structure.
* Page speed optimization.
* Image optimization.
* Lazy loading.
* Mobile-first layout.
* Internal linking system.
* Noindex control untuk halaman yang belum cukup unik.
* 404 dan redirect handling.
* Clean heading structure H1, H2, H3.
* Alt text image yang relevan.
* Core Web Vitals awareness.

Output yang harus dibuat:

* Audit file existing yang memengaruhi SEO.
* Daftar halaman yang sudah ada dan status SEO-nya.
* Daftar masalah teknis.
* Rencana perbaikan per file.
* Prioritas P0, P1, P2.

### B. Conversion tracking

Pastikan semua conversion bisa dilacak.

Event minimal:

* wa_click
* wa_sticky_click
* form_start
* form_submit
* product_brief_submit
* phone_click
* email_click
* catalog_download
* faq_expand
* cta_view
* cta_click
* comparison_visual_view

Setiap event harus membawa payload:

* page_url
* page_type
* page_title
* seo_cluster
* keyword_target
* product_category
* product_type
* cta_location
* traffic_source
* utm_source
* utm_medium
* utm_campaign
* referrer
* timestamp

Implementasikan dataLayer push agar GTM bisa menangkap event.

Contoh payload konseptual:

```ts
window.dataLayer.push({
  event: "wa_click",
  page_type: "money_page",
  seo_cluster: "maklon_skincare",
  keyword_target: "maklon skincare",
  product_category: "skincare",
  cta_location: "hero",
  traffic_source: "organic"
})
```

Jika belum ada backend CRM, buat minimal lead logging plan:

* GA4 event.
* GTM event.
* Optional: simpan lead form ke database.
* Optional: kirim ke Google Sheet atau internal dashboard.
* Preserve UTM di localStorage/sessionStorage.

### C. Money pages

Buat atau optimasi halaman utama berikut:

1. /jasa-maklon-kosmetik
2. /maklon-kosmetik
3. /maklon-skincare
4. /maklon-bodycare
5. /maklon-haircare
6. /maklon-parfum
7. /maklon-baby-care
8. /maklon-decorative
9. /maklon-foot-care
10. /maklon-pkrt
11. /maklon-kosmetik-bpom
12. /private-label-kosmetik
13. /pabrik-kosmetik
14. /jasa-maklon-skincare
15. /jasa-maklon-parfum
16. /jasa-maklon-bodycare

Setiap money page harus punya struktur:

* Hero section dengan headline commercial.
* Subheadline yang menjelaskan value bisnis.
* CTA utama ke WhatsApp.
* CTA sekunder ke form brief.
* Section “cocok untuk siapa”.
* Jenis produk yang bisa dibuat.
* Alur produksi.
* Legalitas BPOM/halal jika relevan.
* Pilihan packaging.
* Estimasi timeline.
* FAQ spesifik.
* Internal link ke artikel BOFU.
* Internal link ke halaman produk turunan.
* Trust section.
* Sticky CTA.
* Schema Service + FAQ + Breadcrumb.

Jangan buat halaman money page seperti blog. Halaman ini harus terasa seperti landing page SEO yang menjual, tetapi tetap informatif.

### D. Topic cluster BOFU/MOFU

Buat struktur topic cluster.

Pillar utama:

* Panduan Lengkap Maklon Kosmetik untuk Brand Pemula
* Panduan Maklon Skincare
* Panduan Private Label Kosmetik
* Panduan BPOM untuk Produk Kosmetik
* Panduan Biaya dan MOQ Maklon Kosmetik

Artikel BOFU prioritas tinggi:

1. Berapa Biaya Maklon Skincare?
2. Berapa MOQ Maklon Kosmetik?
3. Cara Membuat Brand Skincare Sendiri
4. Cara Membuat Brand Kosmetik Sendiri
5. Alur Produksi Maklon Kosmetik dari Ide sampai BPOM
6. Cara Urus BPOM Kosmetik
7. Berapa Lama Proses Maklon Skincare?
8. OEM vs ODM Kosmetik
9. Private Label vs Custom Formula
10. Cara Memilih Pabrik Maklon Kosmetik
11. Kesalahan Brand Pemula Saat Maklon Kosmetik
12. Maklon Kosmetik Murah: Risiko yang Harus Dipahami
13. Syarat Maklon Kosmetik BPOM
14. Modal Awal Membuat Brand Skincare
15. Apakah Bisa Maklon Kosmetik dengan MOQ Kecil?
16. Apa Bedanya Maklon Skincare, Bodycare, Haircare, dan Parfum?
17. Checklist Sebelum Menghubungi Pabrik Maklon
18. Pertanyaan yang Harus Ditanyakan ke Vendor Maklon
19. Cara Menentukan Produk Pertama untuk Brand Skincare
20. Cara Menentukan Packaging Kosmetik untuk Brand Baru

Setiap artikel harus:

* Menargetkan satu intent utama.
* Memiliki CTA kontekstual.
* Mengarah ke money page.
* Memiliki FAQ.
* Memiliki internal link ke artikel terkait.
* Tidak menjadi artikel awareness generik.
* Fokus pada keputusan bisnis, bukan edukasi kategori konsumen umum.

### E. Landing page produk/kategori

Buat halaman produk turunan dengan struktur yang scalable.

Kategori utama yang harus direpresentasikan sejak awal:

* skincare
* bodycare
* haircare
* parfum
* baby care
* decorative
* foot care
* PKRT

Aturan:

* Infrastruktur kategori dan URL harus mencerminkan 8 kategori utama pabrik.
* Walaupun pilot lead masih fokus pada cluster tertentu, Googlebot tidak boleh menangkap sinyal seolah pabrik hanya menangani skincare dan parfum.
* Kategori yang belum diprioritaskan untuk campaign SEO tetap harus muncul sebagai capability bisnis yang nyata di struktur situs.

Contoh URL:

* /maklon-skincare/serum
* /maklon-skincare/toner
* /maklon-skincare/sunscreen
* /maklon-skincare/facial-wash
* /maklon-skincare/moisturizer
* /maklon-skincare/cream
* /maklon-bodycare/body-lotion
* /maklon-bodycare/body-serum
* /maklon-bodycare/body-wash
* /maklon-bodycare/body-scrub
* /maklon-haircare/hair-tonic
* /maklon-haircare/shampoo
* /maklon-haircare/hair-mask
* /maklon-parfum/eau-de-parfum
* /maklon-parfum/body-mist
* /maklon-parfum/roll-on
* /maklon-baby-care/baby-lotion
* /maklon-baby-care/baby-wash
* /maklon-decorative/lip-cream
* /maklon-decorative/cushion
* /maklon-foot-care/foot-cream
* /maklon-foot-care/foot-spray
* /maklon-pkrt/hand-sanitizer
* /maklon-pkrt/disinfectant-spray

Setiap halaman produk harus punya data unik:

* Product type.
* Category.
* Target buyer.
* Use case.
* Formula direction.
* Packaging options.
* Claim considerations.
* R&D considerations.
* Timeline notes.
* FAQ spesifik.
* CTA spesifik.
* Internal link ke kategori parent.
* Internal link ke artikel biaya/MOQ/BPOM.
* Internal link ke produk terkait.

Jangan index halaman produk jika hanya mengganti nama produk tanpa konten unik.

### F. Selective programmatic SEO

Buat sistem pSEO yang aman dan selektif.

Kombinasi yang boleh:

* category x product type
* product type x concern
* product type x packaging
* product type x target buyer
* category x use case

Contoh:

* maklon serum brightening
* maklon serum acne care
* maklon sunscreen private label
* maklon body lotion whitening
* maklon body serum brightening
* maklon hair tonic anti rontok
* maklon parfum pria
* maklon parfum wanita
* maklon skincare untuk klinik kecantikan
* maklon kosmetik untuk brand pemula

Kombinasi yang jangan diprioritaskan 90 hari pertama:

* kota/lokasi tanpa bukti lokal nyata
* halaman ribuan kombinasi otomatis
* halaman yang hanya ganti nama kota
* halaman awareness umum
* halaman yang tidak punya buyer intent
* halaman yang belum punya data unik

Buat scoring system sebelum halaman di-index.

Contoh field:

```ts
type SeoPageScore = {
  searchIntentScore: number
  businessValueScore: number
  uniquenessScore: number
  conversionPotentialScore: number
  contentCompletenessScore: number
  shouldIndex: boolean
}
```

Rules:

* shouldIndex = true hanya jika total score cukup tinggi.
* Jika konten belum unik, gunakan noindex.
* Jika halaman terlalu mirip dengan parent, gunakan canonical ke parent.
* Jangan generate halaman hanya karena kombinasi keyword tersedia.

### G. Trust pages

Buat halaman pendukung conversion:

1. /alur-produksi-maklon-kosmetik
2. /legalitas-bpom-kosmetik
3. /pilihan-packaging-kosmetik
4. /faq-maklon-kosmetik
5. /contoh-produk-maklon
6. /tentang-pabrik
7. /konsultasi-maklon-kosmetik
8. /brief-produk
9. /estimasi-biaya-maklon-kosmetik
10. /checklist-brand-kosmetik

Trust pages tidak harus mengejar traffic besar, tetapi harus mendukung conversion. Internal link dari money page dan artikel harus sering mengarah ke halaman ini.

### H. Lead assist asset

Rancang minimal satu lead assist asset untuk 90 hari pertama, tanpa bergantung pada tool interaktif berat.

Prioritas asset:

1. Side-by-side visual comparison statis
2. Checklist Persiapan Brand Kosmetik
3. Form Brief Produk
4. Infografis keputusan buyer

Jika asset utama berupa visual comparison, muatan minimumnya:

* kategori atau keputusan yang dibandingkan
* dua kolom yang tegas
* 3-6 pembeda inti dari sisi bisnis
* implikasi terhadap MOQ, biaya, positioning, atau risiko
* CTA WhatsApp atau brief form

Output asset:

* ringkasan keputusan yang bisa dipahami cepat
* rekomendasi langkah berikutnya
* CTA WhatsApp dengan pesan prefilled
* event `comparison_visual_view`

CTA akhir:
“Cek estimasi ini dengan tim Dreamlab lewat WhatsApp.”

Koreksi implementasi:

* Untuk 90 hari pertama, asset utama bukan quiz atau kalkulator dinamis, tetapi side-by-side visual comparison statis.
* Contoh yang diprioritaskan: OEM vs ODM, batch kecil vs batch lebih efisien, kemasan standar vs premium, atau SKU awal toner vs micellar water dari sisi bisnis.
* Interactive calculator boleh masuk backlog, tetapi bukan fondasi utama fase pilot awal.
* Jika visual comparison dipakai sebagai modul utama, track dengan event `comparison_visual_view`.

### I. Internal linking system

Buat internal linking secara sistematis.

Rules:

* Money page link ke child product pages.
* Product pages link ke parent category.
* Product pages link ke artikel biaya, MOQ, BPOM.
* Artikel BOFU link ke money page.
* Artikel comparison link ke form konsultasi.
* Trust pages link ke money pages.
* FAQ link ke halaman terkait.
* Breadcrumb aktif di semua halaman SEO.

Contoh struktur:

```txt
/maklon-kosmetik
  -> /maklon-skincare
  -> /maklon-bodycare
  -> /maklon-haircare
  -> /maklon-parfum
  -> /maklon-baby-care
  -> /maklon-decorative
  -> /maklon-foot-care
  -> /maklon-pkrt
  -> /biaya-maklon-skincare
  -> /faq-maklon-kosmetik

/maklon-skincare
  -> /maklon-skincare/serum
  -> /maklon-skincare/sunscreen
  -> /maklon-skincare/facial-wash
  -> /biaya-maklon-skincare
  -> /cara-membuat-brand-skincare-sendiri
```

Buat komponen:

* RelatedPages
* RelatedArticles
* ProductCategoryGrid
* SeoBreadcrumbs
* ContextualCTA
* FAQSection
* StickyCTA
* TrustBar

### J. Structured data

Implementasikan JSON-LD sesuai jenis halaman.

Minimal schema:

* Organization
* WebSite
* BreadcrumbList
* FAQPage
* Article
* Service
* LocalBusiness atau Manufacturer jika relevan
* Product hanya jika benar-benar merepresentasikan produk, bukan sekadar jasa
* ContactPoint
* AggregateRating hanya jika ada data review valid, jangan fake

Buat helper:

```ts
generateOrganizationSchema()
generateWebsiteSchema()
generateBreadcrumbSchema()
generateFAQSchema()
generateArticleSchema()
generateServiceSchema()
generateLocalBusinessSchema()
```

Pastikan schema:

* Tidak menambahkan informasi palsu.
* Tidak membuat review/rating palsu.
* Sesuai konten yang terlihat di halaman.
* Tidak duplicate berlebihan.
* Bisa divalidasi di Rich Results Test.

### K. Content data model

Buat data model agar konten bisa di-scale tanpa hardcode berantakan.

Minimal entity:

```ts
type SeoCategory = {
  slug: string
  name: string
  title: string
  description: string
  targetKeyword: string
  relatedKeywords: string[]
  parentSlug?: string
  faqs: FAQ[]
  cta: CTA
}

type ProductSeoPage = {
  slug: string
  categorySlug: string
  productName: string
  targetKeyword: string
  searchIntent: "commercial" | "transactional" | "informational"
  uniqueIntro: string
  suitableFor: string[]
  formulaDirections: string[]
  packagingOptions: string[]
  processNotes: string[]
  legalNotes: string[]
  timelineNotes: string[]
  faqs: FAQ[]
  relatedPages: string[]
  relatedArticles: string[]
  shouldIndex: boolean
  canonical?: string
}

type ArticleSeoPage = {
  slug: string
  title: string
  targetKeyword: string
  cluster: string
  funnelStage: "BOFU" | "MOFU" | "TOFU"
  summary: string
  sections: ContentSection[]
  faqs: FAQ[]
  relatedMoneyPages: string[]
  relatedArticles: string[]
  cta: CTA
  author?: string
  reviewedBy?: string
  publishedAt: string
  updatedAt: string
  shouldIndex: boolean
}

type FAQ = {
  question: string
  answer: string
}

type CTA = {
  label: string
  href: string
  eventName: string
  location: string
}
```

Boleh gunakan local data file dulu jika belum ada CMS:

* /src/data/seo/categories.ts
* /src/data/seo/products.ts
* /src/data/seo/articles.ts
* /src/data/seo/faqs.ts
* /src/data/seo/internal-links.ts

Jika ada CMS, rancang field yang setara.

## 5. Struktur URL yang direkomendasikan

Gunakan struktur yang rapi:

```txt
/
 /jasa-maklon-kosmetik
 /maklon-kosmetik
 /maklon-skincare
 /maklon-skincare/[product]
/maklon-bodycare
/maklon-bodycare/[product]
/maklon-haircare
/maklon-haircare/[product]
/maklon-parfum
/maklon-parfum/[product]
/maklon-baby-care
/maklon-baby-care/[product]
/maklon-decorative
/maklon-decorative/[product]
/maklon-foot-care
/maklon-foot-care/[product]
/maklon-pkrt
/maklon-pkrt/[product]
/private-label-kosmetik
/maklon-kosmetik-bpom
/pabrik-kosmetik

 /artikel/[slug]
 /panduan/[slug]
 /faq-maklon-kosmetik
 /alur-produksi-maklon-kosmetik
 /legalitas-bpom-kosmetik
 /pilihan-packaging-kosmetik
 /estimasi-biaya-maklon-kosmetik
 /brief-produk
 /konsultasi-maklon-kosmetik
```

Hindari URL terlalu panjang dan keyword stuffing.

## 6. Komponen website yang harus dirancang

Buat atau audit komponen:

1. SEOPageLayout
2. MoneyPageTemplate
3. ProductLandingTemplate
4. ArticleTemplate
5. TrustPageTemplate
6. HeroCTA
7. StickyWhatsappCTA
8. ProductBriefForm
9. ComparisonVisualBlock
10. FAQSection
11. Breadcrumbs
12. RelatedPages
13. RelatedArticles
14. InternalLinkBlock
15. ProcessTimeline
16. PackagingGrid
17. LegalTrustSection
18. BeforeAfterProblemSolution
19. CTASection
20. LeadSourceTracker
21. JsonLdScript
22. SeoMetadataGenerator

## 7. CTA dan conversion rules

Jangan pakai CTA generik “Hubungi Kami” sebagai CTA utama.

Gunakan CTA spesifik:

* Cek Estimasi MOQ dan Biaya
* Konsultasi Produk Skincare
* Diskusi Formula Produkmu
* Cek Kesiapan Brand Kamu
* Kirim Brief Produk
* Tanya Alur Maklon BPOM

Setiap halaman minimal punya:

* CTA di hero
* CTA setelah section edukasi utama
* CTA setelah FAQ
* Sticky CTA di mobile
* Form atau WA prefilled message

Contoh WhatsApp prefilled:

```txt
Halo Dreamlab, saya ingin konsultasi maklon [produk/kategori]. Saya dapat info dari halaman [nama halaman]. Bisa dibantu cek estimasi MOQ, biaya, dan prosesnya?
```

## 8. Halaman yang tidak dipakai dulu

Jangan prioritaskan:

1. Artikel awareness generik seperti manfaat skincare, tips wajah cerah, cara pakai parfum.
2. pSEO kota/lokasi jika tidak ada bukti lokal.
3. Ribuan halaman otomatis.
4. Whitepaper gated berat.
5. Webinar/podcast/event besar.
6. Guest post massal.
7. Backlink spam.
8. Halaman comparison kompetitor yang agresif tanpa data.
9. Halaman review/rating palsu.
10. Halaman dengan konten AI mentah tanpa editing.

## 9. 90-day implementation roadmap

### Phase 1 — Hari 1–14: Audit dan fondasi

Output:

* Audit SEO teknis.
* Audit routing.
* Audit metadata.
* Audit tracking.
* Audit sitemap/robots.
* Audit halaman existing.
* Rekomendasi struktur URL.
* Rekomendasi data model.
* Setup tracking plan.
* Setup lead source attribution.
* Setup event naming convention.

Deliverable:

* SEO_TECHNICAL_AUDIT.md
* SEO_ARCHITECTURE_PLAN.md
* SEO_TRACKING_PLAN.md
* CONTENT_MODEL_PLAN.md

### Phase 2 — Hari 15–30: Money pages dan trust pages

Implementasikan:

* MoneyPageTemplate.
* 8–12 money pages.
* 5–8 trust pages.
* FAQ global.
* Sticky CTA.
* Product brief form.
* JSON-LD dasar.
* Sitemap dynamic.
* Metadata generator.
* Internal linking dasar.

Deliverable:

* Money pages live.
* Trust pages live.
* Tracking active.
* Sitemap active.
* Schema active.

### Phase 3 — Hari 31–60: Topic cluster dan product pages

Implementasikan:

* 20–40 product landing pages.
* 10–15 BOFU articles.
* ArticleTemplate.
* ProductLandingTemplate.
* RelatedArticles.
* RelatedPages.
* Breadcrumb.
* FAQ per halaman.
* CTA per page type.
* Retargeting-ready dataLayer events.
* Representasi 8 kategori utama di struktur category/product pages.

Deliverable:

* Product/category pages live.
* BOFU cluster live.
* Internal linking kuat.
* GA4/GTM event active.
* Representasi capability pabrik terbaca lebih lengkap, tidak bias hanya ke skincare/parfum.

### Phase 4 — Hari 61–90: Optimasi berdasarkan data

Implementasikan:

* Optimasi title/meta dari GSC.
* Optimasi halaman posisi 8–30.
* Tambah internal link ke halaman yang mulai ranking.
* Buat halaman baru dari query GSC.
* Perbaiki CTA halaman yang dapat traffic tapi conversion rendah.
* Tambahkan visual comparison baru berdasarkan objection sales dan data GSC.
* Tambahkan checklist atau visual comparison baru jika dibutuhkan.
* Buat dashboard SEO performance.

Deliverable:

* SEO_GSC_OPTIMIZATION_PLAN.md
* SEO_PERFORMANCE_DASHBOARD.md
* CONTENT_UPDATE_BACKLOG.md
* CONVERSION_OPTIMIZATION_REPORT.md

## 10. Dashboard KPI

Rancang dashboard minimal dengan metrik:

SEO:

* Organic impressions
* Organic clicks
* CTR
* Average position
* Indexed pages
* Non-indexed pages
* Top queries
* Top pages
* Queries by funnel stage
* Pages by cluster
* Keyword movement

Conversion:

* WA clicks from organic
* Form submits from organic
* Comparison visual views
* Product brief submits
* CTA click rate
* Page conversion rate
* Organic leads
* Qualified organic leads jika data tersedia
* CPL organic jika biaya bisa dihitung

Content:

* Number of money pages live
* Number of product pages live
* Number of BOFU articles live
* Number of pages updated
* Number of internal links added
* Pages with missing metadata
* Pages with missing FAQ
* Pages with no CTA

## 11. Acceptance criteria

Project dianggap berhasil secara teknis jika:

1. Semua halaman penting punya title, description, canonical, OG metadata.
2. Sitemap dynamic berjalan.
3. Robots.txt valid.
4. Schema JSON-LD valid.
5. WA click dan form submit bisa dilacak.
6. UTM/referrer bisa dipertahankan.
7. Halaman money page punya CTA jelas.
8. Product pages tidak thin content.
9. Programmatic pages punya shouldIndex logic.
10. Internal linking berjalan.
11. Mobile layout rapi.
12. Halaman cepat dan tidak berat.
13. Tidak ada broken link besar.
14. Tidak ada halaman duplikat tanpa canonical/noindex.
15. Dashboard KPI bisa dipakai untuk laporan mingguan.

Project dianggap berhasil secara bisnis 90 hari jika:

1. Organic impressions naik.
2. Query commercial mulai muncul.
3. Organic clicks mulai masuk ke money pages.
4. WA click/form submit dari organic mulai tercatat.
5. Ada halaman SEO yang mulai masuk posisi 10–30.
6. Ada backlog optimasi dari GSC.
7. Website mulai menjadi aset acquisition, bukan hanya company profile.

## 12. Instruksi kerja untuk AI code CLI

Lakukan ini secara berurutan:

1. Inspect repository.
2. Identifikasi framework, routing, folder structure, dan current SEO setup.
3. Jangan rewrite seluruh project tanpa alasan.
4. Buat plan dulu sebelum coding.
5. Pecah pekerjaan menjadi task kecil.
6. Prioritaskan fondasi: metadata, sitemap, tracking, schema, CTA.
7. Setelah plan disetujui, implementasikan bertahap.
8. Setiap perubahan harus menyebut file yang diubah.
9. Jangan membuat halaman pSEO massal sebelum data model dan quality gate tersedia.
10. Jangan membuat konten palsu, review palsu, rating palsu, atau klaim legalitas palsu.
11. Jika data bisnis belum tersedia, buat placeholder yang jelas dan aman.
12. Beri daftar data yang perlu diminta ke tim Dreamlab.
13. Buat dokumentasi teknis agar mudah dilanjutkan.

## 13. Output yang harus kamu berikan sekarang

Buat implementation plan lengkap dengan format:

### A. Repo audit

* Framework yang digunakan
* Routing structure
* SEO setup existing
* Tracking existing
* Masalah utama
* Risiko teknis

### B. Recommended architecture

* Struktur URL
* Data model
* Komponen
* Template halaman
* Schema
* Sitemap
* Tracking

### C. File-level implementation plan

Buat daftar file/folder yang perlu dibuat atau diubah, misalnya:

* src/app/sitemap.ts
* src/app/robots.ts
* src/lib/seo/metadata.ts
* src/lib/seo/schema.ts
* src/lib/tracking/dataLayer.ts
* src/data/seo/products.ts
* src/data/seo/articles.ts
* src/components/seo/FAQSection.tsx
* src/components/seo/Breadcrumbs.tsx
* src/components/conversion/StickyWhatsappCTA.tsx
* src/components/forms/ProductBriefForm.tsx
* src/app/maklon-skincare/page.tsx
* src/app/maklon-skincare/[product]/page.tsx
* src/app/artikel/[slug]/page.tsx

Sesuaikan dengan struktur repo asli.

### D. 90-day roadmap

* Minggu 1–2
* Minggu 3–4
* Bulan 2
* Bulan 3

### E. Priority matrix

Kelompokkan:

* P0: wajib untuk tracking dan SEO foundation.
* P1: money pages dan trust pages.
* P2: topic cluster dan product pages.
* P3: dashboard, visual comparison expansion, dan advanced pSEO.

### F. Risks and safeguards

Jelaskan risiko:

* thin content
* duplicate pages
* indexing bloat
* fake claims
* bad schema
* tracking rusak
* performance turun
* CTA tidak tercatat
* pSEO terlalu agresif

Berikan mitigasi teknisnya.

### G. Questions only if blocking

Jangan bertanya hal kecil. Jika ada data yang belum tersedia, buat asumsi aman dan tandai sebagai TODO.
