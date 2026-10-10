import { readJson, writeJson } from "@/lib/persist";
import { fetchDailyUnit } from "@/lib/dailyUnit/fetchUnit";
import { themeForDay, DAILY_PROGRAM_DAYS } from "@/lib/dailyUnit/themes";
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

export function todayIsoLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function programDayForDate(isoDate: string, cycleStart?: string): number {
  const start = cycleStart || isoDate;
  const t0 = Date.parse(`${start}T00:00:00`);
  const t1 = Date.parse(`${isoDate}T00:00:00`);
  if (!Number.isFinite(t0) || !Number.isFinite(t1)) return 1;
  const diff = Math.max(0, Math.floor((t1 - t0) / 86400000));
  return (diff % DAILY_PROGRAM_DAYS) + 1;
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
  return programDayForDate(todayIsoLocal(), state.cycleStart);
}

export function getRecentFingerprints(): string[] {
  return ensureCycleStart().recentFingerprints || [];
}

export function getTodayDoneIds(): string[] {
  const state = ensureCycleStart();
  const today = todayIsoLocal();
  return state.byDate[today]?.doneIds ?? [];
}

function unitFingerprints(unit: DailyUnit): string[] {
  return unit.steps
    .map((s) => s.fingerprint)
    .filter((f): f is string => Boolean(f));
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

  state.history = [record, ...(state.history || [])].slice(0, HISTORY_MAX);
  pushFingerprints(state, unitFingerprints(unit));
  write(state);
  return record;
}

export function listUnitHistory(): CompletedUnitRecord[] {
  return [...(ensureCycleStart().history || [])];
}

export function getUnitHistoryRecord(
  recordId: string,
): CompletedUnitRecord | null {
  return listUnitHistory().find((h) => h.recordId === recordId) ?? null;
}

export async function nextUnitForToday(): Promise<DailyUnit> {
  const day = getTodayProgramDay();
  const done = new Set(getTodayDoneIds());
  const recent = getRecentFingerprints();
  for (let u = 0; u < 20; u += 1) {
    const id = `d${String(day).padStart(2, "0")}-u${u}`;
    if (done.has(id)) continue;
    return fetchDailyUnit({
      programDay: day,
      unitIndex: u,
      recentFingerprints: recent,
    });
  }
  return fetchDailyUnit({
    programDay: day,
    unitIndex: getTodayDoneIds().length,
    recentFingerprints: recent,
  });
}

/** Lightweight summary — no large JSON on the client. */
export function todayUnitSummary() {
  const day = getTodayProgramDay();
  const done = getTodayDoneIds();
  const theme = themeForDay(day);
  const mainId = `d${String(day).padStart(2, "0")}-u0`;
  return {
    programDay: day,
    totalProgramDays: DAILY_PROGRAM_DAYS,
    doneCount: done.length,
    mainDone: done.includes(mainId),
    main: {
      id: mainId,
      programDay: day,
      unitIndex: 0,
      titleZh: theme.titleZh,
      titleEn: theme.titleEn,
      blurb: theme.blurb,
      estimatedMinutes: 8,
      steps: [] as DailyUnit["steps"],
    },
    cycleStart: ensureCycleStart().cycleStart,
    historyCount: listUnitHistory().length,
  };
}
