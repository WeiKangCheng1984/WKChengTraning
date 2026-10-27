"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { PatternTemplates } from "@/lib/patternLoop";
import {
  buildSessionFromPacks,
  listReflexPacks,
  packsMatchingRandom10,
  readReflexSession,
  writeReflexSession,
  type ReflexPack,
  type ReflexSession,
} from "@/lib/patternReflex";

export function PatternReflexClient({ data: _data }: { data: PatternTemplates }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const allPacks = useMemo(() => listReflexPacks(), []);
  const [session, setSession] = useState<ReflexSession | null>(null);
  const [randomPacks, setRandomPacks] = useState<ReflexPack[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSession(readReflexSession());
    setRandomPacks(packsMatchingRandom10(_data));
    const pick = searchParams.get("pick");
    if (pick) {
      const ids = pick.split(",").map((s) => s.trim()).filter(Boolean);
      const valid = ids.filter((id) => allPacks.some((p) => p.id === id));
      if (valid.length) {
        const built = buildSessionFromPacks(valid);
        writeReflexSession(built);
        setSession(built);
        setSelected(new Set(valid));
        if (searchParams.get("autoplay") === "1") {
          router.replace("/english/patterns/reflex/play");
        }
      }
    }
  }, [_data, searchParams, allPacks, router]);

  function togglePack(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function startWithPackIds(ids: string[]) {
    const built = buildSessionFromPacks(ids);
    writeReflexSession(built);
    setSession(built);
  }

  function startSelected() {
    if (!selected.size) return;
    startWithPackIds([...selected]);
  }

  function startRandomMatched() {
    const ids = randomPacks.map((p) => p.id);
    if (!ids.length) return;
    startWithPackIds(ids);
  }

  return (
    <div className="space-y-6">
      {randomPacks.length ? (
        <div className="rounded-sm border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-3">
          <p className="text-sm text-[var(--ink)]">
            十句型清單中有 {randomPacks.length} 組可練問答
          </p>
          <button
            type="button"
            onClick={startRandomMatched}
            className="mt-2 rounded-sm bg-[var(--ink)] px-4 py-2 text-sm text-[var(--paper)]"
          >
            用十句型相關包開始
          </button>
        </div>
      ) : (
        <p className="text-sm text-[var(--muted)]">
          建立{" "}
          <Link href="/english/patterns/random" className="text-[var(--accent)]">
            十句型清單
          </Link>{" "}
          後，可自動篩選對應問答包。
        </p>
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium text-[var(--ink)]">選問答包（可複選）</p>
        <ul className="space-y-2">
          {allPacks.map((p) => {
            const on = selected.has(p.id);
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => togglePack(p.id)}
                  className={`w-full rounded-sm border px-4 py-3 text-left ${
                    on
                      ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                      : "border-[var(--line)] bg-[var(--surface)]"
                  }`}
                >
                  <p className="font-medium text-[var(--ink)]">{p.titleZh}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {p.itemId} · {p.prompts.length} 題
                    {p.conversationHint ? ` · ${p.conversationHint}` : ""}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          disabled={!selected.size}
          onClick={startSelected}
          className="rounded-sm border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-sm disabled:opacity-40"
        >
          用選取的包開始
        </button>
      </div>

      {session ? (
        <div className="space-y-2 border-t border-[var(--line)] pt-4">
          <p className="text-sm text-[var(--muted)]">{session.label}</p>
          <Link
            href="/english/patterns/reflex/play"
            className="inline-flex min-h-12 items-center rounded-sm bg-[var(--ink)] px-6 text-sm text-[var(--paper)]"
          >
            進入問答反射
          </Link>
        </div>
      ) : null}

      <Link
        href="/english/conversation"
        className="block text-sm text-[var(--muted)] hover:text-[var(--ink)]"
      >
        想先讀會話公式？→ 四大類會話
      </Link>
    </div>
  );
}
