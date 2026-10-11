"use client";

import Link from "next/link";
import { useEffect, useState, type ComponentProps } from "react";
import { CuteIcon } from "@/components/CuteIcon";
import {
  BADGES,
  badgeMeta,
  badgeQuote,
  getRecentDays,
  getRewardsSnapshot,
  listCheckInsByMonth,
  type CheckInDay,
  type RewardsSnapshot,
} from "@/lib/rewards";
import { onStorageChange } from "@/lib/persist";

function formatMonth(ym: string) {
  const [y, m] = ym.split("-");
  return `${y} 年 ${Number(m)} 月`;
}

export default function RewardsPage() {
  const [snap, setSnap] = useState<RewardsSnapshot | null>(null);
  const [recent, setRecent] = useState<CheckInDay[]>([]);
  const [months, setMonths] = useState<ReturnType<typeof listCheckInsByMonth>>(
    [],
  );

  useEffect(() => {
    const sync = () => {
      setSnap(getRewardsSnapshot());
      setRecent(getRecentDays(14));
      setMonths(listCheckInsByMonth());
    };
    sync();
    return onStorageChange(sync);
  }, []);

  if (!snap) {
    return <p className="text-[var(--muted)]">載入打卡…</p>;
  }

  const quote = snap.mainDoneToday ? snap.streakQuote : snap.dailyQuote;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← 今日
        </Link>
        <h1 className="mt-3 flex items-center gap-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          <CuteIcon name="fire" className="text-3xl" />
          打卡與徽章
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">
          每天完成「今日主單元」就算打卡。加練累計單元數，但不影響連續天數。完整打卡歷程永久保留。
        </p>
      </div>

      <section
        className="rounded-[var(--radius)] border border-[var(--line)] p-5 sm:p-6"
        style={{
          background:
            "linear-gradient(145deg, color-mix(in srgb, var(--accent-soft) 50%, white), color-mix(in srgb, var(--sky-soft) 55%, white))",
        }}
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
          Milestone · Today
        </p>
        <p className="mt-3 font-[family-name:var(--font-display)] text-xl leading-snug text-[var(--ink)] sm:text-2xl">
          “{quote.en}”
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">{quote.zh}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="連續打卡"
          value={`${snap.streak}`}
          hint={`最佳 ${snap.bestStreak} 天`}
          icon="fire"
        />
        <Stat
          label="今日"
          value={snap.mainDoneToday ? "已打卡" : "未完成"}
          hint={`今日單元 ${snap.unitsToday}`}
          icon={snap.mainDoneToday ? "check" : "sun"}
        />
        <Stat
          label="打卡天數"
          value={`${snap.checkInDays}`}
          hint="主單元打卡累計"
          icon="star"
        />
        <Stat
          label="累計單元"
          value={`${snap.totalUnits}`}
          hint={snap.message}
          icon="rocket"
        />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-[var(--ink)]">近兩週一覽</h2>
        <div className="flex flex-wrap gap-1.5">
          {recent.map((d) => (
            <div
              key={d.date}
              title={`${d.date} · ${d.mainDone ? "已打卡" : "未打卡"} · ${d.unitsDone} 單元`}
              className={`flex h-10 w-10 flex-col items-center justify-center rounded-lg text-[9px] ${
                d.mainDone
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)]"
              }`}
            >
              <span>{d.date.slice(8)}</span>
              <span>{d.mainDone ? "✓" : "·"}</span>
            </div>
          ))}
        </div>
      </section>

      <details className="group rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-sm text-[var(--ink)] marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="flex min-w-0 items-center gap-1.5">
            <CuteIcon name="heart" className="text-sm" />
            <span className="font-medium">全部歷程</span>
            <span className="truncate text-xs text-[var(--muted)]">
              打卡 {snap.checkInDays} 天
              {months.length
                ? ` · ${months.reduce((a, m) => a + m.days.length, 0)} 筆`
                : ""}
            </span>
          </span>
          <span className="shrink-0 text-xs text-[var(--muted)] group-open:hidden">
            展開
          </span>
          <span className="hidden shrink-0 text-xs text-[var(--muted)] group-open:inline">
            收合
          </span>
        </summary>
        <div className="border-t border-[var(--line)] px-3 py-2.5">
          {!months.length ? (
            <p className="py-2 text-center text-xs text-[var(--muted)]">
              尚無紀錄
            </p>
          ) : (
            <ul className="space-y-2.5">
              {months.map((block) => (
                <li key={block.month}>
                  <p className="mb-1 text-[10px] text-[var(--muted)]">
                    {formatMonth(block.month)} · {block.mainCount} 打卡
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {block.days.map((d) => (
                      <span
                        key={d.date}
                        title={`${d.date} · ${d.mainDone ? "打卡" : "加練"} · ${d.unitsDone} 單元`}
                        className={`inline-flex h-6 min-w-6 items-center justify-center rounded px-1 text-[10px] tabular-nums ${
                          d.mainDone
                            ? "bg-[var(--accent)] text-white"
                            : "border border-[var(--line)] text-[var(--muted)]"
                        }`}
                      >
                        {d.date.slice(8)}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </details>

      <section>
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-[var(--ink)]">
          <CuteIcon name="spark" className="text-base" />
          里程碑徽章
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {BADGES.map((b) => {
            const unlocked = snap.badges.includes(b.id);
            const meta = badgeMeta(b.id);
            const q = badgeQuote(b.id);
            return (
              <li
                key={b.id}
                className={`rounded-[var(--radius)] border px-4 py-3 ${
                  unlocked
                    ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                    : "border-[var(--line)] bg-[var(--surface)] opacity-70"
                }`}
              >
                <p className="text-sm font-medium text-[var(--ink)]">
                  {unlocked ? "★ " : "○ "}
                  {meta.title}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">{meta.body}</p>
                {q ? (
                  <p className="mt-2 text-xs leading-relaxed text-[var(--ink)]">
                    <span className="font-[family-name:var(--font-display)] italic">
                      {q.en}
                    </span>
                    <span className="mt-0.5 block text-[var(--muted)]">
                      {q.zh}
                    </span>
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      <Link
        href="/english/today"
        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--accent)] px-5 text-sm text-white"
      >
        <CuteIcon name="rocket" />
        去練今日微課
      </Link>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: ComponentProps<typeof CuteIcon>["name"];
}) {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
      <p className="flex items-center gap-1 text-[10px] tracking-[0.14em] text-[var(--muted)]">
        <CuteIcon name={icon} className="text-sm" />
        {label}
      </p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
        {value}
      </p>
      <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p>
    </div>
  );
}
