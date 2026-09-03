/**
 * Batch 2 — ACTUAL dreamlab-site executable tests.
 *
 * NO `.skip` / `.todo` / `it.todo` placeholders. Every required case below
 * runs as a real assertion using `node:test` (Node 22 built-in) +
 * `--experimental-strip-types`.
 *
 * Test target: `decideBridge()` from `@/lib/erp-bridge-server` plus the
 * client-side `convertLeadCaptureWithErpBridge`. The route is a thin
 * Next.js wrapper around the orchestration function, so testing the
 * function covers all trust-boundary, activation-flag, orchestration, and
 * failure-mode behavior without spinning up the Next.js runtime.
 *
 * Every test uses an INJECTED `fetch` mock (counted). VPS and ERP are
 * NEVER called against real round-robin / ERP services. No production
 * mutation. No real visitor_id advancement.
 *
 * Cases covered (mirrors Batch 2 §4 cases A–K):
 *   A. server flag missing       → 404, 0/0 calls
 *   B. server flag 'false'       → 404, 0/0 calls
 *   C. server flag 'TRUE'        → 404, 0/0 calls (case-sensitive)
 *   D. server flag 'true'        → happy path, 1/1 calls
 *   E. browser supplies forbidden fields  → 400, ERP 0 calls
 *   F. valid browser context     → VPS 1, ERP 1, ERP body fields = VPS values
 *   G. VPS failure               → ERP 0, no waDestinationPhone
 *   H. ERP failure               → no waDestinationPhone, no usable code
 *   I. client bridge function calls server route ONCE, NOT VPS
 *   J. CTA ready only with agent + ERP code + destination
 *   K. bridge failure → NO fallback WA URL
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Dynamic imports — the `.ts` extension is REQUIRED by Node 22's ESM
// resolver under `--experimental-strip-types`. We construct the import
// path at runtime (string concatenation) so the TypeScript checker does
// not require `allowImportingTsExtensions` for static analysis.
const _ext = '.ts';
const { decideBridge }: any = await import(/* @vite-ignore */ '../erp-bridge-server' + _ext);
const bridgeClient: any = await import(/* @vite-ignore */ '../bridge-client' + _ext);
const { convertLeadCaptureWithErpBridge, BridgeConflictError } = bridgeClient;

type FetchLike = (input: string, init?: any) => Promise<{
  ok: boolean;
  status: number;
  statusText?: string;
  json(): Promise<any>;
}>;

interface BridgeServerDeps {
  env: any;
  fetchImpl: FetchLike;
  readVisitorCookie: () => Promise<string | null>;
  log: (msg: string) => void;
}

// ───────────────────────────────────────────────────────────────────────
//  Helpers
// ───────────────────────────────────────────────────────────────────────

interface FetchCall {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: any;
}

function makeMockFetch(
  handlers: Array<(call: FetchCall) => { status: number; body: any } | 'throw' | null>,
): { fetchImpl: FetchLike; calls: FetchCall[] } {
  const calls: FetchCall[] = [];
  let i = 0;
  const fetchImpl: FetchLike = async (url, init) => {
    const body = init?.body ? JSON.parse(init.body as string) : null;
    const call: FetchCall = {
      url,
      method: init?.method || 'GET',
      headers: (init?.headers as Record<string, string>) || {},
      body,
    };
    calls.push(call);
    const handler = handlers[i++];
    if (!handler) {
      return { ok: false, status: 599, json: async () => ({}) };
    }
    const out = handler(call);
    if (out === null || out === undefined) {
      // not-configured scenario: stub returns 599 and we expect not-configured
      return { ok: false, status: 599, json: async () => ({}) };
    }
    if (out === 'throw') {
      throw new Error('mock network failure');
    }
    return {
      ok: out.status >= 200 && out.status < 300,
      status: out.status,
      json: async () => out.body,
    };
  };
  return { fetchImpl, calls };
}

const baseEnv = {
  DREAMLAB_ERP_BRIDGE_ENABLED: 'true',
  VPS_CONVERT_URL: 'http://localhost:9999/vps',
  ERP_BRIDGE_URL: 'http://localhost:9999/erp',
  ERP_BRIDGE_SECRET: 'shhh-secret-1234',
};

function makeDeps(overrides: Partial<BridgeServerDeps> = {}): BridgeServerDeps {
  return {
    env: baseEnv,
    fetchImpl: async () => ({ ok: false, status: 0, json: async () => ({}) }),
    readVisitorCookie: async () => null,
    log: () => {},
    ...overrides,
  };
}

