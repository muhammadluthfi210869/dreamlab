import { readFileSync, writeFileSync } from 'fs';

const j = JSON.parse(
  readFileSync('/Users/revitayustianawati/dreamlab/scripts/trend-parfum-output.json', 'utf8')
);

let html = j.content;

// 1. Fix H1 - it was rendered as <p># 2 Trend Aroma...</p> instead of just intro paragraph
html = html.replace('<p># 2 Trend Aroma Parfum yang Disukai Market Sekarang</p>\n', '');

// 2. Replace "modern gourmet" with "modern gourmand" (markdown has gourmand, but script used gourmet)
html = html.replace(/gourmet/g, 'gourmand');

// 3. Add tengah figure after "Kombinasi base notes..." paragraph (before next h2)
// Find the position after "yang terasa generik" (end of the premium section)
html = html.replace(
  'meski arah aromanya sama-sama sedang tren.</p>\n\n<h2 id=',
  'meski arah aromanya sama-sama sedang tren.</p>\n<figure class="wp-block-image size-large" style="margin:40px 0;text-align:center"><a href="/thankyou/google/"><img src="/assets/images/blog/dreamlab_maklonkosmetik_artikel_tengah.png" alt="Konsultasi gratis maklon parfum Dreamlab" style="width:100%;height:auto;max-width:896px;border-radius:12px" width="896" height="504" loading="lazy" /></a></figure>\n<h2 id='
);

// 4. Add akhir figure before CTA section
html = html.replace(
  '<div style="text-align:center;margin:48px 0;padding:40px 24px;background:linear-gradient',
  '<figure class="wp-block-image size-large" style="margin:40px 0;text-align:center"><a href="/thankyou/google/"><img src="/assets/images/blog/dreamlab_maklonkosmetik_artikel_akhir.png" alt="Konsultasi gratis maklon parfum Dreamlab" style="width:100%;height:auto;max-width:896px;border-radius:12px" width="896" height="504" loading="lazy" /></a></figure>\n<div style="text-align:center;margin:48px 0;padding:40px 24px;background:linear-gradient'
);

// Output the HTML as a JS-escaped string suitable for articles.ts content field
const jsonString = JSON.stringify(html);
writeFileSync('/Users/revitayustianawati/dreamlab/scripts/trend-parfum-content-string.txt', jsonString);

// Also generate a partial override file
writeFileSync('/Users/revitayustianawati/dreamlab/scripts/trend-parfum-array-output.txt', html);
console.log('Done! Content length:', html.length);
console.log('Has gourmand:', html.includes('gourmand'));
console.log('Has tengah figure:', html.includes('artikel_tengah'));
console.log('Has akhir figure:', html.includes('artikel_akhir'));
console.log('Has CTA:', html.includes('Konsultasi Gratis Sekarang'));
