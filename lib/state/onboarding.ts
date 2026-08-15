"use client";

import { useCallback, useSyncExternalStore } from "react";

export interface OnboardingDraft {
  relationship: string;
  yourName: string;
  theirName: string;
}

const KEY = "then-and-now:onboarding";

const EMPTY: OnboardingDraft = {
  relationship: "Grandma",
  yourName: "",
  theirName: "",
};

/**
 * Three short screens share one draft.
 *
 * Session storage is the source of truth rather than React state, so a refresh
 * part-way through onboarding does not lose the two things we asked for. It is
 * read through useSyncExternalStore, which is what that hook is for — an effect
 * that copies storage into state would just cause a second render.
 */

let cached: OnboardingDraft = EMPTY;
let cachedRaw: string | null = null;
const listeners = new Set<() => void>();

function read(): OnboardingDraft {
  let raw: string | null = null;
  try {
    raw = window.sessionStorage.getItem(KEY);
  } catch {
    /* Storage blocked — the defaults still let onboarding finish. */
  }
  /* Re-parsing on every read would return a new object and loop the store. */
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cached = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
    } catch {
      cached = EMPTY;
    }
  }
  return cached;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useOnboardingDraft() {
  const draft = useSyncExternalStore(subscribe, read, () => EMPTY);

  const update = useCallback((patch: Partial<OnboardingDraft>) => {
    const next = { ...read(), ...patch };
    try {
      window.sessionStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* Fall back to memory only. */
    }
    cachedRaw = JSON.stringify(next);
    cached = next;
    listeners.forEach((listener) => listener());
  }, []);

  return [draft, update] as const;
}
