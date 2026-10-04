/* eslint-disable @next/next/no-img-element */

// ============================================================
// GANTI DATA KONTAK DI SINI
// ============================================================
const KONTAK = {
  whatsapp: "6285244066036", // format internasional tanpa + dan tanpa 0 di depan
  telegram: "iryshlabs",
  email: "iryshlabs@gmail.com",
};
const WA_LINK = `https://wa.me/${KONTAK.whatsapp}?text=${encodeURIComponent(
  "Halo Irysh Labs, saya mau konsultasi soal bot untuk usaha saya.",
)}`;

const FITUR = [
  {
    judul: "Balas pelanggan 24 jam",
    isi: "Bot menjawab pertanyaan stok, harga, dan jam buka secara otomatis, bahkan saat Anda tidur.",
  },
  {
    judul: "Catat otomatis ke Google Sheets",
    isi: "Pesanan, pemasukan, dan pengeluaran langsung tercatat rapi tanpa input manual.",
  },
  {
    judul: "Baca foto nota dengan AI",
    isi: "Cukup foto struk belanja, AI membaca item dan totalnya lalu menyusun laporan.",
  },
];

const PAKET = [
  {
    nama: "Basic",
    untuk: "UMKM kecil & komunitas",
    harga: "Rp300.000",
    durasi: "5–7 hari",
    fitur: ["Auto-reply & menu tombol", "Jawaban FAQ", "Maks. 5 perintah kustom", "Revisi 2× · garansi 14 hari"],
  },
  {
    nama: "Standard",
    untuk: "Toko online, katering, laundry",
    harga: "Rp1.200.000",
    durasi: "10–14 hari",
    populer: true,
    fitur: ["Semua fitur Basic", "Chatbot AI bahasa natural", "Terhubung Google Sheets", "Catat pesanan otomatis"],
  },
  {
    nama: "Pro",
    untuk: "Usaha dengan banyak nota & tim",
    harga: "Rp2.500.000",
    durasi: "3–4 minggu",
    fitur: ["Semua fitur Standard", "Baca foto nota/struk (AI)", "Database & multi-pengguna", "Rekap laporan lewat chat"],
  },
];

const LANGKAH = ["Konsultasi gratis", "Penawaran & jadwal", "DP 50%, pengerjaan", "Uji coba & revisi", "Serah terima"];

const FAQ = [
  { t: "Telegram atau WhatsApp?", j: "Keduanya bisa. Telegram lebih cepat dan murah; WhatsApp cocok bila pelanggan Anda di sana." },
  { t: "Apakah data saya aman?", j: "Data tersimpan di Google Sheets/database milik Anda sendiri dan tidak dibagikan ke pihak lain." },
  { t: "Bagaimana kalau AI salah baca nota?", j: "Hasil bisa dicek dan dikoreksi lewat chat. Perhitungan angka memakai rumus, bukan tebakan AI." },
  { t: "Ada biaya bulanan?", j: "Ada, mulai Rp125.000/bulan untuk server, biaya AI, dan perawatan agar bot tetap berjalan." },
];

function Logo({ size = 36 }: { size?: number }) {
  return <img src="/logo-mark.svg" alt="Logo Irysh Labs" width={size} height={size} />;
}

