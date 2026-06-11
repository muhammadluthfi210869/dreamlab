# PLAN EKSEKUSI MIGRASI SEO 100% — dreamlab.site → dreamlab.id
> **Status:** v3.0 — Mencakup 4 task baru (Sanitasi Schema, Soft 404 Defense, Cloudflare Rollback, ISR Sync)
> **Target:** Zero SEO loss. Zero penalty risk. Zero downtime.

---

## PRE-FLIGHT GATES (Jangan lanjut sebelum 4 gate ini HIJAU)

### Gate A: Soft 404 Defense ✅ (implemented)
```
[...slug]/page.tsx → validateSlugOrReject()
4 sumber validasi: articles | seo-mapping.json | maklon-pages | Supabase/CSV
FALLBACK: notFound() — server memuntahkan 404, bukan 200 kosong
```

### Gate B: Schema Sanitization ✅ (implemented)
```
schema-generator.ts     → aggregateRating DIHAPUS
ProductPackagingGallery.tsx → fake "5.0 (X Reviews)" DIHAPUS
└─ ZERO properti rating fiktif di seluruh codebase
```

### Gate C: Cloudflare Proxy Protocol ✅ (documented)
```
CUTOVER_CLOUDFLARE_PROTOCOL.md — CNAME switch 1 detik, rollback instant
DNS Propagation: 0 detik (vs 24-48 jam tanpa Cloudflare)
```

### Gate D: ISR On-Demand Revalidation ✅ (implemented)
```
api/revalidate/route.ts   → POST webhook dengan Bearer token
.env.example              → REVALIDATION_SECRET terkonfigurasi
```

---

## MINGGU 1: VERIFIKASI & BASELINE (H-7 sampai H-1)

### Hari 1: Ambil semua baseline

```bash
# 1A. GSC Baseline Export (manual via GSC UI)
# Performance → Queries → Export CSV (6 bulan terakhir)
# Pages → Export CSV (semua indexed pages)
# Simpan di: scripts/output/gsc-baseline/

# 1B. Backlink Baseline
npx tsx scripts/backlink-baseline.ts

# 1C. Live Site Crawl Baseline (Wajib — ini acuan utama)
npx tsx scripts/crawl-baseline.ts
# Output: scripts/output/crawl-baseline.json + .csv

# 1D. PageSpeed Baseline (top 20 halaman)
npx tsx scripts/pagespeed-snapshot.ts
```

### Hari 2: Build & Verifikasi Lokal

```bash
# 2A. Build production
npm run build
# ⚠️ Pastikan ZERO error — jangan lanjut jika ada warning sekalipun

# 2B. Redirect integrity test (193 URL dari seo-mapping.json)
npx tsx scripts/test-redirects.ts
# Target: 0 invalid mappings

# 2C. SEO integrity test (metadata parity)
npx tsx scripts/verify-seo-integrity.ts
# Target: 100% path coverage, 0 missing slugs

# 2D. Asset path verification
npx tsx scripts/verify-asset-paths.ts
# Target: 0 broken /wp-content/ paths, 0 missing images
```

### Hari 3: Fix item audit yang belum tuntas

| # | Issue | Solusi | File |
|---|-------|--------|------|
| 9.1 | 17 halaman tanpa meta description | Redirect ke halaman relevan via next.config.ts | `next.config.ts` redirects[] |
| 9.2 | Placeholder content service pages | Isi konten di `seo-audit-export.csv` atau `maklon-pages.ts` | `src/data/maklon-pages.ts` |
| 9.3 | Duplicate meta titles pagination | Tambahkan ` — Page {n}` suffix | `news-blog/page/[num]/page.tsx` |
| 9.4 | Backlink baseline | Sudah diambil Hari 1B | — |
| 9.5 | GSC performance baseline | Sudah diambil Hari 1A | — |
| 9.6 | Semantic internal linking | Enhancement pasca-cutover | — |
| 9.7 | aggregateRating fiktif | ✅ SUDAH FIX (Gate B) | `schema-generator.ts` |

