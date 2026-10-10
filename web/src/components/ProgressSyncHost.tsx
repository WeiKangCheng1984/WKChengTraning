"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { PROGRESS_KEYS } from "@/lib/progressKeys";
import {
  pushProgressKey,
  syncProgressBidirectional,
} from "@/lib/progressSync";
import { STORAGE_EVENT } from "@/lib/persist";

/** On login: full sync. On localStorage write: debounce push changed keys. */
export function ProgressSyncHost() {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loggedIn = useRef(false);

  useEffect(() => {
    const supabase = createClient();

    async function onAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      loggedIn.current = !!user;
      if (user) {
        await syncProgressBidirectional();
      }
    }

    onAuth();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        loggedIn.current = true;
        void syncProgressBidirectional();
      }
      if (event === "SIGNED_OUT") {
        loggedIn.current = false;
      }
    });

    function schedulePush(key: string | null) {
      if (!loggedIn.current) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        if (key && PROGRESS_KEYS.includes(key as (typeof PROGRESS_KEYS)[number])) {
          void pushProgressKey(key);
          return;
        }
        for (const k of PROGRESS_KEYS) {
          void pushProgressKey(k);
        }
      }, 800);
    }

    function onStorage(e: StorageEvent) {
      schedulePush(e.key);
    }
    function onLocalWrite() {
      schedulePush(null);
    }
    function onKey(e: Event) {
      const detail = (e as CustomEvent<{ key?: string }>).detail;
      schedulePush(detail?.key ?? null);
    }

    function onMastery() {
      schedulePush("omnilearn-mastery-v1");
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener(STORAGE_EVENT, onLocalWrite);
    window.addEventListener("omnilearn-progress-key", onKey);
    window.addEventListener("omnilearn-mastery", onMastery);
    window.addEventListener("omnilearn-quiz", () =>
      schedulePush("omnilearn-quiz-progress-v1"),
    );
    window.addEventListener("omnilearn-oral", () =>
      schedulePush("omnilearn-oral-progress-v1"),
    );

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(STORAGE_EVENT, onLocalWrite);
      window.removeEventListener("omnilearn-progress-key", onKey);
      window.removeEventListener("omnilearn-mastery", onMastery);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return null;
}
