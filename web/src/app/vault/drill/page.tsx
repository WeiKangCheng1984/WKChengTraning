"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { FlashcardDeck, type FlashItem } from "@/components/FlashcardDeck";
import cfa from "@/data/cfa.json";
import type { CfaData } from "@/lib/types";
import { Suspense } from "react";

const data = cfa as CfaData;

function DrillInner() {
  const sp = useSearchParams();
  const subjectCode = sp.get("subject");

  const { items, label } = useMemo(() => {
    const subjects = subjectCode
      ? data.subjects.filter((s) => s.code === subjectCode)
      : data.subjects;
    const list: FlashItem[] = subjects.flatMap((s) =>
      s.terms.map((t) => ({
        id: t.id,
        scope: "cfa" as const,
        front: t.termEn,
        backTitle: t.termZh,
        backBody: `${t.definition}\n\n用法：${t.usage}\n\n例句：${t.example}`,
        speakText: t.termEn,
      })),
    );
    const label = subjectCode
      ? subjects[0]
        ? `${subjects[0].nameZh} 閃卡`
        : "科目閃卡"
      : "CFA 全庫閃卡";
    return { items: list, label };
  }, [subjectCode]);

  return (
    <div className="space-y-6">
      <Link href="/vault" className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">
        ← 返回 CFA
      </Link>
      <FlashcardDeck items={items} title={label} />
    </div>
  );
}

export default function VaultDrillPage() {
  return (
    <Suspense fallback={<p className="text-[var(--muted)]">載入閃卡…</p>}>
      <DrillInner />
    </Suspense>
  );
}
