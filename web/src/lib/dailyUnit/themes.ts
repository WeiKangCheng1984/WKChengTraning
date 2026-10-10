/** 30-day Duolingo-style micro-lesson program */
export const DAILY_PROGRAM_DAYS = 30;

export type DayTheme = {
  day: number; // 1–30
  titleZh: string;
  titleEn: string;
  blurb: string;
  /** Weighting hint for content pools */
  accent: "vocab" | "pattern" | "grammar" | "quiz" | "oral" | "gre" | "mix";
};

export const DAY_THEMES: DayTheme[] = [
  { day: 1, titleZh: "開場熱身", titleEn: "Warm Start", blurb: "詞彙＋句型入門，建立每日節奏。", accent: "mix" },
  { day: 2, titleZh: "辦公室用語", titleEn: "Office Moves", blurb: "職場常見動詞與短句。", accent: "vocab" },
  { day: 3, titleZh: "想表達意見", titleEn: "Say Your View", blurb: "觀點句型＋填空。", accent: "pattern" },
  { day: 4, titleZh: "時態對比", titleEn: "Tense Check", blurb: "文法對比卡＋例句。", accent: "grammar" },
  { day: 5, titleZh: "GRE 小試", titleEn: "GRE Mini", blurb: "高階詞選擇＋挖空。", accent: "gre" },
  { day: 6, titleZh: "聽後選義", titleEn: "Listen & Pick", blurb: "聽句選中文，練耳朵。", accent: "oral" },
  { day: 7, titleZh: "一週複盤", titleEn: "Week Replay", blurb: "混合題型，鞏固本週。", accent: "mix" },
  { day: 8, titleZh: "談判用詞", titleEn: "Negotiation", blurb: "協商場景詞彙。", accent: "vocab" },
  { day: 9, titleZh: "禮貌請求", titleEn: "Polite Asks", blurb: "請求與網絡句型。", accent: "pattern" },
  { day: 10, titleZh: "完成式感", titleEn: "Perfect Feel", blurb: "現在完成相關對比。", accent: "grammar" },
  { day: 11, titleZh: "挖空衝刺", titleEn: "Cloze Sprint", blurb: "Quiz 填空為主。", accent: "quiz" },
  { day: 12, titleZh: "跟讀五句", titleEn: "Echo Five", blurb: "口語跟讀＋自評。", accent: "oral" },
  { day: 13, titleZh: "精準形容", titleEn: "Precise Adj", blurb: "形容詞辨析。", accent: "vocab" },
  { day: 14, titleZh: "雙週複盤", titleEn: "Mid Replay", blurb: "綜合複習。", accent: "mix" },
  { day: 15, titleZh: "客服場景", titleEn: "Service Talk", blurb: "服務／CRM 用語。", accent: "vocab" },
  { day: 16, titleZh: "轉折邏輯", titleEn: "Logic Shift", blurb: "轉折連接句型。", accent: "pattern" },
  { day: 17, titleZh: "未來表達", titleEn: "Future Forms", blurb: "will / going to 對比。", accent: "grammar" },
  { day: 18, titleZh: "GRE 加深", titleEn: "GRE Deeper", blurb: "定義選詞＋例句。", accent: "gre" },
  { day: 19, titleZh: "聽選加速", titleEn: "Ear Speed", blurb: "更快的聽力選擇。", accent: "oral" },
  { day: 20, titleZh: "三週複盤", titleEn: "Three-Week Mix", blurb: "混合強化。", accent: "mix" },
  { day: 21, titleZh: "飲食感官", titleEn: "Food & Sense", blurb: "感官詞彙。", accent: "vocab" },
  { day: 22, titleZh: "故事銜接", titleEn: "Story Links", blurb: "敘事連接語。", accent: "pattern" },
  { day: 23, titleZh: "條件與假設", titleEn: "If & Wish", blurb: "條件句感。", accent: "grammar" },
  { day: 24, titleZh: "測驗馬拉松", titleEn: "Quiz Stretch", blurb: "更多填空。", accent: "quiz" },
  { day: 25, titleZh: "口語壓力", titleEn: "Speak Pressure", blurb: "跟讀＋中譯英揭示。", accent: "oral" },
  { day: 26, titleZh: "高階搭配", titleEn: "Collocations", blurb: "詞彙搭配感。", accent: "vocab" },
  { day: 27, titleZh: "正式語氣", titleEn: "Formal Tone", blurb: "正式句型。", accent: "pattern" },
  { day: 28, titleZh: "易混淆點", titleEn: "Trap Points", blurb: "文法易錯對比。", accent: "grammar" },
  { day: 29, titleZh: "GRE 收束", titleEn: "GRE Wrap", blurb: "高階詞最後一輪。", accent: "gre" },
  { day: 30, titleZh: "月度總複習", titleEn: "Month Finale", blurb: "全題型綜合，慶祝養成習慣。", accent: "mix" },
];

export function themeForDay(day: number): DayTheme {
  const d = ((day - 1) % DAILY_PROGRAM_DAYS) + 1;
  return DAY_THEMES[d - 1]!;
}
