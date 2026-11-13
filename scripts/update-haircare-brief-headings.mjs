import fs from 'fs';
import path from 'path';

const articlesFilePath = path.resolve('src/data/articles.ts');
let content = fs.readFileSync(articlesFilePath, 'utf-8');

const targetSlug = '/cara-membuat-brief-produk-haircare';
const slugIdx = content.indexOf(`"slug": "${targetSlug}"`);
if (slugIdx === -1) {
  console.error("Article slug not found!");
  process.exit(1);
}

// Find the boundaries of this article object
const nextArticleIdx = content.indexOf('// City pages are maintained', slugIdx);
if (nextArticleIdx === -1) {
  console.error("End of article not found!");
  process.exit(1);
}

let articleSection = content.slice(slugIdx, nextArticleIdx);

// 1. Update Table of Contents
const oldTocPattern = /<ol style=\\"margin:0;padding-left:22px;color:#4a6fa5;font-size:15px;line-height:1\.8\\">[\\s\\S]*?<\/ol>/;
const newToc = `<ol style=\\"margin:0;padding-left:22px;color:#4a6fa5;font-size:15px;line-height:1.8\\">
      <li>
        <a href=\\"#panduan-menyusun-brief-produk-haircare\\" style=\\"color:#4a6fa5;text-decoration:none;font-weight:600\\">Panduan 8 Langkah Menyusun Brief Produk Haircare</a>
        <ul style=\\"margin:6px 0 10px;padding-left:20px;font-weight:normal;line-height:1.7\\">
          <li><a href=\\"#1-tentukan-target-konsumen\\" style=\\"color:#4a6fa5;text-decoration:none\\">1. Tentukan Target Konsumen</a></li>
          <li><a href=\\"#2-pilih-produk-dan-fungsi-utamanya\\" style=\\"color:#4a6fa5;text-decoration:none\\">2. Pilih Produk dan Fungsi Utamanya</a></li>
          <li><a href=\\"#3-jelaskan-konsep-dan-pembeda-produk\\" style=\\"color:#4a6fa5;text-decoration:none\\">3. Jelaskan Konsep dan Pembeda Produk</a></li>
          <li><a href=\\"#4-tentukan-arah-formula-dan-bahan\\" style=\\"color:#4a6fa5;text-decoration:none\\">4. Tentukan Arah Formula dan Bahan</a></li>
          <li><a href=\\"#5-tentukan-klaim-produk-sejak-awal\\" style=\\"color:#4a6fa5;text-decoration:none\\">5. Tentukan Klaim Produk Sejak Awal</a></li>
          <li><a href=\\"#6-siapkan-referensi-kemasan-dan-ukuran\\" style=\\"color:#4a6fa5;text-decoration:none\\">6. Siapkan Referensi Kemasan dan Ukuran</a></li>
          <li><a href=\\"#7-tentukan-budget-hpp-moq-dan-target-produksi\\" style=\\"color:#4a6fa5;text-decoration:none\\">7. Tentukan Budget, HPP, MOQ, dan Target Produksi</a></li>
          <li><a href=\\"#8-siapkan-pertanyaan-untuk-partner-maklon\\" style=\\"color:#4a6fa5;text-decoration:none\\">8. Siapkan Pertanyaan Kritis untuk Partner Maklon</a></li>
        </ul>
      </li>
      <li><a href=\\"#contoh-brief-produk-haircare\\" style=\\"color:#4a6fa5;text-decoration:none\\">Contoh Brief Produk Haircare Siap Pakai (Daily Scalp Shampoo)</a></li>
      <li><a href=\\"#kesalahan-yang-sering-terjadi\\" style=\\"color:#4a6fa5;text-decoration:none\\">Kesalahan Umum Saat Membuat Brief Haircare</a></li>
      <li><a href=\\"#dari-brief-menjadi-produk-haircare-brand-anda\\" style=\\"color:#4a6fa5;text-decoration:none\\">Dari Brief Menjadi Produk Jadi Bersama Dreamlab</a></li>
      <li><a href=\\"#faq-brief-haircare\\" style=\\"color:#4a6fa5;text-decoration:none\\">Pertanyaan yang Sering Diajukan (FAQ)</a></li>
    </ol>`;

articleSection = articleSection.replace(oldTocPattern, newToc);

// 2. Replace "Apa Itu Brief..." H2 with descriptive H2
articleSection = articleSection.replace(
  '<h2 id=\\"apa-itu-brief-produk-haircare\\" style=\\"color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em\\">Apa Itu Brief Produk Haircare dan Mengapa Penting?</h2>',
  '<h2 id=\\"panduan-menyusun-brief-produk-haircare\\" style=\\"color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em\\">Panduan 8 Langkah Menyusun Brief Produk Haircare Sebelum Maklon</h2>'
);

// 3. Convert steps 1-8 from H2 to H3
const h3Style = 'style=\\"color:#1e293b;font-size:20px;font-weight:700;line-height:1.4;margin:32px 0 12px\\"';

