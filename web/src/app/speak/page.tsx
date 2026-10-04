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
          Speak Track
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
          跟讀軌
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          以真人錄音短文練習跟讀。先完成「常用口語 6 篇」；音檔請放到{" "}
          <code className="text-[var(--ink)]">web/public/audio/speak/common/</code>
          。
        </p>
      </div>

      <section className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              {series?.titleZh ?? "常用口語 6 篇"}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {series?.titleEn} · {data.total} 篇 · 來源 {data.source}
            </p>
          </div>
          <span className="text-xs text-[var(--accent)]">
            音檔目錄 {series?.audioDir}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          {series?.description}
        </p>
      </section>

      <div className="grid gap-3">
        {data.articles.map((a, i) => (
          <Link
            key={a.slug}
            href={`/speak/${a.slug}`}
            className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]/45"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-xs text-[var(--muted)]">
                第 {i + 1} 篇 · {a.segmentCount} 句 · {a.durationHint}
              </span>
              <span className="text-xs text-[var(--accent)]">
                {a.audioFile}
              </span>
            </div>
            <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
              {a.titleZh}
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">{a.titleEn}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{a.summaryZh}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
