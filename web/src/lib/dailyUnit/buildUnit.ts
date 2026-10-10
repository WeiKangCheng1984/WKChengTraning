import conversation from "@/data/conversation-four.json";
import english from "@/data/english.json";
import grammar from "@/data/grammar.json";
import greVocab from "@/data/gre-vocabulary.json";
import oral from "@/data/oral-practice.json";
import quizBank from "@/data/quiz-bank.json";
import speak from "@/data/speak.json";
import stylePhrases from "@/data/style-phrases.json";
import vocabulary from "@/data/vocabulary.json";
import { themeForDay, DAILY_PROGRAM_DAYS } from "@/lib/dailyUnit/themes";
import type {
  ContrastStep,
  DailyStep,
  DailyUnit,
  ChoiceStep,
  RevealStep,
} from "@/lib/dailyUnit/types";
import { mulberry32, pickN, shuffleInPlace } from "@/lib/dailyUnit/rng";
import type {
  ConversationFourData,
  ConversationFormula,
  EnglishData,
  EnglishItem,
  GrammarData,
  GrammarLesson,
  GreVocabularyData,
  GreWord,
  OralPracticeData,
  OralSentence,
  QuizBankData,
  QuizQuestion,
  SpeakData,
  SpeakSegment,
  StylePhraseItem,
  StylePhrasesData,
  VocabularyData,
  VocabWord,
} from "@/lib/types";

const enData = english as EnglishData;
const grammarData = grammar as GrammarData;
const greData = greVocab as GreVocabularyData;
const oralData = oral as OralPracticeData;
const quizData = quizBank as QuizBankData;
const vocabData = vocabulary as VocabularyData;
const speakData = speak as SpeakData;
const styleData = stylePhrases as StylePhrasesData;
const convData = conversation as ConversationFourData;

const VOCAB_WORDS: VocabWord[] = vocabData.tables.flatMap((t) =>
  t.parts.flatMap((p) => p.words),
);
const GRE_WORDS: GreWord[] = greData.letters.flatMap((l) =>
  l.words.filter((w) => w.en && (w.zh || w.endef)),
);
const QUIZ_QS: QuizQuestion[] = quizData.quizzes.flatMap((it) => it.questions);
const EN_ITEMS: EnglishItem[] = enData.categories.flatMap((c) => c.items);
const ORAL_SENTS: OralSentence[] = oralData.units.flatMap((u) => u.sentences);
const GRAMMAR_LESSONS: GrammarLesson[] = grammarData.lessons;
const SPEAK_SEGS: SpeakSegment[] = speakData.articles.flatMap((a) => a.segments);
const STYLE_ITEMS: StylePhraseItem[] = styleData.stages.flatMap((st) =>
  st.sections.flatMap((sec) => sec.groups.flatMap((g) => g.items)),
);
const CONV_FORMULAS: ConversationFormula[] = convData.types.flatMap((t) =>
  t.blocks.flatMap((b) => b.formulas),
);

/** Theme → prefer certain vocab tables when possible */
const THEME_VOCAB_SLUGS: Record<string, string[]> = {
  vocab: ["office-ops", "negotiation", "service-crm", "food-sensory", "precise-adj"],
  mix: ["office-ops", "precise-adj"],
  pattern: ["negotiation", "service-crm"],
  oral: ["service-crm", "food-sensory"],
  gre: [],
  quiz: ["precise-adj"],
  grammar: ["office-ops"],
};

function shortZh(zh: string, max = 48) {
  const cleaned = zh.split("｜")[0]?.trim() || zh;
  return cleaned.length > max ? `${cleaned.slice(0, max)}…` : cleaned;
}

function blankWord(sentence: string, word: string): string | null {
  if (!sentence || !word) return null;
  const re = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  if (!re.test(sentence)) return null;
  return sentence.replace(re, "______");
}

class AvoidPool {
  private used = new Set<string>();
  private unitUsed = new Set<string>();

  constructor(recent: string[] = []) {
    for (const f of recent) this.used.add(f);
  }

  fingerprints(): string[] {
    return [...this.unitUsed];
  }