articleSection = articleSection.replace(
  '<h2 id=\\"1-tentukan-target-konsumen\\" style=\\"color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em\\">1. Tentukan Target Konsumen</h2>',
  `<h3 id=\\"1-tentukan-target-konsumen\\" ${h3Style}>1. Tentukan Target Konsumen</h3>`
);

articleSection = articleSection.replace(
  '<h2 id=\\"2-pilih-produk-dan-fungsi-utamanya\\" style=\\"color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em\\">2. Pilih Produk dan Fungsi Utamanya</h2>',
  `<h3 id=\\"2-pilih-produk-dan-fungsi-utamanya\\" ${h3Style}>2. Pilih Produk dan Fungsi Utamanya</h3>`
);

articleSection = articleSection.replace(
  '<h2 id=\\"3-jelaskan-konsep-dan-pembeda-produk\\" style=\\"color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em\\">3. Jelaskan Konsep dan Pembeda Produk</h2>',
  `<h3 id=\\"3-jelaskan-konsep-dan-pembeda-produk\\" ${h3Style}>3. Jelaskan Konsep dan Pembeda Produk</h3>`
);

articleSection = articleSection.replace(
  '<h2 id=\\"4-tentukan-arah-formula-dan-bahan\\" style=\\"color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em\\">4. Tentukan Arah Formula dan Bahan</h2>',
  `<h3 id=\\"4-tentukan-arah-formula-dan-bahan\\" ${h3Style}>4. Tentukan Arah Formula dan Bahan</h3>`
);

articleSection = articleSection.replace(
  '<h2 id=\\"5-tentukan-klaim-produk-sejak-awal\\" style=\\"color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em\\">5. Tentukan Klaim Produk Sejak Awal</h2>',
  `<h3 id=\\"5-tentukan-klaim-produk-sejak-awal\\" ${h3Style}>5. Tentukan Klaim Produk Sejak Awal</h3>`
);

articleSection = articleSection.replace(
  '<h2 id=\\"6-siapkan-referensi-kemasan-dan-ukuran\\" style=\\"color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em\\">6. Siapkan Referensi Kemasan dan Ukuran</h2>',
  `<h3 id=\\"6-siapkan-referensi-kemasan-dan-ukuran\\" ${h3Style}>6. Siapkan Referensi Kemasan dan Ukuran</h3>`
);

articleSection = articleSection.replace(
  '<h2 id=\\"7-tentukan-budget-hpp-moq-dan-target-produksi\\" style=\\"color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em\\">7. Tentukan Budget, HPP, MOQ, dan Target Produksi</h2>',
  `<h3 id=\\"7-tentukan-budget-hpp-moq-dan-target-produksi\\" ${h3Style}>7. Tentukan Budget, HPP, MOQ, dan Target Produksi</h3>`
);

articleSection = articleSection.replace(
  '<h2 id=\\"8-siapkan-pertanyaan-untuk-partner-maklon\\" style=\\"color:#0f172a;font-size:24px;font-weight:700;line-height:1.35;margin:40px 0 16px;letter-spacing:-0.02em\\">8. Siapkan Pertanyaan Kritis untuk Partner Maklon</h2>',
  `<h3 id=\\"8-siapkan-pertanyaan-untuk-partner-maklon\\" ${h3Style}>8. Siapkan Pertanyaan Kritis untuk Partner Maklon</h3>`
);

// 4. Adjust inner mini-headings from h3 to h4 for clean hierarchy
articleSection = articleSection.replace(
  '<h3 style=\\"color:#0f172a;font-size:17px;font-weight:700;margin:0 0 12px\\">Format Brief Target Konsumen:</h3>',
  '<h4 style=\\"color:#0f172a;font-size:16px;font-weight:700;margin:0 0 12px\\">Format Brief Target Konsumen:</h4>'
);

articleSection = articleSection.replace(
  '<h3 style=\\"color:#9f1239;font-size:16px;font-weight:700;margin:0 0 8px;display:flex;align-items:center;gap:8px\\">',
  '<h4 style=\\"color:#9f1239;font-size:16px;font-weight:700;margin:0 0 8px;display:flex;align-items:center;gap:8px\\">'
).replace(
  '<h3 style=\\"color:#166534;font-size:16px;font-weight:700;margin:0 0 8px;display:flex;align-items:center;gap:8px\\">',
  '<h4 style=\\"color:#166534;font-size:16px;font-weight:700;margin:0 0 8px;display:flex;align-items:center;gap:8px\\">'
);

articleSection = articleSection.replace(
  '<h3 style=\\"color:#0f172a;font-size:17px;font-weight:700;margin:0 0 12px\\">Daftar Pertanyaan Wajib Diajukan:</h3>',
  '<h4 style=\\"color:#0f172a;font-size:16px;font-weight:700;margin:0 0 12px\\">Daftar Pertanyaan Wajib Diajukan:</h4>'
);

// Put updated section back
content = content.slice(0, slugIdx) + articleSection + content.slice(nextArticleIdx);
fs.writeFileSync(articlesFilePath, content, 'utf-8');
console.log("Successfully updated headings in src/data/articles.ts!");
