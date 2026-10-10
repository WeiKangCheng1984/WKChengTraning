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
  speakText?: string;
  /** Dedup fingerprint */
  fingerprint?: string;
};

export type RevealStep = {
  id: string;
  kind: "pattern_reveal" | "speak_check";
  promptZh: string;
  answerEn: string;
  note?: string;
  fingerprint?: string;
};

export type ContrastStep = {
  id: string;
  kind: "grammar_contrast";
  prompt: string;
  bad: string;
  good: string;
  note: string;
  fingerprint?: string;
};

export type DailyStep = ChoiceStep | RevealStep | ContrastStep;

export type DailyUnit = {
  id: string;
  programDay: number;
  unitIndex: number;
  titleZh: string;
  titleEn: string;
  blurb: string;
  estimatedMinutes: number;
  steps: DailyStep[];
};

export type StepResult = {
  step: DailyStep;
  ok: boolean;
  userAnswer?: string;
};

export type CompletedUnitRecord = {
  /** Unique session id */
  recordId: string;
  unitId: string;
  programDay: number;
  unitIndex: number;
  titleZh: string;
  titleEn: string;
  date: string;
  completedAt: string;
  correct: number;
  total: number;
  results: StepResult[];
};

export type DailyUnitProgress = {
  byDate: Record<
    string,
    {
      doneIds: string[];
      programDay: number;
    }
  >;
  cycleStart?: string;
  /** Newest first */
  history?: CompletedUnitRecord[];
  /** Recently used content fingerprints to reduce repeats */
  recentFingerprints?: string[];
};
