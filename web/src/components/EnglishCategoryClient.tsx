"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { MasteryControls } from "@/components/MasteryControls";
import { getMastery } from "@/lib/mastery";
import type { EnglishCategory, EnglishItem, Mastery } from "@/lib/types";

type Props = {
  category: EnglishCategory;
};

export function EnglishCategoryClient({ category }: Props) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | Mastery>("all");
  const [tick, setTick] = useState(0);
  const [openId, setOpenId] = useState<string | null>(category.items[0]?.id ?? null);

  const items = useMemo(() => {
    void tick;
    const query = q.trim().toLowerCase();
    return category.items.filter((it) => {
      const mastery = getMastery("en", it.id);
      if (filter !== "all" && mastery !== filter) return false;
      if (!query) return true;
      return (
        it.en.toLowerCase().includes(query) ||
        it.zh.includes(query) ||
        it.examples.some(
          (ex) =>
            ex.en.toLowerCase().includes(query) || ex.zh.includes(query),
        )
      );
    });
  }, [category.items, q, filter, tick]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/english"
            className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
          >
            ← 全部類別
          </Link>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
            {category.title}
          </h1>
          {category.description ? (
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
              {category.description}
            </p>
          ) : null}
        </div>
        <Link
          href={`/english/drill?cat=${category.slug}`}
          className="rounded-sm bg-[var(--ink)] px-4 py-2 text-sm text-[var(--paper)] hover:bg-[var(--ink-soft)]"
        >
          本類背誦
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜尋句型／片語／例句…"
          className="w-full flex-1 rounded-sm border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value as "all" | Mastery);
            setTick((t) => t + 1);
          }}
          className="rounded-sm border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm"
        >
          <option value="all">全部掌握度</option>
          <option value="unseen">未學</option>
          <option value="learning">學習中</option>
          <option value="mastered">已掌握</option>
        </select>
      </div>

      <ul className="space-y-3">
        {items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            open={openId === item.id}
            onToggle={() =>
              setOpenId((id) => (id === item.id ? null : item.id))
            }
            onMasteryChange={() => setTick((t) => t + 1)}
          />
        ))}
      </ul>
    </div>
  );
}

function ItemRow({
  item,
  open,
  onToggle,
  onMasteryChange,
}: {
  item: EnglishItem;
  open: boolean;
  onToggle: () => void;
  onMasteryChange: () => void;
}) {
  return (
    <li className="rounded-sm border border-[var(--line)] bg-[var(--surface)]">
      <div className="flex items-start gap-3 p-4">
        <SpeakButton text={item.en} label={item.en} size="sm" />
        <button type="button" onClick={onToggle} className="min-w-0 flex-1 text-left">
          <div className="font-medium text-[var(--ink)]">
            <span className="mr-2 text-[var(--muted)]">{item.num}.</span>
            {item.en}
          </div>
          <div className="text-sm text-[var(--muted)]">{item.zh}</div>
        </button>
        <button type="button" onClick={onToggle} className="text-xs text-[var(--accent)]">
          {open ? "收合" : "展開"}
        </button>
      </div>
      {open && (
        <div className="space-y-4 border-t border-[var(--line)] px-4 py-4">
          {item.note ? (
            <p className="text-sm text-[var(--accent)]">注意：{item.note}</p>
          ) : null}
          {item.formal ? (
            <p className="text-sm text-[var(--muted)]">書面對應：{item.formal}</p>
          ) : null}
          <div className="space-y-3">
            {item.examples.map((ex, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="rounded-sm bg-[var(--paper)] p-3"
              >
                <div className="mb-1 flex items-center gap-2 text-xs text-[var(--accent)]">
                  {ex.tag}
                  <SpeakButton text={ex.en} label="例句" size="sm" />
                </div>
                <p className="text-sm text-[var(--ink)]">{ex.en}</p>
                {ex.zh ? (
                  <p className="mt-1 text-sm text-[var(--muted)]">{ex.zh}</p>
                ) : null}
              </div>
            ))}
          </div>
          <div
            onClick={onMasteryChange}
            onKeyDown={onMasteryChange}
            role="presentation"
          >
            <MasteryControls scope="en" id={item.id} />
          </div>
        </div>
      )}
    </li>
  );
}
