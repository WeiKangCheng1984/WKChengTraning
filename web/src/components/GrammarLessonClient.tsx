"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FavoriteButton } from "@/components/FavoriteButton";
import { MasteryControls } from "@/components/MasteryControls";
import { SpeakButton } from "@/components/SpeakButton";
import { setLastGrammar } from "@/lib/session";
import { speakEnglish, stopSpeaking } from "@/lib/speech";
import type { GrammarLesson } from "@/lib/types";

type Props = {
  lesson: GrammarLesson;
  prevSlug?: string;
  nextSlug?: string;
};

export function GrammarLessonClient({ lesson, prevSlug, nextSlug }: Props) {
  const [showAnswers, setShowAnswers] = useState(false);
  const [reading, setReading] = useState(false);

  useEffect(() => {
    setLastGrammar(lesson.slug, lesson.titleZh);
  }, [lesson.slug, lesson.titleZh]);

  function playPassage() {
    if (reading) {
      stopSpeaking();
      setReading(false);
      return;
    }
    setReading(true);
    speakEnglish(lesson.passage.en, () => setReading(false));
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/english/grammar"
            className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
          >
            ← 文法與慣用語
          </Link>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
            冊 {lesson.bookId} · {lesson.bookTitle} · Lesson {String(lesson.num).padStart(2, "0")}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
            {lesson.titleZh}
          </h1>
          <p className="mt-1 text-base text-[var(--muted)]">{lesson.titleEn}</p>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--ink)]">
            {lesson.focus}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <FavoriteButton
            id={`grammar:${lesson.slug}`}
            kind="grammar"
            title={lesson.titleEn}
            subtitle={lesson.titleZh}
            href={`/english/grammar/${lesson.slug}`}
          />
          <MasteryControls scope="grammar" id={lesson.slug} />
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          對比
        </h2>
        <div className="overflow-x-auto rounded-sm border border-[var(--line)]">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-[var(--paper)] text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">較不自然／易錯</th>
                <th className="px-4 py-3 font-medium">更自然的美式</th>
                <th className="px-4 py-3 font-medium">說明</th>
              </tr>
            </thead>
            <tbody>
              {lesson.contrasts.map((c, i) => (
                <tr
                  key={i}
                  className="border-t border-[var(--line)] bg-[var(--surface)]"
                >
                  <td className="px-4 py-3 text-[var(--muted)]">{c.bad}</td>
                  <td className="px-4 py-3 text-[var(--ink)]">{c.good}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">{c.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          規則／用法
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-base leading-relaxed text-[var(--ink)]">
          {lesson.rules.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          現代例句
        </h2>
        <ul className="space-y-3">
          {lesson.examples.map((ex, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-sm border border-[var(--line)] bg-[var(--surface)] px-4 py-4"
            >
              <SpeakButton text={ex.en} label={ex.en} size="sm" />
              <div className="min-w-0 flex-1">
                <span className="text-xs uppercase tracking-[0.14em] text-[var(--accent)]">
                  {ex.tag}
                </span>
                <p className="mt-1 text-base font-medium leading-relaxed text-[var(--ink)]">
                  {ex.en}
                </p>
                <p className="mt-1 text-base leading-relaxed text-[var(--muted)]">
                  {ex.zh}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 rounded-sm border border-[var(--ink)] bg-[var(--ink)] px-5 py-6 text-[var(--paper)] sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              跟讀短文
            </h2>
            <p className="mt-1 text-sm text-white/65">
              約 {lesson.passage.words} words · TTS（瀏覽器語音）
            </p>
          </div>
          <button
            type="button"
            onClick={playPassage}
            className="inline-flex min-h-12 items-center rounded-sm bg-[var(--accent)] px-5 text-sm font-medium text-white hover:brightness-110"
          >
            {reading ? "停止" : "TTS 朗讀英文"}
          </button>
        </div>
        <p className="text-base leading-relaxed text-white/95">
          {lesson.passage.en}
        </p>
        <p className="text-base leading-relaxed text-white/70">
          {lesson.passage.zh}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          慣用語包
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {lesson.idioms.map((idm) => (
            <div
              key={idm.phrase}
              className="flex gap-3 rounded-sm border border-[var(--line)] bg-[var(--surface)] px-4 py-4"
            >
              <SpeakButton text={idm.phrase} label={idm.phrase} size="sm" />
              <div>
                <p className="font-medium text-[var(--ink)]">{idm.phrase}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{idm.gloss}</p>
                <p className="mt-1 text-xs text-[var(--accent)]">{idm.domain}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            迷你練習
          </h2>
          <button
            type="button"
            onClick={() => setShowAnswers((v) => !v)}
            className="inline-flex min-h-11 items-center rounded-sm border border-[var(--line)] px-4 text-sm hover:border-[var(--accent)]"
          >
            {showAnswers ? "隱藏簡答" : "顯示簡答"}
          </button>
        </div>
        <ol className="list-decimal space-y-2 pl-5 text-base leading-relaxed text-[var(--ink)]">
          {lesson.practices.map((p, i) => (
            <li key={i}>
              {p}
              {showAnswers && lesson.answers[i] ? (
                <p className="mt-1 text-sm text-[var(--muted)]">
                  → {lesson.answers[i]}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      <nav className="flex flex-wrap justify-between gap-3 border-t border-[var(--line)] pt-6">
        {prevSlug ? (
          <Link
            href={`/english/grammar/${prevSlug}`}
            className="inline-flex min-h-12 items-center text-sm text-[var(--ink)] hover:underline"
          >
            ← 上一課
          </Link>
        ) : (
          <span />
        )}
        {nextSlug ? (
          <Link
            href={`/english/grammar/${nextSlug}`}
            className="inline-flex min-h-12 items-center text-sm text-[var(--ink)] hover:underline"
          >
            下一課 →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
