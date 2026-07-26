import { readFileSync } from 'fs';

const src = readFileSync('src/lib/article-overrides.ts', 'utf8');
const marker = '/trend-aroma-parfum-disukai-market-2026';
const idx = src.indexOf(marker);
const contentStart = src.indexOf('content: "', idx);

// Show 250 chars around the nav/instagram boundary
const navPos = src.indexOf('</nav>', contentStart);
if (navPos >= 0) {
  const from = navPos;
  const to = navPos + 200;
  console.log('=== FROM </nav> ===');
  console.log(JSON.stringify(src.substring(from, to)));
  console.log('=== END ===');
}
