import Link from "next/link";
import listening from "@/data/listening.json";
import type { ListeningData } from "@/lib/listening";

const data = listening as ListeningData;

const groups = [
  { id: "easy", title: "簡單", note: "01–10 · 約 400–600 詞" },
  { id: "mid", title: "中等", note: "11–20 · 約 400–600 詞" },
  { id: "hard", title: "強化", note: "21–30 · 約 800–1000 詞" },
] as const;

export default function ListenIndexPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/english"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← 返回英語
        </Link>
        <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          Listening
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          聽力練習
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          30 篇新故事。先讀題旨，再用電腦語音或真人 MP3 聽。英文稿和中文翻譯可以先蓋住。
          真人檔放在 <code className="text-[var(--ink)]">web/public/audio/listen/</code>
          ，每篇兩軌：<code className="text-[var(--ink)]">01-a.mp3</code> 與{" "}
          <code className="text-[var(--ink)]">01-b.mp3</code>。
        </p>
      </div>

      {groups.map((group) => {
        const articles = data.articles.filter((a) => a.level === group.id);
        return (
          <section key={group.id} className="space-y-3">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
                {group.title}
              </h2>
              <p className="text-sm text-[var(--muted)]">{group.note}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {articles.map((a) => (
                <Link
                  key={a.id}
                  href={`/english/listen/${a.id}`}
                  className="card-tap block min-h-28"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs text-[var(--muted)]">
                      {a.id} · {a.words} 詞
                    </span>
                    <span className="text-xs text-[var(--accent)]">
                      {a.levelZh}
                    </span>
                  </div>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                    {a.titleZh}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">{a.titleEn}</p>
                  <p className="mt-2 line-clamp-2 text-xs text-[var(--muted)]">
                    {a.brief}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
