"""Report generator: recommendations.md + quick-wins.md + content-opportunities.md"""
import json, os, pandas as pd
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPORT_ROOT = os.path.dirname(SCRIPT_DIR)
OUT = os.path.join(REPORT_ROOT, "exports")
ins = json.load(open(os.path.join(OUT, "insights.json"), encoding="utf-8"))

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

# ---- Recommendations ----
rec = f"""# REKOMENDASI STRATEGIS — 90-Day Organic Lead Recovery Plan
## dreamlab.id | Baseline Audit 31 Jul 2026

**Filosofi:** Jangan kejar angka total clicks. Kejar **clicks komersial** (yang menghasilkan lead maklon). Prioritas = perbaiki apa yang sudah diindeks + memiliki impressions, sebelum membuat konten baru.

---

## 1. TOP 10 AKSI BERDAMPAK TERBESAR

| Peringkat | Aksi | Target | Dampak Klik | Estimasi ROI |
|---|---|---|---|---|
| 1 | **Fix robots.txt** (unblock /produk/babycare/, /decorative/, /footcare/) | Indexing produk | +50–200 klik komersial | 2 jam kerja → aset permanen |
| 2 | **Optimasi CTR 20 halaman impressions-tinggi** | CTR 0.5%→3–5% | **+1.500–2.500 klik/bln** | 3–5 hari → Rp 300–600 jt/bln |
| 3 | **Perbaiki head-terms** (maklon parfum pos 34, maklon skincare pos 35) | Top 10 | +100–300 klik komersial/bln | konten+internal link, 4–8 minggu |
| 4 | **Indekskan 46 halaman komersial** yang crawled-not-indexed | Indexing | +50–150 klik komersial | enrich konten + request indexing |
| 5 | **Internal linking ke money pages** dari 20 artikel authority | Otoritas komersial | compounding | mingguan, murah |
| 6 | **Perbaiki kanibalisasi** 786 query | Rank consolidation | +10–30% CTR head-terms | 2–3 minggu |
| 7 | **Title/meta untuk 66 halaman impressions-0 klik** | Zero-click → klik | +200–500 klik | 5 hari |
| 8 | **Sinkronkan sitemap** dengan 410 patterns | Crawl budget | indirect | 3 jam |
| 9 | **Konten klaster handbody racikan & parfum inspired** (permintaan terbukti) | New traffic | +200–400 klik/bln | 2–4 minggu konten |
| 10 | **Optimasi mobile & speed** (LCP < 2.5s, INP < 200ms) | Mobile pos 6.7→4 | +10–20% CTR | 1–2 minggu dev |

---

## 2. AKSI YANG HARUS DIKERJAKAN MINGGU INI (Sprint 1)

### P0 — Teknis (hari 1–3)
1. **Unblock robots.txt** — hapus `Disallow: /produk/babycare/`, `/produk/decorative/`, `/produk/footcare/` dari `src/app/robots.ts`. Pertahankan `/produk/pkrt/` (410). Verifikasi live.
2. **Keputusan produk sub-page** — audite semua `/produk/*/*/`. Jika konten ≥ 500 kata unik → `index`. Jika tipis → `noindex` konsisten + canonical ke parent.
3. **Sinkron sitemap filter** dengan `GONE_PATTERNS` proxy.
4. **Request indexing** untuk halaman yang baru terindeks.

### P1 — CTR (hari 3–7)
Optimasi title (≤ 60 char) + meta description (≤ 155 char) untuk halaman berikut — **pakai pola: angka + benefit + BPOM/Halal/MOQ + kata kunci**:

{md_table(ins["ctr_quick_wins"], ["url","c90_impressions","current_clicks","current_ctr_pct","current_position"], ["Halaman","Impressions","Klik","CTR%","Pos"])}

**Contoh perbaikan title (pola):**
- `/cara-meracik-handbody-pemutih-alami/` → `"Resep Handbody Pemutih Alami Racikan Sendiri (Terbukti Cepat) — Cara, Bahan, Takaran"` — 21.162 impressions, CTR 0.45% → target 4%.
- `/perbedaan-moisturizer-gel-vs-cream/` → `"Perbedaan Moisturizer Gel vs Cream: Kandungan, Tekstur & Mana untuk Kulitmu?"` — CTR 0.18% → target 4%.
- `/jenis-alkohol-dalam-parfum/` → `"Jenis Alkohol dalam Parfum (Ethanol, SD Alcohol, Denat): Fungsi & Perbedaan"` — CTR 0.84% → target 5%.

---

## 3. AKSI 30 HARI (Sprint 2) — Konten & Internal Linking

### 3.1 Internal Linking — 20 Artikel Authority → Money Pages
Artikel dengan impressions & otoritas tertinggi harus menautkan ke money pages:

{md_table(ins["page_top_opportunities"][:12], ["url","c90_impressions","current_position","page_type"], ["Artikel Authority","Impressions","Pos","Tipe"])}

**Money pages yang harus menerima link:** `/`, `/pabrik-maklon-kosmetik-surabaya-terlengkap/`, `/pabrik-parfum-surabaya/`, `/contact-us/`, `/produk/` hub, halaman layanan `/maklon/`, `/pkrt/`, `/parfum/`.

### 3.2 Perbaiki Kanibalisasi
786 query memiliki 2+ halaman. Prioritaskan yang berdampak komersial:

{md_table(pd.read_csv(os.path.join(OUT,"cannibalization.csv")).head(10).to_dict("records"), ["query","n_pages","clicks","impressions"], ["Query","Halaman","Clicks","Impressions"])}

Tindakan: tentukan satu canonical page per query, 301 halaman duplikat tipis, perkuat internal link ke pemenang.

### 3.3 Indekskan Halaman Komersial Tidak Terindeks
Enrich konten (min. 500 kata unik + data) lalu request indexing untuk: `perusahaan-maklon-kosmetik/`, `maklon-kosmetik-tangerang-terpercaya/`, `rekomendasi-maklon-kosmetik-terbaik-dreamlab/`, `bisnis-kosmetik-dari-nol/`.

---

## 4. AKSI 60–90 HARI (Sprint 3) — Pertumbuhan

### 4.1 Konten Baru (permintaan terbukti dari data)
Klaster dengan impressions & intent komersial kuat:
1. **Handbody racikan** (`cara membuat handbody racikan sendiri agar cepat putih` 1.788 imp; `hb racikan sendiri` 459 imp) — buat hub + 5 sub-topik, semua menautkan ke `/cara-meracik-handbody-pemutih-alami/` dan ke halaman maklon body care.
2. **Parfum inspired** (`apa itu inspired parfum` 460 imp, `parfum inspired adalah` 275 imp) — hub + perbandingan, menautkan ke `/parfum-inspired-peluang-bisnis/` dan `/jasa-maklon-parfum-moq-rendah/`.
3. **Local maklon** (Surabaya/Jakarta/Bandung/Bali + kategori) — halaman lokal dengan data spesifik.

### 4.2 Head-Term Recovery
- `maklon parfum` (pos 34) → rebuild `/parfum/` + `/produk/parfum/` hub, kumpulkan internal link dari 20+ artikel parfum, request indexing.
- `maklon skincare` (pos 35) → same untuk cluster skincare.
- Sertakan schema Service + FAQ + LocalBusiness, perkuat dengan konten asli (kapasitas, MOQ, BPOM, halal).

### 4.3 Otoritas & Backlink (Bulan 3+)
- Guest post / kolaborasi di blog industri kecantikan Indonesia.
- Digital PR: data riset "State of Beauty Indonesia" untuk dikutip media.
- Pastikan GBP (Google Business Profile) terhubung (60%+ local search akan punya AI Overview).

---

## 5. YANG TIDAK BOLEH DILAKUKAN

| Larangan | Alasan |
|---|---|
| Jangan hapus halaman Instagram sebelum pengganti siap | Masih 699 klik/bln |
| Jangan ubah struktur URL massal saat CTR fix berjalan | Risiko rangkaian, buang momentum |
| Jangan 100+ halaman programmatic baru sebelum existing terindeks | Menambah crawled-not-indexed |
| Jangan beli backlink massal | Risiko penalti manual |
| Jangan abaikan desktop | Menandakan masalah indexing struktural |
| Jangan ubah H1 massal di 200 artikel tanpa A/B | Risiko kehilangan relevansi |

---

## 6. PROYEKSI 90 HARI

| Metrik | Baseline (Jul) | Target 90 Hari | Optimis |
|---|---|---|---|
| Clicks/bulan | 751 | 1.200 | 1.800 |
| Clicks komersial/bulan | ±500 | 1.000 | 1.600 |
| CTR keseluruhan | 1.76% | 3.0% | 4.5% |
| Indexed pages | ±180 | 250 | 320 |
| Est. revenue organik/bulan | Rp 150–450 jt | Rp 500–900 jt | Rp 1–1.5 M |

**Key assumption:** lead rate 3% klik komersial, close rate 15%, AOV Rp 50–150 jt. Validasi dengan GA4 & CRM (NexERP) — integrasi sudah terpasang.

---

## 7. MONITORING & KPI MINGGUAN
1. Clicks komersial (filter query: maklon, pabrik, jasa, harga, moq)
2. CTR halaman top-20 impressions
3. Position head-terms (maklon parfum, maklon skincare, maklon kosmetik)
4. Indexing: Crawled-not-indexed + Blocked by robots.txt
5. Kanibalisasi count
6. Zero-click pages (% halaman tanpa klik)

---

*Dibuat otomatis dari data GSC 16 bulan. Perbarui mingguan via `10_collect_data.py`.*
"""

