# Panduan Deploy Artikel — Dreamlab Site

> **TL;DR:** Tambah artikel → push ke GitHub `master` → Vercel auto-deploy → cek URL live.

---

## Workflow Deploy (Setiap Tambah Artikel Baru)

### Step 1 — Siapkan entry artikel di `src/data/articles.ts`
Lokasi entry: append di akhir array `articles` (sebelum baris `];`).
Gunakan pattern dari entry sebelumnya. Field wajib:

```ts
{
  "slug": "/nama-artikel-kebab-case",          // URL friendly, TANPA trailing slash
  "title": "Judul H1 — Maks 65 char",          // Tampil sebagai <h1>
  "publishDate": "2026-09-11T00:00:00+00:00", // ISO 8601, tanggal publish
  "author": "Dreamlab Maklon Kosmetik",
  "categories": ["Maklon Kosmetik"],          // atau kategori silo lain
  "tags": ["keyword1", "keyword2", ...],
  "featuredImage": "/asset artikel/folder/file.jpg",  // Path absolut dari /public
  "excerpt": "Ringkasan singkat maks 160 char",
  "content": "<div class=\"elementor-...\">...</div>", // HTML escaped
  "faqs": [{ "question": "...", "answer": "..." }, ...],
  "seo": {
    "title": "Meta title — 50-60 char, beda dari H1",
    "description": "Meta description — maks 155 char"
  }
}
```

**Slug HARUS unik** — cek dulu sebelum publish:
```powershell
Grep "nama-artikel-kebab-case" 'C:\GAWE\Web Dev\Porto Aureon\CRAWL WEBSITE DREAMLAB\dreamlab-site\src\data\articles.ts'
```

### Step 2 — Generate meta ringan
**WAJIB** setelah edit `articles.ts` agar artikel muncul di halaman `/news-blog` & sitemap:

```powershell
cd 'C:\GAWE\Web Dev\Porto Aureon\CRAWL WEBSITE DREAMLAB\dreamlab-site'
node scripts/gen-articles-meta.mjs
```

Output normal:
```
Generated ...src/data/articles-meta.ts with N+1 articles (XX KB)
```

### Step 3 — Verifikasi build lokal (optional, untuk sanity check)
```powershell
cd 'C:\GAWE\Web Dev\Porto Aureon\CRAWL WEBSITE DREAMLAB\dreamlab-site'
npm run build
```
Expected: build sukses tanpa error blocking. Jumlah halaman static akan naik +1.

### Step 4 — Commit & push ke GitHub
```powershell
cd 'C:\GAWE\Web Dev\Porto Aureon\CRAWL WEBSITE DREAMLAB\dreamlab-site'
git add src/data/articles.ts src/data/articles-meta.ts
git commit -m "feat: tambah artikel [JUDUL SINGKAT]

Co-Authored-By: Claude Code <noreply@anthropic.com>"
git push origin master
```

**PENTING:** Hanya commit file terkait artikel. File lain yang termodifikasi (auto-generated, scripts, dll.) sebaiknya di-handle terpisah.

### Step 5 — Trigger Vercel deploy
**Otomatis (preferred):** Karena Vercel sudah connect ke GitHub repo ini, push ke `master` akan trigger auto-deploy. Tunggu 1-3 menit.

