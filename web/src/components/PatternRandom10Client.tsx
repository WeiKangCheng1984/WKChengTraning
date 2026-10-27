"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PatternTemplates } from "@/lib/patternLoop";
import {
  buildSession,
  readSession,
  resolveItems,
  sessionStillValid,
  writeSession,
  type Random10Mode,
  type Random10Session,
} from "@/lib/patternRandom10";

export function PatternRandom10Client({ data }: { data: PatternTemplates }) {
  const [session, setSession] = useState<Random10Session | null>(null);
  const [mode, setMode] = useState<Random10Mode>("daily");

  const syncFromStorage = useCallback(() => {
    const saved = readSession();
    if (saved && sessionStillValid(saved)) {
      setSession(saved);
      setMode(saved.mode);
      return;
    }
    const next = buildSession(data, mode);
    writeSession(next);
    setSession(next);
  }, [data, mode]);

  useEffect(() => {
    const saved = readSession();
    if (saved && sessionStillValid(saved)) {
      setSession(saved);
      setMode(saved.mode);
      return;
    }
    const initial = buildSession(data, "daily");
    writeSession(initial);
    setSession(initial);
    setMode("daily");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const items = useMemo(
    () => (session ? resolveItems(data, session.itemIds) : []),
    [data, session],
  );

  function applyMode(next: Random10Mode) {
    setMode(next);
    const built = buildSession(data, next);
    writeSession(built);
    setSession(built);
  }

  function rerollShuffle() {
    const built = buildSession(data, "shuffle");
    writeSession(built);
    setSession(built);
    setMode("shuffle");
  }

  if (!session) {
    return (
      <p className="text-sm text-[var(--muted)]">正在準備十句型集…</p>
    );
  }

  const dailyActive = session.mode === "daily" && sessionStillValid(session);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => applyMode("daily")}
          className={`rounded-full border px-4 py-2 text-sm ${
            mode === "daily"
              ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
              : "border-[var(--line)] bg-[var(--surface)]"
          }`}
        >
          今日十句型
        </button>
        <button
          type="button"
          onClick={() => applyMode("shuffle")}
          className={`rounded-full border px-4 py-2 text-sm ${
            mode === "shuffle"
              ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
              : "border-[var(--line)] bg-[var(--surface)]"
          }`}
        >
          隨機十句型
        </button>
        {mode === "shuffle" ? (
          <button
            type="button"
            onClick={rerollShuffle}
            className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--ink)]"
          >
            重新抽籤
          </button>
        ) : (
          <button
            type="button"
            onClick={syncFromStorage}
            className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--muted)]"
          >
            刷新今日集
          </button>
        )}
      </div>

      <p className="text-sm text-[var(--muted)]">
        {session.label} · L1–L6 各至少 1 個 · 每句型 12 變形 · 共{" "}
        <strong className="font-medium text-[var(--ink)]">120</strong> 句
        {dailyActive ? " · 今日固定，隔日自動換組" : ""}
      </p>

      <ol className="space-y-3">
        {items.map((it, i) => (
          <li
            key={it.id}
            className="rounded-sm border border-[var(--line)] bg-[var(--surface)] px-4 py-3"
          >
            <p className="text-xs text-[var(--accent)]">
              {i + 1} / 10 · {it.id}
            </p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
              {it.pattern}
            </p>
            <p className="mt-1 text-sm text-[var(--ink)]">{it.zhName}</p>
            <p className="mt-2 line-clamp-2 text-xs text-[var(--muted)]">
              {it.note}
            </p>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/english/patterns/random/play"
          className="inline-flex min-h-12 items-center rounded-sm bg-[var(--ink)] px-6 text-sm text-[var(--paper)]"
        >
          開始覆讀（120 句）
        </Link>
        <Link
          href="/english/patterns"
          className="inline-flex min-h-12 items-center rounded-sm border border-[var(--line)] px-5 text-sm"
        >
          返回單模板覆讀
        </Link>
      </div>
    </div>
  );
}
