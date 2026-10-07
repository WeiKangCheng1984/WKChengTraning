"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { getQuizResult, saveQuizResult } from "@/lib/quizProgress";
import type { QuizItem, QuizQuestion } from "@/lib/types";

type Mode = "step" | "exam";

type Props = {
  quiz: QuizItem;
  nextSlug?: string | null;
};

function ExplainBlock({ q }: { q: QuizQuestion }) {
  const lines =
    q.choiceExplains && q.choiceExplains.length > 0
      ? q.choiceExplains
      : q.explainZh.split("\n").filter(Boolean);
  return (
    <div className="mt-3 space-y-1.5 rounded-sm bg-[var(--paper)] p-3 text-sm leading-relaxed text-[var(--ink)]">
      <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
        解析（含三選項）
      </p>
      {lines.map((line) => (
        <p key={line} className="text-[var(--muted)]">
          {line}
        </p>
      ))}
    </div>
  );
}

function choiceClass(
  c: string,
  answer: string,
  picked: string | undefined,
  revealed: boolean,
) {
  const selected = picked === c;
  let cls = "rounded-sm border px-3 py-2 text-left text-sm transition ";
  if (!revealed) {
    cls += selected
      ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
      : "border-[var(--line)] text-[var(--ink)] hover:border-[var(--accent)]";
    return cls;
  }
  if (c === answer) {
    cls += "border-[var(--ink)] bg-[var(--accent-soft)] text-[var(--ink)]";
  } else if (selected) {
    cls +=
      "border-[var(--line)] bg-[var(--paper)] text-[var(--muted)] line-through";
  } else {
    cls += "border-[var(--line)] text-[var(--muted)]";
  }
  return cls;
}

function calcScore(
  questions: QuizQuestion[],
  answers: Record<string, string>,
) {
  return questions.reduce(
    (n, q) => n + (answers[q.id] === q.answer ? 1 : 0),
    0,
  );
}

