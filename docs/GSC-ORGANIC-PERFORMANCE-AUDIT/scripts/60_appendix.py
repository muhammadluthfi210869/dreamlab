"""Appendix generator: single file with Top-20 tables + weekly automation + CTR rewrites."""
import json, os, pandas as pd
from datetime import datetime

OUT = r"C:\GAWE\Web Dev\Porto Aureon\CRAWL WEBSITE DREAMLAB\report\exports"
ins = json.load(open(os.path.join(OUT, "insights.json"), encoding="utf-8"))

def clean(u): return u.replace("https://dreamlab.id","").replace("https://www.dreamlab.id","")
def t(records, cols, labels, n=None, w=52):
    rows = records[:n] if n else records
    if not rows: return "_No data_"
    head = "| " + " | ".join(labels) + " |"
    sep = "|" + "---|" * len(labels)
    lines = [head, sep]
    for r in rows:
        cells = []
        for c in cols:
            v = str(r.get(c, ""))
            if c in ("url","page"): v = clean(v)
            if len(v) > w: v = v[:w-1] + "…"
            cells.append(v)
        lines.append("| " + " | ".join(cells) + " |")
    return "\n".join(lines)

pp = pd.read_csv(os.path.join(OUT, "page-performance.csv"))
for c in ["current_clicks","clicks_delta","current_ctr_pct","current_position","c90_impressions","potential_opportunity","priority_score"]:
    pp[c] = pd.to_numeric(pp[c], errors="coerce")
qp = pd.read_csv(os.path.join(OUT, "query-performance.csv"))
for c in ["clicks_c90","clicks_p90","clicks_delta","impressions_c90","position_c90","ctr_c90_pct","c30_clicks","p30_clicks"]:
    qp[c] = pd.to_numeric(qp[c], errors="coerce")

# ---- Table generators ----
t_losers = t(pp.sort_values("clicks_delta").head(20).to_dict("records"),
             ["url","current_clicks","clicks_delta","current_ctr_pct","current_position","page_type"], ["#","Halaman","Klik 90d","Δ Klik","CTR%","Pos","Tipe"], w=46)
t_losers = t_losers.replace("| /","| 1. /",1).replace("| /","| 2. /",1)

def numbered(records, cols, labels, n, w=50):
    rows = records[:n]
    head = "| # | " + " | ".join(labels) + " |"
    sep = "|---|" + "---|" * len(labels)
    lines = [head, sep]
    for i, r in enumerate(rows, 1):
        cells = [str(i)]
        for c in cols:
            v = str(r.get(c, ""))
            if c in ("url","page"): v = clean(v)
            if len(v) > w: v = v[:w-1] + "…"
            cells.append(v)
        lines.append("| " + " | ".join(cells) + " |")
    return "\n".join(lines)

losers = numbered(pp.sort_values("clicks_delta").head(20).to_dict("records"),
                  ["url","current_clicks","clicks_delta","current_ctr_pct","current_position"], ["Halaman","Klik 90d","Δ","CTR%","Pos"], 20, w=48)
winners = numbered(pp.sort_values("clicks_delta", ascending=False).head(20).to_dict("records"),
                   ["url","current_clicks","clicks_delta","current_ctr_pct","current_position"], ["Halaman","Klik 90d","Δ","CTR%","Pos"], 20, w=48)
money = numbered(pp[pp["money_page"]==True].sort_values("priority_score", ascending=False).head(20).to_dict("records"),
                 ["url","current_clicks","c90_impressions","current_ctr_pct","current_position","priority_score"], ["Halaman","Klik","Impressions","CTR%","Pos","Priority"], 20, w=48)
commercial = numbered(qp[qp["business_intent"]=="commercial"].sort_values("impressions_c90", ascending=False).head(20).to_dict("records"),
                      ["query","impressions_c90","clicks_c90","position_c90","ctr_c90_pct"], ["Query","Impressions","Klik","Pos","CTR%"], 20, w=50)
ctr_targets = numbered(pp[(pp["c90_impressions"]>=800)&(pp["current_ctr_pct"]<3)].sort_values(["potential_opportunity","c90_impressions"], ascending=False).head(20).to_dict("records"),
                       ["url","c90_impressions","current_clicks","current_ctr_pct","current_position","potential_opportunity"], ["Halaman","Impressions","Klik","CTR%","Pos","Potensi +klik"], 20, w=48)
