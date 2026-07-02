#!/usr/bin/env python3
import re

FILE = "/Users/revitayustianawati/dreamlab/worldql/dreamlab/src/data/articles.ts"

def escape_for_ts(s):
    """Escape a Python string for use as a TS/JS string literal (single line with \\n)."""
    s = s.replace("\\", "\\\\")
    s = s.replace('"', '\\"')
    s = s.replace("\n", "\\n")
    return s

def section(content):
    """Wrap content in paragraph tags if not already wrapped in a block-level tag."""
    c = content.strip()
    if c.startswith("<h") or c.startswith("<div") or c.startswith("<figure") or c.startswith("<nav") or c.startswith("<table") or c.startswith("<details") or c.startswith("<ul") or c.startswith("<ol") or c.startswith("<p") or c.startswith("<blockquote") or c.startswith("<img"):
        return c + "\n"
    return f"<p>{c}</p>\n"

# ============================================================
# BUILD HTML CONTENT (as a Python multi-line string)
# ============================================================

parts = []

# 1. Opening container div
parts.append('<div class="elementor-element elementor-element-4cdeffb8 elementor-widget elementor-widget-theme-post-content">')

# 2. Intro paragraphs
parts.append('<p>Kalau kamu cari <b>maklon kosmetik Jakarta skala besar</b>, yang perlu dipastikan pertama bukan lokasi pabriknya, tapi apakah kapasitas produksinya benar-benar teruji menangani volume tinggi tanpa kualitas turun di tengah jalan. Dreamlab maklon kosmetik beroperasi di pabrik aseptik bersertifikat CPKB Golongan A (No. CPKB/2023/18260-A) dan sudah mengembangkan 1.000+ produk untuk 150+ brand — bukti kapasitas bukan cuma klaim marketing.</p>')

parts.append('<p>Brand yang sudah punya traction dan siap scale up menghadapi tantangan yang berbeda dengan brand pemula. Kapasitas produksi, konsistensi kualitas, dan kecepatan fulfillment jadi faktor penentu. Artikel ini akan membahas secara detail kapasitas produksi Dreamlab, sistem quality control yang menjaga konsistensi formula di volume besar, dan mengapa brand skala enterprise memilih Dreamlab sebagai mitra produksi jangka panjang.</p>')

# 3. Table of Contents
parts.append('''<nav style="background:#f9f8f4;padding:20px 24px;border-radius:12px;margin:24px 0;border:1px solid #e8e3d8">
<p style="font-weight:600;margin:0 0 12px;color:#4a6fa5;font-size:0.95em">Daftar Isi</p>
<ol style="margin:0;padding-left:22px;color:#555;line-height:2">
<li><a href="#kenapa-brand-yang-sudah-berkembang" style="color:#4a6fa5">Kenapa Brand yang Sudah Berkembang Butuh Partner Maklon yang Berbeda</a></li>
<li><a href="#kapasitas-produksi-dreamlab" style="color:#4a6fa5">Kapasitas Produksi Dreamlab untuk Order Skala Besar</a></li>
<li><a href="#formula-tetap-konsisten" style="color:#4a6fa5">Formula Tetap Konsisten Meski Produksi Volume Besar</a></li>
<li><a href="#mengapa-memilih-dreamlab" style="color:#4a6fa5">Mengapa Memilih Dreamlab sebagai Tempat Produksi</a></li>
<li><a href="#faq-maklon-jakarta-skala-besar" style="color:#4a6fa5">FAQ</a></li>
</ol>
</nav>''')

# 4. First image (tengah)
parts.append('''<figure class="wp-block-image size-large" style="margin:40px 0">
  <a href="https://dreamlab.id/thankyou/google/">
    <img bv-data-src="/assets/images/blog/dreamlab_maklonkosmetik_artikel_tengah.png" decoding="async" src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%200%200%27%3E%3C/svg%3E" alt="Dreamlab Maklon Kosmetik" class="bv-tag-attr-replace bv-lazyload-tag-img" style="width:auto;height:auto">
  </a>
  <figcaption class="wp-element-caption">Konsultasi Gratis Sekarang</figcaption>
</figure>''')

