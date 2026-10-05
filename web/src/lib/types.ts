export type Mastery = "unseen" | "learning" | "mastered";

export type CfaTerm = {
  id: number;
  termEn: string;
  termZh: string;
  definition: string;
  usage: string;
  example: string;
};

export type CfaSubject = {
  code: string;
  nameZh: string;
  nameEn: string;
  terms: CfaTerm[];
};

export type CfaData = {
  source: string;
  total: number;
  subjects: CfaSubject[];
};

export type EnglishExample = {
  tag: string;
  en: string;
  zh: string;
};

export type EnglishItem = {
  id: string;
  num: number;
  kind: "pattern" | "phrasal";
  en: string;
  zh: string;
  note: string;
  formal?: string;
  examples: EnglishExample[];
};

export type EnglishCategory = {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  items: EnglishItem[];
};

export type EnglishData = {
  source: string;
  total: number;
  categories: EnglishCategory[];
};

export type SpeakSegment = {
  id: string;
  en: string;
  zh: string;
};

export type SpeakArticle = {
  id: string;
  slug: string;
  series: string;
  seriesZh: string;
  seriesEn: string;
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  durationHint: string;
  audioPath: string;
  audioFile: string;
  status: "draft" | "ready";
  segmentCount: number;
  segments: SpeakSegment[];
};

export type SpeakSeries = {
  id: string;
  slug: string;
  titleZh: string;
  titleEn: string;
  description: string;
  audioDir: string;
};

export type SpeakData = {
  source: string;
  series: SpeakSeries[];
  total: number;
  articles: SpeakArticle[];
};

export type GrammarExample = {
  tag: string;
  en: string;
  zh: string;
};

export type GrammarContrast = {
  bad: string;
  good: string;
  note: string;
};

export type GrammarIdiom = {
  phrase: string;
  gloss: string;
  domain: string;
};

export type GrammarLesson = {
  id: string;
  num: number;
  slug: string;
  bookId: number;
  bookTitle: string;
  titleZh: string;
  titleEn: string;
  focus: string;
  contrasts: GrammarContrast[];
  rules: string[];
  examples: GrammarExample[];
  passage: { en: string; zh: string; words: number };
  idioms: GrammarIdiom[];
  practices: string[];
  answers: string[];
};

export type GrammarBook = {
  id: number;
  title: string;
  blurb: string;
};

export type GrammarData = {
  source: string;
  total: number;
  audio: "tts";
  books: GrammarBook[];
  lessons: GrammarLesson[];
};

export type RealEstateTerm = {
  id: string;
  en: string;
  zh: string;
  note: string;
};

export type RealEstateSection = {
  id: number;
  slug: string;
  titleZh: string;
  terms: RealEstateTerm[];
};

export type RealEstatePhrase = {
  id: string;
  en: string;
  zh: string;
};

export type RealEstateData = {
  source: string;
  total: number;
  audio: "tts";
  sections: RealEstateSection[];
  phrases: RealEstatePhrase[];
};

export type ConversationFormula = {
  num: number;
  id: string;
  en: string;
  substitutions: string;
  scenarioZh: string;
};

export type ConversationBlock = {
  id: string;
  titleZh: string;
  subtitle: string;
  scenario: string;
  formulaFrom: number;
  formulaTo: number;
  formulas: ConversationFormula[];
};

export type ConversationFourType = {
  id: number;
  slug: string;
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  blocks: ConversationBlock[];
};

export type ConversationFourData = {
  source: string;
  total: number;
  types: ConversationFourType[];
};

export type StylePhraseItem = {
  en: string;
  noteZh: string;
};

export type StylePhraseGroup = {
  titleZh: string;
  intro: string;
  items: StylePhraseItem[];
};

export type StyleSection = {
  num: number;
  slug: string;
  titleZh: string;
  subtitle: string;
  groups: StylePhraseGroup[];
};

export type StyleStage = {
  id: number;
  slug: string;
  titleZh: string;
  titleEn: string;
  intro: string;
  sections: StyleSection[];
};

export type StylePhrasesData = {
  source: string;
  total: number;
  stages: StyleStage[];
};
