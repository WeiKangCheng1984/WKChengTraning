"use client";

import { useMemo, useState } from "react";
import { CopyTextButton } from "@/components/CopyTextButton";
import { SpeakButton } from "@/components/SpeakButton";
import type { SpeakPart4, SpeakPart4Item } from "@/lib/types";

type Props = {
  part4: SpeakPart4;
};

function fillPattern(pattern: string, swap: string): string {
  return pattern.replace(/\[SWAP\]/g, swap);
}

function Part4Card({ item }: { item: SpeakPart4Item }) {
  const [optEn, setOptEn] = useState(item.options[0]?.en ?? "");
  const filled = useMemo(
    () => fillPattern(item.pattern, optEn || item.options[0]?.en || ""),
    [item.pattern, optEn, item.options],
  );
  const optZh =
    item.options.find((o) => o.en === optEn)?.zh ?? item.options[0]?.zh ?? "";

  return (
    <li className="space-y-3 rounded-sm border border-[var(--line)] bg-[var(--surface)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--accent)]">
            {item.zhName}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            骨架：{item.pattern}
          </p>
        </div>
        <div className="flex gap-2">
          <SpeakButton text={filled} label={filled} size="sm" />
          <CopyTextButton text={filled} label="複製" />
        </div>
      </div>

      <p className="text-base font-medium leading-relaxed text-[var(--ink)]">
        {filled}
      </p>
      <p className="text-sm text-[var(--muted)]">
        {item.baseZh}
        {optZh && optEn !== item.options[0]?.en ? ` · 替換：${optZh}` : ""}
      </p>

      <div>
        <p className="text-xs text-[var(--muted)]">{item.slotLabelZh}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {item.options.map((o) => {
            const active = o.en === optEn;
            return (
              <button
                key={o.en}
                type="button"
                onClick={() => setOptEn(o.en)}
                className={`rounded-sm px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-[var(--ink)] text-[var(--paper)]"
                    : "border border-[var(--line)] text-[var(--ink)] hover:border-[var(--accent)]"
                }`}
              >
                {o.en}
                <span
                  className={
                    active ? " text-white/70" : " text-[var(--muted)]"
                  }
                >
                  {" "}
                  · {o.zh}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </li>
  );
}

export function SpeakPart4Panel({ part4 }: Props) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
          Part 4 · Templates
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          句型精粹抽換
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          {part4.introZh}
        </p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          共 {part4.items.length} 句模板
        </p>
      </div>
      <ul className="space-y-3">
        {part4.items.map((item) => (
          <Part4Card key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
