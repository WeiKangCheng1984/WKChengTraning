"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { speakEnglish, stopSpeaking } from "@/lib/speech";
import {
  createRecognizer,
  isSpeechRecognitionSupported,
} from "@/lib/speechRecognition";
import { scoreOral, type OralScore } from "@/lib/oralScore";
import {
  getOralUnitResult,
  saveOralSentence,
} from "@/lib/oralProgress";
import type { OralUnit } from "@/lib/types";

type Props = {
  unit: OralUnit;
  nextSlug?: string | null;
};

export function OralUnitClient({ unit, nextSlug = null }: Props) {
  const [index, setIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const [last, setLast] = useState<OralScore | null>(null);
  const [supported, setSupported] = useState(true);
  const [avg, setAvg] = useState<number | null>(null);
  const [doneCount, setDoneCount] = useState(0);
  const recRef = useRef<ReturnType<typeof createRecognizer>>(null);

  const sentence = unit.sentences[index];
  const total = unit.sentences.length;

  useEffect(() => {
    setSupported(isSpeechRecognitionSupported());
    const r = getOralUnitResult(unit.slug);
    if (r) {
      setAvg(r.avgScore);
      setDoneCount(r.doneCount);
    }
  }, [unit.slug]);

  useEffect(() => {
    setLast(null);
    setError("");
    stopSpeaking();
    recRef.current?.abort?.();
    setListening(false);
  }, [index, unit.slug]);

  useEffect(() => {
    return () => {
      stopSpeaking();
      recRef.current?.abort?.();
    };
  }, []);

  function startListen() {
    setError("");
    setLast(null);
    stopSpeaking();
    if (!isSpeechRecognitionSupported()) {
      setError("此瀏覽器不支援語音辨識，請改用 Chrome 或 Edge。");
      return;
    }
    const rec = createRecognizer({
      lang: "en-US",
      onResult: (r) => {
        const scored = scoreOral(sentence.en, r.transcript);
        setLast(scored);
        const saved = saveOralSentence(unit.slug, total, {
          sentenceId: sentence.id,
          score: scored.score,
          heard: scored.heard,
          at: Date.now(),
        });
        setAvg(saved.avgScore);
        setDoneCount(saved.doneCount);
      },
      onError: (msg) => {
        if (msg !== "已取消辨識。") setError(msg);
        setListening(false);
      },
      onEnd: () => setListening(false),
    });
    if (!rec) {
      setError("無法啟動語音辨識。");
      return;
    }
    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      setError("無法開始錄音，請檢查麥克風權限。");
      setListening(false);
    }
  }

  function stopListen() {
    try {
      recRef.current?.stop();
    } catch {
      /* ignore */
    }
    setListening(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/oral"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← 口語練習
        </Link>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
          Oral {unit.num.toString().padStart(2, "0")} · Series {unit.series}
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          {unit.titleZh}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {unit.blurb}
          {avg !== null ? ` · 單元均分 ${avg}%（${doneCount}/${total}）` : ""}
        </p>
      </div>

      {!supported ? (
        <p className="rounded-sm border border-[var(--line)] bg-[var(--paper)] p-4 text-sm text-[var(--muted)]">
          語音辨識需 Chrome／Edge，並允許麥克風。你仍可用「聽示範」練習跟讀。
        </p>
      ) : (
        <p className="text-xs text-[var(--muted)]">
          Phase A：瀏覽器語音辨識＋逐詞比對。建議安靜環境；辨識可能經瀏覽器雲端處理。
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[var(--muted)]">
        <span>
          第 {index + 1} / {total} 句
        </span>
        <div className="flex gap-1">
          {unit.sentences.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full ${
                i === index
                  ? "bg-[var(--accent)]"
                  : "bg-[var(--line)] hover:bg-[var(--muted)]"
              }`}
              aria-label={`第 ${i + 1} 句`}
            />
          ))}
        </div>
      </div>

      <section className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-7">
        <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
          Target sentence · {sentence.source}
        </p>
        <p className="mt-3 font-[family-name:var(--font-display)] text-2xl leading-snug text-[var(--ink)] sm:text-3xl">
          {sentence.en}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          {sentence.zh}
        </p>
        {sentence.tip ? (
          <p className="mt-2 text-xs text-[var(--muted)]">提示：{sentence.tip}</p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => speakEnglish(sentence.en, { speed: "fast" })}
            className="inline-flex min-h-10 items-center rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 text-sm text-[var(--ink)] hover:border-[var(--accent)]"
            title="接近自然語速"
          >
            快速
          </button>
          <button
            type="button"
            onClick={() => speakEnglish(sentence.en, { speed: "slow" })}
            className="inline-flex min-h-10 items-center rounded-lg border border-[var(--sky)] bg-[var(--sky-soft)] px-4 text-sm text-[var(--ink)] hover:brightness-105"
            title="放慢方便跟讀"
          >
            慢速
          </button>
          {!listening ? (
            <button
              type="button"
              onClick={startListen}
              className="inline-flex min-h-10 items-center rounded-sm bg-[var(--ink)] px-4 text-sm text-[var(--paper)] hover:bg-[var(--ink-soft)]"
            >
              開始跟讀評分
            </button>
          ) : (
            <button
              type="button"
              onClick={stopListen}
              className="inline-flex min-h-10 items-center rounded-sm border border-[var(--accent)] px-4 text-sm text-[var(--accent)]"
            >
              停止聆聽…
            </button>
          )}
        </div>

        {error ? (
          <p className="mt-4 text-sm text-[var(--muted)]">{error}</p>
        ) : null}

        {last ? (
          <div className="mt-5 space-y-3 rounded-sm bg-[var(--paper)] p-4">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
              Score
            </p>
            <p className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
              {last.score}
              <span className="ml-2 text-base text-[var(--muted)]">
                ／100（命中 {last.matched}/{last.total} 詞）
              </span>
            </p>
            <p className="text-sm text-[var(--muted)]">
              辨識結果：{last.heard || "（空白）"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {last.marks.map((m, i) => (
                <span
                  key={`${m.word}-${i}`}
                  className={`rounded-sm px-2 py-0.5 text-xs ${
                    m.status === "ok"
                      ? "bg-[var(--accent-soft)] text-[var(--ink)]"
                      : m.status === "missing"
                        ? "border border-[var(--line)] text-[var(--muted)] line-through"
                        : m.status === "wrong"
                          ? "border border-[var(--line)] text-[var(--ink)]"
                          : "border border-dashed border-[var(--line)] text-[var(--muted)]"
                  }`}
                  title={m.status}
                >
                  {m.word}
                  {m.status !== "ok" ? ` · ${m.status}` : ""}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <div className="flex flex-wrap justify-between gap-2">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="min-h-10 rounded-sm border border-[var(--line)] px-4 text-sm text-[var(--ink)] disabled:opacity-40"
        >
          ← 上一句
        </button>
        {index < total - 1 ? (
          <button
            type="button"
            onClick={() => setIndex((i) => i + 1)}
            className="min-h-10 rounded-sm bg-[var(--ink)] px-4 text-sm text-[var(--paper)]"
          >
            下一句 →
          </button>
        ) : nextSlug ? (
          <Link
            href={`/oral/${nextSlug}`}
            className="inline-flex min-h-10 items-center rounded-sm bg-[var(--ink)] px-4 text-sm text-[var(--paper)]"
          >
            下一單元 →
          </Link>
        ) : (
          <Link
            href="/oral"
            className="inline-flex min-h-10 items-center rounded-sm bg-[var(--ink)] px-4 text-sm text-[var(--paper)]"
          >
            回口語列表
          </Link>
        )}
      </div>
    </div>
  );
}
