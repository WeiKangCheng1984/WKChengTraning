"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PatternExpansionPanel } from "@/components/PatternExpansionPanel";
import type { PatternTemplates } from "@/lib/patternLoop";
import { pauseMs, type PatternGap } from "@/lib/patternLoop";
import {
  buildExpansionSteps,
  buildQuizSession,
  readReflexSession,
  type ExpansionStep,
  type ReflexQuizItem,
} from "@/lib/patternReflex";
import { gradeCard } from "@/lib/srs";
import { speakEnglish, stopSpeaking } from "@/lib/speech";

type Phase = "question" | "feedback" | "expansion" | "done";

export function PatternReflexPlayer({ data }: { data: PatternTemplates }) {
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [quiz, setQuiz] = useState<ReflexQuizItem[]>([]);
  const [expansion, setExpansion] = useState<ExpansionStep[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("question");
  const gap: PatternGap = "normal";
  const timerRef = useRef<number | null>(null);
  const gradedRef = useRef(false);
  const scoreRef = useRef(0);

  const current = quiz[index];
  const total = quiz.length;

  function clearTimer() {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function playQuestion(q: ReflexQuizItem) {
    stopSpeaking();
    timerRef.current = window.setTimeout(() => {
      speakEnglish(q.questionEn, { speed: "normal" });
    }, 50);
  }

  function scheduleReview(finalScore: number) {
    if (gradedRef.current) return;
    const session = readReflexSession();
    if (!session) return;
    gradedRef.current = true;
    const ratio = total > 0 ? finalScore / total : 0;
    const g = ratio >= 0.67 ? "good" : "again";
    for (const id of session.packIds) gradeCard("pattern", id, g);
  }

  function finishRound(finalScore: number) {
    scheduleReview(finalScore);
    setPhase("done");
  }

  function afterLastQuestion(finalScore: number) {
    if (expansion.length) setPhase("expansion");
    else finishRound(finalScore);
  }

  useEffect(() => {
    const session = readReflexSession();
    if (!session) {
      router.replace("/english/patterns/reflex");
      return;
    }
    const built = buildQuizSession(data, session.packIds);
    if (!built.length) {
      router.replace("/english/patterns/reflex");
      return;
    }
    setLabel(session.label);
    setQuiz(built);
    setExpansion(buildExpansionSteps(data, session.packIds));
    playQuestion(built[0]!);
    return () => {
      clearTimer();
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, router]);

  useEffect(() => {
    if (!current || phase !== "question") return;
    playQuestion(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function choose(choiceIndex: number) {
    if (!current || phase !== "question") return;
    setPicked(choiceIndex);
    const correct = current.choices[choiceIndex]?.correct ?? false;
    const nextScore = scoreRef.current + (correct ? 1 : 0);
    if (correct) {
      scoreRef.current = nextScore;
      setScore(nextScore);
    }
    setPhase("feedback");
    stopSpeaking();
    const ans = current.choices.find((c) => c.correct);
    if (ans) {
      speakEnglish(ans.en, {
        speed: "normal",
        onEnd: () => {
          const wait = pauseMs(ans.en, gap);
          timerRef.current = window.setTimeout(() => {
            if (index + 1 >= total) afterLastQuestion(nextScore);
            else {
              setIndex((i) => i + 1);
              setPicked(null);
              setPhase("question");
            }
          }, wait);
        },
      });
    }
  }

  if (!current && phase !== "done" && phase !== "expansion") {
    return <p className="text-sm text-[var(--muted)]">載入問答…</p>;
  }

  if (phase === "expansion") {
    return (
      <div className="space-y-4">
        {label ? <p className="text-sm text-[var(--muted)]">{label}</p> : null}
        <p className="text-sm text-[var(--ink)]">
          問答 {score} / {total} 題正確 · 加練加長句
        </p>
        <PatternExpansionPanel
          steps={expansion}
          onFinish={() => finishRound(scoreRef.current)}
        />
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          本輪完成
        </h2>
        <p className="text-lg text-[var(--ink)]">
          {score} / {total} 題正確
        </p>
        <p className="text-sm text-[var(--muted)]">
          已寫入複習排程（問答包）。可到{" "}
          <Link href="/english/review" className="text-[var(--accent)]">
            英語到期複習
          </Link>{" "}
          查看。
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/english/patterns/reflex"
            className="rounded-sm bg-[var(--ink)] px-5 py-2 text-sm text-[var(--paper)]"
          >
            再選問答包
          </Link>
          <Link
            href="/english/patterns/substitute"
            className="rounded-sm border border-[var(--line)] px-5 py-2 text-sm"
          >
            抽換快打
          </Link>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="space-y-4">
      {label ? <p className="text-sm text-[var(--muted)]">{label}</p> : null}
      <p className="text-xs text-[var(--accent)]">
        第 {index + 1} / {total} 題 · {current.packTitle} · {current.pattern}
      </p>

      <div className="rounded-sm border border-[var(--line)] bg-[var(--surface)] px-4 py-5">
        <p className="text-xs text-[var(--muted)]">聽問句 · 選句型答</p>
        <p className="mt-2 text-lg text-[var(--ink)]">{current.questionEn}</p>
        {current.questionZh ? (
          <p className="mt-1 text-sm text-[var(--muted)]">{current.questionZh}</p>
        ) : null}
        <button
          type="button"
          onClick={() => playQuestion(current)}
          className="mt-3 text-sm text-[var(--accent)]"
        >
          重播問句
        </button>
      </div>

      <ul className="space-y-2">
        {current.choices.map((c, i) => {
          const showResult = phase === "feedback" && picked === i;
          const showCorrect = phase === "feedback" && c.correct;
          return (
            <li key={`${i}-${c.en}`}>
              <button
                type="button"
                disabled={phase !== "question"}
                onClick={() => choose(i)}
                className={`w-full rounded-sm border px-3 py-3 text-left ${
                  showCorrect
                    ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                    : showResult && !c.correct
                      ? "border-[var(--bad)] bg-[var(--paper)]"
                      : "border-[var(--line)] bg-[var(--paper)]"
                }`}
              >
                <p className="text-base text-[var(--ink)]">{c.en}</p>
                <p className="text-sm text-[var(--muted)]">{c.zh}</p>
              </button>
            </li>
          );
        })}
      </ul>

      <Link
        href="/english/patterns/reflex"
        className="text-sm text-[var(--muted)]"
      >
        ← 設定
      </Link>
    </div>
  );
}