refresh = numbered(pp.sort_values("clicks_delta").head(20).to_dict("records"),
                   ["url","current_clicks","clicks_delta","current_ctr_pct","current_position"], ["Halaman","Klik","Δ","CTR%","Pos"], 20, w=48)
linking = numbered(pp[(pp["page_type"]=="article")].sort_values("c90_impressions", ascending=False).head(20).to_dict("records"),
                   ["url","c90_impressions","current_clicks","current_position","business_intent"], ["Artikel Authority","Impressions","Klik","Pos","Intent"], 20, w=48)

# editorial tables
quick_wins_rows = [
    ("Unblock robots.txt: hapus Disallow /produk/babycare/, /decorative/, /footcare/", "Teknis", "1 jam", "Tinggi"),
    ("Hapus URL 410 dari sitemap (sinkron sitemap.ts dengan GONE_PATTERNS)", "Teknis", "2 jam", "Sedang"),
    ("Tambah canonical pada thankyou page variants (?source=...)", "Teknis", "1 jam", "Sedang"),
    ("Fix konflik robots /page/2/ (index vs noindex)", "Teknis", "30 mnt", "Sedang"),
    ("Request indexing 10 halaman komersial terbaru via URL Inspection", "Indexing", "1 jam", "Tinggi"),
    ("Tulis ulang title+meta /cara-meracik-handbody-pemutih-alami/ (21rb imp, CTR 0.45%)", "CTR", "30 mnt", "Sangat Tinggi"),
    ("Tulis ulang title+meta /perbedaan-moisturizer-gel-vs-cream/ (4.9rb imp, CTR 0.18%)", "CTR", "30 mnt", "Sangat Tinggi"),
    ("Tulis ulang title+meta /jenis-alkohol-dalam-parfum/ (5rb imp, CTR 0.84%)", "CTR", "30 mnt", "Sangat Tinggi"),
    ("Tulis ulang title+meta /contoh-kalimat-iklan-kosmetik-unik/ (3.9rb imp, CTR 0.44%)", "CTR", "30 mnt", "Tinggi"),
    ("Tulis ulang title+meta /lulur-vs-hb-dosting/ (2.2rb imp, CTR 0.62%)", "CTR", "30 mnt", "Tinggi"),
    ("Tulis ulang title+meta /parfum-inspired-peluang-bisnis/ (2.6rb imp, CTR 0.35%)", "CTR", "30 mnt", "Tinggi"),
    ("Tulis ulang title+meta /urutan-pabrik-skincare-terbaik-indonesia/ (8.2rb imp, CTR 1.7%)", "CTR", "30 mnt", "Tinggi"),
    ("Tulis ulang title+meta /pabrik-maklon-kosmetik-surabaya-terlengkap/ (2.8rb imp)", "CTR", "30 mnt", "Tinggi"),
    ("Tulis ulang title+meta /contact-us/ — tambah 'Konsultasi Gratis' + WhatsApp", "CTR", "30 mnt", "Tinggi"),
    ("Tambah FAQ schema (FAQPage JSON-LD) pada 10 halaman komersial", "Schema", "4 jam", "Sedang"),
    ("Tambahkan internal links dari 10 artikel authority ke /contact-us/ + money pages", "Linking", "2 jam", "Tinggi"),
    ("Redirect 3 landing tipis 0-klik ke hub sejenis (makasar, tangerang, jakarta)", "Cleanup", "1 jam", "Sedang"),
    ("Perbaiki fragment URL impressions (hapus dari sitemap, perbaiki TOC)", "Teknis", "2 jam", "Sedang"),
    ("Tambah Product schema + minOrderQuantity di semua product pages", "Schema", "3 jam", "Sedang"),
    ("Setup dashboard mingguan (Task Scheduler + run-weekly-audit.ps1)", "Ops", "1 jam", "Tinggi"),
]
qw_tbl = "| # | Aksi | Kategori | Effort | Dampak |\n|---|" + "---|"*4 + "\n"
for i, (a, k, e, d) in enumerate(quick_wins_rows, 1):
    qw_tbl += f"| {i} | {a} | {k} | {e} | {d} |\n"

