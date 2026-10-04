import { GoogleGenAI } from "@google/genai";

export type Item = { nama: string; qty: number; harga_satuan: number; subtotal: number };
export type Nota = {
  adalah_nota: boolean;
  toko: string | null;
  tanggal: string | null;
  items: Item[];
  total: number;
};

// Bentuk JSON yang WAJIB dikembalikan AI (sama prinsipnya dengan bot Python).
const SKEMA = {
  type: "object",
  properties: {
    adalah_nota: { type: "boolean", description: "false jika gambar bukan nota/struk" },
    toko: { anyOf: [{ type: "string" }, { type: "null" }] },
    tanggal: { anyOf: [{ type: "string" }, { type: "null" }], description: "format YYYY-MM-DD, null jika tidak terbaca" },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          nama: { type: "string" },
          qty: { type: "number" },
          harga_satuan: { type: "number" },
          subtotal: { type: "number" },
        },
        required: ["nama", "qty", "harga_satuan", "subtotal"],
      },
    },
    total: { type: "number" },
  },
  required: ["adalah_nota", "toko", "tanggal", "items", "total"],
};

const PROMPT =
  "Kamu membaca foto nota/struk belanja dari Indonesia. Ekstrak datanya. " +
  "Angka rupiah tulis sebagai angka biasa tanpa titik/Rp (contoh 15000). " +
  "Jika tanggal tidak ada, isi null. Jika gambar bukan nota, adalah_nota=false dan items kosong.";

// Daftar model berurutan: utama dulu, lalu cadangan.
// Analogi F5: pool dengan priority group — kalau member utama down/sibuk, traffic pindah ke cadangan.
const MODELS = [
  process.env.GEMINI_MODEL || "gemini-3.8-flash",
  process.env.GEMINI_FALLBACK_MODEL || "gemini-3-flash-preview",
];

// Error yang layak dicoba ulang: server sibuk / overload / sementara gagal.
const BISA_DIULANG = new Set([429, 500, 503, 504]);

export class AiSibukError extends Error {}

const tunggu = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function bacaNota(base64: string, mimeType: string): Promise<Nota> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  let errorTerakhir: unknown = null;

  for (const model of [...new Set(MODELS)]) {
    for (let percobaan = 1; percobaan <= 2; percobaan++) {
      try {
        const res = await ai.models.generateContent({
          model,
          contents: [{ role: "user", parts: [{ inlineData: { mimeType, data: base64 } }, { text: PROMPT }] }],
          config: { responseMimeType: "application/json", responseJsonSchema: SKEMA, temperature: 0 },
        });
        const nota = JSON.parse(res.text ?? "{}") as Nota;
        nota.items = Array.isArray(nota.items) ? nota.items : [];
        return nota;
      } catch (e) {
        errorTerakhir = e;
        const status = (e as { status?: number }).status ?? 0;
        console.warn(`Model ${model} percobaan ${percobaan} gagal (status ${status})`);
        if (status === 404) break; // model tidak dikenal → langsung pindah ke cadangan
        if (!BISA_DIULANG.has(status)) throw e; // error lain (mis. key salah) → jangan diulang
        await tunggu(1200 * percobaan); // jeda singkat sebelum mencoba lagi
      }
    }
  }
  const status = (errorTerakhir as { status?: number })?.status ?? 0;
  if (BISA_DIULANG.has(status)) throw new AiSibukError("Semua model sedang sibuk");
  throw errorTerakhir;
}

// Validasi oleh kode, bukan AI: jumlah subtotal harus sama dengan total.
export function cekTotal(nota: Nota): string | null {
  const jumlah = nota.items.reduce((a, i) => a + (Number(i.subtotal) || 0), 0);
  if (!nota.total && jumlah) nota.total = jumlah;
  if (nota.items.length && Math.abs(jumlah - nota.total) > 1) {
    return `Jumlah item (${jumlah.toLocaleString("id-ID")}) berbeda dengan total nota (${nota.total.toLocaleString("id-ID")}). Bisa karena diskon, pajak, atau foto kurang jelas.`;
  }
  return null;
}
