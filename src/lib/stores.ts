"use client";

import { useStore } from "./storage";
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

export function useRationale() {
  const [items, setItems] = useStore<RationaleItem[]>("rationale", RATIONALE_SEED);

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
  const [items, setItems] = useStore<Meeting[]>("meetings", MEETINGS_SEED);

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
  const [items, setItems] = useStore<Property[]>("properties", PROPERTIES_SEED);

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
  const [items, setItems] = useStore<Discussion[]>("discussions", DISCUSSIONS_SEED);

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
