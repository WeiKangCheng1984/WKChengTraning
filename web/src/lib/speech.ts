export type SpeakSpeed = "fast" | "slow" | "normal";

const RATES: Record<SpeakSpeed, number> = {
  fast: 1.1,
  normal: 0.92,
  slow: 0.65,
};

type SpeakOptions = {
  onEnd?: () => void;
  speed?: SpeakSpeed;
};

export function speakEnglish(
  text: string,
  onEndOrOpts?: (() => void) | SpeakOptions,
) {
  if (typeof window === "undefined" || !text.trim()) return;
  const synth = window.speechSynthesis;
  if (!synth) return;

  const opts: SpeakOptions =
    typeof onEndOrOpts === "function"
      ? { onEnd: onEndOrOpts }
      : onEndOrOpts || {};

  synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = RATES[opts.speed || "normal"];

  const voices = synth.getVoices();
  const preferred =
    voices.find((v) => v.lang.startsWith("en") && /US|United/i.test(v.lang)) ??
    voices.find((v) => v.lang.startsWith("en"));
  if (preferred) utter.voice = preferred;

  if (opts.onEnd) {
    utter.onend = () => opts.onEnd?.();
    utter.onerror = () => opts.onEnd?.();
  }

  synth.speak(utter);
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}
