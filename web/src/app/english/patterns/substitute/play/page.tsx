import Link from "next/link";
import { PatternSubstitutePlayer } from "@/components/PatternSubstitutePlayer";
import type { PatternTemplates } from "@/lib/patternLoop";
import patternTemplates from "@/data/pattern-templates.json";

const data = patternTemplates as PatternTemplates;

export default function PatternSubstitutePlayPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/english/patterns/substitute"
        className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
      >
        ← 抽換設定
      </Link>
      <PatternSubstitutePlayer data={data} />
    </div>
  );
}