# 5. H2: Kenapa Brand yang Sudah Berkembang Butuh Partner Maklon yang Berbeda
parts.append('<h2 id="kenapa-brand-yang-sudah-berkembang" style="font-size:1.5em;margin:40px 0 16px">Kenapa Brand yang Sudah Berkembang Butuh Partner Maklon yang Berbeda</h2>')

parts.append('<p>Kebutuhan brand baru dan brand yang sudah berjalan itu berbeda jauh. Kalau brand baru fokusnya di uji coba formula dan mencari product-market fit, brand yang sudah berkembang menghadapi masalah yang lebih operasional dan sistemik. Berikut empat masalah yang paling sering muncul saat brand scale up tanpa partner maklon yang tepat:</p>')

parts.append('''<div style="display:grid;gap:16px;margin:24px 0">
<div style="background:#f9f8f4;padding:18px 22px;border-radius:12px;border-left:4px solid #D98A00">
<p style="margin:0;font-weight:700;font-size:1.05em">Stok Sering Habis</p>
<p style="margin:8px 0 0;color:#555">Kapasitas produksi maklon kecil tidak bisa mengimbangi kecepatan penjualan. Brand akhirnya kehilangan revenue karena stok kosong di momen permintaan tinggi — dan konsumen beralih ke kompetitor.</p>
</div>
<div style="background:#f9f8f4;padding:18px 22px;border-radius:12px;border-left:4px solid #D98A00">
<p style="margin:0;font-weight:700;font-size:1.05em">Kualitas Antar Batch Tidak Konsisten</p>
<p style="margin:8px 0 0;color:#555">Produksi kecil yang dilakukan berulang kali tanpa sistem QC yang ketat sering menghasilkan variasi warna, tekstur, atau aroma antar batch. Konsumen yang setia akan langsung menyadari perbedaan ini.</p>
</div>
<div style="background:#f9f8f4;padding:18px 22px;border-radius:12px;border-left:4px solid #D98A00">
<p style="margin:0;font-weight:700;font-size:1.05em">Lead Time Makin Lama</p>
<p style="margin:8px 0 0;color:#555">Semakin banyak produk yang terjual, semakin sering produksi ulang harus dilakukan. Maklon skala kecil tidak punya kapasitas untuk memproduksi dalam jumlah besar sekaligus, akibatnya antrean produksi mengular dan pengiriman ke konsumen tertunda.</p>
</div>
<div style="background:#f9f8f4;padding:18px 22px;border-radius:12px;border-left:4px solid #D98A00">
<p style="margin:0;font-weight:700;font-size:1.05em">Butuh Dukungan Legalitas</p>
<p style="margin:8px 0 0;color:#555">Ekspansi ke marketplace besar atau distribusi modern butuh dokumen legal yang lengkap dan selalu diperbarui. Bukan cuma BPOM, tapi juga sertifikasi Halal, HKI, dan dokumen ekspor jika brand mulai merambah pasar luar negeri.</p>
</div>
</div>''')

# 6. H2: Kapasitas Produksi Dreamlab untuk Order Skala Besar
parts.append('<h2 id="kapasitas-produksi-dreamlab" style="font-size:1.5em;margin:40px 0 16px">Kapasitas Produksi Dreamlab untuk Order Skala Besar</h2>')

parts.append('<p>Dreamlab bukan maklon rumahan dengan kapasitas terbatas. Pabrik aseptik kami dirancang untuk menangani produksi volume tinggi tanpa antrean panjang. Berikut kapasitas yang membedakan Dreamlab dari maklon skala kecil di Jakarta:</p>')

