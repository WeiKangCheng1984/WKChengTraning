import english from "@/data/english.json";
import grammar from "@/data/grammar.json";
import greVocab from "@/data/gre-vocabulary.json";
import oral from "@/data/oral-practice.json";
import quizBank from "@/data/quiz-bank.json";
import vocabulary from "@/data/vocabulary.json";
import { themeForDay, DAILY_PROGRAM_DAYS } from "@/lib/dailyUnit/themes";
import type {
  ContrastStep,
  DailyStep,
  DailyUnit,
  ChoiceStep,
  RevealStep,
} from "@/lib/dailyUnit/types";
import { mulberry32, pickN, pickOne, shuffleInPlace } from "@/lib/dailyUnit/rng";
import type {
  EnglishData,
  GrammarData,
  GreVocabularyData,
  OralPracticeData,
  QuizBankData,
  QuizQuestion,
  VocabularyData,
  VocabWord,
  GreWord,
  EnglishItem,
  OralSentence,
  GrammarLesson,
} from "@/lib/types";

const enData = english as EnglishData;
const grammarData = grammar as GrammarData;
const greData = greVocab as GreVocabularyData;
const oralData = oral as OralPracticeData;
const quizData = quizBank as QuizBankData;
const vocabData = vocabulary as VocabularyData;

const VOCAB_WORDS: VocabWord[] = vocabData.tables.flatMap((t) =>
  t.parts.flatMap((p) => p.words),
);
const GRE_WORDS: GreWord[] = greData.letters.flatMap((l) => l.words);
const QUIZ_QS: QuizQuestion[] = quizData.quizzes.flatMap((it) => it.questions);
const EN_ITEMS: EnglishItem[] = enData.categories.flatMap((c) => c.items);
const ORAL_SENTS: OralSentence[] = oralData.units.flatMap((u) => u.sentences);
const GRAMMAR_LESSONS: GrammarLesson[] = grammarData.lessons;

function shortZh(zh: string, max = 48) {
  const cleaned = zh.split("｜")[0]?.trim() || zh;
  return cleaned.length > max ? `${cleaned.slice(0, max)}…` : cleaned;
}

function distractors(
  rng: () => number,
  correct: string,
  pool: string[],
  n = 2,
): string[] {
  const others = pool.filter((x) => x.toLowerCase() !== correct.toLowerCase());
  return pickN(rng, others, n);
}

function vocabChoice(rng: () => number, id: string): ChoiceStep {
  const w = pickOne(rng, VOCAB_WORDS);
  const pool = VOCAB_WORDS.map((x) => x.en);
  const choices = shuffleInPlace(rng, [
    w.en,
    ...distractors(rng, w.en, pool, 2),
  ]);
  return {
    id,
    kind: "vocab_choice",
    prompt: shortZh(w.zh),
    promptHint: w.pos ? `詞性 ${w.pos}` : undefined,
    answer: w.en,
    choices,
    explainZh: w.exampleEn ? `例句：${w.exampleEn}` : undefined,
  };
}

function greChoice(rng: () => number, id: string): ChoiceStep {
  const w = pickOne(rng, GRE_WORDS);
  const pool = GRE_WORDS.map((x) => x.en);
  const choices = shuffleInPlace(rng, [
    w.en,
    ...distractors(rng, w.en, pool, 2),
  ]);
  return {
    id,
    kind: "gre_choice",
    prompt: shortZh(w.zh || w.endef, 56),
    promptHint: "GRE 詞彙",
    answer: w.en,
    choices,
    explainZh: w.exampleEn || w.endef,
  };
}

function clozeStep(rng: () => number, id: string): ChoiceStep {
  const q = pickOne(rng, QUIZ_QS);
  const choices = shuffleInPlace(rng, [...q.choices]);
  return {
    id,
    kind: "cloze",
    prompt: q.stem,
    promptHint: q.wordZh ? shortZh(q.wordZh, 40) : undefined,
    answer: q.answer,
    choices,
    explainZh: q.explainZh,
  };
}

function patternReveal(rng: () => number, id: string): RevealStep {
  const item = pickOne(rng, EN_ITEMS);
  const ex = item.examples[0];
  return {
    id,
    kind: "pattern_reveal",
    promptZh: ex?.zh || item.zh,
    answerEn: ex?.en || item.en,
    note: item.note || item.zh,
  };
}

