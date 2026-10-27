export type PatternGap = "short" | "normal" | "long";

/** How many times TTS reads the same English line before advancing. */
export type PatternLineRepeats = 1 | 2 | 3 | 4 | 5 | 6;

export const PATTERN_LINE_REPEAT_OPTIONS: {
  id: PatternLineRepeats;
  label: string;
}[] = [
  { id: 1, label: "1次" },
  { id: 2, label: "2次" },
  { id: 3, label: "3次" },
  { id: 4, label: "4次" },
  { id: 5, label: "5次" },
  { id: 6, label: "6次" },
];

export function parsePatternLineRepeats(value: unknown): PatternLineRepeats {
  const n = typeof value === "number" ? value : Number(value);
  if (n >= 1 && n <= 6 && Number.isInteger(n)) return n as PatternLineRepeats;
  return 1;
}

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
