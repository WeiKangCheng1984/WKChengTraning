import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const display = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Omni Ledger｜CFA & English",
  description: "CFA Level 1 單字庫與個人英語學習站（Phase 1）",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          {children}
        </main>
        <footer className="border-t border-[var(--line)] py-8 text-center text-xs text-[var(--muted)]">
          Omni Ledger · Phase 1 · 本機進度存於瀏覽器 · 非投資建議／非保證考取
        </footer>
      </body>
    </html>
  );
}
