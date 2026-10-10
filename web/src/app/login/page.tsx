"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    const supabase = createClient();
    const trimmed = email.trim();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmed,
        password,
      });
      setBusy(false);
      if (error) {
        setStatus(error.message);
        return;
      }
      router.replace("/");
      router.refresh();
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: trimmed,
      password,
    });
    setBusy(false);
    if (error) {
      setStatus(error.message);
      return;
    }
    // If email confirmation is off, session is returned immediately
    if (data.session) {
      router.replace("/");
      router.refresh();
      return;
    }
    setStatus("註冊成功。若專案有開信箱驗證，請到信箱點連結後再登入；否則可直接切回「登入」。");
    setMode("login");
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
          {mode === "login" ? "登入" : "註冊"}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          用 Email＋密碼即可；登入後會把本機學習進度同步到雲端。
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
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="密碼（至少 6 碼）"
          className="w-full rounded-sm border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />
        <button
          type="submit"
          disabled={busy}
          className="min-h-11 w-full rounded-sm bg-[var(--ink)] px-4 text-sm text-[var(--paper)] hover:bg-[var(--ink-soft)] disabled:opacity-50"
        >
          {busy ? "處理中…" : mode === "login" ? "登入" : "建立帳號"}
        </button>
      </form>

      <button
        type="button"
        disabled={busy}
        onClick={() => {
          setMode(mode === "login" ? "signup" : "login");
          setStatus("");
        }}
        className="w-full text-center text-sm text-[var(--muted)] underline-offset-2 hover:text-[var(--ink)] hover:underline"
      >
        {mode === "login" ? "還沒有帳號？註冊" : "已有帳號？登入"}
      </button>

      {status ? (
        <p className="text-sm text-[var(--muted)]">{status}</p>
      ) : null}
    </div>
  );
}
