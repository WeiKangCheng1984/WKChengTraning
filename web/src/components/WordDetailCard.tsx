"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import {
  addWordToBag,
  getWordBagItem,
  WORD_BAG_SOFT_CAP,
} from "@/lib/wordBag";
import { lookupWordSense, type WordSenseResult } from "@/lib/wordSense";

type Props = {
  /** Word to look up */
  word: string;
  /** Optional capture context from word bag */
  context?: string;
  sourceHref?: string;
  /** Compact: hide bag button when already on bag page actions nearby */
  showBagButton?: boolean;
  className?: string;
};

function Row({ label, value }: { label: string; value?: string }) {
  if (!value?.trim()) return null;
  return (
    <p className="text-sm leading-relaxed text-[var(--ink)]">
      <span className="text-[var(--muted)]">{label}：</span>
      {value}
    </p>
  );
}

export function WordDetailCard({
  word,
  context,
  sourceHref,
  showBagButton = true,
  className = "",
}: Props) {
  const sense: WordSenseResult = useMemo(() => lookupWordSense(word), [word]);
  const [toast, setToast] = useState("");
  const [bagTick, setBagTick] = useState(0);
  const inBag = useMemo(() => {
    void bagTick;
    const id = (sense.matchedAs || word).toLowerCase().replace(/’/g, "'");
    return Boolean(getWordBagItem(id) || getWordBagItem(word.toLowerCase()));
  }, [bagTick, sense.matchedAs, word]);

  function saveToBag() {
    const r = addWordToBag({
      raw: word,
      context: context || "",
      sourceHref: sourceHref || "/dictionary",
    });
    if (!r.ok) {
      setToast(r.error);
      return;
    }
    setBagTick((n) => n + 1);
    if (r.softCapReached) {
      setToast(`已收「${r.item.word}」· 未會已逾 ${WORD_BAG_SOFT_CAP}`);
      return;
    }
    setToast(r.created ? `已收「${r.item.word}」進生詞袋` : `已更新「${r.item.word}」`);
  }

  const display = sense.gre?.en || sense.vocab?.en || sense.matchedAs || word;

  return (
    <div
      className={`space-y-3 rounded-sm border border-[var(--line)] bg-[var(--surface)] p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <SpeakButton text={display} label={display} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-[var(--ink)]">{display}</p>
          {sense.matchedAs && sense.matchedAs !== normKey(word) ? (
            <p className="text-xs text-[var(--muted)]">
              依「{sense.matchedAs}」命中（你查的是 {word}）
            </p>
          ) : null}
        </div>
      </div>

      {!sense.found ? (
        <p className="text-sm text-[var(--muted)]">
          站內詞庫尚無此詞的詳細解說。可先看來源上下文，或稍後再查。
        </p>
      ) : null}

      {sense.gre ? (
        <section className="space-y-1.5 border-t border-[var(--line)] pt-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
            GRE 詞庫
          </p>
          <Row label="中文" value={sense.gre.zh} />
          <Row label="英義" value={sense.gre.endef} />
          {sense.gre.exampleEn ? (
            <div className="flex items-start gap-2">
              <SpeakButton text={sense.gre.exampleEn} label="例" size="sm" />
              <p className="text-sm text-[var(--ink)]">
                <span className="text-[var(--muted)]">例句：</span>
                {sense.gre.exampleEn}
              </p>
            </div>
          ) : (
            <Row label="例句" value={sense.gre.example} />
          )}
          <Row label="用法" value={sense.gre.exampleUsage} />
          <Row label="近義" value={sense.gre.synonyms} />
          <Row label="反義" value={sense.gre.antonyms} />
          <Row label="派生" value={sense.gre.derivatives} />
          <Row label="形近" value={sense.gre.lookalikes} />
          <Link
            href={sense.gre.href}
            className="inline-block text-xs text-[var(--accent)] hover:underline"
          >
            開 GRE · {sense.gre.letterSlug.toUpperCase()} →
          </Link>
        </section>
      ) : null}

      {sense.vocab ? (
        <section className="space-y-1.5 border-t border-[var(--line)] pt-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
            進階詞彙
          </p>
          <Row
            label="詞性／義"
            value={[sense.vocab.pos, sense.vocab.zh].filter(Boolean).join(" · ")}
          />
          {sense.vocab.ipa ? (
            <p className="text-sm text-[var(--muted)]">{sense.vocab.ipa}</p>
          ) : null}
          {sense.vocab.exampleEn ? (
            <div className="flex items-start gap-2">
              <SpeakButton text={sense.vocab.exampleEn} label="例" size="sm" />
              <p className="text-sm text-[var(--ink)]">
                <span className="text-[var(--muted)]">例句：</span>
                {sense.vocab.exampleEn}
              </p>
            </div>
          ) : null}
          <Link
            href={sense.vocab.href}
            className="inline-block text-xs text-[var(--accent)] hover:underline"
          >
            開詞表 · {sense.vocab.tableTitleZh} →
          </Link>
        </section>
      ) : null}

      {sense.humor.length > 0 ? (
        <section className="space-y-2 border-t border-[var(--line)] pt-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
            幽默聯想
          </p>
          {sense.humor.map((h) => (
            <div
              key={`${h.clusterId}-${h.headword}`}
              className="rounded-sm border border-[var(--line)] bg-[var(--bg)] p-3"
            >
              <p className="text-xs text-[var(--muted)]">
                {h.typeZh} · {h.titleZh}
              </p>
              {h.zhGloss ? (
                <p className="mt-1 text-sm text-[var(--ink)]">
                  <span className="text-[var(--muted)]">鉤子：</span>
                  {h.zhGloss}
                </p>
              ) : null}
              {h.speakLineEn ? (
                <div className="mt-1 flex items-start gap-2">
                  <SpeakButton text={h.speakLineEn} label="念" size="sm" />
                  <div>
                    <p className="text-sm text-[var(--ink)]">{h.speakLineEn}</p>
                    {h.speakLineZh ? (
                      <p className="text-xs text-[var(--muted)]">{h.speakLineZh}</p>
                    ) : null}
                  </div>
                </div>
              ) : null}
              <Link
                href={h.href}
                className="mt-2 inline-block text-xs text-[var(--accent)] hover:underline"
              >
                去劇場課 →
              </Link>
            </div>
          ))}
        </section>
      ) : null}

      {context ? (
        <section className="border-t border-[var(--line)] pt-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
            來源上下文
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">{context}</p>
          {sourceHref ? (
            <Link
              href={sourceHref}
              className="mt-1 inline-block text-xs text-[var(--accent)] hover:underline"
            >
              回來源 →
            </Link>
          ) : null}
        </section>
      ) : null}

      <div className="flex flex-wrap gap-2 border-t border-[var(--line)] pt-3">
        {showBagButton ? (
          <button
            type="button"
            onClick={saveToBag}
            className="min-h-9 rounded-lg border border-[var(--sky)] bg-[var(--sky-soft)] px-3 text-xs text-[var(--ink)]"
          >
            {inBag ? "更新生詞袋" : "收進生詞袋"}
          </button>
        ) : null}
        <Link
          href={`/dictionary?q=${encodeURIComponent(display)}`}
          className="inline-flex min-h-9 items-center rounded-lg border border-[var(--line)] px-3 text-xs text-[var(--muted)] hover:border-[var(--accent)]"
        >
          開字典
        </Link>
        <Link
          href={`/search`}
          className="inline-flex min-h-9 items-center rounded-lg border border-[var(--line)] px-3 text-xs text-[var(--muted)] hover:border-[var(--accent)]"
        >
          全站搜尋
        </Link>
      </div>
      {toast ? (
        <p className="text-xs text-[var(--accent)]" role="status">
          {toast}
        </p>
      ) : null}
    </div>
  );
}

function normKey(s: string) {
  return s.trim().toLowerCase().replace(/’/g, "'");
}
