"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { SpeakPart4Panel } from "@/components/SpeakPart4Panel";
import { FavoriteButton } from "@/components/FavoriteButton";
import { MasteryControls } from "@/components/MasteryControls";
import { pauseMs, type PatternGap } from "@/lib/patternLoop";
import { setLastSpeak } from "@/lib/session";
import { speakEnglish, stopSpeaking, type SpeakSpeed } from "@/lib/speech";
import type { SpeakArticle } from "@/lib/types";

type Props = {
  article: SpeakArticle;
};

const SPEED_OPTIONS: { id: SpeakSpeed; label: string }[] = [
  { id: "slow", label: "慢" },
  { id: "normal", label: "標準" },
  { id: "fast", label: "快" },
];

const GAP_OPTIONS: { id: PatternGap; label: string }[] = [
  { id: "short", label: "短停" },
  { id: "normal", label: "標準停" },
  { id: "long", label: "長停" },
];

/** English line for TTS — Part 3 may include reply after → */
function segmentSpeakText(en: string): string {
  const line = en.includes("\n→")
    ? en
        .split("\n")
        .map((l) => l.replace(/^→\s*/, "").trim())
        .filter(Boolean)
        .join(". ")
    : en;
  return line.replace(/\s+/g, " ").trim();
}

export function SpeakArticleClient({ article }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [audioOk, setAudioOk] = useState<boolean | null>(null);
  const [activeId, setActiveId] = useState<string | null>(
    article.segments[0]?.id ?? null,
  );
  const [hideEn, setHideEn] = useState(false);
  const [playing, setPlaying] = useState(false);

  const [autoPlaying, setAutoPlaying] = useState(false);
  const [autoIndex, setAutoIndex] = useState(0);
  const [autoPhase, setAutoPhase] = useState<"idle" | "speaking" | "pausing">(
    "idle",
  );
  const [speed, setSpeed] = useState<SpeakSpeed>("normal");
  const [gap, setGap] = useState<PatternGap>("normal");

  const autoPlayingRef = useRef(false);
  const autoIndexRef = useRef(0);
  const tokenRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const speedRef = useRef(speed);
  const gapRef = useRef(gap);

  speedRef.current = speed;
  gapRef.current = gap;
  autoIndexRef.current = autoIndex;

  const segments = article.segments;
  const activeAutoSeg = segments[autoIndex];

  useEffect(() => {
    setLastSpeak(article.slug, article.titleZh);
  }, [article.slug, article.titleZh]);

  useEffect(() => {
    let cancelled = false;
    fetch(article.audioPath, { method: "HEAD" })
      .then((r) => {
        if (!cancelled) setAudioOk(r.ok);
      })
      .catch(() => {
        if (!cancelled) setAudioOk(false);
      });
    return () => {
      cancelled = true;
    };
  }, [article.audioPath]);

  useEffect(() => {
    return () => {
      autoPlayingRef.current = false;
      tokenRef.current += 1;
      if (timerRef.current != null) window.clearTimeout(timerRef.current);
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    if (!autoPlaying) return;
    const el = rowRefs.current[autoIndex];
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [autoIndex, autoPlaying]);

  function clearTimer() {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function haltAuto() {
    autoPlayingRef.current = false;
    tokenRef.current += 1;
    clearTimer();
    stopSpeaking();
    setAutoPlaying(false);
    setAutoPhase("idle");
  }

  function speakAutoAt(i: number) {
    if (!segments.length) return;
    const next = ((i % segments.length) + segments.length) % segments.length;
    const token = ++tokenRef.current;
    clearTimer();
    autoIndexRef.current = next;
    setAutoIndex(next);
    setActiveId(segments[next]?.id ?? null);
    setAutoPhase("speaking");
    stopSpeaking();
    timerRef.current = window.setTimeout(() => {
      if (token !== tokenRef.current || !autoPlayingRef.current) return;
      const seg = segments[next];
      if (!seg) return;
      const text = segmentSpeakText(seg.en);
      speakEnglish(text, {
        speed: speedRef.current,
        onEnd: () => {
          if (token !== tokenRef.current || !autoPlayingRef.current) return;
          setAutoPhase("pausing");
          const wait = pauseMs(text, gapRef.current);
          timerRef.current = window.setTimeout(() => {
            if (token !== tokenRef.current || !autoPlayingRef.current) return;
            if (next + 1 >= segments.length) {
              haltAuto();
              return;
            }
            speakAutoAt(next + 1);
          }, wait);
        },
      });
    }, 40);
  }

  function startAuto(fromIndex?: number) {
    pauseAudio();
    const start =
      typeof fromIndex === "number" ? fromIndex : autoIndexRef.current;
    autoPlayingRef.current = true;
    setAutoPlaying(true);
    speakAutoAt(start);
  }

  function playAudio() {
    haltAuto();
    const el = audioRef.current;
    if (!el || !audioOk) return;
    void el.play();
    setPlaying(true);
  }

  function pauseAudio() {
    audioRef.current?.pause();
    setPlaying(false);
  }

  const pauseHint = useMemo(
    () => pauseMs(segmentSpeakText(activeAutoSeg?.en ?? "hello"), gap),
    [activeAutoSeg, gap],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/speak"
            className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
          >
            ← 跟讀
          </Link>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
            {article.seriesZh}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
            {article.titleZh}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{article.titleEn}</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
            {article.summaryZh}
          </p>
          <p className="mt-2 text-xs text-[var(--muted)]">
            {article.segmentCount} 句 · {article.durationHint} · 音檔{" "}
            <code className="text-[var(--ink)]">{article.audioFile}</code>
            {article.part4 ? " · Part 4 模板 15 句" : ""}
          </p>
        </div>
        <FavoriteButton
          id={`speak:${article.slug}`}
          kind="speak"
          title={article.titleEn}
          subtitle={article.titleZh}
          href={`/speak/${article.slug}`}
        />
      </div>

      <section className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
              真人錄音
            </div>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {audioOk === null
                ? "檢查音檔中…"
                : audioOk
                  ? "已偵測到 MP3，可整段播放跟讀。"
                  : `尚未放置 MP3：請放到 web/public/audio/speak/${article.series}/。單句仍可用喇叭 TTS 預練。`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!audioOk}
              onClick={() => (playing ? pauseAudio() : playAudio())}
              className="inline-flex min-h-12 items-center rounded-sm bg-[var(--ink)] px-5 text-sm text-[var(--paper)] disabled:opacity-40"
            >
              {playing ? "暫停錄音" : "播放整段錄音"}
            </button>
            <button
              type="button"
              onClick={() => setHideEn((v) => !v)}
              className="inline-flex min-h-12 items-center rounded-sm border border-[var(--line)] px-5 text-sm"
            >
              {hideEn ? "顯示英文" : "隱藏英文（對照中文跟讀）"}
            </button>
          </div>
        </div>
        <audio
          ref={audioRef}
          src={article.audioPath}
          className="mt-4 w-full"
          controls={Boolean(audioOk)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
        {!audioOk && (
          <p className="mt-3 rounded-sm bg-[var(--paper)] p-3 text-xs text-[var(--muted)]">
            放置路徑：
            <code className="text-[var(--ink)]">
              web/public/audio/speak/{article.series}/{article.audioFile}
            </code>
          </p>
        )}
      </section>

      {article.lesson ? (
        <section className="rounded-sm border border-[var(--line)] bg-[var(--paper)] p-5 sm:p-6">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
            教學結構
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            {article.lesson.introZh}
          </p>
          <div className="mt-5 space-y-5">
            {article.lesson.blocks.map((block) => (
              <div key={block.titleZh}>
                <h3 className="text-sm font-medium text-[var(--ink)]">
                  Part 1 · {block.titleZh} — 實用片語
                </h3>
                <ul className="mt-2 grid gap-2 sm:grid-cols-3">
                  {block.phrases.map((p) => (
                    <li
                      key={p.en}
                      className="rounded-sm border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm"
                    >
                      <p className="font-medium text-[var(--ink)]">{p.en}</p>
                      <p className="mt-0.5 text-[var(--muted)]">{p.zh}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            跟讀腳本
          </h2>
          <MasteryControls scope="speak" id={article.slug} />
        </div>

        <div className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--accent)]">
                Auto TTS · 英文連續朗讀
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                依序朗讀每句英文，句間留跟讀空檔
                {autoPlaying
                  ? ` · 第 ${autoIndex + 1}/${segments.length} 句 · 約停 ${Math.round(pauseHint / 100) / 10}s`
                  : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  autoPlaying ? haltAuto() : startAuto(autoIndex)
                }
                className="inline-flex min-h-11 items-center rounded-sm bg-[var(--ink)] px-4 text-sm text-[var(--paper)]"
              >
                {autoPlaying ? "停止連續朗讀" : "連續朗讀英文"}
              </button>
              <button
                type="button"
                onClick={() => {
                  haltAuto();
                  setAutoIndex(0);
                  setActiveId(segments[0]?.id ?? null);
                }}
                className="inline-flex min-h-11 items-center rounded-sm border border-[var(--line)] px-4 text-sm"
              >
                回到第 1 句
              </button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-4">
            <label className="text-xs text-[var(--muted)]">
              語速
              <select
                value={speed}
                onChange={(e) => setSpeed(e.target.value as SpeakSpeed)}
                className="ml-2 rounded-sm border border-[var(--line)] bg-[var(--paper)] px-2 py-1 text-sm text-[var(--ink)]"
              >
                {SPEED_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-[var(--muted)]">
              句間空檔
              <select
                value={gap}
                onChange={(e) => setGap(e.target.value as PatternGap)}
                className="ml-2 rounded-sm border border-[var(--line)] bg-[var(--paper)] px-2 py-1 text-sm text-[var(--ink)]"
              >
                {GAP_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-xs text-[var(--muted)]">
              狀態：
              {autoPhase === "idle"
                ? "待命"
                : autoPhase === "speaking"
                  ? "朗讀中"
                  : "跟讀空檔"}
            </p>
          </div>
        </div>

        <ul className="space-y-2">
          {segments.map((seg, idx) => {
            const active = activeId === seg.id;
            const autoHere = autoPlaying && idx === autoIndex;
            const prevGroup = segments[idx - 1]?.group;
            const showGroup = seg.group && seg.group !== prevGroup;
            return (
              <li
                key={seg.id}
                ref={(el) => {
                  rowRefs.current[idx] = el;
                }}
              >
                {showGroup ? (
                  <p className="mb-2 mt-4 first:mt-0 text-xs font-medium uppercase tracking-[0.12em] text-[var(--accent)]">
                    {seg.group}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(seg.id);
                    setAutoIndex(idx);
                    if (autoPlayingRef.current) speakAutoAt(idx);
                  }}
                  className={`flex w-full min-h-14 items-start gap-3 rounded-sm border px-4 py-4 text-left transition ${
                    autoHere
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] ring-1 ring-[var(--accent)]"
                      : active
                        ? "border-[var(--accent)] bg-[var(--accent-soft)]/50"
                        : "border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)]/40"
                  }`}
                >
                  <span className="mt-1 w-8 shrink-0 text-xs text-[var(--muted)]">
                    {idx + 1}
                  </span>
                  <SpeakButton
                    text={segmentSpeakText(seg.en)}
                    label={seg.en}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    {!hideEn ? (
                      <p className="whitespace-pre-line text-base font-medium leading-relaxed text-[var(--ink)]">
                        {seg.en}
                      </p>
                    ) : (
                      <p className="text-base italic text-[var(--muted)]">
                        （英文已隱藏，先看中文再跟讀）
                      </p>
                    )}
                    <p className="mt-1.5 whitespace-pre-line text-base leading-relaxed text-[var(--muted)]">
                      {seg.zh}
                    </p>
                    {seg.contextZh ? (
                      <p className="mt-1.5 text-xs text-[var(--accent)]">
                        情境：{seg.contextZh}
                      </p>
                    ) : null}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {article.part4 ? <SpeakPart4Panel part4={article.part4} /> : null}
    </div>
  );
}
