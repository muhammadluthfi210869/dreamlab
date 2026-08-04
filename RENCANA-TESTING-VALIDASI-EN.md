# RENCANA TESTING & PENGECEKAN AKHIR
## Halaman English (/en/) vs Halaman Indonesia

Tanggal: 2026-08-04
Status: DRAF RENCANA (belum ada perubahan kode)

---

## 1. TUJUAN

1. Memastikan setiap halaman /en/ adalah terjemahan SETIA dari versi Indonesia
   (copywriting dan metadata punya arti dan maksud yang sama, UI sama persis).
2. Memastikan halaman Indonesia TIDAK berubah (tetap berbahasa Indonesia).
3. Memastikan tidak ada potensi masalah SEO:
   hreflang, canonical, lang attribute, JSON-LD, sitemap, robots, link internal,
   tidak ada hreflang ke halaman 404, tidak ada konten campur bahasa di halaman EN.

---

## 2. PASANGAN HALAMAN YANG DIUJI (6 pasang)

| Halaman Indonesia | Halaman English | Komponen yang dipakai |
|---|---|---|
| / | /en/ | PremiumHero, ProductTrustBar, KatalogProduk, BrandShowcaseSection, LogoScroll, AdvantagesGrid, OurCertification, CtaSection, MediaCoverage, FaqHome, Promo Guide Batch 1, BlogSection |
| (tidak ada /produk/ di ID, hanya /produk/kategori/) | /en/produk/ | KatalogProduk, CtaSection |
| /about-us/ | /en/about-us/ | PageSchema, CompanyProfileWrapper |
| /services/ | /en/services/ | PageSchema, ServicesPageHero, ServicesWrapper |
| /our-client/ | /en/our-client/ | PageSchema, PartnerTrustSection, AdvantagesGrid, CtaSection |
| /contact-us/ | /en/contact-us/ | PageSchema, ContactHero, LocationDetails, ContactFAQ, CtaSection |

---

## 3. PERSIAPAN

1. npm run build  (harus sukses, tanpa error)
2. npm run start  (catat PID server, port 3000)
3. Alat bantu: curl, grep, browser
4. Pastikan tidak ada server lama yang memakan port 3000

---

## 4. UJI 1 - KESESUAIAN COPYWRITING (TERJEMAHAN SETIA)

Untuk SETIAP halaman, bandingkan setiap blok teks ID vs EN, pastikan arti dan
maksudnya sama (bukan translate kata demi kata, tapi setia terhadap maksud).

### 4.1 Home
- Hero smallTitle: ID "Maklon Juaranya Formula" vs EN "The Champion of Formulas"
- Hero title: ID "Jasa Maklon Kosmetik dan Skincare Terpercaya Indonesia"
  vs EN "Trusted Cosmetic & Skincare Manufacturing Services in Indonesia"
- Hero subtitle: ID "Di balik setiap brand hebat ada FORMULA YANG KUAT..."
  vs EN "Behind every great brand is A STRONG FORMULA..."
- Hero CTA: ID "Konsultasi Formula Gratis" vs EN "Free Formula Consultation"
- TrustBar 4 item (ID vs EN)
- KatalogProduk (PERHATIAN: lihat Temuan A)
- BrandShowcase (label, eyebrow, title, description, CTA)
- LogoScroll headline + subheadline
- AdvantagesGrid 8 item (judul + deskripsi)
- OurCertification alt text
- CtaSection (title, button)
- MediaCoverage title
- FaqHome (5 pertanyaan + jawaban)
- Promo "Panduan Batch 1" (judul, deskripsi, tombol)
- BlogSection (lihat Temuan C)

### 4.2 About
- PageSchema (h1, title, description, breadcrumb)
- CompanyProfileWrapper: hero, authority, afterSales, services (timeline), CTA

### 4.3 Services
- PageSchema (h1, title, description, breadcrumb)
- ServicesPageHero (title, description)
- ServicesWrapper: eyebrow, title, 4 cards, advantages, CTA

### 4.4 Our Client
- PageSchema (h1, title, description, breadcrumb)
- PartnerTrustSection (eyebrow, title, description, daftar logo)
- AdvantagesGrid (judul + 8 item)
- CtaSection

### 4.5 Contact
- PageSchema (h1, title, description, breadcrumb)
- ContactHero (title, description, CTA, imageAlt)
- LocationDetails (header, 2 lokasi, tombol maps)
- ContactFAQ (5 pertanyaan + jawaban)
- CtaSection (title, subtitle, button)

