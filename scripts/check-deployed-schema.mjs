import https from 'https';
import { readFileSync } from 'fs';

const url = process.argv[2] || 'https://www.dreamlab.id/produk/bodycare/body-lotion/';

https.get(url, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const regex = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
    let match;
    let found = 0;
    while ((match = regex.exec(data)) !== null) {
      found++;
      try {
        const parsed = JSON.parse(match[1]);
        const items = parsed['@graph'] || [parsed];
        for (const item of items) {
          if (item['@type'] === 'Product') {
            console.log('✅ Product schema found:', item.name);
            console.log('   offers:', item.offers ? '✅ PRESENT' : '❌ MISSING');
            if (item.offers) {
              console.log('   offers.priceSpecification:', item.offers.priceSpecification?.price || 'N/A');
            }
            console.log('   hasMerchantReturnPolicy:', item.hasMerchantReturnPolicy ? '✅ PRESENT' : '❌ MISSING');
            console.log('   shippingDetails:', item.shippingDetails ? '✅ PRESENT' : '❌ MISSING');
          }
        }
      } catch (e) {
        console.log('Parse error:', e.message);
      }
    }
    if (found === 0) console.log('No JSON-LD found');
  });
}).on('error', e => console.log('Error:', e.message));