parts.append('''<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:24px 0">
<div style="background:#f9f8f4;padding:20px;border-radius:12px;border:1px solid #e8e3d8">
<p style="margin:0;font-weight:700;color:#1a1a2e">Pabrik Aseptik CPKB Golongan A</p>
<p style="margin:8px 0 0;color:#555;font-size:0.9em">Sertifikasi CPKB No. CPKB/2023/18260-A — standar tertinggi untuk pabrik kosmetik di Indonesia. Bukan cuma legalitas, tapi jaminan sistem produksi yang terstandarisasi untuk volume besar.</p>
</div>
<div style="background:#f9f8f4;padding:20px;border-radius:12px;border:1px solid #e8e3d8">
<p style="margin:0;font-weight:700;color:#1a1a2e">Ditangani Apoteker Berlisensi</p>
<p style="margin:8px 0 0;color:#555;font-size:0.9em">Setiap formula dikembangkan dan diawasi oleh tim apoteker berlisensi. Bukan teknisi biasa — keahlian ini memastikan formula tetap stabil dan aman meskipun diproduksi dalam jumlah besar.</p>
</div>
<div style="background:#f9f8f4;padding:20px;border-radius:12px;border:1px solid #e8e3d8">
<p style="margin:0;font-weight:700;color:#1a1a2e">1.000+ Produk untuk 150+ Brand</p>
<p style="margin:8px 0 0;color:#555;font-size:0.9em">Rekam jejak produksi yang teruji lintas kategori — dari skincare, body care, hair care, parfum, hingga makeup. Kapasitas ini sudah teruji oleh brand yang produknya ada di ribuan titik penjualan.</p>
</div>
<div style="background:#f9f8f4;padding:20px;border-radius:12px;border:1px solid #e8e3d8">
<p style="margin:0;font-weight:700;color:#1a1a2e">Lini Produksi Lintas Kategori</p>
<p style="margin:8px 0 0;color:#555;font-size:0.9em">Lini produksi terpisah untuk setiap kategori produk menghilangkan risiko kontaminasi silang. Brand tidak perlu khawatir produk lipstik tercampur residu bahan skincare.</p>
</div>
<div style="background:#f9f8f4;padding:20px;border-radius:12px;border:1px solid #e8e3d8">
<p style="margin:0;font-weight:700;color:#1a1a2e">MOQ Berjenjang</p>
<p style="margin:8px 0 0;color:#555;font-size:0.9em">Tidak perlu khawatir soal minimum order. Dreamlab menyediakan MOQ berjenjang yang fleksibel — mulai dari 500 pcs untuk trial sampai ribuan pcs untuk produksi massal, sesuai tahap pertumbuhan brand.</p>
</div>
<div style="background:#f9f8f4;padding:20px;border-radius:12px;border:1px solid #e8e3d8">
<p style="margin:0;font-weight:700;color:#1a1a2e">Produk Tembus 15+ Negara</p>
<p style="margin:8px 0 0;color:#555;font-size:0.9em">Brand binaan Dreamlab sudah menembus pasar ekspor ke 15+ negara. Kapasitas produksi kami dirancang untuk memenuhi standar internasional, bukan hanya pasar domestik.</p>
</div>
</div>''')

# 7. Second image (mid-a)
parts.append('''<figure class="wp-block-image size-large" style="margin:40px 0">
  <a href="https://dreamlab.id/thankyou/google/">
    <img bv-data-src="/assets/images/blog/artikel-mid-a.png" decoding="async" src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%200%200%27%3E%3C/svg%3E" alt="Dreamlab Maklon Kosmetik" class="bv-tag-attr-replace bv-lazyload-tag-img" style="width:auto;height:auto">
  </a>
  <figcaption class="wp-element-caption">Konsultasi Gratis Sekarang</figcaption>
</figure>''')

# 8. H2: Formula Tetap Konsisten Meski Produksi Volume Besar
parts.append('<h2 id="formula-tetap-konsisten" style="font-size:1.5em;margin:40px 0 16px">Formula Tetap Konsisten Meski Produksi Volume Besar</h2>')

