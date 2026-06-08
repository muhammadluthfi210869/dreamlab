import seoMappingData from '../src/data/seo-mapping.json';

interface SeoMappingItem {
  source: string;
  destination: string;
  permanent?: boolean;
}

const seoMapping = seoMappingData as SeoMappingItem[];

async function testRedirects() {
  console.log('🔗 Testing Redirect Integrity (Simulated)...');
  
  const results = {
    total: seoMapping.length,
    valid: 0,
    invalid: 0,
    gaps: [] as string[]
  };

  seoMapping.forEach(item => {
    // 1. Ensure source is not empty
    if (!item.source) {
        results.invalid++;
        return;
    }

    // 2. Check if it's a redirect or a stay
    if (item.source === item.destination || item.destination === `${item.source}/`) {
        results.valid++;
        return;
    }

    // 3. Check for external destinations or root-relative
    if (item.destination.startsWith('/') || item.destination.startsWith('http')) {
        results.valid++;
    } else {
        results.invalid++;
        results.gaps.push(`${item.source} -> Invalid Destination: ${item.destination}`);
    }
  });

  console.log(`\n--- REDIRECT REPORT ---`);
  console.log(`✅ Total Mapped: ${results.total}`);
  console.log(`🟢 Valid Mappings: ${results.valid}`);
  console.log(`🔴 Issues Detected: ${results.invalid}`);

  if (results.gaps.length > 0) {
    console.log('\n--- ISSUES TO FIX ---');
    results.gaps.slice(0, 10).forEach(g => console.log(`- ${g}`));
  }

  if (results.invalid === 0) {
    console.log('\n✨ ALL REDIRECTS ARE SAFE.');
  }
}

testRedirects().catch(console.error);
