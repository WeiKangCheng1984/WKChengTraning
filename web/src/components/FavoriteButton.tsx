"use client";

import { useEffect, useState } from "react";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { onStorageChange } from "@/lib/persist";

type Props = {
  id: string;
  kind: "cfa" | "en" | "speak" | "grammar" | "re" | "vocab" | "gre";
  title: string;
  subtitle: string;
  href: string;
};

export function FavoriteButton({ id, kind, title, subtitle, href }: Props) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const sync = () => setOn(isFavorite(id));
    sync();
    return onStorageChange(sync);
  }, [id]);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = toggleFavorite({ id, kind, title, subtitle, href });
        setOn(next);
      }}
      className={`rounded-full border px-3 py-1 text-xs transition ${
        on
          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)]"
          : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent)]"
      }`}
    >
      {on ? "已收藏" : "收藏"}
    </button>
  );
}
