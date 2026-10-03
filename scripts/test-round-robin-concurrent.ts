import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { convertLead } from '../src/lib/round-robin-db';

async function main() {
  console.log('--- TEST 60 CONCURRENT LEADS BURST ---');
  const counts: Record<string, number> = {};

  const requests = Array.from({ length: 60 }).map((_, i) =>
    convertLead({
      visitorId: `burst-visitor-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      intent: 'burst-test',
      source: 'meta-ads',
      pageUrl: '/ads/maklon-parfum',
      isTest: true,
    })
  );

  const results = await Promise.all(requests);

  for (const r of results) {
    counts[r.name] = (counts[r.name] || 0) + 1;
  }

  console.log('Results from 60 concurrent requests:', JSON.stringify(counts));

  // Verifikasi Irma sama sekali tidak masuk
  if (counts['Irma']) {
    console.error('❌ CRITICAL FAILURE: Irma received leads in concurrent test!', counts);
    process.exit(1);
  }

  const vals = Object.values(counts);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const diff = max - min;

  console.log(`Min: ${min}, Max: ${max}, Diff: ${diff}`);
  if (diff <= 1 && Object.keys(counts).length === 3) {
    console.log('✅ CONCURRENT BURST EQUALITY PASSED: 20 leads per rep (Annisa, Diaz, Jessica) with diff <= 1 and Irma is completely excluded!');
    process.exit(0);
  } else {
    console.error('❌ CONCURRENT BURST FAILED:', { diff, counts });
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
