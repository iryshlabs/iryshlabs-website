"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";

type Item = { nama: string; qty: number; harga_satuan: number; subtotal: number };
type Nota = { toko: string | null; tanggal: string | null; items: Item[]; total: number };
type Hasil = { nota?: Nota; peringatan?: string | null; sisa?: number | null; totalDibaca?: number | null; error?: string };

const rp = (n: number) => "Rp" + Math.round(Number(n) || 0).toLocaleString("id-ID");

// Kecilkan foto di browser sebelum dikirim: lebih cepat, hemat kuota, dan di bawah batas 4 MB.
async function kompres(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const skala = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * skala);
    c.height = Math.round(bmp.height * skala);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    return await new Promise((ok) => c.toBlob((b) => ok(b ?? file), "image/jpeg", 0.85));
  } catch {
    return file; // kalau browser tidak bisa memproses (mis. HEIC), kirim apa adanya
  }
}

export default function DemoScan({ waLink }: { waLink: string }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState<Hasil | null>(null);
  const [totalDibaca, setTotalDibaca] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setTotalDibaca(d.totalDibaca))
      .catch(() => {});
  }, []);

  function pilih(f: File | undefined) {
    if (!f) return;
    setFile(f);
    setHasil(null);
    setPreview(URL.createObjectURL(f));
  }

  async function baca() {
    if (!file) return;
    setLoading(true);
    setHasil(null);
    try {
      const fd = new FormData();
      fd.append("foto", await kompres(file), "nota.jpg");
      const res = await fetch("/api/scan", { method: "POST", body: fd });
      const data: Hasil = await res.json();
      setHasil(data);
      if (data.totalDibaca) setTotalDibaca(data.totalDibaca);
    } catch {
      setHasil({ error: "Koneksi bermasalah. Coba lagi." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2">
      {/* Kiri: upload */}
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-72 w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-silver-400/30 text-silver-400 hover:border-accent/60 hover:bg-white/5"
        >
          {preview ? (
            <img src={preview} alt="Pratinjau nota" className="h-full w-full object-contain" />
          ) : (
            <span className="px-6 text-center">
              📸 Klik untuk memilih atau memotret nota
              <br />
              <span className="text-xs">JPG / PNG / WEBP</span>
            </span>
          )}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => pilih(e.target.files?.[0])} />
        <button
          onClick={baca}
          disabled={!file || loading}
          className="mt-4 w-full rounded-full bg-accent py-3 font-semibold text-white enabled:hover:brightness-110 disabled:opacity-40"
        >
          {loading ? "⏳ AI sedang membaca..." : "Baca Nota dengan AI"}
        </button>
        <p className="mt-3 text-xs text-silver-400">
          🔒 Foto hanya diproses untuk demo dan tidak disimpan. Maksimal 5 percobaan per hari.
          {totalDibaca ? ` · 🧾 ${totalDibaca.toLocaleString("id-ID")} nota sudah dibaca AI kami` : ""}
        </p>
      </div>

      {/* Kanan: hasil */}
      <div className="min-h-72 rounded-2xl border border-white/10 bg-navy-950/60 p-5">
        {!hasil && !loading && <p className="text-silver-400">Hasil bacaan akan muncul di sini.</p>}
        {loading && <p className="animate-pulse text-silver-400">Membaca item, harga, dan total…</p>}
        {hasil?.error && (
          <div>
            <p className="text-red-300">⚠️ {hasil.error}</p>
            <a href={waLink} target="_blank" className="mt-4 inline-block text-sm text-accent underline">
              Hubungi kami via WhatsApp
            </a>
          </div>
        )}
        {hasil?.nota && (
          <div>
            <div className="mb-3 flex flex-wrap justify-between gap-2 text-sm text-silver-400">
              <span>🏪 {hasil.nota.toko || "-"}</span>
              <span>📅 {hasil.nota.tanggal || "-"}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-silver-400">
                    <th className="py-2">Item</th>
                    <th className="py-2 text-right">Qty</th>
                    <th className="py-2 text-right">Harga</th>
                    <th className="py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {hasil.nota.items.map((it, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-2 pr-2">{it.nama}</td>
                      <td className="py-2 text-right">{it.qty}</td>
                      <td className="py-2 text-right">{rp(it.harga_satuan)}</td>
                      <td className="py-2 text-right">{rp(it.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-semibold">
                    <td className="pt-3" colSpan={3}>Total</td>
                    <td className="pt-3 text-right text-accent">{rp(hasil.nota.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            {hasil.peringatan && <p className="mt-3 text-xs text-yellow-300">⚠️ {hasil.peringatan}</p>}
            <div className="mt-5 rounded-xl bg-accent/10 p-4 text-sm">
              Mau data ini otomatis masuk ke Google Sheets usaha Anda?{" "}
              <a href={waLink} target="_blank" className="font-semibold text-accent underline">
                Konsultasi gratis
              </a>
            </div>
            {typeof hasil.sisa === "number" && <p className="mt-3 text-xs text-silver-400">Sisa percobaan hari ini: {hasil.sisa}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
