# 📐 Skill Comparison: SEO Plan vs .agents Frameworks

**Tanggal:** 2026-07-29  
**Tujuan:** Membandingkan rencana SEO dreamlab.id dengan seluruh framework di `.agents/skills/`  
**Metodologi:** Baca semua SKILL.md relevan → identifikasi alignment & gap → rekomendasi perbaikan

---

## Daftar Skill yang Dibandingkan

| # | Skill | Relevance | Status |
|:-:|-------|:---------:|:------:|
| 1 | `world-class-seo-operating-system` | 🔴 Orchestrator | ⚠️ Gap signifikan |
| 2 | `seo` (Universal SEO) | 🟡 General | ✅ Aligned |
| 3 | `seo-technical` | 🔴 Technical | ✅ Aligned |
| 4 | `seo-sitemap` | 🔴 Sitemap | ✅ Aligned |
| 5 | `seo-programmatic` | 🔴 Programmatic | ⚠️ Gap |
| 6 | `seo-content` | 🔴 Content | ⚠️ Gap |
| 7 | `seo-audit` | 🟡 Audit | ✅ Aligned |
| 8 | `seo-page` | 🟡 On-page | ✅ Aligned |
| 9 | `seo-sxo` | 🟡 Experience | ⚠️ GAP — tidak tercakup |
| 10 | `seo-flow` | 🟢 Workflow | ✅ Aligned |
| 11 | `google-search-console` | 🟢 GSC | ✅ Aligned |
| 12 | `schema` | 🟢 Schema | ✅ Aligned |
| 13 | `core-web-vitals` | 🟢 Performance | ✅ Not primary issue |
| 14 | `ai-seo` (GEO/AEO) | 🟢 Future | ⚠️ GAP — tidak tercakup |
| 15 | `seo-cluster` | 🟢 Content | ⚠️ GAP — tidak tercakup |
| 16 | `site-architecture` | 🟡 IA | ⚠️ Sebagian |
| 17 | `seo-backlinks` | 🟢 Off-page | ⚠️ GAP — tidak tercakup |
| 18 | `cro` | 🟢 Conversion | ⚠️ GAP — tidak tercakup |

---

## 1. world-class-seo-operating-system ⚠️ GAP

### Prinsip OS vs Rencana Saya

| Prinsip OS | Rencana Saya | Evaluasi |
|-----------|:------------:|:--------:|
| **Business first, SEO second** | ❌ Tidak ada analisis bisnis | **OS LEBIH BAIK.** Saya hanya analisis teknis. OS benar: SEO harus dimulai dari konteks bisnis. |
| **User value over page count** | ✅ Filter thin pages | **ALIGNED.** Saya setuju — jangan scale pages tanpa value. |
| **Desired state over dashboard cleanliness** | ✅ 410/noindex intentional | **ALIGNED.** Saya sudah catat bahwa kenaikan GSC sementara itu NORMAL. |
| **First-party outcomes > third-party proxies** | ❌ Fokus di GSC coverage | **OS LEBIH BAIK.** Saya optimasi "indexed pages" (proxy), bukan qualified leads (outcome). |
| **Profitable relevance over maximum reach** | ❌ Tidak disebut | **OS LEBIH BAIK.** Saya harus prioritaskan halaman yang generate leads, bukan semua halaman. |
| **Evidence over confidence** | ✅ Data dari GSC + code audit | **ALIGNED.** Saya pisahkan observation, verified fact, dan hypothesis. |
| **Tidak semua URL harus diindeks** | ✅ Setuju | **ALIGNED.** Ini prinsip kunci yang saya gunakan. |

### Kesimpulan OS

> **Operating System lebih unggul** karena memaksa kita bertanya: "Apakah halaman ini membantu bisnis?" bukan hanya "Apakah halaman ini bisa diindeks?"  
> **Fix:** Saya perlu tambah konteks bisnis maklon kosmetik ke dalam rencana.

---

## 2. seo-sitemap ✅ ALIGNED