### 4.6 Cek kata Indonesia TIDAK boleh muncul di halaman EN
Cari di HTML hasil render /en/ untuk kata-kata ini (HARUS NOL kecuali nama brand):
Maklon, Keuntungan, Wujudkan, Konsultasi, Gratis, Katalog, Formulasi, Masker,
Terpercaya, Liputan, Temukan, Anda, lebih, yang, untuk, brand impian, Juaranya.

---

## 5. UJI 2 - METADATA (TERJEMAHAN SETIA DARI METADATA ID)

| Halaman | Field | Indonesia | English (harus setia) |
|---|---|---|---|
| Home | title | Dreamlab | Maklon Kosmetik dan Parfum BPOM Terbaik - Wujudkan Brand Impian Anda | Dreamlab | Best BPOM Cosmetic & Perfume Manufacturer - Make Your Dream Brand a Reality |
| Home | description | One-Stop Maklon Kosmetik Bersertifikat BPOM, CPKB Grade A dan Halal MUI di Surabaya. 500+ Brand Sudah Mempercayakan Formulasi dan Produksinya pada Kami. | One-Stop Cosmetic Manufacturing (Maklon) Certified BPOM, CPKB Grade A and Halal MUI in Surabaya. 500+ brands have trusted their formulation and production with us. |
| About | title | Dreamlab | Jasa Maklon Skincare dan Parfum BPOM Indonesia | Dreamlab | Skincare & Perfume Manufacturing Services BPOM Indonesia |
| Services | title | DREAMLAB | Layanan Pabrik Kosmetik Private Label Terlengkap | DREAMLAB | The Most Complete Private Label Cosmetic Factory Services |
| Our Client | title | DREAMLAB | Berikut 500++ Client Percaya produksi di Dreamlab | DREAMLAB | Here Are 500++ Clients Who Trust Production at Dreamlab |
| Contact | title | DREAMLAB | Jasa Maklon Kosmetik Surabaya Jawa Timur | DREAMLAB | Cosmetic Manufacturing Services Surabaya, East Java |

Periksa juga:
- OG locale harus en_US di halaman EN dan id_ID di halaman ID
- OG title dan OG description harus terjemahan setia
- robots konsisten (index, follow, max-image-preview:large)
- title pakai absolute agar template tidak menambah duplikat

---

## 6. UJI 3 - UI SAMA PERSIS

1. Bandingkan daftar komponen yang dirender ID vs EN (harus sama persis).
2. Bandingkan urutan section di halaman (harus sama).
3. Bandingkan struktur HTML kasar (section, heading, tombol) - boleh beda teks,
   tapi struktur dan styling harus sama.
4. Catatan: ID home memakai dynamic import (loading placeholder), EN home
   memakai import langsung - pastikan hasil akhir visualnya identik.

---

## 7. UJI 4 - SEO (POTENSI MASALAH)

### 7.1 lang attribute
- /en/...  -> html lang="en"
- halaman ID -> html lang="id"
(Cek di HTML hasil curl, bukan hanya setelah JS jalan)

### 7.2 canonical dan hreflang
- Setiap halaman EN punya canonical ke dirinya sendiri
- Setiap halaman EN punya hreflang id-ID, en-US, x-default yang saling menunjuk
- Setiap halaman ID yang punya versi EN punya hreflang en-US ke /en/...
- Halaman ID yang TIDAK punya versi EN TIDAK boleh punya hreflang en-US
  (misal /produk/skincare/, /blog/, artikel, /panduan/)
- TIDAK boleh ada hreflang yang menunjuk ke halaman 404 (lihat Temuan B)

### 7.3 JSON-LD
- OrganizationSchema bilingual: di /en/ pakai areaServed Worldwide dan
  availableLanguage English, di ID pakai ID dan Indonesian
- Tidak boleh ada JSON-LD Organization ganda di halaman EN
- WebSite schema di layout EN pakai inLanguage en
- PageSchema di setiap halaman (h1, breadcrumb) konsisten

### 7.4 Sitemap dan robots
- sitemap.xml memuat /en, /en/produk, /en/about-us, /en/services,
  /en/our-client, /en/contact-us
- robots.txt mengizinkan /en/ (tidak ada disallow)
- Tidak ada halaman EN yang 404 tapi tetap di sitemap

### 7.5 Redirect dan trailing slash
- /en  harus redirect ke /en/
- /en/about-us (tanpa slash) harus redirect ke /en/about-us/
- URL lama dan redirect di proxy.ts tidak mengganggu /en/

### 7.6 Duplicate content
- /en/produk/ menampilkan KatalogProduk yang sama dengan home -> cek risiko
  konten duplikat (lihat Temuan B dan D)

---

