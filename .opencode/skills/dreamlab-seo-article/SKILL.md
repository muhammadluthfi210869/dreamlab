# PRD: Struktur SEO Artikel Blog Dreamlab

**Tujuan dokumen:** jadi acuan baku (source of truth) untuk penulisan dan implementasi artikel blog di dreamlab.id, supaya konsisten secara SEO/AEO/GEO, sesuai brand guideline Dreamlab, dan nggak mengulang bug implementasi yang pernah ditemukan. Dipakai oleh siapa pun yang menulis artikel (manusia atau AI) dan siapa pun yang meng-implementasi-kan ke web (opencode/dev).

## Daftar Isi

1. [Brand & Entity Guideline](#1-brand--entity-guideline-wajib-di-setiap-artikel)
2. [Strategi Keyword & Intent (Framework AEO/GEO)](#2-strategi-keyword--intent-framework-aeogeo)
   - 2.1 Seed Keyword → 4 Intent Cluster
   - 2.2 Struktur Answer-Ready (AEO)
3. [Struktur Artikel Wajib](#3-struktur-artikel-wajib)
   - 3.1 Aturan Gambar Wajib (Header, Tengah, Footer)
   - 3.2 Aturan Visualisasi Data
4. [Requirement Implementasi Web](#4-requirement-implementasi-web-untuk-developeropencode)
5. [Checklist Sebelum Publish](#5-checklist-sebelum-publish)

---

## 1. Brand & Entity Guideline (Wajib di Setiap Artikel)

**Brand:** PT Karya Impian Laboratoris — Dreamlab
**Website:** https://dreamlab.id
**Tagline:** "Juaranya Formula"
**Positioning:** Partner maklon kosmetik one-stop-service — bukan vendor, tapi mitra bisnis.

**Diferensiasi utama yang harus konsisten disebut:**
- **Brand partner, bukan cuma pabrik produksi** — Dreamlab dibantu dari konsep (riset pasar, positioning, konsep produk/aroma) sampai strategi penjualan, bukan cuma mencetak barang lalu selesai. Ini entity penting yang wajib ditekankan di setiap artikel: Dreamlab = partner strategis, bukan vendor yang cuma nunggu pesanan produksi masuk.
- **1 Klien 1 Formula** — formula eksklusif, tidak dipakai brand lain.
- **MOQ fleksibel** — klien menentukan sendiri jumlah produksi awal sesuai kemampuan dan kebutuhan brand. **Jangan pernah cantumkan angka MOQ spesifik (contoh: "100 pcs", "1000 pcs") sebagai klaim umum Dreamlab**, kecuali itu memang fakta spesifik dari studi kasus/klien tertentu yang sudah dikonfirmasi.
- **Legalitas lengkap** — CPKB Grade A, BPOM RI, Halal MUI, HKI.
- **Pendampingan end-to-end** — dari konsultasi, riset pasar, konsep/formulasi, legalitas, desain kemasan, produksi, sampai strategi dan marketing penjualan.

**Aturan klaim angka/statistik (PENTING):**
- Jangan cantumkan klaim seperti "500+ brand" atau "15+ negara" kecuali sudah dikonfirmasi valid oleh tim Dreamlab untuk artikel yang bersangkutan — klaim ini pernah diminta dihapus karena tidak terverifikasi.
- Angka spesifik (tahun berdiri, sertifikasi, MOQ, dll) hanya boleh dipakai kalau sudah dikonfirmasi, bukan asumsi dari draft sebelumnya.

**Entity SEO yang wajib ada secara natural di setiap artikel:**
- "Dreamlab maklon kosmetik" — 3–5x
- "Juaranya Formula" — 1–2x
- "1 Klien 1 Formula" — minimal 1x di bagian relevan
- "brand partner" / "partner bisnis" (bukan sekadar vendor produksi) — minimal 1x, biasanya di section "Mengapa Dreamlab" atau intro
- "maklon kosmetik Indonesia" (atau kategori spesifik: "maklon parfum", dst) — 2–3x

**Aturan link eksternal (client/partner/media):**
- Sebelum memasukkan link eksternal (contoh: brand klien, media partner), **verifikasi dulu URL-nya benar-benar valid** (cek lewat web search, jangan tebak/karang domain).
- Kalau tidak yakin/tidak ketemu akun resmi, JANGAN pasang link — sebutkan nama brand tanpa link, dan catat di bagian "External Link Note" bahwa link belum terverifikasi.
- Semua link keluar domain pakai `target="_blank" rel="noopener"`.

---

## 2. Strategi Keyword & Intent (Framework AEO/GEO)

Setiap artikel WAJIB melalui tahap strategi sebelum ditulis, bukan langsung nulis:

### 2.1 Seed Keyword → 4 Intent Cluster

| Intent | Contoh modifier | Funnel stage | Format konten |
|---|---|---|---|
| Informational | apa itu, cara, kenapa, panduan, tips | Awareness | Blog article, guide |
| Commercial | terbaik, rekomendasi, review, vs | Consideration | Comparison, listicle |
| Transactional | harga, biaya, MOQ, konsultasi gratis | Decision | CTA-heavy section/page |
| Navigational | [brand], [brand] + kota/event | Trust | Brand/news mention |

Pilih 1 seed keyword utama per artikel yang benar-benar dicari orang — **jangan jadikan nama event/siaran/kolaborasi sebagai keyword utama** (contoh: "Dreamlab di Klik FM" nyaris tidak ada volume pencarian). Nama event dipakai sebagai *hook* judul/E-E-A-T, bukan target SEO utama; keyword utama harus mengarah ke masalah/topik yang nyata dicari (contoh: "cara mulai bisnis kosmetik modal kecil", bukan nama siarannya).

### 2.2 Struktur Answer-Ready (AEO)

| Slot | Isi | Sumber keyword |
|---|---|---|
| Title/H1 | Keyword utama, natural, menarik | Primary informational/commercial |
| Direct-answer opener (100 kata pertama) | Jawaban langsung 1–3 kalimat, tanpa basa-basi | Keyword informational prioritas |
| H2/H3 bergaya pertanyaan | Pertanyaan nyata + jawaban ringkas | Keyword sekunder |
| Tabel/list perbandingan | Kriteria head-to-head, langkah, proses | Keyword commercial |
| FAQ block | 5–11 Q&A self-contained | Long-tail yang belum kepakai |
| CTA/decision section | Konsultasi, next step | Keyword transactional |

---

## 3. Struktur Artikel Wajib

```
[META]
Meta Title: max 60 karakter, keyword di depan
Meta Description: max 155 karakter, pain + solusi + CTA
Slug: url-friendly, unik, deskriptif — hindari duplikasi/typo (cek dulu sebelum publish)
Keyword Utama + Keyword LSI (3–5)

[H1]
Keyword utama, conversational, menarik — hindari judul generik/template

[INTRO — 80–150 kata]
- Jawab pertanyaan utama di 1–2 kalimat pertama (answer-first)
- Sertakan minimal 1 fakta/angka spesifik yang sudah terverifikasi
- Sebutkan "Dreamlab maklon kosmetik" secara natural

[EMBED/VISUAL PENDUKUNG — kalau ada sumber, misal Instagram]
- Kalau artikel merujuk konten sosial media, embed harus jadi PREVIEW ASLI
  (thumbnail + play), BUKAN cuma link teks. Ini pernah gagal diimplementasi —
  wajib dicek langsung di browser sebelum dianggap selesai.

[BODY — 4–7 H2]
- Setiap H2 fokus satu topik, 150–350 kata
- H2 harus SPESIFIK dan bervalue, bukan judul template kosong
  (Contoh buruk: "Kesimpulan". Contoh baik: "Kenapa Salah Pilih Maklon Bikin
  Brand Kamu Rugi")
- Selipkan entity Dreamlab secara natural, jangan dipaksakan
```

### 3.1 Aturan Gambar Wajib (Header, Tengah, Footer)

Setiap artikel WAJIB punya 3 slot gambar, dan ketiganya **file yang berbeda-beda per artikel** — jangan reuse file generik yang sama dari artikel lain kecuali benar-benar belum ada file baru yang disiapkan:

| Slot | Posisi | Aturan |
|---|---|---|
| **Header/featured image** | Tepat di bawah H1 | **Selalu ganti/unik per artikel** — nggak boleh pakai ulang header image artikel lain. Harus relevan sama topik spesifik artikel ini. Loading eager/priority (LCP). |
| **Gambar tengah** | Di tengah artikel, biasanya setelah 1–2 section pertama | Wajib ada file terpisah untuk gambar tengah (bukan file yang sama dengan header). Kalau ini banner konsultasi generik yang memang dipakai berulang di banyak artikel, itu masih oke — tapi kalau ada foto/visual spesifik untuk topik artikel ini (contoh: foto client, ilustrasi konsep), pakai itu, jangan generik. Lazy load. |
| **Gambar footer/bawah (CTA)** | Di CTA block penutup | Wajib ada file terpisah untuk CTA, boleh reuse template CTA visual kalau memang belum ada versi khusus artikel ini. Lazy load. |

Kalau file gambar belum dikirim/disiapkan untuk artikel baru, JANGAN asal pasang gambar artikel lain sebagai pengganti permanen — tandai `TODO` di kode dan informasikan ke tim konten bahwa gambar header/tengah/footer artikel ini masih kosong dan perlu di-supply.

### 3.2 Aturan Visualisasi Data

**Setiap kali ada data yang bisa dibandingkan, dipecah jadi tahapan, atau punya struktur berlapis, WAJIB divisualisasikan** — jangan dibiarkan jadi paragraf panjang. Bentuk visual yang dipakai sesuai konteks:

- **Tabel** — untuk perbandingan (Dreamlab vs standar industri, versi lama vs versi baru, dst)
- **Numbered list** — untuk langkah/proses berurutan
- **Bullet list** — untuk poin-poin sejajar yang nggak berurutan
- **Piramida/breakdown notes** (khusus konten parfum) — top/heart/base notes selalu dalam tabel atau list terstruktur, bukan kalimat naratif panjang

Kalau draft artikel ternyata memuat perbandingan atau proses tapi masih ditulis sebagai paragraf naratif, itu artinya draft belum selesai — ubah dulu ke bentuk visual sebelum dianggap final.

```
[MENGAPA DREAMLAB — H2 wajib, selalu ada]
- Tampilkan diferensiasi (1 Klien 1 Formula, MOQ fleksibel, legalitas)
- JANGAN pakai klaim angka yang belum terverifikasi (lihat aturan Section 1)

[PANDUAN/LANGKAH PRAKTIS — kalau relevan]
- Kalau ada 2 topik yang overlap (contoh: "panduan umum" dan "cara Dreamlab
  bantu"), GABUNG jadi satu section, jangan dipisah jadi 2 H2 yang isinya
  saling mengulang.

[FAQ — H2: "Pertanyaan yang Sering Diajukan"]
- Minimal 5, maksimal 11 pertanyaan
- SETIAP pertanyaan harus nyambung dan berkaitan langsung dengan Dreamlab —
  bukan FAQ generik industri yang bisa dipakai brand manapun. Contoh buruk:
  "Apa itu maklon kosmetik?" tanpa embel-embel Dreamlab sama sekali di
  jawabannya. Contoh baik: jawaban selalu mengaitkan balik ke layanan/proses/
  diferensiasi Dreamlab, meski pertanyaannya umum.
- Setiap jawaban self-contained (2–4 kalimat, nggak butuh konteks paragraf lain)
- WAJIB tampil sebagai text box/card terpisah (border, rounded, padding) dan
  accordion/dropdown di implementasi web (lihat Section 4) — bukan teks polos
  menyatu tanpa pembatas

[CTA PENUTUP]
- HANYA SATU CTA block di akhir artikel (pernah ada bug dobel CTA)
- Heading pendek + 1 paragraf ringkas + tombol jelas ("Konsultasi Gratis
  Sekarang") + gambar CTA
- Sertakan "Dreamlab maklon kosmetik" sekali lagi
```

---

## 4. Requirement Implementasi Web (untuk Developer/OpenCode)

Bagian ini isinya lesson-learned dari bug yang pernah ketemu saat implementasi — WAJIB dicek satu-satu sebelum artikel dianggap "selesai":

| # | Requirement | Cara verifikasi |
|---|---|---|
| 1 | **Konten tidak boleh dobel render.** Setiap paragraf, tabel, FAQ, CTA hanya render 1x. | Buka halaman live, scroll dari atas ke bawah, pastikan tidak ada teks yang berulang persis sama. |
| 2 | **FAQ harus tampil sebagai text box/card (border, rounded, padding) DAN accordion/dropdown**, bukan teks polos menyatu. Default collapsed (boleh 1 item default terbuka). Klik pertanyaan = toggle jawaban. | Klik beberapa pertanyaan di browser, pastikan expand/collapse benar-benar jalan dan tiap Q&A punya pembatas box yang jelas. |
| 3 | **Embed sosial media (Instagram dll) harus jadi preview asli** — thumbnail + tombol play, bukan link teks kosong. Kalau pakai Next.js, panggil ulang `window.instgrm.Embeds.process()` di `useEffect` saat komponen mount. | Buka di browser, embed harus terlihat seperti post Instagram sungguhan, bisa diklik play. |
| 4 | **Hanya 1 CTA block di penutup.** | Scroll ke bawah artikel, pastikan cuma ada satu heading + tombol CTA, bukan versi teks polos + versi block sekaligus. |
| 5 | **Gambar header selalu unik/beda per artikel** (bukan reuse artikel lain), **gambar tengah dan gambar footer/CTA wajib ada file terpisah** dan tampil (tidak broken). Cek nama file persis sesuai yang dikirim, jangan pakai nama placeholder yang beda dari artikel lain tanpa sepengetahuan tim konten. | Screenshot halaman, pastikan tidak ada broken image icon, dan bandingkan header image artikel ini vs artikel lain — harus beda file. |
| 6 | **FAQPage JSON-LD schema harus match persis** dengan teks yang tampil di accordion — tidak boleh ada pertanyaan/jawaban di schema yang beda dari yang di-render user. | Compare teks schema di `<script type="application/ld+json">` vs teks di halaman. |
| 7 | **Title/H1 di listing lain (related posts, latest news) harus sama persis** dengan title artikel aslinya — pernah ada bug typo dari slug yang salah concat. | Cek title yang muncul di halaman lain yang me-link artikel ini. |
| 8 | **Slug unik, tidak typo, tidak bentrok** dengan artikel lain. | Cross-check daftar slug yang sudah ada sebelum publish. |
| 9 | **Kategori di-assign ke taksonomi yang benar** (contoh: "Maklon Kosmetik" vs "Maklon Parfum" — jangan campur), tidak bikin kategori duplikat. | Cek admin/CMS kategori list. |
| 10 | **Satu H1 per halaman**, urutan heading H1→H2→H3 tidak diloncat. | Inspect element / heading outline tool. |

---

## 5. Checklist Sebelum Publish

- [ ] Meta title ≤60 karakter, meta description ≤155 karakter
- [ ] Slug unik, deskriptif, tidak typo
- [ ] Keyword utama muncul di H1 dan 100 kata pertama
- [ ] Minimal 1 angka/fakta terverifikasi di intro
- [ ] Semua entity Dreamlab konsisten (nama, tagline, diferensiasi — sesuai Section 1)
- [ ] Tidak ada klaim angka yang belum diverifikasi (500+ brand, dst)
- [ ] MOQ selalu disebut "fleksibel", bukan angka tetap (kecuali studi kasus spesifik)
- [ ] Link eksternal sudah diverifikasi valid, bukan tebakan
- [ ] FAQ 5–11 pertanyaan, self-contained, dan semuanya nyambung/berkaitan dengan Dreamlab (bukan FAQ generik industri)
- [ ] FAQ tampil sebagai text box/card + accordion, bukan teks polos
- [ ] FAQPage JSON-LD schema match dengan teks di halaman
- [ ] Hanya 1 CTA block di penutup
- [ ] Header image unik/beda dari artikel lain; gambar tengah dan footer/CTA ada file terpisah, semua tampil tidak broken
- [ ] Semua data perbandingan/tahapan sudah divisualisasikan (tabel/list), bukan paragraf naratif
- [ ] Embed sosial media (kalau ada) tampil sebagai preview asli
- [ ] Tidak ada konten yang ke-render dobel
- [ ] Dicek langsung di browser (bukan cuma baca kode) untuk poin accordion, embed, dan duplikasi
