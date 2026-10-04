import Link from "next/link";
import grammar from "@/data/grammar.json";
import type { GrammarData } from "@/lib/types";

const data = grammar as GrammarData;

export default function GrammarIndexPage() {
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
          Grammar & Usage
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
          文法與現代慣用語
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-[var(--muted)]">
          共 {data.total} 課、{data.books.length}{" "}
          冊。美式生活＋投資／房產場景；每課含跟讀短文（TTS）。與句型庫獨立。
        </p>
      </div>

      {data.books.map((book) => {
        const lessons = data.lessons.filter((l) => l.bookId === book.id);
        return (
          <section key={book.id} className="space-y-3">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
                冊 {book.id}｜{book.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                {book.blurb}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {lessons.map((l) => (
                <Link
                  key={l.slug}
                  href={`/english/grammar/${l.slug}`}
                  className="card-tap block min-h-24"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs text-[var(--muted)]">
                      Lesson {String(l.num).padStart(2, "0")}
                    </span>
                    <span className="text-xs text-[var(--accent)]">
                      {l.passage.words}w TTS
                    </span>
                  </div>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                    {l.titleZh}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">{l.titleEn}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
