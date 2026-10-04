import Link from "next/link";

const links = [
  { href: "/plan", label: "20 天計畫" },
  { href: "/vault", label: "CFA" },
  { href: "/english", label: "英語" },
  { href: "/speak", label: "跟讀" },
  { href: "/search", label: "搜尋" },
  { href: "/saved", label: "收藏" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--ink)] text-[var(--paper)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group shrink-0">
          <div className="font-[family-name:var(--font-display)] text-xl tracking-wide sm:text-2xl">
            Omni Ledger
          </div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--accent-soft-text)]">
            CFA · English · Cadence
          </div>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-sm px-2 py-1.5 text-xs text-[var(--paper)]/85 transition hover:bg-white/10 hover:text-white sm:px-2.5 sm:text-sm"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
