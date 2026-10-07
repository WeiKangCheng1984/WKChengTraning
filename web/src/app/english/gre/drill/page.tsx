"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FlashcardDeck, type FlashItem } from "@/components/FlashcardDeck";
import greVocabulary from "@/data/gre-vocabulary.json";
import type { GreVocabularyData } from "@/lib/types";

const data = greVocabulary as GreVocabularyData;

function DrillInner() {
  const sp = useSearchParams();
  const letterSlug = sp.get("letter");
  const [onlyDetailed, setOnlyDetailed] = useState(false);

  const { items, label, backHref } = useMemo(() => {
    const letters = letterSlug
      ? data.letters.filter((l) => l.slug === letterSlug)
      : data.letters;
    const list: FlashItem[] = letters.flatMap((l) =>
      l.words
        .filter((w) => (onlyDetailed ? w.detailed : true))
        .map((w) => ({
          id: w.id,
          scope: "gre" as const,
          front: w.en,
          backTitle: w.zh || w.endef || w.en,
          backBody: [
            w.endef,
            w.exampleEn ? `例句：${w.example || w.exampleEn}` : "",
            w.exampleUsage ? `用法：${w.exampleUsage}` : "",
            w.synonyms ? `近義：${w.synonyms}` : "",
            w.antonyms ? `反義：${w.antonyms}` : "",
            w.derivatives ? `派生：${w.derivatives}` : "",
          ]
            .filter(Boolean)
            .join("\n\n"),
          speakText: w.en,
          speakExample: w.exampleEn || undefined,
        })),
    );
    const label = letterSlug
      ? letters[0]
        ? `GRE · ${letters[0].letter} 閃卡`
        : "GRE 閃卡"
      : onlyDetailed
        ? "GRE 詳情詞閃卡"
        : "GRE 全庫閃卡";
    const backHref = letterSlug
      ? `/english/gre/${letterSlug}`
      : "/english/gre";
    return { items: list, label, backHref };
  }, [letterSlug, onlyDetailed]);

  return (
    <div className="space-y-6">
      <Link
        href={backHref}
        className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
      >
        ← 返回 GRE
      </Link>
      <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
        <input
          type="checkbox"
          checked={onlyDetailed}
          onChange={(e) => setOnlyDetailed(e.target.checked)}
          className="accent-[var(--accent)]"
        />
        只練詳情較完整的詞（約 {data.detailed}）
      </label>
      <p className="text-sm text-[var(--muted)]">
        {items.length} 張 · 可勾「只背未掌握／學習中」
      </p>
      <FlashcardDeck items={items} title={label} />
    </div>
  );
}

export default function GreDrillPage() {
  return (
    <Suspense fallback={<p className="text-[var(--muted)]">載入閃卡…</p>}>
      <DrillInner />
    </Suspense>
  );
}
