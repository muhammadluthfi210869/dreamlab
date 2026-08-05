// test-db-down.ts — verifikasi error propagation saat DB tidak terjangkau
import { getNextAgentFromDb } from '../src/lib/round-robin-db.ts';

async function main() {
  console.log('-- TEST DB DOWN (URL mati) --');
  try {
    await getNextAgentFromDb('test-dbdown');
    console.log('  [FAIL] tidak error padahal DB mati');
  } catch (e: any) {
    const msg = e?.message || String(e);
    console.log('  [PASS] error dilempar: ' + msg.split('\n')[0].slice(0, 80));
  }
  process.exit(0);
}
main();
