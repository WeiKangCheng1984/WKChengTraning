"use client";

import { useEffect, useState } from "react";
import { speakEnglish } from "@/lib/speech";

type Props = {
  text: string;
  label?: string;
  size?: "sm" | "md";
};

export function SpeakButton({ text, label = "發音", size = "md" }: Props) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    // Chrome often needs a voices refresh
    window.speechSynthesis.getVoices();
  }, []);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!text.trim()) return;
    setPlaying(true);
    speakEnglish(text, () => setPlaying(false));
  }

  const dim =
    size === "sm"
      ? "h-8 w-8 text-[11px]"
      : "h-10 w-10 text-xs";

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`播放英語發音：${label}`}
      aria-label={`播放英語發音：${label}`}
      className={`inline-flex ${dim} shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--accent)] shadow-sm transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] ${
        playing ? "ring-2 ring-[var(--accent)]/40" : ""
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"}
        fill="currentColor"
        aria-hidden
      >
        <path d="M3 10v4h4l5 4V6L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.3-3.9v7.8A4.5 4.5 0 0 0 16.5 12zM14 4.8v2.1a6.5 6.5 0 0 1 0 10.2v2.1A8.5 8.5 0 0 0 14 4.8z" />
      </svg>
    </button>
  );
}
