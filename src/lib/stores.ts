"use client";

import { useSeededList, useStore } from "./storage";
import {
  CHURCH_STATUS_SEED,
  DISCUSSIONS_SEED,
  MEETINGS_SEED,
  PROPERTIES_SEED,
  RATIONALE_SEED,
} from "./seeds";
import type {
  ChurchStatus,
  Discussion,
  Meeting,
  Property,
  RationaleItem,
} from "./types";

export const SEED_VERSIONS = {
  rationale: "2026-04-18",
  meetings: "2026-04-18",
  properties: "2026-04-18-v2",
  discussions: "2026-04-18",
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

export function useMeetings() {
  const [items, setItems] = useSeededList<Meeting>(
    "meetings",
    MEETINGS_SEED,
    SEED_VERSIONS.meetings,
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
    const photos = p.photos && p.photos.length > 0 ? p.photos : chukbokSeed.photos;
    const financingNotes = p.financingNotes && p.financingNotes.length > 0
      ? p.financingNotes
      : chukbokSeed.financingNotes;
    if (missingDD.length === 0 && photos === p.photos && financingNotes === p.financingNotes) {
      return p;
    }
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

export function useChurchStatus() {
  const [status, setStatus] = useStore<ChurchStatus>(
    "church-status",
    CHURCH_STATUS_SEED,
  );

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
