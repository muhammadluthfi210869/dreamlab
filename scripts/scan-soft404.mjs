const urls = [
  'https://www.dreamlab.id/thankyoupage-google/',
  'https://www.dreamlab.id/thankyou-page/',
  'https://www.dreamlab.id/contact-form-dreamlab/',
  'https://www.dreamlab.id/cms_block_cat/pop-up-form/',
  'https://www.dreamlab.id/e-floating-buttons/popup-website/',
  'https://www.dreamlab.id/https-dreamlab-id-dreamlab-visit-ici-2026/',
  'https://www.dreamlab.id/maklon-kosmetik-terbaik-english/',
  'https://www.dreamlab.id/academy-beautypreneur/',
  'https://www.dreamlab.id/author/admin/',
  'https://www.dreamlab.id/author/admin/page/5/',
  'https://www.dreamlab.id/author/admin/page/8/',
  'https://www.dreamlab.id/author/admin/page/9/',
  'https://www.dreamlab.id/jadwalkanvisitmeeting.php',
  'https://www.dreamlab.id/panduan-maklon-deodorant-bpom/',
  'https://www.dreamlab.id/hair-care',
  'https://www.dreamlab.id/',
  'https://www.dreamlab.id/produk/bodycare/body-lotion/',
  'https://www.dreamlab.id/some-nonexistent-page/',
];

async function main() {
  console.log('URL → Status | Title\n');
  for (const url of urls) {
    try {
      const res = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(10000) });
      const text = await res.text();
      const title = (text.match(/<title>(.*?)<\/title>/i)?.[1] || '').trim();
      const isSoft404 = title.toLowerCase().includes('tidak ditemukan') || title.toLowerCase().includes('not found') || title.toLowerCase().includes('404');
      const flag = isSoft404 ? ' ⚠️ SOFT 404' : '';
      console.log(`[${res.status}]${flag} ${url}`);
      if (isSoft404) console.log(`         Title: ${title}`);
    } catch (e) {
      console.log(`[ERR] ${url}: ${e.message}`);
    }
  }
}

main().catch(console.error);