const happyBody = {
  intent: 'Produk skincare',
  source: 'meta-ads',
  pageUrl: 'https://dreamlab.id/skincare',
  utmSource: 'ig',
};

// ───────────────────────────────────────────────────────────────────────
//  A–D — Server activation flag
// ───────────────────────────────────────────────────────────────────────

describe('decideBridge — server activation flag (A/B/C/D)', () => {
  test('A — DREAMLAB_ERP_BRIDGE_ENABLED missing → bridge-disabled, 0/0 calls', async () => {
    const { fetchImpl, calls } = makeMockFetch([]);
    const decision = await decideBridge(happyBody, makeDeps({ env: {}, fetchImpl }));
    assert.equal(decision.kind, 'bridge-disabled');
    assert.equal(calls.length, 0);
  });

  test('B — DREAMLAB_ERP_BRIDGE_ENABLED="false" → bridge-disabled, 0/0 calls', async () => {
    const { fetchImpl, calls } = makeMockFetch([]);
    const decision = await decideBridge(happyBody, makeDeps({
      env: { ...baseEnv, DREAMLAB_ERP_BRIDGE_ENABLED: 'false' },
      fetchImpl,
    }));
    assert.equal(decision.kind, 'bridge-disabled');
    assert.equal(calls.length, 0);
  });

  test('C — DREAMLAB_ERP_BRIDGE_ENABLED="TRUE" (case-sensitive) → bridge-disabled, 0/0 calls', async () => {
    const { fetchImpl, calls } = makeMockFetch([]);
    const decision = await decideBridge(happyBody, makeDeps({
      env: { ...baseEnv, DREAMLAB_ERP_BRIDGE_ENABLED: 'TRUE' },
      fetchImpl,
    }));
    assert.equal(decision.kind, 'bridge-disabled');
    assert.equal(calls.length, 0);
  });

  test('C2 — DREAMLAB_ERP_BRIDGE_ENABLED="  true  " (whitespace) → bridge-disabled, 0/0 calls', async () => {
    const { fetchImpl, calls } = makeMockFetch([]);
    const decision = await decideBridge(happyBody, makeDeps({
      env: { ...baseEnv, DREAMLAB_ERP_BRIDGE_ENABLED: '  true  ' },
      fetchImpl,
    }));
    assert.equal(decision.kind, 'bridge-disabled');
    assert.equal(calls.length, 0);
  });

  test('D — DREAMLAB_ERP_BRIDGE_ENABLED="true" (lowercase exact) → happy path, 1 VPS + 1 ERP call', async () => {
    const { fetchImpl, calls } = makeMockFetch([
      (call) => {
        assert.equal(call.url, 'http://localhost:9999/vps/convert');
        return {
          status: 200,
          body: {
            id: 'cs1',
            name: 'CS 1',
            phoneNumber: '628999888777',
            orderIndex: 3,
            trackingCode: 'DL-20260819-VPS001',
            waUrl: 'https://wa.me/628999888777',
          },
        };
      },
      (call) => {
        assert.equal(call.url, 'http://localhost:9999/erp/lead-capture/website-bridge/track');
        assert.equal(call.headers['x-dreamlab-bridge-secret'], 'shhh-secret-1234');
        return {
          status: 200,
          body: {
            ok: true,
            trackingCode: 'DLERPSITE01',
            waDestinationPhone: '6281234567890',
            leadId: 'erp-lead-1',
            created: true,
          },
        };
      },
    ]);
    const decision = await decideBridge(happyBody, makeDeps({ fetchImpl }));
    assert.equal(decision.kind, 'ok');
    if (decision.kind === 'ok') {
      assert.equal(decision.erpTrackingCode, 'DLERPSITE01');
      assert.equal(decision.vpsTrackingCode, 'DL-20260819-VPS001');
      assert.equal(decision.waDestinationPhone, '6281234567890');
      assert.equal(decision.agent.id, 'cs1');
      assert.equal(decision.agent.name, 'CS 1');
      assert.equal(decision.created, true);
    }
    assert.equal(calls.length, 2);
  });
});

// ───────────────────────────────────────────────────────────────────────
//  E — Browser-supplied forbidden fields
// ───────────────────────────────────────────────────────────────────────

