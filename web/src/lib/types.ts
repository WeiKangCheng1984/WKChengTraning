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
