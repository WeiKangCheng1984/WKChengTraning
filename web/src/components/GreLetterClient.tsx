"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import { MasteryControls } from "@/components/MasteryControls";
import { getMastery } from "@/lib/mastery";
import type { GreLetter, Mastery } from "@/lib/types";

type Props = {
  letter: GreLetter;
};

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  if (!value) return null;
  return (
    <p className="text-sm leading-relaxed text-[var(--ink)]">
      <span className="text-[var(--muted)]">{label}：</span>
      {value}
    </p>
  );
}

export function GreLetterClient({ letter }: Props) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | Mastery>("all");
  const [onlyDetailed, setOnlyDetailed] = useState(false);
  const [tick, setTick] = useState(0);

  const words = useMemo(() => {
    void tick;
    const query = q.trim().toLowerCase();
    return letter.words.filter((w) => {
      if (onlyDetailed && !w.detailed) return false;
      const m = getMastery("gre", w.id);
      if (filter !== "all" && m !== filter) return false;
      if (!query) return true;
      const blob = [
        w.en,
        w.zh,
        w.endef,
        w.example,
        w.synonyms,
        w.antonyms,
        w.derivatives,
        w.lookalikes,
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(query);
    });
  }, [letter.words, q, filter, onlyDetailed, tick]);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/english/gre"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← GRE 單字
        </Link>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
          GRE · Letter {letter.letter}
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          {letter.letter}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {letter.wordCount} 詞 · TTS · 掌握度
        </p>
        <Link
          href={`/english/gre/drill?letter=${letter.slug}`}
          className="mt-3 inline-flex min-h-10 items-center rounded-sm bg-[var(--ink)] px-4 text-sm text-[var(--paper)] hover:bg-[var(--ink-soft)]"
        >
          本字母閃卡 →
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜尋英文／中文／近義／反義／例句…"
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
        <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <input
            type="checkbox"
            checked={onlyDetailed}
            onChange={(e) => setOnlyDetailed(e.target.checked)}
            className="accent-[var(--accent)]"
          />
          只看詳情完整詞
        </label>
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
              <div className="min-w-0 flex-1 space-y-1.5">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
                  {w.detailed ? "詳細" : "詞義"} · {w.sources || "GRE"}
                </p>
                <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                  {w.en}
                </h2>
                {w.zh ? (
                  <p className="text-sm text-[var(--ink)]">{w.zh}</p>
                ) : null}
                <Row label="英文釋義" value={w.endef} />
                <Row label="用法／詞組" value={w.example} />
                <Row label="相似詞" value={w.synonyms} />
                <Row label="相反詞" value={w.antonyms} />
                <Row label="派生詞" value={w.derivatives} />
                <Row label="形近詞" value={w.lookalikes} />
              </div>
              <FavoriteButton
                id={`gre:${w.id}`}
                kind="gre"
                title={w.en}
                subtitle={w.zh}
                href={`/english/gre/${letter.slug}`}
              />
            </div>
            <div
              className="mt-3"
              onClick={() => setTick((t) => t + 1)}
              onKeyDown={() => setTick((t) => t + 1)}
              role="presentation"
            >
              <MasteryControls scope="gre" id={w.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
