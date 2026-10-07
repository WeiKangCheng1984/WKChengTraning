import { readJson, writeJson } from "./persist";

const KEY = "omnilearn-quiz-progress-v1";

export type QuizResult = {
  slug: string;
  score: number;
  total: number;
  pct: number;
  finishedAt: number;
};

type Store = Record<string, QuizResult>;

export function getQuizResult(slug: string): QuizResult | null {
  const store = readJson<Store>(KEY, {});
  return store[slug] ?? null;
}

export function listQuizResults(): QuizResult[] {
  return Object.values(readJson<Store>(KEY, {})).sort(
    (a, b) => b.finishedAt - a.finishedAt,
  );
}

export function saveQuizResult(result: QuizResult) {
  const store = readJson<Store>(KEY, {});
  const prev = store[result.slug];
  // Keep best score, always update timestamp
  if (!prev || result.pct >= prev.pct) {
    store[result.slug] = result;
  } else {
    store[result.slug] = { ...prev, finishedAt: result.finishedAt };
  }
  writeJson(KEY, store);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("omnilearn-quiz"));
  }
}

export function countCompleted(slugs: string[]): number {
  const store = readJson<Store>(KEY, {});
  return slugs.filter((s) => store[s]).length;
}
