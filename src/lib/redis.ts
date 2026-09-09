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
    process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;

  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
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

export interface CachedLeadAssignment {
  assignmentId: string;
  source: string;
  sales: {
    id: string;
    name: string;
  };
  whatsappUrl: string;
}

/**
 * Operasi atomik INCR pada counter global Upstash Redis.
 * Mengembalikan sequence integer, atau null jika Redis gagal.
 */
export async function incrementGlobalCounter(): Promise<number | null> {
  const redis = getRedisClient();
  if (!redis) return null;

  try {
    const sequence = await redis.incr(REDIS_GLOBAL_COUNTER_KEY);
    return sequence;
  } catch {
    return null;
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
    const cached = await redis.get<CachedLeadAssignment>(
      `${REDIS_EVENT_PREFIX}${eventId}`
    );
    return cached || null;
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
    await redis.set(`${REDIS_EVENT_PREFIX}${eventId}`, data, { ex: 60 * 60 * 24 * 7 });
    return true;
  } catch {
    return false;
  }
}