parts.append('<p>Salah satu kekhawatiran terbesar brand yang scale up adalah: apakah kualitas produk akan menurun saat jumlah produksi dinaikkan? Jawabannya tergantung pada sistem quality control yang dimiliki pabrik maklon. Dreamlab menerapkan prinsip <b>1 Klien 1 Formula</b> — setiap formula yang dikembangkan adalah milik eksklusif klien dan tidak akan pernah diproduksi ulang untuk brand lain. Ini menjamin bahwa formula brand-mu tidak diduplikasi, dijual kembali, atau dimodifikasi tanpa sepengetahuanmu.</p>')

parts.append('<p>Selain itu, setiap batch produksi melalui tiga tahap QC:</p>')

parts.append('''<ol style="margin:16px 0;padding-left:22px;line-height:2">
<li><strong>QC bahan baku</strong> — setiap bahan yang masuk diperiksa spesifikasi dan kemurniannya sebelum digunakan.</li>
<li><strong>QC in-process</strong> — pengawasan selama produksi berlangsung untuk memastikan parameter seperti pH, viskositas, dan suhu tetap dalam rentang yang ditentukan.</li>
<li><strong>QC produk jadi</strong> — produk akhir diuji untuk memastikan organoleptik (warna, bau, tekstur) sesuai dengan sampel yang sudah disetujui klien.</li>
</ol>''')

parts.append('<p>Dengan sistem ini, batch ke-100 akan memiliki kualitas yang sama dengan batch pertama — tidak ada variasi yang bisa dikenali konsumen.</p>')

# 9. H2: Mengapa Memilih Dreamlab sebagai Tempat Produksi
parts.append('<h2 id="mengapa-memilih-dreamlab" style="font-size:1.5em;margin:40px 0 16px">Mengapa Memilih Dreamlab sebagai Tempat Produksi</h2>')

parts.append('<p>Banyak pabrik maklon di Jakarta yang bisa memproduksi kosmetik. Tapi untuk brand yang sudah berkembang dan butuh kapasitas skala industri, pilihannya lebih terbatas. Berikut perbandingan antara maklon pada umumnya dan Dreamlab:</p>')

parts.append('''<table style="width:100%;border-collapse:collapse;margin:24px 0;font-size:14px">
<thead>
<tr style="background:#1a1a2e;color:#ffffff">
<th style="padding:12px 16px;text-align:left;border:1px solid #e8e3d8">Aspek</th>
<th style="padding:12px 16px;text-align:left;border:1px solid #e8e3d8">Maklon Biasa</th>
<th style="padding:12px 16px;text-align:left;border:1px solid #e8e3d8">Dreamlab</th>
</tr>
</thead>
<tbody>
<tr style="background:#ffffff">
<td style="padding:12px 16px;border:1px solid #e8e3d8">Kapasitas produksi</td>
<td style="padding:12px 16px;border:1px solid #e8e3d8">Terbatas, sering antre</td>
<td style="padding:12px 16px;border:1px solid #e8e3d8">Skala industri, produksi paralel</td>
</tr>
<tr style="background:#faf9f6">
<td style="padding:12px 16px;border:1px solid #e8e3d8">Kepemilikan formula</td>
<td style="padding:12px 16px;border:1px solid #e8e3d8">Formula template untuk banyak brand</td>
<td style="padding:12px 16px;border:1px solid #e8e3d8">1 Klien 1 Formula — eksklusif</td>
</tr>
<tr style="background:#ffffff">
<td style="padding:12px 16px;border:1px solid #e8e3d8">Layanan</td>
<td style="padding:12px 16px;border:1px solid #e8e3d8">Produksi saja</td>
<td style="padding:12px 16px;border:1px solid #e8e3d8">One stop: R&D, legal, produksi, ekspor</td>
</tr>
<tr style="background:#faf9f6">
<td style="padding:12px 16px;border:1px solid #e8e3d8">MOQ</td>
<td style="padding:12px 16px;border:1px solid #e8e3d8">Kaku, minimal besar</td>
<td style="padding:12px 16px;border:1px solid #e8e3d8">Berjenjang, fleksibel sesuai growth stage</td>
</tr>
<tr style="background:#ffffff">
<td style="padding:12px 16px;border:1px solid #e8e3d8">Sertifikasi</td>
<td style="padding:12px 16px;border:1px solid #e8e3d8">Belum tentu CPKB</td>
<td style="padding:12px 16px;border:1px solid #e8e3d8">CPKB Golongan A + Halal MUI</td>
</tr>
<tr style="background:#faf9f6">
<td style="padding:12px 16px;border:1px solid #e8e3d8">Tim ahli</td>
<td style="padding:12px 16px;border:1px solid #e8e3d8">Teknisi produksi</td>
<td style="padding:12px 16px;border:1px solid #e8e3d8">Apoteker berlisensi + R&D team</td>
</tr>
</tbody>
</table>''')

