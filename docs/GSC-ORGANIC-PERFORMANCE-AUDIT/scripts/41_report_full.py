"""Report generator: full-analysis.md"""
import json, os, pandas as pd

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPORT_ROOT = os.path.dirname(SCRIPT_DIR)
OUT = os.path.join(REPORT_ROOT, "exports")
ins = json.load(open(os.path.join(OUT, "insights.json"), encoding="utf-8"))
dash = json.load(open(os.path.join(OUT, "dashboard.json"), encoding="utf-8"))

def clean(u): return u.replace("https://dreamlab.id","").replace("https://www.dreamlab.id","")
def md_table(records, cols, labels, max_rows=None):
    rows = records[:max_rows] if max_rows else records
    if not rows: return "_No data_"
    head = "| " + " | ".join(labels) + " |"
    sep = "|" + "---|" * len(labels)
    lines = [head, sep]
    for r in rows:
        cells = []
        for c in cols:
            v = str(r.get(c, ""))
            if c in ("url","page"): v = clean(v)
            if len(v) > 60: v = v[:59] + "…"
            cells.append(v)
        lines.append("| " + " | ".join(cells) + " |")
    return "\n".join(lines)

dev = dash["device"]
devtbl = "| Device | Clicks | Impressions | CTR % | Avg Pos |\n|---|---|---|---|---|\n"
for d in dev:
    devtbl += f"| {d['device']} | {d['clicks']} | {d['impressions']} | {round(d['ctr'],2)} | {d['position']} |\n"

cnt = dash["country_top"]
cnttbl = "| Negara | Clicks | Impressions | CTR % | Avg Pos |\n|---|---|---|---|---|\n"
for c in cnt[:10]:
    cnttbl += f"| {c['country'].upper()} | {c['clicks']} | {c['impressions']} | {round(c['ctr'],2)} | {c['position']} |\n"

cann = pd.read_csv(os.path.join(OUT, "cannibalization.csv"))
qp = pd.read_csv(os.path.join(OUT, "query-performance.csv"))

