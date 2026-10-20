export type ListenLevel = "easy" | "mid" | "hard";

export type ListenBlock = {
  speaker: string | null;
  en: string;
  zh: string;
};

export type ListenVoice = {
  id: "a" | "b";
  label: string;
  file: string;
};

export type ListenArticle = {
  id: string;
  level: ListenLevel;
  levelZh: string;
  words: number;
  titleEn: string;
  titleZh: string;
  theme: string;
  focus: string;
  brief: string;
  blocks: ListenBlock[];
  questions: { en: string; zh: string }[];
  voices: ListenVoice[];
};

export type ListeningData = {
  articles: ListenArticle[];
};

export function listenAudioPath(file: string) {
  return `/audio/listen/${file}`;
}
