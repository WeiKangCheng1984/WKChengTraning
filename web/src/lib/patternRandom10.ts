import type {
  PatternItem,
  PatternLineRepeats,
  PatternRow,
  PatternTemplates,
} from "@/lib/patternLoop";

export type Random10Mode = "daily" | "shuffle";

export type Random10Session = {
  mode: Random10Mode;
  /** daily: YYYY-MM-DD; shuffle: random hex */
  seed: string;
  itemIds: string[];
  label: string;
};

export type Random10FlatRow = PatternRow & {
  itemId: string;
  pattern: string;
  zhName: string;
  blockIndex: number;
  lineInBlock: number;
};

export type Random10LoopScope = "full" | "template";

export const SESSION_KEY = "omnilearn-pattern-random10-v1";
export const PLAY_KEY = "omnilearn-pattern-random10-play-v1";

const L1_L6 = ["L1", "L2", "L3", "L4", "L5", "L6"] as const;

export function todaySeed(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function newShuffleSeed(): string {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(2);
    crypto.getRandomValues(buf);
    return `${buf[0].toString(16)}${buf[1].toString(16)}`;
  }
  return String(Date.now());
}

/** Deterministic PRNG from string seed (Mulberry32). */
export function createRng(seed: string): () => number {
  let h = 1779033703;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function next() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function shuffleInPlace<T>(arr: T[], rng: () => number) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/** One template per level L1–L6, plus four more without duplicate (72 pool). */
export function pickTenItemIds(
  data: PatternTemplates,
  seed: string,
): string[] {
  const rng = createRng(seed);
  const levels = L1_L6.map(
    (id) => data.levels.find((lv) => lv.id === id)?.items ?? [],
  );
  if (levels.some((items) => items.length === 0)) {
    throw new Error("L1–L6 pool incomplete");
  }

  const picked: PatternItem[] = [];
  const pickedSet = new Set<string>();

  for (const items of levels) {
    const copy = [...items];
    shuffleInPlace(copy, rng);
    const one = copy[0];
    picked.push(one);
    pickedSet.add(one.id);
  }

  const rest: PatternItem[] = [];
  for (const items of levels) {
    for (const it of items) {
      if (!pickedSet.has(it.id)) rest.push(it);
    }
  }
  shuffleInPlace(rest, rng);
  for (let i = 0; i < 4 && i < rest.length; i++) {
    picked.push(rest[i]);
    pickedSet.add(rest[i].id);
  }

  shuffleInPlace(picked, rng);
  return picked.map((it) => it.id);
}

export function buildSession(
  data: PatternTemplates,
  mode: Random10Mode,
  seed?: string,
): Random10Session {
  const resolvedSeed =
    seed ?? (mode === "daily" ? todaySeed() : newShuffleSeed());
  const itemIds = pickTenItemIds(data, `${mode}:${resolvedSeed}`);
  const label =
    mode === "daily"
      ? `今日十句型 · ${resolvedSeed}`
      : `隨機十句型 · ${resolvedSeed.slice(0, 8)}`;
  return { mode, seed: resolvedSeed, itemIds, label };
}

export function resolveItems(
  data: PatternTemplates,
  itemIds: string[],
): PatternItem[] {
  const map = new Map<string, PatternItem>();
  for (const lv of data.levels) {
    for (const it of lv.items) map.set(it.id, it);
  }
  return itemIds.map((id) => {
    const it = map.get(id);
    if (!it) throw new Error(`Missing template ${id}`);
    return it;
  });
}

export function flattenRows(items: PatternItem[]): Random10FlatRow[] {
  const out: Random10FlatRow[] = [];
  items.forEach((item, blockIndex) => {
    item.rows.forEach((row, lineInBlock) => {
      out.push({
        ...row,
        itemId: item.id,
        pattern: item.pattern,
        zhName: item.zhName,
        blockIndex,
        lineInBlock,
      });
    });
  });
  return out;
}

export function readSession(): Random10Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Random10Session;
    if (
      (parsed.mode !== "daily" && parsed.mode !== "shuffle") ||
      !Array.isArray(parsed.itemIds)
    ) {
      return null;
    }
    if (parsed.itemIds.length !== 10) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeSession(session: Random10Session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function sessionStillValid(session: Random10Session): boolean {
  if (session.mode === "daily") return session.seed === todaySeed();
  return true;
}

export type SavedPlay = {
  index: number;
  speed: "slow" | "normal" | "fast";
  gap: "short" | "normal" | "long";
  loopScope: Random10LoopScope;
  lineRepeats?: PatternLineRepeats;
};

export function readPlaySaved(): Partial<SavedPlay> | null {
  try {
    const raw = localStorage.getItem(PLAY_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<SavedPlay>;
  } catch {
    return null;
  }
}

export function writePlaySaved(payload: SavedPlay) {
  localStorage.setItem(PLAY_KEY, JSON.stringify(payload));
}
