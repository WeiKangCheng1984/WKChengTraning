/** Short motivational lines for check-in milestones (EN + ZH). */

export type MilestoneQuote = {
  en: string;
  zh: string;
};

/** Rotates by local calendar day so the same day feels consistent. */
export const DAILY_MOTIVATIONS: MilestoneQuote[] = [
  {
    en: "Small steps, every day, beat big plans once.",
    zh: "每天一小步，勝過偶爾的大計劃。",
  },
  {
    en: "Consistency is quieter than talent — and stronger.",
    zh: "堅持比天賦安靜，卻更有力量。",
  },
  {
    en: "Show up. The rest follows.",
    zh: "先出現，其餘才跟得上。",
  },
  {
    en: "You don’t have to be perfect. You have to be present.",
    zh: "不必完美，但要在場。",
  },
  {
    en: "One honest unit today is a vote for who you’re becoming.",
    zh: "今天認真的一課，是對未來自己的一票。",
  },
  {
    en: "Progress loves the person who returns tomorrow.",
    zh: "進步偏愛明天還會回來的人。",
  },
  {
    en: "Keep the promise you made to yourself this morning.",
    zh: "守住今早對自己許下的約定。",
  },
  {
    en: "Discipline is just self-respect in action.",
    zh: "自律，是把自己當回事的行動。",
  },
];

export function dailyMotivation(isoDate: string): MilestoneQuote {
  const dayNum = Number(isoDate.replace(/-/g, "")) || 0;
  return DAILY_MOTIVATIONS[dayNum % DAILY_MOTIVATIONS.length];
}

/** Pick a line that matches current streak milestone. */
export function quoteForStreak(streak: number): MilestoneQuote {
  if (streak >= 30) {
    return {
      en: "Thirty days of showing up — that’s a habit wearing your name.",
      zh: "連續三十天到場——這已是掛著你名字的習慣。",
    };
  }
  if (streak >= 14) {
    return {
      en: "Two weeks in. Momentum is no longer a rumor.",
      zh: "兩週了。動能已不是傳聞。",
    };
  }
  if (streak >= 7) {
    return {
      en: "A full week. You’re building a rhythm, not a mood.",
      zh: "滿一週了。你在建立節奏，不是心情。",
    };
  }
  if (streak >= 3) {
    return {
      en: "Three days stacked. That’s the shape of a streak.",
      zh: "三天疊起，連續感開始成形。",
    };
  }
  if (streak >= 1) {
    return {
      en: "Day one counted. Tomorrow makes it a streak.",
      zh: "第一天已算數。明天，就成連續。",
    };
  }
  return {
    en: "Your next check-in is the start of everything.",
    zh: "下一次打卡，就是一切的開始。",
  };
}

export const BADGE_QUOTES: Record<string, MilestoneQuote> = {
  "first-unit": {
    en: "The hardest part was beginning. You did.",
    zh: "最難的是開始——你做到了。",
  },
  "streak-3": {
    en: "Three days prove it wasn’t a fluke.",
    zh: "三天證明：這不是僥倖。",
  },
  "streak-7": {
    en: "Seven returns. That’s ownership of your time.",
    zh: "回來七次——你在主導自己的時間。",
  },
  "streak-14": {
    en: "Fourteen days. Ordinary hours, extraordinary pattern.",
    zh: "十四天：平凡時數，非凡節奏。",
  },
  "streak-30": {
    en: "A month of main units. You’re not dabbling anymore.",
    zh: "一個月主單元——你已不是淺嘗。",
  },
  "streak-60": {
    en: "Sixty days. Your future self is already thanking you.",
    zh: "六十天。未來的你已在道謝。",
  },
  "units-10": {
    en: "Ten units deep. Knowledge compounds quietly.",
    zh: "十課入袋。知識在安靜複利。",
  },
  "units-50": {
    en: "Fifty units. Volume turns into voice.",
    zh: "五十課——量變開始成聲量。",
  },
  "units-100": {
    en: "One hundred units. That’s a curriculum of courage.",
    zh: "一百課——這是勇氣寫成的課表。",
  },
  "extra-3": {
    en: "You chose more when enough was already brave.",
    zh: "在「夠了」之後，你仍選擇更多。",
  },
};
