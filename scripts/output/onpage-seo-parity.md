# On-Page SEO Parity Report

**Date:** 2026-06-11
**Source:** `seo-audit-export.csv` (224 entries) vs `articles.ts` (182 articles) vs `next.config.ts` redirects
**Next.js Metadata Flow:** CSV → `seo-service.ts` → `getSEOData(slug)` → `generateMetadata()` in `[...slug]/page.tsx`

---

## 1. Summary

| Metric | Value | Status |
|--------|-------|--------|
| Articles missing CSV SEO metadata | **70 / 182 (38%)** | ⚠️ HIGH |
| Garbled titles (scraping artifacts) | **1** | ⚠️ MEDIUM |
| Truncated/short titles (< 30 chars) | **2** | ⚠️ LOW |
| Divergent H1 vs meta title (expected) | 13 | ✅ INFO |
| Canonical URL mismatches | **0** | ✅ PASS |
| Short meta descriptions (< 60 chars) | **0** | ✅ PASS |
| Titles missing brand name | 115 | ℹ️ INFO |

---

## 2. HIGH: Articles Missing SEO Metadata (70)

These 70 articles exist in `articles.ts` but have **no entry** in `seo-audit-export.csv`. The `[...slug]/page.tsx` fallback uses `article.title` for the `<title>` tag and `article.excerpt` for the meta description. While functional, these lack optimized title tags with brand keywords, proper meta descriptions, and canonical URL overrides.

**Impact:** These pages will still render and index, but with weaker SEO signals than pages with dedicated CSV metadata. Titles may lack keyword optimization and the "Dreamlab" brand mention.

**Recommendation:** Add CSV entries for all 70 slugs, or generate metadata from article fields using a consistent template. Example title template: `{article.title} | Dreamlab Maklon Kosmetik`.

<details>
<summary>Full list of 70 missing slugs</summary>

```
/foot-care-produk-peluang-bisnis-maklon-dreamlab
/maklon-hair-care-kesalahan-pemula-brand
/cara-buat-parfum-sendiri-dengan-maklon
/memilih-pabrik-maklon-kosmetik-sertifikasi-cpkb
/bahan-aktif-skincare-paling-dicari
/pabrik-maklon-kosmetik-cpkb-grade-a
/panduan-persentase-manfaat-niacinamide-skincare
/jenis-vitamin-c-whitening-terbaik
/skincare-natural-bali-pasar-internasional
/hair-treatment-ampoule-maklon-haircare-dreamlab
/maklon-kosmetik-pemula-modal-kecil
/rekomendasi-skincare-musim-hujan-agar-kulit-tetap-sehat-dan-lembap
/astaxanthin-mengapa-bahan-aktif-ini-sedang-naik-daun-di-industri-kosmetik
/jasa-maklon-parfum-bali-terbaik-terlengkap
/dupe-parfum-nagita-slavina-tahan-lama
/cara-membuat-toner-dari-cuka-apel
/kuasai-pasar-skincare-2026-biotech
/pabrik-maklon-kosmetik-surabaya-terlengkap
/maklon-skincare-jakarta-brand-klinik-2026
/maklon-footcare-dreamlab
/hair-vitamin-lokal-indonesia-viral-di-korea
/jasa-maklon-kosmetik-bpom-panduan-lengkap
/perbedaan-privatelabel-vsodm
/pengganti-hydroquinone-flek-hitam-aman
/glycerin-bahan-skincare-yang-naik-daun-dan-cocok-untuk-semua-jenis-kulit
/solusi-bisnis-body-serum-aha-2025-tren-pasar-maklon-dreamlab
/maklon-body-wash-berkualitas-dan-bersertifikat-bpom
/rahasia-perawatan-rambut-keriting-tetap-sehat-lembut-dan-terdefinisi
/mudahnya-menjadi-owner-parfum-sendiri-ciptakan-brand-wewangian-eksklusif-tanpa-ribet
/reampreneur-beauty-academy-maklon-kosmetik
/state-of-beauty-2025-tren-kecantikan-pertumbuhan-industri-kosmetik-perubahan-pasar
/slug-maklon-kosmetik-indonesia-vs-china
/tren-sunscreen-2025-6-produk-yang-siap-jadi-bisnis
/maklon-brand-kosmetik-sendiri-100pcs-pemula
/maklon-kosmetik-serum-exosome-pdrn-dreamlab
/kosmetik-olahraga
/trend-body-care-2025-produk-viral-tiktok-shopee-dreamlab-maklon-kosmetik
/bangun-brand-skincare-lebih-strategis-dreamlab
/ai-data-cara-brand-kosmetik-baru-menemukan-formula-viral
/maklon-kosmetik-ibu-hamil
/peluang-feminim-care-dalam-bisnis-pasar-yang-menjanjikan
/berapa-moq-maklon-skincare-di-dreamlab-ini-fakta-penting-untuk-pebisnis-pemula
/omset-moisturizer-naik-tajam-dreamlab-bisnis-skincare
/strategi-tiktok-shop-campaign-gratis
/cara-buat-brand-dry-shampoo
/maklon-kosmetik-skincare-medan-dreamlab
/parfum-pheromone-bisnis-parfum
/maklon-parfum-custom-dreamlab
/maklon-skincare-batam
/tren-cleanical-beauty-produk-skincare-paling-dicari-tahun-2026
/jasa-maklon-sunscreen-terbaik
/cara-mulai-bisnis-skincare-dari-nol
/maklon-all-day-cream
/pabrik-maklon-parfum-bekasi
/maklon-parfum-jakarta
/bahan-aktif-untuk-mengatasi-jerawat
/jasa-maklon-sabun-mandi-batang
/pabrik-parfum-surabaya-biaya-2026
/maklon-parfum-bpom-indonesia-strategi-bisnis
/maklon-kosmetik-parfum-tangerang
/maklon-kosmetik-jakarta-dreamlab-2026
/rahasia-maklon-parfum-jakarta
/maklon-skincare-surabaya-umkm
/cara-bisnis-skincare-dari-nol
/pabrik-parfum-makasar
/tren-parfum-arab-bisnis-maklon-dreamlab
/prediksi-tren-2026
/maklon-scalp-haircare-bisnis-produk-rambut-sehat
/tips-sukses-bisnis-parfum
/maklon-skincare-untuk-brand-baru
```
</details>

