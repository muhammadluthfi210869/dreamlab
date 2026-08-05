// test-round-robin-http.ts — HTTP-level test semua endpoint round-robin
const BASE = 'http://127.0.0.1:3100';

let passed = 0;
let failed = 0;
function check(name, cond, detail = '') {
  if (cond) { passed++; console.log('  [PASS] ' + name); }
  else { failed++; console.log('  [FAIL] ' + name + (detail ? ' -> ' + detail : '')); }
}

async function getNext(vid?: string, cookie?: string) {
  const url = BASE + '/api/lead-capture/next' + (vid ? '?vid=' + encodeURIComponent(vid) : '');
  const headers: any = {};
  if (cookie) headers.Cookie = cookie;
  const res = await fetch(url, { headers });
  return { res, data: await res.json().catch(() => null) };
}

function extractVidCookie(res: Response): string {
  const sc = res.headers.get('set-cookie') || '';
  const m = sc.match(/dreamlab_vid=[^;]+/);
  return m ? m[0] : '';
}

async function main() {
  console.log('\n==================================================');
  console.log('  HTTP TEST ROUND-ROBIN ENDPOINTS');
  console.log('  Base: ' + BASE);
  console.log('==================================================');

  // 1. next — visitor baru (tanpa cookie)
  console.log('\n-- 1. GET /api/lead-capture/next --');
  const fresh = await getNext();
  check('1a: status 200', fresh.res.status === 200, String(fresh.res.status));
  check('1b: response punya id/name/phoneNumber/orderIndex', !!(fresh.data.id && fresh.data.phoneNumber && fresh.data.name !== undefined && fresh.data.orderIndex !== undefined), JSON.stringify(fresh.data));
  const vidCookie = extractVidCookie(fresh.res);
  check('1c: Set-Cookie dreamlab_vid ada', !!vidCookie, vidCookie || '(tidak ada)');

  // 2. sticky — visitor sama pakai cookie
  const again = await getNext(undefined, vidCookie);
  check('2a: visitor sama (cookie) -> CS SAMA', again.data.id === fresh.data.id, fresh.data.id + ' vs ' + again.data.id);

  // 3. visitor baru lewat ?vid=
  const v1 = await getNext('http-vid-1');
  const v2 = await getNext('http-vid-2');
  check('3a: dua visitor beda via vid', v1.data.id !== v2.data.id, v1.data.id + ' vs ' + v2.data.id);

  // 4. GET /api/round-robin/next (legacy shape: phone, busdev_id, assignmentMethod)
  console.log('\n-- 4. GET /api/round-robin/next (legacy) --');
  const legacy = await fetch(BASE + '/api/round-robin/next');
  const legacyData = await legacy.json();
  check('4a: status 200 + shape legacy', legacy.status === 200 && !!legacyData.phone && !!legacyData.busdev_id && legacyData.assignmentMethod === 'db', JSON.stringify(legacyData));

  // 5. GET /api/lead-assignment (legacy)
  console.log('\n-- 5. GET /api/lead-assignment (legacy) --');
  const la = await fetch(BASE + '/api/lead-assignment');
  const laData = await la.json();
  check('5a: status 200 + phone/agentId/assignmentMethod', la.status === 200 && !!laData.phone && !!laData.agentId && laData.assignmentMethod === 'db', JSON.stringify(laData));

  // 6. POST /api/lead-capture/track — happy path
  console.log('\n-- 6. POST /api/lead-capture/track --');
  const trackRes = await fetch(BASE + '/api/lead-capture/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ intent: 'http-test', source: 'organic', visitorId: 'http-lead-1', pageUrl: '/http', assignedName: 'CS 1', assignedPhone: '08123456789' }),
  });
  const trackData = await trackRes.json();
  check('6a: status 200 + trackingCode DL-*', trackRes.status === 200 && /^DL-\d{8}-/.test(trackData.trackingCode), JSON.stringify(trackData));
  check('6b: waUrl 62812', trackData.waUrl === 'https://wa.me/628123456789', trackData.waUrl);

  // 7. track — body tidak valid (garbage)
  console.log('\n-- 7. POST track — body invalid --');
  const badRes = await fetch(BASE + '/api/lead-capture/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: 'not-json{{{',
  });
  check('7a: body invalid -> tetap 200 (req.json().catch({}) aman)', badRes.status === 200, String(badRes.status));

  // 8. round-robin-stats tanpa auth
  console.log('\n-- 8. GET /api/round-robin-stats --');
  const statsRes = await fetch(BASE + '/api/round-robin-stats');
  check('8a: tanpa key -> 401', statsRes.status === 401, String(statsRes.status));

  console.log('\n==================================================');
  console.log('  HASIL: ' + passed + ' PASS, ' + failed + ' FAIL');
  console.log('==================================================');
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => { console.error('FATAL:', e); process.exit(2); });
