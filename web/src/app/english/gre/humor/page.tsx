import Link from "next/link";
import humor from "@/data/gre-humor.json";
import type { GreHumorData } from "@/lib/greHumor";

const data = humor as GreHumorData;

export default function GreHumorIndexPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/english/gre"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← GRE 單字
        </Link>
        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
          GRE Humor Mode
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          GRE 幽默聯想學單字
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          {data.totalClusters} 個家族課 · {data.uniqueWords}{" "}
          獨特詞。用劇本、角色與對打記住 GRE 級單字；每詞／例句／劇本皆可發音（標準／慢速）。
        </p>
      </div>

      {data.seasons.map((season) => {
        const lessons = data.clusters.filter((c) =>
          season.lessons.includes(c.slug),
        );
        return (
          <section key={season.id} className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
                Season {season.id} · {season.titleEn}
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
                {season.titleZh}
              </h2>
              <p className="text-xs text-[var(--muted)]">{lessons.length} 堂</p>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {lessons.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/english/gre/humor/${c.slug}`}
                    className="block rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 transition hover:border-[var(--accent)]"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs text-[var(--muted)]">
                        {c.typeZh} · {c.memberCount} 詞 · {c.minutes} 分
                      </span>
                      <span className="text-[10px] text-[var(--muted)]">
                        {c.status}
                      </span>
                    </div>
                    <p className="mt-1 font-medium text-[var(--ink)]">
                      {c.titleZh}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
                      {c.hook}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
