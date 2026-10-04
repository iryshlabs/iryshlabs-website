import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Redis.fromEnv() otomatis membaca UPSTASH_REDIS_REST_URL/TOKEN
// atau KV_REST_API_URL/TOKEN (nama yang diisi otomatis oleh integrasi Upstash di Vercel).
const adaRedis = Boolean(
  (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN),
);

export const redis = adaRedis ? Redis.fromEnv() : null;

export const BATAS_PER_IP = 5; // percobaan per pengunjung per hari
export const BATAS_GLOBAL = 300; // total percobaan seluruh website per hari (pengaman biaya API)

// Analogi F5: seperti rate shaping / brute-force protection di ASM.
export const limitPerIp = redis
  ? new Ratelimit({ redis, prefix: "demo:ip", limiter: Ratelimit.fixedWindow(BATAS_PER_IP, "1 d") })
  : null;

export const limitGlobal = redis
  ? new Ratelimit({ redis, prefix: "demo:global", limiter: Ratelimit.fixedWindow(BATAS_GLOBAL, "1 d") })
  : null;

export const KEY_STATISTIK = "stats:nota_dibaca";
