"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isAllowedEmail } from "@/lib/authAllowlist";
import { getBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    const trimmed = email.trim();

    if (!isAllowedEmail(trimmed)) {
      setBusy(false);
      setStatus("此網站僅供個人使用，無法以此帳號登入。");
      return;
    }

    const supabase = await getBrowserClient();
    if (!supabase) {
      setBusy(false);
      setStatus(
        "尚未設定 Supabase。請在 Vercel → Settings → Environment Variables 確認已儲存環境變數後再 Redeploy。",
      );
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmed,
      password,
    });
    setBusy(false);
    if (error) {
      setStatus(error.message);
      return;
    }
    if (!isAllowedEmail(data.user?.email)) {
      await supabase.auth.signOut();
      setStatus("此網站僅供個人使用，無法以此帳號登入。");
      return;
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <Link
          href="/"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← 回首頁
        </Link>
        <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          Account
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          登入
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          個人進度同步（僅限授權帳號）。公開註冊已關閉。
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-sm border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />
        <input
          type="password"
          required
          minLength={6}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="密碼"
          className="w-full rounded-sm border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />
        <button
          type="submit"
          disabled={busy}
          className="min-h-11 w-full rounded-sm bg-[var(--ink)] px-4 text-sm text-[var(--paper)] hover:bg-[var(--ink-soft)] disabled:opacity-50"
        >
          {busy ? "處理中…" : "登入"}
        </button>
      </form>

      {status ? (
        <p className="text-sm text-[var(--muted)]">{status}</p>
      ) : null}
    </div>
  );
}
