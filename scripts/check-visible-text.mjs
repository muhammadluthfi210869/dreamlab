import https from 'https';

const url = 'https://www.dreamlab.id/biaya-maklon-parfum-moq-kecil/';
https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    // First, remove all script and style tags (including their content)
    let clean = d.replace(/<script[\s\S]*?<\/script>/gi, ' ');
    clean = clean.replace(/<style[\s\S]*?<\/style>/gi, ' ');
    clean = clean.replace(/<[^>]+>/g, ' ');
    clean = clean.replace(/\s+/g, ' ').trim();

    console.log('=== VISIBLE TEXT ANALYSIS ===');
    console.log('Text size (without scripts):', (clean.length / 1024).toFixed(0) + 'KB');
    console.log('Word count:', clean.split(/\s+/).length);

    // Now check the actual content - how much is next.js vs real markup
    const dNoScript = d.replace(/<script[\s\S]*?<\/script>/gi, ' ');
    const htmlSize = dNoScript.length;
    console.log('HTML without scripts:', (htmlSize / 1024).toFixed(0) + 'KB');

    // Check __NEXT_DATA__
    const ndMatch = d.match(/__NEXT_DATA__[\s\S]{0,50000}/);
    if (ndMatch) {
      console.log('\n__NEXT_DATA__ start:', ndMatch[0].substring(0, 200));
    }

    // Check how many unique chunks
    const chunkRe = /\/_next\/static\/chunks\//g;
    let chunkCount = 0;
    while (chunkRe.exec(d)) chunkCount++;
    console.log('Next.js static chunks references:', chunkCount);

    // Check actual article body length
    // Find where the main content starts
    const bodyMatch = d.match(/<body[\s\S]*?<\/body>/i);
    if (bodyMatch) {
      const bodyNoScript = bodyMatch[0].replace(/<script[\s\S]*?<\/script>/gi, ' ');
      const bodyText = bodyNoScript.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      console.log('Body text (no scripts):', (bodyText.length / 1024).toFixed(0) + 'KB');
      console.log('Body words (no scripts):', bodyText.split(/\s+/).length);
    }
  });
});
