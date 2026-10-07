import { readJson, writeJson } from "./persist";
import { setMastery } from "./mastery";
import type { Mastery } from "./types";

const KEY = "omnilearn-srs-v1";

export type SrsScope =
  | "cfa"
  | "en"
  | "speak"
  | "grammar"
  | "re"
  | "vocab"
  | "gre";

type SrsStore = Record<string, { due: string; interval: number }>;

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(iso: string, days: number) {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function storeKey(scope: SrsScope, id: string | number) {
  return `${scope}:${id}`;
}

export function getDue(scope: SrsScope, id: string | number): string | null {
  const store = readJson<SrsStore>(KEY, {});
  return store[storeKey(scope, id)]?.due ?? null;
}

export function isDue(scope: SrsScope, id: string | number): boolean {
  const due = getDue(scope, id);
  if (!due) return true;
  return due <= todayIso();
}

/** Grade after a practice card: again / good / easy */
export function gradeCard(
  scope: SrsScope,
  id: string | number,
  grade: "again" | "good" | "easy",
) {
  const store = readJson<SrsStore>(KEY, {});
  const key = storeKey(scope, id);
  const prev = store[key]?.interval ?? 0;
  let interval = 0;
  let mastery: Mastery = "learning";

  if (grade === "again") {
    interval = 0;
    mastery = "learning";
  } else if (grade === "good") {
    interval = prev <= 0 ? 1 : Math.min(prev * 2, 14);
    mastery = interval >= 4 ? "mastered" : "learning";
  } else {
    interval = prev <= 0 ? 3 : Math.min(prev * 3, 30);
    mastery = "mastered";
  }

  store[key] = {
    interval,
    due: addDays(todayIso(), Math.max(interval, grade === "again" ? 0 : 1)),
  };
  writeJson(KEY, store);
  setMastery(scope, id, mastery);
}

/**
 * When user manually sets mastery, also put item on an SRS schedule
 * so Today / English review can call it back.
 */
export function scheduleFromMastery(
  scope: SrsScope,
  id: string | number,
  mastery: Mastery,
) {
  const store = readJson<SrsStore>(KEY, {});
  const key = storeKey(scope, id);
  if (mastery === "unseen") {
    delete store[key];
    writeJson(KEY, store);
    return;
  }
  if (mastery === "learning") {
    store[key] = { interval: 1, due: todayIso() };
  } else {
    store[key] = { interval: 4, due: addDays(todayIso(), 4) };
  }
  writeJson(KEY, store);
}

export function countDue(keys: Array<{ scope: SrsScope; id: string | number }>) {
  return keys.filter((k) => isDue(k.scope, k.id)).length;
}

/** Only cards that already have an SRS schedule and are due today */
export function countScheduledDue(
  keys: Array<{ scope: SrsScope; id: string | number }>,
) {
  return keys.filter((k) => {
    const due = getDue(k.scope, k.id);
    return due !== null && due <= todayIso();
  }).length;
}

export function listScheduledDue(
  keys: Array<{ scope: SrsScope; id: string | number }>,
) {
  return keys.filter((k) => {
    const due = getDue(k.scope, k.id);
    return due !== null && due <= todayIso();
  });
}
