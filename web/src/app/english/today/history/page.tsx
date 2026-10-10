"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { DailyUnitReview } from "@/components/DailyUnitPlayer";
import type {
  CompletedUnitRecord,
  DailyUnit,
} from "@/lib/dailyUnit/types";
import {
  getUnitHistoryRecord,
  listUnitHistory,
} from "@/lib/dailyUnitProgress";
import { onStorageChange } from "@/lib/persist";

function recordToUnit(record: CompletedUnitRecord): DailyUnit {
  return {
    id: record.unitId,
    programDay: record.programDay,
    unitIndex: record.unitIndex,
    titleZh: record.titleZh,
    titleEn: record.titleEn,
    blurb: `${record.date} 完成`,
    estimatedMinutes: 8,
    steps: record.results.map((r) => r.step),
  };
}

function formatWhen(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("zh-TW", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function HistoryInner() {
  const search = useSearchParams();
  const [history, setHistory] = useState<CompletedUnitRecord[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setHistory(listUnitHistory());
    sync();
    return onStorageChange(sync);
  }, []);

  useEffect(() => {
    const q = search.get("id");
    if (q) setActiveId(q);
  }, [search]);

  const active = useMemo(
    () => (activeId ? getUnitHistoryRecord(activeId) : null),
    // history refresh ensures record exists after sync
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeId, history.length],
  );

  if (active) {
    return (
      <DailyUnitReview
        unit={recordToUnit(active)}
        correct={active.correct}
        total={active.total}
        results={active.results}
        onAgain={() => setActiveId(null)}
        onHome={() => setActiveId(null)}
        againLabel="回到練習紀錄"
        homeLabel="關閉解析"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/english/today"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← 今日英語微課
        </Link>
        <p className="mt-3 text-xs font-medium tracking-[0.18em] text-[var(--sky)]">
          Practice log
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          已練單元紀錄
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          最近最多保留 {80} 份完成紀錄，可點進去重看每題解析。
        </p>
      </div>

      {history.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">
          還沒有完成紀錄。先去{" "}
          <Link href="/english/today" className="text-[var(--sky)] underline">
            今日英語微課
          </Link>{" "}
          練一單元吧。
        </p>
      ) : (
        <ul className="space-y-2">
          {history.map((h) => {
            const rate = h.total
              ? Math.round((h.correct / h.total) * 100)
              : 0;
            return (
              <li key={h.recordId}>
                <button
                  type="button"
                  onClick={() => setActiveId(h.recordId)}
                  className="card-tap flex w-full flex-col gap-1 text-left sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium tracking-[0.14em] text-[var(--accent)]">
                      Day {h.programDay}
                      {h.unitIndex > 0 ? ` · 加練 ${h.unitIndex}` : ""} ·{" "}
                      {formatWhen(h.completedAt)}
                    </p>
                    <p className="truncate font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
                      {h.titleZh}
                    </p>
                    <p className="text-xs text-[var(--muted)]">{h.titleEn}</p>
                  </div>
                  <div className="shrink-0 text-sm text-[var(--sky)]">
                    {h.correct}/{h.total}（{rate}%）· 看解析 →
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function DailyUnitHistoryPage() {
  return (
    <Suspense fallback={<p className="text-[var(--muted)]">載入練習紀錄…</p>}>
      <HistoryInner />
    </Suspense>
  );
}
