/**

 * roundRobin.ts

 *

 * FIX UTAMA #1: Counter round-robin disimpan di Redis (Upstash), BUKAN di

 * variable in-memory (`let index = 0`). Ini penting karena Next.js di

 * Vercel/serverless bisa spin up banyak instance function berbeda —

 * variable in-memory akan reset ke 0 tiap cold start, jadi agent pertama

 * di array (cs1) akan sering "menang" duluan. Redis INCR bersifat atomic

 * dan shared across semua instance, jadi urutan rotasi konsisten walau

 * request datang dari instance server yang berbeda-beda.

 *

 * FIX UTAMA #2: Ini SATU-SATUNYA implementasi round-robin di seluruh

 * project. Sebelumnya ada dua file mirip (roundRobin.ts & round-robin.ts)

 * yang jalan independen dengan counter masing-masing — itu penyebab

 * distribusi ganda/tidak konsisten. Semua pemanggil (client hook, redirect

 * route, dsb) HARUS import dari file ini saja.

 *

 * Install dulu: npm install @upstash/redis

 *

 * Env vars yang dibutuhkan — PENTING: karena waktu connect integration di

 * Vercel dipakai Custom Prefix "UPSTASH_REDIS_REST", nama variable yang

 * ke-generate BUKAN nama default UPSTASH_REDIS_REST_URL/TOKEN yang biasa

 * dibaca otomatis oleh Redis.fromEnv(). Nama aslinya jadi:

 *   UPSTASH_REDIS_REST_KV_REST_API_URL

 *   UPSTASH_REDIS_REST_KV_REST_API_TOKEN

 * Makanya di sini Redis client dibuat manual (bukan .fromEnv()) supaya

 * baca dari nama variable yang benar-benar ada.

 */

import { Redis } from '@upstash/redis';

import { Agent, getActiveAgents } from './round-robin-config';

const redis = new Redis({

  url: process.env.UPSTASH_REDIS_REST_KV_REST_API_URL!,

  token: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN!,

});

const COUNTER_KEY = 'dreamlab:leadpool:counter';

/**

 * Ambil agent berikutnya secara atomic & fair, berdasarkan list agent

 * AKTIF saat request ini terjadi (bukan snapshot lama). Kalau ada CS baru

 * ditambahkan ke config, next() otomatis ikut menghitungnya tanpa perlu

 * reset apapun.

 */

export async function getNextAgent(): Promise<Agent> {

  const activeAgents = getActiveAgents();

  // Atomic increment di Redis — aman dipanggil bersamaan dari banyak

  // request/instance tanpa race condition.

  const count = await redis.incr(COUNTER_KEY);

  const index = (count - 1) % activeAgents.length;

  return activeAgents[index];

}

/**

 * Untuk debugging/monitoring: lihat total assignment yang sudah terjadi.

 */

export async function getRoundRobinStats() {

  const count = (await redis.get<number>(COUNTER_KEY)) ?? 0;

  return {

    totalAssigned: count,

    activeAgents: getActiveAgents().map((a) => a.id),

  };

}

/**

 * Reset manual — HANYA untuk keperluan testing/ops, jangan dipanggil

 * dari flow produksi otomatis.

 */

export async function resetRoundRobinCounter() {

  await redis.set(COUNTER_KEY, 0);

}
