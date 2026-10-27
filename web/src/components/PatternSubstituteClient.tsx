"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { PatternTemplates } from "@/lib/patternLoop";
import {
  buildSubstituteSingle,
  readSubstituteSession,
  resolveItemMap,
  tryRandom10ForSubstitute,
  writeSubstituteSession,
  type SubstituteSession,
} from "@/lib/patternSubstitute";

export function PatternSubstituteClient({ data }: { data: PatternTemplates }) {
  const lLevels = data.levels.filter((lv) => lv.id !== "L0");
  const first = lLevels[0] ?? data.levels[0];
  const [levelId, setLevelId] = useState(first.id);
  const [itemId, setItemId] = useState(first.items[0]?.id ?? "");
  const [session, setSession] = useState<SubstituteSession | null>(null);
  const [randomReady, setRandomReady] = useState<SubstituteSession | null>(
    null,
  );

  const level = data.levels.find((lv) => lv.id === levelId) ?? first;
  const itemMap = useMemo(() => resolveItemMap(data), [data]);

  useEffect(() => {
    setSession(readSubstituteSession());
    setRandomReady(tryRandom10ForSubstitute());
  }, []);

  function useSingleSelection() {
    const built = buildSubstituteSingle(itemId);
    writeSubstituteSession(built);
    setSession(built);
  }

  function useRandom10() {
    const r = tryRandom10ForSubstitute();
    if (!r) return;
    writeSubstituteSession(r);
    setSession(r);
  }

  const previewItems = session
    ? session.itemIds.map((id) => itemMap.get(id)).filter(Boolean)
    : [];

  return (
    <div className="space-y-6">
      {randomReady ? (
        <div className="rounded-sm border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-3">
          <p className="text-sm text-[var(--ink)]">
            可沿用十句型清單（{randomReady.itemIds.length} 個模板）
          </p>
          <button
            type="button"
            onClick={useRandom10}
            className="mt-2 rounded-sm bg-[var(--ink)] px-4 py-2 text-sm text-[var(--paper)]"
          >
            用十句型集開始抽換
          </button>
        </div>
      ) : (
        <p className="text-sm text-[var(--muted)]">
          想練 10 型連打？先到{" "}
          <Link href="/english/patterns/random" className="text-[var(--accent)]">
            十句型隨機集
          </Link>{" "}
          建立清單。
        </p>
      )}

      <div className="space-y-3 rounded-sm border border-[var(--line)] bg-[var(--surface)] p-4">
        <p className="text-sm font-medium text-[var(--ink)]">或選單一模板</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {lLevels.map((lv) => (
            <button
              key={lv.id}
              type="button"
              onClick={() => {
                setLevelId(lv.id);
                setItemId(lv.items[0]?.id ?? "");
              }}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-sm ${
                lv.id === levelId
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                  : "border-[var(--line)] bg-[var(--paper)]"
              }`}
            >
              {lv.id}
            </button>
          ))}
        </div>
        <label className="block text-sm text-[var(--muted)]">
          模板
          <select
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            className="mt-1 w-full rounded-sm border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-base"
          >
            {level.items.map((it) => (
              <option key={it.id} value={it.id}>
                {it.id}　{it.pattern}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={useSingleSelection}
          className="rounded-sm border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-sm"
        >
          用此模板開始
        </button>
      </div>

      {session ? (
        <div className="space-y-2">
          <p className="text-sm text-[var(--muted)]">{session.label}</p>
          <ol className="text-sm text-[var(--muted)]">
            {previewItems.slice(0, 10).map((it, i) => (
              <li key={it!.id}>
                {i + 1}. {it!.pattern} — {it!.zhName}
              </li>
            ))}
          </ol>
          <Link
            href="/english/patterns/substitute/play"
            className="inline-flex min-h-12 items-center rounded-sm bg-[var(--ink)] px-6 text-sm text-[var(--paper)]"
          >
            進入抽換快打
          </Link>
        </div>
      ) : null}
    </div>
  );
}