function grammarContrast(rng: () => number, id: string): ContrastStep {
  const lesson = pickOne(rng, GRAMMAR_LESSONS);
  const c =
    lesson.contrasts.length > 0
      ? pickOne(rng, lesson.contrasts)
      : {
          bad: lesson.examples[0]?.en || "…",
          good: lesson.examples[1]?.en || lesson.examples[0]?.en || "…",
          note: lesson.focus,
        };
  return {
    id,
    kind: "grammar_contrast",
    prompt: `Lesson ${String(lesson.num).padStart(2, "0")}｜${lesson.titleZh}`,
    bad: c.bad,
    good: c.good,
    note: c.note,
  };
}

function listenChoice(rng: () => number, id: string): ChoiceStep {
  const s = pickOne(rng, ORAL_SENTS);
  const wrong = pickN(
    rng,
    ORAL_SENTS.filter((x) => x.id !== s.id),
    2,
  ).map((x) => shortZh(x.zh));
  const answer = shortZh(s.zh);
  const choices = shuffleInPlace(rng, [answer, ...wrong]);
  return {
    id,
    kind: "listen_choice",
    prompt: "聽英語，選正確中文意思",
    answer,
    choices,
    speakText: s.en,
    explainZh: s.en,
  };
}

function speakCheck(rng: () => number, id: string): RevealStep {
  const s = pickOne(rng, ORAL_SENTS);
  return {
    id,
    kind: "speak_check",
    promptZh: shortZh(s.zh),
    answerEn: s.en,
    note: s.tip,
  };
}

type Builder = (rng: () => number, id: string) => DailyStep;

const BUILDERS: Record<string, Builder[]> = {
  vocab: [vocabChoice, vocabChoice, clozeStep, patternReveal, vocabChoice, listenChoice, clozeStep, speakCheck, greChoice, patternReveal],
  pattern: [patternReveal, clozeStep, patternReveal, vocabChoice, grammarContrast, listenChoice, clozeStep, patternReveal, speakCheck, vocabChoice],
  grammar: [grammarContrast, clozeStep, patternReveal, grammarContrast, listenChoice, vocabChoice, clozeStep, speakCheck, greChoice, grammarContrast],
  quiz: [clozeStep, clozeStep, vocabChoice, clozeStep, listenChoice, clozeStep, greChoice, patternReveal, clozeStep, speakCheck],
  oral: [listenChoice, speakCheck, listenChoice, patternReveal, clozeStep, speakCheck, vocabChoice, listenChoice, speakCheck, clozeStep],
  gre: [greChoice, clozeStep, greChoice, listenChoice, greChoice, patternReveal, clozeStep, speakCheck, greChoice, vocabChoice],
  mix: [vocabChoice, clozeStep, patternReveal, listenChoice, greChoice, grammarContrast, clozeStep, speakCheck, vocabChoice, patternReveal],
};

/**
 * Build one micro-lesson unit.
 * @param programDay 1–30
 * @param unitIndex 0 = main daily unit; 1+ = extra practice
 */
export function buildDailyUnit(programDay: number, unitIndex = 0): DailyUnit {
  const day = ((programDay - 1) % DAILY_PROGRAM_DAYS) + 1;
  const theme = themeForDay(day);
  const seed = day * 10007 + unitIndex * 997 + 42;
  const rng = mulberry32(seed);
  const builders = BUILDERS[theme.accent] || BUILDERS.mix;
  const steps = builders.map((fn, i) => fn(rng, `${day}-${unitIndex}-s${i}`));

  const titleSuffix = unitIndex === 0 ? "" : ` · 加練 ${unitIndex}`;
  return {
    id: `d${String(day).padStart(2, "0")}-u${unitIndex}`,
    programDay: day,
    unitIndex,
    titleZh: `${theme.titleZh}${titleSuffix}`,
    titleEn: theme.titleEn,
    blurb: theme.blurb,
    estimatedMinutes: 7,
    steps,
  };
}

/** Calendar → program day (1–30), using cycleStart or today as day 1 anchor */
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
