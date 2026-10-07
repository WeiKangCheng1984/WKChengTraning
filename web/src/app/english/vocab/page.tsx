import Link from "next/link";
import vocabulary from "@/data/vocabulary.json";
import type { VocabularyData } from "@/lib/types";

const data = vocabulary as VocabularyData;

export default function VocabIndexPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/english"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← English
        </Link>
        <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          Vocabulary · {data.level}
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
          進階詞彙
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          共 {data.total} 詞、{data.tables.length}{" "}
          表。職場精準用詞（定義／搭配／例句）；每詞可 TTS、標記掌握度。
        </p>
      </div>

      <Link href="/english/vocab/drill" className="focus-cta">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">
          Flashcards
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          進階詞彙閃卡
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          全庫或分表；可只背未掌握
        </p>
      </Link>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.tables.map((t) => (
          <Link
            key={t.slug}
            href={`/english/vocab/${t.slug}`}
            className="card-tap block min-h-28"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
              表 {t.id} · {t.titleEn}
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              {t.titleZh}
            </h2>
            <p className="mt-2 text-xs text-[var(--muted)]">
              {t.wordCount} 詞 · {t.parts.length} Parts · {t.level}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
