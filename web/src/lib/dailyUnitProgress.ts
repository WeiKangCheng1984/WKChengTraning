import { readJson, writeJson } from "@/lib/persist";
import {
  buildDailyUnit,
  programDayForDate,
  todayIsoLocal,
} from "@/lib/dailyUnit/buildUnit";
import { DAILY_PROGRAM_DAYS } from "@/lib/dailyUnit/themes";
import type { DailyUnit, DailyUnitProgress } from "@/lib/dailyUnit/types";

export const DAILY_UNITS_KEY = "omnilearn-daily-units-v1";

function read(): DailyUnitProgress {
  return readJson<DailyUnitProgress>(DAILY_UNITS_KEY, { byDate: {} });
}

function write(state: DailyUnitProgress) {
  writeJson(DAILY_UNITS_KEY, state);
}

export function ensureCycleStart(): DailyUnitProgress {
  const state = read();
  if (!state.cycleStart) {
    state.cycleStart = todayIsoLocal();
    write(state);
  }
  return state;
}

export function getTodayProgramDay(): number {
  const state = ensureCycleStart();
  const today = todayIsoLocal();
  return programDayForDate(today, state.cycleStart);
}

export function getTodayDoneIds(): string[] {
  const state = ensureCycleStart();
  const today = todayIsoLocal();
  return state.byDate[today]?.doneIds ?? [];
}

export function markUnitDone(unitId: string): DailyUnitProgress {
  const state = ensureCycleStart();
  const today = todayIsoLocal();
  const day = getTodayProgramDay();
  const entry = state.byDate[today] ?? { doneIds: [], programDay: day };
  if (!entry.doneIds.includes(unitId)) {
    entry.doneIds.push(unitId);
  }
  entry.programDay = day;
  state.byDate[today] = entry;
  write(state);
  return state;
}

export function isUnitDone(unitId: string): boolean {
  return getTodayDoneIds().includes(unitId);
}

/** Next unit to offer: first incomplete for today (main then extras). */
export function nextUnitForToday(): DailyUnit {
  const day = getTodayProgramDay();
  const done = new Set(getTodayDoneIds());
  for (let u = 0; u < 20; u += 1) {
    const unit = buildDailyUnit(day, u);
    if (!done.has(unit.id)) return unit;
  }
  // Fallback: keep generating extras
  return buildDailyUnit(day, getTodayDoneIds().length);
}

export function todayUnitSummary() {
  const day = getTodayProgramDay();
  const done = getTodayDoneIds();
  const main = buildDailyUnit(day, 0);
  return {
    programDay: day,
    totalProgramDays: DAILY_PROGRAM_DAYS,
    doneCount: done.length,
    mainDone: done.includes(main.id),
    main,
    cycleStart: ensureCycleStart().cycleStart,
  };
}
