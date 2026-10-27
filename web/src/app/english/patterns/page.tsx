import Link from "next/link";
import { PatternLoopPlayer } from "@/components/PatternLoopPlayer";
import type { PatternTemplates } from "@/lib/patternLoop";
import patternTemplates from "@/data/pattern-templates.json";

const data = patternTemplates as PatternTemplates;

export default function PatternLoopPage() {
  const templates = data.levels.reduce((n, lv) => n + lv.items.length, 0);
  const sentences = data.levels.reduce(
    (n, lv) => n + lv.items.reduce((m, it) => m + it.rows.length, 0),
    0,
  );

  return (
    <div className="space-y-6">
      <Link
        href="/english"
        className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
      >
        ← 返回英語
      </Link>
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          Pattern loop
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)] sm:text-3xl">
          句型覆讀
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          一次一個模板，句子輪流播放並循環。{templates} 個模板 · {sentences} 句。
        </p>
      </div>
      <Link
        href="/english/patterns/random"
        className="block rounded-sm border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-4 transition hover:border-[var(--ink)]"
      >
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
          推薦
        </p>
        <p className="mt-1 font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
          十句型隨機集 · 120 句一輪
        </p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          L1–L6 抽 10 模板，今日固定或重新抽籤，專用覆讀播放器。
        </p>
      </Link>
      <PatternLoopPlayer data={data} />
    </div>
  );
}