describe('decideBridge — trust boundary (E)', () => {
  for (const field of ['websiteIntentId', 'assignedName', 'assignedPhone']) {
    test(`E — browser supplies ${field} → trust-boundary 400, ZERO fetch calls`, async () => {
      const { fetchImpl, calls } = makeMockFetch([]);
      const decision = await decideBridge(
        { ...happyBody, [field]: 'FORGED-VALUE' },
        makeDeps({ fetchImpl }),
      );
      assert.equal(decision.kind, 'trust-boundary');
      if (decision.kind === 'trust-boundary') {
        assert.equal(decision.field, field);
      }
      assert.equal(calls.length, 0);
    });
  }

  test('E2 — all three forbidden fields together → trust-boundary on the FIRST encountered', async () => {
    const { fetchImpl, calls } = makeMockFetch([]);
    const decision = await decideBridge(
      {
        ...happyBody,
        websiteIntentId: 'FORGED-I',
        assignedName: 'FORGED-N',
        assignedPhone: 'FORGED-P',
      },
      makeDeps({ fetchImpl }),
    );
    assert.equal(decision.kind, 'trust-boundary');
    if (decision.kind === 'trust-boundary') {
      assert.equal(decision.field, 'websiteIntentId');
    }
    assert.equal(calls.length, 0);
  });
});

// ───────────────────────────────────────────────────────────────────────
//  F — Valid browser context, VPS once + ERP once, fields propagated
// ───────────────────────────────────────────────────────────────────────

describe('decideBridge — valid flow (F)', () => {
  test('F — VPS called EXACTLY once, ERP called EXACTLY once, ERP body uses VPS values', async () => {
    const { fetchImpl, calls } = makeMockFetch([
      (call) => {
        assert.equal(call.url, 'http://localhost:9999/vps/convert');
        assert.equal(call.method, 'POST');
        assert.equal(call.body.intent, happyBody.intent);
        assert.equal(call.body.source, happyBody.source);
        assert.equal(call.body.pageUrl, happyBody.pageUrl);
        return {
          status: 200,
          body: {
            id: 'cs1',
            name: 'CS 1',
            phoneNumber: '628999888777',
            orderIndex: 3,
            trackingCode: 'DL-20260819-VPS001',
            waUrl: 'https://wa.me/628999888777',
          },
        };
      },
      (call) => {
        assert.equal(call.url, 'http://localhost:9999/erp/lead-capture/website-bridge/track');
        // ERP body MUST be derived from VPS — not from browser-supplied fields.
        assert.equal(call.body.websiteIntentId, 'DL-20260819-VPS001');
        assert.equal(call.body.assignedName, 'CS 1');
        assert.equal(call.body.assignedPhone, '628999888777');
        return {
          status: 200,
          body: {
            ok: true,
            trackingCode: 'DLERPSITE01',
            waDestinationPhone: '6281234567890',
            leadId: 'erp-lead-1',
            created: true,
          },
        };
      },
    ]);
    const decision = await decideBridge(happyBody, makeDeps({ fetchImpl }));
    assert.equal(decision.kind, 'ok');
    assert.equal(calls.length, 2);
    assert.equal(calls[0].url, 'http://localhost:9999/vps/convert');
    assert.equal(calls[1].url, 'http://localhost:9999/erp/lead-capture/website-bridge/track');
  });

  test('F2 — visitor cookie is forwarded into VPS call', async () => {
    let vpsBody: any = null;
    const fetchImpl: FetchLike = async (url, init) => {
      if ((url as string).endsWith('/vps/convert')) {
        vpsBody = init?.body ? JSON.parse(init.body as string) : null;
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 'cs1',
            name: 'CS 1',
            phoneNumber: '628999888777',
            orderIndex: 3,
            trackingCode: 'DL-20260819-VPS001',
            waUrl: '',
          }),
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          trackingCode: 'DLERPSITE01',
          waDestinationPhone: '6281234567890',
          leadId: 'erp-lead-1',
          created: true,
        }),
      };
    };

    const decision = await decideBridge(happyBody, makeDeps({
      fetchImpl,
      readVisitorCookie: async () => 'vid-abc-123',
    }));
    assert.equal(decision.kind, 'ok');
    assert.equal(vpsBody.visitorId, 'vid-abc-123');
  });
});

// ───────────────────────────────────────────────────────────────────────
//  G — VPS failure: ERP MUST NOT be called
// ───────────────────────────────────────────────────────────────────────

