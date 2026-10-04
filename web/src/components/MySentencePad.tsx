"use client";

import { useEffect, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import {
  MAX_TEXT,
  addMySentence,
  listMySentences,
  onStorageChange,
  removeMySentence,
  type MySentence,
} from "@/lib/mySentences";
import { speakEnglish } from "@/lib/speech";

type Props = {
  categorySlug: string;
  patternId: string;
  patternEn: string;
};

export function MySentencePad({ categorySlug, patternId, patternEn }: Props) {
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState<MySentence[]>([]);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setSaved(listMySentences(categorySlug, patternId));
    sync();
    return onStorageChange(sync);
  }, [categorySlug, patternId]);

  useEffect(() => {
    setDraft("");
    setHint(null);
  }, [patternId]);

  function speakDraft() {
    const text = draft.trim();
    if (!text) {
      setHint("先輸入英文句子再朗讀");
      return;
    }
    setHint(null);
    speakEnglish(text);
  }

  function save() {
    const item = addMySentence({
      categorySlug,
      patternId,
      patternEn,
      text: draft,
    });
    if (!item) {
      setHint("請輸入非空白句子");
      return;
    }
    setHint("已存到本機練習本");
    setDraft("");
  }

  return (
    <div className="mt-5 space-y-3 rounded-sm border border-dashed border-[var(--line)] bg-white/70 p-4">
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
          我的句子
        </p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          用這個句型自己造句，可朗讀並存到本機（每類最多 40 句）
        </p>
      </div>

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value.slice(0, MAX_TEXT))}
        rows={2}
        placeholder="Type your sentence in English…"
        className="w-full resize-y rounded-sm border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={speakDraft}
          className="min-h-10 rounded-sm border border-[var(--accent)] px-3 py-2 text-sm text-[var(--ink)] hover:bg-[var(--accent-soft)]"
        >
          朗讀
        </button>
        <button
          type="button"
          onClick={save}
          className="min-h-10 rounded-sm bg-[var(--ink)] px-3 py-2 text-sm text-[var(--paper)] hover:bg-[var(--ink-soft)]"
        >
          存到練習本
        </button>
        <span className="text-[11px] text-[var(--muted)]">
          {draft.trim().length}/{MAX_TEXT}
        </span>
        {hint ? (
          <span className="text-xs text-[var(--muted)]">{hint}</span>
        ) : null}
      </div>

      {saved.length > 0 ? (
        <ul className="space-y-2 border-t border-[var(--line)] pt-3">
          {saved.slice(0, 6).map((s) => (
            <li
              key={s.id}
              className="flex items-start justify-between gap-2 text-sm"
            >
              <div className="flex min-w-0 items-start gap-2">
                <SpeakButton text={s.text} label={s.text} size="sm" />
                <p className="text-[var(--ink)]">{s.text}</p>
              </div>
              <button
                type="button"
                onClick={() => removeMySentence(categorySlug, s.id)}
                className="shrink-0 text-xs text-[var(--muted)] hover:text-[var(--ink)]"
              >
                刪除
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
