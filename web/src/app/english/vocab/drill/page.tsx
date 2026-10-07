"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { FlashcardDeck, type FlashItem } from "@/components/FlashcardDeck";
import vocabulary from "@/data/vocabulary.json";
import type { VocabularyData } from "@/lib/types";

const data = vocabulary as VocabularyData;

function DrillInner() {
  const sp = useSearchParams();
  const tableSlug = sp.get("table");

  const { items, label } = useMemo(() => {
    const tables = tableSlug
      ? data.tables.filter((t) => t.slug === tableSlug)
      : data.tables;
    const list: FlashItem[] = tables.flatMap((t) =>
      t.parts.flatMap((p) =>
        p.words.map((w) => ({
          id: w.id,
          scope: "vocab" as const,
          front: w.en,
          backTitle: w.zh,
          backBody: [
            w.ipa ? `/${w.ipa}/ · ${w.pos}` : w.pos,
            w.collocations.length
              ? `搭配：${w.collocations.map((c) => c.en).join("；")}`
              : "",
            w.exampleEn ? `例句：${w.exampleEn}` : "",
          ]
            .filter(Boolean)
            .join("\n\n"),
          speakText: w.en,
        })),
      ),
    );
    const label = tableSlug
      ? tables[0]
        ? `${tables[0].titleZh} 閃卡`
        : "詞彙閃卡"
      : "進階詞彙全庫閃卡";
    return { items: list, label };
  }, [tableSlug]);

  return (
    <div className="space-y-6">
      <Link
        href={tableSlug ? `/english/vocab/${tableSlug}` : "/english/vocab"}
        className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
      >
        ← 返回詞彙
      </Link>
      <p className="text-sm text-[var(--muted)]">
        {items.length} 張 · 可勾「只背未掌握／學習中」
      </p>
      <FlashcardDeck items={items} title={label} />
    </div>
  );
}

export default function VocabDrillPage() {
  return (
    <Suspense fallback={<p className="text-[var(--muted)]">載入閃卡…</p>}>
      <DrillInner />
    </Suspense>
  );
}
