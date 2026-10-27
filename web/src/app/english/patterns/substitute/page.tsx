import Link from "next/link";
import { PatternSubstituteClient } from "@/components/PatternSubstituteClient";
import type { PatternTemplates } from "@/lib/patternLoop";
import patternTemplates from "@/data/pattern-templates.json";

const data = patternTemplates as PatternTemplates;

export default function PatternSubstitutePage() {
  return (
    <div className="space-y-6">
      <Link
        href="/english/patterns"
        className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
      >
        ← 句型訓練中心
      </Link>
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          Substitution drill
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)] sm:text-3xl">
          抽換快打
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          同一句型骨架，只換關鍵詞。可跟讀（高亮替換）或看中文快打英文。
        </p>
      </div>
      <PatternSubstituteClient data={data} />
    </div>
  );
}
