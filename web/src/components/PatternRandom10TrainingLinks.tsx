"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  buildSubstituteFromRandom10,
  writeSubstituteSession,
} from "@/lib/patternSubstitute";
import {
  buildSessionFromPacks,
  packsMatchingRandom10,
  writeReflexSession,
} from "@/lib/patternReflex";
import {
  readSession,
  sessionStillValid,
} from "@/lib/patternRandom10";
import type { PatternTemplates } from "@/lib/patternLoop";

export function PatternRandom10TrainingLinks({
  data,
  variant = "list",
}: {
  data: PatternTemplates;
  variant?: "list" | "compact";
}) {
  const router = useRouter();

  function prepareFromRandom10(): boolean {
    const r = readSession();
    if (!r || !sessionStillValid(r)) return false;
    return true;
  }

  function goSubstitute() {
    const r = readSession();
    if (!r || !sessionStillValid(r)) return;
    writeSubstituteSession(buildSubstituteFromRandom10(r));
    router.push("/english/patterns/substitute/play");
  }

  function goReflex() {
    if (!prepareFromRandom10()) return;
    const packs = packsMatchingRandom10(data);
    const ids = packs.length
      ? packs.map((p) => p.id)
      : ["want-basic", "im-feeling"];
    writeReflexSession(buildSessionFromPacks(ids));
    router.push("/english/patterns/reflex/play");
  }

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={goSubstitute}
          className="rounded-sm border border-[var(--line)] px-3 py-1.5 text-sm"
        >
          抽換快打
        </button>
        <button
          type="button"
          onClick={goReflex}
          className="rounded-sm border border-[var(--line)] px-3 py-1.5 text-sm"
        >
          問答反射
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-dashed border-[var(--line)] px-4 py-3">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
        完整訓練路徑
      </p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        聽熟 → 抽換 → 問答（沿用此十句型清單）
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href="/english/patterns/random/play"
          className="inline-flex min-h-10 items-center rounded-sm bg-[var(--ink)] px-4 text-sm text-[var(--paper)]"
        >
          1. 覆讀 120 句
        </Link>
        <button
          type="button"
          onClick={goSubstitute}
          className="inline-flex min-h-10 items-center rounded-sm border border-[var(--ink)] px-4 text-sm"
        >
          2. 抽換快打
        </button>
        <button
          type="button"
          onClick={goReflex}
          className="inline-flex min-h-10 items-center rounded-sm border border-[var(--ink)] px-4 text-sm"
        >
          3. 問答反射
        </button>
      </div>
    </div>
  );
}
