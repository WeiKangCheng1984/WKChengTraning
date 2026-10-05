"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import type { ConversationFourType } from "@/lib/types";

type Props = {
  type: ConversationFourType;
};

export function ConversationTypeClient({ type }: Props) {
  const [openBlock, setOpenBlock] = useState<string>(type.blocks[0]?.id ?? "A");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return type.blocks;
    return type.blocks
      .map((b) => ({
        ...b,
        formulas: b.formulas.filter(
          (f) =>
            f.en.toLowerCase().includes(query) ||
            f.scenarioZh.includes(query) ||
            f.substitutions.includes(query),
        ),
      }))
      .filter((b) => b.formulas.length > 0);
  }, [type.blocks, q]);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/english/conversation"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← 四大類會話公式
        </Link>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
          {type.titleEn}
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          {type.titleZh}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          {type.summaryZh}
        </p>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="搜尋公式或場景…"
        className="w-full rounded-sm border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
      />

      <div className="flex flex-wrap gap-2">
        {type.blocks.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setOpenBlock(b.id)}
            className={`rounded-full px-3 py-1 text-xs ${
              openBlock === b.id
                ? "bg-[var(--ink)] text-[var(--paper)]"
                : "border border-[var(--line)] text-[var(--muted)]"
            }`}
          >
            區塊 {b.id} · {b.titleZh}
          </button>
        ))}
      </div>

      {filtered.map((block) => {
        if (openBlock && block.id !== openBlock && !q.trim()) return null;
        return (
          <section
            key={block.id}
            className="space-y-4 rounded-sm border border-[var(--line)] bg-[var(--surface)] p-5"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
                區塊 {block.id} · 公式 {block.formulaFrom}–{block.formulaTo}
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
                {block.titleZh}
              </h2>
              <p className="text-sm text-[var(--muted)]">{block.subtitle}</p>
              {block.scenario ? (
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  適用：{block.scenario}
                </p>
              ) : null}
            </div>

            <ul className="space-y-3">
              {block.formulas.map((f) => (
                <li
                  key={f.id}
                  className="rounded-sm border border-[var(--line)] bg-[var(--paper)] p-4"
                >
                  <div className="flex items-start gap-2">
                    <SpeakButton
                      text={f.en.replace(/\[[^\]]+\]/g, "something")}
                      label={`公式 ${f.num}`}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[var(--accent)]">
                        公式 {String(f.num).padStart(2, "0")}
                      </p>
                      <p className="mt-1 text-base leading-relaxed text-[var(--ink)]">
                        {f.en}
                      </p>
                      {f.substitutions ? (
                        <p className="mt-2 text-xs text-[var(--muted)]">
                          替換：{f.substitutions}
                        </p>
                      ) : null}
                      {f.scenarioZh ? (
                        <p className="mt-2 text-sm text-[var(--muted)]">
                          {f.scenarioZh}
                        </p>
                      ) : null}
                    </div>
                    <FavoriteButton
                      id={`conv:${f.id}`}
                      kind="en"
                      title={f.en.slice(0, 80)}
                      subtitle={`${type.titleZh} · 公式 ${f.num}`}
                      href={`/english/conversation/${type.slug}`}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
