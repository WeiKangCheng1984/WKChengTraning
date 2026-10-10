import Link from "next/link";
import type { ComponentProps } from "react";
import { CuteIcon } from "@/components/CuteIcon";

const links: Array<{
  href: string;
  title: string;
  body: string;
  icon: ComponentProps<typeof CuteIcon>["name"];
}> = [
  {
    href: "/english/today",
    title: "今日英語微課",
    body: "30 天路徑 · 完成主單元打卡 · 可加練。",
    icon: "rocket",
  },
  {
    href: "/english/today/history",
    title: "練習紀錄",
    body: "回看已完成單元與每題解析。",
    icon: "star",
  },
  {
    href: "/rewards",
    title: "打卡與徽章",
    body: "連續完成主單元、加練徽章。",
    icon: "fire",
  },
  {
    href: "/login",
    title: "登入／同步",
    body: "雲端進度（依時間合併）。",
    icon: "cloud",
  },
  {
    href: "/search",
    title: "搜尋",
    body: "跨庫搜尋詞條、句型、跟讀。",
    icon: "spark",
  },
  {
    href: "/saved",
    title: "收藏",
    body: "頁面／卡片書籤。",
    icon: "heart",
  },
  {
    href: "/word-bag",
    title: "生詞袋",
    body: "選取單字收納 · 未會優先 · 可標已會。",
    icon: "pencil",
  },
  {
    href: "/vault",
    title: "CFA 詞庫",
    body: "科目瀏覽與練習（資料保留）。",
    icon: "vault",
  },
  {
    href: "/vault/drill",
    title: "CFA 閃卡",
    body: "快速翻卡複習。",
    icon: "vault",
  },
  {
    href: "/english/grammar",
    title: "文法與慣用語",
    body: "36 課 · TTS 跟讀。",
    icon: "book",
  },
  {
    href: "/english/conversation",
    title: "四大類會話公式",
    body: "提問、觀點、講故事、傾聽。",
    icon: "mic",
  },
  {
    href: "/english/style",
    title: "美式風格句型",
    body: "發語詞、連接器、壓力緩衝。",
    icon: "spark",
  },
  {
    href: "/english/vocab",
    title: "進階詞彙",
    body: "1500 詞 · 職場精準用詞。",
    icon: "pencil",
  },
  {
    href: "/english/gre",
    title: "GRE 單字",
    body: "GRE 詞庫 · 例句 TTS。",
    icon: "book",
  },
  {
    href: "/quiz",
    title: "測驗庫",
    body: "挖空三選一 · 雙模式。",
    icon: "pencil",
  },
  {
    href: "/oral",
    title: "口語練習",
    body: "跟讀語音評分。",
    icon: "mic",
  },
  {
    href: "/speak",
    title: "跟讀短文",
    body: "逐句跟讀練習。",
    icon: "ear",
  },
  {
    href: "/english/review",
    title: "英語到期複習",
    body: "間隔複習佇列。",
    icon: "check",
  },
  {
    href: "/real-estate",
    title: "Real Estate",
    body: "房地產術語＋句子。",
    icon: "star",
  },
];

export default function MorePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          <CuteIcon name="more" className="text-2xl" />
          更多
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          主任務是今日微課打卡；這裡是工具與題庫。
        </p>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="card-tap block">
              <p className="flex items-center gap-1.5 text-sm font-medium text-[var(--ink)]">
                <CuteIcon name={l.icon} className="text-base" />
                {l.title}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">{l.body}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
