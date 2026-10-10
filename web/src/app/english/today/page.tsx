"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CuteIcon } from "@/components/CuteIcon";
import {
  DailyUnitPlayer,
  DailyUnitReview,
} from "@/components/DailyUnitPlayer";
import type { DailyUnit, StepResult } from "@/lib/dailyUnit/types";
import {
  completeUnitSession,
  getTodayDoneIds,
  listUnitHistory,
  nextUnitForToday,
  todayUnitSummary,
} from "@/lib/dailyUnitProgress";
import { onStorageChange } from "@/lib/persist";
import { creditDailyUnit } from "@/lib/rewards";

type Phase =
  | { kind: "hub" }
  | { kind: "loading" }
  | { kind: "play"; unit: DailyUnit }
  | {
      kind: "review";
      unit: DailyUnit;
      correct: number;
      total: number;
      results: StepResult[];
    }
  | { kind: "error"; message: string };

export default function EnglishTodayPage() {
  const [phase, setPhase] = useState<Phase>({ kind: "hub" });
  const [summary, setSummary] = useState<ReturnType<
    typeof todayUnitSummary
  > | null>(null);
  const [recentHistory, setRecentHistory] = useState<
    ReturnType<typeof listUnitHistory>
  >([]);

  useEffect(() => {
    const sync = () => {
      setSummary(todayUnitSummary());
      setRecentHistory(listUnitHistory().slice(0, 5));
    };
    sync();
    return onStorageChange(sync);
  }, []);

  async function startNext() {
    setPhase({ kind: "loading" });
    try {
      const unit = await nextUnitForToday();
      setPhase({ kind: "play", unit });
    } catch (e) {
      setPhase({
        kind: "error",
        message: e instanceof Error ? e.message : "載入失敗",
      });
    }
  }

  if (!summary) {
    return <p className="text-[var(--muted)]">準備今日微課…</p>;
  }

  if (phase.kind === "loading") {
    return (
      <p className="flex items-center gap-2 text-[var(--muted)]">
        <CuteIcon name="spark" />
        正在組今日單元…
      </p>
    );
  }

  if (phase.kind === "error") {
    return (
      <div className="space-y-3">
        <p className="text-sm text-[var(--bad)]">{phase.message}</p>
        <button
          type="button"
          onClick={() => setPhase({ kind: "hub" })}
          className="min-h-11 rounded-lg border border-[var(--line)] px-4 text-sm"
        >
          返回
        </button>
      </div>
    );
  }

  if (phase.kind === "play") {
    return (
      <DailyUnitPlayer
        unit={phase.unit}
        onExit={() => setPhase({ kind: "hub" })}
        onComplete={({ correct, total, results }) => {
          completeUnitSession(phase.unit, results);
          creditDailyUnit(phase.unit.unitIndex);
          setSummary(todayUnitSummary());
          setRecentHistory(listUnitHistory().slice(0, 5));
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
        onAgain={() => void startNext()}
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
        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium tracking-[0.18em] text-[var(--sky)]">
          <CuteIcon name="rocket" className="text-sm" />
          Daily · 30-day path
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          今日英語微課
        </h1>
        <p className="mt-2 max-w-2xl text-base text-[var(--muted)]">
          第 {summary.programDay}/{summary.totalProgramDays}{" "}
          天。完成主單元即可打卡；想多練就加練。題目在伺服器組好再送來，頁面更輕。
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
        <p className="flex items-center gap-1.5 text-xs font-medium tracking-[0.16em] text-[var(--accent)]">
          <CuteIcon name={mainDone ? "check" : "sun"} className="text-sm" />
          Today · Day {summary.programDay}
          {mainDone ? " · 已打卡" : ""}
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          {summary.main.titleZh}
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {summary.main.titleEn} · {summary.main.blurb}
        </p>
        <p className="mt-3 text-sm text-[var(--ink)]">
          今日已完成 <strong>{done.length}</strong> 單元
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void startNext()}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--accent)] px-5 text-sm text-white hover:brightness-105"
          >
            <CuteIcon name="spark" />
            {mainDone ? "再練一單元" : "開始今日單元"}
          </button>
          <Link
            href="/english/today/history"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-5 text-sm text-[var(--ink)]"
          >
            <CuteIcon name="star" />
            練習紀錄（{summary.historyCount}）
          </Link>
        </div>
      </section>

      {recentHistory.length > 0 ? (
        <section className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="flex items-center gap-1.5 text-sm font-medium text-[var(--ink)]">
              <CuteIcon name="heart" className="text-sm" />
              最近完成
            </h3>
            <Link
              href="/english/today/history"
              className="text-xs text-[var(--sky)] underline"
            >
              看全部
            </Link>
          </div>
          <ul className="space-y-2">
            {recentHistory.map((h) => (
              <li key={h.recordId}>
                <Link
                  href={`/english/today/history?id=${encodeURIComponent(h.recordId)}`}
                  className="row-tap"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--ink)]">
                      {h.titleZh}
                    </p>
                    <p className="text-[10px] text-[var(--muted)]">
                      Day {h.programDay} · {h.date} · {h.correct}/{h.total}
                    </p>
                  </div>
                  <span className="text-xs text-[var(--sky)]">解析</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
