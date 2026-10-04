"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    href: "/",
    label: "今日",
    match: (p: string) => p === "/",
    icon: (
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"
        fill="currentColor"
      />
    ),
  },
  {
    href: "/speak",
    label: "跟讀",
    match: (p: string) => p.startsWith("/speak"),
    icon: (
      <path
        d="M12 3a3 3 0 0 0-3 3v6a3 3 0 1 0 6 0V6a3 3 0 0 0-3-3zm-7 9a1 1 0 0 1 2 0 5 5 0 0 0 10 0 1 1 0 1 1 2 0 7 7 0 0 1-6 6.93V21h3a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h3v-2.07A7 7 0 0 1 5 12z"
        fill="currentColor"
      />
    ),
  },
  {
    href: "/vault",
    label: "CFA",
    match: (p: string) => p.startsWith("/vault"),
    icon: (
      <path
        d="M6 4h12a1 1 0 0 1 1 1v14l-7-3-7 3V5a1 1 0 0 1 1-1zm2 4v2h8V8H8zm0 4v2h5v-2H8z"
        fill="currentColor"
      />
    ),
  },
  {
    href: "/english",
    label: "英語",
    match: (p: string) => p.startsWith("/english"),
    icon: (
      <path
        d="M4 5h16v2H4V5zm0 4h10v2H4V9zm0 4h16v2H4v-2zm0 4h12v2H4v-2z"
        fill="currentColor"
      />
    ),
  },
  {
    href: "/more",
    label: "更多",
    match: (p: string) =>
      p.startsWith("/more") ||
      p.startsWith("/plan") ||
      p.startsWith("/search") ||
      p.startsWith("/saved") ||
      p.startsWith("/real-estate") ||
      p.startsWith("/rewards"),
    icon: (
      <path
        d="M6 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
        fill="currentColor"
      />
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname() || "/";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-[var(--surface)]/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="主要導覽"
    >
      <div className="mx-auto flex max-w-3xl items-stretch justify-between px-1 pt-1">
        {items.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-14 min-w-[3.5rem] flex-1 flex-col items-center justify-center gap-0.5 rounded-sm px-1 py-2 text-[11px] font-medium transition sm:min-h-16 sm:text-xs ${
                active
                  ? "text-[var(--ink)]"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-6 w-6 sm:h-7 sm:w-7 ${
                  active ? "text-[var(--accent)]" : "text-current"
                }`}
                aria-hidden
              >
                {item.icon}
              </svg>
              <span>{item.label}</span>
              {active ? (
                <span className="mt-0.5 h-1 w-1 rounded-full bg-[var(--accent)]" />
              ) : (
                <span className="mt-0.5 h-1 w-1" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