roi_rows = [
    ("Fix robots.txt + unblock 3 kategori produk", "Tinggi", "2 jam", "Minggu 1", "+50-200 klik komersial"),
    ("Optimasi CTR 20 halaman impressions-tinggi", "Sangat Tinggi", "3-5 hari", "Minggu 1-2", "+1.500-2.500 klik/bln"),
    ("Recovery head-term maklon parfum (pos 34)", "Sangat Tinggi", "4-8 minggu", "Bulan 1-2", "+100-300 klik komersial"),
    ("Recovery head-term maklon skincare (pos 35)", "Sangat Tinggi", "4-8 minggu", "Bulan 1-2", "+100-300 klik komersial"),
    ("Indekskan 46 halaman komersial crawled-not-indexed", "Tinggi", "1-2 minggu", "Bulan 1", "+50-150 klik komersial"),
    ("Internal linking 20 artikel authority → money pages", "Tinggi", "mingguan", "Berkelanjutan", "Compounding"),
    ("Konsolidasi 786 query kanibalisasi (canonical + 301)", "Sedang", "2-3 minggu", "Bulan 1-2", "+10-30% CTR head-terms"),
    ("Rebuild halaman /parfum/ + /produk/parfum/ hub", "Tinggi", "1-2 minggu", "Bulan 1-2", "+30-80 klik"),
    ("Rebuild halaman /produk/skincare/ hub", "Tinggi", "1-2 minggu", "Bulan 1-2", "+30-80 klik"),
    ("Konten klaster handbody racikan (5 sub-halaman)", "Sedang", "2-3 minggu", "Bulan 2", "+200-400 klik"),
    ("Konten klaster parfum inspired (hub + sub)", "Sedang", "2 minggu", "Bulan 2", "+150-300 klik"),
    ("Halaman lokal per kota (Surabaya, Jakarta, Bali, Bandung)", "Sedang", "3-4 minggu", "Bulan 2-3", "+200-400 klik komersial"),
    ("Konten 'Biaya Maklon Kosmetik 2026' (pricing)", "Sedang", "1 minggu", "Bulan 1", "+50-150 klik komersial"),
    ("Refresh data industri kosmetik 2025 → 2026", "Sedang", "1 minggu", "Bulan 1", "Recovery -76% clicks"),
    ("Konten 'Syarat & Biaya BPOM 2026' (regulatory)", "Sedang", "1 minggu", "Bulan 1-2", "+50-100 klik"),
    ("Studi kasus modal awal bisnis skincare (lead magnet)", "Sedang", "1 minggu", "Bulan 1-2", "+30-80 lead"),
    ("Schema Service + FAQ + LocalBusiness pada money pages", "Sedang", "1 minggu", "Bulan 1", "+5-15% CTR"),
    ("Optimasi mobile Core Web Vitals (LCP, INP)", "Sedang", "1-2 minggu", "Bulan 1", "+10-20% CTR mobile"),
    ("Optimasi desktop position (crawl/index fix)", "Sedang", "1 bulan", "Bulan 2-3", "+30% desktop clicks"),
    ("Digital PR + backlink alami dari data riset industri", "Sedang", "3+ bulan", "Bulan 3+", "Otoritas jangka panjang"),
]
roi_tbl = "| # | Aksi | Dampak | Upaya | Timeline | Hasil |\n|---|" + "---|"*4 + "\n"
for i, (a, d, e, tm, h) in enumerate(roi_rows, 1):
    roi_tbl += f"| {i} | {a} | {d} | {e} | {tm} | {h} |\n"

