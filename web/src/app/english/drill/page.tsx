"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { EnglishAssembleDeck } from "@/components/EnglishAssembleDeck";
import english from "@/data/english.json";
import type { EnglishData } from "@/lib/types";

const data = english as EnglishData;

function DrillInner() {
  const sp = useSearchParams();
  const cat = sp.get("cat");

  const { items, title, slug } = useMemo(() => {
    const cats = cat
      ? data.categories.filter((c) => c.slug === cat)
      : data.categories;
    return {
      items: cats.flatMap((c) => c.items),
      title: cat
        ? cats[0]?.titleEn || cats[0]?.title || "類別練習"
        : "English 全庫組句",
      slug: cat || cats[0]?.slug || "all",
    };
  }, [cat]);

  return (
    <div className="space-y-6">
      <Link
        href="/english"
        className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
      >
        ← 返回 English
      </Link>
      <EnglishAssembleDeck
        items={items}
        categorySlug={slug}
        categoryTitle={title}
      />
    </div>
  );
}

export default function EnglishDrillPage() {
  return (
    <Suspense fallback={<p className="text-[var(--muted)]">載入練習…</p>}>
      <DrillInner />
    </Suspense>
  );
}
