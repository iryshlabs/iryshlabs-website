import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Font disimpan di folder app/fonts (self-hosted), jadi build tidak bergantung ke Google Fonts.
const poppins = localFont({
  variable: "--font-poppins",
  src: [
    { path: "./fonts/Poppins-Regular.ttf", weight: "400" },
    { path: "./fonts/Poppins-Medium.ttf", weight: "500" },
    { path: "./fonts/Poppins-Bold.ttf", weight: "700" },
  ],
});

const inter = localFont({
  variable: "--font-inter",
  src: [
    { path: "./fonts/Inter-Regular.otf", weight: "400" },
    { path: "./fonts/Inter-Medium.otf", weight: "500" },
    { path: "./fonts/Inter-SemiBold.otf", weight: "600" },
  ],
});

export const metadata: Metadata = {
  title: "Irysh Labs — Bot AI & Otomasi Data untuk UMKM",
  description:
    "Jasa pembuatan bot AI Telegram & WhatsApp: balas pelanggan otomatis, catat pesanan ke Google Sheets, dan baca foto nota dengan AI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${poppins.variable} ${inter.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