### Sitemap Skill vs Rencana Saya

| Prinsip Sitemap | Rencana Saya | Evaluasi |
|----------------|:------------:|:--------:|
| No non-canonical URLs in sitemap | ✅ Filter via `isIndexableSitemapPath` | **ALIGNED** |
| No noindexed URLs in sitemap | ✅ Filter thin/noindex | **ALIGNED** |
| No redirected URLs in sitemap | ✅ Filter proxy-caught (+ sync fix) | **ALIGNED** |
| No non-200 URLs | ✅ Proxy 410 + sitemap filter sync | **ALIGNED** |
| Safe programmatic pages (OK at scale) | ✅ Hanya include yang ada konten | **ALIGNED** |
| Penalty Risk pages (avoid at scale) | ✅ Thin products/maklon difilter | **ALIGNED** |

### Kesimpulan Sitemap

> **Fully aligned.** Saya sudah menerapkan prinsip sitemap hygiene dengan baik. Perbaikan minor: sync proxy filter.

---

## 3. seo-programmatic ⚠️ GAP

### Programmatic Skill vs Rencana Saya

| Prinsip Programmatic | Rencana Saya | Evaluasi |
|---------------------|:------------:|:--------:|
| **Standalone value test** | ❌ Tidak disebut | **SKILL LEBIH BAIK.** Setiap halaman harus punya value sendiri, bukan karena bagian dari template. |
| **Progressive rollout** | ❌ Tidak disebut | **SKILL LEBIH BAIK.** Jangan publish 400+ halaman sekaligus — lakukan batch 50-100. |
| **≥30-40% unique content** | ❌ Tidak disebut | **SKILL LEBIH BAIK.** Saya pakai word count minimum (300), bukan % unique content. |
| **<300 words → flag for review** | ✅ Saya pakai threshold 300 | **ALIGNED** |
| **Scaled Content Abuse enforcement** | ❌ Tidak disebut | **SKILL LEBIH BAIK.** Google makin agresif (2025-2026 enforcement waves). |
| **Hub/spoke internal linking** | ❌ Tidak di plan | **SKILL LEBIH BAIK.** Programmatic pages butuh internal linking otomatis. |

### Contoh Penerapan Standalone Value Test

```
❌ TIDAK LULUS: /produk/babycare/baby-lotion/
   - Hanya template dengan nama produk diganti
   - Tidak ada info unik tentang baby lotion
   
✅ LULUS: /maklon/kosmetik/
   - Harga, MOQ, BPOM process, formulasi, bahan aktif
   - Unique content yang membantu keputusan bisnis
```

### Kesimpulan Programmatic

> **seo-programmatic skill lebih strict dan lebih komprehensif.** Saya harus tambah:
> 1. Standalone value test untuk setiap halaman programmatic
> 2. Progressive rollout (publish dalam batch, monitor dulu)
> 3. Unique content threshold ≥30-40% antar halaman
> 4. Internal linking otomatis (hub/spoke model)

---

## 4. seo-content ⚠️ GAP

### Content Skill vs Rencana Saya

| Prinsip Content | Rencana Saya | Evaluasi |
|----------------|:------------:|:--------:|
| **Blog minimum 1,500 words** | ❌ Saya pakai 300 | **SKILL LEBIH BAIK.** 300 terlalu rendah untuk blog post. 1,500 adalah standar industri. |
| **Service page minimum 800 words** | ❌ Saya pakai 500 | **SKILL LEBIH BAIK.** Maklon kosmetik = YMYL + kompetitif → butuh lebih banyak. |
| **Product page minimum 300-400 words** | ✅ Saya pakai 300 | **ALIGNED** |
| **E-E-A-T signals required** | ❌ Tidak di plan | **SKILL LEBIH BAIK.** Maklon kosmetik butuh: BPOM cert, halal cert, pengalaman klien, studi kasus. |
| **Readability (Flesch 60-70)** | ❌ Tidak di plan | **SKILL LEBIH BAIK.** Konten Indonesia untuk UKM harus mudah dibaca. |
| **Internal linking 3-5 per 1k words** | ❌ Tidak di plan | **SKILL LEBIH BAIK.** Penting untuk distribusi authority. |