## 8. UJI 5 - NAVIGASI DAN TAUTAN INTERNAL

1. LanguageSwitcher: dari halaman ID (yang punya versi EN) harus link ke /en/...,
   dari halaman EN harus link balik ke versi ID.
2. Header dan Footer di halaman EN: menu utama harus menunjuk ke /en/...,
   menu kategori produk (skincare, body care, dll) menunjuk ke mana?
   (lihat Temuan E)
3. Tombol CTA dan WhatsApp: teks harus English, link WA harus tetap jalan.
4. Breadcrumb di PageSchema konsisten dengan halaman.
5. Tautan maps di Contact sesuai lokasi.

---

## 9. UJI 6 - RUNTIME (CURL) - CEK LIST PER URL

Untuk tiap URL di bawah, cek dengan curl:
- Status 200
- html lang correct
- title tag sesuai metadata
- meta description sesuai metadata
- canonical benar
- hreflang id/en/x-default benar
- JSON-LD Organization dan WebSite hadir
- TIDAK ada kata Indonesia di teks terlihat (kecuali nama brand)

URL yang dicek:
https://dreamlab.id/en/
https://dreamlab.id/en/produk/
https://dreamlab.id/en/about-us/
https://dreamlab.id/en/services/
https://dreamlab.id/en/our-client/
https://dreamlab.id/en/contact-us/

---

## 10. UJI 7 - REGRESI HALAMAN INDONESIA

1. Halaman ID tetap berbahasa Indonesia (cek 6 halaman utama).
2. Halaman ID tetap pakai komponen yang sama (tidak ada perubahan).
3. html lang="id" di halaman ID.
4. Metadata ID tidak berubah (title, description).
5. git status: hanya file /en/, data/en/site.tsx, dan komponen penunjang yang
   berubah, halaman ID tidak ada perubahan.

---

## 11. TEMUAN AWAL (SUDAH TERDETEKSI SEBELUM TESTING)

### Temuan A - KatalogProduk mengabaikan prop title dan categories
Komponen KatalogProduk hanya memakai prop content. Prop title dan categories
TIDAK digunakan (hasil pengecekan kode). Akibatnya:
- Di /en/ (home dan /en/produk/) bagian katalog menampilkan teks default
  BAHASA INDONESIA: judul "Katalog Layanan Maklon Premium", eyebrow
  "Formulasi Eksklusif dan CPKB Grade A", deskripsi Indonesia, tag
  "15+ Formula Premium", subkategori "Masker".
- Link kategori menunjuk ke /produk/... (halaman Indonesia).
- Dampak: konten campur bahasa di halaman EN + bukan terjemahan setia
  + navigasi EN nyasar ke halaman ID.
- Catatan: ini terjadi JUGA di halaman home Indonesia (komponen memakai
  default), jadi UI dua bahasa tetap sama persis - tapi teksnya Indonesia.

### Temuan B - hreflang /en/produk/ menunjuk ke halaman 404
Halaman /produk/ (index) TIDAK ADA di situs Indonesia (hanya ada
/produk/kategori/). buildAlternates untuk /en/produk/ membuat hreflang
id-ID dan x-default menunjuk ke https://dreamlab.id/produk/ yang 404.
Ini potensi masalah SEO (hreflang ke halaman yang tidak ada).

### Temuan C - BlogSection di home EN tidak dirender
ID home menampilkan artikel spotlight di BlogSection. EN home mengirim
posts kosong sehingga BlogSection kembali null (section tidak tampil).
UI jadi tidak 100 persen sama dengan versi Indonesia.

### Temuan D - /en/produk/ tidak punya pasangan di Indonesia
Halaman /en/produk/ adalah halaman baru yang tidak ada versi Indonesianya
(ID tidak punya index /produk/). Perlu keputusan: dipertahankan, atau
diubah agar meniru struktur yang ada.

### Temuan E - Menu kategori produk di EN menunjuk ke halaman ID
Header dan Footer di halaman EN menampilkan nama English (misal Skincare
Manufacturing) tapi link tetap ke /produk/skincare/ (halaman Indonesia)
karena versi EN kategori belum ada. Ini wajar sebagai batasan, tapi perlu
keputusan.

---

## 12. KEPUTUSAN YANG PERLU DIAMBIL (OLEH USER)

1. KatalogProduk: apakah bagian katalog di /en/ harus menampilkan versi
   English dari visualCategories (opsi: perbaiki komponen atau isi prop
   content di halaman EN)?
2. Halaman /en/produk/: dipertahankan (perlu perbaikan hreflang) atau
   dihapus (tidak ada pasangan ID)?
