"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import { MasteryControls } from "@/components/MasteryControls";
import { getMastery } from "@/lib/mastery";
import type { Mastery, VocabTable } from "@/lib/types";

type Props = {
  table: VocabTable;
};

export function VocabTableClient({ table }: Props) {
  const [partNum, setPartNum] = useState<number | "all">(1);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | Mastery>("all");
  const [tick, setTick] = useState(0);

  const words = useMemo(() => {
    void tick;
    const query = q.trim().toLowerCase();
    const pool =
      partNum === "all"
        ? table.parts.flatMap((p) =>
            p.words.map((w) => ({ ...w, part: p.num })),
          )
        : (table.parts.find((p) => p.num === partNum)?.words ?? []).map(
            (w) => ({ ...w, part: partNum as number }),
          );

    return pool.filter((w) => {
      const m = getMastery("vocab", w.id);
      if (filter !== "all" && m !== filter) return false;
      if (!query) return true;
      const blob = [
        w.en,
        w.zh,
        w.ipa,
        w.pos,
        w.exampleEn,
        ...w.collocations.map((c) => `${c.en} ${c.zh}`),
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(query);
    });
  }, [table.parts, partNum, q, filter, tick]);

  const activePart =
    partNum === "all"
      ? null
      : table.parts.find((p) => p.num === partNum) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/english/vocab"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← 進階詞彙
        </Link>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
          表 {table.id} · {table.titleEn} · {table.level}
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          {table.titleZh}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {table.wordCount} 詞 · {table.parts.length} Parts · TTS
        </p>
        <Link
          href={`/english/vocab/drill?table=${table.slug}`}
          className="mt-3 inline-flex min-h-10 items-center rounded-sm bg-[var(--ink)] px-4 text-sm text-[var(--paper)] hover:bg-[var(--ink-soft)]"
        >
          本表閃卡 →
        </Link>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setPartNum("all")}
          className={`rounded-full px-3 py-1 text-xs ${
            partNum === "all"
              ? "bg-[var(--ink)] text-[var(--paper)]"
              : "border border-[var(--line)] text-[var(--muted)]"
          }`}
        >
          全部
        </button>
        {table.parts.map((p) => (
          <button
            key={p.num}
            type="button"
            onClick={() => setPartNum(p.num)}
            className={`rounded-full px-3 py-1 text-xs ${
              partNum === p.num
                ? "bg-[var(--ink)] text-[var(--paper)]"
                : "border border-[var(--line)] text-[var(--muted)]"
            }`}
          >
            P{p.num}
          </button>
        ))}
      </div>

      {activePart?.blurb ? (
        <p className="rounded-sm border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm leading-relaxed text-[var(--muted)]">
          {activePart.blurb}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜尋英文／中文／搭配／例句…"
          className="w-full flex-1 rounded-sm border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value as "all" | Mastery);
            setTick((t) => t + 1);
          }}
          className="rounded-sm border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm"
        >
          <option value="all">全部掌握度</option>
          <option value="unseen">未學</option>
          <option value="learning">學習中</option>
          <option value="mastered">已掌握</option>
        </select>
      </div>

      <p className="text-sm text-[var(--muted)]">{words.length} 詞</p>

      <ul className="space-y-3">
        {words.map((w) => (
          <li
            key={w.id}
            className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-4"
          >
            <div className="flex items-start gap-3">
              <SpeakButton text={w.en} label={w.en} />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
                  Part {w.part} · #{w.num} · {w.pos}
                </p>
                <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                  {w.en}
                </h2>
                <p className="mt-0.5 text-sm text-[var(--muted)]">{w.ipa}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]">
                  {w.zh}
                </p>
              </div>
              <FavoriteButton
                id={`vocab:${w.id}`}
                kind="vocab"
                title={w.en}
                subtitle={w.zh}
                href={`/english/vocab/${table.slug}`}
              />
            </div>

            {w.collocations.length > 0 ? (
              <ul className="mt-3 space-y-1.5 border-t border-[var(--line)] pt-3">
                {w.collocations.map((c, i) => (
                  <li key={`${w.id}-c-${i}`} className="flex items-start gap-2">
                    <SpeakButton text={c.en} label={c.en} size="sm" />
                    <div className="min-w-0 text-sm">
                      <span className="text-[var(--ink)]">{c.en}</span>
                      <span className="text-[var(--muted)]"> · {c.zh}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}

            {w.exampleEn ? (
              <div className="mt-3 flex items-start gap-2 rounded-sm bg-[var(--paper)] p-3">
                <SpeakButton text={w.exampleEn} label="例句" size="sm" />
                <p className="text-sm leading-relaxed text-[var(--ink)]">
                  {w.exampleEn}
                </p>
              </div>
            ) : null}

            <div
              className="mt-3"
              onClick={() => setTick((t) => t + 1)}
              onKeyDown={() => setTick((t) => t + 1)}
              role="presentation"
            >
              <MasteryControls scope="vocab" id={w.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
