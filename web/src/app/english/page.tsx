import Link from "next/link";
import english from "@/data/english.json";
import type { EnglishData } from "@/lib/types";

const data = english as EnglishData;

export default function EnglishIndexPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
            English Drill
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
            句型與片語積木
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
            共 {data.total} 組。看中文情境組句、切換生活／工作例句、跟讀組裝句——對齊 Cadence
            「積木」練法。
          </p>
        </div>
        <Link
          href="/english/drill"
          className="rounded-sm bg-[var(--accent)] px-4 py-2 text-sm text-white hover:brightness-110"
        >
          全部組句練習
        </Link>
      </div>

      <div className="grid gap-3">
        {data.categories.map((c) => (
          <Link
            key={c.slug}
            href={`/english/${c.slug}`}
            className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]/45"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                {c.title}
              </h2>
              <span className="shrink-0 text-xs text-[var(--muted)]">
                {c.items.length} 組
              </span>
            </div>
            {c.description ? (
              <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                {c.description}
              </p>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
