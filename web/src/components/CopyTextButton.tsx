"use client";

import { useState } from "react";

type Props = {
  text: string;
  label?: string;
  doneLabel?: string;
  className?: string;
};

export function CopyTextButton({
  text,
  label = "複製",
  doneLabel = "已複製",
  className = "",
}: Props) {
  const [ok, setOk] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setOk(true);
      window.setTimeout(() => setOk(false), 1800);
    } catch {
      setOk(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className={
        className ||
        "inline-flex min-h-10 items-center rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 text-sm text-[var(--ink)] hover:border-[var(--accent)]"
      }
    >
      {ok ? doneLabel : label}
    </button>
  );
}
