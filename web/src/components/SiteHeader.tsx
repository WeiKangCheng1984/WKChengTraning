import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--ink)] text-[var(--paper)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="min-h-11 min-w-0 py-1">
          <div className="font-[family-name:var(--font-display)] text-xl tracking-wide sm:text-2xl">
            學習
          </div>
          <div className="truncate text-[10px] uppercase tracking-[0.14em] text-[var(--accent-soft-text)]">
            CFA · English · Real Estate · Lifestyle
          </div>
        </Link>
        <Link
          href="/search"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-white/20 px-3 text-sm text-white/90 hover:bg-white/10"
          aria-label="搜尋"
        >
          搜尋
        </Link>
      </div>
    </header>
  );
}
