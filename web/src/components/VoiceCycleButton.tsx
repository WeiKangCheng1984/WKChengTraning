"use client";

import { useCallback, useEffect, useState } from "react";
import {
  cycleEnglishVoice,
  getActiveEnglishVoice,
  listEnglishVoices,
  resolveStoredVoice,
  shortVoiceLabel,
  speakVoiceSample,
  subscribeEnglishVoices,
} from "@/lib/speechVoice";

export function VoiceCycleButton() {
  const [label, setLabel] = useState("發音");
  const [count, setCount] = useState(0);

  const syncLabel = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const voices = listEnglishVoices(window.speechSynthesis.getVoices());
    setCount(voices.length);
    const active = resolveStoredVoice(voices) ?? getActiveEnglishVoice();
    setLabel(shortVoiceLabel(active));
  }, []);

  useEffect(() => {
    syncLabel();
    return subscribeEnglishVoices(syncLabel);
  }, [syncLabel]);

  useEffect(() => {
    const onVoice = () => syncLabel();
    window.addEventListener("omnilearn-tts-voice", onVoice);
    return () => window.removeEventListener("omnilearn-tts-voice", onVoice);
  }, [syncLabel]);

  function handleClick() {
    const { voice, total } = cycleEnglishVoice();
    if (!voice || total === 0) return;
    setLabel(shortVoiceLabel(voice));
    setCount(total);
    speakVoiceSample(voice);
  }

  const title =
    count <= 1
      ? `英文發音：${label}（此瀏覽器僅 ${count} 個英文聲音）`
      : `英文發音：${label}（點擊換下一個，共 ${count} 個）`;

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex max-w-[9.5rem] min-h-10 items-center gap-1.5 truncate rounded-lg border border-white/25 px-2.5 text-sm text-white/95 hover:bg-white/10 sm:max-w-[11rem] sm:px-3"
      aria-label={title}
      title={title}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 shrink-0"
        fill="currentColor"
        aria-hidden
      >
        <path d="M3 10v4h4l5 4V6L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.3-3.9v7.8A4.5 4.5 0 0 0 16.5 12z" />
      </svg>
      <span className="truncate">{label}</span>
      <span className="shrink-0 text-white/70" aria-hidden>
        ↻
      </span>
    </button>
  );
}
