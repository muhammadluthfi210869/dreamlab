import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { convertLead } from '../src/lib/round-robin-db';

async function main() {
  console.log('--- TEST 16 SEQUENTIAL LEADS EQUALITY ---');
  const counts: Record<string, number> = {};
  const sequence: string[] = [];

  for (let i = 1; i <= 16; i++) {
    const res = await convertLead({
      visitorId: `equality-visitor-${Date.now()}-${i}`,
      intent: 'equality-test',
      source: 'google-ads',
      pageUrl: '/produk/skincare',
      isTest: true,
    });
    sequence.push(res.name);
    counts[res.name] = (counts[res.name] || 0) + 1;
  }

  console.log('Sequence of 16 leads:', sequence.join(' -> '));
  console.log('Counts per BusDev:', JSON.stringify(counts));

  const vals = Object.values(counts);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const diff = max - min;

  console.log(`Max diff: ${diff}`);
  if (diff <= 1 && Object.keys(counts).length === 4) {
    console.log('✅ PERFECT EQUALITY PASSED: All 4 active BusDev reps received exactly equal leads!');
    process.exit(0);
  } else {
    console.error('❌ EQUALITY FAILED:', { diff, counts });
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
