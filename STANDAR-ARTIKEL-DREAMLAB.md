# Panduan & Standar Baku Pembuatan Artikel Dreamlab (SOP Editorial & Frontend)

Dokumen ini adalah **panduan absolut dan tidak dapat ditawar** untuk seluruh proses pembuatan, formatting, penataan tata letak (UI/UX), hingga deployment artikel blog di website [Dreamlab.id](https://dreamlab.id). Setiap kali menyusun artikel baru atau merevisi artikel lama, panduan ini **wajib diikuti 100% tanpa pengecualian**.

---

## 1. Prinsip Utama (Golden Rules)

1. **100% Sesuai Brief**:
   - Seluruh poin bahasan, heading (H1, H2, H3), meta data (Title & Description), URL slug, kategori, dan tag dari brief harus dimasukkan secara lengkap tanpa ada yang dipotong atau diubah maksudnya.
   - Fakta teknis (misal: CPKB Grade A, fasilitas Clean Room bertekanan positif dengan HEPA filter, perlindungan formula *1 Client = 1 Custom Formula*, sistem *blind coding*, skema MOQ, pengawalan DIP BPOM & SJPH Halal) harus akurat dan sesuai SOP resmi Dreamlab.

2. **Zero-Redundancy (Tanpa Redundansi)**:
   - **Hanya 1 Bagian FAQ**: FAQ hanya diletakkan di akhir artikel sebelum footer sumber rujukan. Dilarang menduplikasi section FAQ.
   - **Hanya 1 Banner Closing CTA Utama**: Dilarang mengulang banner closing CTA berkali-kali di dalam artikel.
   - **Bebas Entitas Typo**: Dilarang ada karakter rusak seperti `&raar;` (pastikan panah CTA bersih, tanpa spasi dalam entitas).

3. **Kontras Warna & Keterbacaan (NO Same Color Background & Font)**:
   - **DILARANG KERAS** warna teks sama atau mirip dengan warna latar (misal: teks hitam di background hitam/gelap, atau teks putih di background putih/terang).
   - Seluruh teks wajib memiliki rasio kontras tinggi (minimal 4.5:1 untuk teks normal, 3:1 untuk teks tebal/besar) agar terbaca sempurna di layar monitor desktop maupun ponsel dalam mode terang (*Light Mode*) dan mode gelap paksa (*Dark Mode/Theme*).

4. **Tabel Wajib Horizontal Scroll di Mobile (Anti-Sesak / Anti-Squish)**:
   - Dilarang membuat tabel yang menyusut dan memotong kata secara vertikal per suku kata (seperti *"PARA METE R EVAL UASI"*).
   - Tabel wajib dibungkus dengan container responsive berfitur horizontal swipe dengan `min-width: 820px !important;` dan `white-space: nowrap !important;` pada header.

5. **NO EMOJI - Gunakan Inline SVG Icon Profesional**:
   - **Dilarang keras memakai emoji kartun bawaan perangkat** (seperti `🔮`, `🎨`, `📱`, `📸`, `🔬`, `📜`, `🏭`, `🤝`, `⚠️`, `✔`, `🎯`, `🧴`, `🌡️`) karena menurunkan citra profesionalitas industri farmasi/kosmetik.
   - Seluruh indikator visual wajib diganti dengan **vektor SVG minimalis modern** yang diletakkan di dalam wadah badge box berukuran presisi.

6. **Manajemen Gambar Tepat Tempat (Hero Cover vs Placeholder Isi)**:
   - Gambar Cover (Hero): Wajib menggunakan file yang dialokasikan khusus untuk cover (berakhiran `_COVER` atau `Hero_...`).
   - Gambar Konten / Elemen: Diletakkan pada `<figure>` di bagian pembahasan yang relevan sesuai panduan brief (misal: visual pertimbangan MOQ di section MOQ, checklist di section tips).
   - Dilarang menukar gambar cover menjadi gambar konten atau sebaliknya.

---

## 2. Aturan Standar Tabel Komparasi (Mobile & Desktop Friendly)

Agar tabel komparasi tidak menyempit di layar HP dan tidak mengalami tabrakan warna teks vs background:

### Template Kode HTML Tabel Wajib:
```html
<div class="article-table-wrap" style="margin:28px 0;border:1px solid #cbd5e1;border-radius:14px;overflow:hidden;background:#ffffff;box-shadow:0 4px 14px rgba(0,0,0,0.04)">
  <!-- Header Bar Navigasi Mobile -->
  <div style="background:#f1f5f9;padding:12px 18px;border-bottom:1px solid #cbd5e1;display:flex;align-items:center;justify-content:space-between;font-size:12.5px;color:#475569">
    <span style="display:flex;align-items:center;gap:8px;font-weight:700">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D98A00" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8L22 12L18 16"></path><path d="M6 8L2 12L6 16"></path><path d="M2 12H22"></path></svg>
      Judul Komparasi / Parameter Evaluasi
    </span>
    <span style="font-size:11px;font-weight:700;color:#92400e;background:#fef3c7;padding:4px 10px;border-radius:6px;letter-spacing:0.3px">⇄ Geser ke samping</span>
  </div>
  
  <!-- Container Horizontal Scroll -->
  <div style="overflow-x:auto;-webkit-overflow-scrolling:touch;width:100%;display:block">
    <table style="width:100%;min-width:820px;border-collapse:collapse;text-align:left;font-size:13.5px;line-height:1.6;table-layout:auto">
      <thead>
        <tr>
          <!-- Kolom 1: Slate Dark dengan teks putih tegas -->
          <th style="padding:16px 18px;font-weight:800;color:#ffffff !important;background:#1e293b !important;border-right:1px solid #334155;white-space:nowrap !important;min-width:200px;text-transform:uppercase;font-size:12px;letter-spacing:0.5px">Parameter Evaluasi Bisnis</th>
          
          <!-- Kolom 2: Red Alert Soft -->
          <th style="padding:16px 18px;font-weight:800;color:#991b1b !important;background:#fef2f2 !important;border-right:1px solid #fecdd3;white-space:nowrap !important;min-width:200px;font-size:13px">Skema Ekstrem Terlalu Kecil (100 Pcs)</th>
          
          <!-- Kolom 3: Amber Warning Soft -->
          <th style="padding:16px 18px;font-weight:800;color:#92400e !important;background:#fffbeb !important;border-right:1px solid #fde68a;white-space:nowrap !important;min-width:200px;font-size:13px">Skema Produksi Masif (5.000 Pcs)</th>
          
          <!-- Kolom 4: Emerald Recommendation Soft -->
          <th style="padding:16px 18px;font-weight:800;color:#065f46 !important;background:#ecfdf5 !important;white-space:nowrap !important;min-width:220px;font-size:13px">
            Skema Uji Pasar Terukur (500&ndash;1.000 Pcs)
            <span style="display:inline-block;background:#10b981;color:#ffffff;font-size:10px;font-weight:800;padding:2px 8px;border-radius:20px;margin-left:6px;vertical-align:middle;letter-spacing:0.5px">REKOMENDASI</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid #f1f5f9">
          <td style="padding:14px 18px;font-weight:700;color:#0f172a !important;background:#f8fafc !important;border-right:1px solid #e2e8f0;white-space:nowrap !important">Beban Biaya Legalitas per Unit</td>
          <td style="padding:14px 18px;color:#4b5563;border-right:1px solid #f1f5f9">Sangat mahal (biaya BPOM/uji lab membebani 100 botol)</td>
          <td style="padding:14px 18px;color:#4b5563;border-right:1px solid #f1f5f9">Sangat murah (terbagi rata ke volume masif)</td>
          <td style="padding:14px 18px;font-weight:600;color:#166534;background:#f0fdf4">Seimbang dan masuk akal untuk sediaan baru</td>
        </tr>
        <!-- Baris lainnya mengikuti pola serupa -->
      </tbody>
    </table>
  </div>
</div>
```

### Aturan Wajib Tabel:
- `min-width: 820px !important;` (atau min. `760px`) wajib dipasang pada elemen `table`.
- Seluruh tag `<th>` dan parameter pertama `<td>` wajib menggunakan `white-space: nowrap !important;`.
- Header parameter pertama yang berlatar gelap `#1e293b` **wajib** menyertakan `color: #ffffff !important;`.

---

## 3. Standar Penggantian Emoji Menjadi SVG Icon Profesional

Setiap artikel **dilarang menggunakan karakter unicode emoji**. Ganti dengan elemen HTML badge icon berikut:

### Format Standar Badge:
Container: `width: 40px; height: 40px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px;`
Ukuran SVG: `width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`

### Palet Warna & Vektor per Kategori:

| Kategori Pembahasan | Emoji Lama | Warna Background | Warna Stroke / Teks | Vektor SVG Icon |
| :--- | :---: | :--- | :--- | :--- |
| **Formulasi / Custom Formula / R&D** | `🔮` / `🧪` | `#fef3c7` (Amber) | `#d97706` | Flask / Lab Tube SVG |
| **Desain Logo & Kemasan** | `🎨` | `#ede9fe` (Purple) | `#7c3aed` | Palette Artist SVG |
| **Digital Marketing Kit / Kampanye** | `📱` / `🗂️` | `#e0f2fe` (Sky Blue) | `#0284c7` | Megaphone Marketing SVG |
| **Sesi Photo Shoot Produk** | `📸` | `#dcfce7` (Emerald) | `#16a34a` | Studio Camera SVG |
| **Pengujian Lab / Stabilitas / Sampel** | `🔬` / `🌡️` | `#fef3c7` (Amber) | `#d97706` | Precision Microscope / Thermometer SVG |
| **Legalitas BPOM & Sertifikasi Halal** | `📜` | `#fee2e2` (Rose) | `#dc2626` | Shield Verified / Check SVG |
| **Produksi Massal Higienis CPKB** | `🏭` | `#f1f5f9` (Slate) | `#334155` | Modern Factory Facility SVG |
| **Aftersales Community & Partnership** | `🤝` | `#dbeafe` (Indigo) | `#1e40af` | Community / Users SVG |
| **Target & Problem-Solution Fit** | `🎯` | `#fef3c7` (Amber) | `#d97706` | Target Crosshair SVG |
| **Kemasan Primer & Kompatibilitas** | `🧴` | `#e0f2fe` (Sky Blue) | `#0284c7` | Product Package Box SVG |

### Badge RED FLAG & GREEN FLAG:
- **Red Flag Badge**:
  ```html
  <div style="display:inline-flex;align-items:center;gap:6px;background:#fef2f2;color:#b91c1c;font-weight:800;font-size:12px;padding:4px 10px;border-radius:6px;margin-bottom:10px">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
    RED FLAG 1
  </div>
  ```
- **Green Flag Badge**:
  ```html
  <div style="display:inline-flex;align-items:center;gap:6px;background:#dcfce7;color:#15803d;font-weight:800;font-size:12px;padding:4px 10px;border-radius:6px;margin-bottom:10px">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><polyline points="20 6 9 17 4 12"></polyline></svg>
    GREEN FLAG 1
  </div>
  ```

---

## 4. Standar Penempatan & Format Gambar (Images)

1. **Cover / Featured Image**:
   - Menggunakan gambar cover dari folder aset artikel (biasanya berawalan `Hero_` atau berakhiran `_COVER.jpg`).
   - Didaftarkan pada property `featuredImage` pada objek data artikel di `src/data/articles.ts`.
   - **Dilarang keras** menggunakan gambar konten/diagram sebagai cover.

2. **Placeholder Gambar Isi Artikel**:
   - Setiap gambar dari brief memiliki tujuan dan tempat spesifik di dalam isi artikel.
   - Format penulisan HTML gambar isi:
     ```html
     <figure style="margin:32px 0;text-align:center">
       <img src="/images/artikel-[slug-artikel]/[nama-file-gambar].webp" 
            alt="Deskripsi Gambar Lengkap Kaya Keyword untuk SEO" 
            width="1200" height="800" 
            loading="lazy" decoding="async" 
            style="width:100%;height:auto;border-radius:14px;box-shadow:0 4px 16px rgba(0,0,0,0.06);object-fit:cover" />
       <figcaption style="font-size:13px;color:#6b7280;margin-top:8px">Keterangan visual pendukung topik bahasan terkait.</figcaption>
     </figure>
     ```

---

## 5. Standar Alur 8 Tahap Maklon Dreamlab

Alur proses maklon di Dreamlab wajib ditampilkan secara **berurutan vertikal ke bawah (01 sampai 08)** untuk keterbacaan mobile terbaik:

```html
<div class="dl-workflow-list" style="display:flex;flex-direction:column;gap:12px;margin:24px 0">
  <div style="display:flex;align-items:flex-start;gap:16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px 20px">
    <div style="background:#D98A00;color:#ffffff;font-weight:800;font-size:14px;border-radius:8px;padding:6px 12px;flex-shrink:0">01</div>
    <div>
      <h3 style="font-size:15px;font-weight:700;color:#111827;margin:0 0 4px">Konsultasi Ide</h3>
      <p style="font-size:13px;color:#4b5563;line-height:1.6;margin:0">Deskripsi singkat tahapan...</p>
    </div>
  </div>
  <!-- Lanjutkan urutan 02 sampai 08 -->
</div>
```

---

## 6. Standar Banner Closing CTA & FAQ

### Closing CTA (Hanya 1 di Akhir Artikel):
```html
<div id="konsultasi-maklon" class="dl-closing-cta" style="background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);color:#ffffff;border-radius:20px;padding:36px 32px;margin:44px 0;text-align:center;box-shadow:0 10px 25px -5px rgba(15,23,42,0.15)">
  <h2 style="color:#ffffff;font-size:24px;font-weight:800;margin:0 0 14px">Yuk Kolaborasi Brand dengan Dreamlab</h2>
  <p style="color:#cbd5e1;font-size:15px;line-height:1.75;margin:0 auto 16px;max-width:680px">
    Paragraf penutup yang mengajak calon founder berkolaborasi dan berkonsultasi secara gratis...
  </p>
  <p style="color:#fbbf24;font-size:15px;font-weight:700;margin:0 0 24px">
    Konsultasikan ide produk Anda sekarang bersama Dreamlab &mdash; Maklon Juaranya Formula!
  </p>
  <div style="display:flex;justify-content:center;width:100%">
    <a href="https://dreamlab.id/contact-us/" style="display:inline-block;background:#D98A00;color:#ffffff;font-size:16px;font-weight:700;padding:16px 36px;border-radius:50px;text-decoration:none;transition:all 0.2s ease;box-shadow:0 4px 14px rgba(217,138,0,0.4);max-width:100%;text-align:center;word-break:break-word;white-space:normal;box-sizing:border-box">Konsultasi Maklon Kosmetik Sekarang</a>
  </div>
</div>
```

### FAQ Section (Hanya 1 di Akhir Artikel):
```html
<h2 id="faq-maklon" style="font-size:1.5em;margin:40px 0 16px;color:#111827">Pertanyaan yang Sering Ditanyakan (FAQ)</h2>
<div class="dl-faq-container" style="display:flex;flex-direction:column;gap:14px;margin:24px 0">
  <details style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px 20px;cursor:pointer">
    <summary style="font-size:16px;font-weight:700;color:#111827;outline:none">Pertanyaan FAQ 1?</summary>
    <div style="padding-top:12px;font-size:14px;color:#4b5563;line-height:1.7">
      Jawaban terperinci FAQ 1...
    </div>
  </details>
  <!-- Item FAQ berikutnya -->
</div>
```

---

## 7. Checklist Verifikasi & Quality Control Mandiri (WAJIB Centang Sebelum Push)

Sebelum menyatakan tugas selesai dan memberikan link ke user, wajib memverifikasi checklist berikut:

- [ ] **Kesesuaian Brief 100%**: Judul, H1, H2, H3, FAQ, internal link, dan meta data persis sesuai brief.
- [ ] **Kontras Warna Teruji**: Tidak ada teks hitam di atas background hitam/gelap, tidak ada teks putih di atas background putih.
- [ ] **Tabel Responsif Mobile**: Tabel dibungkus `overflow-x: auto;`, memiliki `min-width: 820px !important;`, header `white-space: nowrap !important;`, dan memiliki tombol hint `⇄ Geser ke samping`.
- [ ] **Bebas Emoji 100%**: Tidak ada unicode emoji satu pun di dalam artikel. Seluruh icon berupa vektor SVG profesional ber-badge box.
- [ ] **Tidak Ada Redundansi**: Tidak ada FAQ ganda, tidak ada CTA ganda yang berulang, tidak ada entitas rusak (`&raar;`).
- [ ] **Gambar Tepat Tempat**: Gambar cover ditaruh di `featuredImage`, gambar isi ditaruh di section yang sesuai.
- [ ] **Generate Metadata**: Menjalankan `npm run gen:articles-meta`.
- [ ] **Production Build Pass**: Menjalankan `npm run build` dan memastikan 538+ halaman statis terkompilasi sukses dengan exit code 0.
- [ ] **Git Push Sinkron**: Perubahan di-commit dan di-push ke `origin master` serta `origin master:main`.
- [ ] **Verifikasi Live Tanpa Cache**: Membuka URL di Incognito atau fetch dengan query anti-cache (`?t=timestamp`) untuk memastikan server Vercel telah menyajikan versi terbaru.
