"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DailyUnitCompleteCard,
  DailyUnitPlayer,
} from "@/components/DailyUnitPlayer";
import type { DailyUnit } from "@/lib/dailyUnit/types";
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
      kind: "done";
      unit: DailyUnit;
      correct: number;
      total: number;
    };

export default function EnglishTodayPage() {
  const [phase, setPhase] = useState<Phase>({ kind: "hub" });
  const [summary, setSummary] = useState<ReturnType<typeof todayUnitSummary> | null>(
    null,
  );

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
        onComplete={({ correct, total }) => {
          markUnitDone(phase.unit.id);
          creditDailyUnit(phase.unit.unitIndex);
          setSummary(todayUnitSummary());
          setPhase({
            kind: "done",
            unit: phase.unit,
            correct,
            total,
          });
        }}
      />
    );
  }

  if (phase.kind === "done") {
    return (
      <DailyUnitCompleteCard
        unit={phase.unit}
        correct={phase.correct}
        total={phase.total}
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
        <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          Daily · 30-day path
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          今日英語微課
        </h1>
        <p className="mt-2 max-w-2xl text-base text-[var(--muted)]">
          第 {summary.programDay}/{summary.totalProgramDays}{" "}
          天。每單元約 5–10 分鐘、連續混合練習（選詞、填空、聽選、跟讀）。至少完成 1
          單元；想多練可繼續加練。
        </p>
      </div>

      <section className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-7">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
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
          className="mt-5 min-h-11 rounded-sm bg-[var(--ink)] px-5 text-sm text-[var(--paper)] hover:bg-[var(--ink-soft)]"
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
          <li>跟讀自評</li>
        </ul>
      </section>

      <p className="text-sm text-[var(--muted)]">
        想系統複習章節仍可去{" "}
        <Link href="/english/review" className="text-[var(--ink)] underline">
          英語複習
        </Link>
        、
        <Link href="/quiz" className="text-[var(--ink)] underline">
          題庫
        </Link>
        、
        <Link href="/oral" className="text-[var(--ink)] underline">
          口語區
        </Link>
        。
      </p>
    </div>
  );
}
