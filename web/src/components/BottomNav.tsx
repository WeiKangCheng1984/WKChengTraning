"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CuteIcon } from "@/components/CuteIcon";

const items = [
  {
    href: "/",
    label: "今日",
    match: (p: string) => p === "/",
    icon: "sun" as const,
  },
  {
    href: "/english/today",
    label: "微課",
    match: (p: string) => p.startsWith("/english/today"),
    icon: "rocket" as const,
  },
  {
    href: "/vault",
    label: "CFA",
    match: (p: string) => p.startsWith("/vault"),
    icon: "vault" as const,
  },
  {
    href: "/english",
    label: "英語",
    match: (p: string) =>
      p.startsWith("/english") && !p.startsWith("/english/today"),
    icon: "book" as const,
  },
  {
    href: "/more",
    label: "更多",
    match: (p: string) =>
      p.startsWith("/more") ||
      p.startsWith("/search") ||
      p.startsWith("/saved") ||
      p.startsWith("/real-estate") ||
      p.startsWith("/rewards") ||
      p.startsWith("/quiz") ||
      p.startsWith("/oral") ||
      p.startsWith("/speak"),
    icon: "more" as const,
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
      <div className="mx-auto flex max-w-3xl items-stretch justify-between px-1">
        {items.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-12 min-w-[3rem] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] font-medium transition sm:min-h-[3.25rem] sm:text-[11px] ${
                active
                  ? "text-[var(--ink)]"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              <CuteIcon
                name={item.icon}
                className={`text-lg ${active ? "" : "opacity-80"}`}
              />
              <span>{item.label}</span>
              {active ? (
                <span className="h-0.5 w-0.5 rounded-full bg-[var(--accent)]" />
              ) : (
                <span className="h-0.5 w-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
