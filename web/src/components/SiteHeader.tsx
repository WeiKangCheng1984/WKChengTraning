import Link from "next/link";

const links = [
  { href: "/vault", label: "CFA Vault" },
  { href: "/english", label: "English Drill" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--ink)] text-[var(--paper)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group">
          <div className="font-[family-name:var(--font-display)] text-xl tracking-wide sm:text-2xl">
            Omni Ledger
          </div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--accent-soft-text)]">
            CFA · English · Phase 1
          </div>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-sm px-2.5 py-1.5 text-sm text-[var(--paper)]/85 transition hover:bg-white/10 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
