"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PLAN_DAYS, getCompletedDays, planProgress } from "@/lib/plan";
import { onStorageChange } from "@/lib/persist";

export default function PlanIndexPage() {
  const [done, setDone] = useState<number[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 20, pct: 0 });

  useEffect(() => {
    const sync = () => {
      setDone(getCompletedDays());
      setProgress(planProgress());
    };
    sync();
    return onStorageChange(sync);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          Twenty-Day Plan
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
          20 天學習節奏
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          每天打包「一科 CFA＋一類英語」。可自由跳天，不必卡順序。已完成{" "}
          {progress.done}/{progress.total}。
        </p>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
        <div
          className="h-full bg-[var(--accent)]"
          style={{ width: `${progress.pct}%` }}
        />
      </div>

      <div className="grid gap-3">
        {PLAN_DAYS.map((d) => {
          const complete = done.includes(d.day);
          return (
            <Link
              key={d.day}
              href={`/plan/${d.day}`}
              className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]/45"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="text-xs text-[var(--muted)]">
                  DAY {String(d.day).padStart(2, "0")} · WEEK {d.week}
                  {complete ? " · 完成" : ""}
                </div>
                <div className="text-xs text-[var(--accent)]">{d.titleEn}</div>
              </div>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                {d.titleZh}
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{d.blurb}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
