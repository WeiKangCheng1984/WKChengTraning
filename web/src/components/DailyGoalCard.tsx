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

  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - snap.pct / 100);

  return (
    <Link
      href="/rewards"
      className="flex items-center gap-4 rounded-sm border border-[var(--line)] bg-[var(--surface)] px-4 py-3.5 transition hover:border-[var(--accent)]/50"
    >
      <div className="relative h-[4.5rem] w-[4.5rem] shrink-0">
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
          <span className="font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
            {snap.todayMinutes}
          </span>
          <span className="text-[9px] text-[var(--muted)]">
            / {DAILY_GOAL_MINUTES}
          </span>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]">
          每日一小時
        </p>
        <h2 className="mt-0.5 font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
          {snap.goalHit ? "今日達標" : `還差 ${snap.remaining} 分`}
        </h2>
        <p className="mt-0.5 line-clamp-1 text-sm text-[var(--muted)]">
          {snap.message}
        </p>
        <p className="mt-1 text-[11px] text-[var(--muted)]">
          連 {snap.streak} 天
          {snap.bestStreak > snap.streak ? ` · 最佳 ${snap.bestStreak}` : ""}
          {" · "}
          累計 {snap.totalHours}h
        </p>
      </div>
    </Link>
  );
}
