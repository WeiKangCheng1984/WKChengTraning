import { readJson, writeJson } from "./persist";

const KEY = "omnilearn-rewards-v1";

/** Daily practice goal in minutes */
export const DAILY_GOAL_MINUTES = 60;

export type BadgeId =
  | "first-15"
  | "first-hour"
  | "streak-3"
  | "streak-7"
  | "streak-14"
  | "streak-30"
  | "hours-10"
  | "hours-50"
  | "pack-week"
  | "early-bird"
  | "night-owl";

export type BadgeDef = {
  id: BadgeId;
  title: string;
  body: string;
};

export const BADGES: BadgeDef[] = [
  {
    id: "first-15",
    title: "開場 15 分",
    body: "單日累積練習滿 15 分鐘。",
  },
  {
    id: "first-hour",
    title: "全日一小時",
    body: "單日達成 60 分鐘目標。",
  },
  {
    id: "streak-3",
    title: "三連擊",
    body: "連續 3 天達成一小時。",
  },
  {
    id: "streak-7",
    title: "一週節奏",
    body: "連續 7 天達成一小時。",
  },
  {
    id: "streak-14",
    title: "兩週火力",
    body: "連續 14 天達成一小時。",
  },
  {
    id: "streak-30",
    title: "月度習慣",
    body: "連續 30 天達成一小時。",
  },
  {
    id: "hours-10",
    title: "十小時俱樂部",
    body: "累計練習滿 10 小時。",
  },
  {
    id: "hours-50",
    title: "五十小時里程",
    body: "累計練習滿 50 小時。",
  },
  {
    id: "pack-week",
    title: "套餐達人",
    body: "一週內完成英語套餐步驟達 7 次。",
  },
  {
    id: "early-bird",
    title: "早鳥",
    body: "在上午 9 點前累積滿 20 分鐘。",
  },
  {
    id: "night-owl",
    title: "夜貓",
    body: "在晚上 9 點後累積滿 20 分鐘。",
  },
];

type DayLog = {
  minutes: number;
  /** English pack steps credited today (1–4) */
  packSteps: number[];
  goalHit: boolean;
};

