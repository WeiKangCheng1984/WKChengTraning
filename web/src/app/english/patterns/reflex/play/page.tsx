import Link from "next/link";
import { PatternReflexPlayer } from "@/components/PatternReflexPlayer";
import type { PatternTemplates } from "@/lib/patternLoop";
import patternTemplates from "@/data/pattern-templates.json";

const data = patternTemplates as PatternTemplates;

export default function PatternReflexPlayPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/english/patterns/reflex"
        className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
      >
        ← 問答設定
      </Link>
      <PatternReflexPlayer data={data} />
    </div>
  );
}
