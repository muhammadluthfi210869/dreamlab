import { Redis } from '@upstash/redis';

/**
 * redis.ts
 *
 * Client Upstash Redis untuk operasi atomik round robin dan idempotensi event.
 * Memeriksa environment variable Upstash yang tersedia di Vercel secara fleksibel.
 */

let _redisInstance: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (_redisInstance) return _redisInstance;

  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;

  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  try {
    _redisInstance = new Redis({
      url,
      token,
    });
    return _redisInstance;
  } catch {
    return null;
  }
}

export const REDIS_GLOBAL_COUNTER_KEY = 'dreamlab:round-robin:global';
export const REDIS_EVENT_PREFIX = 'dreamlab:lead-event:';
export const REDIS_EVENT_LOCK_PREFIX = 'dreamlab:lead-lock:';

export interface CachedLeadAssignment {
  assignmentId: string;
  source: string;
  sales: {
    id: string;
    name: string;
    phone?: string;
  };
  whatsappUrl: string;
}

export type AtomicReservationResult =
  | { status: 'CACHED'; assignment: CachedLeadAssignment }
  | { status: 'ASSIGNED'; sequence: number }
  | { status: 'RESERVED_SEQUENCE'; sequence: number }
  | { status: 'FAILED' };

const LUA_ATOMIC_RESERVE_SCRIPT = `
local existing = redis.call('GET', KEYS[1])
if existing then
  return { "EXISTS", existing }
end

local seq = redis.call('INCR', KEYS[2])
redis.call('SET', KEYS[1], "RESERVED:" .. tostring(seq), "EX", tonumber(ARGV[1]))
return { "ASSIGNED", tostring(seq) }
`;

/**
 * Reservasi atomik via Lua script di Upstash Redis.
 * Menghilangkan pola non-atomik GET -> INCR -> SET sehingga double click atau
 * concurrent requests dengan eventId yang sama dijamin TIDAK pernah menaikkan
 * counter global lebih dari satu kali.
 */
export async function atomicReserveAndAssignLeadEvent(
  eventId: string,
  ttlSeconds: number = 60 * 60 * 24 * 7
): Promise<AtomicReservationResult> {
  const redis = getRedisClient();
  if (!redis) return { status: 'FAILED' };

  const eventKey = `${REDIS_EVENT_PREFIX}${eventId}`;

  try {
    // 1. Coba eksekusi Lua script atomik
    const evalRes = (await redis.eval(
      LUA_ATOMIC_RESERVE_SCRIPT,
      [eventKey, REDIS_GLOBAL_COUNTER_KEY],
      [ttlSeconds.toString()]
    )) as [string, string] | null;

    if (evalRes && Array.isArray(evalRes)) {
      const [type, payload] = evalRes;
      if (type === 'ASSIGNED') {
        const seq = parseInt(payload, 10);
        return { status: 'ASSIGNED', sequence: seq };
      }
      if (type === 'EXISTS') {
        if (payload.startsWith('RESERVED:')) {
          const seq = parseInt(payload.replace('RESERVED:', ''), 10);
          return { status: 'RESERVED_SEQUENCE', sequence: seq };
        }
        try {
          const assignment = JSON.parse(payload) as CachedLeadAssignment;
          return { status: 'CACHED', assignment };
        } catch {
          // If corrupted payload, treat as failed to let fallback handle
          return { status: 'FAILED' };
        }
      }
    }
  } catch {
    // Lua script error / unpermitted, fallback ke SET NX reservation
  }

  // 2. Fallback: Atomic SET NX Reservation
  try {
    // Periksa apakah key sudah ada
    const existing = await redis.get<CachedLeadAssignment | string>(eventKey);
    if (existing) {
      if (typeof existing === 'string' && existing.startsWith('RESERVED:')) {
        const seq = parseInt(existing.replace('RESERVED:', ''), 10);
        return { status: 'RESERVED_SEQUENCE', sequence: seq };
      }
      if (typeof existing === 'object' && existing !== null) {
        return { status: 'CACHED', assignment: existing as CachedLeadAssignment };
      }
    }

    // Lock reservation per eventId menggunakan SET NX
    const lockKey = `${REDIS_EVENT_LOCK_PREFIX}${eventId}`;
    const acquiredLock = await redis.set(lockKey, 'locked', { nx: true, ex: 15 });

    if (!acquiredLock) {
      // Request concurrent lain sedang memproses eventId ini, baca ulang eventKey
      const rechecked = await redis.get<CachedLeadAssignment | string>(eventKey);
      if (rechecked) {
        if (typeof rechecked === 'string' && rechecked.startsWith('RESERVED:')) {
          const seq = parseInt(rechecked.replace('RESERVED:', ''), 10);
          return { status: 'RESERVED_SEQUENCE', sequence: seq };
        }
        if (typeof rechecked === 'object' && rechecked !== null) {
          return { status: 'CACHED', assignment: rechecked as CachedLeadAssignment };
        }
      }
      return { status: 'FAILED' };
    }

    // Jika berhasil acquire lock, naikkan counter dan tandai RESERVED
    const seq = await redis.incr(REDIS_GLOBAL_COUNTER_KEY);
    await redis.set(eventKey, `RESERVED:${seq}`, { ex: ttlSeconds });
    await redis.del(lockKey).catch(() => {});

    return { status: 'ASSIGNED', sequence: seq };
  } catch {
    return { status: 'FAILED' };
  }
}

/**
 * Memeriksa apakah eventId sudah pernah diproses sebelumnya (idempotensi).
 */
export async function getCachedLeadEvent(
  eventId: string
): Promise<CachedLeadAssignment | null> {
  const redis = getRedisClient();
  if (!redis) return null;

  try {
    const cached = await redis.get<CachedLeadAssignment | string>(
      `${REDIS_EVENT_PREFIX}${eventId}`
    );
    if (!cached) return null;
    if (typeof cached === 'string') {
      if (cached.startsWith('RESERVED:')) return null;
      try {
        return JSON.parse(cached) as CachedLeadAssignment;
      } catch {
        return null;
      }
    }
    return cached;
  } catch {
    return null;
  }
}

/**
 * Menyimpan assignment event ke Redis dengan TTL 7 hari agar re-visit dalam
 * periode wajar tetap mengembalikan BusDev yang sama.
 */
export async function cacheLeadEvent(
  eventId: string,
  data: CachedLeadAssignment
): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis) return false;

  try {
    await redis.set(`${REDIS_EVENT_PREFIX}${eventId}`, JSON.stringify(data), {
      ex: 60 * 60 * 24 * 7,
    });
    return true;
  } catch {
    return false;
  }
}