export function QuizClient({ quiz, nextSlug = null }: Props) {
  const [mode, setMode] = useState<Mode>("step");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [showStepSummary, setShowStepSummary] = useState(false);
  const [savedPct, setSavedPct] = useState<number | null>(() => {
    const r = getQuizResult(quiz.slug);
    return r ? r.pct : null;
  });

  const total = quiz.questions.length;
  const answered = Object.keys(answers).length;

  useEffect(() => {
    setAnswers({});
    setRevealed({});
    setSubmitted(false);
    setStepIndex(0);
    setShowStepSummary(false);
  }, [mode, quiz.slug]);

  function finishAndSave(nextAnswers: Record<string, string>) {
    const sc = calcScore(quiz.questions, nextAnswers);
    const pct = Math.round((sc / total) * 100);
    saveQuizResult({
      slug: quiz.slug,
      score: sc,
      total,
      pct,
      finishedAt: Date.now(),
    });
    setSavedPct(pct);
  }

  function selectExam(qid: string, choice: string) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qid]: choice }));
  }

  function selectStep(choice: string) {
    const stepQ = quiz.questions[stepIndex];
    if (!stepQ || revealed[stepQ.id]) return;
    const nextAnswers = { ...answers, [stepQ.id]: choice };
    const nextRevealed = { ...revealed, [stepQ.id]: true };
    setAnswers(nextAnswers);
    setRevealed(nextRevealed);
    if (Object.keys(nextRevealed).length >= total) {
      finishAndSave(nextAnswers);
    }
  }

  function submitExam() {
    if (answered < total) {
      const ok = window.confirm(
        `尚有 ${total - answered} 題未作答，仍要交卷嗎？`,
      );
      if (!ok) return;
    }
    setSubmitted(true);
    finishAndSave(answers);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setAnswers({});
    setRevealed({});
    setSubmitted(false);
    setStepIndex(0);
    setShowStepSummary(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const stepQ = quiz.questions[stepIndex] ?? null;
  const stepDone = stepQ ? !!revealed[stepQ.id] : false;
  const allStepDone = quiz.questions.every((q) => revealed[q.id]);
  const showExamResult = mode === "exam" && submitted;
  const showStepResult = mode === "step" && showStepSummary && allStepDone;
  const finalScore = calcScore(quiz.questions, answers);

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

      <div className="flex flex-wrap gap-2 rounded-sm border border-[var(--line)] bg-[var(--surface)] p-2">
        <button
          type="button"
          onClick={() => setMode("step")}
          className={`min-h-10 flex-1 rounded-sm px-3 text-sm sm:flex-none ${
            mode === "step"
              ? "bg-[var(--ink)] text-[var(--paper)]"
              : "text-[var(--muted)] hover:text-[var(--ink)]"
          }`}
        >
          單獨解析模式
        </button>
        <button
          type="button"
          onClick={() => setMode("exam")}
          className={`min-h-10 flex-1 rounded-sm px-3 text-sm sm:flex-none ${
            mode === "exam"
              ? "bg-[var(--ink)] text-[var(--paper)]"
              : "text-[var(--muted)] hover:text-[var(--ink)]"
          }`}
        >
          測驗解析模式
        </button>
      </div>
      <p className="text-xs text-[var(--muted)]">
        {mode === "step"
          ? "每題選定後立刻判定對錯並顯示三選項解析，再進入下一題。"
          : "先全部作答，交卷後一次顯示分數與每題三選項解析。"}
      </p>

      {(showExamResult || showStepResult) && (
        <div className="rounded-sm border border-[var(--line)] bg-[var(--paper)] p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
            Result
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
            {finalScore} / {total}
            <span className="ml-2 text-xl text-[var(--muted)]">
              （{Math.round((finalScore / total) * 100)}%）
            </span>
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
      )}

      {mode === "step" && stepQ && !showStepResult ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[var(--muted)]">
            <span>
              第 {stepIndex + 1} / {total} 題
              {stepDone
                ? answers[stepQ.id] === stepQ.answer
                  ? " · 正確"
                  : " · 錯誤"
                : ""}
            </span>
            <span>
              已判定 {Object.keys(revealed).length} / {total}
            </span>
          </div>
          <div className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-4">
            <div className="flex items-start gap-2">
              <SpeakButton
                text={stepQ.stem.replace(
                  /______/g,
                  answers[stepQ.id] || stepQ.answer,
                )}
                label="題幹"
                size="sm"
              />
              <p className="text-sm leading-relaxed text-[var(--ink)]">
                {stepQ.stem}
              </p>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {stepQ.choices.map((c) => (
                <button
                  key={c}
                  type="button"
                  disabled={stepDone}
                  onClick={() => selectStep(c)}
                  className={choiceClass(
                    c,
                    stepQ.answer,
                    answers[stepQ.id],
                    stepDone,
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            {stepDone ? <ExplainBlock q={stepQ} /> : null}
          </div>
          {stepDone ? (
            <div className="flex justify-end gap-2">
              {stepIndex < total - 1 ? (
                <button
                  type="button"
                  onClick={() => setStepIndex((i) => i + 1)}
                  className="min-h-10 rounded-sm bg-[var(--ink)] px-4 text-sm text-[var(--paper)]"
                >
                  下一題 →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowStepSummary(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="min-h-10 rounded-sm bg-[var(--ink)] px-4 text-sm text-[var(--paper)]"
                >
                  看總結
                </button>
              )}
            </div>
          ) : null}
        </div>
      ) : null}

      {mode === "step" && showStepResult ? (
        <ol className="space-y-4">
          {quiz.questions.map((q, idx) => (
            <li
              key={q.id}
              className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-4"
            >
              <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
                Q{idx + 1} ·{" "}
                {answers[q.id] === q.answer ? "正確" : "錯誤"}
              </p>
              <p className="mt-1 text-sm text-[var(--ink)]">{q.stem}</p>
              <ExplainBlock q={q} />
            </li>
          ))}
        </ol>
      ) : null}

      {mode === "exam" ? (
        <>
          {!submitted ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm">
              <span className="text-[var(--muted)]">
                已作答 {answered} / {total}
              </span>
              <button
                type="button"
                onClick={submitExam}
                className="min-h-10 rounded-sm bg-[var(--ink)] px-4 text-[var(--paper)] hover:bg-[var(--ink-soft)]"
              >
                交卷看解析
              </button>
            </div>
          ) : null}

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
                    {q.choices.map((c) => (
                      <button
                        key={c}
                        type="button"
                        disabled={submitted}
                        onClick={() => selectExam(q.id, c)}
                        className={choiceClass(c, q.answer, picked, submitted)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  {submitted ? <ExplainBlock q={q} /> : null}
                </li>
              );
            })}
          </ol>

          {!submitted ? (
            <div className="sticky bottom-16 z-10 flex justify-end sm:bottom-4">
              <button
                type="button"
                onClick={submitExam}
                className="min-h-11 rounded-sm bg-[var(--ink)] px-5 text-sm text-[var(--paper)] shadow-md hover:bg-[var(--ink-soft)]"
              >
                交卷看解析（{answered}/{total}）
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
