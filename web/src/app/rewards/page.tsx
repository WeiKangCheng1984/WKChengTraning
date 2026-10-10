"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onStorageChange } from "@/lib/persist";
import {
  BADGES,
  DAILY_GOAL_MINUTES,
  getRecentDays,
  getRewardsSnapshot,
  type RewardsSnapshot,
} from "@/lib/rewards";

export default function RewardsPage() {
  const [snap, setSnap] = useState<RewardsSnapshot | null>(null);
  const [days, setDays] = useState(getRecentDays(7));

  useEffect(() => {
    const sync = () => {
      setSnap(getRewardsSnapshot());
      setDays(getRecentDays(7));
    };
    sync();
    return onStorageChange(sync);
  }, []);

  if (!snap) {
    return <p className="text-[var(--muted)]">載入獎勵…</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          Rewards
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          每日一小時
        </h1>
        <p className="mt-2 max-w-2xl text-base text-[var(--muted)]">
          目標每天練習 {DAILY_GOAL_MINUTES}{" "}
          分鐘。在站內操作時會自動計時（閒置或切走背景會暫停）。連續達標會累積火焰與徽章。
        </p>
      </div>

      <section className="rounded-sm border border-[var(--ink)] bg-[var(--ink)] px-6 py-7 text-[var(--paper)]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent-soft-text)]">
              今日進度
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-4xl">
              {snap.todayMinutes}
              <span className="text-xl text-white/60">
                {" "}
                / {snap.goal} 分
              </span>
            </p>
            <p className="mt-2 text-sm text-white/70">{snap.message}</p>
          </div>
          <div className="text-right text-sm text-white/70">
            <p>
              連續達標{" "}
              <strong className="text-[var(--accent-soft-text)]">
                {snap.streak}
              </strong>{" "}
              天
            </p>
            <p className="mt-1">最佳 {snap.bestStreak} 天</p>
            <p className="mt-1">累計 {snap.totalHours} 小時</p>
          </div>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full bg-[var(--accent)] transition-all"
            style={{ width: `${snap.pct}%` }}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          近 7 日
        </h2>
        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => {
            const label = d.date.slice(5).replace("-", "/");
            const h = Math.min(100, (d.minutes / DAILY_GOAL_MINUTES) * 100);
            return (
              <div key={d.date} className="text-center">
                <div className="mx-auto flex h-24 w-full items-end rounded-sm border border-[var(--line)] bg-[var(--surface)] px-1 pb-1">
                  <div
                    className={`w-full rounded-sm ${
                      d.goalHit ? "bg-[var(--accent)]" : "bg-[var(--ink)]/25"
                    }`}
                    style={{ height: `${Math.max(h, d.minutes > 0 ? 8 : 0)}%` }}
                    title={`${d.minutes} 分`}
                  />
                </div>
                <p className="mt-1 text-[10px] text-[var(--muted)]">{label}</p>
                <p className="text-[10px] text-[var(--ink)]">{d.minutes}m</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          徽章
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {BADGES.map((b) => {
            const on = snap.badges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`rounded-sm border px-4 py-4 ${
                  on
                    ? "border-[var(--accent)]/50 bg-[var(--accent-soft)]/40"
                    : "border-[var(--line)] bg-[var(--surface)] opacity-55"
                }`}
              >
                <p className="text-xs text-[var(--accent)]">
                  {on ? "已解鎖" : "未解鎖"}
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
                  {b.title}
                </h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{b.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-2 text-sm text-[var(--muted)]">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          怎麼累積
        </h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>在網站上實際操作練習時自動計時（每 30 秒累加）。</li>
          <li>超過約 90 秒無操作，或切換到其他分頁，會暫停。 </li>
          <li>
            完成{" "}
            <Link href="/english/today" className="text-[var(--ink)] underline">
              今日英語微課
            </Link>{" "}
            完成單元可額外獲得獎勵分鐘。
          </li>
          <li>連續「滿 60 分鐘」的日子才算達標連續天數。</li>
        </ul>
      </section>
    </div>
  );
}
