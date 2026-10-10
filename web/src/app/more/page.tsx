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
    href: "/rewards",
    title: "每日一小時",
    body: "練習計時、連續達標、徽章。",
  },
  {
    href: "/english/today",
    title: "今日英語套餐",
    body: "約 20 分：文法 → 跟讀 → 句型 → 複習。",
  },
  {
    href: "/english/grammar",
    title: "文法與慣用語",
    body: "36 課 · 生活／房產 · TTS 跟讀。",
  },
  {
    href: "/english/conversation",
    title: "四大類會話公式",
    body: "144 公式：提問、觀點、講故事、傾聽共情。",
  },
  {
    href: "/english/style",
    title: "美式風格句型",
    body: "發語詞、連接器、慣用句、壓力緩衝。",
  },
  {
    href: "/english/vocab",
    title: "進階詞彙",
    body: "1500 詞 · B2–C1 職場精準用詞（5 表）＋閃卡。",
  },
  {
    href: "/quiz",
    title: "測驗庫",
    body: "40 篇×25 題 · 單獨／測驗雙模式 · 三選項解析。",
  },
  {
    href: "/oral",
    title: "口語練習",
    body: "100 單元×10 句 · 跟讀語音評分（Chrome／Edge）。",
  },
  {
    href: "/english/gre",
    title: "GRE 單字",
    body: "GRE 詞庫 · 例句 TTS · 字母瀏覽。",
  },
  {
    href: "/english/review",
    title: "英語到期複習",
    body: "文法／跟讀／句型間隔複習。",
  },
  {
    href: "/english/drill",
    title: "English 組句",
    body: "跨分類組句練習。",
  },
  {
    href: "/real-estate",
    title: "Real Estate",
    body: "房地產術語＋高頻句子（TTS）。",
  },
];

const later = [
  { title: "Lifestyle", body: "生活跟讀系列（目前未開；僅站名預留）。" },
];

export default function MorePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          更多
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          CFA · English · Real Estate · Lifestyle · 頂欄可切換港灣／信號配色
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
