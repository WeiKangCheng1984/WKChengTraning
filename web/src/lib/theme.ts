import { readJson, writeJson } from "./persist";

export type ThemeId = "harbor" | "signal";

export const THEME_KEY = "omnilearn-theme";
export const DEFAULT_THEME: ThemeId = "harbor";

export const THEME_LABEL: Record<ThemeId, string> = {
  harbor: "晴日",
  signal: "活力",
};

export function normalizeTheme(value: unknown): ThemeId {
  return value === "signal" ? "signal" : "harbor";
}

export function getTheme(): ThemeId {
  return normalizeTheme(readJson<ThemeId | null>(THEME_KEY, null));
}

export function applyTheme(theme: ThemeId) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
}

export function setTheme(theme: ThemeId) {
  writeJson(THEME_KEY, theme);
  applyTheme(theme);
}

export function toggleTheme(): ThemeId {
  const next: ThemeId = getTheme() === "harbor" ? "signal" : "harbor";
  setTheme(next);
  return next;
}

/** Inline boot script — keep in sync with THEME_KEY / normalizeTheme. */
export const THEME_BOOT_SCRIPT = `(function(){try{var k=${JSON.stringify(THEME_KEY)};var r=localStorage.getItem(k);var t="harbor";if(r){try{var v=JSON.parse(r);if(v==="signal")t="signal";}catch(e){if(r==="signal")t="signal";}}document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","harbor");}})();`;
