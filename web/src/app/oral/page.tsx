"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import oral from "@/data/oral-practice.json";
import {
  countOralCompleted,
  getOralUnitResult,
} from "@/lib/oralProgress";
import { onStorageChange } from "@/lib/persist";
import type { OralPracticeData } from "@/lib/types";

const data = oral as OralPracticeData;

const SERIES: Record<string, string> = {
  A: "系列 A｜短句型優先",
  B: "系列 B｜GRE 例句",
  C: "系列 C｜文法短句",
  D: "系列 D｜不動產場景",
  E: "系列 E｜CFA／綜合",
};

export default function OralIndexPage() {
  const [tick, setTick] = useState(0);
  const slugs = useMemo(() => data.units.map((u) => u.slug), []);

  useEffect(() => {
    const sync = () => setTick((t) => t + 1);
    sync();
    window.addEventListener("omnilearn-oral", sync);
    const off = onStorageChange(sync);
    return () => {
      window.removeEventListener("omnilearn-oral", sync);
      off();
    };
  }, []);

  const done = useMemo(() => {
    void tick;
    return countOralCompleted(slugs);
  }, [slugs, tick]);

  const continueUnit = useMemo(() => {
    void tick;
    return (
      data.units.find((u) => {
        const r = getOralUnitResult(u.slug);
        return !r || r.doneCount < r.total;
      }) ?? data.units[0]
    );
  }, [tick]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof data.units>();
    for (const u of data.units) {
      const list = map.get(u.series) ?? [];
      list.push(u);
      map.set(u.series, list);
    }
    return Array.from(map.entries());
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          Oral Practice · Phase A
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
          口語練習
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          共 {data.totalUnits} 單元 · 每單元 {data.sentencesPerUnit}{" "}
          句 · 聽示範 → 跟讀 → 瀏覽器語音評分。來源含短句型、GRE
          例句、文法短文、不動產與少量 CFA。已完成單元 {done} /{" "}
          {data.totalUnits}。
        </p>
      </div>

      <Link href={`/oral/${continueUnit.slug}`} className="focus-cta">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">
          Continue · 今日 10 句
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          {done === 0 ? "開始第一單元" : "繼續練習"}
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {continueUnit.num.toString().padStart(2, "0")}. {continueUnit.titleZh}
        </p>
      </Link>

      {groups.map(([series, units]) => (
        <section key={series} className="space-y-3">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
            {SERIES[series] ?? `系列 ${series}`}
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {units.map((u) => {
              const r = getOralUnitResult(u.slug);
              return (
                <Link
                  key={u.slug}
                  href={`/oral/${u.slug}`}
                  className="card-tap block min-h-24"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--accent)]">
                      #{u.num.toString().padStart(2, "0")} · {u.sentenceCount}{" "}
                      句
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {r
                        ? `${r.doneCount}/${r.total} · ${r.avgScore}%`
                        : "未開始"}
                    </p>
                  </div>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
                    {u.titleZh}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">
                    {u.blurb}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