export default function Home() {
  return (
    <main className="flex-1">
      {/* ---------------- NAVBAR ---------------- */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-navy-950/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="#" className="flex items-center gap-3">
            <Logo />
            <span className="font-display text-lg font-medium tracking-[0.3em] text-silver">IRYSH LABS</span>
          </a>
          <div className="hidden items-center gap-8 text-sm text-silver-400 md:flex">
            <a href="#layanan" className="hover:text-white">Layanan</a>
            <a href="#demo" className="hover:text-white">Coba Bot</a>
            <a href="#harga" className="hover:text-white">Harga</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </div>
          <a href={WA_LINK} target="_blank" className="rounded-full bg-silver-50 px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-white">
            Konsultasi
          </a>
        </nav>
      </header>

      {/* ---------------- HERO ---------------- */}
      <section className="bg-grid relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="mb-4 inline-block rounded-full border border-silver-400/30 px-3 py-1 text-xs tracking-widest text-silver-400">
              BOT AI • OTOMASI DATA • WHATSAPP & TELEGRAM
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
              <span className="text-silver">Bot AI yang bekerja</span>
              <br />
              <span className="text-accent">untuk bisnis Anda.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-silver-400">
              Balas pelanggan otomatis, catat pesanan ke Google Sheets, dan baca foto nota dengan AI. Hemat waktu admin,
              fokus kembangkan usaha.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#demo" className="rounded-full bg-accent px-6 py-3 font-semibold text-white hover:brightness-110">
                Coba Gratis Sekarang
              </a>
              <a href="#harga" className="rounded-full border border-silver-400/40 px-6 py-3 font-semibold text-silver-50 hover:bg-white/5">
                Lihat Paket
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <img src="/logo-mark.svg" alt="" className="w-64 drop-shadow-[0_20px_60px_rgba(76,141,255,0.35)] md:w-80" />
          </div>
        </div>
      </section>

      {/* ---------------- FITUR ---------------- */}
      <section id="layanan" className="mx-auto max-w-6xl px-5 py-20">
        <p className="text-sm font-semibold tracking-widest text-accent">LAYANAN</p>
        <h2 className="font-display mt-2 text-3xl font-bold text-silver md:text-4xl">Apa yang bisa bot lakukan?</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {FITUR.map((f) => (
            <div key={f.judul} className="rounded-2xl border border-white/10 bg-navy-900/60 p-6">
              <h3 className="font-display text-lg font-semibold text-silver-50">{f.judul}</h3>
              <p className="mt-2 text-silver-400">{f.isi}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- DEMO (Tahap 2) ---------------- */}
      <section id="demo" className="mx-auto max-w-6xl px-5 py-20">
        <div className="rounded-3xl border border-accent/30 bg-gradient-to-br from-navy-800 to-navy-900 p-8 md:p-12">
          <p className="text-sm font-semibold tracking-widest text-accent">COBA BOT</p>
          <h2 className="font-display mt-2 text-3xl font-bold text-silver md:text-4xl">Foto nota, AI langsung membacanya</h2>
          <p className="mt-3 max-w-2xl text-silver-400">
            Upload foto struk belanja Anda dan lihat sendiri hasilnya dalam hitungan detik.
          </p>
          <div className="mt-8 flex h-48 items-center justify-center rounded-2xl border-2 border-dashed border-silver-400/30 text-silver-400">
            🚧 Demo segera hadir
          </div>
        </div>
      </section>

      {/* ---------------- HARGA ---------------- */}
      <section id="harga" className="mx-auto max-w-6xl px-5 py-20">
        <p className="text-sm font-semibold tracking-widest text-accent">PAKET</p>
        <h2 className="font-display mt-2 text-3xl font-bold text-silver md:text-4xl">Pilih sesuai kebutuhan</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PAKET.map((p) => (
            <div
              key={p.nama}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                p.populer ? "border-accent bg-navy-800" : "border-white/10 bg-navy-900/60"
              }`}
            >
              {p.populer && (
                <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-semibold">Paling Populer</span>
              )}
              <h3 className="font-display text-xl font-semibold">{p.nama}</h3>
              <p className="text-sm text-silver-400">{p.untuk}</p>
              <p className="mt-5 text-xs text-silver-400">Mulai dari</p>
              <p className="font-display text-3xl font-bold text-silver">{p.harga}</p>
              <p className="mt-1 text-xs text-silver-400">sekali bayar · pengerjaan {p.durasi}</p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-silver-200">
                {p.fitur.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-accent">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href={WA_LINK} target="_blank" className="mt-6 rounded-full border border-silver-400/40 py-2 text-center text-sm font-semibold hover:bg-white/5">
                Pilih {p.nama}
              </a>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-silver-400">
          Butuh WhatsApp API resmi, integrasi pembayaran, atau dashboard? <a href={WA_LINK} className="text-accent underline">Konsultasikan paket Custom</a>.
        </p>
      </section>

      {/* ---------------- PROSES ---------------- */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="font-display text-3xl font-bold text-silver md:text-4xl">Cara kerja</h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-5">
          {LANGKAH.map((l, i) => (
            <li key={l} className="rounded-2xl border border-white/10 bg-navy-900/60 p-5">
              <span className="font-display text-2xl font-bold text-accent">{i + 1}</span>
              <p className="mt-2 text-sm text-silver-200">{l}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="font-display text-3xl font-bold text-silver md:text-4xl">Pertanyaan umum</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {FAQ.map((f) => (
            <details key={f.t} className="group rounded-2xl border border-white/10 bg-navy-900/60 p-5">
              <summary className="cursor-pointer font-semibold text-silver-50">{f.t}</summary>
              <p className="mt-2 text-silver-400">{f.j}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------------- CTA & FOOTER ---------------- */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-gradient-to-r from-navy-800 to-navy-700 p-8 md:flex-row md:items-center md:p-12">
          <div>
            <h2 className="font-display text-2xl font-bold text-silver md:text-3xl">Siap otomatiskan bisnis Anda?</h2>
            <p className="mt-2 text-silver-400">Konsultasi gratis, tanpa kewajiban.</p>
          </div>
          <a href={WA_LINK} target="_blank" className="rounded-full bg-silver-50 px-6 py-3 font-semibold text-navy-900 hover:bg-white">
            Chat via WhatsApp
          </a>
        </div>
      </section>

      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-silver-400 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Logo size={28} />
            <span>© {new Date().getFullYear()} Irysh Labs</span>
          </div>
          <div className="flex gap-6">
            <a href={`https://t.me/${KONTAK.telegram}`} className="hover:text-white">Telegram</a>
            <a href={`mailto:${KONTAK.email}`} className="hover:text-white">{KONTAK.email}</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
