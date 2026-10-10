import { readJson, writeJson } from "./persist";

const KEY = "omnilearn-word-bag-v1";

/** Soft reminder when too many unlearned words pile up. */
export const WORD_BAG_SOFT_CAP = 80;

export type WordBagStatus = "new" | "known";

export type WordBagItem = {
  /** Normalized lowercase id for dedupe */
  id: string;
  /** Display form (latest capture casing) */
  word: string;
  context: string;
  sourceHref: string;
  status: WordBagStatus;
  savedAt: number;
  knownAt?: number;
};

export type AddWordResult =
  | { ok: true; item: WordBagItem; created: boolean; softCapReached: boolean }
  | { ok: false; error: string };

function load(): WordBagItem[] {
  return readJson<WordBagItem[]>(KEY, []);
}

function save(list: WordBagItem[]) {
  writeJson(KEY, list);
}

/** Single English word only; strips wrapping punctuation. */
export function parseCaptureWord(
  raw: string,
): { id: string; word: string } | null {
  let t = raw.trim();
  t = t.replace(/^[\s"'“”‘’(\[{«]+|[\s"'“”‘’).,!?;:\]}»]+$/g, "");
  if (!t || /\s/.test(t)) return null;
  if (t.length > 40) return null;
  if (!/^[A-Za-z]+(?:['’-][A-Za-z]+)*$/.test(t)) return null;
  const id = t.toLowerCase().replace(/’/g, "'");
  return { id, word: t };
}

export function countNewWords(list = load()): number {
  return list.filter((w) => w.status === "new").length;
}

/** Unlearned first (newest), then known (newest). */
export function listWordBag(filter: "all" | "new" | "known" = "all"): WordBagItem[] {
  const list = load();
  const filtered =
    filter === "all" ? list : list.filter((w) => w.status === filter);
  return filtered.sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "new" ? -1 : 1;
    }
    return b.savedAt - a.savedAt;
  });
}

export function getWordBagItem(id: string): WordBagItem | undefined {
  return load().find((w) => w.id === id);
}

export function addWordToBag(input: {
  raw: string;
  context?: string;
  sourceHref?: string;
}): AddWordResult {
  const parsed = parseCaptureWord(input.raw);
  if (!parsed) {
    return {
      ok: false,
      error: "請只選一個英文單字（不要整句）",
    };
  }

  const list = load();
  const idx = list.findIndex((w) => w.id === parsed.id);
  const context = (input.context || "").replace(/\s+/g, " ").trim().slice(0, 160);
  const sourceHref = input.sourceHref || "";
  const now = Date.now();

  if (idx >= 0) {
    const prev = list[idx];
    const item: WordBagItem = {
      ...prev,
      word: parsed.word,
      context: context || prev.context,
      sourceHref: sourceHref || prev.sourceHref,
      savedAt: now,
    };
    list.splice(idx, 1);
    list.unshift(item);
    save(list);
    return {
      ok: true,
      item,
      created: false,
      softCapReached: countNewWords(list) >= WORD_BAG_SOFT_CAP,
    };
  }

  const item: WordBagItem = {
    id: parsed.id,
    word: parsed.word,
    context,
    sourceHref,
    status: "new",
    savedAt: now,
  };
  list.unshift(item);
  save(list);
  return {
    ok: true,
    item,
    created: true,
    softCapReached: countNewWords(list) >= WORD_BAG_SOFT_CAP,
  };
}

export function markWordKnown(id: string): boolean {
  const list = load();
  const item = list.find((w) => w.id === id);
  if (!item) return false;
  item.status = "known";
  item.knownAt = Date.now();
  save(list);
  return true;
}

export function markWordNew(id: string): boolean {
  const list = load();
  const item = list.find((w) => w.id === id);
  if (!item) return false;
  item.status = "new";
  delete item.knownAt;
  save(list);
  return true;
}

export function removeWordFromBag(id: string): boolean {
  const list = load();
  const next = list.filter((w) => w.id !== id);
  if (next.length === list.length) return false;
  save(next);
  return true;
}
