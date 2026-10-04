"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onStorageChange } from "@/lib/persist";
import {
  DAILY_GOAL_MINUTES,
  getRewardsSnapshot,
  type RewardsSnapshot,
} from "@/lib/rewards";

export function DailyGoalCard() {
  const [snap, setSnap] = useState<RewardsSnapshot | null>(null);

  useEffect(() => {
    const sync = () => setSnap(getRewardsSnapshot());
    sync();
    return onStorageChange(sync);
  }, []);

  if (!snap) return null;

  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - snap.pct / 100);

  return (
    <Link
      href="/rewards"
      className="flex items-center gap-5 rounded-sm border border-[var(--line)] bg-[var(--surface)] px-5 py-5 transition hover:border-[var(--accent)]/50"
    >
      <div className="relative h-24 w-24 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="var(--line)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
            {snap.todayMinutes}
          </span>
          <span className="text-[10px] text-[var(--muted)]">
            / {DAILY_GOAL_MINUTES} 分
          </span>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
          每日一小時
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          {snap.goalHit
            ? "今日達標"
            : `還差 ${snap.remaining} 分鐘`}
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">{snap.message}</p>
        <p className="mt-2 text-xs text-[var(--muted)]">
          連續 {snap.streak} 天達標
          {snap.bestStreak > snap.streak
            ? ` · 最佳 ${snap.bestStreak} 天`
            : ""}
          {" · "}
          累計 {snap.totalHours} 小時
        </p>
      </div>
    </Link>
  );
}
