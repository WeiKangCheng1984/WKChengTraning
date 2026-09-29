"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SpeakButton } from "@/components/SpeakButton";
import { MasteryControls } from "@/components/MasteryControls";
import { getMastery } from "@/lib/mastery";
import type { EnglishData, EnglishItem } from "@/lib/types";
import english from "@/data/english.json";

const data = english as EnglishData;

function DrillInner() {
  const sp = useSearchParams();
  const cat = sp.get("cat");
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [onlyWeak, setOnlyWeak] = useState(false);
  const [tick, setTick] = useState(0);

  const pool = useMemo(() => {
    void tick;
    const cats = cat
      ? data.categories.filter((c) => c.slug === cat)
      : data.categories;
    let items: EnglishItem[] = cats.flatMap((c) => c.items);
    if (onlyWeak) {
      items = items.filter((it) => getMastery("en", it.id) !== "mastered");
    }
    return items;
  }, [cat, onlyWeak, tick]);

  const current = pool[index] ?? null;
  const title = cat
    ? data.categories.find((c) => c.slug === cat)?.title ?? "類別練習"
    : "English 全庫練習";

  function go(delta: number) {
    if (!pool.length) return;
    setRevealed(false);
    setIndex((i) => (i + delta + pool.length) % pool.length);
  }

  return (
    <div className="space-y-6">
      <Link
        href="/english"
        className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
      >
        ← 返回 English Drill
      </Link>

      <section className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            {title}
          </h1>
          <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <input
              type="checkbox"
              checked={onlyWeak}
              onChange={(e) => {
                setOnlyWeak(e.target.checked);
                setIndex(0);
                setRevealed(false);
                setTick((t) => t + 1);
              }}
              className="accent-[var(--accent)]"
            />
            只練未掌握
          </label>
        </div>

        {!current ? (
          <p className="mt-8 text-center text-[var(--muted)]">沒有可練習的項目。</p>
        ) : (
          <>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {index + 1} / {pool.length} · 看中文想英文，再揭曉
            </p>

            <div className="mt-6 rounded-sm border border-[var(--line)] bg-[var(--paper)] p-6">
              <div className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
                Prompt
              </div>
              <p className="mt-3 text-xl text-[var(--ink)]">{current.zh || "（片語練習）"}</p>
              {current.note ? (
                <p className="mt-2 text-sm text-[var(--muted)]">提示：{current.note}</p>
              ) : null}

              {!revealed ? (
                <button
                  type="button"
                  onClick={() => setRevealed(true)}
                  className="mt-6 rounded-sm border border-[var(--line)] bg-white px-4 py-2 text-sm text-[var(--ink)] hover:border-[var(--accent)]"
                >
                  顯示英文答案
                </button>
              ) : (
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <SpeakButton text={current.en} label={current.en} />
                    <div>
                      <div className="text-xs text-[var(--accent)]">Answer</div>
                      <p className="mt-1 text-2xl text-[var(--ink)]">{current.en}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {current.examples.slice(0, 2).map((ex, i) => (
                      <div key={i} className="rounded-sm bg-white/70 p-3 text-sm">
                        <div className="mb-1 flex items-center gap-2 text-xs text-[var(--accent)]">
                          {ex.tag}
                          <SpeakButton text={ex.en} label="例句" size="sm" />
                        </div>
                        <p>{ex.en}</p>
                        {ex.zh ? (
                          <p className="mt-1 text-[var(--muted)]">{ex.zh}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  <MasteryControls scope="en" id={current.id} />
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                className="rounded-sm border border-[var(--line)] px-4 py-2 text-sm"
              >
                上一題
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="rounded-sm bg-[var(--ink)] px-4 py-2 text-sm text-[var(--paper)]"
              >
                下一題
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default function EnglishDrillPage() {
  return (
    <Suspense fallback={<p className="text-[var(--muted)]">載入練習…</p>}>
      <DrillInner />
    </Suspense>
  );
}
