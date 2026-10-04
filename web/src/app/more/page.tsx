import Link from "next/link";

const links = [
  {
    href: "/plan",
    title: "計畫",
    body: "20 天：每日 CFA＋English。",
  },
  {
    href: "/search",
    title: "搜尋",
    body: "跨庫搜尋詞條、句型、跟讀。",
  },
  {
    href: "/saved",
    title: "收藏",
    body: "本機收藏。",
  },
  {
    href: "/vault/drill",
    title: "CFA 閃卡",
    body: "快速翻卡複習。",
  },
  {
    href: "/english/drill",
    title: "English 組句",
    body: "跨分類組句練習。",
  },
];

const later = [
  { title: "Real Estate", body: "房地產相關內容（之後補）。" },
  { title: "Lifestyle", body: "生活相關內容（之後補）。" },
];

export default function MorePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          更多
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          CFA · English · Real Estate · Lifestyle
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="card-tap block">
            <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
              {l.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {l.body}
            </p>
          </Link>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-[var(--muted)]">之後</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {later.map((l) => (
            <div
              key={l.title}
              className="rounded-sm border border-dashed border-[var(--line)] bg-[var(--surface)]/60 px-5 py-5"
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
                {l.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{l.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