parts.append('<p>Baca juga: <a href="https://dreamlab.id/memilih-pabrik-maklon-kosmetik-sertifikasi-cpkb/" style="color:#4a6fa5" target="_blank">Pentingnya Memilih Pabrik Maklon Kosmetik Bersertifikasi CPKB Grade A</a> untuk memahami lebih dalam soal standar pabrik kosmetik yang aman.</p>')

# 10. Third image (bawah)
parts.append('''<figure class="wp-block-image size-large" style="margin:40px 0">
  <a href="https://dreamlab.id/thankyou/google/">
    <img bv-data-src="/assets/images/blog/dreamlab_maklonkosmetik_artikel_akhir.png" decoding="async" src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%200%200%27%3E%3C/svg%3E" alt="Dreamlab Maklon Kosmetik" class="bv-tag-attr-replace bv-lazyload-tag-img" style="width:auto;height:auto">
  </a>
  <figcaption class="wp-element-caption">Konsultasi Gratis Sekarang</figcaption>
</figure>''')

# 11. FAQ
parts.append('<h2 id="faq-maklon-jakarta-skala-besar" style="font-size:1.5em;margin:40px 0 16px">Pertanyaan yang Sering Diajukan</h2>')

faqs = [
    (
        "Berapa kapasitas produksi Dreamlab untuk order skala besar?",
        "Kapasitas produksi Dreamlab dirancang untuk menangani order skala industri dengan lintas kategori produk. Dengan pabrik aseptik CPKB Golongan A dan lini produksi terpisah untuk setiap kategori, Dreamlab mampu memproduksi ribuan unit per siklus produksi tanpa mengorbankan kualitas. Untuk detail kapasitas spesifik sesuai kebutuhan produkmu, konsultasi gratis dengan tim kami."
    ),
    (
        "Apakah kualitas produk tetap sama saat produksi dinaikkan ke volume besar?",
        "Ya. Dreamlab menerapkan sistem quality control tiga tahap — QC bahan baku, QC in-process, dan QC produk jadi — yang memastikan batch ke-100 memiliki kualitas yang identik dengan batch pertama. Setiap parameter seperti pH, viskositas, warna, dan aroma diuji secara ketat di setiap tahap produksi."
    ),
    (
        "Apakah brand yang sudah punya pabrik lama bisa pindah ke Dreamlab untuk kebutuhan skala besar?",
        "Tentu bisa. Dreamlab sudah menangani banyak brand yang sebelumnya produksi di tempat lain dan pindah karena kapasitas tidak lagi mencukupi. Tim R&D kami akan melakukan reverse engineering untuk menyesuaikan formula agar tetap identik dengan produk aslinya, lalu memproduksinya dalam skala yang lebih besar."
    ),
    (
        "Berapa lama waktu produksi untuk order dalam volume besar?",
        "Waktu produksi tergantung pada kompleksitas formula, jenis kemasan, dan volume pesanan. Secara umum, proses dari formulasi hingga produk jadi untuk order skala besar memakan waktu 4-8 minggu, tergantung kesiapan dokumen legalitas dan kecepatan approval sampel dari klien."
    ),
    (
        "Apakah Dreamlab bisa produksi lebih dari satu kategori produk sekaligus dalam volume besar?",
        "Bisa. Dreamlab memiliki lini produksi terpisah untuk setiap kategori produk — skincare, body care, hair care, parfum, dan makeup. Ini memungkinkan produksi paralel untuk kategori berbeda tanpa risiko kontaminasi silang dan tanpa harus mengantre satu kategori selesai dahulu."
    ),
    (
        "Apakah ada jaminan legalitas tetap lengkap saat volume produksi naik?",
        "Tentu. Setiap produk yang diproduksi di Dreamlab dilengkapi dengan izin BPOM (notifikasi kosmetik) dan sertifikasi Halal MUI. Tim legalitas kami mengurus perpanjangan dan pembaruan dokumen secara proaktif, sehingga brand tidak perlu khawatir soal legalitas saat volume produksi meningkat."
    ),
]

