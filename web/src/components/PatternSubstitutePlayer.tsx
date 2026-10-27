"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  PATTERN_LINE_REPEAT_OPTIONS,
  parsePatternLineRepeats,
  pauseMs,
  type PatternGap,
  type PatternItem,
  type PatternLineRepeats,
  type PatternTemplates,
} from "@/lib/patternLoop";
import {
  changedWordIndices,
  changedWordsLabel,
  readSubstitutePlaySaved,
  readSubstituteSession,
  resolveItemMap,
  sentencesMatch,
  tokenizeEnglish,
  writeSubstitutePlaySaved,
} from "@/lib/patternSubstitute";
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

type Phase = "idle" | "speaking" | "pausing" | "typing";
type PlayMode = "listen" | "type";

function HighlightEn({
  en,
  highlightIndices,
}: {
  en: string;
  highlightIndices: Set<number>;
}) {
  const tokens = tokenizeEnglish(en);
  return (
    <p className="text-xl text-[var(--ink)]">
      {tokens.map((tok, i) => (
        <span key={`${i}-${tok}`}>
          {i > 0 ? " " : null}
          <span
            className={
              highlightIndices.has(i)
                ? "rounded-sm bg-[var(--accent-soft)] font-medium text-[var(--accent)]"
                : undefined
            }
          >
            {tok}
          </span>
        </span>
      ))}
    </p>
  );
}

