import { readJson, writeJson } from "./persist";

const KEY = "omnilearn-oral-progress-v1";

export type OralSentenceResult = {
  sentenceId: string;
  score: number;
  heard: string;
  at: number;
};

export type OralUnitResult = {
  slug: string;
  avgScore: number;
  doneCount: number;
  total: number;
  finishedAt: number;
  sentences: OralSentenceResult[];
};

type Store = Record<string, OralUnitResult>;

export function getOralUnitResult(slug: string): OralUnitResult | null {
  return readJson<Store>(KEY, {})[slug] ?? null;
}

export function saveOralSentence(
  slug: string,
  total: number,
  sentence: OralSentenceResult,
) {
  const store = readJson<Store>(KEY, {});
  const prev = store[slug] ?? {
    slug,
    avgScore: 0,
    doneCount: 0,
    total,
    finishedAt: 0,
    sentences: [],
  };
  const others = prev.sentences.filter((s) => s.sentenceId !== sentence.sentenceId);
  // keep best score per sentence
  const old = prev.sentences.find((s) => s.sentenceId === sentence.sentenceId);
  if (!old || sentence.score >= old.score) {
    others.push(sentence);
  } else {
    others.push(old);
  }
  const avg =
    others.length === 0
      ? 0
      : Math.round(others.reduce((n, s) => n + s.score, 0) / others.length);
  store[slug] = {
    slug,
    avgScore: avg,
    doneCount: others.length,
    total,
    finishedAt: Date.now(),
    sentences: others,
  };
  writeJson(KEY, store);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("omnilearn-oral"));
  }
  return store[slug];
}

export function countOralCompleted(slugs: string[]): number {
  const store = readJson<Store>(KEY, {});
  return slugs.filter((s) => (store[s]?.doneCount ?? 0) >= (store[s]?.total ?? 10)).length;
}