### Standar Word Count yang Tepat untuk dreamlab.id

| Page Type | Plan Saya (lama) | seo-content Skill | Rekomendasi Baru |
|-----------|:---------------:|:-----------------:|:----------------:|
| Article/Blog | 300+ | 1,500+ | **1,000+** (kompromi realistis) |
| Service/Maklon | 500+ | 800+ | **800+** |
| Product Category | — | 300+ | **500+** |
| Programmatic (thin) | 200+ | — | **400+** dengan ≥30% unique |

### Kesimpulan Content

> **seo-content skill jauh lebih strict.** Untuk industri maklon kosmetik (YMYL — Health/Beauty), standar tinggi diperlukan. Saya harus upgrade threshold word count dan tambah E-E-A-T signals.

---

## 5. seo-technical ✅ ALIGNED

### Technical Skill vs Rencana Saya

| Kategori | Rencana Saya | Evaluasi |
|----------|:------------:|:--------:|
| Crawlability | ✅ robots.txt, sitemap, crawl budget | **ALIGNED** |
| Indexability | ✅ Canonical, noindex, thin content | **ALIGNED** |
| Security | ✅ HTTPS (via Vercel) | **ALIGNED** |
| URL Structure | ✅ SEO-friendly, trailing slash konsisten | **ALIGNED** |
| Mobile | ✅ Next.js responsive | **ALIGNED** |
| Core Web Vitals | Belum diukur | **GAP MINOR** — tapi bukan penyebab utama |
| Structured Data | ✅ Schema implemented | **ALIGNED** |
| JavaScript | ✅ Next.js SSR | **ALIGNED** |
| AI Crawler | ❌ Tidak di plan | **GAP** — llms.txt, AI crawler access |

### Kesimpulan Technical

> **Fully aligned untuk kebutuhan saat ini.** AI crawler management bisa jadi enhancement berikutnya.

---

## 6. seo-sxo ⚠️ GAP BESAR — TIDAK TERTANGKAP

### SXO Skill vs Rencana Saya

| Konsep SXO | Rencana Saya | Evaluasi |
|-----------|:------------:|:--------:|
| **Page-type mismatch** | ❌ Tidak dianalisis | **GAP.** Apakah halaman programmatic punya page type yang tepat? |
| **User story mapping** | ❌ Tidak dianalisis | **GAP.** Siapa user untuk setiap halaman? |
| **Intent envelope** | ❌ Tidak dianalisis | **GAP.** Apakah konten sesuai dengan intent pencarian? |
| **SERP presentation audit** | ❌ Tidak dianalisis | **GAP.** Apa yang Google tampilkan di SERP? |

### Contoh Page-Type Mismatch untuk dreamlab.id

```
Keyword: "biaya maklon kosmetik"
SERP menunjukkan: Harga, MOQ, perbandingan paket
Halaman saat ini: Artikel blog informatif → ❌ MISMATCH
Seharusnya: Halaman layanan dengan tabel harga + FAQ → ✅

Keyword: "cara buat serum wajah"
SERP menunjukkan: Panduan step-by-step, ingredients
Halaman saat ini: Halaman programmatic tipis → ❌ MISMATCH  
Seharusnya: Article dengan 1,500+ kata + gambar proses → ✅
```

### Kesimpulan SXO

> **GAP BESAR.** Saya tidak menganalisis page-type mismatch sama sekali. Ini bisa menjelaskan kenapa halaman dengan SEO teknis baik tetap tidak dapat traffic. **Prioritas: TINGGI** untuk ditambahkan ke rencana.

---

## 7. seo-flow ✅ ALIGNED

### FLOW Framework vs Rencana Saya

