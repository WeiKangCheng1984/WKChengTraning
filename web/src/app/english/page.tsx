import Link from "next/link";
import english from "@/data/english.json";
import grammar from "@/data/grammar.json";
import conversation from "@/data/conversation-four.json";
import style from "@/data/style-phrases.json";
import vocabulary from "@/data/vocabulary.json";
import type {
  ConversationFourData,
  EnglishData,
  GrammarData,
  StylePhrasesData,
  VocabularyData,
} from "@/lib/types";

const data = english as EnglishData;
const grammarData = grammar as GrammarData;
const convData = conversation as ConversationFourData;
const styleData = style as StylePhrasesData;
const vocabData = vocabulary as VocabularyData;

export default function EnglishIndexPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          English
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)] sm:text-3xl">
          英語
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">
          句型庫與文法／慣用語兩條線，可分開練。
        </p>
      </div>

      <Link href="/english/today" className="focus-cta">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">
          Today pack · 約 20 分
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          今日英語套餐
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          文法短文 → 跟讀 → 句型 → 到期複習
        </p>
      </Link>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/english/grammar"
          className="block rounded-sm border border-[var(--ink)] bg-[var(--ink)] px-5 py-6 text-[var(--paper)] transition hover:brightness-110"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent-soft-text)]">
            Grammar & Usage
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl">
            文法與慣用語
          </h2>
          <p className="mt-2 text-sm text-white/70">
            {grammarData.total} 課 · 生活／房產場景 · 跟讀 TTS
          </p>
          <span className="mt-4 inline-block text-sm">打開 →</span>
        </Link>
        <Link
          href="/english/drill"
          className="card-tap flex flex-col justify-between"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
              Patterns
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              句型組句練習
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              全部 {data.total} 組跨類練習
            </p>
          </div>
          <span className="mt-4 text-sm text-[var(--ink)]">開始 →</span>
        </Link>
        <Link href="/english/review" className="card-tap block">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
            Review
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
            英語到期複習
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            文法／跟讀／句型 · 標掌握度後會進入隊列
          </p>
        </Link>
        <Link href="/english/conversation" className="card-tap block">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
            Conversation
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
            四大類會話公式
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {convData.total} 公式 · 提問／觀點／故事／共情
          </p>
        </Link>
        <Link href="/english/style" className="card-tap block">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
            Style
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
            美式風格句型
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {styleData.total} 句 · 發語詞／連接器／慣用句／緩衝
          </p>
        </Link>
        <Link href="/english/vocab" className="card-tap block sm:col-span-2">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
            Vocabulary · B2–C1
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
            進階詞彙
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {vocabData.total} 詞 · {vocabData.tables.length}{" "}
            表 · 職場精準用詞／搭配／例句
          </p>
        </Link>
      </div>

      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          句型分類
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {data.categories.map((c) => (
            <Link
              key={c.slug}
              href={`/english/${c.slug}`}
              className="card-tap block min-h-24"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                  {c.title}
                </h3>
                <span className="shrink-0 text-xs text-[var(--muted)]">
                  {c.items.length} 組
                </span>
              </div>
              {c.description ? (
                <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                  {c.description}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
