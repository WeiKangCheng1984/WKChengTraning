import Link from "next/link";
import speak from "@/data/speak.json";
import type { SpeakData } from "@/lib/types";

const data = speak as SpeakData;

export default function SpeakIndexPage() {
  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          Speak
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
          跟讀
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-[var(--muted)]">
          逐句 TTS 跟讀，標熟練度後可進英語複習佇列。有 MP3 時可整段播放。
        </p>
      </div>

      {data.series.map((series) => {
        const articles = data.articles.filter((a) => a.series === series.id);
        if (!articles.length) return null;
        return (
          <section
            key={series.id}
            id={`series-${series.id}`}
            className="scroll-mt-20 space-y-3"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
                {series.titleEn}
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
                {series.titleZh}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">
                {series.description}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {articles.length} 篇
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {articles.map((a, i) => (
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
          </section>
        );
      })}
    </div>
  );
}