export function PatternSubstitutePlayer({ data }: { data: PatternTemplates }) {
  const router = useRouter();
  const itemMap = useMemo(() => resolveItemMap(data), [data]);

  const [label, setLabel] = useState("");
  const [items, setItems] = useState<PatternItem[]>([]);
  const [itemIndex, setItemIndex] = useState(0);
  const [rowIndex, setRowIndex] = useState(0);
  const [playMode, setPlayMode] = useState<PlayMode>("listen");
  const [typed, setTyped] = useState("");
  const [typeFeedback, setTypeFeedback] = useState<"ok" | "bad" | null>(null);

  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [speed, setSpeed] = useState<SpeakSpeed>("normal");
  const [gap, setGap] = useState<PatternGap>("normal");
  const [lineRepeats, setLineRepeats] = useState<PatternLineRepeats>(1);
  const [repeatPass, setRepeatPass] = useState(1);
  const [ready, setReady] = useState(false);

  const playingRef = useRef(false);
  const tokenRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const speedRef = useRef(speed);
  const gapRef = useRef(gap);
  const lineRepeatsRef = useRef(lineRepeats);
  const playModeRef = useRef(playMode);
  const itemsRef = useRef(items);
  const itemIndexRef = useRef(itemIndex);
  const rowIndexRef = useRef(rowIndex);

  itemsRef.current = items;
  itemIndexRef.current = itemIndex;
  rowIndexRef.current = rowIndex;
  speedRef.current = speed;
  gapRef.current = gap;
  lineRepeatsRef.current = lineRepeats;
  playModeRef.current = playMode;

  const current = items[itemIndex];
  const rows = current?.rows ?? [];
  const row = rows[rowIndex];
  const prevRow = rowIndex > 0 ? rows[rowIndex - 1] : null;
  const highlight = useMemo(() => {
    if (!row) return new Set<number>();
    if (!prevRow) return new Set<number>();
    return new Set(changedWordIndices(prevRow.en, row.en));
  }, [row, prevRow]);

  const totalRows = items.reduce((n, it) => n + it.rows.length, 0);
  const globalStep =
    items
      .slice(0, itemIndex)
      .reduce((n, it) => n + it.rows.length, 0) + rowIndex + 1;

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

  function persistPosition(ii: number, ri: number) {
    writeSubstitutePlaySaved({ itemIndex: ii, rowIndex: ri });
  }

  function advanceRow() {
    const list = itemsRef.current;
    let ii = itemIndexRef.current;
    let ri = rowIndexRef.current;
    const cur = list[ii];
    if (!cur) return false;
    if (ri + 1 < cur.rows.length) {
      ri += 1;
    } else if (ii + 1 < list.length) {
      ii += 1;
      ri = 0;
    } else {
      ii = 0;
      ri = 0;
    }
    itemIndexRef.current = ii;
    rowIndexRef.current = ri;
    setItemIndex(ii);
    setRowIndex(ri);
    setTyped("");
    setTypeFeedback(null);
    persistPosition(ii, ri);
    return true;
  }

  function speakCurrent(pass = 1) {
    const list = itemsRef.current;
    const ii = itemIndexRef.current;
    const ri = rowIndexRef.current;
    const item = list[ii];
    const r = item?.rows[ri];
    if (!r) return;

    if (playModeRef.current === "type" && ri > 0) {
      setPhase("typing");
      setRepeatPass(1);
      return;
    }

    const token = ++tokenRef.current;
    clearTimer();
    setRepeatPass(pass);
    setPhase("speaking");
    stopSpeaking();
    timerRef.current = window.setTimeout(() => {
      if (token !== tokenRef.current || !playingRef.current) return;
      speakEnglish(r.en, {
        speed: speedRef.current,
        onEnd: () => {
          if (token !== tokenRef.current || !playingRef.current) return;
          setPhase("pausing");
          const wait = pauseMs(r.en, gapRef.current);
          timerRef.current = window.setTimeout(() => {
            if (token !== tokenRef.current || !playingRef.current) return;
            const total = lineRepeatsRef.current;
            if (pass < total) speakCurrent(pass + 1);
            else {
              advanceRow();
              if (playingRef.current) speakCurrent(1);
            }
          }, wait);
        },
      });
    }, 50);
  }

  function play() {
    playingRef.current = true;
    setPlaying(true);
    speakCurrent(1);
  }

  function submitType() {
    const list = itemsRef.current;
    const ii = itemIndexRef.current;
    const ri = rowIndexRef.current;
    const r = list[ii]?.rows[ri];
    if (!r) return;
    if (sentencesMatch(r.en, typed)) {
      setTypeFeedback("ok");
      const token = ++tokenRef.current;
      speakEnglish(r.en, {
        speed: speedRef.current,
        onEnd: () => {
          if (token !== tokenRef.current) return;
          setTimeout(() => {
            if (!playingRef.current) return;
            advanceRow();
            speakCurrent(1);
          }, 400);
        },
      });
    } else {
      setTypeFeedback("bad");
    }
  }

  useEffect(() => {
    const session = readSubstituteSession();
    if (!session) {
      router.replace("/english/patterns/substitute");
      return;
    }
    const resolved = session.itemIds
      .map((id) => itemMap.get(id))
      .filter((x): x is PatternItem => !!x);
    if (!resolved.length) {
      router.replace("/english/patterns/substitute");
      return;
    }
    setLabel(session.label);
    setItems(resolved);
    const saved = readSubstitutePlaySaved();
    const ii = Math.min(
      Math.max(saved?.itemIndex ?? 0, 0),
      resolved.length - 1,
    );
    const ri = Math.min(
      Math.max(saved?.rowIndex ?? 0, 0),
      Math.max(resolved[ii].rows.length - 1, 0),
    );
    itemIndexRef.current = ii;
    rowIndexRef.current = ri;
    setItemIndex(ii);
    setRowIndex(ri);
    setReady(true);
    return () => {
      playingRef.current = false;
      tokenRef.current += 1;
      clearTimer();
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, router, itemMap]);

  if (!ready || !current || !row) {
    return <p className="text-sm text-[var(--muted)]">載入抽換快打…</p>;
  }

  const swapLabel =
    rowIndex === 0
      ? "整句起句"
      : `替換：${changedWordsLabel(prevRow!.en, row.en)}`;

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--muted)]">{label}</p>

      <div>
        <p className="text-xs text-[var(--accent)]">
          模板 {itemIndex + 1}/{items.length} · {current.id} · 第{" "}
          {globalStep}/{totalRows} 句
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          {current.pattern}
        </h2>
        <p className="text-sm text-[var(--muted)]">{current.zhName}</p>
        <p className="mt-1 text-xs text-[var(--muted)]">抽換：{current.swap}</p>
      </div>

      <div className="sticky top-[66px] z-30 space-y-3 rounded-sm border border-[var(--line)] bg-[var(--paper)]/95 p-3 backdrop-blur">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-[var(--muted)]">模式</span>
          {(
            [
              { id: "listen" as const, label: "跟讀抽換" },
              { id: "type" as const, label: "快打" },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                halt();
                setPlayMode(m.id);
                playModeRef.current = m.id;
              }}
              className={`rounded-full px-3 py-1 text-sm ${
                playMode === m.id
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--surface)]"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {playing ? (
            <button
              type="button"
              onClick={halt}
              className="rounded-sm bg-[var(--ink)] px-4 py-2 text-sm text-[var(--paper)]"
            >
              暫停
            </button>
          ) : (
            <button
              type="button"
              onClick={play}
              className="rounded-sm bg-[var(--ink)] px-4 py-2 text-sm text-[var(--paper)]"
            >
              播放
            </button>
          )}
          <p className="text-sm text-[var(--muted)]">
            {swapLabel}
            {lineRepeats > 1 && playing && phase !== "typing"
              ? ` · 第 ${repeatPass}/${lineRepeats} 遍`
              : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs text-[var(--muted)]">每句</span>
            {PATTERN_LINE_REPEAT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  lineRepeatsRef.current = opt.id;
                  setLineRepeats(opt.id);
                }}
                className={`rounded-full px-2 py-0.5 text-xs ${
                  lineRepeats === opt.id
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--surface)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {SPEED_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSpeed(opt.id)}
              className={`rounded-full px-2 py-0.5 text-xs ${
                speed === opt.id ? "bg-[var(--ink)] text-[var(--paper)]" : ""
              }`}
            >
              {opt.label}
            </button>
          ))}
          {GAP_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setGap(opt.id)}
              className={`rounded-full px-2 py-0.5 text-xs ${
                gap === opt.id ? "bg-[var(--ink)] text-[var(--paper)]" : ""
              }`}
            >
              停{opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-sm border border-[var(--line)] bg-[var(--surface)] px-4 py-5">
        <p className="text-xs text-[var(--muted)]">{row.zh}</p>
        {playMode === "type" && rowIndex > 0 && phase === "typing" ? (
          <div className="mt-3 space-y-2">
            <p className="text-sm text-[var(--muted)]">輸入英文（看中文快打）</p>
            <input
              value={typed}
              onChange={(e) => {
                setTyped(e.target.value);
                setTypeFeedback(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitType();
              }}
              className="w-full rounded-sm border border-[var(--line)] px-3 py-2 text-base"
              autoFocus
            />
            <button
              type="button"
              onClick={submitType}
              className="rounded-sm bg-[var(--ink)] px-4 py-2 text-sm text-[var(--paper)]"
            >
              送出
            </button>
            {typeFeedback === "bad" ? (
              <p className="text-sm text-[var(--bad)]">再試一次（標點可省略）</p>
            ) : null}
          </div>
        ) : (
          <div className="mt-3">
            <HighlightEn en={row.en} highlightIndices={highlight} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/english/patterns/reflex"
          className="text-sm text-[var(--accent)]"
        >
          下一步：問答反射 →
        </Link>
        <Link href="/english/patterns/substitute" className="text-sm text-[var(--muted)]">
          ← 設定
        </Link>
      </div>
    </div>
  );
}
