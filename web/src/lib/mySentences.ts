import { onStorageChange, readJson, writeJson } from "./persist";

const KEY = "omnilearn-my-sentences-v1";
const MAX_PER_CATEGORY = 40;
const MAX_TEXT = 280;

export type MySentence = {
  id: string;
  categorySlug: string;
  patternId: string;
  patternEn: string;
  text: string;
  savedAt: number;
};

type Store = Record<string, MySentence[]>;

function load(): Store {
  return readJson<Store>(KEY, {});
}

function save(store: Store) {
  writeJson(KEY, store);
}

export function listMySentences(categorySlug: string, patternId?: string): MySentence[] {
  const all = load()[categorySlug] ?? [];
  const filtered = patternId
    ? all.filter((s) => s.patternId === patternId)
    : all;
  return filtered.sort((a, b) => b.savedAt - a.savedAt);
}

export function addMySentence(input: {
  categorySlug: string;
  patternId: string;
  patternEn: string;
  text: string;
}): MySentence | null {
  const text = input.text.trim().slice(0, MAX_TEXT);
  if (!text) return null;

  const store = load();
  const list = store[input.categorySlug] ?? [];
  const item: MySentence = {
    id: `ms-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    categorySlug: input.categorySlug,
    patternId: input.patternId,
    patternEn: input.patternEn,
    text,
    savedAt: Date.now(),
  };
  store[input.categorySlug] = [item, ...list].slice(0, MAX_PER_CATEGORY);
  save(store);
  return item;
}

export function removeMySentence(categorySlug: string, id: string) {
  const store = load();
  const list = store[categorySlug] ?? [];
  store[categorySlug] = list.filter((s) => s.id !== id);
  save(store);
}

export { onStorageChange, MAX_TEXT };
