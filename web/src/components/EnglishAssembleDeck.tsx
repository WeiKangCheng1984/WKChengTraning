"use client";

import { useMemo, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import { MasteryControls } from "@/components/MasteryControls";
import { DeckNav } from "@/components/DeckNav";
import { MySentencePad } from "@/components/MySentencePad";
import { gradeCard } from "@/lib/srs";
import type { EnglishItem } from "@/lib/types";

type Props = {
  items: EnglishItem[];
  categorySlug: string;
  categoryTitle: string;
};

export function EnglishAssembleDeck({ items, categorySlug, categoryTitle }: Props) {
  const pool = useMemo(() => items.slice(0, Math.min(12, items.length)), [items]);
  const [index, setIndex] = useState(0);
  const [exIdx, setExIdx] = useState(0);
  const [showEn, setShowEn] = useState(false);

  const current = pool[index];
  const examples = current?.examples?.length
    ? current.examples
    : [{ tag: "提示", en: current?.en ?? "", zh: current?.zh ?? "" }];
  const ex = examples[Math.min(exIdx, examples.length - 1)];

  function go(delta: number) {
    if (!pool.length) return;
    setShowEn(false);
    setExIdx(0);
    setIndex((i) => (i + delta + pool.length) % pool.length);
  }

  if (!current) return null;

  return (
    <section className="space-y-4 rounded-sm border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
            English Assemble · {categoryTitle}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            看中文情境 → 組出英文 → 跟讀／自造句
          </p>
        </div>
        <FavoriteButton
          id={`en:${current.id}`}
          kind="en"
          title={current.en}
          subtitle={current.zh}
          href={`/english/${categorySlug}`}
        />
      </div>

      <div className="rounded-sm border border-[var(--line)] bg-[var(--paper)] p-5">
        <div className="text-xs text-[var(--accent)]">句型／片語</div>
        <p className="mt-2 text-xl text-[var(--ink)]">{current.zh || current.en}</p>
        {current.note ? (
          <p className="mt-2 text-sm text-[var(--muted)]">注意：{current.note}</p>
        ) : null}
        {current.formal ? (
          <p className="mt-1 text-sm text-[var(--muted)]">書面對應：{current.formal}</p>
        ) : null}

        <div className="mt-5">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {examples.map((e, i) => (
              <button
                key={`${current.id}-${i}`}
                type="button"
                onClick={() => {
                  setExIdx(i);
                  setShowEn(false);
                }}
                className={`rounded-full px-3 py-1 text-xs ${
                  i === exIdx
                    ? "bg-[var(--ink)] text-[var(--paper)]"
                    : "border border-[var(--line)] text-[var(--muted)]"
                }`}
              >
                {e.tag || `例句 ${i + 1}`}
              </button>
            ))}
          </div>
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            {ex.zh || "（先想英文怎麼說）"}
          </p>
        </div>

        {!showEn ? (
          <button
            type="button"
            onClick={() => setShowEn(true)}
            className="mt-5 rounded-sm border border-[var(--line)] bg-white px-4 py-2 text-sm"
          >
            顯示英文並跟讀
          </button>
        ) : (
          <div className="mt-5 space-y-3">
            <div className="flex items-start gap-2">
              <SpeakButton text={current.en} label={current.en} />
              <div>
                <div className="text-xs text-[var(--accent)]">骨架</div>
                <p className="text-lg text-[var(--ink)]">{current.en}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-sm bg-white/80 p-3">
              <SpeakButton text={ex.en} label="組裝句" size="sm" />
              <div>
                <div className="text-xs text-[var(--accent)]">組裝後的句子</div>
                <p className="text-sm text-[var(--ink)]">{ex.en}</p>
              </div>
            </div>
            <MasteryControls scope="en" id={current.id} />
          </div>
        )}

        <MySentencePad
          categorySlug={categorySlug}
          patternId={current.id}
          patternEn={current.en}
        />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              gradeCard("en", current.id, "again");
              go(1);
            }}
            className="rounded-sm border border-[var(--line)] px-3 py-2 text-sm"
          >
            再練
          </button>
          <button
            type="button"
            onClick={() => {
              gradeCard("en", current.id, "good");
              go(1);
            }}
            className="rounded-sm border border-[var(--accent)] px-3 py-2 text-sm text-[var(--ink)]"
          >
            記得
          </button>
        </div>
        <DeckNav
          index={index}
          total={pool.length}
          onPrev={() => go(-1)}
          onNext={() => go(1)}
          label="瀏覽不改分數"
        />
      </div>
    </section>
  );
}
