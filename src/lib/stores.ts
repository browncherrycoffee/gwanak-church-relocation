"use client";

import { useEffect } from "react";
import { useSeededList, useStore } from "./storage";
import {
  CHURCH_STATUS_SEED,
  DISCUSSIONS_SEED,
  MEETINGS_SEED,
  PASTORAL_NOTES_SEED,
  PROPERTIES_SEED,
  RATIONALE_SEED,
} from "./seeds";
import type {
  ChurchStatus,
  Discussion,
  Meeting,
  PastoralNote,
  Property,
  RationaleItem,
} from "./types";

export const SEED_VERSIONS = {
  rationale: "2026-04-18",
  meetings: "2026-04-19-first-meeting-full-log",
  properties: "2026-04-19-chukbok-photos",
  discussions: "2026-04-18",
  pastoralNotes: "2026-04-19-verbatim",
} as const;

export function useRationale() {
  const [items, setItems] = useSeededList<RationaleItem>(
    "rationale",
    RATIONALE_SEED,
    SEED_VERSIONS.rationale,
  );

  const update = (id: string, patch: Partial<RationaleItem>) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...patch, updatedAt: new Date().toISOString() }
          : item,
      ),
    );

  const resetSeed = () => setItems(RATIONALE_SEED);

  return { items, setItems, update, resetSeed };
}

const FIRST_MEETING_FULL_LOG_MARKER = "차승회 장로의 예배당 이전 준비위원들을 소집";

const migrateMeetings = (items: Meeting[]): Meeting[] =>
  items.map((m) => {
    if (m.id !== "meeting-2026-04-18-first") return m;
    const seed = MEETINGS_SEED.find((x) => x.id === m.id);
    if (!seed) return m;
    const next: Meeting = { ...m };
    if (next.notes.includes("김재윤 교수님 목회적 권면")) {
      next.notes = "";
    }
    if (!next.discussion.includes(FIRST_MEETING_FULL_LOG_MARKER)) {
      next.discussion = seed.discussion;
      next.decisions = seed.decisions;
      next.actions = seed.actions;
    }
    return next;
  });

export function useMeetings() {
  const [items, setItems] = useSeededList<Meeting>(
    "meetings",
    MEETINGS_SEED,
    SEED_VERSIONS.meetings,
    migrateMeetings,
  );

  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date));

  const get = (id: string) => items.find((m) => m.id === id);

  const upsert = (m: Meeting) =>
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.id === m.id);
      if (idx === -1) return [...prev, m];
      const next = [...prev];
      next[idx] = m;
      return next;
    });

  const remove = (id: string) =>
    setItems((prev) => prev.filter((m) => m.id !== id));

  return { items: sorted, raw: items, setItems, get, upsert, remove };
}

const migrateProperties = (items: Property[]): Property[] => {
  const chukbokSeed = PROPERTIES_SEED.find((p) => p.id === "property-chukbok");
  if (!chukbokSeed) return items;
  return items.map((p) => {
    if (p.id !== "property-chukbok") return p;
    const existingDDIds = new Set(p.dueDiligence.map((d) => d.id));
    const missingDD = chukbokSeed.dueDiligence.filter(
      (d) => !existingDDIds.has(d.id),
    );
    const photos = chukbokSeed.photos;
    const financingNotes = p.financingNotes && p.financingNotes.length > 0
      ? p.financingNotes
      : chukbokSeed.financingNotes;
    return {
      ...p,
      photos,
      financingNotes,
      dueDiligence: [...p.dueDiligence, ...missingDD],
    };
  });
};

export function useProperties() {
  const [items, setItems] = useSeededList<Property>(
    "properties",
    PROPERTIES_SEED,
    SEED_VERSIONS.properties,
    migrateProperties,
  );

  const get = (id: string) => items.find((p) => p.id === id);

  const upsert = (p: Property) =>
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.id === p.id);
      if (idx === -1) return [...prev, p];
      const next = [...prev];
      next[idx] = p;
      return next;
    });

  const remove = (id: string) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  return { items, setItems, get, upsert, remove };
}

export function useDiscussions() {
  const [items, setItems] = useSeededList<Discussion>(
    "discussions",
    DISCUSSIONS_SEED,
    SEED_VERSIONS.discussions,
  );

  const get = (id: string) => items.find((d) => d.id === id);

  const upsert = (d: Discussion) =>
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.id === d.id);
      if (idx === -1) return [...prev, d];
      const next = [...prev];
      next[idx] = d;
      return next;
    });

  const remove = (id: string) =>
    setItems((prev) => prev.filter((d) => d.id !== id));

  return { items, setItems, get, upsert, remove };
}

const migratePastoralNotes = (items: PastoralNote[]): PastoralNote[] =>
  items.map((n) => {
    const seed = PASTORAL_NOTES_SEED.find((s) => s.id === n.id);
    if (!seed) return n;
    if (n.content === seed.content) return n;
    return { ...n, content: seed.content, context: seed.context };
  });

export function usePastoralNotes() {
  const [items, setItems] = useSeededList<PastoralNote>(
    "pastoral-notes",
    PASTORAL_NOTES_SEED,
    SEED_VERSIONS.pastoralNotes,
    migratePastoralNotes,
  );

  const get = (id: string) => items.find((p) => p.id === id);

  const upsert = (note: PastoralNote) =>
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.id === note.id);
      if (idx === -1) return [...prev, note];
      const next = [...prev];
      next[idx] = note;
      return next;
    });

  const update = (id: string, patch: Partial<PastoralNote>) =>
    setItems((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, ...patch, updatedAt: new Date().toISOString() }
          : n,
      ),
    );

  const remove = (id: string) =>
    setItems((prev) => prev.filter((n) => n.id !== id));

  const sorted = [...items].sort((a, b) =>
    b.receivedAt.localeCompare(a.receivedAt),
  );

  return { items: sorted, raw: items, setItems, get, upsert, update, remove };
}

const CHURCH_STATUS_VERSION = "2026-04-19-residential-db-exact";

export function useChurchStatus() {
  const [status, setStatus] = useStore<ChurchStatus>(
    "church-status",
    CHURCH_STATUS_SEED,
  );
  const [storedVersion, setStoredVersion] = useStore<string>(
    "church-status::version",
    "v0",
  );

  useEffect(() => {
    if (storedVersion === CHURCH_STATUS_VERSION) return;
    setStoredVersion(CHURCH_STATUS_VERSION);
    setStatus((prev) => {
      const next: ChurchStatus = { ...prev };
      const seed = CHURCH_STATUS_SEED as unknown as Record<string, unknown>;
      const prevRec = prev as unknown as Record<string, unknown>;
      const nextRec = next as unknown as Record<string, unknown>;

      for (const key of Object.keys(seed)) {
        if (key === "updatedAt" || key === "residentialBreakdown") continue;
        const seedVal = seed[key];
        const prevVal = prevRec[key];
        if (typeof seedVal === "number" && prevVal === 0) {
          nextRec[key] = seedVal;
        } else if (typeof seedVal === "string" && !prevVal) {
          nextRec[key] = seedVal;
        }
      }

      next.residentialBreakdown = [...CHURCH_STATUS_SEED.residentialBreakdown];
      return next;
    });
  }, [storedVersion, setStatus, setStoredVersion]);

  const patch = (p: Partial<ChurchStatus>) =>
    setStatus((prev) => ({
      ...prev,
      ...p,
      updatedAt: new Date().toISOString(),
    }));

  const reset = () => setStatus(CHURCH_STATUS_SEED);

  return { status, setStatus, patch, reset };
}

export { useStore };
