import { createClient } from "@/lib/supabase/client";
import { PROGRESS_KEYS } from "@/lib/progressKeys";
import { STORAGE_EVENT } from "@/lib/persist";

function readLocal(key: string): unknown | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function writeLocal(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** Pull cloud → merge into local → push full local snapshot. */
export async function syncProgressBidirectional(): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) {
      return { ok: false, error: "未登入" };
    }

    const { data: rows, error } = await supabase
      .from("progress_snapshots")
      .select("key, payload, updated_at")
      .eq("user_id", user.id);

    if (error) {
      return { ok: false, error: error.message };
    }

    const cloud = new Map(
      (rows || []).map((r) => [r.key as string, r.payload as unknown]),
    );

    // Cloud fills empty local keys; local keeps existing when both present
    for (const key of PROGRESS_KEYS) {
      const local = readLocal(key);
      const remote = cloud.get(key);
      if (local == null && remote != null) {
        writeLocal(key, remote);
      }
    }

    // Upload all local keys that have data
    const upserts: Array<{
      user_id: string;
      key: string;
      payload: unknown;
      updated_at: string;
    }> = [];
    for (const key of PROGRESS_KEYS) {
      const payload = readLocal(key);
      if (payload == null) continue;
      upserts.push({
        user_id: user.id,
        key,
        payload,
        updated_at: new Date().toISOString(),
      });
    }

    if (upserts.length) {
      const { error: upErr } = await supabase
        .from("progress_snapshots")
        .upsert(upserts, { onConflict: "user_id,key" });
      if (upErr) return { ok: false, error: upErr.message };
    }

    window.dispatchEvent(new Event(STORAGE_EVENT));
    window.dispatchEvent(new Event("omnilearn-mastery"));
    window.dispatchEvent(new Event("omnilearn-quiz"));
    window.dispatchEvent(new Event("omnilearn-oral"));
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "同步失敗",
    };
  }
}

/** Push a single key after local write (debounced by caller). */
export async function pushProgressKey(key: string): Promise<void> {
  if (!PROGRESS_KEYS.includes(key as (typeof PROGRESS_KEYS)[number])) return;
  const payload = readLocal(key);
  if (payload == null) return;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("progress_snapshots").upsert(
    {
      user_id: user.id,
      key,
      payload,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,key" },
  );
}
