import { readJson, writeJson } from "./persist";
import { setMastery } from "./mastery";
import type { Mastery } from "./types";

const KEY = "omnilearn-srs-v1";

type SrsStore = Record<string, { due: string; interval: number }>;

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(iso: string, days: number) {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function getDue(scope: "cfa" | "en", id: string | number): string | null {
  const store = readJson<SrsStore>(KEY, {});
  return store[`${scope}:${id}`]?.due ?? null;
}

export function isDue(scope: "cfa" | "en", id: string | number): boolean {
  const due = getDue(scope, id);
  if (!due) return true; // unseen treated as available
  return due <= todayIso();
}

/** Grade after a practice card: again / good / easy */
export function gradeCard(
  scope: "cfa" | "en",
  id: string | number,
  grade: "again" | "good" | "easy",
) {
  const store = readJson<SrsStore>(KEY, {});
  const key = `${scope}:${id}`;
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

export function countDue(keys: Array<{ scope: "cfa" | "en"; id: string | number }>) {
  return keys.filter((k) => isDue(k.scope, k.id)).length;
}

/** Only cards that already have an SRS schedule and are due today */
export function countScheduledDue(
  keys: Array<{ scope: "cfa" | "en"; id: string | number }>,
) {
  return keys.filter((k) => {
    const due = getDue(k.scope, k.id);
    return due !== null && due <= todayIso();
  }).length;
}
