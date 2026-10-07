"use client";

import { useEffect, useMemo, useState } from "react";
import { masteryKey, summarizeMastery } from "@/lib/mastery";

type Props = {
  cfaIds: Array<string | number>;
  enIds: Array<string | number>;
  vocabIds?: Array<string | number>;
};

export function ProgressSummary({ cfaIds, enIds, vocabIds = [] }: Props) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const sync = () => setTick((t) => t + 1);
    window.addEventListener("omnilearn-mastery", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("omnilearn-mastery", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const cfa = useMemo(() => {
    void tick;
    return summarizeMastery(cfaIds.map((id) => masteryKey("cfa", id)));
  }, [cfaIds, tick]);

  const en = useMemo(() => {
    void tick;
    return summarizeMastery(enIds.map((id) => masteryKey("en", id)));
  }, [enIds, tick]);

  const vocab = useMemo(() => {
    void tick;
    if (!vocabIds.length) return null;
    return summarizeMastery(vocabIds.map((id) => masteryKey("vocab", id)));
  }, [vocabIds, tick]);

  return (
    <div
      className={`grid gap-3 ${vocab ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}
    >
      <StatCard
        title="CFA"
        mastered={cfa.mastered}
        learning={cfa.learning}
        total={cfa.total}
      />
      <StatCard
        title="句型"
        mastered={en.mastered}
        learning={en.learning}
        total={en.total}
      />
      {vocab ? (
        <StatCard
          title="進階詞彙"
          mastered={vocab.mastered}
          learning={vocab.learning}
          total={vocab.total}
        />
      ) : null}
    </div>
  );
}

function StatCard({
  title,
  mastered,
  learning,
  total,
}: {
  title: string;
  mastered: number;
  learning: number;
  total: number;
}) {
  const pct = total ? Math.round((mastered / total) * 100) : 0;
  return (
    <div className="rounded-sm border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-[family-name:var(--font-display)] text-base text-[var(--ink)]">
          {title}
        </h3>
        <span className="text-xs text-[var(--muted)]">{pct}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
        <div
          className="h-full bg-[var(--accent)] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">
        已掌握 <strong className="text-[var(--ink)]">{mastered}</strong>
        {" · "}
        學習中 <strong className="text-[var(--ink)]">{learning}</strong>
        {" · "}
        共 {total}
      </p>
    </div>
  );
}
