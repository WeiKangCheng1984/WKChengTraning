"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { listFavorites, type FavoriteItem } from "@/lib/favorites";
import { onStorageChange } from "@/lib/persist";

export default function SavedPage() {
  const [items, setItems] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(listFavorites());
    sync();
    return onStorageChange(sync);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Saved</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          收藏
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          收藏存在這個瀏覽器裡，清資料或換裝置後不會跟著走。
        </p>
      </div>

      {!items.length ? (
        <p className="rounded-sm border border-dashed border-[var(--line)] p-8 text-center text-sm text-[var(--muted)]">
          還沒有收藏。在計畫、練習或詞條卡片上點「收藏」即可收進來。
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((it) => (
            <li
              key={it.id}
              className="flex items-start gap-3 rounded-sm border border-[var(--line)] bg-[var(--surface)] p-4"
            >
              <SpeakButton text={it.title} label={it.title} size="sm" />
              <Link href={it.href} className="min-w-0 flex-1">
                <div className="text-xs uppercase tracking-[0.14em] text-[var(--accent)]">
                  {it.kind === "cfa"
                    ? "CFA"
                    : it.kind === "speak"
                      ? "跟讀"
                      : it.kind === "grammar"
                        ? "文法"
                        : "句型"}
                </div>
                <div className="font-medium text-[var(--ink)]">{it.title}</div>
                <div className="text-sm text-[var(--muted)]">{it.subtitle}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
