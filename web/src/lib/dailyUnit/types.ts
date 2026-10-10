export type DailyStepKind =
  | "vocab_choice"
  | "gre_choice"
  | "cloze"
  | "pattern_reveal"
  | "grammar_contrast"
  | "listen_choice"
  | "speak_check";

export type ChoiceStep = {
  id: string;
  kind: "vocab_choice" | "gre_choice" | "cloze" | "listen_choice";
  prompt: string;
  promptHint?: string;
  answer: string;
  choices: string[];
  explainZh?: string;
  /** For listen_choice / speak */
  speakText?: string;
};

export type RevealStep = {
  id: string;
  kind: "pattern_reveal" | "speak_check";
  promptZh: string;
  answerEn: string;
  note?: string;
};

export type ContrastStep = {
  id: string;
  kind: "grammar_contrast";
  prompt: string;
  bad: string;
  good: string;
  note: string;
};

export type DailyStep = ChoiceStep | RevealStep | ContrastStep;

export type DailyUnit = {
  /** Stable id: day-unitIndex e.g. d07-u0 */
  id: string;
  programDay: number; // 1–30
  unitIndex: number; // 0 = today's main, 1+ = extras
  titleZh: string;
  titleEn: string;
  blurb: string;
  estimatedMinutes: number;
  steps: DailyStep[];
};

export type StepResult = {
  step: DailyStep;
  ok: boolean;
  /** What the learner selected / marked */
  userAnswer?: string;
};

export type DailyUnitProgress = {
  /** ISO date YYYY-MM-DD */
  byDate: Record<
    string,
    {
      /** Completed unit ids today */
      doneIds: string[];
      /** Program day index locked for this calendar date (1–30 cycle) */
      programDay: number;
    }
  >;
  /** Absolute start date for day-1 of the 30-day cycle */
  cycleStart?: string;
};