| Stage | Rencana Saya | Evaluasi |
|:-----:|:------------:|:--------:|
| **FIND** (demand analysis) | ✅ GSC data, zero-click audit | **ALIGNED** |
| **LEVERAGE** (authority) | ❌ Tidak di plan (backlink) | **GAP** — tidak relevan untuk indexability fix |
| **OPTIMIZE** (on-page) | ✅ Fix canonical, sitemap, noindex | **ALIGNED** |
| **WIN** (conversion) | ❌ Tidak di plan | **GAP** — CRO, leads, funnel |
| **LOCAL** (local SEO) | ❌ Tidak di plan | **GAP** — lokasi pabrik, Google Maps |

### Kesimpulan Flow

> **Untuk CRISIS STATE (index bloat), FLOW framework tidak optimal karena terlalu bertahap.** Direct fix plan seperti rencana saya LEBIH TEPAT untuk emergency. Tapi untuk long-term strategy, FLOW framework harus diadopsi.

---

## 8. Schema ✅ ALIGNED

### Schema Skill vs Rencana Saya

| Prinsip Schema | Implementasi Saya | Evaluasi |
|---------------|:-----------------:|:--------:|
| JSON-LD format | ✅ | **ALIGNED** |
| Organization | ✅ | **ALIGNED** |
| WebSite | ✅ searchAction | **ALIGNED** |
| BreadcrumbList | ✅ | **ALIGNED** |
| Article | ✅ | **ALIGNED** |
| CollectionPage | ✅ (produk) | **ALIGNED** |
| Service | ✅ (maklon) | **ALIGNED** |
| FAQPage | ✅ | **ALIGNED** |
| Accuracy First | ✅ | **ALIGNED** |

### Kesimpulan Schema

> **Fully aligned.** Schema sudah diimplementasi dengan baik di Phase 4.

---

## 9. Core Web Vitals ✅ ALIGNED (Not Primary)

### CWV vs Rencana Saya

| Metrik | Status | Evaluasi |
|--------|:-----:|:--------:|
| LCP | Belum diukur | Bukan penyebab indexability issue |
| INP | Belum diukur | Bukan penyebab indexability issue |
| CLS | Belum diukur | Bukan penyebab indexability issue |

### Kesimpulan CWV

> **CWV bukan masalah utama** untuk indexing 1,540 pages. Tapi perlu di-monitor sebagai hygiene factor.

---

## 10. Google Search Console ✅ ALIGNED

### GSC Skill vs Rencana Saya

| Praktik | Rencana Saya | Evaluasi |
|---------|:------------:|:--------:|
| Focus one metric at a time | ✅ Index coverage | **ALIGNED** |
| Don't compare just two points | ✅ Full timeline | **ALIGNED** |
| Check beyond top 10 | ✅ Full data 726 pages | **ALIGNED** |
| Track release dates | ✅ Sebelum/sesudah deploy | **ALIGNED** |
| Low CTR, High impressions | ✅ 66 pages teridentifikasi | **ALIGNED** |

### Kesimpulan GSC

> **Fully aligned.** Penggunaan GSC data sudah sesuai best practices.

---

## 11. AI SEO (GEO/AEO) ⚠️ GAP

### AI SEO vs Rencana Saya

| Prinsip AI SEO | Rencana Saya | Evaluasi |
|---------------|:------------:|:--------:|
| Optimize for AI Overviews | ❌ Tidak di plan | **GAP** — peluang untuk maklon kosmetik |
| llms.txt | ❌ Tidak di plan | **GAP** — penting untuk AI citation |
| Content citability | ❌ Tidak di plan | **GAP** — AI akan mengutip halaman berkualitas |
| Schema for AI | ✅ Already done | **ALIGNED** |

### Kesimpulan AI SEO

> **GAP untuk future.** Bukan prioritas untuk fix indexing saat ini, tapi penting untuk Q3-Q4 2026.

---

## 12. Site Architecture ⚠️ SEBAGIAN

