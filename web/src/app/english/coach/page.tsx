"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CuteIcon } from "@/components/CuteIcon";
import { CopyTextButton } from "@/components/CopyTextButton";
import coach from "@/data/coach-lessons.json";
import { COACH_SYSTEM_PROMPT, type CoachLessonsData } from "@/lib/coachPrompt";
import {
  coachProgressStats,
  isCoachLessonDone,
} from "@/lib/coachProgress";
import { onStorageChange } from "@/lib/persist";

const data = coach as CoachLessonsData;

export default function CoachIndexPage() {
  const [tick, setTick] = useState(0);
  const [stats, setStats] = useState({ done: 0, total: data.total });

  useEffect(() => {
    const sync = () => {
      setTick((t) => t + 1);
      setStats(coachProgressStats(data.total));
    };
    sync();
    return onStorageChange(sync);
  }, []);

  void tick;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/english"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← English
        </Link>
        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium tracking-[0.18em] text-[var(--accent)]">
          <CuteIcon name="mic" className="text-sm" />
          AI Coach · 60 lessons
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          AI 口語陪練 60 堂
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          每堂 15–20
          分：把系統提示與模組卡貼到外部 AI，先自然對話，再輸入{" "}
          <code className="text-[var(--ink)]">FEEDBACK</code>{" "}
          取得繁中檢討。素材來自站內風格句、會話、句型與 F1 跟讀。
        </p>
        <p className="mt-2 text-sm text-[var(--ink)]">
          進度 <strong>{stats.done}</strong> / {stats.total} 堂
        </p>
        <div className="mt-4">
          <CopyTextButton
            text={COACH_SYSTEM_PROMPT}
            label="複製通用系統提示"
            className="inline-flex min-h-10 items-center rounded-lg bg-[var(--ink)] px-4 text-sm text-[var(--paper)]"
          />
        </div>
      </div>

      {data.seasons.map((season) => {
        const lessons = data.lessons.filter((l) => l.season === season.id);
        return (
          <section key={season.id} className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
                Season {season.id} · {season.titleEn}
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
                {season.titleZh}
              </h2>
              <p className="text-xs text-[var(--muted)]">
                L{String(season.lessons[0]).padStart(2, "0")}–
                {String(season.lessons[1]).padStart(2, "0")}
              </p>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {lessons.map((l) => {
                const done = isCoachLessonDone(l.id);
                return (
                  <li key={l.slug}>
                    <Link
                      href={`/english/coach/${l.slug}`}
                      className={`block rounded-[var(--radius)] border px-4 py-3 transition hover:border-[var(--accent)] ${
                        done
                          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                          : "border-[var(--line)] bg-[var(--surface)]"
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs text-[var(--muted)]">
                          L{String(l.id).padStart(2, "0")}
                          {done ? " · 已練" : ""}
                        </span>
                        <span className="text-[10px] text-[var(--muted)]">
                          {l.minutes} 分
                        </span>
                      </div>
                      <p className="mt-1 font-medium text-[var(--ink)]">
                        {l.topicZh}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--muted)]">
                        {l.topicEn}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