  pickAvoiding<T>(
    rng: () => number,
    items: T[],
    fingerprintOf: (item: T) => string,
  ): T | null {
    if (!items.length) return null;
    const fresh = items.filter((it) => {
      const f = fingerprintOf(it);
      return !this.used.has(f) && !this.unitUsed.has(f);
    });
    const pool = fresh.length ? fresh : items;
    const item = pool[Math.floor(rng() * pool.length) % pool.length]!;
    const f = fingerprintOf(item);
    this.unitUsed.add(f);
    this.used.add(f);
    return item;
  }
}

function distractors(
  rng: () => number,
  correct: string,
  pool: string[],
  n = 2,
): string[] {
  const others = pool.filter((x) => x.toLowerCase() !== correct.toLowerCase());
  return pickN(rng, others, Math.min(n, others.length));
}

function vocabPoolForAccent(accent: string): VocabWord[] {
  const slugs = THEME_VOCAB_SLUGS[accent] || [];
  if (!slugs.length) return VOCAB_WORDS;
  const filtered = vocabData.tables
    .filter((t) => slugs.includes(t.slug))
    .flatMap((t) => t.parts.flatMap((p) => p.words));
  return filtered.length >= 40 ? filtered : VOCAB_WORDS;
}

function makeVocabChoice(
  rng: () => number,
  id: string,
  avoid: AvoidPool,
  accent: string,
): ChoiceStep | null {
  const pool = vocabPoolForAccent(accent);
  const w = avoid.pickAvoiding(rng, pool, (x) => `vocab:${x.id}`);
  if (!w) return null;
  const enPool = pool.map((x) => x.en);
  const choices = shuffleInPlace(rng, [
    w.en,
    ...distractors(rng, w.en, enPool, 2),
  ]);
  return {
    id,
    kind: "vocab_choice",
    prompt: shortZh(w.zh),
    promptHint: w.pos ? `詞性 ${w.pos}` : undefined,
    answer: w.en,
    choices,
    explainZh: w.exampleEn
      ? `例句：${w.exampleEn}`
      : w.collocations[0]
        ? `搭配：${w.collocations[0].en}（${w.collocations[0].zh}）`
        : undefined,
    fingerprint: `vocab:${w.id}`,
  };
}

function makeGreChoice(
  rng: () => number,
  id: string,
  avoid: AvoidPool,
): ChoiceStep | null {
  const w = avoid.pickAvoiding(rng, GRE_WORDS, (x) => `gre:${x.id}`);
  if (!w) return null;
  const enPool = GRE_WORDS.map((x) => x.en);
  const choices = shuffleInPlace(rng, [
    w.en,
    ...distractors(rng, w.en, enPool, 2),
  ]);
  return {
    id,
    kind: "gre_choice",
    prompt: shortZh(w.zh || w.endef, 56),
    promptHint: "GRE 詞彙",
    answer: w.en,
    choices,
    explainZh: w.exampleEn || w.endef,
    fingerprint: `gre:${w.id}`,
  };
}

function makeQuizCloze(
  rng: () => number,
  id: string,
  avoid: AvoidPool,
): ChoiceStep | null {
  const q = avoid.pickAvoiding(rng, QUIZ_QS, (x) => `quiz:${x.id}`);
  if (!q) return null;
  return {
    id,
    kind: "cloze",
    prompt: q.stem,
    promptHint: q.wordZh ? shortZh(q.wordZh, 40) : undefined,
    answer: q.answer,
    choices: shuffleInPlace(rng, [...q.choices]),
    explainZh: q.explainZh,
    fingerprint: `quiz:${q.id}`,
  };
}

function makeVocabCloze(
  rng: () => number,
  id: string,
  avoid: AvoidPool,
  accent: string,
): ChoiceStep | null {
  const pool = vocabPoolForAccent(accent).filter((w) =>
    blankWord(w.exampleEn, w.en),
  );
  const w = avoid.pickAvoiding(rng, pool, (x) => `vcloze:${x.id}`);
  if (!w) return null;
  const stem = blankWord(w.exampleEn, w.en)!;
  const choices = shuffleInPlace(rng, [
    w.en,
    ...distractors(
      rng,
      w.en,
      VOCAB_WORDS.map((x) => x.en),
      2,
    ),
  ]);
  return {
    id,
    kind: "cloze",
    prompt: stem,
    promptHint: shortZh(w.zh, 40),
    answer: w.en,
    choices,
    explainZh: `完整句：${w.exampleEn}`,
    fingerprint: `vcloze:${w.id}`,
  };
}

