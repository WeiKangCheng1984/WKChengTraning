"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CfaPracticeDeck, type PracticeMode } from "@/components/CfaPracticeDeck";
import cfa from "@/data/cfa.json";
import type { CfaData } from "@/lib/types";

const data = cfa as CfaData;

function Inner() {
  const sp = useSearchParams();
  const code = sp.get("subject") ?? "01";
  const mode = (sp.get("mode") as PracticeMode) || "recall";
  const subject = useMemo(
    () => data.subjects.find((s) => s.code === code) ?? data.subjects[0],
    [code],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/vault" className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">
            ← CFA Vault
          </Link>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
            三模式練習
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            聽詞想義 · 看義選詞 · 例句填空（間隔評分）
          </p>
        </div>
        <select
          className="rounded-sm border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm"
          value={subject.code}
          onChange={(e) => {
            window.location.href = `/vault/practice?subject=${e.target.value}&mode=${mode}`;
          }}
        >
          {data.subjects.map((s) => (
            <option key={s.code} value={s.code}>
              {s.code} {s.nameZh}
            </option>
          ))}
        </select>
      </div>
      <CfaPracticeDeck
        terms={subject.terms}
        subjectCode={subject.code}
        subjectName={subject.nameZh}
        initialMode={mode}
      />
    </div>
  );
}

export default function VaultPracticePage() {
  return (
    <Suspense fallback={<p className="text-[var(--muted)]">載入練習…</p>}>
      <Inner />
    </Suspense>
  );
}
