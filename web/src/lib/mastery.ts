import type { Mastery } from "./types";

const STORAGE_KEY = "omnilearn-mastery-v1";

type Store = Record<string, Mastery>;

function readStore(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Store;
  } catch {
    return {};
  }
}

function writeStore(store: Store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export type MasteryScope = "cfa" | "en" | "speak" | "grammar" | "re";

export function masteryKey(scope: MasteryScope, id: string | number) {
  return `${scope}:${id}`;
}

export function getMastery(scope: MasteryScope, id: string | number): Mastery {
  return readStore()[masteryKey(scope, id)] ?? "unseen";
}

export function setMastery(
  scope: MasteryScope,
  id: string | number,
  value: Mastery,
) {
  const store = readStore();
  store[masteryKey(scope, id)] = value;
  writeStore(store);
  window.dispatchEvent(new Event("omnilearn-mastery"));
}

export function summarizeMastery(keys: string[]): {
  unseen: number;
  learning: number;
  mastered: number;
  total: number;
} {
  const store = readStore();
  let unseen = 0;
  let learning = 0;
  let mastered = 0;
  for (const key of keys) {
    const v = store[key] ?? "unseen";
    if (v === "mastered") mastered += 1;
    else if (v === "learning") learning += 1;
    else unseen += 1;
  }
  return { unseen, learning, mastered, total: keys.length };
}

export const MASTERY_LABEL: Record<Mastery, string> = {
  unseen: "未學",
  learning: "學習中",
  mastered: "已掌握",
};
