"use client";

import { useSyncExternalStore } from "react";
import { STORAGE_PREFIX } from "./constants";

type Listener = () => void;

type Store<T> = {
  key: string;
  get: () => T;
  set: (next: T | ((prev: T) => T)) => void;
  subscribe: (l: Listener) => () => void;
};

const stores = new Map<string, Store<unknown>>();

function createStore<T>(key: string, initial: T): Store<T> {
  if (stores.has(key)) return stores.get(key) as Store<T>;

  const fullKey = `${STORAGE_PREFIX}${key}`;
  let value: T = initial;
  const listeners = new Set<Listener>();

  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(fullKey);
      if (raw) value = JSON.parse(raw) as T;
    } catch {
      // ignore
    }
    window.addEventListener("storage", (e) => {
      if (e.key !== fullKey) return;
      try {
        value = e.newValue ? (JSON.parse(e.newValue) as T) : initial;
      } catch {
        value = initial;
      }
      listeners.forEach((l) => l());
    });
  }

  const store: Store<T> = {
    key: fullKey,
    get: () => value,
    set: (next) => {
      const resolved =
        typeof next === "function" ? (next as (p: T) => T)(value) : next;
      value = resolved;
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(fullKey, JSON.stringify(resolved));
        } catch {
          // ignore
        }
      }
      listeners.forEach((l) => l());
    },
    subscribe: (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };

  stores.set(key, store as Store<unknown>);
  return store;
}

export function useStore<T>(key: string, initial: T): [T, (next: T | ((prev: T) => T)) => void] {
  const store = createStore(key, initial);
  const value = useSyncExternalStore(
    store.subscribe,
    () => store.get(),
    () => initial,
  );
  return [value, store.set];
}