doc = f"""# FULL ANALYSIS — Organic Performance Intelligence Audit
## dreamlab.id | Google Search Console | 31 Mar 2025 – 28 Jul 2026

---

## A. SITE PERFORMANCE

### A.1 Overview 16 Bulan
| Metrik | Total |
|---|---|
| Clicks | 8.885 |
| Impressions | 360.457 |
| CTR | 2.46% |
| Average Position | 8.8 |
| Distinct Queries (16m) | 4.519 |
| Distinct Pages (16m) | 965 |

### A.2 Perbandingan Windows
| Window | Clicks | Impressions | CTR % | Avg Pos |
|---|---|---|---|---|
| Last 90d (3 Mei–28 Jul) | 2.760 | 131.656 | 2.10 | 8.5 |
| Prev 90d (2 Feb–2 Mei) | 2.160 | 103.887 | 2.08 | 7.5 |
| Δ 90d | **+600 (+27.8%)** | +27.769 | +0.02pp | −1.0 |
| Last 30d (29 Jun–28 Jul) | 837 | 45.857 | 1.83 | 8.5 |
| Prev 30d (30 Mei–28 Jun) | 947 | 44.860 | 2.11 | 8.9 |
| Δ 30d | **−110 (−11.6%)** | +997 | −0.28pp | +0.4 |

> **Interpretasi:** Tren 90-hari positif, tetapi tren 30-hari negatif — penurunan terjadi di bulan Juli. Impressions tetap tinggi sementara CTR jatuh → masalah relevansi/perolehan klik, bukan kehilangan visibilitas.

### A.3 Tren Bulanan (Month-over-Month)
{dash["monthly"] and md_table(dash["monthly"], ["ym","clicks","impressions","ctr","avg_position"], ["Bulan","Clicks","Impressions","CTR%","Avg Pos"])}

---

## B. DETEKSI DAMPAK REDESIGN / PERUBAHAN BESAR

**Deteksi otomatis penurunan mingguan signifikan (baseline ≥ 60 klik/minggu, drop > 25%):**
- 22–28 Des 2025: −28.7% (musiman)
- 29 Des–4 Jan 2026: −36.9% (musiman)
- 12–18 Jan 2026: −47.6% (musiman berlanjut)
- 2–8 Feb 2026: −29.8%
- 16–22 Mar 2026: **−44.3%** (bersesuaian core update Maret 2026)
- 22–28 Jun 2026: **−27.4%** (periode migrasi WordPress→Next.js)
- 6–12 Jul 2026: **−40.0%** (pasca-deploy, masalah teknis)
- 27 Jul–2 Agu 2026: −60.5% (minggu parsial, berlanjut)

**Estimasi periode penurunan terparah:** **Juni–Juli 2026** bersamaan dengan cutover Next.js. Pemicu yang tercatat dalam audit teknis: robots.txt memblokir kategori produk, produk sub-page di-noindex, 46 halaman komersial tidak terindeks, dan pergeseran posisi query head-term.

**Folder yang paling terdampak:** `/instagram-cluster/` (−345 klik, −33%), `/service-category/` (−18, −26%).

---

## C. ANALISIS QUERY

### C.1 Query Teratas (16 bulan, berdasarkan clicks)
{md_table(pd.read_csv(os.path.join(OUT,"query-performance.csv")).sort_values("clicks_16m", ascending=False).head(25).to_dict("records"), ["query","clicks_16m","impressions_16m","ctr_c90_pct","position_c90","business_intent"], ["Query","Clicks 16m","Impressions","CTR%","Pos","Intent"])}

### C.2 Query Terbesar Kehilangan Klik (90d vs 90d sebelumnya)
{md_table(ins["query_biggest_losers"], ["query","clicks_c90","clicks_p90","clicks_delta","position_c90","business_intent"], ["Query","Klik 90d","Klik Prev","Δ","Pos","Intent"])}

**Pola:** Dominasi klaster Instagram (off-topic). Komersial yang turun: `maklon pkrt` (−9), `maklon parfum` (−6, pos 34!), `maklon parfum jakarta` (−5), `maklon parfum moq rendah` (−4).

### C.3 Query Terbesar Penambahan Klik
{md_table(ins["query_biggest_winners"], ["query","clicks_c90","clicks_p90","clicks_delta","position_c90","business_intent"], ["Query","Klik 90d","Klik Prev","Δ","Pos","Intent"])}

**Pola:** Brand queries tumbuh (dreamlab +69, dream lab +26, pt karya impian +9). Komersial tumbuh dari basis kecil: `maklon kosmetik surabaya` (+13, pos 10.2), `maklon reed diffuser` (+9), `maklon parfum surabaya` (+8), `maklon skincare surabaya` (+8, pos 5.2), `maklon deodorant` (+8).

### C.4 Query Hampir Masuk Top 3 (posisi 4–7)
{md_table(ins["query_top_opportunities"][:8] if False else pd.read_csv(os.path.join(OUT,"queries-near-top-3.csv")).sort_values("impressions_c90", ascending=False).head(15).to_dict("records"), ["query","impressions_c90","clicks_c90","position_c90","ctr_c90_pct","business_intent"], ["Query","Impressions","Klik","Pos","CTR%","Intent"])}

### C.5 Query Posisi 11–20 (perlu dorongan)
{md_table(pd.read_csv(os.path.join(OUT,"queries-position-11-20.csv")).sort_values("impressions_c90", ascending=False).head(15).to_dict("records"), ["query","impressions_c90","clicks_c90","position_c90","ctr_c90_pct","business_intent"], ["Query","Impressions","Klik","Pos","CTR%","Intent"])}

### C.6 Query Komersial (peluang konversi)
{md_table(ins["commercial_queries"], ["query","impressions_c90","clicks_c90","position_c90","ctr_c90_pct"], ["Query","Impressions","Klik","Pos","CTR%"])}

### C.7 Query High Impressions Low CTR
{md_table(pd.read_csv(os.path.join(OUT,"queries-high-impressions-low-ctr.csv")).sort_values("impressions_c90", ascending=False).head(15).to_dict("records"), ["query","impressions_c90","clicks_c90","ctr_c90_pct","position_c90","business_intent"], ["Query","Impressions","Klik","CTR%","Pos","Intent"])}

### C.8 Segmentasi Intent (16 bulan)
- **Brand queries:** 60 query, ±1.427 klik (16% dari total) — didominasi "dreamlab", "dream lab", "pt karya impian laboratoris".
- **Non-brand:** 4.459 query (98.7%).
- **Informational:** 847 query.
- **Commercial:** 770 query.
- **Local:** 313 query.
- **Comparison:** 119 query.
- **Pricing:** 73 query.

---

## D. ANALISIS HALAMAN

### D.1 Halaman Teratas
{md_table(pd.read_csv(os.path.join(OUT,"page-performance.csv")).sort_values("current_clicks", ascending=False).head(20).to_dict("records"), ["url","current_clicks","c90_impressions","current_ctr_pct","current_position","page_type","business_intent"], ["Halaman","Klik","Impressions","CTR%","Pos","Tipe","Intent"])}

### D.2 100 Besar Pemenang & Pecundang
- **Top 100 Winners:** `top-100-winners.csv` — didominasi homepage (+205), halaman handbody racikan (+95/+64), listicle pabrik skincare (+73).
- **Top 100 Losers:** `top-100-losers.csv` — didominasi halaman Instagram (−345), artikel tren lama, dan beberapa landing komersial yang jatuh ke 0 klik.

### D.3 Page Type Breakdown (jumlah & klik 90d)
| Page Type | Jumlah | Clicks 90d |
|---|---|---|
| article (knowledge) | ±450 | ±791 (root blog) |
| service_landing | ±70 | 499 |
| product | ±80 | 75 |
| company_or_service | ±25 | 99 |
| category | ±15 | 19 |

### D.4 Fragment URLs — Anomali
Terdeteksi halaman fragment (`#Daftar_5_Pabr`, `#Berapa_MOQ`) dengan impressions 500–1.100 tapi **0 klik**. Google tidak menampilkan fragment URL. Ini membuang impressions dan menandakan kebutuhan anchor/toc yang benar. Dikaitkan dengan 173 error "alternate proper canonical".

---

## E. ANALISIS DIREKTORI (90d vs 90d sebelumnya)
{md_table(dash["folders"], ["folder","clicks_c90","impressions_c90","clicks_p90","clicks_delta","ctr_c90","clicks_growth_pct"], ["Direktori","Klik 90d","Imp 90d","Klik Prev","Δ","CTR%","Growth%"])}

---

## F. ANALISIS DEVICE, NEGARA, SEARCH APPEARANCE

### F.1 Device
{devtbl}
> **Mobile-first wajib.** Desktop avg position 13.0 → di luar halaman 1. Optimasi desktop (crawl, schema, internal link) memiliki upside besar.

### F.2 Negara
{cnttbl}
> Indonesia = 98.4% klik. US punya 20.527 impressions tapi CTR 0.07% (query mismatch / traffic AI).

### F.3 Search Appearance
Tidak ada rich result signifikan (hanya AMP legacy: 14 klik, 1.681 impressions). **Peluang besar:** belum ada sitelinks/rich result/FAQ schema yang menangkap impression share.

---

## G. ANALISIS OPORTUNITAS INTERNAL

### G.1 Halaman High Impressions Low CTR (CTR Quick Wins)
{md_table(ins["ctr_quick_wins"], ["url","c90_impressions","current_clicks","current_ctr_pct","current_position"], ["Halaman","Impressions","Klik","CTR%","Pos"])}

### G.2 Halaman Hampir Top 3 (posisi 4–8, impressions ≥ 1.000)
{md_table(ins["near_top3_pages"], ["url","c90_impressions","current_clicks","current_position","current_ctr_pct"], ["Halaman","Impressions","Klik","Pos","CTR%"])}

### G.3 Kanibalisasi (786 query dengan 2+ halaman)
{md_table(cann.head(12).to_dict("records"), ["query","n_pages","clicks","impressions"], ["Query","Jml Halaman","Clicks","Impressions"])}

---

## H. SEARCH INTENT & BISNIS

### H.1 Money Pages Prioritas
{md_table(ins["money_pages"][:15], ["url","current_clicks","c90_impressions","current_ctr_pct","current_position","priority_score"], ["Halaman","Klik","Impressions","CTR%","Pos","Priority"])}

### H.2 Halaman Yang Perlu Diperbaiki Dulu
1. `/urutan-pabrik-skincare-terbaik-indonesia/` — 8.241 impressions, CTR 1.7%, pos 8.8 (potensi +272 klik)
2. `/cara-meracik-handbody-pemutih-alami/` — 21.162 impressions, CTR 0.45% (potensi +962 klik)
3. `/perbedaan-moisturizer-gel-vs-cream/` — 4.911 impressions, CTR 0.18% (potensi +236 klik)
4. `/jenis-alkohol-dalam-parfum/` — 5.060 impressions, CTR 0.84%
5. `/lulur-vs-hb-dosting/` — 2.186 impressions, CTR 0.62%
6. `/contoh-kalimat-iklan-kosmetik-unik/` — 3.887 impressions, CTR 0.44%
7. `/parfum-inspired-peluang-bisnis/` — 2.607 impressions, CTR 0.35%

### H.3 Halaman Untuk Diabaikan / Dimerger
- `/pabrik-parfum-makasar/`, `/maklon-kosmetik-parfum-tangerang/`, `/maklon-parfum-jakarta/` — landing tipis dengan 0 klik; merge/redirect ke hub yang lebih kuat.
- 223+ artikel low-demand (< 50 impressions) — biarkan sebagai supporting authority, jangan hapus massal.

---

## I. SEO HEALTH SUMMARY

| Aspek | Status | Bukti |
|---|---|---|
| CTR | 🔴 KRITIS | 1.76% (terendah 16 bulan) |
| Position | 🟡 MENURUN | 6.24 (Nov) → 8.48 (Jul); head-terms di pos 34–35 |
| Indexing | 🔴 KRITIS | 46 halaman komersial tidak terindeks; 3 kategori produk diblokir robots.txt |
| Kanibalisasi | 🟠 TINGGI | 786 query multi-halaman |
| Content Decay | 🟠 TINGGI | Instagram cluster −33%, artikel tren lama turun |
| Opportunity Clusters | 🟢 BESAR | handbody racikan, parfum inspired, brand queries |
| Rich Results | 🟠 KOSONG | Tidak ada schema-driven rich result |

---

## J. PRIORITY MATRIX

| ID | Isu | Impact Bisnis | Impact SEO | Kesulitan | Estimasi Waktu | Confidence | Prioritas |
|---|---|---|---|---|---|---|---|
| P0-1 | robots.txt memblokir 3 kategori produk | TINGGI | TINGGI | Rendah | 2 jam | 95% | **P0 KRITIS** |
| P0-2 | Produk sub-page noindex | TINGGI | TINGGI | Sedang | 1–2 hari | 90% | **P0 KRITIS** |
| P1-1 | CTR collapse (title/meta 20 halaman) | SANGAT TINGGI | TINGGI | Rendah | 3–5 hari | 85% | **P1 TINGGI** |
| P1-2 | Head-terms (maklon parfum/skincare) pos 34–35 | SANGAT TINGGI | TINGGI | Sedang | 4–8 minggu | 60% | **P1 TINGGI** |
| P1-3 | 46 halaman komersial tidak terindeks | TINGGI | TINGGI | Sedang | 1–2 minggu | 75% | **P1 TINGGI** |
| P2-1 | Sinkron sitemap dengan 410 | RENDAH | SEDANG | Rendah | 3 jam | 95% | P2 |
| P2-2 | Kanibalisasi (786 query) | SEDANG | SEDANG | Sedang | 2–3 minggu | 70% | P2 |
| P2-3 | Duplicate canonical thankyou pages | RENDAH-SEDANG | SEDANG | Rendah | 1 hari | 90% | P2 |
| P2-4 | Fragment URL impressions | RENDAH | SEDANG | Rendah | 2 hari | 85% | P2 |
| P3-1 | Desktop position 13 | SEDANG | SEDANG | Tinggi | 2–3 bulan | 50% | P3 |
| P3-2 | Backlink/authority building | SEDANG | SEDANG | Tinggi | 3+ bulan | 40% | P3 |

---

*Seluruh file data: `page-performance.csv`, `query-performance.csv`, `page-opportunities.csv`, `query-opportunities.csv`, `folder-performance.csv`, `directory-performance.csv`, `cannibalization.csv`, `monthly-trend.csv`, `daily-trend.csv`, `dashboard.json`.*
"""

with open(os.path.join(OUT, "..", "full-analysis.md"), "w", encoding="utf-8") as f:
    f.write(doc)
print("full-analysis.md written", len(doc), "chars")
