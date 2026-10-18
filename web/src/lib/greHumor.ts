export type GreHumorMember = {
  headword: string;
  zhGloss: string;
  senseAnchor: string;
  roleInScript: string;
  humorDevice?: string;
  speakLineEn: string;
  speakLineZh: string;
  inVocab?: boolean;
  vocabStatus?: string;
};

export type GreHumorQuiz = {
  id: string;
  type: string;
  promptEn: string;
  promptZh: string;
  choices: string[];
  answer: string;
};

export type GreHumorCluster = {
  id: string;
  slug: string;
  type: string;
  typeZh: string;
  typeEn: string;
  season: number;
  priority: string;
  status: string;
  titleZh: string;
  titleEn: string;
  hook: string;
  script: string;
  reviewHooks: string[];
  pitfalls: string[];
  members: GreHumorMember[];
  memberCount: number;
  quiz: GreHumorQuiz[];
  flow: Array<{ step: number; name: string; minutes: number; content: unknown }>;
  minutes: string;
};

export type GreHumorData = {
  source: string;
  version?: string;
  generatedAt?: string;
  totalClusters: number;
  uniqueWords: number;
  seasons: Array<{
    id: number;
    titleZh: string;
    titleEn: string;
    lessons: string[];
  }>;
  clusters: GreHumorCluster[];
};
