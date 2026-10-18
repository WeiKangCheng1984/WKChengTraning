import { readJson, writeJson } from "./persist";

const KEY = "omnilearn-coach-progress-v1";

type Store = {
  completed: number[];
  lastLesson?: number;
};

function read(): Store {
  const raw = readJson<Store>(KEY, { completed: [] });
  return {
    completed: Array.isArray(raw.completed) ? raw.completed : [],
    lastLesson: raw.lastLesson,
  };
}

function write(store: Store) {
  writeJson(KEY, store);
}

export function listCompletedCoachLessons(): number[] {
  return [...read().completed].sort((a, b) => a - b);
}

export function isCoachLessonDone(id: number): boolean {
  return read().completed.includes(id);
}

export function markCoachLessonDone(id: number): void {
  const store = read();
  if (!store.completed.includes(id)) store.completed.push(id);
  store.lastLesson = id;
  write(store);
}

export function unmarkCoachLessonDone(id: number): void {
  const store = read();
  store.completed = store.completed.filter((x) => x !== id);
  write(store);
}

export function coachProgressStats(total = 60): {
  done: number;
  total: number;
  lastLesson?: number;
} {
  const store = read();
  return {
    done: store.completed.length,
    total,
    lastLesson: store.lastLesson,
  };
}
