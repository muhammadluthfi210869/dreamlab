import seoMappingData from '../src/data/seo-mapping.json';

interface SeoMappingItem {
  source: string;
  destination: string;
}

const seoMapping = seoMappingData as SeoMappingItem[];
const BASE_URL = 'http://localhost:3001';

async function runSmokeTest() {
  console.log('🔥 Starting Runtime SEO Smoke Test...');
  console.log(`🌍 Targeting: ${BASE_URL}\n`);

  // We'll test 5 random URLs from the mapping + home page
  const testPaths = [
    '/',
    ...seoMapping
      .filter(m => m.source !== '/')
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map(m => m.source)
  ];

  for (const path of testPaths) {
    const url = `${BASE_URL}${path}`;
    try {
      console.log(`🔍 Testing: ${path}`);
      const response = await fetch(url, { redirect: 'manual' });
      
      if (response.status === 301 || response.status === 308) {
        const location = response.headers.get('location');
        console.log(`  ✅ REDIRECT ${response.status} -> ${location}`);
      } else if (response.status === 200) {
        console.log(`  ✅ OK 200`);
        // Check for basic SEO tags if it's 200
        const html = await response.text();
        const titleMatch = html.match(/<title>(.*?)<\/title>/);
        if (titleMatch) {
          console.log(`  📌 Title: ${titleMatch[1]}`);
        }
      } else {
        console.log(`  ❌ UNEXPECTED STATUS: ${response.status}`);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`  ❌ FAILED: ${message}`);
      if (message.includes('ECONNREFUSED')) {
        console.log('  💡 Hint: Is the Next.js server running on localhost:3000?');
        break;
      }
    }
  }
}

runSmokeTest().catch(console.error);
