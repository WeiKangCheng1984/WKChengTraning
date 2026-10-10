import { readJson, writeJson } from "./persist";

const KEY = "omnilearn-rewards-v1";

export type BadgeId =
  | "first-unit"
  | "streak-3"
  | "streak-7"
  | "streak-14"
  | "streak-30"
  | "units-10"
  | "units-50"
  | "extra-3";

export type BadgeDef = {
  id: BadgeId;
  title: string;
  body: string;
};

export const BADGES: BadgeDef[] = [
  {
    id: "first-unit",
    title: "第一課",
    body: "完成第一個今日主單元。",
  },
  {
    id: "streak-3",
    title: "三連打卡",
    body: "連續 3 天完成主單元。",
  },
  {
    id: "streak-7",
    title: "一週節奏",
    body: "連續 7 天完成主單元。",
  },
  {
    id: "streak-14",
    title: "兩週火力",
    body: "連續 14 天完成主單元。",
  },
  {
    id: "streak-30",
    title: "月度習慣",
    body: "連續 30 天完成主單元。",
  },
  {
    id: "units-10",
    title: "十課達成",
    body: "累計完成 10 個單元（含加練）。",
  },
  {
    id: "units-50",
    title: "五十課里程",
    body: "累計完成 50 個單元。",
  },
  {
    id: "extra-3",
    title: "加練小達人",
    body: "同一天完成 3 個以上單元。",
  },
];

type DayLog = {
  /** Completed main unit (unitIndex 0) today */
  mainDone: boolean;
  /** Total units finished today */
  unitsDone: number;
  goalHit: boolean;
};

type RewardsState = {
  byDay: Record<string, DayLog>;
  streak: number;
  bestStreak: number;
  totalUnits: number;
  badges: BadgeId[];
  lastActiveDay?: string;
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function emptyDay(): DayLog {
  return { mainDone: false, unitsDone: 0, goalHit: false };
}

function read(): RewardsState {
  const raw = readJson<Partial<RewardsState> & { totalMinutes?: number }>(KEY, {
    byDay: {},
    streak: 0,
    bestStreak: 0,
    totalUnits: 0,
    badges: [],
  });
  // Migrate away from old minutes-based shape
  return {
    byDay: migrateDays(raw.byDay || {}),
    streak: raw.streak || 0,
    bestStreak: raw.bestStreak || 0,
    totalUnits: raw.totalUnits || 0,
    badges: (raw.badges || []).filter((b): b is BadgeId =>
      BADGES.some((d) => d.id === b),
    ),
    lastActiveDay: raw.lastActiveDay,
  };
}

function migrateDays(
  byDay: Record<string, DayLog | { minutes?: number; goalHit?: boolean; packSteps?: number[] }>,
): Record<string, DayLog> {
  const out: Record<string, DayLog> = {};
  for (const [date, day] of Object.entries(byDay)) {
    if (day && typeof day === "object" && "mainDone" in day) {
      out[date] = day as DayLog;
      continue;
    }
    const old = day as { goalHit?: boolean; packSteps?: number[] };
    const units = old.packSteps?.filter((s) => s >= 100).length || 0;
    const mainDone = Boolean(
      old.packSteps?.includes(100) || old.goalHit,
    );
    out[date] = {
      mainDone,
      unitsDone: Math.max(units, mainDone ? 1 : 0),
      goalHit: mainDone,
    };
  }
  return out;
}

function write(state: RewardsState) {
  writeJson(KEY, state);
}

function dayOffset(iso: string, delta: number) {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

function recomputeStreak(state: RewardsState, today: string) {
  let streak = 0;
  let cursor = today;
  if (!(state.byDay[today]?.mainDone)) {
    cursor = dayOffset(today, -1);
  }
  while (state.byDay[cursor]?.mainDone) {
    streak += 1;
    cursor = dayOffset(cursor, -1);
  }
  state.streak = streak;
  state.bestStreak = Math.max(state.bestStreak, streak);
}

function evaluateBadges(state: RewardsState, today: string) {
  const day = state.byDay[today] ?? emptyDay();
  const unlock = (id: BadgeId) => {
    if (!state.badges.includes(id)) state.badges.push(id);
  };
  if (state.totalUnits >= 1) unlock("first-unit");
  if (state.streak >= 3) unlock("streak-3");
  if (state.streak >= 7) unlock("streak-7");
  if (state.streak >= 14) unlock("streak-14");
  if (state.streak >= 30) unlock("streak-30");
  if (state.totalUnits >= 10) unlock("units-10");
  if (state.totalUnits >= 50) unlock("units-50");
  if (day.unitsDone >= 3) unlock("extra-3");
}

export type RewardsSnapshot = {
  mainDoneToday: boolean;
  unitsToday: number;
  streak: number;
  bestStreak: number;
  totalUnits: number;
  goalHit: boolean;
  badges: BadgeId[];
  newlyUnlocked: BadgeId[];
  message: string;
};

function messageFor(mainDone: boolean, streak: number) {
  if (mainDone) {
    return streak > 1
      ? `今日主單元完成！連續打卡 ${streak} 天。`
      : "今日主單元完成！明天再來延續節奏。";
  }
  return "完成今日主單元即可打卡（約 5–10 分鐘）。";
}

export function getRewardsSnapshot(): RewardsSnapshot {
  const state = read();
  const today = todayIso();
  const day = state.byDay[today] ?? emptyDay();
  return {
    mainDoneToday: day.mainDone,
    unitsToday: day.unitsDone,
    streak: state.streak,
    bestStreak: state.bestStreak,
    totalUnits: state.totalUnits,
    goalHit: day.goalHit || day.mainDone,
    badges: state.badges,
    newlyUnlocked: [],
    message: messageFor(day.mainDone, state.streak),
  };
}

/** Credit finishing a daily micro-lesson. Main unit (index 0) hits the streak. */
export function creditDailyUnit(unitIndex: number): RewardsSnapshot {
  const state = read();
  const today = todayIso();
  const beforeBadges = new Set(state.badges);
  const day = state.byDay[today] ?? emptyDay();

  day.unitsDone += 1;
  if (unitIndex === 0) {
    day.mainDone = true;
    day.goalHit = true;
  }
  state.byDay[today] = day;
  state.totalUnits += 1;
  state.lastActiveDay = today;

  recomputeStreak(state, today);
  evaluateBadges(state, today);
  write(state);

  const snap = getRewardsSnapshot();
  snap.newlyUnlocked = state.badges.filter((b) => !beforeBadges.has(b));
  return snap;
}

/** @deprecated minutes tracking removed */
export function addPracticeMinutes(): RewardsSnapshot {
  return getRewardsSnapshot();
}

/** @deprecated pack steps removed */
export function creditPackStep(): RewardsSnapshot {
  return getRewardsSnapshot();
}

export function getRecentDays(
  n = 7,
): Array<{ date: string; mainDone: boolean; unitsDone: number }> {
  const state = read();
  const today = todayIso();
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = dayOffset(today, -i);
    const day = state.byDay[date];
    out.push({
      date,
      mainDone: Boolean(day?.mainDone),
      unitsDone: day?.unitsDone ?? 0,
    });
  }
  return out;
}

export function badgeMeta(id: BadgeId): BadgeDef {
  return BADGES.find((b) => b.id === id) ?? { id, title: id, body: "" };
}