risks_rows = [
    ("robots.txt memblokir 3 kategori produk (babycare, decorative, footcare)", "KRITIS", "95%", "Unblock + verify 2-6 minggu"),
    ("Produk sub-page di-noindex tanpa strategi terdokumentasi", "KRITIS", "90%", "Keputusan bisnis + audit konten"),
    ("46 halaman komersial crawled-not-indexed", "TINGGI", "85%", "Enrich konten + request indexing"),
    ("786 query mengalami kanibalisasi (2+ halaman)", "TINGGI", "70%", "Canonical + 301 + internal link"),
    ("Sitemap berisi URL 410 / redirect", "TINGGI", "95%", "Sinkron sitemap.ts dengan GONE_PATTERNS"),
    ("Head-terms maklon parfum & skincare jatuh ke pos 34-35", "TINGGI", "60%", "Rebuild hub + internal link"),
    ("Fragment URL (#heading) tercatat sebagai impressions 0-klik", "SEDANG", "85%", "Hapus dari sitemap + perbaiki TOC"),
    ("Duplicate canonical pada thankyou pages (?source=)", "SEDANG", "90%", "Tambah canonical tag"),
    ("Konflik robots meta pada /page/2/ (index vs noindex)", "SEDANG", "70%", "Seragamkan noindex,follow"),
    ("Desktop avg position 13 (di luar halaman 1)", "SEDANG", "50%", "Perbaikan crawl/index + linking"),
    ("Schema rich result kosong (tidak ada sitelinks/FAQ)", "SEDANG", "60%", "Implementasi schema bertingkat"),
    ("223+ artikel low-demand (1-49 impressions) tanpa arah", "RENDAH", "80%", "Audit nilai + internal link atau noindex"),
    ("Zero-click pages ±70% dari total terindeks", "SEDANG", "75%", "CTR title/meta program"),
    ("www vs non-www redirect (307) membuat 4 varian URL", "RENDAH", "100%", "Verifikasi 301 permanen"),
    ("Trailing slash redirect (308) Vercel default", "RENDAH", "100%", "Monitor saja"),
    ("Legacy WordPress debris (404/410 .php, /feed/)", "RENDAH", "100%", "Monitor recrawl"),
    ("US impressions 20.527 dengan CTR 0.07% (query mismatch)", "RENDAH", "60%", "Cek query internasional / AI traffic"),
    ("Ketergantungan traffic pada 1 halaman off-topic (Instagram)", "TINGGI", "80%", "Ganti dengan konten komersial"),
    ("Tidak ada strategi content kalender berdasar data query", "SEDANG", "70%", "Gunakan query-opportunities.csv"),
    ("Tidak ada monitoring KPI mingguan", "SEDANG", "90%", "Aktifkan run-weekly-audit.ps1"),
]
risk_tbl = "| # | Risiko | Severitas | Confidence | Aksi |\n|---|" + "---|"*3 + "\n"
for i, (a, s, c, x) in enumerate(risks_rows, 1):
    risk_tbl += f"| {i} | {a} | {s} | {c} | {x} |\n"

strat_rows = [
    ("Kejar clicks komersial, bukan total clicks", "P0", "Bulan 1"),
    ("Fix indexing P0 dulu sebelum konten baru (robots.txt + noindex)", "P0", "Minggu 1"),
    ("CTR program 20 halaman = ROI tercepat (+3.000 klik/bln)", "P1", "Minggu 1-2"),
    ("Bangun internal linking silo komersial (hub & spoke)", "P1", "Berkelanjutan"),
    ("Recovery head-terms maklon parfum & skincare", "P1", "Bulan 1-2"),
    ("Indekskan halaman komersial yang belum terindeks", "P1", "Bulan 1"),
    ("Konsolidasi kanibalisasi (786 query)", "P2", "Bulan 1-2"),
    ("Refresh konten decaying (data 2026)", "P2", "Bulan 1"),
    ("Konten klaster dengan permintaan terbukti (handbody, parfum inspired, local)", "P2", "Bulan 2"),
    ("Pricing & regulatory konten (biaya maklon, BPOM)", "P2", "Bulan 1-2"),
    ("Perluas desktop visibility melalui indexing fix", "P2", "Bulan 2-3"),
    ("Monitor AI Overviews / zero-click (impressions vs clicks gap)", "P2", "Mingguan"),
    ("Bangun otoritas via riset data + digital PR", "P3", "Bulan 3+"),
    ("Kurangi ketergantungan halaman off-topic", "P3", "Bulan 2-3"),
    ("A/B test title di halaman impressions terbesar", "P3", "Bulan 2"),
    ("Integrasikan GSC + GA4 + CRM untuk atribusi lead", "P3", "Bulan 1-2"),
    ("Weekly KPI dashboard otomatis", "P3", "Minggu 1"),
    ("Audit konten programmatic tipis", "P3", "Bulan 2"),
    ("Build local presence (GBP) untuk maklon Surabaya", "P3", "Bulan 2-3"),
    ("Quarterly full re-audit", "P3", "Kuartalan"),
]
strat_tbl = "| # | Rekomendasi | Prioritas | Timeline |\n|---|" + "---|"*2 + "\n"
for i, (a, p, t2) in enumerate(strat_rows, 1):
    strat_tbl += f"| {i} | {a} | {p} | {t2} |\n"

