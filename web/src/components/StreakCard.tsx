"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CuteIcon } from "@/components/CuteIcon";
import { getRewardsSnapshot, type RewardsSnapshot } from "@/lib/rewards";
import { onStorageChange } from "@/lib/persist";

export function StreakCard() {
  const [snap, setSnap] = useState<RewardsSnapshot | null>(null);

  useEffect(() => {
    const sync = () => setSnap(getRewardsSnapshot());
    sync();
    return onStorageChange(sync);
  }, []);

  if (!snap) return null;

  return (
    <Link
      href="/rewards"
      className="flex items-center justify-between gap-3 rounded-[var(--radius)] border border-[var(--line)] px-4 py-3 transition hover:border-[var(--accent)]"
      style={{
        background:
          "linear-gradient(120deg, color-mix(in srgb, var(--accent-soft) 50%, white), color-mix(in srgb, var(--sky-soft) 55%, white))",
      }}
    >
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-[10px] font-medium tracking-[0.14em] text-[var(--accent)]">
          <CuteIcon name="fire" className="text-sm" />
          每日打卡
        </p>
        <p className="mt-1 text-sm text-[var(--ink)]">
          {snap.mainDoneToday ? (
            <>
              <CuteIcon name="check" className="text-base" /> 今日主單元已完成
            </>
          ) : (
            "完成今日主單元即可打卡"
          )}
        </p>
        <p className="mt-0.5 text-xs text-[var(--muted)]">{snap.message}</p>
      </div>
      <div className="shrink-0 text-center">
        <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--sky)]">
          {snap.streak}
        </p>
        <p className="text-[10px] text-[var(--muted)]">連續天</p>
      </div>
    </Link>
  );
}
