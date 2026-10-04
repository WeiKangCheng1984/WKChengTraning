import { getMastery } from "./mastery";
import { getSession } from "./session";
import { countScheduledDue, listScheduledDue } from "./srs";
import type {
  EnglishData,
  GrammarData,
  GrammarLesson,
  SpeakData,
} from "./types";

export type EnglishPack = {
  minutes: number;
  grammar: GrammarLesson;
  speakSlug: string;
  speakTitle: string;
  patternHref: string;
  patternLabel: string;
  patternCount: number;
  reviewCount: number;
};

/** Pick today's English pack targets from local progress */
export function buildEnglishPack(
  grammar: GrammarData,
  speak: SpeakData,
  english: EnglishData,
): EnglishPack {
  const session = getSession();
  const lessons = [...grammar.lessons].sort((a, b) => a.num - b.num);

  let grammarLesson =
    lessons.find((l) => getMastery("grammar", l.slug) === "unseen") ??
    lessons.find((l) => getMastery("grammar", l.slug) === "learning") ??
    lessons.find((l) => l.slug === session.lastGrammarSlug) ??
    lessons[0];

  // If last grammar is mastered, advance to next
  if (session.lastGrammarSlug) {
    const idx = lessons.findIndex((l) => l.slug === session.lastGrammarSlug);
    const cur = idx >= 0 ? lessons[idx] : null;
    if (cur && getMastery("grammar", cur.slug) === "mastered") {
      grammarLesson = lessons[Math.min(idx + 1, lessons.length - 1)];
    } else if (cur && getMastery("grammar", cur.slug) !== "unseen") {
      grammarLesson = cur;
    }
  }

  const continueSpeak =
    speak.articles.find((a) => a.slug === session.lastSpeakSlug) ??
    speak.articles[0];

  // Prefer patterns still unseen/learning; fall back to first category
  let patternHref = "/english/drill";
  let patternLabel = "句型組句";
  let openCount = 0;
  for (const c of english.categories) {
    const need = c.items.filter((it) => {
      const m = getMastery("en", it.id);
      return m === "unseen" || m === "learning";
    }).length;
    if (need > 0) {
      patternHref = `/english/drill?cat=${c.slug}`;
      patternLabel = c.titleEn || c.title;
      openCount = Math.min(need, 5);
      break;
    }
  }
  if (openCount === 0) {
    const c0 = english.categories[0];
    if (c0) {
      patternHref = `/english/drill?cat=${c0.slug}`;
      patternLabel = c0.titleEn || c0.title;
      openCount = 5;
    }
  }

  const reviewKeys = [
    ...lessons.map((l) => ({ scope: "grammar" as const, id: l.slug })),
    ...speak.articles.map((a) => ({ scope: "speak" as const, id: a.slug })),
    ...english.categories.flatMap((c) =>
      c.items.map((it) => ({ scope: "en" as const, id: it.id })),
    ),
  ];

  return {
    minutes: 20,
    grammar: grammarLesson,
    speakSlug: continueSpeak.slug,
    speakTitle: continueSpeak.titleZh,
    patternHref,
    patternLabel,
    patternCount: openCount,
    reviewCount: countScheduledDue(reviewKeys),
  };
}

export function englishReviewKeys(
  grammar: GrammarData,
  speak: SpeakData,
  english: EnglishData,
) {
  return [
    ...grammar.lessons.map((l) => ({
      scope: "grammar" as const,
      id: l.slug,
    })),
    ...speak.articles.map((a) => ({ scope: "speak" as const, id: a.slug })),
    ...english.categories.flatMap((c) =>
      c.items.map((it) => ({ scope: "en" as const, id: it.id })),
    ),
  ];
}

export function listEnglishDue(
  grammar: GrammarData,
  speak: SpeakData,
  english: EnglishData,
) {
  return listScheduledDue(englishReviewKeys(grammar, speak, english));
}
