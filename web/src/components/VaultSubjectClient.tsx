"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { MasteryControls } from "@/components/MasteryControls";
import { FavoriteButton } from "@/components/FavoriteButton";
import { getMastery } from "@/lib/mastery";
import type { CfaSubject, CfaTerm, Mastery } from "@/lib/types";

type Props = {
  subject: CfaSubject;
};

export function VaultSubjectClient({ subject }: Props) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | Mastery>("all");
  const [tick, setTick] = useState(0);
  const [openId, setOpenId] = useState<number | null>(subject.terms[0]?.id ?? null);

  const terms = useMemo(() => {
    void tick;
    const query = q.trim().toLowerCase();
    return subject.terms.filter((t) => {
      const mastery = getMastery("cfa", t.id);
      if (filter !== "all" && mastery !== filter) return false;
      if (!query) return true;
      return (
        t.termEn.toLowerCase().includes(query) ||
        t.termZh.includes(query) ||
        t.definition.includes(query) ||
        t.example.toLowerCase().includes(query)
      );
    });
  }, [subject.terms, q, filter, tick]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/vault" className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">
            ← 全部科目
          </Link>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
            {subject.nameZh}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {subject.nameEn} · {subject.terms.length} 詞條
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/vault/practice?subject=${subject.code}`}
            className="rounded-sm bg-[var(--ink)] px-4 py-2 text-sm text-[var(--paper)] hover:bg-[var(--ink-soft)]"
          >
            本科目三模式練習
          </Link>
          <Link
            href={`/vault/drill?subject=${subject.code}`}
            className="rounded-sm border border-[var(--line)] px-4 py-2 text-sm text-[var(--ink)]"
          >
            閃卡
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜尋英文／中文／定義…"
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

      <p className="text-sm text-[var(--muted)]">顯示 {terms.length} 筆</p>

      <ul className="space-y-3">
        {terms.map((term) => (
          <TermRow
            key={term.id}
            term={term}
            subjectCode={subject.code}
            open={openId === term.id}
            onToggle={() => setOpenId((id) => (id === term.id ? null : term.id))}
            onMasteryChange={() => setTick((t) => t + 1)}
          />
        ))}
      </ul>
    </div>
  );
}

function TermRow({
  term,
  subjectCode,
  open,
  onToggle,
  onMasteryChange,
}: {
  term: CfaTerm;
  subjectCode: string;
  open: boolean;
  onToggle: () => void;
  onMasteryChange: () => void;
}) {
  return (
    <li className="rounded-sm border border-[var(--line)] bg-[var(--surface)]">
      <div className="flex items-start gap-3 p-4">
        <SpeakButton text={term.termEn} label={term.termEn} size="sm" />
        <button type="button" onClick={onToggle} className="min-w-0 flex-1 text-left">
          <div className="font-medium text-[var(--ink)]">{term.termEn}</div>
          <div className="text-sm text-[var(--muted)]">{term.termZh}</div>
        </button>
        <button
          type="button"
          onClick={onToggle}
          className="text-xs text-[var(--accent)]"
        >
          {open ? "收合" : "展開"}
        </button>
      </div>
      {open && (
        <div
          className="space-y-4 border-t border-[var(--line)] px-4 py-4"
          onClick={onMasteryChange}
        >
          <Field label="定義" text={term.definition} />
          <Field label="用法" text={term.usage} />
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
              英語會話例句
              <SpeakButton text={term.example} label="例句" size="sm" />
            </div>
            <p className="text-sm leading-relaxed text-[var(--ink)]">{term.example}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <FavoriteButton
              id={`cfa:${term.id}`}
              kind="cfa"
              title={term.termEn}
              subtitle={term.termZh}
              href={`/vault/${subjectCode}`}
            />
            <MasteryControls scope="cfa" id={term.id} />
          </div>
        </div>
      )}
    </li>
  );
}

function Field({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
        {label}
      </div>
      <p className="mt-1 text-sm leading-relaxed text-[var(--ink)]">{text}</p>
    </div>
  );
}
