"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { getQuizResult, saveQuizResult } from "@/lib/quizProgress";
import type { QuizItem } from "@/lib/types";

type Props = {
  quiz: QuizItem;
  nextSlug?: string | null;
};

export function QuizClient({ quiz, nextSlug = null }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [savedPct, setSavedPct] = useState<number | null>(() => {
    const r = getQuizResult(quiz.slug);
    return r ? r.pct : null;
  });

  const answered = Object.keys(answers).length;
  const total = quiz.questions.length;

  const score = useMemo(() => {
    if (!submitted) return 0;
    return quiz.questions.reduce(
      (n, q) => n + (answers[q.id] === q.answer ? 1 : 0),
      0,
    );
  }, [submitted, answers, quiz.questions]);

  function select(qid: string, choice: string) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qid]: choice }));
  }

  function submit() {
    if (answered < total) {
      const ok = window.confirm(
        `尚有 ${total - answered} 題未作答，仍要交卷嗎？`,
      );
      if (!ok) return;
    }
    setSubmitted(true);
    const sc = quiz.questions.reduce(
      (n, q) => n + (answers[q.id] === q.answer ? 1 : 0),
      0,
    );
    const pct = Math.round((sc / total) * 100);
    saveQuizResult({
      slug: quiz.slug,
      score: sc,
      total,
      pct,
      finishedAt: Date.now(),
    });
    setSavedPct(pct);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setAnswers({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/quiz"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← 測驗庫
        </Link>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
          Quiz {quiz.num.toString().padStart(2, "0")} · Series {quiz.series}
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          {quiz.titleZh}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {quiz.blurb} · {total} 題 · 三選一填空
          {savedPct !== null ? ` · 最佳 ${savedPct}%` : ""}
        </p>
      </div>

      {submitted ? (
        <div className="rounded-sm border border-[var(--line)] bg-[var(--paper)] p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
            Result
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
            {score} / {total}
            <span className="ml-2 text-xl text-[var(--muted)]">
              （{Math.round((score / total) * 100)}%）
            </span>
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            下方每題附簡短解析。可重測或進入下一篇。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={reset}
              className="min-h-10 rounded-sm border border-[var(--line)] px-4 text-sm text-[var(--ink)] hover:border-[var(--accent)]"
            >
              再測一次
            </button>
            {nextSlug ? (
              <Link
                href={`/quiz/${nextSlug}`}
                className="inline-flex min-h-10 items-center rounded-sm border border-[var(--line)] px-4 text-sm text-[var(--ink)] hover:border-[var(--accent)]"
              >
                下一篇 →
              </Link>
            ) : null}
            <Link
              href="/quiz"
              className="inline-flex min-h-10 items-center rounded-sm bg-[var(--ink)] px-4 text-sm text-[var(--paper)]"
            >
              回測驗列表
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm">
          <span className="text-[var(--muted)]">
            已作答 {answered} / {total}
          </span>
          <button
            type="button"
            onClick={submit}
            className="min-h-10 rounded-sm bg-[var(--ink)] px-4 text-[var(--paper)] hover:bg-[var(--ink-soft)]"
          >
            交卷看解析
          </button>
        </div>
      )}

      <ol className="space-y-4">
        {quiz.questions.map((q, idx) => {
          const picked = answers[q.id];
          const correct = submitted && picked === q.answer;
          const wrong = submitted && picked && picked !== q.answer;
          return (
            <li
              key={q.id}
              className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-4"
            >
              <div className="flex items-start gap-2">
                <SpeakButton
                  text={q.stem.replace(/______/g, picked || q.answer)}
                  label="題幹"
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
                    Q{idx + 1}
                    {submitted
                      ? correct
                        ? " · 正確"
                        : wrong
                          ? " · 錯誤"
                          : " · 未答"
                      : ""}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--ink)]">
                    {q.stem}
                  </p>
                </div>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {q.choices.map((c) => {
                  const selected = picked === c;
                  let cls =
                    "rounded-sm border px-3 py-2 text-left text-sm transition ";
                  if (!submitted) {
                    cls += selected
                      ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                      : "border-[var(--line)] text-[var(--ink)] hover:border-[var(--accent)]";
                  } else if (c === q.answer) {
                    cls +=
                      "border-emerald-700 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100";
                  } else if (selected) {
                    cls +=
                      "border-rose-700 bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-100";
                  } else {
                    cls += "border-[var(--line)] text-[var(--muted)]";
                  }
                  return (
                    <button
                      key={c}
                      type="button"
                      disabled={submitted}
                      onClick={() => select(q.id, c)}
                      className={cls}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>

              {submitted ? (
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                  {q.explainZh}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>

      {!submitted ? (
        <div className="sticky bottom-16 z-10 flex justify-end sm:bottom-4">
          <button
            type="button"
            onClick={submit}
            className="min-h-11 rounded-sm bg-[var(--ink)] px-5 text-sm text-[var(--paper)] shadow-md hover:bg-[var(--ink-soft)]"
          >
            交卷看解析（{answered}/{total}）
          </button>
        </div>
      ) : null}
    </div>
  );
}
