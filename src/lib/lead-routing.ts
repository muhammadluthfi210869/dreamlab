import { getFallbackBusdev, type BusdevContact } from "@/lib/round-robin-config";

export interface LeadAssignmentRecord extends BusdevContact {
  source: string;
  routeKey: string;
  assignedAt: number;
  origin: "api" | "cache" | "fallback";
}

export interface RoundRobinBusdevResult {
  phone: string;
  busdev_id: number;
  name: string;
}

const ASSIGNMENT_TTL_MS = 30 * 60 * 1000;

export function buildLeadAssignmentKey(routeKey: string, source: string) {
  return `dreamlab:lead-assignment:${routeKey}:${source}`;
}

export function buildWhatsAppUrl(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function isStorageLike(storage: Storage | Pick<Storage, "getItem" | "setItem" | "removeItem"> | undefined): storage is Storage | Pick<Storage, "getItem" | "setItem" | "removeItem"> {
  return Boolean(storage && typeof storage.getItem === "function" && typeof storage.setItem === "function");
}

export function createLeadAssignmentRecord(
  busdev: BusdevContact,
  params: {
    source: string;
    routeKey: string;
    origin: LeadAssignmentRecord["origin"];
    assignedAt?: number;
  }
): LeadAssignmentRecord {
  return {
    id: busdev.id,
    phone: busdev.phone,
    name: busdev.name,
    source: params.source,
    routeKey: params.routeKey,
    origin: params.origin,
    assignedAt: params.assignedAt ?? Date.now(),
  };
}

export function readLeadAssignment(
  storage: Storage | Pick<Storage, "getItem" | "setItem" | "removeItem"> | undefined,
  key: string
): LeadAssignmentRecord | null {
  if (!isStorageLike(storage)) return null;

  try {
    const raw = storage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<LeadAssignmentRecord> | null;
    if (
      !parsed ||
      typeof parsed.id !== "number" ||
      typeof parsed.phone !== "string" ||
      typeof parsed.name !== "string" ||
      typeof parsed.source !== "string" ||
      typeof parsed.routeKey !== "string" ||
      typeof parsed.assignedAt !== "number" ||
      (parsed.origin !== "api" && parsed.origin !== "cache" && parsed.origin !== "fallback")
    ) {
      return null;
    }

    return parsed as LeadAssignmentRecord;
  } catch {
    return null;
  }
}

export function writeLeadAssignment(
  storage: Storage | Pick<Storage, "getItem" | "setItem" | "removeItem"> | undefined,
  key: string,
  record: LeadAssignmentRecord
) {
  if (!isStorageLike(storage)) return;

  try {
    storage.setItem(key, JSON.stringify(record));
  } catch {
    // Ignore storage quota or private-mode failures.
  }
}

export function isFreshLeadAssignment(record: LeadAssignmentRecord, ttlMs = ASSIGNMENT_TTL_MS) {
  return Date.now() - record.assignedAt <= ttlMs;
}

export function getSessionLeadAssignment(
  storage: Storage | Pick<Storage, "getItem" | "setItem" | "removeItem"> | undefined,
  key: string,
  ttlMs = ASSIGNMENT_TTL_MS
) {
  const record = readLeadAssignment(storage, key);
  if (!record) return null;

  return isFreshLeadAssignment(record, ttlMs) ? record : null;
}

export function getFallbackLeadAssignment(routeKey: string, source: string) {
  return createLeadAssignmentRecord(getFallbackBusdev(), {
    source,
    routeKey,
    origin: "fallback",
  });
}

export function createWhatsAppRedirectController(params: {
  phone: string;
  message: string;
}) {
  let consumed = false;
  const url = buildWhatsAppUrl(params.phone, params.message);

  return {
    getUrl() {
      return url;
    },
    click() {
      if (consumed || !params.phone) return null;
      consumed = true;
      return url;
    },
    isConsumed() {
      return consumed;
    },
  };
}