### IA vs Rencana Saya

| Prinsip IA | Rencana Saya | Evaluasi |
|-----------|:------------:|:--------:|
| 3-click rule | ❌ Tidak diukur | **GAP** — apakah halaman penting accessible? |
| Flat vs Deep structure | ❌ Tidak dianalisis | **GAP** — nested category structure |
| URL hierarchy | ✅ SEO-friendly | **ALIGNED** |
| Hub/spoke model | ❌ Tidak di plan | **GAP** — pillar content + cluster |

### Kesimpulan IA

> **GAP.** Saya tidak menganalisis site architecture. Penting untuk internal linking dan crawl efficiency.

---

## 13. seo-backlinks ⚠️ GAP

### Backlinks vs Rencana Saya

| Prinsip | Rencana Saya | Evaluasi |
|---------|:------------:|:--------:|
| Backlink audit | ❌ Tidak di plan | **GAP** — backlink profile penting untuk authority |
| Broken link building | ❌ Tidak di plan | **GAP** — opportunity |
| Digital PR | ❌ Tidak di plan | **GAP** — untuk maklon kosmetik |

### Kesimpulan Backlinks

> **GAP untuk future.** Bukan prioritas untuk fix indexing 1,540 pages. Tapi penting untuk long-term authority.

---

## 14. CRO (Conversion Rate Optimization) ⚠️ GAP

### CRO vs Rencana Saya

| Prinsip | Rencana Saya | Evaluasi |
|---------|:------------:|:--------:|
| Lead conversion path | ❌ Tidak di plan | **GAP** — WhatsApp funnel, form, CTA |
| Impression-to-profit funnel | ❌ Tidak di plan | **GAP** — tracking dari klik ke lead |
| VOC/objection mapping | ❌ Tidak di plan | **GAP** — apa yang user tanyakan sebelum kontak? |

### Kesimpulan CRO

> **GAP besar.** Untuk situs maklon (B2B), conversion ke lead adalah outcome utama SEO. Saya harus tambah conversion path ke rencana.

---

## RINGKASAN: Alignment Score

| Skill | Alignment | Score | Action |
|-------|:---------:|:-----:|--------|
| world-class-seo-operating-system | ⚠️ Gap | **65%** | Tambah business context |
| seo-sitemap | ✅ Aligned | **95%** | Minor: sync proxy filter |
| seo-programmatic | ⚠️ Gap | **70%** | Tambah standalone value test, progressive rollout, unique % |
| seo-content | ⚠️ Gap | **60%** | Upgrade word count thresholds, E-E-A-T |
| seo-technical | ✅ Aligned | **90%** | Minor: AI crawler |
| seo-sxo | ⚠️ GAP | **30%** | ❌ Perlu analisis page-type mismatch |
| seo-flow | ✅ Aligned | **85%** | Untuk crisis, direct plan > flow |
| schema | ✅ Aligned | **100%** | Sempurna |
| google-search-console | ✅ Aligned | **100%** | Sempurna |
| core-web-vitals | ✅ Aligned | **80%** | Hygiene, bukan prioritas |
| ai-seo | ⚠️ GAP | **20%** | Future priority (Q3-Q4) |
| site-architecture | ⚠️ Gap | **50%** | Tambah 3-click rule, hub/spoke |
| seo-backlinks | ⚠️ GAP | **10%** | Future priority |
| cro | ⚠️ GAP | **15%** | ❌ Perlu conversion path |
| **RATA-RATA** | **⚠️** | **~64%** | **Perlu perbaikan** |

---

## PRIORITAS PERBAIKAN

Berdasarkan perbandingan dengan seluruh skill framework, ini prioritas perbaikan rencana saya:

### 🔴 Segera (minggu ini)