with open(os.path.join(OUT, "..", "recommendations.md"), "w", encoding="utf-8") as f:
    f.write(rec)
print("recommendations.md written", len(rec))

# ---- Quick wins ----
qw = f"""# QUICK WINS — 20 Langkah Cepat (Nilai Tinggi / Usaha Rendah)
## dreamlab.id | Prioritas berdasarkan data GSC 16 bulan

## 🟢 TINGKAT 1 — Teknis (hari 1–2, biaya hampir nol)

1. **Unblock robots.txt** untuk `/produk/babycare/`, `/produk/decorative/`, `/produk/footcare/` (2 jam).
2. **Hapus 5+ URL 410 dari sitemap** (sinkronkan `sitemap.ts` dengan `GONE_PATTERNS` proxy) (3 jam).
3. **Tambah canonical** ke thankyou page variants `/ads/thankyou/metaads/?source=...` (1 jam).
4. **Fix konflik robots `/page/2/`** — pastikan konsisten `noindex,follow` (30 menit).
5. **Request indexing** untuk 10 halaman komersial baru/terperbaiki via GSC URL Inspection.

## 🟡 TINGKAT 2 — CTR (hari 2–7)

**Formula title:** `[Kata Kunci] — [Benefit/angka] ([trust: BPOM/Halal/MOQ])`
**Formula meta:** `[jawaban langsung] + [USP] + [CTA konsultasi gratis]`

6. `/cara-meracik-handbody-pemutih-alami/` (21.162 imp, CTR 0.45%) → **title dengan "takaran & bahan"**
7. `/perbedaan-moisturizer-gel-vs-cream/` (4.911 imp, CTR 0.18%) → **judul bandingkan + "mana untuk kulitmu"**
8. `/jenis-alkohol-dalam-parfum/` (5.060 imp, CTR 0.84%) → **"Ethanol vs SD Alcohol vs Denat"**
9. `/contoh-kalimat-iklan-kosmetik-unik/` (3.887 imp, CTR 0.44%) → **"30+ contoh" + angka**
10. `/lulur-vs-hb-dosting/` (2.186 imp, CTR 0.62%) → **perbandingan langsung di title**
11. `/parfum-inspired-peluang-bisnis/` (2.607 imp, CTR 0.35%) → **"peluang bisnis parfum inspired 2026"**
12. `/urutan-pabrik-skincare-terbaik-indonesia/` (8.241 imp, CTR 1.7%) → **"urutan 5 pabrik + MOQ"**
13. `/pabrik-maklon-kosmetik-surabaya-terlengkap/` (2.806 imp, CTR 1.15%) → **tambah "BPOM Halal MOQ fleksibel"**
14. `/contact-us/` (2.553 imp, CTR 1.24%) → **"Konsultasi Gratis" + telepon/WhatsApp**

## 🟠 TINGKAT 3 — Internal linking & cleanup (minggu 1–2)

15. Tambahkan link dari 10 artikel authority → `/contact-us/` + money pages.
16. Redirect 3 landing tipis yang jatuh ke 0 klik (`/pabrik-parfum-makasar/`, `/maklon-kosmetik-parfum-tangerang/`) ke hub sejenis.
17. Tambahkan FAQ schema pada 10 halaman komersial (FAQPage JSON-LD).
18. Pastikan setiap product page punya Product schema dengan `offers`/`minOrderQuantity`.

## 🟢 TINGKAT 4 — Data & monitoring (minggu 1–2)

19. Setup dashboard mingguan (re-run `10_collect_data.py` + laporan).
20. Integrasikan GSC clicks komersial dengan GA4/CRM untuk mengukur lead-to-revenue.

---

## ESTIMASI DAMPAK
| Tingkat | Klik tambahan/bulan | Effort |
|---|---|---|
| Teknis | +50–200 | 1 hari |
| CTR | +1.000–2.500 | 3–5 hari |
| Internal link | +100–300 | mingguan |
| Total | **+1.200–3.000** | — |
"""

