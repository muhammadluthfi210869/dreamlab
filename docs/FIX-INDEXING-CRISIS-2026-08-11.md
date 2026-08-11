# PERBAIKAN KRISIS INDEXING — DREAMLAB (11 Agustus 2026)

## Ringkasan Masalah
- **1.940+ halaman tidak terindex** di Google Search Console (GSC), hanya ~480 terindex.
- 4 kategori validasi GSC **GAGAL** (file `GSC_DREAMLAB FAILED 11_08_26.xlsx`):
  1. DIBLOKIR ROBOT.TXT — 470 URL
  2. HALAMAN PENGALIHAN — 432 URL
  3. DIKECUALIKAN TAG NOINDEV — 83 URL
  4. DUPLIKAT TANPA KANONIS — 9 URL

---

## AKAR MASALAH YANG DITEMUKAN

### 1. robots.txt memblokir `/_next/static/` (469 URL "Diblokir robots.txt")
Googlebot TIDAK bisa mengambil JS/CSS Next.js → rendering halaman tidak sempurna
→ banyak halaman masuk kategori "Crawled - currently not indexed".
**FIX:** Hapus `Disallow: /_next/static/` dari `src/app/robots.ts`.

### 2. Konflik tag robots GANDA (index + noindex + noindex)
`metadata.robots` ada di ROOT LAYOUT **dan** halaman catch-all `[...slug]`.
Next.js menggabungkannya → halaman memancarkan 2–3 tag `<meta name="robots">`
dengan direktif bertentangan. Google memakai yang paling restriktif (**noindex**),
jadi ribuan halaman yang seharusnya index jadi efektif noindex.
**FIX:** Hapus `robots` dari `src/app/layout.tsx` & `src/app/en/layout.tsx`.

### 3. Soft-404: root catch-all `[...slug]` mengembalikan HTTP 200 + konten 404
Next.js merender `notFound()` pada root catch-all sebagai **200**, bukan 404.
URL-URL seperti `/produk/`, `/en/produk/babycare/`, `/biaya-maklon-skincare-*`,
redirect target `/maklon/kosmetik/*` semuanya jadi soft-404 → Google melihat
ribuan "crawled - not indexed".
**FIX:** Tambahkan pengecekan 404 di middleware `src/proxy.ts` menggunakan daftar
path valid (`src/data/site-paths.ts`). Path yang tidak dikenal kini HTTP 404 asli.

### 4. Sitemap berisi URL yang diblokir robots.txt & yang redirect
17 URL `/maklon-skincare/*`, `/maklon-parfum/*`, `/maklon-baby-care/*` ada di
sitemap TAPI diblokir robots.txt DAN redirect ke `/maklon/kosmetik/*` (soft-404).
**FIX:** Filter di `src/app/sitemap.ts` — URL yang redirect/diblokir dihapus dari
sitemap; redirect target diarahkan ke halaman `/produk/*` yang nyata (bukan
`/maklon/kosmetik/*`).

### 5. Redirect maklon legacy mengarah ke target 404
`/maklon-skincare/face-cream/` → 301 → `/maklon/kosmetik/face-cream/` (404).
Sub-path dipertahankan padahal tidak ada di struktur baru.
**FIX:** `src/proxy.ts` — redirect ke target dasar `/produk/{kategori}/`.

### 6. Duplikat tanpa kanonis (9 URL)
Halaman thankyou `/ads/thankyou/*`, `/thankyou/google/` tidak punya noindex/kanonis.
**FIX:** Tambah `noindex` + `canonical` di semua halaman thankyou & ads.

### 7. `/pages/*.php` di-disallow robots.txt (1 URL)
Disallow mencegah Google melihat status 410 → URL tidak pernah dibuang.
**FIX:** Hapus `Disallow: /pages/` agar Google bisa lihat 410 dan drop URL.

---

## PERUBAHAN KODE YANG DILAKUKAN

| File | Perubahan |
|---|---|
| `src/app/robots.ts` | Izinkan `/_next/static/`, hapus `/pages/` disallow |
| `src/app/layout.tsx` | Hapus `robots` dari metadata (fix tag ganda) |
| `src/app/en/layout.tsx` | Hapus `robots` dari metadata |
| `src/app/[...slug]/page.tsx` | GenerateMetadata tidak lempar notFound (kembalikan metadata 404); tambah segment not-found |
| `src/app/not-found.tsx` | Tambah `robots: noindex, follow` |
| `src/app/sitemap.ts` | Filter URL maklon yang redirect/diblokir + kategori yang redirect |
| `src/proxy.ts` | Redirect maklon → `/produk/*`; tambah pengecekan 404 (SITE_PATHS) |
| `src/data/site-paths.ts` | Baru — daftar 512 path valid (untuk middleware 404) |
| `scripts/generate-site-paths.mjs` | Baru — generator daftar path valid (`npm run gen:paths`) |
| `src/app/ads/layout.tsx` | Tambah `robots: noindex` untuk semua halaman /ads/ |
| Halaman thankyou (5 file) | Tambah `noindex` + `canonical` |
| `package.json` | Tambah script `gen:paths` |