3. BlogSection EN: buat versi English artikel spotlight, atau biarkan kosong?
4. Kategori produk EN (skincare, body care, dll): dibuatkan halaman EN,
   atau biarkan menu EN menunjuk ke halaman ID (dengan catatan)?
5. Dua dokumen review lama (ENGLISH-CONTENT-REVIEW.md dan
   CHANGES-ENGLISH-SEO-LOCALIZATION.md) masih berisi konten SEO-localization
   yang sudah digantikan terjemahan setia - perlu diperbarui atau dihapus.

---

## 13. KRITERIA KELULUSAN (ACCEPTANCE)

1. Semua 6 halaman /en/ merender komponen yang sama persis dengan ID.
2. Semua teks terlihat di /en/ berbahasa English dan setia terhadap ID.
3. Metadata /en/ adalah terjemahan setia dari metadata ID.
4. Tidak ada hreflang ke 404, tidak ada canonical salah, tidak ada konten
   campur bahasa, sitemap dan robots benar.
5. Halaman Indonesia tidak berubah sama sekali.
6. npm run build sukses, server jalan, semua URL status 200.

---

## 14. LANGKAH TERAKHIR (SETELAH TESTING DISETUJUI)

1. Perbaiki temuan yang disepakati (minta persetujuan user dahulu).
2. npm run build + verifikasi ulang.
3. Update dokumen review yang kedaluwarsa.
4. Commit dan push (Vercel auto-deploy).
5. Verifikasi produksi setelah deploy.

---

## 15. HASIL UJI RUNTIME (2026-08-04) - SELESAI & LOLOS

### 15.1 Temuan yang sudah diperbaiki
1. KatalogProduk EN kini pakai konten English (content catalogContentEn),
   teks default Indonesia tidak muncul lagi di /en/ dan /en/produk/.
2. Hreflang /en/produk/ ke /produk/ (404) dihilangkan - /en/produk/ kini
   hanya punya canonical, tidak ada hreflang.
3. BlogSection home EN sekarang dirender dengan 2 kartu artikel English
   (terjemahan judul dan excerpt artikel spotlight).
4. LanguageSwitcher di /en/produk/ tidak lagi menunjuk /produk/ (404),
   fallback ke / (home Indonesia).
5. Link kategori produk di header/footer EN diarahkan ke /en/produk/
   (localizeHref), bukan lagi ke halaman Indonesia.
6. Tombol WhatsApp, logo header, dan logo footer dibuat bilingual
   (English di halaman EN, Indonesia di halaman ID).
7. Hero halaman Services EN diisi subtitle, primaryCta, dan secondaryCta
   English (sebelumnya memakai default Indonesia).

### 15.2 Hasil pengecekan per halaman EN (status 200 semua)
- /en/       lang="en", title dan desc terjemahan setia, hreflang id/en/x-default, canonical benar
- /en/produk/ lang="en", canonical-only (tanpa hreflang), katalog English
- /en/about-us/ lang="en", hreflang id/en/x-default, CompanyProfileWrapper English
- /en/services/ lang="en", hero English (Start Free Consultation, See How It Works)
- /en/our-client/ lang="en", hreflang id/en/x-default
- /en/contact-us/ lang="en", hreflang id/en/x-default

### 15.3 Hasil pengecekan SEO
- Tidak ada hreflang ke halaman 404 (halaman ID tanpa versi EN, seperti
  /produk/skincare/ dan /news-blog/, tidak punya hreflang en-US).
- Hreflang saling menunjuk (mutual) antara ID dan EN untuk 5 halaman.
- JSON-LD Organization bilingual: English di /en/, Indonesian di ID.
- WebSite schema di layout EN memakai inLanguage en.
- html lang SSR: en di /en/, id di halaman ID.
- Redirect trailing slash: /en -> /en/, /en/about-us -> /en/about-us/.
- Sitemap memuat 6 halaman /en/; robots.txt tidak men-disallow /en/.
- 0 kata Indonesia terlihat di semua halaman EN (setelah membuang payload script).

### 15.4 Regresi halaman Indonesia
- Home ID tetap: Jasa Maklon Kosmetik dan Skincare Terpercaya Indonesia,
  katalog Katalog Layanan Maklon Premium, lang="id".
- Metadata ID tidak berubah.
- tsc --noEmit bersih, npm run build sukses.

### 15.5 Catatan kecil (tidak menghalangi)
- 7 link kartu katalog di halaman EN masih menunjuk halaman produk Indonesia
  (pola sama dengan kartu blog yang menautkan artikel Indonesia).
- Atribut title pada gambar logo partner masih turunan nama file (bukan teks terlihat).