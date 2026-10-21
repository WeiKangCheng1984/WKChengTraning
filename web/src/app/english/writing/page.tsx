import Link from "next/link";
import essayWriting from "@/data/essay-writing.json";
import { CopyTextButton } from "@/components/CopyTextButton";
import type { EssayWritingData } from "@/lib/types";

const data = essayWriting as EssayWritingData;

export default function WritingLabIndexPage() {
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
          Writing · Argumentative
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
          {data.titleZh}
        </h1>
        <p className="mt-1 text-sm text-[var(--accent)]">{data.subtitleZh}</p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          {data.introZh}
        </p>
        <p className="mt-2 text-xs text-[var(--muted)]">
          目標字數 {data.wordTarget.min}–{data.wordTarget.max} ·{" "}
          {data.themeCount} 主題 · {data.scenarioCount} 實景 ·{" "}
          {data.templateCount} 模板
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          怎麼練
        </h2>
        <ol className="grid gap-3 sm:grid-cols-2">
          {data.howTo.map((step) => (
            <li
              key={step.step}
              className="rounded-sm border border-[var(--line)] bg-[var(--surface)] px-4 py-4"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
                Step {step.step}
              </p>
              <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
                {step.titleZh}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                {step.bodyZh}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 rounded-sm border border-[var(--line)] bg-[var(--surface)] p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          四段高分架構
        </h2>
        <ul className="space-y-2">
          {data.structureGuideZh.map((line) => (
            <li key={line} className="text-sm text-[var(--ink)]">
              · {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          跨主題通用樞紐句
        </h2>
        <p className="text-sm text-[var(--muted)]">
          掌握模板後，可用這三句銜接破題、批判與行動段。
        </p>
        <ul className="space-y-3">
          {data.bridgeSentences.map((b) => (
            <li
              key={b.id}
              className="rounded-sm border border-[var(--line)] bg-[var(--paper)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-xs text-[var(--accent)]">{b.roleZh}</p>
                <CopyTextButton text={b.en} label="複製" />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]">
                {b.en}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          八大核心主題
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {data.themes.map((theme) => (
            <Link
              key={theme.slug}
              href={`/english/writing/${theme.slug}`}
              className="card-tap block min-h-28"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
                Theme {theme.id} · {theme.titleEn}
              </p>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                {theme.titleZh}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                {theme.scenarios.map((s) => s.titleZh).join(" · ")}
              </p>
              <p className="mt-3 text-xs text-[var(--muted)]">
                3 實景 · ~{theme.template.wordCountApprox} 字範文 ·{" "}
                {theme.slots.length} 槽位
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
