import Link from "next/link";
import { PatternRandom10Player } from "@/components/PatternRandom10Player";
import type { PatternTemplates } from "@/lib/patternLoop";
import patternTemplates from "@/data/pattern-templates.json";

const data = patternTemplates as PatternTemplates;

export default function PatternRandom10PlayPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/english/patterns/random"
        className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
      >
        ← 十句型清單
      </Link>
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          Pattern loop · 10 templates
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)] sm:text-3xl">
          十句型覆讀播放
        </h1>
      </div>
      <PatternRandom10Player data={data} />
    </div>
  );
}