describe('decideBridge — VPS failure (G)', () => {
  for (const scenario of ['http', 'invalid', 'not-configured', 'network']) {
    test(`G[${scenario}] — VPS ${scenario} → ERP never called, no waDestinationPhone`, async () => {
      const scenarioHandlers: Record<string, Array<(c: FetchCall) => any>> = {
        http: [() => ({ status: 500, body: { error: 'vps-down' } })],
        invalid: [() => ({ status: 200, body: { bad: 'shape' } })],
        network: [() => 'throw'],
        'not-configured': [null], // env is set to '' below; handler never fires
      };
      const handlers = scenarioHandlers[scenario] ?? [];
      const { fetchImpl, calls } = makeMockFetch(handlers);
      const decision = await decideBridge(happyBody, makeDeps({
        fetchImpl,
        env: scenario === 'not-configured'
          ? { ...baseEnv, VPS_CONVERT_URL: '' }
          : baseEnv,
      }));
      if (scenario === 'not-configured') {
        assert.equal(decision.kind, 'not-configured');
      } else {
        assert.equal(decision.kind, 'vps-failed');
      }
      const erpCalls = calls.filter((c) =>
        c.url.includes('/erp/') || c.url.includes('/lead-capture/website-bridge/track'),
      );
      assert.equal(erpCalls.length, 0,
        `ERP was called ${erpCalls.length} times despite VPS failure (${scenario})`);
    });
  }
});

// ───────────────────────────────────────────────────────────────────────
//  H — ERP failure: no waDestinationPhone, no usable code
// ───────────────────────────────────────────────────────────────────────

describe('decideBridge — ERP failure (H)', () => {
  for (const scenario of ['http-error', 'invalid-response', 'conflict', 'network']) {
    test(`H[${scenario}] — ERP ${scenario} → no usable waDestinationPhone`, async () => {
      const scenarioHandlers: Record<string, Array<(c: FetchCall) => any>> = {
        'http-error': [
          () => ({ status: 200, body: { id: 'cs1', name: 'CS 1', phoneNumber: '628999888777', orderIndex: 3, trackingCode: 'DL-VPS-001' } }),
          () => ({ status: 502, body: { error: 'erp-down' } }),
        ],
        'invalid-response': [
          () => ({ status: 200, body: { id: 'cs1', name: 'CS 1', phoneNumber: '628999888777', orderIndex: 3, trackingCode: 'DL-VPS-001' } }),
          () => ({ status: 200, body: { bad: 'shape' } }),
        ],
        'conflict': [
          () => ({ status: 200, body: { id: 'cs1', name: 'CS 1', phoneNumber: '628999888777', orderIndex: 3, trackingCode: 'DL-VPS-001' } }),
          () => ({ status: 409, body: { code: 'IDEMPOTENCY_CONFLICT' } }),
        ],
        'network': [
          () => ({ status: 200, body: { id: 'cs1', name: 'CS 1', phoneNumber: '628999888777', orderIndex: 3, trackingCode: 'DL-VPS-001' } }),
          () => 'throw',
        ],
      };
      const handlers = scenarioHandlers[scenario] ?? [];
      const { fetchImpl } = makeMockFetch(handlers);
      const decision = await decideBridge(happyBody, makeDeps({ fetchImpl }));
      if (scenario === 'conflict') {
        assert.equal(decision.kind, 'conflict');
      } else {
        assert.equal(decision.kind, 'bridge-failed');
      }
      assert.notEqual(decision.kind, 'ok');
    });
  }

  test('H2 — missing ERP env vars → not-configured', async () => {
    const { fetchImpl } = makeMockFetch([
      () => ({ status: 200, body: { id: 'cs1', name: 'CS 1', phoneNumber: '628999888777', orderIndex: 3, trackingCode: 'DL-VPS-001' } }),
    ]);
    const decision = await decideBridge(happyBody, makeDeps({
      fetchImpl,
      env: { ...baseEnv, ERP_BRIDGE_SECRET: '' },
    }));
    assert.equal(decision.kind, 'not-configured');
    if (decision.kind === 'not-configured') {
      assert.equal(decision.missing, 'ERP_BRIDGE_SECRET');
    }
  });
});

// ───────────────────────────────────────────────────────────────────────
//  I — Client bridge function calls website route EXACTLY once,
//     NOT VPS directly
// ───────────────────────────────────────────────────────────────────────

