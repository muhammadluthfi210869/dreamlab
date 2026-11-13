import fs from 'fs';
import path from 'path';

function cleanContent(fileContent) {
  let content = fileContent;

  // 1. Fix Kommo form links
  const kommoCount = (content.match(/https?:\/\/forms\.kommo\.com\/rctxldt/g) || []).length;
  content = content.replaceAll(/https?:\/\/forms\.kommo\.com\/rctxldt/g, 'https://dreamlab.id/thankyou/google/');

  // 2. Fix Wrong Thankyou links
  const thankyouCount = (content.match(/https:\/\/dreamlab\.id\/thankyou(?:-page|page)-google\/?(?=["'\s#?\\]|>|$)/g) || []).length;
  content = content.replaceAll(/https:\/\/dreamlab\.id\/thankyou(?:-page|page)-google\/?(?=["'\s#?\\]|>|$)/g, 'https://dreamlab.id/thankyou/google/');
  content = content.replaceAll(/(href=\\"?)\/thankyou(?:-page|page)-google\/?(?=["'\s#?\\]|>|$)/g, '$1https://dreamlab.id/thankyou/google/');

  // Fix corrupt https://google in sunscreen article cta
  content = content.replaceAll('href=\\"https://google\\"', 'href=\\"https://dreamlab.id/thankyou/google/\\"');

  // 3. Fix Corrupt URL tags
  const corruptUrls = [
    'http://Mulai Sekarang, Bukan Nanti Setiap hari yang kamu tunda adalah hari yang dipakai kompetitor untuk maju lebih jauh. Konsultasi pertama di Dreamlab gratis. Kamu bisa datang dengan konsep mentah sekalipun &#x2014; tim Dreamlab akan bantu kamu memetakan langkah konkret dari titik di mana kamu berada sekarang. Hubungi Dreamlab sekarang. Konsultasi gratis, tanpa komitmen. CPKB Grade A. Halal Certified. Produkmu layak dapat yang terbaik.',
    'http://Temukan 5 ide bisnis kosmetik paling menjanjikan di 2026! Pelajari cara menentukan margin, membangun brand, hingga memulai produksi dengan sistem maklon kosmetik Dreamlab Indonesia.',
    'http://Kalodata - The Best Tool for TikTok Shop Analytics &amp; Insights  Kalodata https://www.kalodata.com',
    'http://dreamlab'
  ];

  content = content.replaceAll(corruptUrls[0], 'https://dreamlab.id/thankyou/google/');
  content = content.replaceAll(corruptUrls[1], 'https://dreamlab.id/thankyou/google/');
  content = content.replaceAll(corruptUrls[2], 'https://www.kalodata.com');
  content = content.replaceAll('href=\\"http://dreamlab\\"', 'href=\\"https://dreamlab.id/\\"');

  // 4. Fix Broken Internal URLs (with strict boundary lookahead)
  const boundary = '(?=["\'\\s#?\\\\]|>|$)';
  const internalReplacements = [
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/kontak\\/?${boundary}`, 'g'), 'https://dreamlab.id/contact-us/'],
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/contact\\/?${boundary}`, 'g'), 'https://dreamlab.id/contact-us/'],
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/layanan-formulasi\\/?${boundary}`, 'g'), 'https://dreamlab.id/services/'],
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/alur-maklon\\/?${boundary}`, 'g'), 'https://dreamlab.id/about-us/alur-maklon/'],
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/produk\\/sunscreen\\/?${boundary}`, 'g'), 'https://dreamlab.id/produk/skincare/sunscreen/'],
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/maklon\\/sunscreen\\/?${boundary}`, 'g'), 'https://dreamlab.id/produk/skincare/sunscreen/'],
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/maklon\\/moisturizer\\/?${boundary}`, 'g'), 'https://dreamlab.id/produk/skincare/facial-moisturizer/'],
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/maklon-moisturizer\\/?${boundary}`, 'g'), 'https://dreamlab.id/produk/skincare/facial-moisturizer/'],
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/produk\\/skincare\\/face-serum\\/?${boundary}`, 'g'), 'https://dreamlab.id/produk/skincare/facial-serum/'],
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/maklon\\/face-cream\\/?${boundary}`, 'g'), 'https://dreamlab.id/produk/skincare/face-cream/'],
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/maklon\\/facial-wash\\/?${boundary}`, 'g'), 'https://dreamlab.id/produk/skincare/facial-wash/'],
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/maklon\\/facial-toner\\/?${boundary}`, 'g'), 'https://dreamlab.id/produk/skincare/facial-toner/'],
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/maklon\\/facial-serum\\/?${boundary}`, 'g'), 'https://dreamlab.id/produk/skincare/facial-serum/'],
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/produk\\/body-care\\/?${boundary}`, 'g'), 'https://dreamlab.id/produk/bodycare/'],
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/peluang-bisnis-maklon-body-care\\/?${boundary}`, 'g'), 'https://dreamlab.id/produk/bodycare/'],
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/cara-menghitung-hpp-produk-skincare\\/?${boundary}`, 'g'), 'https://dreamlab.id/cara-menghitung-hpp-kosmetik/'],
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/cara-daftar-bpom-kosmetik\\/?${boundary}`, 'g'), 'https://dreamlab.id/jasa-maklon-kosmetik-bpom-panduan-lengkap/'],
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/cara-memulai-bisnis-skincare-dari-nol\\/?${boundary}`, 'g'), 'https://dreamlab.id/cara-mulai-bisnis-skincare-dari-nol/'],
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/biaya-maklon-skincare-estimasi-lengkap\\/?${boundary}`, 'g'), 'https://dreamlab.id/biaya-maklon-skincare/'],
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/atur(?:%e2%80%91|\\u2011)kosmetik(?:%e2%80%91|\\u2011)halal(?:%e2%80%91|\\u2011)2026(?:%e2%80%91|\\u2011)dreamlab\\/?${boundary}`, 'g'), 'https://dreamlab.id/atur-kosmetik-halal-dreamlab/'],
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/panduan-lengkap-maklon-skincare-untuk-pemilik-brand-baru-dan-klien-aktif\\/?${boundary}`, 'g'), 'https://dreamlab.id/jasa-maklon-kosmetik-bpom-panduan-lengkap/'],
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/produk\\/lipcare\\/?${boundary}`, 'g'), 'https://dreamlab.id/produk/decorative/'],
    [new RegExp(`https:\\/\\/dreamlab\\.id\\/maklon\\/maklon-skincare\\/?${boundary}`, 'g'), 'https://dreamlab.id/produk/skincare/']
  ];

  let replacedInternalLinks = 0;
  for (const [pattern, target] of internalReplacements) {
    const matches = (content.match(pattern) || []).length;
    if (matches > 0) {
      replacedInternalLinks += matches;
      content = content.replaceAll(pattern, target);
    }
  }

  // 5. Clean Empty Figures without images
  const emptyFigureRegexes = [
    /<figure class=\\"wp-block-image size-large is-resized\\"><a href=\\"http:\/\/Saff &amp; Co\. - LOUI\\"><\/a><\/figure>/g,
    /<figure class=\\"wp-block-image size-full is-resized\\"><a href=\\"https:\/\/share\.google\/images\/Cxa7pVSpSbho90XVD\\"><\/a><\/figure>/g,
    /<figure class=\\"wp-block-image size-large\\"><a href=\\"https:\/\/dreamlab\.id\/\\"><\/a><figcaption class=\\"wp-element-caption\\">dreamlab menjadi partner yang cocok untuk kamu<\/figcaption><\/figure>/g,
    /<figure class=\\"wp-block-image size-large is-resized\\"><a href=\\"https:\/\/wa\.me\/62881027240339\?text=Hi%20saya%20ingin%20konsultasi%20untuk%20brand%20saya\\"><\/a><\/figure>/g,
    /<figure class=\\"wp-block-image size-large is-resized\\"><a href=\\"https:\/\/api\.whatsapp\.com\/send\/\?phone=62881027240339&amp;text=Hi\+saya\+ingin\+konsultasi\+untuk\+brand\+saya&amp;type=phone_number&amp;app_absent=0\\"><\/a><\/figure>/g,
    /<figure class=\\"wp-block-image size-large\\"><a href=\\"https:\/\/dreamlab\.id\/thankyou\/google\/\\"><\/a><figcaption class=\\"wp-element-caption\\">Dreamlab Indonesia menyediakan layanan maklon kosmetik lengkap mulai dari formulasi, desain kemasan, hingga izin BPOM <\/figcaption><\/figure>/g,
    /<figure class=\\"wp-block-image size-large is-resized\\"><figcaption class=\\"wp-element-caption\\">maklon set skincare desember di bulan ini serum day cream night cream<\/figcaption><\/figure>/g,
    /<figure class=\\"wp-block-image size-large is-resized\\"><figcaption class=\\"wp-element-caption\\">Dreamlab  Packaging Inner Tray <\/figcaption><\/figure>/g,
    /<figure class=\\"wp-block-image size-full is-resized\\"><figcaption class=\\"wp-element-caption\\">Dreamlab Eco-Friendly Luxury Box \(Sustainable\) <\/figcaption><\/figure>/g,
    /<figure class=\\"wp-block-image size-large\\"><a href=\\"https:\/\/dreamlab\.id\/\\"><\/a><figcaption class=\\"wp-element-caption\\">Maklon terbaik di indoneaia <\/figcaption><\/figure>/g,
    /<figure class=\\"wp-block-image size-large is-resized\\"><figcaption class=\\"wp-element-caption\\">Affiliate dan KOL untuk brand skincare<\/figcaption><\/figure>/g,
    /<figure class=\\"wp-block-image size-full is-resized\\"><a href=\\"https:\/\/api\.whatsapp\.com\/send\/\?phone=62881027240339&amp;text=Hi\+saya\+ingin\+konsultasi\+untuk\+brand\+saya&amp;type=phone_number&amp;app_absent=0\\"><\/a><\/figure>/g,
    /<figure class=\\"wp-block-image size-full\\"><a href=\\"https:\/\/api\.whatsapp\.com\/send\/\?phone=62881027240339&amp;text=Hi\+saya\+ingin\+konsultasi\+untuk\+brand\+saya&amp;type=phone_number&amp;app_absent=0\\"><\/a><\/figure>/g
  ];

  let emptyFiguresRemoved = 0;
  for (const reg of emptyFigureRegexes) {
    const matches = (content.match(reg) || []).length;
    if (matches > 0) {
      emptyFiguresRemoved += matches;
      content = content.replaceAll(reg, '');
    }
  }

  // 6. Clean Empty Lists
  const emptyListRegexes = [
    /<ol class=\\"wp-block-list\\">\\n<li><\/li>\\n<\/ol>/g,
    /<ul class=\\"wp-block-list\\"><\/ul>/g,
    /<ul class=\\"wp-block-list\\">\\n<li><\/li>\\n<\/ul>/g
  ];

  let emptyListsRemoved = 0;
  for (const reg of emptyListRegexes) {
    const matches = (content.match(reg) || []).length;
    if (matches > 0) {
      emptyListsRemoved += matches;
      content = content.replaceAll(reg, '');
    }
  }

  // 7. Fix Mojibake & Emojis
  const mojibakeReplacements = [
    ['ðŸ‘‰', '&rarr;'],
    ['ðŸ‘', '&rarr;'],
    ['ðŸ’¡Â\xa0', '&bull; '],
    ['ðŸ’¡\xa0', '&bull; '],
    ['ðŸ’¡', '&bull; '],
    ['ðŸŽ\x81', '&bull; '],
    ['ðŸŒ\x90Â\xa0', '&bull; '],
    ['ðŸŒ\x90', '&bull; '],
    ['ðŸ“²', '&bull; '],
    ['â€“', '&ndash;'],
    ['â€”', '&mdash;'],
    ['â€™', '&rsquo;'],
    ['â€˜', '&lsquo;'],
    ['â€œ', '&ldquo;'],
    ['â€\u009d', '&rdquo;'],
    ['â€ ', '&rdquo;'],
    ['â€¢', '&bull;'],
    ['Â±', '&plusmn;'],
    ['Â°', '&deg;'],
    ['Â\xa0', '&nbsp;'],
    ['❌', '&#10006;'],
    ['✅', '&#10004;'],
    ['🧪', ''],
    ['✨', '']
  ];

  let mojibakeFixed = 0;
  for (const [from, to] of mojibakeReplacements) {
    if (content.includes(from)) {
      const count = content.split(from).length - 1;
      mojibakeFixed += count;
      content = content.replaceAll(from, to);
    }
  }

  return {
    content,
    stats: {
      kommoCount,
      thankyouCount,
      replacedInternalLinks,
      emptyFiguresRemoved,
      emptyListsRemoved,
      mojibakeFixed
    }
  };
}

// 1. Clean src/data/articles.ts
const articlesPath = path.resolve(process.cwd(), 'src/data/articles.ts');
let articlesContent = fs.readFileSync(articlesPath, 'utf8');
const articlesRes = cleanContent(articlesContent);
fs.writeFileSync(articlesPath, articlesRes.content, 'utf8');
console.log('articles.ts stats:', articlesRes.stats);

// 2. Clean src/data/city-articles.ts
const cityPath = path.resolve(process.cwd(), 'src/data/city-articles.ts');
let cityContent = fs.readFileSync(cityPath, 'utf8');
const cityRes = cleanContent(cityContent);
fs.writeFileSync(cityPath, cityRes.content, 'utf8');
console.log('city-articles.ts stats:', cityRes.stats);
