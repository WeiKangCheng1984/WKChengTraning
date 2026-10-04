"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import cfa from "@/data/cfa.json";
import english from "@/data/english.json";
import grammar from "@/data/grammar.json";
import speak from "@/data/speak.json";
import type { CfaData, EnglishData, GrammarData, SpeakData } from "@/lib/types";

const cfaData = cfa as CfaData;
const enData = english as EnglishData;
const grammarData = grammar as GrammarData;
const speakData = speak as SpeakData;

type Hit = {
  kind: "cfa" | "en" | "grammar" | "speak";
  id: string;
  title: string;
  subtitle: string;
  href: string;
  speak: string;
};

export default function SearchPage() {
  const [q, setQ] = useState("");

  const hits = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (query.length < 2) return [] as Hit[];
    const out: Hit[] = [];

    for (const s of cfaData.subjects) {
      for (const t of s.terms) {
        const blob =
          `${t.termEn} ${t.termZh} ${t.definition} ${t.example}`.toLowerCase();
        if (!blob.includes(query)) continue;
        out.push({
          kind: "cfa",
          id: `cfa-${t.id}`,
          title: t.termEn,
          subtitle: `${s.nameZh} · ${t.termZh}`,
          href: `/vault/${s.code}`,
          speak: t.termEn,
        });
        if (out.length >= 40) return out;
      }
    }

    for (const L of grammarData.lessons) {
      const blob = [
        L.titleEn,
        L.titleZh,
        L.focus,
        L.passage.en,
        L.passage.zh,
        ...L.examples.map((e) => `${e.en} ${e.zh}`),
        ...L.idioms.map((i) => `${i.phrase} ${i.gloss}`),
      ]
        .join(" ")
        .toLowerCase();
      if (!blob.includes(query)) continue;
      out.push({
        kind: "grammar",
        id: L.id,
        title: L.titleEn,
        subtitle: `文法 L${String(L.num).padStart(2, "0")} · ${L.titleZh}`,
        href: `/english/grammar/${L.slug}`,
        speak: L.passage.en.slice(0, 180),
      });
      if (out.length >= 55) return out;
    }

    for (const c of enData.categories) {
      for (const it of c.items) {
        const blob =
          `${it.en} ${it.zh} ${it.note} ${it.examples.map((e) => `${e.en} ${e.zh}`).join(" ")}`.toLowerCase();
        if (!blob.includes(query)) continue;
        out.push({
          kind: "en",
          id: it.id,
          title: it.en,
          subtitle: `${c.titleEn || c.title} · ${it.zh}`,
          href: `/english/${c.slug}`,
          speak: it.en,
        });
        if (out.length >= 70) return out;
      }
    }

    for (const a of speakData.articles) {
      for (const seg of a.segments) {
        const blob =
          `${a.titleEn} ${a.titleZh} ${seg.en} ${seg.zh}`.toLowerCase();
        if (!blob.includes(query)) continue;
        out.push({
          kind: "speak",
          id: seg.id,
          title: seg.en,
          subtitle: `${a.titleZh} · ${seg.zh}`,
          href: `/speak/${a.slug}`,
          speak: seg.en,
        });
        if (out.length >= 90) return out;
      }
    }
    return out;
  }, [q]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          Search
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          搜尋
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          可搜 CFA、文法、句型與跟讀。試 appraisal、under contract 或 planning。
        </p>
      </div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="輸入至少 2 個字…"
        className="w-full rounded-sm border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
        autoFocus
      />
      <p className="text-sm text-[var(--muted)]">
        {q.trim().length < 2 ? "開始輸入以搜尋" : `${hits.length} 筆結果`}
      </p>
      <ul className="space-y-2">
        {hits.map((h) => (
          <li
            key={h.id}
            className="flex items-start gap-3 rounded-sm border border-[var(--line)] bg-[var(--surface)] p-4"
          >
            <SpeakButton text={h.speak} label={h.title} size="sm" />
            <Link href={h.href} className="min-w-0 flex-1">
              <div className="text-xs uppercase tracking-[0.14em] text-[var(--accent)]">
                {h.kind === "cfa"
                  ? "CFA"
                  : h.kind === "speak"
                    ? "跟讀"
                    : h.kind === "grammar"
                      ? "文法"
                      : "句型"}
              </div>
              <div className="font-medium text-[var(--ink)]">{h.title}</div>
              <div className="text-sm text-[var(--muted)]">{h.subtitle}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
