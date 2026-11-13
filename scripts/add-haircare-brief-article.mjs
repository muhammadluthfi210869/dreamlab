import fs from 'fs';
import path from 'path';

const slug = '/cara-membuat-brief-produk-haircare';
const title = 'Cara Membuat Brief Produk Haircare Sebelum Maklon';
const publishDate = '2026-11-13T00:00:00+00:00';
const author = 'Dreamlab Maklon Kosmetik';
const categories = ['Panduan Bisnis'];
const featuredImage = '/images/artikel-cara-membuat-brief-produk-haircare/brief_produk_haircare_cover.jpg';
const excerpt = 'Bingung menyiapkan brief produk haircare? Pelajari cara menentukan target, konsep, formula, kemasan, HPP, MOQ, hingga contoh brief untuk partner maklon.';
const seo = {
  title: 'Cara Membuat Brief Produk Haircare Sebelum Maklon | Panduan Lengkap',
  description: 'Bingung menyiapkan brief produk haircare? Pelajari cara menentukan target, konsep, formula, kemasan, HPP, MOQ, hingga contoh brief untuk partner maklon.'
};

const htmlContent = `<div class="elementor-element elementor-element-4cdeffb8 elementor-widget elementor-widget-theme-post-content">
  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Punya ide membuat brand <em>haircare</em> sendiri tetapi belum tahu apa yang harus disiapkan sebelum menghubungi partner maklon? Anda tidak perlu langsung memiliki formula kimiawi jadi atau memahami seluruh seluk-beluk mesin pabrik. Yang perlu disiapkan terlebih dahulu adalah gambaran produk yang ingin Anda bangun secara terarah.</p>

  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Gambaran strategis tersebut dituangkan dalam sebuah <strong>brief produk haircare</strong>. Brief berfungsi sebagai jembatan komunikasi antara visi bisnis Anda dengan tim Research & Development (R&D) serta tim produksi manufaktur. Melalui brief yang terstruktur, Anda dapat merinci siapa target konsumennya, kebutuhan rambut apa yang ingin dijawab, konsep sensori, jenis kemasan, hingga batasan anggaran modal bisnis Anda.</p>

  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Sebagai contoh perbandingan, daripada sekadar mengatakan <em>“saya ingin membuat shampoo premium yang bagus”</em>, Anda dapat menjelaskan bahwa produk ditujukan untuk pria dan wanita usia 20–35 tahun yang aktif di perkotaan, memerlukan shampoo lembut untuk penggunaan harian, menginginkan sensasi kulit kepala bersih menyegarkan tanpa membuat batang rambut kesat kering, serta memiliki aroma segar yang elegan. Dari arahan tersebut, partner maklon dapat langsung merancang formula yang presisi dan relevan.</p>

  <nav style="background:#fefbf3;border:1px solid #f3e8d2;border-radius:14px;padding:22px 24px;margin:28px 0;box-shadow:0 2px 8px rgba(0,0,0,0.02)">
    <p style="font-weight:700;color:#0f172a;font-size:17px;margin:0 0 14px;display:flex;align-items:center;gap:8px">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D98A00" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
      Daftar Isi
    </p>
    <ol style="margin:0;padding-left:22px;color:#4a6fa5;font-size:15px;line-height:1.8">
      <li><a href="#apa-itu-brief-produk-haircare" style="color:#4a6fa5;text-decoration:none">Apa Itu Brief Produk Haircare dan Mengapa Penting?</a></li>
      <li><a href="#1-tentukan-target-konsumen" style="color:#4a6fa5;text-decoration:none">1. Tentukan Target Konsumen</a></li>
      <li><a href="#2-pilih-produk-dan-fungsi-utamanya" style="color:#4a6fa5;text-decoration:none">2. Pilih Produk dan Fungsi Utamanya</a></li>
      <li><a href="#3-jelaskan-konsep-dan-pembeda-produk" style="color:#4a6fa5;text-decoration:none">3. Jelaskan Konsep dan Pembeda Produk</a></li>
      <li><a href="#4-tentukan-arah-formula-dan-bahan" style="color:#4a6fa5;text-decoration:none">4. Tentukan Arah Formula dan Bahan</a></li>
      <li><a href="#5-tentukan-klaim-produk-sejak-awal" style="color:#4a6fa5;text-decoration:none">5. Tentukan Klaim Produk Sejak Awal</a></li>
      <li><a href="#6-siapkan-referensi-kemasan-dan-ukuran" style="color:#4a6fa5;text-decoration:none">6. Siapkan Referensi Kemasan dan Ukuran</a></li>
      <li><a href="#7-tentukan-budget-hpp-moq-dan-target-produksi" style="color:#4a6fa5;text-decoration:none">7. Tentukan Budget, HPP, MOQ, dan Target Produksi</a></li>
      <li><a href="#8-siapkan-pertanyaan-untuk-partner-maklon" style="color:#4a6fa5;text-decoration:none">8. Siapkan Pertanyaan Kritis untuk Partner Maklon</a></li>
      <li><a href="#contoh-brief-produk-haircare" style="color:#4a6fa5;text-decoration:none">Contoh Brief Produk Haircare Siap Pakai (Daily Scalp Shampoo)</a></li>
      <li><a href="#kesalahan-yang-sering-terjadi" style="color:#4a6fa5;text-decoration:none">Kesalahan Umum Saat Membuat Brief Haircare</a></li>
      <li><a href="#dari-brief-menjadi-produk-haircare-brand-anda" style="color:#4a6fa5;text-decoration:none">Dari Brief Menjadi Produk Jadi Bersama Dreamlab</a></li>
      <li><a href="#faq-brief-haircare" style="color:#4a6fa5;text-decoration:none">Pertanyaan yang Sering Diajukan (FAQ)</a></li>
    </ol>
  </nav>

  <figure style="text-align:center;margin:32px 0">
    <a href="https://dreamlab.id/thankyou/google/" target="_blank" rel="noopener noreferrer">
      <img class="bv-tag-attr-replace bv-lazyload-tag-img" bv-data-src="/assets/images/blog/dreamlab_maklonkosmetik_artikel_tengah.png" src="/assets/images/blog/dreamlab_maklonkosmetik_artikel_tengah.png" alt="Konsultasi Maklon Haircare Dreamlab" style="width:100%;max-width:720px;height:auto;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,0.06);display:block;margin:0 auto" />
    </a>
  </figure>

  <h2 id="apa-itu-brief-produk-haircare" style="color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em">Apa Itu Brief Produk Haircare dan Mengapa Penting?</h2>
  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Brief produk haircare adalah dokumen acuan ringkas yang memuat konsep dasar, karakter, tujuan, dan batasan komersial suatu produk perawatan rambut sebelum proses formulasi laboratorium dimulai. Dokumen ini tidak perlu sarat dengan istilah kimia rumit. Justru, brief yang baik menggunakan bahasa operasional yang lugas dan mudah dipahami oleh kedua belah pihak.</p>

  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Brief yang solid menyamakan ekspektasi sejak awal pertemuan. Anda menjabarkan profil konsumen yang dibidik, nilai pembeda di pasar, dan target harga jual. Dari brief tersebut, tim formulator pabrik maklon dapat segera memetakan bahan aktif yang cocok, jenis surfaktan yang lembut, stabilitas viskositas emulsi, perkiraan <a href="https://dreamlab.id/moq-maklon-kosmetik/" style="color:#4a6fa5;font-weight:600">MOQ maklon kosmetik</a>, hingga uji efikasi klinis yang diperlukan.</p>

  <div style="background:#f8fafc;border-left:4px solid #2563eb;padding:16px 20px;margin:24px 0;border-radius:0 10px 10px 0">
    <p style="color:#1e293b;font-weight:600;margin:0 0 6px">Contoh Ide Brief Awal:</p>
    <p style="color:#475569;font-size:15px;line-height:1.6;margin:0;font-style:italic">“Saya ingin membuat Daily Scalp Shampoo untuk pria dan wanita usia 20–35 tahun yang aktif bekerja di perkotaan. Produk ditujukan untuk keramas setiap hari dengan sensasi rambut dan kulit kepala bersih segar tanpa terasa kering kesat. Konsep visual clean, modern, dengan positioning premium affordable di kisaran harga Rp150.000.”</p>
  </div>

  <h2 id="1-tentukan-target-konsumen" style="color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em">1. Tentukan Target Konsumen</h2>
  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Sebelum menentukan aroma wangi atau memilih botol kaca yang mewah, tentukan secara spesifik siapa pemakai utama produk Anda. Profil konsumen akan mendikte seluruh aspek teknis produk: jenis surfaktan pembersih, tingkat kelembapan, profil wewangian, hingga daya beli mereka.</p>

  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Hindari mendefinisikan target pasar secara bias seperti <em>“untuk semua orang”</em> atau <em>“semua jenis rambut”</em>. Semakin tajam segmentasi Anda, semakin mudah produk tersebut menarik perhatian audiens loyal di pasar.</p>

  <figure style="text-align:center;margin:28px 0">
    <img class="bv-tag-attr-replace bv-lazyload-tag-img" bv-data-src="/images/artikel-cara-membuat-brief-produk-haircare/contoh_brief_singkat_target_konsumen.jpg" src="/images/artikel-cara-membuat-brief-produk-haircare/contoh_brief_singkat_target_konsumen.jpg" alt="Contoh Brief Singkat Target Konsumen Haircare" style="width:100%;max-width:720px;height:auto;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,0.06);display:block;margin:0 auto" />
    <figcaption style="color:#64748b;font-size:13px;margin-top:10px;text-align:center">Komponen Inti Brief Singkat: Target Konsumen, Kebutuhan, Karakter, dan Positioning Brand.</figcaption>
  </figure>

  <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;box-shadow:0 2px 6px rgba(0,0,0,0.03);margin:20px 0 28px">
    <h3 style="color:#0f172a;font-size:17px;font-weight:700;margin:0 0 12px">Format Brief Target Konsumen:</h3>
    <ul style="color:#334155;font-size:15px;line-height:1.8;margin:0;padding-left:20px">
      <li><strong>Target Demografis:</strong> Pria dan wanita usia 20–35 tahun, pekerja urban, pengguna transportasi umum atau kendaraan bermotor.</li>
      <li><strong>Kebutuhan Rambut:</strong> Sering terpapar polusi, minyak berlebih di kulit kepala, namun ujung rambut rentan bercabang akibat styling harian.</li>
      <li><strong>Karakter Brand:</strong> Praktis, solutif, minimalis, modern, dan ramah lingkungan.</li>
      <li><strong>Positioning Harga:</strong> <em>Premium affordable</em> (Rp150.000 – Rp200.000 per botol 250 ml).</li>
    </ul>
  </div>

  <h2 id="2-pilih-produk-dan-fungsi-utamanya" style="color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em">2. Pilih Produk dan Fungsi Utamanya</h2>
  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Dalam industri perawatan rambut, Anda memiliki banyak pilihan sediaan produk: <a href="https://dreamlab.id/produk/haircare/shampoo/" style="color:#4a6fa5;font-weight:600">maklon shampoo</a>, <a href="https://dreamlab.id/produk/haircare/hair-conditioner/" style="color:#4a6fa5;font-weight:600">hair conditioner</a>, <a href="https://dreamlab.id/produk/haircare/hair-mask/" style="color:#4a6fa5;font-weight:600">hair mask</a>, <a href="https://dreamlab.id/produk/haircare/hair-tonic/" style="color:#4a6fa5;font-weight:600">hair tonic</a>, hingga produk tren mutakhir seperti <a href="https://dreamlab.id/produk/haircare/scalp-care/" style="color:#4a6fa5;font-weight:600">scalp serum</a>.</p>

  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Untuk brand yang baru berdiri, Anda tidak disarankan langsung merilis 5–10 SKU sekaligus karena akan menguras modal kerja dan menyulitkan fokus pemasaran. Pilihlah <strong>satu produk jagoan (<em>hero product</em>)</strong> yang menjadi pintu masuk konsumen mengenal kualitas brand Anda.</p>

  <ul style="color:#334155;font-size:15px;line-height:1.8;margin:16px 0;padding-left:20px">
    <li><strong>Produk Utama (Hero Product):</strong> Daily Scalp Care Shampoo 250 ml.</li>
    <li><strong>Rencana Produk Lanjutan (Fase 2):</strong> Leave-on Conditioner & Scalp Exfoliator Serum.</li>
    <li><strong>Arah Brand:</strong> Solusi perawatan kulit kepala sehat berkelanjutan untuk masyarakat urban tropis.</li>
  </ul>

  <h2 id="3-jelaskan-konsep-dan-pembeda-produk" style="color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em">3. Jelaskan Konsep dan Pembeda Produk</h2>
  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Pembeda produk (<em>Unique Selling Proposition</em>) adalah alasan mengapa konsumen harus membeli produk Anda dan bukan produk pesaing. Hindari kata-kata abstrak seperti <em>“wangi enak”</em> atau <em>“formula mewah”</em> tanpa indikator sensori yang jelas.</p>

  <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:16px;margin:24px 0 32px">
    <div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:12px;padding:20px">
      <h3 style="color:#9f1239;font-size:16px;font-weight:700;margin:0 0 8px;display:flex;align-items:center;gap:8px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        Brief Kurang Jelas (Abstrak)
      </h3>
      <p style="color:#881337;font-size:14px;line-height:1.6;margin:0"><em>“Saya mau buat shampoo premium yang wanginya enak dan bikin rambut cepat panjang.”</em> (Tim R&D tidak memiliki tolok ukur aroma atau tekstur yang diharapkan).</p>
    </div>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px">
      <h3 style="color:#166534;font-size:16px;font-weight:700;margin:0 0 8px;display:flex;align-items:center;gap:8px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        Brief Jelas (Operasional)
      </h3>
      <p style="color:#14532d;font-size:14px;line-height:1.6;margin:0"><em>“Shampoo gel transparan untuk keramas harian dengan busa mikro yang lembut. Aroma citrus-herbal menyegarkan yang tidak menyengat. Rambut terasa ringan bervolume setelah dikeringkan.”</em></p>
    </div>
  </div>

  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Anda sangat dianjurkan membawa 1–3 produk tolok ukur (<em>benchmark products</em>). Jelaskan secara spesifik: <em>“Saya menyukai kelembutan busa Produk A, tetapi ingin tekstur gel yang lebih kental seperti Produk B dengan aroma fresh seperti Produk C.”</em> Produk pembanding digunakan sebagai alat bantu komunikasi sensori, bukan untuk disalin secara ilegal.</p>

  <h2 id="4-tentukan-arah-formula-dan-bahan" style="color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em">4. Tentukan Arah Formula dan Bahan</h2>
  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Sebagai pemilik brand, Anda tidak wajib menguasai ilmu farmasi formulasi. Di dalam brief, Anda cukup memberikan arahan filosofi formula yang diinginkan, lalu memberikan keleluasaan bagi formulator R&D untuk memilih bahan aktif yang stabil, aman, dan kompatibel.</p>

  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Beberapa poin preferensi formula yang dapat Anda masukkan ke brief antara lain:</p>
  <ul style="color:#334155;font-size:15px;line-height:1.8;margin:16px 0;padding-left:20px">
    <li><strong>Sistem Surfaktan:</strong> Bebas sulfat agresif (<em>Sulfate-Free / SLS-SLES Free</em>) menggunakan surfaktan berbahan dasar kelapa atau asam amino alami (misal: <em>Sodium Cocoyl Isethionate, Coco-Glucoside</em>).</li>
    <li><strong>Bahan Aktif Penutrisi Kulit Kepala:</strong> Salicylic Acid (BHA mikro) untuk membersihkan residu sebum, Piroctone Olamine untuk ketombe, Niacinamide, atau ekstrak Rosemary & Peppermint.</li>
    <li><strong>Karakter Emolien Batang Rambut:</strong> Bebas silikon berat (<em>Silicone-Free</em>) digantikan oleh minyak nabati ringan seperti Argan Oil atau Panthenol (Pro-Vitamin B5).</li>
    <li><strong>Standar Sertifikasi:</strong> Memenuhi standar Halal, vegan-friendly, dan bebas paraben.</li>
  </ul>

  <h2 id="5-tentukan-klaim-produk-sejak-awal" style="color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em">5. Tentukan Klaim Produk Sejak Awal</h2>
  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Klaim produk bukan sesuatu yang baru dikarang saat kemasan dicetak. Klaim harus selaras dengan formulasi sejak awal dan wajib mematuhi regulasi periklanan kosmetik yang diawasi oleh <a href="https://notifkos.pom.go.id" target="_blank" rel="nofollow noopener noreferrer" style="color:#4a6fa5;text-decoration:underline">Badan Pengawas Obat dan Makanan (BPOM RI)</a>.</p>

  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">BPOM menegaskan bahwa produk kosmetik tidak boleh memberikan janji medis atau bertindak layaknya obat. Oleh karena itu, hindari klaim seperti <em>“mengobati kebotakan genetik”</em> atau <em>“menghilangkan ketombe permanen dalam 3 hari”</em>. Gantilah dengan klaim dermatologis yang sah dan dapat dibuktikan melalui uji stabilitas dan uji klinis, seperti:</p>

  <ul style="color:#334155;font-size:15px;line-height:1.8;margin:16px 0;padding-left:20px">
    <li><em>“Membantu membersihkan minyak berlebih dan merawat kekuatan akar rambut.”</em></li>
    <li><em>“Menyegarkan kulit kepala dan menjaga kelembapan alami batang rambut.”</em></li>
    <li><em>“Diformulasikan secara lembut untuk pemakaian harian (Daily Mild Formula).”</em></li>
  </ul>

  <h2 id="6-siapkan-referensi-kemasan-dan-ukuran" style="color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em">6. Siapkan Referensi Kemasan dan Ukuran</h2>
  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Kemasan (<em>packaging</em>) bukan hanya soal estetika, melainkan juga kenyamanan penggunaan di kamar mandi dan faktor penentu struktur biaya (HPP). Untuk shampoo atau conditioner cair, botol dengan tutup pompa (<em>pump dispenser</em>) 250 ml atau 300 ml adalah standar paling praktis dan higienis bagi konsumen.</p>

  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Sertakan detail preferensi visual pada brief Anda:</p>
  <ul style="color:#334155;font-size:15px;line-height:1.8;margin:16px 0;padding-left:20px">
    <li><strong>Jenis Botol:</strong> Botol silinder PET bening atau doff dengan pump hitam/putih kedap air.</li>
    <li><strong>Volume Isi:</strong> 250 ml (ideal untuk siklus pemakaian 1–1.5 bulan).</li>
    <li><strong>Gaya Desain:</strong> Clean, minimalis, tipografi modern dengan palet warna biru-hijau pastel atau monokrom.</li>
    <li><strong>Finishing Label:</strong> Stiker tahan air (<em>waterproof vinyl / bopp</em>) dengan laminasi doff agar tidak rusak terkena air di kamar mandi.</li>
  </ul>

  <h2 id="7-tentukan-budget-hpp-moq-dan-target-produksi" style="color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em">7. Tentukan Budget, HPP, MOQ, dan Target Produksi</h2>
  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Sebuah formula hebat tidak akan menghasilkan bisnis yang sukses jika biaya produksinya membuat margin laba Anda tertekan. Oleh karena itu, tetapkan target harga jual dan batas modal Anda sejak penyusunan brief.</p>

  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Bila target harga jual eceran Anda adalah <strong>Rp165.000</strong>, maka idealnya HPP total (formula, kemasan, label, dan boks) berada di rentang 20%–30% dari harga jual, yaitu sekitar <strong>Rp33.000 – Rp49.000 per botol</strong>. Dengan menyertakan target HPP ini ke partner maklon, tim R&D dapat menyesuaikan konsentrasi bahan aktif impor tanpa melampaui batas anggaran Anda. Pelajari panduan perhitungan lengkap pada artikel <a href="https://dreamlab.id/cara-menghitung-hpp-kosmetik/" style="color:#4a6fa5;font-weight:600">cara menghitung HPP kosmetik</a> serta estimasi di <a href="https://dreamlab.id/biaya-maklon-skincare/" style="color:#4a6fa5;font-weight:600">panduan biaya maklon kosmetik</a>.</p>

  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Untuk batch produksi pertama, komunikasikan rencana volume Anda (misalnya: batch perdana 1.000 pcs). MOQ fleksibel Dreamlab memungkinkan pelaku bisnis memulai brand baru secara bertahap tanpa harus menumpuk stok berlebih di gudang.</p>

  <h2 id="8-siapkan-pertanyaan-untuk-partner-maklon" style="color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em">8. Siapkan Pertanyaan Kritis untuk Partner Maklon</h2>
  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Saat berkonsultasi, jangan hanya menanyakan <em>“berapa harga bikin shampoo?”</em>. Pastikan Anda menanyakan aspek operasional krusial berikut agar tidak terjadi kesalahpahaman di tengah jalan:</p>

  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:22px;margin:24px 0 32px">
    <h3 style="color:#0f172a;font-size:17px;font-weight:700;margin:0 0 12px">Daftar Pertanyaan Wajib Diajukan:</h3>
    <ol style="color:#334155;font-size:15px;line-height:1.8;margin:0;padding-left:20px">
      <li><strong>Fasilitas Pabrik:</strong> Apakah fasilitas produksi telah memiliki sertifikasi CPKB Grade A dari BPOM?</li>
      <li><strong>Kebijakan Sample:</strong> Berapa lama waktu pembuatan sample formula awal dan berapa kali revisi sample yang difasilitasi?</li>
      <li><strong>Transparansi Biaya:</strong> Apakah quotation sudah mencakup biaya registrasi BPOM, uji stabilitas mikroba, uji kemasan, dan sertifikasi Halal?</li>
      <li><strong>Kepemilikan Formula:</strong> Apakah formula dirancang eksklusif untuk brand saya (<em>1 Client = 1 Formula</em>) atau menggunakan formula massal generik?</li>
      <li><strong>Timeline Produksi:</strong> Berapa lama siklus dari acc sample, pendaftaran BPOM, hingga barang selesai diproduksi dan siap dikirim?</li>
    </ol>
  </div>

  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Untuk gambaran tahapan menyeluruh dari pra-produksi hingga pengiriman, Anda dapat membaca <a href="https://dreamlab.id/about-us/alur-maklon/" style="color:#4a6fa5;font-weight:600">panduan alur maklon Dreamlab</a>.</p>

  <h2 id="contoh-brief-produk-haircare" style="color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em">Contoh Brief Produk Haircare Siap Pakai (Daily Scalp Shampoo)</h2>
  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Berikut adalah format komprehensif yang menggabungkan seluruh elemen di atas menjadi satu dokumen brief profesional yang siap Anda bawa ke tim maklon:</p>

  <figure style="text-align:center;margin:28px 0">
    <img class="bv-tag-attr-replace bv-lazyload-tag-img" bv-data-src="/images/artikel-cara-membuat-brief-produk-haircare/contoh_brief_produk_haircare_daily_scalp_shampoo.jpg" src="/images/artikel-cara-membuat-brief-produk-haircare/contoh_brief_produk_haircare_daily_scalp_shampoo.jpg" alt="Template Brief Produk Haircare Daily Scalp Care Shampoo" style="width:100%;max-width:720px;height:auto;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,0.06);display:block;margin:0 auto" />
    <figcaption style="color:#64748b;font-size:13px;margin-top:10px;text-align:center">Contoh Format Brief Lengkap: Daily Scalp Care Shampoo 250 ml siap diajukan ke R&D Maklon.</figcaption>
  </figure>

  <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.03);margin:24px 0 36px">
    <h3 style="color:#0f172a;font-size:19px;font-weight:700;margin:0 0 16px;border-bottom:2px solid #f1f5f9;padding-bottom:10px">Lembar Spesifikasi Brief: Daily Scalp Care Shampoo</h3>
    <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.7;color:#334155">
      <tbody>
        <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:10px 0;font-weight:700;width:30%;color:#0f172a">Target Konsumen</td><td style="padding:10px 0">Pria & wanita 20–35 tahun, pekerja urban beraktivitas tinggi di luar ruangan.</td></tr>
        <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:10px 0;font-weight:700;color:#0f172a">Kebutuhan Utama</td><td style="padding:10px 0">Pembersihan kulit kepala dari residu polusi dan ketombe ringan tanpa membuat batang rambut kering.</td></tr>
        <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:10px 0;font-weight:700;color:#0f172a">Konsep & Vibe</td><td style="padding:10px 0">Clean, fresh, modern, salon-grade daily care, premium affordable.</td></tr>
        <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:10px 0;font-weight:700;color:#0f172a">Karakter Tekstur</td><td style="padding:10px 0">Gel bening ringan, busa melimpah dan halus, sangat mudah dibilas tanpa residu licin.</td></tr>
        <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:10px 0;font-weight:700;color:#0f172a">Aroma (Fragrance)</td><td style="padding:10px 0">Fresh citrus & herbal tea yang menenangkan dan tidak menyengat.</td></tr>
        <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:10px 0;font-weight:700;color:#0f172a">Arah Formula</td><td style="padding:10px 0">Sulfate-free, silicone-free, diperkaya Salicylic Acid & Tea Tree Extract. Terbuka pada rekomendasi bahan aktif R&D.</td></tr>
        <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:10px 0;font-weight:700;color:#0f172a">Kemasan & Ukuran</td><td style="padding:10px 0">Botol silinder PET transparan 250 ml dengan pump hitam matte dan label anti-air.</td></tr>
        <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:10px 0;font-weight:700;color:#0f172a">Target Harga Jual</td><td style="padding:10px 0">Rp150.000 – Rp200.000 (Target HPP produksi: Rp35.000 – Rp45.000).</td></tr>
        <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:10px 0;font-weight:700;color:#0f172a">Jumlah Batch Pertama</td><td style="padding:10px 0">1.000 pcs (menyesuaikan opsi MOQ manufaktur).</td></tr>
        <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:10px 0;font-weight:700;color:#0f172a">Referensi Pasar</td><td style="padding:10px 0">Sensasi busa seperti Brand X, aroma herbal seperti Brand Y.</td></tr>
        <tr><td style="padding:10px 0;font-weight:700;color:#0f172a">Target Klaim BPOM</td><td style="padding:10px 0">Cleanses Gently, Refreshes Scalp, For Daily Use, Dermatologically Tested.</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="kesalahan-yang-sering-terjadi" style="color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em">Kesalahan Umum Saat Membuat Brief Haircare</h2>
  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Agar proses pembuatan produk berjalan lancar tanpa membuang waktu dan modal, hindari 4 kesalahan umum berikut:</p>

  <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:16px;margin:24px 0 32px">
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px">
      <h3 style="color:#0f172a;font-size:16px;font-weight:700;margin:0 0 8px">1. Terlalu Fokus pada Moodboard</h3>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0">Moodboard desain memang memanjakan mata, tetapi jika tidak disertai target audiens dan fungsi produk, formulator tetap kesulitan meracik formula yang tepat sasaran.</p>
    </div>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px">
      <h3 style="color:#0f172a;font-size:16px;font-weight:700;margin:0 0 8px">2. Minta Meniru 100% Produk Lain</h3>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0">Membawa sampel produk lain sebagai referensi tekstur sangat baik, namun formula dan identitas harus dirancang orisinal agar brand Anda memiliki karakter unik.</p>
    </div>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px">
      <h3 style="color:#0f172a;font-size:16px;font-weight:700;margin:0 0 8px">3. Menutup Mata dari Anggaran HPP</h3>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0">Menginginkan puluhan bahan aktif mahal tanpa menghitung harga jual akhir akan berujung pada produk yang terlalu mahal untuk dibeli oleh target pasar Anda.</p>
    </div>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px">
      <h3 style="color:#0f172a;font-size:16px;font-weight:700;margin:0 0 8px">4. Menyamaratakan Biaya Semua Produk</h3>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0">Biaya pembuatan shampoo berbahan dasar air berbeda signifikan dibanding hair serum berbahan dasar lipid pekat atau hair mask dengan emulsi tebal.</p>
    </div>
  </div>

  <h2 id="dari-brief-menjadi-produk-haircare-brand-anda" style="color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em">Dari Brief Menjadi Produk Jadi Bersama Dreamlab</h2>
  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Membuat brief produk haircare sejatinya bukanlah proses yang rumit. Cukup jawab 4 pertanyaan fundamental: <strong>siapa penggunanya, masalah apa yang ingin diselesaikan, bagaimana tekstur serta aromanya, dan di kisaran harga berapa produk ini akan dijual?</strong></p>

  <p style="color:#2a2a2a;font-size:16px;line-height:1.75;margin:0 0 16px">Sebagai partner manufaktur dengan filosofi <strong>Beyond Manufacturing</strong>, Dreamlab siap mendampingi Anda menerjemahkan selembar brief menjadi rangkaian produk nyata berstandar CPKB Grade A. Melalui komitmen <strong>1 Client = 1 Formula</strong>, resep formula haircare Anda dijamin eksklusif dan tidak akan pernah diberikan ke brand lain.</p>

  <figure style="text-align:center;margin:40px 0 24px">
    <a href="https://dreamlab.id/thankyou/google/" target="_blank" rel="noopener noreferrer">
      <img class="bv-tag-attr-replace bv-lazyload-tag-img" bv-data-src="/assets/images/blog/dreamlab_maklonkosmetik_artikel_akhir.png" src="/assets/images/blog/dreamlab_maklonkosmetik_artikel_akhir.png" alt="Maklon Haircare Dreamlab" style="width:100%;max-width:720px;height:auto;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,0.06);display:block;margin:0 auto" />
    </a>
  </figure>

  <div style="text-align:center;margin:44px 0 36px">
    <a href="https://dreamlab.id/thankyou/google/" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#D98A00;color:#ffffff;font-size:16px;font-weight:800;padding:16px 38px;border-radius:50px;text-decoration:none;box-shadow:0 4px 16px rgba(217,138,0,0.3);letter-spacing:0.02em;transition:all 0.2s ease">Bahas Ide Haircare Anda Bersama Dreamlab</a>
    <p style="color:#64748b;font-size:13px;margin:12px 0 0">Diskusikan konsep brief, sample formula, dan estimasi biaya tanpa komitmen awal.</p>
  </div>

  <h2 id="faq-brief-haircare" style="color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em">Pertanyaan yang Sering Diajukan (FAQ)</h2>

  <details style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;margin-bottom:14px;cursor:pointer">
    <summary style="font-weight:700;color:#0f172a;font-size:16px;outline:none">Apakah saya harus sudah memiliki formula kimia sebelum maklon haircare?</summary>
    <p style="color:#334155;font-size:15px;line-height:1.7;margin:12px 0 0">Tidak perlu. Anda cukup menyiapkan konsep produk, target pengguna, masalah rambut yang ingin ditangani, preferensi tekstur, serta aroma. Tim apoteker dan formulator R&D Dreamlab yang akan meracik dan menguji formula laboratorium hingga sesuai dengan ekspektasi Anda.</p>
  </details>

  <details style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;margin-bottom:14px;cursor:pointer">
    <summary style="font-weight:700;color:#0f172a;font-size:16px;outline:none">Apakah saya bisa memulai brand haircare dengan satu produk hero saja?</summary>
    <p style="color:#334155;font-size:15px;line-height:1.7;margin:12px 0 0">Sangat bisa. Memulai dengan satu hero product (seperti Daily Shampoo atau Scalp Serum) justru sangat disarankan bagi brand baru untuk menguji respons pasar dan menjaga efisiensi modal. Produk pendamping seperti conditioner atau hair tonic dapat dikembangkan di fase berikutnya.</p>
  </details>

  <details style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;margin-bottom:14px;cursor:pointer">
    <summary style="font-weight:700;color:#0f172a;font-size:16px;outline:none">Berapa MOQ dan biaya maklon shampoo di Dreamlab?</summary>
    <p style="color:#334155;font-size:15px;line-height:1.7;margin:12px 0 0">MOQ dan total biaya bervariasi bergantung pada jenis bahan aktif (standar vs bioteknologi impor), volume kemasan (100 ml vs 250 ml), dan jenis botol pump. Untuk lini tertentu produksi dapat dimulai dari 1.000 pcs dengan simulasi biaya transparan yang dapat Anda diskusikan bersama tim Business Consultant Dreamlab.</p>
  </details>

  <details style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;margin-bottom:14px;cursor:pointer">
    <summary style="font-weight:700;color:#0f172a;font-size:16px;outline:none">Apa saja dokumen dan informasi yang perlu disiapkan sebelum konsultasi pertama?</summary>
    <p style="color:#334155;font-size:15px;line-height:1.7;margin:12px 0 0">Cukup siapkan lembar brief sederhana berisi: jenis produk yang diinginkan, target audiens, manfaat utama, 1–2 referensi produk pembanding, perkiraan target harga jual, dan estimasi modal awal jika sudah ada. Tim Dreamlab akan membantu memandu langkah teknis selanjutnya.</p>
  </details>

  <footer style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;color:#64748b;font-size:13px;line-height:1.6">
    <p style="font-weight:700;color:#475569;margin:0 0 6px">Referensi & Regulasi Terkait:</p>
    <ul style="margin:0;padding-left:18px">
      <li>Badan Pengawas Obat dan Makanan (BPOM RI): Pedoman Teknis Pengawasan Klaim Kosmetika dan Penerapan CPKB</li>
      <li>International Journal of Cosmetic Science: Scalp Care Formulations and Surfactant Compatibility</li>
      <li>Kementerian Perindustrian Republik Indonesia: Standarisasi Industri Manufaktur Produk Kosmetik Nasional</li>
    </ul>
  </footer>
</div>`;

const newArticle = {
  slug,
  title,
  publishDate,
  author,
  categories,
  featuredImage,
  excerpt,
  content: htmlContent,
  seo
};

const articlesFilePath = path.resolve('src/data/articles.ts');
let fileContent = fs.readFileSync(articlesFilePath, 'utf-8');

if (fileContent.includes(`"${slug}"`) || fileContent.includes(`'${slug}'`)) {
  console.log(`Article with slug ${slug} already exists!`);
} else {
  const closingIndex = fileContent.indexOf('];\n\n// City pages');
  if (closingIndex === -1) {
    console.error('Could not find closing of articles array!');
    process.exit(1);
  }

  const newArticleCode = `,\n  ${JSON.stringify(newArticle, null, 2)}`;
  const updatedContent = fileContent.slice(0, closingIndex) + newArticleCode + '\n' + fileContent.slice(closingIndex);
  fs.writeFileSync(articlesFilePath, updatedContent, 'utf-8');
  console.log('Article successfully appended to src/data/articles.ts!');
}
