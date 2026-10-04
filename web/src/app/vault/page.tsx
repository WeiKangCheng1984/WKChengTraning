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
            CFA
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
            Level 1 名詞
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-[var(--muted)]">
            共 {data.total} 詞。選模式練習，或依科目瀏覽。
          </p>
        </div>
        <Link
          href="/vault/drill"
          className="inline-flex min-h-12 items-center rounded-sm border border-[var(--line)] px-5 text-sm text-[var(--ink)] hover:border-[var(--accent)]"
        >
          經典閃卡
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <ModeCard
          mode="MODE 1"
          title="聽詞想義"
          body="先聽發音，自己對意思，再翻面看中文、用法與例句。"
          href="/vault/practice?mode=recall"
        />
        <ModeCard
          mode="MODE 2"
          title="看義選詞"
          body="只給中文定義脈絡下的定義，四選一——接近閱讀判斷。"
          href="/vault/practice?mode=choice"
        />
        <ModeCard
          mode="MODE 3"
          title="例句填空"
          body="把術語放回會話例句，確認你認得它在句子裡怎麼用。"
          href="/vault/practice?mode=cloze"
        />
      </div>

      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          十科目清單
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          點科目可瀏覽詞條；也可從科目頁進入該科練習。
        </p>
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
            <span className="mt-3 inline-block text-xs text-[var(--accent)]">
              練習 → /vault/practice?subject={s.code}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ModeCard({
  mode,
  title,
  body,
  href,
}: {
  mode: string;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link href={href} className="card-tap block min-h-28">
      <div className="text-xs tracking-[0.16em] text-[var(--accent)]">{mode}</div>
      <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
    </Link>
  );
}
