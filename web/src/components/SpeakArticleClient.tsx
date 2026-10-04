"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import { MasteryControls } from "@/components/MasteryControls";
import { setLastSpeak } from "@/lib/session";
import type { SpeakArticle } from "@/lib/types";

type Props = {
  article: SpeakArticle;
};

export function SpeakArticleClient({ article }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioOk, setAudioOk] = useState<boolean | null>(null);
  const [activeId, setActiveId] = useState<string | null>(
    article.segments[0]?.id ?? null,
  );
  const [hideEn, setHideEn] = useState(false);
  const [playing, setPlaying] = useState(false);

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

  function playAudio() {
    const el = audioRef.current;
    if (!el || !audioOk) return;
    void el.play();
    setPlaying(true);
  }

  function pauseAudio() {
    audioRef.current?.pause();
    setPlaying(false);
  }

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
                  : "尚未放置 MP3：請放到 web/public/audio/speak/common/。單句仍可用喇叭 TTS 預練。"}
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
              web/public/audio/speak/common/{article.audioFile}
            </code>
          </p>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            跟讀腳本
          </h2>
          <MasteryControls scope="speak" id={article.slug} />
        </div>
        <ul className="space-y-2">
          {article.segments.map((seg, idx) => {
            const active = activeId === seg.id;
            return (
              <li key={seg.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(seg.id)}
                  className={`flex w-full min-h-14 items-start gap-3 rounded-sm border px-4 py-4 text-left transition ${
                    active
                      ? "border-[var(--accent)] bg-[var(--accent-soft)]/50"
                      : "border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)]/40"
                  }`}
                >
                  <span className="mt-1 w-8 shrink-0 text-xs text-[var(--muted)]">
                    {idx + 1}
                  </span>
                  <SpeakButton text={seg.en} label={seg.en} size="sm" />
                  <div className="min-w-0 flex-1">
                    {!hideEn ? (
                      <p className="text-base font-medium leading-relaxed text-[var(--ink)]">
                        {seg.en}
                      </p>
                    ) : (
                      <p className="text-base italic text-[var(--muted)]">
                        （英文已隱藏，先看中文再跟讀）
                      </p>
                    )}
                    <p className="mt-1.5 text-base leading-relaxed text-[var(--muted)]">
                      {seg.zh}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
