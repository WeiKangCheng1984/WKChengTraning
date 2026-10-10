import { readJson, writeJson } from "@/lib/persist";
import {
  buildDailyUnit,
  programDayForDate,
  todayIsoLocal,
  unitFingerprints,
} from "@/lib/dailyUnit/buildUnit";
import { DAILY_PROGRAM_DAYS } from "@/lib/dailyUnit/themes";
import type {
  CompletedUnitRecord,
  DailyUnit,
  DailyUnitProgress,
  StepResult,
} from "@/lib/dailyUnit/types";

export const DAILY_UNITS_KEY = "omnilearn-daily-units-v1";
const HISTORY_MAX = 80;
const FINGERPRINT_MAX = 600;

function read(): DailyUnitProgress {
  return readJson<DailyUnitProgress>(DAILY_UNITS_KEY, {
    byDate: {},
    history: [],
    recentFingerprints: [],
  });
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
  if (!state.history) state.history = [];
  if (!state.recentFingerprints) state.recentFingerprints = [];
  return state;
}

export function getTodayProgramDay(): number {
  const state = ensureCycleStart();
  const today = todayIsoLocal();
  return programDayForDate(today, state.cycleStart);
}

export function getRecentFingerprints(): string[] {
  return ensureCycleStart().recentFingerprints || [];
}

export function getTodayDoneIds(): string[] {
  const state = ensureCycleStart();
  const today = todayIsoLocal();
  return state.byDate[today]?.doneIds ?? [];
}

function pushFingerprints(state: DailyUnitProgress, fps: string[]) {
  const merged = [...fps, ...(state.recentFingerprints || [])];
  const seen = new Set<string>();
  const next: string[] = [];
  for (const f of merged) {
    if (seen.has(f)) continue;
    seen.add(f);
    next.push(f);
    if (next.length >= FINGERPRINT_MAX) break;
  }
  state.recentFingerprints = next;
}

/** Mark done + save full review record for later lookup. */
export function completeUnitSession(
  unit: DailyUnit,
  results: StepResult[],
): CompletedUnitRecord {
  const state = ensureCycleStart();
  const today = todayIsoLocal();
  const day = getTodayProgramDay();
  const entry = state.byDate[today] ?? { doneIds: [], programDay: day };
  if (!entry.doneIds.includes(unit.id)) {
    entry.doneIds.push(unit.id);
  }
  entry.programDay = day;
  state.byDate[today] = entry;

  const correct = results.filter((r) => r.ok).length;
  const record: CompletedUnitRecord = {
    recordId: `${unit.id}-${Date.now()}`,
    unitId: unit.id,
    programDay: unit.programDay,
    unitIndex: unit.unitIndex,
    titleZh: unit.titleZh,
    titleEn: unit.titleEn,
    date: today,
    completedAt: new Date().toISOString(),
    correct,
    total: results.length || unit.steps.length,
    results,
  };

  const history = [record, ...(state.history || [])];
  state.history = history.slice(0, HISTORY_MAX);
  pushFingerprints(state, unitFingerprints(unit));
  write(state);
  return record;
}

/** @deprecated prefer completeUnitSession */
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

export function listUnitHistory(): CompletedUnitRecord[] {
  return [...(ensureCycleStart().history || [])];
}

export function getUnitHistoryRecord(
  recordId: string,
): CompletedUnitRecord | null {
  return listUnitHistory().find((h) => h.recordId === recordId) ?? null;
}

export function nextUnitForToday(): DailyUnit {
  const day = getTodayProgramDay();
  const done = new Set(getTodayDoneIds());
  const recent = getRecentFingerprints();
  for (let u = 0; u < 20; u += 1) {
    const unit = buildDailyUnit(day, u, { recentFingerprints: recent });
    if (!done.has(unit.id)) return unit;
  }
  return buildDailyUnit(day, getTodayDoneIds().length, {
    recentFingerprints: recent,
  });
}

export function todayUnitSummary() {
  const day = getTodayProgramDay();
  const done = getTodayDoneIds();
  const recent = getRecentFingerprints();
  const main = buildDailyUnit(day, 0, { recentFingerprints: recent });
  const history = listUnitHistory();
  return {
    programDay: day,
    totalProgramDays: DAILY_PROGRAM_DAYS,
    doneCount: done.length,
    mainDone: done.includes(main.id),
    main,
    cycleStart: ensureCycleStart().cycleStart,
    historyCount: history.length,
  };
}
