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
import type { CfaData, EnglishData, GrammarData, SpeakData } from "@/lib/types";

const cfaData = cfa as CfaData;
const enData = english as EnglishData;
const grammarData = grammar as GrammarData;
const speakData = speak as SpeakData;

export default function HomePage() {
  const cfaIds = useMemo(
    () => cfaData.subjects.flatMap((s) => s.terms.map((t) => t.id)),
    [],
  );
  const enIds = useMemo(
    () => enData.categories.flatMap((c) => c.items.map((i) => i.id)),
    [],
  );

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
        countScheduledDue(
          cfaIds.map((id) => ({ scope: "cfa" as const, id })),
        ),
      );
      setPack(buildEnglishPack(grammarData, speakData, enData));
      const s = getSession();
      setLastSpeak({ slug: s.lastSpeakSlug, title: s.lastSpeakTitle });
    };
    sync();
    return onStorageChange(sync);
  }, [cfaIds, enIds]);

  const nextDay =
    PLAN_DAYS.find((d) => d.day === progress.done + 1) ?? PLAN_DAYS[0];
  const continueSpeak =
    speakData.articles.find((a) => a.slug === lastSpeak.slug) ??
    speakData.articles[0];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "早安" : hour < 18 ? "午安" : "晚安";

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="text-sm text-[var(--muted)]">{greeting}</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
          今日
        </h1>
        <p className="text-sm text-[var(--muted)] sm:text-base">
          CFA · English · Real Estate · Lifestyle
        </p>
      </section>

      <DailyGoalCard />

      {/* English pack — P0 */}
      {pack ? (
        <Link
          href="/english/today"
          className="block rounded-sm border border-[var(--accent)] bg-[var(--accent-soft)]/40 px-5 py-6 transition hover:border-[var(--accent)] sm:px-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
                今日英語套餐 · 約 {pack.minutes} 分
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)] sm:text-3xl">
                文法 → 跟讀 → 句型 → 複習
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                現在：L{String(pack.grammar.num).padStart(2, "0")}{" "}
                {pack.grammar.titleZh}
                {pack.reviewCount > 0
                  ? ` · ${pack.reviewCount} 項英語到期`
                  : ""}
              </p>
            </div>
            <span className="inline-flex min-h-12 items-center rounded-sm bg-[var(--accent)] px-5 text-sm font-medium text-white">
              開始套餐 →
            </span>
          </div>
        </Link>
      ) : null}

      {/* Primary CTA — Day plan */}
      <Link
        href={`/plan/${nextDay.day}`}
        className="block rounded-sm border border-[var(--ink)] bg-[var(--ink)] px-5 py-6 text-[var(--paper)] transition hover:brightness-110 sm:px-8 sm:py-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent-soft-text)]">
              今日計畫 · Day {nextDay.day}
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl sm:text-3xl">
              {nextDay.titleZh}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              {nextDay.blurb}
            </p>
          </div>
          <span className="inline-flex min-h-12 items-center rounded-sm bg-[var(--accent)] px-5 text-sm font-medium text-white">
            開始今天 →
          </span>
        </div>
        <div className="mt-6">
          <div className="flex justify-between text-xs text-white/55">
            <span>20 天進度</span>
            <span>
              {progress.done} / {progress.total}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full bg-[var(--accent)]"
              style={{ width: `${progress.pct}%` }}
            />
          </div>
        </div>
      </Link>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href={`/speak/${continueSpeak.slug}`}
          className="card-tap flex flex-col justify-between"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
              繼續跟讀
            </p>
            <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
              {continueSpeak.titleZh}
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {lastSpeak.slug
                ? "上次練習到這裡"
                : `${continueSpeak.segmentCount} 句 · ${continueSpeak.durationHint}`}
            </p>
          </div>
          <span className="mt-4 text-sm text-[var(--ink)]">打開腳本 →</span>
        </Link>

        <Link
          href="/english/review"
          className="card-tap flex flex-col justify-between"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
              英語到期複習
            </p>
            <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
              {pack && pack.reviewCount > 0
                ? `${pack.reviewCount} 項可練`
                : "沒有到期項"}
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              文法＋跟讀＋句型
              {dueCfa > 0 ? ` · CFA 另有 ${dueCfa} 項` : ""}
            </p>
          </div>
          <span className="mt-4 text-sm text-[var(--ink)]">開始複習 →</span>
        </Link>
      </div>

      {dueCfa > 0 ? (
        <Link
          href="/vault/practice?mode=recall"
          className="block text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          CFA 到期 {dueCfa} 項 → 聽詞想義
        </Link>
      ) : null}

      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          快速入口
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <QuickLink href="/rewards" label="獎勵" meta="每日 60 分" />
          <QuickLink href="/vault" label="CFA" meta={`${cfaData.total} 詞`} />
          <QuickLink
            href="/english/today"
            label="英語套餐"
            meta={`${pack?.minutes ?? 20} 分`}
          />
          <QuickLink
            href="/english/grammar"
            label="文法"
            meta={`${grammarData.total} 課`}
          />
          <QuickLink
            href="/real-estate"
            label="Real Estate"
            meta="術語＋句子"
          />
          <QuickLink href="/speak" label="跟讀" meta={`${speakData.total} 篇`} />
          <QuickLink href="/plan" label="計畫" meta={`${progress.done}/20`} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          本機掌握度
        </h2>
        <ProgressSummary cfaIds={cfaIds} enIds={enIds} />
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
      className="flex min-h-20 flex-col justify-center rounded-sm border border-[var(--line)] bg-[var(--surface)] px-4 py-4 transition hover:border-[var(--accent)]/50"
    >
      <span className="font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
        {label}
      </span>
      <span className="mt-1 text-xs text-[var(--muted)]">{meta}</span>
    </Link>
  );
}