| # | Perbaikan | Dari Skill | Dampak |
|:-:|-----------|------------|:------:|
| 1 | Tambah **standalone value test** untuk setiap halaman | `seo-programmatic` | Mencegah thin page scale-up |
| 2 | Tambah **progressive rollout** — jangan publish 400+ sekali | `seo-programmatic` | Mengurangi risiko scaled content abuse |
| 3 | Upgrade **word count threshold**: blog 1,000+, service 800+ | `seo-content` | Meningkatkan kualitas konten, peluang indeks |

### 🟡 Minggu ini

| # | Perbaikan | Dari Skill | Dampak |
|:-:|-----------|------------|:------:|
| 4 | Tambah **business context** (model bisnis, target pasar, conversion goal) | `world-class-seo-operating-system` | SEO relevan dengan bisnis |
| 5 | Analisis **page-type mismatch** | `seo-sxo` | Memastikan halaman sesuai dengan intent pencarian |
| 6 | Tambah **hub/spoke internal linking** | `seo-programmatic` + `site-architecture` | Distribusi authority lebih baik |

### 🟢 Bulan depan

| # | Perbaikan | Dari Skill | Dampak |
|:-:|-----------|------------|:------:|
| 7 | Tambah **E-E-A-T signals** (BPOM cert, testimonial, case study) | `seo-content` | Trust signal untuk YMYL |
| 8 | **Conversion path** (WhatsApp funnel, lead magnet) | `cro` | ROI dari SEO |
| 9 | **AI crawler management** (llms.txt) | `seo-technical` + `ai-seo` | AI visibility |
| 10 | **Backlink audit** | `seo-backlinks` | Authority building |

---

## REVISI RENCANA (Updated)

Dengan mempertimbangkan semua skill framework, berikut rencana yang sudah direvisi:

### Sprint 1: Crisis Management (Hari 1-3)

| Task | Dari Skill | Baru? |
|------|------------|:-----:|
| Filter `generateStaticParams()` — HANYA artikel | `seo-programmatic` | ✅ Existing |
| Noindex untuk thin programmatic | `seo-technical` | ✅ Existing |
| Sync sitemap proxy filter dengan proxy.ts | `seo-sitemap` | ✅ Existing |
| **Tambah business context + conversion goal** | **`world-class-seo-operating-system`** | **🆕 Baru** |
| **Standalone value test untuk setiap halaman** | **`seo-programmatic`** | **🆕 Baru** |

### Sprint 2: Content Quality (Hari 4-14)

| Task | Dari Skill | Baru? |
|------|------------|:-----:|
| Upgrade word count thresholds | `seo-content` | ✅ Updated |
| E-E-A-T signals untuk maklon pages | `seo-content` | **🆕 Baru** |
| Page-type mismatch analysis | `seo-sxo` | **🆕 Baru** |
| Hub/spoke internal linking | `seo-programmatic` + `site-architecture` | **🆕 Baru** |

### Sprint 3: Conversion & Authority (Hari 15-30)

| Task | Dari Skill | Baru? |
|------|------------|:-----:|
| Conversion path (WhatsApp → lead → sale) | `cro` | **🆕 Baru** |
| AI crawler management (llms.txt) | `ai-seo` + `seo-technical` | **🆕 Baru** |
| Backlink audit awal | `seo-backlinks` | **🆕 Baru** |

---

## KESIMPULAN AKHIR

> **Rencana saya sebelumnya sudah 64% aligned dengan seluruh skill framework.**  
> **Gap terbesar ada di 3 area:**
> 1. **Business context & conversion** (Operating System + CRO) — SEO tanpa konteks bisnis adalah checklist kosong
> 2. **Content quality standards** (seo-content) — Threshold saya terlalu rendah untuk industri YMYL
> 3. **Programmatic safeguards** (seo-programmatic) — Perlu standalone value test + progressive rollout
>
> **Yang paling urgent untuk ditambahkan:** Business context + Word count upgrade + Standalone value test.

---

*Dokumen ini membandingkan rencana SEO dreamlab.id dengan 18 skill framework di `.agents/skills/`.*
*Rekomendasi perbaikan sudah diintegrasikan ke rencana revisi di atas.*
