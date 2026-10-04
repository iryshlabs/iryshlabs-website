import { redis, KEY_STATISTIK } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET() {
  const total = redis ? Number((await redis.get<number>(KEY_STATISTIK)) ?? 0) : 0;
  return Response.json({ totalDibaca: total });
}