function makeGreCloze(
  rng: () => number,
  id: string,
  avoid: AvoidPool,
): ChoiceStep | null {
  const pool = GRE_WORDS.filter((w) => blankWord(w.exampleEn, w.en));
  const w = avoid.pickAvoiding(rng, pool, (x) => `gcloze:${x.id}`);
  if (!w) return null;
  const stem = blankWord(w.exampleEn, w.en)!;
  const choices = shuffleInPlace(rng, [
    w.en,
    ...distractors(
      rng,
      w.en,
      GRE_WORDS.map((x) => x.en),
      2,
    ),
  ]);
  return {
    id,
    kind: "cloze",
    prompt: stem,
    promptHint: shortZh(w.zh || w.endef, 40),
    answer: w.en,
    choices,
    explainZh: `完整句：${w.exampleEn}`,
    fingerprint: `gcloze:${w.id}`,
  };
}

function makePatternReveal(
  rng: () => number,
  id: string,
  avoid: AvoidPool,
): RevealStep | null {
  type Pair = { item: EnglishItem; exIdx: number; en: string; zh: string };
  const pairs: Pair[] = EN_ITEMS.flatMap((item) =>
    (item.examples.length ? item.examples : [{ en: item.en, zh: item.zh, tag: "" }]).map(
      (ex, exIdx) => ({
        item,
        exIdx,
        en: ex.en,
        zh: ex.zh,
      }),
    ),
  );
  const pair = avoid.pickAvoiding(
    rng,
    pairs,
    (p) => `en:${p.item.id}:${p.exIdx}`,
  );
  if (!pair) return null;
  return {
    id,
    kind: "pattern_reveal",
    promptZh: pair.zh || pair.item.zh,
    answerEn: pair.en || pair.item.en,
    note: pair.item.note || pair.item.zh,
    fingerprint: `en:${pair.item.id}:${pair.exIdx}`,
  };
}

function makeStyleReveal(
  rng: () => number,
  id: string,
  avoid: AvoidPool,
): RevealStep | null {
  const item = avoid.pickAvoiding(
    rng,
    STYLE_ITEMS.filter((x) => x.en && x.noteZh),
    (x) => `style:${x.en}`,
  );
  if (!item) return null;
  return {
    id,
    kind: "pattern_reveal",
    promptZh: shortZh(item.noteZh, 60),
    answerEn: item.en,
    note: "風格／語氣片語",
    fingerprint: `style:${item.en}`,
  };
}

function makeConvReveal(
  rng: () => number,
  id: string,
  avoid: AvoidPool,
): RevealStep | null {
  const f = avoid.pickAvoiding(
    rng,
    CONV_FORMULAS,
    (x) => `conv:${x.id}`,
  );
  if (!f) return null;
  return {
    id,
    kind: "pattern_reveal",
    promptZh: f.scenarioZh || f.substitutions || "會話公式",
    answerEn: f.en,
    note: f.substitutions ? `可替換：${f.substitutions}` : undefined,
    fingerprint: `conv:${f.id}`,
  };
}

function makeGrammarContrast(
  rng: () => number,
  id: string,
  avoid: AvoidPool,
): ContrastStep | null {
  type Row = { lesson: GrammarLesson; bad: string; good: string; note: string; key: string };
  const rows: Row[] = [];
  for (const lesson of GRAMMAR_LESSONS) {
    if (lesson.contrasts.length) {
      lesson.contrasts.forEach((c, i) => {
        rows.push({
          lesson,
          bad: c.bad,
          good: c.good,
          note: c.note,
          key: `gcon:${lesson.slug}:${i}`,
        });
      });
    } else if (lesson.examples.length >= 2) {
      rows.push({
        lesson,
        bad: lesson.examples[0]!.en,
        good: lesson.examples[1]!.en,
        note: lesson.focus,
        key: `gcon:${lesson.slug}:ex`,
      });
    }
  }
  const row = avoid.pickAvoiding(rng, rows, (r) => r.key);
  if (!row) return null;
  return {
    id,
    kind: "grammar_contrast",
    prompt: `Lesson ${String(row.lesson.num).padStart(2, "0")}｜${row.lesson.titleZh}`,
    bad: row.bad,
    good: row.good,
    note: row.note,
    fingerprint: row.key,
  };
}

