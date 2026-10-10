"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { DeckNav } from "@/components/DeckNav";
import english from "@/data/english.json";
import grammar from "@/data/grammar.json";
import speak from "@/data/speak.json";
import { listEnglishDue } from "@/lib/englishToday";
import { onStorageChange } from "@/lib/persist";
import { gradeCard, type SrsScope } from "@/lib/srs";
import type { EnglishData, GrammarData, SpeakData } from "@/lib/types";

const grammarData = grammar as GrammarData;
const speakData = speak as SpeakData;
const enData = english as EnglishData;

type Card = {
  scope: SrsScope;
  id: string;
  title: string;
  subtitle: string;
  href: string;
  speak: string;
};

export default function EnglishReviewPage() {
  const [tick, setTick] = useState(0);
  const [history, setHistory] = useState<Card[]>([]);
  const [histIdx, setHistIdx] = useState<number | null>(null);

  useEffect(() => {
    return onStorageChange(() => setTick((t) => t + 1));
  }, []);

  const cards = useMemo(() => {
    void tick;
    const due = listEnglishDue(grammarData, speakData, enData);
    const out: Card[] = [];

    for (const d of due) {
      if (d.scope === "grammar") {
        const L = grammarData.lessons.find((x) => x.slug === d.id);
        if (!L) continue;
        out.push({
          scope: "grammar",
          id: String(d.id),
          title: L.titleEn,
          subtitle: `文法 L${String(L.num).padStart(2, "0")} · ${L.titleZh}`,
          href: `/english/grammar/${L.slug}`,
          speak: L.passage.en.slice(0, 160),
        });
      } else if (d.scope === "speak") {
        const a = speakData.articles.find((x) => x.slug === d.id);
        if (!a) continue;
        out.push({
          scope: "speak",
          id: String(d.id),
          title: a.titleEn,
          subtitle: `跟讀 · ${a.titleZh}`,
          href: `/speak/${a.slug}`,
          speak: a.segments[0]?.en ?? a.titleEn,
        });
      } else if (d.scope === "en") {
        for (const c of enData.categories) {
          const it = c.items.find((x) => x.id === d.id);
          if (!it) continue;
          out.push({
            scope: "en",
            id: String(d.id),
            title: it.en,
            subtitle: `${c.titleEn || c.title} · ${it.zh}`,
            href: `/english/${c.slug}`,
            speak: it.en,
          });
          break;
        }
      }
    }
    return out.slice(0, 30);
  }, [tick]);

  const queueHead = cards[0] ?? null;
  const viewingHistory = histIdx !== null;
  const current =
    viewingHistory && histIdx !== null ? (history[histIdx] ?? null) : queueHead;

  function grade(g: "again" | "good" | "easy") {
    if (!current || viewingHistory) return;
    gradeCard(current.scope, current.id, g);
    setHistory((h) => [...h, current].slice(-30));
    setHistIdx(null);
    setTick((t) => t + 1);
  }

  function goPrev() {
    if (histIdx === null) {
      if (history.length) setHistIdx(history.length - 1);
      return;
    }
    if (histIdx > 0) setHistIdx(histIdx - 1);
  }

  function goNext() {
    if (histIdx === null) return;
    if (histIdx < history.length - 1) setHistIdx(histIdx + 1);
    else setHistIdx(null);
  }

  const canPrev =
    history.length > 0 && (histIdx === null || histIdx > 0);
  const canNext = histIdx !== null;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/english/today"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← 今日英語微課
        </Link>
        <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          English Review
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          英語到期複習
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          含文法課、跟讀篇、句型。上一張僅回看本場已評過的卡，不會回滾間隔複習分數。
        </p>
      </div>

      {!current ? (
        <div className="rounded-sm border border-dashed border-[var(--line)] px-5 py-10 text-center text-[var(--muted)]">
          目前沒有到期項
          {history.length > 0 ? "（可按上一張回看本場紀錄）" : ""}。先去{" "}
          <Link href="/english/today" className="text-[var(--ink)] underline">
            今日英語微課
          </Link>{" "}
          練一輪並標記掌握度。
          {history.length > 0 ? (
            <div className="mt-4 flex justify-center">
              <DeckNav
                index={history.length - 1}
                total={history.length}
                onPrev={goPrev}
                onNext={goNext}
                prevLabel="上一張"
                nextLabel="下一張"
                disableNext
              />
            </div>
          ) : null}
        </div>
      ) : (
        <>
          <p className="text-sm text-[var(--muted)]">
            {viewingHistory
              ? `回看本場 · ${histIdx! + 1} / ${history.length}`
              : `剩餘 ${cards.length} 項`}
          </p>
          <div className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-6">
            {viewingHistory ? (
              <p className="mb-3 text-xs text-[var(--accent)]">
                回看（分數已寫入，僅瀏覽）
              </p>
            ) : null}
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
              {current.scope === "grammar"
                ? "文法"
                : current.scope === "speak"
                  ? "跟讀"
                  : "句型"}
            </p>
            <div className="mt-3 flex items-start gap-3">
              <SpeakButton text={current.speak} label={current.title} />
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
                  {current.title}
                </h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {current.subtitle}
                </p>
                <Link
                  href={current.href}
                  className="mt-3 inline-block text-sm text-[var(--ink)] underline"
                >
                  打開原文 →
                </Link>
              </div>
            </div>
          </div>

          {!viewingHistory ? (
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => grade("again")}
                className="min-h-12 rounded-sm border border-[var(--line)] text-sm hover:border-[var(--accent)]"
              >
                再練
              </button>
              <button
                type="button"
                onClick={() => grade("good")}
                className="min-h-12 rounded-sm bg-[var(--ink)] text-sm text-[var(--paper)] hover:brightness-110"
              >
                記得
              </button>
              <button
                type="button"
                onClick={() => grade("easy")}
                className="min-h-12 rounded-sm bg-[var(--accent)] text-sm text-white hover:brightness-110"
              >
                很熟
              </button>
            </div>
          ) : (
            <p className="text-center text-xs text-[var(--muted)]">
              回看模式不評分。按下一張可回到目前佇列。
            </p>
          )}

          <DeckNav
            index={viewingHistory ? histIdx! : 0}
            total={Math.max(history.length, 1)}
            onPrev={goPrev}
            onNext={goNext}
            prevLabel="上一張"
            nextLabel={viewingHistory ? "下一張／回佇列" : "下一張"}
            disablePrev={!canPrev}
            disableNext={!canNext}
            label={
              viewingHistory
                ? "本場紀錄"
                : history.length
                  ? "可回看本場"
                  : undefined
            }
          />
        </>
      )}
    </div>
  );
}