for q, a in faqs:
    parts.append(f'''<details style="margin:12px 0;padding:14px 18px;background:#f9f8f4;border-radius:8px;border:1px solid #e8e3d8">
<summary style="font-weight:600;cursor:pointer;color:#4a6fa5"><b>{q}</b></summary>
<p style="margin-top:10px;color:#555">{a}</p>
</details>''')

# 12. CTA Button
parts.append('''<div style="text-align:center;margin:48px 0">
<a href="https://dreamlab.id/thankyou/google/" style="display:inline-block;background:#D98A00;color:#fff;padding:18px 48px;border-radius:50px;text-decoration:none;font-weight:800;font-size:1.1em;box-shadow:0 4px 15px rgba(217,138,0,0.3)">Konsultasi Gratis dengan Dreamlab</a>
<p style="margin-top:12px;font-size:0.85em;color:#888">Dapatkan estimasi kapasitas dan timeline produksi untuk brand-mu.</p>
</div>''')

# 13. Closing div
parts.append('</div>')

# Join all parts with double newlines
html_content = "\n\n".join(parts)

# Escape for TypeScript string literal
escaped_content = escape_for_ts(html_content)

# Build the full article object
new_article = f'''  {{
    "slug": "/maklon-kosmetik-jakarta-skala-besar",
    "title": "Maklon Kosmetik Jakarta Skala Besar: Kapasitas Produksi Industri Teruji",
    "publishDate": "2026-07-02T00:00:00+00:00",
    "author": "Dreamlab Maklon Kosmetik",
    "categories": ["Maklon Kosmetik"],
    "featuredImage": "maklon-kosmetik-jakarta-skala-besar.png",
    "excerpt": "Cari maklon kosmetik Jakarta skala besar? Dreamlab punya kapasitas produksi industri, CPKB Grade A, formula eksklusif. Konsultasi gratis!",
    "content": "{escaped_content}",
    "seo": {{
      "title": "Cari Maklon Kosmetik Jakarta Skala Besar? | Dreamlab",
      "description": "Cari maklon kosmetik Jakarta skala besar? Dreamlab punya kapasitas produksi industri, CPKB Grade A, formula eksklusif 1 klien 1 formula. Konsultasi gratis!"
    }}
  }}'''

# Read the file
with open(FILE, "r") as f:
    content = f.read()

# Check that it ends with "  }];"
if not content.rstrip().endswith("};]"):
    # Find the last occurrence
    idx = content.rfind("  }];")
    if idx == -1:
        print("ERROR: Could not find '  }];' at end of file")
        exit(1)
    
    # Replace with comma + new article + closing
    before = content[:idx]
    # Trim trailing whitespace from before
    before = before.rstrip()
    after = content[idx + 5:]  # skip past "  }];"
    
    new_content = before + "  },\n" + new_article + "\n];" + after
else:
    # Simple case - file ends with "  }];"
    new_content = content.rstrip()[:-4] + "  },\n" + new_article + "\n];"

# Write back
with open(FILE, "w") as f:
    f.write(new_content)

print("✅ Article added successfully!")

# Count lines
with open(FILE, "r") as f:
    lines = f.readlines()
print(f"  File now has {len(lines)} lines")

# Verify the last few lines
for line in lines[-5:]:
    print(f"  {repr(line)}")