# ---- CTR rewrites (hand-crafted) ----
ctr_rewrites = [
    ("/cara-meracik-handbody-pemutih-alami/", "Cara Meracik Handbody Pemutih Kulit Bahan Alami & Tips Bisnis",
     "Cara Meracik Handbody Pemutih Alami: 5 Resep + Takaran Bahan (Terbukti)",
     "Resep handbody racikan pemutih dengan takaran pasti: bahan, dosis, cara pakai. Cocok untuk bisnis skincare rumahan. Konsultasi maklon gratis di Dreamlab."),
    ("/urutan-pabrik-skincare-terbaik-indonesia/", "Urutan Pabrik Skincare Terbaik di Indonesia 2026 | Maklon No. 1",
     "Urutan 5 Pabrik Skincare Terbaik Indonesia 2026: MOQ, BPOM & Estimasi Biaya",
     "Urutan pabrik skincare terbaik Indonesia 2026 lengkap dengan MOQ, sertifikasi BPOM/CPKB & estimasi biaya. Bandingkan sebelum memilih jasa maklon."),
    ("/perbedaan-moisturizer-gel-vs-cream/", "Perbedaan moisturizer Gel vs Cream | Mana yang Lebih Cocok?",
     "Perbedaan Moisturizer Gel vs Cream: Kandungan, Tekstur & Pilih Mana?",
     "Gel atau cream untuk kulitmu? Simak perbedaan tekstur, kandungan, hasil akhir & rekomendasi jenis kulit pada panduan lengkap ini."),
    ("/jenis-alkohol-dalam-parfum/", "5 Jenis Alkohol yang Digunakan pada Parfum",
     "Jenis Alkohol dalam Parfum: Ethanol, SD Alcohol & Denat (Fungsi + Perbedaan)",
     "Kenali jenis alkohol yang dipakai dalam parfum — ethanol, SD alcohol, denatured — fungsi, konsentrasi & pengaruhnya pada ketahanan aroma."),
    ("/lulur-vs-hb-dosting/", "Perbedaan Lulur vs HB Dosting Mana Lebih Efektif",
     "Lulur vs HB Dosting: Mana Lebih Efektif untuk Kulit Putih?",
     "Lulur atau HB dosting untuk kulit cerah? Bandingkan cara kerja, hasil, kecepatan & efek samping sebelum Anda memilih produk."),
    ("/contoh-kalimat-iklan-kosmetik-unik/", "Kalimat Iklan Kosmetik Unik & Menarik – Contoh Copywriting",
     "30+ Contoh Kalimat Iklan Kosmetik yang Unik & Menjual (Copywriting 2026)",
     "Kumpulan contoh kalimat iklan kosmetik unik untuk skincare, parfum & makeup. Template siap pakai yang terbukti meningkatkan konversi."),
    ("/parfum-inspired-peluang-bisnis/", "5 Tren Parfum Inspired dan Peluang Bisnisny",
     "Bisnis Parfum Inspired 2026: Peluang, Modal Awal & Cara Maklon",
     "Peluang bisnis parfum inspired 2026: tren pasar, rincian modal, dan cara produksi maklon dengan MOQ fleksibel + BPOM Halal."),
    ("/pabrik-maklon-kosmetik-surabaya-terlengkap/", "Pabrik Maklon Kosmetik Surabaya Terlengkap",
     "Pabrik Maklon Kosmetik Surabaya Terlengkap: BPOM, Halal & MOQ Fleksibel",
     "Pabrik maklon kosmetik Surabaya terlengkap: formulasi custom, BPOM & Halal, MOQ fleksibel. Konsultasi gratis — wujudkan brand Anda."),
    ("/cara-membuat-hb-dosting-sendiri/", "Membuat HB Dosting BPOM Sendiri untuk Bisnis Pemula",
     "Cara Membuat HB Dosting Sendiri: Resep, Takaran & Syarat BPOM",
     "Panduan membuat HB dosting sendiri: resep, takaran bahan, cara pengemasan & syarat BPOM. Ideal untuk bisnis skincare pemula."),
    ("/contact-us/", "DREAMLAB | Jasa Maklon Kosmetik Surabaya Jawa Timur",
     "Hubungi Dreamlab — Konsultasi Maklon Kosmetik Gratis (WhatsApp)",
     "Konsultasi gratis maklon kosmetik, skincare & parfum. Dapatkan penawaran formulasi, MOQ & estimasi biaya dalam 1x24 jam."),
    ("/affiliate-kol-brand-skincare/", "Affiliate dan KOL untuk Brand skincare - Dreamlab",
     "Strategi Affiliate & KOL untuk Brand Skincare: Kriteria + Contoh",
     "Cara memilih affiliate & KOL untuk brand skincare: kriteria, komisi, kontrak & studi kasus. Bangun distribusi tanpa iklan mahal."),
    ("/cysteamine-alternatif-hydroquinone/", "Cysteamine Pengganti Hydroquinone hiperpigmentasi",
     "Cysteamine vs Hydroquinone: Alternatif Aman untuk Flek Hitam?",
     "Cysteamine sebagai alternatif hydroquinone: efektivitas, keamanan, perbandingan & rekomendasi pemakaian untuk mengatasi flek hitam."),
    ("/services/", "DREAMLAB | Maklon Skincare BPOM Untuk Brand Suksesmu",
     "Layanan Maklon Kosmetik: Skincare, Parfum, Body Care & PKRT (BPOM)",
     "Layanan maklon kosmetik lengkap dari formulasi sampai distribusi: skincare, parfum, body care, PKRT. BPOM & Halal, MOQ fleksibel."),
    ("/cara-membuka-offline-store-kosmetik-2026/", "Cara Sukses Membuka Offline Store Kosmetik 2026",
     "Cara Membuka Offline Store Kosmetik 2026: Modal, Lokasi & Strategi",
     "Panduan buka toko kosmetik offline 2026: rincian modal, pilih lokasi, supplier maklon & strategi agar cepat balik modal."),
    ("/alat-pengencang-wajah/", "5 Alat Pengencang Wajah Yang Wajib Punya",
     "5 Alat Pengencang Wajah Terbaik 2026: Manfaat & Cara Pakai",
     "Rekomendasi alat pengencang wajah terbaik: ice roller, gua sha, LED mask & lainnya — manfaat, harga & cara pakai yang benar."),
    ("/pabrik-parfum-surabaya/", "Pabrik Parfum Surabaya terbaik Solusi Brand Parfum",
     "Pabrik Parfum Surabaya: Jasa Maklon Parfum BPOM, MOQ Mulai 1.000",
     "Pabrik parfum Surabaya untuk brand Anda: maklon parfum BPOM & Halal, formulasi custom, MOQ mulai 1.000 pcs. Konsultasi gratis."),
    ("/cara-hitunghpp-produk-kosmeti/", "Cara Hitung HPP Produk Kosmetik Agar Profit Maksimal",
     "Cara Hitung HPP Produk Kosmetik: Rumus + Contoh Angka (2026)",
     "Rumus & contoh menghitung HPP produk kosmetik: bahan, kemasan, jasa maklon & margin. Pastikan harga jual Anda profit maksimal."),
    ("/8-tren-kecantikan-2026-smart-formula/", "8 Tren Kecantikan 2026 Inovasi Smart Formula",
     "8 Tren Kecantikan 2026 & Inovasi Smart Formula (Data Industri)",
     "8 tren kecantikan 2026 yang diprediksi menguasai pasar: smart formula, bahan aktif & peluang bisnis maklon kosmetik."),
    ("/pabrik-parfum-jakarta/", "Pabrik Parfum Jakarta",
     "Pabrik Parfum Jakarta: Jasa Maklon Parfum BPOM Terpercaya",
     "Pabrik parfum Jakarta untuk brand Anda: formulasi custom, BPOM & Halal, MOQ fleksibel. Konsultasi gratis — mulai bisnis parfum sendiri."),
    ("/biaya-maklon-parfum-moq-kecil/", "Biaya Maklon Parfum MOQ Kecil",
     "Biaya Maklon Parfum MOQ Kecil: Simulasi Harga + Cara Hemat",
     "Rincian biaya maklon parfum dengan MOQ kecil: simulasi harga, komponen biaya & tips hemat untuk pemula. Konsultasi gratis di Dreamlab."),
]
def esc(v):
    return v.replace("|", "\\|").replace("\n", " ")
