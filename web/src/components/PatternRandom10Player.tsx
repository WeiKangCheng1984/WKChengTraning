"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  pauseMs,
  type PatternGap,
  type PatternTemplates,
} from "@/lib/patternLoop";
import {
  flattenRows,
  readPlaySaved,
  readSession,
  resolveItems,
  sessionStillValid,
  writePlaySaved,
  type Random10FlatRow,
  type Random10LoopScope,
} from "@/lib/patternRandom10";
import { speakEnglish, stopSpeaking, type SpeakSpeed } from "@/lib/speech";

const SPEED_OPTIONS: { id: SpeakSpeed; label: string }[] = [
  { id: "slow", label: "慢" },
  { id: "normal", label: "標準" },
  { id: "fast", label: "快" },
];

const GAP_OPTIONS: { id: PatternGap; label: string }[] = [
  { id: "short", label: "短" },
  { id: "normal", label: "標準" },
  { id: "long", label: "長" },
];

const LOOP_OPTIONS: { id: Random10LoopScope; label: string }[] = [
  { id: "full", label: "整輪 120 句" },
  { id: "template", label: "目前句型 12 句" },
];

type Phase = "idle" | "speaking" | "pausing";

const ROWS_PER_TEMPLATE = 12;

function blockStart(index: number): number {
  return Math.floor(index / ROWS_PER_TEMPLATE) * ROWS_PER_TEMPLATE;
}

