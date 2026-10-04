import { bacaNota, cekTotal, AiSibukError } from "@/lib/nota";
import { redis, limitPerIp, limitGlobal, KEY_STATISTIK } from "@/lib/redis";

export const runtime = "nodejs";
export const maxDuration = 60; // detik; termasuk waktu coba ulang & pindah ke model cadangan

const MAKS_UKURAN = 4 * 1024 * 1024; // 4 MB (batas body request di Vercel ±4,5 MB)
const TIPE_DIIZINKAN = ["image/jpeg", "image/png", "image/webp"];

function ipPengunjung(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "anon";
}

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ error: "Demo belum dikonfigurasi (GEMINI_API_KEY kosong)." }, { status: 500 });
  }

  // 1) Rate limit — dicek SEBELUM memanggil AI supaya tidak keluar biaya
  let sisa: number | null = null;
  if (limitPerIp && limitGlobal) {
    const g = await limitGlobal.limit("semua");
    if (!g.success) {
      return Response.json({ error: "Kuota demo hari ini sudah habis. Coba lagi besok atau hubungi kami." }, { status: 429 });
    }
    const r = await limitPerIp.limit(ipPengunjung(req));
    sisa = r.remaining;
    if (!r.success) {
      return Response.json(
        { error: "Anda sudah mencoba 5 kali hari ini. Mau lihat lebih banyak? Hubungi kami untuk demo lengkap.", sisa: 0 },
        { status: 429 },
      );
    }
  }

  // 2) Validasi file
  const form = await req.formData().catch(() => null);
  const file = form?.get("foto");
  if (!(file instanceof File)) return Response.json({ error: "Foto tidak ditemukan." }, { status: 400 });
  if (!TIPE_DIIZINKAN.includes(file.type)) return Response.json({ error: "Format harus JPG, PNG, atau WEBP." }, { status: 400 });
  if (file.size > MAKS_UKURAN) return Response.json({ error: "Ukuran foto maksimal 4 MB." }, { status: 413 });

  // 3) Baca nota dengan AI (foto TIDAK disimpan di mana pun)
  try {
    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
    const nota = await bacaNota(base64, file.type);
    if (!nota.adalah_nota) {
      return Response.json({ error: "Sepertinya ini bukan foto nota/struk. Coba foto lain ya.", sisa });
    }
    const peringatan = cekTotal(nota);
    const total = redis ? await redis.incr(KEY_STATISTIK) : null;
    return Response.json({ nota, peringatan, sisa, totalDibaca: total });
  } catch (e) {
    console.error("Gagal membaca nota:", e);
    if (e instanceof AiSibukError) {
      return Response.json(
        { error: "Server AI sedang sangat ramai. Tunggu sekitar 1 menit lalu coba lagi.", sisa },
        { status: 503 },
      );
    }
    return Response.json({ error: "Gagal membaca nota. Coba foto ulang dengan lebih jelas dan terang.", sisa }, { status: 502 });
  }
}
