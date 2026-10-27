"use client";

import { useState } from "react";
import { changedWordIndices, tokenizeEnglish } from "@/lib/patternSubstitute";
import type { ExpansionStep } from "@/lib/patternReflex";
import { speakEnglish, stopSpeaking } from "@/lib/speech";

function HighlightLine({ en, prevEn }: { en: string; prevEn: string }) {
  const hi = new Set(changedWordIndices(prevEn, en));
  const tokens = tokenizeEnglish(en);
  return (
    <p className="text-lg text-[var(--ink)]">
      {tokens.map((tok, i) => (
        <span key={`${i}-${tok}`}>
          {i > 0 ? " " : null}
          <span
            className={
              hi.has(i) ? "rounded-sm bg-[var(--accent-soft)] font-medium" : ""
            }
          >
            {tok}
          </span>
        </span>
      ))}
    </p>
  );
}

export function PatternExpansionPanel({
  steps,
  onFinish,
}: {
  steps: ExpansionStep[];
  onFinish: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];
  const prev = idx > 0 ? steps[idx - 1]!.en : "";

  if (!step) return null;

  function play() {
    stopSpeaking();
    speakEnglish(step.en, { speed: "normal" });
  }

  function next() {
    if (idx + 1 >= steps.length) onFinish();
    else setIdx((i) => i + 1);
  }

  return (
    <div className="space-y-4 rounded-sm border border-[var(--line)] bg-[var(--surface)] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
        Expansion · 加長句
      </p>
      <p className="text-sm text-[var(--muted)]">
        {step.packTitle} · {step.pattern} · {idx + 1}/{steps.length}
      </p>
      <p className="text-sm text-[var(--muted)]">{step.zh}</p>
      {step.highlightFromPrev ? (
        <HighlightLine en={step.en} prevEn={prev} />
      ) : (
        <p className="text-lg text-[var(--ink)]">{step.en}</p>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={play}
          className="rounded-sm bg-[var(--ink)] px-4 py-2 text-sm text-[var(--paper)]"
        >
          播放
        </button>
        <button
          type="button"
          onClick={next}
          className="rounded-sm border border-[var(--line)] px-4 py-2 text-sm"
        >
          {idx + 1 >= steps.length ? "完成加長句" : "下一句"}
        </button>
      </div>
    </div>
  );
}
