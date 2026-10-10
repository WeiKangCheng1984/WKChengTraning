"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { onStorageChange } from "@/lib/persist";
import {
  WORD_BAG_SOFT_CAP,
  countNewWords,
  listWordBag,
  markWordKnown,
  markWordNew,
  removeWordFromBag,
  type WordBagItem,
} from "@/lib/wordBag";

type Filter = "new" | "known" | "all";

export default function WordBagPage() {
  const [filter, setFilter] = useState<Filter>("new");
  const [items, setItems] = useState<WordBagItem[]>([]);
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    const sync = () => {
      setItems(listWordBag(filter));
      setNewCount(countNewWords());
    };
    sync();
    return onStorageChange(sync);
  }, [filter]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          Word bag
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          生詞袋
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          在頁面上選取一個英文單字，點「收進生詞」。同一詞只保留一筆；預設看未會。
        </p>
        {newCount >= WORD_BAG_SOFT_CAP ? (
          <p className="mt-2 text-sm text-[var(--accent)]">
            未會已有 {newCount} 詞（建議約 {WORD_BAG_SOFT_CAP} 內），可先標「已會」清一批。
          </p>
        ) : (
          <p className="mt-2 text-sm text-[var(--muted)]">
            未會 {newCount} 詞
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["new", "未會"],
            ["known", "已會"],
            ["all", "全部"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`min-h-10 rounded-lg border px-3 text-sm ${
              filter === key
                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)]"
                : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {!items.length ? (
        <p className="rounded-sm border border-dashed border-[var(--line)] p-8 text-center text-sm text-[var(--muted)]">
          {filter === "new"
            ? "還沒有未會生詞。瀏覽課文時選取單字即可收進來。"
            : filter === "known"
              ? "還沒有標為已會的詞。"
              : "生詞袋是空的。"}
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((it) => (
            <li
              key={it.id}
              className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-4"
            >
              <div className="flex items-start gap-3">
                <SpeakButton text={it.word} label={it.word} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-medium text-[var(--ink)]">
                      {it.word}
                    </span>
                    {it.status === "known" ? (
                      <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
                        已會
                      </span>
                    ) : null}
                  </div>
                  {it.context ? (
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {it.context}
                    </p>
                  ) : null}
                  {it.sourceHref ? (
                    <Link
                      href={it.sourceHref}
                      className="mt-1 inline-block text-xs text-[var(--accent)] hover:underline"
                    >
                      回來源
                    </Link>
                  ) : null}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {it.status === "new" ? (
                  <button
                    type="button"
                    onClick={() => markWordKnown(it.id)}
                    className="min-h-9 rounded-lg border border-[var(--sky)] bg-[var(--sky-soft)] px-3 text-xs text-[var(--ink)]"
                  >
                    標為已會
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => markWordNew(it.id)}
                    className="min-h-9 rounded-lg border border-[var(--line)] px-3 text-xs text-[var(--muted)] hover:border-[var(--accent)]"
                  >
                    改回未會
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeWordFromBag(it.id)}
                  className="min-h-9 rounded-lg border border-[var(--line)] px-3 text-xs text-[var(--muted)] hover:border-[var(--accent)]"
                >
                  刪除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