---

## 3. MEDIUM: Fixable Issues

### 3a. Garbled Title — `/about-us/alur-maklon/`

| Field | Value |
|-------|-------|
| Current meta_title | `DREAMLAB | Proses Maklon Kosmetik & Skincare LengkapScrolling Banner #fe8c01 - Viga Font` |
| Problem | WordPress scraping artifact — "Scrolling Banner #fe8c01 - Viga Font" appended |
| Suggested fix | `DREAMLAB | Proses Maklon Kosmetik & Skincare Lengkap` |

### 3b. Typo — `/maklon-haircare/`

| Field | Value |
|-------|-------|
| Current title | `Maklin Haircare terbaik` |
| Problem | "Maklin" should be "Maklon" |
| Suggested fix | `Jasa Maklon Haircare Terbaik BPOM & Halal` |

---

## 4. LOW: Truncated Titles

| Slug | Current Title | Length |
|------|--------------|--------|
| `/thankyou-page/` | `Thankyou Page - Dreamlab` | 22 chars |
| `/maklon-haircare/` | `Maklin Haircare terbaik` | 22 chars |

---

## 5. INFO: Titles Missing Brand Name (115)

**Context:** 115 entries lack "Dreamlab" or "DREAMLAB" in the title tag. This is **expected and acceptable** for:
- **Category pages** (e.g. `/category/tips-trick/`, `/category/maklon-skincare/`) — these benefit from keyword-focused titles
- **Informational articles** (e.g. `/perbedaan-oem-vs-odm/`, `/cara-menentukan-harga-jual-produk-kosmetik/`) — recipe-style content
- **Author pages** — WordPress author archives

**Recommendation:** Add brand suffix (`| Dreamlab`) to transactional/location pages (e.g. `/pabrik-parfum-surabaya/`, `/maklon-kosmetik-tangerang/`) where local SEO and brand trust are important. No action needed for informational articles.

---

## 6. PASS: Canonical URLs

All 224 CSV entries have canonical URLs matching their source URLs. ✅

## 7. PASS: Meta Descriptions

No truncated or missing meta descriptions found. All entries have descriptions longer than 60 characters. ✅

---

## 8. Action Items

| Priority | Action | Slugs Affected | Effort |
|----------|--------|---------------|--------|
| 🔴 HIGH | Add SEO metadata to 70 articles in CSV | 70 article slugs | Large |
| 🟡 MEDIUM | Fix garbled title (/about-us/alur-maklon/) | 1 | Small |
| 🟡 MEDIUM | Fix typo in /maklon-haircare/ title | 1 | Small |
| 🟢 LOW | Update short titles (< 30 chars) | 2 | Small |
| ℹ️ INFO | Add brand suffix to location pages | ~20 priority slugs | Medium |

---

## 9. Next.js Site Behavior Summary

For reference, when a slug is NOT in the CSV:
1. `getSEOData(slug)` returns `undefined`
2. `generateMetadata()` uses `article.title` for `<title>` and `article.excerpt` for `description`
3. Canonical is auto-generated as `https://dreamlab.id{slug}` with trailing slash enforced
4. The page still renders correctly via `[...slug]/page.tsx`

This means the 70 missing-article pages are NOT broken — they just lack SEO-optimized title/description strings.