function makeListenChoice(
  rng: () => number,
  id: string,
  avoid: AvoidPool,
): ChoiceStep | null {
  type AudioRow =
    | { kind: "oral"; id: string; en: string; zh: string }
    | { kind: "speak"; id: string; en: string; zh: string };
  const rows: AudioRow[] = [
    ...ORAL_SENTS.map((s) => ({
      kind: "oral" as const,
      id: s.id,
      en: s.en,
      zh: s.zh,
    })),
    ...SPEAK_SEGS.map((s) => ({
      kind: "speak" as const,
      id: s.id,
      en: s.en,
      zh: s.zh,
    })),
  ];
  const s = avoid.pickAvoiding(rng, rows, (x) => `listen:${x.kind}:${x.id}`);
  if (!s) return null;
  const wrong = pickN(
    rng,
    rows.filter((x) => !(x.kind === s.kind && x.id === s.id)),
    2,
  ).map((x) => shortZh(x.zh));
  const answer = shortZh(s.zh);
  return {
    id,
    kind: "listen_choice",
    prompt: "聽英語，選正確中文意思",
    answer,
    choices: shuffleInPlace(rng, [answer, ...wrong]),
    speakText: s.en,
    explainZh: s.en,
    fingerprint: `listen:${s.kind}:${s.id}`,
  };
}

function makeSpeakCheck(
  rng: () => number,
  id: string,
  avoid: AvoidPool,
): RevealStep | null {
  type Row =
    | { kind: "oral"; id: string; en: string; zh: string; tip?: string }
    | { kind: "speak"; id: string; en: string; zh: string; tip?: string };
  const rows: Row[] = [
    ...ORAL_SENTS.map((s) => ({
      kind: "oral" as const,
      id: s.id,
      en: s.en,
      zh: s.zh,
      tip: s.tip,
    })),
    ...SPEAK_SEGS.map((s) => ({
      kind: "speak" as const,
      id: s.id,
      en: s.en,
      zh: s.zh,
    })),
  ];
  const s = avoid.pickAvoiding(rng, rows, (x) => `speak:${x.kind}:${x.id}`);
  if (!s) return null;
  return {
    id,
    kind: "speak_check",
    promptZh: shortZh(s.zh),
    answerEn: s.en,
    note: s.tip,
    fingerprint: `speak:${s.kind}:${s.id}`,
  };
}

type Maker = (
  rng: () => number,
  id: string,
  avoid: AvoidPool,
  accent: string,
) => DailyStep | null;

const MAKERS: Record<string, Maker> = {
  vocab_choice: (rng, id, avoid, accent) =>
    makeVocabChoice(rng, id, avoid, accent),
  gre_choice: (rng, id, avoid) => makeGreChoice(rng, id, avoid),
  quiz_cloze: (rng, id, avoid) => makeQuizCloze(rng, id, avoid),
  vocab_cloze: (rng, id, avoid, accent) =>
    makeVocabCloze(rng, id, avoid, accent),
  gre_cloze: (rng, id, avoid) => makeGreCloze(rng, id, avoid),
  pattern: (rng, id, avoid) => makePatternReveal(rng, id, avoid),
  style: (rng, id, avoid) => makeStyleReveal(rng, id, avoid),
  conv: (rng, id, avoid) => makeConvReveal(rng, id, avoid),
  grammar: (rng, id, avoid) => makeGrammarContrast(rng, id, avoid),
  listen: (rng, id, avoid) => makeListenChoice(rng, id, avoid),
  speak: (rng, id, avoid) => makeSpeakCheck(rng, id, avoid),
};