### Hari 4-5: Deploy Staging + Crawl

```bash
# 4A. Deploy ke Netlify (branch deploy / deploy preview)
# Netlify CLI:
netlify deploy --dir=.next --prod=false

# 4B. Setelah staging live, crawl staging:
npx tsx scripts/crawl-baseline.ts
# ⚠️ Ganti BASE_URL di script ke URL staging Netlify

# 4C. Bandingkan crawl staging vs baseline production:
# Gunakan diff sederhana:
npx tsx scripts/compare-crawl-results.ts
```

### Hari 5: Staging QA Checklist

```
[ ] Semua 193 URL dari seo-mapping.json resolve 200 (bukan 404/redirect loop)
[ ] Metadata: title & meta description match CSV — 0 mismatch
[ ] Canonical: semua absolute URL ke https://dreamlab.id/
[ ] Schema: Rich Results Test zero errors (spot-check 10 halaman)
[ ] hreflang: tidak ada (single locale id_ID)
[ ] Robots: tidak ada noindex di halaman live
[ ] Sitemap: resolve sempurna (0 broken URLs)
[ ] Image: tidak ada broken image di 5 artikel teratas
[ ] Mobile: render baik di 375px width
[ ] PageSpeed Mobile > 70, Desktop > 85
```

---

## MINGGU 2: CUTOVER & MONITORING (H-Hour)

### H-2: Final Preparations

```bash
# 1. Set REVALIDATION_SECRET di Netlify env vars
#    Netlify Dashboard → Site settings → Environment variables
#    REVALIDATION_SECRET = <generate with: openssl rand -hex 32>

# 2. Set Supabase webhook (jika sudah digunakan)
#    Supabase Dashboard → Database → Webhooks
#    URL: https://dreamlab.id/api/revalidate
#    Method: POST
#    Header: Authorization: Bearer <REVALIDATION_SECRET>
#    Body: {"paths":["/" + record.slug + "/"],"type":"path"}

# 3. Verifikasi Cloudflare proxy
#    Dashboard Cloudflare → DNS → dreamlab.id → Orange Cloud ON
#    SSL/TLS → Full (strict)
#    Edge Certificates → Always Use HTTPS ON

# 4. Deploy production ke Netlify (production branch)
netlify deploy --dir=.next --prod
```

### H-Hour: Cutover via Cloudflare (durasi < 60 detik)

```
STEP 1 (t=0s)
  Cloudflare DNS → dreamlab.id
  HAPUS  : A Record → <IP VPS WordPress>
  TAMBAH : CNAME → <nama-site>.netlify.app
  Proxy  : ON (Orange Cloud)

STEP 2 (t=30s)
  curl -sI https://dreamlab.id/ | grep -i "server:"
  # Harus return: server: Netlify

STEP 3 (t=45s) — Rollback trigger jika gagal:
  JIKA: HTTP 5xx atau blank page
  MAKA: Kembalikan A Record → <IP VPS WordPress>
  ├─ Rollback Selesai — 0 detik propagasi
  └─ Tidak ada downtime terdeteksi

STEP 4 (t=60s)
  Submit sitemap ke GSC:
  https://dreamlab.id/sitemap.xml
```

### H+1 jam: Monitoring Pertama

```bash
# 1. Live crawl cepat (20 URL kritis)
#    Homepage, /news-blog/, 5 artikel teratas, 3 service page, 3 produk page

# 2. GSC → URL Inspection Tool
#    Test 5 URL random dari indexed pages
#    Pastikan: "URL is on Google" + "Page indexed"

# 3. Server logs Netlify
#    Function logs → cari ERROR/5xx
#    Pastikan 0 crash di menit pertama
```

### H+24 jam: Monitoring Harian

