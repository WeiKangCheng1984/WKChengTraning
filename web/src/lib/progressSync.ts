import { isAllowedEmail } from "@/lib/authAllowlist";
import { getBrowserClient } from "@/lib/supabase/client";
import { PROGRESS_KEYS } from "@/lib/progressKeys";
import { STORAGE_EVENT } from "@/lib/persist";

type CloudRow = {
  key: string;
  payload: unknown;
  updated_at: string;
};

function readLocalRaw(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function readLocal(key: string): unknown | null {
  const raw = readLocalRaw(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function writeLocal(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** Local meta: when this key was last written (ISO). */
function metaKey(key: string) {
  return `${key}__updated_at`;
}

function localUpdatedAt(key: string): string | null {
  return localStorage.getItem(metaKey(key));
}

function touchLocalMeta(key: string, iso?: string) {
  localStorage.setItem(metaKey(key), iso || new Date().toISOString());
}

function asTime(iso: string | null | undefined): number {
  if (!iso) return 0;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : 0;
}

/** Pull/push with last-write-wins per key. */
export async function syncProgressBidirectional(): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const supabase = await getBrowserClient();
    if (!supabase) {
      return { ok: false, error: "尚未設定 Supabase 環境變數" };
    }
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) {
      return { ok: false, error: "未登入" };
    }
    if (!isAllowedEmail(user.email)) {
      await supabase.auth.signOut();
      return { ok: false, error: "未授權帳號" };
    }

    const { data: rows, error } = await supabase
      .from("progress_snapshots")
      .select("key, payload, updated_at")
      .eq("user_id", user.id);

    if (error) {
      return { ok: false, error: error.message };
    }

    const cloud = new Map<string, CloudRow>(
      (rows || []).map((r) => [
        r.key as string,
        {
          key: r.key as string,
          payload: r.payload,
          updated_at: (r.updated_at as string) || "",
        },
      ]),
    );

    const upserts: Array<{
      user_id: string;
      key: string;
      payload: unknown;
      updated_at: string;
    }> = [];

    for (const key of PROGRESS_KEYS) {
      const local = readLocal(key);
      const remote = cloud.get(key);
      const localAt = asTime(localUpdatedAt(key));
      const remoteAt = asTime(remote?.updated_at);

      if (local == null && remote != null) {
        writeLocal(key, remote.payload);
        touchLocalMeta(key, remote.updated_at);
        continue;
      }
      if (local != null && remote == null) {
        const updated_at = localUpdatedAt(key) || new Date().toISOString();
        upserts.push({
          user_id: user.id,
          key,
          payload: local,
          updated_at,
        });
        continue;
      }
      if (local != null && remote != null) {
        if (remoteAt > localAt) {
          writeLocal(key, remote.payload);
          touchLocalMeta(key, remote.updated_at);
        } else {
          const updated_at =
            localUpdatedAt(key) || new Date().toISOString();
          upserts.push({
            user_id: user.id,
            key,
            payload: local,
            updated_at,
          });
        }
      }
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

export async function pushProgressKey(key: string): Promise<void> {
  if (!PROGRESS_KEYS.includes(key as (typeof PROGRESS_KEYS)[number])) return;
  const payload = readLocal(key);
  if (payload == null) return;

  const updated_at = new Date().toISOString();
  touchLocalMeta(key, updated_at);

  const supabase = await getBrowserClient();
  if (!supabase) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAllowedEmail(user.email)) return;

  await supabase.from("progress_snapshots").upsert(
    {
      user_id: user.id,
      key,
      payload,
      updated_at,
    },
    { onConflict: "user_id,key" },
  );
}

/** Call after local writes so LWW has a timestamp. */
export function markProgressTouched(key: string) {
  touchLocalMeta(key);
}
