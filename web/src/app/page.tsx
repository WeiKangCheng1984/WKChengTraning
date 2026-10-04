"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProgressSummary } from "@/components/ProgressSummary";
import { PLAN_DAYS, planProgress } from "@/lib/plan";
import { onStorageChange } from "@/lib/persist";
import cfa from "@/data/cfa.json";
import english from "@/data/english.json";
import speak from "@/data/speak.json";
import type { CfaData, EnglishData, SpeakData } from "@/lib/types";

const cfaData = cfa as CfaData;
const enData = english as EnglishData;
const speakData = speak as SpeakData;

export default function HomePage() {
  const cfaIds = cfaData.subjects.flatMap((s) => s.terms.map((t) => t.id));
  const enIds = enData.categories.flatMap((c) => c.items.map((i) => i.id));
  const [progress, setProgress] = useState({ done: 0, total: 20, pct: 0 });

  useEffect(() => {
    const sync = () => setProgress(planProgress());
    sync();
    return onStorageChange(sync);
  }, []);

  const nextDay =
    PLAN_DAYS.find((d) => d.day === progress.done + 1) ?? PLAN_DAYS[0];

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-sm border border-[var(--line)] bg-[var(--ink)] px-6 py-14 text-[var(--paper)] sm:px-12 sm:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(135deg, transparent 40%, rgba(154,123,79,0.25) 100%)",
          }}
        />
        <div className="relative max-w-2xl">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-soft-text)]">
            Daily Cadence
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight sm:text-5xl">
            把 CFA 名詞與英語句型練成同一套說話節奏
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">
            借鏡口說節奏：每日打包術語＋句型、三模式練習、跨層用法說明。GRE
            式間隔評分留在本機，不必卡在某一天。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/plan/${nextDay.day}`}
              className="rounded-sm bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
            >
              進入第 {nextDay.day} 天：{nextDay.titleZh}
            </Link>
            <Link
              href="/search"
              className="rounded-sm border border-white/25 px-5 py-2.5 text-sm text-white transition hover:bg-white/10"
            >
              搜尋任何一詞
            </Link>
          </div>
          <div className="mt-8 max-w-sm">
            <div className="flex justify-between text-xs text-white/60">
              <span>進度</span>
              <span>
                {progress.done} / {progress.total}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full bg-[var(--accent)]"
                style={{ width: `${progress.pct}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-white/65">{nextDay.blurb}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <ModuleCard
          eyebrow="單字"
          title="CFA Vault"
          body={`三模式：聽詞想義、看義選詞、例句填空。${cfaData.total} 詞／${cfaData.subjects.length} 科。`}
          href="/vault"
          meta="MODE 1–3"
        />
        <ModuleCard
          eyebrow="劇本"
          title="20 天計畫"
          body="每天打包一科 CFA＋一類英語，含跨層說明與完成標記。"
          href="/plan"
          meta={`${progress.done}/${progress.total}`}
        />
        <ModuleCard
          eyebrow="積木"
          title="English Drill"
          body={`句型與片語組裝練習，生活／工作例句跟讀。${enData.total} 組。`}
          href="/english"
          meta={`${enData.categories.length} 類`}
        />
        <ModuleCard
          eyebrow="跟讀"
          title="Speak Track"
          body={`常用口語 ${speakData.total} 篇短文＋真人錄音跟讀。音檔放到 public/audio/speak/common/。`}
          href="/speak"
          meta={`${speakData.total} 篇`}
        />
        <ModuleCard
          eyebrow="收藏"
          title="搜尋與收藏"
          body="跨庫搜尋術語／句型／跟讀腳本；收藏存在這個瀏覽器。"
          href="/saved"
          meta="本機"
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            本機掌握度
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            練習時的「再練／記得／很熟」會更新掌握度與複習間隔。
          </p>
        </div>
        <ProgressSummary cfaIds={cfaIds} enIds={enIds} />
      </section>
    </div>
  );
}

function ModuleCard({
  eyebrow,
  title,
  body,
  href,
  meta,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  meta: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-sm border border-[var(--line)] bg-[var(--surface)] p-6 transition hover:border-[var(--accent)]/50 hover:shadow-[0_12px_40px_rgba(12,26,46,0.06)]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
          {eyebrow}
        </span>
        <span className="text-xs text-[var(--muted)]">{meta}</span>
      </div>
      <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
      <span className="mt-5 inline-block text-sm text-[var(--ink)] underline-offset-4 group-hover:underline">
        開始 →
      </span>
    </Link>
  );
}
