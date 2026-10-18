"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CopyTextButton } from "@/components/CopyTextButton";
import { SpeakButton } from "@/components/SpeakButton";
import {
  COACH_SYSTEM_PROMPT,
  formatModuleCard,
  type CoachLesson,
} from "@/lib/coachPrompt";
import {
  isCoachLessonDone,
  markCoachLessonDone,
  unmarkCoachLessonDone,
} from "@/lib/coachProgress";
import { onStorageChange } from "@/lib/persist";

type Props = {
  lesson: CoachLesson;
  prevSlug: string | null;
  nextSlug: string | null;
};

const FLOW = [
  { key: "A", title: "開場問候", hint: "~1 分" },
  { key: "B", title: "開啟話題", hint: "~2 分" },
  { key: "C", title: "句詞練習＋即時修潤", hint: "~5–7 分" },
  { key: "D", title: "我問你五題", hint: "~4–5 分" },
  { key: "E", title: "你問我三題", hint: "~3–4 分" },
  { key: "F", title: "觀點彙整與比較", hint: "~2 分" },
  { key: "G", title: "結論收尾", hint: "~1 分" },
];

export function CoachLessonClient({ lesson, prevSlug, nextSlug }: Props) {
  const [done, setDone] = useState(false);
  const moduleCard = formatModuleCard(lesson);

  useEffect(() => {
    const sync = () => setDone(isCoachLessonDone(lesson.id));
    sync();
    return onStorageChange(sync);
  }, [lesson.id]);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/english/coach"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← AI 口語陪練 60 堂
        </Link>
        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
          Season {lesson.season} · {lesson.seasonTitleEn} · {lesson.domain} ·{" "}
          {lesson.minutes} min
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          L{String(lesson.id).padStart(2, "0")} · {lesson.topicZh}
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{lesson.topicEn}</p>
      </div>

      <section className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-5">
        <h2 className="text-sm font-medium text-[var(--ink)]">怎麼練（15–20 分）</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[var(--muted)]">
          <li>複製「系統提示」貼到 AI，送出，等 Ready。</li>
          <li>再貼「今日模組卡」，從開場問候開始英文對話。</li>
          <li>階段 C 請 AI 邊聊邊修潤；階段 D 問完五題；請 AI 再問你三題。</li>
          <li>聽觀點比較與結論收尾。可用 <code className="text-[var(--ink)]">NEXT</code>／
            <code className="text-[var(--ink)]">WRAP</code>。
          </li>
        </ol>
        <div className="mt-4 flex flex-wrap gap-2">
          <CopyTextButton
            text={COACH_SYSTEM_PROMPT}
            label="複製系統提示"
            className="inline-flex min-h-10 items-center rounded-lg bg-[var(--ink)] px-4 text-sm text-[var(--paper)]"
          />
          <CopyTextButton text={moduleCard} label="複製今日模組卡" />
          <Link
            href={lesson.sourceHref}
            className="inline-flex min-h-10 items-center rounded-lg border border-[var(--line)] px-4 text-sm text-[var(--sky)] hover:underline"
          >
            預熱素材 · {lesson.sourceLabel}
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-medium text-[var(--ink)]">流程 checkpoint</h2>
        <ol className="grid gap-1.5 sm:grid-cols-2">
          {FLOW.map((f) => (
            <li
              key={f.key}
              className="flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-sm"
            >
              <span className="font-medium text-[var(--accent)]">{f.key}</span>
              <span className="text-[var(--ink)]">{f.title}</span>
              <span className="ml-auto text-[10px] text-[var(--muted)]">
                {f.hint}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          今日模組
        </h2>
        <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper)] p-4 text-sm leading-relaxed text-[var(--ink)]">
          <p>
            <span className="text-[var(--muted)]">情境：</span>
            {lesson.scenario}
          </p>
          <p className="mt-2">
            <span className="text-[var(--muted)]">AI 角色：</span>
            {lesson.aiRole}
          </p>

          <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
            Target Words / Phrases
          </p>
          <ul className="mt-2 space-y-2">
            {lesson.targets.map((t) => (
              <li
                key={t}
                className="flex items-start gap-2 rounded-sm border border-[var(--line)] bg-[var(--surface)] p-3"
              >
                <SpeakButton text={t} label={t.slice(0, 32)} size="sm" />
                <span className="min-w-0 flex-1">{t}</span>
              </li>
            ))}
          </ul>

          {lesson.targetSentences?.length ? (
            <>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
                Target Sentences（階段 C）
              </p>
              <ul className="mt-2 space-y-2">
                {lesson.targetSentences.map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-2 rounded-sm border border-[var(--line)] bg-[var(--surface)] p-3"
                  >
                    <SpeakButton text={t} label={t.slice(0, 32)} size="sm" />
                    <span className="min-w-0 flex-1">{t}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
            My 5 Questions（階段 D 問 AI）
          </p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[var(--muted)]">
            {(lesson.myFiveQuestions || []).map((q) => (
              <li key={q} className="text-[var(--ink)]">
                {q}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() =>
            done
              ? unmarkCoachLessonDone(lesson.id)
              : markCoachLessonDone(lesson.id)
          }
          className={`inline-flex min-h-10 items-center rounded-lg px-4 text-sm ${
            done
              ? "border border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)]"
              : "bg-[var(--accent)] text-white"
          }`}
        >
          {done ? "已練完（點擊取消）" : "標記本堂已練完"}
        </button>
        {prevSlug ? (
          <Link
            href={`/english/coach/${prevSlug}`}
            className="inline-flex min-h-10 items-center rounded-lg border border-[var(--line)] px-4 text-sm"
          >
            ← 上一堂
          </Link>
        ) : null}
        {nextSlug ? (
          <Link
            href={`/english/coach/${nextSlug}`}
            className="inline-flex min-h-10 items-center rounded-lg border border-[var(--line)] px-4 text-sm"
          >
            下一堂 →
          </Link>
        ) : null}
      </section>
    </div>
  );
}
