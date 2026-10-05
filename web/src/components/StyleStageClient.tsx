"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import type { StyleStage } from "@/lib/types";

type Props = {
  stage: StyleStage;
};

export function StyleStageClient({ stage }: Props) {
  const [q, setQ] = useState("");

  const sections = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return stage.sections;
    return stage.sections
      .map((sec) => ({
        ...sec,
        groups: sec.groups
          .map((g) => ({
            ...g,
            items: g.items.filter(
              (it) =>
                it.en.toLowerCase().includes(query) ||
                it.noteZh.includes(query) ||
                g.titleZh.includes(query),
            ),
          }))
          .filter((g) => g.items.length > 0),
      }))
      .filter((sec) => sec.groups.length > 0);
  }, [stage.sections, q]);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/english/style"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← 美式風格句型
        </Link>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
          Stage {stage.id} · {stage.titleEn}
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          {stage.titleZh}
        </h1>
        {stage.intro ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
            {stage.intro}
          </p>
        ) : null}
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="搜尋句型或說明…"
        className="w-full rounded-sm border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
      />

      {sections.map((sec) => (
        <section key={sec.slug} className="space-y-4">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              {sec.num}. {sec.titleZh}
            </h2>
            {sec.subtitle ? (
              <p className="mt-1 text-sm text-[var(--muted)]">{sec.subtitle}</p>
            ) : null}
          </div>

          {sec.groups.map((group, gi) => (
            <div
              key={`${sec.slug}-${gi}`}
              className="space-y-3 rounded-sm border border-[var(--line)] bg-[var(--surface)] p-5"
            >
              <div>
                <h3 className="text-base font-medium text-[var(--ink)]">
                  {group.titleZh}
                </h3>
                {group.intro ? (
                  <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                    {group.intro}
                  </p>
                ) : null}
              </div>
              <ul className="space-y-2">
                {group.items.map((it, ii) => (
                  <li
                    key={`${sec.slug}-${gi}-${ii}`}
                    className="flex items-start gap-2 rounded-sm bg-[var(--paper)] p-3"
                  >
                    <SpeakButton text={it.en} label={it.en.slice(0, 40)} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-relaxed text-[var(--ink)]">
                        {it.en}
                      </p>
                      {it.noteZh ? (
                        <p className="mt-1 text-xs text-[var(--muted)]">
                          {it.noteZh}
                        </p>
                      ) : null}
                    </div>
                    <FavoriteButton
                      id={`style:${stage.slug}-${sec.slug}-${gi}-${ii}`}
                      kind="en"
                      title={it.en.slice(0, 80)}
                      subtitle={`${stage.titleZh} · ${group.titleZh}`}
                      href={`/english/style/${stage.slug}`}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
