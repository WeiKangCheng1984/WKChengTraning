import Link from "next/link";
import { ProgressSummary } from "@/components/ProgressSummary";
import cfa from "@/data/cfa.json";
import english from "@/data/english.json";
import type { CfaData, EnglishData } from "@/lib/types";

const cfaData = cfa as CfaData;
const enData = english as EnglishData;

export default function HomePage() {
  const cfaIds = cfaData.subjects.flatMap((s) => s.terms.map((t) => t.id));
  const enIds = enData.categories.flatMap((c) => c.items.map((i) => i.id));

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-sm border border-[var(--line)] bg-[var(--ink)] px-6 py-14 text-[var(--paper)] sm:px-12 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(135deg, transparent 40%, rgba(154,123,79,0.25) 100%)",
          }}
        />
        <div className="relative max-w-2xl">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-soft-text)]">
            Personal Learning Desk
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight sm:text-5xl">
            Omni Ledger
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">
            CFA Level 1 專有名詞與個人英語句型的安靜練習場。點選發音、翻卡背誦、標記掌握度——專注學習，不喧鬧。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/vault"
              className="rounded-sm bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
            >
              進入 CFA Vault
            </Link>
            <Link
              href="/english"
              className="rounded-sm border border-white/25 px-5 py-2.5 text-sm text-white transition hover:bg-white/10"
            >
              進入 English Drill
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            本機學習進度
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            進度保存在此瀏覽器的 localStorage，清除網站資料後會重置。
          </p>
        </div>
        <ProgressSummary cfaIds={cfaIds} enIds={enIds} />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <ModuleCard
          eyebrow="CFA Vault"
          title="Level 1 專有名詞"
          body={`收錄 ${cfaData.total} 個核心術語，含定義、用法與英語會話例句。依十科目瀏覽，支援搜尋、發音與閃卡。`}
          href="/vault"
          meta={`${cfaData.subjects.length} 科目`}
        />
        <ModuleCard
          eyebrow="English Drill"
          title="句型與片語練習"
          body={`收錄 ${enData.total} 組日常／職場表達，含生活與工作例句。可聽發音、遮句練習並追蹤掌握度。`}
          href="/english"
          meta={`${enData.categories.length} 類別`}
        />
      </section>
    </div>
  );
}

function ModuleCard({
  eyebrow,
  title,
  body,
  href,
  meta,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  meta: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-sm border border-[var(--line)] bg-[var(--surface)] p-6 transition hover:border-[var(--accent)]/50 hover:shadow-[0_12px_40px_rgba(12,26,46,0.06)]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
          {eyebrow}
        </span>
        <span className="text-xs text-[var(--muted)]">{meta}</span>
      </div>
      <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)] group-hover:text-[var(--ink-soft)]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
      <span className="mt-5 inline-block text-sm text-[var(--ink)] underline-offset-4 group-hover:underline">
        開始學習 →
      </span>
    </Link>
  );
}
