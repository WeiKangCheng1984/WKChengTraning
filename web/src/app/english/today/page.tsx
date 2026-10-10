"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DailyUnitPlayer,
  DailyUnitReview,
} from "@/components/DailyUnitPlayer";
import type { DailyUnit, StepResult } from "@/lib/dailyUnit/types";
import {
  getTodayDoneIds,
  markUnitDone,
  nextUnitForToday,
  todayUnitSummary,
} from "@/lib/dailyUnitProgress";
import { onStorageChange } from "@/lib/persist";
import { creditDailyUnit } from "@/lib/rewards";

type Phase =
  | { kind: "hub" }
  | { kind: "play"; unit: DailyUnit }
  | {
      kind: "review";
      unit: DailyUnit;
      correct: number;
      total: number;
      results: StepResult[];
    };

export default function EnglishTodayPage() {
  const [phase, setPhase] = useState<Phase>({ kind: "hub" });
  const [summary, setSummary] = useState<ReturnType<
    typeof todayUnitSummary
  > | null>(null);

  useEffect(() => {
    const sync = () => setSummary(todayUnitSummary());
    sync();
    return onStorageChange(sync);
  }, []);

  function startNext() {
    const unit = nextUnitForToday();
    setPhase({ kind: "play", unit });
  }

  if (!summary) {
    return <p className="text-[var(--muted)]">準備今日微課…</p>;
  }

  if (phase.kind === "play") {
    return (
      <DailyUnitPlayer
        unit={phase.unit}
        onExit={() => setPhase({ kind: "hub" })}
        onComplete={({ correct, total, results }) => {
          markUnitDone(phase.unit.id);
          creditDailyUnit(phase.unit.unitIndex);
          setSummary(todayUnitSummary());
          setPhase({
            kind: "review",
            unit: phase.unit,
            correct,
            total,
            results,
          });
        }}
      />
    );
  }

  if (phase.kind === "review") {
    return (
      <DailyUnitReview
        unit={phase.unit}
        correct={phase.correct}
        total={phase.total}
        results={phase.results}
        onAgain={startNext}
        onHome={() => setPhase({ kind: "hub" })}
      />
    );
  }

  const done = getTodayDoneIds();
  const mainDone = summary.mainDone;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/english"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← English
        </Link>
        <p className="mt-3 text-xs font-medium tracking-[0.18em] text-[var(--sky)]">
          Daily · 30-day path
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          今日英語微課
        </h1>
        <p className="mt-2 max-w-2xl text-base text-[var(--muted)]">
          第 {summary.programDay}/{summary.totalProgramDays}{" "}
          天。每單元約 5–10 分鐘；完成後會有逐題解析。想多練就繼續加練吧！
        </p>
      </div>

      <section
        className="border border-[var(--line)] p-5 sm:p-7"
        style={{
          borderRadius: "var(--radius)",
          background:
            "linear-gradient(145deg, color-mix(in srgb, var(--accent-soft) 55%, white), color-mix(in srgb, var(--sky-soft) 60%, white))",
        }}
      >
        <p className="text-xs font-medium tracking-[0.16em] text-[var(--accent)]">
          Today · Day {summary.programDay}
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          {summary.main.titleZh}
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {summary.main.titleEn} · {summary.main.blurb}
        </p>
        <p className="mt-3 text-sm text-[var(--ink)]">
          今日已完成 <strong>{done.length}</strong> 單元
          {mainDone ? "（含今日主單元）" : "（主單元尚未完成）"}
        </p>
        <button
          type="button"
          onClick={startNext}
          className="mt-5 min-h-11 rounded-lg bg-[var(--accent)] px-5 text-sm text-white hover:brightness-105"
        >
          {mainDone ? "再練一單元" : "開始今日單元"}
        </button>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-medium text-[var(--ink)]">本單元題型</h3>
        <ul className="grid gap-2 text-sm text-[var(--muted)] sm:grid-cols-2">
          <li>看中文選英文詞</li>
          <li>GRE／Quiz 挖空三選一</li>
          <li>句型先想再揭曉</li>
          <li>文法對比選正確句</li>
          <li>聽英語選中文</li>
          <li>跟讀自評＋完成後逐題解析</li>
        </ul>
      </section>

      <p className="text-sm text-[var(--muted)]">
        想系統複習章節仍可去{" "}
        <Link href="/english/review" className="text-[var(--sky)] underline">
          英語複習
        </Link>
        、
        <Link href="/quiz" className="text-[var(--sky)] underline">
          題庫
        </Link>
        、
        <Link href="/oral" className="text-[var(--sky)] underline">
          口語區
        </Link>
        。
      </p>
    </div>
  );
}
