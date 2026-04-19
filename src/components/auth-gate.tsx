"use client";

import { useEffect, useState } from "react";
import { Lock, SignIn } from "@phosphor-icons/react";

type Phase = "checking" | "needs-auth" | "authed";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("checking");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth", { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as { authed: boolean };
        if (cancelled) return;
        setPhase(json.authed ? "authed" : "needs-auth");
      } catch {
        if (!cancelled) setPhase("needs-auth");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
        cache: "no-store",
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(json.error ?? "인증 실패");
        return;
      }
      setPassword("");
      setPhase("authed");
    } catch (err) {
      console.error("[auth submit]", err);
      setError("네트워크 오류");
    } finally {
      setSubmitting(false);
    }
  }

  if (phase === "authed") return <>{children}</>;

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur">
        <div className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
          <Lock size={16} className="text-primary" />
          <span>예배당 이전 준비위원회 대시보드</span>
        </div>
        <h1 className="mb-1 text-lg font-semibold text-foreground">
          비밀번호를 입력해 주세요
        </h1>
        <p className="mb-5 text-xs text-muted-foreground">
          이 페이지는 위원회 내부 공유용입니다.
        </p>
        {phase === "checking" ? (
          <div className="flex items-center justify-center py-8 text-xs text-muted-foreground">
            확인 중…
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <input
              type="password"
              inputMode="numeric"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              autoComplete="current-password"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {error && (
              <div className="text-xs text-destructive">{error}</div>
            )}
            <button
              type="submit"
              disabled={submitting || password.length === 0}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <SignIn size={14} />
              {submitting ? "확인 중…" : "입장"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
