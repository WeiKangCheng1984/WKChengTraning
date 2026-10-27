import Link from "next/link";
import { Suspense } from "react";
import { PatternReflexClient } from "@/components/PatternReflexClient";
import type { PatternTemplates } from "@/lib/patternLoop";
import patternTemplates from "@/data/pattern-templates.json";

const data = patternTemplates as PatternTemplates;

export default function PatternReflexPage() {
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
          Response drill
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)] sm:text-3xl">
          問答反射
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          聽問句，用句型庫的標準句回答（選擇題）。答案皆來自模板變形句。
        </p>
      </div>
      <Suspense fallback={<p className="text-sm text-[var(--muted)]">載入…</p>}>
        <PatternReflexClient data={data} />
      </Suspense>
    </div>
  );
}