export function PatternRandom10Player({ data }: { data: PatternTemplates }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [label, setLabel] = useState("");
  const [flat, setFlat] = useState<Random10FlatRow[]>([]);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [speed, setSpeed] = useState<SpeakSpeed>("normal");
  const [gap, setGap] = useState<PatternGap>("normal");
  const [loopScope, setLoopScope] = useState<Random10LoopScope>("full");
  const [ready, setReady] = useState(false);

  const playingRef = useRef(false);
  const indexRef = useRef(0);
  const tokenRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const speedRef = useRef(speed);
  const gapRef = useRef(gap);
  const loopScopeRef = useRef(loopScope);
  const flatRef = useRef(flat);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);

  flatRef.current = flat;
  speedRef.current = speed;
  gapRef.current = gap;
  loopScopeRef.current = loopScope;
  indexRef.current = index;

  const current = flat[index];
  const pauseForCurrent = useMemo(
    () => pauseMs(flat[index]?.en ?? "", gap),
    [flat, index, gap],
  );

  function clearTimer() {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function halt() {
    playingRef.current = false;
    tokenRef.current += 1;
    clearTimer();
    stopSpeaking();
    setPlaying(false);
    setPhase("idle");
  }

  function normalizeIndex(i: number, scope: Random10LoopScope): number {
    const list = flatRef.current;
    if (!list.length) return 0;
    if (scope === "full") {
      return ((i % list.length) + list.length) % list.length;
    }
    const start = blockStart(indexRef.current);
    const end = Math.min(start + ROWS_PER_TEMPLATE, list.length);
    const len = end - start;
    if (len <= 0) return 0;
    const local = i - start;
    return start + (((local % len) + len) % len);
  }

  function speakAt(i: number) {
    const list = flatRef.current;
    if (!list.length) return;
    const next = normalizeIndex(i, loopScopeRef.current);
    const token = ++tokenRef.current;
    clearTimer();
    indexRef.current = next;
    setIndex(next);
    setPhase("speaking");
    stopSpeaking();
    timerRef.current = window.setTimeout(() => {
      if (token !== tokenRef.current || !playingRef.current) return;
      const row = flatRef.current[next];
      if (!row) return;
      speakEnglish(row.en, {
        speed: speedRef.current,
        onEnd: () => {
          if (token !== tokenRef.current || !playingRef.current) return;
          setPhase("pausing");
          const wait = pauseMs(row.en, gapRef.current);
          timerRef.current = window.setTimeout(() => {
            if (token !== tokenRef.current || !playingRef.current) return;
            speakAt(next + 1);
          }, wait);
        },
      });
    }, 50);
  }

  function play() {
    playingRef.current = true;
    setPlaying(true);
    speakAt(indexRef.current);
  }

  function jump(delta: number) {
    const list = flatRef.current;
    if (!list.length) return;
    let next: number;
    if (loopScopeRef.current === "full") {
      next =
        (indexRef.current + delta + list.length) % list.length;
    } else {
      const start = blockStart(indexRef.current);
      const end = Math.min(start + ROWS_PER_TEMPLATE, list.length);
      const len = end - start;
      const local =
        (indexRef.current - start + delta + len) % len;
      next = start + local;
    }
    if (playingRef.current) speakAt(next);
    else {
      indexRef.current = next;
      setIndex(next);
      setPhase("idle");
    }
  }

  function chooseLoopScope(scope: Random10LoopScope) {
    loopScopeRef.current = scope;
    setLoopScope(scope);
    if (scope === "template") {
      const start = blockStart(indexRef.current);
      if (indexRef.current !== start) {
        if (playingRef.current) speakAt(start);
        else {
          indexRef.current = start;
          setIndex(start);
        }
      }
    }
  }

  useEffect(() => {
    const session = readSession();
    if (!session || !sessionStillValid(session)) {
      router.replace("/english/patterns/random");
      return;
    }
    const items = resolveItems(data, session.itemIds);
    const rows = flattenRows(items);
    setFlat(rows);
    setLabel(session.label);

    const saved = readPlaySaved();
    const idx = Math.min(
      Math.max(saved?.index ?? 0, 0),
      Math.max(rows.length - 1, 0),
    );
    setIndex(idx);
    indexRef.current = idx;
    if (
      saved?.speed === "slow" ||
      saved?.speed === "normal" ||
      saved?.speed === "fast"
    ) {
      setSpeed(saved.speed);
    }
    if (
      saved?.gap === "short" ||
      saved?.gap === "normal" ||
      saved?.gap === "long"
    ) {
      setGap(saved.gap);
    }
    if (saved?.loopScope === "full" || saved?.loopScope === "template") {
      setLoopScope(saved.loopScope);
      loopScopeRef.current = saved.loopScope;
    }
    setMounted(true);
    setReady(true);
    return () => {
      playingRef.current = false;
      tokenRef.current += 1;
      if (timerRef.current != null) window.clearTimeout(timerRef.current);
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, router]);

  useEffect(() => {
    if (!ready) return;
    writePlaySaved({ index, speed, gap, loopScope });
  }, [ready, index, speed, gap, loopScope]);

  useEffect(() => {
    rowRefs.current[index]?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [index]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      window.speechSynthesis?.resume();
    }, 10000);
    return () => window.clearInterval(id);
  }, [playing]);

  if (!mounted || !flat.length) {
    return (
      <p className="text-sm text-[var(--muted)]">正在載入十句型覆讀…</p>
    );
  }

  const phaseLabel =
    phase === "speaking"
      ? "正在念"
      : phase === "pausing"
        ? "停頓、可以跟讀"
        : "已暫停";

  const blockNum = (current?.blockIndex ?? 0) + 1;
  const lineInBlock = (current?.lineInBlock ?? 0) + 1;

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--muted)]">{label}</p>

      {current ? (
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
            第 {blockNum} 個句型 · {current.itemId}
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--ink)] sm:text-2xl">
            {current.pattern}
          </h2>
          <p className="mt-1 text-sm text-[var(--ink)]">{current.zhName}</p>
        </div>
      ) : null}

      <div className="sticky top-[66px] z-30 space-y-3 rounded-sm border border-[var(--line)] bg-[var(--paper)]/95 p-3 backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          {playing ? (
            <button
              type="button"
              onClick={halt}
              className="tap-target rounded-sm bg-[var(--ink)] px-4 text-sm text-[var(--paper)]"
            >
              暫停
            </button>
          ) : (
            <button
              type="button"
              onClick={play}
              className="tap-target rounded-sm bg-[var(--ink)] px-4 text-sm text-[var(--paper)]"
            >
              播放
            </button>
          )}
          <button
            type="button"
            onClick={() => jump(-1)}
            className="tap-target rounded-sm border border-[var(--line)] bg-[var(--surface)] px-3 text-sm text-[var(--ink)]"
          >
            上一句
          </button>
          <button
            type="button"
            onClick={() => jump(1)}
            className="tap-target rounded-sm border border-[var(--line)] bg-[var(--surface)] px-3 text-sm text-[var(--ink)]"
          >
            下一句
          </button>
          <p className="text-sm text-[var(--muted)]">
            第 {index + 1} / {flat.length} 句 · 第 {blockNum} 個句型 · 該型{" "}
            {lineInBlock} / {ROWS_PER_TEMPLATE} · {phaseLabel}
            {phase === "pausing"
              ? ` · ${(pauseForCurrent / 1000).toFixed(1)} 秒`
              : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-[var(--muted)]">循環</span>
            {LOOP_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                aria-pressed={loopScope === opt.id}
                onClick={() => chooseLoopScope(opt.id)}
                className={`rounded-full px-3 py-1 text-sm ${
                  loopScope === opt.id
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--surface)] text-[var(--ink)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[var(--muted)]">語速</span>
            {SPEED_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                aria-pressed={speed === opt.id}
                onClick={() => setSpeed(opt.id)}
                className={`rounded-full px-3 py-1 text-sm ${
                  speed === opt.id
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--surface)] text-[var(--ink)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[var(--muted)]">停頓</span>
            {GAP_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                aria-pressed={gap === opt.id}
                onClick={() => setGap(opt.id)}
                className={`rounded-full px-3 py-1 text-sm ${
                  gap === opt.id
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--surface)] text-[var(--ink)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-[var(--muted)]">
          只念英文。可整輪 120 句循環，或只重複目前句型的 12 句變形。
        </p>
      </div>

      <ol className="space-y-2">
        {flat.map((row, i) => {
          const active = i === index;
          const isBlockHead = row.lineInBlock === 0;
          return (
            <li key={`${row.itemId}-${row.lineInBlock}`}>
              {isBlockHead && i > 0 ? (
                <div
                  className="my-3 border-t border-dashed border-[var(--line)]"
                  aria-hidden
                />
              ) : null}
              <button
                type="button"
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                onClick={() => {
                  if (playingRef.current) speakAt(i);
                  else {
                    indexRef.current = i;
                    setIndex(i);
                  }
                }}
                className={`w-full scroll-mt-36 rounded-sm border px-3 py-3 text-left ${
                  active
                    ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                    : "border-[var(--line)] bg-[var(--surface)]"
                }`}
              >
                <p className="text-xs text-[var(--muted)]">
                  {i + 1} · 句型 {row.blockIndex + 1} · {row.lineInBlock + 1}
                </p>
                <p className="mt-1 text-base text-[var(--ink)]">{row.en}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{row.zh}</p>
              </button>
            </li>
          );
        })}
      </ol>

      <Link
        href="/english/patterns/random"
        className="inline-flex text-sm text-[var(--muted)] hover:text-[var(--ink)]"
      >
        ← 返回十句型清單
      </Link>
    </div>
  );
}
