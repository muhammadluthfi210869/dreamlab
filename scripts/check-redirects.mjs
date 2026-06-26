const urls = [
  'http://dreamlab.id/academy-beautypreneur/',
  'https://dreamlab.id/academy-beautypreneur/',
  'https://www.dreamlab.id/academy-beautypreneur/',
  'http://dreamlab.id/panduan-maklon-deodorant-bpom/',
  'https://dreamlab.id/panduan-maklon-deodorant-bpom/',
  'https://www.dreamlab.id/panduan-maklon-deodorant-bpom/',
  'http://dreamlab.id/hair-care',
  'https://www.dreamlab.id/hair-care',
  'https://dreamlab.id/thankyoupage-google/',
  'https://www.dreamlab.id/thankyoupage-google/',
];

async function followRedirects(url, maxDepth = 5) {
  const chain = [];
  let current = url;
  for (let i = 0; i < maxDepth; i++) {
    try {
      const res = await fetch(current, { redirect: 'manual', signal: AbortSignal.timeout(10000) });
      chain.push({ url: current, status: res.status });
      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get('location');
        if (!loc || loc === current) break;
        current = new URL(loc, current).href;
      } else {
        break;
      }
    } catch (e) {
      chain.push({ url: current, status: 'ERROR: ' + e.message });
      break;
    }
  }
  return chain;
}

async function main() {
  for (const url of urls) {
    const chain = await followRedirects(url);
    console.log(chain.map(c => `[${c.status}] ${c.url}`).join(' → '));
    console.log('');
  }
}

main().catch(console.error);
