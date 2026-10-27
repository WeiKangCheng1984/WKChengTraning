import patternTemplates from "@/data/pattern-templates.json";
import type { ChoiceStep } from "@/lib/dailyUnit/types";
import type { PatternTemplates } from "@/lib/patternLoop";
import { buildQuizForPack, listReflexPacks } from "@/lib/patternReflex";
import { pickN, shuffleInPlace } from "@/lib/dailyUnit/rng";

const templates = patternTemplates as PatternTemplates;

const TEMPLATE_ITEMS = templates.levels.flatMap((lv) => lv.items);

function itemMap() {
  return new Map(TEMPLATE_ITEMS.map((it) => [it.id, it]));
}

export function makePatternReflexChoice(
  rng: () => number,
  id: string,
  fingerprintPrefix: string,
): ChoiceStep | null {
  const packs = listReflexPacks();
  if (!packs.length) return null;
  const pack = packs[Math.floor(rng() * packs.length)]!;
  const item = itemMap().get(pack.itemId);
  if (!item || !pack.prompts.length) return null;
  const pr = pack.prompts[Math.floor(rng() * pack.prompts.length)]!;
  const quizzes = buildQuizForPack(pack, item, Math.floor(rng() * 9999));
  const quiz =
    quizzes.find((q) => q.questionEn === pr.questionEn) ?? quizzes[0];
  const target = quiz?.choices.find((c) => c.correct);
  if (!target || !quiz) return null;
  const choices = quiz.choices.map((c) => c.en);
  shuffleInPlace(rng, choices);
  return {
    id,
    kind: "pattern_reflex_choice",
    prompt: pr.questionEn,
    promptHint: pr.questionZh,
    speakText: pr.questionEn,
    answer: target.en,
    choices,
    explainZh: `${pack.titleZh} · ${item.pattern}`,
    fingerprint: `${fingerprintPrefix}:reflex:${pack.id}:${pr.answerRowIndex}`,
  };
}

export function makePatternSubstituteChoice(
  rng: () => number,
  id: string,
  fingerprintPrefix: string,
): ChoiceStep | null {
  const items = TEMPLATE_ITEMS.filter((it) => it.rows.length >= 4);
  if (!items.length) return null;
  const item = items[Math.floor(rng() * items.length)]!;
  const rowIdx = 1 + Math.floor(rng() * (item.rows.length - 1));
  const row = item.rows[rowIdx];
  if (!row) return null;
  const others = pickN(
    rng,
    item.rows.filter((_, i) => i !== rowIdx),
    3,
  ).map((r) => r.en);
  const choices = [row.en, ...others];
  shuffleInPlace(rng, choices);
  return {
    id,
    kind: "pattern_substitute_choice",
    prompt: row.zh,
    promptHint: `句型 ${item.pattern} · 選英文`,
    answer: row.en,
    choices,
    explainZh: item.zhName,
    fingerprint: `${fingerprintPrefix}:sub:${item.id}:${rowIdx}`,
  };
}
