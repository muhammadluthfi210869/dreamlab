/**
 * test-erp-bridge.ts — Batch 2 website-side bridge client tests.
 *
 * Uses Node's built-in `node:test` + `node:assert` (no new deps). Mocks
 * `globalThis.fetch` so we exercise the real `callErpBridge` end-to-end
 * without touching any real network or ERP.
 *
 * Run with: npx tsx scripts/test-erp-bridge.ts
 *
 * Coverage:
 *   - happy path → ok:true with ERP canonical code + destination
 *   - missing env → not-configured
 *   - 409 → conflict
 *   - 5xx → http-error
 *   - timeout → timeout (fetch throws AbortError)
 *   - malformed JSON → invalid-response
 *   - missing fields in JSON → invalid-response
 *   - NEXT_PUBLIC_ guard: ERP_BRIDGE_URL set to NEXT_PUBLIC_xxx → not-configured
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { callErpBridge, isErpBridgePubliclyEnabled } from '../src/lib/erp-bridge';

// We import AFTER resetting fetch so the module sees our mock.
type FetchFn = typeof fetch;
let originalFetch: FetchFn | undefined;
let nextResponse: Response | undefined;
let nextError: unknown;

function setNextResponse(res: Response) {
  nextResponse = res;
  nextError = undefined;
}
function setNextError(err: unknown) {
  nextResponse = undefined;
  nextError = err;
}

// Wire global fetch BEFORE the SUT runs any code. (Static import above is
// resolved by tsx before this assignment, but the SUT only reads fetch at
// call time, so this is safe.)
originalFetch = globalThis.fetch;
(globalThis as any).fetch = (async (_url: any, _init?: any) => {
  if (nextError !== undefined) throw nextError;
  if (nextResponse === undefined) throw new Error('No mock response set');
  return nextResponse;
}) as FetchFn;

const ENV_KEYS = ['ERP_BRIDGE_URL', 'ERP_BRIDGE_SECRET'];
function withEnv(env: Record<string, string | undefined>, fn: () => Promise<void> | void) {
  const saved: Record<string, string | undefined> = {};
  for (const k of ENV_KEYS) saved[k] = process.env[k];
  process.env = { ...process.env };
  for (const [k, v] of Object.entries(env)) {
    if (v === undefined) delete (process.env as any)[k];
    else (process.env as any)[k] = v;
  }
  return (async () => {
    try {
      await fn();
    } finally {
      process.env = { ...process.env };
      for (const [k, v] of Object.entries(saved)) {
        if (v === undefined) delete (process.env as any)[k];
        else (process.env as any)[k] = v;
      }
    }
  })();
}

// Top-level tests — node:test registers them and the harness runs them
// after the module is fully evaluated. Static import above makes the
// symbols available synchronously, so the closures capture them
// deterministically.

test('returns not-configured when env is missing', async () => {
  await withEnv({ ERP_BRIDGE_URL: undefined, ERP_BRIDGE_SECRET: undefined }, async () => {
    const out = await callErpBridge({
      websiteIntentId: 'DL-20260819-AAAA',
      assignedName: 'BUSDEV-A',
    });
    assert.equal(out.ok, false);
    if (!out.ok) assert.equal(out.error, 'not-configured');
  });
});

test('returns not-configured when env starts with NEXT_PUBLIC_', async () => {
  await withEnv(
    { ERP_BRIDGE_URL: 'NEXT_PUBLIC_erp', ERP_BRIDGE_SECRET: 'secret' },
    async () => {
      const out = await callErpBridge({
        websiteIntentId: 'DL-20260819-PUB',
        assignedName: 'BUSDEV-A',
      });
      assert.equal(out.ok, false);
      if (!out.ok) assert.equal(out.error, 'not-configured');
    },
  );
});

test('happy path returns ok:true with canonical tracking code', async () => {
  await withEnv(
    { ERP_BRIDGE_URL: 'https://erp.example/api', ERP_BRIDGE_SECRET: 'unit-test-secret' },
    async () => {
      setNextResponse(
        new Response(
          JSON.stringify({
            ok: true,
            leadId: 'lead-1',
            trackingCode: 'DLABC1234',
            waDestinationPhone: '628990000111',
            created: true,
          }),
          { status: 200, headers: { 'content-type': 'application/json' } },
        ),
      );
      const out = await callErpBridge({
        websiteIntentId: 'DL-20260819-AAAA',
        assignedName: 'BUSDEV-A',
        assignedPhone: '628123450001',
      });
      assert.equal(out.ok, true);
      if (out.ok) {
        assert.equal(out.trackingCode, 'DLABC1234');
        assert.equal(out.waDestinationPhone, '628990000111');
        assert.equal(out.created, true);
      }
    },
  );
});

test('409 response surfaces as conflict', async () => {
  await withEnv(
    { ERP_BRIDGE_URL: 'https://erp.example/api', ERP_BRIDGE_SECRET: 'secret' },
    async () => {
      setNextResponse(
        new Response(JSON.stringify({ ok: false, code: 'IDEMPOTENCY_CONFLICT' }), {
          status: 409,
        }),
      );
      const out = await callErpBridge({
        websiteIntentId: 'DL-20260819-CONFL',
        assignedName: 'BUSDEV-A',
      });
      assert.equal(out.ok, false);
      if (!out.ok) {
        assert.equal(out.error, 'conflict');
        assert.equal(out.status, 409);
      }
    },
  );
});

test('500 response surfaces as http-error', async () => {
  await withEnv(
    { ERP_BRIDGE_URL: 'https://erp.example/api', ERP_BRIDGE_SECRET: 'secret' },
    async () => {
      setNextResponse(new Response('boom', { status: 500 }));
      const out = await callErpBridge({
        websiteIntentId: 'DL-20260819-500',
        assignedName: 'BUSDEV-A',
      });
      assert.equal(out.ok, false);
      if (!out.ok) {
        assert.equal(out.error, 'http-error');
        assert.equal(out.status, 500);
      }
    },
  );
});

test('fetch throwing AbortError surfaces as timeout', async () => {
  await withEnv(
    { ERP_BRIDGE_URL: 'https://erp.example/api', ERP_BRIDGE_SECRET: 'secret' },
    async () => {
      const abortErr: any = new Error('aborted');
      abortErr.name = 'AbortError';
      setNextError(abortErr);
      const out = await callErpBridge({
        websiteIntentId: 'DL-20260819-TMO',
        assignedName: 'BUSDEV-A',
      });
      assert.equal(out.ok, false);
      if (!out.ok) assert.equal(out.error, 'timeout');
    },
  );
});

test('malformed JSON response surfaces as invalid-response', async () => {
  await withEnv(
    { ERP_BRIDGE_URL: 'https://erp.example/api', ERP_BRIDGE_SECRET: 'secret' },
    async () => {
      setNextResponse(new Response('not json at all', { status: 200 }));
      const out = await callErpBridge({
        websiteIntentId: 'DL-20260819-MAL',
        assignedName: 'BUSDEV-A',
      });
      assert.equal(out.ok, false);
      if (!out.ok) assert.equal(out.error, 'invalid-response');
    },
  );
});

test('JSON missing required fields surfaces as invalid-response', async () => {
  await withEnv(
    { ERP_BRIDGE_URL: 'https://erp.example/api', ERP_BRIDGE_SECRET: 'secret' },
    async () => {
      setNextResponse(new Response(JSON.stringify({ ok: true }), { status: 200 }));
      const out = await callErpBridge({
        websiteIntentId: 'DL-20260819-MISS',
        assignedName: 'BUSDEV-A',
      });
      assert.equal(out.ok, false);
      if (!out.ok) assert.equal(out.error, 'invalid-response');
    },
  );
});

test('isErpBridgePubliclyEnabled defaults to false', () => {
  const saved = process.env.NEXT_PUBLIC_DREAMLAB_ERP_BRIDGE_ENABLED;
  delete process.env.NEXT_PUBLIC_DREAMLAB_ERP_BRIDGE_ENABLED;
  try {
    assert.equal(isErpBridgePubliclyEnabled(), false);
  } finally {
    if (saved !== undefined) process.env.NEXT_PUBLIC_DREAMLAB_ERP_BRIDGE_ENABLED = saved;
  }
});

test('isErpBridgePubliclyEnabled reads "true" exactly', () => {
  process.env.NEXT_PUBLIC_DREAMLAB_ERP_BRIDGE_ENABLED = 'true';
  try {
    assert.equal(isErpBridgePubliclyEnabled(), true);
  } finally {
    delete process.env.NEXT_PUBLIC_DREAMLAB_ERP_BRIDGE_ENABLED;
  }
});

// Restore fetch after tests.
test.after(() => {
  globalThis.fetch = originalFetch as FetchFn;
});

test('returns not-configured when env is missing', async () => {
  await withEnv({ ERP_BRIDGE_URL: undefined, ERP_BRIDGE_SECRET: undefined }, async () => {
    const out = await callErpBridge({
      websiteIntentId: 'DL-20260819-AAAA',
      assignedName: 'BUSDEV-A',
    });
    assert.equal(out.ok, false);
    if (!out.ok) assert.equal(out.error, 'not-configured');
  });
});

test('returns not-configured when env starts with NEXT_PUBLIC_', async () => {
  await withEnv(
    { ERP_BRIDGE_URL: 'NEXT_PUBLIC_erp', ERP_BRIDGE_SECRET: 'secret' },
    async () => {
      const out = await callErpBridge({
        websiteIntentId: 'DL-20260819-PUB',
        assignedName: 'BUSDEV-A',
      });
      assert.equal(out.ok, false);
      if (!out.ok) assert.equal(out.error, 'not-configured');
    },
  );
});

test('happy path returns ok:true with canonical tracking code', async () => {
  await withEnv(
    { ERP_BRIDGE_URL: 'https://erp.example/api', ERP_BRIDGE_SECRET: 'unit-test-secret' },
    async () => {
      setNextResponse(
        new Response(
          JSON.stringify({
            ok: true,
            leadId: 'lead-1',
            trackingCode: 'DLABC1234',
            waDestinationPhone: '628990000111',
            created: true,
          }),
          { status: 200, headers: { 'content-type': 'application/json' } },
        ),
      );
      const out = await callErpBridge({
        websiteIntentId: 'DL-20260819-AAAA',
        assignedName: 'BUSDEV-A',
        assignedPhone: '628123450001',
      });
      assert.equal(out.ok, true);
      if (out.ok) {
        assert.equal(out.trackingCode, 'DLABC1234');
        assert.equal(out.waDestinationPhone, '628990000111');
        assert.equal(out.created, true);
      }
    },
  );
});

test('409 response surfaces as conflict', async () => {
  await withEnv(
    { ERP_BRIDGE_URL: 'https://erp.example/api', ERP_BRIDGE_SECRET: 'secret' },
    async () => {
      setNextResponse(
        new Response(JSON.stringify({ ok: false, code: 'IDEMPOTENCY_CONFLICT' }), {
          status: 409,
        }),
      );
      const out = await callErpBridge({
        websiteIntentId: 'DL-20260819-CONFL',
        assignedName: 'BUSDEV-A',
      });
      assert.equal(out.ok, false);
      if (!out.ok) {
        assert.equal(out.error, 'conflict');
        assert.equal(out.status, 409);
      }
    },
  );
});

test('500 response surfaces as http-error', async () => {
  await withEnv(
    { ERP_BRIDGE_URL: 'https://erp.example/api', ERP_BRIDGE_SECRET: 'secret' },
    async () => {
      setNextResponse(new Response('boom', { status: 500 }));
      const out = await callErpBridge({
        websiteIntentId: 'DL-20260819-500',
        assignedName: 'BUSDEV-A',
      });
      assert.equal(out.ok, false);
      if (!out.ok) {
        assert.equal(out.error, 'http-error');
        assert.equal(out.status, 500);
      }
    },
  );
});

test('fetch throwing AbortError surfaces as timeout', async () => {
  await withEnv(
    { ERP_BRIDGE_URL: 'https://erp.example/api', ERP_BRIDGE_SECRET: 'secret' },
    async () => {
      const abortErr: any = new Error('aborted');
      abortErr.name = 'AbortError';
      setNextError(abortErr);
      const out = await callErpBridge({
        websiteIntentId: 'DL-20260819-TMO',
        assignedName: 'BUSDEV-A',
      });
      assert.equal(out.ok, false);
      if (!out.ok) assert.equal(out.error, 'timeout');
    },
  );
});

test('malformed JSON response surfaces as invalid-response', async () => {
  await withEnv(
    { ERP_BRIDGE_URL: 'https://erp.example/api', ERP_BRIDGE_SECRET: 'secret' },
    async () => {
      setNextResponse(new Response('not json at all', { status: 200 }));
      const out = await callErpBridge({
        websiteIntentId: 'DL-20260819-MAL',
        assignedName: 'BUSDEV-A',
      });
      assert.equal(out.ok, false);
      if (!out.ok) assert.equal(out.error, 'invalid-response');
    },
  );
});

test('JSON missing required fields surfaces as invalid-response', async () => {
  await withEnv(
    { ERP_BRIDGE_URL: 'https://erp.example/api', ERP_BRIDGE_SECRET: 'secret' },
    async () => {
      setNextResponse(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );
      const out = await callErpBridge({
        websiteIntentId: 'DL-20260819-MISS',
        assignedName: 'BUSDEV-A',
      });
      assert.equal(out.ok, false);
      if (!out.ok) assert.equal(out.error, 'invalid-response');
    },
  );
});

test('isErpBridgePubliclyEnabled defaults to false', () => {
  const saved = process.env.NEXT_PUBLIC_DREAMLAB_ERP_BRIDGE_ENABLED;
  delete process.env.NEXT_PUBLIC_DREAMLAB_ERP_BRIDGE_ENABLED;
  try {
    assert.equal(isErpBridgePubliclyEnabled(), false);
  } finally {
    if (saved !== undefined) process.env.NEXT_PUBLIC_DREAMLAB_ERP_BRIDGE_ENABLED = saved;
  }
});

test('isErpBridgePubliclyEnabled reads "true" exactly', () => {
  process.env.NEXT_PUBLIC_DREAMLAB_ERP_BRIDGE_ENABLED = 'true';
  try {
    assert.equal(isErpBridgePubliclyEnabled(), true);
  } finally {
    delete process.env.NEXT_PUBLIC_DREAMLAB_ERP_BRIDGE_ENABLED;
  }
});

// Restore fetch after tests.
test.after(() => {
  globalThis.fetch = originalFetch as FetchFn;
});