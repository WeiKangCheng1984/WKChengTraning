"use client";

import { useEffect, useState } from "react";
import {
  THEME_LABEL,
  type ThemeId,
  applyTheme,
  getTheme,
  toggleTheme,
} from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setThemeState] = useState<ThemeId>("harbor");

  useEffect(() => {
    const current = getTheme();
    setThemeState(current);
    applyTheme(current);
  }, []);

  return (
    <button
      type="button"
      onClick={() => setThemeState(toggleTheme())}
      className="inline-flex min-h-10 items-center justify-center rounded-sm border border-white/20 px-3 text-sm text-white/90 hover:bg-white/10"
      aria-label={`切換配色（目前：${THEME_LABEL[theme]}）`}
      title={`配色：${THEME_LABEL[theme]}（點擊切換）`}
    >
      {THEME_LABEL[theme]}
    </button>
  );
}
