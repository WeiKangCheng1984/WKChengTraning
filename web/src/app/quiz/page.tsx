"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import quizBank from "@/data/quiz-bank.json";
import { countCompleted, getQuizResult } from "@/lib/quizProgress";
import { onStorageChange } from "@/lib/persist";
import type { QuizBankData } from "@/lib/types";

const data = quizBank as QuizBankData;

const SERIES_LABEL: Record<string, string> = {
  A: "系列 A｜GRE 路徑",
  B: "系列 B｜職場詞彙",
  C: "系列 C｜綜合複習",
};

export default function QuizIndexPage() {
  const [tick, setTick] = useState(0);
  const slugs = useMemo(() => data.quizzes.map((q) => q.slug), []);

  useEffect(() => {
    const sync = () => setTick((t) => t + 1);
    sync();
    window.addEventListener("omnilearn-quiz", sync);
    const off = onStorageChange(sync);
    return () => {
      window.removeEventListener("omnilearn-quiz", sync);
      off();
    };
  }, []);

  const done = useMemo(() => {
    void tick;
    return countCompleted(slugs);
  }, [slugs, tick]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof data.quizzes>();
    for (const q of data.quizzes) {
      const list = map.get(q.series) ?? [];
      list.push(q);
      map.set(q.series, list);
    }
    return Array.from(map.entries());
  }, []);

  const continueQuiz = useMemo(() => {
    void tick;
    return data.quizzes.find((q) => !getQuizResult(q.slug)) ?? data.quizzes[0];
  }, [tick]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          Quiz Bank
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
          測驗庫
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          共 {data.totalQuizzes} 篇 · 每篇 {data.defaultQuestionCount}{" "}
          題 · 單字填空三選一 · 可選單獨解析或測驗解析模式。已完成 {done} /{" "}
          {data.totalQuizzes}。
        </p>
      </div>

      <Link href={`/quiz/${continueQuiz.slug}`} className="focus-cta">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">
          Continue
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          {done === 0 ? "開始第一篇" : done >= data.totalQuizzes ? "再練一篇" : "繼續下一篇"}
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {continueQuiz.num.toString().padStart(2, "0")}. {continueQuiz.titleZh}
        </p>
      </Link>

      {groups.map(([series, quizzes]) => (
        <section key={series} className="space-y-3">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
            {SERIES_LABEL[series] ?? `系列 ${series}`}
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {quizzes.map((q) => {
              const result = getQuizResult(q.slug);
              return (
                <Link
                  key={q.slug}
                  href={`/quiz/${q.slug}`}
                  className="card-tap block min-h-24"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--accent)]">
                      #{q.num.toString().padStart(2, "0")} · {q.questionCount}{" "}
                      題
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {result ? `${result.pct}%` : "未做"}
                    </p>
                  </div>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
                    {q.titleZh}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">
                    {q.blurb}
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