```
[ ] GSC Coverage: "Submitted and indexed" count — tidak boleh turun > 5%
[ ] GSC Performance: klik & impresi vs baseline — toleransi ±10%
[ ] GSC 404 Report: 0 halaman indexed yang jadi 404
[ ] GA4 Realtime: traffic pattern normal
[ ] Netlify Analytics: 0 server-side 5xx
```

### H+72 jam: Monitoring Lanjutan

```
[ ] GSC Coverage: stabil atau naik
[ ] Core Web Vitals: LCP/INP/CLS via GSC → tidak lebih buruk dari baseline
[ ] Crawl budget: Googlebot crawl rate stabil
[ ] Full crawl ulang: bandingkan dengan baseline H-7
```

---

## MINGGU 3: DEKLARASI & CLEANUP (H+7 sampai H+30)

### H+7: Deklarasi Sukses

```
GATE: Semua 5 kondisi harus HIJAU

[ ] 0 penurunan indexed pages di GSC (±3% masih acceptable)
[ ] Organic traffic stabil atau naik
[ ] Core Web Vitals ≥ WordPress baseline
[ ] 0 broken internal links (dari crawl terakhir)
[ ] Semua 301 redirect berfungsi (test ulang 193 URL)
```

### H+30: Wordpress Shutdown

```
[ ] Matikan VPS WordPress
[ ] Hapus A Record backup dari Cloudflare
[ ] Simpan final backup VPS (cold storage)
[ ] Pantau GSC 1 minggu final — pastikan 0 anomali
```

---

## SCRIPT INVENTORY (semua script siap pakai)

| Script | Fungsi | Kapan Dijalankan |
|--------|--------|------------------|
| `scripts/test-redirects.ts` | Validasi 193 redirect dari seo-mapping.json | H-6 (setiap build) |
| `scripts/verify-seo-integrity.ts` | Validasi path coverage + metadata parity | H-6 |
| `scripts/verify-asset-paths.ts` | Deteksi broken image paths | H-6 |
| `scripts/crawl-baseline.ts` | Crawl full site + ekstrak metadata, schema, errors | H-7 (baseline) + H+1 (post) |
| `scripts/pagespeed-snapshot.ts` | PSI snapshot top 20 halaman | H-7 + H+1 |
| `scripts/gsc-baseline.ts` | Export GSC data via API | H-7 |
| `scripts/backlink-baseline.ts` | Export backlink profile | H-7 |
| `scripts/compare-crawl-results.ts` | Diff crawl baseline vs staging | H-4 |
| `scripts/smoke-test.ts` | Smoke test URL kritis | H+1jam |

## COMMAND CHEAT SHEET

```bash
# Semua baseline dalam 1 perintah:
npx tsx scripts/crawl-baseline.ts && npx tsx scripts/pagespeed-snapshot.ts

# Semua verifikasi pre-build:
npm run build && npx tsx scripts/test-redirects.ts && npx tsx scripts/verify-seo-integrity.ts && npx tsx scripts/verify-asset-paths.ts

# Revalidation manual (force purge ISR cache):
curl -X POST https://dreamlab.id/api/revalidate \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"paths":["/","/news-blog/","/maklon-skincare/"],"type":"path"}'
```

---

## REVISI DARI VERSI SEBELUMNYA

| v2.0 (Checkslist awal) | v3.0 (Setelah 4 task baru) |
|------------------------|---------------------------|
| 9.7: aggregateRating → flag spam | ✅ DIHAPUS — Gate B |
| 8.3: DNS cutover TTL rendah | ✅ DIGANTI — Cloudflare Proxy (Gate C) |
| Soft 404 tidak ada di checklist | ✅ DITAMBAHKAN — validateSlugOrReject() (Gate A) |
| ISR hanya revalidate=3600 statis | ✅ DITAMBAHKAN — api/revalidate on-demand (Gate D) |
| Cutover propagasi jam-jaman | ✅ DIGANTI — rollback 1ms via Cloudflare |
