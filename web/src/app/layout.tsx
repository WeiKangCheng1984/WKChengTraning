import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { BottomNav } from "@/components/BottomNav";
import { PracticeTracker } from "@/components/PracticeTracker";
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
  title: "學習｜CFA · English",
  description: "CFA、English、Real Estate、Lifestyle 個人學習",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
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
        <PracticeTracker />
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8">
          {children}
        </main>
        <footer className="mx-auto max-w-6xl px-4 pb-28 pt-2 text-center text-xs text-[var(--muted)] sm:px-6">
          本機進度 · 非投資建議／非保證考取
        </footer>
        <BottomNav />
      </body>
    </html>
  );
}