**Manual (fallback):** Buka [Vercel Dashboard](https://vercel.com/dreamlabid/dreamlab) → pilih branch `master` → klik **Redeploy**.

### Step 6 — Verifikasi URL live
Tunggu Vercel deploy selesai (cek status di dashboard atau email notifikasi). Lalu cek URL:

```
https://dreamlab.id/<slug-artikel>/
```

**Quick check via curl:**
```powershell
curl -I https://dreamlab.id/jasa-maklon-exfoliating-toner-aha-bha-pha-bpom/
```
Expected: HTTP 200.

**Cek sitemap:**
```
https://dreamlab.id/sitemap.xml
```
URL baru akan muncul di sitemap dengan `<lastmod>` = tanggal deploy.

---

## Troubleshooting

| Problem | Solusi |
|---|---|
| URL tetap 404 setelah 5 menit | Cek Vercel deployment log di dashboard. Apakah build gagal? |
| Sitemap tidak update | Tunggu cache Vercel (1-2 menit). Clear browser cache. |
| Artikel tidak muncul di `/news-blog/` | Pastikan step 2 (gen-articles-meta.mjs) sudah dijalankan |
| Slug typo/bentrok | Ganti slug di array, regenerate meta, commit, push lagi |
| Build error | Jalankan `npm run build` lokal, cek error di terminal |
| Git push rejected (non-fast-forward) | Remote lebih baru dari local. Lihat "Force Sync" di bawah |

---

## Force Sync (jika git push ditolak)

Jika remote `master` punya commit yang tidak ada di local:

```powershell
cd 'C:\GAWE\Web Dev\Porto Aureon\CRAWL WEBSITE DREAMLAB\dreamlab-site'

# 1. Stash working tree changes (kalau ada)
git stash push -u -m "my-pending-changes"

# 2. Reset ke remote master (artikel-related commits di-reflog, masih bisa di-recover)
git reset --hard origin/master

# 3. Checkout file artikel dari commit sebelumnya yang ada di reflog
git checkout <hash-commit-sebelumnya> -- src/data/articles.ts src/data/articles-meta.ts

# 4. Commit fresh di atas origin/master
git add src/data/articles.ts src/data/articles-meta.ts
git commit -m "feat: tambah artikel [JUDUL]"
git push origin master
```

**Atau lebih aman** — pakai GitHub web "Update from main" jika ada konflik besar.

---

## Struktur File Pendukung

| File | Fungsi | Diedit saat deploy? |
|---|---|---|
| `src/data/articles.ts` | **Single source of truth** semua artikel (HTML content + meta) | ✅ Ya |
| `src/data/articles-meta.ts` | Generated ringan untuk `/news-blog` listing & sitemap | 🔄 Auto-generated |
| `src/app/[...slug]/page.tsx` | Catch-all renderer artikel | ❌ Tidak |
| `src/components/RelatedLinks.tsx` | Komponen RelatedLinks otomatis (filter same category) | ❌ Tidak |
| `src/components/ArticleTemplate.tsx` | Template visual artikel | ❌ Tidak |
| `src/app/sitemap.ts` | Sitemap dinamis dari data | ❌ Tidak |
| `scripts/gen-articles-meta.mjs` | Script generate meta ringan | ❌ Tidak |
| `public/asset artikel/<folder>/` | Folder image per-artikel (cover + body jika ada) | ➕ Tambah image |

---

## Checklist Sebelum Push

- [ ] Slug unik (cek via Grep)
- [ ] H1 50-65 char, Meta title 50-60 char, Meta description ≤155 char
- [ ] Excerpt ≤160 char
- [ ] Categories: `["Maklon Kosmetik"]` (atau sesuai silo)
- [ ] featuredImage path valid (file ada di `/public/`)
- [ ] Content HTML escaped properly (`\\n`, `\\"`)
- [ ] FAQ 5-11 item, self-contained, semua nyambung ke Dreamlab
- [ ] Min 4 inbound internal links (topical), min 2 outbound (nofollow _blank, URL valid)
- [ ] Entity Dreamlab: "Dreamlab maklon kosmetik" 3-5x, "Juaranya Formula" 1-2x, "1 Client = 1 Custom Formula" 1x, "brand partner" 1x
- [ ] TIDAK ada klaim angka belum terverifikasi (500+ brand, 15+ negara, dst)
- [ ] MOQ disebut "fleksibel", bukan angka tetap
- [ ] FAQ Page JSON-LD schema match dengan FAQ yang tampil
- [ ] Hanya 1 CTA di penutup (template Tambah satu lagi = global, ignore)
- [ ] `gen-articles-meta.mjs` sudah dijalankan
- [ ] Build lokal sukses (`npm run build`)

---

## Quick Reference — Useful Commands

```powershell
# Cek artikel sudah masuk sitemap lokal:
Get-Content '.next\server\app\sitemap.xml.body' | Select-String "nama-artikel"

# Cek artikel di build artifacts:
ls '.next\server\app\' | Where-Object { $_.Name -like '*nama-artikel*' }

# Cek commit terakhir:
git log --oneline -5

# Cek status working tree:
git status --short
```

---

_Last updated: 2026-09-11_