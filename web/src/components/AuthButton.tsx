"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { isAllowedEmail } from "@/lib/authAllowlist";
import { getBrowserClient } from "@/lib/supabase/client";
import { syncProgressBidirectional } from "@/lib/progressSync";

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [syncMsg, setSyncMsg] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    void (async () => {
      const supabase = await getBrowserClient();
      if (!supabase) {
        setReady(true);
        return;
      }

      async function acceptUser(next: User | null) {
        if (next && !isAllowedEmail(next.email)) {
          await supabase!.auth.signOut();
          setUser(null);
          return;
        }
        setUser(next);
      }

      const { data } = await supabase.auth.getUser();
      await acceptUser(data.user);
      setReady(true);
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        void acceptUser(session?.user ?? null);
      });
      unsubscribe = () => subscription.unsubscribe();
    })();
    return () => unsubscribe?.();
  }, []);

  async function sync() {
    setSyncMsg("同步中…");
    const r = await syncProgressBidirectional();
    setSyncMsg(r.ok ? "已同步" : r.error || "失敗");
    setTimeout(() => setSyncMsg(""), 2500);
  }

  async function signOut() {
    const supabase = await getBrowserClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  }

  if (!ready) return null;

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/25 px-3 text-sm text-white/95 hover:bg-white/10"
      >
        登入
      </Link>
    );
  }

  const label = user.email?.split("@")[0] || "已登入";

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={sync}
        title="同步學習進度到雲端"
        className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/25 px-2 text-xs text-white/95 hover:bg-white/10 sm:px-3 sm:text-sm"
      >
        {syncMsg || "同步"}
      </button>
      <button
        type="button"
        onClick={signOut}
        title={user.email || "登出"}
        className="inline-flex min-h-10 max-w-24 items-center justify-center truncate rounded-lg border border-white/25 px-2 text-xs text-white/95 hover:bg-white/10 sm:max-w-32 sm:px-3 sm:text-sm"
      >
        {label}
      </button>
    </div>
  );
}
