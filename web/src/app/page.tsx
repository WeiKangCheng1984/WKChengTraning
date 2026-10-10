"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ComponentProps } from "react";
import { CuteIcon } from "@/components/CuteIcon";
import { ProgressSummary } from "@/components/ProgressSummary";
import { StreakCard } from "@/components/StreakCard";
import { todayUnitSummary } from "@/lib/dailyUnitProgress";
import { englishReviewKeys } from "@/lib/englishToday";
import { onStorageChange } from "@/lib/persist";
import { getSession } from "@/lib/session";
import { countScheduledDue } from "@/lib/srs";
import cfa from "@/data/cfa.json";
import english from "@/data/english.json";
import grammar from "@/data/grammar.json";
import speak from "@/data/speak.json";
import type {
  CfaData,
  EnglishData,
  GrammarData,
  SpeakData,
} from "@/lib/types";

const cfaData = cfa as CfaData;
const enData = english as EnglishData;
const grammarData = grammar as GrammarData;
const speakData = speak as SpeakData;

export default function HomePage() {
  const cfaIds = useMemo(
    () => cfaData.subjects.flatMap((s) => s.terms.map((t) => t.id)),
    [],
  );

  const [dueCfa, setDueCfa] = useState(0);
  const [dueEn, setDueEn] = useState(0);
  const [daily, setDaily] = useState<ReturnType<typeof todayUnitSummary> | null>(
    null,
  );
  const [lastSpeak, setLastSpeak] = useState<{
    slug?: string;
    title?: string;
  }>({});

  useEffect(() => {
    const sync = () => {
      setDueCfa(
        countScheduledDue(cfaIds.map((id) => ({ scope: "cfa" as const, id }))),
      );
      setDueEn(
        countScheduledDue(englishReviewKeys(grammarData, speakData, enData)),
      );
      setDaily(todayUnitSummary());
      const s = getSession();
      setLastSpeak({ slug: s.lastSpeakSlug, title: s.lastSpeakTitle });
    };
    sync();
    return onStorageChange(sync);
  }, [cfaIds]);

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
          <p className="flex items-center gap-1 text-xs text-[var(--muted)]">
            <CuteIcon name="sun" className="text-sm" />
            {greeting}
          </p>
          <h1 className="mt-0.5 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)] sm:text-3xl">
            今日
          </h1>
        </div>
        <p className="max-w-[14rem] text-right text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
          微課打卡 · CFA · 複習
        </p>
      </section>

      <StreakCard />

      {daily ? (
        <Link href="/english/today" className="focus-cta">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[10px] font-medium tracking-[0.18em] text-[var(--accent)]">
                <CuteIcon name="rocket" className="text-sm" />
                主任務 · Day {daily.programDay}/30 · 約{" "}
                {daily.main.estimatedMinutes} 分
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--ink)] sm:text-2xl">
                今日英語微課
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {daily.main.titleZh}
                {daily.doneCount > 0
                  ? ` · 今日已練 ${daily.doneCount} 單元`
                  : " · 完成主單元即可打卡"}
              </p>
            </div>
            <span className="inline-flex min-h-10 items-center gap-1 rounded-lg bg-[var(--accent)] px-4 text-sm font-medium text-white">
              {daily.mainDone ? "加練" : "開始"}{" "}
              <CuteIcon name="spark" className="text-sm" />
            </span>
          </div>
        </Link>
      ) : null}

      <div className="space-y-2">
        <Link href={`/speak/${continueSpeak.slug}`} className="row-tap">
          <div className="flex min-w-0 items-center gap-2">
            <CuteIcon name="mic" />
            <div className="min-w-0">
              <p className="text-[10px] text-[var(--accent)]">繼續跟讀</p>
              <p className="truncate text-sm font-medium text-[var(--ink)]">
                {continueSpeak.titleZh}
              </p>
            </div>
          </div>
          <span className="shrink-0 text-xs text-[var(--muted)]">打開</span>
        </Link>
        <Link href="/english/review" className="row-tap">
          <div className="flex min-w-0 items-center gap-2">
            <CuteIcon name="pencil" />
            <div className="min-w-0">
              <p className="text-[10px] text-[var(--accent)]">英語到期複習</p>
              <p className="truncate text-sm font-medium text-[var(--ink)]">
                {dueEn > 0 ? `${dueEn} 項可練` : "目前沒有到期項"}
                {dueCfa > 0 ? ` · CFA ${dueCfa}` : ""}
              </p>
            </div>
          </div>
          <span className="shrink-0 text-xs text-[var(--muted)]">複習</span>
        </Link>
        {dueCfa > 0 ? (
          <Link href="/vault/practice?mode=recall" className="row-tap">
            <div className="flex min-w-0 items-center gap-2">
              <CuteIcon name="vault" />
              <div className="min-w-0">
                <p className="text-[10px] text-[var(--accent)]">CFA 到期</p>
                <p className="text-sm font-medium text-[var(--ink)]">
                  {dueCfa} 項 · 聽詞想義
                </p>
              </div>
            </div>
            <span className="shrink-0 text-xs text-[var(--muted)]">開始</span>
          </Link>
        ) : null}
      </div>

      <section className="space-y-2">
        <h2 className="flex items-center gap-1.5 text-sm font-medium text-[var(--muted)]">
          <CuteIcon name="heart" className="text-sm" />
          快速入口
        </h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          <QuickLink href="/english/today" label="微課" meta="Day" icon="rocket" />
          <QuickLink href="/vault" label="CFA" meta={`${cfaData.total}`} icon="vault" />
          <QuickLink href="/english" label="英語" meta="庫" icon="book" />
          <QuickLink href="/quiz" label="題庫" meta="cloze" icon="pencil" />
          <QuickLink href="/oral" label="口語" meta="說" icon="mic" />
          <QuickLink href="/speak" label="跟讀" meta="聽" icon="ear" />
          <QuickLink href="/rewards" label="打卡" meta="streak" icon="fire" />
          <QuickLink href="/search" label="搜尋" meta="找" icon="spark" />
        </div>
      </section>

      <ProgressSummary
        cfaIds={cfaIds}
        enIds={enData.categories.flatMap((c) => c.items.map((i) => i.id))}
      />
    </div>
  );
}

function QuickLink({
  href,
  label,
  meta,
  icon,
}: {
  href: string;
  label: string;
  meta: string;
  icon: ComponentProps<typeof CuteIcon>["name"];
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] px-2 py-3 text-center transition hover:border-[var(--accent)]"
    >
      <CuteIcon name={icon} className="text-xl" />
      <span className="text-xs font-medium text-[var(--ink)]">{label}</span>
      <span className="text-[10px] text-[var(--muted)]">{meta}</span>
    </Link>
  );
}