---

## CARA DEPLOY

```bash
# 1. Generate daftar path valid (jika ada konten baru)
npm run gen:paths

# 2. Build & test
npm run build
npm run verify:all

# 3. Deploy ke production (Vercel / Netlify / VPS)
#    git add . && git commit && git push (sesuai workflow Anda)

# 4. PASTIKAN robots.txt & sitemap.xml baru sudah live:
#    curl -s https://dreamlab.id/robots.txt  → TIDAK BOLEH ada Disallow: /_next/static/
#    curl -s https://dreamlab.id/sitemap.xml | grep -c '<loc>'  → ~289 URL
```

---

## LANGKAH DI GOOGLE SEARCH CONSOLE (setelah deploy)

1. **Kirim sitemap baru**: GSC → Sitemaps → submit `https://dreamlab.id/sitemap.xml`.
2. **Minta validasi ulang** keempat kategori yang gagal:
   - Halaman → "Diblokir oleh robots.txt" → Validasi perbaikan
   - Halaman → "Halaman dengan pengalihan" → Validasi (hanya jika yakin target sudah benar)
   - Halaman → "Dikecualikan oleh tag noindex" → Validasi
   - Halaman → "Duplikat tanpa kanonis" → Validasi
3. **Minta peng-index-an halaman penting** (URL Inspection → Request Indexing):
   - `/`, `/produk/skincare/`, `/produk/bodycare/`, `/produk/haircare/`, `/produk/parfum/`
   - 5–10 artikel dengan traffic tertinggi.
4. **Crawl ulang via Google** — butuh waktu 1–4 minggu untuk Google me-refresh.

---

## EKSPEKTASI & CATATAN

- **"Halaman dengan pengalihan" (432 URL)** akan SELALU muncul di GSC selama
  Google masih menemukan link ke URL lama. Ini NORMAL pasca-migrasi. Yang penting
  target redirect sudah benar (halaman nyata, indexable). Update internal link agar
  langsung mengarah ke URL kanonis.
