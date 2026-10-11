"use client";

import { useEffect, useState } from "react";
import {
  FONT_SIZE_LABEL,
  type FontSizeId,
  applyFontSize,
  getFontSize,
  cycleFontSize,
} from "@/lib/fontSize";

export function FontSizeControl() {
  const [fontSize, setFontSizeState] = useState<FontSizeId>("medium");

  useEffect(() => {
    const current = getFontSize();
    setFontSizeState(current);
    applyFontSize(current);
  }, []);

  return (
    <button
      type="button"
      onClick={() => setFontSizeState(cycleFontSize())}
      className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/25 px-3 text-sm text-white/95 hover:bg-white/10"
      aria-label={`調整字體大小（目前：${FONT_SIZE_LABEL[fontSize]}）`}
      title={`字體：${FONT_SIZE_LABEL[fontSize]}（點擊切換）`}
    >
      <span className="mr-1.5">A</span>
      {FONT_SIZE_LABEL[fontSize]}
    </button>
  );
}
