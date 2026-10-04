export function speakEnglish(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !text.trim()) return;
  const synth = window.speechSynthesis;
  if (!synth) return;

  synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = 0.92;

  const voices = synth.getVoices();
  const preferred =
    voices.find((v) => v.lang.startsWith("en") && /US|United/i.test(v.lang)) ??
    voices.find((v) => v.lang.startsWith("en"));
  if (preferred) utter.voice = preferred;

  if (onEnd) {
    utter.onend = () => onEnd();
    utter.onerror = () => onEnd();
  }

  synth.speak(utter);
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}
