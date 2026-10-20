"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { listenAudioPath, type ListenArticle } from "@/lib/listening";
import { speakEnglish, stopSpeaking, type SpeakSpeed } from "@/lib/speech";

const SPEEDS: { id: SpeakSpeed; label: string }[] = [
  { id: "slow", label: "慢" },
  { id: "normal", label: "標準" },
  { id: "fast", label: "快" },
];

type Neighbor = { id: string; titleZh: string } | null;

function spokenLine(block: ListenArticle["blocks"][number]) {
  return block.speaker ? `${block.speaker}. ${block.en}` : block.en;
}

export function ListenArticleClient({
  article,
  prev,
  next,
}: {
  article: ListenArticle;
  prev: Neighbor;
  next: Neighbor;
}) {
  const [showEn, setShowEn] = useState(false);
  const [showZh, setShowZh] = useState(false);
  const [speed, setSpeed] = useState<SpeakSpeed>("normal");
  const [index, setIndex] = useState(0);
  const [ttsOn, setTtsOn] = useState(false);
  const [audioOk, setAudioOk] = useState<Record<string, boolean | null>>({});
  const [activeVoice, setActiveVoice] = useState<string | null>(null);

  const tokenRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const speedRef = useRef(speed);
  const ttsRef = useRef(false);
  const blocksRef = useRef(article.blocks);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const rowRefs = useRef<(HTMLElement | null)[]>([]);

  speedRef.current = speed;
  ttsRef.current = ttsOn;
  blocksRef.current = article.blocks;

  useEffect(() => {
    let cancelled = false;
    const nextState: Record<string, boolean | null> = {};
    for (const voice of article.voices) nextState[voice.id] = null;
    setAudioOk(nextState);
    for (const voice of article.voices) {
      fetch(listenAudioPath(voice.file), { method: "HEAD" })
        .then((r) => {
          if (!cancelled) {
            setAudioOk((cur) => ({ ...cur, [voice.id]: r.ok }));
          }
        })
        .catch(() => {
          if (!cancelled) setAudioOk((cur) => ({ ...cur, [voice.id]: false }));
        });
    }
    return () => {
      cancelled = true;
    };
  }, [article]);

  useEffect(() => {
    if (!ttsOn) return;
    const id = window.setInterval(() => {
      window.speechSynthesis?.resume();
    }, 10000);
    return () => window.clearInterval(id);
  }, [ttsOn]);

  useEffect(() => {
    setIndex(0);
    setShowEn(false);
    setShowZh(false);
    setTtsOn(false);
    setActiveVoice(null);
    return () => {
      tokenRef.current += 1;
      if (timerRef.current != null) window.clearTimeout(timerRef.current);
      stopSpeaking();
      for (const el of Object.values(audioRefs.current)) el?.pause();
    };
  }, [article.id]);

  useEffect(() => {
    const el = rowRefs.current[index];
    el?.scrollIntoView({ block: "nearest" });
  }, [index, showEn, showZh]);

  function clearTimer() {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function pauseVoices() {
    for (const el of Object.values(audioRefs.current)) el?.pause();
    setActiveVoice(null);
  }

  function haltTts() {
    ttsRef.current = false;
    tokenRef.current += 1;
    clearTimer();
    stopSpeaking();
    setTtsOn(false);
  }

  function speakFrom(start: number) {
    pauseVoices();
    const list = blocksRef.current;
    if (!list.length) return;
    const at = Math.min(Math.max(start, 0), list.length - 1);
    const token = ++tokenRef.current;
    ttsRef.current = true;
    setTtsOn(true);
    setIndex(at);
    clearTimer();
    stopSpeaking();
    timerRef.current = window.setTimeout(() => {
      if (token !== tokenRef.current || !ttsRef.current) return;
      const block = blocksRef.current[at];
      if (!block) return;
      speakEnglish(spokenLine(block), {
        speed: speedRef.current,
        onEnd: () => {
          if (token !== tokenRef.current || !ttsRef.current) return;
          if (at + 1 >= blocksRef.current.length) {
            ttsRef.current = false;
            setTtsOn(false);
            return;
          }
          speakFrom(at + 1);
        },
      });
    }, 50);
  }

  function playVoice(id: string) {
    const el = audioRefs.current[id];
    if (!el || !audioOk[id]) return;
    haltTts();
    for (const [otherId, other] of Object.entries(audioRefs.current)) {
      if (otherId !== id) other?.pause();
    }
    if (activeVoice === id && !el.paused) {
      el.pause();
      setActiveVoice(null);
      return;
    }
    void el.play();
    setActiveVoice(id);
  }

  const scriptOpen = showEn || showZh;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/english/listen"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← 聽力練習
        </Link>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
          {article.levelZh} · {article.words} 詞
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          {article.titleZh}
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{article.titleEn}</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--ink)]">
          {article.brief}
        </p>
        <p className="mt-2 text-xs text-[var(--muted)]">
          {article.theme} · {article.focus}
        </p>
      </div>

      <section className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
          電腦語音
        </p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          瀏覽器朗讀英文稿。
          {ttsOn
            ? ` 正在念第 ${index + 1} / ${article.blocks.length} 段。`
            : " 可調慢、標準、快。"}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => (ttsOn ? haltTts() : speakFrom(index))}
            className="inline-flex min-h-12 items-center rounded-sm bg-[var(--ink)] px-5 text-sm text-[var(--paper)]"
          >
            {ttsOn ? "停止電腦語音" : "播放電腦語音"}
          </button>
          {SPEEDS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSpeed(opt.id)}
              className={`inline-flex min-h-12 items-center rounded-sm border px-4 text-sm ${
                speed === opt.id
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)]"
                  : "border-[var(--line)]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
          真人語音
        </p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          兩軌 MP3 放到 <code className="text-[var(--ink)]">web/public/audio/listen/</code>
          。還沒放上時，按鈕會停用。
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {article.voices.map((voice) => {
            const ok = audioOk[voice.id];
            return (
              <div
                key={voice.id}
                className="rounded-sm border border-[var(--line)] p-4"
              >
                <p className="text-sm font-medium text-[var(--ink)]">
                  {voice.label}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  <code>{voice.file}</code>
                  {ok === null
                    ? " · 檢查中"
                    : ok
                      ? " · 已放入"
                      : " · 尚未放入"}
                </p>
                <button
                  type="button"
                  disabled={!ok}
                  onClick={() => playVoice(voice.id)}
                  className="mt-3 inline-flex min-h-12 items-center rounded-sm bg-[var(--ink)] px-4 text-sm text-[var(--paper)] disabled:opacity-40"
                >
                  {activeVoice === voice.id ? "暫停" : `播放${voice.label}`}
                </button>
                <audio
                  ref={(el) => {
                    audioRefs.current[voice.id] = el;
                  }}
                  src={listenAudioPath(voice.file)}
                  preload="none"
                  onEnded={() =>
                    setActiveVoice((cur) => (cur === voice.id ? null : cur))
                  }
                  onPause={() =>
                    setActiveVoice((cur) => (cur === voice.id ? null : cur))
                  }
                />
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowEn((v) => !v)}
          className="inline-flex min-h-12 items-center rounded-sm border border-[var(--line)] px-4 text-sm"
        >
          {showEn ? "蓋住英文" : "顯示英文稿"}
        </button>
        <button
          type="button"
          onClick={() => setShowZh((v) => !v)}
          className="inline-flex min-h-12 items-center rounded-sm border border-[var(--line)] px-4 text-sm"
        >
          {showZh ? "蓋住中文" : "顯示中文翻譯"}
        </button>
      </div>

      {scriptOpen ? (
        <ol className="space-y-3">
          {article.blocks.map((block, i) => {
            const current = i === index && ttsOn;
            return (
              <li key={i}>
                <button
                  type="button"
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                  onClick={() => (ttsOn ? speakFrom(i) : setIndex(i))}
                  className={`w-full scroll-mt-36 rounded-sm border px-4 py-3 text-left ${
                    current
                      ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                      : "border-[var(--line)] bg-[var(--surface)]"
                  }`}
                >
                  <span className="text-xs text-[var(--muted)]">
                    第 {i + 1} 段
                    {block.speaker ? ` · ${block.speaker}` : ""}
                  </span>
                  {showEn ? (
                    <p className="mt-1 text-sm leading-relaxed text-[var(--ink)]">
                      {block.en}
                    </p>
                  ) : null}
                  {showZh ? (
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                      {block.zh}
                    </p>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="text-sm text-[var(--muted)]">
          英文稿和中文翻譯先蓋著。聽完再打開。
        </p>
      )}

      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          聽完再問
        </h2>
        <ol className="space-y-3">
          {article.questions.map((q, i) => (
            <li
              key={i}
              className="rounded-sm border border-[var(--line)] bg-[var(--surface)] px-4 py-3"
            >
              <p className="text-sm text-[var(--ink)]">
                {i + 1}. {q.en}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">{q.zh}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-wrap justify-between gap-3 text-sm">
        {prev ? (
          <Link
            href={`/english/listen/${prev.id}`}
            className="text-[var(--muted)] hover:text-[var(--ink)]"
          >
            ← {prev.id} {prev.titleZh}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/english/listen/${next.id}`}
            className="text-[var(--muted)] hover:text-[var(--ink)]"
          >
            {next.id} {next.titleZh} →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