ctr_tbl = "| # | Halaman | CTR Sekarang | Title Saat Ini | Title Baru | Meta Description Baru |\n|---|" + "---|"*5 + "\n"
for i, (u, ct, nt, nm) in enumerate(ctr_rewrites, 1):
    ctr_tbl += f"| {i} | `{u}` | _lihat tabel 1.8_ | {esc(ct)} | **{esc(nt)}** | {esc(nm)} |\n"

gh_workflow = '''name: Weekly GSC Audit
on:
  schedule:
    - cron: "0 1 * * 1"   # Senin 01:00 UTC
  workflow_dispatch:
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.13"
      - run: pip install google-auth google-api-python-client pandas
      - name: Write credentials
        run: |
          mkdir -p scripts
          echo "${{ secrets.GSC_SERVICE_ACCOUNT_JSON }}" > scripts/gsc-credentials.json
      - run: |
          cd report/scripts
          python 10_collect_data.py && python 20_analysis_pages.py && python 21_analysis_queries.py && python 22_folders_dashboard.py && python 23_insights.py && python 40_report_exec.py && python 41_report_full.py && python 42_report_actions.py && python 50_final_exports.py
      - name: Upload reports
        uses: actions/upload-artifact@v4
        with:
          name: gsc-audit-${{ github.run_number }}
          path: report/exports/*.csv'''

