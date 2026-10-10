import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

let cached: SupabaseClient | null | undefined;
let loading: Promise<SupabaseClient | null> | null = null;

function fromEnvPair(url: string, key: string): SupabaseClient {
  return createBrowserClient(url, key);
}

/** Sync create — works when NEXT_PUBLIC_* were inlined at build time. */
export function createClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const env = getSupabasePublicEnv();
  if (env) {
    cached = fromEnvPair(env.url, env.key);
    return cached;
  }
  return null;
}

/** Prefer this in browser UI — also loads from /api/supabase-public at runtime. */
export async function getBrowserClient(): Promise<SupabaseClient | null> {
  const sync = createClient();
  if (sync) return sync;
  if (typeof window === "undefined") return null;
  if (loading) return loading;

  loading = (async () => {
    try {
      const res = await fetch("/api/supabase-public", { cache: "no-store" });
      if (!res.ok) {
        cached = null;
        return null;
      }
      const data = (await res.json()) as {
        ok?: boolean;
        url?: string;
        key?: string;
      };
      if (!data.ok || !data.url || !data.key) {
        cached = null;
        return null;
      }
      cached = fromEnvPair(data.url, data.key);
      return cached;
    } catch {
      cached = null;
      return null;
    } finally {
      loading = null;
    }
  })();

  return loading;
}
