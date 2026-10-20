"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CopyTextButton } from "@/components/CopyTextButton";
import { SpeakButton } from "@/components/SpeakButton";
import { countWords, fillEssayTemplate } from "@/lib/essay-fill";
import type { EssayTheme } from "@/lib/types";

type Props = {
  theme: EssayTheme;
  themeIndex: number;
  themeTotal: number;
  prevSlug?: string;
  nextSlug?: string;
};

export function EssayThemeClient({
  theme,
  themeIndex,
  themeTotal,
  prevSlug,
  nextSlug,
}: Props) {
  const [scenarioId, setScenarioId] = useState(theme.scenarios[0]?.id ?? "A");
  const [showSlots, setShowSlots] = useState(true);

  const scenario =
    theme.scenarios.find((s) => s.id === scenarioId) ?? theme.scenarios[0];

  const essay = useMemo(
    () => fillEssayTemplate(theme.template.body, scenario?.fills ?? {}),
    [theme.template.body, scenario],
  );

  const words = countWords(essay);
  const paragraphs = essay.split(/\n\n+/).filter(Boolean);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/english/writing"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← 議論文寫作實驗室
        </Link>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
          Theme {theme.id} / {themeTotal} · {theme.titleEn}
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
          {theme.titleZh}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          {theme.guideZh}
        </p>
      </div>

      <section className="space-y-3 rounded-sm border border-[var(--line)] bg-[var(--surface)] p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
          Step · 選實景
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          常考實景 A／B／C
        </h2>
        <p className="text-sm text-[var(--muted)]">
          點選後，下方範文槽位會抽換成該實景用語。
        </p>
        <div className="flex flex-wrap gap-2">
          {theme.scenarios.map((s) => {
            const active = s.id === scenarioId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setScenarioId(s.id)}
                className={`min-h-11 rounded-sm px-4 py-2 text-left text-sm transition ${
                  active
                    ? "bg-[var(--ink)] text-[var(--paper)]"
                    : "border border-[var(--line)] text-[var(--ink)] hover:border-[var(--accent)]"
                }`}
              >
                <span className="font-medium">實景 {s.id}</span>
                <span className={active ? " text-white/80" : " text-[var(--muted)]"}>
                  {" · "}
                  {s.titleZh}
                </span>
              </button>
            );
          })}
        </div>
        {scenario ? (
          <p className="text-xs text-[var(--muted)]">
            {scenario.titleEn}
          </p>
        ) : null}
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
              Slots · 抽換指南
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
              本主題槽位
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowSlots((v) => !v)}
            className="text-sm text-[var(--muted)] underline-offset-2 hover:text-[var(--ink)] hover:underline"
          >
            {showSlots ? "收合" : "展開"}
          </button>
        </div>
        {showSlots ? (
          <ul className="space-y-2">
            {theme.slots.map((slot) => (
              <li
                key={slot.key}
                className="rounded-sm border border-[var(--line)] bg-[var(--paper)] px-4 py-3"
              >
                <p className="text-xs tracking-wide text-[var(--accent)]">
                  [{slot.key}] · {slot.labelZh} / {slot.labelEn}
                </p>
                <p className="mt-1 text-sm text-[var(--ink)]">
                  {scenario?.fills[slot.key] ?? "—"}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">{slot.hintZh}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
              Model essay · ~{theme.template.wordCountApprox} words
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
              示範範文
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              實景 {scenario?.id} · 目前約 {words} 字
              {words >= 350 && words <= 400 ? " · 落在 350–400 目標區" : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SpeakButton text={essay} label="朗讀全文" size="sm" />
            <CopyTextButton text={essay} label="複製全文" />
          </div>
        </div>

        <article className="space-y-4 rounded-sm border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-[15px] leading-relaxed text-[var(--ink)] sm:text-base"
            >
              {p}
            </p>
          ))}
        </article>

        <p className="text-xs leading-relaxed text-[var(--muted)]">
          教學提示：複製後可再微調第二段具體例子與第四段解方細節，保持四段架構與字數區間即可。
        </p>
      </section>

      <nav className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-6">
        {prevSlug ? (
          <Link
            href={`/english/writing/${prevSlug}`}
            className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
          >
            ← 上一主題
          </Link>
        ) : (
          <span />
        )}
        <span className="text-xs text-[var(--muted)]">
          {themeIndex + 1} / {themeTotal}
        </span>
        {nextSlug ? (
          <Link
            href={`/english/writing/${nextSlug}`}
            className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
          >
            下一主題 →
          </Link>
        ) : (
          <Link
            href="/english/writing"
            className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
          >
            回寫作首頁 →
          </Link>
        )}
      </nav>
    </div>
  );
}
