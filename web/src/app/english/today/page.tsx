"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import english from "@/data/english.json";
import grammar from "@/data/grammar.json";
import speak from "@/data/speak.json";
import vocabulary from "@/data/vocabulary.json";
import { buildEnglishPack, type EnglishPack } from "@/lib/englishToday";
import { onStorageChange } from "@/lib/persist";
import { creditPackStep } from "@/lib/rewards";
import { setEnglishPackProgress } from "@/lib/session";
import type {
  EnglishData,
  GrammarData,
  SpeakData,
  VocabularyData,
} from "@/lib/types";

const grammarData = grammar as GrammarData;
const speakData = speak as SpeakData;
const enData = english as EnglishData;
const vocabData = vocabulary as VocabularyData;

export default function EnglishTodayPage() {
  const [pack, setPack] = useState<EnglishPack | null>(null);

  useEffect(() => {
    const sync = () =>
      setPack(buildEnglishPack(grammarData, speakData, enData, vocabData));
    sync();
    return onStorageChange(sync);
  }, []);

  if (!pack) {
    return <p className="text-[var(--muted)]">準備今日英語套餐…</p>;
  }

  const steps = [
    {
      n: 1,
      title: "文法課＋跟讀短文",
      body: `Lesson ${String(pack.grammar.num).padStart(2, "0")}｜${pack.grammar.titleZh}。先讀規則，再用 TTS 跟讀短文（約 ${pack.grammar.passage.words} words）。`,
      href: `/english/grammar/${pack.grammar.slug}`,
      meta: "約 8–10 分",
    },
    {
      n: 2,
      title: "口語跟讀",
      body: `接著練「${pack.speakTitle}」。可隱藏英文、逐句跟讀。`,
      href: `/speak/${pack.speakSlug}`,
      meta: "約 5–7 分",
    },
    {
      n: 3,
      title: "句型組句",
      body: `做 ${pack.patternCount} 組：${pack.patternLabel}。看中文組句、聽發音。`,
      href: pack.patternHref,
      meta: "約 5 分",
    },
    {
      n: 4,
      title: "英語到期複習",
      body:
        pack.reviewCount > 0
          ? `有 ${pack.reviewCount} 項文法／跟讀／句型到期，快速評分帶過。`
          : "目前沒有到期項；標「學習中／已掌握」後會進入複習隊列。",
      href: "/english/review",
      meta: pack.reviewCount > 0 ? "約 3–5 分" : "可略過",
    },
    {
      n: 5,
      title: "進階詞彙閃卡",
      body: `今日約 ${pack.vocabCount} 詞：${pack.vocabLabel}。可只背未掌握；標掌握度後會進間隔複習。`,
      href: pack.vocabHref,
      meta: "約 5–8 分",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/english"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← English
        </Link>
        <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          Today · English
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          今日英語套餐
        </h1>
        <p className="mt-2 max-w-2xl text-base text-[var(--muted)]">
          約 {pack.minutes}{" "}
          分鐘。五步：文法 → 跟讀 → 句型 → 複習 → 進階詞彙。依掌握度自動選課。
        </p>
      </div>

      <ol className="space-y-3">
        {steps.map((s) => (
          <li key={s.n}>
            <Link
              href={s.href}
              onClick={() => {
                setEnglishPackProgress(s.n);
                creditPackStep(s.n);
              }}
              className="card-tap flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
                  Step {s.n} · {s.meta}
                </p>
                <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                  {s.title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                  {s.body}
                </p>
              </div>
              <span className="shrink-0 text-sm text-[var(--ink)]">開始 →</span>
            </Link>
          </li>
        ))}
      </ol>

      <p className="text-sm text-[var(--muted)]">
        房地產專名另見{" "}
        <Link href="/real-estate" className="text-[var(--ink)] underline">
          Real Estate
        </Link>
        。
      </p>
    </div>
  );
}
