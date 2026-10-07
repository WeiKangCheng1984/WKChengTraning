import Link from "next/link";
import greVocabulary from "@/data/gre-vocabulary.json";
import type { GreVocabularyData } from "@/lib/types";

const data = greVocabulary as GreVocabularyData;

export default function GreVocabIndexPage() {
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
          GRE Vocabulary
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
          GRE 單字
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          共 {data.total} 詞；可語音例句{" "}
          {data.withSpeakableExamples ?? data.total} 條；反義約{" "}
          {data.withAntonyms}
          。每詞含英文例句 TTS、釋義、近義／反義與用法提示。
        </p>
      </div>

      <Link href="/english/gre/drill" className="focus-cta">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">
          Flashcards
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          GRE 閃卡
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          全庫或依字母；可只背未掌握／詳情詞
        </p>
      </Link>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
        {data.letters.map((l) => (
          <Link
            key={l.slug}
            href={`/english/gre/${l.slug}`}
            className="card-tap flex min-h-16 flex-col items-center justify-center px-2 py-3 text-center"
          >
            <span className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              {l.letter}
            </span>
            <span className="mt-1 text-[10px] text-[var(--muted)]">
              {l.wordCount}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
