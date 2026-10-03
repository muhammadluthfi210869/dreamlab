import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { convertLead } from '../src/lib/round-robin-db';

async function main() {
  console.log('--- TEST 15 SEQUENTIAL LEADS EQUALITY (3 NUMBERS: ANNISA, DIAZ, JESSICA) ---');
  const counts: Record<string, number> = {};
  const sequence: string[] = [];

  for (let i = 1; i <= 15; i++) {
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

  console.log('Sequence of 15 leads:', sequence.join(' -> '));
  console.log('Counts per BusDev:', JSON.stringify(counts));

  // Verifikasi Irma sama sekali tidak masuk
  if (counts['Irma'] || sequence.includes('Irma')) {
    console.error('❌ CRITICAL FAILURE: Irma still present in round robin!', { counts, sequence });
    process.exit(1);
  }

  const vals = Object.values(counts);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const diff = max - min;

  console.log(`Max diff: ${diff}`);
  if (diff <= 1 && Object.keys(counts).length === 3) {
    console.log('✅ PERFECT EQUALITY PASSED: All 3 active BusDev reps (Annisa, Diaz, Jessica) received equal leads and Irma is completely excluded!');
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
