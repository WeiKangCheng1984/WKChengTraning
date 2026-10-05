import Link from "next/link";
import style from "@/data/style-phrases.json";
import type { StylePhrasesData } from "@/lib/types";

const data = style as StylePhrasesData;

export default function StyleIndexPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/english"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← English
        </Link>
        <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          Style · West Coast
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
          美式風格句型
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          共 {data.total} 句：發語詞、邏輯連接、個人慣用句、壓力緩衝。偏西岸直率＋觀察者視角，每句可 TTS。
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.stages.map((s) => (
          <Link
            key={s.slug}
            href={`/english/style/${s.slug}`}
            className="card-tap block min-h-28"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
              Stage {s.id} · {s.titleEn}
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              {s.titleZh}
            </h2>
            {s.intro ? (
              <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                {s.intro}
              </p>
            ) : null}
            <p className="mt-3 text-xs text-[var(--muted)]">
              {s.sections.length} 主題 ·{" "}
              {s.sections.reduce(
                (n, sec) => n + sec.groups.reduce((m, g) => m + g.items.length, 0),
                0,
              )}{" "}
              句
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
