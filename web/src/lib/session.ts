import { readJson, writeJson } from "./persist";

const KEY = "omnilearn-session-v1";

type Session = {
  lastSpeakSlug?: string;
  lastSpeakTitle?: string;
  lastGrammarSlug?: string;
  lastGrammarTitle?: string;
  lastPath?: string;
  /** YYYY-MM-DD of last completed English today pack step bookmark */
  englishPackDate?: string;
  englishPackStep?: number;
};

function read(): Session {
  return readJson<Session>(KEY, {});
}

export function getSession(): Session {
  return read();
}

export function setLastSpeak(slug: string, titleZh: string) {
  writeJson(KEY, {
    ...read(),
    lastSpeakSlug: slug,
    lastSpeakTitle: titleZh,
    lastPath: `/speak/${slug}`,
  });
}

export function setLastGrammar(slug: string, titleZh: string) {
  writeJson(KEY, {
    ...read(),
    lastGrammarSlug: slug,
    lastGrammarTitle: titleZh,
    lastPath: `/english/grammar/${slug}`,
  });
}

export function setLastPath(path: string) {
  writeJson(KEY, { ...read(), lastPath: path });
}

export function setEnglishPackProgress(step: number) {
  const today = new Date().toISOString().slice(0, 10);
  writeJson(KEY, {
    ...read(),
    englishPackDate: today,
    englishPackStep: step,
  });
}
