"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  pauseMs,
  type PatternGap,
  type PatternTemplates,
} from "@/lib/patternLoop";
import { speakEnglish, stopSpeaking, type SpeakSpeed } from "@/lib/speech";

const STORAGE_KEY = "omnilearn-pattern-loop-v1";

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

type Phase = "idle" | "speaking" | "pausing";

type Saved = {
  levelId: string;
  itemId: string;
  speed: SpeakSpeed;
  gap: PatternGap;
  index: number;
};

function readSaved(): Partial<Saved> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<Saved>;
  } catch {
    return null;
  }
}

export function PatternLoopPlayer({ data }: { data: PatternTemplates }) {
  const first = data.levels[0];
  const [levelId, setLevelId] = useState(first.id);
  const [itemId, setItemId] = useState(first.items[0].id);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [speed, setSpeed] = useState<SpeakSpeed>("normal");
  const [gap, setGap] = useState<PatternGap>("normal");
  const [ready, setReady] = useState(false);

  const playingRef = useRef(false);
  const indexRef = useRef(0);
  const tokenRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const speedRef = useRef(speed);
  const gapRef = useRef(gap);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const level = data.levels.find((lv) => lv.id === levelId) ?? first;
  const item = level.items.find((it) => it.id === itemId) ?? level.items[0];
  const rows = item.rows;

  const rowsRef = useRef(rows);
  rowsRef.current = rows;
  speedRef.current = speed;
  gapRef.current = gap;
  indexRef.current = index;

  const pauseForCurrent = useMemo(
    () => pauseMs(rows[index]?.en ?? "", gap),
    [rows, index, gap],
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

  function speakAt(i: number) {
    const list = rowsRef.current;
    if (!list.length) return;
    const next = ((i % list.length) + list.length) % list.length;
    const token = ++tokenRef.current;
    clearTimer();
    indexRef.current = next;
    setIndex(next);
    setPhase("speaking");
    stopSpeaking();
    timerRef.current = window.setTimeout(() => {
      if (token !== tokenRef.current || !playingRef.current) return;
      const row = rowsRef.current[next];
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
    const list = rowsRef.current;
    const next = (indexRef.current + delta + list.length) % list.length;
    if (playingRef.current) speakAt(next);
    else {
      indexRef.current = next;
      setIndex(next);
      setPhase("idle");
    }
  }

  function chooseLevel(id: string) {
    const lv = data.levels.find((x) => x.id === id);
    if (!lv) return;
    halt();
    setLevelId(id);
    setItemId(lv.items[0].id);
    indexRef.current = 0;
    setIndex(0);
  }

  function chooseItem(id: string) {
    halt();
    setItemId(id);
    indexRef.current = 0;
    setIndex(0);
  }

  useEffect(() => {
    const saved = readSaved();
    if (saved) {
      const lv =
        data.levels.find((x) => x.id === saved.levelId) ?? data.levels[0];
      const it = lv.items.find((x) => x.id === saved.itemId) ?? lv.items[0];
      const idx = Math.min(
        Math.max(saved.index ?? 0, 0),
        Math.max(it.rows.length - 1, 0),
      );
      setLevelId(lv.id);
      setItemId(it.id);
      setIndex(idx);
      indexRef.current = idx;
      if (
        saved.speed === "slow" ||
        saved.speed === "normal" ||
        saved.speed === "fast"
      ) {
        setSpeed(saved.speed);
      }
      if (
        saved.gap === "short" ||
        saved.gap === "normal" ||
        saved.gap === "long"
      ) {
        setGap(saved.gap);
      }
    }
    setReady(true);
    return () => {
      playingRef.current = false;
      tokenRef.current += 1;
      if (timerRef.current != null) window.clearTimeout(timerRef.current);
      stopSpeaking();
    };
    // Restore once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    const payload: Saved = { levelId, itemId, speed, gap, index };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [ready, levelId, itemId, speed, gap, index]);

  useEffect(() => {
    rowRefs.current[index]?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [index, itemId]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      window.speechSynthesis?.resume();
    }, 10000);
    return () => window.clearInterval(id);
  }, [playing]);

  const phaseLabel =
    phase === "speaking" ? "正在念" : phase === "pausing" ? "停頓、可以跟讀" : "已暫停";

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {data.levels.map((lv) => {
          const active = lv.id === level.id;
          return (
            <button
              key={lv.id}
              type="button"
              onClick={() => chooseLevel(lv.id)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-sm ${
                active
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                  : "border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
              }`}
            >
              {lv.id}
              <span className="ml-1 text-xs opacity-70">{lv.items.length}</span>
            </button>
          );
        })}
      </div>

      <label className="block text-sm text-[var(--muted)]">
        模板
        <select
          value={item.id}
          onChange={(e) => chooseItem(e.target.value)}
          className="mt-1 w-full rounded-sm border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-base text-[var(--ink)]"
        >
          {level.items.map((it) => (
            <option key={it.id} value={it.id}>
              {it.id}　{it.pattern}
            </option>
          ))}
        </select>
      </label>

      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
          {item.id}
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          {item.pattern}
        </h2>
        <p className="mt-1 text-sm text-[var(--ink)]">{item.zhName}</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          {item.note}
        </p>
        <p className="mt-1 text-xs text-[var(--muted)]">抽換：{item.swap}</p>
      </div>

      <div className="sticky top-[66px] z-30 space-y-3 rounded-sm border border-[var(--line)] bg-[var(--paper)]/95 p-3 backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          {playing ? (
            <button type="button" onClick={halt} className="tap-target rounded-sm bg-[var(--ink)] px-4 text-sm text-[var(--paper)]">
              暫停
            </button>
          ) : (
            <button type="button" onClick={play} className="tap-target rounded-sm bg-[var(--ink)] px-4 text-sm text-[var(--paper)]">
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
            第 {index + 1} / {rows.length} 句 · {phaseLabel}
            {phase === "pausing" ? ` · ${(pauseForCurrent / 1000).toFixed(1)} 秒` : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
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
          只念英文。句子愈長，念完後停愈久，方便跟讀。念完會回到第一句。
        </p>
      </div>

      <ol className="space-y-2">
        {rows.map((row, i) => {
          const active = i === index;
          return (
            <li key={`${item.id}-${i}`}>
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
                <p className="text-xs text-[var(--muted)]">{i + 1}</p>
                <p className="mt-1 text-base text-[var(--ink)]">{row.en}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{row.zh}</p>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
