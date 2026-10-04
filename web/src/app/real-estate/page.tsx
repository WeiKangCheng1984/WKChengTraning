"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FavoriteButton } from "@/components/FavoriteButton";
import { MasteryControls } from "@/components/MasteryControls";
import { SpeakButton } from "@/components/SpeakButton";
import re from "@/data/real-estate.json";
import type { RealEstateData } from "@/lib/types";

const data = re as RealEstateData;

export default function RealEstatePage() {
  const [q, setQ] = useState("");
  const [sectionId, setSectionId] = useState<number | "all">("all");

  const terms = useMemo(() => {
    const query = q.trim().toLowerCase();
    return data.sections.flatMap((s) =>
      s.terms
        .filter((t) => {
          if (sectionId !== "all" && s.id !== sectionId) return false;
          if (!query) return true;
          return (
            t.en.toLowerCase().includes(query) ||
            t.zh.includes(query) ||
            t.note.toLowerCase().includes(query)
          );
        })
        .map((t) => ({ ...t, sectionTitle: s.titleZh })),
    );
  }, [q, sectionId]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          Real Estate
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
          房地產英語
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-[var(--muted)]">
          共 {data.total} 詞、{data.phrases.length} 句高頻。美式住宅／小型投資；TTS
          朗讀。可搭配{" "}
          <Link href="/english/grammar" className="text-[var(--ink)] underline">
            文法課
          </Link>
          。
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          高頻句子
        </h2>
        <ul className="space-y-2">
          {data.phrases.map((p) => (
            <li
              key={p.id}
              className="flex gap-3 rounded-sm border border-[var(--line)] bg-[var(--surface)] px-4 py-4"
            >
              <SpeakButton text={p.en} label={p.en} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-base font-medium text-[var(--ink)]">{p.en}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{p.zh}</p>
              </div>
              <MasteryControls scope="re" id={p.id} />
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜尋英文／中文…"
          className="w-full flex-1 rounded-sm border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
        />
        <select
          value={sectionId === "all" ? "all" : String(sectionId)}
          onChange={(e) =>
            setSectionId(
              e.target.value === "all" ? "all" : Number(e.target.value),
            )
          }
          className="min-h-12 rounded-sm border border-[var(--line)] bg-[var(--surface)] px-3 text-sm"
        >
          <option value="all">全部分類</option>
          {data.sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.titleZh}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-[var(--muted)]">{terms.length} 詞</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {terms.map((t) => (
          <div
            key={t.id}
            className="rounded-sm border border-[var(--line)] bg-[var(--surface)] px-4 py-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 gap-3">
                <SpeakButton text={t.en.split("/")[0].trim()} label={t.en} />
                <div className="min-w-0">
                  <p className="text-xs text-[var(--accent)]">{t.sectionTitle}</p>
                  <h3 className="mt-1 font-medium text-[var(--ink)]">{t.en}</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">{t.zh}</p>
                  {t.note ? (
                    <p className="mt-1 text-xs text-[var(--muted)]">{t.note}</p>
                  ) : null}
                </div>
              </div>
              <FavoriteButton
                id={`re:${t.id}`}
                kind="re"
                title={t.en}
                subtitle={t.zh}
                href="/real-estate"
              />
            </div>
            <div className="mt-3">
              <MasteryControls scope="re" id={t.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