- **Noindex yang disengaja** (author/admin, thankyou, /produk/{babycare,footcare,decorative}/*)
  akan tetap muncul di kategori noindex — ini tidak masalah karena memang di-design.
- **Duplikat konten `/produk/*` vs `/maklon-*`**: Masih ada duplikat antara halaman
  produk `/produk/...` dan halaman legacy `/maklon-.../...` (untuk body-care, hair-care,
  decorative, foot-care). Rekomendasi lanjutan: pilih satu versi kanonis per produk
  (disarankan `/produk/*`) dan 301-kan `/maklon-*` ke sana. Ini proyek fase 2.

---

# FASE 2 — KONSOLIDASI DUPLIKAT `/produk/*` vs `/maklon-*` (IMPLEMENTED)

## Tujuan
Satu struktur produk kanonis: **`/produk/*`**. Semua halaman `/maklon-*` legacy → 301 ke `/produk/*`.

## Perubahan Kode (Fase 2)

| File | Perubahan |
|---|---|
| `src/app/produk/[category]/[...slug]/page.tsx` | Un-noindex `babycare`, `footcare`, `decorative` (hanya `pkrt` yang tetap noindex) |
| `src/lib/seo-url-policy.ts` | Hapus `/produk/footcare`, `/produk/babycare`, `/produk/decorative` dari noindexOnlyPaths |
| `src/data/maklon-redirects.ts` | **Baru** — 70 mapping redirect maklon → /produk/* (parent + sub-page) |
| `src/proxy.ts` | Terapkan MAKLON_PRODUCT_REDIRECTS (prioritas tertinggi); `/maklon-pkrt/` → 410 |
| `next.config.ts` | Hapus konflik adsRedirects (`/maklon-skincare`, `/maklon-parfum`, `/maklon-hair-care`) yang mengarah ke `/google-ads/` (noindex) |
| `src/app/sitemap.ts` | Hapus SEMUA halaman maklon-* dari sitemap |
| `scripts/generate-site-paths.mjs` | Jangan masukkan /maklon-* product page ke SITE_PATHS |

## Hasil Terverifikasi
- **70 redirect** maklon → /produk/* → **semua target HTTP 200** (0 rusak)
- Variasi slug ditangani: `makeup→make-up`, `masker-wajah→face-mask`, `serum-wajah→facial-serum`, `sabun-batang→bar-soap`, `baby-moisturizer→baby-lotion`, dsb.
- Produk decorative yang tidak punya halaman produk individual → redirect ke sub-kategori (`/produk/decorative/make-up/` atau `/produk/decorative/lipcare/`) atau kategori
- `/produk/babycare/*`, `/produk/footcare/*`, `/produk/decorative/*` kini **indexable** (robots: index, follow)
- Sitemap: 266 URL, 0 halaman produk maklon (artikel maklon-* standalone tetap ada — itu benar)
- Soft-404 tetap 404, artikel tetap 200

## Catatan Penting
- **Artikel bernama `maklon-*`** (mis. `/maklon-kosmetik-kediri/`) adalah ARTIKEL asli di articles.ts — TIDAK di-redirect, tetap di sitemap. Hanya halaman PRODUK `/maklon-{kategori}/{produk}/` yang redirect.
- **Backlink ke `/maklon-*`** kini tersalur (301) ke `/produk/*` → equity terkonsolidasi.
- `pkrt` sengaja di-exclude (410) — konsisten antara `/produk/pkrt/` dan `/maklon-pkrt/`.

## Langkah GSC setelah deploy Fase 2
1. Validasi ulang kategori "noindex" — halaman produk babycare/footcare/decorative kini indexable
2. Validasi ulang kategori "duplikat tanpa kanonis"
3. Request indexing untuk halaman produk yang baru un-noindex
4. Pantau: halaman `/produk/*` yang muncul di index akan bertambah; `/maklon-*` akan diganti oleh redirect 301

---

# SELF-REVIEW & PERBAIKAN CELAH (Post-Review)

## Celah yang Ditemukan & Diperbaiki

### 1. [KRITIS] robots.txt masih memblokir /maklon-* yang sekarang redirect 301
**Masalah:** robots.txt masih `Disallow: /maklon-skincare/`, `/maklon-parfum/`, dsb.
Ketika URL redirect 301, Google harus bisa CRAWL sumbernya untuk mengikuti redirect
dan menyalurkan equity. Disallow → Google tidak bisa follow redirect → equity backlink
hilang & URL legacy tidak pernah dibersihkan.
**Fix:** Hapus semua disallow slug legacy yang redirect (maklon-*, bisnis-*, dreampreneur, tips-*).

### 2. [PENTING] Breadcrumb semua produk → /produk/ yang 404
**Masalah:** Semua file products-v2 punya breadcrumb `{ href: "/produk/" }` dan `/produk/`
tidak ada halamannya → setiap halaman produk punya internal link ke 404.
**Fix:** Buat halaman hub `/produk/` (katalog produk, indexable, canonical) + masuk sitemap.

### 3. [SEDANG] Redirect chain 2-hop untuk 3 produk decorative
**Masalah:** `/maklon-decorative/makeup/foundation/` → `/produk/decorative/foundation/`
→ (301 lagi) → `/produk/decorative/make-up/`. 2-hop tidak ideal.
**Fix:** Mapping langsung ke `/produk/decorative/make-up/`.

### 4. [SEDANG] Generator decorative salah untuk 4 produk
**Masalah:** Generator membuat target `/produk/decorative/make-up/cream-blush/` (404)
padahal cream-blush & mascara adalah produk FLAT di `/produk/decorative/{produk}/`.
**Fix:** Hardcode mapping decorative yang sudah terverifikasi (flat vs sub-kategori).

### 5. [OPERASIONAL] SITE_PATHS & MAKLON_REDIRECTS bisa stale
**Masalah:** Jika konten/produk berubah tanpa regenerate, halaman baru bisa 404 atau
redirect salah. Manual maintenance rawan lupa.
**Fix:** `prebuild` otomatis menjalankan generator (SITE_PATHS + MAKLON_REDIRECTS)
setiap kali `npm run build`.

## Status Akhir Terverifikasi
- **70 redirect** maklon → /produk/* → **semua target HTTP 200** (0 rusak)
- **0** halaman produk maklon di sitemap (267 URL total, /produk/ termasuk)
- **0** disallow maklon/bisnis/dreampreneur di robots.txt
- `/produk/` hub → 200, index, canonical
- Soft-404 → 404, artikel → 200, produk un-noindex → 200 index
- Build + TypeScript + lint → lolos
