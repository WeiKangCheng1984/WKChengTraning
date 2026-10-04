import { readJson, writeJson } from "./persist";

const KEY = "omnilearn-session-v1";

type Session = {
  lastSpeakSlug?: string;
  lastSpeakTitle?: string;
  lastPath?: string;
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

export function setLastPath(path: string) {
  writeJson(KEY, { ...read(), lastPath: path });
}
