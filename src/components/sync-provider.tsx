"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowClockwise, CloudCheck, CloudX, WarningCircle } from "@phosphor-icons/react";
import {
  applyCloudState,
  onLocalChange,
  snapshotCloudState,
} from "@/lib/storage";

type SyncStatus = "idle" | "syncing" | "error";

const POLL_INTERVAL_MS = 5000;
const PUSH_DEBOUNCE_MS = 600;

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SyncStatus>("syncing");
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);

  const lastSeenVersion = useRef(-1);
  const dirty = useRef(false);
  const pushing = useRef(false);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialPullDone = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function pull() {
      if (pushing.current || dirty.current) return;
      try {
        const res = await fetch("/api/state", { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const state = (await res.json()) as {
          version: number;
          updatedAt: string;
          data: Record<string, unknown>;
        };
        if (cancelled) return;
        if (state.version === lastSeenVersion.current) {
          if (!initialPullDone.current) {
            initialPullDone.current = true;
            setStatus("idle");
            setLastSyncAt(new Date().toISOString());
          }
          return;
        }
        lastSeenVersion.current = state.version;
        if (state.version > 0 && Object.keys(state.data).length > 0) {
          applyCloudState(state.data);
        }
        initialPullDone.current = true;
        setStatus("idle");
        setLastSyncAt(new Date().toISOString());
      } catch (err) {
        console.error("[sync pull]", err);
        if (!cancelled) setStatus("error");
      }
    }

    void pull();
    const id = setInterval(pull, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    async function push() {
      if (pushing.current) return;
      pushing.current = true;
      setStatus("syncing");
      try {
        const data = snapshotCloudState();
        const res = await fetch("/api/state", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ data }),
        });
        if (!res.ok) throw new Error(String(res.status));
        const state = (await res.json()) as {
          version: number;
          updatedAt: string;
        };
        lastSeenVersion.current = state.version;
        dirty.current = false;
        setStatus("idle");
        setLastSyncAt(new Date().toISOString());
      } catch (err) {
        console.error("[sync push]", err);
        setStatus("error");
      } finally {
        pushing.current = false;
      }
    }

    const unsub = onLocalChange(() => {
      if (!initialPullDone.current) return;
      dirty.current = true;
      setStatus("syncing");
      if (pushTimer.current) clearTimeout(pushTimer.current);
      pushTimer.current = setTimeout(() => {
        void push();
      }, PUSH_DEBOUNCE_MS);
    });

    return () => {
      unsub();
      if (pushTimer.current) clearTimeout(pushTimer.current);
    };
  }, []);

  return (
    <>
      {children}
      <SyncIndicator status={status} lastSyncAt={lastSyncAt} />
    </>
  );
}

function SyncIndicator({
  status,
  lastSyncAt,
}: {
  status: SyncStatus;
  lastSyncAt: string | null;
}) {
  const label = (() => {
    if (status === "syncing") return "동기화 중…";
    if (status === "error") return "동기화 오류 — 재시도 중";
    if (lastSyncAt) {
      const d = new Date(lastSyncAt);
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      return `모든 기기와 동기화됨 · ${hh}:${mm}`;
    }
    return "동기화 대기";
  })();

  return (
    <div
      className="pointer-events-none fixed bottom-3 right-3 z-50 flex items-center gap-1.5 rounded-full border border-border/70 bg-background/90 px-3 py-1.5 text-[11px] text-muted-foreground shadow-sm backdrop-blur"
      role="status"
      aria-live="polite"
    >
      {status === "syncing" && (
        <ArrowClockwise size={12} className="animate-spin text-primary" />
      )}
      {status === "idle" && <CloudCheck size={12} className="text-primary" />}
      {status === "error" && (
        <>
          <WarningCircle size={12} className="text-destructive" />
          <CloudX size={12} className="text-destructive" />
        </>
      )}
      <span>{label}</span>
    </div>
  );
}
