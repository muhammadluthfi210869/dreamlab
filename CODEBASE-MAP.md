# Codebase Map — dreamlab-site

> Website marketing & maklon kosmetik Dreamlab (dreamlab.id). Bahasa Indonesia + EN (`/en`).

## Stack
- Next.js 16 (App Router) + React 19 + TypeScript 5 + Tailwind CSS 4
- Data: Supabase (Postgres) + Upstash Redis; integrasi Kommo (CRM) untuk lead
- Deploy: Vercel (dreamlab.id)

## Struktur
```
src/app/          → halaman (App Router), satu folder = satu route
src/components/   → komponen React (Hero, Article, FAQ, form, dll)
src/data/         → single source of truth konten (artikel, produk, halaman maklon)
src/lib/          → logika: lead, SEO, DB, integrasi, util
src/hooks/        → custom React hooks
src/types/        → type definitions
scripts/          → verifikasi & audit (SEO, redirect, lead, asset)
db/migrations/    → skema/migrasi database
public/           → asset statis (gambar)
```

## File kunci + tanggung jawab
- `src/data/articles.ts` — **semua artikel** (konten HTML + SEO meta). Single source of truth.
- `src/data/products.ts` & `src/data/products-v2` — katalog produk maklon
- `src/data/maklon-pages.ts` — konten halaman-halaman utama (biaya, jasa, private label, dll)
- `src/lib/db.ts` / `src/lib/supabase-client.ts` / `src/lib/supabase-server.ts` — akses database
- `src/lib/lead-capture.ts` + `lead-assignment.ts` + `lead-routing.ts` + `roundRobin.ts` + `round-robin-config.ts` — **alur lead** (penerimaan → pembagian → routing)
- `src/lib/kommo-client.ts` — integrasi CRM Kommo (kirim lead)
- `src/lib/wa-message.ts` — template pesan WhatsApp
- `src/lib/seo-service.ts` + `seo-lang.ts` + `seo-url-policy.ts` + `schema-generator.ts` — SEO (metadata, hreflang, schema.org)
- `src/lib/internal-auth.ts` — proteksi halaman internal
- `src/lib/tracking.ts` / `visitor.ts` — tracking visitor
- `src/app/[...slug]/page.tsx` — **catch-all**: merender artikel/blog dari `src/data/articles.ts`
- `src/app/layout.tsx` — root layout (metadata global, navbar, footer)
- `src/app/sitemap.ts` + `robots.ts` — SEO teknis (sitemap dinamis dari data)

## Alur data
1. **Lead**: form di halaman → `lead-capture` → `lead-assignment`/`roundRobin` (pembagian rata) → `kommo-client` (ke CRM) + simpan ke DB
2. **Konten**: `src/data/articles.ts` → dirender `[...slug]/page.tsx` → metadata SEO dari `seo-service`
3. **Halaman**: `src/data/*.ts` → komponen di `src/components/` → `src/app/*/page.tsx`

## Perintah verifikasi (dari package.json)
```bash
npm run lint                       # eslint
npx tsc --noEmit                   # typecheck
npm run build                      # next build (termasuk typecheck)
npm run verify:redirects           # test redirect
npm run verify:lead-flow           # test alur lead
npm run verify:round-robin         # test konfigurasi pembagian lead
npm run verify:seo                 # test integritas SEO
npm run verify:assets              # test path asset
npm run verify:all                 # build + semua verify di atas
npm run preflight                  # alias verify:all
```

## "Di mana mencari X"
- **Routing/halaman baru** → buat folder di `src/app/<slug>/page.tsx`
- **Ubah artikel** → `src/data/articles.ts` (+ tambah ke sitemap otomatis)
- **Alur lead** → `src/lib/lead-*.ts`, `roundRobin*.ts`
- **Integrasi CRM** → `src/lib/kommo-client.ts`
- **SEO meta** → `src/lib/seo-service.ts`, `schema-generator.ts`
- **Komponen UI** → `src/components/` (kebanyakan per-halaman)
- **DB** → `src/lib/db.ts`; skema di `db/migrations/`
- **Script verifikasi** → `scripts/` (cocokkan nama dengan package.json)
- **Gambar** → `public/assets/`, path direferensikan di data + divalidasi `verify:assets`

_Map dibuat 2026-08-11. Perbarui dengan /map saat struktur berubah._
