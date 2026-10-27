import Link from "next/link";
import type { PatternTemplates } from "@/lib/patternLoop";
import patternTemplates from "@/data/pattern-templates.json";

const data = patternTemplates as PatternTemplates;

const modes = [
  {
    href: "/english/patterns/random",
    badge: "推薦",
    title: "十句型隨機集",
    meta: "120 句一輪 · 今日或抽籤",
    accent: true,
  },
  {
    href: "/english/patterns/loop",
    badge: "Loop",
    title: "句型覆讀",
    meta: "單模板 TTS 循環 · 語速與停頓",
    accent: false,
  },
  {
    href: "/english/patterns/substitute",
    badge: "Drill",
    title: "抽換快打",
    meta: "同一骨架 · 高亮替換 · 跟讀或快打",
    accent: false,
  },
  {
    href: "/english/patterns/reflex",
    badge: "Drill",
    title: "問答反射",
    meta: "聽問句 · 句型答 · 選擇題",
    accent: false,
  },
] as const;

export default function PatternTrainingHubPage() {
  const templates = data.levels.reduce((n, lv) => n + lv.items.length, 0);
  const sentences = data.levels.reduce(
    (n, lv) => n + lv.items.reduce((m, it) => m + it.rows.length, 0),
    0,
  );

  return (
    <div className="space-y-6">
      <Link
        href="/english"
        className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
      >
        ← 返回英語
      </Link>
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          Pattern training
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)] sm:text-3xl">
          句型訓練中心
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          聽熟 → 抽換 → 問答。資料來自 L0–L6 模板庫（{templates} 模板 ·{" "}
          {sentences} 句）。今日微課亦含抽換／問答小題；問答包可進{" "}
          <Link href="/english/review" className="text-[var(--accent)]">
            到期複習
          </Link>
          。
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {modes.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className={`block rounded-sm border px-4 py-4 transition hover:border-[var(--ink)] ${
              m.accent
                ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                : "border-[var(--line)] bg-[var(--surface)]"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
              {m.badge}
            </p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
              {m.title}
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">{m.meta}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
