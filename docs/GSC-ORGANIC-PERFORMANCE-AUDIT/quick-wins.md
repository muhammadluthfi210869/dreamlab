# QUICK WINS — 20 Langkah Cepat (Nilai Tinggi / Usaha Rendah)
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
