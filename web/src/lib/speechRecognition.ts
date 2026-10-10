/** Phase A: browser Web Speech API recognition (Chrome / Edge). */

export type RecognitionResult = {
  transcript: string;
  confidence: number;
};

type SpeechRec = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((ev: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEventLike = {
  results: {
    length: number;
    [index: number]: { isFinal: boolean; 0: { transcript: string; confidence: number } };
  };
};

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRec;
    webkitSpeechRecognition?: new () => SpeechRec;
  }
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createRecognizer(opts: {
  lang?: string;
  onResult: (r: RecognitionResult) => void;
  onError: (message: string) => void;
  onEnd: () => void;
}): SpeechRec | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Ctor) return null;

  const rec = new Ctor();
  rec.lang = opts.lang ?? "en-US";
  rec.continuous = false;
  rec.interimResults = false;
  rec.maxAlternatives = 1;

  rec.onresult = (ev) => {
    const last = ev.results[ev.results.length - 1];
    if (!last) return;
    const alt = last[0];
    opts.onResult({
      transcript: (alt?.transcript || "").trim(),
      confidence: typeof alt?.confidence === "number" ? alt.confidence : 0,
    });
  };
  rec.onerror = (ev) => {
    const map: Record<string, string> = {
      "not-allowed": "請允許麥克風權限後再試。",
      "no-speech": "沒有偵測到語音，請再試一次。",
      "audio-capture": "找不到麥克風裝置。",
      network: "語音辨識需要網路（瀏覽器雲端服務）。",
      aborted: "已取消辨識。",
    };
    opts.onError(map[ev.error] || `辨識錯誤：${ev.error}`);
  };
  rec.onend = () => opts.onEnd();
  return rec;
}
