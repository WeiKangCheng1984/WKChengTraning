import Link from "next/link";
import { PatternRandom10Client } from "@/components/PatternRandom10Client";
import type { PatternTemplates } from "@/lib/patternLoop";
import patternTemplates from "@/data/pattern-templates.json";

const data = patternTemplates as PatternTemplates;

export default function PatternRandom10Page() {
  return (
    <div className="space-y-6">
      <Link
        href="/english/patterns"
        className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
      >
        ← 返回句型覆讀
      </Link>
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          Random 10 patterns
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)] sm:text-3xl">
          十句型隨機集
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          從 L1–L6 抽 10 個模板（每級至少 1 個），每型 12 句變形，一輪共 120
          句覆讀。可先預覽再進入專用播放器。
        </p>
      </div>
      <PatternRandom10Client data={data} />
    </div>
  );
}
