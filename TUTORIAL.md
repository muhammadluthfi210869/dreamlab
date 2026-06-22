# 📘 TUTORIAL — OpenCode untuk Dreamlab.id

## 📋 Daftar Isi
- [Cara Clone & Buka Project](#-langkah-1-buka-opencode--clone-repo)
- [Cara Menambah Artikel Baru](#-langkah-2-menambah-artikel-baru)
- [Cara Edit Minor (teks, gambar, warna)](#-langkah-3-edit-minor)
- [Cara Cek di Localhost](#-langkah-4-cek-di-localhost)
- [Cara Deploy](#-langkah-5-deploy-ke-production)

---

## 🚀 LANGKAH 1 — BUKA OpenCode & CLONE REPO

Buka terminal (Windows PowerShell), ketik:

```bash
opencode
```

**Pertama kali saja** — paste pesan ini ke OpenCode:

> Tolong clone repo GitHub https://github.com/muhammadluthfi210869/dreamlab.git ke folder `C:\GAWE\Web Dev\Porto Aureon\CRAWL WEBSITE DREAMLAB\dreamlab-site`. Kalau sudah ada foldernya, skip cloning dan langsung buka foldernya. Setelah itu baca `src/data/articles.ts` dan beri tahu saya daftar semua judul artikel yang ada beserta slug-nya.

---

## ✏️ LANGKAH 2 — MENAMBAH ARTIKEL BARU

Paste template **ini persis** ke OpenCode, isi bagian `[...]` saja:

```
Tolong tambah artikel BARU di src/data/articles.ts untuk blog dreamlab.id.

--- BRIEF ARTIKEL BARU ---
JUDUL: [JUDUL ARTIKEL — contoh: Maklon Skincare di Jakarta]
SLUG: [URL — contoh: maklon-skincare-jakarta]
KATEGORI: [pilih salah satu: bisnis-kosmetik / maklon-personal-care / maklon-skincare / maklon-footcare]
PENULIS: admin

META TITLE (max 60 char): [JUDUL UNTUK SEO]
META DESCRIPTION (max 160 char): [DESKRIPSI RINGKAS UNTUK SEO]

ISI ARTIKEL:
[KETIK ISI ARTIKEL DI SINI — minimal 300 kata, pakai format HTML atau plain text dengan paragraf terpisah]

Di dalam artikel, sisipkan minimal 1 internal link ke produk dreamlab:
contoh: <a href="https://dreamlab.id/produk/skincare/">lihat produk skincare kami</a>

Tambahkan juga 2 FAQ di bagian bawah:
FAQ 1 — Pertanyaan: [...]
FAQ 2 — Pertanyaan: [...]

--- VISUAL DNA ---
Tema artikel ini adalah: [skincare / parfum / haircare / bodycare]
Gunakan warna yang sesuai:
- skincare: #EADBC8 / #CFB185
- parfum: #EAD7CD / #E2BC86
- haircare: #E7ECFE

--- SETELAH SELESAI ---
Jalankan npx next build untuk verifikasi tidak ada error. Kalau ada error, fix dulu.
```

**Contoh isian yang sudah jadi:**

```
Tolong tambah artikel BARU di src/data/articles.ts untuk blog dreamlab.id.

--- BRIEF ARTIKEL BARU ---
JUDUL: Maklon Skincare di Jakarta
SLUG: maklon-skincare-jakarta
KATEGORI: maklon-skincare
PENULIS: admin

META TITLE (max 60 char): Maklon Skincare di Jakarta — Jasa Pembuatan Brand Kosmetik
META DESCRIPTION (max 160 char): Jasa maklon skincare di Jakarta untuk brand kosmetik sendiri. Proses BPOM, halal, formula custom. Konsultasi gratis.

ISI ARTIKEL:
Membuat brand skincare sendiri kini semakin mudah, terutama di Jakarta yang menjadi pusat industri kosmetik Indonesia. Dreamlab hadir sebagai solusi maklon skincare profesional dengan standar BPOM dan Halal.

Dengan layanan lengkap mulai dari pengembangan formula, desain kemasan, hingga pengurusan izin edar, Anda bisa memiliki brand skincare sendiri tanpa perlu memiliki pabrik.

Kami melayani pembuatan berbagai produk seperti serum, moisturizer, sunscreen, toner, facial wash, dan masih banyak lagi. Semua produk diformulasikan oleh tim R&D berpengalaman.

Kunjungi halaman produk kami untuk melihat kategori lengkap: <a href="https://dreamlab.id/produk/skincare/">Katalog Produk Skincare Dreamlab</a>

Proses produksi dilakukan di fasilitas CPKB Grade A dengan standar kualitas tinggi. Setiap batch produk diuji untuk memastikan keamanan dan efektivitas.

Tim Dreamlab siap membantu Anda dari konsep hingga produk jadi. Konsultasi gratis tanpa kewajiban.

FAQ 1 — Pertanyaan: Berapa MOQ minimum untuk maklon skincare di Dreamlab?
FAQ 1 — Jawaban: MOQ minimum mulai dari 100 pcs per produk, tergantung jenis produk dan kemasan.

FAQ 2 — Pertanyaan: Berapa lama proses produksi maklon skincare?
FAQ 2 — Jawaban: Rata-rata 2 bulan untuk produk baru, mulai dari formulasi hingga jadi.

--- VISUAL DNA ---
Tema artikel ini adalah: skincare
Gunakan warna: #EADBC8 / #CFB185

--- SETELAH SELESAI ---
Jalankan npx next build untuk verifikasi tidak ada error.
```

---

## 🔧 LANGKAH 3 — EDIT MINOR

Kalau mau ubah sedikit saja (teks, gambar, warna, dll), **kasih detail LENGKAP** seperti ini:

```
Saya ingin mengubah teks di website.

URL halaman: [URL LENGKAP]
Contoh: http://localhost:3000/produk/skincare/

Bagian: [NAMA BAGIAN]
Contoh: Section Hero — bagian Headline

Elemen: [ELEMEN SPESIFIK]
Contoh: Teks "Jasa Maklon Face Cream BPOM dan Halal"

Yang sekarang tertulis: [TULIS KALIMAT LAMA]
Ganti dengan: [TULIS KALIMAT BARU]

Carikan file yang berisi teks tersebut di folder src/ dan ganti.
Setelah selesai, jalankan npx next build.
```

### Contoh untuk ganti teks di artikel:

```
Saya ingin mengubah teks di artikel:

URL artikel: http://localhost:3000/news-blog/maklon-skincare-jakarta/

Bagian: Paragraf 3, kalimat pertama

Yang sekarang tertulis: "Kami melayani pembuatan berbagai produk seperti serum"
Ganti dengan: "Dreamlab melayani pembuatan berbagai produk seperti serum day cream, night cream, dan serum wajah"

Carikan file src/data/articles.ts dan cari string tersebut lalu ganti. Build dengan npx next build.
```

### Contoh untuk ganti gambar:

```
Saya ingin mengganti gambar di halaman:

URL: http://localhost:3000/produk/skincare/face-cream/

Bagian: Hero section — gambar latar belakang

Image file lama: [NAMA FILE LAMA.webp]
Image file baru: [NAMA FILE BARU.webp] yang ada di folder public/new asset/skincare&facecare/

Ganti semua referensi file gambar lama dengan yang baru di folder src/.
Build dengan npx next build.
```

### Contoh untuk ganti nomor WhatsApp:

```
Saya ingin mengganti nomor WhatsApp di landing page:

Cari di folder src/ semua file yang mengandung nomor "628777650657"
Ganti semua dengan nomor "628xxxxxxxxx"

Build dengan npx next build.
```

---

## 🌐 LANGKAH 4 — CEK DI LOCALHOST

Setelah build sukses, jalankan:

```
npm run dev
```

Buka browser, ketik `http://localhost:3000/news-blog/[SLUG_ARTIKEL]/`

Cek:
- [ ] Judul artikel muncul
- [ ] Isi artikel rapi (paragraf, heading)
- [ ] Gambar muncul (kalau ada)
- [ ] URL sesuai slug
- [ ] Internal link bisa diklik
- [ ] FAQ muncul
- [ ] Meta title benar (lihat di tab browser)

Kalau ada yang salah, minta OpenCode perbaiki, build ulang, refresh browser.

---

## ✅ LANGKAH 5 — DEPLOY KE PRODUCTION

Kalau sudah fix, **pakai Vercel CLI** (cara paling stabil):

```
Jalankan npx next build dulu untuk verifikasi tidak ada error. Kalau sukses, deploy ke Vercel Production:

vercel --prod --token [VERCEL_TOKEN] --yes
```

ATAU pakai **Git push** (kalau GitHub sudah connect ke Vercel):

```
git add -A
git commit -m "feat: [TULIS PERUBAHAN — contoh: add article maklon-skincare-jakarta]"
git push origin master
```

**Selesai!** Tunggu 2-3 menit, site live di `https://dreamlab.id`.

Cek di browser: `https://dreamlab.id/news-blog/[SLUG_ARTIKEL]/`

> **ℹ️ Info Akun Vercel:**
> - Akun: **luthfizywx@gmail.com** (Vercel Pro)
> - Project: `dreamlab-site`
> - Dashboard: https://vercel.com/luthfizywx-2603s-projects/dreamlab-site
> - **Kalau GitHub auto-deploy error**, pakai cara Vercel CLI di atas
> - **Kalau domain error**, cek Settings → Domains di dashboard Vercel, pastikan `dreamlab.id` verified

---

## ⚡ CHEATSHEET — Perintah Cepat

| Yang Ingin Dilakukan | Perintah ke OpenCode |
|---|---|
| Cari teks di semua file | Cari di folder src/ semua file yang mengandung teks "[TEKS]" |
| Ganti teks di semua file | Cari "[TEKS_LAMA]" di folder src/ dan ganti semua dengan "[TEKS_BARU]" |
| Cek build | `npx next build` |
| Jalankan server lokal | `npm run dev` lalu buka http://localhost:3000 |
| Deploy (Git) | `git add -A && git commit -m "..." && git push origin master` |
| Deploy (Vercel CLI) | `vercel --prod --yes` |
| Lihat daftar artikel | Baca file `src/data/articles.ts` dan sebutkan semua judul |

---

## 🎨 VISUAL DNA — Panduan Warna per Tema

| Tema | Warna 1 | Warna 2 | Cocok Untuk |
|---|---|---|---|
| skincare | `#EADBC8` | `#CFB185` | Artikel tentang face cream, serum, sunscreen, toner |
| parfum | `#EAD7CD` | `#E2BC86` | Artikel tentang parfum, EDP, EDT, body mist |
| haircare | `#E7ECFE` | — | Artikel tentang shampoo, hair mask, serum rambut |
| bodycare | `#EADBC8` | `#CFB185` | Artikel tentang body lotion, scrub, sabun |

---

> **Tips:** Kalau OpenCode bingung atau error, screenshoot errornya dan tanyakan ke tim IT. Atau kirim ulang perintah dengan lebih detail — sebutkan URL, bagian, dan teks yang mau diubah persis seperti contoh di atas.
