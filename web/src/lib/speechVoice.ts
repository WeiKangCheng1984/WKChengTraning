import { readJson, writeJson } from "./persist";

export const TTS_VOICE_URI_KEY = "omnilearn-tts-voice-uri";

const SAMPLE_PHRASE = "Hello. This is a sample of the current voice.";

function synth() {
  if (typeof window === "undefined") return null;
  return window.speechSynthesis ?? null;
}

/** Prefer US English, then other en-*; stable sort for cycling. */
export function listEnglishVoices(all = synth()?.getVoices() ?? []): SpeechSynthesisVoice[] {
  const en = all.filter((v) => v.lang.toLowerCase().startsWith("en"));
  return [...en].sort((a, b) => {
    const score = (v: SpeechSynthesisVoice) => {
      const lang = v.lang.toLowerCase();
      if (lang.startsWith("en-us")) return 0;
      if (lang.includes("us")) return 1;
      if (lang.startsWith("en-gb")) return 2;
      return 3;
    };
    const d = score(a) - score(b);
    if (d !== 0) return d;
    return a.name.localeCompare(b.name);
  });
}

export function getStoredVoiceUri(): string | null {
  const raw = readJson<string | null>(TTS_VOICE_URI_KEY, null);
  return typeof raw === "string" && raw.trim() ? raw.trim() : null;
}

export function setStoredVoiceUri(voiceURI: string) {
  writeJson(TTS_VOICE_URI_KEY, voiceURI);
  window.dispatchEvent(new Event("omnilearn-tts-voice"));
}

export function defaultEnglishVoice(
  voices = listEnglishVoices(synth()?.getVoices() ?? []),
): SpeechSynthesisVoice | undefined {
  return (
    voices.find((v) => v.lang.startsWith("en") && /US|United/i.test(v.lang)) ??
    voices[0]
  );
}

export function resolveStoredVoice(
  voices = listEnglishVoices(synth()?.getVoices() ?? []),
): SpeechSynthesisVoice | undefined {
  const uri = getStoredVoiceUri();
  if (uri) {
    const hit = voices.find((v) => v.voiceURI === uri);
    if (hit) return hit;
  }
  return defaultEnglishVoice(voices);
}

/** Voice used for playback: stored choice or browser default. */
export function getActiveEnglishVoice(): SpeechSynthesisVoice | undefined {
  const s = synth();
  if (!s) return undefined;
  const voices = listEnglishVoices(s.getVoices());
  return resolveStoredVoice(voices);
}

export function shortVoiceLabel(voice: SpeechSynthesisVoice | undefined): string {
  if (!voice) return "預設";
  const name = voice.name.replace(/\s+/g, " ").trim();
  if (name.length <= 14) return name;
  return `${name.slice(0, 12)}…`;
}

export type CycleVoiceResult = {
  voice: SpeechSynthesisVoice | undefined;
  total: number;
  index: number;
};

/** Next English voice in list; wraps. Persists choice. */
export function cycleEnglishVoice(): CycleVoiceResult {
  const s = synth();
  if (!s) return { voice: undefined, total: 0, index: 0 };

  const voices = listEnglishVoices(s.getVoices());
  if (voices.length === 0) {
    return { voice: undefined, total: 0, index: 0 };
  }

  const current = resolveStoredVoice(voices);
  let idx = current ? voices.findIndex((v) => v.voiceURI === current.voiceURI) : -1;
  if (idx < 0) idx = 0;
  const nextIdx = voices.length === 1 ? 0 : (idx + 1) % voices.length;
  const next = voices[nextIdx]!;
  setStoredVoiceUri(next.voiceURI);

  return { voice: next, total: voices.length, index: nextIdx };
}

export function speakVoiceSample(voice: SpeechSynthesisVoice, rate = 0.92) {
  const s = synth();
  if (!s) return;
  s.cancel();
  const utter = new SpeechSynthesisUtterance(SAMPLE_PHRASE);
  utter.lang = voice.lang || "en-US";
  utter.voice = voice;
  utter.rate = rate;
  s.speak(utter);
}

export function subscribeEnglishVoices(onChange: () => void) {
  const s = synth();
  if (!s) return () => {};
  const refresh = () => onChange();
  refresh();
  s.addEventListener("voiceschanged", refresh);
  return () => s.removeEventListener("voiceschanged", refresh);
}
