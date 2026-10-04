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

export async function bacaNota(base64: string, mimeType: string): Promise<Nota> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const res = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
    contents: [{ role: "user", parts: [{ inlineData: { mimeType, data: base64 } }, { text: PROMPT }] }],
    config: { responseMimeType: "application/json", responseJsonSchema: SKEMA, temperature: 0 },
  });
  const nota = JSON.parse(res.text ?? "{}") as Nota;
  nota.items = Array.isArray(nota.items) ? nota.items : [];
  return nota;
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
