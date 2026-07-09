import assert from "node:assert/strict";
import {
  ROUND_ROBIN_BUSDEVS,
  resolveRoundRobinIndex,
  getFallbackBusdev,
} from "../src/lib/round-robin-config";
import {
  buildLeadAssignmentKey,
  createLeadAssignmentRecord,
  getSessionLeadAssignment,
  writeLeadAssignment,
} from "../src/lib/lead-routing";

type MemoryStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

function createMemoryStorage(): MemoryStorage {
  const store = new Map<string, string>();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    },
  };
}

function simulateLead(params: {
  storage: MemoryStorage;
  routeKey: string;
  source: string;
  serverCounter: number;
  assignedAt?: number;
}) {
  const key = buildLeadAssignmentKey(params.routeKey, params.source);
  const cached = getSessionLeadAssignment(params.storage, key);
  if (cached) {
    return { assignment: cached, nextCounter: params.serverCounter };
  }

  const busdev = ROUND_ROBIN_BUSDEVS[resolveRoundRobinIndex(params.serverCounter, ROUND_ROBIN_BUSDEVS.length)];
  const assignment = createLeadAssignmentRecord(busdev, {
    source: params.source,
    routeKey: params.routeKey,
    origin: "api",
    assignedAt: params.assignedAt,
  });
  writeLeadAssignment(params.storage, key, assignment);

  return { assignment, nextCounter: params.serverCounter + 1 };
}

function run() {
  console.log("=== 100-Lead Round Robin Simulation ===");

  let serverCounter = 0;
  const counts = new Map<string, number>();

  for (let i = 0; i < 100; i += 1) {
    const storage = createMemoryStorage();
    const result = simulateLead({
      storage,
      routeKey: "thankyou/google",
      source: "google-ads",
      serverCounter,
    });
    serverCounter = result.nextCounter;
    counts.set(result.assignment.phone, (counts.get(result.assignment.phone) ?? 0) + 1);
  }

  console.log("Unique users, fresh sessions:");
  for (const busdev of ROUND_ROBIN_BUSDEVS) {
    console.log(`- ${busdev.name} (${busdev.phone}): ${counts.get(busdev.phone) ?? 0}`);
  }

  assert.deepEqual(
    ROUND_ROBIN_BUSDEVS.map((b) => counts.get(b.phone) ?? 0),
    [34, 33, 33],
    "100 fresh leads should distribute as evenly as possible"
  );

  const sameUserStorage = createMemoryStorage();
  serverCounter = 0;
  const repeated: string[] = [];

  for (let i = 0; i < 5; i += 1) {
    const result = simulateLead({
      storage: sameUserStorage,
      routeKey: "thankyou/google",
      source: "google-ads",
      serverCounter,
    });
    serverCounter = result.nextCounter;
    repeated.push(result.assignment.phone);
  }

  console.log("Same user, same route/source repeated 5x:");
  console.log(`- assignments: ${repeated.join(", ")}`);
  assert.equal(new Set(repeated).size, 1, "Same session should keep the same phone");

  const sameUserDifferentRouteStorage = createMemoryStorage();
  serverCounter = 0;
  const first = simulateLead({
    storage: sameUserDifferentRouteStorage,
    routeKey: "thankyou/google",
    source: "google-ads",
    serverCounter,
  });
  serverCounter = first.nextCounter;
  const second = simulateLead({
    storage: sameUserDifferentRouteStorage,
    routeKey: "ads/thankyou/metaads",
    source: "meta-parfum",
    serverCounter,
  });
  serverCounter = second.nextCounter;

  console.log("Same user, different route/source:");
  console.log(`- first:  ${first.assignment.phone}`);
  console.log(`- second: ${second.assignment.phone}`);

  const oldRecord = createLeadAssignmentRecord(getFallbackBusdev(), {
    source: "google-ads",
    routeKey: "thankyou/google",
    origin: "cache",
    assignedAt: Date.now() - 31 * 60 * 1000,
  });
  const ttlStorage = createMemoryStorage();
  ttlStorage.setItem(buildLeadAssignmentKey("thankyou/google", "google-ads"), JSON.stringify(oldRecord));

  const ttlCheck = getSessionLeadAssignment(ttlStorage, buildLeadAssignmentKey("thankyou/google", "google-ads"));
  console.log(`Expired cache returns: ${ttlCheck ? "cached" : "null (reassigned)"}`);
  assert.equal(ttlCheck, null, "Expired sessions should be reassigned");

  console.log("Simulation passed.");
}

run();