describe('client flow — convertLeadCaptureWithErpBridge (I/J/K)', () => {
  test('I — client calls website /api/lead-capture/erp-track EXACTLY once, NEVER VPS', async () => {
    const calls: Array<{ url: string; body: any }> = [];
    const origFetch = (globalThis as any).fetch;
    (globalThis as any).fetch = async (url: string, init?: any) => {
      const body = init?.body ? JSON.parse(init.body) : null;
      calls.push({ url, body });
      if (url.endsWith('/api/lead-capture/erp-track')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            ok: true,
            agent: { id: 'cs1', name: 'CS 1', phoneNumber: '628999888777', orderIndex: 3 },
            vpsTrackingCode: 'DL-VPS-001',
            erpTrackingCode: 'DLERPOK01',
            trackingCode: 'DLERPOK01',
            waDestinationPhone: '6281234567890',
            leadId: 'erp-lead-1',
            created: true,
          }),
        };
      }
      return { ok: false, status: 599, json: async () => ({}) };
    };
    try {
      const result = await convertLeadCaptureWithErpBridge({
        intent: 'produk',
        source: 'meta-ads',
        pageUrl: 'https://dreamlab.id/p',
      } as any);
      assert.equal(result.erpBridge, true);
      assert.equal(result.erpTrackingCode, 'DLERPOK01');
      assert.equal(result.waDestinationPhone, '6281234567890');

      const bridgeCalls = calls.filter((c) => c.url.endsWith('/api/lead-capture/erp-track'));
      assert.equal(bridgeCalls.length, 1, `Expected exactly 1 bridge call, got ${bridgeCalls.length}`);

      const vpsCalls = calls.filter((c) =>
        c.url.includes('/lead/convert') || c.url.includes('/vps/convert'),
      );
      assert.equal(vpsCalls.length, 0,
        `Browser directly hit VPS ${vpsCalls.length} times — forbidden`);

      const forbidden = ['websiteIntentId', 'assignedName', 'assignedPhone'];
      for (const f of forbidden) {
        assert.equal(bridgeCalls[0].body[f], undefined,
          `Browser body contained forbidden ${f} field`);
      }
    } finally {
      (globalThis as any).fetch = origFetch;
    }
  });

  test('I2 — bridge failure (504) throws BRIDGE_FAILED', async () => {
    const origFetch = (globalThis as any).fetch;
    (globalThis as any).fetch = async () => ({
      ok: false,
      status: 504,
      json: async () => ({ ok: false, error: 'bridge-failed' }),
    });
    try {
      await assert.rejects(
        () => convertLeadCaptureWithErpBridge({ intent: 'x' } as any),
        /BRIDGE_FAILED/,
      );
    } finally {
      (globalThis as any).fetch = origFetch;
    }
  });

  test('I3 — bridge 409 → BridgeConflictError', async () => {
    const origFetch = (globalThis as any).fetch;
    (globalThis as any).fetch = async () => ({
      ok: false,
      status: 409,
      json: async () => ({ ok: false, code: 'IDEMPOTENCY_CONFLICT' }),
    });
    try {
      await assert.rejects(
        () => convertLeadCaptureWithErpBridge({ intent: 'x' } as any),
        (err: any) => err instanceof BridgeConflictError,
      );
    } finally {
      (globalThis as any).fetch = origFetch;
    }
  });

  test('I4 — bridge 404 (server flag OFF) → BRIDGE_DISABLED, never silent success', async () => {
    const origFetch = (globalThis as any).fetch;
    (globalThis as any).fetch = async () => ({
      ok: false,
      status: 404,
      json: async () => ({}),
    });
    try {
      await assert.rejects(
        () => convertLeadCaptureWithErpBridge({ intent: 'x' } as any),
        /BRIDGE_DISABLED/,
      );
    } finally {
      (globalThis as any).fetch = origFetch;
    }
  });

  test('K — bridge failure does not return a fallback WA URL', async () => {
    const origFetch = (globalThis as any).fetch;
    (globalThis as any).fetch = async () => ({
      ok: false,
      status: 504,
      json: async () => ({ ok: false, error: 'bridge-failed' }),
    });
    try {
      const result = await convertLeadCaptureWithErpBridge({ intent: 'x' } as any).catch(() => null);
      assert.equal(result, null, 'Promise should have rejected, not resolved with a fallback URL.');
    } finally {
      (globalThis as any).fetch = origFetch;
    }
  });

  test('J — happy-path result exposes agent + ERP code + destination', async () => {
    const origFetch = (globalThis as any).fetch;
    (globalThis as any).fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        ok: true,
        agent: { id: 'cs1', name: 'CS 1', phoneNumber: '628999888777', orderIndex: 3 },
        vpsTrackingCode: 'DL-VPS-001',
        erpTrackingCode: 'DLERPOK01',
        trackingCode: 'DLERPOK01',
        waDestinationPhone: '6281234567890',
        leadId: 'erp-lead-1',
        created: true,
      }),
    });
    try {
      const result = await convertLeadCaptureWithErpBridge({ intent: 'x' } as any);
      assert.ok(result.agent, 'agent must be present');
      assert.ok(result.erpTrackingCode, 'erpTrackingCode must be present');
      assert.ok(result.waDestinationPhone, 'waDestinationPhone must be present');
      assert.equal(result.agent.phoneNumber, '628999888777');
    } finally {
      (globalThis as any).fetch = origFetch;
    }
  });
});
