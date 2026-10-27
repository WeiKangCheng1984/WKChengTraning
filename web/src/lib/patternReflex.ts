import type { PatternItem, PatternTemplates } from "@/lib/patternLoop";
import {
  readSession as readRandom10Session,
  sessionStillValid,
} from "@/lib/patternRandom10";
import packsJson from "@/data/pattern-response-packs.json";

export type ReflexPrompt = {
  questionEn: string;
  questionZh?: string;
  answerRowIndex: number;
  distractorRowIndices: number[];
};

export type ReflexPack = {
  id: string;
  titleZh: string;
  itemId: string;
  conversationHint?: string;
  prompts: ReflexPrompt[];
  /** Row indices in order for expansion warm-down (same item). */
  expansionRowIndices?: number[];
};

/** Conversation type slug → reflex pack ids */
export const CONVERSATION_REFLEX_PACKS: Record<string, string[]> = {
  "ask-extend": ["want-basic", "would-like", "need-basic"],
  "express-views": ["im-feeling", "planning"],
  storytelling: ["planning", "about-to"],
  "listen-empathy": ["im-feeling", "would-like"],
};

export function packIdsForConversation(slug: string): string[] {
  return CONVERSATION_REFLEX_PACKS[slug] ?? [];
}

export type ReflexPacksData = { packs: ReflexPack[] };

export type ReflexQuizItem = {
  packId: string;
  packTitle: string;
  itemId: string;
  pattern: string;
  questionEn: string;
  questionZh?: string;
  choices: { en: string; zh: string; correct: boolean }[];
};

export type ReflexSession = {
  packIds: string[];
  label: string;
};

export const REFLEX_SESSION_KEY = "omnilearn-pattern-reflex-v1";
export const REFLEX_PLAY_KEY = "omnilearn-pattern-reflex-play-v1";

const packsData = packsJson as ReflexPacksData;

export function listReflexPacks(): ReflexPack[] {
  return packsData.packs;
}

export function getReflexPack(id: string): ReflexPack | undefined {
  return packsData.packs.find((p) => p.id === id);
}

export function resolveItemMap(data: PatternTemplates): Map<string, PatternItem> {
  const map = new Map<string, PatternItem>();
  for (const lv of data.levels) {
    for (const it of lv.items) map.set(it.id, it);
  }
  return map;
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function buildQuizForPack(
  pack: ReflexPack,
  item: PatternItem,
  seed = 1,
): ReflexQuizItem[] {
  return pack.prompts.map((pr) => {
    const indices = [
      pr.answerRowIndex,
      ...pr.distractorRowIndices.filter((i) => i !== pr.answerRowIndex),
    ].slice(0, 4);
    const unique = [...new Set(indices)];
    while (unique.length < 4 && unique.length < item.rows.length) {
      for (let i = 0; i < item.rows.length && unique.length < 4; i++) {
        if (!unique.includes(i)) unique.push(i);
      }
    }
    const ordered = shuffle(unique, seed + pr.answerRowIndex);
    const choices = ordered.map((ri) => ({
      en: item.rows[ri]?.en ?? "",
      zh: item.rows[ri]?.zh ?? "",
      correct: ri === pr.answerRowIndex,
    }));
    return {
      packId: pack.id,
      packTitle: pack.titleZh,
      itemId: item.id,
      pattern: item.pattern,
      questionEn: pr.questionEn,
      questionZh: pr.questionZh,
      choices,
    };
  });
}

export function buildQuizSession(
  data: PatternTemplates,
  packIds: string[],
): ReflexQuizItem[] {
  const map = resolveItemMap(data);
  const out: ReflexQuizItem[] = [];
  for (const id of packIds) {
    const pack = getReflexPack(id);
    if (!pack) continue;
    const item = map.get(pack.itemId);
    if (!item) continue;
    out.push(...buildQuizForPack(pack, item, out.length + 1));
  }
  return out;
}

export function packsMatchingRandom10(data: PatternTemplates): ReflexPack[] {
  const r = readRandom10Session();
  if (!r || !sessionStillValid(r)) return [];
  const set = new Set(r.itemIds);
  return packsData.packs.filter((p) => set.has(p.itemId));
}

export function buildSessionFromPacks(packIds: string[]): ReflexSession {
  const titles = packIds
    .map((id) => getReflexPack(id)?.titleZh)
    .filter(Boolean)
    .join(" · ");
  return {
    packIds,
    label: titles || "問答反射",
  };
}

export function readReflexSession(): ReflexSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(REFLEX_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ReflexSession;
    if (!Array.isArray(parsed.packIds) || parsed.packIds.length < 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeReflexSession(session: ReflexSession) {
  sessionStorage.setItem(REFLEX_SESSION_KEY, JSON.stringify(session));
}

export type ReflexPlaySaved = { index: number; score: number };

export function readReflexPlaySaved(): Partial<ReflexPlaySaved> | null {
  try {
    const raw = localStorage.getItem(REFLEX_PLAY_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<ReflexPlaySaved>;
  } catch {
    return null;
  }
}

export function writeReflexPlaySaved(payload: ReflexPlaySaved) {
  localStorage.setItem(REFLEX_PLAY_KEY, JSON.stringify(payload));
}

export type ExpansionStep = {
  packId: string;
  packTitle: string;
  pattern: string;
  en: string;
  zh: string;
  /** Words new vs previous step in this chain */
  highlightFromPrev: boolean;
};

export function buildExpansionSteps(
  data: PatternTemplates,
  packIds: string[],
): ExpansionStep[] {
  const map = resolveItemMap(data);
  const out: ExpansionStep[] = [];
  for (const pid of packIds) {
    const pack = getReflexPack(pid);
    if (!pack?.expansionRowIndices?.length) continue;
    const item = map.get(pack.itemId);
    if (!item) continue;
    let prevEn = "";
    for (const ri of pack.expansionRowIndices) {
      const row = item.rows[ri];
      if (!row) continue;
      out.push({
        packId: pid,
        packTitle: pack.titleZh,
        pattern: item.pattern,
        en: row.en,
        zh: row.zh,
        highlightFromPrev: Boolean(prevEn),
      });
      prevEn = row.en;
    }
  }
  return out;
}