with open(os.path.join(OUT, "..", "quick-wins.md"), "w", encoding="utf-8") as f:
    f.write(qw)
print("quick-wins.md written", len(qw))

# ---- Content opportunities ----
co = f"""# CONTENT OPPORTUNITIES — Roadmap Konten Berbasis Data
## dreamlab.id | 16 bulan GSC signals

## 1. KLUSTER DENGAN PERMINTAAN TERBUKTI (prioritas tertinggi)

### 1.1 Klaster "Handbody Racikan / HB Dosting" (permintaan tinggi, CTR rendah → peluang besar)
| Query | Impressions 90d | Clicks | Posisi |
|---|---|---|---|
| cara membuat handbody racikan sendiri agar cepat putih | 1.788 | 6 | 8.0 |
| cara membuat handbody racikan dosis tinggi | 480 | 1 | 8.7 |
| hb racikan sendiri | 459 | 2 | 9.2 |
| cara membuat hb dosting | 355 | 7 | 5.7 |
| racikan handbody pemutih | 260 | 0 | 8.6 |

**Strategi:** 1 hub halaman (`/cara-meracik-handbody-pemutih-alami/`) + 5 sub-halaman (bahan, dosis, pemutih permanen, untuk kulit sensitif, VS produk jadi). Setiap halaman → CTA ke maklon body care. **Potensi: 400–600 clicks/bln.**

### 1.2 Klaster "Parfum Inspired" (komersial, belum dimonetisasi)
| Query | Impressions 90d | Posisi |
|---|---|---|
| apa itu inspired parfum | 460 | 9.6 |
| inspired parfum adalah | 302 | 8.8 |
| parfum inspired adalah | 275 | 7.0 |
| parfum-inspired-peluang-bisnis (halaman) | 2.607 | 7.8 |

**Strategi:** buat hub "parfum inspired untuk bisnis" → menautkan ke `/jasa-maklon-parfum-moq-rendah/`. **Potensi: 300–500 clicks/bln.**

### 1.3 Klaster Local Maklon (intent tertinggi, langsung komersial)
`maklon kosmetik surabaya` (pos 10.2), `pabrik kosmetik surabaya` (14.2), `pabrik skincare` (14.9), `maklon skincare surabaya` (5.2), `maklon kosmetik` (15.4).
→ Halaman lokal per kota dengan konten spesifik (alamat, kapasitas, sertifikat, MOQ, studi kasus). **Potensi: 500+ klik komersial/bln.**

## 2. KONTEN YANG PERLU DIREFRESH (Content Refresh — dekay terdeteksi)
{md_table(ins["content_decay"][:12], ["url","current_clicks","clicks_delta","current_ctr_pct","current_position"], ["Halaman","Klik 90d","Δ Klik","CTR%","Pos"])}

**Tindakan:** update tahun 2025→2026, tambah data baru, perbaiki title. Refresh data "industri kosmetik" query turun 76% karena freshnes — **update ke data 2026 segera.**

## 3. KONTEN BARU HIGH-VALUE (gap dari data query)
1. **"Biaya Maklon Kosmetik 2026"** — pricing content (`estimasi biaya maklon kosmetik` ada impressions, 0 klik).
2. **"Perbedaan OEM vs ODM vs Private Label"** — comparison (permintaan ada: `privatelabel vs odm`).
3. **"Syarat & Biaya BPOM Kosmetik 2026"** — regulatory guide.
4. **"Studi Kasus: Modal Awal Bisnis Skincare (Rp X)"** — lead magnet.
5. **"Maklon Kosmetik untuk Brand Tiktok Shop"** — integrasi tren.

## 4. FORMAT KONTEN YANG TERBUKTI
Dari halaman pemenang (`/cara-membuat-hb-dosting-sendiri/` +64 klik, `/tren-cleanical-beauty...` +29, `/cara-hitunghpp-produk-kosmeti/` +14):
- **Tutorial langkah-demi-langkah dengan takaran/angka** (rasio klik tinggi).
- **Listicle "urutan/daftar terbaik"** (perbandingan).
- **Kalkulator HPP/modal** (interaktif).
- **Tabel perbandingan** (moisturizer, alkohol, lulur).

## 5. KONTEN YANG TIDAK PERLU DIBUAT
- Konten acak di luar silo (misal "keranjang Instagram" baru) — buang crawl budget & topik.
- 300-word programmatic pages — sudah terbukti jadi crawled-not-indexed.
- Duplicate landing per kota tanpa konten unik — hanya jika ≥ 300 kata data spesifik.

---

## ROADMAP
| Fase | Fokus | Output |
|---|---|---|
| Bulan 1 | Refresh 10 artikel decaying + 20 title/meta | +800 klik |
| Bulan 2 | Klaster handbody & parfum inspired + local pages | +600 klik |
| Bulan 3 | Head-term recovery (maklon parfum/skincare) + authority | +600 klik |
"""

with open(os.path.join(OUT, "..", "content-opportunities.md"), "w", encoding="utf-8") as f:
    f.write(co)
print("content-opportunities.md written", len(co))
