const EVENT = "omnilearn-storage";

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(EVENT));
  // Hint for ProgressSyncHost which key changed
  window.dispatchEvent(
    new CustomEvent("omnilearn-progress-key", { detail: { key } }),
  );
}

export function onStorageChange(handler: () => void) {
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export { EVENT as STORAGE_EVENT };
