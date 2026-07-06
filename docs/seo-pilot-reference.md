# Dreamlab SEO Pilot Reference

> Acuan operasional untuk SEO pilot Dreamlab.
> Sumber utama: [`SEO_KNOWLEDGE_BASE.md`](../SEO_KNOWLEDGE_BASE.md)
> Prinsip: ambil modul yang relevan, jangan copy seluruh sistem mentah-mentah.

## 1. Tujuan

Dokumen ini adalah aturan kerja untuk halaman SEO pilot yang baru, terpisah dari 179 artikel existing.

Target pilot:
- Menangkap keyword buyer intent dengan traffic realistis.
- Menghasilkan organic leads yang bisa diukur.
- Menjaga struktur URL, metadata, schema, dan internal linking tetap bersih.

Constraint:
- Jangan menyentuh `src/data/articles.ts`.
- Jangan merge, redirect, noindex, atau rewrite artikel existing.
- Jangan jalankan pSEO massal sebelum batch pilot pertama stabil.

## 2. Sumber Kebenaran

Urutan referensi:
1. Repo truth: routing, components, metadata, sitemap, schema, tracking yang benar-benar ada di codebase.
2. `SEO_KNOWLEDGE_BASE.md`: prinsip SEO umum, anti-pattern, dan quality gate.
3. `docs/seo-plan.md`: konteks bisnis Dreamlab dan roadmap level tinggi.

Jika ada konflik:
- Ikuti constraint bisnis user terlebih dahulu.
- Ikuti repo truth kedua.
- Pakai knowledge base sebagai panduan, bukan dogma.

## 3. Rendering SEO

Halaman pilot yang harus diindex wajib menghasilkan HTML matang pada server.

Aturan:
- Gunakan `SSG` untuk halaman stabil dan jarang berubah.
- Gunakan `SSR` untuk halaman yang butuh data dinamis ringan.
- Gunakan `ISR` hanya jika konten pilot memang perlu refresh periodik.
- Hindari `CSR` untuk konten utama SEO.

Prinsip validasi:
- Konten penting harus terlihat di View Source.
- CTA, heading, schema, dan copy utama tidak boleh bergantung pada hydration untuk muncul.

## 4. Metadata dan Canonical

Setiap halaman pilot wajib punya:
- Unique `title`
- Unique `meta description`
- `canonical` absolut
- `OG` metadata
- `Twitter card`
- Struktur heading yang rapi

Aturan tambahan:
- Satu halaman = satu keyword utama.
- Jangan buat title dan description yang terlalu mirip antar halaman pilot.
- Money page dan artikel `/panduan/` harus punya intent yang berbeda.

## 5. Sitemap dan Index Control

Masukkan hanya halaman pilot yang layak index ke sitemap.

Aturan:
- Index hanya halaman yang sudah punya konten unik, CTA jelas, dan schema valid.
- Jangan index halaman yang masih placeholder atau belum selesai.
- Jangan buat URL duplikat untuk intent yang sama.
- Kalau intent overlap, pilih satu halaman sebagai canonical target dan yang lain jangan dipublish dulu.

Batch pertama yang disarankan:
- `/biaya-maklon-skincare`
- `/moq-maklon-kosmetik`
- `/panduan/komponen-biaya-maklon-skincare`
- `/panduan/cara-menentukan-moq-produk-kosmetik`

## 6. Schema

Schema yang relevan untuk pilot:
- `WebPage`
- `Article`
- `FAQPage`
- `BreadcrumbList`
- `Service`

Aturan:
- Jangan gunakan `Product` jika halaman bukan produk nyata.
- Jangan gunakan `Review` atau `AggregateRating` tanpa data valid.
- Jangan membuat rating, review, atau klaim legalitas palsu.
- Schema harus sesuai isi halaman yang terlihat oleh user.

## 7. Topical Authority dan Internal Linking

Pola link pilot:
- Artikel pilot mendukung money page.
- Money page link ke artikel pendukung.
- Link harus relevan secara semantik, bukan sekadar menambah jumlah internal link.

Aturan cluster:
- Money page fokus conversion.
- Artikel `/panduan/` fokus detail, objection, dan edukasi buyer.
- Jangan buat artikel yang menyalin intent money page.

## 8. Information Gain

Setiap halaman pilot harus memberi nilai tambah nyata:
- tabel keputusan
- checklist
- timeline proses
- komponen biaya
- faktor MOQ
- ringkasan praktis buyer

Aturan:
- Jangan membuat artikel AI generik.
- Jangan memaksakan tabel jika tidak membantu keputusan.
- Paragraf pendek, section pendek, dan satu sub-intent per section.

## 9. Programmatic SEO

Untuk fase pilot:
- Jangan pSEO massal dulu.
- Pakai pSEO hanya sebagai quality gate.

Sebuah halaman hanya boleh index jika:
- kontennya unik
- search intent jelas
- conversion value ada
- metadata dan schema valid
- internal link masuk akal

Jika satu kombinasi hanya mengulang halaman lain:
- jangan publish
- atau jadikan non-index sampai ada data unik

## 10. Keyword Intent

Aturan utama:
- Satu halaman = satu intent utama.
- Money page = commercial / transactional.
- Artikel `/panduan/` = supporting BOFU / MOFU.

Contoh pairing aman:
- `biaya maklon skincare` -> money page
- `komponen biaya maklon skincare` -> artikel /panduan/
- `moq maklon kosmetik` -> money page
- `cara menentukan moq produk kosmetik` -> artikel /panduan/

## 11. Anti-Pattern

Hindari:
- thin content
- duplicate metadata
- keyword stuffing
- doorway pages
- internal link tidak relevan
- konten AI generik tanpa sudut pandang bisnis
- halaman yang hanya ganti istilah tapi intent sama

## 12. Tracking Minimum

Untuk pilot, monitoring cukup minimal:
- `cta_click`
- `wa_click`
- `form_submit`
- `calculator_complete` jika calculator dipakai

Payload minimum:
- `page_url`
- `page_title`
- `page_type`
- `seo_cluster`
- `keyword_target`
- `cta_location`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `referrer`

Label wajib untuk pilot Dreamlab:
- `seo_cluster: maklon_skincare_pilot`
- `page_type: money_page` atau `pilot_article`

## 13. Design Requirements

Halaman pilot harus terasa sebagai halaman edukasi profesional, bukan sales page agresif.

Aturan UI:
- mobile-first
- whitespace cukup
- card-based untuk decision box, related links, FAQ, dan CTA
- CTA spesifik, bukan generik
- animasi minimal
- fokus pada clarity, trust, dan decision-making

## 14. Batch 1 Default

Batch pertama hanya mencakup:
- 2 money pages
- 2 artikel pilot
- tracking minimal
- metadata
- schema
- sitemap
- internal linking antar pilot

Validasi wajib sebelum scale:
- route tidak konflik
- canonical benar
- schema valid
- sitemap update
- CTA tracking masuk dataLayer
- WA click dan form submit terbaca di GTM / GA4

## 15. Implementation Rule

Jika ada modul di `SEO_KNOWLEDGE_BASE.md` yang tidak membantu pilot Dreamlab:
- abaikan dulu
- jangan diterapkan hanya karena terdengar lengkap

Fokus pilot adalah membuktikan bahwa halaman buyer-intent + CTA + tracking + internal linking bisa menghasilkan organic leads.