type RewardsState = {
  byDay: Record<string, DayLog>;
  streak: number;
  bestStreak: number;
  totalMinutes: number;
  badges: BadgeId[];
  /** ISO dates that already counted toward pack-week rolling window */
  packCompletions: string[];
  lastActiveDay?: string;
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function emptyDay(): DayLog {
  return { minutes: 0, packSteps: [], goalHit: false };
}

function read(): RewardsState {
  return readJson<RewardsState>(KEY, {
    byDay: {},
    streak: 0,
    bestStreak: 0,
    totalMinutes: 0,
    badges: [],
    packCompletions: [],
  });
}

function write(state: RewardsState) {
  writeJson(KEY, state);
}

function dayOffset(iso: string, days: number) {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function unlock(state: RewardsState, id: BadgeId) {
  if (!state.badges.includes(id)) state.badges.push(id);
}

function recomputeStreak(state: RewardsState, today: string) {
  let streak = 0;
  let cursor = today;
  // If today not yet goal, streak is counted through yesterday
  if (!(state.byDay[today]?.goalHit)) {
    cursor = dayOffset(today, -1);
  }
  while (state.byDay[cursor]?.goalHit) {
    streak += 1;
    cursor = dayOffset(cursor, -1);
  }
  state.streak = streak;
  state.bestStreak = Math.max(state.bestStreak, streak);
}

function evaluateBadges(state: RewardsState, today: string) {
  const day = state.byDay[today] ?? emptyDay();
  if (day.minutes >= 15) unlock(state, "first-15");
  if (day.goalHit) unlock(state, "first-hour");
  if (state.streak >= 3) unlock(state, "streak-3");
  if (state.streak >= 7) unlock(state, "streak-7");
  if (state.streak >= 14) unlock(state, "streak-14");
  if (state.streak >= 30) unlock(state, "streak-30");
  if (state.totalMinutes >= 10 * 60) unlock(state, "hours-10");
  if (state.totalMinutes >= 50 * 60) unlock(state, "hours-50");

  const weekStart = dayOffset(today, -6);
  const packWeek = state.packCompletions.filter((d) => d >= weekStart).length;
  if (packWeek >= 7) unlock(state, "pack-week");

  const hour = new Date().getHours();
  if (day.minutes >= 20 && hour < 9) unlock(state, "early-bird");
  if (day.minutes >= 20 && hour >= 21) unlock(state, "night-owl");
}

export type RewardsSnapshot = {
  todayMinutes: number;
  goal: number;
  pct: number;
  remaining: number;
  goalHit: boolean;
  streak: number;
  bestStreak: number;
  totalMinutes: number;
  totalHours: number;
  badges: BadgeId[];
  newlyUnlocked: BadgeId[];
  message: string;
};

function messageFor(minutes: number, goalHit: boolean, streak: number): string {
  if (goalHit) {
    return streak > 1
      ? `今日達標！連續 ${streak} 天滿一小時。`
      : "今日達標！一小時節奏已鎖定。";
  }
  if (minutes <= 0) return "打開頁面練習會自動計時；目標每天 60 分鐘。";
  if (minutes < 15) return "很好，已經開始。先撐到 15 分鐘熱身。";
  if (minutes < 30) return "節奏起來了，往半小時推進。";
  if (minutes < 45) return "過半了，再一小段就接近目標。";
  return `還差 ${DAILY_GOAL_MINUTES - minutes} 分鐘就達標。`;
}

export function getRewardsSnapshot(): RewardsSnapshot {
  const state = read();
  const today = todayIso();
  const day = state.byDay[today] ?? emptyDay();
  const minutes = Math.floor(day.minutes);
  const pct = Math.min(100, Math.round((minutes / DAILY_GOAL_MINUTES) * 100));
  return {
    todayMinutes: minutes,
    goal: DAILY_GOAL_MINUTES,
    pct,
    remaining: Math.max(0, DAILY_GOAL_MINUTES - minutes),
    goalHit: day.goalHit || minutes >= DAILY_GOAL_MINUTES,
    streak: state.streak,
    bestStreak: state.bestStreak,
    totalMinutes: Math.floor(state.totalMinutes),
    totalHours: Math.floor(state.totalMinutes / 60),
    badges: state.badges,
    newlyUnlocked: [],
    message: messageFor(minutes, day.goalHit || minutes >= DAILY_GOAL_MINUTES, state.streak),
  };
}

/** Add practice minutes (fractional OK). Returns snapshot + any new badges. */
export function addPracticeMinutes(delta: number): RewardsSnapshot {
  if (delta <= 0 || !Number.isFinite(delta)) return getRewardsSnapshot();
  const state = read();
  const today = todayIso();
  const beforeBadges = new Set(state.badges);
  const day = state.byDay[today] ?? emptyDay();
  const prev = day.minutes;

  // Soft cap so idle tabs don't explode a single day
  const next = Math.min(120, prev + delta);
  const gained = next - prev;
  day.minutes = next;
  if (day.minutes >= DAILY_GOAL_MINUTES) day.goalHit = true;
  state.byDay[today] = day;
  state.totalMinutes += gained;
  state.lastActiveDay = today;

  recomputeStreak(state, today);
  evaluateBadges(state, today);
  write(state);

  const snap = getRewardsSnapshot();
  snap.newlyUnlocked = state.badges.filter((b) => !beforeBadges.has(b));
  return snap;
}

/** One-time bonus when finishing an English pack step (1–4) today */
export function creditPackStep(step: number): RewardsSnapshot {
  const state = read();
  const today = todayIso();
  const beforeBadges = new Set(state.badges);
  const day = state.byDay[today] ?? emptyDay();
  if (day.packSteps.includes(step)) return getRewardsSnapshot();

  day.packSteps.push(step);
  // Bonus: 2 minutes of intentional completion credit
  const bonus = 2;
  const prev = day.minutes;
  day.minutes = Math.min(120, prev + bonus);
  state.totalMinutes += day.minutes - prev;
  if (day.minutes >= DAILY_GOAL_MINUTES) day.goalHit = true;
  state.byDay[today] = day;

  if (step === 4 || day.packSteps.length >= 4) {
    if (!state.packCompletions.includes(today)) {
      state.packCompletions.push(today);
    }
  }

  recomputeStreak(state, today);
  evaluateBadges(state, today);
  write(state);

  const snap = getRewardsSnapshot();
  snap.newlyUnlocked = state.badges.filter((b) => !beforeBadges.has(b));
  return snap;
}

export function getRecentDays(n = 7): Array<{ date: string; minutes: number; goalHit: boolean }> {
  const state = read();
  const today = todayIso();
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = dayOffset(today, -i);
    const day = state.byDay[date];
    out.push({
      date,
      minutes: Math.floor(day?.minutes ?? 0),
      goalHit: Boolean(day?.goalHit),
    });
  }
  return out;
}

export function badgeMeta(id: BadgeId): BadgeDef {
  return BADGES.find((b) => b.id === id) ?? { id, title: id, body: "" };
}
