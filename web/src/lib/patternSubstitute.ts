import type { PatternItem, PatternTemplates } from "@/lib/patternLoop";
import {
  readSession as readRandom10Session,
  sessionStillValid,
  type Random10Session,
} from "@/lib/patternRandom10";

export type SubstituteSource = "single" | "random10";

export type SubstituteSession = {
  source: SubstituteSource;
  itemIds: string[];
  /** When single, length 1 */
  label: string;
};

export const SUBSTITUTE_SESSION_KEY = "omnilearn-pattern-substitute-v1";
export const SUBSTITUTE_PLAY_KEY = "omnilearn-pattern-substitute-play-v1";

export function tokenizeEnglish(sentence: string): string[] {
  return sentence.trim().split(/\s+/).filter(Boolean);
}

/** Word indices in `curr` that differ from `prev` (same slot comparison). */
export function changedWordIndices(prev: string, curr: string): number[] {
  const a = tokenizeEnglish(prev);
  const b = tokenizeEnglish(curr);
  const n = Math.max(a.length, b.length);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const normalize = (w: string | undefined) =>
      (w ?? "").replace(/^[^\w]+|[^\w]+$/g, "").toLowerCase();
    if (normalize(a[i]) !== normalize(b[i])) out.push(i);
  }
  return out;
}

export function changedWordsLabel(prev: string, curr: string): string {
  const b = tokenizeEnglish(curr);
  const idx = changedWordIndices(prev, curr);
  if (!idx.length) return "—";
  return idx.map((i) => b[i] ?? "?").join(" · ");
}

export function buildSubstituteFromRandom10(
  random: Random10Session,
): SubstituteSession {
  return {
    source: "random10",
    itemIds: random.itemIds,
    label: `${random.label} · 抽換`,
  };
}

export function buildSubstituteSingle(itemId: string): SubstituteSession {
  return {
    source: "single",
    itemIds: [itemId],
    label: `單模板 · ${itemId}`,
  };
}

export function readSubstituteSession(): SubstituteSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SUBSTITUTE_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SubstituteSession;
    if (
      (parsed.source !== "single" && parsed.source !== "random10") ||
      !Array.isArray(parsed.itemIds) ||
      parsed.itemIds.length < 1
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeSubstituteSession(session: SubstituteSession) {
  sessionStorage.setItem(SUBSTITUTE_SESSION_KEY, JSON.stringify(session));
}

export function tryRandom10ForSubstitute(): SubstituteSession | null {
  const r = readRandom10Session();
  if (!r || !sessionStillValid(r)) return null;
  return buildSubstituteFromRandom10(r);
}

export function resolveItemMap(data: PatternTemplates): Map<string, PatternItem> {
  const map = new Map<string, PatternItem>();
  for (const lv of data.levels) {
    for (const it of lv.items) map.set(it.id, it);
  }
  return map;
}

export type SubstitutePlaySaved = {
  itemIndex: number;
  rowIndex: number;
};

export function readSubstitutePlaySaved(): Partial<SubstitutePlaySaved> | null {
  try {
    const raw = localStorage.getItem(SUBSTITUTE_PLAY_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<SubstitutePlaySaved>;
  } catch {
    return null;
  }
}

export function writeSubstitutePlaySaved(payload: SubstitutePlaySaved) {
  localStorage.setItem(SUBSTITUTE_PLAY_KEY, JSON.stringify(payload));
}

/** Loose match for typed answers (MVP fast-type mode). */
export function sentencesMatch(expected: string, typed: string): boolean {
  const norm = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/['']/g, "'")
      .replace(/[.!?]+$/g, "")
      .replace(/\s+/g, " ");
  return norm(expected) === norm(typed);
}
