import { readJson, writeJson } from "./persist";

export type PlanDay = {
  day: number;
  week: number;
  titleZh: string;
  titleEn: string;
  blurb: string;
  cfaCode: string;
  enSlug: string;
  /** How CFA + English layers connect today */
  crossLayer: string;
};

/** 20-day cadence: CFA subject + English category packaged together */
export const PLAN_DAYS: PlanDay[] = [
  {
    day: 1,
    week: 1,
    titleZh: "Ethics 破冰",
    titleEn: "Ethics Openers",
    blurb: "用道德準則名詞開場，搭配「意願／計畫」句型練習表達立場。",
    cfaCode: "01",
    enSlug: "personal-plans-expressing-desires-1",
    crossLayer:
      "CFA 層講「規範是什麼」；英語層用 I'm planning to / I intend to 把合規行動說出口。",
  },
  {
    day: 2,
    week: 1,
    titleZh: "FSA 觀點",
    titleEn: "FSA Opinions",
    blurb: "財務報表名詞＋轉折／因果句型，練習解釋數字背後的邏輯。",
    cfaCode: "02",
    enSlug: "opinion-transition-logic-2",
    crossLayer:
      "先用 In terms of / It turns out that 鋪陳，再嵌入 goodwill、impairment 等術語。",
  },
  {
    day: 3,
    week: 1,
    titleZh: "Fixed Income 詢問",
    titleEn: "Rates & Requests",
    blurb: "殖利率與存續期間詞彙，搭配委婉請求與社交句型。",
    cfaCode: "03",
    enSlug: "polite-requests-networking-3",
    crossLayer:
      "會議裡問 duration／convexity 時，用 Could you walk me through… 降低壓力。",
  },
  {
    day: 4,
    week: 1,
    titleZh: "Derivatives 時效",
    titleEn: "Derivatives Timing",
    blurb: "選擇權與遠期概念，搭配時間／效率句型談截止日期與結算。",
    cfaCode: "04",
    enSlug: "time-efficiency-deadline-4",
    crossLayer:
      "用 As soon as / By the time 談 expiration、mark-to-market 的時間壓力。",
  },
  {
    day: 5,
    week: 1,
    titleZh: "Equity 假設",
    titleEn: "Equity What-ifs",
    blurb: "估值倍數與市場結構，搭配假設條件句討論情境。",
    cfaCode: "05",
    enSlug: "hypothesis-conditions-possibility-5",
    crossLayer:
      "If valuations compress… 這類假設句，正好練習 P/E、free float 的情境用法。",
  },
  {
    day: 6,
    week: 1,
    titleZh: "Portfolio 困境",
    titleEn: "Portfolio Friction",
    blurb: "行為偏差與 IPS，搭配挑戰／評估句型描述風險取捨。",
    cfaCode: "06",
    enSlug: "challenges-assessment-solutions-6",
    crossLayer:
      "談 overconfidence bias 時，用 The challenge is… / One way forward… 組織解決路徑。",
  },
  {
    day: 7,
    week: 1,
    titleZh: "Quant 語氣",
    titleEn: "Quant Cadence",
    blurb: "統計檢定名詞，搭配道地轉折與加強語氣，讓數據說明更自然。",
    cfaCode: "07",
    enSlug: "native-transitions-idiomatic-express-7",
    crossLayer:
      "報告 p-value 時用 Actually / That said 控制節奏，避免一次倒完統計行話。",
  },
  {
    day: 8,
    week: 2,
    titleZh: "Corporate 專案語",
    titleEn: "Issuer Ops Speak",
    blurb: "WACC 與資本結構，搭配工作／專案管理片語。",
    cfaCode: "08",
    enSlug: "work-project-management-8",
    crossLayer:
      "把 carry out / push back 嵌進資本預算討論，聽起來像真實專案會議。",
  },
  {
    day: 9,
    week: 2,
    titleZh: "Economics 社交",
    titleEn: "Macro Social",
    blurb: "景氣與匯率概念，用生活社交片語練習口語化解釋。",
    cfaCode: "09",
    enSlug: "daily-life-socializing-9",
    crossLayer:
      "茶水間聊 inflation／business cycle，用 catch up / hang out 類片語開場更自然。",
  },
  {
    day: 10,
    week: 2,
    titleZh: "Alternatives 系統",
    titleEn: "Alts & Systems",
    blurb: "私募與實物資產名詞，搭配科技／系統操作片語談流程。",
    cfaCode: "10",
    enSlug: "tech-systems-operations-10",
    crossLayer:
      "說明 capital call、waterfall 時，用 sync up / look up 描述對齊與查條款。",
  },
  {
    day: 11,
    week: 2,
    titleZh: "Ethics 深挖",
    titleEn: "Ethics Deep Dive",
    blurb: "回到道德科，搭配情緒／應變片語處理灰色地帶對話。",
    cfaCode: "01",
    enSlug: "emotions-adaptability-11",
    crossLayer:
      "面對利益衝突時，用 face up to / calm down 描述情緒與專業邊界。",
  },
  {
    day: 12,
    week: 2,
    titleZh: "FSA 計畫語",
    titleEn: "FSA Intent",
    blurb: "報表分析第二輪，重練「計畫／意願」句型做投資結論表述。",
    cfaCode: "02",
    enSlug: "personal-plans-expressing-desires-1",
    crossLayer:
      "I'm planning to adjust the model for… 把資本化／減損判斷說成具體下一步。",
  },
  {
    day: 13,
    week: 2,
    titleZh: "Rates 邏輯",
    titleEn: "Curve Logic",
    blurb: "固定收益第二輪，用觀點轉折句解釋曲線與利差。",
    cfaCode: "03",
    enSlug: "opinion-transition-logic-2",
    crossLayer:
      "As long as spreads stay wide… 把 credit spread 討論嵌進因果句。",
  },
  {
    day: 14,
    week: 2,
    titleZh: "Derivatives 社交問法",
    titleEn: "Derivatives Ask",
    blurb: "衍生性商品第二輪，用委婉詢問談風險與結算。",
    cfaCode: "04",
    enSlug: "polite-requests-networking-3",
    crossLayer:
      "Would you mind clarifying the payoff if… 練習把 moneyness 問清楚。",
  },
  {
    day: 15,
    week: 3,
    titleZh: "Equity 時程",
    titleEn: "Equity Timing",
    blurb: "權益市場與委託單，搭配時間效率句型談執行。",
    cfaCode: "05",
    enSlug: "time-efficiency-deadline-4",
    crossLayer:
      "We need to hit VWAP before… 把 market／limit order 放進時效句。",
  },
  {
    day: 16,
    week: 3,
    titleZh: "Portfolio 假設",
    titleEn: "Allocation Ifs",
    blurb: "投資組合第二輪，用條件句討論再平衡情境。",
    cfaCode: "06",
    enSlug: "hypothesis-conditions-possibility-5",
    crossLayer:
      "If risk tolerance drops… 練習把 IPS 限制說成可行動的假設。",
  },
  {
    day: 17,
    week: 3,
    titleZh: "Quant 解法",
    titleEn: "Quant Fixes",
    blurb: "量化方法第二輪，用困境／解法句型說明模型限制。",
    cfaCode: "07",
    enSlug: "challenges-assessment-solutions-6",
    crossLayer:
      "The issue with overfitting is… 把機器學習風險講成可評估的問題。",
  },
  {
    day: 18,
    week: 3,
    titleZh: "Corporate 語氣",
    titleEn: "Governance Tone",
    blurb: "公司治理與資金成本，搭配道地轉折讓表述更像真人。",
    cfaCode: "08",
    enSlug: "native-transitions-idiomatic-express-7",
    crossLayer:
      "Bottom line, WACC rose because… 用口語收束資本結構論點。",
  },
  {
    day: 19,
    week: 3,
    titleZh: "Macro 專案語",
    titleEn: "Macro Delivery",
    blurb: "經濟學第二輪，用專案片語描述政策傳導與交付。",
    cfaCode: "09",
    enSlug: "work-project-management-8",
    crossLayer:
      "We need to roll out the rate path narrative… 把 open market operations 講成任務。",
  },
  {
    day: 20,
    week: 3,
    titleZh: "Alts 收斂",
    titleEn: "Alts Wrap",
    blurb: "另類投資收官：片語動詞複習＋關鍵條款口說。",
    cfaCode: "10",
    enSlug: "emotions-adaptability-11",
    crossLayer:
      "用 get over / deal with 描述 J-curve 與流動性壓力下的投資人情緒管理。",
  },
];

const DONE_KEY = "omnilearn-plan-done-v1";

export function getCompletedDays(): number[] {
  return readJson<number[]>(DONE_KEY, []);
}

export function isDayDone(day: number) {
  return getCompletedDays().includes(day);
}

export function toggleDayDone(day: number) {
  const set = new Set(getCompletedDays());
  if (set.has(day)) set.delete(day);
  else set.add(day);
  writeJson(DONE_KEY, [...set].sort((a, b) => a - b));
}

export function planProgress() {
  const done = getCompletedDays().length;
  return { done, total: PLAN_DAYS.length, pct: Math.round((done / PLAN_DAYS.length) * 100) };
}
