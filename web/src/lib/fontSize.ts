import { readJson, writeJson } from "./persist";

export type FontSizeId = "small" | "medium" | "large" | "xlarge";

export const FONT_SIZE_KEY = "omnilearn-font-size";
export const DEFAULT_FONT_SIZE: FontSizeId = "medium";

export const FONT_SIZE_LABEL: Record<FontSizeId, string> = {
  small: "小",
  medium: "中",
  large: "大",
  xlarge: "特大",
};

const FONT_SIZE_ORDER: FontSizeId[] = ["small", "medium", "large", "xlarge"];

export function normalizeFontSize(value: unknown): FontSizeId {
  if (
    value === "small" ||
    value === "medium" ||
    value === "large" ||
    value === "xlarge"
  ) {
    return value;
  }
  return "medium";
}

export function getFontSize(): FontSizeId {
  return normalizeFontSize(readJson<FontSizeId | null>(FONT_SIZE_KEY, null));
}

export function applyFontSize(size: FontSizeId) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.fontSize = size;
}

export function setFontSize(size: FontSizeId) {
  writeJson(FONT_SIZE_KEY, size);
  applyFontSize(size);
}

export function cycleFontSize(): FontSizeId {
  const current = getFontSize();
  const currentIndex = FONT_SIZE_ORDER.indexOf(current);
  const nextIndex = (currentIndex + 1) % FONT_SIZE_ORDER.length;
  const next = FONT_SIZE_ORDER[nextIndex];
  setFontSize(next);
  return next;
}

/** Inline boot script — keep in sync with FONT_SIZE_KEY / normalizeFontSize. */
export const FONT_SIZE_BOOT_SCRIPT = `(function(){try{var k=${JSON.stringify(FONT_SIZE_KEY)};var r=localStorage.getItem(k);var s="medium";if(r){try{var v=JSON.parse(r);if(v==="small"||v==="medium"||v==="large"||v==="xlarge")s=v;}catch(e){if(e)s="medium";}}document.documentElement.setAttribute("data-font-size",s);}catch(e){document.documentElement.setAttribute("data-font-size","medium");}})();`;
