"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  addWordToBag,
  parseCaptureWord,
  WORD_BAG_SOFT_CAP,
} from "@/lib/wordBag";

type Pop = {
  word: string;
  context: string;
  x: number;
  y: number;
};

function contextAroundSelection(range: Range, word: string): string {
  const root = range.commonAncestorContainer;
  const el =
    root.nodeType === Node.TEXT_NODE
      ? root.parentElement
      : (root as Element | null);
  const block =
    el?.closest(
      "p, li, td, th, blockquote, h1, h2, h3, h4, article, label, span, div",
    ) || el;
  let text = (block?.textContent || "").replace(/\s+/g, " ").trim();
  if (text.length > 120) {
    const idx = text.toLowerCase().indexOf(word.toLowerCase());
    if (idx >= 0) {
      const start = Math.max(0, idx - 40);
      const end = Math.min(text.length, idx + word.length + 40);
      text =
        (start > 0 ? "…" : "") +
        text.slice(start, end) +
        (end < text.length ? "…" : "");
    } else {
      text = `${text.slice(0, 100)}…`;
    }
  }
  return text;
}

function selectionInEditable(node: Node | null): boolean {
  if (!node) return false;
  const el =
    node.nodeType === Node.ELEMENT_NODE
      ? (node as Element)
      : node.parentElement;
  return !!el?.closest("input, textarea, select, [contenteditable='true']");
}

/** Global: select a single English word → floating「收進生詞」. */
export function WordCaptureHost() {
  const pathname = usePathname() || "/";
  const [pop, setPop] = useState<Pop | null>(null);
  const [toast, setToast] = useState("");
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPop = useCallback(() => setPop(null), []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setToast(""), 2200);
  }, []);

  const tryShowFromSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
      return;
    }
    const text = sel.toString();
    if (!parseCaptureWord(text)) {
      setPop(null);
      return;
    }
    const range = sel.getRangeAt(0);
    if (selectionInEditable(range.commonAncestorContainer)) {
      setPop(null);
      return;
    }
    const parsed = parseCaptureWord(text)!;
    const rect = range.getBoundingClientRect();
    if (!rect.width && !rect.height) {
      setPop(null);
      return;
    }
    const pad = 8;
    // Place below the selection so mobile browser menus (above) don't cover it.
    const belowGap = 28;
    const x = Math.min(
      Math.max(pad, rect.left + rect.width / 2),
      window.innerWidth - pad,
    );
    const y = Math.min(
      rect.bottom + belowGap,
      window.innerHeight - 72,
    );
    setPop({
      word: parsed.word,
      context: contextAroundSelection(range, parsed.word),
      x,
      y: Math.max(pad, y),
    });
  }, []);

  useEffect(() => {
    const onUp = () => {
      // Let the browser finish updating the selection (esp. mobile).
      window.setTimeout(tryShowFromSelection, 10);
    };
    const onScroll = () => clearPop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearPop();
    };
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchend", onUp, { passive: true });
    window.addEventListener("scroll", onScroll, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchend", onUp);
      window.removeEventListener("scroll", onScroll, true);
      document.removeEventListener("keydown", onKey);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [tryShowFromSelection, clearPop]);

  useEffect(() => {
    clearPop();
  }, [pathname, clearPop]);

  function save() {
    if (!pop) return;
    const r = addWordToBag({
      raw: pop.word,
      context: pop.context,
      sourceHref: pathname,
    });
    window.getSelection()?.removeAllRanges();
    clearPop();
    if (!r.ok) {
      showToast(r.error);
      return;
    }
    if (r.softCapReached) {
      showToast(`已收「${r.item.word}」· 未會已逾 ${WORD_BAG_SOFT_CAP}，建議先清一批`);
      return;
    }
    showToast(r.created ? `已收「${r.item.word}」` : `已更新「${r.item.word}」`);
  }

  return (
    <>
      {pop ? (
        <div
          className="fixed z-[60] -translate-x-1/2"
          style={{ left: pop.x, top: pop.y }}
        >
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={save}
            className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--ink)] shadow-md hover:border-[var(--accent)]"
          >
            收進生詞 · {pop.word}
          </button>
        </div>
      ) : null}
      {toast ? (
        <div
          className="fixed bottom-20 left-1/2 z-[60] max-w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-[var(--line)] bg-[var(--ink)] px-3 py-2 text-center text-xs text-[var(--surface)] shadow-md"
          role="status"
        >
          {toast}
        </div>
      ) : null}
    </>
  );
}
