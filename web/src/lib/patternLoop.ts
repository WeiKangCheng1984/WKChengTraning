export type PatternGap = "short" | "normal" | "long";

export type PatternRow = { en: string; zh: string };

export type PatternItem = {
  id: string;
  pattern: string;
  zhName: string;
  note: string;
  swap: string;
  rows: PatternRow[];
};

export type PatternLevel = {
  id: string;
  title: string;
  blurb: string;
  items: PatternItem[];
};

export type PatternTemplates = { levels: PatternLevel[] };

const GAP_FACTOR: Record<PatternGap, number> = {
  short: 0.6,
  normal: 1,
  long: 1.6,
};

/** Silence after a sentence, scaled by word count so the listener can repeat it. */
export function pauseMs(english: string, gap: PatternGap): number {
  const words = english.trim().split(/\s+/).filter(Boolean).length;
  const baseSec = Math.min(4, Math.max(0.8, words * 0.35));
  return Math.round(baseSec * GAP_FACTOR[gap] * 1000);
}
