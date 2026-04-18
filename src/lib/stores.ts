"use client";

import { useSeededList, useStore } from "./storage";
import {
  DISCUSSIONS_SEED,
  MEETINGS_SEED,
  PROPERTIES_SEED,
  RATIONALE_SEED,
} from "./seeds";
import type {
  Discussion,
  Meeting,
  Property,
  RationaleItem,
} from "./types";

export const SEED_VERSIONS = {
  rationale: "2026-04-18",
  meetings: "2026-04-18",
  properties: "2026-04-18",
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

export function useProperties() {
  const [items, setItems] = useSeededList<Property>(
    "properties",
    PROPERTIES_SEED,
    SEED_VERSIONS.properties,
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

export { useStore };
