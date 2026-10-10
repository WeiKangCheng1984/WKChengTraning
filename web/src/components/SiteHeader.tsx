import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthButton } from "@/components/AuthButton";

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-white/10 text-white"
      style={{
        background:
          "linear-gradient(105deg, var(--ink-soft) 0%, color-mix(in srgb, var(--sky) 72%, var(--ink-soft)) 48%, color-mix(in srgb, var(--accent) 78%, var(--ink-soft)) 100%)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <Link href="/" className="min-h-10 min-w-0 py-0.5">
          <div className="font-[family-name:var(--font-display)] text-lg tracking-wide sm:text-xl">
            學習
          </div>
          <div className="truncate text-[9px] uppercase tracking-[0.14em] text-white/75">
            CFA · English · Real Estate · Lifestyle
          </div>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <AuthButton />
          <Link
            href="/search"
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-white/25 px-3 text-sm text-white/95 hover:bg-white/10"
            aria-label="搜尋"
          >
            搜尋
          </Link>
        </div>
      </div>
    </header>
  );
}