/** 12-step recipes per accent — more variety, less same-type clustering */
const RECIPES: Record<string, (keyof typeof MAKERS)[]> = {
  vocab: [
    "vocab_choice",
    "vocab_cloze",
    "pattern",
    "vocab_choice",
    "listen",
    "quiz_cloze",
    "style",
    "vocab_choice",
    "speak",
    "gre_choice",
    "conv",
    "vocab_cloze",
  ],
  pattern: [
    "pattern",
    "conv",
    "style",
    "quiz_cloze",
    "listen",
    "pattern",
    "grammar",
    "vocab_choice",
    "speak",
    "conv",
    "cloze_fallback" as keyof typeof MAKERS,
    "pattern",
  ],
  grammar: [
    "grammar",
    "quiz_cloze",
    "pattern",
    "grammar",
    "listen",
    "vocab_choice",
    "grammar",
    "speak",
    "gre_cloze",
    "style",
    "quiz_cloze",
    "grammar",
  ],
  quiz: [
    "quiz_cloze",
    "vocab_cloze",
    "gre_cloze",
    "quiz_cloze",
    "listen",
    "gre_choice",
    "quiz_cloze",
    "pattern",
    "speak",
    "vocab_choice",
    "quiz_cloze",
    "gre_cloze",
  ],
  oral: [
    "listen",
    "speak",
    "listen",
    "pattern",
    "quiz_cloze",
    "speak",
    "conv",
    "listen",
    "style",
    "speak",
    "vocab_choice",
    "listen",
  ],
  gre: [
    "gre_choice",
    "gre_cloze",
    "quiz_cloze",
    "gre_choice",
    "listen",
    "gre_cloze",
    "pattern",
    "speak",
    "gre_choice",
    "vocab_choice",
    "gre_cloze",
    "quiz_cloze",
  ],
  mix: [
    "vocab_choice",
    "quiz_cloze",
    "pattern",
    "listen",
    "gre_choice",
    "grammar",
    "vocab_cloze",
    "speak",
    "style",
    "conv",
    "gre_cloze",
    "pattern",
  ],
};

// Fix pattern recipe typo — use quiz_cloze instead of invalid key
RECIPES.pattern = [
  "pattern",
  "conv",
  "style",
  "quiz_cloze",
  "listen",
  "pattern",
  "grammar",
  "vocab_choice",
  "speak",
  "conv",
  "quiz_cloze",
  "pattern",
];

const FALLBACKS: Maker[] = [
  (rng, id, avoid, accent) => makeVocabChoice(rng, id, avoid, accent),
  (rng, id, avoid) => makeQuizCloze(rng, id, avoid),
  (rng, id, avoid) => makePatternReveal(rng, id, avoid),
  (rng, id, avoid) => makeListenChoice(rng, id, avoid),
  (rng, id, avoid) => makeGreChoice(rng, id, avoid),
  (rng, id, avoid) => makeSpeakCheck(rng, id, avoid),
];

export type BuildUnitOptions = {
  recentFingerprints?: string[];
};

/**
 * Build one micro-lesson unit (12 steps) with anti-repeat fingerprints.
 */
export function buildDailyUnit(
  programDay: number,
  unitIndex = 0,
  options: BuildUnitOptions = {},
): DailyUnit {
  const day = ((programDay - 1) % DAILY_PROGRAM_DAYS) + 1;
  const theme = themeForDay(day);
  const seed = day * 10007 + unitIndex * 997 + 42;
  const rng = mulberry32(seed);
  const avoid = new AvoidPool(options.recentFingerprints || []);
  const recipe = RECIPES[theme.accent] || RECIPES.mix;

  const steps: DailyStep[] = [];
  recipe.forEach((key, i) => {
    const maker = MAKERS[key];
    const stepId = `${day}-${unitIndex}-s${i}`;
    let step = maker ? maker(rng, stepId, avoid, theme.accent) : null;
    if (!step) {
      for (const fb of FALLBACKS) {
        step = fb(rng, stepId, avoid, theme.accent);
        if (step) break;
      }
    }
    if (step) steps.push(step);
  });

  const titleSuffix = unitIndex === 0 ? "" : ` · 加練 ${unitIndex}`;
  return {
    id: `d${String(day).padStart(2, "0")}-u${unitIndex}`,
    programDay: day,
    unitIndex,
    titleZh: `${theme.titleZh}${titleSuffix}`,
    titleEn: theme.titleEn,
    blurb: theme.blurb,
    estimatedMinutes: 8,
    steps,
  };
}

/** Fingerprints used in a built unit (for progress tracking). */
export function unitFingerprints(unit: DailyUnit): string[] {
  return unit.steps
    .map((s) => s.fingerprint)
    .filter((f): f is string => Boolean(f));
}

export function programDayForDate(
  isoDate: string,
  cycleStart?: string,
): number {
  const start = cycleStart || isoDate;
  const t0 = Date.parse(`${start}T00:00:00`);
  const t1 = Date.parse(`${isoDate}T00:00:00`);
  if (!Number.isFinite(t0) || !Number.isFinite(t1)) return 1;
  const diff = Math.max(0, Math.floor((t1 - t0) / 86400000));
  return (diff % DAILY_PROGRAM_DAYS) + 1;
}

export function todayIsoLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
