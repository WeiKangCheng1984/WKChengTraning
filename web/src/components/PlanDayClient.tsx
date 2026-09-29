"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CfaPracticeDeck } from "@/components/CfaPracticeDeck";
import { EnglishAssembleDeck } from "@/components/EnglishAssembleDeck";
import {
  PLAN_DAYS,
  isDayDone,
  toggleDayDone,
  type PlanDay,
} from "@/lib/plan";
import { onStorageChange } from "@/lib/persist";
import type { CfaSubject, EnglishCategory } from "@/lib/types";

type Props = {
  day: PlanDay;
  subject: CfaSubject;
  category: EnglishCategory;
};

export function PlanDayClient({ day, subject, category }: Props) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const sync = () => setDone(isDayDone(day.day));
    sync();
    return onStorageChange(sync);
  }, [day.day]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/plan" className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">
            ← 20 天計畫
          </Link>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
            DAY {String(day.day).padStart(2, "0")} · WEEK {day.week}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
            {day.titleZh}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{day.titleEn}</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
            {day.blurb}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            toggleDayDone(day.day);
            setDone(isDayDone(day.day));
          }}
          className={`rounded-sm px-4 py-2 text-sm ${
            done
              ? "bg-[var(--accent)] text-white"
              : "border border-[var(--line)] text-[var(--ink)] hover:border-[var(--accent)]"
          }`}
        >
          {done ? "已標記完成" : "標記這天完成"}
        </button>
      </div>

      <div className="rounded-sm border border-[var(--accent)]/30 bg-[var(--accent-soft)]/40 p-4 text-sm leading-relaxed text-[var(--ink)]">
        <div className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
          跨層怎麼一起用
        </div>
        <p className="mt-2">{day.crossLayer}</p>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        {PLAN_DAYS.map((d) => (
          <Link
            key={d.day}
            href={`/plan/${d.day}`}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-sm text-xs ${
              d.day === day.day
                ? "bg-[var(--ink)] text-[var(--paper)]"
                : "border border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent)]"
            }`}
          >
            {d.day}
          </Link>
        ))}
      </div>

      <CfaPracticeDeck
        terms={subject.terms}
        subjectCode={subject.code}
        subjectName={subject.nameZh}
        initialMode="recall"
      />

      <EnglishAssembleDeck
        items={category.items}
        categorySlug={category.slug}
        categoryTitle={category.titleEn || category.title}
      />
    </div>
  );
}
