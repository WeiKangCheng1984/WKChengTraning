import Link from "next/link";
import speak from "@/data/speak.json";
import type { SpeakData } from "@/lib/types";

const data = speak as SpeakData;
const series = data.series[0];

export default function SpeakIndexPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          Speak
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
          跟讀
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-[var(--muted)]">
          {series?.description ??
            "以真人錄音短文練習跟讀。先完成常用口語 6 篇。"}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.articles.map((a, i) => (
          <Link
            key={a.slug}
            href={`/speak/${a.slug}`}
            className="card-tap block min-h-28"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-xs text-[var(--muted)]">
                第 {i + 1} 篇 · {a.segmentCount} 句
              </span>
              <span className="text-xs text-[var(--accent)]">
                {a.durationHint}
              </span>
            </div>
            <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
              {a.titleZh}
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">{a.titleEn}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
