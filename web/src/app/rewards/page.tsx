"use client";

import Link from "next/link";
import { useEffect, useState, type ComponentProps } from "react";
import { CuteIcon } from "@/components/CuteIcon";
import {
  BADGES,
  badgeMeta,
  getRecentDays,
  getRewardsSnapshot,
  type RewardsSnapshot,
} from "@/lib/rewards";
import { onStorageChange } from "@/lib/persist";

export default function RewardsPage() {
  const [snap, setSnap] = useState<RewardsSnapshot | null>(null);
  const [days, setDays] = useState(getRecentDays(14));

  useEffect(() => {
    const sync = () => {
      setSnap(getRewardsSnapshot());
      setDays(getRecentDays(14));
    };
    sync();
    return onStorageChange(sync);
  }, []);

  if (!snap) {
    return <p className="text-[var(--muted)]">載入打卡…</p>;
  }

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
          每天完成「今日主單元」就算打卡。加練會累計單元數，但不影響連續天數。
        </p>
      </div>

      <section
        className="grid gap-4 rounded-[var(--radius)] border border-[var(--line)] p-5 sm:grid-cols-3"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--accent-soft) 45%, white), color-mix(in srgb, var(--sky-soft) 50%, white))",
        }}
      >
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
          label="累計單元"
          value={`${snap.totalUnits}`}
          hint={snap.message}
          icon="star"
        />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-[var(--ink)]">近兩週</h2>
        <div className="flex flex-wrap gap-1.5">
          {days.map((d) => (
            <div
              key={d.date}
              title={`${d.date} · ${d.mainDone ? "已打卡" : "未打卡"} · ${d.unitsDone} 單元`}
              className={`flex h-10 w-10 flex-col items-center justify-center rounded-lg text-[9px] ${
                d.mainDone
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--surface)] text-[var(--muted)] border border-[var(--line)]"
              }`}
            >
              <span>{d.date.slice(8)}</span>
              <span>{d.mainDone ? "✓" : "·"}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-[var(--ink)]">
          <CuteIcon name="spark" className="text-base" />
          徽章
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {BADGES.map((b) => {
            const unlocked = snap.badges.includes(b.id);
            const meta = badgeMeta(b.id);
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
                  {unlocked ? "⭐ " : "○ "}
                  {meta.title}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">{meta.body}</p>
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
    <div>
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
