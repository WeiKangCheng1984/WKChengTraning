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
        <h2 className="mb-1 text-sm font-medium text-[var(--ink)]">近兩週一覽</h2>
        <p className="mb-3 text-xs text-[var(--muted)]">
          完整紀錄見下方「全部打卡歷程」
        </p>
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

      <section className="space-y-4">
        <div>
          <h2 className="flex items-center gap-1.5 text-sm font-medium text-[var(--ink)]">
            <CuteIcon name="heart" className="text-base" />
            全部打卡歷程
          </h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            共 {snap.checkInDays} 天主單元打卡
            {months.length
              ? ` · ${months.reduce((a, m) => a + m.days.length, 0)} 天有練習紀錄`
              : ""}
          </p>
        </div>

        {!months.length ? (
          <p className="rounded-sm border border-dashed border-[var(--line)] p-6 text-center text-sm text-[var(--muted)]">
            還沒有打卡紀錄。完成今日主單元後會出現在這裡。
          </p>
        ) : (
          <ul className="space-y-5">
            {months.map((block) => (
              <li key={block.month}>
                <div className="mb-2 flex items-baseline justify-between gap-2">
                  <h3 className="text-sm font-medium text-[var(--ink)]">
                    {formatMonth(block.month)}
                  </h3>
                  <span className="text-xs text-[var(--muted)]">
                    打卡 {block.mainCount} 天
                  </span>
                </div>
                <ul className="divide-y divide-[var(--line)] rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)]">
                  {block.days.map((d) => (
                    <li
                      key={d.date}
                      className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                    >
                      <div>
                        <p className="font-medium text-[var(--ink)]">
                          {d.date}
                        </p>
                        <p className="text-xs text-[var(--muted)]">
                          {d.mainDone ? "主單元已打卡" : "僅加練"}
                          {d.unitsDone > 0 ? ` · ${d.unitsDone} 單元` : ""}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium ${
                          d.mainDone
                            ? "bg-[var(--accent-soft)] text-[var(--ink)]"
                            : "bg-[var(--paper)] text-[var(--muted)]"
                        }`}
                      >
                        {d.mainDone ? "CHECK-IN" : "EXTRA"}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>

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
