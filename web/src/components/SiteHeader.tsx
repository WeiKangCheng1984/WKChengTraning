import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthButton } from "@/components/AuthButton";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--ink)] text-[var(--paper)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <Link href="/" className="min-h-10 min-w-0 py-0.5">
          <div className="font-[family-name:var(--font-display)] text-lg tracking-wide sm:text-xl">
            學習
          </div>
          <div className="truncate text-[9px] uppercase tracking-[0.14em] text-[var(--accent-soft-text)]">
            CFA · English · Real Estate · Lifestyle
          </div>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <AuthButton />
          <Link
            href="/search"
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-sm border border-white/20 px-3 text-sm text-white/90 hover:bg-white/10"
            aria-label="搜尋"
          >
            搜尋
          </Link>
        </div>
      </div>
    </header>
  );
}
