"use client";

import { useMemo, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import { gradeCard } from "@/lib/srs";
import type { CfaTerm } from "@/lib/types";

export type PracticeMode = "recall" | "choice" | "cloze";

type Props = {
  terms: CfaTerm[];
  subjectCode: string;
  subjectName: string;
  initialMode?: PracticeMode;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function blankExample(term: CfaTerm): { prompt: string; answer: string } {
  const ex = term.example || term.termEn;
  const re = new RegExp(term.termEn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  if (re.test(ex)) {
    return { prompt: ex.replace(re, "______"), answer: term.termEn };
  }
  return {
    prompt: `填入術語：${term.definition.slice(0, 80)}…`,
    answer: term.termEn,
  };
}

export function CfaPracticeDeck({
  terms,
  subjectCode,
  subjectName,
  initialMode = "recall",
}: Props) {
  const pool = useMemo(() => shuffle(terms).slice(0, Math.min(20, terms.length)), [terms]);
  const [mode, setMode] = useState<PracticeMode>(initialMode);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [seed, setSeed] = useState(0);

  const current = pool[index];
  const choices = useMemo(() => {
    if (!current || mode !== "choice") return [];
    const others = shuffle(terms.filter((t) => t.id !== current.id))
      .slice(0, 3)
      .map((t) => t.termEn);
    return shuffle([current.termEn, ...others]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, mode, seed]);

  const cloze = current ? blankExample(current) : null;

  function resetCard() {
    setRevealed(false);
    setPicked(null);
    setSeed((s) => s + 1);
  }

  function go(delta: number) {
    if (!pool.length) return;
    setIndex((i) => (i + delta + pool.length) % pool.length);
    resetCard();
  }

  function onGrade(g: "again" | "good" | "easy") {
    if (!current) return;
    gradeCard("cfa", current.id, g);
    go(1);
  }

  if (!current) {
    return <p className="text-[var(--muted)]">這個科目沒有詞條可練。</p>;
  }

  return (
    <section className="space-y-5 rounded-sm border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
            CFA Practice · {subjectName}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {index + 1} / {pool.length}（每次抽 20 詞）
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["recall", "MODE 1 聽詞想義"],
              ["choice", "MODE 2 看義選詞"],
              ["cloze", "MODE 3 例句填空"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setMode(id);
                resetCard();
              }}
              className={`rounded-full px-3 py-1 text-xs ${
                mode === id
                  ? "bg-[var(--ink)] text-[var(--paper)]"
                  : "border border-[var(--line)] text-[var(--muted)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-sm border border-[var(--line)] bg-[var(--paper)] p-6">
        {mode === "recall" && (
          <>
            <div className="flex items-center gap-3">
              <SpeakButton text={current.termEn} label={current.termEn} />
              <div>
                <div className="text-xs text-[var(--accent)]">先聽／看英文術語</div>
                <div className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
                  {current.termEn}
                </div>
              </div>
            </div>
            {!revealed ? (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="mt-6 rounded-sm border border-[var(--line)] bg-white px-4 py-2 text-sm"
              >
                顯示中文定義與用法
              </button>
            ) : (
              <div className="mt-5 space-y-2 text-sm leading-relaxed">
                <p>
                  <strong>{current.termZh}</strong>
                </p>
                <p className="text-[var(--muted)]">{current.definition}</p>
                <p className="text-[var(--muted)]">用法：{current.usage}</p>
                <div className="flex items-start gap-2 pt-2">
                  <SpeakButton text={current.example} label="例句" size="sm" />
                  <p>{current.example}</p>
                </div>
              </div>
            )}
          </>
        )}

        {mode === "choice" && (
          <>
            <div className="text-xs text-[var(--accent)]">只看定義，選出正確術語</div>
            <p className="mt-3 text-lg text-[var(--ink)]">{current.definition}</p>
            <div className="mt-5 grid gap-2">
              {choices.map((c) => {
                const correct = c === current.termEn;
                const show = picked !== null;
                return (
                  <button
                    key={c}
                    type="button"
                    disabled={picked !== null}
                    onClick={() => setPicked(c)}
                    className={`rounded-sm border px-3 py-2 text-left text-sm ${
                      show && correct
                        ? "border-emerald-700 bg-emerald-50"
                        : show && picked === c
                          ? "border-red-700 bg-red-50"
                          : "border-[var(--line)] bg-white hover:border-[var(--accent)]"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
            {picked && (
              <div className="mt-4 text-sm text-[var(--muted)]">
                答案：{current.termEn}（{current.termZh}）
              </div>
            )}
          </>
        )}

        {mode === "cloze" && cloze && (
          <>
            <div className="mb-3 flex items-center gap-2 text-xs text-[var(--accent)]">
              把術語放回句子
              {!revealed && (
                <SpeakButton text={current.example} label="聽整句" size="sm" />
              )}
            </div>
            <p className="text-lg leading-relaxed text-[var(--ink)]">{cloze.prompt}</p>
            {!revealed ? (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="mt-6 rounded-sm border border-[var(--line)] bg-white px-4 py-2 text-sm"
              >
                顯示答案
              </button>
            ) : (
              <div className="mt-4 flex items-center gap-2">
                <SpeakButton text={cloze.answer} label={cloze.answer} size="sm" />
                <span className="text-xl text-[var(--ink)]">{cloze.answer}</span>
                <span className="text-sm text-[var(--muted)]">（{current.termZh}）</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FavoriteButton
          id={`cfa:${current.id}`}
          kind="cfa"
          title={current.termEn}
          subtitle={current.termZh}
          href={`/vault/${subjectCode}`}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onGrade("again")}
            className="rounded-sm border border-[var(--line)] px-3 py-2 text-sm"
          >
            再練
          </button>
          <button
            type="button"
            onClick={() => onGrade("good")}
            className="rounded-sm border border-[var(--accent)] px-3 py-2 text-sm text-[var(--ink)]"
          >
            記得
          </button>
          <button
            type="button"
            onClick={() => onGrade("easy")}
            className="rounded-sm bg-[var(--ink)] px-3 py-2 text-sm text-[var(--paper)]"
          >
            很熟
          </button>
        </div>
      </div>
    </section>
  );
}
