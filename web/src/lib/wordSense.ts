/**
 * Word Sense Hub — lookup GRE / general vocab / GRE humor by headword.
 * Client-safe: builds indexes once on first call.
 */
import greVocabulary from "@/data/gre-vocabulary.json";
import vocabulary from "@/data/vocabulary.json";
import greHumor from "@/data/gre-humor.json";
import type {
  GreVocabularyData,
  GreWord,
  VocabularyData,
  VocabWord,
} from "@/lib/types";
import type { GreHumorData } from "@/lib/greHumor";

const greData = greVocabulary as GreVocabularyData;
const vocabData = vocabulary as VocabularyData;
const humorData = greHumor as GreHumorData;

export type WordSenseGre = {
  id: string;
  en: string;
  zh: string;
  endef: string;
  exampleEn: string;
  example: string;
  exampleUsage?: string;
  synonyms: string;
  antonyms: string;
  derivatives: string;
  lookalikes: string;
  letterSlug: string;
  href: string;
};

export type WordSenseVocab = {
  id: string;
  en: string;
  zh: string;
  ipa: string;
  pos: string;
  exampleEn: string;
  tableSlug: string;
  tableTitleZh: string;
  href: string;
};

export type WordSenseHumor = {
  clusterId: string;
  slug: string;
  titleZh: string;
  typeZh: string;
  headword: string;
  zhGloss: string;
  speakLineEn: string;
  speakLineZh: string;
  href: string;
};

export type WordSenseResult = {
  query: string;
  matchedAs: string | null;
  gre: WordSenseGre | null;
  vocab: WordSenseVocab | null;
  humor: WordSenseHumor[];
  found: boolean;
};

type Indexes = {
  gre: Map<string, WordSenseGre>;
  vocab: Map<string, WordSenseVocab>;
  humor: Map<string, WordSenseHumor[]>;
};

let indexes: Indexes | null = null;

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/’/g, "'");
}

/** Light English variants for bag/dictionary lookup. */
export function wordCandidates(raw: string): string[] {
  const w = norm(raw);
  if (!w) return [];
  const out: string[] = [w];
  if (w.endsWith("ies") && w.length > 4) out.push(`${w.slice(0, -3)}y`);
  if (w.endsWith("ves") && w.length > 4) out.push(`${w.slice(0, -3)}f`, `${w.slice(0, -3)}fe`);
  if (w.endsWith("es") && w.length > 4) out.push(w.slice(0, -2));
  if (w.endsWith("s") && !w.endsWith("ss") && w.length > 3) out.push(w.slice(0, -1));
  if (w.endsWith("ied") && w.length > 4) out.push(`${w.slice(0, -3)}y`);
  if (w.endsWith("ed") && w.length > 4) {
    out.push(w.slice(0, -2));
    out.push(w.slice(0, -1));
  }
  if (w.endsWith("ing") && w.length > 5) {
    out.push(w.slice(0, -3));
    out.push(`${w.slice(0, -3)}e`);
  }
  if (w.endsWith("ly") && w.length > 4) out.push(w.slice(0, -2));
  return [...new Set(out.filter((x) => x.length >= 2))];
}

function buildIndexes(): Indexes {
  const gre = new Map<string, WordSenseGre>();
  for (const letter of greData.letters) {
    for (const w of letter.words) {
      const key = norm(w.en);
      if (!key || gre.has(key)) continue;
      gre.set(key, toGreSense(w, letter.slug));
    }
  }

  const vocab = new Map<string, WordSenseVocab>();
  for (const table of vocabData.tables) {
    for (const part of table.parts) {
      for (const w of part.words) {
        const key = norm(w.en);
        if (!key || vocab.has(key)) continue;
        vocab.set(key, toVocabSense(w, table.slug, table.titleZh));
      }
    }
  }

  const humor = new Map<string, WordSenseHumor[]>();
  for (const c of humorData.clusters) {
    for (const m of c.members || []) {
      const key = norm(m.headword);
      if (!key) continue;
      const hit: WordSenseHumor = {
        clusterId: c.id,
        slug: c.slug,
        titleZh: c.titleZh,
        typeZh: c.typeZh,
        headword: m.headword,
        zhGloss: m.zhGloss || m.senseAnchor || "",
        speakLineEn: m.speakLineEn || "",
        speakLineZh: m.speakLineZh || "",
        href: `/english/gre/humor/${c.slug}`,
      };
      const list = humor.get(key) || [];
      if (!list.some((x) => x.clusterId === hit.clusterId)) list.push(hit);
      humor.set(key, list);
    }
  }

  return { gre, vocab, humor };
}

function toGreSense(w: GreWord, letterSlug: string): WordSenseGre {
  return {
    id: w.id,
    en: w.en,
    zh: w.zh || "",
    endef: w.endef || "",
    exampleEn: w.exampleEn || "",
    example: w.example || "",
    exampleUsage: w.exampleUsage,
    synonyms: w.synonyms || "",
    antonyms: w.antonyms || "",
    derivatives: w.derivatives || "",
    lookalikes: w.lookalikes || "",
    letterSlug,
    href: `/english/gre/${letterSlug}`,
  };
}

function toVocabSense(
  w: VocabWord,
  tableSlug: string,
  tableTitleZh: string,
): WordSenseVocab {
  return {
    id: w.id,
    en: w.en,
    zh: w.zh || "",
    ipa: w.ipa || "",
    pos: w.pos || "",
    exampleEn: w.exampleEn || "",
    tableSlug,
    tableTitleZh,
    href: `/english/vocab/${tableSlug}`,
  };
}

function getIndexes(): Indexes {
  if (!indexes) indexes = buildIndexes();
  return indexes;
}

function pickFirst<T>(
  cands: string[],
  map: Map<string, T>,
): { key: string; value: T } | null {
  for (const k of cands) {
    const v = map.get(k);
    if (v) return { key: k, value: v };
  }
  return null;
}

/** Exact then light-stem lookup across GRE, vocab, and humor. */
export function lookupWordSense(raw: string): WordSenseResult {
  const query = raw.trim();
  const cands = wordCandidates(query);
  if (!cands.length) {
    return { query, matchedAs: null, gre: null, vocab: null, humor: [], found: false };
  }

  const idx = getIndexes();
  const greHit = pickFirst(cands, idx.gre);
  const vocabHit = pickFirst(cands, idx.vocab);

  let humor: WordSenseHumor[] = [];
  let humorKey: string | null = null;
  for (const k of cands) {
    const list = idx.humor.get(k);
    if (list?.length) {
      humor = list.slice(0, 4);
      humorKey = k;
      break;
    }
  }

  const matchedAs =
    greHit?.key || vocabHit?.key || humorKey || null;

  return {
    query,
    matchedAs,
    gre: greHit?.value || null,
    vocab: vocabHit?.value || null,
    humor,
    found: Boolean(greHit || vocabHit || humor.length),
  };
}

/** Prefix suggest for dictionary typeahead (max results). */
export function suggestWords(prefix: string, limit = 12): string[] {
  const p = norm(prefix);
  if (p.length < 2) return [];
  const idx = getIndexes();
  const out: string[] = [];
  const seen = new Set<string>();
  for (const key of idx.gre.keys()) {
    if (!key.startsWith(p) || seen.has(key)) continue;
    seen.add(key);
    out.push(key);
    if (out.length >= limit) return out;
  }
  for (const key of idx.vocab.keys()) {
    if (!key.startsWith(p) || seen.has(key)) continue;
    seen.add(key);
    out.push(key);
    if (out.length >= limit) return out;
  }
  return out;
}
