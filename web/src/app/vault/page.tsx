import Link from "next/link";
import cfa from "@/data/cfa.json";
import type { CfaData } from "@/lib/types";

const data = cfa as CfaData;

export default function VaultIndexPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
            CFA Vault
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
            Level 1 專有名詞庫
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
            共 {data.total} 詞條，來源 {data.source}。選擇科目瀏覽，或直接進入閃卡背誦。
          </p>
        </div>
        <Link
          href="/vault/drill"
          className="rounded-sm bg-[var(--accent)] px-4 py-2 text-sm text-white hover:brightness-110"
        >
          全部閃卡練習
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.subjects.map((s) => (
          <Link
            key={s.code}
            href={`/vault/${s.code}`}
            className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]/45"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-xs text-[var(--muted)]">{s.code}</span>
              <span className="text-xs text-[var(--muted)]">{s.terms.length} 詞</span>
            </div>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
              {s.nameZh}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{s.nameEn}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
