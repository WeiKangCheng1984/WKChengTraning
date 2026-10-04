"use client";

import { useEffect, useRef } from "react";
import { addPracticeMinutes } from "@/lib/rewards";

const TICK_MS = 30_000;
const IDLE_MS = 90_000;
/** Each tick while active = 0.5 minutes */
const MINUTES_PER_TICK = 0.5;

/**
 * Counts practice time while the tab is visible and the user is not idle.
 * Mount once in the root layout.
 */
export function PracticeTracker() {
  const lastInteract = useRef(Date.now());
  const visible = useRef(true);

  useEffect(() => {
    const bump = () => {
      lastInteract.current = Date.now();
    };
    const onVis = () => {
      visible.current = document.visibilityState === "visible";
      if (visible.current) bump();
    };

    const events: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "scroll",
      "touchstart",
    ];
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    document.addEventListener("visibilitychange", onVis);

    const id = window.setInterval(() => {
      if (!visible.current) return;
      if (Date.now() - lastInteract.current > IDLE_MS) return;
      addPracticeMinutes(MINUTES_PER_TICK);
    }, TICK_MS);

    return () => {
      events.forEach((e) => window.removeEventListener(e, bump));
      document.removeEventListener("visibilitychange", onVis);
      window.clearInterval(id);
    };
  }, []);

  return null;
}
