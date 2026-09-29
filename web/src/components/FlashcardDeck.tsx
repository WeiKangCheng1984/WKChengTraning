"use client";

import { useEffect, useMemo, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { MasteryControls } from "@/components/MasteryControls";
import { getMastery } from "@/lib/mastery";
import type { Mastery } from "@/lib/types";

export type FlashItem = {
  id: string | number;
  scope: "cfa" | "en";
  front: string;
  backTitle: string;
  backBody: string;
  speakText: string;
};

type Props = {
  items: FlashItem[];
  title?: string;
};

export function FlashcardDeck({ items, title = "背誦模式" }: Props) {
  const [onlyWeak, setOnlyWeak] = useState(false);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const sync = () => setTick((t) => t + 1);
    window.addEventListener("omnilearn-mastery", sync);
    return () => window.removeEventListener("omnilearn-mastery", sync);
  }, []);

  const pool = useMemo(() => {
    void tick;
    if (!onlyWeak) return items;
    return items.filter((it) => {
      const m: Mastery = getMastery(it.scope, it.id);
      return m !== "mastered";
    });
  }, [items, onlyWeak, tick]);

  const current = pool[index] ?? null;

  function refresh() {
    setTick((t) => t + 1);
  }

  function go(delta: number) {
    if (!pool.length) return;
    setFlipped(false);
    setIndex((i) => (i + delta + pool.length) % pool.length);
  }

  return (
    <section className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          {title}
        </h2>
        <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <input
            type="checkbox"
            checked={onlyWeak}
            onChange={(e) => {
              setOnlyWeak(e.target.checked);
              setIndex(0);
              setFlipped(false);
              refresh();
            }}
            className="accent-[var(--accent)]"
          />
          只背未掌握／學習中
        </label>
      </div>

      {!current ? (
        <p className="mt-8 text-center text-[var(--muted)]">
          目前沒有符合條件的卡片。試試取消篩選，或先瀏覽詞條並標記掌握度。
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {index + 1} / {pool.length}
          </p>

          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="mt-5 flex min-h-[220px] w-full flex-col items-center justify-center rounded-sm border border-[var(--line)] bg-[var(--paper)] px-6 py-10 text-center transition hover:border-[var(--accent)]/50"
          >
            {!flipped ? (
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                  Front
                </div>
                <div className="mt-4 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)] sm:text-3xl">
                  {current.front}
                </div>
                <div className="mt-6 text-sm text-[var(--muted)]">點擊翻面</div>
              </div>
            ) : (
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                  Back
                </div>
                <div className="mt-4 text-xl text-[var(--ink)] sm:text-2xl">
                  {current.backTitle}
                </div>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
                  {current.backBody}
                </p>
              </div>
            )}
          </button>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <SpeakButton text={current.speakText} label={current.front} />
              <MasteryControls scope={current.scope} id={current.id} />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                className="rounded-sm border border-[var(--line)] px-4 py-2 text-sm text-[var(--ink)] hover:bg-[var(--paper)]"
              >
                上一張
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="rounded-sm bg-[var(--ink)] px-4 py-2 text-sm text-[var(--paper)] hover:bg-[var(--ink-soft)]"
              >
                下一張
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
