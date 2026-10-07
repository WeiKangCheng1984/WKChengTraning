import { getMastery } from "./mastery";
import type { VocabWord, VocabularyData } from "./types";

export type VocabDailyPick = {
  href: string;
  label: string;
  count: number;
  tableSlug: string;
};

/** Prefer unseen/learning words from thematic vocab; cap at `limit`. */
export function pickDailyVocab(
  data: VocabularyData,
  limit = 12,
): VocabDailyPick {
  const weak: Array<VocabWord & { tableSlug: string; tableTitle: string }> = [];
  for (const t of data.tables) {
    for (const p of t.parts) {
      for (const w of p.words) {
        const m = getMastery("vocab", w.id);
        if (m === "unseen" || m === "learning") {
          weak.push({ ...w, tableSlug: t.slug, tableTitle: t.titleZh });
          if (weak.length >= limit * 3) break;
        }
      }
      if (weak.length >= limit * 3) break;
    }
    if (weak.length >= limit * 3) break;
  }

  if (weak.length > 0) {
    const first = weak[0];
    return {
      href: `/english/vocab/drill?table=${first.tableSlug}`,
      label: first.tableTitle,
      count: Math.min(limit, weak.length),
      tableSlug: first.tableSlug,
    };
  }

  const t0 = data.tables[0];
  return {
    href: t0 ? `/english/vocab/drill?table=${t0.slug}` : "/english/vocab/drill",
    label: t0?.titleZh ?? "進階詞彙",
    count: limit,
    tableSlug: t0?.slug ?? "",
  };
}

export function listVocabIds(data: VocabularyData): string[] {
  return data.tables.flatMap((t) =>
    t.parts.flatMap((p) => p.words.map((w) => w.id)),
  );
}
