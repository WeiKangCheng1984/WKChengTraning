"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DailyGoalCard } from "@/components/DailyGoalCard";
import { ProgressSummary } from "@/components/ProgressSummary";
import { PLAN_DAYS, planProgress } from "@/lib/plan";
import { buildEnglishPack, type EnglishPack } from "@/lib/englishToday";
import { onStorageChange } from "@/lib/persist";
import { getSession } from "@/lib/session";
import { countScheduledDue } from "@/lib/srs";
import cfa from "@/data/cfa.json";
import english from "@/data/english.json";
import grammar from "@/data/grammar.json";
import speak from "@/data/speak.json";
import vocabulary from "@/data/vocabulary.json";
import { listVocabIds } from "@/lib/vocabToday";
import type {
  CfaData,
  EnglishData,
  GrammarData,
  SpeakData,
  VocabularyData,
} from "@/lib/types";

const cfaData = cfa as CfaData;
const enData = english as EnglishData;
const grammarData = grammar as GrammarData;
const speakData = speak as SpeakData;
const vocabData = vocabulary as VocabularyData;

export default function HomePage() {
  const cfaIds = useMemo(
    () => cfaData.subjects.flatMap((s) => s.terms.map((t) => t.id)),
    [],
  );
  const enIds = useMemo(
    () => enData.categories.flatMap((c) => c.items.map((i) => i.id)),
    [],
  );
  const vocabIds = useMemo(() => listVocabIds(vocabData), []);

  const [progress, setProgress] = useState({ done: 0, total: 20, pct: 0 });
  const [dueCfa, setDueCfa] = useState(0);
  const [pack, setPack] = useState<EnglishPack | null>(null);
  const [lastSpeak, setLastSpeak] = useState<{
    slug?: string;
    title?: string;
  }>({});

  useEffect(() => {
    const sync = () => {
      setProgress(planProgress());
      setDueCfa(
        countScheduledDue(cfaIds.map((id) => ({ scope: "cfa" as const, id }))),
      );
      setPack(buildEnglishPack(grammarData, speakData, enData, vocabData));
      const s = getSession();
      setLastSpeak({ slug: s.lastSpeakSlug, title: s.lastSpeakTitle });
    };
    sync();
    return onStorageChange(sync);
  }, [cfaIds, enIds, vocabIds]);

  const nextDay =
    PLAN_DAYS.find((d) => d.day === progress.done + 1) ?? PLAN_DAYS[0];
  const continueSpeak =
    speakData.articles.find((a) => a.slug === lastSpeak.slug) ??
    speakData.articles[0];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "早安" : hour < 18 ? "午安" : "晚安";

  return (
    <div className="space-y-5">
      <section className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-[var(--muted)]">{greeting}</p>
          <h1 className="mt-0.5 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)] sm:text-3xl">
            今日
          </h1>
        </div>
        <p className="max-w-[14rem] text-right text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
          CFA · English · RE · Life
        </p>
      </section>

      {/* Mid focus: daily hour */}
      <DailyGoalCard />

      {/* Main stage: English pack (B) */}
      {pack ? (
        <Link href="/english/today" className="focus-cta">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">
                主任務 · 約 {pack.minutes} 分
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--ink)] sm:text-2xl">
                今日英語套餐
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                L{String(pack.grammar.num).padStart(2, "0")}{" "}
                {pack.grammar.titleZh}
                {pack.reviewCount > 0 ? ` · 到期 ${pack.reviewCount}` : ""}
              </p>
            </div>
            <span className="inline-flex min-h-10 items-center rounded-sm bg-[var(--accent)] px-4 text-sm font-medium text-white">
              開始 →
            </span>
          </div>
        </Link>
      ) : null}

      {/* Secondary: plan as compact dark row */}
      <Link
        href={`/plan/${nextDay.day}`}
        className="flex items-center justify-between gap-3 rounded-sm border border-[var(--ink)] bg-[var(--ink)] px-4 py-3 text-[var(--paper)] transition hover:brightness-110"
      >
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--accent-soft-text)]">
            計畫 · Day {nextDay.day} · {progress.done}/{progress.total}
          </p>
          <p className="mt-0.5 truncate font-[family-name:var(--font-display)] text-lg">
            {nextDay.titleZh}
          </p>
        </div>
        <span className="shrink-0 text-sm text-white/80">進入 →</span>
      </Link>

      {/* Compact secondary actions (A density + B hierarchy) */}
      <div className="space-y-2">
        <Link href={`/speak/${continueSpeak.slug}`} className="row-tap">
          <div className="min-w-0">
            <p className="text-[10px] text-[var(--accent)]">繼續跟讀</p>
            <p className="truncate text-sm font-medium text-[var(--ink)]">
              {continueSpeak.titleZh}
            </p>
          </div>
          <span className="shrink-0 text-xs text-[var(--muted)]">打開</span>
        </Link>
        <Link href="/english/review" className="row-tap">
          <div className="min-w-0">
            <p className="text-[10px] text-[var(--accent)]">英語到期複習</p>
            <p className="truncate text-sm font-medium text-[var(--ink)]">
              {pack && pack.reviewCount > 0
                ? `${pack.reviewCount} 項可練`
                : "目前沒有到期項"}
              {dueCfa > 0 ? ` · CFA ${dueCfa}` : ""}
            </p>
          </div>
          <span className="shrink-0 text-xs text-[var(--muted)]">複習</span>
        </Link>
        {dueCfa > 0 ? (
          <Link href="/vault/practice?mode=recall" className="row-tap">
            <div className="min-w-0">
              <p className="text-[10px] text-[var(--accent)]">CFA 到期</p>
              <p className="text-sm font-medium text-[var(--ink)]">
                {dueCfa} 項 · 聽詞想義
              </p>
            </div>
            <span className="shrink-0 text-xs text-[var(--muted)]">開始</span>
          </Link>
        ) : null}
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-[var(--muted)]">快速入口</h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          <QuickLink href="/rewards" label="獎勵" meta="60 分" />
          <QuickLink href="/vault" label="CFA" meta={`${cfaData.total}`} />
          <QuickLink
            href="/english/grammar"
            label="文法"
            meta={`${grammarData.total}`}
          />
          <QuickLink href="/real-estate" label="房產" meta="RE" />
          <QuickLink href="/speak" label="跟讀" meta={`${speakData.total}`} />
          <QuickLink href="/english" label="句型" meta={`${enData.total}`} />
          <QuickLink
            href="/english/vocab"
            label="詞彙"
            meta={`${vocabData.total}`}
          />
          <QuickLink href="/english/gre" label="GRE" meta="GRE" />
          <QuickLink href="/quiz" label="測驗" meta="40" />
          <QuickLink href="/oral" label="口語" meta="100" />
          <QuickLink href="/plan" label="計畫" meta={`${progress.done}/20`} />
          <QuickLink href="/more" label="更多" meta="…" />
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-[var(--muted)]">掌握度</h2>
        <ProgressSummary cfaIds={cfaIds} enIds={enIds} vocabIds={vocabIds} />
      </section>
    </div>
  );
}

function QuickLink({
  href,
  label,
  meta,
}: {
  href: string;
  label: string;
  meta: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-[3.5rem] flex-col justify-center rounded-sm border border-[var(--line)] bg-[var(--surface)] px-3 py-2 transition hover:border-[var(--accent)]/50"
    >
      <span className="text-sm font-medium text-[var(--ink)]">{label}</span>
      <span className="text-[10px] text-[var(--muted)]">{meta}</span>
    </Link>
  );
}
