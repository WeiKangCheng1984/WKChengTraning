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
          Season {lesson.season} · {lesson.seasonTitleEn} · {lesson.minutes}{" "}
          min
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          L{String(lesson.id).padStart(2, "0")} · {lesson.topicZh}
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{lesson.topicEn}</p>
      </div>

      <section className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-5">
        <h2 className="text-sm font-medium text-[var(--ink)]">怎麼練</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[var(--muted)]">
          <li>複製「系統提示」貼到 ChatGPT／Claude 等，送出。</li>
          <li>等 AI 回 Ready 後，再貼「今日模組卡」。</li>
          <li>用英文聊 15–20 分，盡量用到 3 個目標表達。</li>
          <li>輸入 <code className="text-[var(--ink)]">FEEDBACK</code> 看繁中檢討，完成回測重講。</li>
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
            3 Target Expressions
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
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
            Target Pattern
          </p>
          <p className="mt-1 font-medium">{lesson.pattern.pattern}</p>
          <p className="mt-1 text-[var(--muted)]">{lesson.pattern.example}</p>
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
