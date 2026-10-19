"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { WordDetailCard } from "@/components/WordDetailCard";
import { suggestWords } from "@/lib/wordSense";

function DictionaryClient() {
  const searchParams = useSearchParams();
  const initial = (searchParams.get("q") || "").trim();
  const [q, setQ] = useState(initial);
  const [active, setActive] = useState(initial);

  useEffect(() => {
    const fromUrl = (searchParams.get("q") || "").trim();
    if (fromUrl) {
      setQ(fromUrl);
      setActive(fromUrl);
    }
  }, [searchParams]);

  const suggestions = useMemo(() => suggestWords(q, 10), [q]);

  function submit(word?: string) {
    const next = (word ?? q).trim();
    if (!next) return;
    setQ(next);
    setActive(next);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          Dictionary
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          字典
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          查站內 GRE／進階詞彙釋義，並帶出幽默聯想。可一鍵收進生詞袋。
        </p>
        <div className="mt-2 flex flex-wrap gap-3 text-sm">
          <Link href="/word-bag" className="text-[var(--accent)] hover:underline">
            生詞袋 →
          </Link>
          <Link href="/search" className="text-[var(--muted)] hover:underline">
            全站搜尋 →
          </Link>
        </div>
      </div>

      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="輸入英文單字…"
          className="min-w-[12rem] flex-1 rounded-sm border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <button
          type="submit"
          className="min-h-11 rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] px-4 text-sm text-[var(--ink)]"
        >
          查詢
        </button>
      </form>

      {suggestions.length > 0 && q.trim().length >= 2 ? (
        <div className="flex flex-wrap gap-2">
          <span className="self-center text-xs text-[var(--muted)]">建議：</span>
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => submit(s)}
              className={`rounded-lg border px-2.5 py-1 text-xs ${
                s === active.toLowerCase()
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)]"
                  : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent)]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}

      {active ? (
        <WordDetailCard word={active} showBagButton />
      ) : (
        <p className="rounded-sm border border-dashed border-[var(--line)] p-8 text-center text-sm text-[var(--muted)]">
          輸入單字後按查詢。命中 GRE／進階詞彙會顯示釋義與例句；若有幽默家族會一併列出。
        </p>
      )}
    </div>
  );
}

export default function DictionaryPage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-[var(--muted)]">載入字典…</p>
      }
    >
      <DictionaryClient />
    </Suspense>
  );
}
