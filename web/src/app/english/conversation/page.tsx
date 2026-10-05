import Link from "next/link";
import conversation from "@/data/conversation-four.json";
import type { ConversationFourData } from "@/lib/types";

const data = conversation as ConversationFourData;

export default function ConversationIndexPage() {
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
          Conversation · 4big
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
          四大類會話公式
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          共 {data.total} 組公式：提問延展、表達觀點、講故事、傾聽共情。每類 4
          區塊 × 9 公式，含替換提示與場景說明，可 TTS 跟讀。
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.types.map((t) => (
          <Link
            key={t.slug}
            href={`/english/conversation/${t.slug}`}
            className="card-tap block min-h-28"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
              {t.titleEn}
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              {t.titleZh}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{t.summaryZh}</p>
            <p className="mt-3 text-xs text-[var(--muted)]">
              {t.blocks.reduce((n, b) => n + b.formulas.length, 0)} 公式 ·{" "}
              {t.blocks.length} 區塊
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
