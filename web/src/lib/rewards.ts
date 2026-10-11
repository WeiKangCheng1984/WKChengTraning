import { listUnitHistory, todayIsoLocal } from "./dailyUnitProgress";
import {
  BADGE_QUOTES,
  dailyMotivation,
  quoteForStreak,
  type MilestoneQuote,
} from "./milestoneQuotes";
import { readJson, writeJson } from "./persist";

const KEY = "omnilearn-rewards-v1";

export type BadgeId =
  | "first-unit"
  | "streak-3"
  | "streak-7"
  | "streak-14"
  | "streak-30"
  | "streak-60"
  | "units-10"
  | "units-50"
  | "units-100"
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
    id: "streak-60",
    title: "雙月韌性",
    body: "連續 60 天完成主單元。",
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
    id: "units-100",
    title: "百課里程碑",
    body: "累計完成 100 個單元。",
  },
  {
    id: "extra-3",
    title: "加練小達人",
    body: "同一天完成 3 個以上單元。",
  },
];

export type CheckInDay = {
  date: string;
  mainDone: boolean;
  unitsDone: number;
};

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

/** Local calendar day — must match dailyUnitProgress.todayIsoLocal (not UTC). */
function todayIso() {
  return todayIsoLocal();
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

/**
 * Fill gaps when micro-lesson history exists but rewards/check-in was missed
 * (e.g. older UTC date keys, sync race, or credit not persisted).
 */
function reconcileFromHistory(state: RewardsState): boolean {
  const history = listUnitHistory();
  if (!history.length) return false;

  const agg: Record<string, { mainDone: boolean; unitsDone: number }> = {};
  for (const h of history) {
    if (!h.date) continue;
    const cur = agg[h.date] ?? { mainDone: false, unitsDone: 0 };
    cur.unitsDone += 1;
    if (h.unitIndex === 0) cur.mainDone = true;
    agg[h.date] = cur;
  }

  let changed = false;
  for (const [date, from] of Object.entries(agg)) {
    const prev = state.byDay[date] ?? emptyDay();
    const mainDone = prev.mainDone || from.mainDone;
    const unitsDone = Math.max(prev.unitsDone, from.unitsDone);
    const goalHit = mainDone || prev.goalHit;
    if (
      mainDone !== prev.mainDone ||
      unitsDone !== prev.unitsDone ||
      goalHit !== prev.goalHit
    ) {
      changed = true;
    }
    state.byDay[date] = { mainDone, unitsDone, goalHit };
  }

  const sumUnits = Object.values(state.byDay).reduce(
    (a, d) => a + (d.unitsDone || 0),
    0,
  );
  if (sumUnits > state.totalUnits) {
    state.totalUnits = sumUnits;
    changed = true;
  }

  if (changed) {
    const today = todayIso();
    recomputeStreak(state, today);
    evaluateBadges(state, today);
  }
  return changed;
}

function ensureState(): RewardsState {
  const state = read();
  if (typeof window === "undefined") return state;
  if (reconcileFromHistory(state)) {
    write(state);
  }
  return state;
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
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
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

function countMainCheckIns(state: RewardsState): number {
  return Object.values(state.byDay).filter((d) => d.mainDone).length;
}

function evaluateBadges(state: RewardsState, today: string) {
  const day = state.byDay[today] ?? emptyDay();
  const unlock = (id: BadgeId) => {
    if (!state.badges.includes(id)) state.badges.push(id);
  };
  const peak = Math.max(state.streak, state.bestStreak);
  if (state.totalUnits >= 1 || countMainCheckIns(state) >= 1) {
    unlock("first-unit");
  }
  if (peak >= 3) unlock("streak-3");
  if (peak >= 7) unlock("streak-7");
  if (peak >= 14) unlock("streak-14");
  if (peak >= 30) unlock("streak-30");
  if (peak >= 60) unlock("streak-60");
  if (state.totalUnits >= 10) unlock("units-10");
  if (state.totalUnits >= 50) unlock("units-50");
  if (state.totalUnits >= 100) unlock("units-100");
  if (day.unitsDone >= 3) unlock("extra-3");
  // Extra-3 also if any historical day hit 3+
  if (Object.values(state.byDay).some((d) => d.unitsDone >= 3)) {
    unlock("extra-3");
  }
}

export type RewardsSnapshot = {
  mainDoneToday: boolean;
  unitsToday: number;
  streak: number;
  bestStreak: number;
  totalUnits: number;
  /** Days with main unit check-in (all time). */
  checkInDays: number;
  goalHit: boolean;
  badges: BadgeId[];
  newlyUnlocked: BadgeId[];
  message: string;
  /** Milestone line for current streak. */
  streakQuote: MilestoneQuote;
  /** Gentle daily line (rotates by date). */
  dailyQuote: MilestoneQuote;
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
  const state = ensureState();
  const today = todayIso();
  const day = state.byDay[today] ?? emptyDay();
  return {
    mainDoneToday: day.mainDone,
    unitsToday: day.unitsDone,
    streak: state.streak,
    bestStreak: state.bestStreak,
    totalUnits: state.totalUnits,
    checkInDays: countMainCheckIns(state),
    goalHit: day.goalHit || day.mainDone,
    badges: state.badges,
    newlyUnlocked: [],
    message: messageFor(day.mainDone, state.streak),
    streakQuote: quoteForStreak(state.streak),
    dailyQuote: dailyMotivation(today),
  };
}

/** Credit finishing a daily micro-lesson. Main unit (index 0) hits the streak. */
export function creditDailyUnit(unitIndex: number): RewardsSnapshot {
  // Use read() (not ensureState): history is often written just before this call;
  // reconciling first then +=1 would double-count today's unit.
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

export function getRecentDays(n = 7): CheckInDay[] {
  const state = ensureState();
  const today = todayIso();
  const out: CheckInDay[] = [];
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

/** Every logged day (check-in or any units), newest first — full history. */
export function listAllCheckIns(): CheckInDay[] {
  const state = ensureState();
  return Object.entries(state.byDay)
    .filter(([, d]) => d.mainDone || d.unitsDone > 0)
    .map(([date, d]) => ({
      date,
      mainDone: Boolean(d.mainDone),
      unitsDone: d.unitsDone || 0,
    }))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** Group check-ins by YYYY-MM for timeline UI. */
export function listCheckInsByMonth(): Array<{
  month: string;
  days: CheckInDay[];
  mainCount: number;
}> {
  const all = listAllCheckIns();
  const map = new Map<string, CheckInDay[]>();
  for (const d of all) {
    const month = d.date.slice(0, 7);
    const list = map.get(month) ?? [];
    list.push(d);
    map.set(month, list);
  }
  return [...map.entries()].map(([month, days]) => ({
    month,
    days,
    mainCount: days.filter((x) => x.mainDone).length,
  }));
}

/** Re-run history→check-in merge (e.g. after cloud sync). */
export function reconcileRewardsWithHistory(): boolean {
  const state = read();
  if (!reconcileFromHistory(state)) return false;
  write(state);
  return true;
}

export function badgeMeta(id: BadgeId): BadgeDef {
  return BADGES.find((b) => b.id === id) ?? { id, title: id, body: "" };
}

export function badgeQuote(id: BadgeId): MilestoneQuote | undefined {
  return BADGE_QUOTES[id];
}