doc = f"""# APPENDIX — TOP 20 SUMMARY • WEEKLY AUTOMATION • CTR REWRITES
**dreamlab.id** | Generated {datetime.now().strftime('%d %B %Y')} | Data: Google Search Console (16 bulan, 31 Mar 2025 → 28 Jul 2026)

> Dokumen ini = 1 file pendamping audit (`executive-summary.md`, `full-analysis.md`, `recommendations.md`, `quick-wins.md`, `content-opportunities.md`).
> Berisi 3 bagian: **(1)** Tabel ringkasan Top 20, **(2)** Wiring pipeline otomatis mingguan, **(3)** Draft title & meta rewrite untuk 20 halaman CTR tertinggi.

---

# PART 1 — TOP 20 SUMMARY TABLES

## 1.1 Top 20 Quick Wins (nilai tinggi / usaha rendah)

{qw_tbl}

## 1.2 Top 20 Highest ROI Actions

{roi_tbl}

## 1.3 Top 20 Biggest Traffic Losses (90d vs 90d sebelumnya)

{losers}

## 1.4 Top 20 Biggest Traffic Winners

{winners}

## 1.5 Top 20 Money Pages to Prioritize

{money}

## 1.6 Top 20 Commercial Keywords

{commercial}

## 1.7 Top 20 Pages Requiring Immediate Attention (CTR Opportunity)

{ctr_targets}

## 1.8 Top 20 CTR Improvement Targets
> Sama dengan 1.7 — kolom **"Potensi +klik"** adalah estimasi klik tambahan per 90 hari jika CTR dinaikkan ke benchmark posisi (top-3 ≈ 18%, 4–5 ≈ 10%, 6–10 ≈ 5%).

## 1.9 Top 20 Content Refresh Candidates (Content Decay)

{refresh}

## 1.10 Top 20 Internal Linking Sources (Artikel Authority → Money Pages)

{linking}

## 1.11 Top 20 Technical Risks

{risk_tbl}

## 1.12 Top 20 Strategic Recommendations

{strat_tbl}

---

# PART 2 — WEEKLY AUTOMATED PIPELINE

## 2.1 Yang dilakukan otomatis
Menjalankan ulang seluruh audit (pull GSC API 16 bulan + window 30/90 hari → analisis halaman/query/direktori → dashboard → 5 laporan markdown) lalu **mengarsip snapshot mingguan** agar riwayat tren terekam.

## 2.2 File pipeline
| File | Peran |
|---|---|
| `scripts/10_collect_data.py` | Pull data GSC API (16 bulan + c30/p30/c90/p90) |
| `scripts/20_analysis_pages.py` | Analisis halaman (759) + top-100 winners/losers + opportunities |
| `scripts/21_analysis_queries.py` | Analisis query (4.519) + 15 segment CSV |
| `scripts/22_folders_dashboard.py` | Direktori, tren bulanan/harian, deteksi redesign, kanibalisasi, dashboard.json |
| `scripts/23_insights.py` | Input data untuk laporan |
| `scripts/40–42_report_*.py` | Generate executive-summary, full-analysis, recommendations, quick-wins, content-opportunities |
| `scripts/50_final_exports.py` | Export dimensi + README |
| **`scripts/run-weekly-audit.ps1`** | **Runner utama (9 langkah + arsip snapshot)** |
| `scripts/run-weekly-audit.bat` | Double-click wrapper |

**Persyaratan:** Python 3.13 + `pip install google-auth google-api-python-client pandas` + file kredensial di `dreamlab-site/scripts/gsc-credentials.json`.

## 2.3 Setup Windows Task Scheduler (rekomendasi lokal)
1. Buka **Task Scheduler** → Create Basic Task → nama `Dreamlab-Weekly-GSC-Audit`.
2. Trigger: **Weekly**, pilih hari (mis. Senin 07:00).
3. Action: **Start a program**
   - Program/script: `powershell.exe`
   - Arguments: `-ExecutionPolicy Bypass -File "C:\GAWE\Web Dev\Porto Aureon\CRAWL WEBSITE DREAMLAB\report\scripts\run-weekly-audit.ps1"`
4. **Run whether user is logged on or not** (butuh kredensial Windows). Pastikan PC/Laptop menyala saat jadwal.
5. Cek hasil di `report\weekly-snapshots\<tanggal>\` dan `run-<tanggal>.log`.

> **Catatan:** Jika PC tidak selalu menyala, gunakan GitHub Actions (2.4) di server cloud, atau Vercel Cron + serverless script.

## 2.4 GitHub Actions (opsional, cloud — tidak butuh PC nyala)
Buat file `.github/workflows/weekly-gsc-audit.yml` di repo `dreamlab-site`:

```yaml
{gh_workflow}
```

**Langkah:** Settings → Secrets → New repository secret → `GSC_SERVICE_ACCOUNT_JSON` = isi isi file `gsc-credentials.json`. Artifact laporan bisa diunduh dari tab Actions setiap minggu.

## 2.5 Yang direview mingguan (≤ 15 menit)
1. `executive-summary.md` → angka kunci + perubahan CTR/posisi.
2. `dashboard.json` → perbandingan 30d vs 30d sebelumnya.
3. `monthly-trend.csv` → arah tren.
4. `page-opportunities.csv` → halaman baru yang layak optimasi CTR.
5. `query-performance.csv` filter `business_intent=commercial` → pergerakan kata kunci komersial.
6. Log `run-<tanggal>.log` → pastikan 9 langkah sukses (gagal biasanya kredensial/quota).

## 2.6 Monitoring KPI mingguan
| KPI | Target | Sumber |
|---|---|---|
| Clicks komersial/bulan | +10% MoM | query-performance.csv (commercial) |
| CTR keseluruhan | → 3.0% (dari 1.76%) | dashboard.json |
| Position maklon parfum | 34 → <10 | query-performance.csv |
| Position maklon skincare | 35 → <10 | query-performance.csv |
| Blocked by robots.txt | → 0 | GSC UI Coverage |
| Crawled-not-indexed (non-asset) | 46 → <20 | GSC UI Coverage |
| Zero-click pages | 70% → <50% | page-performance.csv |

---

# PART 3 — TITLE & META REWRITES (TOP 20 CTR PAGES)

## 3.1 Formula
- **Title (≤ 60 char):** `[Kata Kunci Utama] — [Benefit/angka] ([trust: BPOM/Halal/MOQ])`
- **Meta (≤ 155 char):** `[jawaban langsung] + [USP] + [CTA]`
- Aturan: 1 H1 per halaman, jangan exact-match keyword di meta (hindari over-optimization), gunakan angka & entitas.

## 3.2 Draft Rewrite (20 halaman)

{ctr_tbl}

## 3.3 Checklist implementasi
- [ ] Terapkan di CMS/Next.js (`seo-mapping.json` / data source of truth).
- [ ] Konfirmasi panjang title ≤ 60 & meta ≤ 155 karakter.
- [ ] Setelah deploy, **request indexing** via GSC untuk 10 halaman teratas.
- [ ] Ukur CTR di GSC setelah **14 hari**; iterasi jika CTR < 3%.
- [ ] Jangan ubah H1 tanpa A/B — mulai dari title/meta saja.

---

*Seluruh data pendukung: `page-performance.csv`, `query-performance.csv`, `page-opportunities.csv`, `query-opportunities.csv`, `folder-performance.csv`, `monthly-trend.csv`, `daily-trend.csv`, `dashboard.json`.*
"""

with open(os.path.join(OUT, "..", "APPENDIX-TOP20-AUTOMATION-CTR.md"), "w", encoding="utf-8") as f:
    f.write(doc)
print("APPENDIX written", len(doc), "chars")
