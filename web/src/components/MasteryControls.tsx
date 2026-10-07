"use client";

import { useEffect, useState } from "react";
import { MASTERY_LABEL, getMastery, setMastery } from "@/lib/mastery";
import { scheduleFromMastery } from "@/lib/srs";
import type { Mastery } from "@/lib/types";

const OPTIONS: Mastery[] = ["unseen", "learning", "mastered"];

type Props = {
  scope: "cfa" | "en" | "speak" | "grammar" | "re" | "vocab";
  id: string | number;
};

export function MasteryControls({ scope, id }: Props) {
  const [value, setValue] = useState<Mastery>("unseen");

  useEffect(() => {
    setValue(getMastery(scope, id));
    const sync = () => setValue(getMastery(scope, id));
    window.addEventListener("omnilearn-mastery", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("omnilearn-mastery", sync);
      window.removeEventListener("storage", sync);
    };
  }, [scope, id]);

  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="知識掌握">
      {OPTIONS.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => {
              setMastery(scope, id, opt);
              scheduleFromMastery(scope, id, opt);
              setValue(opt);
            }}
            className={`rounded-full px-3 py-1 text-xs tracking-wide transition ${
              active
                ? opt === "mastered"
                  ? "bg-[var(--ink)] text-[var(--paper)]"
                  : opt === "learning"
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--muted)] text-white"
                : "border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--ink)]/30"
            }`}
          >
            {MASTERY_LABEL[opt]}
          </button>
        );
      })}
    </div>
  );
}
